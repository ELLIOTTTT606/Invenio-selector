// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════
let state = {
  machineType: null, file: null, pdfFile: null, parsedData: null,
  selectedModel: null, selectedSize: null, selectedClient: null,
  region: "", contact: null, versionAcoustique: "standard",
  selectedOptions: {}, step: 0, dimensionImage: null,
};

// ══════════════════════════════════════════════
// STEP 0 — FILE HANDLING
// ══════════════════════════════════════════════
function handleCSD(f) {
  if (!f) return;
  const isDocx = f.name.match(/\.docx?$/i);
  const isPdf = f.name.match(/\.pdf$/i);
  if (!isDocx && !isPdf) { showMsg("error","Format non supporté. Importez un fichier .docx ou .pdf"); return; }
  state.file = f;
  state.fileType = isPdf ? "pdf" : "docx";
  const box = document.getElementById("dropCSD");
  box.classList.add("has-file");
  document.getElementById("icoCSD").textContent = "✅";
  document.getElementById("titleCSD").innerHTML = '<span class="fname">' + f.name + '</span>';
  document.getElementById("subCSD").textContent = (f.size/1024).toFixed(0) + " Ko — " + (isPdf ? "PDF" : "DOCX");
  hideMsg(); checkReady();
}

const dropCSD = document.getElementById("dropCSD");
dropCSD.addEventListener("dragover", e => { e.preventDefault(); dropCSD.style.borderColor = "#147888"; });
dropCSD.addEventListener("dragleave", () => { dropCSD.style.borderColor = ""; });
dropCSD.addEventListener("drop", e => { e.preventDefault(); dropCSD.style.borderColor = ""; handleCSD(e.dataTransfer.files[0]); });

// ══════════════════════════════════════════════
// STEP 0 — TYPE / MODEL / SIZE
// ══════════════════════════════════════════════
function selectType(type) {
  state.machineType = type;
  document.getElementById("choiceGEG").className = "choice-card" + (type==="CS"?" sel":"");
  document.getElementById("choicePAC").className = "choice-card" + (type==="HS"?" sel":"");
  const sel = document.getElementById("selModel");
  sel.innerHTML = '<option value="">— Choisir le modèle —</option>';
  sel.disabled = false;
  (MODELS_DB[type] || []).forEach(m => {
    const disabled = m.sizes.length === 0 ? ' disabled' : '';
    const label = m.sizes.length === 0 ? m.nom + ' (bientôt disponible)' : m.nom;
    sel.innerHTML += '<option value="' + m.gamme + '"' + disabled + '>' + label + '</option>';
  });
  document.getElementById("selSize").innerHTML = '<option value="">—</option>';
  document.getElementById("selSize").disabled = true;
  state.selectedModel = null; state.selectedSize = null;
  checkReady();
}

function onModelChange() {
  const gamme = document.getElementById("selModel").value;
  state.selectedModel = gamme || null;
  const selS = document.getElementById("selSize");
  if (!gamme) { selS.innerHTML = '<option value="">—</option>'; selS.disabled = true; checkReady(); return; }
  const model = (MODELS_DB[state.machineType] || []).find(m => m.gamme === gamme);
  selS.innerHTML = '<option value="">— Taille —</option>';
  (model ? model.sizes : []).forEach(s => { selS.innerHTML += '<option value="' + s + '">' + s + '</option>'; });
  selS.disabled = false;
  selS.onchange = () => { state.selectedSize = selS.value || null; checkReady(); };
  checkReady();
}

// ══════════════════════════════════════════════
// STEP 0 — CLIENTS
// ══════════════════════════════════════════════
async function loadClientsExcel(f) {
  if (!f) return;
  showMsg("success","⏳ Chargement des clients...");
  try {
    const data = await f.arrayBuffer();
    const wb = XLSX.read(data, {type:'array'});
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(ws, {header:1});
    let start = 0;
    if (rows.length > 0 && typeof rows[0][0] === 'string' && rows[0][0].toLowerCase().includes('code')) start = 1;
    CLIENTS = [];
    if (typeof TursoSync !== "undefined" && TursoSync.isConnected()) {
      DB.clients.bulkImport(CLIENTS).then(function(n) { console.log("✅ " + n + " clients synchronisés avec Turso"); });
    }
    for (let i = start; i < rows.length; i++) {
      const r = rows[i];
      if (r && r[0] && r[1]) CLIENTS.push([String(r[0]).trim(), String(r[1]).trim()]);
    }
    updateClientCount();
    showMsg("success","✅ " + CLIENTS.length.toLocaleString("fr-FR") + " clients importés — base actualisée");
    setTimeout(hideMsg, 2500);
  } catch(e) { showMsg("error","Erreur lecture Excel : " + e.message); }
}

async function searchClient(q) {
  const box = document.getElementById("clientResults");
  if (!q || q.length < 2) { box.classList.remove("open"); return; }
  var results;
  if (typeof TursoSync !== "undefined" && TursoSync.isConnected()) {
    results = await TursoSync.searchClients(q);
  } else {
    var ql = q.toLowerCase();
    results = CLIENTS.filter(function(c) { return c[0].toLowerCase().includes(ql) || c[1].toLowerCase().includes(ql); }).slice(0, 50);
  }
  if (results.length === 0) { box.innerHTML = '<div style="padding:10px;font-size:11px;color:#999">Aucun résultat</div>'; box.classList.add("open"); return; }
  box.innerHTML = results.map(function(c) {
    return '<div class="client-result" onclick="pickClient(\'' + c[0].replace(/'/g, "\\'") + '\',\'' + c[1].replace(/'/g, "\\'") + '\')"><span>' + c[1] + '</span><span class="code">' + c[0] + '</span></div>';
  }).join('');
  box.classList.add("open");
}

function pickClient(code, nom) {
  state.selectedClient = {code, nom};
  document.getElementById("clientResults").classList.remove("open");
  document.getElementById("clientSearch").value = "";
  document.getElementById("clientSelectedText").textContent = nom + " — " + code;
  document.getElementById("clientSelected").classList.add("visible");
  checkReady();
}

function clearClient() {
  state.selectedClient = null;
  document.getElementById("clientSelected").classList.remove("visible");
  checkReady();
}

document.addEventListener("click", e => {
  if (!e.target.closest(".client-search-wrap")) document.getElementById("clientResults").classList.remove("open");
});

// ══════════════════════════════════════════════
// STEP 0 — VALIDATION & ANALYZE
// ══════════════════════════════════════════════
function checkReady() {
  const ready = state.file && state.machineType && state.selectedModel && state.selectedSize;
  document.getElementById("btnGo").disabled = !ready;
}

async function analyzeAndGo() {
  hideMsg();
  document.getElementById("loader").style.display = "inline";
  document.getElementById("btnGo").disabled = true;
  try {
    if (state.fileType === "pdf") { showMsg("error","⚠️ Le parsing des fichiers PDF CSD n'est pas encore disponible. Veuillez exporter la fiche CSD au format .docx depuis le configurateur Galletti."); document.getElementById("loader").style.display="none"; checkReady(); return; }
    const data = await parseDocx(state.file);
    if (data._hasHeating && state.machineType === "CS") {
      showMsg("warning","⚠️ Ce fichier contient des données chauffage — type corrigé en PAC.");
      state.machineType = "HS"; selectType("HS");
    } else if (!data._hasHeating && state.machineType === "HS") {
      showMsg("warning","⚠️ Pas de données chauffage — type corrigé en Groupe d'Eau Glacée.");
      state.machineType = "CS"; selectType("CS");
    }
    data.type = state.machineType;
    data.size = state.selectedSize;
    state.parsedData = data;
    state.dimensionImage = data.dimensionImage;
    var missing = [];
    if (!data.modele) missing.push("modèle");
    if (!data.resultsFroid.puissanceFrigo && !data.resultsChaud) missing.push("puissances");
    if (!data.commonData.lwStandard) missing.push("données acoustiques");
    if (!data.date) missing.push("date");
    if (missing.length > 0) {
      showMsg("warning","⚠️ " + data.modele + " chargé, mais données incomplètes : " + missing.join(", ") + ". Le format du fichier a peut-être changé.");
      setTimeout(function() { offerCSDHelp(data, missing); }, 500);
    } else {
      showMsg("success","✅ " + data.modele + " — " + (data.type==="HS"?"PAC":"GEG") + " — Taille " + data.size);
    }
    setTimeout(() => goToStep(1), 800);
  } catch(e) {
    showMsg("error","Erreur : " + e.message); console.error(e);
  } finally {
    document.getElementById("loader").style.display = "none"; checkReady();
  }
}

// ══════════════════════════════════════════════
// NAVIGATION
// ══════════════════════════════════════════════
function goToStep(n) {
  if(n>=1&&!state.parsedData)return;
  state.step=n;
  ["step0","step1","step2","step3"].forEach((id,i)=>{const el=document.getElementById(id);if(el)el.classList.toggle("visible",i===n);});
  document.querySelectorAll(".nav-step").forEach(el=>{const s=parseInt(el.dataset.step);el.className="nav-step"+(s===n?" active":s<n?" done":" disabled");el.onclick=()=>{if(s<=n||(s<=3&&state.parsedData))goToStep(s);};});
  if(n===1)buildConfig();if(n===2)buildPreview();if(n===3)buildAdmin();
  window.scrollTo(0,0);
}

// ══════════════════════════════════════════════
// CONFIG (Step 1)
// ══════════════════════════════════════════════
function buildConfig() {
  const d=state.parsedData,isHS=d.type==="HS";
  document.getElementById("cfgTitle").innerHTML='<span style="color:var(--teal)">'+d.modele+'</span>';
  document.getElementById("cfgSub").textContent=(isHS?"🔥❄️ PAC":"❄️ GEG")+" • Taille "+d.size+" • "+(state.file ? state.file.name : d.modele || 'Projet rechargé');
  const sr=document.getElementById("selRegion");sr.innerHTML='<option value="">—</option>';
  Object.keys(CONFIG.contacts).forEach(r=>{sr.innerHTML+='<option value="'+r+'">'+r+'</option>';});
  if(state.region){sr.value=state.region;onRegionChange();}
  buildAcoustic();buildOptions();
}

function onRegionChange(){state.region=document.getElementById("selRegion").value;const sc=document.getElementById("selContact");sc.innerHTML='<option value="">—</option>';sc.disabled=!state.region;(CONFIG.contacts[state.region]||[]).forEach(c=>{sc.innerHTML+='<option value="'+c.nom+'">'+c.nom+" — "+c.poste+'</option>';});state.contact=null;document.getElementById("contactInfo").style.display="none";}
function onContactChange(){const n=document.getElementById("selContact").value;state.contact=(CONFIG.contacts[state.region]||[]).find(c=>c.nom===n)||null;const b=document.getElementById("contactInfo");if(state.contact){b.style.display="block";b.textContent="📞 "+state.contact.tel+" | ✉️ "+state.contact.email+" | "+state.contact.poste;}else b.style.display="none";}
function buildAcoustic(){const cd=state.parsedData.commonData;const vs=[{key:"standard",label:"Standard",desc:"Aucune isolation",lw:cd.lwStandard,lp:cd.lpStandard},{key:"silencieuse",label:"Silencieuse",desc:"Capot compresseur",lw:cd.lwSilencieuse,lp:cd.lpSilencieuse},{key:"ultra",label:"Ultra Silencieuse",desc:"Capot + ventil. BV",lw:cd.lwUltra,lp:cd.lpUltra}];const g=document.getElementById("acousticGrid");g.innerHTML="";vs.forEach(v=>{const c=document.createElement("div");c.className="acoustic-card"+(state.versionAcoustique===v.key?" selected":"");c.onclick=()=>{state.versionAcoustique=v.key;buildAcoustic();};c.innerHTML="<h4>"+v.label+'</h4><div class="desc">'+v.desc+'</div><div class="vals"><span class="lw">Lw '+(v.lw||"—")+' dB(A)</span><span class="lp">Lp '+(v.lp||"—")+" dB(A)</span></div>";g.appendChild(c);});}

function getPrice(o,sz){
  if(!sz||o.prix[sz]===undefined)return 0;
  var p=o.prix[sz];
  if(p==="?")return"Sur demande";
  var v=parseInt(p)||0;
  if(v===0){var allZero=CONFIG.sizes.every(function(s){return(parseInt(o.prix[s])||0)===0;});if(allZero)return 0;return"N.D";}
  return v;
}
function fmt(n){return n==="Sur demande"?n:n.toLocaleString("fr-FR");}

function buildOptions(){const d=state.parsedData,sz=d.size;const app=CONFIG.options.filter(o=>o.type.includes(d.type));const cats=[...new Set(app.map(o=>o.cat))];const c=document.getElementById("optionsContainer");c.innerHTML="";cats.forEach(cat=>{const items=app.filter(o=>o.cat===cat);const t=document.createElement("div");t.className="cat-title";t.textContent=cat;c.appendChild(t);const g=document.createElement("div");g.className="opt-grid";items.forEach(opt=>{const p=getPrice(opt,sz);const it=document.createElement("div");it.className="opt-item"+(state.selectedOptions[opt.id]?" checked":"");const ps=p==="Sur demande"?"Sur demande":p==="N.D"?"Non dispo.":p===0?"Inclus":fmt(p)+" €";const desc=OPTION_DESCRIPTIONS[opt.id]||"";it.innerHTML='<div class="opt-row"><div class="opt-left"><div class="opt-chk">'+(state.selectedOptions[opt.id]?"✓":"")+'</div><span>'+opt.nom+(opt.note?' <em class="opt-note">('+opt.note+')</em>':"")+'<span class="opt-expand">▶</span></span></div><span class="opt-prix">'+ps+'</span></div>'+(desc?'<div class="opt-desc">'+desc+'</div>':'');const chkArea=it.querySelector(".opt-row");chkArea.addEventListener("click",e=>{if(e.target.closest(".opt-expand")||e.detail===2)return;state.selectedOptions[opt.id]=!state.selectedOptions[opt.id];it.classList.toggle("checked");it.querySelector(".opt-chk").innerHTML=state.selectedOptions[opt.id]?"✓":"";updateTotal();});if(desc){const expBtn=it.querySelector(".opt-expand");expBtn.addEventListener("click",e=>{e.stopPropagation();it.classList.toggle("open");});}g.appendChild(it);});c.appendChild(g);});updateTotal();}
function updateTotal(){const d=state.parsedData,sz=d.size;const sel=CONFIG.options.filter(o=>state.selectedOptions[o.id]&&o.type.includes(d.type));let t=0,n=0,sd=false,nd=false;sel.forEach(o=>{const p=getPrice(o,sz);if(p==="Sur demande")sd=true;else if(p==="N.D")nd=true;else t+=p;n++;});document.getElementById("optTotal").textContent=n?n+" option"+(n>1?"s":"")+" • "+fmt(t)+" € HT"+(sd?" + sur demande":"")+(nd?" ⚠️ N.D pour cette taille":""):"";}

// ══════════════════════════════════════════════
// UTILITAIRES FICHE PLP
// ══════════════════════════════════════════════
function fmtPrix(n) {
  if (typeof n !== 'number' || isNaN(n)) return '—';
  return n.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function buildAcouWrap(lw_std, lw_ins, lw_ultra, lp_std, lp_ins, lp_ultra, versionKey, type) {
  var vals = type === 'lw' ? [lw_std, lw_ins, lw_ultra] : [lp_std, lp_ins, lp_ultra];
  var labels = ['Std','Inso','S-Inso'];
  var keys = ['standard','silencieuse','ultra'];
  var h = '<div class="plp-acou-wrap">';
  labels.forEach(function(lbl, i) {
    var active = keys[i] === versionKey ? 'active' : 'inactive';
    h += '<div class="plp-acou-col '+active+'"><span class="plp-acou-lbl">'+lbl+'</span><span class="plp-acou-val">'+(vals[i]||'—')+'</span></div>';
  });
  return h + '</div>';
}

function buildPumpWrap(d) {
  var hasLP  = state.selectedOptions['lp_pump'];
  var hasHP  = state.selectedOptions['hp_pump'];
  var hasLPD = state.selectedOptions['lp_double_pump'];
  var hasLPI = state.selectedOptions['lp_inverter'];
  var hasPump = hasLP || hasHP || hasLPD || hasLPI;
  var pdc = (d.resultsFroid && d.resultsFroid.perteCharge) ? d.resultsFroid.perteCharge : '—';
  var h = '<div class="plp-pump-wrap">';
  h += '<div class="plp-pump-card '+(hasPump?'plp-pump-off':'plp-pump-on')+'"><span class="plp-pump-icon">'+(hasPump?'✕':'●')+'</span><span class="plp-pump-lbl">Sans</span></div>';
  h += '<div class="plp-pump-card '+(hasLP||hasLPD||hasLPI?'plp-pump-on':'plp-pump-off')+'"><span class="plp-pump-icon">●</span><span class="plp-pump-lbl">BP</span><span class="plp-pump-data">'+pdc+' kPa</span></div>';
  h += '<div class="plp-pump-card '+(hasHP?'plp-pump-on':'plp-pump-off')+'"><span class="plp-pump-icon">●</span><span class="plp-pump-lbl">HP</span></div>';
  return h + '</div>';
}

// ══════════════════════════════════════════════
// PREVIEW (Step 2)
// Cover existante + pages fiche-selection-plp dynamiques
// ══════════════════════════════════════════════
function buildPreview() {
  const d = state.parsedData, isHS = d.type === "HS", sz = d.size;
  const numP = document.getElementById("inputNumProjet").value;
  const nomP = document.getElementById("inputNomProjet").value;
  const selOpts = CONFIG.options.filter(o => state.selectedOptions[o.id] && o.type.includes(d.type));
  let total = 0;
  selOpts.forEach(o => { const p = getPrice(o, sz); if (typeof p === "number") total += p; });
  const cl = state.selectedClient;
  const cd = d.commonData || {};
  const rf = d.resultsFroid || {};
  const rc = d.resultsChaud || {};
  const nomProjet = nomP || 'Projet';
  const refProjet = numP || '—';
  const clientNom = cl ? cl.nom : '—';
  const dateStr = d.date || new Date().toLocaleDateString("fr-FR");
  const modele = d.modele || ('PLP' + sz + (isHS ? 'HS' : 'CS'));
  const gammeShort = (d.gamme || 'PLP').split(' ')[0];

  // Helpers header/footer PLP
  function plpHdr() {
    return '<div class="plp-hdr">'
      + '<div class="plp-hdr-logo"><div class="plp-logo plp-logo-sm">'
      + '<span class="plp-logo-fa">FRANCE AIR</span>'
      + '<span class="plp-logo-sep">&times;</span>'
      + '<span class="plp-logo-inv">Invenio</span>'
      + '</div></div>'
      + '<div class="plp-hdr-r">'
      + '<div class="plp-hdr-proj">' + nomProjet + '</div>'
      + '<div class="plp-hdr-ref">' + refProjet + '</div>'
      + '</div></div>';
  }
  function plpFtr(label, num) {
    return '<div class="plp-ftr"><span>' + label.toUpperCase() + '</span><span>Page ' + num + '</span></div>';
  }
  function plpBand(num, titre, sous) {
    return '<div class="plp-band"><div class="plp-band-t">' + num + ' — ' + titre + '</div>'
      + (sous ? '<div class="plp-band-s">' + sous + '</div>' : '')
      + '</div>';
  }

  let h = "";

  // ══════════════════════════════════════════
  // PAGE 1 — COVER
  // ══════════════════════════════════════════
  var contact2 = null;
  if (state.contact && state.region) {
    var regionContacts = CONFIG.contacts[state.region] || [];
    contact2 = regionContacts.find(function(c) { return c.nom !== state.contact.nom; }) || null;
  }

  h += '<div class="cover" style="background-color:#1a3151!important">';
  h += '<div class="page-network"><svg width="100%" height="100%" viewBox="0 0 800 1130" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">';
  h += '<line x1="0" y1="150" x2="800" y2="500" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/><line x1="100" y1="0" x2="700" y2="1130" stroke="#ffffff" stroke-opacity="0.06" stroke-width="0.8"/><line x1="0" y1="800" x2="800" y2="300" stroke="#ffffff" stroke-opacity="0.07" stroke-width="0.8"/><line x1="300" y1="0" x2="100" y2="1130" stroke="#ffffff" stroke-opacity="0.05" stroke-width="0.7"/><line x1="0" y1="450" x2="800" y2="900" stroke="#ffffff" stroke-opacity="0.06" stroke-width="0.8"/><line x1="500" y1="0" x2="300" y2="1130" stroke="#ffffff" stroke-opacity="0.07" stroke-width="0.8"/><line x1="0" y1="1000" x2="800" y2="100" stroke="#ffffff" stroke-opacity="0.05" stroke-width="0.7"/><line x1="700" y1="0" x2="200" y2="1130" stroke="#ffffff" stroke-opacity="0.06" stroke-width="0.7"/><line x1="0" y1="600" x2="600" y2="0" stroke="#ffffff" stroke-opacity="0.08" stroke-width="0.8"/><line x1="200" y1="1130" x2="800" y2="700" stroke="#ffffff" stroke-opacity="0.05" stroke-width="0.7"/>';
  h += '<circle cx="200" cy="350" r="120" fill="#ffffff" fill-opacity="0.02"/><circle cx="600" cy="800" r="100" fill="#ffffff" fill-opacity="0.015"/><circle cx="400" cy="600" r="80" fill="#ffffff" fill-opacity="0.015"/>';
  h += '</svg></div>';
  h += '<div class="accent-bar"></div>';
  h += '<div class="header"><img class="company-logo" src="' + document.getElementById("asset_franceair_white").src + '" alt="France Air Invenio" /></div>';
  h += '<div class="title-section"><div class="title-label">Projet</div><h1 class="project-title">' + nomProjet + '</h1><div class="title-underline"></div></div>';
  h += '<div class="info-section"><div class="info-grid">';
  h += '<div class="info-card"><div class="info-label">Date</div><div class="info-value">' + dateStr + '</div></div>';
  h += '<div class="info-card"><div class="info-label">' + (state.region ? 'Région' : 'Localisation') + '</div><div class="info-value">' + (state.region || '—') + '</div></div>';
  h += '<div class="info-card"><div class="info-label">Client</div><div class="info-value">' + clientNom + '</div></div>';
  h += '</div><div class="info-row-2">';
  h += '<div class="info-card"><div class="info-label">Le Technico-Commercial Itinérant</div><div class="info-value">' + (state.contact ? state.contact.nom : '—') + '</div></div>';
  h += '<div class="info-card"><div class="info-label">Le Technico-Commercial Sédentaire</div><div class="info-value">' + (contact2 ? contact2.nom : '—') + '</div></div>';
  h += '</div></div>';
  h += '<div class="separator"></div>';
  h += '<div class="product-section"><div class="product-hero">';
  h += '<svg class="arc-svg" viewBox="0 0 1000 600" preserveAspectRatio="none"><path d="M 1000 0 L 1000 600 C 900 600, 720 500, 690 300 C 720 100, 900 0, 1000 0 Z" fill="#1a3151"/><defs><clipPath id="arcClipLines"><path d="M 1000 0 L 1000 600 C 900 600 720 500 690 300 C 720 100 900 0 1000 0 Z"/></clipPath></defs><g clip-path="url(#arcClipLines)"><line x1="650" y1="0" x2="1000" y2="400" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/><line x1="700" y1="600" x2="1000" y2="100" stroke="#ffffff" stroke-opacity="0.06" stroke-width="0.8"/><line x1="680" y1="200" x2="1000" y2="550" stroke="#ffffff" stroke-opacity="0.07" stroke-width="0.8"/><line x1="750" y1="0" x2="850" y2="600" stroke="#ffffff" stroke-opacity="0.05" stroke-width="0.7"/></g></svg>';
  h += '<div class="hero-shine"></div><div class="particle p1"></div><div class="particle p2"></div><div class="particle p3"></div><div class="particle p4"></div>';
  h += '<div class="plp-title">' + gammeShort + ' <span class="plp-size">' + (sz || '') + '</span></div>';
  h += '<div class="side-brand">INVENIO × GALLETTI</div>';
  h += '<div class="machine-wrapper"><div class="machine-glow"></div><div class="machine-reflect"></div>';
  h += '<svg class="tech-lines" viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="80" stroke="rgba(27,161,164,0.15)" stroke-width="0.5" stroke-dasharray="4 6"/><circle cx="100" cy="100" r="60" stroke="rgba(27,79,114,0.1)" stroke-width="0.3" stroke-dasharray="3 8"/></svg>';
  h += '<img class="machine-image" src="' + document.getElementById("asset_machine").src + '" alt="' + modele + '" /></div>';
  h += '<div class="cert-stack"><img class="cert-img-eurovent" src="' + document.getElementById("asset_eurovent").src + '" alt="Eurovent" /><img class="cert-img-r290" src="' + document.getElementById("asset_r290").src + '" alt="R290" /></div>';
  h += '</div></div>';
  h += '<div class="footer-line"></div>';
  h += '<div class="footer"><div class="footer-left"><span class="footer-brand">INVENIO × GALLETTI</span>  —  Solutions thermodynamiques</div><div class="footer-right">Document confidentiel  ·  Page 1</div></div>';
  h += '</div>'; // .cover

  // ══════════════════════════════════════════
  // PAGE 2 — SOMMAIRE
  // ══════════════════════════════════════════
  h += '<div class="plp-pg" style="padding:0;background:var(--plp-cr)">';
  h += '<div class="plp-som">';
  h += '<div class="plp-som-l"><div class="plp-som-txt">SOMMAIRE</div></div>';
  h += '<div class="plp-som-r">';
  ['TABLEAU COMPARATIF','PRESCRIPTION TECHNIQUE','OPTIONS ET ACCESSOIRES','PLANS DIMENSIONNELS','VISUELS PRODUIT'].forEach(function(lbl, i) {
    h += '<div class="plp-som-item"><span class="plp-som-lbl">'+lbl+'</span><span class="plp-som-num">0'+(i+1)+'.</span></div>';
  });
  h += '</div>';
  h += '<div class="plp-som-logo"><div class="plp-logo"><span class="plp-logo-fa">FRANCE AIR</span><span class="plp-logo-sep">&times;</span><span class="plp-logo-inv">Invenio</span></div></div>';
  h += '</div></div>';

  // ══════════════════════════════════════════
  // PAGE 3 — TABLEAU COMPARATIF
  // ══════════════════════════════════════════
  var typeLabel = isHS ? 'PAC réversible — R290' : "Groupe d'eau glacée — R290";
  var sousTitre = isHS ? "PAC réversible air-eau R290" : "Groupe d'eau glacée air-eau R290";

  h += '<div class="plp-pg">';
  h += plpHdr();
  h += plpBand('01', 'Tableau comparatif', 'Gamme PLP — ' + sousTitre);
  h += '<table class="plp-tb"><thead><tr><th class="plp-lc">PARAMETRE</th><th><span class="plp-thr">'+modele+'</span><span class="plp-thc">'+typeLabel+'</span></th></tr></thead><tbody>';

  // Refroidissement
  h += '<tr class="plp-gr"><td colspan="2">Refroidissement</td></tr>';
  if (d.refroidissement) {
    h += '<tr><td class="plp-lc">Conditions eau entrée / sortie</td><td>'+(d.refroidissement.tempEntreeEau||'—')+' / '+(d.refroidissement.tempSortieEau||'—')+'<span class="plp-unit"> °C</span></td></tr>';
    h += '<tr><td class="plp-lc">Température air extérieur</td><td>'+(d.refroidissement.tempAirExt||'—')+'<span class="plp-unit"> °C</span></td></tr>';
    h += '<tr><td class="plp-lc">Humidité air extérieur</td><td>'+(d.refroidissement.humiditeRel||'—')+'<span class="plp-unit"> %</span></td></tr>';
  }
  h += '<tr><td class="plp-lc">Puissance frigorifique</td><td style="font-size:11px;font-weight:700">'+(rf.puissanceFrigo||'—')+'<span class="plp-unit"> kW</span></td></tr>';
  h += '<tr><td class="plp-lc">Puissance absorbée</td><td>'+(rf.puissAbsTotale||'—')+'<span class="plp-unit"> kW</span></td></tr>';
  h += '<tr><td class="plp-lc">EER</td><td>'+(rf.eer||'—')+'<span class="plp-unit"> W/W</span></td></tr>';
  h += '<tr><td class="plp-lc">SEER</td><td>'+(rf.seer||'—')+'<span class="plp-unit"> Wh/Wh</span></td></tr>';

  // Chauffage (PAC)
  if (isHS) {
    h += '<tr class="plp-gr"><td colspan="2">Chauffage</td></tr>';
    if (d.chauffage) {
      h += '<tr><td class="plp-lc">Conditions eau entrée / sortie</td><td>'+(d.chauffage.tempEntreeEau||'—')+' / '+(d.chauffage.tempSortieEau||'—')+'<span class="plp-unit"> °C</span></td></tr>';
      h += '<tr><td class="plp-lc">Température air extérieur</td><td>'+(d.chauffage.tempAirExt||'—')+'<span class="plp-unit"> °C</span></td></tr>';
      h += '<tr><td class="plp-lc">Humidité air extérieur</td><td>'+(d.chauffage.humiditeRel||'—')+'<span class="plp-unit"> %</span></td></tr>';
    }
    h += '<tr><td class="plp-lc">Puissance calorifique</td><td style="font-size:11px;font-weight:700">'+(rc.puissanceChauffage||'—')+'<span class="plp-unit"> kW</span></td></tr>';
    h += '<tr><td class="plp-lc">Puissance absorbée</td><td>'+(rc.puissAbsTotale||'—')+'<span class="plp-unit"> kW</span></td></tr>';
    h += '<tr><td class="plp-lc">COP</td><td>'+(rc.cop||'—')+'<span class="plp-unit"> W/W</span></td></tr>';
    h += '<tr><td class="plp-lc">SCOP</td><td>'+(rc.scop||'—')+'<span class="plp-unit"> Wh/Wh</span></td></tr>';
    h += '<tr><td class="plp-lc">Efficacité saisonnière Eta s</td><td>'+(rc.etasH||'—')+'</td></tr>';
  }

  // Hydraulique
  h += '<tr class="plp-gr"><td colspan="2">Hydraulique</td></tr>';
  h += '<tr><td class="plp-lc">Débit d\'eau</td><td>'+(rf.debitEau||'—')+'<span class="plp-unit"> m³/h</span></td></tr>';
  h += '<tr><td class="plp-lc">Pertes de charge réseau</td><td>'+(rf.perteCharge||'—')+'<span class="plp-unit"> kPa</span></td></tr>';
  h += '<tr><td class="plp-lc">Pompe intégrée</td><td>'+buildPumpWrap(d)+'</td></tr>';

  // Electrique
  h += '<tr class="plp-gr"><td colspan="2">Électrique</td></tr>';
  h += '<tr><td class="plp-lc">Courant absorbé max (FLA)</td><td>'+(cd.maxCourant||'—')+'<span class="plp-unit"> A</span></td></tr>';
  h += '<tr><td class="plp-lc">Courant de démarrage (LRA)</td><td>'+(cd.courantDemarrage||'—')+'<span class="plp-unit"> A</span></td></tr>';
  h += '<tr><td class="plp-lc">Alimentation</td><td>'+(d.alimentation||'400 V / 3+N / 50 Hz')+'</td></tr>';

  // Acoustique
  h += '<tr class="plp-gr"><td colspan="2">Acoustique</td></tr>';
  h += '<tr><td class="plp-lc">Puissance acoustique Lw</td><td>';
  h += buildAcouWrap(cd.lwStandard,cd.lwSilencieuse,cd.lwUltra,cd.lpStandard,cd.lpSilencieuse,cd.lpUltra,state.versionAcoustique,'lw');
  h += '<span class="plp-unit" style="display:block;text-align:center;margin-top:2px">dB(A)</span></td></tr>';
  h += '<tr><td class="plp-lc">Pression acoustique Lp (10 m)</td><td>';
  h += buildAcouWrap(cd.lwStandard,cd.lwSilencieuse,cd.lwUltra,cd.lpStandard,cd.lpSilencieuse,cd.lpUltra,state.versionAcoustique,'lp');
  h += '<span class="plp-unit" style="display:block;text-align:center;margin-top:2px">dB(A)</span></td></tr>';

  // Réfrigérant & divers
  h += '<tr class="plp-gr"><td colspan="2">Réfrigérant &amp; divers</td></tr>';
  h += '<tr><td class="plp-lc">Fluide frigorigène</td><td>'+(d.refrigerant||'R290 (propane)')+'</td></tr>';
  h += '<tr><td class="plp-lc">GWP</td><td>'+(d.gwp||'3')+'</td></tr>';
  h += '<tr><td class="plp-lc">Compresseurs</td><td>'+(cd.compresseursCircuits||'—')+'</td></tr>';
  h += '<tr><td class="plp-lc">Ventilateurs</td><td>'+(cd.nbVentilateurs||'—')+'</td></tr>';
  h += '<tr><td class="plp-lc">Débit d\'air</td><td>'+(cd.debitAir||'—')+'<span class="plp-unit"> m³/h</span></td></tr>';
  h += '<tr><td class="plp-lc">Poids sans options</td><td>'+(d.poids||'—')+'<span class="plp-unit"> kg</span></td></tr>';
  h += '</tbody></table>';
  h += plpFtr('TABLEAU COMPARATIF', 3);
  h += '</div>';

  // ══════════════════════════════════════════
  // PAGE 4 — PRESCRIPTION TECHNIQUE
  // ══════════════════════════════════════════
  var acouLabel = {standard:'Standard', silencieuse:'Silencieuse', ultra:'Super insonorisée'}[state.versionAcoustique] || 'Standard';

  h += '<div class="plp-pg">';
  h += plpHdr();
  h += plpBand('02','Prescription technique', modele+' — '+(isHS?'PAC air-eau réversible R290':"Groupe d'eau glacée R290"));
  h += '<div class="plp-presc">';
  h += '<div class="plp-pb"><div class="plp-pb-t">Structure et carrosserie</div><div class="plp-pb-x">Chassis et habillage en tôle galvanisée, peinte poudre époxy polyester texturée (RAL 9002), pour installation extérieure. Fixations inox traité anticorrosion. Accès compartiment technique par 3 panneaux démontables.</div></div>';
  h += '<div class="plp-pb"><div class="plp-pb-t">Configuration acoustique</div><div class="plp-pb-x">Version retenue : <strong>'+acouLabel+'</strong>.<br/>Trois niveaux disponibles :<br/><div class="plp-li">Standard</div><div class="plp-li">Insonorisée : capuchons HP sur compresseurs</div><div class="plp-li">Super insonorisée : capuchons + ventilateurs BV</div>Isolation vibrations en option (élastomères ou ressorts).</div></div>';
  h += '<div class="plp-pb"><div class="plp-pb-t">Réfrigérant R290</div><div class="plp-pb-x">Propane naturel, PRG = 3. Charge réduite 40 % vs traditionnel. CO₂ équiv. : PLP037H 0,0084 t · PLP045H 0,0086 t · PLP052H 0,0118 t · PLP057H 0,0126 t · PLP062H 0,0140 t.</div></div>';
  h += '<div class="plp-pb"><div class="plp-pb-t">Compresseur</div><div class="plp-pb-x">Scroll inverter brushless aimants permanents. Adapte sa vitesse en temps réel.<br/><div class="plp-li">80 °C jusqu\'à −5 °C ext.</div><div class="plp-li">75 °C jusqu\'à −10 °C ext.</div><div class="plp-li">60 °C jusqu\'à −20 °C ext.</div></div></div>';
  h += '<div class="plp-pb"><div class="plp-pb-t">Échangeurs</div><div class="plp-pb-x">Côté eau : plaques soudo-brasées inox AISI 316, canaux asymétriques. Option : récupération chaleur 25 %.<br/>Côté air : tubes cuivre 7 mm, ailettes alu, espacement 2,1 mm, hydrophile de série. Époxy en option.</div></div>';
  h += '<div class="plp-pb"><div class="plp-pb-t">Circuit frigorifique</div><div class="plp-pb-x"><div class="plp-li">Échangeur plaques inox AISI 316</div><div class="plp-li">Condenseur ailettes cuivre 7 mm</div><div class="plp-li">Filtre déshydrateur + témoin de flux</div><div class="plp-li">Vanne détente électronique</div>'+(isHS?'<div class="plp-li">Vanne inversion cycle (PAC)</div>':'')+'<div class="plp-li">Pressostats HP + transducteurs</div>Option : récupération chaleur 25 %.</div></div>';
  h += '<div class="plp-pb"><div class="plp-pb-t">Circuit hydraulique</div><div class="plp-pb-x">Raccords filetés, purges, vanne sécurité 6 bar, sonde antigel. Tuyaux cuivre. Pompage en option (simple, relève, variable). Ballon intégrable, isolation &gt;19 mm. Options : kit antigel, débitmètre, défangateur.</div></div>';
  h += '<div class="plp-pb"><div class="plp-pb-t">Tableau électrique</div><div class="plp-pb-x">IP54, EN 60204 CE. '+(d.alimentation||'400 V / 3+N / 50 Hz')+'. Câblage numéroté.</div></div>';
  h += '<div class="plp-pb"><div class="plp-pb-t">Contrôleur microprocesseur</div><div class="plp-pb-x">IP65. LAN 6 unités. RS485 Modbus, Ethernet pCOWeb. Programmation horaire, Low Noise, Smart Grid, anti-légionellose. Capteur ATEX R290 double seuil (15 ans). 1er seuil : ventilation forcée. 2e : coupure alimentation.</div></div>';
  h += '</div>';
  h += plpFtr('PRESCRIPTION TECHNIQUE', 4);
  h += '</div>';

  // ══════════════════════════════════════════
  // PAGE 5 — OPTIONS ET ACCESSOIRES
  // ══════════════════════════════════════════
  h += '<div class="plp-pg">';
  h += plpHdr();
  h += plpBand('03','Options et accessoires','Prix HT par taille — mis à jour depuis la base Galletti');

  var allOpts = CONFIG.options.filter(function(o) { return o.type.includes(d.type); });
  var cats2 = [], catMap = {};
  allOpts.forEach(function(o) {
    if (!catMap[o.cat]) { catMap[o.cat] = []; cats2.push(o.cat); }
    catMap[o.cat].push(o);
  });

  cats2.forEach(function(cat) {
    h += '<div class="plp-cat">'+cat+'</div>';
    catMap[cat].forEach(function(opt) {
      var isSel = !!state.selectedOptions[opt.id];
      var p = getPrice(opt, sz);
      var pHT = typeof p === 'number' ? (p === 0 ? 'Inclus' : fmt(p)+' € HT') : p;
      var pTTC = (typeof p === 'number' && p > 0) ? fmtPrix(p*1.2)+' € TTC' : '';
      var desc = (typeof OPTION_DESCRIPTIONS !== 'undefined' && OPTION_DESCRIPTIONS[opt.id]) ? OPTION_DESCRIPTIONS[opt.id] : '';
      h += '<div class="plp-opt '+(isSel?'plp-sel':'plp-unsel')+'">';
      h += '<div class="plp-opt-info"><div class="plp-opt-name">'+opt.nom+'</div>';
      if (desc) h += '<div class="plp-opt-desc">'+desc+'</div>';
      h += '</div>';
      h += '<div class="plp-opt-prix"><div class="plp-opt-ht">'+pHT+'</div>'+(pTTC?'<div class="plp-opt-ttc">'+pTTC+'</div>':'')+'</div>';
      h += '<div class="plp-opt-chk"><div class="plp-chkbox'+(isSel?' checked':'')+'">'+( isSel?'&#10003;':'')+'</div><div class="plp-chk-lbl">'+(isSel?'Retenu':'')+'</div></div>';
      h += '</div>';
    });
  });

  // Récap options sélectionnées
  if (selOpts.length > 0) {
    h += '<div class="plp-recap"><div class="plp-recap-t">Récapitulatif des options sélectionnées</div>';
    h += '<table class="plp-recap-tb"><thead><tr><th>Option</th><th style="text-align:right">Prix HT</th><th style="text-align:right">TVA 20%</th><th style="text-align:right">Prix TTC</th></tr></thead><tbody>';
    var totalHT = 0;
    selOpts.forEach(function(o) {
      var p = getPrice(o, sz);
      var px = typeof p === 'number' ? p : 0;
      totalHT += px;
      h += '<tr><td>'+o.nom+'</td><td style="text-align:right">'+(px?fmt(px)+' €':'Sur devis')+'</td><td style="text-align:right">'+(px?fmtPrix(px*0.2)+' €':'—')+'</td><td style="text-align:right">'+(px?fmtPrix(px*1.2)+' €':'—')+'</td></tr>';
    });
    h += '<tr class="plp-recap-total"><td>TOTAL OPTIONS</td><td style="text-align:right">'+fmtPrix(totalHT)+' €</td><td style="text-align:right">'+fmtPrix(totalHT*0.2)+' €</td><td style="text-align:right">'+fmtPrix(totalHT*1.2)+' €</td></tr>';
    h += '</tbody></table></div>';
  }

  h += plpFtr('OPTIONS ET ACCESSOIRES', 5);
  h += '</div>';

  // ══════════════════════════════════════════
  // PAGE 6 — PLANS DIMENSIONNELS
  // ══════════════════════════════════════════
  h += '<div class="plp-pg">';
  h += plpHdr();
  h += plpBand('04','Plans dimensionnels',modele+' — Export Galletti CSD');
  if (state.dimensionImage) {
    h += '<div style="text-align:center;padding:8px 0"><img src="'+state.dimensionImage+'" style="max-width:100%;border:1px solid #ddd" /></div>';
    h += '<div class="plp-cap">Plan issu de l\'export Galletti CSD — '+modele+' — '+dateStr+'</div>';
  } else {
    h += '<div class="plp-iz">[ Plan dimensionnel — '+modele+' ]<br/><br/>À remplacer par l\'image issue de l\'export CSD</div>';
    h += '<div class="plp-cap">Plan issu de l\'export Galletti CSD — '+modele+' — '+dateStr+'</div>';
  }
  h += plpFtr('PLANS DIMENSIONNELS', 6);
  h += '</div>';

  // ══════════════════════════════════════════
  // PAGE 7 — VISUELS PRODUIT
  // ══════════════════════════════════════════
  h += '<div class="plp-pg">';
  h += plpHdr();
  h += plpBand('05','Visuels produit',modele+' — Configuration retenue');
  var assetM = document.getElementById("asset_machine");
  if (assetM && assetM.src && assetM.src.length > 100) {
    h += '<div style="text-align:center;padding:16px 0"><img src="'+assetM.src+'" style="max-width:80%;max-height:160mm;object-fit:contain" /></div>';
  } else {
    h += '<div class="plp-iz">[ Visuel produit — '+modele+' ]<br/><br/>À remplacer par le visuel Galletti</div>';
  }
  h += '<div class="plp-cap">'+modele+' — '+(isHS?'PAC réversible R290':"Groupe d'eau glacée R290")+' — Configuration retenue</div>';
  h += plpFtr('VISUELS PRODUIT', 7);
  h += '</div>';

  document.getElementById("sheetContent").innerHTML = h;
}

// ══════════════════════════════════════════════
// ADMIN (Step 3)
// ══════════════════════════════════════════════
function buildAdmin(){let h='<div class="admin-intro">Gérez les données de l\'application : importez un fichier Excel pour mettre à jour les prix, ou consultez les données actuelles.</div>';h+='<div class="card"><div class="card-title">📥 Mise à jour des prix</div>';h+='<div class="admin-import" onclick="document.getElementById(\'filePrices\').click()"><h4>Importer un fichier Excel de prix</h4><p>Remplace les prix actuels pour la session en cours</p></div>';h+='<input type="file" id="filePrices" accept=".xlsx,.xls" style="display:none" onchange="loadPricesExcel(this.files[0])">';h+='<div class="admin-format"><b>Format attendu du fichier Excel :</b><br>';h+='• Feuille 1 : <b>C-version</b> (groupes d\'eau glacée) — Feuille 2 : <b>H-version</b> (PAC)<br>';h+='• Colonne A : Code option — Colonne B : Désignation<br>';h+='• Colonnes D à H : Prix par taille (037, 045, 052, 057, 062)<br>';h+='• Structure identique au fichier <b>08-PLP_2025-C-H.xlsx</b> fourni par Galletti<br><br>';h+='<b>💡 Astuce :</b> Demandez à l\'assistant IA (💬 en bas à droite) si vous avez un doute sur le format !</div></div>';h+='<div class="card"><div class="card-title">Contacts</div>';Object.keys(CONFIG.contacts).forEach(r=>{h+='<div class="admin-region">'+r+'</div><table class="admin-tbl"><thead><tr><th>Nom</th><th>Poste</th><th>Tél</th><th>Email</th></tr></thead><tbody>';CONFIG.contacts[r].forEach(c=>{h+='<tr><td>'+c.nom+'</td><td>'+c.poste+'</td><td>'+c.tel+'</td><td>'+c.email+'</td></tr>';});h+='</tbody></table>';});h+='</div>';h+='<div class="card"><div class="card-title">Prix options</div>';const cats=[...new Set(CONFIG.options.map(o=>o.cat))];cats.forEach(cat=>{h+='<div class="admin-region">'+cat+'</div><table class="admin-tbl"><thead><tr><th style="width:40%">Option</th><th>037</th><th>045</th><th>052</th><th>057</th><th>062</th></tr></thead><tbody>';CONFIG.options.filter(o=>o.cat===cat).forEach(o=>{h+='<tr><td>'+o.nom+'</td>';CONFIG.sizes.forEach(s=>{h+='<td>'+(o.prix[s]||0)+'</td>';});h+='</tr>';});h+='</tbody></table>';});h+='</div>';if(CLIENTS.length){h+='<div class="card"><div class="card-title">Clients ('+CLIENTS.length.toLocaleString("fr-FR")+')</div><p style="font-size:11px;color:#8896a6">Base chargée depuis Excel. Premiers 20 :</p><table class="admin-tbl"><thead><tr><th>Code</th><th>Nom</th></tr></thead><tbody>';CLIENTS.slice(0,20).forEach(c=>{h+='<tr><td>'+c[0]+'</td><td>'+c[1]+'</td></tr>';});h+='</tbody></table></div>';}document.getElementById("adminContent").innerHTML=h;}

// ══════════════════════════════════════════════
// MESSAGES & RESET
// ══════════════════════════════════════════════
function showMsg(t,m){hideMsg();const el=document.getElementById("msg");el.className="msg "+t+" visible";el.innerHTML=m;}
function hideMsg(){document.getElementById("msg").className="msg";}
function resetAll(){state={machineType:null,file:null,pdfFile:null,parsedData:null,selectedModel:null,selectedSize:null,selectedClient:null,region:"",contact:null,versionAcoustique:"standard",selectedOptions:{},step:0,dimensionImage:null};["dropCSD","dropPDF"].forEach(id=>{const b=document.getElementById(id);if(b)b.classList.remove("has-file");});document.getElementById("icoCSD").textContent="📄";document.getElementById("titleCSD").textContent="Fiche CSD (.docx)";document.getElementById("subCSD").textContent="Fichier de sélection Galletti";document.getElementById("choiceGEG").className="choice-card";document.getElementById("choicePAC").className="choice-card";document.getElementById("selModel").innerHTML='<option value="">— Sélectionner le type d\'abord —</option>';document.getElementById("selModel").disabled=true;document.getElementById("selSize").innerHTML='<option value="">—</option>';document.getElementById("selSize").disabled=true;document.getElementById("fileCSD").value="";clearClient();hideMsg();checkReady();goToStep(0);}

// ══════════════════════════════════════════════
// CLIENT: saisie manuelle
// ══════════════════════════════════════════════
function onManualClient(val) {
  if (val.trim().length > 0) {
    state.selectedClient = { code: "MANUEL", nom: val.trim() };
    document.getElementById("clientSelected").classList.remove("visible");
    document.getElementById("clientSearch").value = "";
  } else {
    if (state.selectedClient && state.selectedClient.code === "MANUEL") state.selectedClient = null;
  }
  checkReady();
}

const _origPickClient = pickClient;
pickClient = function(code, nom) { document.getElementById("clientManual").value = ""; _origPickClient(code, nom); };
const _origClearClient = clearClient;
clearClient = function() { document.getElementById("clientManual").value = ""; _origClearClient(); };

// ══════════════════════════════════════════════
// CLIENT: compteur
// ══════════════════════════════════════════════
function updateClientCount() {
  document.getElementById("clientCount").textContent = "📦 " + CLIENTS.length.toLocaleString("fr-FR") + " clients en base";
  document.getElementById("clientSearch").placeholder = "Rechercher parmi " + CLIENTS.length.toLocaleString("fr-FR") + " clients...";
}

// ══════════════════════════════════════════════
// RAPPEL MENSUEL
// ══════════════════════════════════════════════
function isFirstMondayOfMonth() { const t=new Date(); return t.getDay()===1&&t.getDate()<=7; }
function checkMonthlyReminder() {
  const key="plp_reminder_dismissed",now=new Date(),mk=now.getFullYear()+"-"+(now.getMonth()+1);
  try { if(localStorage.getItem(key)===mk)return; } catch(e){}
  if(isFirstMondayOfMonth()){const m=document.getElementById("updateReminder");if(m)m.style.display="flex";}
}
function dismissReminder() {
  const m=document.getElementById("updateReminder");if(m)m.style.display="none";
  try{const n=new Date();localStorage.setItem("plp_reminder_dismissed",n.getFullYear()+"-"+(n.getMonth()+1));}catch(e){}
}

// ══════════════════════════════════════════════
// EXCEL PRICE IMPORT
// ══════════════════════════════════════════════
async function loadPricesExcel(f) {
  if (!f) return;
  showMsg("success","⏳ Lecture du fichier prix...");
  try {
    var data=await f.arrayBuffer(),wb=XLSX.read(data,{type:"array"});
    var cSheet=wb.Sheets["C-version"]||wb.Sheets[wb.SheetNames[0]];
    var hSheet=wb.Sheets["H-version"]||wb.Sheets[wb.SheetNames[1]];
    var updated=0;
    [cSheet,hSheet].forEach(function(ws){
      if(!ws)return;
      XLSX.utils.sheet_to_json(ws,{header:1}).forEach(function(row){
        if(!row[1])return;
        var des=String(row[1]).trim().toLowerCase();
        CONFIG.options.forEach(function(opt){
          if(des.includes(opt.nom.toLowerCase())||opt.nom.toLowerCase().includes(des)){
            var np={},si={3:"037",4:"045",5:"052",6:"057",7:"062"};
            for(var ci in si){var v=row[parseInt(ci)];if(v!==undefined&&v!==null&&v!==""){np[si[ci]]=typeof v==="number"?v:parseInt(String(v).replace(/[^\d]/g,""))||0;}}
            if(Object.keys(np).length>0){Object.assign(opt.prix,np);updated++;}
          }
        });
      });
    });
    showMsg("success","✅ "+updated+" prix mis à jour pour cette session.");
    if(typeof TursoSync!=="undefined"&&TursoSync.isConnected()){TursoSync.savePrices().then(function(){showMsg("success","✅ Prix sauvegardés dans Turso.");});}
    if(state.step===1&&state.parsedData)buildOptions();
    if(state.step===3)buildAdmin();
  } catch(e){showMsg("error","Erreur : "+e.message);}
}

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
updateClientCount();
checkMonthlyReminder();

if (typeof TursoSync !== "undefined") {
  TursoSync.init().then(function(ok) { if(ok){updateClientCount();console.log("🟢 App synchronisée avec Turso");} });
}

(async function() {
  if (typeof TursoSync !== 'undefined') await TursoSync.init();
  if (typeof ProjetSave !== 'undefined') await ProjetSave.loadFromURL();
})();
