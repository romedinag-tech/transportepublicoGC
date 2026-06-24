![Transporte Público Gran Concepción · Centro de Mando](assets/brand/portada.png)

# 🚍 Transporte Público · Gran Concepción — Centro de Mando

Plataforma analítica del sistema de transporte público regulado del **Gran Concepción** (Región del Biobío, Chile), construida sobre **302,3 millones de registros GPS** de la flota (período **abril 2025 – abril 2026**) y la **referencia oficial GTFS** del Ministerio de Transportes.

> **🛰️ Visor en vivo:** https://romedinag-tech.github.io/transportepublicoGC/

![Período](https://img.shields.io/badge/per%C3%ADodo-abr%202025%20%E2%80%93%20abr%202026-22d3ee)
![Registros](https://img.shields.io/badge/registros-302.3M-34d399)
![Líneas](https://img.shields.io/badge/l%C3%ADneas-36-a78bfa)
![GTFS](https://img.shields.io/badge/GTFS-oficial-fb923c)
![Stack](https://img.shields.io/badge/stack-BigQuery%20%2B%20DuckDB%20%2B%20ECharts%20%2B%20Leaflet-0ea5e9)

---

## 🧭 El visor (Centro de Mando)

Interfaz tipo *control room* a pantalla completa: **barra de comando**, **sidebar de filtros colapsable** y el **mapa como héroe**. Navegación de **doble eje combinable**: por **comuna** (territorio) y por **línea / empresa** (operador). Tema **claro/oscuro**.

| Widget | Qué muestra |
|---|---|
| **KPIs** | Registros GPS, flota en punta, velocidad media, tiempo detenido, cobertura |
| **Flota y velocidad** | Perfil horario de flota operativa y velocidad comercial |
| **Mapa** | Recorrido **oficial GTFS** coloreado por **velocidad real (map-matched)** rojo→amarillo→verde, **paraderos oficiales**, sobre base oscura (CARTO Dark Matter) |
| **Ranking** | Líneas/comunas por actividad |
| **Cumplimiento de frecuencia** | Despachos **programados (GTFS)** vs **observados (GPS)** — apples-to-apples |
| **Cumplimiento semanal por variable** | Evolución semana a semana de **frecuencia, cobertura horaria, regularidad y flota**, con desglose **Laboral / Sábado / Domingo** |

Todo el análisis vive en una sola página: navegación por **comuna** (barra superior, con *Ranking* y *Comparador* de comunas) y por **línea** (sidebar), con **selector de período del día** para los indicadores de velocidad/congestión.

## 🛰️ Datos en vivo + histórico

- **En vivo:** un servicio *serverless* (Cloud Run + Cloud Scheduler) consulta el **GTFS-RT** cada minuto y publica `live.json` en un bucket público de Google Cloud Storage; el visor lo consume vía `fetch`. Las posiciones se **snapean a la ruta oficial** (map-matching, ~10 m de error mediano). El token de la API permanece del lado del servidor.
- **Histórico:** se procesa **localmente con DuckDB** (gratis, replica BigQuery) y se refresca periódicamente desde la nube.

## 📐 Referencia oficial: GTFS estático

El feed oficial de la DTPR (`cl-concepcion`) aporta la **geometría inscrita** de las 36 líneas (`shapes.txt`), los **paraderos** (`stops.txt`) y las **frecuencias programadas** (de los `trips.txt`, cuyo `trip_id` codifica la hora de salida). Esto permite:

- **Cumplimiento de frecuencia** de las 36 líneas: expediciones **programadas vs despachos observados** (detectados sobre el GPS), en despachos/día — comparación homogénea por tipo de día.
- **Geometría correcta** de los recorridos (sin trazos sobre el río ni viviendas).
- **Map-matching** del GPS contra el shape oficial → velocidad por tramo y posiciones limpias.

## 🗂️ Origen de los datos

Tracking GPS de la flota regulada entregado por la **División de Transporte Público Regional (DTPR)** del MTT vía solicitud de transparencia **SAIP AN001T0026331**:

- **36** unidades de negocio · **101** recorridos · **~2.009** buses · **396** días · **302.269.957** pulsos GPS.
- Marco legal: **perímetro de exclusión** (Ley 18.696 art. 3°, Res. Afecta N°29/2023 DTPR) — exige frecuencia, regularidad, programación vial y reporte GPS.

## 📐 Metodología (resumen)

- **Flota operativa:** buses distintos en movimiento (velocidad > 0) por hora, promediados sobre días laborables.
- **Velocidad comercial:** media de buses en movimiento (1–80 km/h) ponderada por registros.
- **Despacho (expedición):** tramo contiguo de un bus en un `(recorrido, sentido)`, ≥ 8 min y ≥ 6 pulsos.
- **Regularidad:** consistencia de los intervalos (headways) observados, índice 0–100.

> ⚠️ **Calidad de datos:** junio 2025 está subestimado — 11 unidades entregaron archivos vacíos ese mes (vacío real en el origen).

## 🏗️ Estructura del repositorio

```
.
├── index.html              # Centro de Mando (Tailwind + ECharts + Leaflet)
├── assets/
│   ├── app_shell.js        # Motor del visor (doble eje, mapa, cumplimiento, tema)
│   ├── shell.css / styles.css   # Layout y variables de tema (claro/oscuro)
│   ├── brand/              # Portada y assets de marca
│   └── echarts.min.js      # Librería de gráficos (vendorizada)
└── data/                   # KPIs y datasets pre-agregados (JSON)
    ├── territorio.json         # comuna × línea × hora
    ├── lineas_geom.json        # geometría oficial + velocidad map-matched
    ├── paraderos.json          # paraderos por línea
    ├── cumplimiento.json       # frecuencia programada vs observada
    └── cumplimiento_semanal.json  # variables exigidas, semana a semana, L/S/D
```

Los pipelines de procesamiento (BigQuery / **DuckDB local** / GTFS / map-matching) viven fuera del sitio publicado.

## 🧰 Stack

`Google BigQuery` · `DuckDB` (procesamiento local) · `Apache ECharts` · `Leaflet` (+ CARTO Dark Matter / Esri) · `Tailwind CSS` · `Cloud Run` + `Cloud Scheduler` + `Cloud Storage` (captura GTFS-RT serverless) · `GitHub Pages`.

---

*Proyecto de análisis de movilidad urbana sobre datos abiertos del Estado de Chile.*
