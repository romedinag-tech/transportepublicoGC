"""Captura continua GTFS-RT VehiclePositions -> BigQuery (streaming insert).

Uso:
  python 05_captura_rt.py                 # corre indefinido, 1 snapshot / 30s
  python 05_captura_rt.py --ciclos 3      # solo 3 snapshots (prueba)
  python 05_captura_rt.py --intervalo 30  # intervalo en segundos (default 30)
  python 05_captura_rt.py --solo-local    # no escribe a BQ, solo JSONL local

Respeta el limite de 1 request / 30s del proveedor.
Tambien guarda cada snapshot como JSONL local en _work/rt/ como respaldo.
"""
import os, sys, time, json, argparse, datetime, urllib.request
from google.transit import gtfs_realtime_pb2
from config import (GTFS_RT_URL, api_key, GCP_PROJECT, BQ_DATASET,
                    BQ_TABLE_RT, WORK_DIR, RT_INTERVALO_SEG)

RT_DIR = os.path.join(WORK_DIR, "rt")
os.makedirs(RT_DIR, exist_ok=True)
TABLE_ID = f"{GCP_PROJECT}.{BQ_DATASET}.{BQ_TABLE_RT}"


def fetch():
    key = api_key()
    url = f"{GTFS_RT_URL}?apikey={key}"
    req = urllib.request.Request(url, headers={"X-API-KEY": key})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def iso(ts):
    if not ts:
        return None
    return datetime.datetime.fromtimestamp(int(ts), tz=datetime.timezone.utc).isoformat()


def parse(data, ingested_iso):
    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(data)
    snap = iso(feed.header.timestamp)
    rows = []
    for e in feed.entity:
        if not e.HasField("vehicle"):
            continue
        v = e.vehicle
        p = v.position
        spd = p.speed if v.HasField("position") else None
        rows.append({
            "snapshot_ts": snap,
            "ingested_at": ingested_iso,
            "entity_id": e.id or None,
            "vehicle_id": v.vehicle.id or None,
            "license_plate": v.vehicle.license_plate or None,
            "label": v.vehicle.label or None,
            "trip_id": v.trip.trip_id or None,
            "route_id": v.trip.route_id or None,
            "direction_id": v.trip.direction_id if v.trip.HasField("direction_id") else None,
            "start_time": v.trip.start_time or None,
            "start_date": v.trip.start_date or None,
            "schedule_relationship": gtfs_realtime_pb2.TripDescriptor.ScheduleRelationship.Name(
                v.trip.schedule_relationship) if v.trip.HasField("schedule_relationship") else None,
            "lat": p.latitude or None,
            "lon": p.longitude or None,
            "bearing": p.bearing if p.HasField("bearing") else None,
            "speed_ms": spd,
            "speed_kmh": round(spd * 3.6, 3) if spd is not None else None,
            "odometer": p.odometer if p.HasField("odometer") else None,
            "vehicle_ts": iso(v.timestamp),
        })
    return snap, rows


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ciclos", type=int, default=0, help="0 = indefinido")
    ap.add_argument("--intervalo", type=int, default=RT_INTERVALO_SEG,
                    help=f"segundos entre requests (minimo y default {RT_INTERVALO_SEG}s, instruccion correo Transapp)")
    ap.add_argument("--solo-local", action="store_true")
    args = ap.parse_args()

    # piso rigido: nunca consultar mas rapido que el minimo permitido
    intervalo = max(args.intervalo, RT_INTERVALO_SEG)
    if intervalo != args.intervalo:
        print(f"AVISO: intervalo elevado a {intervalo}s (minimo permitido)", flush=True)

    bq = None
    if not args.solo_local:
        from google.cloud import bigquery
        bq = bigquery.Client(project=GCP_PROJECT)

    n = 0
    while True:
        n += 1
        t0 = time.time()
        ingested = datetime.datetime.now(datetime.timezone.utc).isoformat()
        try:
            data = fetch()
            snap, rows = parse(data, ingested)
            # respaldo local JSONL por dia
            day = (snap or ingested)[:10]
            path = os.path.join(RT_DIR, f"vehicles_{day}.jsonl")
            with open(path, "a", encoding="utf-8") as f:
                for r in rows:
                    f.write(json.dumps(r, ensure_ascii=False) + "\n")
            # streaming a BigQuery
            bq_msg = "local"
            if bq is not None:
                errs = bq.insert_rows_json(TABLE_ID, rows)
                bq_msg = "BQ-OK" if not errs else f"BQ-ERR:{errs[:1]}"
            print(f"[{n}] snap={snap} buses={len(rows)} -> {bq_msg}", flush=True)
        except Exception as e:
            print(f"[{n}] ERROR: {e!r}", flush=True)

        if args.ciclos and n >= args.ciclos:
            break
        dt = intervalo - (time.time() - t0)
        if dt > 0:
            time.sleep(dt)


if __name__ == "__main__":
    main()
