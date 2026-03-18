
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

// Drag & drop
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
  // Populate models
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
    // Skip header if first row looks like headers
    let start = 0;
    if (rows.length > 0 && typeof rows[0][0] === 'string' && rows[0][0].toLowerCase().includes('code')) start = 1;
    CLIENTS = [];
    for (let i = start; i < rows.length; i++) {
      const r = rows[i];
      if (r && r[0] && r[1]) CLIENTS.push([String(r[0]).trim(), String(r[1]).trim()]);
    }
    updateClientCount();
    showMsg("success","✅ " + CLIENTS.length.toLocaleString("fr-FR") + " clients importés — base actualisée");
    setTimeout(hideMsg, 2500);
  } catch(e) {
    showMsg("error","Erreur lecture Excel : " + e.message);
  }
}

async function searchClient(q) {
  const box = document.getElementById("clientResults");
  if (!q || q.length < 2) { box.classList.remove("open"); return; }
 
  // Utilise TursoSync si disponible (recherche serveur), sinon local
  var results;
  if (typeof TursoSync !== "undefined" && TursoSync.isConnected()) {
    results = await TursoSync.searchClients(q);
  } else {
    var ql = q.toLowerCase();
    results = CLIENTS.filter(function(c) {
      return c[0].toLowerCase().includes(ql) || c[1].toLowerCase().includes(ql);
    }).slice(0, 50);
  }
 
  if (results.length === 0) {
    box.innerHTML = '<div style="padding:10px;font-size:11px;color:#999">Aucun résultat</div>';
    box.classList.add("open");
    return;
  }
 
  box.innerHTML = results.map(function(c) {
    return '<div class="client-result" onclick="pickClient(\'' +
      c[0].replace(/'/g, "\\'") + '\',\'' +
      c[1].replace(/'/g, "\\'") +
      '\')"><span>' + c[1] + '</span><span class="code">' + c[0] + '</span></div>';
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

// Close results when clicking outside
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
    // Auto-detect type mismatch
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
    // Check for missing critical data
    var missing = [];
    if (!data.modele) missing.push("modèle");
    if (!data.resultsFroid.puissanceFrigo && !data.resultsChaud) missing.push("puissances");
    if (!data.commonData.lwStandard) missing.push("données acoustiques");
    if (!data.date) missing.push("date");
    
    if (missing.length > 0) {
      showMsg("warning","⚠️ " + data.modele + " chargé, mais données incomplètes : " + missing.join(", ") + ". Le format du fichier a peut-être changé.");
      // Offer AI help
      setTimeout(function() {
        offerCSDHelp(data, missing);
      }, 500);
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
  document.getElementById("cfgSub").textContent=(isHS?"🔥❄️ PAC":"❄️ GEG")+" • Taille "+d.size+" • "+state.file.name;
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
return v;}
function fmt(n){return n==="Sur demande"?n:n.toLocaleString("fr-FR");}
function buildOptions(){const d=state.parsedData,sz=d.size;const app=CONFIG.options.filter(o=>o.type.includes(d.type));const cats=[...new Set(app.map(o=>o.cat))];const c=document.getElementById("optionsContainer");c.innerHTML="";cats.forEach(cat=>{const items=app.filter(o=>o.cat===cat);const t=document.createElement("div");t.className="cat-title";t.textContent=cat;c.appendChild(t);const g=document.createElement("div");g.className="opt-grid";items.forEach(opt=>{const p=getPrice(opt,sz);const it=document.createElement("div");it.className="opt-item"+(state.selectedOptions[opt.id]?" checked":"");const ps=p==="Sur demande"?"Sur demande":p==="N.D"?"Non dispo.":p===0?"Inclus":fmt(p)+" €";const desc=OPTION_DESCRIPTIONS[opt.id]||"";it.innerHTML='<div class="opt-row"><div class="opt-left"><div class="opt-chk">'+(state.selectedOptions[opt.id]?"✓":"")+'</div><span>'+opt.nom+(opt.note?' <em class="opt-note">('+opt.note+')</em>':"")+'<span class="opt-expand">▶</span></span></div><span class="opt-prix">'+ps+'</span></div>'+(desc?'<div class="opt-desc">'+desc+'</div>':'');const chkArea=it.querySelector(".opt-row");chkArea.addEventListener("click",e=>{if(e.target.closest(".opt-expand")||e.detail===2)return;state.selectedOptions[opt.id]=!state.selectedOptions[opt.id];it.classList.toggle("checked");it.querySelector(".opt-chk").innerHTML=state.selectedOptions[opt.id]?"✓":"";updateTotal();});if(desc){const expBtn=it.querySelector(".opt-expand");expBtn.addEventListener("click",e=>{e.stopPropagation();it.classList.toggle("open");});}g.appendChild(it);});c.appendChild(g);});updateTotal();}
function updateTotal(){const d=state.parsedData,sz=d.size;const sel=CONFIG.options.filter(o=>state.selectedOptions[o.id]&&o.type.includes(d.type));let t=0,n=0,sd=false,nd=false;sel.forEach(o=>{const p=getPrice(o,sz);if(p==="Sur demande")sd=true;else if(p==="N.D")nd=true;else t+=p;n++;});document.getElementById("optTotal").textContent=n?n+" option"+(n>1?"s":"")+" • "+fmt(t)+" € HT"+(sd?" + sur demande":"")+(nd?" ⚠️ N.D pour cette taille":""):"";}

// ══════════════════════════════════════════════
// PREVIEW (Step 2)
// ══════════════════════════════════════════════
function buildPreview(){
  const d=state.parsedData,isHS=d.type==="HS",sz=d.size;
  const numP=document.getElementById("inputNumProjet").value,nomP=document.getElementById("inputNomProjet").value;
  const selOpts=CONFIG.options.filter(o=>state.selectedOptions[o.id]&&o.type.includes(d.type));
  let total=0;selOpts.forEach(o=>{const p=getPrice(o,sz);if(typeof p==="number")total+=p;});
  const cl=state.selectedClient;
  let h="";
  // === COVER PAGE v17 Galletti Premium ===
  var contact2 = null;
  if (state.contact && state.region) {
    var regionContacts = CONFIG.contacts[state.region] || [];
    contact2 = regionContacts.find(function(c) { return c.nom !== state.contact.nom; }) || null;
  }
  var gammeShort = (d.gamme || 'PLP').split(' ')[0];

  h += '<div class="cover" style="background-color:#1a3151!important">';

  // SVG network background
  h += '<div class="page-network">';
  h += '<svg width="100%" height="100%" viewBox="0 0 800 1130" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">';
  h += '<line x1="0" y1="150" x2="800" y2="500" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>';
  h += '<line x1="100" y1="0" x2="700" y2="1130" stroke="#ffffff" stroke-opacity="0.06" stroke-width="0.8"/>';
  h += '<line x1="0" y1="800" x2="800" y2="300" stroke="#ffffff" stroke-opacity="0.07" stroke-width="0.8"/>';
  h += '<line x1="300" y1="0" x2="100" y2="1130" stroke="#ffffff" stroke-opacity="0.05" stroke-width="0.7"/>';
  h += '<line x1="0" y1="450" x2="800" y2="900" stroke="#ffffff" stroke-opacity="0.06" stroke-width="0.8"/>';
  h += '<line x1="500" y1="0" x2="300" y2="1130" stroke="#ffffff" stroke-opacity="0.07" stroke-width="0.8"/>';
  h += '<line x1="0" y1="1000" x2="800" y2="100" stroke="#ffffff" stroke-opacity="0.05" stroke-width="0.7"/>';
  h += '<line x1="700" y1="0" x2="200" y2="1130" stroke="#ffffff" stroke-opacity="0.06" stroke-width="0.7"/>';
  h += '<line x1="0" y1="600" x2="600" y2="0" stroke="#ffffff" stroke-opacity="0.08" stroke-width="0.8"/>';
  h += '<line x1="200" y1="1130" x2="800" y2="700" stroke="#ffffff" stroke-opacity="0.05" stroke-width="0.7"/>';
  h += '<line x1="0" y1="250" x2="500" y2="1130" stroke="#ffffff" stroke-opacity="0.07" stroke-width="0.8"/>';
  h += '<line x1="650" y1="0" x2="800" y2="1130" stroke="#ffffff" stroke-opacity="0.06" stroke-width="0.7"/>';
  h += '<line x1="400" y1="0" x2="0" y2="700" stroke="#ffffff" stroke-opacity="0.05" stroke-width="0.7"/>';
  h += '<line x1="0" y1="50" x2="800" y2="1050" stroke="#ffffff" stroke-opacity="0.04" stroke-width="0.6"/>';
  h += '<circle cx="200" cy="350" r="120" fill="#ffffff" fill-opacity="0.02"/>';
  h += '<circle cx="600" cy="800" r="100" fill="#ffffff" fill-opacity="0.015"/>';
  h += '<circle cx="400" cy="600" r="80" fill="#ffffff" fill-opacity="0.015"/>';
  h += '</svg></div>';

  // Accent bar
  h += '<div class="accent-bar"></div>';

  // Header with logo
  h += '<div class="header">';
  h += '<img class="company-logo" src="' + document.getElementById("asset_franceair_white").src + '" alt="France Air Invenio" />';
  h += '</div>';

  // Title section
  h += '<div class="title-section">';
  h += '<div class="title-label">Projet</div>';
  h += '<h1 class="project-title">' + (nomP || 'Nom du Projet') + '</h1>';
  h += '<div class="title-underline"></div>';
  h += '</div>';

  // Info cards
  h += '<div class="info-section"><div class="info-grid">';
  h += '<div class="info-card"><div class="info-label">Date</div><div class="info-value">' + (d.date || new Date().toLocaleDateString("fr-FR")) + '</div></div>';
  if (state.region) {
    h += '<div class="info-card"><div class="info-label">R\u00e9gion</div><div class="info-value">' + state.region + '</div></div>';
  } else {
    h += '<div class="info-card"><div class="info-label">Localisation</div><div class="info-value">\u2014</div></div>';
  }
  h += '<div class="info-card"><div class="info-label">Client</div><div class="info-value">' + (cl ? cl.nom : '\u2014') + '</div></div>';
  h += '</div>';
  // Row 2: contacts
  h += '<div class="info-row-2">';
  if (state.contact) {
    h += '<div class="info-card"><div class="info-label">Le Technico-Commercial Itin\u00e9rant</div><div class="info-value">' + state.contact.nom + '</div></div>';
    if (contact2) {
      h += '<div class="info-card"><div class="info-label">Le Technico-Commercial S\u00e9dentaire</div><div class="info-value">' + contact2.nom + '</div></div>';
    }
  } else {
    h += '<div class="info-card"><div class="info-label">Le Technico-Commercial Itin\u00e9rant</div><div class="info-value">\u2014</div></div>';
    h += '<div class="info-card"><div class="info-label">Le Technico-Commercial S\u00e9dentaire</div><div class="info-value">\u2014</div></div>';
  }
  h += '</div></div>';

  // Separator
  h += '<div class="separator"></div>';

  // Product section
  h += '<div class="product-section"><div class="product-hero">';

  // Arc SVG with geometric lines
  h += '<svg class="arc-svg" viewBox="0 0 1000 600" preserveAspectRatio="none">';
  h += '<path d="M 1000 0 L 1000 600 C 900 600, 720 500, 690 300 C 720 100, 900 0, 1000 0 Z" fill="#1a3151"/>';
  h += '<g clip-path="url(#arcClipLines)">';
  h += '<line x1="650" y1="0" x2="1000" y2="400" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>';
  h += '<line x1="700" y1="600" x2="1000" y2="100" stroke="#ffffff" stroke-opacity="0.06" stroke-width="0.8"/>';
  h += '<line x1="680" y1="200" x2="1000" y2="550" stroke="#ffffff" stroke-opacity="0.07" stroke-width="0.8"/>';
  h += '<line x1="750" y1="0" x2="850" y2="600" stroke="#ffffff" stroke-opacity="0.05" stroke-width="0.7"/>';
  h += '<line x1="690" y1="350" x2="1000" y2="200" stroke="#ffffff" stroke-opacity="0.06" stroke-width="0.8"/>';
  h += '<line x1="700" y1="50" x2="950" y2="580" stroke="#ffffff" stroke-opacity="0.05" stroke-width="0.7"/>';
  h += '<line x1="680" y1="450" x2="1000" y2="30" stroke="#ffffff" stroke-opacity="0.07" stroke-width="0.8"/>';
  h += '<line x1="750" y1="100" x2="1000" y2="500" stroke="#ffffff" stroke-opacity="0.04" stroke-width="0.6"/>';
  h += '<line x1="800" y1="0" x2="700" y2="600" stroke="#ffffff" stroke-opacity="0.05" stroke-width="0.7"/>';
  h += '<line x1="900" y1="50" x2="720" y2="550" stroke="#ffffff" stroke-opacity="0.06" stroke-width="0.7"/>';
  h += '<line x1="950" y1="0" x2="680" y2="300" stroke="#ffffff" stroke-opacity="0.04" stroke-width="0.6"/>';
  h += '</g>';
  h += '<defs><clipPath id="arcClipLines"><path d="M 1000 0 L 1000 600 C 900 600 720 500 690 300 C 720 100 900 0 1000 0 Z"/></clipPath></defs>';
  h += '</svg>';

  // Decorative elements
  h += '<div class="hero-shine"></div>';
  h += '<div class="particle p1"></div><div class="particle p2"></div><div class="particle p3"></div><div class="particle p4"></div>';

  // PLP title and size
  h += '<div class="plp-title">' + gammeShort + ' <span class="plp-size">' + (sz || '') + '</span></div>';
  h += '<div class="side-brand">INVENIO \u00d7 GALLETTI</div>';

  // Machine image
  h += '<div class="machine-wrapper">';
  h += '<div class="machine-glow"></div><div class="machine-reflect"></div>';
  h += '<svg class="tech-lines" viewBox="0 0 200 200" fill="none">';
  h += '<circle cx="100" cy="100" r="80" stroke="rgba(27,161,164,0.15)" stroke-width="0.5" stroke-dasharray="4 6"/>';
  h += '<circle cx="100" cy="100" r="60" stroke="rgba(27,79,114,0.1)" stroke-width="0.3" stroke-dasharray="3 8"/>';
  h += '<line x1="20" y1="100" x2="50" y2="100" stroke="rgba(27,161,164,0.12)" stroke-width="0.5"/>';
  h += '<line x1="150" y1="100" x2="180" y2="100" stroke="rgba(27,161,164,0.12)" stroke-width="0.5"/>';
  h += '<line x1="100" y1="20" x2="100" y2="45" stroke="rgba(27,79,114,0.1)" stroke-width="0.5"/>';
  h += '<line x1="100" y1="155" x2="100" y2="180" stroke="rgba(27,79,114,0.1)" stroke-width="0.5"/>';
  h += '</svg>';
  h += '<img class="machine-image" src="' + document.getElementById("asset_machine").src + '" alt="' + d.modele + '" />';
  h += '</div>';

  // Certifications
  h += '<div class="cert-stack">';
  h += '<img class="cert-img-eurovent" src="' + document.getElementById("asset_eurovent").src + '" alt="Eurovent Certified Performance" />';
  h += '<img class="cert-img-r290" src="' + document.getElementById("asset_r290").src + '" alt="R290" />';
  h += '</div>';

  h += '</div></div>'; // product-hero + product-section

  // Footer
  h += '<div class="footer-line"></div>';
  h += '<div class="footer">';
  h += '<div class="footer-left"><span class="footer-brand">INVENIO \u00d7 GALLETTI</span> \u00a0\u2014\u00a0 Solutions thermodynamiques</div>';
  h += '<div class="footer-right">Document confidentiel \u00a0\u00b7\u00a0 Page 1</div>';
  h += '</div>';

  h += '</div>'; // cover
  h += '<div style="page-break-after:always;break-after:page;height:0;clear:both"></div>';
  // TECH DATA
  h+='<div class="sh-sec">'+st("Données techniques de sélection");
  h+='<div class="sh-sub">Conditions d\'entrée</div><div class="sh-grid2">'+cT("❄️ Refroidissement",d.refroidissement,"#147888");
  if(isHS&&d.chauffage)h+=cT("🔥 Chauffage",d.chauffage,"#c0392b");
  h+='</div><div class="sh-sub">Données résultantes</div><div class="sh-grid2">'+rT("❄️ Froid",d.resultsFroid,"f");
  if(isHS&&d.resultsChaud)h+=rT("🔥 Chaud",d.resultsChaud,"c");
  h+='</div><div class="sh-sub">Données communes</div><div class="sh-grid3">';
  h+=dc("Max courant absorbé",(d.commonData.maxCourant||"—")+" A")+dc("Courant démarrage",(d.commonData.courantDemarrage||"—")+" A")+dc("Compress./Circuits",d.commonData.compresseursCircuits||"—");
  h+=dc("Débit air source",(d.commonData.debitAir||"—")+" m³/h")+dc("Nb ventilateurs",d.commonData.nbVentilateurs||"—")+dc("Alimentation",d.alimentation||"—");
  h+=dc("Réfrigérant",d.refrigerant||"—")+dc("GWP",d.gwp||"—")+dc("Poids",(d.poids||"—")+" kg");
  h+='</div></div>';
  // ACOUSTIC
  h+='<div class="sh-sec">'+st("Données acoustiques")+'<div class="ac-grid">';
  [{k:"standard",l:"Standard",s:"Aucune isolation",lw:d.commonData.lwStandard,lp:d.commonData.lpStandard},{k:"silencieuse",l:"Silencieuse",s:"Capot compresseur",lw:d.commonData.lwSilencieuse,lp:d.commonData.lpSilencieuse},{k:"ultra",l:"Ultra Silencieuse",s:"Capot + BV",lw:d.commonData.lwUltra,lp:d.commonData.lpUltra}].forEach(v=>{const s=state.versionAcoustique===v.k;h+='<div class="ac-card'+(s?" ac-sel":" ac-dim")+'"><h4>'+v.l+'</h4><div class="ac-sub">'+v.s+'</div><div class="ac-big">'+(v.lw||"—")+'</div><div class="ac-unit">dB(A) Lw</div><div class="ac-sm">'+(v.lp||"—")+'</div><div class="ac-unit">dB(A) Lp @10m</div></div>';});
  h+='</div></div>';
  // PRESTATIONS
  if(d.prestations.length){h+='<div class="sh-sec">'+st("Prestations incluses")+'<div class="prest-list">';d.prestations.forEach(p=>{h+='<div class="prest-item"><span class="prest-icon">✓</span><span>'+p+'</span></div>';});h+='</div></div>';}
  // DIMENSIONS
  if(state.dimensionImage){h+='<div class="sh-sec">'+st("Dimensions")+'<div style="text-align:center"><img src="'+state.dimensionImage+'" style="max-width:100%;border:1px solid #eee;border-radius:4px"></div></div>';}
  // OPTIONS
  if(selOpts.length){h+='<div class="sh-sec">'+st("Options sélectionnées")+'<table class="sh-table"><thead><tr><th>Désignation</th><th>Catégorie</th><th style="text-align:right">Prix HT</th></tr></thead><tbody>';selOpts.forEach(o=>{const p=getPrice(o,sz);const ps=p==="Sur demande"?"Sur demande":p==="N.D"?"Non dispo.":p===0?"Inclus":fmt(p)+" €";h+='<tr><td>'+o.nom+'</td><td style="color:#8896a6">'+o.cat+'</td><td class="r" style="color:#147888">'+ps+'</td></tr>';});h+='</tbody><tfoot><tr style="border-top:2px solid #147888"><td colspan="2"><b>Total</b></td><td class="r" style="color:#147888;font-size:13px">'+fmt(total)+' € HT</td></tr></tfoot></table></div>';}
  h+='<div class="sh-foot">'+CONFIG.disclaimer+'</div>';
  document.getElementById("sheetContent").innerHTML=h;
}

// ══════════════════════════════════════════════
// ADMIN (Step 3)
// ══════════════════════════════════════════════
function buildAdmin(){let h='<div class="admin-intro">Gérez les données de l\'application : importez un fichier Excel pour mettre à jour les prix, ou consultez les données actuelles.</div>';
h+='<div class="card"><div class="card-title">📥 Mise à jour des prix</div>';
h+='<div class="admin-import" onclick="document.getElementById(\'filePrices\').click()"><h4>Importer un fichier Excel de prix</h4><p>Remplace les prix actuels pour la session en cours</p></div>';
h+='<input type="file" id="filePrices" accept=".xlsx,.xls" style="display:none" onchange="loadPricesExcel(this.files[0])">';
h+='<div class="admin-format"><b>Format attendu du fichier Excel :</b><br>';
h+='• Feuille 1 : <b>C-version</b> (groupes d\'eau glacée) — Feuille 2 : <b>H-version</b> (PAC)<br>';
h+='• Colonne A : Code option — Colonne B : Désignation<br>';
h+='• Colonnes D à H : Prix par taille (037, 045, 052, 057, 062)<br>';
h+='• Structure identique au fichier <b>08-PLP_2025-C-H.xlsx</b> fourni par Galletti<br><br>';
h+='<b>💡 Astuce :</b> Demandez à l\'assistant IA (💬 en bas à droite) si vous avez un doute sur le format !</div></div>';h+='<div class="card"><div class="card-title">Contacts</div>';Object.keys(CONFIG.contacts).forEach(r=>{h+='<div class="admin-region">'+r+'</div><table class="admin-tbl"><thead><tr><th>Nom</th><th>Poste</th><th>Tél</th><th>Email</th></tr></thead><tbody>';CONFIG.contacts[r].forEach(c=>{h+='<tr><td>'+c.nom+'</td><td>'+c.poste+'</td><td>'+c.tel+'</td><td>'+c.email+'</td></tr>';});h+='</tbody></table>';});h+='</div>';h+='<div class="card"><div class="card-title">Prix options</div>';const cats=[...new Set(CONFIG.options.map(o=>o.cat))];cats.forEach(cat=>{h+='<div class="admin-region">'+cat+'</div><table class="admin-tbl"><thead><tr><th style="width:40%">Option</th><th>037</th><th>045</th><th>052</th><th>057</th><th>062</th></tr></thead><tbody>';CONFIG.options.filter(o=>o.cat===cat).forEach(o=>{h+='<tr><td>'+o.nom+'</td>';CONFIG.sizes.forEach(s=>{h+='<td>'+(o.prix[s]||0)+'</td>';});h+='</tr>';});h+='</tbody></table>';});h+='</div>';if(CLIENTS.length){h+='<div class="card"><div class="card-title">Clients ('+CLIENTS.length.toLocaleString("fr-FR")+')</div><p style="font-size:11px;color:#8896a6">Base chargée depuis Excel. Premiers 20 :</p><table class="admin-tbl"><thead><tr><th>Code</th><th>Nom</th></tr></thead><tbody>';CLIENTS.slice(0,20).forEach(c=>{h+='<tr><td>'+c[0]+'</td><td>'+c[1]+'</td></tr>';});h+='</tbody></table></div>';}document.getElementById("adminContent").innerHTML=h;}

// ══════════════════════════════════════════════
// MESSAGES & RESET
// ══════════════════════════════════════════════
function showMsg(t,m){hideMsg();const el=document.getElementById("msg");el.className="msg "+t+" visible";el.innerHTML=m;}
function hideMsg(){document.getElementById("msg").className="msg";}
function resetAll(){state={machineType:null,file:null,pdfFile:null,parsedData:null,selectedModel:null,selectedSize:null,selectedClient:null,region:"",contact:null,versionAcoustique:"standard",selectedOptions:{},step:0,dimensionImage:null};["dropCSD","dropPDF"].forEach(id=>{const b=document.getElementById(id);b.classList.remove("has-file");});document.getElementById("icoCSD").textContent="📄";document.getElementById("titleCSD").textContent="Fiche CSD (.docx)";document.getElementById("subCSD").textContent="Fichier de sélection Galletti";document.getElementById("choiceGEG").className="choice-card";document.getElementById("choicePAC").className="choice-card";document.getElementById("selModel").innerHTML='<option value="">— Sélectionner le type d\'abord —</option>';document.getElementById("selModel").disabled=true;document.getElementById("selSize").innerHTML='<option value="">—</option>';document.getElementById("selSize").disabled=true;document.getElementById("fileCSD").value="";clearClient();hideMsg();checkReady();goToStep(0);}


// ══════════════════════════════════════════════
// CLIENT: manual entry
// ══════════════════════════════════════════════
function onManualClient(val) {
  if (val.trim().length > 0) {
    state.selectedClient = { code: "MANUEL", nom: val.trim() };
    // Hide the search-selected if any
    document.getElementById("clientSelected").classList.remove("visible");
    document.getElementById("clientSearch").value = "";
  } else {
    if (state.selectedClient && state.selectedClient.code === "MANUEL") {
      state.selectedClient = null;
    }
  }
  checkReady();
}

// Override pickClient to also clear manual field
const _origPickClient = pickClient;
pickClient = function(code, nom) {
  document.getElementById("clientManual").value = "";
  _origPickClient(code, nom);
};

// Override clearClient to also clear manual field
const _origClearClient = clearClient;
clearClient = function() {
  document.getElementById("clientManual").value = "";
  _origClearClient();
};

// ══════════════════════════════════════════════
// CLIENT: count display
// ══════════════════════════════════════════════
function updateClientCount() {
  document.getElementById("clientCount").textContent = "📦 " + CLIENTS.length.toLocaleString("fr-FR") + " clients en base";
  document.getElementById("clientSearch").placeholder = "Rechercher parmi " + CLIENTS.length.toLocaleString("fr-FR") + " clients...";
}

// ══════════════════════════════════════════════
// RAPPEL MENSUEL (1er lundi du mois)
// ══════════════════════════════════════════════
function isFirstMondayOfMonth() {
  const today = new Date();
  if (today.getDay() !== 1) return false; // not Monday
  // Check if this is the first Monday: date must be <= 7
  return today.getDate() <= 7;
}

function checkMonthlyReminder() {
  const key = "plp_reminder_dismissed";
  const now = new Date();
  const monthKey = now.getFullYear() + "-" + (now.getMonth() + 1);
  
  // Check if already dismissed this month
  try {
    const dismissed = localStorage.getItem(key);
    if (dismissed === monthKey) return;
  } catch(e) {}
  
  if (isFirstMondayOfMonth()) {
    const modal = document.getElementById("updateReminder");
    modal.style.display = "flex";
  }
}

function dismissReminder() {
  const modal = document.getElementById("updateReminder");
  modal.style.display = "none";
  // Remember dismissal for this month
  try {
    const now = new Date();
    localStorage.setItem("plp_reminder_dismissed", now.getFullYear() + "-" + (now.getMonth() + 1));
  } catch(e) {}
}

// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
updateClientCount();
checkMonthlyReminder();
// Initialisation Turso au démarrage
if (typeof TursoSync !== "undefined") {
  TursoSync.init().then(function(ok) {
    if (ok) {
      updateClientCount();
      console.log("🟢 App synchronisée avec Turso");
    }
  });
}
 

// ══════════════════════════════════════════════
// EXCEL PRICE IMPORT
// ══════════════════════════════════════════════
async function loadPricesExcel(f) {
  if (!f) return;
  showMsg("success", "⏳ Lecture du fichier prix...");
  try {
    var data = await f.arrayBuffer();
    var wb = XLSX.read(data, {type:"array"});
    
    // Try to find C-version and H-version sheets
    var cSheet = wb.Sheets["C-version"] || wb.Sheets[wb.SheetNames[0]];
    var hSheet = wb.Sheets["H-version"] || wb.Sheets[wb.SheetNames[1]];
    
    var updated = 0;
    
    // Parse each sheet and update CONFIG.options prices
    [cSheet, hSheet].forEach(function(ws) {
      if (!ws) return;
      var rows = XLSX.utils.sheet_to_json(ws, {header:1});
      rows.forEach(function(row) {
        if (!row[1]) return;
        var designation = String(row[1]).trim().toLowerCase();
        // Try to match with existing options by name similarity
        CONFIG.options.forEach(function(opt) {
          var optName = opt.nom.toLowerCase();
          if (designation.includes(optName) || optName.includes(designation)) {
            // Columns D-H = indices 3-7 = sizes 037-062
            var newPrices = {};
            var sizeIndices = {3:"037", 4:"045", 5:"052", 6:"057", 7:"062"};
            for (var ci in sizeIndices) {
              var val = row[parseInt(ci)];
              if (val !== undefined && val !== null && val !== "") {
                newPrices[sizeIndices[ci]] = typeof val === "number" ? val : parseInt(String(val).replace(/[^\d]/g,"")) || 0;
              }
            }
            if (Object.keys(newPrices).length > 0) {
              Object.assign(opt.prix, newPrices);
              updated++;
            }
          }
        });
      });
    });
    
    showMsg("success", "✅ " + updated + " prix mis à jour pour cette session. Rechargez la page pour revenir aux prix par défaut.");
    // Persister les prix dans Turso
    if (typeof TursoSync !== "undefined" && TursoSync.isConnected()) {
    TursoSync.savePrices().then(function() {
    showMsg("success", "✅ Prix mis à jour et sauvegardés dans Turso pour tous les utilisateurs.");
  });
}
    // Rebuild options display if currently on config step
    if (state.step === 1 && state.parsedData) buildOptions();
    if (state.step === 3) buildAdmin();
  } catch(e) {
    showMsg("error", "Erreur : " + e.message);
  }
}

