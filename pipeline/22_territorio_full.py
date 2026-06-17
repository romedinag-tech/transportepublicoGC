"""Combina el histórico congelado (kpi_territorio) con lo acumulado en vivo
(gtfs_rt_vehicles, agregado al mismo grano) y regenera territorio.json.
El job semanal en la nube hará esto y lo publicará en GCS."""
import os, json, collections, datetime
from google.cloud import bigquery
from config import GCP_PROJECT, GCP_LOCATION, BQ_DATASET
c = bigquery.Client(project=GCP_PROJECT, location=GCP_LOCATION)
DS = f"{GCP_PROJECT}.{BQ_DATASET}"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dashboard", "data")

# 1) agregar lo acumulado en vivo al MISMO grano que kpi_territorio (línea = prefijo del trip)
print("Agregando datos en vivo (gtfs_rt_vehicles)...")
c.query(f"""
CREATE OR REPLACE TABLE `{DS}.kpi_territorio_rt` AS
WITH rt AS (
  SELECT DATETIME(snapshot_ts, 'America/Santiago') AS lt, vehicle_id, speed_kmh, lat, lon,
         SUBSTR(SPLIT(trip_id,'_')[OFFSET(0)],1,2) AS linea
  FROM `{DS}.gtfs_rt_vehicles`
  WHERE trip_id IS NOT NULL AND trip_id != '' AND lat IS NOT NULL
)
SELECT CAST(r.lt AS DATE) dia, EXTRACT(HOUR FROM r.lt) hora, EXTRACT(DAYOFWEEK FROM r.lt) dow,
       k.comuna, r.linea, e.fantasia empresa,
       APPROX_COUNT_DISTINCT(IF(r.speed_kmh>0, r.vehicle_id, NULL)) buses,
       COUNT(*) pulsos,
       AVG(IF(r.speed_kmh BETWEEN 1 AND 80, r.speed_kmh, NULL)) vel,
       COUNTIF(r.speed_kmh < 2) detenidos,
       COUNTIF(r.speed_kmh BETWEEN 1 AND 80) pulsos_movil
FROM rt r
JOIN `{DS}.comunas` k ON ST_CONTAINS(k.geom, ST_GEOGPOINT(r.lon, r.lat))
JOIN `{DS}.empresas` e ON r.linea = e.linea
GROUP BY 1,2,3,4,5,6
""").result()

rng = list(c.query(f"SELECT MIN(dia) a, MAX(dia) b, COUNT(*) n FROM `{DS}.kpi_territorio_rt`").result())[0]
print(f"  vivo agregado: {rng['n']} filas, {rng['a']} → {rng['b']}")

# 2) territorio.json desde la UNION (histórico congelado + vivo)
UNI = f"(SELECT * FROM `{DS}.kpi_territorio` UNION ALL SELECT * FROM `{DS}.kpi_territorio_rt`)"
horas = [dict(r) for r in c.query(f"""
  SELECT comuna, linea, hora,
    ROUND(SUM(buses)/NULLIF(COUNT(DISTINCT dia),0),1) buses,
    ROUND(SUM(vel*pulsos_movil)/NULLIF(SUM(pulsos_movil),0),1) vel,
    SUM(pulsos) pulsos, ROUND(100*SUM(detenidos)/NULLIF(SUM(pulsos),0),1) pct_det
  FROM {UNI} WHERE dow BETWEEN 2 AND 6
  GROUP BY GROUPING SETS ((comuna,linea,hora),(comuna,hora),(linea,hora),(hora))""").result()]
sums = [dict(r) for r in c.query(f"""
  SELECT comuna, linea, SUM(pulsos) pulsos,
    ROUND(SUM(vel*pulsos_movil)/NULLIF(SUM(pulsos_movil),0),1) vel,
    ROUND(100*SUM(detenidos)/NULLIF(SUM(pulsos),0),1) pct_det,
    COUNT(DISTINCT linea) n_lineas, COUNT(DISTINCT comuna) n_comunas
  FROM {UNI} GROUP BY GROUPING SETS ((comuna,linea),(comuna),(linea),())""").result()]
comunas = [r['comuna'] for r in c.query(f"SELECT comuna, SUM(pulsos) p FROM {UNI} GROUP BY 1 ORDER BY p DESC").result()]
lineas = [dict(r) for r in c.query(f"SELECT linea, ANY_VALUE(empresa) empresa FROM {UNI} GROUP BY 1 ORDER BY SAFE_CAST(linea AS INT64), linea").result()]

cells = collections.defaultdict(lambda: {"horas":[None]*24}); pico = collections.defaultdict(int)
for r in horas:
    key = f"{r['comuna'] or 'TODAS'}|{r['linea'] or 'TODAS'}"; h=int(r['hora'])
    cells[key]["horas"][h] = {"b": r['buses'] or 0, "v": r['vel'] or 0, "d": r['pct_det'] or 0}
    pico[key] = max(pico[key], r['buses'] or 0)
for r in sums:
    key = f"{r['comuna'] or 'TODAS'}|{r['linea'] or 'TODAS'}"
    cells[key]["kpi"] = {"pulsos":int(r['pulsos'] or 0),"vel":r['vel'],"pct_det":r['pct_det'],
                         "n_lineas":r['n_lineas'],"n_comunas":r['n_comunas'],"flota_pico":pico[key]}
out = {"comunas":comunas, "lineas":[{"linea":l['linea'],"empresa":l['empresa']} for l in lineas],
       "cells":cells, "actualizado": datetime.datetime.now(datetime.timezone.utc).isoformat(),
       "hasta": str(rng['b'])}
p = os.path.join(OUT, "territorio.json")
json.dump(out, open(p,"w",encoding="utf-8"), ensure_ascii=False, separators=(",",":"))
print(f"territorio.json: {round(os.path.getsize(p)/1024)} KB | sistema: {cells['TODAS|TODAS']['kpi']} | hasta {rng['b']}")
