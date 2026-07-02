/* Visor Transporte Gran Concepción — navegación por comuna (territorio) y línea (operador) */
const IC={
  bus:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="14" rx="3"/><path d="M6 10h12"/><circle cx="9" cy="20" r="1"/><circle cx="15" cy="20" r="1"/><path d="M6 17v4M18 17v4"/></svg>',
  zap:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  stop:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><rect x="8" y="8" width="8" height="8" rx="1"/></svg>',
  park:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/></svg>',
  pause:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>',
  sleep:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  freq:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  home:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  map:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>',
  ruler:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0z"/><path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2"/></svg>',
  cycle:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>',
  chart:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  timer:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="8"/><path d="M12 6v4l2 2"/><path d="M10 2h4"/></svg>',
  trend:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  sat:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5"/><path d="M6 8a3 3 0 0 1 3-3c1 0 1.5.5 2 1l1 2a3 3 0 0 0 3 2h2"/></svg>',
  warn:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  nseUp:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  nseMd:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/></svg>',
  nseDn:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>',
};
const NF = new Intl.NumberFormat("es-CL");
const fmt = n => NF.format(Math.round(n||0));
const fmt1 = n => NF.format(Math.round((n||0)*10)/10);
const HORAS = [...Array(24).keys()].map(h=>String(h).padStart(2,"0")+"h");
const $ = id => document.getElementById(id);
const J = n => fetch(`data/${n}?v=92`).then(r=>r.json());
// reloj en vivo (fecha + hora Chile) en el header — útil para las capturas
function tickReloj(){
  const el = document.getElementById("hdr-reloj-txt"); if(!el) return;
  const now = new Date();
  let f = new Intl.DateTimeFormat("es-CL", {timeZone:"America/Santiago", weekday:"long", day:"numeric", month:"long"}).format(now).replace(",", "");
  f = f.charAt(0).toUpperCase() + f.slice(1);
  const h = new Intl.DateTimeFormat("es-CL", {timeZone:"America/Santiago", hour:"2-digit", minute:"2-digit", hour12:false}).format(now);
  el.textContent = `${f} · ${h}`;
}
try{ tickReloj(); setInterval(tickReloj, 30000); }catch(e){}
const BUILD = "2026-06-28 03:33";

let T, GEOM, GEO, CUMP, PAR={}, CSEM={lineas:{}}, LIVE=null, COB=null, EQ={lineas:{}}, GRID=null, OP={lineas:{}}, EMPL={}, CLIN={}, CONGRED=null, RFREQ=null, SGSTATS=null, TERMCONF=null, AYERFREQ=null;
let DIA=null, BASE30=null;   // vivo (dia.json) y baseline histórico 30min — recuadros del inicio
let eqChart, nseChart, rankChart, cmpChart, empresasChart, heatChart, recChart, evolChart;
let EMPR=[], MESH=[], DOWH=[], DET2=[], TERM={terminales:[]}, DEST={destinos:[]}, REC={top:[],lentos:[],reg:[],corr:[]}, EVOL={meses:[],comunas:{}};
let VFREQ=null, VTREND=null, curVar=null, lastFitScope=null, TLIN={}, PESP={stops:[]};
let VCICLO=null, vcChart=null, vcPer="agregado", vcSm=0;
let DETP=null, CLINE={lineas:[]}, BUNCH=null, BUNCHA=null, CICLO=null;
let _nseTerciles=null;
let state = {comuna:"TODAS", linea:"TODAS", csDia:"L", csVar:"freq", mapMode:"live", vista:"normal", periodo:"agg", purpose:"all", coverSub:"est", sentido:"amb", detTipo:"cong", congSub:"prom", freqDia:"L", cmpA:null, cmpB:null};
let csChart, freqChart, linFreqChart, rankProgChart, lmap, baseLayers, routeLayer, comunaLayer, stopLayer, liveLayer, liveCanvas, coverLayer, coverCanvas, speedLegend, coverLegend;
const LIVE_URL = "https://storage.googleapis.com/gccp-transporte-live/live.json";
const MAP_MODES = [["live","En vivo"],["cover","Cobertura"],["trans","Transbordo"],["wait","Espera"],["conges","Congestión"],["bunch","Bunching"],["det","Detenciones"],["terms","Terminales"],["exc","Excesos vel."],["salud","Salud"],["edu","Educación"],["nse","NSE"]];
const PEAK_H = [7,8,9,17,18,19];
const PERIODOS = [["agg","Agregado"],["am","Punta AM"],["md","Mediodía"],["pm","Punta PM"],["off","Fuera punta"],["noche","Noche"]];
const PERIODO_H = {agg:[6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22], am:[7,8,9], md:[12,13,14], pm:[17,18,19], off:[10,11,15,16,20,21,22], noche:[21,22,23]};
const periodoLbl = p => (PERIODOS.find(x=>x[0]===p)||["","Agregado"])[1];
const SENTIDOS = [["amb","Ambos"],["0","Ida"],["1","Regreso"]];
const DET_TIPOS = [["cong","Congestión"],["par","Paraderos"]];
const CONG_SUBS = [["prom","Promedio"],["crit","Día crítico"],["estab","Estabilidad"]];
const nseColors = {0:"#fb923c", 1:"#94a3b8", 2:"#2dd4bf"};
const nseLabel = n => n===0?"NSE bajo":n===1?"NSE medio":n===2?"NSE alto":"sin dato NSE";

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
const TH = () => ({tx:cssv("--tx"), mut:cssv("--muted"), axis:cssv("--ch-axis"), grid:cssv("--ch-grid"), tip:cssv("--ch-tip"), tipB:cssv("--line2"), font:cssv("--font-ui")||"IBM Plex Sans,system-ui,sans-serif"});
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
const COVER_SUBS = [["est","Estática"],["din","Dinámica"],["od","Oferta/demanda"]];   // 'din' reemplaza 'of' (2026-06-28): modelo cápsula 2 min + 300 m, frac=min(1,f/30)
let DINL = null;   // cobertura_din_lineas.json — KPIs por línea (cargado en init)
// _dinValueFor: en vista SISTEMA devuelve P_total de la manzana; en vista LÍNEA el frac_línea uniforme (color uniforme dentro de las manzanas cubiertas)
function _dinValueFor(p){
  const per = state.periodo;
  if(state.linea!=="TODAS"){
    return (DINL?.lineas?.[state.linea]?.frac?.[per]) ?? null;
  }
  return (p.cob_din && p.cob_din[per]!=null) ? p.cob_din[per] : null;
}
let ODMAX = null;   // máximo cociente oferta/demanda (referencia 100% para la escala relativa)
function odMax(){
  if(ODMAX!=null) return ODMAX;
  if(!COB) return 1;
  // referencia = mejor zona RESIDENCIAL (San Pedro/Chiguayante/Talcahuano), no el centro atractor
  const ref = COB.resumen && COB.resumen.cob_od && COB.resumen.cob_od.ref_residencial;
  ODMAX = ref || 1; return ODMAX;
}
const CAP_SEAT = 27;   // capacidad sentada del bus en Concepción (para personas/hora)
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
    if(state.mapMode==="conges" || state.mapMode==="wait" || state.mapMode==="bunch" || state.mapMode==="det" || state.mapMode==="cover" || state.vista==="ranking") render(); });
}
function buildCoverSub(){
  const box=$("cover-sub"); if(!box) return;
  box.innerHTML = `<span class="lbl">Cobertura</span><div class="seg">`+
    COVER_SUBS.map(([k,l])=>`<b data-s="${k}" class="${state.coverSub===k?"on":""}">${l}</b>`).join("")+`</div>`;
  box.querySelectorAll("b").forEach(el=>el.onclick=()=>{ state.coverSub=el.dataset.s;
    box.querySelectorAll("b").forEach(b=>b.classList.toggle("on",b.dataset.s===state.coverSub));
    if(state.mapMode==="cover") render(); });
}
function buildPurpose(){
  const box=$("purpose-sel"); if(!box) return;
  box.innerHTML = `<span class="lbl">Propósito</span><div class="seg">`+
    PURPOSES.map(([k,l])=>`<b data-p="${k}" class="${state.purpose===k?"on":""}">${l}</b>`).join("")+`</div>`;
  box.querySelectorAll("b").forEach(el=>el.onclick=()=>{ state.purpose=el.dataset.p;
    box.querySelectorAll("b").forEach(b=>b.classList.toggle("on",b.dataset.p===state.purpose));
    if(["cover","trans","wait"].includes(state.mapMode)) render(); });
}
function buildSentido(){
  const box=$("sentido-sel"); if(!box) return;
  box.innerHTML = `<span class="lbl">Sentido</span><div class="seg">`+
    SENTIDOS.map(([k,l])=>`<b data-p="${k}" class="${state.sentido===k?"on":""}">${l}</b>`).join("")+`</div>`;
  box.querySelectorAll("b").forEach(el=>el.onclick=()=>{ state.sentido=el.dataset.p;
    box.querySelectorAll("b").forEach(b=>b.classList.toggle("on",b.dataset.p===state.sentido));
    if(["conges","bunch","cover","det"].includes(state.mapMode)) render(); });
}
function buildDettipo(){
  const box=$("dettipo-sel"); if(!box) return;
  box.innerHTML = `<span class="lbl">Detención</span><div class="seg">`+
    DET_TIPOS.map(([k,l])=>`<b data-p="${k}" class="${state.detTipo===k?"on":""}">${l}</b>`).join("")+`</div>`;
  box.querySelectorAll("b").forEach(el=>el.onclick=()=>{ state.detTipo=el.dataset.p;
    box.querySelectorAll("b").forEach(b=>b.classList.toggle("on",b.dataset.p===state.detTipo));
    if(state.mapMode==="det") render(); });
}
function buildCongsub(){
  const box=$("congsub-sel"); if(!box) return;
  box.innerHTML = `<span class="lbl">Medida</span><div class="seg">`+
    CONG_SUBS.map(([k,l])=>`<b data-p="${k}" class="${state.congSub===k?"on":""}">${l}</b>`).join("")+`</div>`;
  box.querySelectorAll("b").forEach(el=>el.onclick=()=>{ state.congSub=el.dataset.p;
    box.querySelectorAll("b").forEach(b=>b.classList.toggle("on",b.dataset.p===state.congSub));
    if(state.mapMode==="conges") render(); });
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
  // Cobertura dinámica también depende del período. El sub-selector está disponible en vista
  // SISTEMA (sin línea), pero el modo Cobertura+din también aplica en vista de LÍNEA.
  const coverDyn = state.mapMode==="cover" && (state.coverSub==="din" || state.coverSub==="od");
  const periodoRelevante = state.vista==="ranking" || (state.vista==="normal" && (state.mapMode==="conges"||state.mapMode==="wait"||state.mapMode==="bunch"||state.mapMode==="det"||coverDyn));
  // F1: período visible siempre en home (vista normal). Si no aplica al modo actual,
  // se marca data-inactive=1 (opacity .5) — sigue siendo un control de contexto presente.
  const periodoVisible = state.vista==="normal" || state.vista==="ranking";
  $("periodo-sel").style.display = periodoVisible ? "flex" : "none";
  $("periodo-sel").dataset.inactive = (periodoVisible && !periodoRelevante) ? "1" : "";
  const purposeRel = state.vista==="normal" && state.mapMode==="wait";
  if($("purpose-sel")) $("purpose-sel").style.display = purposeRel ? "flex" : "none";
  // Sub-selector de cobertura: visible en vista normal con mapMode=cover (sistema o línea)
  const coverSubRel = state.vista==="normal" && state.mapMode==="cover";
  if($("cover-sub")) $("cover-sub").style.display = coverSubRel ? "flex" : "none";
  const sentidoRel = state.vista==="normal" && (["conges","bunch"].includes(state.mapMode) || (state.linea!=="TODAS" && ["cover","det"].includes(state.mapMode)));
  if($("sentido-sel")) $("sentido-sel").style.display = sentidoRel ? "flex" : "none";
  const dettipoRel = state.vista==="normal" && state.mapMode==="det";
  if($("dettipo-sel")) $("dettipo-sel").style.display = dettipoRel ? "flex" : "none";
  // sub-selector de congestión (promedio/día crítico/estabilidad): solo en vista de RED (sin línea);
  // por línea aún no hay estadística día-a-día por arco (fase posterior).
  const congsubRel = state.vista==="normal" && state.mapMode==="conges";   // ahora también en vista línea (crit/estab por arco)
  if($("congsub-sel")) $("congsub-sel").style.display = congsubRel ? "flex" : "none";

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
  renderExcesos();
  renderFreqChart();
  renderLineFreqChart();
  renderCobDinLinea();
  renderMapa();
  renderLineaKpis();
  renderCoverTable();
  renderBunchTable();
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
  renderVelCiclo();
}

// estado semántico: "good"|"warning"|"critical"|"neutral" -> clases de valor y de tarjeta
const SEM_CLS = {good:"is-good", warning:"is-warning", critical:"is-critical", neutral:"is-neutral"};
const SEM_CARD = {good:"k-good", warning:"k-warning", critical:"k-critical", neutral:""};
function kpiCard(l,v,s,icon,stt){   // stt = good|warning|critical|neutral
  const st = stt||"neutral";
  return `<div class="kpi ${SEM_CARD[st]}"><div class="lab">${icon?`<span class="ic">${icon}</span>`:""}${l}</div>`+
    `<div class="val ${SEM_CLS[st]}">${v}</div><div class="sub">${s}</div></div>`;
}
// umbral "más alto es mejor" (velocidad) y "más bajo es mejor" (detenido)
const semHigh = (v,g,w) => v>=g?"good":v>=w?"warning":"critical";
const semLow  = (v,g,w) => v<g?"good":v<w?"warning":"critical";
function renderKPIs(cell){
  const home = state.vista==="normal" && state.linea==="TODAS" && state.comuna==="TODAS";
  const lineView = state.vista==="normal" && state.linea!=="TODAS";
  const comView = state.vista==="normal" && state.comuna!=="TODAS" && state.linea==="TODAS";
  if((home || lineView || comView) && DIA && BASE30){ renderLiveKPIs(); return; }
  const k = cell.kpi;
  if(!k){ $("kpis2").innerHTML = `<div class="empty">Sin datos para este ámbito.</div>`; return; }
  const ctx = kpiCard("Líneas", k.n_lineas, "operando en el ámbito", IC.bus, "neutral");
  $("kpis2").innerHTML = [
    kpiCard("Flota en punta", fmt(k.flota_pico), "buses activos máx/hora", IC.bus, "neutral"),
    kpiCard("Velocidad media", fmt1(k.vel)+" km/h", "efectiva, en ruta", IC.zap, semHigh(k.vel,22,14)),
    kpiCard("Tiempo detenido", fmt1(k.pct_det)+" %", "en ruta · excl. terminales", IC.stop, semLow(k.pct_det,18,28)),
    ctx,
  ].join("");
}

/* ---------- Recuadros del INICIO: vivo (dia.json) vs baseline histórico del bin actual ----------
   Los KPIs se definen en data/kpis_spec.json (declarativo). Agregar uno = añadir un objeto allí.
   Fallback inline por si el spec no cargó. */
const _LIVE_FMT = {int:v=>fmt(Math.round(v)), dec1:v=>fmt1(v), pct:v=>fmt1(v)+"%"};
let LIVE_KPIS = [
  // los 4 estados de flota (en ruta + en terminal + fuera de servicio + sin operar = flota)
  {k:"buses_op", lab:"Buses en ruta",          ic:IC.bus,   dir:1,  unit:"",       f:v=>fmt(Math.round(v))},
  {k:"term",     lab:"Buses en terminal",      ic:IC.park,  dir:-1, unit:"",       f:v=>fmt(Math.round(v))},  // más que lo normal = malo (rojo)
  {k:"descanso", lab:"Fuera de servicio",      ic:IC.pause, dir:-1, unit:"",       f:v=>fmt(Math.round(v))},  // más fuera de servicio = malo (rojo)
  {k:"inact",    lab:"Sin operar hoy",         ic:IC.sleep, dir:-1, unit:"",       f:v=>fmt(Math.round(v))},
  // calidad de operación
  {k:"vel",      lab:"Velocidad media",        ic:IC.zap,  dir:1,  unit:" km/h",  f:v=>fmt1(v)},
  {k:"det",      lab:"Tiempo detenido",        ic:IC.stop, dir:-1, unit:" %",     f:v=>fmt1(v)},
  {k:"freq",     lab:"Frecuencia terminales",  ic:IC.freq, dir:1,  unit:"/30min", f:v=>fmt(Math.round(v))},
];
function gaugeColor(pct,dir){
  if(pct==null) return "#64748b";
  const g = dir>0 ? pct : dir<0 ? 200-pct : pct;
  return g>=95 ? "#34d399" : g>=75 ? "#fbbf24" : "#f87171";
}
function liveBox(s, live, norm, pct){
  // F1: reloj semicírculo más compacto; valor dentro del arco, aguja, % al final de la aguja.
  // Baseline "normal a esta hora" abajo en mono/--muted + delta semántico (▲/▼/=).
  const col = gaugeColor(pct, s.dir);
  const cx=100, cy=98, r=84;                             // r baja de 80 a 72 (más aire)
  const p = Math.max(0, Math.min(pct==null?0:pct, 200));
  const a = Math.PI*(1 - p/200);                         // 0%→izq, 100%→arriba, 200%→der
  const tx=(cx+r*Math.cos(a)).toFixed(1), ty=(cy-r*Math.sin(a)).toFixed(1);
  const lx=(cx+(r+16)*Math.cos(a)).toFixed(1), ly=(cy-(r+16)*Math.sin(a)).toFixed(1);
  const valTxt = live==null ? "—" : s.f(live);
  const pctTxt = pct==null ? "—" : (pct>300 ? "300%+" : Math.round(pct)+"%");   // cap visual
  const normTxt = norm==null ? "—" : s.f(norm)+s.unit;
  // delta semántico: ▲ mejor, ▼ peor, = igual (según dir del KPI)
  let deltaTxt = "", deltaCol = "var(--muted)";
  if(pct!=null && s.dir!==0){
    const diff = Math.round(pct-100);
    const arrow = diff>2 ? "▲" : diff<-2 ? "▼" : "=";
    const diffTxt = Math.abs(diff)>200 ? (diff>0?"+200%+":"-200%+") : `${diff>=0?"+":""}${diff}%`;
    deltaCol = gaugeColor(pct, s.dir);
    deltaTxt = `<span class="g-delta" style="color:${deltaCol}">${arrow} ${diffTxt}</span>`;
  } else if(pct!=null){
    deltaTxt = `<span class="g-delta" style="color:${col}"> · ${pctTxt}</span>`;
  }
  const prog = pct==null ? "" :
    `<path d="M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${tx} ${ty}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round"/>`+
    `<line x1="${cx}" y1="${cy}" x2="${tx}" y2="${ty}" stroke="${col}" stroke-width="2.5" stroke-linecap="round"/>`+
    `<circle cx="${cx}" cy="${cy}" r="4" fill="${col}"/>`+
    `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" class="g-pct" fill="${col}">${pctTxt}</text>`;
  return `<div class="kpi klive" data-k="${s.k}" style="border-color:${col}30"><div class="lab"><span class="ic">${s.ic}</span>${s.lab}</div>`+
    `<svg class="gauge" viewBox="-8 -12 216 118">`+
      `<path d="M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}" fill="none" stroke="#2a3550" stroke-width="7" stroke-linecap="round"/>`+
      prog+
      `<text x="${cx}" y="${cy-14}" text-anchor="middle" class="g-val" fill="${col}">${valTxt}<tspan class="g-unit" dx="2">${s.unit}</tspan></text>`+
    `</svg>`+
    `<div class="sub">${norm!=null ? `normal: <b class="g-norm">${normTxt}</b>${deltaTxt}` : `<span style="color:var(--muted)">${valTxt}${s.unit}</span>`}</div></div>`;
}
// F2: animación count-up; respeta prefers-reduced-motion
const REDUCED_MOTION = matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const LIVE_PREV = {};
function animateNumber(setter, from, to, ms, fmt){
  if(REDUCED_MOTION || from==null || to==null){ setter(fmt(to)); return; }
  if(Math.abs(to-from) < 0.5){ setter(fmt(to)); return; }
  const t0 = performance.now();
  let done = false;
  (function step(t){
    if(done) return;
    const k = Math.min(1, ((t||performance.now())-t0)/ms);
    const e = k<.5 ? 2*k*k : 1-Math.pow(-2*k+2,2)/2;
    setter(fmt(from + (to-from)*e));
    if(k<1) requestAnimationFrame(step); else done = true;
  })(performance.now());
  // Fallback: garantiza valor final aunque rAF se retrase (preview headless / pestaña en background)
  setTimeout(()=>{ if(!done){ done = true; setter(fmt(to)); } }, ms+80);
}
// F2: actualizar una tarjeta KPI in-place (sin reescribir el SVG entero) → count-up suave
function updateLiveCard(card, s, live, norm, pct, prev){
  const cx=100, cy=98, r=84;
  const col = gaugeColor(pct, s.dir);
  card.style.borderColor = col+"30";
  const p = Math.max(0, Math.min(pct==null?0:pct, 200));
  const a = Math.PI*(1 - p/200);
  const tx=(cx+r*Math.cos(a)).toFixed(1), ty=(cy-r*Math.sin(a)).toFixed(1);
  const lx=(cx+(r+16)*Math.cos(a)).toFixed(1), ly=(cy-(r+16)*Math.sin(a)).toFixed(1);
  const pctTxt = pct==null ? "—" : Math.round(pct)+"%";
  const normTxt = norm==null ? "—" : s.f(norm)+s.unit;
  const valNode = card.querySelector('.g-val');
  if(valNode) valNode.setAttribute('fill', col);
  const valText = valNode && valNode.firstChild;
  const unitT = valNode && valNode.querySelector('.g-unit');
  // animar el textNode del valor; mantener el tspan de unidad
  if(valText && live!=null){
    const fromV = (prev==null) ? 0 : prev;
    animateNumber(t => { valText.nodeValue = t; }, fromV, live, 650, s.f);
  } else if(valText){ valText.nodeValue = "—"; }
  if(unitT) unitT.textContent = s.unit;
  // arco/aguja/% del gauge
  const paths = card.querySelectorAll('svg.gauge path');
  if(paths[1]){ paths[1].setAttribute('d', `M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${tx} ${ty}`); paths[1].setAttribute('stroke', col); }
  const line = card.querySelector('svg.gauge line');
  if(line){ line.setAttribute('x2', tx); line.setAttribute('y2', ty); line.setAttribute('stroke', col); }
  const dot = card.querySelectorAll('svg.gauge circle')[0];
  if(dot){ dot.setAttribute('fill', col); }
  const gPct = card.querySelector('.g-pct');
  if(gPct){ gPct.textContent = pctTxt; gPct.setAttribute('x', lx); gPct.setAttribute('y', ly); gPct.setAttribute('fill', col); }
  // subtítulo
  const gNorm = card.querySelector('.g-norm');
  if(gNorm) gNorm.textContent = normTxt;
  const gDelta = card.querySelector('.g-delta');
  if(gDelta){
    if(pct!=null && s.dir!==0){
      const diff = Math.round(pct-100);
      const arrow = diff>2 ? "▲" : diff<-2 ? "▼" : "=";
      gDelta.textContent = `${arrow} ${diff>=0?"+":""}${diff}%`;
      gDelta.style.color = col;
    } else if(pct!=null){
      gDelta.textContent = pctTxt; gDelta.style.color = col;
    } else { gDelta.textContent = ""; }
  }
}
let _comGPSdata=null, _comGPStag="";
function _comGPS(){
  const C = state.comuna!=="TODAS" ? state.comuna : null;
  if(!C||!LIVE||!LIVE.buses) return null;
  const tag=C+"|"+(LIVE.snapshot_utc||"");
  if(_comGPSdata&&_comGPStag===tag) return _comGPSdata;
  const buses=LIVE.buses.filter(b=>b[2]&&inComuna(b[0],b[1]));
  const n=buses.length;
  if(!n){_comGPSdata={buses_op:0,vel:null,det:null,term:0};_comGPStag=tag;return _comGPSdata;}
  let sumSpd=0,nMov=0,stopped=0,atTerm=0;
  for(const b of buses){
    if(b[4]){nMov++;sumSpd+=b[3];}
    else if(nearTerminal(b[0],b[1],b[2])){atTerm++;}
    else{stopped++;}
  }
  const vel=nMov>0?Math.round(sumSpd/nMov*10)/10:null;
  const inRoute=nMov+stopped;
  const det=inRoute>0?Math.round(1000*stopped/inRoute)/10:null;
  _comGPSdata={buses_op:n,vel,det,term:atTerm};_comGPStag=tag;
  return _comGPSdata;
}
function _liveVal(s, L){
  // freq vivo: señal por bloques (dato disponible). Sin comparación al baseline (ver _baseVal):
  // el método de EXPEDICIONES en vivo (freq_trm) está en calibración.
  if(L){
    if(s.k==="freq") return (DIA.freq_blk_serie_lin||{})[L] ? (DIA.freq_blk_serie_lin[L][DIA.bin]||0) : 0;
    const ld = DIA[s.k+"_lin"];
    if(!ld) return null;
    return ld[L] ?? 0;
  }
  const C = state.comuna!=="TODAS" ? state.comuna : null;
  if(C){
    // COMUNA = agrega las líneas que operan en ella, con el MISMO método que sistema/línea
    // (deriva de DIA.*_lin del capturador, no del GPS instantáneo). Coherente y comparable al baseline.
    const lines = CLIN[C]||[];
    if(s.k==="freq"){
      const fsl = DIA.freq_blk_serie_lin||{};
      return lines.reduce((sum,l)=>sum+((fsl[l]||[])[DIA.bin]||0),0);
    }
    if(s.k==="vel"||s.k==="det"){            // promedio ponderado por volumen (buses en ruta por línea)
      const vl=DIA[s.k+"_lin"]||{}, w=DIA.buses_op_lin||{};
      let sv=0,sw=0;
      for(const l of lines){ const v=vl[l], ww=w[l]||0; if(v!=null&&ww>0){sv+=v*ww;sw+=ww;} }
      return sw>0 ? Math.round(sv/sw*10)/10 : null;
    }
    const ld=DIA[s.k+"_lin"];                // buses_op, term, inact, descanso: suma de líneas
    if(!ld) return null;
    return lines.reduce((sum,l)=>sum+(ld[l]||0),0);
  }
  if(s.k==="freq") return DIA.freq_blk ?? 0;
  return DIA[s.k];
}
function _baseVal(s, base, b, L){
  // freq: baseline por RUNS ya corregido, pero el VIVO de expediciones aún se calibra (map-matcher
  // pierde lock en corredores; trip_id se resetea a mitad). Sin comparación % hasta tener vivo robusto.
  const noBase = ["freq"];   // freq: vivo (expediciones por tramos) en calibración; muestra solo perfil normal
  if(noBase.includes(s.k)) return null;
  if(L){
    const bl = base[s.k+"_lin"];
    return bl && bl[L] ? bl[L][b] : null;
  }
  const C = state.comuna!=="TODAS" ? state.comuna : null;
  if(C){
    const lines = CLIN[C]||[];
    if(s.k==="vel"||s.k==="det"){
      const bl=base[s.k+"_lin"], bbl=base.buses_op_lin;
      if(!bl||!bbl) return null;
      let sw=0,sv=0;
      for(const l of lines){ const v=bl[l]?bl[l][b]:null,w=bbl[l]?bbl[l][b]:0; if(v!=null&&w>0){sv+=v*w;sw+=w;} }
      return sw>0 ? Math.round(sv/sw*10)/10 : null;
    }
    const bl=base[s.k+"_lin"];
    if(!bl) return null;
    return lines.reduce((sum,l)=>sum+((bl[l]||[])[b]||0),0);
  }
  return (base[s.k]||[])[b];
}
function renderLiveKPIs(){
  const base = BASE30[DIA.dia_tipo] || {}, b = DIA.bin;
  const L = state.linea!=="TODAS" ? state.linea : null;
  const cont = $("kpis2");
  const baseCount = LIVE_KPIS.reduce((n,s)=> n + (cont.querySelector(`.klive[data-k="${s.k}"]`)?1:0), 0);
  const prevL = cont.dataset.lin || null;
  if(baseCount !== LIVE_KPIS.length || prevL !== (L||"")){
    cont.dataset.lin = L||"";
    cont.innerHTML = LIVE_KPIS.map(s=>{
      const live = _liveVal(s, L);
      const norm = _baseVal(s, base, b, L);
      const pct = (norm!=null && norm>0 && live!=null) ? 100*live/norm : null;
      return liveBox(s, live, norm, pct);
    }).join("");
    LIVE_KPIS.forEach(s=>{
      const card = cont.querySelector(`.klive[data-k="${s.k}"]`); if(!card) return;
      const live = _liveVal(s, L);
      const vn = card.querySelector('.g-val'), tn = vn && vn.firstChild;
      if(tn && live!=null) animateNumber(t => { tn.nodeValue = t; }, 0, live, 850, s.f);
      LIVE_PREV[s.k] = live;
    });
    renderLiveExtras();
    return;
  }
  LIVE_KPIS.forEach(s=>{
    const card = cont.querySelector(`.klive[data-k="${s.k}"]`); if(!card) return;
    const live = _liveVal(s, L);
    const norm = _baseVal(s, base, b, L);
    const pct = (norm!=null && norm>0 && live!=null) ? 100*live/norm : null;
    updateLiveCard(card, s, live, norm, pct, LIVE_PREV[s.k]);
    LIVE_PREV[s.k] = live;
  });
  renderLiveExtras();
}
function loadDia(){
  fetch("https://storage.googleapis.com/gccp-transporte-live/dia.json?t="+Date.now(),{cache:"no-store"})
    .then(r=>r.json()).then(d=>{ DIA=d;
      if(state.vista==="normal" && BASE30){
        renderLiveKPIs(); renderFreqChart(); renderExcesos();
        renderLineFreqChart();
        if(state.mapMode==="exc") renderMapa();
      }
    }).catch(()=>{});
  // "Ayer" = último día completo (lo persiste el capturador al cambiar de fecha). 404 hasta el 1er cierre.
  if(AYERFREQ===null) fetch("https://storage.googleapis.com/gccp-transporte-live/ayer.json?t="+Date.now(),{cache:"no-store"})
    .then(r=>r.ok?r.json():null).then(d=>{ if(d){ AYERFREQ=d; if(state.vista==="normal"&&state.linea!=="TODAS") renderLineFreqChart(); } }).catch(()=>{});
}

/* ===== KPIs en vivo EXTRA: cobertura instantánea + déficit por línea =====
   "Foto" en cada refresh de live.json: una manzana está cubierta AHORA si hay ≥1 bus a ≤300 m
   de su centroide. KPI 1 = % de hogares cubiertos del Gran CCP. KPI 2 = mismo % por comuna.
   KPI 3 = top-5 líneas con menor (buses_ahora / flota_pico).
   Costo: cero en cloud — todo se computa en el navegador sobre live.json + cobertura.json. */
let MANZ_GRID = null;                     // grid espacial: bucket → [{i, cy, cx, hog, com}]
const COB_BUCKET = 0.003;                 // ~330 m por bucket (suficiente para BUF=300 m con 9 buckets)
const COB_BUF = 300, COB_BUF2 = COB_BUF*COB_BUF;   // radio de cápsula instantánea
let TOT_HOG_GLOBAL = 0;
const TOT_HOG_COM = {};                   // {comuna: total hogares}
const FLOTA_PICO_LIN = {};                // {linea: flota_pico}
const COM_ORDER = ["Concepción","Talcahuano","San Pedro de la Paz","Hualpén","Chiguayante","Penco","Hualqui"];

function _pipPoly(la, lo, geom){
  const polys = geom.type==="Polygon" ? [geom.coordinates] : geom.coordinates;
  for(const poly of polys){
    if(pipRing(lo, la, poly[0])){
      let inHole = false;
      for(let i=1;i<poly.length;i++){ if(pipRing(lo, la, poly[i])){ inHole=true; break; } }
      if(!inHole) return true;
    }
  }
  return false;
}
function buildManzanaIndex(){
  if(MANZ_GRID || !COB || !GEO) return;
  const comunas = (GEO.features||[]).map(f=>({name:f.properties.name, geom:f.geometry}));
  MANZ_GRID = {};
  COB.features.forEach((f, i) => {
    const p = f.properties; if(p.cy==null||p.cx==null) return;
    if(!p._com){
      for(const c of comunas){ if(_pipPoly(p.cy, p.cx, c.geom)){ p._com = c.name; break; } }
    }
    const k = `${Math.floor(p.cy/COB_BUCKET)}_${Math.floor(p.cx/COB_BUCKET)}`;
    (MANZ_GRID[k] = MANZ_GRID[k] || []).push({i, cy:p.cy, cx:p.cx, hog:p.hog||0, com:p._com||null});
    TOT_HOG_GLOBAL += (p.hog||0);
    if(p._com) TOT_HOG_COM[p._com] = (TOT_HOG_COM[p._com]||0) + (p.hog||0);
  });
  if(T && T.cells){
    Object.entries(T.cells).forEach(([k, v]) => {
      const m = /^TODAS\|(.+)$/.exec(k); if(!m) return;
      const fp = ((v||{}).kpi||{}).flota_pico;
      if(fp) FLOTA_PICO_LIN[m[1]] = fp;
    });
  }
}
function computeLiveExtras(filterL){
  if(!LIVE || !LIVE.buses || !MANZ_GRID) return null;
  let buses = LIVE.buses.filter(b => b[2]);                         // con línea = en servicio
  if(filterL) buses = buses.filter(b => b[2]===filterL);
  const MX = 111320*Math.cos(-36.83*Math.PI/180), MY = 110540;
  const covered = new Set();
  for(const b of buses){
    const la=b[0], lo=b[1];
    const ky=Math.floor(la/COB_BUCKET), kx=Math.floor(lo/COB_BUCKET);
    for(let dy=-1; dy<=1; dy++) for(let dx=-1; dx<=1; dx++){
      const arr = MANZ_GRID[`${ky+dy}_${kx+dx}`]; if(!arr) continue;
      for(const m of arr){
        if(covered.has(m.i)) continue;
        const ex=(m.cx-lo)*MX, ey=(m.cy-la)*MY;
        if(ex*ex+ey*ey <= COB_BUF2) covered.add(m.i);
      }
    }
  }
  let cob_hog = 0; const cob_hog_com = {};
  for(const i of covered){
    const p = COB.features[i].properties, h = p.hog||0;
    cob_hog += h;
    if(p._com) cob_hog_com[p._com] = (cob_hog_com[p._com]||0) + h;
  }
  const byLine = {};
  for(const b of buses){ byLine[b[2]] = (byLine[b[2]]||0) + 1; }
  const all_lineas = Object.entries(FLOTA_PICO_LIN).map(([L, fp]) => ({
    L, now: byLine[L]||0, max: fp, pct: 100*(byLine[L]||0)/fp
  })).filter(d => d.max > 0);
  const def_lineas = all_lineas.slice().sort((a,b) => a.pct - b.pct).filter(d => d.L !== "TODAS").slice(0, 5);
  const top_lineas = all_lineas.slice().sort((a,b) => b.pct - a.pct).filter(d => d.L !== "TODAS").slice(0, 5);
  return { cob_hog, cob_hog_com, def_lineas, top_lineas, n_buses: buses.length };
}
function renderLiveExtras(){
  buildManzanaIndex();
  const L = state.linea!=="TODAS" ? state.linea : null;
  const C = state.comuna!=="TODAS" ? state.comuna : null;
  const ex = computeLiveExtras(L); if(!ex) return;
  const cont = $("kpis2"); if(!cont) return;
  if(C){
    const comHog = ex.cob_hog_com[C]||0, comTot = TOT_HOG_COM[C]||0;
    const pct = comTot>0 ? 100*comHog/comTot : null;
    const gps = _comGPS();
    const nb = gps ? gps.buses_op : 0;
    const c1 = cont.querySelector('.klive[data-k="cob_now"]');
    const c1HTML = liveBoxCobAhora(comHog, comTot, pct, nb);
    if(c1) c1.outerHTML = c1HTML; else cont.insertAdjacentHTML("beforeend", c1HTML);
    const c2 = cont.querySelector('.klive[data-k="cob_com"]'); if(c2) c2.remove();
    const c3 = cont.querySelector('.klive[data-k="fleet_lin"]'); if(c3) c3.remove();
    return;
  }
  const pct_tot = TOT_HOG_GLOBAL>0 ? 100*ex.cob_hog/TOT_HOG_GLOBAL : null;
  const c1 = cont.querySelector('.klive[data-k="cob_now"]');
  const c1HTML = liveBoxCobAhora(ex.cob_hog, TOT_HOG_GLOBAL, pct_tot, ex.n_buses);
  if(c1) c1.outerHTML = c1HTML; else cont.insertAdjacentHTML("beforeend", c1HTML);
  const c2 = cont.querySelector('.klive[data-k="cob_com"]');
  const c2HTML = liveBoxCobComuna(ex.cob_hog_com);
  if(c2) c2.outerHTML = c2HTML; else cont.insertAdjacentHTML("beforeend", c2HTML);
  if(!L){
    const c3 = cont.querySelector('.klive[data-k="fleet_lin"]');
    const c3HTML = liveBoxFleetLineas(ex.def_lineas, ex.top_lineas);
    if(c3) c3.outerHTML = c3HTML; else cont.insertAdjacentHTML("beforeend", c3HTML);
  } else {
    const c3 = cont.querySelector('.klive[data-k="fleet_lin"]');
    if(c3) c3.remove();
  }
}
function liveBoxCobAhora(hog, tot, pct, nb){
  const col = pct==null ? "#64748b" : pct>=60 ? "#34d399" : pct>=30 ? "#fbbf24" : "#f87171";
  const cx=100, cy=98, r=84;
  const p = Math.max(0, Math.min(pct==null?0:pct, 100));
  const a = Math.PI*(1 - p/100);                                  // 0..100 → izq..der
  const tx=(cx+r*Math.cos(a)).toFixed(1), ty=(cy-r*Math.sin(a)).toFixed(1);
  const lx=(cx+(r+16)*Math.cos(a)).toFixed(1), ly=(cy-(r+16)*Math.sin(a)).toFixed(1);
  const valTxt = NF.format(Math.round(hog));
  const pctTxt = pct==null ? "—" : pct.toFixed(1)+"%";
  const prog = pct==null ? "" :
    `<path d="M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${tx} ${ty}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round"/>`+
    `<line x1="${cx}" y1="${cy}" x2="${tx}" y2="${ty}" stroke="${col}" stroke-width="2.5" stroke-linecap="round"/>`+
    `<circle cx="${cx}" cy="${cy}" r="4" fill="${col}"/>`+
    `<text x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle" class="g-pct" fill="${col}">${pctTxt}</text>`;
  return `<div class="kpi klive" data-k="cob_now" style="border-color:${col}30"><div class="lab"><span class="ic">${IC.home}</span>Cobertura ahora</div>`+
    `<svg class="gauge" viewBox="-8 -12 216 118">`+
      `<path d="M ${cx-r} ${cy} A ${r} ${r} 0 0 1 ${cx+r} ${cy}" fill="none" stroke="#2a3550" stroke-width="7" stroke-linecap="round"/>`+
      prog+
      `<text x="${cx}" y="${cy-14}" text-anchor="middle" class="g-val" fill="${col}">${valTxt}<tspan class="g-unit" dx="2"> hog</tspan></text>`+
    `</svg>`+
    `<div class="sub">de <b class="g-norm">${NF.format(tot)}</b> hogares · <b>${nb}</b> buses</div></div>`;
}
function liveBoxCobComuna(byCom){
  const rows = COM_ORDER.map(name => {
    const tot = TOT_HOG_COM[name]||0, cob = byCom[name]||0;
    const pct = tot>0 ? 100*cob/tot : null;
    const col = pct==null ? "#64748b" : pct>=60 ? "#34d399" : pct>=30 ? "#fbbf24" : "#f87171";
    const w = pct==null ? 0 : Math.min(100, pct);
    const pctTxt = pct==null ? "—" : pct.toFixed(0)+"%";
    return `<div class="kcr"><div class="kcr-nm">${name}</div>`+
      `<div class="kcr-bar"><div class="kcr-fill" style="width:${w}%;background:${col}"></div></div>`+
      `<div class="kcr-vp" style="color:${col}">${pctTxt}</div></div>`;
  }).join("");
  return `<div class="kpi klive" data-k="cob_com"><div class="lab"><span class="ic">${IC.map}</span>Cobertura por comuna</div>`+
    `<div class="kcr-list">${rows}</div>`+
    `<div class="sub">% hogares con ≥1 bus ≤300 m</div></div>`;
}
function _linFleetRow(d, top){
  const pct = d.pct;
  const col = top
    ? (pct>=100 ? "#34d399" : pct>=80 ? "#a3e635" : "#fbbf24")
    : (pct>=70 ? "#fbbf24" : pct>=40 ? "#fb923c" : "#f87171");
  const w = Math.min(100, pct);
  const emp = empresaDe(d.L);
  const nm = emp ? `<span class="lncode">${d.L}</span> ${emp}` : `<span class="lncode">${d.L}</span>`;
  return `<div class="kcr kcr--lin">`+
    `<div class="kcr-nm">${nm}<span class="kcr-vp" style="color:${col}">${d.now}/${Math.round(d.max)}</span></div>`+
    `<div class="kcr-row"><div class="kcr-bar"><div class="kcr-fill" style="width:${w}%;background:${col}"></div><span class="bar-pct">${pct.toFixed(0)}%</span></div></div>`+
    `</div>`;
}
let _fleetMode = "menos";
function liveBoxFleetLineas(def, top){
  const defRows = def.map(d=>_linFleetRow(d,false)).join("");
  const topRows = top.map(d=>_linFleetRow(d,true)).join("");
  const empty = `<div class="sub" style="text-align:center;padding:6px 0">sin datos</div>`;
  const isMenos = _fleetMode==="menos";
  return `<div class="kpi klive" data-k="fleet_lin"><div class="lab"><span class="ic">${IC.bus}</span>Flota por línea</div>`+
    `<div class="fleet-toggle">`+
      `<button class="${isMenos?"on":""}" onclick="_fleetMode='menos';renderLiveExtras()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>Menos</button>`+
      `<button class="${!isMenos?"on":""}" onclick="_fleetMode='mas';renderLiveExtras()"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>Más</button>`+
    `</div>`+
    `<div class="kcr-list">${isMenos ? (defRows||empty) : (topRows||empty)}</div>`+
    `<div class="sub">buses ahora / flota pico</div></div>`;
}
// Gráfico: frecuencia de salida de terminales — promedio histórico del tipo de día vs observado hoy
// F6: widget de 6 KPIs en vista LÍNEA cuando el modo es Cobertura Dinámica
function renderCobDinLinea(){
  const card = $("cob-din-line"); if(!card) return;
  const lineActive = state.vista==="normal" && state.linea!=="TODAS";
  const cdMode = state.mapMode==="cover" && state.coverSub==="din";
  if(!(lineActive && cdMode) || !DINL){ card.style.display="none"; return; }
  const L = state.linea, info = DINL.lineas?.[L];
  if(!info){ card.style.display="none"; return; }
  card.style.display="";
  const per = state.periodo;
  const frac = info.frac?.[per] ?? null;
  const f = info.f_obs?.[per] ?? null;
  const H = (f && f>0) ? (60/f) : null;
  const pct = frac==null ? null : Math.round(frac*100);
  const hogDin = (info.hog && frac!=null) ? Math.round(info.hog * frac) : null;
  const nseLoDin = (info.nse_lo && frac!=null) ? Math.round(info.nse_lo * frac) : null;
  const nseMdDin = (info.nse_md && frac!=null) ? Math.round(info.nse_md * frac) : null;
  const nseHiDin = (info.nse_hi && frac!=null) ? Math.round(info.nse_hi * frac) : null;
  const pill = (ic,lab,val,sub) =>
    `<div class="cdl-pill"><div class="lab">${ic?`<span>${ic}</span>`:""}${lab}</div>`+
    `<div class="val">${val}</div>${sub?`<div class="sub">${sub}</div>`:""}</div>`;
  $("cdl-grid").innerHTML = [
    pill(IC.home,"Hogares cubiertos", hogDin==null?"—":NF.format(hogDin), `${pct==null?"—":pct+"%"} del tiempo · base ${NF.format(info.hog)}`),
    pill(IC.nseDn,"NSE bajo", nseLoDin==null?"—":NF.format(nseLoDin), `de ${NF.format(info.nse_lo)} hog`),
    pill(IC.nseMd,"NSE medio", nseMdDin==null?"—":NF.format(nseMdDin), `de ${NF.format(info.nse_md)} hog`),
    pill(IC.nseUp,"NSE alto", nseHiDin==null?"—":NF.format(nseHiDin), `de ${NF.format(info.nse_hi)} hog`),
    pill(IC.ruler,"Hogares por km", info.hog_por_km==null?"—":NF.format(info.hog_por_km), `línea ${info.km} km`),
    pill(IC.cycle,"Ciclos/bus/día", info.ciclos_bus_dia==null?"—":info.ciclos_bus_dia.toFixed(1), `flota ${info.buses??"—"} · ${info.despachos_dia_L??"—"} desp/día`),
  ].join("");
  $("cdl-sub").textContent = `línea ${L} · ${periodoLbl(per)} · f=${f==null?"—":f.toFixed(1)} bus/h · headway ${H==null?"—":H.toFixed(1)+" min"}`;
  const narr = $("cdl-narr");
  if(narr){
    narr.innerHTML = `Modelo <b>cápsula 2 min + 300 m</b>: cada bus cubre su trazado durante ~2 min al pasar. `+
      `Con <b>${f==null?"—":f.toFixed(1)} bus/h</b> el headway es <b>${H==null?"—":H.toFixed(1)} min</b> → cobertura del <b>${pct==null?"—":pct+"%"}</b> del tiempo en ${periodoLbl(per)}. `+
      `Los hogares cubiertos dinámicamente son los <b>estáticos × frac</b>; los KPIs por NSE muestran cómo se distribuyen entre terciles (bajo &lt; ${NF.format(DINL.nse_terciles?.lo_lt||0)} / medio &lt; ${NF.format(DINL.nse_terciles?.md_lt||0)} / alto ≥ ${NF.format(DINL.nse_terciles?.md_lt||0)} CLP/m²).`;
  }
}
function renderFreqChart(){
  const card=$("freq-card"); if(!card) return;
  const home = state.vista==="normal" && state.linea==="TODAS" && state.comuna==="TODAS";
  const comView = state.vista==="normal" && state.comuna!=="TODAS" && state.linea==="TODAS";
  if((!home && !comView) || !BASE30 || !CUMP || !CUMP.horas){ card.style.display="none"; return; }
  card.style.display="";
  if(!freqChart) freqChart = echarts.init($("ch-freq"));
  const dia = state.freqDia || "L";
  const DL = {L:"Laborable", S:"Sábado", D:"Domingo"};
  const horas = CUMP.horas;
  const lines = comView ? (CLIN[state.comuna]||[]) : Object.keys(CUMP.lineas||{});
  // OBSERVADA (promedio histórico), agregada a hora: sistema = BASE30[dia].freq; comuna = suma de freq_lin
  const bd = BASE30[dia]||{};
  const obsBin = comView
    ? Array.from({length:48},(_,i)=>lines.reduce((s,l)=>s+(((bd.freq_lin||{})[l]||[])[i]||0),0))
    : (bd.freq||[]);
  const salida = horas.map(h=>{ const a=obsBin[2*h], b=obsBin[2*h+1]; return (a==null&&b==null)?null:Math.round(((a||0)+(b||0))*10)/10; });
  // EXIGIDA (GTFS): suma de despachos/hora programados sobre las líneas (todas = sistema, o de la comuna)
  const exigida = horas.map((h,idx)=>{ let s=0,any=false; for(const l of lines){ const p=CUMP.lineas[l]&&CUMP.lineas[l].prog&&CUMP.lineas[l].prog[dia]; if(p&&p[idx]!=null){s+=p[idx];any=true;} } return any?Math.round(s):null; });
  const th=TH(), x=horas.map(h=>h+"h");
  freqChart.setOption({
    textStyle:{fontFamily:th.font,color:th.tx},
    grid:{left:8,right:12,top:30,bottom:20,containLabel:true},
    legend:{data:["Exigida (GTFS)","Salida (observada)"],textStyle:{color:th.mut},top:0},
    tooltip:{trigger:"axis",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx},
      formatter:p=>{const t=p[0].axisValue; let s=`${t}<br>`; p.forEach(x=>{if(x.value!=null)s+=`${x.marker}${x.seriesName}: <b>${Math.round(x.value)}</b><br>`;}); return s;}},
    xAxis:{type:"category",data:x,axisLabel:{color:th.mut,fontSize:9,interval:1},axisLine:{lineStyle:{color:th.axis}}},
    yAxis:{type:"value",name:"despachos/hora",nameTextStyle:{color:th.mut,fontSize:10},axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
    series:[
      {name:"Exigida (GTFS)",type:"line",data:exigida,smooth:true,symbol:"none",lineStyle:{width:2.5,color:"#fbbf24",type:"dashed"},itemStyle:{color:"#fbbf24"}},
      {name:"Salida (observada)",type:"line",data:salida,smooth:true,symbol:"none",lineStyle:{width:2,color:cssv("--live")},itemStyle:{color:cssv("--live")},areaStyle:{color:cssv("--live")+"18"}},
    ],
  },true);
  setTimeout(()=>freqChart.resize(),60);
  const dsel = ["L","S","D"].map(d=>`<b data-fd="${d}" style="cursor:pointer;padding:1px 7px;border-radius:5px;${d===dia?"background:var(--live-tint);color:var(--live);font-weight:700":"color:var(--muted)"}">${DL[d]}</b>`).join(" ");
  const sub=$("freq-sub");
  sub.innerHTML = `${comView?state.comuna+" · ":""}despachos/hora · salida vs exigida &nbsp; ${dsel}`;
  sub.querySelectorAll("b[data-fd]").forEach(el=>el.onclick=()=>{ state.freqDia=el.dataset.fd; renderFreqChart(); });
}

function renderLineFreqChart(){
  // Panel superior de la vista LÍNEA: FRECUENCIA DE SALIDA EN TIEMPO REAL. Despacho = bus que sale de su
  // terminal a la ruta (capturador; ventana móvil de 60 min = buses/hora). Se superpone la frecuencia
  // EXIGIDA (GTFS) del día como referencia. La curva viva se dibuja hasta el bin actual.
  const card=$("lin-freq-card"); if(!card) return;
  const lineActive = state.vista==="normal" && state.linea!=="TODAS";
  if(!lineActive){ card.style.display="none"; return; }
  card.style.display="";
  const L = state.linea, el=$("ch-lin-freq");
  const ser = (DIA && DIA.freq_out_serie_lin && DIA.freq_out_serie_lin[L]) || null;
  const b = (DIA && typeof DIA.bin==="number") ? DIA.bin : -1;
  if(!ser || b<0 || !CUMP || !CUMP.horas){
    if(linFreqChart){ try{linFreqChart.dispose();}catch(e){} linFreqChart=null; }
    if(el) el.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;min-height:180px;text-align:center;color:var(--muted);font-size:12.5px;padding:0 16px">Aún sin despachos en tiempo real hoy para la línea ${L}</div>`;
    $("lin-freq-sub").textContent = `línea ${L} · frecuencia de salida en tiempo real`;
    return;
  }
  if(el) el.innerHTML="";
  if(!linFreqChart) linFreqChart = echarts.init(el);
  const horas = CUMP.horas, dia = (DIA && DIA.dia_tipo) || "L";
  // curva viva: hasta el bin actual; cada bin YA es buses/hora (ventana 60 min). Usa :30 si ya llegó.
  // Anula los ceros ANTERIORES al primer despacho del día (bins no capturados: p.ej. el día del deploy).
  let first=-1; for(let k=0;k<=b&&k<ser.length;k++){ if(ser[k]>0){ first=k; break; } }
  const vivo = horas.map(h=>{ const i0=2*h, i1=2*h+1; if(i0>b) return null; if(first>=0 && i1<first) return null; const v=(i1<=b)?ser[i1]:ser[i0]; return (v==null)?null:v; });
  const exig = horas.map((h,idx)=>{ const p=CUMP.lineas[L]&&CUMP.lineas[L].prog&&CUMP.lineas[L].prog[dia]; return (p&&p[idx]!=null)?Math.round(p[idx]):null; });
  const th=TH(), x=horas.map(h=>h+"h");
  linFreqChart.setOption({
    textStyle:{fontFamily:th.font,color:th.tx},
    grid:{left:8,right:12,top:30,bottom:20,containLabel:true},
    legend:{data:["Exigida (GTFS)","Salida en vivo"],textStyle:{color:th.mut},top:0},
    tooltip:{trigger:"axis",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx},
      formatter:p=>{const t=p[0].axisValue; let s=`${t}<br>`; p.forEach(x=>{if(x.value!=null)s+=`${x.marker}${x.seriesName}: <b>${Math.round(x.value)}</b><br>`;}); return s;}},
    xAxis:{type:"category",data:x,axisLabel:{color:th.mut,fontSize:9,interval:1},axisLine:{lineStyle:{color:th.axis}}},
    yAxis:{type:"value",name:"despachos/hora",nameTextStyle:{color:th.mut,fontSize:10},axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
    series:[
      {name:"Exigida (GTFS)",type:"line",data:exig,smooth:true,symbol:"none",lineStyle:{width:2.5,color:"#fbbf24",type:"dashed"},itemStyle:{color:"#fbbf24"}},
      {name:"Salida en vivo",type:"line",data:vivo,smooth:true,symbol:"none",lineStyle:{width:2.4,color:cssv("--live")},itemStyle:{color:cssv("--live")},areaStyle:{color:cssv("--live")+"20"}},
    ],
  },true);
  setTimeout(()=>{ if(linFreqChart) linFreqChart.resize(); },60);
  const cur = (b>=0 && ser[b]!=null) ? ser[b] : 0;
  const sent = (DIA.freq_out_sent_lin&&DIA.freq_out_sent_lin[L]) || null;
  const sTxt = sent ? ` · <span style="color:var(--muted)">ida/regreso ${sent["0"]||0}/${sent["1"]||0}</span>` : "";
  $("lin-freq-sub").innerHTML = `línea ${L} · <b style="color:var(--live)">${Math.round(cur)}</b> buses/h en vivo (últ. 60 min)${sTxt} · vs exigida GTFS`;
}
function renderExcesos(){
  const el = $("excesos-list"); if(!el) return;
  const exc = (DIA && DIA.excesos_lin) ? DIA.excesos_lin : {};
  const L = state.linea !== "TODAS" ? state.linea : null;
  if(L){
    const n = exc[L] || 0;
    $("excesos-sub").textContent = `> 80 km/h · línea ${L} · hoy`;
    if(!n){ el.innerHTML='<div style="text-align:center;padding:18px 0;color:var(--mut)">Sin episodios en esta línea hoy</div>'; return; }
    const emp = empresaDe(L);
    const nm = emp ? `<span class="lncode">${L}</span> ${emp}` : `<span class="lncode">${L}</span>`;
    const col = n>=10 ? "#f87171" : n>=5 ? "#fb923c" : "#fbbf24";
    el.innerHTML = `<div style="text-align:center;padding:14px 0"><span style="font-size:2rem;font-weight:700;color:${col}">${n}</span><div style="color:var(--mut);margin-top:4px">episodios</div></div>`;
    return;
  }
  const C = state.comuna !== "TODAS" ? state.comuna : null;
  const comLines = C ? new Set(CLIN[C]||[]) : null;
  const sorted = Object.entries(exc).filter(e=>e[1]>0 && (!comLines || comLines.has(e[0]))).sort((a,b)=>b[1]-a[1]);
  if(!sorted.length){ el.innerHTML='<div style="text-align:center;padding:18px 0;color:var(--mut)">Sin episodios registrados hoy</div>'; return; }
  const total = sorted.reduce((s,e)=>s+e[1],0);
  $("excesos-sub").textContent = C ? `> 80 km/h · ${total} episodios · ${C}` : `> 80 km/h · ${total} episodios hoy`;
  const max = sorted[0][1];
  el.innerHTML = sorted.map(([ln,n])=>{
    const emp = empresaDe(ln);
    const nm = emp ? `<span class="lncode">${ln}</span> ${emp}` : `<span class="lncode">${ln}</span>`;
    const w = Math.round(n/max*100);
    const col = n>=10 ? "#f87171" : n>=5 ? "#fb923c" : "#fbbf24";
    return `<div class="kcr kcr--lin">`+
      `<div class="kcr-nm">${nm}<span class="kcr-vp" style="color:${col}">${n}</span></div>`+
      `<div class="kcr-row"><div class="kcr-bar"><div class="kcr-fill" style="width:${w}%;background:${col}"></div></div></div></div>`;
  }).join("");
}

function _smooth(arr, w){
  if(!w||w<2) return arr;
  const out=[];
  for(let i=0;i<arr.length;i++){
    let s=0,n=0;
    for(let j=Math.max(0,i-Math.floor(w/2));j<=Math.min(arr.length-1,i+Math.floor(w/2));j++){
      if(arr[j]!=null){s+=arr[j];n++;}
    }
    out.push(n>0?Math.round(s/n*10)/10:null);
  }
  return out;
}
let _vcMarker=null;
function _vcClearMarker(){ if(_vcMarker&&lmap){lmap.removeLayer(_vcMarker);_vcMarker=null;} }
function renderVelCiclo(){
  const card=$("velciclo-card"); if(!card) return;
  const lineView = state.vista==="normal" && state.linea!=="TODAS";
  if(!lineView||!VCICLO){card.style.display="none";_vcClearMarker();return;}
  const ld=VCICLO.lineas[state.linea];
  if(!ld){card.style.display="none";_vcClearMarker();return;}
  card.style.display="";
  if(!vcChart) vcChart=echarts.init($("ch-velciclo"));
  const ida=ld.ida, reg=ld.regreso;
  const iKm=ida?ida.km:[], rKm=reg?reg.km:[];
  const iCoords=ida?ida.coords:[], rCoords=reg?reg.coords:[];
  const iV=ida?_smooth(ida.vel[vcPer]||[],vcSm):[];
  const rV=reg?_smooth(reg.vel[vcPer]||[],vcSm):[];
  const maxKm=Math.max(iKm.length?iKm[iKm.length-1]:0,rKm.length?rKm[rKm.length-1]:0);
  vcChart.setOption({
    tooltip:{trigger:"axis",formatter:p=>{
      let s=`<b>${p[0].axisValueLabel} km</b>`;
      p.forEach(x=>{if(x.value!=null)s+=`<br>${x.marker}${x.seriesName}: ${x.value} km/h`;});
      return s;
    }},
    legend:{data:["Ida","Regreso"],textStyle:{color:TH().mut,fontSize:11},top:0,right:10},
    grid:{left:40,right:16,top:30,bottom:28},
    xAxis:{type:"category",data:iKm.length>=rKm.length?iKm:rKm,axisLabel:{formatter:v=>v%5===0||v==0?v+"":"",color:TH().mut,fontSize:10},name:"km del ciclo",nameLocation:"center",nameGap:18,nameTextStyle:{color:TH().mut,fontSize:10}},
    yAxis:{type:"value",name:"km/h",nameTextStyle:{color:TH().mut,fontSize:10},axisLabel:{color:TH().mut,fontSize:10},splitLine:{lineStyle:{color:TH().grid}},min:0},
    series:[
      {name:"Ida",type:"line",data:iV,symbol:"none",lineStyle:{width:2,color:cssv("--live")},itemStyle:{color:cssv("--live")},connectNulls:true},
      {name:"Regreso",type:"line",data:rV,symbol:"none",lineStyle:{width:2,color:cssv("--warn")},itemStyle:{color:cssv("--warn")},connectNulls:true},
    ],
  },true);
  vcChart.off("updateaxispointer"); vcChart.off("globalout");
  vcChart.on("updateaxispointer",function(e){
    if(!lmap||!e.axesInfo||!e.axesInfo.length) return;
    const idx=e.axesInfo[0].value;
    const c = (iCoords[idx]) || (rCoords[idx]);
    if(!c){_vcClearMarker();return;}
    if(_vcMarker) _vcMarker.setLatLng([c[0],c[1]]);
    else { _vcMarker=L.circleMarker([c[0],c[1]],{radius:8,color:"#fff",fillColor:"#f43f5e",fillOpacity:1,weight:2}).addTo(lmap); }
  });
  vcChart.on("globalout",_vcClearMarker);
  setTimeout(()=>vcChart.resize(),60);
  $("vc-sub").textContent=`km/h vs km · línea ${state.linea} · ${VCICLO.labels[vcPer]||vcPer}`;
}
function drawExcesosMap(){
  if(!coverLayer||state.mapMode!=="exc") return;
  coverLayer.clearLayers();
  const geo=(DIA&&DIA.excesos_geo)?DIA.excesos_geo:[];
  if(!geo.length){setCoverLegend("exc");return;}
  const fL=state.linea!=="TODAS"?state.linea:null;
  const fC=state.comuna!=="TODAS"?state.comuna:null;
  let filtered=geo.filter(e=>e[3]<=110);   // descartar artefactos GPS (vel imposible para bus)
  if(fL) filtered=filtered.filter(e=>e[2]===fL);
  if(fC) filtered=filtered.filter(e=>inComuna(e[0],e[1]));
  if(!filtered.length){setCoverLegend("exc");return;}
  for(const e of filtered){
    const kmh=e[3], col=kmh>=100?"#dc2626":kmh>=90?"#f87171":"#fbbf24";
    L.circleMarker([e[0],e[1]],{radius:5,color:col,fillColor:col,fillOpacity:0.8,weight:1})
      .bindTooltip(`<b>⚠ ${kmh} km/h</b><br>Línea ${e[2]}`,{direction:"top"})
      .addTo(coverLayer);
  }
  setCoverLegend("exc");
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
  card.style.display="none"; return;   // ELIMINADO: recuadro "En calle/terminal/detenidos" (no sincronizado con los gauges de arriba, redundante)
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
  let rects = rect("En calle (operando)", calle, "buses en movimiento", cssv("--live"))
    + rect("En terminal", term, "parados en cabecera", cssv("--violet"))
    + rect("Detenidos en ruta", ruta, "semáforo / taco");
  if(isCom) rects = rect("Líneas operando", Object.keys(byLine).length, `de ${(CLIN[state.comuna]||[]).length} que operan aquí`, cssv("--ref")) + rects;
  $("opnow-rects").innerHTML = rects;
  // semáforo SOLO en vista de línea (su flota está toda afuera => instante ≈ hora). En comuna el
  // histórico cuenta los buses distintos de TODA la hora (de paso) y el ratio instantáneo sesga bajo.
  const sem=$("opnow-semaforo");
  if(isLine && ratio!=null){ const c=semColor(ratio); sem.style.cssText=`margin-left:auto;background:${c}22;color:${c}`;
    sem.textContent = ratio>=0.7?`● normal (${Math.round(ratio*100)}%)`:ratio>=0.4?`▲ bajo (${Math.round(ratio*100)}%)`:`▲ muy bajo (${Math.round(ratio*100)}%)`; }
  else if(isCom){ const _ref=cssv("--ref"); sem.style.cssText=`margin-left:auto;background:${_ref}22;color:${_ref}`; sem.textContent=`${Object.keys(byLine).length} líneas activas`; }
  else { sem.style.cssText=`margin-left:auto;background:${cssv("--text-mid")}22;color:${cssv("--text-mid")}`; sem.textContent="sin referencia"; }
  // desglose por línea (vista comuna)
  if(isCom){ const rows=Object.entries(byLine).sort((a,b)=>b[1]-a[1]);
    $("opnow-lines").innerHTML = `<div class="hint" style="margin-bottom:4px">Buses operando ahora por línea</div>`+
      rows.map(([l,c])=>`<span style="display:inline-block;margin:2px 6px 2px 0;padding:2px 7px;border-radius:999px;background:var(--track);font-size:11px"><b style="font-family:var(--mono)">${l}</b> ${c}</span>`).join("");
  } else $("opnow-lines").innerHTML="";
  const ref = exp ? (isLine ? ` · típico a las ${h}h ≈ <b>${fmt1(exp)}</b> buses (laborable)` : ` · en una hora laborable circulan ≈ <b>${fmt1(exp)}</b> buses distintos por la comuna`) : "";
  $("opnow-narr").innerHTML = `<b>${operando}</b> buses con servicio ahora${ref}. "En calle" = en movimiento; "en terminal" = parados en cabecera (no es falla); "detenidos en ruta" = semáforo o taco.`;
}
function loadLive(){
  fetch(LIVE_URL+"?t="+Date.now(),{cache:"no-store"}).then(r=>r.json())
    .then(d=>{ LIVE=d; _comGPSdata=null; drawLiveBuses(); renderOpNow();
      if(state.vista==="normal"){
        renderLiveExtras();
        if(state.comuna!=="TODAS" && DIA && BASE30) renderLiveKPIs();
      }
    }).catch(()=>{});
}
// F3: extender L.Canvas para dibujar buses orientados por rumbo (chevron) en lugar de círculos.
// Mantiene UNA sola capa canvas (mismo perf que circleMarker) y conserva tooltips/eventos.
if(typeof L!=="undefined" && !L.Canvas.prototype._updateBusArrow){
  L.Canvas.include({
    _updateBusArrow(layer){
      if(!this._drawing || layer._empty()) return;
      const p = layer._point, ctx = this._ctx, r = layer._radius, o = layer.options;
      const brg = (o.brg||0) * Math.PI/180;
      ctx.save(); ctx.translate(p.x, p.y);
      if(o.mv){
        // chevron orientado: triángulo con muesca trasera, punta apunta al rumbo
        ctx.rotate(brg);
        ctx.beginPath();
        ctx.moveTo(0, -r*1.8);            // punta
        ctx.lineTo(r*1.05, r*1.2);        // ala derecha
        ctx.lineTo(0, r*0.4);             // muesca
        ctx.lineTo(-r*1.05, r*1.2);       // ala izquierda
        ctx.closePath();
      } else {
        // detenido: círculo compacto (sin rumbo)
        ctx.beginPath(); ctx.arc(0, 0, r*0.9, 0, Math.PI*2);
      }
      this._fillStroke(ctx, layer);
      ctx.restore();
    }
  });
}
const BusMarker = (typeof L!=="undefined") ? L.CircleMarker.extend({
  options: { brg:0, mv:1 },
  _updatePath(){ this._renderer._updateBusArrow(this); }
}) : null;

function drawLiveBuses(){
  if(!liveLayer) return;
  liveLayer.clearLayers();
  const badge=$("live-count");
  if(!LIVE || !LIVE.buses){ if(badge) badge.textContent="geo en línea"; return; }
  let n=0, t0=performance.now();
  LIVE.buses.forEach(b=>{
    const lat=b[0], lon=b[1], ln=b[2], spd=b[3], mv=b[4], brg=b[5]||0;
    if(!ln) return;                                      // sin línea = fuera de servicio -> no es "operando"
    if(state.linea!=="TODAS" && ln!==state.linea) return;
    if(!inComuna(lat,lon)) return;                       // en vista de comuna, solo los de la comuna
    n++;
    // F3: chevron orientado por rumbo; mv=0 → punto compacto sin rotar
    new BusMarker([lat,lon],{renderer:liveCanvas, radius: mv?3.6:2.8, weight:0,
      fillColor: mv?"#22d3ee":"#f59e0b", fillOpacity: mv?0.95:0.7, brg, mv})
      .bindTooltip(
        `<b>Línea ${ln||"—"}</b> · ${spd} km/h${mv?"":" · detenido"}`+
        (mv?`<br><span style="color:var(--dim);font-size:10.5px">rumbo ${Math.round(brg)}°</span>`:""),
        {direction:"top"}).addTo(liveLayer);
  });
  if(badge) badge.textContent = n>0 ? (NF.format(n)+" buses operando ahora") : "sin buses en vivo";
  // F1: pill resumen en la barra de comunas
  const hdr = $("hdr-live"); if(hdr) hdr.textContent = n>0 ? NF.format(n) : "—";
  // F2: pill grande en topbar (count-up suave)
  const big = $("hdr-live-big");
  if(big){
    const prev = parseInt(big.dataset.v || "0", 10) || 0;
    animateNumber(t => { big.textContent = t; }, prev, n, 700, v=>NF.format(Math.round(v)));
    big.dataset.v = n;
  }
}

// F5: a11y — promover spans/divs clickeables a controles navegables por teclado.
// .ctab, .litem, .rank-row, .seg b son spans/divs con onclick → ahora con role/tabindex/keydown.
const _A11Y_SEL = ".ctab,.litem,.rank-row,.seg > b";
function a11yEnhance(root){
  const apply = el => {
    if(!el || el.nodeType!==1 || el.dataset.a11y) return;
    el.dataset.a11y = "1";
    el.setAttribute("role","button");
    el.setAttribute("tabindex","0");
    el.addEventListener("keydown", ev=>{
      if(ev.key==="Enter" || ev.key===" " || ev.key==="Spacebar"){
        ev.preventDefault(); el.click();
      }
    });
  };
  if(root && root.nodeType===1){
    if(root.matches && root.matches(_A11Y_SEL)) apply(root);    // el nodo mismo (cuando addedNodes ES el .ctab)
    root.querySelectorAll && root.querySelectorAll(_A11Y_SEL).forEach(apply);
  } else {
    document.querySelectorAll(_A11Y_SEL).forEach(apply);
  }
}
// Observer global: enhancea elementos nuevos automáticamente cuando los buildXxx los pintan.
if(typeof MutationObserver!=="undefined"){
  new MutationObserver(muts=>{
    for(const m of muts) for(const n of m.addedNodes){
      if(n.nodeType===1) a11yEnhance(n);
    }
  }).observe(document.documentElement, {childList:true, subtree:true});
}

// F2: "actualizado hace Xs" calculado del snapshot del feed (live.json o dia.json)
function tickLiveAge(){
  const el = $("live-age"); if(!el) return;
  // priorizar el snapshot real del feed RT (vehicle ts → live.json.snapshot_utc), fallback al dia.snapshot
  const iso = (typeof LIVE!=="undefined" && LIVE && LIVE.snapshot_utc)
    || (typeof DIA!=="undefined" && DIA && DIA.snapshot)
    || null;
  if(!iso){ el.textContent = "—"; return; }
  const age = Math.max(0, Math.floor((Date.now() - Date.parse(iso))/1000));
  el.textContent = age<60 ? `${age}s` : age<3600 ? `${Math.floor(age/60)}m ${age%60}s` : `${Math.floor(age/3600)}h`;
}

/* ---------- KPI territorial: cobertura / acceso / espera / NSE (choropleth) ---------- */
const accColor  = m => `hsl(${120-120*Math.min(m/12,1)},72%,50%)`;        // verde 0min -> rojo 12+
const waitColor = m => m==null ? "#7f1d1d" : `hsl(${120-120*Math.min(m/6,1)},72%,50%)`;   // verde 0-3min -> amarillo 3-6min -> rojo 6+ (espera hacia destinos)
const daccColor = v => v==null ? "#475569" : `hsl(${1.2*Math.max(0,Math.min(v,100))},70%,50%)`;   // % destinos alcanzables: rojo bajo -> verde alto
const tbiColor  = v => v==null ? "#475569" : `hsl(${120-1.2*Math.max(0,Math.min(v,100))},75%,50%)`; // intensidad transbordo: verde 0 -> rojo 100
const labColor  = v => v==null ? "#475569" : `hsl(${1.2*Math.max(0,Math.min(v,100))},70%,50%)`;   // % empleo alcanzable SIN transbordo (Censo): rojo bajo -> verde alto
const cobColor  = v => v==null ? "#475569" : `hsl(${1.2*Math.max(0,Math.min(v,100))},70%,50%)`;   // Cobertura estática: % de la manzana a <=300 m de la red (rojo bajo -> verde alto)
const ofColor   = b => (b==null||b<=0) ? "#7f1d1d" : `hsl(${120*Math.min(b/30,1)},70%,50%)`;       // Cobertura oferta: buses/hora combinados (rojo 0 -> verde >=30 buses/h) [legacy]
const dinColor  = p => (p==null) ? "#475569" : `hsl(${120*Math.max(0,Math.min(p,1))},70%,50%)`;     // Cobertura DINÁMICA: P_total 0..1 (rojo 0% -> verde 100%) — modelo cápsula 2 min
const odColor   = r => (r==null) ? "#475569" : cobColor(100*r/odMax());                            // Cobertura oferta/demanda: cociente NORMALIZado al máximo (100% = mejor cubierta)
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
const cvVelColor = cv => cv==null ? "#475569" : `hsl(${120-120*Math.min(Math.max((cv-0.08)/0.20,0),1)},75%,50%)`; // CV vel día-a-día: <=0.08 estable(verde) -> >=0.28 variable(rojo)
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
const PER_VC = {agg:"agregado", am:"pam", md:"mediodia", pm:"ppm", off:"fuera", noche:"noche"};
function drawCongestion(){
  if(!coverLayer) return; coverLayer.clearLayers();
  if(!GRID){ setCoverLegend("conges"); return; }
  const lbl = periodoLbl(state.periodo);
  // VISTA LÍNEA: pintar los ARCOS DE LA RUTA coloreados por velocidad del período (no toda la red,
  // y sin sobreponer la ruta). Mismo criterio que bunching. Usa vel_ciclo.json (vel por punto×período).
  if(state.linea!=="TODAS" && VCICLO && VCICLO.lineas && VCICLO.lineas[state.linea]){
    const vp = PER_VC[state.periodo] || "agregado";
    const sens = state.sentido==="0" ? ["ida"] : state.sentido==="1" ? ["regreso"] : ["ida","regreso"];
    const ld = VCICLO.lineas[state.linea];
    sens.forEach(sn=>{
      const s = ld[sn]; if(!s || !s.coords) return;
      const co = s.coords;
      // medida por arco: promedio · día crítico (p10 del propio arco) · estabilidad (CV día-a-día)
      const sub = state.congSub, arr = sub==="crit" ? (s.crit||{})[vp] : sub==="estab" ? (s.cv||{})[vp] : (s.vel||{})[vp];
      const ve = arr || [], vmean=(s.vel||{})[vp]||[];
      for(let i=0;i<co.length-1;i++){
        const a=ve[i], b=ve[i+1];
        const m = (a!=null&&b!=null)?(a+b)/2 : (a!=null?a:b);
        if(m==null||!(m>0)) continue;
        const col = sub==="estab" ? cvVelColor(m) : congSpeedColor(m);
        let tip;
        if(sub==="estab") tip=`Línea ${state.linea} · CV ${m.toFixed(2)} (${lbl}) · ${m<0.12?"estable":m>0.20?"variable":"medio"}`;
        else if(sub==="crit"){ const me=(vmean[i]!=null&&vmean[i+1]!=null)?(vmean[i]+vmean[i+1])/2:null, r=me?Math.round(100*m/me):null;
          tip=`Línea ${state.linea} · ${Math.round(m)} km/h en días críticos (${lbl})${r!=null?` · normal ${Math.round(me)} (${r}%)`:""}`; }
        else tip=`Línea ${state.linea} · ${Math.round(m)} km/h (${lbl})`;
        L.polyline([co[i],co[i+1]],{renderer:coverCanvas,color:col,weight:5,opacity:.9,lineCap:"round"})
          .bindTooltip(tip,{sticky:true}).addTo(coverLayer);
      }
    });
    setCoverLegend("conges"); return;
  }
  if(CONGRED && CONGRED.roads){       // RED CONTINUA: velocidad drapeada sobre cada calle
    // medida: promedio (GRID horario) · día crítico (vel en peores días) · estabilidad (CV día-a-día)
    const sub = state.congSub, useStats = sub!=="prom" && SGSTATS && SGSTATS.per;
    const SP = useStats ? (SGSTATS.per[state.periodo]||SGSTATS.per.agg||{}) : {};
    const cs = sub==="crit"&&useStats ? (SP.crit||[]) : sub==="estab"&&useStats ? (SP.cv||[]) : periodCellSpeeds();
    const mn = SP.mean||[];
    CONGRED.roads.forEach(rd=>{
      const P=rd.p, C=rd.c;
      for(let i=0;i<P.length-1;i++){
        const a=C[i], b=C[i+1];
        if(a<0||b<0) continue;
        const va=cs[a], vb=cs[b];
        if(!(va>0)||!(vb>0)) continue;
        if(!inComuna((P[i][0]+P[i+1][0])/2,(P[i][1]+P[i+1][1])/2)) continue;
        const m=(va+vb)/2;
        const col = sub==="estab"&&useStats ? cvVelColor(m) : congSpeedColor(m);
        let tip;
        if(sub==="estab"&&useStats) tip=`${rd.n?rd.n+" · ":""}CV ${m.toFixed(2)} (${lbl}) · ${m<0.12?"estable":m>0.20?"variable":"medio"}`;
        else if(sub==="crit"&&useStats){ const me=(mn[a]+mn[b])/2, r=me>0?Math.round(100*m/me):null;
          tip=`${rd.n?rd.n+" · ":""}${Math.round(m)} km/h en días críticos (${lbl})${r!=null?` · normal ${Math.round(me)} (${r}%)`:""}`; }
        else tip=`${rd.n?rd.n+" · ":""}${Math.round(m)} km/h (${lbl})`;
        L.polyline([P[i],P[i+1]],{renderer:coverCanvas,color:col,weight:3.6,opacity:.85,lineCap:"round"})
          .bindTooltip(tip,{sticky:true}).addTo(coverLayer);
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
  const per=state.periodo, lbl=periodoLbl(per);
  // nodos de congestión POR PERÍODO (terminales/retornos ya excluidos en el dato offline)
  let cong = (((DET2&&DET2.per)||{})[per]||[]).filter(d=>inComuna(d.la,d.lo));
  let terms = ((TERM&&TERM.terminales)||[]).filter(t=>inComuna(t.la,t.lo));
  if(state.linea!=="TODAS"){
    terms = terms.filter(t=>(t.lineas||[]).some(l=>l.linea===state.linea));
    if(GEOM && GEOM[state.linea]){
      const MX2=111320*Math.cos(-36.83*Math.PI/180), MY2=110540, R=400;
      const allPts=[]; (GEOM[state.linea]||[]).forEach(r=>(r.p||[]).forEach(p=>allPts.push(p)));
      cong = cong.filter(d=>allPts.some(p=>{ const dx=(d.lo-p[1])*MX2, dy=(d.la-p[0])*MY2; return dx*dx+dy*dy < R*R; }));
    }
  }
  // "Congestión" (default) = TODOS los nodos de detención del período; "Paraderos" = solo troncal/parada
  if(state.detTipo==="par") cong = cong.filter(d=>!(d.tipo||"").includes("demora"));
  if(cong.length){
    const mx=Math.max(...cong.map(d=>d.det));
    cong.forEach(d=>{
      const r=6+22*Math.sqrt(d.det/mx);
      L.circleMarker([d.la,d.lo],{renderer:coverCanvas,radius:r,weight:1,color:"rgba(0,0,0,.35)",fillColor:congDetColor(d.det/mx),fillOpacity:.6})
        .bindTooltip(`<b>${d.calle||d.tipo}</b> · ${d.comuna||""} (${lbl})<br>${d.tipo}<br>Tiempo detenido: ${fmt(d.det)} pulsos · ${d.buses} buses`,{sticky:true}).addTo(coverLayer);
    });
  }
  // terminales FORMALES confirmados (▣ verde numerado)
  terms.forEach(t=>{
    const rows=(t.lineas||[]).map(l=>`L${l.linea}`).join(", ");
    const icon=L.divIcon({className:"term-ic",html:`<div class="term-box">▣ ${t.n||""}</div>`,iconSize:[30,18],iconAnchor:[15,9]});
    L.marker([t.la,t.lo],{icon,zIndexOffset:500}).bindTooltip(
      `<b>Terminal #${t.n||""}${t.name?" · "+t.name:""}</b> · ${t.comuna||""}<br>Líneas: ${rows}`,{sticky:true,direction:"top"}).addTo(coverLayer);
  });
  setCoverLegend("det");
}
function drawBunching(){
  if(!coverLayer) return; coverLayer.clearLayers();
  // Per-line arco view
  if(state.linea!=="TODAS" && BUNCHA && BUNCHA.lineas && BUNCHA.lineas[state.linea] && GEOM && GEOM[state.linea]){
    const lb=state.linea, sen=state.sentido==="amb"?"0":state.sentido;
    const arcos = (BUNCHA.lineas[lb]||{})[sen]||[];
    const routes = GEOM[lb]||[];
    const mainR = routes.find(r=>r.s===+sen) || routes[0];
    if(mainR && mainR.p && arcos.length){
      const pts=mainR.p, per=state.periodo, lbl=periodoLbl(per);
      const MX=111320*Math.cos(-36.83*Math.PI/180), MY=110540;
      let cum=0; const dists=[0];
      for(let i=1;i<pts.length;i++){ const dx=(pts[i][1]-pts[i-1][1])*MX, dy=(pts[i][0]-pts[i-1][0])*MY; cum+=Math.sqrt(dx*dx+dy*dy); dists.push(cum); }
      const ptAt = m=>{ for(let i=1;i<dists.length;i++){ if(dists[i]>=m){ const t=(m-dists[i-1])/(dists[i]-dists[i-1]); return [pts[i-1][0]+(pts[i][0]-pts[i-1][0])*t, pts[i-1][1]+(pts[i][1]-pts[i-1][1])*t]; } } return pts[pts.length-1]; };
      arcos.forEach(arc=>{
        const d=arc.per[per]; if(!d||d.cv==null) return;
        const pA=ptAt(arc.a), pB=ptAt(arc.b);
        L.polyline([pA,pB],{renderer:coverCanvas,color:cvColor(d.cv),weight:5,opacity:.88,lineCap:"round"})
          .bindTooltip(`Arco ${arc.a}–${arc.b} m · ${lbl}<br>CV <b>${d.cv.toFixed(2)}</b> · headway ${d.headway} min · ${d.n} obs<br>${d.cv>0.7?"apelotonado":d.cv>0.5?"regularidad media":"regular"}`,{sticky:true}).addTo(coverLayer);
      });
    }
    setCoverLegend("bunch"); return;
  }
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
function drawTerminales(){
  if(!coverLayer) return; coverLayer.clearLayers();
  if(!TERMCONF){ setCoverLegend("terms"); return; }
  // PUNTOS DE RETORNO (validados por el usuario): no son terminal formal, pero el bus reposa ahí
  // (excluidos de detención, no cuentan como terminal). Marcador cyan tenue.
  (TERMCONF.retornos||[]).forEach(t=>{
    if(!inComuna(t.lat,t.lon)) return;
    L.circleMarker([t.lat,t.lon],{renderer:coverCanvas,radius:6,weight:1.5,color:"#22d3ee",fillColor:"#22d3ee",fillOpacity:.2})
      .bindTooltip(`<b>Punto de retorno</b>${t.name?" · "+t.name:""}<br>Líneas: ${(t.lineas||[]).join(", ")}<br>fin de ruta con espera breve — no es terminal formal (excluido de detención)`,{sticky:true}).addTo(coverLayer);
  });
  // TERMINALES formales (verdad manual): verde, numerados 1..N (campo n).
  (TERMCONF.confirmados||[]).forEach((t,i)=>{
    if(!inComuna(t.lat,t.lon)) return;
    const num=t.n||(i+1);
    L.circleMarker([t.lat,t.lon],{renderer:coverCanvas,radius:11,weight:2,color:"#064e2b",fillColor:"#22c55e",fillOpacity:.6})
      .bindTooltip(`<b>#${num} · Terminal</b>${t.name?" · "+t.name:""}<br>Líneas: ${(t.lineas||[]).join(", ")}`,{sticky:true}).addTo(coverLayer);
    L.marker([t.lat,t.lon],{interactive:false,zIndexOffset:600,icon:L.divIcon({className:"term-num",
      html:`<div style="font:700 10px/15px var(--font-data,monospace);color:#052e16;background:#fff;border:1.5px solid #052e16;border-radius:9px;min-width:16px;height:16px;padding:0 2px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.5)">${num}</div>`,
      iconSize:[16,16],iconAnchor:[8,8]})}).addTo(coverLayer);
  });
  setCoverLegend("terms");
}
function drawCoverage(mode){
  if(mode==="conges"){ drawCongestion(); return; }
  if(mode==="bunch"){ drawBunching(); return; }
  if(mode==="det"){ drawDetenciones(); return; }
  if(mode==="terms"){ drawTerminales(); return; }
  if(mode==="exc"){ drawExcesosMap(); return; }
  if(!coverLayer) return; coverLayer.clearLayers();
  if(!COB) return;
  const lineMode = state.linea!=="TODAS";
  const dinLineMode = mode==="cover" && state.coverSub==="din" && lineMode;
  COB.features.forEach(f=>{
    const p=f.properties;
    if(!inComuna(p.cy, p.cx)) return;
    if(lineMode && !((p.cob_lineas||[]).includes(state.linea))) return;
    const pu = state.purpose||"all";
    const dG = k => (p[k] && typeof p[k]==="object") ? p[k][pu] : p[k];   // lee dacc/ddir/dtr/tbi por propósito (compat)
    let col;
    if(mode==="cover") col = state.coverSub==="din"                      // Cobertura: Estática / Dinámica / Oferta-demanda
      ? dinColor(_dinValueFor(p))                                         // P_total (sistema) o frac_linea (vista línea)
      : state.coverSub==="od"
      ? odColor(p.cob_od ? p.cob_od[state.periodo] : null)
      : lineMode ? (nseColors[nseTercil(p.nse)]||"#64748b") : cobColor(p.cob_est);
    else if(mode==="trans") col = labColor(p.lab ? p.lab.dir : null);    // TRANSBORDO: % de viajes-trabajo con UNA sola línea (Censo); verde=directo, rojo=exige transbordo/inalcanzable
    else if(mode==="wait") col = waitColor(p.waitd ? p.waitd[pu][state.periodo] : null);
    else if(mode==="salud") col = accSColor(p.salud);
    else if(mode==="edu") col = accSColor(p.edu);
    else col = nseColor(p.nse);
    const rings = f.geometry.type==="MultiPolygon" ? f.geometry.coordinates.map(pl=>pl[0]) : [f.geometry.coordinates[0]];
    const tipAcc = `destinos (${purposeLbl(pu)}): <b>${dG("dacc")??"—"}%</b> alcanzable · ${dG("ddir")??"—"}% directo · ${dG("dtr")??0}% con transbordo`;
    const per = state.periodo;
    const wd = p.waitd ? p.waitd[pu][per] : null, wf = p.wait ? p.wait[per] : null;
    const lb = p.lab;
    const tipLab = lb
      ? `viajes-trabajo (TP, Censo 2024)${p.lab_comuna?` · ${p.lab_comuna}`:""}: <b>${lb.dir}%</b> con una línea · ${lb.tr}% con transbordo · <b>${lb.no}% inalcanzable</b>`
      : "sin dato de viajes-trabajo";
    const tip = (mode==="trans")
      ? `${NF.format(p.hog??0)} hogares<br>${tipLab}`
      : (mode==="cover" && state.coverSub==="din")
      ? (()=>{ const v=_dinValueFor(p); const nL=(p.cob_lineas||[]).length;
          if(state.linea!=="TODAS"){
            const fL = (DINL?.lineas?.[state.linea]?.frac?.[per]) ?? null;
            const fObs = (DINL?.lineas?.[state.linea]?.f_obs?.[per]) ?? null;
            const H = (fObs && fObs>0) ? (60/fObs) : null;
            return `${NF.format(p.hog??0)} hogares · línea ${state.linea} · ${periodoLbl(per)}<br>`+
                   `frecuencia: <b>${fObs==null?"—":fObs.toFixed(1)} bus/h</b> · headway ${H==null?"—":H.toFixed(1)+" min"}<br>`+
                   `cobertura: <b>${fL==null?"—":(fL*100).toFixed(0)+"%"} del tiempo</b>`;
          }
          return `${NF.format(p.hog??0)} hogares · ${nL} línea${nL===1?"":"s"} · ${periodoLbl(per)}<br>`+
                 `cobertura dinámica: <b>${v==null?"—":(v*100).toFixed(0)+"% del tiempo</b> (P_total)"}`;
        })()
      : (mode==="cover" && state.coverSub==="od")
      ? (()=>{ const r=p.cob_od?p.cob_od[per]:null; const pct=r==null?null:Math.round(100*r/odMax()); return `${NF.format(p.hog??0)} hogares · ${periodoLbl(per)}<br>cobertura oferta/demanda: <b>${pct==null?"sin servicio":pct+"%"}</b> del nivel mejor cubierto`; })()
      : (mode==="cover" && lineMode)
      ? `${NF.format(p.hog??0)} hogares · línea ${state.linea}<br>NSE: <b>${nseLabel(nseTercil(p.nse))}</b> · avalúo ${NF.format(p.nse||0)} CLP/m²`
      : (mode==="cover")
      ? `${NF.format(p.hog??0)} hogares · acceso ${p.acc} min<br>cobertura estática: <b>${p.cob_est??"—"}%</b> de la manzana a ≤300 m de la red`
      : (mode==="wait")
      ? `${NF.format(p.n)} viviendas · ${periodoLbl(per)} · ${purposeLbl(pu)}<br>espera hacia destinos: <b>${wd==null?"sin servicio":wd+" min"}</b> · al primer bus ${wf==null?"—":wf+" min"}`
      : `${NF.format(p.n)} viviendas · acceso ${p.acc} min · espera ${wf==null?"sin servicio":wf+" min"}<br>a salud ${p.salud??"—"} min · a educación ${p.edu??"—"} min`;
    const fop = .55;
    rings.forEach(r=>{
      L.polygon(r.map(c=>[c[1],c[0]]),{renderer:coverCanvas,stroke:false,fillColor:col,fillOpacity:fop})
        .bindTooltip(tip,{sticky:true})
        .addTo(coverLayer);
    });
  });
  // destinos EOD: ocultos mientras el indicador de Cobertura/Transbordo está EN REDEFINICIÓN.
  if(DEST && DEST.destinos && false){
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
    const _linePAR = lineMode ? (PAR[state.linea]||[]) : null;
    PESP.stops.forEach(s=>{
      if(!inComuna(s.la,s.lo)) return;
      if(_linePAR && !_linePAR.some(p=>Math.abs(p[0]-s.la)<0.001&&Math.abs(p[1]-s.lo)<0.001)) return;
      const w = s.wait ? s.wait[state.periodo] : null;
      L.circleMarker([s.la,s.lo],{renderer:coverCanvas,radius:3,weight:1,color:"#0b1220",
        fillColor:waitColor(w),fillOpacity:.95})
        .bindTooltip(`<b>Paradero</b> · ${s.nl} línea${s.nl===1?"":"s"}<br>espera ${w==null?"sin servicio":`<b>${w} min</b>`} (${periodoLbl(state.periodo)})`,
        {direction:"top"}).addTo(coverLayer);
    });
  }
  // equipamiento sensible (salud/educación) SOLO en sus propios modos
  if(COB.sensibles && (mode==="salud"||mode==="edu")){
    const _rPts = lineMode && GEOM[state.linea] ? GEOM[state.linea].flatMap(sg=>sg.p) : null;
    COB.sensibles.forEach(s=>{
      const isS=s[2]==="SALUD";
      if(mode==="salud"&&!isS) return; if(mode==="edu"&&isS) return;
      if(!inComuna(s[0],s[1])) return;
      if(_rPts && !_rPts.some(p=>Math.abs(p[0]-s[0])<0.006&&Math.abs(p[1]-s[1])<0.006)) return;
      L.circleMarker([s[0],s[1]],{renderer:coverCanvas,radius:3.4,weight:1,color:"#fff",
        fillColor:isS?cssv("--alert"):cssv("--violet"),fillOpacity:.95})
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
  const NEU = `<span class="grad" style="background:#64748b;opacity:.5"></span>`;
  const txt = (mode==="cover" && state.coverSub==="din") ? [`Cobertura dinámica · ${periodoLbl(state.periodo)}`,GYR,`<span class='lbls'><i>0%</i><i>50%</i><i>100%</i></span><span class='par'>% del tiempo cubierto por algún bus (modelo cápsula 2 min + 300 m) · cambia con el período</span>`]
    : (mode==="cover" && state.coverSub==="od") ? [`Cobertura oferta/demanda · ${periodoLbl(state.periodo)}`,GYR,`<span class='lbls'><i>0%</i><i>50%</i><i>100%</i></span><span class='par'>capacidad ÷ viajes generados · 100% = zona residencial mejor cubierta (Talcahuano/San Pedro/Chiguayante), no el centro · reparto por demanda</span>`]
    : (mode==="cover" && state.linea!=="TODAS") ? [`NSE hogares cubiertos · Línea ${state.linea}`,`<span class="grad" style="background:linear-gradient(90deg,#fb923c 33%,#94a3b8 33% 66%,#2dd4bf 66%)"></span>`,"<span class='lbls'><i>bajo</i><i>medio</i><i>alto</i></span><span class='par'>terciles de avalúo fiscal del suelo (CLP/m²) — solo manzanas cubiertas a ≤300 m</span>"]
    : mode==="cover" ? ["Cobertura estática (≤300 m de la red)",GYR,"<span class='lbls'><i>0%</i><i>50%</i><i>100%</i></span><span class='par'>% de la manzana dentro del área de influencia 300 m de los recorridos</span>"]
    : mode==="trans" ? ["Transbordo: viajes-trabajo con UNA línea (Censo 2024)",GYR,"<span class='lbls'><i>0%</i><i>50%</i><i>100%</i></span><span class='par'>verde = llega directo con una línea · rojo = exige transbordo o es inalcanzable</span>"]
    : mode==="wait" ? [`Espera hacia destinos · ${periodoLbl(state.periodo)} (min)`,RYG,"<span class='lbls'><i>0</i><i>3</i><i>6+</i></span><span class='par'>manzana = espera a destinos · ● paradero = espera ahí (hover)</span>"]
    : mode==="salud" ? ["Tiempo a salud en transporte (min)",RYG,"<span class='lbls'><i>0</i><i>12</i><i>25+</i></span><span class='par' style='color:#f43f5e'>● centro de salud</span>"]
    : mode==="edu" ? ["Tiempo a educación en transporte (min)",RYG,"<span class='lbls'><i>0</i><i>12</i><i>25+</i></span><span class='par' style='color:var(--violet)'>● colegio</span>"]
    : (mode==="conges" && state.congSub==="estab") ? [`Estabilidad de velocidad · ${periodoLbl(state.periodo)} (CV día a día)`,`<span class="grad" style="background:linear-gradient(90deg,hsl(120,75%,50%),hsl(60,75%,50%),hsl(0,75%,50%))"></span>`,"<span class='lbls'><i>estable</i><i></i><i>variable</i></span><span class='par'>verde = velocidad consistente día a día pese a la congestión (corredor eficiente)</span>"]
    : (mode==="conges" && state.congSub==="crit") ? [`Velocidad en días críticos · ${periodoLbl(state.periodo)} (km/h)`,`<span class="grad" style="background:linear-gradient(90deg,hsl(0,75%,50%),hsl(60,75%,50%),hsl(120,75%,50%))"></span>`,"<span class='lbls'><i>≤10</i><i>20</i><i>30+</i></span><span class='par'>velocidad en los peores ~10% de días DE CADA EJE; hover = % vs su día normal</span>"]
    : mode==="conges" ? [`Velocidad efectiva · ${periodoLbl(state.periodo)} (km/h)`,`<span class="grad" style="background:linear-gradient(90deg,hsl(0,75%,50%),hsl(60,75%,50%),hsl(120,75%,50%))"></span>`,"<span class='lbls'><i>≤10</i><i>20</i><i>30+</i></span><span class='par'>incluye el tiempo detenido en tránsito</span>"]
    : mode==="bunch" ? [`Apelotonamiento · ${periodoLbl(state.periodo)} (CV de headways)`,`<span class="grad" style="background:linear-gradient(90deg,hsl(120,75%,50%),hsl(60,75%,50%),hsl(0,75%,50%))"></span>`,"<span class='lbls'><i>regular</i><i></i><i>apelotonado</i></span><span class='par'>CV alto = buses pegados unos a otros</span>"]
    : mode==="det" ? ["Congestión: nodos de demora (sin terminales)",`<span class="grad" style="background:linear-gradient(90deg,hsl(45,85%,52%),hsl(0,85%,52%))"></span>`,"<span class='lbls'><i>menor</i><i>mayor</i></span><span class='par'><b style='color:#22d3ee'>▣</b> terminal · flota por línea al pasar</span>"]
    : mode==="terms" ? ["Terminales (validados manualmente)",`<span class="grad" style="background:linear-gradient(90deg,#22c55e,#22c55e)"></span>`,"<span class='lbls'><i style='color:#22c55e'>● terminal</i><i style='color:#22d3ee'>● punto de retorno</i></span><span class='par'>verde numerado = terminal formal · cyan = fin de ruta con espera breve (no es terminal, pero excluido de detención)</span>"]
    : mode==="exc" ? ["Excesos de velocidad (> 80 km/h · hoy)",`<span class="grad" style="background:linear-gradient(90deg,#fbbf24,#f87171,#dc2626)"></span>`,"<span class='lbls'><i>80</i><i>90</i><i>100+</i></span><span class='par'>episodios registrados durante la jornada</span>"]
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
      L.geoJSON(f,{style:{color:sel?cssv("--ref"):"rgba(148,161,186,.4)",weight:sel?2.6:1,fill:sel,fillColor:cssv("--ref"),fillOpacity:sel?0.05:0}}).addTo(comunaLayer);
    }
  });
  let bounds=[];
  const _isLive = state.mapMode==="live";
  setSpeedLegend(state.linea!=="TODAS" && !!GEOM[state.linea] && _isLive);
  if(state.linea!=="TODAS" && GEOM[state.linea]){
    GEOM[state.linea].forEach(seg=>{
      const p=seg.p;
      if(_isLive){
        const v=seg.v||[];
        for(let i=0;i<p.length-1;i++){
          const a=v[i], b=v[i+1];
          const sv = (a!=null&&b!=null)?(a+b)/2 : (a!=null?a:b);
          L.polyline([p[i],p[i+1]],{color:speedColor(sv),weight:4,opacity:0.92}).addTo(routeLayer);
        }
      } else if(!["conges","bunch"].includes(state.mapMode)){
        // en congestión/bunching NO se dibuja la ruta de referencia: los arcos ya van coloreados por el KPI
        L.polyline(p,{color:cssv("--ref"),weight:2.5,opacity:0.65}).addTo(routeLayer);
      }
      bounds.push(...p);
    });
    const ps = PAR[state.linea]||[];
    ps.forEach(s=>{
      L.circleMarker([s[0],s[1]],{radius:_isLive?3.2:2.5,color:"#0b1220",weight:_isLive?1:0.8,
        fillColor:_isLive?"#e2e8f0":cssv("--ref"),fillOpacity:_isLive?0.95:0.8})
        .bindTooltip(s[2],{direction:"top"}).addTo(stopLayer);
    });
    if(_isLive){
      // rótulos "▣ Terminal" + cabeceras en el mapa vivo por línea: ELIMINADOS (quedaban de una
      // edición anterior; los terminales viven ahora en el modo mapa "Terminales").
      const nrec = new Set(GEOM[state.linea].map(s=>s.rec)).size;
      $("map-title").textContent = `Línea ${state.linea} · ${nrec} recorrido${nrec>1?"s":""} · ${ps.length} paraderos · color = velocidad`;
    }
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
  const ambito = state.comuna==="TODAS" ? "el Gran Concepción" : state.comuna;
  const seg = $("map-mode"); if(seg) seg.style.display = "";
  if(state.mapMode!=="live"){
    liveLayer.clearLayers();
    drawCoverage(state.mapMode);
    // en modos de red, redibujar recorrido sobre la capa territorial para que se vea encima.
    // EXCEPTO en congestión/bunching: ahí los arcos YA están coloreados por el KPI y la ruta los taparía.
    if(state.linea!=="TODAS" && GEOM[state.linea] && !["conges","bunch"].includes(state.mapMode)){
      GEOM[state.linea].forEach(s=>{ L.polyline(s.p,{color:cssv("--ref"),weight:3,opacity:0.85}).addTo(liveLayer); });
    }
    const b=$("live-count"), R=(COB&&COB.resumen)||{};
    const M=state.mapMode;
    const coverTit = state.coverSub==="din" ? `Cobertura dinámica · ${periodoLbl(state.periodo)}`
      : state.coverSub==="od" ? `Cobertura oferta/demanda · ${periodoLbl(state.periodo)}` : "Cobertura estática";
    const titulo = {cover:coverTit,trans:"Transbordo",wait:`Espera hacia destinos · ${periodoLbl(state.periodo)}`,
      conges:`Velocidad efectiva por arco · ${periodoLbl(state.periodo)}`, bunch:`Apelotonamiento (bunching) · ${periodoLbl(state.periodo)}`, det:"Congestión y terminales",
      salud:"Accesibilidad a salud en transporte",edu:"Accesibilidad a educación en transporte",nse:"Nivel socioeconómico (avalúo)"}[M];
    if(state.linea!=="TODAS"){
      $("map-title").textContent = `Línea ${state.linea} · ${titulo||"análisis territorial"}`;
      if(b) b.textContent = (M==="conges"||M==="bunch"||M==="det")
        ? `${titulo} · recorrido de la línea ${state.linea} resaltado`
        : `${titulo} · manzanas servidas por la línea ${state.linea}`;
    } else {
      const dinp = R.cob_din && R.cob_din.por_periodo && R.cob_din.por_periodo[state.periodo];
      const odp = R.cob_od && R.cob_od.por_periodo && R.cob_od.por_periodo[state.periodo];
      const coverBadge = state.coverSub==="din"
          ? `${dinp?dinp.pct_hog_ge_umbral:"—"}% de los hogares con cobertura dinámica ≥50% del tiempo en ${periodoLbl(state.periodo)} · media P_total ${dinp?(dinp.media_p_total*100).toFixed(1)+"%":"—"}`
          : state.coverSub==="od"
          ? `oferta/demanda en ${periodoLbl(state.periodo)} · 100% = zona residencial mejor cubierta (no el centro atractor) · rojo = déficit relativo`
          : `${(R.cob_est&&R.cob_est.pct_hogares_cubiertos)??"—"}% de los hogares a ≤300 m de la red (buffer sobre el recorrido oficial)`;
      const badgeSys = {cover: coverBadge,
        trans:`${(R.lab&&R.lab.dir)??"—"}% de los viajes-trabajo se hacen con UNA línea · ${(R.lab&&R.lab.tr)??"—"}% exige transbordo · ${(R.lab&&R.lab.no)??"—"}% inalcanzable (Censo 2024)`,
        wait:`espera media hacia destinos ${(R.waitd_medio&&R.waitd_medio[state.periodo])??"—"} min · frecuencia real observada · cambia con el período`,
        conges:(state.linea==="TODAS"&&state.congSub==="estab")?`estabilidad de la velocidad en ${periodoLbl(state.periodo)} · CV día a día · verde = eje consistente (corredor eficiente) · rojo = muy variable`
          :(state.linea==="TODAS"&&state.congSub==="crit")?`velocidad en los peores ~10% de días de cada eje en ${periodoLbl(state.periodo)} · rojo = colapsa en sus días malos · hover = % vs su día normal`
          :`velocidad efectiva (incluye detenido en tránsito) en ${periodoLbl(state.periodo)} · rojo = ejes lentos`,
        bunch:`regularidad de los buses (CV de headways) en ${periodoLbl(state.periodo)} · rojo = se apelotonan ⇒ peor espera efectiva`,
        det:`${((DET2&&DET2.per&&DET2.per[state.periodo])||[]).length} nodos de congestión en ${periodoLbl(state.periodo)} (sin terminales/retornos) · ${(TERM&&TERM.terminales||[]).length} terminales formales`,
        salud:`tiempo mediano a salud: ${R.salud_med} min`, edu:`tiempo mediano a educación: ${R.edu_med} min`,
        nse:"avalúo m² · azul bajo → ámbar alto"}[M];
      if(b) b.textContent = state.comuna==="TODAS" ? (badgeSys||"") : `${titulo} · ${state.comuna}`;
      $("map-title").textContent = (titulo||"Mapa territorial") + (state.comuna==="TODAS"?"":` · ${state.comuna}`);
    }
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
    if(state.linea!=="TODAS" && !((p.cob_lineas||[]).includes(state.linea))) continue;
    const v=getter(p); if(v==null) continue; const w=p.n||1; sw+=v*w; n+=w; }
  return n? sw/n : null;
}
/* ---------- NSE terciles (clasificar avalúo continuo en bajo/medio/alto) ---------- */
function nseTercil(v){
  if(v==null||v<=0) return -1;
  if(!_nseTerciles&&COB&&COB.features){
    const vs=COB.features.map(f=>f.properties.nse).filter(x=>x!=null&&x>0).sort((a,b)=>a-b);
    if(vs.length>10){ _nseTerciles=[vs[Math.floor(vs.length*.333)], vs[Math.floor(vs.length*.667)]]; }
    else _nseTerciles=[50000,70000];
  }
  if(!_nseTerciles) return -1;
  return v<=_nseTerciles[0]?0:v<=_nseTerciles[1]?1:2;
}
/* ---------- KPIs contextuales bajo el mapa (por línea: cover/det/bunch) ---------- */
function renderLineaKpis(){
  const el=$("linea-kpis"); if(!el) return;
  const mode=state.mapMode;
  // DETENCIONES
  if(state.linea!=="TODAS" && state.vista==="normal" && mode==="det" && DETP&&DETP.lineas){
    const lb=state.linea, sen=state.sentido==="amb"?"amb":state.sentido;
    const d = DETP.lineas[lb] || {};
    const sd = d[sen] || d.amb || {};
    const sdL = sd.L || {};
    const det = sdL[state.periodo];
    const dAm=sdL.am, dPm=sdL.pm, dNoche=sdL.noche, dAgg=sdL.agg;
    let sis=null; const all=Object.values(DETP.lineas).map(x=>{const s=x[sen]||x.amb||{}; return (s.L||{})[state.periodo];}).filter(v=>v!=null);
    if(all.length) sis = +(all.reduce((a,b)=>a+b,0)/all.length).toFixed(1);
    const lbl = v => v==null?"":(v<5?"Bajo":v<15?"Medio":v<25?"Alto":"Muy alto");
    const bg = v => v==null?"":`background:hsla(${Math.max(0,Math.min(1,1-(v-5)/30))*120},75%,45%,.4)`;
    const card=(cls,l,v,s,st="")=>`<div class="lk ${cls}" style="${st}"><div class="lab">${l}</div><div class="val">${v}</div><div class="sub">${s}</div></div>`;
    const senL = sen==="amb"?"Ida+Regreso":(sen==="0"?"Ida":"Regreso");
    el.style.display="grid";
    el.innerHTML = [
      card("b-tot",`${IC.stop} % tiempo detenido (${periodoLbl(state.periodo)})`, det!=null?det.toFixed(1)+"%":"—", `${lbl(det)} · ${senL} · en ruta (excl. terminal)`, bg(det)),
      card("b-eff","Vs. sistema", (det!=null&&sis!=null)?((det-sis)>=0?"+":"")+(det-sis).toFixed(1):"—", sis!=null?`sistema ${sis}% · ${det!=null&&det<sis?"mejor":"peor"}`:"—"),
      card("b-bajo","% AM punta", dAm!=null?dAm.toFixed(1)+"%":"—", lbl(dAm), bg(dAm)),
      card("b-med","% PM punta", dPm!=null?dPm.toFixed(1)+"%":"—", lbl(dPm), bg(dPm)),
      card("b-alto","% Noche", dNoche!=null?dNoche.toFixed(1)+"%":"—", lbl(dNoche), bg(dNoche)),
      card("b-cic","% Agregado día", dAgg!=null?dAgg.toFixed(1)+"%":"—", lbl(dAgg), bg(dAgg)),
    ].join("");
    return;
  }
  // BUNCHING
  if(state.linea!=="TODAS" && state.vista==="normal" && mode==="bunch" && BUNCH&&BUNCH.lineas){
    const lb=state.linea, dia="L";
    const d = BUNCH.lineas[lb] && BUNCH.lineas[lb][dia] || {};
    const per=state.periodo, dp=d[per]||{};
    const cv=dp.cv, hw=dp.headway, n=dp.n;
    const dAm=(d.am||{}).cv, dPm=(d.pm||{}).cv, dNoche=(d.noche||{}).cv;
    let sisCv=null; const all=Object.values(BUNCH.lineas).map(x=>(x[dia]||{})[per]).filter(x=>x&&x.cv!=null).map(x=>x.cv);
    if(all.length) sisCv=+(all.reduce((a,b)=>a+b,0)/all.length).toFixed(3);
    const cvLbl = v => v==null?"—":(v<0.5?"Regular":v<0.8?"Medio":"Apelotonado");
    const cvBg = v => v==null?"":`background:hsla(${Math.max(0,Math.min(1,1-(v-0.3)/0.7))*120},75%,45%,.4)`;
    const card=(cls,l,v,s,st="")=>`<div class="lk ${cls}" style="${st}"><div class="lab">${l}</div><div class="val">${v}</div><div class="sub">${s}</div></div>`;
    el.style.display="grid";
    el.innerHTML = [
      card("b-tot",`${IC.chart} CV headways (${periodoLbl(per)})`, cv!=null?cv.toFixed(2):"—", `${cvLbl(cv)} · ${n||0} intervalos`, cvBg(cv)),
      card("b-eff",`${IC.timer} Headway medio`, hw!=null?hw.toFixed(1)+" min":"—", `intervalo entre buses (${periodoLbl(per)})`),
      card("b-bajo","Vs. sistema", sisCv!=null?(cv!=null?((cv-sisCv)>=0?"+":"")+(cv-sisCv).toFixed(2):"—"):"—",
        sisCv!=null?`sistema ${sisCv.toFixed(2)} · ${cv!=null&&cv<sisCv?"mejor":"peor"}`:"sin referencia", ""),
      card("b-med","CV AM punta", dAm!=null?dAm.toFixed(2):"—", cvLbl(dAm), cvBg(dAm)),
      card("b-alto","CV PM punta", dPm!=null?dPm.toFixed(2):"—", cvLbl(dPm), cvBg(dPm)),
      card("b-cic","CV Noche", dNoche!=null?dNoche.toFixed(2):"—", cvLbl(dNoche), cvBg(dNoche)),
    ].join("");
    return;
  }
  // COMUNA: DETENCIONES (aggregate lines in that comuna)
  const comView = state.linea==="TODAS" && state.comuna!=="TODAS" && state.vista==="normal";
  const comLines = comView && CLIN ? (CLIN[state.comuna]||[]) : [];
  if(comView && mode==="det" && DETP&&DETP.lineas && comLines.length){
    const sen=state.sentido==="amb"?"amb":state.sentido, per=state.periodo;
    const vals = comLines.map(lb=>{const d=DETP.lineas[lb]; if(!d)return null; const s=d[sen]||d.amb||{}; return (s.L||{})[per];}).filter(v=>v!=null);
    const det = vals.length ? +(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : null;
    const vAm = comLines.map(lb=>{const d=DETP.lineas[lb]; if(!d)return null; const s=d[sen]||d.amb||{}; return (s.L||{}).am;}).filter(v=>v!=null);
    const vPm = comLines.map(lb=>{const d=DETP.lineas[lb]; if(!d)return null; const s=d[sen]||d.amb||{}; return (s.L||{}).pm;}).filter(v=>v!=null);
    const vNoc = comLines.map(lb=>{const d=DETP.lineas[lb]; if(!d)return null; const s=d[sen]||d.amb||{}; return (s.L||{}).noche;}).filter(v=>v!=null);
    const avg = a => a.length ? +(a.reduce((x,y)=>x+y,0)/a.length).toFixed(1) : null;
    const dAm=avg(vAm), dPm=avg(vPm), dNoche=avg(vNoc);
    const allSis=Object.values(DETP.lineas).map(x=>{const s=x[sen]||x.amb||{}; return (s.L||{})[per];}).filter(v=>v!=null);
    const sis = allSis.length ? +(allSis.reduce((a,b)=>a+b,0)/allSis.length).toFixed(1) : null;
    const lbl = v => v==null?"":(v<5?"Bajo":v<15?"Medio":v<25?"Alto":"Muy alto");
    const bg = v => v==null?"":`background:hsla(${Math.max(0,Math.min(1,1-(v-5)/30))*120},75%,45%,.4)`;
    const card=(cls,l,v,s,st="")=>`<div class="lk ${cls}" style="${st}"><div class="lab">${l}</div><div class="val">${v}</div><div class="sub">${s}</div></div>`;
    el.style.display="grid";
    el.innerHTML = [
      card("b-tot",`${IC.stop} % detenido comuna (${periodoLbl(per)})`, det!=null?det+"%":"—", `promedio ${comLines.length} líneas · ${state.comuna}`, bg(det)),
      card("b-eff","Vs. sistema", (det!=null&&sis!=null)?((det-sis)>=0?"+":"")+(det-sis).toFixed(1):"—", sis!=null?`sistema ${sis}%`:"—"),
      card("b-bajo","% AM punta", dAm!=null?dAm+"%":"—", lbl(dAm), bg(dAm)),
      card("b-med","% PM punta", dPm!=null?dPm+"%":"—", lbl(dPm), bg(dPm)),
      card("b-alto","% Noche", dNoche!=null?dNoche+"%":"—", lbl(dNoche), bg(dNoche)),
      card("b-cic","Líneas", comLines.length+"", `que operan en ${state.comuna}`),
    ].join("");
    return;
  }
  // COMUNA: BUNCHING
  if(comView && mode==="bunch" && BUNCH&&BUNCH.lineas && comLines.length){
    const dia="L", per=state.periodo;
    const vals = comLines.map(lb=>(BUNCH.lineas[lb]&&(BUNCH.lineas[lb][dia]||{})[per])||null).filter(x=>x&&x.cv!=null);
    const cv = vals.length ? +(vals.reduce((a,b)=>a+b.cv,0)/vals.length).toFixed(2) : null;
    const hw = vals.length ? +(vals.reduce((a,b)=>a+b.headway,0)/vals.length).toFixed(1) : null;
    const allSis=Object.values(BUNCH.lineas).map(x=>(x[dia]||{})[per]).filter(x=>x&&x.cv!=null).map(x=>x.cv);
    const sisCv = allSis.length ? +(allSis.reduce((a,b)=>a+b,0)/allSis.length).toFixed(3) : null;
    const cvLbl = v => v==null?"—":(v<0.5?"Regular":v<0.8?"Medio":"Apelotonado");
    const cvBg = v => v==null?"":`background:hsla(${Math.max(0,Math.min(1,1-(v-0.3)/0.7))*120},75%,45%,.4)`;
    const card=(cls,l,v,s,st="")=>`<div class="lk ${cls}" style="${st}"><div class="lab">${l}</div><div class="val">${v}</div><div class="sub">${s}</div></div>`;
    el.style.display="grid";
    el.innerHTML = [
      card("b-tot",`${IC.chart} CV comuna (${periodoLbl(per)})`, cv??"—", `${cvLbl(+cv)} · promedio ${vals.length} líneas`, cvBg(+cv)),
      card("b-eff",`${IC.timer} Headway medio`, hw!=null?hw+" min":"—", `promedio en ${state.comuna}`),
      card("b-bajo","Vs. sistema", sisCv!=null?(cv!=null?((cv-sisCv)>=0?"+":"")+(cv-sisCv).toFixed(2):"—"):"—",
        sisCv!=null?`sistema ${sisCv.toFixed(2)}`:"—", ""),
      card("b-med","Líneas evaluadas", vals.length+"", `de ${comLines.length} que operan`),
      card("b-alto","", "",""),
      card("b-cic","", "",""),
    ].join("");
    return;
  }
  // COBERTURA ESTÁTICA (per-line OR per-comuna)
  const showCoverLine = state.linea!=="TODAS" && state.vista==="normal" && mode==="cover" && state.coverSub==="est" && COB && COB.features;
  const showCoverCom = comView && mode==="cover" && state.coverSub==="est" && COB && COB.features;
  if(!showCoverLine && !showCoverCom){ el.style.display="none"; el.innerHTML=""; return; }
  let hog=0, hbaj=0, hmed=0, halt=0, nMz=0;
  COB.features.forEach(f=>{ const p=f.properties;
    if(showCoverLine && !(p.cob_lineas||[]).includes(state.linea)) return;
    if(showCoverCom && !inComuna(p.cy, p.cx)) return;
    nMz++; const h=p.hog||0; hog+=h;
    const t=nseTercil(p.nse);
    if(t===0) hbaj+=h; else if(t===1) hmed+=h; else if(t===2) halt+=h;
  });
  let ext=null, tc=null, flota=null, mainRec=null, hogkm=null;
  if(showCoverLine){
    // recorrido PRINCIPAL = variante más larga. hog/km coherente = hogares de ESA variante ÷ su km
    // (antes se dividía la unión de hogares de TODAS las variantes por el km de UNA -> distorsión).
    const vs = (CLINE.lineas||[]).filter(r=>r.linea===state.linea)
                 .sort((a,b)=>(b.ext_km||0)-(a.ext_km||0));
    const row = vs[0];
    ext = row ? row.ext_km : null; mainRec = row ? row.rec : null;
    hogkm = row ? row.hog_km : null;
    const ci = CICLO && CICLO.lineas && CICLO.lineas[state.linea];
    tc = ci ? ci.tc : null;
    flota = ci ? ci.flota_total : null;
  }
  const ciclos = (tc && flota && tc>0) ? (960/tc).toFixed(1) : null;
  const pct = n => hog ? Math.round(100*n/hog) : 0;
  const t1 = _nseTerciles ? _nseTerciles[0] : null;
  const t2 = _nseTerciles ? _nseTerciles[1] : null;
  const card=(cls,l,v,s)=>`<div class="lk ${cls}"><div class="lab">${l}</div><div class="val">${v}</div><div class="sub">${s}</div></div>`;
  el.style.display="grid";
  const scope = showCoverLine ? `buffer 300 m · línea ${state.linea}` : `manzanas en ${state.comuna}`;
  el.innerHTML = [
    card("b-tot",`${IC.home} Hogares cubiertos`, NF.format(hog), `${nMz} manzanas · ${scope}`),
    card("b-bajo","NSE bajo", NF.format(hbaj), `${pct(hbaj)}% · ≤ ${t1?NF.format(t1):"—"} CLP/m²`),
    card("b-med","NSE medio", NF.format(hmed), `${pct(hmed)}% · entre terciles`),
    card("b-alto","NSE alto", NF.format(halt), `${pct(halt)}% · > ${t2?NF.format(t2):"—"} CLP/m²`),
    card("b-eff",`${IC.ruler} Hog. por km`, hogkm!=null?NF.format(hogkm):"—", ext?`recorrido ${mainRec} · ${ext} km · desglose por variante abajo`:(showCoverCom?`${comLines.length} líneas en comuna`:"")),
    card("b-cic",`${IC.cycle} Ciclos/bus/día`, ciclos??"—", tc?`tiempo de ciclo ${Math.round(tc)} min · ${flota||"—"} buses`:(showCoverCom?"—":"")),
  ].join("");
}
/* ---------- Tabla de cobertura por recorrido (vista sistema + cover) ---------- */
function renderCoverTable(){
  const el=$("cover-table"); if(!el) return;
  let rows=(CLINE&&CLINE.lineas)||[];
  if(state.mapMode!=="cover" || state.coverSub!=="est" || state.vista!=="normal" || !rows.length){ el.style.display="none"; el.innerHTML=""; return; }
  if(state.linea!=="TODAS"){ rows=rows.filter(r=>r.linea===state.linea); }              // vista línea: desglose por variante
  else if(state.comuna!=="TODAS" && CLIN && CLIN[state.comuna]){ const s=new Set(CLIN[state.comuna]); rows=rows.filter(r=>s.has(r.linea)); }
  if(!rows.length){ el.style.display="none"; el.innerHTML=""; return; }
  el.style.display="";
  const mx=k=>Math.max(1,...rows.map(r=>r[k]||0));
  const mH=mx("hog"), mHK=mx("hog_km"), mE=mx("ext_km");
  const heat=(v,m,rgb)=>`style="background:rgba(${rgb},${(m?Math.min(0.6,(v/m)*0.6):0).toFixed(2)})"`;
  const seg=(v,tot,rgb)=>`style="background:rgba(${rgb},${(tot?Math.min(0.66,(v/tot)*0.66):0).toFixed(2)})"`;
  const velBg=v=>v?`style="background:hsla(${(Math.max(0,Math.min((v-12)/7,1))*120).toFixed(0)},70%,45%,.42)"`:'';
  let html=`<div class="cap">Cobertura de hogares por recorrido (manzanas Censo a ≤300 m del trazado). <b>Vel</b> = velocidad operacional (rojo lento / verde rápido). <b>Hog/km</b> = hogares ÷ extensión. NSE por avalúo: <b style="color:#fb923c">bajo</b> · <b style="color:#94a3b8">medio</b> · <b style="color:#2dd4bf">alto</b> (terciles).</div>`;
  html+=`<table><thead><tr><th class="l">Línea</th><th class="l">Rec</th><th>Ext<br>(km)</th><th>Vel<br>(km/h)</th><th>Hogares</th><th>Hog/km</th><th>NSE<br>bajo</th><th>NSE<br>medio</th><th>NSE<br>alto</th></tr></thead><tbody>`;
  let prev=null;
  rows.forEach(r=>{
    const tot=(r.hog_baj+r.hog_med+r.hog_alt)||1;
    const nl=r.linea!==prev; const sep=nl?' class="grpsep"':'';
    html+=`<tr${sep}><td class="l grp">${nl?r.linea:''}</td><td class="l lh">${r.rec}</td>`+
      `<td ${heat(r.ext_km,mE,'148,163,184')}>${r.ext_km}</td>`+
      `<td ${velBg(r.vel)}><b>${r.vel??'—'}</b></td>`+
      `<td ${heat(r.hog,mH,'56,189,248')}>${NF.format(r.hog)}</td>`+
      `<td ${heat(r.hog_km,mHK,'52,211,153')}><b>${NF.format(r.hog_km)}</b></td>`+
      `<td ${seg(r.hog_baj,tot,'251,146,60')}>${NF.format(r.hog_baj)}</td>`+
      `<td ${seg(r.hog_med,tot,'148,163,184')}>${NF.format(r.hog_med)}</td>`+
      `<td ${seg(r.hog_alt,tot,'45,212,191')}>${NF.format(r.hog_alt)}</td></tr>`;
    prev=r.linea;
  });
  el.innerHTML=html+`</tbody></table>`;
}
/* ---------- Tabla de bunching CV por línea × período (vista sistema + bunch) ---------- */
function renderBunchTable(){
  const el=$("cover-table"); if(!el) return;
  if(state.mapMode!=="bunch" || state.vista!=="normal" || state.linea!=="TODAS" || !BUNCH||!BUNCH.lineas){ return; }
  const periodos = ["am","md","pm","off","noche","agg"];
  let lineas = Object.keys(BUNCH.lineas).sort((a,b)=>(a[0]>='0'&&a[0]<='9'?+a:1e9)-(b[0]>='0'&&b[0]<='9'?+b:1e9));
  if(state.comuna!=="TODAS" && CLIN && CLIN[state.comuna]){ const s=new Set(CLIN[state.comuna]); lineas=lineas.filter(l=>s.has(l)); }
  const cvCell = cv => { if(cv==null) return `<td style="color:var(--dim)">—</td>`;
    const hue = Math.max(0,Math.min(1, 1-(cv-0.3)/0.7))*120;
    return `<td style="background:hsla(${hue},75%,45%,.45);font-weight:600">${cv.toFixed(2)}</td>`; };
  let html=`<div class="cap"><b>Bunching</b> · CV de los headways de salida por línea × período (laboral). <b>Verde</b> regular (≤0.5) · <b>amarillo</b> medio · <b>rojo</b> apelotonado (≥0.8). Headway medio (min) entre paréntesis.</div>`;
  html+=`<table><thead><tr><th class="l">Línea</th>${periodos.map(p=>`<th>${periodoLbl(p)}</th>`).join("")}</tr></thead><tbody>`;
  lineas.forEach(lb=>{
    html+=`<tr><td class="l grp">${lb}</td>`;
    periodos.forEach(p=>{ const d=(BUNCH.lineas[lb].L||{})[p]||{};
      html += cvCell(d.cv).replace("</td>", ` <span style="color:var(--dim);font-weight:400">(${d.headway??"—"})</span></td>`); });
    html+=`</tr>`;
  });
  el.innerHTML = html+`</tbody></table>`;
  el.style.display="";
}
function renderNarrative(){
  const el=$("map-narrative"); if(!el) return;
  if(state.vista!=="normal"){ el.innerHTML=""; return; }
  if(state.linea!=="TODAS" && state.mapMode==="live"){
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
  const M=state.mapMode, amb = state.linea!=="TODAS" ? `manzanas de la línea ${state.linea}` : (state.comuna==="TODAS"?"el Gran Concepción":state.comuna);
  const pu=state.purpose||"all", per=state.periodo, pl=purposeLbl(pu);
  const pe = pu!=="all" ? ` de ${pl}` : "";
  let txt="";
  if(M==="cover" && state.coverSub==="din"){
    const v=scopeWavg(p=>p.cob_din&&p.cob_din[per]);
    txt=`<b>Cobertura dinámica</b>: ¿qué tan seguido pasa un bus cerca de mí? Modelo: cada bus cubre una <b>cápsula de 2 min + 300 m</b> al pasar por su trazado, así que <code>frac = min(1, f/30)</code> donde <code>f</code> es la frecuencia observada en bus/h. Por manzana combina todas las líneas que la cubren (P_total = 1 − Π(1−frac_i)). En <b>${periodoLbl(per)}</b>: verde = el bus pasa casi continuamente; rojo = pasa raramente. ${v!=null?`Media en ${amb}: <b>${(v*100).toFixed(0)}%</b> del tiempo. `:""}Compara <b>Punta AM con Noche</b>: aunque el trazado exista, de noche la frecuencia cae y la cobertura efectiva se desploma.`;
  } else if(M==="cover" && state.coverSub==="od"){
    txt=`<b>Cobertura oferta/demanda</b>: contrasta la <b>capacidad ofrecida</b> con la <b>demanda de viajes-TP</b> que genera cada manzana (hogares × tasa de generación EOD por hora). Para no doble-contar la capacidad compartida del corredor, se <b>reparte por demanda</b>. Se muestra <b>relativo a una zona residencial bien cubierta</b> (Talcahuano/San Pedro/Chiguayante = 100%), <b>no</b> al centro de Concepción — que por ser atractor concentra todas las líneas y distorsionaría la comparación de generación. En <b>${periodoLbl(per)}</b>: verde = bien servida frente a su demanda; rojo = oferta corta. Cruza con la Noche para ver dónde la demanda persiste pero la oferta cae.`;
  } else if(M==="cover"){
    const v=scopeWavg(p=>p.cob_est);
    txt=`<b>Cobertura estática</b> mide qué parte del territorio construido queda dentro del <b>área de influencia de 300 m</b> de los recorridos (buffer sobre el trazado oficial). Verde = la manzana está cubierta por la red; rojo = fuera del alcance peatonal de cualquier recorrido. ${v!=null?`En ${amb}, en promedio el <b>${v.toFixed(0)}%</b> de cada manzana está cubierto. `:""}Es la cobertura geográfica pura: aún no considera con qué frecuencia pasan los buses (eso es la cobertura dinámica – oferta).`;
  } else if(M==="trans"){
    const v=scopeWavg(p=>p.lab&&p.lab.dir);
    txt=`<b>Transbordo</b> mide qué proporción de los <b>viajes con propósito trabajo</b> (Censo 2024: comuna de residencia → comuna donde la persona declara trabajar) se pueden hacer en transporte público con <b>una sola línea, sin transbordar</b>. Verde = llegas directo; rojo = dependes de transbordar (hoy = pagar dos pasajes) o tu destino laboral es inalcanzable por la red registrada. ${v!=null?`En ${amb}, en promedio el <b>${v.toFixed(0)}%</b> de los viajes-trabajo es directo. `:""}Las zonas rojas son las que más ganarían con integración modal/tarifaria o nuevas conexiones.`;
  } else if(M==="wait"){
    const v=scopeWavg(p=>p.waitd&&p.waitd[pu]&&p.waitd[pu][per]);
    txt=`<b>Espera</b> estima el tiempo efectivo de espera hacia los destinos${pe}: ½·intervalo·(1+CV²), con la <b>frecuencia real en el sentido que va hacia el destino</b> (un bus en dirección contraria no cuenta) y penalizando el <b>apelotonamiento</b>. ${v!=null?`Media en ${amb} (${periodoLbl(per)}): <b>${v.toFixed(1)} min</b>. `:""}Cambia con el período — compara punta y fuera de punta.`;
  } else if(M==="conges" && state.congSub==="estab"){
    const md=SGSTATS&&SGSTATS.meta&&SGSTATS.meta.ndays?SGSTATS.meta.ndays[per]:null;
    txt=`<b>Estabilidad de la velocidad</b>: coeficiente de variación (σ/μ) de la velocidad efectiva <b>día a día</b> por arco, en <b>${periodoLbl(per)}</b>${md?` (sobre ${md} días hábiles)`:""}. <b>Verde = eje consistente</b>: la velocidad casi no cambia entre un día y otro, aunque haya congestión — la firma de un <b>corredor eficiente o vía exclusiva</b>. Rojo = muy variable: depende fuerte del día (un accidente, lluvia o un evento lo colapsan). La hipótesis: la infraestructura exclusiva de buses debería pintarse verde incluso en punta.`;
  } else if(M==="conges" && state.congSub==="crit"){
    const nd=SGSTATS&&SGSTATS.meta&&SGSTATS.meta.ndays?SGSTATS.meta.ndays[per]:null;
    txt=`<b>Día crítico</b>: velocidad de cada arco en <b>sus propios peores ~10% de días</b> (percentil 10)${nd?` sobre ${nd} días hábiles`:""} en <b>${periodoLbl(per)}</b>. Es el valor crítico <b>de cada eje por separado</b> — no los días malos de la ciudad, que enmascaraban los peaks locales (un eje puede congestionarse un día normal para el resto). Rojo = el eje colapsa en sus días malos; verde = aguanta. En el hover: <b>% respecto de su día normal</b> (resiliencia) — un corredor protegido se mantiene cerca del 100%.`;
  } else if(M==="conges"){
    const v=GRID?(function(){const cs=periodCellSpeeds().filter(x=>x>0);return cs.length?cs.reduce((a,b)=>a+b,0)/cs.length:null;})():null;
    txt=`<b>Congestión</b>: <b>velocidad efectiva</b> de los buses por arco de la red en <b>${periodoLbl(per)}</b> — incluye el <b>tiempo detenido en tránsito</b> (semáforos, tacos), no solo cuando el bus avanza, por eso revela la congestión real. Rojo = ejes lentos. ${v!=null?`Velocidad efectiva media: <b>${v.toFixed(1)} km/h</b>. `:""}Cambia con el período para ver dónde y cuándo aparece.`;
  } else if(M==="bunch"){
    txt=`<b>Bunching</b>: regularidad de los intervalos entre buses (CV de los headways) medida en puntos de la red, en <b>${periodoLbl(per)}</b>. Verde = buses parejos; rojo = <b>apelotonados</b> (vienen pegados y luego un hueco largo) → peor espera efectiva aguas abajo. Es la huella de la congestión sobre la frecuencia.`;
  } else if(M==="det"){
    txt=`<b>Detenciones</b>: nodos donde los buses pasan más tiempo detenidos, <b>excluyendo los terminales</b> (que distorsionan por la espera de cabecera). Los círculos ámbar→rojo son cuellos de demora en marcha; las cajas <b>▣</b> cyan son terminales, con su flota por línea al pasar el cursor.`;
  } else if(M==="terms"){
    const nc=TERMCONF?(TERMCONF.confirmados||[]).length:0, nr=TERMCONF?(TERMCONF.retornos||[]).length:0;
    txt=`<b>Terminales validados manualmente</b> (corregidos en Google Earth sobre la detección estático+GPS). <b style='color:#22c55e'>● Verde numerado</b> = ${nc} <b>terminales formales</b>: cuentan como "buses en terminal" y su reposo se excluye de la detención. <b style='color:#22d3ee'>● Cyan</b> = ${nr} <b>puntos de retorno</b>: fin de ruta donde el bus espera unos minutos para partir — NO es terminal formal (no suma a la flota en terminal), pero su reposo <b>igual se excluye de la detención</b> (no es congestión). Activa la <b>capa satelital</b> para corroborar.`;
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
  const box = $("rank-box"), hint = $("rank-hint"), rt = $("rank-title");
  // VISTA LÍNEA: reemplaza el ranking por la FRECUENCIA EXIGIDA por el GTFS estático (despachos/hora
  // programados), para comparar con la "Frecuencia de salida" observada de arriba.
  if(state.linea!=="TODAS"){
    // COMBINADO: frecuencia de salida OBSERVADA (promedio) + EXIGIDA (GTFS estático), despachos/hora,
    // con selector de tipo de día (default Laborable). Así se ve directo si se cumple o no.
    if(rt) rt.textContent = "Frecuencia: salida vs exigida (GTFS)";
    const nn=$("rank-narr");
    const dia = state.freqDia || "L";
    const DL = {L:"Laborable", S:"Sábado", D:"Domingo"};
    const cd = CUMP && CUMP.lineas && CUMP.lineas[state.linea];
    if(!cd || !cd.prog || !CUMP.horas || !BASE30){ box.innerHTML=`<div class="empty">Sin frecuencia programada (GTFS) para esta línea.</div>`; hint.textContent=""; if(nn) nn.innerHTML=""; return; }
    hint.textContent = `despachos/hora · ${DL[dia]}`;
    // selector de día + contenedor del chart
    const dsel = ["L","S","D"].map(d=>`<b data-d="${d}" style="cursor:pointer;padding:2px 9px;border-radius:6px;font-size:11px;${d===dia?"background:var(--live-tint);color:var(--live);font-weight:700":"color:var(--muted)"}">${DL[d]}</b>`).join("");
    box.innerHTML = `<div style="display:flex;gap:5px;align-items:center;margin-bottom:6px"><span style="font-size:11px;color:var(--muted);margin-right:2px">Día:</span>${dsel}</div><div id="ch-rank-prog" style="height:215px"></div>`;
    box.querySelectorAll("b[data-d]").forEach(el=>el.onclick=()=>{ state.freqDia=el.dataset.d; renderRanking(); });
    const th=TH(), x=CUMP.horas.map(h=>h+"h");
    const fl=(BASE30[dia]&&BASE30[dia].freq_lin||{})[state.linea];
    const salida=CUMP.horas.map(h=>{ if(!fl) return null; const a=fl[2*h], b=fl[2*h+1]; return (a==null&&b==null)?null:Math.round(((a||0)+(b||0))*10)/10; });
    const exigida=cd.prog[dia]||[];
    if(rankProgChart){ try{rankProgChart.dispose();}catch(e){} }
    rankProgChart = echarts.init($("ch-rank-prog"));
    rankProgChart.setOption({
      textStyle:{fontFamily:th.font,color:th.tx},
      grid:{left:8,right:12,top:30,bottom:20,containLabel:true},
      legend:{data:["Exigida (GTFS)","Salida (observada)"],textStyle:{color:th.mut},top:0},
      tooltip:{trigger:"axis",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx},
        formatter:p=>{let s=`${p[0].axisValue}<br>`; p.forEach(x=>{if(x.value!=null)s+=`${x.marker}${x.seriesName}: <b>${x.value}</b><br>`;}); return s;}},
      xAxis:{type:"category",data:x,axisLabel:{color:th.mut,fontSize:9,interval:1},axisLine:{lineStyle:{color:th.axis}}},
      yAxis:{type:"value",name:"despachos/hora",nameTextStyle:{color:th.mut,fontSize:10},axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
      series:[
        {name:"Exigida (GTFS)",type:"line",data:exigida,smooth:true,symbol:"none",lineStyle:{width:2.5,color:"#fbbf24",type:"dashed"},itemStyle:{color:"#fbbf24"}},
        {name:"Salida (observada)",type:"line",data:salida,smooth:true,symbol:"none",connectNulls:false,lineStyle:{width:2,color:cssv("--live")},itemStyle:{color:cssv("--live")},areaStyle:{color:cssv("--live")+"12"}},
      ],
    },true);
    setTimeout(()=>rankProgChart.resize(),60);
    if(nn) nn.innerHTML=`Línea ${state.linea} · ${DL[dia]}: <b style="color:#fbbf24">exigida (GTFS)</b> vs <b style="color:var(--live)">salida observada</b> (promedio histórico), en despachos/hora. Donde la observada cae bajo la exigida hay <b>subprestación</b>. Clic en el día para comparar.`;
    return;
  }
  if(rt) rt.textContent = "Ranking de líneas";
  let rows;
  if(state.linea==="TODAS"){
    hint.textContent = state.comuna==="TODAS" ? "líneas con más actividad en el sistema" : `líneas con más actividad en ${state.comuna}`;
    rows = (T.lineas||[]).map(l=>{const c=T.cells[`${state.comuna}|${l.linea}`];return c&&c.kpi?{id:l.linea,nm:l.empresa,v:c.kpi.pulsos}:null;}).filter(Boolean);
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
  const colorOf = y => !vc.pct||y==null ? cssv("--ref") : y>=120?cssv("--live"):y>=95?"#34d399":y>=80?cssv("--warn"):"#fb7185";
  const pts = ys.map((y,i)=>({value:y, itemStyle:{color:colorOf(y)}}));
  if(!csChart) csChart = echarts.init($("cs-chart"));
  const th = TH();
  const markLines = vc.ref.length ? {silent:true,symbol:"none",lineStyle:{type:"dashed"},data:[
      {yAxis:80,lineStyle:{color:"rgba(251,113,133,.6)"},label:{formatter:"80% mínimo",color:"#fb7185",position:"insideEndTop",fontSize:10}},
      {yAxis:100,lineStyle:{color:"rgba(52,211,153,.5)"},label:{formatter:"100%",color:"#34d399",position:"insideEndTop",fontSize:10}}
    ]} : undefined;
  csChart.setOption({
    textStyle:{fontFamily:th.font,color:th.tx},
    grid:{left:46,right:20,top:18,bottom:54,containLabel:true},
    tooltip:{trigger:"axis",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx},
      formatter:p=>{const i=p[0].dataIndex,d=serie[i];return `Semana ${d.wk}<br>${vc.lbl}: <b>${d[state.csVar]??"—"}${vc.suf}</b><br>`+
        `<span style="color:${th.mut}">exp/día ${d.exp} · flota ${d.flota} · ${d.dias} días</span>`;}},
    xAxis:{type:"category",data:xs,axisLabel:{color:th.mut,fontSize:9,rotate:90,interval:2},axisLine:{lineStyle:{color:th.axis}}},
    yAxis:{type:"value",name:vc.pct?"%":vc.lbl,min:0,max:vc.pct?(Math.max(120,Math.ceil((Math.max(...ys.filter(v=>v!=null))||100)/20)*20)):null,
      axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
    series:[{type:"line",data:pts,smooth:false,symbol:"circle",symbolSize:5,
      lineStyle:{width:2,color:cssv("--ref")+"80"},
      areaStyle:vc.pct?{color:cssv("--ref")+"10"}:undefined,
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
    textStyle:{fontFamily:th.font,color:th.tx},
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
  const cells = COB.features.filter(f=>inComuna(f.properties.cy, f.properties.cx))
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
    textStyle:{fontFamily:th.font,color:th.tx},
    grid:{left:42,right:46,top:30,bottom:24,containLabel:true},
    legend:{data:["% en desierto","Acceso medio"],textStyle:{color:th.mut},top:0,right:0},
    tooltip:{trigger:"axis",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx}},
    xAxis:{type:"category",data:["Q1","Q2","Q3","Q4","Q5"],axisLabel:{color:th.mut,
      formatter:(v,i)=>["Q1 ·\nmás vulnerable","Q2","Q3","Q4","Q5 ·\nmás acomodado"][i]},axisLine:{lineStyle:{color:th.axis}}},
    yAxis:[{type:"value",name:"% desierto",axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
           {type:"value",name:"min",position:"right",axisLabel:{color:th.mut},splitLine:{show:false}}],
    series:[
      {name:"% en desierto",type:"bar",data:desierto,barWidth:"46%",itemStyle:{color:"#fb7185",borderRadius:[4,4,0,0]}},
      {name:"Acceso medio",type:"line",yAxisIndex:1,data:acceso,smooth:true,symbol:"circle",symbolSize:7,lineStyle:{width:2.5,color:cssv("--ref")},itemStyle:{color:cssv("--ref")}}
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
  card.style.display="none"; return;   // ELIMINADO temporalmente: "Frecuencia por variante" (puntos que se salen; revisar a fondo antes de reactivar)
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
  const xs=VFREQ.horas.map(h=>h+"h"), COLP=[cssv("--live"),cssv("--ref"),cssv("--warn"),cssv("--violet"),cssv("--alert")];
  if(varProfChart) varProfChart.dispose(); varProfChart=echarts.init($("var-prof-chart"));
  varProfChart.setOption({
    textStyle:{fontFamily:th.font,color:th.tx},
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
      textStyle:{fontFamily:th.font,color:th.tx},
      grid:{left:36,right:12,top:34,bottom:22,containLabel:true},
      legend:{top:0,textStyle:{color:th.mut,fontSize:10},itemWidth:12,itemHeight:8},
      tooltip:{trigger:"axis",backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx}},
      xAxis:{type:"category",data:xs2,axisLabel:{color:th.mut,fontSize:9},axisLine:{lineStyle:{color:th.axis}}},
      yAxis:{type:"value",name:"desp/día",axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
      series:[ vt?{name:"Variante "+curVar,type:"line",data:vt.dd,smooth:true,symbol:"circle",symbolSize:5,connectNulls:true,lineStyle:{width:2.6,color:cssv("--live")},itemStyle:{color:cssv("--live")}}:null,
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
    textStyle:{fontFamily:th.font,color:th.tx},
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
  const col=[cssv("--ref"),cssv("--warn")];
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
    textStyle:{fontFamily:th.font,color:th.tx},
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
    textStyle:{fontFamily:th.font,color:th.tx},
    grid:{left:8,right:52,top:8,bottom:16,containLabel:true},
    tooltip:{trigger:"axis",axisPointer:{type:"shadow"},backgroundColor:th.tip,borderColor:th.tipB,textStyle:{color:th.tx},
      formatter:p=>{const x=d[p[0].dataIndex];return `<b>${x.fantasia}</b> (L${x.linea})<br>${x.razon_social}<br>Buses: <b>${x.buses}</b> · ${(x.pulsos/1e6).toFixed(1)} M pulsos<br>Vel ${x.vel} km/h · ${x.comunas}`;}},
    xAxis:{type:"value",name:"buses",axisLabel:{color:th.mut},splitLine:{lineStyle:{color:th.grid}}},
    yAxis:{type:"category",inverse:true,data:d.map(x=>`${x.fantasia} (L${x.linea})`),axisLabel:{fontSize:11,color:th.tx},axisLine:{lineStyle:{color:th.axis}}},
    series:[{type:"bar",data:d.map(x=>x.buses),barWidth:"66%",itemStyle:{borderRadius:[0,5,5,0],
      color:new echarts.graphic.LinearGradient(1,0,0,0,[{offset:0,color:cssv("--violet")},{offset:1,color:cssv("--violet")+"59"}])},
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
    textStyle:{fontFamily:th.font,color:th.tx},
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
  const colorOf = v => !slow ? cssv("--ref") : isCV ? `hsl(${(1-Math.min(v/40,1))*120},70%,50%)` : `hsl(${Math.min(v/35,1)*120},70%,50%)`;
  const th=TH(); if(recChart) recChart.dispose(); recChart=echarts.init($("rec-chart"));
  recChart.setOption({
    textStyle:{fontFamily:th.font,color:th.tx},
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
    textStyle:{fontFamily:th.font,color:th.tx},
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
    J("cobertura.json").then(d=>{ COB=d; renderNseGap(); if(state.mapMode!=="live") renderMapa();
      if(LIVE && state.vista==="normal" && state.linea==="TODAS" && state.comuna==="TODAS") renderLiveExtras();
    }).catch(()=>{});
    J("flota_equidad.json").then(d=>{ EQ=d; renderEquidad(); }).catch(()=>{});
    J("operacion_linea.json").then(d=>{ OP=d; renderOperacion(); renderCalidad(); }).catch(()=>{});
    J("speed_grid_hora.json").then(d=>{ GRID=d; if(state.mapMode==="conges") renderMapa(); }).catch(()=>{});
    J("congestion_red.json").then(d=>{ CONGRED=d; if(state.mapMode==="conges"||state.mapMode==="bunch") renderMapa(); }).catch(()=>{});
    J("speed_grid_stats.json").then(d=>{ SGSTATS=d; if(state.mapMode==="conges"&&state.congSub!=="prom") renderMapa(); }).catch(()=>{});
    J("terminales_confirmados.json").then(d=>{ TERMCONF=d; if(state.mapMode==="terms") renderMapa(); }).catch(()=>{});
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
    J("vel_ciclo.json").then(d=>{ VCICLO=d; renderVelCiclo(); }).catch(()=>{});
    document.querySelectorAll(".vc-per").forEach(el=>el.onclick=()=>{ vcPer=el.dataset.p; document.querySelectorAll(".vc-per").forEach(b=>b.classList.toggle("active",b===el)); renderVelCiclo(); });
    document.querySelectorAll(".vc-sm").forEach(el=>el.onclick=()=>{ vcSm=+el.dataset.s; document.querySelectorAll(".vc-sm").forEach(b=>b.classList.toggle("active",b===el)); renderVelCiclo(); });
    Promise.all([J("variantes_freq.json").catch(()=>null), J("freq_trend.json").catch(()=>null)])
      .then(([vf,vt])=>{ VFREQ=vf; VTREND=vt; renderVarFreq(); });
    J("terminales_linea.json").then(d=>{ TLIN=d; if(state.linea!=="TODAS") renderMapa(); }).catch(()=>{});
    J("det_periodo.json").then(d=>{ DETP=d; if(state.mapMode==="det") render(); }).catch(()=>{});
    J("cobertura_lineas.json").then(d=>{ CLINE=d; if(state.mapMode==="cover") render(); }).catch(()=>{});
    J("bunching.json").then(d=>{ BUNCH=d; if(state.mapMode==="bunch") render(); }).catch(()=>{});
    J("bunching_arco.json").then(d=>{ BUNCHA=d; if(state.mapMode==="bunch"&&state.linea!=="TODAS") renderMapa(); }).catch(()=>{});
    J("ciclo.json").then(d=>{ CICLO=d; }).catch(()=>{});
    buildMapModes();
    buildPeriodo(); buildPurpose(); buildCoverSub(); buildSentido(); buildDettipo(); buildCongsub();
    buildComunaTabs();
    buildLineaList();
    $("linea-search").addEventListener("input", e=>buildLineaList(e.target.value));
    $("reset-btn").onclick = ()=>{ Object.assign(state,{comuna:"TODAS",linea:"TODAS",vista:"normal"}); $("linea-search").value=""; buildLineaList(); render(); };
    render();
    loadLive(); setInterval(loadLive, 60000);   // buses operando ahora, refresco 60 s
    // F2: "actualizado hace Xs" — tick cada segundo
    tickLiveAge(); setInterval(tickLiveAge, 1000);
    // spec declarativo de KPIs (opcional, fallback al hardcode si no carga)
    J("kpis_spec.json").then(s=>{
      if(s && Array.isArray(s.kpis)) LIVE_KPIS = s.kpis.map(o=>({...o, f:(_LIVE_FMT[o.fmt]||_LIVE_FMT.int)}));
    }).catch(()=>{});
    J("baseline_30min.json").then(d=>{ BASE30=d; loadDia(); }).catch(()=>{});   // baseline + vivo del inicio
    J("cobertura_din_lineas.json").then(d=>{ DINL=d; renderCobDinLinea(); if(state.mapMode==="cover" && state.coverSub==="din") render(); }).catch(()=>{});
    setInterval(loadDia, 60000);                 // dia.json (vivo vs normal), refresco 60 s
    addEventListener("resize", ()=>{ [csChart,eqChart,nseChart,rankChart,cmpChart,empresasChart,heatChart,recChart,evolChart,freqChart,linFreqChart,vcChart].forEach(c=>{try{c&&c.resize();}catch(e){}}); if(lmap) lmap.invalidateSize(); });
  }catch(e){ console.error(e); $("kpis2").innerHTML=`<div class="empty">No se pudieron cargar los datos.</div>`; }
})();
