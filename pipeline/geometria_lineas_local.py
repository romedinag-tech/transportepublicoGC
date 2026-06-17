"""Geometría LIMPIA de recorridos (local, DuckDB, sin BigQuery).
Corrige las rectas que cruzaban río/cerros: parte la traza en los GAPS de GPS
(salto > umbral) y se queda con el tramo continuo más largo (el viaje real)."""
import os, json, collections, math
import duckdb

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PQ = os.path.join(BASE, "_work", "parquet", "*.parquet").replace("\\", "/")
OUT = os.path.join(BASE, "dashboard", "data", "lineas_geom.json")

con = duckdb.connect()
rows = con.execute(f"""
WITH base AS (
  SELECT recorrido, sentido, patente, CAST(ts_local AS DATE) dia, ts_local,
         ROUND(lat,5) lat, ROUND(lon,5) lon
  FROM read_parquet('{PQ}')
  WHERE ts_local BETWEEN TIMESTAMP '2026-03-09' AND TIMESTAMP '2026-03-14'
    AND lat BETWEEN -37.1 AND -36.6 AND lon BETWEEN -73.25 AND -72.85
    AND velocidad > 0                       -- solo puntos en movimiento
),
cand AS (
  SELECT recorrido, sentido, patente, dia, COUNT(*) n FROM base GROUP BY 1,2,3,4
  QUALIFY ROW_NUMBER() OVER(PARTITION BY recorrido, sentido ORDER BY COUNT(*) DESC)=1
)
SELECT b.recorrido, b.sentido, b.lat, b.lon
FROM base b JOIN cand USING(recorrido, sentido, patente, dia)
ORDER BY b.recorrido, b.sentido, b.ts_local
""").fetchall()

# agrupar por (recorrido, sentido) en orden temporal
runs = collections.defaultdict(list)
for rec, sent, lat, lon in rows:
    runs[(rec, int(sent))].append((lat, lon))

GAP = 0.0045   # ~450 m: salto mayor a esto = pérdida de señal / deadhead -> corta

def metros(a, b):
    dlat = (b[0]-a[0]); dlon = (b[1]-a[1])*math.cos(math.radians(a[0]))
    return math.hypot(dlat, dlon)

def tramo_mas_largo(pts):
    if len(pts) < 2: return pts
    segs, cur = [], [pts[0]]
    for i in range(1, len(pts)):
        if metros(pts[i-1], pts[i]) > GAP:
            segs.append(cur); cur = [pts[i]]
        else:
            cur.append(pts[i])
    segs.append(cur)
    # tramo con mayor recorrido total (no solo nº de puntos)
    def largo(s): return sum(metros(s[k-1], s[k]) for k in range(1, len(s)))
    return max(segs, key=largo)

lineas = collections.defaultdict(list)
for (rec, sent), pts in runs.items():
    seg = tramo_mas_largo(pts)
    if len(seg) < 8: continue
    step = max(1, len(seg)//100)
    lineas[rec[:2]].append({"rec": rec, "s": sent, "p": seg[::step]})

json.dump(lineas, open(OUT, "w"), separators=(",", ":"))
sz = os.path.getsize(OUT)//1024
print(f"lineas_geom.json (limpio): {len(lineas)} líneas, {sum(len(v) for v in lineas.values())} polilíneas, {sz} KB")
# diagnóstico: máximo salto que quedó en las polilíneas (debería ser <= GAP)
mx = 0
for v in lineas.values():
    for s in v:
        p = s["p"]
        for k in range(1, len(p)): mx = max(mx, metros(p[k-1], p[k]))
print(f"máximo salto remanente: {mx:.4f}° (~{int(mx*111000)} m) — objetivo: cercano al downsampling, sin teleports")
