/* Visor Transporte Gran Concepción — navegación por comuna (territorio) y línea (operador) */
const NF = new Intl.NumberFormat("es-CL");
const fmt = n => NF.format(Math.round(n||0));
const fmt1 = n => NF.format(Math.round((n||0)*10)/10);
const HORAS = [...Array(24).keys()].map(h=>String(h).padStart(2,"0")+"h");
const $ = id => document.getElementById(id);
const J = n => fetch(`data/${n}?v=50`).then(r=>r.json());
const BUILD = "2026-06-24 22:55";

let T, GEOM, GEO, CUMP, PAR={}, CSEM={lineas:{}}, LIVE=null, COB=null, EQ={lineas:{}}, GRID=null, OP={lineas:{}}, EMPL={}, CLIN={}, CONGRED=null, RFREQ=null;
let eqChart, nseChart, rankChart, cmpChart, empresasChart, heatChart, recChart, evolChart;
let EMPR=[], MESH=[], DOWH=[], DET2=[], TERM={terminales:[]}, DEST={destinos:[]}, REC={top:[],lentos:[],reg:[],corr:[]}, EVOL={meses:[],comunas:{}};
let VFREQ=null, VTREND=null, curVar=null, lastFitScope=null, TLIN={}, PESP={stops:[]};
let state = {comuna:"TODAS", linea:"TODAS", csDia:"L", csVar:"freq", mapMode:"live", vista:"normal", periodo:"agg", purpose:"all", cmpA:null, cmpB:null};
let chart, csChart, lmap, baseLayers, routeLayer, comunaLayer, stopLayer, liveLayer, liveCanvas, coverLayer, coverCanvas, speedLegend, coverLegend;
const LIVE_URL = "https://storage.googleapis.com/gccp-transporte-live/live.json";
const MAP_MODES = [["live","En vivo"],["cover","Cobertura"],["trans","Transbordo"],["wait","Espera"],["conges","Congestión"],["bunch","Bunching"],["det","Detenciones"],["salud","Salud"],["edu","Educación"],["nse","NSE"]];
const PEAK_H = [7,8,9,17,18,19];

const CS_DIAS = [["L","Laboral"],["S","Sábado"],["D","Domingo"]];
const CS_VARS = [
  {k:"freq", lbl:"Frecuencia", suf:"%", ref:[80,100], pct:true, desc:"expediciones/día observadas ÷ programadas (GTFS)"},
  {k:"cob",  lbl:"Cobertura horaria", suf:"%", ref:[80,100], pct:true, desc:"horas con servicio ÷ horas de operación programadas"},
  {k:"reg",  lbl:"Regularidad", suf:"", ref:[], pct:false, desc:"consistencia de los intervalos (headways) observados, índice 0–100"},
  {k:"flota",lbl:"Flota operativa", suf:" buses", ref:[], pct:false, desc:"buses operativos por día (nivel observado)"},
];

/* velocidad -> color rojo→amarillo→verde (8..28 km/h) */
function speedColor(v){
  if(v==null) return "#64748b";
  const t = Math.max(0, Math.min(1, (v-8)/20));   // 8 km/h rojo, 28 verde
  const hue = t*120;                               // 0=rojo 60=amarillo 120=verde
  return `hsl(${hue},72%,50%)`;
}

/* tema (claro/oscuro): lee variables CSS para que los charts ECharts sigan el tema */
const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const TH = () => ({tx:cssv("--tx"), mut:cssv("--muted"), axis:cssv("--ch-axis"), grid:cssv("--ch-grid"), tip:cssv("--ch-tip"), tipB:cssv("--line2")});
function applyTheme(t){
  document.documentElement.dataset.theme = t;
  try{ localStorage.setItem("gccp-theme", t); }catch(e){}
  const btn=$("theme-btn"); if(btn) btn.textContent = t==="light" ? "☾" : "☀";
}
function toggleTheme(){
  applyTheme(document.documentElement.dataset.theme==="light" ? "dark" : "light");
  if(typeof render==="function") render();   // redibuja charts con los colores nuevos
}

const cellOf = () => (T.cells[`${state.comuna}|${state.linea}`] || {kpi:null, horas:[]});
const empresaDe = ln => { const x=(T.lineas||[]).find(l=>l.linea===ln); return x?x.empresa:""; };

/* ---------- menús ---------- */
const PERIODOS = [["agg","Agregado"],["am","Punta AM"],["md","Mediodía"],["pm","Punta PM"],["off","Fuera punta"],["noche","Noche"]];
const PERIODO_H = {agg:[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22], am:[7,8,9], md:[12,13,14], pm:[17,18,19], off:[10,11,15,16,20,21,22], noche:[21,22,23]};
const periodoLbl = p => (PERIODOS.find(x=>x[0]===p)||["","Agregado"])[1];
const PURPOSES = [["all","Todos"],["trab","Trabajo"],["est","Estudio"],["sal","Salud"],["otr","Otros"]];
const PURP_FIELD = {all:"viajes",trab:"trabajo",est:"estudio",sal:"salud",otr:"otros"};
const purposeLbl = p => (PURPOSES.find(x=>x[0]===p)||["","Todos"])[1];

function buildComunaTabs(){
  const order = (GEO.features||[]).map(f=>f.properties.name);
  let html = `<span class="ctab" data-c="TODAS" data-v="normal">Gran Concepción</span>`;
  order.forEach(c=> html += `<span class="ctab" data-c="${c}" data-v="normal">${c}</span>`);
  html += `<span class="vsep"></span><span class="ctab special" data-v="ranking">▦ Ranking</span><span class="ctab special" data-v="comparador">⇄ Comparador</span>`;
  $("comuna-tabs").innerHTML = html;
  $("comuna-tabs").querySelectorAll(".ctab").forEach(el=>{
    el.onclick = ()=>{ const v=el.dataset.v;
      if(v==="normal"){ state.vista="normal"; state.comuna=el.dataset.c; state.linea="TODAS"; }
      else { state.vista=v; state.comuna="TODAS"; state.linea="TODAS"; }
      buildLineaList($("linea-search")?$("linea-search").value:""); render(); };
  });
}
function buildPeriodo(){
  const box=$("periodo-sel"); if(!box) return;
  box.innerHTML = `<span class="lbl">Período</span><div class="seg">`+
    PERIODOS.map(([k,l])=>`<b data-p="${k}" class="${state.periodo===k?"on":""}">${l}</b>`).join("")+`</div>`;
  box.querySelectorAll("b").forEach(el=>el.onclick=()=>{ state.periodo=el.dataset.p;
    box.querySelectorAll("b").forEach(b=>b.classList.toggle("on",b.dataset.p===state.periodo));
    if(state.mapMode==="conges" || state.mapMode==="wait" || state.mapMode==="bunch" || state.vista==="ranking") render(); });
}
function buildPurpose(){
  const box=$("purpose-sel"); if(!box) return;
  box.innerHTML = `<span class="lbl">Propósito</span><div class="seg">`+
    PURPOSES.map(([k,l])=>`<b data-p="${k}" class="${state.purpose===k?"on":""}">${l}</b>`).join("")+`</div>`;
  box.querySelectorAll("b").forEach(el=>el.onclick=()=>{ state.purpose=el.dataset.p;
    box.querySelectorAll("b").forEach(b=>b.classList.toggle("on",b.dataset.p===state.purpose));
    if(["cover","trans","wait"].includes(state.mapMode)) render(); });
}
function buildLineaList(filter=""){
  const f = filter.trim().toLowerCase();
  const setC = (state.comuna!=="TODAS" && CLIN[state.comuna]) ? new Set(CLIN[state.comuna]) : null;
  const items = (T.lineas||[])
    .filter(l => !setC || setC.has(l.linea))
    .filter(l => !f || l.linea.includes(f) || (l.empresa||"").toLowerCase().includes(f));
  const hint = $("linea-hint");
  if(hint) hint.textContent = setC ? `${items.length} líneas operan en ${state.comuna}` : `${items.length} líneas · sistema`;
  $("linea-list").innerHTML = items.map(l =>
    `<div class="litem" data-l="${l.linea}"><span class="ln">${l.linea}</span><span class="nm">${l.empresa||""}</span></div>`).join("");
  $("linea-list").querySelectorAll(".litem").forEach(el=>{
    el.onclick = ()=>{ state.linea = state.linea===el.dataset.l ? "TODAS" : el.dataset.l;
      state.vista = "normal";
      if(state.linea!=="TODAS") state.comuna = "TODAS";   // elegir línea limpia la comuna
      buildLineaList($("linea-search")?$("linea-search").value:""); render(); };
  });
}

/* ---------- render ---------- */
function render(){
  // resaltar menús: comuna-bar (territorio + vistas especiales) y líneas (sidebar)
  document.querySelectorAll("#comuna-tabs .ctab").forEach(e=>{
    const on = state.vista==="normal" ? (e.dataset.v==="normal" && e.dataset.c===state.comuna) : (e.dataset.v===state.vista);
    e.classList.toggle("active", on);
  });
  document.querySelectorAll(".litem").forEach(e=>e.classList.toggle("active", e.dataset.l===state.linea && state.vista==="normal"));
  const periodoRelevante = state.vista==="ranking" || (state.vista==="normal" && state.linea==="TODAS" && (state.mapMode==="conges"||state.mapMode==="wait"||state.mapMode==="bunch"));
  $("periodo-sel").style.display = periodoRelevante ? "flex" : "none";
  const purposeRel = state.vista==="normal" && state.linea==="TODAS" && ["cover","trans","wait"].includes(state.mapMode);
  if($("purpose-sel")) $("purpose-sel").style.display = purposeRel ? "flex" : "none";

  // VISTAS ESPECIALES (territorio): ranking / comparador de comunas
  if(state.vista==="ranking" || state.vista==="comparador"){
    $("normal-view").style.display="none"; $("special-view").style.display="";
    $("reset-btn").style.display="";
    $("scope-title").textContent = state.vista==="ranking" ? "Ranking de comunas" : "Comparador de comunas";
    $("scope-sub").textContent = "Gran Concepción";
    if(state.vista==="ranking") renderRankingView(); else renderComparador();
    return;
  }
  $("normal-view").style.display=""; $("special-view").style.display="none";

  const hasFilter = state.comuna!=="TODAS" || state.linea!=="TODAS";
  $("reset-btn").style.display = hasFilter ? "" : "none";

  // título de ámbito
  let title, sub;
  const emp = state.linea!=="TODAS" ? empresaDe(state.linea) : "";
  if(state.linea==="TODAS" && state.comuna==="TODAS"){ title="Gran Concepción"; sub="36 líneas · 12 comunas"; }
  else if(state.linea==="TODAS"){ title=state.comuna; sub="todas las líneas que operan aquí"; }
  else if(state.comuna==="TODAS"){ title=`Línea ${state.linea} · ${emp}`; sub="en todo el Gran Concepción"; }
  else { title=`Línea ${state.linea} · ${emp}`; sub=`en ${state.comuna}`; }
  $("scope-title").textContent = title;
  $("scope-sub").textContent = sub;

  const cell = cellOf();
  renderKPIs(cell);
  renderHora(cell);
  renderMapa();
  renderRanking();
  renderCump();
  renderCumpSem();
  renderEquidad();
  renderNseGap();
  renderOpNow();
  renderOperacion();
  renderVarFreq();
  renderCalidad();
  renderEmpresas();
  renderHeat();
  renderRecorridos();
  renderEvolucion();
}

function kpiCard(l,v,s){ return `<div class="kpi"><div class="lab">${l}</div><div class="val">${v}</div><div class="sub">${s}</div></div>`; }
function renderKPIs(cell){
  const k = cell.kpi;
  if(!k){ $("kpis2").innerHTML = `<div class="empty">Sin datos para este ámbito.</div>`; return; }
  const ctx = state.linea!=="TODAS"
      ? kpiCard("Comunas que sirve", k.n_comunas, "presencia territorial")
      : kpiCard("Líneas", k.n_lineas, "operando en el ámbito");
  $("kpis2").innerHTML = [
    kpiCard("Registros GPS", (k.pulsos/1e6).toFixed(1)+" M", "pulsos en el ámbito"),
    kpiCard("Flota en punta", fmt(k.flota_pico), "buses activos máx/hora"),
    kpiCard("Velocidad media", fmt1(k.vel)+" km/h", "en movimiento"),
    kpiCard("Tiempo detenido", fmt1(k.pct_det)+" %", "en ruta · excl. terminales"),
    ctx,
  ].join("");
}

function renderHora(cell){
  if(!chart) chart = echarts.init($("ch-hora"));
  const h = cell.horas||[];
  const flota = h.map(x=>x?x.b:0), vel = h.map(x=>x?x.v:null);
  const th = TH();
  chart.setOption({
    textStyle:{fontFamily:"Inter,sans-serif",color:th.tx},
    grid:{left:42,right:46,top:34,bottom:28,containLabel:true},
    legend:{data:["Flota (buses)","Velocidad"],textStyle:{color:th.mut},top:0,right:0},
    tooltip:{trigger:"axis",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx},
      formatter:p=>{const i=p[0].dataIndex,x=h[i]||{};return `${HORAS[i]}<br>Flota: <b>${fmt1(x.b)}</b> buses<br>Velocidad: <b>${fmt1(x.v)}</b> km/h<br>Detenido: ${fmt1(x.d)}%`;}},
    xAxis:{type:"category",data:HORAS,axisLabel:{color:th.mut,fontSize:10},axisLine:{lineStyle:{color:th.axis}}},
    yAxis:[{type:"value",name:"buses",axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
           {type:"value",name:"km/h",position:"right",max:60,axisLabel:{color:th.mut},splitLine:{show:false}}],
    series:[
      {name:"Flota (buses)",type:"bar",data:flota,itemStyle:{color:"rgba(56,189,248,.55)",borderRadius:[3,3,0,0]},barWidth:"58%"},
      {name:"Velocidad",type:"line",yAxisIndex:1,data:vel,smooth:true,symbol:"none",lineStyle:{width:2.5,color:"#34d399"},itemStyle:{color:"#34d399"}}
    ]
  }, true);
  setTimeout(()=>chart.resize(),60);
  const el=$("hora-narr");
  if(el){
    const hb=h.map((x,i)=>[i,x?x.b:0]).filter(x=>x[1]>0);
    const pkF=hb.length?Math.max(...hb.map(x=>x[1])):0;
    const hv=h.map((x,i)=>[i,x?x.v:null,x?x.b:0]).filter(x=>x[1]!=null && x[2]>=pkF*0.25);   // solo horas con operación real
    let t=`Cuántos <b>buses operan cada hora</b> (barras) y la <b>velocidad media</b> (línea), en días laborables. Muestra la punta de servicio y dónde se cae la velocidad por congestión.`;
    if(hb.length&&hv.length){ const pk=hb.reduce((a,b)=>b[1]>a[1]?b:a), mn=hv.reduce((a,b)=>b[1]<a[1]?b:a);
      t+=` Punta: <b>${fmt1(pk[1])}</b> buses a las ${HORAS[pk[0]]}; velocidad mínima <b>${fmt1(mn[1])} km/h</b> a las ${HORAS[mn[0]]}.`; }
    el.innerHTML=t;
  }
}

function ensureMap(){
  if(lmap) return;
  lmap = L.map("lmap",{center:[-36.83,-73.05],zoom:11,zoomControl:true});
  // Base OSCURA (centro de mando) por defecto: CARTO Dark Matter. Sobre ella resaltan
  // el recorrido coloreado por velocidad y los paraderos (datos "neón").
  const oscuro = L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",{maxZoom:20,subdomains:"abcd",attribution:"© OSM © CARTO"}).addTo(lmap);
  const sat = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{maxZoom:19,attribution:"Imagery © Esri"});
  const calles = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",{maxZoom:20,subdomains:"abcd",attribution:"© OSM © CARTO"});
  const etiquetas = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",{maxZoom:19});
  L.control.layers({"Oscuro":oscuro,"Satélite":sat,"Calles":calles},{"Vías y etiquetas":etiquetas},{collapsed:true,position:"topright"}).addTo(lmap);
  comunaLayer = L.layerGroup().addTo(lmap);
  routeLayer = L.layerGroup().addTo(lmap);
  stopLayer = L.layerGroup().addTo(lmap);
  coverCanvas = L.canvas({padding:0.5});
  coverLayer = L.layerGroup().addTo(lmap);
  liveCanvas = L.canvas({padding:0.5});
  liveLayer = L.layerGroup().addTo(lmap);
  if(window.ResizeObserver) new ResizeObserver(()=>lmap.invalidateSize()).observe($("lmap"));
}
/* ---------- filtro espacial por comuna (point-in-polygon) ---------- */
const comunaGeom = name => { const f=(GEO.features||[]).find(x=>x.properties.name===name); return f&&f.geometry; };
let _cgName=null,_cgGeom=null,_cgBox=null;
function _setComuna(){
  if(_cgName===state.comuna) return;
  _cgName=state.comuna; _cgGeom=state.comuna==="TODAS"?null:comunaGeom(state.comuna); _cgBox=null;
  if(_cgGeom){ let a=180,b=90,c=-180,d=-90;
    const polys=_cgGeom.type==="Polygon"?[_cgGeom.coordinates]:_cgGeom.coordinates;
    polys.forEach(p=>p[0].forEach(k=>{a=Math.min(a,k[0]);b=Math.min(b,k[1]);c=Math.max(c,k[0]);d=Math.max(d,k[1]);}));
    _cgBox=[a,b,c,d]; }
}
function pipRing(x,y,r){ let inside=false; for(let i=0,j=r.length-1;i<r.length;j=i++){
  const xi=r[i][0],yi=r[i][1],xj=r[j][0],yj=r[j][1];
  if(((yi>y)!==(yj>y)) && (x<(xj-xi)*(y-yi)/(yj-yi)+xi)) inside=!inside; } return inside; }
function inComuna(lat,lon){
  _setComuna();
  if(!_cgGeom||!_cgBox) return true;
  if(lon<_cgBox[0]||lon>_cgBox[2]||lat<_cgBox[1]||lat>_cgBox[3]) return false;
  const polys=_cgGeom.type==="Polygon"?[_cgGeom.coordinates]:_cgGeom.coordinates;
  for(const poly of polys){ if(pipRing(lon,lat,poly[0])){ let hole=false;
    for(let h=1;h<poly.length;h++) if(pipRing(lon,lat,poly[h])){hole=true;break;}
    if(!hole) return true; } }
  return false;
}

/* buses operando AHORA (GTFS-RT vía live.json, posiciones ya snapeadas a la ruta) */
const MXc = 111320*Math.cos(-36.83*Math.PI/180);
function chileHour(){ try{ if(LIVE&&LIVE.snapshot_utc){ return (new Date(LIVE.snapshot_utc).getUTCHours()+20)%24; } }catch(e){} return (new Date().getUTCHours()+20)%24; }
function nearTerminal(lat,lon,L){ const tl=TLIN[L]; if(!tl||!tl.puntos) return false;
  for(const t of tl.puntos){ if(t.tipo!=="terminal") continue; const dy=(lat-t.lat)*110540, dx=(lon-t.lon)*MXc; if(dx*dx+dy*dy<=150*150) return true; } return false; }
const semColor = r => r==null?"#94a1ba": r>=0.7?"#34d399": r>=0.4?"#fbbf24":"#fb7185";
function renderOpNow(){
  const card=$("opnow-card"); if(!card) return;
  const isLine=state.linea!=="TODAS", isCom=state.comuna!=="TODAS";
  if(state.vista!=="normal" || !LIVE || !LIVE.buses || (!isLine && !isCom)){ card.style.display="none"; return; }
  card.style.display="";
  const h=chileHour();
  let buses=LIVE.buses.filter(b=>b[2]);                       // con línea = en servicio
  if(isLine) buses=buses.filter(b=>b[2]===state.linea);
  if(isCom)  buses=buses.filter(b=>inComuna(b[0],b[1]));
  let calle=0,term=0,ruta=0; const byLine={};
  buses.forEach(b=>{ const mv=b[4];
    if(mv) calle++; else if(nearTerminal(b[0],b[1],b[2])) term++; else ruta++;
    byLine[b[2]]=(byLine[b[2]]||0)+1; });
  const operando=calle+term+ruta;
  const key = isLine ? `TODAS|${state.linea}` : `${state.comuna}|TODAS`;
  const hist=((((T.cells||{})[key]||{}).horas)||[])[h];
  const exp = hist&&hist.b ? hist.b : null;
  const ratio = exp ? operando/exp : null;
  $("opnow-title").textContent = isLine ? `Operación en tiempo real · Línea ${state.linea}` : `Operación en tiempo real · ${state.comuna}`;
  const rect=(l,v,s,col)=>`<div class="kpi"><div class="lab">${l}</div><div class="val"${col?` style="color:${col}"`:""}>${v}</div><div class="sub">${s}</div></div>`;
  let rects = rect("En calle (operando)", calle, "buses en movimiento", "#22d3ee")
    + rect("En terminal", term, "parados en cabecera", "#a78bfa")
    + rect("Detenidos en ruta", ruta, "semáforo / taco");
  if(isCom) rects = rect("Líneas operando", Object.keys(byLine).length, `de ${(CLIN[state.comuna]||[]).length} que operan aquí`, "#38bdf8") + rects;
  $("opnow-rects").innerHTML = rects;
  // semáforo SOLO en vista de línea (su flota está toda afuera => instante ≈ hora). En comuna el
  // histórico cuenta los buses distintos de TODA la hora (de paso) y el ratio instantáneo sesga bajo.
  const sem=$("opnow-semaforo");
  if(isLine && ratio!=null){ const c=semColor(ratio); sem.style.cssText=`margin-left:auto;background:${c}22;color:${c}`;
    sem.textContent = ratio>=0.7?`● normal (${Math.round(ratio*100)}%)`:ratio>=0.4?`▲ bajo (${Math.round(ratio*100)}%)`:`▲ muy bajo (${Math.round(ratio*100)}%)`; }
  else if(isCom){ sem.style.cssText="margin-left:auto;background:#38bdf822;color:#38bdf8"; sem.textContent=`${Object.keys(byLine).length} líneas activas`; }
  else { sem.style.cssText="margin-left:auto;background:#94a1ba22;color:#94a1ba"; sem.textContent="sin referencia"; }
  // desglose por línea (vista comuna)
  if(isCom){ const rows=Object.entries(byLine).sort((a,b)=>b[1]-a[1]);
    $("opnow-lines").innerHTML = `<div class="hint" style="margin-bottom:4px">Buses operando ahora por línea</div>`+
      rows.map(([l,c])=>`<span style="display:inline-block;margin:2px 6px 2px 0;padding:2px 7px;border-radius:999px;background:var(--track);font-size:11px"><b style="font-family:var(--mono)">${l}</b> ${c}</span>`).join("");
  } else $("opnow-lines").innerHTML="";
  const ref = exp ? (isLine ? ` · típico a las ${h}h ≈ <b>${fmt1(exp)}</b> buses (laborable)` : ` · en una hora laborable circulan ≈ <b>${fmt1(exp)}</b> buses distintos por la comuna`) : "";
  $("opnow-narr").innerHTML = `<b>${operando}</b> buses con servicio ahora${ref}. "En calle" = en movimiento; "en terminal" = parados en cabecera (no es falla); "detenidos en ruta" = semáforo o taco. <span style="color:var(--dim)">Inactivos (flota que no salió hoy) requiere acumular el día en el capturador — pendiente.</span>`;
}
function loadLive(){
  fetch(LIVE_URL+"?t="+Date.now(),{cache:"no-store"}).then(r=>r.json())
    .then(d=>{ LIVE=d; drawLiveBuses(); renderOpNow(); }).catch(()=>{});
}
function drawLiveBuses(){
  if(!liveLayer) return;
  liveLayer.clearLayers();
  const badge=$("live-count");
  if(!LIVE || !LIVE.buses){ if(badge) badge.textContent="geo en línea"; return; }
  let n=0;
  LIVE.buses.forEach(b=>{
    const lat=b[0], lon=b[1], ln=b[2], spd=b[3], mv=b[4];
    if(!ln) return;                                      // sin línea = fuera de servicio -> no es "operando"
    if(state.linea!=="TODAS" && ln!==state.linea) return;
    if(!inComuna(lat,lon)) return;                       // en vista de comuna, solo los de la comuna
    n++;
    L.circleMarker([lat,lon],{renderer:liveCanvas, radius: mv?3.2:2.5, weight:0,
      fillColor: mv?"#22d3ee":"#f59e0b", fillOpacity: mv?0.95:0.65})
      .bindTooltip(`Línea ${ln||"—"} · ${spd} km/h${mv?"":" · detenido"}`,{direction:"top"}).addTo(liveLayer);
  });
  if(badge) badge.textContent = n>0 ? (NF.format(n)+" buses operando ahora") : "sin buses en vivo";
}

/* ---------- KPI territorial: cobertura / acceso / espera / NSE (choropleth) ---------- */
const accColor  = m => `hsl(${120-120*Math.min(m/12,1)},72%,50%)`;        // verde 0min -> rojo 12+
const waitColor = m => m==null ? "#7f1d1d" : `hsl(${120-120*Math.min(m/3,1)},72%,50%)`;   // verde 0min -> rojo 3+ (espera hacia destinos)
const daccColor = v => v==null ? "#475569" : `hsl(${1.2*Math.max(0,Math.min(v,100))},70%,50%)`;   // % destinos alcanzables: rojo bajo -> verde alto
const tbiColor  = v => v==null ? "#475569" : `hsl(${120-1.2*Math.max(0,Math.min(v,100))},75%,50%)`; // intensidad transbordo: verde 0 -> rojo 100
let NSE_LO=null, NSE_HI=null;
function nseColor(v){
  if(v==null) return "#475569";
  if(NSE_LO==null){ const a=COB.features.map(f=>f.properties.nse).filter(x=>x>0).sort((x,y)=>x-y);
    NSE_LO=Math.log(a[Math.floor(a.length*.05)]); NSE_HI=Math.log(a[Math.floor(a.length*.95)]); }
  const t=Math.min(Math.max((Math.log(v)-NSE_LO)/(NSE_HI-NSE_LO),0),1);
  return `hsl(${205-175*t},68%,52%)`;                                      // azul (bajo) -> ámbar (alto)
}
const accSColor = m => m==null ? "#555b6b" : `hsl(${120-120*Math.min(m/25,1)},72%,50%)`;  // 0min verde -> 25+ rojo
const congSpeedColor = v => `hsl(${Math.max(0,Math.min((v-10)/20,1))*120},75%,50%)`;   // velocidad EFECTIVA: <=10 rojo -> >=30 verde
const cvColor = cv => cv==null ? "#475569" : `hsl(${120-120*Math.min(Math.max((cv-0.4)/0.6,0),1)},75%,50%)`; // CV 0.4 regular(verde) -> 1.0+ apelotonado(rojo)
function periodCellSpeeds(){            // velocidad media por celda en el período elegido
  const hrs = PERIODO_H[state.periodo] || GRID.horas;
  const n = GRID.cells.length, sp = new Array(n).fill(0);
  for(let i=0;i<n;i++){ let s=0,k=0;
    for(const h of hrs){ const v=(GRID.vel[String(h)]||[])[i]; if(v>0){s+=v;k++;} }
    sp[i] = k>0 ? s/k : 0;
  }
  return sp;
}
function drawCongestion(){
  if(!coverLayer) return; coverLayer.clearLayers();
  if(!GRID){ setCoverLegend("conges"); return; }
  const lbl = periodoLbl(state.periodo);
  if(CONGRED && CONGRED.roads){       // RED CONTINUA: velocidad drapeada sobre cada calle
    const cs = periodCellSpeeds();
    CONGRED.roads.forEach(rd=>{
      const P=rd.p, C=rd.c;
      for(let i=0;i<P.length-1;i++){
        const a=C[i], b=C[i+1];
        if(a<0||b<0) continue;
        const va=cs[a], vb=cs[b];
        if(!(va>0)||!(vb>0)) continue;
        if(!inComuna((P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2)) continue;
        const m=(va+vb)/2;
        L.polyline([P[i],P[i+1]],{renderer:coverCanvas,color:congSpeedColor(m),weight:3.6,opacity:.85,lineCap:"round"})
          .bindTooltip(`${rd.n?rd.n+" · ":""}${Math.round(m)} km/h (${lbl})`,{sticky:true}).addTo(coverLayer);
      }
    });
    setCoverLegend("conges"); return;
  }
  const hrs = PERIODO_H[state.periodo] || GRID.horas;   // fallback: celdas discretas
  GRID.cells.forEach((c,i)=>{
    if(!inComuna(c[0],c[1])) return;
    const sp = hrs.map(h=>(GRID.vel[String(h)]||[])[i]).filter(v=>v>0);
    if(sp.length<1) return;
    const mean = sp.reduce((a,b)=>a+b,0)/sp.length;
    L.circleMarker([c[0],c[1]],{renderer:coverCanvas,radius:4.2,weight:0,fillColor:congSpeedColor(mean),fillOpacity:.62})
      .bindTooltip(`velocidad ${Math.round(mean)} km/h (${lbl})`,{sticky:true}).addTo(coverLayer);
  });
  setCoverLegend("conges");
}
function congDetColor(t){ // t=0..1 (severidad) -> ámbar a rojo
  const h = 45 - 45*Math.min(1,t); return `hsl(${h},85%,52%)`;
}
function drawDetenciones(){
  if(!coverLayer) return; coverLayer.clearLayers();
  const cong = (DET2||[]).filter(d=>inComuna(d.la,d.lo));
  const terms = ((TERM&&TERM.terminales)||[]).filter(t=>inComuna(t.la,t.lo));
  // congestión: nodos reales de demora (terminales ya excluidos en el dato)
  if(cong.length){
    const mx=Math.max(...cong.map(d=>d.det));
    cong.forEach(d=>{
      const r=6+22*Math.sqrt(d.det/mx);
      L.circleMarker([d.la,d.lo],{renderer:coverCanvas,radius:r,weight:1,color:"rgba(0,0,0,.35)",fillColor:congDetColor(d.det/mx),fillOpacity:.6})
        .bindTooltip(`<b>${d.calle||d.tipo}</b> · ${d.comuna||""}<br>${d.tipo}<br>Tiempo detenido: ${fmt(d.det)} pulsos · ${d.buses} buses distintos`,{sticky:true}).addTo(coverLayer);
    });
  }
  // terminales / cabeceras: capa distinta con flota por línea
  terms.forEach(t=>{
    const dom = (t.lineas&&t.lineas[0]) ? t.lineas[0].linea : "T";
    const rows = (t.lineas||[]).map(l=>`<tr><td style="padding:0 8px 0 0">Línea ${l.linea}</td><td style="text-align:right"><b>${l.buses}</b> buses</td></tr>`).join("");
    const icon = L.divIcon({className:"term-ic",html:`<div class="term-box">▣ ${dom}</div>`,iconSize:[36,18],iconAnchor:[18,9]});
    L.marker([t.la,t.lo],{icon,zIndexOffset:500}).bindTooltip(
      `<b>Terminal / cabecera · ${t.comuna||""}</b><br>Flota que opera desde aquí:<table style="margin-top:3px">${rows}</table>`,
      {sticky:true,direction:"top"}).addTo(coverLayer);
  });
  setCoverLegend("det");
}
function drawBunching(){
  if(!coverLayer) return; coverLayer.clearLayers();
  const per = RFREQ && RFREQ.per && RFREQ.per[state.periodo];
  if(!CONGRED || !CONGRED.roads || !per){ setCoverLegend("bunch"); return; }
  const CV = per.cv, F = per.f, lbl = periodoLbl(state.periodo);
  CONGRED.roads.forEach(rd=>{
    const P=rd.p, C=rd.c;
    for(let i=0;i<P.length-1;i++){
      const a=C[i], b=C[i+1];
      if(a<0||b<0) continue;
      const ca=CV[a], cb=CV[b];
      if(ca==null||cb==null) continue;
      if(!inComuna((P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2)) continue;
      const cv=(ca+cb)/2, f=((F[a]||0)+(F[b]||0))/2;
      L.polyline([P[i],P[i+1]],{renderer:coverCanvas,color:cvColor(cv),weight:3.6,opacity:.85,lineCap:"round"})
        .bindTooltip(`${rd.n?rd.n+" · ":""}CV ${cv.toFixed(2)} · ${Math.round(f)} bus/h del eje (${lbl})<br>${cv>0.7?"buses apelotonados":cv>0.5?"regularidad media":"servicio regular"}`,{sticky:true}).addTo(coverLayer);
    }
  });
  setCoverLegend("bunch");
}
function drawCoverage(mode){
  if(mode==="conges"){ drawCongestion(); return; }
  if(mode==="bunch"){ drawBunching(); return; }
  if(mode==="det"){ drawDetenciones(); return; }
  if(!coverLayer) return; coverLayer.clearLayers();
  if(!COB) return;
  COB.features.forEach(f=>{
    const p=f.properties, cc=f.geometry.coordinates[0];
    if(!inComuna(p.cy!=null?p.cy:(cc[0][1]+cc[2][1])/2, p.cx!=null?p.cx:(cc[0][0]+cc[2][0])/2)) return;
    const pu = state.purpose||"all";
    const dG = k => (p[k] && typeof p[k]==="object") ? p[k][pu] : p[k];   // lee dacc/ddir/dtr/tbi por propósito (compat)
    let col;
    if(mode==="cover") col = daccColor(dG("dacc"));                       // % destinos alcanzables (EOD, por propósito)
    else if(mode==="trans") col = tbiColor(dG("tbi"));                    // intensidad de transbordo
    else if(mode==="wait") col = waitColor(p.waitd ? p.waitd[pu][state.periodo] : null);
    else if(mode==="salud") col = accSColor(p.salud);
    else if(mode==="edu") col = accSColor(p.edu);
    else col = nseColor(p.nse);
    const ll=f.geometry.coordinates[0].map(c=>[c[1],c[0]]);
    const tipAcc = `destinos (${purposeLbl(pu)}): <b>${dG("dacc")??"—"}%</b> alcanzable · ${dG("ddir")??"—"}% directo · ${dG("dtr")??0}% con transbordo`;
    const per = state.periodo;
    const wd = p.waitd ? p.waitd[pu][per] : null, wf = p.wait ? p.wait[per] : null;
    const tip = (mode==="cover"||mode==="trans")
      ? `${NF.format(p.n)} viviendas · acceso ${p.acc} min<br>${tipAcc}`
      : (mode==="wait")
      ? `${NF.format(p.n)} viviendas · ${periodoLbl(per)} · ${purposeLbl(pu)}<br>espera hacia destinos: <b>${wd==null?"sin servicio":wd+" min"}</b> · al primer bus ${wf==null?"—":wf+" min"}`
      : `${NF.format(p.n)} viviendas · acceso ${p.acc} min · espera ${wf==null?"sin servicio":wf+" min"}<br>a salud ${p.salud??"—"} min · a educación ${p.edu??"—"} min`;
    L.polygon(ll,{renderer:coverCanvas,stroke:false,fillColor:col,fillOpacity:.55})
      .bindTooltip(tip,{sticky:true})
      .addTo(coverLayer);
  });
  // destinos EOD: SOLO en Transbordo van coloreados por exigencia (es su métrica). En Cobertura
  // van como anillos neutros (solo ubicación + tamaño=demanda) para no competir con el coropleto.
  if(DEST && DEST.destinos && (mode==="cover"||mode==="trans")){
    const pu = state.purpose||"all", fld = PURP_FIELD[pu];
    const ds = DEST.destinos.filter(d=>(d[fld]||0)>0);
    const mxv = Math.max(1, ...ds.map(d=>d[fld]||0));
    ds.forEach(d=>{
      if(!inComuna(d.lat,d.lon)) return;
      const r = 5+12*Math.sqrt((d[fld]||0)/mxv);
      const st = mode==="trans"
        ? {radius:r,weight:1.5,color:"#0b1220",fillColor:tbiColor(d.pct_trans),fillOpacity:.92}
        : {radius:r,weight:2,color:"#dbe6ff",fillColor:"#0b1220",fillOpacity:.25};   // neutro en cobertura
      const extra = mode==="trans" ? `<br>exige transbordo al <b>${d.pct_trans??0}%</b> del territorio · ${d.nlineas_dir} líneas directas` : "";
      L.circleMarker([d.lat,d.lon],{renderer:coverCanvas,...st})
        .bindTooltip(`<b>Destino · ${d.voc}</b> · ${d.comuna}<br>${NF.format(d[fld]||0)} viajes de ${purposeLbl(pu)} (EOD 2015)${extra}`,
        {sticky:true,direction:"top"}).addTo(coverLayer);
    });
  }
  // PARADEROS en el modo Espera: punto con su tiempo de espera al pasar el cursor
  if(mode==="wait" && PESP && PESP.stops){
    PESP.stops.forEach(s=>{
      if(!inComuna(s.la,s.lo)) return;
      const w = s.wait ? s.wait[state.periodo] : null;
      L.circleMarker([s.la,s.lo],{renderer:coverCanvas,radius:3,weight:1,color:"#0b1220",
        fillColor:waitColor(w),fillOpacity:.95})
        .bindTooltip(`<b>Paradero</b> · ${s.nl} línea${s.nl===1?"":"s"}<br>espera ${w==null?"sin servicio":`<b>${w} min</b>`} (${periodoLbl(state.periodo)})`,
        {direction:"top"}).addTo(coverLayer);
    });
  }
  // equipamiento sensible (salud/educación) SOLO en sus propios modos
  if(COB.sensibles && (mode==="salud"||mode==="edu")){
    COB.sensibles.forEach(s=>{
      const isS=s[2]==="SALUD";
      if(mode==="salud"&&!isS) return; if(mode==="edu"&&isS) return;
      if(!inComuna(s[0],s[1])) return;
      L.circleMarker([s[0],s[1]],{renderer:coverCanvas,radius:3.4,weight:1,color:"#fff",
        fillColor:isS?"#f43f5e":"#a78bfa",fillOpacity:.95})
        .bindTooltip(isS?"Salud":"Educación",{direction:"top"}).addTo(coverLayer);
    });
  }
  setCoverLegend(mode);
}
function setCoverLegend(mode){
  if(coverLegend){ lmap.removeControl(coverLegend); coverLegend=null; }
  if(!mode) return;
  const RYG = `<span class="grad" style="background:linear-gradient(90deg,hsl(120,72%,50%),hsl(60,72%,50%),hsl(0,72%,50%))"></span>`;
  const GYR = `<span class="grad" style="background:linear-gradient(90deg,hsl(0,70%,50%),hsl(60,70%,50%),hsl(120,70%,50%))"></span>`;
  const txt = mode==="cover" ? ["% de destinos EOD alcanzables (≤1 transbordo)",GYR,"<span class='lbls'><i>0%</i><i>50%</i><i>100%</i></span><span class='par'>color de la manzana = accesibilidad · ○ destino (tamaño = demanda)</span>"]
    : mode==="trans" ? ["Intensidad de transbordo (% de lo alcanzable)",RYG,"<span class='lbls'><i>0%</i><i>50%</i><i>100%</i></span><span class='par'>verde = directo · rojo = exige transbordo</span>"]
    : mode==="wait" ? [`Espera hacia destinos · ${periodoLbl(state.periodo)} (min)`,RYG,"<span class='lbls'><i>0</i><i>1.5</i><i>3+</i></span><span class='par'>manzana = espera a destinos · ● paradero = espera ahí (hover)</span>"]
    : mode==="salud" ? ["Tiempo a salud en transporte (min)",RYG,"<span class='lbls'><i>0</i><i>12</i><i>25+</i></span><span class='par' style='color:#f43f5e'>● centro de salud</span>"]
    : mode==="edu" ? ["Tiempo a educación en transporte (min)",RYG,"<span class='lbls'><i>0</i><i>12</i><i>25+</i></span><span class='par' style='color:#a78bfa'>● colegio</span>"]
    : mode==="conges" ? [`Velocidad efectiva · ${periodoLbl(state.periodo)} (km/h)`,`<span class="grad" style="background:linear-gradient(90deg,hsl(0,75%,50%),hsl(60,75%,50%),hsl(120,75%,50%))"></span>`,"<span class='lbls'><i>≤10</i><i>20</i><i>30+</i></span><span class='par'>incluye el tiempo detenido en tránsito</span>"]
    : mode==="bunch" ? [`Apelotonamiento · ${periodoLbl(state.periodo)} (CV de headways)`,`<span class="grad" style="background:linear-gradient(90deg,hsl(120,75%,50%),hsl(60,75%,50%),hsl(0,75%,50%))"></span>`,"<span class='lbls'><i>regular</i><i></i><i>apelotonado</i></span><span class='par'>CV alto = buses pegados unos a otros</span>"]
    : mode==="det" ? ["Congestión: nodos de demora (sin terminales)",`<span class="grad" style="background:linear-gradient(90deg,hsl(45,85%,52%),hsl(0,85%,52%))"></span>`,"<span class='lbls'><i>menor</i><i>mayor</i></span><span class='par'><b style='color:#22d3ee'>▣</b> terminal · flota por línea al pasar</span>"]
    : ["NSE (avalúo CLP/m²)",`<span class="grad" style="background:linear-gradient(90deg,hsl(205,68%,52%),hsl(118,68%,52%),hsl(30,68%,52%))"></span>`,"<span class='lbls'><i>bajo</i><i></i><i>alto</i></span>"];
  coverLegend = L.control({position:"bottomleft"});
  coverLegend.onAdd = ()=>{ const d=L.DomUtil.create("div","speedleg"); d.innerHTML=`<b>${txt[0]}</b>${txt[1]}${txt[2]}`; return d; };
  coverLegend.addTo(lmap);
}
function buildMapModes(){
  const box=$("map-mode"); if(!box) return;
  box.innerHTML = MAP_MODES.map(([k,l])=>`<b data-m="${k}" class="${state.mapMode===k?"on":""}">${l}</b>`).join("");
  box.querySelectorAll("b").forEach(el=>el.onclick=()=>{ state.mapMode=el.dataset.m;
    box.querySelectorAll("b").forEach(b=>b.classList.toggle("on",b.dataset.m===state.mapMode)); render(); });
}
function setSpeedLegend(on){
  if(on && !speedLegend){
    speedLegend = L.control({position:"bottomleft"});
    speedLegend.onAdd = ()=>{ const d=L.DomUtil.create("div","speedleg");
      d.innerHTML = `<b>Velocidad km/h</b><span class="grad"></span>`+
        `<span class="lbls"><i>8</i><i>18</i><i>28+</i></span><span class="par">● paradero</span>`;
      return d; };
    speedLegend.addTo(lmap);
  } else if(!on && speedLegend){ lmap.removeControl(speedLegend); speedLegend=null; }
}
function renderMapa(){
  ensureMap();
  comunaLayer.clearLayers(); routeLayer.clearLayers(); stopLayer.clearLayers();
  setTimeout(()=>lmap.invalidateSize(),120);
  // límites comunales: al elegir comuna, enfocar en ella y atenuar fuerte las vecinas
  const feats = (GEO.features||[]);
  const comActiva = state.comuna!=="TODAS";
  feats.forEach(f=>{
    const sel = f.properties.name===state.comuna;
    if(comActiva && !sel){
      L.geoJSON(f,{style:{color:"rgba(148,161,186,.14)",weight:0.6,fill:false}}).addTo(comunaLayer);   // vecina atenuada
    } else {
      L.geoJSON(f,{style:{color:sel?"#38bdf8":"rgba(148,161,186,.4)",weight:sel?2.6:1,fill:sel,fillColor:"#38bdf8",fillOpacity:sel?0.05:0}}).addTo(comunaLayer);
    }
  });
  let bounds=[];
  setSpeedLegend(state.linea!=="TODAS" && !!GEOM[state.linea]);
  if(state.linea!=="TODAS" && GEOM[state.linea]){
    GEOM[state.linea].forEach(seg=>{
      const p=seg.p, v=seg.v||[];
      // colorear por velocidad map-matched, segmento a segmento
      for(let i=0;i<p.length-1;i++){
        const a=v[i], b=v[i+1];
        const sv = (a!=null&&b!=null)?(a+b)/2 : (a!=null?a:b);
        L.polyline([p[i],p[i+1]],{color:speedColor(sv),weight:4,opacity:0.92}).addTo(routeLayer);
      }
      bounds.push(...p);
    });
    // paraderos oficiales de la línea
    const ps = PAR[state.linea]||[];
    ps.forEach(s=>{
      L.circleMarker([s[0],s[1]],{radius:3.2,color:"#0b1220",weight:1,fillColor:"#e2e8f0",fillOpacity:0.95})
        .bindTooltip(s[2],{direction:"top"}).addTo(stopLayer);
    });
    // TERMINALES y cabeceras de la línea (▣ = terminal con dwell; ◇ = cabecera de ruta)
    const tl = TLIN[state.linea];
    if(tl && tl.puntos){
      tl.puntos.forEach(t=>{
        if(t.tipo==="terminal"){
          const icon=L.divIcon({className:"term-ic",html:`<div class="term-box">▣ Terminal</div>`,iconSize:[58,18],iconAnchor:[29,9]});
          L.marker([t.lat,t.lon],{icon,zIndexOffset:600}).bindTooltip(
            `<b>Terminal · Línea ${state.linea}</b><br>${NF.format(t.det)} pulsos detenidos · ${t.buses} buses<br>intensidad ${t.intens} (reposo por bus/día)<br><span style="color:#fbbf24">se excluye del análisis en ruta</span>`,
            {sticky:true,direction:"top"}).addTo(routeLayer);
        } else {
          L.circleMarker([t.lat,t.lon],{radius:6,weight:2,color:"#38bdf8",fillColor:"#0b1220",fillOpacity:.5})
            .bindTooltip(`Cabecera de ruta · Línea ${state.linea}`,{direction:"top"}).addTo(routeLayer);
        }
      });
    }
    const nrec = new Set(GEOM[state.linea].map(s=>s.rec)).size;
    $("map-title").textContent = `Línea ${state.linea} · ${nrec} recorrido${nrec>1?"s":""} · ${ps.length} paraderos · color = velocidad`;
  } else if(state.comuna!=="TODAS"){
    const f = feats.find(x=>x.properties.name===state.comuna);
    if(f){ const gl=L.geoJSON(f); bounds = gl.getBounds(); }
    $("map-title").textContent = `Comuna · ${state.comuna}`;
  } else {
    const gl = L.geoJSON({type:"FeatureCollection",features:feats}); bounds = gl.getBounds();
    $("map-title").textContent = "Mapa del sistema";
  }
  const fitScope = state.linea+"|"+state.comuna;
  if(fitScope!==lastFitScope){ lastFitScope=fitScope;
    try{ if(bounds && (bounds.length||bounds.isValid&&bounds.isValid())) lmap.fitBounds(bounds,{padding:[20,20]}); }catch(e){}
  }
  // capas territoriales disponibles en SISTEMA y en COMUNA (eje territorial); en vista de LÍNEA no
  const territorial = state.linea==="TODAS";
  const ambito = state.comuna==="TODAS" ? "el Gran Concepción" : state.comuna;
  const seg = $("map-mode"); if(seg) seg.style.display = territorial ? "" : "none";
  if(territorial && state.mapMode!=="live"){
    liveLayer.clearLayers();
    drawCoverage(state.mapMode);
    const b=$("live-count"), R=(COB&&COB.resumen)||{};
    const M=state.mapMode;
    const titulo = {cover:"Cobertura: destinos alcanzables",trans:"Dependencia de transbordo",wait:`Espera hacia destinos · ${periodoLbl(state.periodo)}`,
      conges:`Velocidad efectiva por arco · ${periodoLbl(state.periodo)}`, bunch:`Apelotonamiento (bunching) · ${periodoLbl(state.periodo)}`, det:"Congestión y terminales",
      salud:"Accesibilidad a salud en transporte",edu:"Accesibilidad a educación en transporte",nse:"Nivel socioeconómico (avalúo)"}[M];
    // resumen sólo a nivel sistema (COB.resumen es de todo el GC); en comuna, etiqueta de ámbito
    const badgeSys = {cover:`${R.dacc_medio??"—"}% de la demanda-destino EOD es alcanzable (≤1 transbordo) · destinos dimensionados por viajes`,
      trans:`intensidad de transbordo media ${R.tbi_medio??"—"}% · rojo = zonas/destinos que exigen transbordo (integración modal/tarifaria)`,
      wait:`espera media hacia destinos ${(R.waitd_medio&&R.waitd_medio[state.periodo])??"—"} min · frecuencia real observada · cambia con el período`,
      conges:`velocidad efectiva (incluye detenido en tránsito) en ${periodoLbl(state.periodo)} · rojo = ejes lentos`,
      bunch:`regularidad de los buses (CV de headways) en ${periodoLbl(state.periodo)} · rojo = se apelotonan ⇒ peor espera efectiva`,
      det:`${DET2.length} nodos de congestión (sin terminales) · ${(TERM&&TERM.terminales||[]).length} terminales detectados`,
      salud:`tiempo mediano a salud: ${R.salud_med} min`, edu:`tiempo mediano a educación: ${R.edu_med} min`,
      nse:"avalúo m² · azul bajo → ámbar alto"}[M];
    if(b) b.textContent = state.comuna==="TODAS" ? (badgeSys||"") : `${titulo} · ${state.comuna}`;
    $("map-title").textContent = (titulo||"Mapa territorial") + (state.comuna==="TODAS"?"":` · ${state.comuna}`);
  } else {
    if(coverLayer) coverLayer.clearLayers(); setCoverLegend(null);
    drawLiveBuses();
  }
  renderNarrative();
}

/* ---------- relato dinámico del mapa (qué busca el KPI + lectura de datos del ámbito) ---------- */
function scopeWavg(getter){            // promedio ponderado por viviendas sobre las manzanas del ámbito
  if(!COB||!COB.features) return null;
  let sw=0, n=0;
  for(const f of COB.features){ const p=f.properties; if(!inComuna(p.cy,p.cx)) continue;
    const v=getter(p); if(v==null) continue; const w=p.n||1; sw+=v*w; n+=w; }
  return n? sw/n : null;
}
function renderNarrative(){
  const el=$("map-narrative"); if(!el) return;
  if(state.vista!=="normal"){ el.innerHTML=""; return; }
  if(state.linea!=="TODAS"){
    const tl=TLIN[state.linea];
    if(tl && tl.puntos){
      const nt=tl.puntos.filter(p=>p.tipo==="terminal").length, d=tl.dist||{};
      const dist = (d.share_terminal>=8)
        ? ` El <b>% de tiempo detenido que muestra la página ya está corregido</b> (en ruta): <b>${d.det_corr}%</b>. Sin excluir el dwell de terminal sería <b>${d.det_raw}%</b> — es decir, el <b style="color:#fbbf24">${d.share_terminal}%</b> de su "detenido" era estar parado en cabecera, no demora en marcha.`
        : ` Su dwell de terminal es bajo (${d.share_terminal??0}% del detenido): su tiempo detenido (${d.det_corr}%) es casi todo demora en ruta.`;
      el.innerHTML = `<b>Terminales de la línea ${state.linea}</b>: ${nt} terminal${nt===1?"":"es"} de alto reposo (▣) y sus cabeceras de ruta (◇), detectados desde el GPS.${dist} La velocidad media no se afecta (ya excluye los buses parados); toda la página reporta el <b>% detenido en ruta</b>.`;
    } else el.innerHTML="";
    return;
  }
  const M=state.mapMode, amb = state.comuna==="TODAS"?"el Gran Concepción":state.comuna;
  const pu=state.purpose||"all", per=state.periodo, pl=purposeLbl(pu);
  const pe = pu!=="all" ? ` de ${pl}` : "";
  let txt="";
  if(M==="cover"){
    const v=scopeWavg(p=>p.dacc&&p.dacc[pu]);
    txt=`<b>Cobertura</b> mide qué % de los <b>destinos reales</b> de la ciudad (matriz EOD) puede alcanzar cada manzana en transporte público con a lo más un transbordo, ponderado por los viajes${pe}. Verde = manzana bien conectada con sus destinos; rojo = aislada. ${v!=null?`En ${amb}, en promedio el <b>${v.toFixed(0)}%</b> de la demanda-destino es alcanzable. `:""}Va más allá de "¿hay un paradero cerca?": pregunta si el bus que pasa te lleva a donde la gente realmente viaja.`;
  } else if(M==="trans"){
    const v=scopeWavg(p=>p.tbi&&p.tbi[pu]);
    txt=`<b>Transbordo</b> muestra cuánto de la demanda alcanzable <b>obliga a combinar dos buses</b>${pe}. Verde = llegas directo; rojo = dependes de transbordar (hoy = pagar dos pasajes). ${v!=null?`En ${amb}, la intensidad media de transbordo es <b>${v.toFixed(0)}%</b>. `:""}Es el insumo central para proponer <b>integración modal y tarifaria</b>: las zonas rojas son las que más se beneficiarían.`;
  } else if(M==="wait"){
    const v=scopeWavg(p=>p.waitd&&p.waitd[pu]&&p.waitd[pu][per]);
    txt=`<b>Espera</b> estima el tiempo efectivo de espera hacia los destinos${pe}: ½·intervalo·(1+CV²), con la <b>frecuencia real en el sentido que va hacia el destino</b> (un bus en dirección contraria no cuenta) y penalizando el <b>apelotonamiento</b>. ${v!=null?`Media en ${amb} (${periodoLbl(per)}): <b>${v.toFixed(1)} min</b>. `:""}Cambia con el período — compara punta y fuera de punta.`;
  } else if(M==="conges"){
    const v=GRID?(function(){const cs=periodCellSpeeds().filter(x=>x>0);return cs.length?cs.reduce((a,b)=>a+b,0)/cs.length:null;})():null;
    txt=`<b>Congestión</b>: <b>velocidad efectiva</b> de los buses por arco de la red en <b>${periodoLbl(per)}</b> — incluye el <b>tiempo detenido en tránsito</b> (semáforos, tacos), no solo cuando el bus avanza, por eso revela la congestión real. Rojo = ejes lentos. ${v!=null?`Velocidad efectiva media: <b>${v.toFixed(1)} km/h</b>. `:""}Cambia con el período para ver dónde y cuándo aparece.`;
  } else if(M==="bunch"){
    txt=`<b>Bunching</b>: regularidad de los intervalos entre buses (CV de los headways) medida en puntos de la red, en <b>${periodoLbl(per)}</b>. Verde = buses parejos; rojo = <b>apelotonados</b> (vienen pegados y luego un hueco largo) → peor espera efectiva aguas abajo. Es la huella de la congestión sobre la frecuencia.`;
  } else if(M==="det"){
    txt=`<b>Detenciones</b>: nodos donde los buses pasan más tiempo detenidos, <b>excluyendo los terminales</b> (que distorsionan por la espera de cabecera). Los círculos ámbar→rojo son cuellos de demora en marcha; las cajas <b>▣</b> cyan son terminales, con su flota por línea al pasar el cursor.`;
  } else if(M==="salud"||M==="edu"){
    const v=scopeWavg(p=>M==="salud"?p.salud:p.edu);
    txt=`Tiempo de viaje en transporte público desde cada manzana al ${M==="salud"?"<b>centro de salud</b>":"<b>establecimiento educacional</b>"} más cercano (caminata + espera + bus). ${v!=null?`Mediana ${amb}: <b>${v.toFixed(0)} min</b>. `:""}Verde = cerca en tiempo real de viaje; rojo = lejos.`;
  } else if(M==="nse"){
    txt=`<b>Nivel socioeconómico</b> por manzana (avalúo del suelo como proxy). No es un KPI de transporte en sí: sirve para <b>cruzarlo</b> con cobertura, transbordo y espera y evaluar <b>equidad territorial</b> — ¿las zonas más vulnerables tienen peor servicio?`;
  } else if(M==="live"){
    const n=(LIVE&&LIVE.length)||0;
    txt=`<b>En vivo</b>: posición de los buses operando en este momento (GTFS-RT). Cyan = en movimiento, ámbar = detenido. ${n?`Ahora mismo: <b>${NF.format(n)}</b> buses. `:""}Es la foto operacional instantánea del sistema.`;
  }
  el.innerHTML = txt;
}

function renderRanking(){
  const box = $("rank-box"), hint = $("rank-hint");
  let rows;
  if(state.linea==="TODAS"){
    hint.textContent = state.comuna==="TODAS" ? "líneas con más actividad en el sistema" : `líneas con más actividad en ${state.comuna}`;
    rows = (T.lineas||[]).map(l=>{const c=T.cells[`${state.comuna}|${l.linea}`];return c&&c.kpi?{id:l.linea,nm:l.empresa,v:c.kpi.pulsos}:null;}).filter(Boolean);
  } else {
    hint.textContent = `comunas donde opera la línea ${state.linea}`;
    rows = (GEO.features||[]).map(f=>{const c=T.cells[`${f.properties.name}|${state.linea}`];return c&&c.kpi?{id:f.properties.name,nm:"",v:c.kpi.pulsos}:null;}).filter(Boolean);
  }
  rows.sort((a,b)=>b.v-a.v); rows=rows.slice(0,12);
  if(!rows.length){ box.innerHTML=`<div class="empty">Sin datos.</div>`; return; }
  const mx = rows[0].v;
  box.innerHTML = rows.map((r,i)=>`<div class="rank-row" ${state.linea==="TODAS"?`data-l="${r.id}"`:""}>
    <span class="rk">${i+1}</span>
    <span style="min-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${state.linea==="TODAS"?`<b style="font-family:var(--mono)">${r.id}</b> ${r.nm}`:r.id}</span>
    <span class="bar"><i style="width:${Math.round(100*r.v/mx)}%"></i></span>
    <span class="val">${(r.v/1e6).toFixed(1)}M</span></div>`).join("");
  if(state.linea==="TODAS") box.querySelectorAll(".rank-row").forEach(el=>el.onclick=()=>{state.linea=el.dataset.l;render();});
  const el=$("rank-narr");
  if(el) el.innerHTML = state.linea==="TODAS"
    ? `Líneas ordenadas por <b>actividad</b> (millones de registros GPS) en ${state.comuna==="TODAS"?"el sistema":state.comuna}. Aproxima qué líneas mueven más servicio aquí; clic en una para abrirla.`
    : `Comunas donde la línea <b>${state.linea}</b> registra más actividad — dónde concentra su operación.`;
}

const DIAS = {L:"Laborable", S:"Sábado", D:"Domingo"};
const cumpCol = c => c==null ? "#64748b" : c>=120 ? "#22d3ee" : c>=95 ? "#34d399" : c>=80 ? "#fbbf24" : "#fb7185";
function cumpBar(c){
  const col = cumpCol(c), w = c==null?0:Math.min(c,120)/120*100;
  return `<span class="bar" style="flex:0 0 84px;height:7px;border-radius:4px;background:var(--track);overflow:hidden;position:relative">
     <i style="display:block;height:100%;width:${w}%;background:${col}"></i>
     <i style="position:absolute;left:${100/120*100}%;top:0;width:1px;height:100%;background:var(--line2)"></i></span>`;
}
function renderCump(){
  const box = $("cump-box");
  const L = (CUMP.lineas)||{};
  if(state.linea!=="TODAS"){
    const d = L[state.linea];
    if(!d){ box.innerHTML=`<div class="empty">Sin frecuencia programada (GTFS) para esta línea.</div>`; return; }
    box.innerHTML = ["L","S","D"].map(s=>{
      const c=d.cumpl[s];
      return `<div class="cump-row"><b style="min-width:78px">${DIAS[s]}</b>
        ${cumpBar(c)}
        <span class="pct" style="color:${cumpCol(c)};min-width:46px">${c==null?"—":c+"%"}</span>
        <span class="hint" style="flex:1;text-align:right">${d.obs_dia[s]} obs / ${d.prog_dia[s]} prog</span></div>`;
    }).join("") + `<div class="hint" style="margin-top:8px">Despachos/día observados (GPS) vs programados (GTFS). 100% = línea blanca; &lt;80% = incumplimiento de frecuencia.</div>`;
  } else {
    // en comuna: solo las líneas que operan en ella
    const lineasAmbito = state.comuna==="TODAS" ? null
      : new Set((T.lineas||[]).map(l=>l.linea).filter(ln=>(T.cells||{})[`${state.comuna}|${ln}`]));
    const rows = Object.keys(L).filter(ln=>!lineasAmbito||lineasAmbito.has(ln))
                  .map(ln=>({ln, c:L[ln].cumpl.L, emp:empresaDe(ln)}))
                  .filter(r=>r.c!=null).sort((a,b)=>a.c-b.c).slice(0,12);
    box.innerHTML = rows.map(r=>`<div class="cump-row" data-l="${r.ln}" style="cursor:pointer">
      <b style="font-family:var(--mono);min-width:34px">${r.ln}</b>
      <span style="flex:1;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.emp||""}</span>
      ${cumpBar(r.c)}
      <span class="pct" style="color:${cumpCol(r.c)};min-width:46px">${r.c}%</span></div>`).join("")
      + `<div class="hint" style="margin-top:8px">Cumplimiento de frecuencia día laborable (despachos observados / programados). Menor = peor. Clic para ver la línea.</div>`;
    box.querySelectorAll(".cump-row").forEach(el=>el.onclick=()=>{state.linea=el.dataset.l;render();});
  }
  const el=$("cump-narr");
  if(el){
    if(state.linea!=="TODAS"){
      el.innerHTML=`Mide si la línea <b>despacha los buses que promete</b>: compara los despachos <b>programados</b> (GTFS) con los <b>observados</b> (GPS), por tipo de día. 100% = cumple; &lt;80% = subprestación de frecuencia (la espera real sube).`;
    } else {
      const cs=Object.keys(L).map(ln=>L[ln].cumpl&&L[ln].cumpl.L).filter(c=>c!=null);
      const bajo=cs.filter(c=>c<80).length, prom=cs.length?cs.reduce((a,b)=>a+b,0)/cs.length:null;
      el.innerHTML=`Compara los despachos <b>programados (GTFS)</b> con los <b>observados (GPS)</b> por línea: detecta dónde no se cumple la frecuencia comprometida. ${prom!=null?`Promedio del sistema <b>${prom.toFixed(0)}%</b>; <b>${bajo}</b> líneas bajo 80%.`:""}`;
    }
  }
}

function renderCumpSem(){
  const card = $("cump-sem-card");
  if(state.linea==="TODAS" || !CSEM.lineas[state.linea]){ card.style.display="none"; return; }
  card.style.display="";
  const L = CSEM.lineas[state.linea];
  // toggles
  $("cs-dia").innerHTML = CS_DIAS.map(([k,l])=>`<b data-d="${k}" class="${state.csDia===k?"on":""}">${l}</b>`).join("");
  $("cs-var").innerHTML = CS_VARS.map(v=>`<b data-v="${v.k}" class="${state.csVar===v.k?"on":""}">${v.lbl}</b>`).join("");
  $("cs-dia").querySelectorAll("b").forEach(el=>el.onclick=()=>{state.csDia=el.dataset.d;renderCumpSem();});
  $("cs-var").querySelectorAll("b").forEach(el=>el.onclick=()=>{state.csVar=el.dataset.v;renderCumpSem();});

  const vc = CS_VARS.find(v=>v.k===state.csVar);
  const serie = (L.series[state.csDia]||[]);
  const xs = serie.map(p=>p.wk.slice(5));          // MM-DD
  const ys = serie.map(p=>p[state.csVar]);
  const pr = (L.prog||{})[state.csDia]||{};
  // color por cumplimiento si es %
  const colorOf = y => !vc.pct||y==null ? "#38bdf8" : y>=120?"#22d3ee":y>=95?"#34d399":y>=80?"#fbbf24":"#fb7185";
  const pts = ys.map((y,i)=>({value:y, itemStyle:{color:colorOf(y)}}));
  if(!csChart) csChart = echarts.init($("cs-chart"));
  const th = TH();
  const markLines = vc.ref.length ? {silent:true,symbol:"none",lineStyle:{type:"dashed"},data:[
      {yAxis:80,lineStyle:{color:"rgba(251,113,133,.6)"},label:{formatter:"80% mínimo",color:"#fb7185",position:"insideEndTop",fontSize:10}},
      {yAxis:100,lineStyle:{color:"rgba(52,211,153,.5)"},label:{formatter:"100%",color:"#34d399",position:"insideEndTop",fontSize:10}}
    ]} : undefined;
  csChart.setOption({
    textStyle:{fontFamily:"Inter,sans-serif",color:th.tx},
    grid:{left:46,right:20,top:18,bottom:54,containLabel:true},
    tooltip:{trigger:"axis",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx},
      formatter:p=>{const i=p[0].dataIndex,d=serie[i];return `Semana ${d.wk}<br>${vc.lbl}: <b>${d[state.csVar]??"—"}${vc.suf}</b><br>`+
        `<span style="color:${th.mut}">exp/día ${d.exp} · flota ${d.flota} · ${d.dias} días</span>`;}},
    xAxis:{type:"category",data:xs,axisLabel:{color:th.mut,fontSize:9,rotate:90,interval:2},axisLine:{lineStyle:{color:th.axis}}},
    yAxis:{type:"value",name:vc.pct?"%":vc.lbl,min:0,max:vc.pct?(Math.max(120,Math.ceil((Math.max(...ys.filter(v=>v!=null))||100)/20)*20)):null,
      axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
    series:[{type:"line",data:pts,smooth:false,symbol:"circle",symbolSize:5,
      lineStyle:{width:2,color:"rgba(56,189,248,.5)"},
      areaStyle:vc.pct?{color:"rgba(56,189,248,.06)"}:undefined,
      markLine:markLines}]
  }, true);
  setTimeout(()=>csChart.resize(),60);
  const progTxt = pr.exp ? ` · Programado: ${pr.exp} exp/día, ${pr.horas} h de operación (${pr.span?pr.span[0]+"–"+pr.span[1]+"h":""})` : "";
  $("cs-foot").innerHTML = `<b style="color:var(--muted)">${vc.lbl}:</b> ${vc.desc}.${vc.pct?progTxt:""} Tipo de día: <b>${CS_DIAS.find(d=>d[0]===state.csDia)[1]}</b>.`;
}

/* ---------- KPI línea: equidad de uso de flota (Lorenz + Gini) ---------- */
function renderEquidad(){
  const card=$("eq-flota-card");
  const d = (EQ.lineas||{})[state.linea];
  if(state.linea==="TODAS" || !d){ card.style.display="none"; return; }
  card.style.display="";
  const g=d.gini, col = g>=0.4?"#fb7185":g>=0.25?"#fbbf24":"#34d399";
  $("eq-gini").textContent = `Gini ${g.toFixed(2)}`;
  $("eq-gini").style.cssText = `margin-left:auto;background:${col}22;color:${col}`;
  const th=TH();
  if(!eqChart) eqChart=echarts.init($("eq-chart"));
  eqChart.setOption({
    textStyle:{fontFamily:"Inter,sans-serif",color:th.tx},
    grid:{left:44,right:16,top:18,bottom:34,containLabel:true},
    tooltip:{trigger:"axis",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx},
      formatter:p=>`${Math.round(p[0].value[0]*100)}% de los buses<br>concentra el <b>${Math.round((p[0].value[1])*100)}%</b> del trabajo`},
    xAxis:{type:"value",min:0,max:1,name:"% buses (menos→más usados)",nameLocation:"middle",nameGap:22,
      axisLabel:{color:th.mut,formatter:v=>Math.round(v*100)+"%"},axisLine:{lineStyle:{color:th.axis}},splitLine:{show:false}},
    yAxis:{type:"value",min:0,max:1,name:"% del trabajo",axisLabel:{color:th.mut,formatter:v=>Math.round(v*100)+"%"},splitLine:{lineStyle:{color:th.grid}}},
    series:[
      {type:"line",data:[[0,0],[1,1]],symbol:"none",lineStyle:{type:"dashed",color:th.mut,width:1},silent:true},
      {type:"line",data:d.lorenz,smooth:false,symbol:"none",lineStyle:{width:2.5,color:col},
       areaStyle:{color:col+"22"}}
    ]
  }, true);
  setTimeout(()=>eqChart.resize(),60);
  const interp = g>=0.4?"muy desigual — pocos buses cargan la operación":g>=0.25?"desigualdad moderada":"uso parejo de la flota";
  $("eq-stats").innerHTML = `
    <div style="font-size:13px;line-height:1.9">
      <div><b style="font-family:var(--mono);font-size:22px;color:${col}">${g.toFixed(2)}</b> <span class="hint">Gini de uso (0 = parejo · 1 = concentrado)</span></div>
      <div style="color:${col}">${interp}</div>
      <hr style="border:none;border-top:1px solid var(--line);margin:8px 0">
      <div><b>${d.buses}</b> buses · mediana <b>${d.exp_med}</b> exp · <b>${d.dias_med}</b> días operados${d.km_med!=null?` · <b>${fmt1(d.km_med)} km/día</b> por bus`:""}</div>
      <div>El <b>20% más usado</b> hace el <b style="color:${col}">${d.top20}%</b> del trabajo; el 20% menos usado, solo <b>${d.bot20}%</b>.</div>
      <div class="hint">Rango por bus: ${d.exp_min}–${d.exp_max} expediciones${d.km_max!=null?` · hasta ${fmt1(d.km_max)} km/día`:""} en el período.</div>
    </div>`;
  const en=$("eq-narr");
  if(en) en.innerHTML=`¿Se reparte el trabajo de forma <b>pareja entre los buses</b> de la línea, o unos pocos cargan la operación? La curva de Lorenz y el <b>Gini</b> (${g.toFixed(2)}) lo cuantifican: un Gini alto sugiere flota mal balanceada o vehículos subutilizados.`;
}

/* ---------- KPI territorial: brecha de cobertura por NSE (vista sistema) ---------- */
function renderNseGap(){
  const card=$("nse-gap-card");
  // territorial: sistema o comuna (no en vista de línea)
  if(state.linea!=="TODAS" || state.vista!=="normal" || !COB){ card.style.display="none"; return; }
  // quintiles de NSE ponderados por viviendas (filtrando a la comuna si hay una elegida)
  const cells = COB.features.filter(f=>{ const p=f.properties, cc=f.geometry.coordinates[0];
      return inComuna(p.cy!=null?p.cy:(cc[0][1]+cc[2][1])/2, p.cx!=null?p.cx:(cc[0][0]+cc[2][0])/2); })
    .map(f=>f.properties).filter(p=>p.nse>0 && p.n>0).sort((a,b)=>a.nse-b.nse);
  if(cells.length<25){ card.style.display="none"; return; }   // muy pocas celdas para quintiles
  card.style.display="";
  const totN = cells.reduce((s,c)=>s+c.n,0);
  const Q=[[],[],[],[],[]]; let acc=0,qi=0;
  cells.forEach(c=>{ acc+=c.n; Q[Math.min(4,Math.floor(acc/totN*5-1e-9))].push(c); });
  const labels=["NSE bajo","","NSE medio","","NSE alto"];
  const desierto=[], acceso=[];
  Q.forEach(q=>{ const n=q.reduce((s,c)=>s+c.n,0)||1;
    desierto.push(Math.round(1000*q.filter(c=>c.cov===0).reduce((s,c)=>s+c.n,0)/n)/10);
    acceso.push(Math.round(10*q.reduce((s,c)=>s+c.acc*c.n,0)/n)/10);
  });
  const th=TH();
  if(!nseChart) nseChart=echarts.init($("nse-chart"));
  nseChart.setOption({
    textStyle:{fontFamily:"Inter,sans-serif",color:th.tx},
    grid:{left:42,right:46,top:30,bottom:24,containLabel:true},
    legend:{data:["% en desierto","Acceso medio"],textStyle:{color:th.mut},top:0,right:0},
    tooltip:{trigger:"axis",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx}},
    xAxis:{type:"category",data:["Q1","Q2","Q3","Q4","Q5"],axisLabel:{color:th.mut,
      formatter:(v,i)=>["Q1 ·\nmás vulnerable","Q2","Q3","Q4","Q5 ·\nmás acomodado"][i]},axisLine:{lineStyle:{color:th.axis}}},
    yAxis:[{type:"value",name:"% desierto",axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
           {type:"value",name:"min",position:"right",axisLabel:{color:th.mut},splitLine:{show:false}}],
    series:[
      {name:"% en desierto",type:"bar",data:desierto,barWidth:"46%",itemStyle:{color:"#fb7185",borderRadius:[4,4,0,0]}},
      {name:"Acceso medio",type:"line",yAxisIndex:1,data:acceso,smooth:true,symbol:"circle",symbolSize:7,lineStyle:{width:2.5,color:"#38bdf8"},itemStyle:{color:"#38bdf8"}}
    ]
  }, true);
  setTimeout(()=>nseChart.resize(),60);
  const gap = (desierto[0]-desierto[4]).toFixed(1);
  $("nse-foot").innerHTML = `Quintiles de viviendas por NSE (avalúo m²). Brecha Q1–Q5 en desierto de transporte: <b style="color:${gap>0?'#fb7185':'#34d399'}">${gap>0?'+':''}${gap} pts</b> ${gap>0?'(las zonas vulnerables están peor cubiertas)':'(sin penalización a las vulnerables)'}.`;
}

/* ---------- KPI línea: operación (ciclo/headway/bunching/regularidad) ---------- */
function renderOperacion(){
  const card=$("op-card"); const o=(OP.lineas||{})[state.linea];
  if(state.linea==="TODAS" || !o){ card.style.display="none"; return; }
  card.style.display="";
  const q=calcCalidad(state.linea);
  const opcard=(l,v,s)=>`<div class="kpi"><div class="lab">${l}</div><div class="val">${v}</div><div class="sub">${s}</div></div>`;
  const bunCol = o.bunching>=12?"#fb7185":o.bunching>=7?"#fbbf24":"#34d399";
  $("op-stats").innerHTML = [
    opcard("Tiempo de ciclo", fmt(o.ciclo_med)+" min", "ida + vuelta (aprox)"),
    opcard("Intervalo (headway)", (o.hw_med??"—")+" min", "entre salidas / recorrido"),
    opcard("Bunching", `<span style="color:${bunCol}">${o.bunching??"—"}%</span>`, "buses pegados (&lt;0.4× headway)"),
    opcard("Regularidad", (o.reg??"—"), "índice 0–100 de intervalos"),
  ].join("");
  $("op-foot").innerHTML = `Viaje de extremo a extremo: <b>${fmt(o.tt_med)} min</b>.${q?` Índice de calidad de la línea: <b style="color:${calCol(q.score)}">${q.score}/100</b>.`:""}`;
}

/* ---------- KPI línea: frecuencia por variante (perfil 5 puntos + tendencia mensual) ---------- */
let varProfChart=null, varTrendChart=null;
function renderVarFreq(){
  const card=$("var-freq-card"); if(!card) return;
  if(state.linea==="TODAS" || state.vista!=="normal" || !VFREQ){ card.style.display="none"; return; }
  const recs = Object.keys(VFREQ.variantes).filter(r=>VFREQ.variantes[r].linea===state.linea).sort();
  if(!recs.length){ card.style.display="none"; return; }
  card.style.display="";
  if(!recs.includes(curVar)) curVar = recs[0];
  const sel=$("var-sel");
  sel.innerHTML = recs.map(r=>`<option value="${r}" ${r===curVar?"selected":""}>Variante ${r}</option>`).join("");
  sel.onchange=()=>{ curVar=sel.value; drawVarCharts(); };
  drawVarCharts();
}
function drawVarCharts(){
  const th=TH(), v=VFREQ.variantes[curVar]; if(!v) return;
  const xs=VFREQ.horas.map(h=>h+"h"), COLP=["#22d3ee","#38bdf8","#fbbf24","#a78bfa","#fb7185"];
  if(varProfChart) varProfChart.dispose(); varProfChart=echarts.init($("var-prof-chart"));
  varProfChart.setOption({
    textStyle:{fontFamily:"Inter,sans-serif",color:th.tx},
    grid:{left:36,right:12,top:34,bottom:22,containLabel:true},
    legend:{type:"scroll",top:0,textStyle:{color:th.mut,fontSize:10},itemWidth:12,itemHeight:8},
    tooltip:{trigger:"axis",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx}},
    xAxis:{type:"category",data:xs,axisLabel:{color:th.mut,fontSize:9},axisLine:{lineStyle:{color:th.axis}}},
    yAxis:{type:"value",name:"bus/h",axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
    series:v.puntos.map((pt,i)=>({name:pt.n,type:"line",data:pt.freq,smooth:true,symbol:"none",
      lineStyle:{width:2,color:COLP[i]},itemStyle:{color:COLP[i]}}))
  },true);
  setTimeout(()=>varProfChart.resize(),60);
  const vt = VTREND&&VTREND.variantes&&VTREND.variantes[curVar], lt = VTREND&&VTREND.lineas&&VTREND.lineas[state.linea];
  if(VTREND && (vt||lt)){
    const xs2=VTREND.meses.map(mesLbl3);
    if(varTrendChart) varTrendChart.dispose(); varTrendChart=echarts.init($("var-trend-chart"));
    varTrendChart.setOption({
      textStyle:{fontFamily:"Inter,sans-serif",color:th.tx},
      grid:{left:36,right:12,top:34,bottom:22,containLabel:true},
      legend:{top:0,textStyle:{color:th.mut,fontSize:10},itemWidth:12,itemHeight:8},
      tooltip:{trigger:"axis",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx}},
      xAxis:{type:"category",data:xs2,axisLabel:{color:th.mut,fontSize:9},axisLine:{lineStyle:{color:th.axis}}},
      yAxis:{type:"value",name:"desp/día",axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
      series:[ vt?{name:"Variante "+curVar,type:"line",data:vt.dd,smooth:true,symbol:"circle",symbolSize:5,connectNulls:true,lineStyle:{width:2.6,color:"#22d3ee"},itemStyle:{color:"#22d3ee"}}:null,
               lt?{name:"Línea "+state.linea,type:"line",data:lt.dd,smooth:true,symbol:"none",connectNulls:true,lineStyle:{width:2,color:"#94a1ba",type:"dashed"},itemStyle:{color:"#94a1ba"}}:null ].filter(Boolean)
    },true);
    setTimeout(()=>varTrendChart.resize(),60);
  }
  const cb=v.puntos.find(p=>p.n==="Cuello de botella");
  $("var-foot").innerHTML = `Variante <b>${curVar}</b>${cb&&cb.vel?` · cuello de botella a <b>${cb.vel} km/h</b>`:""}. La frecuencia de pasada cambia a lo largo de la ruta (terminal → centro) y del día — sirve para evaluar consistencia y bunching.`;
}

/* ---------- KPI: índice sintético de calidad por línea ---------- */
const calCol = s => s>=70?"#34d399":s>=50?"#fbbf24":"#fb7185";
function calcCalidad(l){
  const c=(CUMP.lineas||{})[l], o=(OP.lineas||{})[l], tc=(T.cells||{})[`TODAS|${l}`];
  const freq = c&&c.cumpl&&c.cumpl.L!=null ? Math.min(c.cumpl.L,100) : null;
  const reg  = o&&o.reg!=null ? o.reg : null;
  const vel  = tc&&tc.kpi&&tc.kpi.vel!=null ? Math.min(tc.kpi.vel/24*100,100) : null;
  const ab   = o&&o.bunching!=null ? Math.max(0,100-o.bunching*5) : null;
  const parts=[[freq,.30],[reg,.30],[vel,.20],[ab,.20]].filter(p=>p[0]!=null);
  if(!parts.length) return null;
  const ws=parts.reduce((s,p)=>s+p[1],0);
  return {score:Math.round(parts.reduce((s,p)=>s+p[0]*p[1],0)/ws),
          freq:freq==null?null:Math.round(freq), reg, vel:vel==null?null:Math.round(vel), ab:ab==null?null:Math.round(ab)};
}
function renderCalidad(){
  const card=$("calidad-card");
  const sys = state.comuna==="TODAS" && state.linea==="TODAS";
  if(!sys || !T){ card.style.display="none"; return; }
  const rows=(T.lineas||[]).map(l=>{const q=calcCalidad(l.linea);return q?{ln:l.linea,emp:l.empresa,...q}:null;}).filter(Boolean);
  if(!rows.length){ card.style.display="none"; return; }
  card.style.display="";
  rows.sort((a,b)=>b.score-a.score);
  $("calidad-box").innerHTML = rows.slice(0,14).map((r,i)=>`<div class="cump-row" data-l="${r.ln}" style="cursor:pointer">
    <span class="rk" style="color:var(--dim);font-family:var(--mono);min-width:20px">${i+1}</span>
    <b style="font-family:var(--mono);min-width:30px">${r.ln}</b>
    <span style="flex:1;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.emp||""}</span>
    <span class="bar" style="flex:0 0 90px;height:7px;border-radius:4px;background:var(--track);overflow:hidden"><i style="display:block;height:100%;width:${r.score}%;background:${calCol(r.score)}"></i></span>
    <span class="pct" style="color:${calCol(r.score)};min-width:38px;font-family:var(--mono)">${r.score}</span></div>`).join("");
  $("calidad-box").querySelectorAll(".cump-row").forEach(el=>el.onclick=()=>{state.linea=el.dataset.l;state.comuna="TODAS";render();});
  const best=rows[0], worst=rows[rows.length-1];
  $("calidad-foot").innerHTML = `Índice 0–100 = 30% frecuencia + 30% regularidad + 20% velocidad + 20% anti-bunching. Mejor: <b style="color:#34d399">${best.ln}</b> (${best.score}) · peor: <b style="color:#fb7185">${worst.ln}</b> (${worst.score}).`;
}

/* ---------- VISTAS ESPECIALES DEL TERRITORIO: Ranking / Comparador de comunas ---------- */
const RANK_VARS = [["vel","Velocidad","km/h"],["pct_det","Tiempo detenido","%"],["flota_pico","Flota en punta","buses"],["pulsos","Registros GPS","M"],["n_lineas","Líneas","#"]];
function velPeriodo(comuna){
  const c=(T.cells||{})[`${comuna}|TODAS`]; if(!c||!c.horas) return null;
  const vs=(PERIODO_H[state.periodo]||[]).map(h=>c.horas[h]&&c.horas[h].v).filter(v=>v>0);
  return vs.length ? vs.reduce((a,b)=>a+b,0)/vs.length : null;
}
function comunaVal(comuna,vk){
  if(vk==="vel") return velPeriodo(comuna);
  const k=(T.cells||{})[`${comuna}|TODAS`]; if(!k||!k.kpi) return null;
  return vk==="pulsos" ? k.kpi.pulsos/1e6 : k.kpi[vk];
}
function renderRankingView(){
  const vk=state.rankVar||"vel", vdef=RANK_VARS.find(v=>v[0]===vk);
  const vsel=RANK_VARS.map(v=>`<b data-rv="${v[0]}" class="${vk===v[0]?"on":""}">${v[1]}</b>`).join("");
  $("special-view").innerHTML=`<section class="widget"><div class="widget-h">
     <span class="ico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg></span>
     <div class="min-w-0"><h3>Ranking de comunas · ${vdef[1]}</h3><span class="sub">ordena el Gran Concepción por la variable elegida${vk==="vel"?` · ${periodoLbl(state.periodo)}`:""}</span></div>
     <div class="seg" id="rank-var" style="margin-left:auto;flex-wrap:wrap">${vsel}</div></div>
     <div class="widget-b"><div id="rankview-chart" style="height:440px"></div><div class="hint" id="rankview-foot" style="margin-top:6px"></div></div></section>`;
  $("rank-var").querySelectorAll("b").forEach(el=>el.onclick=()=>{state.rankVar=el.dataset.rv;render();});
  const comunas=(GEO.features||[]).map(f=>f.properties.name);
  let rows=comunas.map(c=>({c,v:comunaVal(c,vk)})).filter(r=>r.v!=null);
  rows.sort((a,b)=> vk==="pct_det" ? b.v-a.v : a.v-b.v);   // barra horizontal: mayor arriba
  const th=TH(); if(rankChart) rankChart.dispose(); rankChart=echarts.init($("rankview-chart"));
  const best = vk==="pct_det" ? rows[0] : rows[rows.length-1];
  const mx=Math.max(...rows.map(r=>r.v));
  rankChart.setOption({
    textStyle:{fontFamily:"Inter,sans-serif",color:th.tx},
    grid:{left:8,right:60,top:10,bottom:18,containLabel:true},
    tooltip:{trigger:"axis",axisPointer:{type:"shadow"},backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx},
      formatter:p=>`${p[0].name}<br><b>${fmt1(p[0].value)}</b> ${vdef[2]}`},
    xAxis:{type:"value",axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
    yAxis:{type:"category",data:rows.map(r=>r.c),axisLabel:{color:th.tx,fontSize:11.5},axisLine:{lineStyle:{color:th.axis}}},
    series:[{type:"bar",data:rows.map(r=>({value:Math.round(r.v*10)/10,itemStyle:{color:speedRankColor(r.v/mx)}})),
      barWidth:"62%",label:{show:true,position:"right",color:th.mut,fontSize:11,formatter:o=>fmt1(o.value)+" "+vdef[2]}}]
  },true);
  setTimeout(()=>rankChart.resize(),60);
  $("rankview-foot").innerHTML = `Líder: <b style="color:#34d399">${best.c}</b> (${fmt1(best.v)} ${vdef[2]}). ${vk==="pct_det"?"Menor tiempo detenido es mejor.":vk==="vel"?"Mayor velocidad es mejor.":""}`;
}
const speedRankColor = t => `hsl(${t*150+10},65%,52%)`;
function renderComparador(){
  const comunas=(GEO.features||[]).map(f=>f.properties.name);
  if(!comunas.includes(state.cmpA)) state.cmpA=comunas[0];
  if(!comunas.includes(state.cmpB)) state.cmpB=comunas[1]||comunas[0];
  const opt=sel=>comunas.map(c=>`<option ${c===sel?"selected":""}>${c}</option>`).join("");
  $("special-view").innerHTML=`<section class="widget"><div class="widget-h">
     <span class="ico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7l-4 4 4 4M16 7l4 4-4 4M4 11h16"/></svg></span>
     <div class="min-w-0"><h3>Comparador de comunas</h3><span class="sub">dos comunas lado a lado</span></div>
     <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
       <select id="cmpA" class="side-search" style="width:auto;margin:0;padding:5px 8px">${opt(state.cmpA)}</select>
       <span style="color:var(--dim)">vs</span>
       <select id="cmpB" class="side-search" style="width:auto;margin:0;padding:5px 8px">${opt(state.cmpB)}</select></div></div>
     <div class="widget-b"><div id="cmp-grid" class="grid2" style="margin-bottom:14px"></div><div id="cmp-chart" style="height:280px"></div></div></section>`;
  $("cmpA").onchange=e=>{state.cmpA=e.target.value;render();};
  $("cmpB").onchange=e=>{state.cmpB=e.target.value;render();};
  const col=["#38bdf8","#fb923c"];
  const card=(comuna,ci)=>{
    const k=(T.cells||{})[`${comuna}|TODAS`]; const kpi=k&&k.kpi||{};
    return `<div style="border:1px solid var(--line);border-radius:12px;padding:14px">
      <div style="font-weight:600;color:${col[ci]};margin-bottom:8px">${comuna}</div>
      ${[["Velocidad media",fmt1(kpi.vel)+" km/h"],["Tiempo detenido",fmt1(kpi.pct_det)+" %"],["Flota en punta",fmt(kpi.flota_pico)],["Líneas",kpi.n_lineas||"—"],["Registros",((kpi.pulsos||0)/1e6).toFixed(1)+" M"]]
        .map(r=>`<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--line);font-size:13px"><span class="hint">${r[0]}</span><b style="font-family:var(--mono)">${r[1]}</b></div>`).join("")}</div>`;
  };
  $("cmp-grid").innerHTML = card(state.cmpA,0)+card(state.cmpB,1);
  // perfil de velocidad por hora superpuesto
  const th=TH(); if(cmpChart) cmpChart.dispose(); cmpChart=echarts.init($("cmp-chart"));
  const prof=comuna=>{const k=(T.cells||{})[`${comuna}|TODAS`];return k&&k.horas?k.horas.map(h=>h?h.v:null):[];};
  cmpChart.setOption({
    textStyle:{fontFamily:"Inter,sans-serif",color:th.tx},
    grid:{left:38,right:16,top:30,bottom:24,containLabel:true},
    legend:{data:[state.cmpA,state.cmpB],textStyle:{color:th.mut},top:0},
    tooltip:{trigger:"axis",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx}},
    xAxis:{type:"category",data:HORAS,axisLabel:{color:th.mut,fontSize:9},axisLine:{lineStyle:{color:th.axis}}},
    yAxis:{type:"value",name:"km/h",axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
    series:[{name:state.cmpA,type:"line",data:prof(state.cmpA),smooth:true,symbol:"none",lineStyle:{width:2.5,color:col[0]}},
            {name:state.cmpB,type:"line",data:prof(state.cmpB),smooth:true,symbol:"none",lineStyle:{width:2.5,color:col[1]}}]
  },true);
  setTimeout(()=>cmpChart.resize(),60);
}

/* ---------- migrado de clásico: empresas + heatmaps temporales (vista sistema) ---------- */
const MES=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const mesLab = s => { const p=String(s).split("-"); return (MES[(+p[1]||1)-1]||"")+" "+(p[0]||"").slice(2); };
const sysScope = () => state.vista==="normal" && state.comuna==="TODAS" && state.linea==="TODAS";
function renderEmpresas(){
  const card=$("empresas-card");
  if(state.linea!=="TODAS" || state.vista!=="normal" || !EMPR.length){ card.style.display="none"; return; }
  // en comuna: solo las empresas que operan ahí
  let d = state.comuna==="TODAS" ? EMPR.slice() : EMPR.filter(e=>(e.comunas||"").includes(state.comuna));
  if(!d.length){ card.style.display="none"; return; }
  card.style.display="";
  d=d.sort((a,b)=>b.buses-a.buses).slice(0,18); const th=TH();
  if(empresasChart) empresasChart.dispose(); empresasChart=echarts.init($("empresas-chart"));
  empresasChart.setOption({
    textStyle:{fontFamily:"Inter,sans-serif",color:th.tx},
    grid:{left:8,right:52,top:8,bottom:16,containLabel:true},
    tooltip:{trigger:"axis",axisPointer:{type:"shadow"},backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx},
      formatter:p=>{const x=d[p[0].dataIndex];return `<b>${x.fantasia}</b> (L${x.linea})<br>${x.razon_social}<br>Buses: <b>${x.buses}</b> · ${(x.pulsos/1e6).toFixed(1)} M pulsos<br>Vel ${x.vel} km/h · ${x.comunas}`;}},
    xAxis:{type:"value",name:"buses",axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
    yAxis:{type:"category",inverse:true,data:d.map(x=>`${x.fantasia} (L${x.linea})`),axisLabel:{fontSize:11,color:th.tx},axisLine:{lineStyle:{color:th.axis}}},
    series:[{type:"bar",data:d.map(x=>x.buses),barWidth:"66%",itemStyle:{borderRadius:[0,5,5,0],
      color:new echarts.graphic.LinearGradient(1,0,0,0,[{offset:0,color:"#a78bfa"},{offset:1,color:"rgba(167,139,250,.35)"}])},
      label:{show:true,position:"right",color:th.mut,fontSize:10.5,formatter:o=>o.value}}]
  },true);
  setTimeout(()=>empresasChart.resize(),60);
  const en=$("emp-narr");
  if(en) en.innerHTML=`Tamaño de flota por <b>empresa operadora</b> (una por línea)${state.comuna==="TODAS"?" en el sistema":" en "+state.comuna}. Sirve para dimensionar quién mueve el servicio y comparar escala entre operadores del perímetro regulado.`;
}
function renderHeat(){
  const card=$("heat-card");
  if(!sysScope() || (!MESH.length && !DOWH.length)){ card.style.display="none"; return; }
  card.style.display="";
  const hm=state.heatMode||"mes";
  $("heat-mode").innerHTML=[["mes","Mes × hora"],["dow","Semana × hora"]].map(([k,l])=>`<b data-h="${k}" class="${hm===k?"on":""}">${l}</b>`).join("");
  $("heat-mode").querySelectorAll("b").forEach(el=>el.onclick=()=>{state.heatMode=el.dataset.h;renderHeat();});
  const th=TH(); if(heatChart) heatChart.dispose(); heatChart=echarts.init($("heat-chart"));
  let yCats,data,maxv;
  if(hm==="mes"){
    const meses=[...new Set(MESH.map(x=>x.mes))].sort();
    yCats=meses.map(mesLab); data=MESH.map(x=>[x.hora, meses.indexOf(x.mes), Math.round(x.prom)]);
    maxv=Math.max(...MESH.map(x=>x.prom));
  } else {
    const lab=["","Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
    yCats=[1,2,3,4,5,6,7].map(d=>lab[d]); data=DOWH.map(x=>[x.hora, x.dow-1, Math.round(x.prom)]);
    maxv=Math.max(...DOWH.map(x=>x.prom));
  }
  heatChart.setOption({
    textStyle:{fontFamily:"Inter,sans-serif",color:th.tx},
    grid:{left:54,right:20,top:12,bottom:44,containLabel:true},
    tooltip:{position:"top",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx},
      formatter:p=>`${yCats[p.data[1]]} · ${HORAS[p.data[0]]}<br>Flota: <b>${fmt1(p.data[2])}</b> buses`},
    xAxis:{type:"category",data:HORAS,axisLabel:{color:th.mut,fontSize:9},axisLine:{lineStyle:{color:th.axis}},splitArea:{show:false}},
    yAxis:{type:"category",data:yCats,axisLabel:{color:th.tx,fontSize:11},axisLine:{lineStyle:{color:th.axis}}},
    visualMap:{min:0,max:Math.ceil(maxv),calculable:false,orient:"horizontal",left:"center",bottom:2,itemWidth:12,itemHeight:120,
      inRange:{color:["#0b1220","#143656","#0ea5e9","#34d399","#fbbf24"]},textStyle:{color:th.mut,fontSize:10}},
    series:[{type:"heatmap",data,label:{show:false},itemStyle:{borderColor:"rgba(0,0,0,.12)",borderWidth:1},
      emphasis:{itemStyle:{shadowBlur:8,shadowColor:"rgba(0,0,0,.5)"}}}]
  },true);
  setTimeout(()=>heatChart.resize(),60);
}

/* ---------- migrado de clásico: recorridos y corredores (vista sistema) ---------- */
const REC_VIEWS=[["top","Más flota"],["lentos","Más lentos · punta"],["reg","Menos regulares"],["corr","Corredores lentos"]];
function renderRecorridos(){
  const card=$("rec-card");
  const any=(REC.top.length||REC.lentos.length||REC.reg.length||REC.corr.length);
  if(!sysScope() || !any){ card.style.display="none"; return; }
  card.style.display="";
  const rv=state.recView||"top";
  $("rec-view").innerHTML=REC_VIEWS.map(([k,l])=>`<b data-r="${k}" class="${rv===k?"on":""}">${l}</b>`).join("");
  $("rec-view").querySelectorAll("b").forEach(el=>el.onclick=()=>{state.recView=el.dataset.r;renderRecorridos();});
  let rows, unit, foot, slow=false;
  if(rv==="top"){ rows=REC.top.slice().sort((a,b)=>b.flota_pico-a.flota_pico).slice(0,15).map(x=>({n:x.recorrido,v:x.flota_pico})); unit="buses"; foot="Recorridos con más flota desplegada en punta."; }
  else if(rv==="lentos"){ rows=REC.lentos.slice().sort((a,b)=>a.vel-b.vel).slice(0,15).map(x=>({n:x.recorrido,v:x.vel})); unit="km/h"; slow=true; foot="Recorridos más lentos en hora punta (peor velocidad comercial)."; }
  else if(rv==="reg"){ rows=REC.reg.slice().sort((a,b)=>b.cv-a.cv).slice(0,15).map(x=>({n:x.recorrido,v:Math.round(x.cv*1000)/10})); unit="% CV"; slow=true; foot="Mayor variabilidad de la oferta entre días (CV) = servicio menos regular."; }
  else { rows=REC.corr.slice().sort((a,b)=>a.vel_kmh-b.vel_kmh).slice(0,15).map(x=>({n:x.corredor,v:x.vel_kmh})); unit="km/h"; slow=true; foot="Ejes viales con menor velocidad de circulación de buses."; }
  const isCV = unit==="% CV";
  const colorOf = v => !slow ? "#38bdf8" : isCV ? `hsl(${(1-Math.min(v/40,1))*120},70%,50%)` : `hsl(${Math.min(v/35,1)*120},70%,50%)`;
  const th=TH(); if(recChart) recChart.dispose(); recChart=echarts.init($("rec-chart"));
  recChart.setOption({
    textStyle:{fontFamily:"Inter,sans-serif",color:th.tx},
    grid:{left:8,right:58,top:8,bottom:16,containLabel:true},
    tooltip:{trigger:"axis",axisPointer:{type:"shadow"},backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx},
      formatter:p=>`${p[0].name}<br><b>${fmt1(p[0].value)}</b> ${unit}`},
    xAxis:{type:"value",axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
    yAxis:{type:"category",inverse:true,data:rows.map(r=>r.n),axisLabel:{color:th.tx,fontSize:11},axisLine:{lineStyle:{color:th.axis}}},
    series:[{type:"bar",barWidth:"64%",data:rows.map(r=>({value:Math.round(r.v*10)/10,itemStyle:{color:colorOf(r.v)}})),
      label:{show:true,position:"right",color:th.mut,fontSize:10.5,formatter:o=>fmt1(o.value)+" "+unit}}]
  },true);
  setTimeout(()=>recChart.resize(),60);
  $("rec-foot").textContent=foot;
}

/* ---------- evolución 12 meses por comuna (¿mejoró o empeoró?) ---------- */
const EVOL_VARS=[["vel","Velocidad","km/h",1],["det","Tiempo detenido","%",-1],["pulsos","Registros","M",1]];
const MES3=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const mesLbl3 = s => { const p=String(s).split("-"); return (MES3[(+p[1]||1)-1]||"")+"'"+(p[0]||"").slice(2); };
function renderEvolucion(){
  const card=$("evol-card");
  const ambito = state.comuna==="TODAS" ? "TODAS" : state.comuna;
  const d=(EVOL.comunas||{})[ambito];
  if(state.linea!=="TODAS" || state.vista!=="normal" || !d){ card.style.display="none"; return; }
  card.style.display="";
  const vk=state.evolVar||"vel", vdef=EVOL_VARS.find(v=>v[0]===vk);
  $("evol-title").textContent = "Evolución últimos 12 meses" + (ambito==="TODAS"?"":` · ${ambito}`);
  $("evol-var").innerHTML=EVOL_VARS.map(v=>`<b data-e="${v[0]}" class="${vk===v[0]?"on":""}">${v[1]}</b>`).join("");
  $("evol-var").querySelectorAll("b").forEach(el=>el.onclick=()=>{state.evolVar=el.dataset.e;renderEvolucion();});
  const serie=d[vk]||[], xs=EVOL.meses.map(mesLbl3);
  const valid=serie.filter(x=>x!=null);
  const first=valid[0], last=valid[valid.length-1], delta=last!=null&&first!=null?Math.round((last-first)*10)/10:null;
  const mejor = vdef[3]>0 ? (delta>0) : (delta<0);
  const col = delta==null||Math.abs(delta)<0.2 ? "#94a1ba" : mejor ? "#34d399" : "#fb7185";
  const th=TH(); if(evolChart) evolChart.dispose(); evolChart=echarts.init($("evol-chart"));
  evolChart.setOption({
    textStyle:{fontFamily:"Inter,sans-serif",color:th.tx},
    grid:{left:40,right:18,top:16,bottom:24,containLabel:true},
    tooltip:{trigger:"axis",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx},
      formatter:p=>`${p[0].name}<br>${vdef[1]}: <b>${p[0].value==null?"—":fmt1(p[0].value)} ${vdef[2]}</b>`},
    xAxis:{type:"category",data:xs,axisLabel:{color:th.mut,fontSize:10},axisLine:{lineStyle:{color:th.axis}}},
    yAxis:{type:"value",scale:true,name:vdef[2],axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
    series:[{type:"line",data:serie,smooth:true,symbol:"circle",symbolSize:6,connectNulls:true,
      lineStyle:{width:2.6,color:col},itemStyle:{color:col},areaStyle:{color:col+"1f"}}]
  },true);
  setTimeout(()=>evolChart.resize(),60);
  const flecha = delta==null?"":delta>0?"▲":delta<0?"▼":"=";
  $("evol-foot").innerHTML = delta==null ? "Sin datos suficientes." :
    `${vdef[1]} pasó de <b>${fmt1(first)}</b> a <b>${fmt1(last)} ${vdef[2]}</b> en ${valid.length} meses: <b style="color:${col}">${flecha} ${delta>0?"+":""}${delta} ${vdef[2]}</b> (${mejor?"mejora":"empeora"}).`;
}

/* ---------- init ---------- */
(async function(){
  try{
    const HIST = "https://storage.googleapis.com/gccp-transporte-live/hist/territorio.json";
    const loadT = fetch(HIST+"?t="+Date.now(),{cache:"no-store"}).then(r=>{if(!r.ok)throw 0;return r.json();}).catch(()=>J("territorio.json"));
    [T, GEOM, GEO, CUMP, PAR, CSEM] = await Promise.all([
      loadT, J("lineas_geom.json"), J("comunas_gccp.geojson"), J("cumplimiento.json"),
      J("paraderos.json").catch(()=>({})), J("cumplimiento_semanal.json").catch(()=>({lineas:{}}))]);
    if(T.hasta){ const pe=$("periodo-pill"); if(pe) pe.textContent = "datos hasta "+T.hasta; }
    const vd=$("vfoot-data"); if(vd) vd.textContent = "Datos hasta: "+(T.hasta||"—");
    fetch("data/version.json?t="+Date.now(),{cache:"no-store"}).then(r=>r.json()).then(v=>{
      const vb=$("vfoot-build"); if(!vb) return;
      vb.textContent = "Visor actualizado: "+BUILD+" (hora Chile)";
      if(v.build && v.build!==BUILD) vb.innerHTML += ' · <span class="nueva" onclick="location.reload(true)">⚠ hay una versión más nueva — recargar</span>';
    }).catch(()=>{ const vb=$("vfoot-build"); if(vb) vb.textContent="Visor actualizado: "+BUILD; });
    applyTheme(document.documentElement.dataset.theme==="light" ? "light" : "dark");
    J("comuna_lineas.json").then(d=>{ CLIN=d; buildLineaList($("linea-search")?$("linea-search").value:""); }).catch(()=>{});
    J("cobertura.json").then(d=>{ COB=d; renderNseGap(); if(state.mapMode!=="live") renderMapa(); }).catch(()=>{});
    J("flota_equidad.json").then(d=>{ EQ=d; renderEquidad(); }).catch(()=>{});
    J("operacion_linea.json").then(d=>{ OP=d; renderOperacion(); renderCalidad(); }).catch(()=>{});
    J("speed_grid_hora.json").then(d=>{ GRID=d; if(state.mapMode==="conges") renderMapa(); }).catch(()=>{});
    J("congestion_red.json").then(d=>{ CONGRED=d; if(state.mapMode==="conges"||state.mapMode==="bunch") renderMapa(); }).catch(()=>{});
    J("red_freq.json").then(d=>{ RFREQ=d; if(state.mapMode==="bunch") renderMapa(); }).catch(()=>{});
    J("detenciones.json").then(d=>{ DET2=d; if(state.mapMode==="det") renderMapa(); }).catch(()=>{});
    J("terminales.json").then(d=>{ TERM=d; if(state.mapMode==="det") renderMapa(); }).catch(()=>{});
    J("destinos_principales.json").then(d=>{ DEST=d; if(state.mapMode==="cover"||state.mapMode==="trans") renderMapa(); }).catch(()=>{});
    J("paraderos_espera.json").then(d=>{ PESP=d; if(state.mapMode==="wait") renderMapa(); }).catch(()=>{});
    J("empresa_stats.json").then(d=>{ EMPR=d; renderEmpresas(); }).catch(()=>{});
    J("flota_mes_hora.json").then(d=>{ MESH=d; renderHeat(); }).catch(()=>{});
    J("dow_hora.json").then(d=>{ DOWH=d; renderHeat(); }).catch(()=>{});
    Promise.all([J("top_recorridos.json").catch(()=>[]),J("lentos_punta.json").catch(()=>[]),J("regularidad.json").catch(()=>[]),J("corredores.json").catch(()=>[])])
      .then(([t,l,r,c])=>{ REC={top:t,lentos:l,reg:r,corr:c}; renderRecorridos(); });
    J("evolucion_comuna.json").then(d=>{ EVOL=d; renderEvolucion(); }).catch(()=>{});
    Promise.all([J("variantes_freq.json").catch(()=>null), J("freq_trend.json").catch(()=>null)])
      .then(([vf,vt])=>{ VFREQ=vf; VTREND=vt; renderVarFreq(); });
    J("terminales_linea.json").then(d=>{ TLIN=d; if(state.linea!=="TODAS") renderMapa(); }).catch(()=>{});
    buildMapModes();
    buildPeriodo(); buildPurpose();
    buildComunaTabs();
    buildLineaList();
    $("linea-search").addEventListener("input", e=>buildLineaList(e.target.value));
    $("reset-btn").onclick = ()=>{ Object.assign(state,{comuna:"TODAS",linea:"TODAS",vista:"normal"}); $("linea-search").value=""; buildLineaList(); render(); };
    render();
    loadLive(); setInterval(loadLive, 60000);   // buses operando ahora, refresco 60 s
    addEventListener("resize", ()=>{ [chart,csChart,eqChart,nseChart,rankChart,cmpChart,empresasChart,heatChart,recChart,evolChart].forEach(c=>{try{c&&c.resize();}catch(e){}}); if(lmap) lmap.invalidateSize(); });
  }catch(e){ console.error(e); $("kpis2").innerHTML=`<div class="empty">No se pudieron cargar los datos.</div>`; }
})();
