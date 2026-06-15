"""Detecta puntos de mayor detencion y los etiqueta con calle (red vial) y comuna."""
import os, json
from google.cloud import bigquery
from config import GCP_PROJECT, GCP_LOCATION, BQ_DATASET

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dashboard", "data")
c = bigquery.Client(project=GCP_PROJECT, location=GCP_LOCATION)
DS = f"{GCP_PROJECT}.{BQ_DATASET}"

rows = [dict(r) for r in c.query(f"""
WITH d AS (
  SELECT ROUND(lat,4) la, ROUND(lon,4) lo, COUNT(*) det,
         APPROX_COUNT_DISTINCT(patente) buses, COUNT(DISTINCT DATE(ts_local)) dias
  FROM `{DS}.tracking_historico`
  WHERE velocidad < 2 AND lat BETWEEN -37.15 AND -36.5 AND lon BETWEEN -73.25 AND -72.8
  GROUP BY la, lo HAVING det > 80000 AND dias > 60
  ORDER BY det DESC LIMIT 80),
dp AS (SELECT *, CONCAT(CAST(la AS STRING),'_',CAST(lo AS STRING)) cid, ST_GEOGPOINT(lo,la) pt FROM d),
rd AS (
  SELECT dp.cid, r.name calle
  FROM dp JOIN `{DS}.road_segments` r ON ST_DWITHIN(dp.pt, r.geom, 70)
  QUALIFY ROW_NUMBER() OVER(PARTITION BY dp.cid ORDER BY ST_DISTANCE(dp.pt, r.geom)) = 1),
cm AS (
  SELECT dp.cid, k.comuna
  FROM dp JOIN `{DS}.comunas` k ON ST_CONTAINS(k.geom, dp.pt))
SELECT dp.la, dp.lo, dp.det, dp.buses, dp.dias, rd.calle, cm.comuna
FROM dp LEFT JOIN rd USING(cid) LEFT JOIN cm USING(cid)
ORDER BY dp.det DESC
""").result()]

# tipo heuristico: muchos buses distintos = nodo troncal/parada; pocos = terminal de empresa
for r in rows:
    r["tipo"] = "Nodo troncal / parada" if r["buses"] >= 150 else ("Terminal / cabecera" if r["buses"] <= 80 else "Parada principal")

json.dump(rows, open(os.path.join(OUT, "detenciones.json"), "w", encoding="utf-8"), ensure_ascii=False, default=str)
print("detenciones.json:", len(rows), "puntos")
for r in rows[:15]:
    print(f"  {(r['calle'] or '?')[:28]:<28} {(r['comuna'] or '?')[:18]:<18} det={int(r['det']):>7,} buses={r['buses']:>4}  {r['tipo']}")
