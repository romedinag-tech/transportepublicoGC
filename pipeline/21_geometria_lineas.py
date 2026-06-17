"""Geometría de las 36 líneas (todos sus recorridos) desde el GPS, para el mapa del visor."""
import os, json, collections
from google.cloud import bigquery
from config import GCP_PROJECT, GCP_LOCATION, BQ_DATASET
c = bigquery.Client(project=GCP_PROJECT, location=GCP_LOCATION)
DS = f"{GCP_PROJECT}.{BQ_DATASET}"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dashboard", "data")

rows = [dict(x) for x in c.query(f"""
WITH base AS (
  SELECT recorrido, sentido, patente, DATE(ts_local) dia, ts_local,
         ROUND(lat,5) lat, ROUND(lon,5) lon
  FROM `{DS}.tracking_historico`
  WHERE ts_local BETWEEN '2026-03-09' AND '2026-03-14'
    AND lat BETWEEN -37.1 AND -36.6 AND lon BETWEEN -73.25 AND -72.85
),
cand AS (
  SELECT recorrido, sentido, patente, dia, COUNT(*) n FROM base GROUP BY 1,2,3,4
  QUALIFY ROW_NUMBER() OVER(PARTITION BY recorrido, sentido ORDER BY COUNT(*) DESC)=1
)
SELECT b.recorrido, b.sentido, b.lat, b.lon
FROM base b JOIN cand USING(recorrido, sentido, patente, dia)
ORDER BY b.recorrido, b.sentido, b.ts_local
""").result()]

g = collections.defaultdict(list)
for r in rows:
    g[(r["recorrido"], int(r["sentido"]))].append([r["lat"], r["lon"]])

# agrupar por línea (prefijo del recorrido = nº de línea); 1 polilínea por recorrido-sentido
lineas = collections.defaultdict(list)
for (rec, sent), pts in g.items():
    if len(pts) < 8: continue
    step = max(1, len(pts)//70)
    lineas[rec[:2]].append({"rec": rec, "s": sent, "p": pts[::step]})

json.dump(lineas, open(os.path.join(OUT, "lineas_geom.json"), "w"), separators=(",", ":"))
sz = os.path.getsize(os.path.join(OUT, "lineas_geom.json"))//1024
print(f"lineas_geom.json: {len(lineas)} líneas, {sum(len(v) for v in lineas.values())} polilíneas, {sz} KB")
for ln in sorted(lineas)[:6]:
    print(f"  L{ln}: {len(lineas[ln])} recorridos-sentido")
