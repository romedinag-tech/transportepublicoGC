"""Map-matching: pega la geometría de cada recorrido a la red vial OSM.
Densifica la red (puntos ~12m), árbol KD, y snapea cada vértice del recorrido
a la calle más cercana. Elimina los tramos que cortaban manzanas/viviendas."""
import os, json, math, collections
import numpy as np
from scipy.spatial import cKDTree

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROADS = os.path.join(BASE, "geo", "roads_full.json")
GEOMF = os.path.join(BASE, "dashboard", "data", "lineas_geom.json")
LAT0 = -36.83
KX = math.cos(math.radians(LAT0))
def to_xy(lat, lon): return (lat, lon*KX)        # plano aprox-métrico

# 1) nube de puntos de la red vial (densificada ~12 m)
d = json.load(open(ROADS, encoding="utf-8"))
SR = 0.00011  # ~12 m
pts = []
for e in d.get("elements", []):
    g = e.get("geometry")
    if not g or len(g) < 2: continue
    for i in range(1, len(g)):
        a, b = g[i-1], g[i]
        la1, lo1, la2, lo2 = a["lat"], a["lon"], b["lat"], b["lon"]
        dist = math.hypot(la2-la1, (lo2-lo1)*KX)
        n = max(1, int(dist/SR))
        for k in range(n):
            t = k/n
            pts.append((la1+(la2-la1)*t, lo1+(lo2-lo1)*t))
    pts.append((g[-1]["lat"], g[-1]["lon"]))
P = np.array(pts)
tree = cKDTree(np.column_stack([P[:,0], P[:,1]*KX]))
print(f"red vial: {len(P):,} puntos densificados")

def snap(lat, lon):
    dd, idx = tree.query([lat, lon*KX])
    return (round(float(P[idx,0]),5), round(float(P[idx,1]),5), dd/0.000009)  # dd en ~m

def densificar(poly, step=0.00014):
    out=[]
    for i in range(1,len(poly)):
        a,b=poly[i-1],poly[i]
        dist=math.hypot(b[0]-a[0],(b[1]-a[1])*KX); n=max(1,int(dist/step))
        for k in range(n): out.append((a[0]+(b[0]-a[0])*k/n, a[1]+(b[1]-a[1])*k/n))
    out.append(tuple(poly[-1])); return out

# 2) snapear cada subruta
G = json.load(open(GEOMF, encoding="utf-8"))
maxd=0
for ln in G:
    for seg in G[ln]:
        dens = densificar(seg["p"])
        sn=[]
        for (la,lo) in dens:
            s = snap(la,lo); maxd=max(maxd, s[2])
            p=(s[0],s[1])
            if not sn or sn[-1]!=p: sn.append(p)
        # downsample suave
        step=max(1,len(sn)//130)
        seg["p"]=[list(x) for x in sn[::step]]
json.dump(G, open(GEOMF,"w"), separators=(",",":"))
print(f"lineas_geom.json snapeado a la red. KB={os.path.getsize(GEOMF)//1024}")
print(f"distancia máx de snap: ~{int(maxd)} m (puntos del recorrido que estaban lejos de toda calle)")
