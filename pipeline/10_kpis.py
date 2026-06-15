"""Calcula KPIs historicos en BigQuery y los exporta como JSON para el tablero.

Estrategia eficiente: 2 tablas base agregadas (pocos scans del fact de 302M filas)
y luego consultas baratas sobre esas tablas. Exporta a dashboard/data/*.json.
"""
import os, json, datetime
from google.cloud import bigquery
from config import GCP_PROJECT, GCP_LOCATION, BQ_DATASET

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                   "dashboard", "data")
os.makedirs(OUT, exist_ok=True)
T = f"`{GCP_PROJECT}.{BQ_DATASET}.tracking_historico`"
BASE = f"`{GCP_PROJECT}.{BQ_DATASET}.kpi_base`"
FLEET = f"`{GCP_PROJECT}.{BQ_DATASET}.kpi_fleet`"

c = bigquery.Client(project=GCP_PROJECT, location=GCP_LOCATION)

def run(sql):
    return [dict(r) for r in c.query(sql).result()]

def save(name, obj):
    with open(os.path.join(OUT, name), "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, default=str)
    print("  ->", name, "(", len(obj) if isinstance(obj, list) else 1, "filas )")

print("1/3 Creando tabla base por recorrido-hora-dia (1 scan)...")
c.query(f"""
CREATE OR REPLACE TABLE {BASE} AS
SELECT
  DATE(ts_local) AS dia,
  EXTRACT(HOUR FROM ts_local) AS hora,
  FORMAT_DATE('%Y-%m', ts_local) AS mes,
  EXTRACT(DAYOFWEEK FROM ts_local) AS dow,
  recorrido,
  APPROX_COUNT_DISTINCT(IF(velocidad>0, patente, NULL)) AS buses_activos,
  COUNT(*) AS pulsos,
  AVG(IF(velocidad BETWEEN 0 AND 100, velocidad, NULL)) AS vel_media,
  AVG(IF(velocidad BETWEEN 1 AND 80, velocidad, NULL)) AS vel_movil,
  COUNTIF(velocidad BETWEEN 1 AND 80) AS pulsos_movil
FROM {T}
WHERE ts_local IS NOT NULL
GROUP BY dia, hora, mes, dow, recorrido
""").result()

print("2/3 Creando tabla base de flota total por hora-dia (1 scan)...")
c.query(f"""
CREATE OR REPLACE TABLE {FLEET} AS
SELECT
  DATE(ts_local) AS dia,
  EXTRACT(HOUR FROM ts_local) AS hora,
  FORMAT_DATE('%Y-%m', ts_local) AS mes,
  EXTRACT(DAYOFWEEK FROM ts_local) AS dow,
  APPROX_COUNT_DISTINCT(IF(velocidad>0, patente, NULL)) AS buses_activos,
  COUNT(*) AS pulsos
FROM {T}
WHERE ts_local IS NOT NULL
GROUP BY dia, hora, mes, dow
""").result()

print("3/3 Derivando KPIs y exportando JSON...")

# resumen global (1 scan ligero)
g = run(f"""
SELECT APPROX_COUNT_DISTINCT(patente) AS buses,
       COUNT(DISTINCT recorrido) AS recorridos,
       COUNT(DISTINCT unidad) AS unidades,
       MIN(ts_local) AS desde, MAX(ts_local) AS hasta
FROM {T}
""")[0]
tot = run(f"SELECT SUM(pulsos) AS pulsos, COUNT(DISTINCT dia) AS dias FROM {FLEET}")[0]
velred = run(f"""SELECT ROUND(SUM(vel_movil*pulsos_movil)/SUM(pulsos_movil),1) v
                 FROM {BASE} WHERE pulsos_movil>0""")[0]["v"]
punta = run(f"""SELECT hora, ROUND(SUM(vel_movil*pulsos_movil)/SUM(pulsos_movil),1) v
                FROM {BASE} WHERE pulsos_movil>0 AND hora BETWEEN 6 AND 22
                GROUP BY hora ORDER BY v ASC LIMIT 1""")[0]
save("resumen.json", {
    "pulsos": int(tot["pulsos"]), "buses": int(g["buses"]),
    "recorridos": int(g["recorridos"]), "unidades": int(g["unidades"]),
    "dias": int(tot["dias"]), "desde": str(g["desde"]), "hasta": str(g["hasta"]),
    "vel_red_kmh": velred, "hora_punta": int(punta["hora"]), "vel_punta_kmh": punta["v"],
    "generado": datetime.datetime.now(datetime.timezone.utc).isoformat(),
})

# flota operativa por hora (dias laborables) con banda p10-p90
save("flota_hora.json", run(f"""
SELECT hora,
  ROUND(AVG(buses_activos),1) AS prom,
  APPROX_QUANTILES(buses_activos,10)[OFFSET(1)] AS p10,
  APPROX_QUANTILES(buses_activos,10)[OFFSET(9)] AS p90
FROM {FLEET} WHERE dow BETWEEN 2 AND 6
GROUP BY hora ORDER BY hora"""))

# flota por mes x hora (heatmap, como varia a lo largo del tiempo) - laborables
save("flota_mes_hora.json", run(f"""
SELECT mes, hora, ROUND(AVG(buses_activos),1) AS prom
FROM {FLEET} WHERE dow BETWEEN 2 AND 6
GROUP BY mes, hora ORDER BY mes, hora"""))

# actividad por dia de semana x hora (heatmap)
save("dow_hora.json", run(f"""
SELECT dow, hora, ROUND(AVG(buses_activos),1) AS prom
FROM {FLEET} GROUP BY dow, hora ORDER BY dow, hora"""))

# velocidad por hora (red, ponderada)
save("vel_hora.json", run(f"""
SELECT hora,
  ROUND(SUM(vel_movil*pulsos_movil)/SUM(pulsos_movil),1) AS vel_movil,
  ROUND(SUM(vel_media*pulsos)/SUM(pulsos),1) AS vel_media
FROM {BASE} WHERE pulsos_movil>0
GROUP BY hora ORDER BY hora"""))

# evolucion mensual: pulsos, dias, flota punta, velocidad
save("mensual.json", run(f"""
WITH f AS (
  SELECT mes, SUM(pulsos) pulsos, COUNT(DISTINCT dia) dias,
    ROUND(AVG(IF(hora BETWEEN 7 AND 9 OR hora BETWEEN 17 AND 19, buses_activos, NULL)),1) flota_punta
  FROM {FLEET} WHERE dow BETWEEN 2 AND 6 GROUP BY mes),
v AS (
  SELECT mes, ROUND(SUM(vel_movil*pulsos_movil)/SUM(pulsos_movil),1) vel_movil
  FROM {BASE} WHERE pulsos_movil>0 GROUP BY mes)
SELECT f.mes, f.pulsos, f.dias, f.flota_punta, v.vel_movil
FROM f JOIN v USING(mes) ORDER BY f.mes"""))

# top recorridos por flota pico tipica + actividad + velocidad
save("top_recorridos.json", run(f"""
WITH dr AS (SELECT recorrido, dia, MAX(buses_activos) pico FROM {BASE} GROUP BY recorrido, dia),
piv AS (SELECT recorrido, ROUND(AVG(pico),1) flota_pico FROM dr GROUP BY recorrido),
act AS (SELECT recorrido, SUM(pulsos) pulsos,
          ROUND(SUM(vel_movil*pulsos_movil)/SUM(pulsos_movil),1) vel
        FROM {BASE} WHERE pulsos_movil>0 GROUP BY recorrido)
SELECT piv.recorrido, piv.flota_pico, act.pulsos, act.vel
FROM piv JOIN act USING(recorrido)
ORDER BY piv.flota_pico DESC LIMIT 20"""))

# recorridos mas lentos en punta tarde
save("lentos_punta.json", run(f"""
SELECT recorrido,
  ROUND(SUM(vel_movil*pulsos_movil)/SUM(pulsos_movil),1) AS vel,
  SUM(pulsos_movil) AS pulsos
FROM {BASE} WHERE hora IN (17,18) AND pulsos_movil>0
GROUP BY recorrido HAVING SUM(pulsos_movil)>50000
ORDER BY vel ASC LIMIT 15"""))

# frecuencia / oferta: buses operativos por hora en punta (laborables)
save("frecuencia.json", run(f"""
SELECT recorrido, ROUND(AVG(buses_activos),1) AS buses_hora_punta
FROM {BASE}
WHERE (hora BETWEEN 7 AND 9 OR hora BETWEEN 17 AND 19) AND dow BETWEEN 2 AND 6
GROUP BY recorrido ORDER BY buses_hora_punta DESC LIMIT 20"""))

# regularidad: consistencia dia-a-dia de la flota pico (punta tarde), CV menor = mas regular
save("regularidad.json", run(f"""
WITH d AS (
  SELECT recorrido, dia, MAX(buses_activos) pico
  FROM {BASE} WHERE hora IN (17,18) AND dow BETWEEN 2 AND 6
  GROUP BY recorrido, dia)
SELECT recorrido,
  ROUND(AVG(pico),1) AS flota_media,
  ROUND(STDDEV(pico),2) AS desviacion,
  ROUND(STDDEV(pico)/NULLIF(AVG(pico),0),3) AS cv
FROM d GROUP BY recorrido HAVING AVG(pico)>=4
ORDER BY cv ASC"""))

print("LISTO. JSONs en", OUT)
