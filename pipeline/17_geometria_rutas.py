"""Deriva la geometría (polilínea) de cada recorrido piloto desde el GPS:
toma un viaje representativo (patente+día con más puntos) y lo ordena por tiempo."""
import os, json, sys, collections
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "pipeline"))
from google.cloud import bigquery
from config import GCP_PROJECT, GCP_LOCATION, BQ_DATASET

BASE = os.path.dirname(os.path.abspath(__file__))
c = bigquery.Client(project=GCP_PROJECT, location=GCP_LOCATION)
DS = f"{GCP_PROJECT}.{BQ_DATASET}"
servicios = ['30MB','30NC','30QE','30RD','31DF','32EG','32JK','41CR','41QV','50SU','50YP',
             '63FH','63IG','63KP','63LB','65DQ','65ER','65FS']
recs = "', '".join(servicios)

# viaje representativo por recorrido+sentido en una ventana acotada (1 semana) para limitar costo
rows = [dict(x) for x in c.query(f"""
WITH base AS (
  SELECT recorrido, sentido, patente, DATE(ts_local) dia, ts_local, lat, lon
  FROM `{DS}.tracking_historico`
  WHERE recorrido IN ('{recs}')
    AND ts_local BETWEEN '2026-03-09' AND '2026-03-14'
    AND lat BETWEEN -37.1 AND -36.6 AND lon BETWEEN -73.25 AND -72.85
),
cand AS (
  SELECT recorrido, sentido, patente, dia, COUNT(*) n
  FROM base GROUP BY 1,2,3,4
  QUALIFY ROW_NUMBER() OVER(PARTITION BY recorrido, sentido ORDER BY COUNT(*) DESC)=1
)
SELECT b.recorrido, b.sentido, b.ts_local, ROUND(b.lat,5) lat, ROUND(b.lon,5) lon
FROM base b JOIN cand USING(recorrido, sentido, patente, dia)
ORDER BY b.recorrido, b.sentido, b.ts_local
""").result()]

# agrupar y downsamplear a ~120 puntos por (recorrido,sentido)
g = collections.defaultdict(list)
for r in rows:
    g[(r["recorrido"], int(r["sentido"]))].append([r["lat"], r["lon"]])
geom = {}
for (rec, sent), pts in g.items():
    if len(pts) < 8: continue
    step = max(1, len(pts)//120)
    poly = pts[::step]
    geom.setdefault(rec, {})[str(sent)] = poly
json.dump(geom, open(os.path.join(BASE,"perimetro_gc","rutas_geom.json"),"w"), separators=(",",":"))
print("recorridos con geometría:", len(geom))
for rec in sorted(geom):
    sents = {s:len(p) for s,p in geom[rec].items()}
    print(f"  {rec}: sentidos {sents}")
import os as _os
print("tamaño:", round(_os.path.getsize(os.path.join(BASE,'perimetro_gc','rutas_geom.json'))/1024), "KB")
