/* Config de ciudad para el shell compartido (_motor/dashboard_kit). El shell es IDÉNTICO entre ciudades;
   solo cambia este archivo + data/. Una mejora transversal se hace en el kit y se despliega con deploy_dashboard.py. */
window.CITY = {
  slug: "gccp",
  nombre: "Gran Concepción",
  sigla: "GC",
  lat0: -36.83, lon0: -73.05,
  comunas: ["Concepción","Talcahuano","San Pedro de la Paz","Hualpén","Chiguayante","Penco","Hualqui"],
  comunasGeojson: "comunas_gccp.geojson",
  live: true,                           // feed GTFS-RT en vivo
  liveBase: "https://storage.googleapis.com/gccp-transporte-live/",
  repo: "transportepublicoGC",
  rich: true,                           // tiene EOD + catastro SII → modos Transbordo/Salud/Educación/NSE
  voz: { ejeSing: "corredor", ejePlur: "corredores", EjePlur: "Corredores" },
};
