/* Tablero Transporte Público Gran Concepción */
const NF = new Intl.NumberFormat("es-CL");
const fmt = n => NF.format(n);
const fmt1 = n => NF.format(Math.round(n*10)/10);
const MES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const mesLab = s => { const [y,m]=s.split("-"); return `${MES[+m-1]} ${y.slice(2)}`; };
const HORAS = [...Array(24).keys()].map(h=>String(h).padStart(2,"0")+"h");
const COL = {acc:"#38bdf8",acc2:"#34d399",warn:"#fbbf24",danger:"#fb7185",violet:"#a78bfa",dim:"#93a1ba"};
const HEAT = ["#0e1c30","#15425a","#1d6e7a","#2a9d8f","#74c97b","#cfe05a","#fbbf24"];
const SPEED = ["#b2182b","#ef8a62","#fddbc7","#d1e5f0","#67a9cf","#2166ac"]; // lento->rapido

const charts = [];
const $ = id => document.getElementById(id);
const J = name => fetch(`data/${name}`).then(r=>r.json());
let EMP = {};                         // linea -> fantasia
const lineaDe = rec => (rec||"").slice(0,2);
const recLab = rec => EMP[lineaDe(rec)] ? `${rec} · ${EMP[lineaDe(rec)]}` : rec;

function mk(id, opt){
  const el = $(id); if(!el) return;
  const c = echarts.init(el, null, {renderer:"canvas"});
  c.setOption(Object.assign({
    textStyle:{fontFamily:"Inter, sans-serif", color:"#cdd7e6"},
    grid:{left:48,right:24,top:30,bottom:36,containLabel:true},
    tooltip:{backgroundColor:"rgba(13,20,36,.96)",borderColor:"rgba(255,255,255,.14)",
      textStyle:{color:"#e8eef8"},confine:true}
  }, opt));
  charts.push(c);
  if(window.ResizeObserver){
    let t; const ro=new ResizeObserver(()=>{clearTimeout(t);t=setTimeout(()=>{try{c.resize();}catch(e){}},50);});
    ro.observe(el);
  }
  return c;
}
const axBase = {axisLine:{lineStyle:{color:"rgba(255,255,255,.16)"}},
  axisLabel:{color:"#93a1ba",fontSize:11},
  splitLine:{lineStyle:{color:"rgba(255,255,255,.05)"}}, axisTick:{show:false}};
addEventListener("resize", ()=>charts.forEach(c=>c.resize()));

/* ---------- KPIs ---------- */
async function kpis(){
  const r = await J("resumen.json");
  $("periodo").textContent = `${mesLab(r.desde.slice(0,7))} – ${mesLab("2026-04")}`;
  $("pulsos-pill").textContent = `${(r.pulsos/1e6).toFixed(0)} M registros`;
  $("generado").textContent = new Date(r.generado).toLocaleString("es-CL");
  const cards = [
    {l:"Registros GPS",ic:"📍",v:(r.pulsos/1e6).toFixed(1)+" M",s:`${fmt(r.dias)} días de operación`},
    {l:"Buses únicos",ic:"🚌",v:fmt(r.buses),s:`${r.unidades} unidades de negocio`},
    {l:"Recorridos",ic:"🛣️",v:fmt(r.recorridos),s:"códigos de servicio"},
    {l:"Empresas operadoras",ic:"🏢",v:"35",s:"perímetro de exclusión"},
    {l:"Velocidad media red",ic:"⚡",v:r.vel_red_kmh+" km/h",s:"buses en movimiento"},
    {l:"Hora más lenta",ic:"🐢",v:String(r.hora_punta).padStart(2,"0")+":00",s:`${r.vel_punta_kmh} km/h · punta tarde`},
    {l:"Comunas cubiertas",ic:"🗺️",v:"12",s:"Gran Concepción"},
    {l:"Flota punta típica",ic:"📈",v:"~1.215",s:"buses activos al mediodía"},
  ];
  $("kpis").innerHTML = cards.map(c=>`
    <div class="kpi"><div class="lab"><span class="ic">${c.ic}</span>${c.l}</div>
    <div class="val">${c.v}</div><div class="sub">${c.s}</div></div>`).join("");
}

/* ---------- Flota por hora ---------- */
async function flotaHora(){
  const d = await J("flota_hora.json");
  const prom=d.map(x=>x.prom), p10=d.map(x=>x.p10), band=d.map(x=>+(x.p90-x.p10).toFixed(1));
  mk("ch-flota-hora",{
    xAxis:Object.assign({type:"category",data:HORAS,boundaryGap:false},axBase),
    yAxis:Object.assign({type:"value",name:"buses"},axBase),
    tooltip:{trigger:"axis",formatter:p=>{const i=p[0].dataIndex;return `${HORAS[i]}<br>Flota media: <b>${fmt1(d[i].prom)}</b><br>Rango p10–p90: ${d[i].p10}–${d[i].p90}`;}},
    series:[
      {name:"p10",type:"line",data:p10,stack:"b",lineStyle:{opacity:0},symbol:"none",areaStyle:{opacity:0},silent:true},
      {name:"banda",type:"line",data:band,stack:"b",lineStyle:{opacity:0},symbol:"none",areaStyle:{color:"rgba(56,189,248,.12)"},silent:true},
      {name:"Flota media",type:"line",data:prom,smooth:true,symbol:"circle",symbolSize:5,
        lineStyle:{width:3,color:COL.acc},itemStyle:{color:COL.acc},
        areaStyle:{color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:"rgba(56,189,248,.28)"},{offset:1,color:"rgba(56,189,248,0)"}])}}
    ]
  });
}
async function velHora(){
  const d = await J("vel_hora.json");
  mk("ch-vel-hora",{
    legend:{data:["En movimiento","Incluye detenciones"],textStyle:{color:"#93a1ba"},top:0,right:0},
    xAxis:Object.assign({type:"category",data:HORAS,boundaryGap:false},axBase),
    yAxis:Object.assign({type:"value",name:"km/h"},axBase),
    tooltip:{trigger:"axis"},
    series:[
      {name:"En movimiento",type:"line",smooth:true,data:d.map(x=>x.vel_movil),symbol:"none",lineStyle:{width:3,color:COL.acc2},itemStyle:{color:COL.acc2}},
      {name:"Incluye detenciones",type:"line",smooth:true,data:d.map(x=>x.vel_media),symbol:"none",lineStyle:{width:2,color:COL.warn,type:"dashed"},itemStyle:{color:COL.warn}}
    ]
  });
}
async function heatMes(){
  const d = await J("flota_mes_hora.json");
  const meses=[...new Set(d.map(x=>x.mes))].sort();
  const data=d.map(x=>[x.hora, meses.indexOf(x.mes), x.prom]);
  const max=Math.max(...d.map(x=>x.prom));
  mk("ch-heat-mes",{
    grid:{left:60,right:24,top:18,bottom:60,containLabel:true},
    tooltip:{position:"top",formatter:p=>`${mesLab(meses[p.data[1]])} · ${HORAS[p.data[0]]}<br>Flota: <b>${fmt1(p.data[2])}</b> buses`},
    xAxis:Object.assign({type:"category",data:HORAS},axBase),
    yAxis:Object.assign({type:"category",data:meses.map(mesLab)},axBase),
    visualMap:{min:0,max:Math.ceil(max/100)*100,calculable:true,orient:"horizontal",left:"center",bottom:6,inRange:{color:HEAT},textStyle:{color:"#93a1ba"},itemWidth:14},
    series:[{type:"heatmap",data,itemStyle:{borderColor:"rgba(10,14,26,.6)",borderWidth:1},emphasis:{itemStyle:{borderColor:"#fff"}}}]
  });
}
async function mensual(){
  const all = await J("mensual.json");
  const d = all.filter(x=>x.pulsos>1e5);
  mk("ch-mensual-pulsos",{
    xAxis:Object.assign({type:"category",data:d.map(x=>mesLab(x.mes))},axBase),
    yAxis:Object.assign({type:"value",name:"M pulsos"},axBase),
    tooltip:{trigger:"axis",formatter:p=>{const x=d[p[0].dataIndex];return `${mesLab(x.mes)}<br>Registros: <b>${(x.pulsos/1e6).toFixed(1)} M</b><br>Días: ${x.dias}`;}},
    series:[{type:"bar",data:d.map(x=>+(x.pulsos/1e6).toFixed(1)),barWidth:"58%",
      itemStyle:{borderRadius:[5,5,0,0],color:new echarts.graphic.LinearGradient(0,0,0,1,[{offset:0,color:COL.acc},{offset:1,color:"rgba(56,189,248,.35)"}])},
      markPoint:{data:[{type:"min",name:"mín"}],itemStyle:{color:COL.warn},label:{color:"#06121f",fontSize:10}}}]
  });
  mk("ch-mensual-flota",{
    legend:{data:["Flota punta","Velocidad"],textStyle:{color:"#93a1ba"},top:0,right:0},
    xAxis:Object.assign({type:"category",data:d.map(x=>mesLab(x.mes))},axBase),
    yAxis:[Object.assign({type:"value",name:"buses"},axBase),Object.assign({type:"value",name:"km/h",position:"right",splitLine:{show:false}},axBase)],
    tooltip:{trigger:"axis"},
    series:[
      {name:"Flota punta",type:"bar",data:d.map(x=>x.flota_punta),barWidth:"46%",itemStyle:{borderRadius:[4,4,0,0],color:"rgba(167,139,250,.55)"}},
      {name:"Velocidad",type:"line",yAxisIndex:1,smooth:true,data:d.map(x=>x.vel_movil),lineStyle:{width:3,color:COL.acc2},itemStyle:{color:COL.acc2},symbolSize:6}
    ]
  });
}
async function heatDow(){
  const d = await J("dow_hora.json");
  const orden=[2,3,4,5,6,7,1], lab=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];
  const data=d.map(x=>[x.hora, orden.indexOf(x.dow), x.prom]).filter(x=>x[1]>=0);
  const max=Math.max(...d.map(x=>x.prom));
  mk("ch-heat-dow",{
    grid:{left:50,right:24,top:18,bottom:60,containLabel:true},
    tooltip:{position:"top",formatter:p=>`${lab[p.data[1]]} · ${HORAS[p.data[0]]}<br>Flota: <b>${fmt1(p.data[2])}</b> buses`},
    xAxis:Object.assign({type:"category",data:HORAS},axBase),
    yAxis:Object.assign({type:"category",data:lab},axBase),
    visualMap:{min:0,max:Math.ceil(max/100)*100,calculable:true,orient:"horizontal",left:"center",bottom:6,inRange:{color:HEAT},textStyle:{color:"#93a1ba"},itemWidth:14},
    series:[{type:"heatmap",data,itemStyle:{borderColor:"rgba(10,14,26,.6)",borderWidth:1},emphasis:{itemStyle:{borderColor:"#fff"}}}]
  });
}

/* ---------- Barras horizontales ---------- */
function hbar(id, cats, vals, color, unit){
  mk(id,{
    grid:{left:8,right:46,top:12,bottom:24,containLabel:true},
    tooltip:{trigger:"axis",axisPointer:{type:"shadow"},formatter:p=>`${p[0].name}<br><b>${fmt1(p[0].value)}</b> ${unit}`},
    xAxis:Object.assign({type:"value"},axBase),
    yAxis:Object.assign({type:"category",data:cats,inverse:true,axisLabel:{fontFamily:"JetBrains Mono",fontSize:10.5,color:"#cdd7e6"}},axBase),
    series:[{type:"bar",data:vals,barWidth:"66%",itemStyle:{borderRadius:[0,5,5,0],color:color},
      label:{show:true,position:"right",color:"#93a1ba",fontSize:10,formatter:o=>fmt1(o.value)}}]
  });
}
async function recorridos(){
  const top = (await J("top_recorridos.json")).slice(0,15);
  hbar("ch-top-rec", top.map(x=>recLab(x.recorrido)), top.map(x=>x.flota_pico), COL.acc, "buses pico");
  const len = await J("lentos_punta.json");
  hbar("ch-lentos", len.map(x=>recLab(x.recorrido)), len.map(x=>x.vel), COL.danger, "km/h");
}
async function regularidad(){
  const d = await J("regularidad.json");
  const best=d.slice(0,12), worst=d.slice(-12).reverse();
  hbar("ch-reg-best", best.map(x=>recLab(x.recorrido)), best.map(x=>x.cv), COL.acc2, "CV");
  hbar("ch-reg-worst", worst.map(x=>recLab(x.recorrido)), worst.map(x=>x.cv), COL.warn, "CV");
}

/* ---------- Empresas operadoras ---------- */
async function empresas(){
  const d = (await J("empresa_stats.json")).slice().sort((a,b)=>b.buses-a.buses).slice(0,18);
  mk("ch-empresas",{
    grid:{left:8,right:50,top:12,bottom:24,containLabel:true},
    tooltip:{trigger:"axis",axisPointer:{type:"shadow"},formatter:p=>{const x=d[p[0].dataIndex];return `<b>${x.fantasia}</b> (L${x.linea})<br>${x.razon_social}<br>Buses: <b>${x.buses}</b> · ${(x.pulsos/1e6).toFixed(1)} M pulsos<br>Vel: ${x.vel} km/h · ${x.comunas}`;}},
    xAxis:Object.assign({type:"value",name:"buses"},axBase),
    yAxis:Object.assign({type:"category",data:d.map(x=>`${x.fantasia} (L${x.linea})`),inverse:true,axisLabel:{fontSize:11,color:"#cdd7e6"}},axBase),
    series:[{type:"bar",data:d.map(x=>x.buses),barWidth:"66%",itemStyle:{borderRadius:[0,5,5,0],color:new echarts.graphic.LinearGradient(1,0,0,0,[{offset:0,color:COL.violet},{offset:1,color:"rgba(167,139,250,.4)"}])},label:{show:true,position:"right",color:"#93a1ba",fontSize:10,formatter:o=>o.value}}]
  });
}

/* ---------- Comunas ---------- */
async function comunas(){
  const d = (await J("comuna_stats.json")).filter(x=>x.pulsos>1e6).sort((a,b)=>b.pulsos-a.pulsos);
  mk("ch-comuna-pulsos",{
    grid:{left:8,right:50,top:12,bottom:24,containLabel:true},
    tooltip:{trigger:"axis",axisPointer:{type:"shadow"},formatter:p=>{const x=d[p[0].dataIndex];return `<b>${x.comuna}</b><br>Registros: ${(x.pulsos/1e6).toFixed(1)} M<br>Buses: ${x.buses} · Recorridos: ${x.recorridos}<br>Vel: ${x.vel_movil} km/h · Detenido: ${x.pct_detenido}%`;}},
    xAxis:Object.assign({type:"value",name:"M pulsos"},axBase),
    yAxis:Object.assign({type:"category",data:d.map(x=>x.comuna),inverse:true,axisLabel:{fontSize:11,color:"#cdd7e6"}},axBase),
    series:[{type:"bar",data:d.map(x=>+(x.pulsos/1e6).toFixed(1)),barWidth:"60%",itemStyle:{borderRadius:[0,5,5,0],color:new echarts.graphic.LinearGradient(1,0,0,0,[{offset:0,color:COL.acc},{offset:1,color:"rgba(56,189,248,.4)"}])},label:{show:true,position:"right",color:"#93a1ba",fontSize:10,formatter:o=>o.value}}]
  });
  mk("ch-comuna-vel",{
    grid:{left:8,right:46,top:12,bottom:24,containLabel:true},
    legend:{data:["Velocidad","% detenido"],textStyle:{color:"#93a1ba"},top:0,right:0},
    tooltip:{trigger:"axis"},
    yAxis:Object.assign({type:"category",data:d.map(x=>x.comuna),inverse:true,axisLabel:{fontSize:11,color:"#cdd7e6"}},axBase),
    xAxis:[Object.assign({type:"value",name:"km/h"},axBase)],
    series:[
      {name:"Velocidad",type:"bar",data:d.map(x=>x.vel_movil),barWidth:"38%",itemStyle:{borderRadius:[0,4,4,0],color:COL.acc2},label:{show:true,position:"right",color:"#93a1ba",fontSize:10}},
      {name:"% detenido",type:"bar",data:d.map(x=>x.pct_detenido),barWidth:"38%",itemStyle:{borderRadius:[0,4,4,0],color:COL.warn},label:{show:true,position:"right",color:"#93a1ba",fontSize:10,formatter:o=>o.value+"%"}}
    ]
  });
}

/* ---------- Corredores (velocidad por tramo con nombre) ---------- */
async function corredores(){
  const d = (await J("corredores.json")).slice(0,16);
  mk("ch-corredores",{
    grid:{left:8,right:46,top:12,bottom:24,containLabel:true},
    tooltip:{trigger:"axis",axisPointer:{type:"shadow"},formatter:p=>{const x=d[p[0].dataIndex];return `<b>${x.corredor}</b> (${x.tipo})<br>Velocidad: <b>${x.vel_kmh}</b> km/h<br>${fmt(x.pulsos)} pulsos`;}},
    xAxis:Object.assign({type:"value",name:"km/h"},axBase),
    yAxis:Object.assign({type:"category",data:d.map(x=>x.corredor),inverse:true,axisLabel:{fontSize:11,color:"#cdd7e6"}},axBase),
    visualMap:{show:false,min:10,max:30,dimension:0,inRange:{color:["#b2182b","#ef8a62","#fddbc7"]}},
    series:[{type:"bar",data:d.map(x=>x.vel_kmh),barWidth:"66%",itemStyle:{borderRadius:[0,5,5,0]},label:{show:true,position:"right",color:"#93a1ba",fontSize:10,formatter:o=>o.value+" km/h"}}]
  });
}

/* ---------- Mapas geográficos ---------- */
async function mapas(){
  await ensureGccp();
  const [roads, gridH, det] = await Promise.all([
    J("roads.geojson"), J("speed_grid_hora.json"), J("detenciones.json")]);
  const roadLines = roads.features.map(f=>({coords:f.geometry.coordinates}));
  const geoBase = {map:"gccp",roam:true,label:{show:false},
    itemStyle:{areaColor:"rgba(56,189,248,.04)",borderColor:"rgba(148,161,186,.32)",borderWidth:1},
    emphasis:{itemStyle:{areaColor:"rgba(56,189,248,.09)"},label:{show:false}}};
  const SPEEDRAMP = ["#d73027","#f46d43","#fdae61","#fee08b","#d9ef8b","#66bd63","#1a9850"]; // lento->rápido
  const roadSeries = {name:"red",type:"lines",coordinateSystem:"geo",data:roadLines,polyline:true,silent:true,
    lineStyle:{color:"rgba(148,161,186,.18)",width:0.6},progressive:2000,large:true,z:1};

  // Mapa de velocidad por la red, con selector de hora
  function hourData(h){
    const a = gridH.vel[h] || [], out = [];
    for(let i=0;i<gridH.cells.length;i++){ const v=a[i]; if(v!=null){ const c=gridH.cells[i]; out.push([c[1],c[0],v]); } }
    return out;
  }
  const vmap = mk("ch-map-vel",{
    geo:geoBase,
    tooltip:{trigger:"item",formatter:p=>p.value?`${p.value[2]} km/h`:""},
    visualMap:{min:8,max:42,calculable:true,left:14,bottom:14,dimension:2,inRange:{color:SPEEDRAMP},
      text:["rápido","lento"],textStyle:{color:"#93a1ba"},itemHeight:120,seriesIndex:1},
    series:[ roadSeries,
      {name:"vel",type:"scatter",coordinateSystem:"geo",data:hourData("8"),
        symbolSize:3.6,large:true,largeThreshold:1000,progressive:4000,z:2,itemStyle:{opacity:0.95}} ]
  });
  const sl=$("vel-hora-slider"), lab=$("vel-hora-lab");
  if(sl && vmap){ sl.addEventListener("input",()=>{ const h=sl.value;
    if(lab) lab.textContent = String(h).padStart(2,"0")+":00";
    vmap.setOption({series:[{},{data:hourData(h)}]}); }); }

  // Mapa de detenciones (con red vial de fondo)
  const maxDet = Math.max(...det.map(x=>x.det));
  mk("ch-map-det",{
    geo:geoBase,
    tooltip:{trigger:"item",formatter:p=>{const x=p.data.r;return `<b>${x.calle||"Terminal"}</b> · ${x.comuna||""}<br>${x.tipo}<br>Detenciones: ${fmt(x.det)}<br>Buses: ${x.buses} · ${x.dias} días`;}},
    series:[ roadSeries,
      {type:"scatter",coordinateSystem:"geo",
        data:det.map(x=>({value:[x.lo,x.la],r:x,
          itemStyle:{color:x.buses>=150?"#fb7185":(x.buses<=80?"#fbbf24":"#f97316")}})),
        symbolSize:function(v,p){return 8+26*Math.sqrt(p.data.r.det/maxDet);},
        itemStyle:{opacity:.85,borderColor:"rgba(0,0,0,.3)"},z:4} ]
  });
}

/* ---------- EN VIVO ---------- */
const LIVE_URL = "https://storage.googleapis.com/gccp-transporte-live/live.json";
let liveSnap = null;
async function ensureGccp(){
  if(!window.__gccp){ const g = await J("comunas_gccp.geojson"); echarts.registerMap("gccp", g); window.__gccp = true; }
}
function ageTxt(iso){
  const s = Math.max(0, Math.round((Date.now() - new Date(iso))/1000));
  return s < 90 ? `hace ${s} s` : `hace ${Math.round(s/60)} min`;
}
async function live(){
  await ensureGccp();
  const el = $("ch-live-map"); if(!el) return;
  const roads = await J("roads.geojson");
  const roadLines = roads.features.map(f=>({coords:f.geometry.coordinates}));
  const lc = echarts.init(el); charts.push(lc);
  if(window.ResizeObserver){ new ResizeObserver(()=>{try{lc.resize();}catch(e){}}).observe(el); }
  lc.setOption({
    geo:{map:"gccp",roam:true,label:{show:false},
      itemStyle:{areaColor:"rgba(56,189,248,.04)",borderColor:"rgba(148,161,186,.30)",borderWidth:1},
      emphasis:{label:{show:false},itemStyle:{areaColor:"rgba(56,189,248,.08)"}}},
    tooltip:{trigger:"item",backgroundColor:"rgba(13,20,36,.96)",borderColor:"rgba(255,255,255,.14)",textStyle:{color:"#e8eef8"},
      formatter:p=>{const d=p.data; if(!d||d.ln===undefined)return "";
        return `Línea ${d.ln||"?"}${EMP[d.ln]?" · "+EMP[d.ln]:""}<br>${d.mv?"En movimiento":"Detenido"} · ${d.sp} km/h${d.mv?" · rumbo "+d.br+"°":""}`;}},
    series:[
      {name:"red",type:"lines",coordinateSystem:"geo",data:roadLines,polyline:true,silent:true,
        lineStyle:{color:"rgba(148,161,186,.22)",width:0.6},progressive:2000,large:true,z:1},
      {name:"dir",type:"lines",coordinateSystem:"geo",data:[],lineStyle:{color:"#34d399",width:1.4,opacity:0.9},
        symbol:["none","arrow"],symbolSize:6,z:3,silent:true},
      {name:"bus",type:"scatter",coordinateSystem:"geo",data:[],symbolSize:4,large:true,largeThreshold:600,z:4}
    ]
  });
  async function refresh(){
    try{
      const d = await (await fetch(LIVE_URL+"?t="+Date.now(),{cache:"no-store"})).json();
      liveSnap = d.snapshot_utc;
      const dots=[], dirs=[], D=0.0009;
      for(const b of d.buses){
        const lat=b[0],lon=b[1],ln=b[2],sp=b[3],mv=b[4],br=b[5]||0;
        dots.push({value:[lon,lat],ln,sp,mv,br,itemStyle:{color:mv?"#34d399":"#7c8aa0",opacity:mv?0.95:0.5}});
        if(mv && sp>0){ const a=br*Math.PI/180;
          dirs.push({coords:[[lon,lat],[lon+D*Math.sin(a)/Math.cos(lat*Math.PI/180), lat+D*Math.cos(a)]]}); }
      }
      lc.setOption({series:[{},{data:dirs},{data:dots}]});
      const cards = [
        ["Buses circulando", fmt(d.total), "reportando posición"],
        ["En servicio", fmt(d.en_servicio), "con recorrido asignado"],
        ["En movimiento", fmt(d.moviendose), "velocidad > 0"],
        ["Velocidad media", d.vel_red+" km/h", "buses en movimiento"],
      ];
      $("live-kpis").innerHTML = cards.map(c=>`<div class="kpi"><div class="lab">${c[0]}</div><div class="val">${c[1]}</div><div class="sub">${c[2]}</div></div>`).join("");
    }catch(e){ console.error("live", e); const a=$("live-age"); if(a) a.textContent="(sin conexión en vivo)"; }
  }
  await refresh();
  setInterval(refresh, 60000);
  setInterval(()=>{ const a=$("live-age"); if(a && liveSnap) a.textContent = "actualizado "+ageTxt(liveSnap); }, 5000);
  const a=$("live-age"); if(a && liveSnap) a.textContent = "actualizado "+ageTxt(liveSnap);
}

/* ---------- run ---------- */
(async function(){
  try{
    const emp = await J("empresas.json");
    emp.forEach(e=>EMP[e.linea]=e.fantasia);
    await kpis();
    await Promise.allSettled([live(),flotaHora(),velHora(),heatMes(),mensual(),heatDow(),
      recorridos(),regularidad(),empresas(),comunas(),corredores(),mapas()]);
    // asegurar dimensiones correctas tras el layout
    const fix=()=>charts.forEach(c=>{try{c.resize();}catch(e){}});
    requestAnimationFrame(fix); setTimeout(fix,300); setTimeout(fix,900);
  }catch(e){ console.error(e); const k=$("kpis"); if(k) k.innerHTML='<div class="loading">No se pudieron cargar los datos.</div>'; }
})();
