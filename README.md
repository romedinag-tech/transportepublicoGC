# 🚍 Transporte Público · Gran Concepción — Tablero analítico

Tablero de datos del sistema de transporte público regulado del **Gran Concepción** (Región del Biobío, Chile), construido a partir de **302,3 millones de registros GPS** de la flota, correspondientes al período **abril 2025 – abril 2026**.

> **Tablero en vivo:** https://romedinag-tech.github.io/transportepublicoGC/

![Período](https://img.shields.io/badge/per%C3%ADodo-abr%202025%20%E2%80%93%20abr%202026-38bdf8)
![Registros](https://img.shields.io/badge/registros-302.3M-34d399)
![Recorridos](https://img.shields.io/badge/recorridos-101-a78bfa)
![Stack](https://img.shields.io/badge/stack-BigQuery%20%2B%20ECharts-0ea5e9)

---

## 📊 Qué muestra

| Sección | Indicador |
|---|---|
| **Operación diaria** | Flota operativa por hora (con banda p10–p90) y velocidad comercial por hora |
| **Evolución temporal** | Mapa de calor flota × hora × mes, volumen mensual y tendencia de flota/velocidad |
| **Patrón semanal** | Mapa de calor flota operativa por día de la semana × hora |
| **Recorridos** | Servicios con mayor flota desplegada y los más lentos en punta tarde (con nombre de empresa) |
| **Regularidad** | Coeficiente de variación de la oferta entre días (más y menos regulares) |
| **Operadores** | Flota por empresa operadora (35 empresas del perímetro de exclusión) |
| **Comunas** | Actividad, velocidad y congestión por comuna del Gran Concepción |
| **Red vial** | Mapa de velocidad por tramo sobre la red (OpenStreetMap) y corredores más lentos con nombre |
| **Detenciones** | Mapa de los puntos con mayor tiempo de detención (terminales, paraderos, nodos) |

## 🗂️ Origen de los datos

Los datos provienen del **tracking GPS de la flota regulada** entregado por la División de Transporte Público Regional (DTPR) del Ministerio de Transportes y Telecomunicaciones (MTT), obtenidos mediante solicitud de transparencia **SAIP AN001T0026331**. El detalle de la operación:

- **36** unidades de negocio · **101** códigos de recorrido · **2.009** buses
- **396** días con datos · **302.269.957** pulsos GPS
- Procesamiento en **Google BigQuery**; visualización estática con **Apache ECharts**

## 📐 Metodología (resumen)

- **Flota operativa**: buses distintos con posición en movimiento (velocidad > 0) por hora, promediados sobre días laborables.
- **Velocidad comercial**: media de buses en movimiento (1–80 km/h) ponderada por número de registros.
- **Regularidad (CV)**: desviación estándar / media de la flota en punta tarde entre días laborables. Menor CV = servicio más estable.

> ⚠️ **Nota de calidad de datos:** junio 2025 está subestimado — 11 unidades entregaron archivos vacíos ese mes (vacío real en el origen).

## 🏗️ Estructura del repositorio

```
.
├── index.html            # Tablero (página única)
├── assets/
│   ├── styles.css        # Estilos (tema premium oscuro)
│   ├── app.js            # Lógica y gráficos (ECharts)
│   └── echarts.min.js    # Librería de gráficos (vendorizada, sin CDN)
├── data/                 # KPIs pre-agregados en JSON
└── pipeline/             # Scripts de procesamiento (BigQuery / Python)
```

## 🔁 Reproducibilidad

Los KPIs se regeneran ejecutando los scripts de [`pipeline/`](pipeline/) sobre la base en BigQuery:

```bash
python pipeline/10_kpis.py     # recalcula data/*.json desde BigQuery
```

El tablero es **100% estático**: se sirve con cualquier servidor de archivos (o GitHub Pages) y no requiere backend.

---

*Proyecto de análisis de movilidad urbana. Datos abiertos del Estado de Chile.*
