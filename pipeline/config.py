"""Configuración central del pipeline de transporte público Gran Concepción."""
import os

# Rutas locales
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZIP_PATH = os.path.join(BASE_DIR, "Gran Concepcion.zip")
WORK_DIR = os.path.join(BASE_DIR, "_work")          # extracción temporal
PARQUET_DIR = os.path.join(WORK_DIR, "parquet")     # salida parquet histórico

# Google Cloud
GCP_PROJECT = "fluxus-496201"
GCP_LOCATION = "southamerica-east1"
GCS_BUCKET = "gccp-transporte-raw"
BQ_DATASET = "transporte_gccp"
BQ_TABLE_HIST = "tracking_historico"
BQ_TABLE_RT = "gtfs_rt_vehicles"

# API GTFS-RT (el token se lee de variable de entorno; ver pipeline/.env)
GTFS_RT_URL = "https://datamanager.dtpr.transapp.cl/data/gtfs-rt/concepcion.proto"
GTFS_RT_RAW_URL = "https://datamanager.dtpr.transapp.cl/data/routemanager/concepcion.proto"

# Intervalo minimo entre requests para NO saturar el servicio.
# Instruccion oficial (correo Transapp / doc integracion): minimo 30 segundos.
RT_INTERVALO_SEG = 30

def api_key():
    k = os.environ.get("GTFS_RT_APIKEY")
    if not k:
        env = os.path.join(os.path.dirname(__file__), ".env")
        if os.path.exists(env):
            for line in open(env, encoding="utf-8"):
                line = line.strip()
                if line.startswith("GTFS_RT_APIKEY"):
                    k = line.split("=", 1)[1].strip().strip('"').strip("'")
    return k
