"""Convierte los 468 TXT de tracking GPS a Parquet (ZSTD) usando DuckDB.

Estrategia: por cada entrada TXT del ZIP -> extraer a temporal -> DuckDB lee
como VARCHAR (robusto), castea con TRY_CAST (filas malas -> NULL, no se pierden)
-> escribe un Parquet por archivo. Idempotente: omite los ya convertidos.
"""
import os, zipfile, tempfile, time, sys, json
import duckdb
from config import ZIP_PATH, PARQUET_DIR

os.makedirs(PARQUET_DIR, exist_ok=True)

# Nombres de las 21 columnas crudas (todas leidas como VARCHAR)
RAW = [f"c{i}" for i in range(21)]

# SELECT con tipado robusto y nombres finales de negocio
SELECT = f"""
    c0  AS record_key,
    c1  AS operador_rut,
    c2  AS proveedor_rut,
    TRY_CAST(c3 AS INTEGER)                                   AS periodo,
    c4  AS servicio_id,
    c5  AS recorrido,
    TRY_CAST(c6 AS INTEGER)                                   AS sentido,
    c7  AS imei,
    c8  AS patente,
    TRY_STRPTIME(c9,  '%d/%m/%Y %H:%M:%S')                    AS ts_local,
    TRY_STRPTIME(c10, '%d/%m/%Y %H:%M:%S')                    AS ts_utc,
    TRY_CAST(c11 AS INTEGER)                                  AS rumbo,
    TRY_CAST(replace(c12, ',', '.') AS DOUBLE)               AS lat,
    TRY_CAST(replace(c13, ',', '.') AS DOUBLE)               AS lon,
    TRY_CAST(replace(c14, ',', '.') AS DOUBLE)               AS velocidad,
    TRY_CAST(c15 AS INTEGER)                                  AS f15,
    TRY_CAST(replace(c16, ',', '.') AS DOUBLE)               AS dist16,
    TRY_CAST(c17 AS INTEGER)                                  AS f17,
    TRY_CAST(c18 AS INTEGER)                                  AS f18,
    TRY_CAST(c19 AS INTEGER)                                  AS f19,
    TRY_CAST(replace(c20, ',', '.') AS DOUBLE)               AS val20,
    '{{unidad}}'  AS unidad,
    '{{mes}}'     AS mes_carpeta,
    '{{archivo}}' AS archivo_origen
"""

con = duckdb.connect()
con.execute("PRAGMA threads=4")

z = zipfile.ZipFile(ZIP_PATH)
txts = sorted(n for n in z.namelist() if n.lower().endswith(".txt"))

stats = []
t0 = time.time()
done = skipped = empty = 0
for i, name in enumerate(txts, 1):
    parts = name.split("/")
    mes = parts[1] if len(parts) > 1 else "NA"
    unidad = parts[2] if len(parts) > 2 else "NA"
    base = os.path.splitext(os.path.basename(name))[0]
    out = os.path.join(PARQUET_DIR, f"{unidad}__{mes}__{base}.parquet")

    info = z.getinfo(name)
    if info.file_size == 0:
        empty += 1
        print(f"[{i}/{len(txts)}] VACIO  {name}")
        continue
    if os.path.exists(out):
        skipped += 1
        continue

    # extraer a temporal
    with tempfile.NamedTemporaryFile(suffix=".txt", delete=False) as tmp:
        tmp_path = tmp.name
        with z.open(name) as src:
            while True:
                chunk = src.read(1 << 20)
                if not chunk:
                    break
                tmp.write(chunk)

    sel = SELECT.replace("{unidad}", unidad).replace("{mes}", mes).replace(
        "{archivo}", os.path.basename(name).replace("'", "''"))
    try:
        col_struct = ", ".join(f"'{c}': 'VARCHAR'" for c in RAW)
        q = f"""
        COPY (
          SELECT {sel}
          FROM read_csv('{tmp_path.replace(os.sep, '/')}',
                        delim=';', header=false, quote='',
                        columns={{{col_struct}}})
        ) TO '{out.replace(os.sep, '/')}' (FORMAT PARQUET, COMPRESSION ZSTD);
        """
        con.execute(q)
        n_rows = con.execute(
            f"SELECT COUNT(*) FROM read_parquet('{out.replace(os.sep, '/')}')").fetchone()[0]
        stats.append({"unidad": unidad, "mes": mes, "archivo": base, "filas": n_rows})
        done += 1
        if i % 20 == 0 or i == len(txts):
            el = time.time() - t0
            print(f"[{i}/{len(txts)}] {unidad} {mes}: {n_rows:,} filas  "
                  f"(ok={done} skip={skipped} vacios={empty})  {el:.0f}s")
    except Exception as e:
        print(f"[{i}/{len(txts)}] ERROR {name}: {e}")
    finally:
        os.unlink(tmp_path)

# resumen
with open(os.path.join(PARQUET_DIR, "_stats.json"), "w", encoding="utf-8") as f:
    json.dump(stats, f, ensure_ascii=False, indent=2)
total = sum(s["filas"] for s in stats)
print(f"\n=== LISTO === parquet_ok={done} skip={skipped} vacios={empty} "
      f"filas_totales_convertidas_esta_corrida={total:,}  t={time.time()-t0:.0f}s")
