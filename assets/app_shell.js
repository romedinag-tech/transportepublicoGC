/* Visor Transporte Gran Concepción — navegación por comuna (territorio) y línea (operador) */
const NF = new Intl.NumberFormat("es-CL");
const fmt = n => NF.format(Math.round(n||0));
const fmt1 = n => NF.format(Math.round((n||0)*10)/10);
const HORAS = [...Array(24).keys()].map(h=>String(h).padStart(2,"0")+"h");
const $ = id => document.getElementById(id);
const J = n => fetch(`data/${n}?v=21`).then(r=>r.json());
const BUILD = "2026-06-18 16:20";

let T, GEOM, GEO, CUMP, PAR={}, CSEM={lineas:{}}, EMPL={};
let state = {comuna:"TODAS", linea:"TODAS", csDia:"L", csVar:"freq"};
let chart, csChart, lmap, baseLayers, routeLayer, comunaLayer, stopLayer, speedLegend;

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
function buildComunaTabs(){
  const order = (GEO.features||[]).map(f=>f.properties.name);
  const tabs = ["TODAS", ...order];
  $("comuna-tabs").innerHTML = tabs.map(c=>{
    const lbl = c==="TODAS" ? "Sistema" : c;
    return `<span class="ctab" data-c="${c}">${lbl}</span>`;
  }).join("");
  $("comuna-tabs").querySelectorAll(".ctab").forEach(el=>{
    el.onclick = ()=>{ state.comuna = el.dataset.c; render(); };
  });
}
function buildLineaList(filter=""){
  const f = filter.trim().toLowerCase();
  const items = (T.lineas||[]).filter(l => !f || l.linea.includes(f) || (l.empresa||"").toLowerCase().includes(f));
  $("linea-list").innerHTML = items.map(l =>
    `<div class="litem" data-l="${l.linea}"><span class="ln">${l.linea}</span><span class="nm">${l.empresa||""}</span></div>`).join("");
  $("linea-list").querySelectorAll(".litem").forEach(el=>{
    el.onclick = ()=>{ state.linea = state.linea===el.dataset.l ? "TODAS" : el.dataset.l; render(); };
  });
}

/* ---------- render ---------- */
function render(){
  // resaltar menús
  document.querySelectorAll(".ctab").forEach(e=>e.classList.toggle("active", e.dataset.c===state.comuna));
  document.querySelectorAll(".litem").forEach(e=>e.classList.toggle("active", e.dataset.l===state.linea));
  const hasFilter = state.comuna!=="TODAS" || state.linea!=="TODAS";
  $("reset-btn").style.display = hasFilter ? "" : "none";

  // título de ámbito
  let title, sub;
  const emp = state.linea!=="TODAS" ? empresaDe(state.linea) : "";
  if(state.linea==="TODAS" && state.comuna==="TODAS"){ title="Sistema completo"; sub="36 líneas · 12 comunas"; }
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
    kpiCard("Tiempo detenido", fmt1(k.pct_det)+" %", "de los registros"),
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
  if(window.ResizeObserver) new ResizeObserver(()=>lmap.invalidateSize()).observe($("lmap"));
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
  // límites comunales
  const feats = (GEO.features||[]);
  feats.forEach(f=>{
    const sel = f.properties.name===state.comuna;
    L.geoJSON(f,{style:{color:sel?"#38bdf8":"rgba(148,161,186,.45)",weight:sel?2.5:1,fill:sel,fillColor:"#38bdf8",fillOpacity:sel?0.08:0}}).addTo(comunaLayer);
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
  try{ if(bounds && (bounds.length||bounds.isValid&&bounds.isValid())) lmap.fitBounds(bounds,{padding:[20,20]}); }catch(e){}
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
    const rows = Object.keys(L).map(ln=>({ln, c:L[ln].cumpl.L, emp:empresaDe(ln)}))
                  .filter(r=>r.c!=null).sort((a,b)=>a.c-b.c).slice(0,12);
    box.innerHTML = rows.map(r=>`<div class="cump-row" data-l="${r.ln}" style="cursor:pointer">
      <b style="font-family:var(--mono);min-width:34px">${r.ln}</b>
      <span style="flex:1;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.emp||""}</span>
      ${cumpBar(r.c)}
      <span class="pct" style="color:${cumpCol(r.c)};min-width:46px">${r.c}%</span></div>`).join("")
      + `<div class="hint" style="margin-top:8px">Cumplimiento de frecuencia día laborable (despachos observados / programados). Menor = peor. Clic para ver la línea.</div>`;
    box.querySelectorAll(".cump-row").forEach(el=>el.onclick=()=>{state.linea=el.dataset.l;render();});
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
    buildComunaTabs();
    buildLineaList();
    $("linea-search").addEventListener("input", e=>buildLineaList(e.target.value));
    $("reset-btn").onclick = ()=>{ state={comuna:"TODAS",linea:"TODAS"}; $("linea-search").value=""; buildLineaList(); render(); };
    render();
    addEventListener("resize", ()=>{ if(chart) chart.resize(); if(csChart) csChart.resize(); if(lmap) lmap.invalidateSize(); });
  }catch(e){ console.error(e); $("kpis2").innerHTML=`<div class="empty">No se pudieron cargar los datos.</div>`; }
})();
