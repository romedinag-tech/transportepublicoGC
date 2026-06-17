"""Geometría CANÓNICA y robusta por (recorrido, sentido) — local, DuckDB.
Toma un viaje-esqueleto limpio y CENTRA cada vértice en la 'multitud' de pulsos
de muchos viajes (mediana ponderada por tráfico). Robusto a errores de GPS.
Mantiene cada subruta (recorrido) por separado, agrupadas por línea."""
import os, json, collections, math
import duckdb

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PQ = os.path.join(BASE, "_work", "parquet", "*.parquet").replace("\\", "/")
OUT = os.path.join(BASE, "dashboard", "data", "lineas_geom.json")
con = duckdb.connect()
WIN = "ts_local BETWEEN TIMESTAMP '2026-03-02' AND TIMESTAMP '2026-03-29'"  # 4 semanas
BBOX = "lat BETWEEN -37.1 AND -36.6 AND lon BETWEEN -73.25 AND -72.85 AND velocidad>0"

# 1) esqueleto: mejor viaje (más puntos) por recorrido+sentido, ordenado
print("Esqueleto (mejor viaje por recorrido/sentido)...")
sk = con.execute(f"""
WITH base AS (SELECT recorrido, sentido, patente, CAST(ts_local AS DATE) dia, ts_local,
                ROUND(lat,5) lat, ROUND(lon,5) lon
              FROM read_parquet('{PQ}') WHERE {WIN} AND {BBOX}),
cand AS (SELECT recorrido,sentido,patente,dia,COUNT(*) n FROM base GROUP BY 1,2,3,4
         QUALIFY ROW_NUMBER() OVER(PARTITION BY recorrido,sentido ORDER BY COUNT(*) DESC)=1)
SELECT b.recorrido,b.sentido,b.lat,b.lon FROM base b JOIN cand USING(recorrido,sentido,patente,dia)
ORDER BY b.recorrido,b.sentido,b.ts_local
""").fetchall()

# 2) multitud: grilla ~11m con conteo por recorrido+sentido
print("Multitud (grilla de tráfico)...")
cr = con.execute(f"""
SELECT recorrido, sentido, ROUND(lat,4) la, ROUND(lon,4) lo, COUNT(*) c
FROM read_parquet('{PQ}') WHERE {WIN} AND {BBOX}
GROUP BY 1,2,3,4 HAVING COUNT(*) >= 3
""").fetchall()

skel = collections.defaultdict(list)
for rec, s, la, lo in sk: skel[(rec, int(s))].append((la, lo))
# índice de multitud por bucket grueso (~111m) para vecindad rápida
crowd = collections.defaultdict(lambda: collections.defaultdict(list))
for rec, s, la, lo, c in cr:
    crowd[(rec, int(s))][(round(la, 3), round(lo, 3))].append((la, lo, c))

GAP = 0.0045
def met(a, b):
    return math.hypot(b[0]-a[0], (b[1]-a[1])*math.cos(math.radians(a[0])))
def tramo_largo(pts):
    if len(pts) < 2: return pts
    segs, cur = [], [pts[0]]
    for i in range(1, len(pts)):
        if met(pts[i-1], pts[i]) > GAP:
            segs.append(cur); cur = [pts[i]]
        else:
            cur.append(pts[i])
    segs.append(cur)
    return max(segs, key=lambda s: sum(met(s[k-1], s[k]) for k in range(1, len(s))))
def centrar(v, grid):
    R = 0.00045  # ~50 m
    sx = sy = sw = 0.0
    for db in (-1, 0, 1):
        for dl in (-1, 0, 1):
            for (la, lo, c) in grid.get((round(v[0],3)+db*0.001, round(v[1],3)+dl*0.001), []):
                if met(v, (la, lo)) <= R:
                    sx += la*c; sy += lo*c; sw += c
    return (round(sx/sw, 5), round(sy/sw, 5)) if sw else v

lineas = collections.defaultdict(list)
for (rec, s), pts in skel.items():
    seg = tramo_largo(pts)
    if len(seg) < 8: continue
    grid = crowd[(rec, s)]
    suav = [centrar(v, grid) for v in seg]
    step = max(1, len(suav)//110)
    lineas[rec[:2]].append({"rec": rec, "s": s, "p": suav[::step]})

json.dump(lineas, open(OUT, "w"), separators=(",", ":"))
print(f"lineas_geom.json (canónica): {len(lineas)} líneas, {sum(len(v) for v in lineas.values())} subrutas-sentido, {os.path.getsize(OUT)//1024} KB")
# subrutas por línea (lo que preocupaba)
for ln in sorted(lineas):
    recs = sorted(set(x['rec'] for x in lineas[ln]))
    if ln in ('30','22','63'): print(f"  L{ln}: {len(recs)} recorridos -> {recs}")
