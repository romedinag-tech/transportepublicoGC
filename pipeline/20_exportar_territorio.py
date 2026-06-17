"""Exporta territorio.json: KPIs y perfil horario por cualquier combinación
comuna×línea (incluye marginales 'TODAS') para el visor de doble menú."""
import os, json, collections
from google.cloud import bigquery
from config import GCP_PROJECT, GCP_LOCATION, BQ_DATASET
c = bigquery.Client(project=GCP_PROJECT, location=GCP_LOCATION)
DS = f"{GCP_PROJECT}.{BQ_DATASET}"
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dashboard", "data")

# perfil horario laborable para todos los grانos (cruce + marginales)
horas = [dict(r) for r in c.query(f"""
SELECT IFNULL(comuna,'TODAS') comuna, IFNULL(linea,'TODAS') linea, hora,
  ROUND(SUM(buses)/NULLIF(COUNT(DISTINCT dia),0),1) buses,
  ROUND(SUM(vel*pulsos_movil)/NULLIF(SUM(pulsos_movil),0),1) vel,
  SUM(pulsos) pulsos,
  ROUND(100*SUM(detenidos)/NULLIF(SUM(pulsos),0),1) pct_det
FROM `{DS}.kpi_territorio`
WHERE dow BETWEEN 2 AND 6
GROUP BY GROUPING SETS ((comuna,linea,hora),(comuna,hora),(linea,hora),(hora))
""").result()]

# resumen por grano (todas las horas/días)
resumen = {(_r['comuna'], _r['linea']): _r for _r in ({
    'comuna': r['comuna'], 'linea': r['linea'], 'pulsos': int(r['pulsos']),
    'vel': r['vel'], 'pct_det': r['pct_det'], 'buses_max': r['buses']
} for r in [])}  # placeholder

# armar estructura anidada keyed por "comuna|linea"
cells = collections.defaultdict(lambda: {"horas": [None]*24})
agg = collections.defaultdict(lambda: {"pulsos":0, "vmovil_w":0.0, "pmovil":0, "det":0, "buses_max":0})
for r in horas:
    key = f"{r['comuna'] or 'TODAS'}|{r['linea'] or 'TODAS'}"
    h = int(r['hora'])
    cells[key]["horas"][h] = {"b": r['buses'] or 0, "v": r['vel'] or 0, "d": r['pct_det'] or 0}
    a = agg[key]; a["pulsos"] += int(r['pulsos'] or 0)
    if r['vel'] is not None: a["buses_max"] = max(a["buses_max"], r['buses'] or 0)

# KPIs resumen por grano (pulsos, vel ponderada global, %det, flota pico)
res = {dict(x)['k']: dict(x) for x in []}
sumrows = [dict(r) for r in c.query(f"""
SELECT IFNULL(comuna,'TODAS') comuna, IFNULL(linea,'TODAS') linea,
  SUM(pulsos) pulsos,
  ROUND(SUM(vel*pulsos_movil)/NULLIF(SUM(pulsos_movil),0),1) vel,
  ROUND(100*SUM(detenidos)/NULLIF(SUM(pulsos),0),1) pct_det,
  COUNT(DISTINCT linea) n_lineas, COUNT(DISTINCT comuna) n_comunas
FROM `{DS}.kpi_territorio`
GROUP BY GROUPING SETS ((comuna,linea),(comuna),(linea),())
""").result()]
for r in sumrows:
    key = f"{r['comuna'] or 'TODAS'}|{r['linea'] or 'TODAS'}"
    cells[key]["kpi"] = {"pulsos": int(r['pulsos'] or 0), "vel": r['vel'],
        "pct_det": r['pct_det'], "n_lineas": r['n_lineas'], "n_comunas": r['n_comunas'],
        "flota_pico": agg[key]["buses_max"]}

# menús
comunas = [dict(r) for r in c.query(f"""
  SELECT comuna, SUM(pulsos) p FROM `{DS}.kpi_territorio` GROUP BY comuna ORDER BY p DESC""").result()]
lineas = [dict(r) for r in c.query(f"""
  SELECT linea, ANY_VALUE(empresa) empresa, SUM(pulsos) p
  FROM `{DS}.kpi_territorio` GROUP BY linea ORDER BY SAFE_CAST(linea AS INT64), linea""").result()]

out = {
  "comunas": [r['comuna'] for r in comunas],
  "lineas": [{"linea": r['linea'], "empresa": r['empresa']} for r in lineas],
  "cells": cells,
}
path = os.path.join(OUT, "territorio.json")
json.dump(out, open(path, "w", encoding="utf-8"), ensure_ascii=False, separators=(",",":"))
print("territorio.json:", round(os.path.getsize(path)/1024), "KB |",
      len(cells), "combinaciones |", len(out['comunas']), "comunas |", len(out['lineas']), "líneas")
print("sistema:", cells["TODAS|TODAS"]["kpi"])
print("Concepción×TODAS:", cells.get("Concepción|TODAS",{}).get("kpi"))
print("TODAS×L30:", cells.get("TODAS|30",{}).get("kpi"))
