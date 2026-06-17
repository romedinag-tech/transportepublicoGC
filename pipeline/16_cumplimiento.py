"""Indicador de cumplimiento (piloto): frecuencia comprometida (Programa de Operación)
vs. oferta observada (buses operativos/hora medidos por GPS, días laborables).
Cobertura: las unidades presentes en programa_operacion.csv (Rex 5214/2023)."""
import os, csv, json, collections, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "pipeline"))
from google.cloud import bigquery
from config import GCP_PROJECT, GCP_LOCATION, BQ_DATASET

BASE = os.path.dirname(os.path.abspath(__file__))
c = bigquery.Client(project=GCP_PROJECT, location=GCP_LOCATION)
DS = f"{GCP_PROJECT}.{BQ_DATASET}"

# 1) Comprometido: leer CSV, dedup por (servicio,sentido,hora) y expandir banda 2h -> horaria
rows = list(csv.DictReader(open(os.path.join(BASE,"perimetro_gc","programa_operacion.csv"),encoding="utf-8")))
seen=set(); comp=collections.defaultdict(dict)   # comp[servicio][hora] = total buses/hr comprometidos (laboral, ambos sentidos)
for r in rows:
    serv=r["servicio"]; sent=r["sentido"]; h=int(r["hora"]); f=int(r["frec_laboral"])
    key=(serv,sent,h)
    if key in seen: continue
    seen.add(key)
    for hh in (h-1, h):              # banda 2h: horario impar cubre las 2 horas
        if 0<=hh<=23:
            comp[serv][hh]=comp[serv].get(hh,0)+f
servicios=sorted(comp.keys())
print("servicios con frecuencia comprometida:", len(servicios), servicios)

# 2) Observado: buses operativos/hora medidos (kpi_base, laborables) para esos recorridos
recs="', '".join(servicios)
obs_rows=[dict(x) for x in c.query(f"""
SELECT recorrido, hora, ROUND(AVG(buses_activos),2) buses_obs
FROM `{DS}.kpi_base`
WHERE dow BETWEEN 2 AND 6 AND recorrido IN ('{recs}')
GROUP BY recorrido, hora
""").result()]
obs=collections.defaultdict(dict)
for x in obs_rows: obs[x["recorrido"]][int(x["hora"])]=float(x["buses_obs"])
print("recorridos con datos GPS:", sorted(obs.keys()))

# 3) Cruce -> cumplimiento por servicio/hora (franja operativa 6-23)
out=[]; resumen=collections.defaultdict(lambda:{"horas":0,"incumple":0})
for serv in servicios:
    for h in range(6,24):
        cm=comp[serv].get(h,0)
        if cm<=0: continue
        ob=obs.get(serv,{}).get(h,0.0)
        ratio=round(ob/cm,2) if cm else None
        incumple=ob < cm*0.8           # oferta observada < 80% de lo comprometido
        out.append({"servicio":serv,"hora":h,"comprometido":cm,"observado":round(ob,2),
                    "ratio":ratio,"incumple":bool(incumple)})
        resumen[serv]["horas"]+=1; resumen[serv]["incumple"]+=int(incumple)

json.dump(out, open(os.path.join(BASE,"perimetro_gc","cumplimiento.json"),"w",encoding="utf-8"), ensure_ascii=False)
print("\n== Cumplimiento por servicio (franja 6-23h laboral) ==")
print(f"{'servicio':10} {'horas':>5} {'horas_incumple':>14} {'%_incumple':>10}")
for serv in servicios:
    r=resumen[serv]; pct=round(100*r['incumple']/r['horas']) if r['horas'] else 0
    print(f"{serv:10} {r['horas']:>5} {r['incumple']:>14} {pct:>9}%")
tot_h=sum(r['horas'] for r in resumen.values()); tot_i=sum(r['incumple'] for r in resumen.values())
print(f"\nTOTAL franjas evaluadas: {tot_h} | con oferta <80% de lo comprometido: {tot_i} ({round(100*tot_i/tot_h)}%)")
print("cumplimiento.json escrito.")
