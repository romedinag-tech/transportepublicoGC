"""Geometría OFICIAL de recorridos desde el GTFS estático (shapes.txt).
Reemplaza la geometría derivada del GPS. Agrupa por línea (prefijo del short_name)."""
import os, json, collections
import duckdb

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(BASE, "gtfs").replace("\\", "/")
OUT = os.path.join(BASE, "dashboard", "data", "lineas_geom.json")
con = duckdb.connect()

# shape_id -> route_short_name + direction (via trips + routes)
mp = con.execute(f"""
  SELECT DISTINCT CAST(t.shape_id AS VARCHAR) shape_id, CAST(r.route_short_name AS VARCHAR) sn,
         t.direction_id dir
  FROM read_csv_auto('{G}/trips.txt') t
  JOIN read_csv_auto('{G}/routes.txt') r USING(route_id)
""").fetchall()
shape_info = {s: (sn, d) for s, sn, d in mp}

# puntos ordenados por shape
rows = con.execute(f"""
  SELECT CAST(shape_id AS VARCHAR) shape_id, shape_pt_lat la, shape_pt_lon lo
  FROM read_csv_auto('{G}/shapes.txt') ORDER BY shape_id, shape_pt_sequence
""").fetchall()
byshape = collections.defaultdict(list)
for sid, la, lo in rows:
    byshape[sid].append([round(la, 5), round(lo, 5)])

lineas = collections.defaultdict(list)
for sid, pts in byshape.items():
    info = shape_info.get(sid)
    if not info or len(pts) < 2:
        continue
    sn, d = info
    linea = sn[:2]
    s = int(d) if d is not None else (1 if str(sid).endswith("_R") else 0)
    step = max(1, len(pts)//160)
    lineas[linea].append({"rec": sn, "s": s, "p": pts[::step]})

json.dump(lineas, open(OUT, "w"), separators=(",", ":"))
print(f"lineas_geom.json OFICIAL: {len(lineas)} líneas, {sum(len(v) for v in lineas.values())} shapes, {os.path.getsize(OUT)//1024} KB")
print("líneas:", sorted(lineas.keys()))
# coberturas vs nuestras 36
nuestras = set('02 10 11 12 13 14 16 17 18 20 21 22 23 24 30 31 32 40 41 42 43 44 50 52 56 60 62 63 65 70 71 72 80 81 90 B0'.split())
print("nuestras líneas SIN match GTFS:", sorted(nuestras - set(lineas.keys())))
print("GTFS extra (no en nuestras):", sorted(set(lineas.keys()) - nuestras))
