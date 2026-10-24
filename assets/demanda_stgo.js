/* Pestaña de DEMANDA PROPIA de Santiago (fase 1 + 1b, 23/24-oct-2026). Se carga sólo si CITY.demandaStgo.
   Datos: data/stgo_sistema.json · stgo_zonas.json · stgo_od.json · stgo_extra.json · stgo_zonas_extra.json ·
   zonas777.geojson · demanda_metro.json y el GeoJSON comunal del tablero (CITY.comunasGeojson). Todo agregado.
   Usa los globales del shell: J (fetch de data/), L (Leaflet), echarts, kpiCard y los tokens CSS del tema.
   Revisado el 23-oct por un panel (diseño + transporte): feriados fuera del día hábil, «1 etapa» = sin transbordo
   VALIDADO, destino ESTIMADO, % enmascarado en zonas chicas, rótulos de fuente/período del shell, móvil. */
(function(){
  const $ = id => document.getElementById(id);
  const tok = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const fmt = n => n==null || isNaN(n) ? "—" : Math.round(n).toLocaleString("es-CL");
  const fmt1 = n => n==null || isNaN(n) ? "—" : n.toLocaleString("es-CL",{maximumFractionDigits:1});
  const pct = n => n==null || isNaN(n) ? "—" : n.toLocaleString("es-CL",{maximumFractionDigits:1})+" %";
  const pct1 = n => n==null || isNaN(n) ? "—" : n.toLocaleString("es-CL",{minimumFractionDigits:1,maximumFractionDigits:1})+" %";
  const norm = s => String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toUpperCase().trim();
  const _MIN = new Set(["de","del","la","las","los","y","el","en"]);
  const _TILDE = {"Estacion":"Estación","Egana":"Egaña","Nuble":"Ñuble","Nunoa":"Ñuñoa","Irarrazaval":"Irarrázaval","Simon":"Simón",
    "Bolivar":"Bolívar","Principe":"Príncipe","Union":"Unión","Republica":"República","Heroes":"Héroes","Lucia":"Lucía","Ines":"Inés",
    "Suarez":"Suárez","Espana":"España","Bio":"Bío","Maipu":"Maipú","Joaquin":"Joaquín","Ramon":"Ramón","Conchali":"Conchalí",
    "Penalolen":"Peñalolén","Rio":"Río","Vicuna":"Vicuña","Mackenna":"Mackenna","Tobalaba":"Tobalaba","Plaza":"Plaza","Jose":"José",
    "Maria":"María","Hospital":"Hospital","Sotero":"Sótero","Rodriguez":"Rodríguez","Gonzalez":"González","Matias":"Matías",
    "Concepcion":"Concepción","Asuncion":"Asunción","Belen":"Belén","Patricio":"Patricio","Martin":"Martín","Agustin":"Agustín",
    "Cumming":"Cumming","Fernandez":"Fernández","Alcantara":"Alcántara","Huelen":"Huelén","Neptuno":"Neptuno","Monumento":"Monumento"};
  // mayúscula inicial por palabra; el conector (de, la, los…) va en minúscula sólo si lo precede una PALABRA
  // («Universidad de Chile»), no tras «(M)» ni un guion («(M) Los Libertadores»)
  const tit = x => { const ws = String(x||"").toLowerCase().split(/(\s+)/); let prev = "";
    return ws.map(w => { if(!w.trim()) return w; const lead = (w.match(/^[(/-]+/)||[""])[0], body = w.slice(lead.length);
      const conn = !lead && _MIN.has(body) && /[a-záéíóúñü]$/.test(prev);
      const c = conn ? body : body.charAt(0).toUpperCase()+body.slice(1); prev = w; return lead + (_TILDE[c]||c); }).join(""); };
  const cap1 = x => { const v = String(x||"").toLowerCase(); return v.charAt(0).toUpperCase() + v.slice(1); };
  const _q = new URLSearchParams(location.search);
  const S = {sub:(_q.get("ds")||"sistema"), metrica:"dens_km2", nivel:"zonas", metro:true, zonaSel:null, odModo:"pct",
             linea:"TODAS", est:null, xCorr:"dist", franja:"dia"};
  let D = {}, charts = {}, mapa = null, capaZ = null, capaM = null, capaOD = null, geoZ = null, geoC = null, cenZ = null;
  let mapaM = null, capaE = null, mapaT = null, capaT = null, mapaO = null;
  const MIN_PCT_DIA = 500, MIN_PCT_AM = 100;   // zonas con menos viajes: los % se enmascaran (ruido de n chico)
  const minPct = () => S.franja==="am" ? MIN_PCT_AM : MIN_PCT_DIA;
  const BASE_AM = new Set(["dens_km2","viajes_dia","viajes_hab","pct_1","pct_3mas","pct_bus","pct_metro","pct_bus_metro"]);
  const CENTRO = [-33.4378, -70.6504];   // Plaza de Armas (km 0 de Santiago)

  // Métricas del mapa: [clave, rótulo, tipo (n|p|d|h), grupo, sólo comunas?]
  const METRICAS = [
    ["dens_km2","Viajes que empiezan por km²","n","Volumen"],
    ["viajes_dia","Viajes que empiezan (por día)","n","Volumen"],
    ["viajes_hab","Viajes que empiezan por habitante","d","Volumen",true],
    ["pct_1","% de viajes de 1 etapa (sin transbordo validado)","p","Etapas"],
    ["pct_3mas","% de viajes de 3 o más etapas","p","Etapas"],
    ["pct_bus","% solo bus","p","Modo"],
    ["pct_metro","% solo Metro","p","Modo"],
    ["pct_bus_metro","% bus + Metro","p","Modo"],
    ["km_medio","Largo medio del viaje (km en línea recta)","d","Viaje"],
    ["min_medio","Duración media del viaje (min)","d","Viaje"],
    ["pct_punta_am","% de los viajes del día que empiezan 06:00–08:59","p","Horario"],
    ["hora_punta","Hora en que más viajes empiezan","h","Horario"],
    ["cv_laboral","Variabilidad entre días laborales (CV %)","p","Variabilidad"],
    ["razon_sab","Sábado como % del día laboral","p","Variabilidad"],
    ["razon_dom","Domingo como % del día laboral","p","Variabilidad"],
    ["pct_estudiante","% de viajes con tarjeta de estudiante","p","Usuarios"],
    ["pct_mayor","% de viajes con tarjeta de adulto mayor","p","Usuarios"],
  ];
  const SUBS = [["sistema","Sistema"],["mapa","Mapa de viajes"],["od","Origen–destino"],["metro","Metro"],
                ["experiencia","Experiencia del viaje"],["evolucion","Evolución"]];
  // colores semánticos fijos (independientes del tema) para el tipo de día y la rampa secuencial
  const COL_DT = {L:"#2fb4ad", S:"#f5b83d", D:"#9b8cff", F:"#e879f9", X:"#ff5c5c"};
  const RAMPA = ["#c7e9e4","#7fcdbb","#41b6c4","#1d91c0","#225ea8"];   // YlGnBu, 5 clases
  const ALIAS_COM = {"HUECURABA":"Huechuraba", "P.A. CERDA":"Pedro Aguirre Cerda", "PAC":"Pedro Aguirre Cerda"};
  const comNom = c => { const k = norm(c); if(ALIAS_COM[k]) return ALIAS_COM[k];
    const hit = D.zon && Object.keys(D.zon.comunas).find(x=>norm(x)===k); return tit(hit||c); };
  const perHora = p => { const h = D.ex && D.ex.periodos_horario && D.ex.periodos_horario[p]; return h ? ` (${h})` : ""; };
  const perLab = p => cap1(String(p||"").replace(/^\d+\s*-\s*/,"").replace(/MANANA/g,"MAÑANA").replace(/TRANSICION/g,"TRANSICIÓN")
    .replace(/MEDIODIA/g,"MEDIODÍA").replace(/TARDE1/,"TARDE 1").replace(/TARDE2/,"TARDE 2")) + perHora(p);

  function esqueleto(){
    const v = $("demanda-stgo-view"); if(!v || v.dataset.ok) return; v.dataset.ok = 1;
    v.innerHTML = `
      <div id="ds-nota" class="kpi-note" style="margin-top:10px"></div>
      <div id="ds-subs" role="tablist" aria-label="Vistas de la demanda" style="display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 14px"></div>
      <div id="ds-ayuda" class="ds-ayuda"></div>
      <div id="ds-kpis" class="ds-kg" style="margin-bottom:16px"></div>
      <div id="ds-cuerpo"></div>`;
    $("ds-subs").innerHTML = SUBS.map(([k,t])=>`<button data-s="${k}" role="tab" aria-selected="false">${t}</button>`).join("");
    $("ds-subs").onclick = e => { const b=e.target.closest("button"); if(!b) return; S.sub=b.dataset.s; dibuja(); };
  }
  // metodo: texto largo de definiciones y fuentes, plegado bajo el gráfico («Método y fuente») para no tapar el título
  function widget(id, titulo, sub, alto, extra, metodo){
    return `<section class="widget" style="margin-bottom:12px"><div class="widget-h" style="flex-wrap:wrap;row-gap:6px">
      <div class="min-w-0" style="flex:1 1 auto"><h3>${titulo}</h3><span class="sub">${sub||""}</span></div>${extra||""}</div>
      <div class="widget-b !p-2.5"><div id="${id}" class="ds-ch" style="height:${alto}px;width:100%"></div>
      ${metodo ? `<details class="ds-metodo"><summary>Método y fuente</summary><div>${metodo}</div></details>` : ""}</div></section>`;
  }
  function kpi(t, v, s){ return typeof kpiCard==="function" ? kpiCard(t, v, s||"")
    : `<div class="kpi"><div class="lab">${t}</div><div class="val">${v}</div><div class="sub">${s||""}</div></div>`; }
  function ayuda(txt){ $("ds-ayuda").innerHTML = txt ? `<b>¿Qué muestra esta vista?</b> ${txt}` : ""; }
  if(!document.getElementById("ds-css")){ const st=document.createElement("style"); st.id="ds-css"; st.textContent=`
    body.demstgo #sidebar,body.demstgo .comuna-bar{display:none!important}
    #ds-kpis .val{font-size:clamp(20px,2.1vw,30px);white-space:nowrap}
    .ds-kg{display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(140px,1fr))}
    .ds-g2,.ds-g3{display:grid;gap:12px;grid-template-columns:minmax(0,1fr)}
    @media(min-width:1100px){.ds-g2{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.ds-g3{grid-template-columns:minmax(0,2fr) minmax(0,1fr)}}
    #demanda-stgo-view{max-width:100%;overflow-x:hidden}
    #ds-subs button{padding:5px 12px;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--text-mid);cursor:pointer;font-size:12.5px}
    #ds-subs button.on,.ds-seg button.on{background:var(--live);color:#04211d;border-color:var(--live)}
    [data-theme="light"] #ds-subs button.on,[data-theme="light"] .ds-seg button.on{color:#ffffff}
    .ds-seg{display:inline-flex;gap:4px;flex-wrap:wrap}
    .ds-seg button{padding:3px 10px;border:1px solid var(--line);border-radius:6px;background:transparent;color:var(--text-mid);cursor:pointer;font-size:12px}
    .ds-ayuda{font-size:12.5px;color:var(--text-mid);line-height:1.5;margin:-4px 0 12px;max-width:110ch}
    .ds-ayuda b{color:var(--tx)}
    .ds-sel{background:var(--surface-2,#16223a);color:var(--tx);border:1px solid var(--line);border-radius:6px;padding:4px 6px;max-width:100%}
    .ds-tab{width:100%;border-collapse:collapse;font-size:12.5px}
    .ds-tab td,.ds-tab th{padding:4px 6px;border-bottom:1px solid var(--line);text-align:right}
    .ds-tab td:first-child,.ds-tab th:first-child{text-align:left}
    .ds-tab th{color:var(--text-mid);font-weight:600}
    .ds-metodo{margin:8px 4px 2px;font-size:11.5px;color:var(--text-mid);line-height:1.5}
    .ds-metodo summary{cursor:pointer;color:var(--tx);font-size:12px}
    .ds-metodo div{margin-top:6px;max-width:110ch}`;
    document.head.appendChild(st); }
  function th(){ return {tx:tok("--tx")||"#ddd", mid:tok("--text-mid")||"#999", line:tok("--line")||"#333",
                         live:tok("--live")||"#34E1C4", warn:tok("--warn")||"#F5B83D", alert:tok("--alert")||"#FF5C5C"}; }
  const claro = () => document.documentElement.dataset.theme === "light";
  function chart(id){ if(charts[id]) charts[id].dispose(); charts[id]=echarts.init($(id)); return charts[id]; }
  // ejes con números es-CL (antes salían «4,000,000» junto a KPI «3.484.758»)
  function ejes(t, f){ const al = f===false ? {color:t.mid} : {color:t.mid, formatter:f||(v=>typeof v==="number"?fmt(v):v)};
    return {axisLine:{lineStyle:{color:t.line}}, axisLabel:al,
                               splitLine:{lineStyle:{color:t.line,opacity:.4}}}; }
  const G = (o) => Object.assign({left:10,right:16,top:16,bottom:10,containLabel:true}, o||{});
  function basemap(m){ L.tileLayer(`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_${claro()?"Light":"Dark"}_Gray_Base/MapServer/tile/{z}/{y}/{x}`,
      {maxNativeZoom:16, maxZoom:18, attribution:"Esri"}).addTo(m); }
  const altoMapa = () => Math.max(360, Math.min(560, Math.round(innerWidth*0.9)));

  // rótulos del shell (encabezado «GPS · ventana» y pie «registros GPS») mientras la pestaña está activa
  let _shellOrig = null;
  function rotulosShell(on){
    const hv = $("hdr-ventana"), hs = hv && hv.parentElement, fd = $("vfoot-data"), fx = document.querySelector(".vfoot-dim"), ts = document.querySelector(".tb-sub");
    if(on){
      if(!_shellOrig) _shellOrig = {hs: hs && hs.innerHTML, fd: fd && fd.textContent, fx: fx && fx.textContent, ts: ts && ts.textContent};
      if(ts) ts.textContent = "Centro de mando · demanda bip!";
      const p = D.sis && D.sis.periodo, r = p ? `${p.desde} a ${p.hasta}` : "—";
      if(hs) hs.innerHTML = `bip! · ${r}`;
      if(fd) fd.textContent = `Demanda: ${r} · ${(D.sis&&D.sis.dias.L)||"—"} días laborales con dato`;
      if(fx) fx.textContent = "viajes registrados con tarjeta bip! (etapas ADATRAP, DTPM)";
    } else if(_shellOrig){
      if(hs && _shellOrig.hs!=null) hs.innerHTML = _shellOrig.hs;
      if(fd && _shellOrig.fd!=null) fd.textContent = _shellOrig.fd;
      if(fx && _shellOrig.fx!=null) fx.textContent = _shellOrig.fx;
      if(ts && _shellOrig.ts!=null) ts.textContent = _shellOrig.ts;
      _shellOrig = null;
    }
  }
  new MutationObserver(() => rotulosShell(document.body.classList.contains("demstgo")))
    .observe(document.body, {attributes:true, attributeFilter:["class"]});

  // ---------------- utilidades estadísticas ----------------
  const q_ = (a, p) => { const s=a.slice().sort((x,y)=>x-y), i=(s.length-1)*p, lo=Math.floor(i), hi=Math.ceil(i); return s[lo]+(s[hi]-s[lo])*(i-lo); };
  function pearson(xs, ys){ const n=xs.length; if(n<3) return null; const mx=xs.reduce((a,b)=>a+b)/n, my=ys.reduce((a,b)=>a+b)/n;
    let sxy=0,sxx=0,syy=0; for(let i=0;i<n;i++){ const dx=xs[i]-mx, dy=ys[i]-my; sxy+=dx*dy; sxx+=dx*dx; syy+=dy*dy; }
    return sxy/Math.sqrt(sxx*syy); }
  const distKm = (a, b) => { const R=6371, r=Math.PI/180, dl=(b[0]-a[0])*r, dn=(b[1]-a[1])*r;
    const h=Math.sin(dl/2)**2+Math.cos(a[0]*r)*Math.cos(b[0]*r)*Math.sin(dn/2)**2; return 2*R*Math.asin(Math.sqrt(h)); };
  // punto INTERIOR de un polígono (para las líneas de deseo: el centro del rectángulo cae fuera en zonas cóncavas)
  function enPoli(pt, ring){ let c=false; for(let i=0,j=ring.length-1;i<ring.length;j=i++){ const [xi,yi]=ring[i],[xj,yj]=ring[j];
      if(((yi>pt[1])!==(yj>pt[1])) && (pt[0] < (xj-xi)*(pt[1]-yi)/(yj-yi)+xi)) c=!c; } return c; }
  function interior(f){
    const g = f.geometry, polys = g.type==="Polygon" ? [g.coordinates] : g.coordinates;
    const ring = polys.map(p=>p[0]).sort((a,b)=>b.length-a.length)[0];
    const cx = ring.reduce((a,p)=>a+p[0],0)/ring.length, cy = ring.reduce((a,p)=>a+p[1],0)/ring.length;
    if(enPoli([cx,cy], ring)) return [cy, cx];
    const xs = ring.map(p=>p[0]), ys = ring.map(p=>p[1]), x0=Math.min(...xs), x1=Math.max(...xs), y0=Math.min(...ys), y1=Math.max(...ys);
    let best=null, bd=1e9;
    for(let i=1;i<12;i++) for(let j=1;j<12;j++){ const p=[x0+(x1-x0)*i/12, y0+(y1-y0)*j/12];
      if(enPoli(p, ring)){ const d=(p[0]-cx)**2+(p[1]-cy)**2; if(d<bd){ bd=d; best=p; } } }
    return best ? [best[1], best[0]] : [cy, cx];
  }
  function centros(){ if(cenZ) return cenZ; cenZ = {}; geoZ.features.forEach(f => { cenZ[String(f.properties.z)] = interior(f); }); return cenZ; }
  // franja: día completo (con los indicadores extra) o punta mañana (sólo los indicadores base de esa ventana)
  const zonaDatos = () => { const am = S.franja==="am" && D.zon.zonas_am, o = {};
    Object.entries(am ? D.zon.zonas_am : D.zon.zonas).forEach(([k,v])=>{ o[k] = am ? Object.assign({}, v) : Object.assign({}, v, (D.zx.zonas||{})[k]||{}); }); return o; };
  const comunaDatos = () => { const am = S.franja==="am" && D.zon.comunas_am, o = {}, xn = {};
    Object.entries(D.zx.comunas||{}).forEach(([k,v])=>{ xn[norm(k)] = v; });
    Object.entries(am ? D.zon.comunas_am : D.zon.comunas).forEach(([k,v])=>{ o[k] = am ? Object.assign({}, v) : Object.assign({}, v, xn[norm(k)]||{}); }); return o; };

  // ---------------- 1. SISTEMA ----------------
  function vSistema(){
    const s = D.sis, t = th(), e = s.etapas_por_viaje_L||{};
    ayuda(`Cuántos viajes se hacen en transporte público y cómo varían entre días. Un <b>viaje</b> son las etapas
      (validaciones) que la DTPM encadena de una misma tarjeta; una <b>etapa</b> es cada vez que se valida. Las
      combinaciones dentro del Metro no generan etapa.`);
    $("ds-kpis").innerHTML =
      kpi("Viajes · día laboral", fmt(s.viajes_dia.L), `promedio de ${s.dias.L} días`) +
      kpi("Viajes · sábado", fmt(s.viajes_dia.S), `${Math.round(100*s.viajes_dia.S/s.viajes_dia.L)} % del laboral`) +
      kpi("Viajes · domingo y festivo", fmt(s.viajes_dia.D), `${Math.round(100*s.viajes_dia.D/s.viajes_dia.L)} % del laboral`) +
      kpi("Viajes de 1 etapa", pct1(e["1"]&&e["1"].pct), "sin transbordo validado") +
      kpi("Viajes de 3+ etapas", pct1(e["3+"]&&e["3+"].pct), "dos o más transbordos validados") +
      kpi("Duración media", fmt1(s.duracion_media_min_L)+" min", `de los viajes con destino estimado (${pct(s.con_destino_pct_L)})`);
    const hayHora = D.ex && D.ex.hora_inicio;
    $("ds-cuerpo").innerHTML =
      `<div class="ds-g2">
        ${widget("ds-dow","Viajes según el día de la semana","cada caja = días de ese tipo (mediana, cuartiles y extremos) · los festivos van aparte",280)}
        ${widget("ds-modos","Cómo se viaja: combinación de modos","% de los viajes de día laboral · zona paga = bus",280)}
       </div>
       ${widget("ds-serie","Viajes día a día","laboral, sábado y domingo por separado · ◆ festivo · ✕ día con pérdida de datos de la fuente (fuera de los promedios)",320)}
       <div class="ds-g2">
        ${hayHora ? widget("ds-hora","A qué hora empiezan los viajes","viajes por hora de inicio, promedio por día",280)
                  : widget("ds-per","Viajes por período (día laboral)","período tarifario TS de la DTPM en que empieza el viaje",280)}
        ${widget("ds-eta","Etapas por viaje (día laboral)",s._nota_etapas||"",280)}
       </div>
       ${D.ex && D.ex.hora_dow ? widget("ds-hdow","Cuándo se viaja: hora × día de la semana","viajes que empiezan en cada hora, promedio por día · los festivos van en su propia fila",300) : ""}`;
    // cajas por día de la semana (variabilidad), desde la serie diaria
    const grupos = [["lun",1,"L"],["mar",2,"L"],["mié",3,"L"],["jue",4,"L"],["vie",5,"L"],["sáb",6,"S"],["dom",7,"D"],["festivo",8,"F"]];
    const val = grupos.map(([,d,tt]) => s.serie_diaria.filter(x => !x.excluido && (tt==="F" ? x.festivo :
      (!x.festivo && new Date(x.fecha+"T12:00:00").getDay() === d%7 && x.dia_tipo === (tt==="F"?"D":tt)))).map(x=>x.viajes));
    const box = val.map(v => v.length ? [Math.min(...v), q_(v,.25), q_(v,.5), q_(v,.75), Math.max(...v)] : [null,null,null,null,null]);
    chart("ds-dow").setOption({tooltip:{trigger:"item", formatter:p => { const v = p.value.slice(-5);
        return `${grupos[p.dataIndex][0]} · ${val[p.dataIndex].length} días<br>mediana ${fmt(v[2])}<br>cuartiles ${fmt(v[1])} – ${fmt(v[3])}<br>mín ${fmt(v[0])} · máx ${fmt(v[4])}`; }},
      grid:G(), xAxis:{type:"category", data:grupos.map(g=>g[0]), ...ejes(t)}, yAxis:{type:"value", min:0, ...ejes(t)},
      series:[{type:"boxplot", data:box.map((b,i)=>({value:b, itemStyle:{borderColor:COL_DT[grupos[i][2]], color:COL_DT[grupos[i][2]]+"40", borderWidth:1.5}}))}]});
    const m = s.modos_L.slice(0,7), lab = x => x.replace(/\+/g," + ").replace("METROTREN","Metrotren").replace("METRO","Metro").replace("BUS","Bus");
    chart("ds-modos").setOption({tooltip:{trigger:"axis",axisPointer:{type:"shadow"},valueFormatter:fmt}, grid:G({left:24,right:52}),
      xAxis:{type:"value", ...ejes(t)}, yAxis:{type:"category", inverse:true, data:m.map(x=>lab(x.modos)), ...ejes(t)},
      series:[{type:"bar", data:m.map(x=>x.viajes), itemStyle:{color:t.live}, label:{show:true,position:"right",color:t.mid,formatter:p=>fmt1(m[p.dataIndex].pct)+" %"}}]});
    // serie diaria: un hueco (null) corta la línea en los días excluidos; festivos con su propio símbolo
    const ser = s.serie_diaria, tipos = [["L","Laboral"],["S","Sábado"],["D","Domingo y festivo"]];
    chart("ds-serie").setOption({tooltip:{trigger:"axis", valueFormatter:v=>v==null?"—":fmt(v)}, legend:{top:0, textStyle:{color:t.mid}},
      grid:G({top:34,bottom:46}), xAxis:{type:"time", ...ejes(t, false)}, yAxis:{type:"value", min:0, ...ejes(t)},
      dataZoom:[{type:"inside"},{type:"slider",height:16,bottom:6}],
      series:tipos.map(([k,n])=>({name:n, type:"line", showSymbol:false, connectNulls:false, lineStyle:{color:COL_DT[k],width:1.6}, itemStyle:{color:COL_DT[k]},
                 data:ser.filter(d=>d.dia_tipo===k).map(d=>[d.fecha, d.excluido?null:d.viajes])}))
        .concat([{name:"Festivo", type:"scatter", symbol:"diamond", symbolSize:9, itemStyle:{color:COL_DT.F},
                  data:ser.filter(d=>d.festivo && !d.excluido).map(d=>[d.fecha,d.viajes])},
                 {name:"Pérdida de datos (excluido)", type:"scatter", symbol:"path://M2,2L8,8M8,2L2,8", symbolSize:9,
                  itemStyle:{color:COL_DT.X, borderColor:COL_DT.X, borderWidth:2}, data:ser.filter(d=>d.excluido).map(d=>[d.fecha,d.viajes])}])});
    if(hayHora){
      const h = D.ex.hora_inicio, hs = Array.from({length:24},(_,i)=>String(i).padStart(2,"0")+"h");
      chart("ds-hora").setOption({tooltip:{trigger:"axis",valueFormatter:fmt}, legend:{top:0,textStyle:{color:t.mid}}, grid:G({top:30}),
        xAxis:{type:"category", data:hs, ...ejes(t)}, yAxis:{type:"value", ...ejes(t)},
        series:[["L","Laboral"],["S","Sábado"],["D","Domingo y festivo"]].filter(([k])=>h[k]).map(([k,n])=>({name:n, type:"bar",
          data:h[k], itemStyle:{color:COL_DT[k]}, barGap:"0%"}))});
    } else {
      const per = (s.periodos_ts.L||[]);
      chart("ds-per").setOption({tooltip:{trigger:"axis",axisPointer:{type:"shadow"},valueFormatter:fmt}, grid:G({right:30}),
        xAxis:{type:"value", ...ejes(t)}, yAxis:{type:"category", inverse:true, data:per.map(p=>perLab(p[0])), ...ejes(t)},
        series:[{type:"bar", data:per.map(p=>p[1]), itemStyle:{color:t.live}}]});
    }
    if(D.ex && D.ex.hora_dow){
      const hd = D.ex.hora_dow, filas = [["1","lun"],["2","mar"],["3","mié"],["4","jue"],["5","vie"],["6","sáb"],["7","dom"],["8","festivo"]].filter(([k])=>hd[k]);
      const dat = []; filas.forEach(([k],i)=>hd[k].forEach((v,h)=>dat.push([h,i,v])));
      chart("ds-hdow").setOption({tooltip:{formatter:p=>`${filas[p.value[1]][1]} ${String(p.value[0]).padStart(2,"0")}:00<br>${fmt(p.value[2])} viajes`},
        grid:G({bottom:50}), xAxis:{type:"category", data:Array.from({length:24},(_,h)=>String(h).padStart(2,"0")+"h"), ...ejes(t), splitArea:{show:false}},
        yAxis:{type:"category", data:filas.map(f=>f[1]), inverse:true, ...ejes(t)},
        visualMap:{min:0, max:Math.max(...dat.map(d=>d[2])), calculable:true, orient:"horizontal", left:"center", bottom:0, itemHeight:120,
                   textStyle:{color:t.mid}, inRange:{color:RAMPA}, formatter:v=>fmt(v)},
        series:[{type:"heatmap", data:dat}]});
    }
    const ks = Object.keys(e);
    chart("ds-eta").setOption({tooltip:{trigger:"axis",axisPointer:{type:"shadow"},valueFormatter:fmt}, grid:G({right:60}),
      xAxis:{type:"value", ...ejes(t)}, yAxis:{type:"category", inverse:true, data:ks.map(k=>k+(k==="1"?" etapa":" etapas")), ...ejes(t)},
      series:[{type:"bar", data:ks.map((k,i)=>({value:e[k].viajes, itemStyle:{color:[t.live,t.warn,t.alert][i]}})),
               label:{show:true,position:"right",color:t.mid,formatter:p=>fmt1(e[ks[p.dataIndex]].pct)+" %"}}]});
  }

  // ---------------- 2. MAPA DE VIAJES ----------------
  function vMapa(){
    S.zonaSel = null;
    ayuda(`Dónde <b>se sube al sistema</b>: cada viaje se asigna a la zona (777 de la DTPM) o comuna donde valida su primera
      etapa. En un día completo eso incluye los regresos: el centro y los polos de empleo aparecen altos porque ahí
      empiezan los viajes de vuelta, no porque vivan ahí. Los porcentajes se ocultan en zonas con menos de ${fmt(MIN_PCT_DIA)}
      viajes por día (${fmt(MIN_PCT_AM)} en punta mañana). <b>Punta mañana</b> deja sólo los viajes que empiezan en esa
      ventana, cuando el origen se acerca al hogar. Clic en una zona para ver sus destinos principales.`);
    const grupos = [...new Set(METRICAS.map(m=>m[3]))];
    const sel = grupos.map(g=>`<optgroup label="${g}">${METRICAS.filter(m=>m[3]===g).map(([k,tt,,,c])=>`<option value="${k}" ${k===S.metrica?"selected":""}>${tt}${c?" (sólo comunas)":""}</option>`).join("")}</optgroup>`).join("");
    $("ds-cuerpo").innerHTML = `<div class="ds-g3">
      <section class="widget"><div class="widget-h" style="flex-wrap:wrap;row-gap:8px">
        <div class="min-w-0" style="flex:1 1 auto"><h3>Dónde se sube al sistema</h3><span class="sub">zona o comuna donde empieza el viaje · día laboral promedio</span></div>
        <div style="flex:1 1 100%;display:flex;flex-wrap:wrap;gap:8px;align-items:center">
          <label for="ds-met" style="font-size:12px;color:var(--text-mid)">Indicador</label>
          <select id="ds-met" class="ds-sel">${sel}</select>
          <div class="ds-seg" id="ds-niv" role="group" aria-label="Unidad territorial"><button data-n="zonas">Zonas 777</button><button data-n="comunas">Comunas</button></div>
          <div class="ds-seg" id="ds-fra" role="group" aria-label="Franja horaria"${D.zon.zonas_am?"":" hidden"}><button data-f="dia" title="todos los viajes del día laboral">Todo el día</button><button data-f="am" title="período TS punta mañana: el origen se acerca al hogar">Punta mañana</button></div>
          <label style="font-size:12px;color:var(--text-mid)"><input type="checkbox" id="ds-chkm" ${S.metro?"checked":""}> estaciones de Metro</label>
        </div></div>
        <div class="widget-b !p-2.5"><div id="ds-map" style="height:${altoMapa()}px;width:100%"></div></div>
        <div id="ds-leg" style="padding:8px 10px;font-size:12px;color:var(--text-mid);line-height:1.8"></div></section>
      <section class="widget"><div class="widget-h"><div class="min-w-0"><h3 id="ds-pan-t">Ranking</h3><span class="sub" id="ds-pan-s"></span></div></div>
        <div id="ds-pan" style="padding:6px 10px;font-size:13px;color:var(--tx)"></div></section></div>
      ${widget("ds-corr","¿Con qué se asocia el % de viajes de 3 o más etapas?",
        "cada punto es una zona con viajes suficientes (tamaño ∝ viajes) · usa la franja elegida en el mapa · r = correlación de Pearson",340,
        `<div class="ds-seg" id="ds-xc" role="group" aria-label="Variable del eje horizontal">
          <button data-x="dist">Distancia al centro</button><button data-x="pct_metro">% solo Metro</button><button data-x="km_medio">Largo del viaje</button></div>`)}`;
    $("ds-met").onchange = e => { S.metrica = e.target.value; if(METRICAS.find(m=>m[0]===S.metrica)[4]) S.nivel="comunas"; S.zonaSel=null; pintaCapa(); marcaSeg(); };
    $("ds-niv").onclick = e => { const b=e.target.closest("button"); if(!b) return; S.nivel=b.dataset.n; S.zonaSel=null; pintaCapa(); marcaSeg(); };
    $("ds-fra").onclick = e => { const b=e.target.closest("button"); if(!b) return; S.franja=b.dataset.f;
      if(S.franja==="am" && !BASE_AM.has(S.metrica)) S.metrica="pct_3mas";
      [...$("ds-met").options].forEach(o=>{ o.disabled = S.franja==="am" && !BASE_AM.has(o.value); }); $("ds-met").value=S.metrica;
      S.zonaSel=null; pintaCapa(); marcaSeg(); corr(); };
    $("ds-chkm").onchange = e => { S.metro = e.target.checked; pintaMetro(); };
    $("ds-xc").onclick = e => { const b=e.target.closest("button"); if(!b) return; S.xCorr=b.dataset.x; corr(); };
    marcaSeg();
    if(mapa){ mapa.remove(); mapa=null; capaZ=capaM=capaOD=null; }
    mapa = L.map("ds-map",{center:[CITY.lat0,CITY.lon0], zoom:11, preferCanvas:true}); basemap(mapa);
    pintaCapa(); pintaMetro(); corr();
  }
  function marcaSeg(){ document.querySelectorAll("#ds-niv button").forEach(b=>{ const on=b.dataset.n===S.nivel; b.classList.toggle("on",on); b.setAttribute("aria-pressed",on); });
    document.querySelectorAll("#ds-fra button").forEach(b=>{ const on=b.dataset.f===S.franja; b.classList.toggle("on",on); b.setAttribute("aria-pressed",on); }); }
  function cortes(vals, k){ const v=vals.filter(x=>x!=null).sort((a,b)=>a-b); if(!v.length) return [];
    return Array.from({length:k-1},(_,i)=>v[Math.floor((i+1)*v.length/k)]); }
  function fmtM(tipo){ return tipo==="p" ? pct : tipo==="d" ? fmt1 : tipo==="h" ? (v=>v==null?"—":String(v).padStart(2,"0")+":00") : fmt; }
  function capaDatos(){
    const met = METRICAS.find(m=>m[0]===S.metrica), tipo = met[2];
    const datos = S.nivel==="zonas" ? zonaDatos() : comunaDatos();
    const idx = {}; Object.entries(datos).forEach(([k,v])=>{ idx[S.nivel==="zonas"?String(k):norm(k)] = v; });
    const valor = d => { if(!d) return null; const x = d[S.metrica];
      if(x==null) return null; if(S.nivel==="zonas" && tipo!=="n" && (d.viajes_dia||0) < minPct()) return null;
      return x; };
    return {met, tipo, idx, valor};
  }
  function pintaCapa(){
    if(!mapa) return; if(capaZ){ mapa.removeLayer(capaZ); capaZ=null; } if(capaOD){ mapa.removeLayer(capaOD); capaOD=null; }
    const {met, tipo, idx, valor} = capaDatos(), t = th(), f1 = fmtM(tipo);
    const clave = f => S.nivel==="zonas" ? String(f.properties.z) : norm(f.properties.name||f.properties.comuna);
    const vals = Object.values(idx).map(valor).filter(v=>v!=null);
    const br = cortes(vals, 5), color = x => { let i=0; while(i<br.length && x>br[i]) i++; return RAMPA[i]; };
    const gj = S.nivel==="zonas" ? geoZ : geoC; let enmasc = 0;
    capaZ = L.geoJSON(gj, {style: f => { const d=idx[clave(f)], x=valor(d);
        if(d && x==null) enmasc++;
        return x==null ? {color:t.line, weight:.4, fillColor:"#888", fillOpacity: d?0.12:0, dashArray:"2 3"}
                       : {color:t.line, weight:.5, fillColor:color(x), fillOpacity:.8}; },
      onEachFeature: (f, ly) => { const d=idx[clave(f)], x=valor(d);
        ly.bindTooltip(`${S.nivel==="zonas"?`Zona ${f.properties.z} · ${comNom(f.properties.comuna)}`:comNom(f.properties.name)}<br>${met[1]}: <b>${f1(x)}</b>`, {sticky:true});
        ly.on("click", () => detalle(clave(f), d, f)); }}).addTo(mapa);
    const lims = vals.length ? [Math.min(...vals)].concat(br).concat([Math.max(...vals)]) : [];
    $("ds-leg").innerHTML = `<b>${met[1]}</b> · quintiles<br>` + RAMPA.map((c,i)=>`<span style="white-space:nowrap"><span style="display:inline-block;width:14px;height:10px;background:${c};margin:0 4px 0 0;vertical-align:middle"></span>${f1(lims[i])}–${f1(lims[i+1])}</span>`).join(" &nbsp; ")
      + (enmasc ? `<br><span style="display:inline-block;width:14px;height:10px;background:#8883;border:1px dashed var(--line);vertical-align:middle"></span> sin dato o zona con menos de ${fmt(minPct())} viajes/día (${enmasc})` : "")
      + (S.franja==="am" ? `<br>Punta mañana: ${D.zon._nota_am||""} Viajes por día laboral dentro de esa ventana.` : "")
      + (S.nivel==="zonas" && D.zon.sin_geometria_zonas && D.zon.sin_geometria_zonas.length ? `<br>${D.zon.sin_geometria_zonas.length} zonas con viajes no tienen polígono en la capa 777 (${fmt(D.zon.sin_geometria_zonas.reduce((a,x)=>a+x[1],0))} viajes/día): no se dibujan.` : "")
      + (S.metrica==="viajes_hab" ? `<br>Viajes que EMPIEZAN en la comuna / población Censo 2024: incluye los regresos de quienes no viven ahí.` : "")
      + (S.metrica==="dens_km2" && S.nivel==="comunas" ? `<br>Densidad sobre el área total de la comuna (incluye suelo no urbano).` : "");
    if(capaM) capaM.bringToFront();
    // KPIs que reaccionan al indicador elegido
    const pares = Object.entries(idx).map(([k,d])=>[k, valor(d), d]).filter(x=>x[1]!=null);
    const peso = pares.reduce((a,x)=>a+(x[2].viajes_dia||0),0);
    const prom = tipo==="n" ? null : pares.reduce((a,x)=>a+x[1]*(x[2].viajes_dia||0),0)/(peso||1);
    const mx = pares.slice().sort((a,b)=>b[1]-a[1])[0], mn = pares.slice().sort((a,b)=>a[1]-b[1])[0];
    const nomK = k => S.nivel==="zonas" ? `zona ${k}` : comNom(k);
    $("ds-kpis").innerHTML = (prom!=null ? kpi("Promedio del sistema", f1(prom), "ponderado por viajes") : kpi("Unidades con dato", fmt(pares.length), S.nivel==="zonas"?"zonas 777":"comunas")) +
      (mx ? kpi("Máximo", f1(mx[1]), nomK(mx[0])) : "") + (mn ? kpi("Mínimo", f1(mn[1]), nomK(mn[0])) : "");
    if(!S.zonaSel) ranking(pares, f1, nomK);
  }
  function ranking(pares, f1, nomK){
    const t = th(), met = METRICAS.find(m=>m[0]===S.metrica);
    const zc = {}; if(S.nivel==="zonas") geoZ.features.forEach(f=>{ zc[String(f.properties.z)] = comNom(f.properties.comuna); });
    const lab = k => S.nivel==="zonas" ? `${k} · ${zc[k]||""}` : comNom(k);
    const top = pares.slice().sort((a,b)=>b[1]-a[1]).slice(0,15);
    $("ds-pan-t").textContent = "Las 15 más altas"; $("ds-pan-s").textContent = met[1];
    $("ds-pan").innerHTML = `<div id="ds-rank" style="height:520px;width:100%"></div>`;
    chart("ds-rank").setOption({tooltip:{trigger:"axis",axisPointer:{type:"shadow"},valueFormatter:f1}, grid:G({right:64,top:4}),
      xAxis:{type:"value", show:false}, yAxis:{type:"category", inverse:true, data:top.map(([k])=>lab(k)), ...ejes(t), axisLabel:{color:t.mid,fontSize:11}},
      series:[{type:"bar", data:top.map(x=>x[1]), itemStyle:{color:RAMPA[3]}, label:{show:true,position:"right",color:t.mid,fontSize:10,formatter:p=>f1(p.value)}}]});
  }
  function pintaMetro(){
    if(!mapa) return; if(capaM){ mapa.removeLayer(capaM); capaM=null; } if(!S.metro) return;
    const es = (D.met.estaciones||[]).filter(e=>e.modo==="METRO"), mx = Math.max(...es.map(e=>e.sub.L||0), 1);
    capaM = L.layerGroup(es.map(e => L.circleMarker([e.lat,e.lon], {radius: 3+12*Math.sqrt((e.sub.L||0)/mx),
      color:"#111", weight:.6, fillColor:"#f5b83d", fillOpacity:.6})
      .bindTooltip(`<b>${tit(e.est)}</b> (${e.lineas||""})<br>subidas/día laboral ${fmt(e.sub.L)} · bajadas ${fmt(e.baj.L)}`))).addTo(mapa);
  }
  function detalle(k, d, f){
    S.zonaSel = k;
    const nombre = S.nivel==="zonas" ? `Zona ${k} · ${comNom(f.properties.comuna)}` : comNom(f.properties.name||k);
    $("ds-pan-t").textContent = nombre; $("ds-pan-s").textContent = "día laboral promedio · viajes que empiezan aquí";
    if(!d){ $("ds-pan").innerHTML = "sin viajes registrados con origen aquí"; return; }
    const chico = S.nivel==="zonas" && (d.viajes_dia||0) < minPct();
    const fila = (a,b) => `<tr><td>${a}</td><td>${b}</td></tr>`;
    let h = `<table class="ds-tab">` + [["Viajes que empiezan", fmt(d.viajes_dia)], ["Por km²", fmt(d.dens_km2)],
        ["Superficie", d.km2==null?"—":fmt1(d.km2)+" km²"], d.viajes_hab!=null?["Por habitante (Censo 2024)", fmt1(d.viajes_hab)]:null,
        ["1 etapa", pct(d.pct_1)], ["2 etapas", pct(d.pct_2)], ["3 o más etapas", pct(d.pct_3mas)],
        ["Solo bus", pct(d.pct_bus)], ["Solo Metro", pct(d.pct_metro)], ["Bus + Metro", pct(d.pct_bus_metro)],
        ["Largo medio (recta)", d.km_medio==null?"—":fmt1(d.km_medio)+" km"], ["Duración media", d.min_medio==null?"—":fmt1(d.min_medio)+" min"],
        ["Empiezan 06–09 h", pct(d.pct_punta_am)], ["Variabilidad entre días laborales", d.cv_laboral==null?"—":pct(d.cv_laboral)]]
      .filter(Boolean).map(([a,b])=>fila(a,b)).join("") + `</table>` +
      (chico ? `<div style="margin-top:6px;color:var(--warn);font-size:12px">Zona con menos de ${fmt(minPct())} viajes/día: los % son inestables.</div>` : "");
    if(capaOD){ mapa.removeLayer(capaOD); capaOD=null; }
    if(S.nivel==="zonas"){
      const top = (D.od.zonas_top||{})[k] || [], cen = centros(), o = cen[k], mx = Math.max(...top.map(x=>x[1]), 1);
      if(o) capaOD = L.layerGroup(top.filter(x=>cen[x[0]] && x[0]!==k).map(x => L.polyline([o, cen[x[0]]],
        {color:"#ff5c5c", weight:1+6*x[1]/mx, opacity:.8}).bindTooltip(`→ zona ${x[0]}: ${fmt(x[1])} viajes/día`))).addTo(mapa);
      const zc = {}; geoZ.features.forEach(ff=>{ zc[String(ff.properties.z)] = comNom(ff.properties.comuna); });
      h += `<div style="margin-top:12px;color:var(--text-mid)">Destinos principales (destino estimado por la DTPM)</div><table class="ds-tab">` +
        top.slice(0,10).map(x=>fila(`zona ${x[0]} · ${zc[x[0]]||""}`, fmt(x[1]))).join("") + `</table>`;
    }
    h += `<div style="margin-top:14px"><a href="#" id="ds-volver" style="color:var(--live);font-size:12px">← volver al ranking</a></div>`;
    $("ds-pan").innerHTML = h;
    $("ds-volver").onclick = e => { e.preventDefault(); S.zonaSel = null; pintaCapa(); };
  }
  function corr(){
    if(!$("ds-corr")) return;
    document.querySelectorAll("#ds-xc button").forEach(b=>b.classList.toggle("on", b.dataset.x===S.xCorr));
    const t = th(), cen = centros(), zd = zonaDatos();
    const pts = Object.entries(zd).filter(([k,d])=>(d.viajes_dia||0)>=minPct() && d.pct_3mas!=null && cen[k]).map(([k,d])=>{
      const x = S.xCorr==="dist" ? distKm(cen[k], CENTRO) : d[S.xCorr]; return x==null ? null : [x, d.pct_3mas, d.viajes_dia, k]; }).filter(Boolean);
    const r = pearson(pts.map(p=>p[0]), pts.map(p=>p[1]));
    const xl = {dist:"Distancia a Plaza de Armas (km)", pct_metro:"% de viajes solo en Metro", km_medio:"Largo medio del viaje (km)"}[S.xCorr];
    const mxv = Math.max(...pts.map(p=>p[2]));
    chart("ds-corr").setOption({tooltip:{formatter:p=>`zona ${p.data[3]}<br>${xl}: ${fmt1(p.data[0])}<br>3+ etapas: ${pct(p.data[1])}<br>${fmt(p.data[2])} viajes/día`},
      title:{text:r==null?"":`r = ${r.toLocaleString("es-CL",{maximumFractionDigits:2})} · ${pts.length} zonas`, right:10, top:0, textStyle:{color:t.mid,fontSize:12,fontWeight:"normal"}},
      grid:G({top:30,bottom:30}), xAxis:{type:"value", name:xl, nameLocation:"middle", nameGap:26, nameTextStyle:{color:t.mid,fontSize:12}, ...ejes(t, v=>fmt1(v))},
      yAxis:{type:"value", name:"% de viajes de 3+ etapas", nameTextStyle:{color:t.mid,fontSize:12,align:"left"}, ...ejes(t, v=>fmt1(v))},
      series:[{type:"scatter", data:pts, symbolSize:p=>3+10*Math.sqrt(p[2]/mxv), itemStyle:{color:RAMPA[3], opacity:.6}}]});
  }

  // ---------------- 3. ORIGEN–DESTINO ----------------
  function vOD(){
    const od = D.od.comunas, t = th();
    ayuda(`Entre qué comunas se viaja. Sólo los viajes cuyo destino estimó la DTPM (la bajada de la última etapa se
      infiere con la validación siguiente de la tarjeta); quien hace un solo viaje en el día casi nunca lo tiene, así
      que esta matriz sub-representa esos viajes. No está expandida. Filas = comuna de origen, columnas = destino.`);
    const tot = {}; od.forEach(([o,,v])=>{ tot[o]=(tot[o]||0)+v; });
    const com = Object.keys(tot).sort((a,b)=>tot[b]-tot[a]), totv = od.reduce((a,x)=>a+x[2],0);
    const intra = od.filter(x=>x[0]===x[1]).reduce((a,x)=>a+x[2],0);
    $("ds-kpis").innerHTML = kpi("Viajes con destino estimado", fmt(totv), "por día laboral, no expandido") +
      kpi("Dentro de la misma comuna", pct(100*intra/totv), "origen y destino en la misma comuna") +
      kpi("Pares de comunas publicados", fmt(od.length), `≥ 10 viajes/día · ${fmt(D.od.pares_comuna_ocultos)} ocultos`);
    const alto = Math.max(420, Math.min(780, innerWidth - 40));
    $("ds-cuerpo").innerHTML = widget("ds-mat","Matriz origen–destino por comuna (día laboral)", "filas = comuna de origen · columnas = destino · no expandida", alto,
        `<div class="ds-seg" id="ds-odm" role="group" aria-label="Escala"><button data-m="pct">% de los viajes del origen</button><button data-m="abs">Viajes por día</button></div>`, D.od._nota) +
      `<section class="widget"><div class="widget-h"><div class="min-w-0"><h3>Líneas de deseo entre comunas</h3>
        <span class="sub">los 60 pares entre comunas distintas con más viajes · grosor ∝ viajes/día</span></div></div>
        <div class="widget-b !p-2.5"><div id="ds-omap" style="height:${altoMapa()}px;width:100%"></div></div></section>`;
    $("ds-odm").onclick = e => { const b=e.target.closest("button"); if(!b) return; S.odModo=b.dataset.m; matriz(); };
    const ix = Object.fromEntries(com.map((c,i)=>[c,i]));
    function matriz(){
      document.querySelectorAll("#ds-odm button").forEach(b=>b.classList.toggle("on", b.dataset.m===S.odModo));
      const data = od.map(([o,d,v])=>[ix[d], ix[o], S.odModo==="pct" ? 100*v/tot[o] : v, v]).filter(x=>x[0]!=null && x[1]!=null);
      const lg = S.odModo==="abs";
      const vv = data.map(x=>lg?Math.log10(x[2]):x[2]);
      // el tope de color lo fijan sólo orígenes con ≥ 1.000 viajes/día (antes lo fijaba Colina con 25 viajes)
      const vTope = data.map((x,i)=>tot[com[x[1]]]>=1000 ? vv[i] : -Infinity).reduce((a,b)=>Math.max(a,b), -Infinity);
      chart("ds-mat").setOption({tooltip:{formatter:p=>`${comNom(com[p.data[1]])} → ${comNom(com[p.data[0]])}<br>${fmt(p.data[3])} viajes/día · ${pct(100*p.data[3]/tot[com[p.data[1]]])} de los que salen del origen`},
        grid:G({bottom:60}),
        xAxis:{type:"category", data:com.map(comNom), axisLabel:{color:t.mid,rotate:60,fontSize:9}, position:"top"},
        yAxis:{type:"category", data:com.map(comNom), inverse:true, axisLabel:{color:t.mid,fontSize:9}},
        visualMap:{min:Math.min(...vv), max:vTope, calculable:true, orient:"horizontal", left:"center", bottom:0,
                   textStyle:{color:t.mid}, inRange:{color:RAMPA}, formatter:v=>lg?fmt(10**v):fmt1(v)+" %", dimension:4},
        series:[{type:"heatmap", data:data.map((x,i)=>[x[0],x[1],x[2],x[3],vv[i]]), emphasis:{itemStyle:{borderColor:t.tx,borderWidth:1}}}]}, true);
    }
    matriz();
    // líneas de deseo comunales (punto interior de cada comuna)
    if(mapaO){ mapaO.remove(); mapaO=null; }
    mapaO = L.map("ds-omap",{center:[CITY.lat0,CITY.lon0], zoom:10, preferCanvas:true}); basemap(mapaO);
    const cc = {}; geoC.features.forEach(f=>{ cc[norm(f.properties.name)] = interior(f); });
    L.geoJSON(geoC, {style:{color:t.line, weight:.6, fillOpacity:0}}).addTo(mapaO);
    const top = od.filter(x=>x[0]!==x[1] && cc[norm(x[0])] && cc[norm(x[1])]).sort((a,b)=>b[2]-a[2]).slice(0,60), mx = top.length?top[0][2]:1;
    const lin = top.slice().reverse().map(([o,d,v]) => L.polyline([cc[norm(o)], cc[norm(d)]], {color:"#ff5c5c", weight:1+9*v/mx, opacity:.55})
      .bindTooltip(`${comNom(o)} → ${comNom(d)}: ${fmt(v)} viajes/día`).addTo(mapaO));
    // encuadre a las líneas, después de que el contenedor tenga su tamaño final (antes abría con Valparaíso y Argentina)
    requestAnimationFrame(() => { mapaO.invalidateSize(); if(lin.length) mapaO.fitBounds(L.featureGroup(lin).getBounds(), {padding:[20,20]}); });
  }

  // ---------------- 4. METRO ----------------
  // Balance de punta mañana = (bajadas − subidas)/(bajadas + subidas) en la ventana pmam (07:00–08:30): el cero tiene
  // significado (estación neutra); negativo = estación que GENERA viajes en la punta (residencial), positivo = que ATRAE.
  // las bajadas sólo cuentan etapas con destino estimado (~83 % de las subidas): sin escalar, toda la red sale
  // «generadora» (balance −0,11 en la red completa, revisión del 24-oct). Se escalan por Σsub/Σbaj de la ventana.
  let _kBal = null;
  function kBal(){ if(_kBal) return _kBal; const es=(D.met.estaciones||[]).filter(e=>e.modo==="METRO");
    const s=es.reduce((a,e)=>a+(e.sub.pmam||0),0), b=es.reduce((a,e)=>a+(e.baj.pmam||0),0); return _kBal = b ? s/b : 1; }
  function balance(e){ const s=e.sub.pmam||0, b=(e.baj.pmam||0)*kBal(); return (s+b) ? (b-s)/(s+b) : null; }
  function colBal(x){ if(x==null) return "#888"; const c=Math.max(-1,Math.min(1,x));
    const A=[59,130,246], N=[205,205,205], B=[249,115,22], m=(p,q,u)=>Math.round(p+(q-p)*u);
    const [p,q,u] = c<0 ? [N,A,-c] : [N,B,c]; return `rgb(${m(p[0],q[0],u)},${m(p[1],q[1],u)},${m(p[2],q[2],u)})`; }
  function vMetro(){
    ayuda(`Subidas y bajadas por estación de Metro (validaciones en torniquete; la bajada la estima la DTPM). El color
      dice qué rol cumple la estación en la punta mañana: <b style="color:${colBal(-1)}">azul</b> = desde ahí sale la gente
      (barrios residenciales), <b style="color:${colBal(1)}">naranjo</b> = ahí llega (empleo, estudio). Los transbordos
      dentro del Metro no se ven.`);
    const es = (D.met.estaciones||[]), met = es.filter(e=>e.modo==="METRO"), tren = es.filter(e=>e.modo==="METROTREN");
    const sum = (a,k) => a.reduce((x,e)=>x+(e.sub[k]||0),0), top = met.slice().sort((a,b)=>b.sub.L-a.sub.L)[0];
    $("ds-kpis").innerHTML = kpi("Subidas en Metro · día laboral", fmt(sum(met,"L")), `${met.length} estaciones`) +
      kpi("Subidas en Metro · sábado", fmt(sum(met,"S")), `${Math.round(100*sum(met,"S")/sum(met,"L"))} % del laboral`) +
      kpi("Subidas en Metro · domingo y festivo", fmt(sum(met,"D")), `${Math.round(100*sum(met,"D")/sum(met,"L"))} % del laboral`) +
      kpi("Estación con más subidas", top ? tit(top.est) : "—", top ? fmt(top.sub.L)+" subidas/día laboral" : "") +
      kpi("Metrotren (EFE) · día laboral", fmt(sum(tren,"L")), `${tren.length} estaciones · subidas`);
    const lineas = ["TODAS","L1","L2","L3","L4","L4A","L5","L6"];
    $("ds-cuerpo").innerHTML = `<div class="ds-g3">
      <section class="widget"><div class="widget-h" style="flex-wrap:wrap;row-gap:8px">
        <div class="min-w-0" style="flex:1 1 auto"><h3>Estaciones: cuánto suben y qué rol cumplen en la punta mañana</h3>
        <span class="sub">área del círculo ∝ subidas por día laboral · color = balance 07:00–08:30 (ventana de la lente de estaciones; la punta TS de la DTPM es 06:30–07:59)</span></div>
        <div style="flex:1 1 100%" id="ds-lin" class="ds-seg" role="group" aria-label="Línea de Metro">${lineas.map(l=>`<button data-l="${l}">${l==="TODAS"?"Todas las líneas":l}</button>`).join("")}</div></div>
        <div class="widget-b !p-2.5"><div id="ds-mmap" style="height:${altoMapa()}px;width:100%"></div></div>
        <div id="ds-mleg" style="padding:8px 10px;font-size:12px;color:var(--text-mid)"></div></section>
      <section class="widget"><div class="widget-h"><div class="min-w-0"><h3 id="ds-est-t">Estaciones con más subidas</h3><span class="sub">día laboral · clic en una estación (mapa o barra): su curva horaria</span></div></div>
        <div class="widget-b !p-2.5"><div id="ds-est" style="height:600px;width:100%"></div></div></section></div>
      ${widget("ds-mcurva","Subidas y bajadas por hora","día laboral promedio · bajadas = sólo etapas con destino estimado por la DTPM (sin escalar)",280)}
      ${D.mh ? widget("ds-mhist","Subidas por día laboral, 2012–2026","cortes públicos de la DTPM (una semana tipo por corte) · línea llena = series comparables · punteado = no comparable (pandemia; tablas con validaciones repetidas)",320,"",D.mh._nota) : ""}`;
    $("ds-lin").onclick = e => { const b=e.target.closest("button"); if(!b) return; S.linea=b.dataset.l; S.est=null; pintaMetroV(); };
    if(mapaM){ mapaM.remove(); mapaM=null; capaE=null; }
    mapaM = L.map("ds-mmap",{center:[CITY.lat0,CITY.lon0], zoom:11, preferCanvas:true}); basemap(mapaM);
    pintaMetroV();
  }
  function pintaMetroV(){
    const t = th(), todas = (D.met.estaciones||[]).filter(e=>e.modo==="METRO");
    const es = todas.filter(e=>S.linea==="TODAS" || (e.lineas||"").split(",").includes(S.linea));
    document.querySelectorAll("#ds-lin button").forEach(b=>b.classList.toggle("on", b.dataset.l===S.linea));
    if(capaE) mapaM.removeLayer(capaE);
    const mx = Math.max(...todas.map(e=>e.sub.L||0), 1);
    capaE = L.layerGroup(es.map(e => L.circleMarker([e.lat,e.lon], {radius: 3+16*Math.sqrt((e.sub.L||0)/mx), color:"#111", weight:.6,
        fillColor: colBal(balance(e)), fillOpacity:.88})
      .bindTooltip(`<b>${tit(e.est)}</b> (${e.lineas})<br>subidas/día laboral ${fmt(e.sub.L)} · bajadas ${fmt(e.baj.L)}<br>07:00–08:30: suben ${fmt(e.sub.pmam)} · bajan ${fmt(e.baj.pmam)}`)
      .on("click", () => { S.est = e; curva(); }))).addTo(mapaM);
    $("ds-mleg").innerHTML = `balance punta mañana &nbsp;<span style="display:inline-block;width:140px;height:10px;vertical-align:middle;background:linear-gradient(90deg,${colBal(-1)},${colBal(0)},${colBal(1)})"></span>
      &nbsp; −1 sólo suben · 0 equilibrio · +1 sólo bajan<br>bajadas escaladas ×${kBal().toLocaleString("es-CL",{maximumFractionDigits:2})}: la DTPM estima destino sólo para una parte de las etapas, y sin escalar toda la red parecería «generadora».`;
    const top = es.slice().sort((a,b)=>b.sub.L-a.sub.L).slice(0,25);
    $("ds-est-t").textContent = "Estaciones con más subidas" + (S.linea==="TODAS" ? "" : " · " + S.linea);
    chart("ds-est").setOption({tooltip:{trigger:"axis",axisPointer:{type:"shadow"},valueFormatter:fmt}, legend:{top:0,textStyle:{color:t.mid}},
      grid:G({top:28}), xAxis:{type:"value", show:false}, yAxis:{type:"category", inverse:true, data:top.map(e=>tit(e.est)), ...ejes(t), axisLabel:{color:t.mid,fontSize:10}},
      series:[{name:"Subidas", type:"bar", data:top.map(e=>e.sub.L), itemStyle:{color:t.live}},
              {name:"Bajadas", type:"bar", data:top.map(e=>e.baj.L), itemStyle:{color:t.warn}}]});
    charts["ds-est"].on("click", p => { S.est = top[p.dataIndex]; curva(); });
    curva();
  }
  // evolución 2012–2026 (panel de cortes públicos DTPM): total de la red o la estación elegida; una serie por bloque
  // de comparabilidad para que el ojo no una 2019 con 2022 ni 2023-08 con 2023-11
  function historia(){
    if(!D.mh || !$("ds-mhist")) return;
    const t = th(), cs = D.mh.cortes, ks = cs.map(c=>c.corte), e = S.est;
    let st = null; if(e){ const k = Object.keys(D.mh.estaciones).find(x=>norm(x)===norm(e.est)); st = k ? D.mh.estaciones[k] : null; }
    const v = c => e ? (st && st.serie[c.corte]!=null ? st.serie[c.corte] : null) : c.subidas_L;
    const BLO = [["A","2012–2019 (comparable)",t.live,"solid"],["E","2020–2021 pandemia (no comparable)","#94a3b8","dashed"],
                 ["B","2022–2023 tablas con repetidos (estimación sin repetidos)",t.warn,"dashed"],["C","2023-11 → 2026 (comparable)",t.live,"solid"]];
    $("ds-mhist").closest("section").querySelector("h3").textContent = "Subidas por día laboral, 2012–2026 · " +
      (e ? `${tit(e.est)}${st&&st.desde&&st.desde!=="2012-04" ? " (aparece desde "+st.desde+")" : ""}` : "red de Metro");
    chart("ds-mhist").setOption({tooltip:{trigger:"axis", formatter:ps=>{ const p=ps.find(x=>x.value!=null); if(!p) return "";
        const c=cs[p.dataIndex]; return `${c.corte} · serie ${c.serie}<br><b>${fmt(p.value)}</b> subidas/día laboral<br><span style="font-size:11px">${(c.nota||"").slice(0,140)}</span>`; }},
      legend:{top:0, textStyle:{color:t.mid}}, grid:G({top:34}),
      xAxis:{type:"category", data:ks, ...ejes(t), axisLabel:{color:t.mid, rotate:45, fontSize:10}}, yAxis:{type:"value", min:0, ...ejes(t)},
      series:BLO.map(([b,n,c,ls])=>({name:n, type:"line", symbolSize:7, connectNulls:false, lineStyle:{color:c,width:2,type:ls},
        itemStyle:{color:c}, data:cs.map(x=>x.serie===b ? v(x) : null)}))}, true);
  }
  function curva(){
    historia();
    const t = th(), es = (D.met.estaciones||[]).filter(e=>e.modo==="METRO" && (S.linea==="TODAS" || (e.lineas||"").split(",").includes(S.linea)));
    const suma = k => Array.from({length:24},(_,h)=>es.reduce((x,e)=>x+((e[k].curva_L||[])[h]||0),0));
    const e = S.est, sub = e ? e.sub.curva_L : suma("sub"), baj = e ? e.baj.curva_L : suma("baj");
    const w = $("ds-mcurva"); if(!w) return;
    w.closest("section").querySelector("h3").textContent = "Subidas y bajadas por hora · " +
      (e ? `${tit(e.est)} (${e.lineas})` : (S.linea==="TODAS" ? "Metro completo" : "estaciones de " + S.linea));
    // barras por hora (no curva suavizada: no hay dato entre horas)
    chart("ds-mcurva").setOption({tooltip:{trigger:"axis",valueFormatter:fmt}, legend:{top:0,textStyle:{color:t.mid}}, grid:G({top:30}),
      xAxis:{type:"category", data:Array.from({length:24},(_,h)=>String(h).padStart(2,"0")+"h"), ...ejes(t)}, yAxis:{type:"value", ...ejes(t)},
      series:[{name:"Subidas",type:"bar",data:sub,itemStyle:{color:t.live},barGap:"0%"},
              {name:"Bajadas",type:"bar",data:baj,itemStyle:{color:t.warn}}]});
  }

  // ---------------- 5. EXPERIENCIA DEL VIAJE (fase 1b) ----------------
  function vExperiencia(){
    const x = D.ex, t = th();
    if(!x){ ayuda(""); $("ds-kpis").innerHTML = ""; $("ds-cuerpo").innerHTML = `<div class="kpi-note">Los indicadores de espera y transbordo todavía se están calculando.</div>`; return; }
    ayuda(`Lo que vive el pasajero: cuánto <b>espera</b> el bus en el paradero (la mitad del intervalo entre el bus que tomó
      y el anterior), cuánto tarda en <b>transbordar</b> (de la bajada a la siguiente subida) y a qué <b>velocidad</b> avanza
      a bordo. Bus y zona paga; el Metro no registra espera ni sus transbordos internos.`);
    const e = x.espera, tr = x.transbordos, v = x.velocidad, lo = x.longitud;
    const vb = v.por_modo.BUS||{}, vm = v.por_modo.METRO||{};
    $("ds-kpis").innerHTML = kpi("Espera media en paradero", fmt1(e.media_L)+" min", `bus y zona paga · dato en ${pct(e.con_dato_pct)} de las subidas · observada/programada: mediana ${e.razon_obs_prog_mediana==null?"—":e.razon_obs_prog_mediana.toLocaleString("es-CL",{minimumFractionDigits:2})}`) +
      kpi("Transbordos por día laboral", fmt(tr.por_dia_L), `media ${fmt1(tr.media_min)} min entre bajada y subida`) +
      kpi("Velocidad a bordo · bus", fmt1(vb.kmh)+" km/h", `rodeo ${fmt1(vb.rodeo)} (ruta / recta)`) +
      kpi("Velocidad a bordo · Metro", fmt1(vm.kmh)+" km/h", "incluye transbordos internos") +
      kpi("Largo medio del viaje", fmt1(lo.km_medio)+" km", `en línea recta · ${fmt1(lo.min_medio)} min puerta a puerta`);
    // Metrotren: hora de bajada estimada poco creíble (56,9 km/h con rodeo 1,0; Metrotren→Metro 10,9 min contra 2,5 en sentido
    // inverso; revisión del 24-oct): sus filas van marcadas «a verificar»
    const shown = tr.pares.slice(0,8), otros = tr.por_dia_L - shown.reduce((a,p)=>a+p.dia,0);
    const parT = shown.map(p=>{ const v = /METROTREN/.test(p.par);
        return `<tr${v?' style="opacity:.6"':''}><td>${p.par.replace(/>/g," → ").replace(/METROTREN/g,"Metrotren").replace(/METRO/g,"Metro").replace(/BUS/g,"Bus")}${v?" <small>(a verificar)</small>":""}</td><td>${fmt(p.dia)}</td><td>${fmt1(p.mediana)}</td><td>${fmt1(p.p90)}</td><td>${pct(p.pct_le5)}</td><td>${pct(p.pct_gt20)}</td></tr>`; }).join("")
      + (otros>0 ? `<tr><td>Otros (${tr.pares.length-shown.length} combinaciones)</td><td>${fmt(otros)}</td><td></td><td></td><td></td><td></td></tr>` : "")
      + `<tr><td><b>Total</b></td><td><b>${fmt(tr.por_dia_L)}</b></td><td></td><td></td><td></td><td></td></tr>`;
    $("ds-cuerpo").innerHTML = `<div class="ds-g2">
        ${widget("ds-espp","Espera media en el paradero según el período","minutos · bus y zona paga · día laboral",280)}
        <section class="widget" style="margin-bottom:12px"><div class="widget-h"><div class="min-w-0"><h3>Transbordos: cuánto demora el cambio de vehículo</h3>
          <span class="sub">minutos entre la bajada estimada y la subida siguiente · día laboral</span></div></div>
          <div class="widget-b" style="padding:8px 12px;overflow-x:auto"><table class="ds-tab"><tr><th>Transbordo</th><th>por día</th><th>mediana</th><th>p90</th><th>≤ 5 min</th><th>&gt; 20 min</th></tr>${parT}</table>
          <details class="ds-metodo"><summary>Método y fuente</summary><div>${tr._nota} Las filas de Metrotren van marcadas «a verificar»: la bajada estimada en Metrotren da tiempos poco creíbles (velocidad a bordo de 56,9 km/h con rodeo 1,0).</div></details></div></section>
       </div>
       <div class="ds-g3">
        <section class="widget"><div class="widget-h"><div class="min-w-0"><h3>Dónde se transborda y cuánto se espera</h3>
          <span class="sub">los ${tr.nodos.length} nodos con más transbordos · área ∝ transbordos/día · color = minutos medios de transbordo</span></div></div>
          <div class="widget-b !p-2.5"><div id="ds-tmap" style="height:${altoMapa()}px;width:100%"></div></div>
          <div id="ds-tleg" style="padding:8px 10px;font-size:12px;color:var(--text-mid)"></div></section>
        ${widget("ds-esps","Servicios de bus donde se espera más de lo programado (punta mañana)",
          "barra = minutos de espera por sobre la mitad del intervalo programado",600, "",
          (e._nota_exceso||"")+" "+(e._nota_servicios||"")
          +((e.servicios_inconsistentes||[]).length ? " Fuera por incompatibles con su programa: "+e.servicios_inconsistentes.map(x=>`${x.serv} (${fmt1(x.espera)} min observados contra ${fmt1(x.espera_prog)} programados)`).join(", ")+"." : ""))}
       </div>
       <div class="ds-g2">
        ${widget("ds-velp","Velocidad a bordo del bus según el período","km/h que vive el pasajero (distancia por ruta / tiempo de la etapa)",260)}
        ${widget("ds-lon","Qué tan largos son los viajes","viajes por día laboral según distancia en línea recta (km) · sólo viajes con destino estimado",260)}
       </div>`;
    const ep = e.por_periodo.filter(p=>p[2]>=1000);
    chart("ds-espp").setOption({tooltip:{trigger:"axis",axisPointer:{type:"shadow"},valueFormatter:v=>fmt1(v)+" min"}, grid:G({right:50}),
      xAxis:{type:"value", ...ejes(t, v=>fmt1(v))}, yAxis:{type:"category", inverse:true, data:ep.map(p=>perLab(p[0])), ...ejes(t)},
      series:[{type:"bar", data:ep.map(p=>p[1]), itemStyle:{color:t.live}, label:{show:true,position:"right",color:t.mid,formatter:p=>fmt1(p.value)}}]});
    const sv = e.servicios.slice(0,25), svLab = s => `${s.serv}${s.nombre?" · "+tit(s.nombre).slice(0,28):""}`;
    chart("ds-esps").setOption({tooltip:{trigger:"axis",axisPointer:{type:"shadow"},formatter:p=>{ const s=sv[p[0].dataIndex];
        return `${s.serv} · ${tit(s.nombre)}<br>espera observada ${fmt1(s.espera)} min · programada ${fmt1(s.espera_prog)} min (${fmt1(s.frec_prog)} buses/h)<br>exceso ${fmt1(s.exceso)} min<br>${fmt(s.abord_dia)} subidas/día en punta mañana · dato en ${pct(s.con_dato_pct)}`; }},
      grid:G({right:44,top:4}), xAxis:{type:"value", show:false}, yAxis:{type:"category", inverse:true, data:sv.map(svLab), ...ejes(t), axisLabel:{color:t.mid,fontSize:10}},
      series:[{type:"bar", data:sv.map(s=>s.exceso), itemStyle:{color:t.warn}, label:{show:true,position:"right",color:t.mid,fontSize:10,formatter:p=>"+"+fmt1(p.value)+" min"}}]});
    const vp = v.bus_por_periodo;
    chart("ds-velp").setOption({tooltip:{trigger:"axis",axisPointer:{type:"shadow"},valueFormatter:v=>fmt1(v)+" km/h"}, grid:G({right:44}),
      xAxis:{type:"value", ...ejes(t, v=>fmt1(v))}, yAxis:{type:"category", inverse:true, data:vp.map(p=>perLab(p[0])), ...ejes(t)},
      series:[{type:"bar", data:vp.map(p=>p[1]), itemStyle:{color:t.live}, label:{show:true,position:"right",color:t.mid,formatter:p=>fmt1(p.value)}}]});
    chart("ds-lon").setOption({tooltip:{trigger:"axis",valueFormatter:fmt}, grid:G(),
      xAxis:{type:"category", data:lo.dist_km.map((_,i)=>i<41?`${i}–${i+1}`:"41+"), ...ejes(t), axisLabel:{color:t.mid,interval:4}},
      yAxis:{type:"value", ...ejes(t)}, series:[{type:"bar", data:lo.dist_km, itemStyle:{color:t.live}}]});
    // mapa de nodos de transbordo: rampa secuencial por minutos medios
    if(mapaT){ mapaT.remove(); mapaT=null; }
    mapaT = L.map("ds-tmap",{center:[CITY.lat0,CITY.lon0], zoom:11, preferCanvas:true}); basemap(mapaT);
    const nd = tr.nodos.filter(n=>n.media!=null), br = cortes(nd.map(n=>n.media), 5), mxn = Math.max(...nd.map(n=>n.dia), 1);
    const col = x => { let i=0; while(i<br.length && x>br[i]) i++; return RAMPA[i]; };
    nd.slice().sort((a,b)=>b.dia-a.dia).forEach(n => L.circleMarker([n.lat,n.lon], {radius:3+16*Math.sqrt(n.dia/mxn), color:"#111", weight:.6,
        fillColor:col(n.media), fillOpacity:.85})
      .bindTooltip(`<b>${n.tipo==="estación"?tit(n.nodo):"Paradero "+n.nodo}</b><br>${fmt(n.dia)} transbordos/día · ${fmt1(n.media)} min medios<br>≤ 5 min: ${pct(n.pct_le5)} · &gt; 20 min: ${pct(n.pct_gt20)}<br>caminata media ${fmt(n.camina_m)} m`).addTo(mapaT));
    const lims = nd.length ? [Math.min(...nd.map(n=>n.media))].concat(br).concat([Math.max(...nd.map(n=>n.media))]) : [];
    $("ds-tleg").innerHTML = "minutos medios de transbordo · " + RAMPA.map((c,i)=>`<span style="white-space:nowrap"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${c};margin:0 4px 0 6px;vertical-align:middle"></span>${fmt1(lims[i])}–${fmt1(lims[i+1])}</span>`).join(" ");
  }

  // ---------------- 6. EVOLUCIÓN ----------------
  function vEvol(){
    // eje de meses CONTINUO: un mes sin dato queda como hueco visible, no comprimido entre sus vecinos
    const m0 = D.sis.mensual, t = th(), k0 = Object.keys(m0).sort(), ks = [], m = {};
    for(let y=+k0[0].slice(0,4), mo=+k0[0].slice(5); `${y}-${String(mo).padStart(2,"0")}` <= k0[k0.length-1]; mo===12?(y++,mo=1):mo++)
      ks.push(`${y}-${String(mo).padStart(2,"0")}`);
    ks.forEach(k => { m[k] = m0[k] || {}; });
    ayuda(`Cómo cambia la demanda mes a mes: viajes por día de cada tipo, promedio del mes. El índice (base 100 = promedio
      de los meses mostrados) permite comparar la forma de las tres curvas. La serie larga 2011–2026, con los cortes públicos
      de la DTPM, viene en la fase 2.`);
    const s = k => ks.map(x => (m[x][k]||{}).viajes_dia || null);
    const ant = k => `${+k.slice(0,4)-1}${k.slice(4)}`;
    const yoy = ks.filter(k=>m[k].L && m[ant(k)] && m[ant(k)].L).map(k=>[k, m[k].L.viajes_dia, m[ant(k)].L.viajes_dia]);
    $("ds-kpis").innerHTML = kpi("Meses con dato", fmt(k0.length), `${k0[0]} → ${k0[k0.length-1]}`) +
      (yoy.length ? yoy.map(([k,a,b])=>kpi(`Día laboral · ${k} contra un año antes`, (a>=b?"+":"")+fmt1(100*(a-b)/b)+" %", `${fmt(a)} contra ${fmt(b)} viajes/día`)).join("") : "");
    const idx = arr => { const v = arr.filter(x=>x!=null), mu = v.reduce((a,b)=>a+b,0)/(v.length||1); return arr.map(x=>x==null?null:100*x/mu); };
    const fv = D.sis.periodo ? D.sis.periodo.desde.slice(0,7) : null, pre = fv ? k0.filter(k=>k<fv) : [];
    $("ds-cuerpo").innerHTML = widget("ds-mes","Viajes por día, mes a mes","promedio por día de cada tipo en el mes · sin días con pérdida de datos (misma regla en todos los meses)"
        + (pre.length ? ` · ${pre.join(" y ")} quedan fuera de la ventana del resto de la pestaña y entran sólo para comparar contra un año antes` : ""),340,
        `<div class="ds-seg" id="ds-evm" role="group" aria-label="Escala"><button data-m="abs" class="on">Viajes por día</button><button data-m="idx">Índice (base 100)</button></div>`) +
      (D.ex && D.ex.segmento_mes_L ? widget("ds-seg","Viajes según tipo de tarjeta, mes a mes","día laboral · índice base 100 = promedio de los meses · "+(D.ex._nota_segmento||""),300) : "");
    const pinta = modo => {
      document.querySelectorAll("#ds-evm button").forEach(b=>b.classList.toggle("on", b.dataset.m===modo));
      chart("ds-mes").setOption({tooltip:{trigger:"axis", valueFormatter:v=>v==null?"—":(modo==="idx"?fmt1(v):fmt(v))}, legend:{top:0,textStyle:{color:t.mid}},
        grid:G({top:34}), xAxis:{type:"category", data:ks, ...ejes(t)}, yAxis:{type:"value", scale:modo==="idx", ...ejes(t, modo==="idx"?(v=>fmt1(v)):null)},
        series:[["L","Laboral"],["S","Sábado"],["D","Domingo y festivo"]].map(([k,n])=>({name:n, type:"line", symbolSize:6,
          data: modo==="idx" ? idx(s(k)) : s(k), lineStyle:{color:COL_DT[k],width:2}, itemStyle:{color:COL_DT[k]}}))}, true);
    };
    $("ds-evm").onclick = e => { const b=e.target.closest("button"); if(b) pinta(b.dataset.m); };
    pinta("abs");
    if(D.ex && D.ex.segmento_mes_L){
      const sm = D.ex.segmento_mes_L, km = ks, segs = ["adulto","estudiante","mayor","gratuito"];   // mismo eje de meses que el gráfico de arriba
      const cs = {adulto:"#2fb4ad", estudiante:"#f5b83d", mayor:"#9b8cff", gratuito:"#94a3b8"};
      chart("ds-seg").setOption({tooltip:{trigger:"axis",valueFormatter:v=>v==null?"—":fmt1(v)}, legend:{top:0,textStyle:{color:t.mid}}, grid:G({top:34}),
        xAxis:{type:"category", data:km, ...ejes(t)}, yAxis:{type:"value", scale:true, ...ejes(t, v=>fmt1(v))},
        series:segs.map(sg=>({name:tit(sg), type:"line", symbolSize:6, data:idx(km.map(k=>(sm[k]||{})[sg]||null)), lineStyle:{color:cs[sg],width:2}, itemStyle:{color:cs[sg]}}))});
    }
  }

  function dibuja(){
    esqueleto();
    document.querySelectorAll("#ds-subs button").forEach(b=>{ const on=b.dataset.s===S.sub; b.classList.toggle("on",on); b.setAttribute("aria-selected",on); });
    if(!D.sis){ $("ds-cuerpo").innerHTML = `<div class="kpi-note">Cargando la demanda…</div>`; return; }
    rotulosShell(true);
    $("ds-nota").innerHTML = D.sis._nota + (D.sis.dias_excluidos.length ? ` · ${D.sis.dias_excluidos.length} días excluidos por pérdida de datos de la fuente.` : "");
    ({sistema:vSistema, mapa:vMapa, od:vOD, metro:vMetro, experiencia:vExperiencia, evolucion:vEvol}[S.sub] || vSistema)();
  }

  async function carga(){
    const opc = n => J(n).catch(()=>null);
    const [sis, zon, od, met, gz, gc, ex, zx, mh] = await Promise.all([J("stgo_sistema.json"), J("stgo_zonas.json"), J("stgo_od.json"),
      J("demanda_metro.json").catch(()=>({estaciones:[]})), J("zonas777.geojson"), J(CITY.comunasGeojson), opc("stgo_extra.json"),
      opc("stgo_zonas_extra.json"), opc("stgo_metro_hist.json")]);
    D = {sis, zon, od, met, ex, mh, zx: zx || {zonas:{}, comunas:{}}}; geoZ = gz; geoC = gc;
  }
  let _cargando = null;
  window.DemStgo = { render(){ esqueleto(); if(!D.sis){ if(!_cargando) _cargando = carga().then(dibuja).catch(e=>{
      $("ds-cuerpo").innerHTML = `<div class="kpi-note">No se pudo cargar la demanda (${e})</div>`; }); dibuja(); return; } dibuja(); } };
  // los gráficos se crean con el ancho del momento: si la vista nace oculta o cambia el ancho, re-medir
  let _rz = null;
  window.addEventListener("resize", () => { clearTimeout(_rz); _rz = setTimeout(() => {
    Object.values(charts).forEach(c => { try{ c.resize(); }catch(e){} }); [mapa, mapaM, mapaT, mapaO].forEach(m => m && m.invalidateSize()); }, 120); });
  new MutationObserver(() => { if($("demanda-stgo-view") && $("demanda-stgo-view").style.display !== "none" && D.sis) dibuja(); })
    .observe(document.documentElement, {attributes:true, attributeFilter:["data-theme"]});
})();
