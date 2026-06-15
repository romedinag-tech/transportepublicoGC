"""Procesa la red vial OSM: carga segmentos a BigQuery, asigna las celdas de
velocidad GPS a la calle mas cercana y calcula velocidad por corredor con nombre.
Genera roads.geojson (overlay del mapa), speed_grid.json y corredores.json.
"""
import os, json, csv, tempfile
from google.cloud import bigquery
from config import GCP_PROJECT, GCP_LOCATION, BQ_DATASET

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GEO = os.path.join(BASE, "geo"); OUT = os.path.join(BASE, "dashboard", "data")
os.makedirs(OUT, exist_ok=True)
c = bigquery.Client(project=GCP_PROJECT, location=GCP_LOCATION)
DS = f"{GCP_PROJECT}.{BQ_DATASET}"

# ---- 1) parse OSM ----
d = json.load(open(os.path.join(GEO, "roads_osm.json"), encoding="utf-8"))
ways = [e for e in d["elements"] if e.get("geometry")]
nd = os.path.join(tempfile.gettempdir(), "roads.ndjson")
feats = []
OVERLAY = {"motorway", "trunk", "primary", "secondary"}
with open(nd, "w", encoding="utf-8") as f:
    for e in ways:
        coords = [[round(p["lon"], 5), round(p["lat"], 5)] for p in e["geometry"]]
        if len(coords) < 2:
            continue
        name = e.get("tags", {}).get("name")
        hw = e.get("tags", {}).get("highway")
        geom = {"type": "LineString", "coordinates": coords}
        f.write(json.dumps({"way_id": str(e["id"]), "name": name, "highway": hw,
                            "geojson": json.dumps(geom)}, ensure_ascii=False) + "\n")
        if hw in OVERLAY:
            feats.append({"type": "Feature",
                          "properties": {"name": name or "", "hw": hw},
                          "geometry": geom})
geojson = {"type": "FeatureCollection", "features": feats}
json.dump(geojson, open(os.path.join(OUT, "roads.geojson"), "w", encoding="utf-8"),
          ensure_ascii=False)
print(f"roads.geojson: {len(feats)} vias (overlay)  | total a BQ: {len(ways)}")

# ---- 2) cargar segmentos a BQ ----
job = c.load_table_from_file(open(nd, "rb"), f"{DS}.road_segments_raw",
    job_config=bigquery.LoadJobConfig(
        source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON,
        write_disposition="WRITE_TRUNCATE",
        schema=[bigquery.SchemaField("way_id","STRING"),bigquery.SchemaField("name","STRING"),
                bigquery.SchemaField("highway","STRING"),bigquery.SchemaField("geojson","STRING")]))
job.result()
c.query(f"""CREATE OR REPLACE TABLE `{DS}.road_segments` AS
  SELECT way_id, name, highway, ST_GEOGFROMGEOJSON(geojson, make_valid=>TRUE) geom
  FROM `{DS}.road_segments_raw`""").result()
print("road_segments cargado")

# ---- 3) cargar grilla de velocidad a BQ ----
import io
raw = open(os.path.join(GEO, "speed_grid.csv"), "rb").read()
if raw[:2] == b"\xff\xfe": text = raw.decode("utf-16")
elif raw[:3] == b"\xef\xbb\xbf": text = raw.decode("utf-8-sig")
else: text = raw.decode("utf-8")
grid = []
for r in csv.DictReader(io.StringIO(text)):
    if r.get("vel"):
        grid.append({"la":float(r["la"]),"lo":float(r["lo"]),"vel":float(r["vel"]),"n":int(r["n"])})
json.dump(grid, open(os.path.join(OUT,"speed_grid.json"),"w"), separators=(",",":"))
print("speed_grid.json:", len(grid), "celdas")
ndg = os.path.join(tempfile.gettempdir(), "grid.ndjson")
with open(ndg,"w") as f:
    for g in grid: f.write(json.dumps(g)+"\n")
c.load_table_from_file(open(ndg,"rb"), f"{DS}.speed_grid",
    job_config=bigquery.LoadJobConfig(source_format=bigquery.SourceFormat.NEWLINE_DELIMITED_JSON,
        write_disposition="WRITE_TRUNCATE",
        schema=[bigquery.SchemaField("la","FLOAT"),bigquery.SchemaField("lo","FLOAT"),
                bigquery.SchemaField("vel","FLOAT"),bigquery.SchemaField("n","INTEGER")])).result()

# ---- 4) asignar cada celda a la calle mas cercana (<=45m) y agregar por corredor ----
corr = [dict(r) for r in c.query(f"""
WITH g AS (SELECT CONCAT(CAST(la AS STRING),'_',CAST(lo AS STRING)) cid, vel,n, ST_GEOGPOINT(lo,la) pt FROM `{DS}.speed_grid`),
near AS (
  SELECT g.cid, g.vel, g.n, r.name, r.highway,
         ROW_NUMBER() OVER(PARTITION BY g.cid ORDER BY ST_DISTANCE(g.pt,r.geom)) rn
  FROM g JOIN `{DS}.road_segments` r
    ON ST_DWITHIN(g.pt, r.geom, 45)
)
SELECT name AS corredor, ANY_VALUE(highway) tipo,
       ROUND(SUM(vel*n)/SUM(n),1) vel_kmh, SUM(n) pulsos, COUNT(*) tramos
FROM near WHERE rn=1 AND name IS NOT NULL
GROUP BY name HAVING SUM(n) > 150000
ORDER BY vel_kmh ASC
""").result()]
json.dump(corr, open(os.path.join(OUT,"corredores.json"),"w",encoding="utf-8"), ensure_ascii=False, default=str)
print("corredores.json:", len(corr), "corredores con nombre")
print("\n== 12 corredores mas lentos ==")
for r in corr[:12]:
    print(f"  {r['corredor'][:38]:<38} {r['vel_kmh']:>5} km/h  ({int(r['pulsos']):,} pulsos)")
print("\n== 6 mas rapidos ==")
for r in corr[-6:]:
    print(f"  {r['corredor'][:38]:<38} {r['vel_kmh']:>5} km/h")
