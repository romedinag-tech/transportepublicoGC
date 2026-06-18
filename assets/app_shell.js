/* Visor Transporte Gran Concepción — navegación por comuna (territorio) y línea (operador) */
const NF = new Intl.NumberFormat("es-CL");
const fmt = n => NF.format(Math.round(n||0));
const fmt1 = n => NF.format(Math.round((n||0)*10)/10);
const HORAS = [...Array(24).keys()].map(h=>String(h).padStart(2,"0")+"h");
const $ = id => document.getElementById(id);
const J = n => fetch(`data/${n}?v=12`).then(r=>r.json());
const BUILD = "2026-06-18 08:23";

let T, GEOM, GEO, CUMP, EMPL={};
let state = {comuna:"TODAS", linea:"TODAS"};
let chart, lmap, baseLayers, routeLayer, comunaLayer;

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
  chart.setOption({
    textStyle:{fontFamily:"Inter,sans-serif",color:"#cdd7e6"},
    grid:{left:42,right:46,top:34,bottom:28,containLabel:true},
    legend:{data:["Flota (buses)","Velocidad"],textStyle:{color:"#93a1ba"},top:0,right:0},
    tooltip:{trigger:"axis",backgroundColor:"rgba(13,20,36,.96)",borderColor:"rgba(255,255,255,.14)",textStyle:{color:"#e8eef8"},
      formatter:p=>{const i=p[0].dataIndex,x=h[i]||{};return `${HORAS[i]}<br>Flota: <b>${fmt1(x.b)}</b> buses<br>Velocidad: <b>${fmt1(x.v)}</b> km/h<br>Detenido: ${fmt1(x.d)}%`;}},
    xAxis:{type:"category",data:HORAS,axisLabel:{color:"#93a1ba",fontSize:10},axisLine:{lineStyle:{color:"rgba(255,255,255,.16)"}}},
    yAxis:[{type:"value",name:"buses",axisLabel:{color:"#93a1ba"},splitLine:{lineStyle:{color:"rgba(255,255,255,.05)"}}},
           {type:"value",name:"km/h",position:"right",max:60,axisLabel:{color:"#93a1ba"},splitLine:{show:false}}],
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
  const sat = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{maxZoom:19,attribution:"Imagery © Esri"}).addTo(lmap);
  const calles = L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",{maxZoom:20,subdomains:"abcd",attribution:"© OSM © CARTO"});
  const etiquetas = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",{maxZoom:19}).addTo(lmap);
  L.control.layers({"Satélite":sat,"Calles":calles},{"Vías y etiquetas":etiquetas},{collapsed:true,position:"topright"}).addTo(lmap);
  comunaLayer = L.layerGroup().addTo(lmap);
  routeLayer = L.layerGroup().addTo(lmap);
  if(window.ResizeObserver) new ResizeObserver(()=>lmap.invalidateSize()).observe($("lmap"));
}
function renderMapa(){
  ensureMap();
  comunaLayer.clearLayers(); routeLayer.clearLayers();
  setTimeout(()=>lmap.invalidateSize(),120);
  // límites comunales
  const feats = (GEO.features||[]);
  feats.forEach(f=>{
    const sel = f.properties.name===state.comuna;
    L.geoJSON(f,{style:{color:sel?"#38bdf8":"rgba(148,161,186,.45)",weight:sel?2.5:1,fill:sel,fillColor:"#38bdf8",fillOpacity:sel?0.08:0}}).addTo(comunaLayer);
  });
  let bounds=[];
  if(state.linea!=="TODAS" && GEOM[state.linea]){
    GEOM[state.linea].forEach(seg=>{
      L.polyline(seg.p,{color:seg.s===0?"#38bdf8":"#c084fc",weight:3,opacity:0.9}).addTo(routeLayer);
      bounds.push(...seg.p);
    });
    const nrec = new Set(GEOM[state.linea].map(s=>s.rec)).size;
    $("map-title").textContent = `Línea ${state.linea} · ${nrec} recorrido${nrec>1?"s":""} (subrutas)`;
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

function renderCump(){
  const box = $("cump-box");
  let servs;
  if(state.linea!=="TODAS"){
    servs = Object.keys(CUMP).filter(s=>s.slice(0,2)===state.linea).map(s=>({s,...CUMP[s]}));
    if(!servs.length){ box.innerHTML=`<div class="empty">Esta línea aún no tiene Programa de Operación en el dataset (piloto de 18 servicios: líneas 30,31,32,41,50,63,65).</div>`; return; }
  } else {
    servs = Object.keys(CUMP).map(s=>({s,...CUMP[s]})).sort((a,b)=>b.pct_incumple-a.pct_incumple).slice(0,10);
  }
  servs.sort((a,b)=>b.pct_incumple-a.pct_incumple);
  box.innerHTML = servs.map(x=>{
    const col = x.pct_incumple>=40?"#fb7185":x.pct_incumple>=20?"#fbbf24":"#34d399";
    return `<div class="cump-row"><b style="font-family:var(--mono);min-width:44px">${x.s}</b>
      <span style="flex:1;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${x.empresa}</span>
      <span class="bar" style="flex:0 0 90px;height:7px;border-radius:4px;background:rgba(255,255,255,.06);overflow:hidden"><i style="display:block;height:100%;width:${x.pct_incumple}%;background:${col}"></i></span>
      <span class="pct" style="color:${col}">${x.pct_incumple}%</span></div>`;
  }).join("") + `<div class="hint" style="margin-top:8px">% de franjas horarias con oferta bajo el 80% de lo comprometido.</div>`;
}

/* ---------- init ---------- */
(async function(){
  try{
    const HIST = "https://storage.googleapis.com/gccp-transporte-live/hist/territorio.json";
    const loadT = fetch(HIST+"?t="+Date.now(),{cache:"no-store"}).then(r=>{if(!r.ok)throw 0;return r.json();}).catch(()=>J("territorio.json"));
    [T, GEOM, GEO, CUMP] = await Promise.all([
      loadT, J("lineas_geom.json"), J("comunas_gccp.geojson"), J("cumplimiento.json")]);
    if(T.hasta){ const pe=$("periodo-pill"); if(pe) pe.textContent = "datos hasta "+T.hasta; }
    const vd=$("vfoot-data"); if(vd) vd.textContent = "Datos hasta: "+(T.hasta||"—");
    fetch("data/version.json?t="+Date.now(),{cache:"no-store"}).then(r=>r.json()).then(v=>{
      const vb=$("vfoot-build"); if(!vb) return;
      vb.textContent = "Visor actualizado: "+BUILD+" (hora Chile)";
      if(v.build && v.build!==BUILD) vb.innerHTML += ' · <span class="nueva" onclick="location.reload(true)">⚠ hay una versión más nueva — recargar</span>';
    }).catch(()=>{ const vb=$("vfoot-build"); if(vb) vb.textContent="Visor actualizado: "+BUILD; });
    buildComunaTabs();
    buildLineaList();
    $("linea-search").addEventListener("input", e=>buildLineaList(e.target.value));
    $("reset-btn").onclick = ()=>{ state={comuna:"TODAS",linea:"TODAS"}; $("linea-search").value=""; buildLineaList(); render(); };
    render();
    addEventListener("resize", ()=>{ if(chart) chart.resize(); if(lmap) lmap.invalidateSize(); });
  }catch(e){ console.error(e); $("kpis2").innerHTML=`<div class="empty">No se pudieron cargar los datos.</div>`; }
})();
