"""Carga limites comunales (Biobio) a BigQuery como GEOGRAPHY y calcula KPIs por comuna."""
import os, json, tempfile
from google.cloud import bigquery
from config import GCP_PROJECT, GCP_LOCATION, BQ_DATASET

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEO = os.path.join(BASE, "geo", "biobio.geojson")
OUT = os.path.join(BASE, "dashboard", "data"); os.makedirs(OUT, exist_ok=True)
c = bigquery.Client(project=GCP_PROJECT, location=GCP_LOCATION)
DS = f"{GCP_PROJECT}.{BQ_DATASET}"

# 1) leer geojson (latin-1) y armar NDJSON con geometria como string GeoJSON
d = json.load(open(GEO, encoding="latin-1"))
tmp = os.path.join(tempfile.gettempdir(), "comunas_raw.ndjson")
with open(tmp, "w", encoding="utf-8") as f:
    for ft in d["features"]:
        p = ft["properties"]
        f.write(json.dumps({
            "comuna": p.get("Comuna"), "provincia": p.get("Provincia"),
            "cod_comuna": str(p.get("cod_comuna")),
            "geojson": json.dumps(ft["geometry"])
        }, ensure_ascii=False) + "\n")
print("comunas en geojson:", len(d["features"]))

# 2) cargar staging
job = c.load_table_from_file(
    open(tmp, "rb"), f"{DS}.comunas_raw",
    job_config=bigquery.LoadJobConfig(
        source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON,
        write_disposition="WRITE_TRUNCATE",
        schema=[bigquery.SchemaField("comuna","STRING"),
                bigquery.SchemaField("provincia","STRING"),
                bigquery.SchemaField("cod_comuna","STRING"),
                bigquery.SchemaField("geojson","STRING")]))
job.result()
print("staging cargado")

# 3) tabla GEOGRAPHY valida
c.query(f"""
CREATE OR REPLACE TABLE `{DS}.comunas` AS
SELECT comuna, provincia, cod_comuna,
       ST_GEOGFROMGEOJSON(geojson, make_valid => TRUE) AS geom
FROM `{DS}.comunas_raw`
""").result()
print("tabla comunas (GEOGRAPHY) creada")

# 4) KPIs por comuna (join espacial sobre los 302M puntos)
rows = [dict(r) for r in c.query(f"""
SELECT k.comuna, k.provincia,
       COUNT(*) AS pulsos,
       APPROX_COUNT_DISTINCT(t.patente) AS buses,
       APPROX_COUNT_DISTINCT(t.recorrido) AS recorridos,
       ROUND(AVG(IF(t.velocidad BETWEEN 1 AND 80, t.velocidad, NULL)),1) AS vel_movil,
       ROUND(100*COUNTIF(t.velocidad < 2)/COUNT(*),1) AS pct_detenido
FROM `{DS}.tracking_historico` t
JOIN `{DS}.comunas` k
  ON ST_CONTAINS(k.geom, ST_GEOGPOINT(t.lon, t.lat))
GROUP BY k.comuna, k.provincia
ORDER BY pulsos DESC
""").result()]
with open(os.path.join(OUT, "comuna_stats.json"), "w", encoding="utf-8") as f:
    json.dump(rows, f, ensure_ascii=False, default=str)
print("comuna_stats.json:", len(rows), "comunas con datos")
for r in rows[:15]:
    print(f"  {r['comuna']:<22} pulsos={r['pulsos']:>12,}  buses={r['buses']:>4}  vel={r['vel_movil']}  det%={r['pct_detenido']}")
