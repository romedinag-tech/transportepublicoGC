"""Velocidad por celda de ~100 m y POR HORA del dia (laborables) para mapa con selector."""
import os, json, collections
from google.cloud import bigquery
from config import GCP_PROJECT, GCP_LOCATION, BQ_DATASET
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dashboard", "data")
c = bigquery.Client(project=GCP_PROJECT, location=GCP_LOCATION)
DS = f"{GCP_PROJECT}.{BQ_DATASET}"

rows = list(c.query(f"""
SELECT ROUND(lat,3) la, ROUND(lon,3) lo, EXTRACT(HOUR FROM ts_local) hora,
       CAST(ROUND(AVG(IF(velocidad BETWEEN 1 AND 80, velocidad, NULL))) AS INT64) vel,
       COUNTIF(velocidad BETWEEN 1 AND 80) n
FROM `{DS}.tracking_historico`
WHERE lat BETWEEN -37.05 AND -36.65 AND lon BETWEEN -73.20 AND -72.90
  AND EXTRACT(DAYOFWEEK FROM ts_local) BETWEEN 2 AND 6
  AND EXTRACT(HOUR FROM ts_local) BETWEEN 6 AND 22
GROUP BY la, lo, hora
HAVING n >= 250
""").result())
print("filas (celda,hora):", len(rows))

HORAS = list(range(6, 23))
# celdas unicas
cells_idx = {}
cells = []
per_hour = collections.defaultdict(dict)   # hora -> {cell_i: vel}
for r in rows:
    key = (r["la"], r["lo"])
    if key not in cells_idx:
        cells_idx[key] = len(cells)
        cells.append([r["la"], r["lo"]])
    per_hour[r["hora"]][cells_idx[key]] = r["vel"]

vel = {}
for h in HORAS:
    arr = [None] * len(cells)
    for i, v in per_hour.get(h, {}).items():
        arr[i] = v
    vel[str(h)] = arr

out = {"horas": HORAS, "cells": cells, "vel": vel}
path = os.path.join(OUT, "speed_grid_hora.json")
json.dump(out, open(path, "w"), separators=(",", ":"))
print("celdas unicas:", len(cells), " tamano:", round(os.path.getsize(path)/1024), "KB")
for h in HORAS:
    vals = [v for v in vel[str(h)] if v is not None]
    if vals:
        print(f"  {h:02}:00  celdas={len(vals):>4}  vel_media={sum(vals)/len(vals):.1f}  min={min(vals)} max={max(vals)}")
