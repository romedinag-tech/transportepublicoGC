"""Tabla base comuna×línea×hora para la nueva estructura del tablero.
Join espacial (cada pulso → comuna) + join empresas (unidad → línea/empresa),
grano (dia, hora, dow, comuna, linea). Base para filtros combinables."""
from google.cloud import bigquery
from config import GCP_PROJECT, GCP_LOCATION, BQ_DATASET
c = bigquery.Client(project=GCP_PROJECT, location=GCP_LOCATION)
DS = f"{GCP_PROJECT}.{BQ_DATASET}"

print("Creando kpi_territorio (join espacial sobre 302M, puede tardar)...")
c.query(f"""
CREATE OR REPLACE TABLE `{DS}.kpi_territorio` AS
SELECT
  DATE(t.ts_local) AS dia,
  EXTRACT(HOUR FROM t.ts_local) AS hora,
  EXTRACT(DAYOFWEEK FROM t.ts_local) AS dow,
  k.comuna AS comuna,
  e.linea AS linea,
  e.fantasia AS empresa,
  APPROX_COUNT_DISTINCT(IF(t.velocidad>0, t.patente, NULL)) AS buses,
  COUNT(*) AS pulsos,
  AVG(IF(t.velocidad BETWEEN 1 AND 80, t.velocidad, NULL)) AS vel,
  COUNTIF(t.velocidad < 2) AS detenidos,
  COUNTIF(t.velocidad BETWEEN 1 AND 80) AS pulsos_movil
FROM `{DS}.tracking_historico` t
JOIN `{DS}.empresas` e ON t.unidad = e.unidad
JOIN `{DS}.comunas` k ON ST_CONTAINS(k.geom, ST_GEOGPOINT(t.lon, t.lat))
WHERE t.ts_local IS NOT NULL
GROUP BY dia, hora, dow, comuna, linea, empresa
""").result()

r = list(c.query(f"""
SELECT COUNT(*) filas, COUNT(DISTINCT comuna) comunas, COUNT(DISTINCT linea) lineas,
       COUNT(DISTINCT dia) dias
FROM `{DS}.kpi_territorio`""").result())[0]
print(f"kpi_territorio: {r['filas']:,} filas | {r['comunas']} comunas | {r['lineas']} líneas | {r['dias']} días")
print("Top comuna×línea por pulsos:")
for x in c.query(f"""
SELECT comuna, linea, empresa, ROUND(SUM(pulsos)/1e6,1) pulsos_M
FROM `{DS}.kpi_territorio` GROUP BY 1,2,3 ORDER BY pulsos_M DESC LIMIT 8""").result():
    print(f"  {x['comuna']:<20} L{x['linea']:<3} {x['empresa'][:22]:<22} {x['pulsos_M']} M")
