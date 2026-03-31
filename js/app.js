// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════
let state = {
  machineType: null, file: null, pdfFile: null, parsedData: null,
  selectedModel: null, selectedSize: null, selectedClient: null,
  region: "", contact: null, versionAcoustique: "standard",
  selectedOptions: {}, step: 0, dimensionImage: null,
  remiseOptions: 0,
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
// STEP 0 — NAVIGATION SOUS-ÉTAPES IMPORT
// ══════════════════════════════════════════════
function impGo(n) {
  if (n === 1 && !state.file) {
    showMsg("error", "Veuillez d'abord importer un fichier CSD (.docx ou .pdf).");
    return;
  }
  if (n === 2 && !state.machineType) {
    showMsg("error", "Veuillez sélectionner le type de machine.");
    return;
  }
  // Lire la remise si on quitte l'étape 1
  if (n === 2) {
    var remEl = document.getElementById('inputRemise');
    if (remEl) state.remiseOptions = parseFloat(remEl.value) || 0;
  }
  // Injecter champ remise dans impP1 si pas encore présent
  if (n === 1 && !document.getElementById('inputRemise')) {
    var p1 = document.getElementById('impP1');
    if (p1) {
      var remDiv = document.createElement('div');
      remDiv.className = 'card';
      remDiv.style.marginTop = '12px';
      remDiv.innerHTML = '<div class="field">'
        + '<label class="field-label">Remise options &amp; accessoires</label>'
        + '<span class="field-hint">En %, appliquée sur le prix catalogue de chaque option</span>'
        + '<input type="number" id="inputRemise" min="0" max="100" step="0.5" placeholder="Ex : 15" '
        + 'style="width:140px;margin-top:8px;padding:8px 10px;border-radius:6px;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-size:13px" '
        + 'value="'+(state.remiseOptions||'')+'" oninput="state.remiseOptions=parseFloat(this.value)||0"/>'
        + '<span style="color:rgba(255,255,255,.5);font-size:11px;margin-left:6px">%</span>'
        + '</div>';
      var navBtns = p1.querySelector('.nav-btns');
      if (navBtns) p1.insertBefore(remDiv, navBtns);
    }
  }
  [0, 1, 2].forEach(function(i) {
    var panel = document.getElementById('impP' + i);
    var dot   = document.getElementById('impDot' + i);
    if (panel) panel.style.display = (i === n) ? '' : 'none';
    if (dot)   dot.className = 'step-dot' + (i === n ? ' active' : i < n ? ' done' : '');
  });
  if (n === 2) checkReady();
}

// Ouvre la modale de mise à jour des clients (Excel)
function openClientUpdate() {
  var inp = document.getElementById('fileClients');
  if (!inp) {
    // Créer dynamiquement si absent
    inp = document.createElement('input');
    inp.type = 'file';
    inp.id = 'fileClients';
    inp.accept = '.xlsx,.xls';
    inp.style.display = 'none';
    inp.onchange = function() { loadClientsExcel(this.files[0]); };
    document.body.appendChild(inp);
  }
  inp.click();
}

// Ouvre la modale de mise à jour des prix (Excel)
function openPriceUpdate() {
  var inp = document.getElementById('filePricesBtn');
  if (!inp) {
    inp = document.createElement('input');
    inp.type = 'file';
    inp.id = 'filePricesBtn';
    inp.accept = '.xlsx,.xls';
    inp.style.display = 'none';
    inp.onchange = function() { loadPricesExcel(this.files[0]); };
    document.body.appendChild(inp);
  }
  inp.click();
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
  // Injecter le CSS PLP dans le DOM principal pour l'aperçu écran
  if (!document.getElementById('__plp_preview_css__')) {
    var styleEl = document.createElement('style');
    styleEl.id = '__plp_preview_css__';
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:ital,wght@0,400;0,600;1,400&display=swap');
      #sheetContent { background: #e8e8e8; padding: 20px; }
      #sheetContent .plp-pg {
        width: 210mm; min-height: 297mm; padding: 20mm;
        background: #fff !important; position: relative;
        margin: 0 auto 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.15);
        display: flex; flex-direction: column;
        font-family: 'Barlow', Arial, sans-serif; font-size: 9.5px; line-height: 1.65; color: #333;
      }
      #sheetContent .plp-hdr { height: 36px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #ccc; margin-bottom: 16px; padding-bottom: 6px; flex-shrink: 0; }
      #sheetContent .plp-hdr-proj { font-size: 8px; color: #666; }
      #sheetContent .plp-hdr-ref { font-weight: 600; font-size: 8px; color: #333; }
      #sheetContent .plp-ftr { height: 24px; border-top: 1px solid #ccc; display: flex; align-items: center; justify-content: space-between; font-size: 7.5px; color: #666; text-transform: uppercase; letter-spacing: .1em; margin-top: auto; padding-top: 5px; flex-shrink: 0; }
      #sheetContent .plp-band { background: #00527A !important; padding: 12px 24px; margin-bottom: 18px; flex-shrink: 0; }
      #sheetContent .plp-band-t { font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; font-weight: 700; font-size: 18px; text-transform: uppercase; color: #fff; letter-spacing: .05em; }
      #sheetContent .plp-band-s { font-size: 9px; color: rgba(255,255,255,.8); margin-top: 2px; }
      #sheetContent .plp-logo-fa { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 13px; color: #00527A; }
      #sheetContent .plp-logo-sep { font-weight: 300; font-size: 10px; color: #ccc; margin: 0 2px; }
      #sheetContent .plp-logo-inv { font-size: 9px; color: #666; font-style: italic; }
      #sheetContent .plp-som { display: flex; flex: 1; background: #F2F2EF !important; position: relative; min-height: 200mm; }
      #sheetContent .plp-som-l { width: 25%; display: flex; align-items: flex-start; padding: 64px 0 0 28px; }
      #sheetContent .plp-som-txt { writing-mode: vertical-rl; transform: rotate(180deg); font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 120px; text-transform: uppercase; color: #00527A; line-height: .82; }
      #sheetContent .plp-som-r { width: 75%; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 48px 80px 0; }
      #sheetContent .plp-som-item { display: flex; align-items: baseline; justify-content: flex-end; margin-bottom: 10px; }
      #sheetContent .plp-som-lbl { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: .08em; color: #00527A; text-align: right; flex: 1; }
      #sheetContent .plp-som-num { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 60px; line-height: 1; color: #00527A; margin-left: 16px; min-width: 90px; text-align: right; }
      #sheetContent .plp-som-logo { position: absolute; top: 32px; right: 48px; }
      #sheetContent .plp-tb { width: 100%; border-collapse: collapse; font-size: 9px; }
      #sheetContent .plp-tb th, #sheetContent .plp-tb td { padding: 6px 10px; vertical-align: middle; }
      #sheetContent .plp-tb thead th { background: #00527A !important; color: #fff; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; text-align: center; padding: 10px 12px; font-size: 10px; }
      #sheetContent .plp-tb thead th + th { border-left: 1px solid rgba(255,255,255,.2); }
      #sheetContent .plp-tb .plp-lc { width: 32%; text-align: left; font-size: 9px; color: #333; background: #F2F2EF !important; border-right: 2px solid #00527A; }
      #sheetContent .plp-tb tbody td { text-align: center; border-bottom: 1px solid #ccc; font-family: 'Barlow Condensed', sans-serif; font-weight: 600; font-size: 10px; color: #111; background: #F2F2EF !important; }
      #sheetContent .plp-tb .plp-gr td { background: #fff !important; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 12px; text-transform: uppercase; color: #00527A; padding: 8px 12px; text-align: left; border-top: 2px solid #00527A; }
      #sheetContent .plp-unit { font-size: 8px; color: #666; margin-left: 3px; font-family: 'Barlow', sans-serif; font-weight: 400; }
      #sheetContent .plp-thr { display: block; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 12px; }
      #sheetContent .plp-thc { display: block; font-size: 8px; opacity: .75; margin-top: 2px; }
      #sheetContent .plp-acou-wrap { display: flex; gap: 4px; justify-content: center; }
      #sheetContent .plp-acou-col { flex: 1; text-align: center; padding: 4px 3px; border-radius: 2px; font-family: 'Barlow Condensed', sans-serif; font-size: 9px; }
      #sheetContent .plp-acou-col.active { background: #00527A !important; color: #fff; font-weight: 700; }
      #sheetContent .plp-acou-col.inactive { background: #e8e8e8 !important; color: #aaa; }
      #sheetContent .plp-acou-lbl { font-size: 6.5px; text-transform: uppercase; display: block; }
      #sheetContent .plp-acou-val { font-size: 10px; font-weight: 700; display: block; }
      #sheetContent .plp-pump-wrap { display: flex; gap: 4px; justify-content: center; }
      #sheetContent .plp-pump-card { flex: 1; text-align: center; padding: 6px 4px; border-radius: 3px; font-family: 'Barlow Condensed', sans-serif; max-width: 80px; }
      #sheetContent .plp-pump-on { background: #00527A !important; color: #fff; }
      #sheetContent .plp-pump-off { background: #e8e8e8 !important; color: #aaa; }
      #sheetContent .plp-pump-icon { font-size: 8px; display: block; }
      #sheetContent .plp-pump-lbl { font-weight: 700; font-size: 10px; display: block; }
      #sheetContent .plp-presc { padding: 0 8px; }
      #sheetContent .plp-pb { margin-bottom: 20px; }
      #sheetContent .plp-pb-t { font-weight: 600; font-size: 9.5px; text-transform: uppercase; letter-spacing: .06em; color: #111; margin-bottom: 6px; padding-bottom: 5px; border-bottom: 1px solid #00527A; }
      #sheetContent .plp-pb-x { font-size: 9.5px; line-height: 1.65; color: #333; }
      #sheetContent .plp-li { padding-left: 16px; position: relative; margin-bottom: 2px; }
      #sheetContent .plp-li::before { content: "–"; position: absolute; left: 0; color: #666; }
      #sheetContent .plp-cat { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 13px; text-transform: uppercase; color: #00527A; background: #F2F2EF !important; padding: 8px 12px; border-left: 4px solid #00527A; margin: 20px 0 8px; }
      #sheetContent .plp-opt { display: flex; align-items: flex-start; padding: 10px 12px; border-bottom: 1px solid #e0e0e0; }
      #sheetContent .plp-opt.plp-sel { background: #D6E8F2 !important; border-left: 3px solid #00527A; }
      #sheetContent .plp-opt.plp-unsel { opacity: .6; }
      #sheetContent .plp-opt-info { flex: 55%; min-width: 0; }
      #sheetContent .plp-opt-name { font-weight: 600; font-size: 9.5px; text-transform: uppercase; letter-spacing: .04em; color: #111; }
      #sheetContent .plp-opt-desc { font-size: 9px; color: #555; line-height: 1.5; margin-top: 3px; }
      #sheetContent .plp-opt-prix { width: 25%; text-align: right; padding-left: 12px; }
      #sheetContent .plp-opt-ht { font-weight: 600; font-size: 9.5px; color: #111; }
      #sheetContent .plp-opt-ttc { font-size: 8.5px; color: #666; margin-top: 2px; }
      #sheetContent .plp-opt-chk { width: 20%; display: flex; flex-direction: column; align-items: center; padding-left: 8px; }
      #sheetContent .plp-chkbox { width: 16px; height: 16px; border: 1.5px solid #00527A; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #fff; }
      #sheetContent .plp-chkbox.checked { background: #00527A !important; }
      #sheetContent .plp-chk-lbl { font-size: 7px; color: #666; margin-top: 3px; text-transform: uppercase; }
      #sheetContent .plp-recap { border: 2px solid #00527A; padding: 16px 24px; margin-top: 24px; }
      #sheetContent .plp-recap-t { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 13px; text-transform: uppercase; color: #00527A; margin-bottom: 12px; }
      #sheetContent .plp-recap-tb { width: 100%; border-collapse: collapse; font-size: 9px; }
      #sheetContent .plp-recap-tb th { background: #00527A !important; color: #fff; font-size: 8px; text-transform: uppercase; padding: 5px 8px; font-family: 'Barlow Condensed', sans-serif; }
      #sheetContent .plp-recap-tb td { padding: 5px 8px; border-bottom: .5px solid #e0e0e0; }
      #sheetContent .plp-recap-total td { background: #003D5C !important; color: #fff; font-weight: 600; font-size: 10px; padding: 7px 8px; }
      #sheetContent .plp-iz { border: 1px dashed #bbb; background: #f9f9f9 !important; display: flex; align-items: center; justify-content: center; text-align: center; padding: 20px; font-size: 9px; color: #999; font-style: italic; min-height: 120px; }
      #sheetContent .plp-cap { font-style: italic; font-size: 8px; color: #666; text-align: center; margin-top: 8px; }
      #sheetContent .plp-pg { margin-top: 0; padding-top: 15mm; padding-bottom: 15mm; }
      /* Sommaire : hauteur A4 pleine */
      #sheetContent .plp-pg-som { padding-top: 0 !important; padding-bottom: 0 !important; min-height: 297mm !important; }
      #sheetContent .cover .info-value { font-size: 13px !important; font-weight: 600; color: #1B3A5C; }
      #sheetContent .cover .info-label { font-size: 9px !important; }
      #sheetContent .cover .info-card { padding: 5mm 6mm !important; }
      #sheetContent .plp-opt-section { font-weight: 600; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.04em; color: #00527A; display: inline; }
      #sheetContent .plp-page-break { display: none; }
      #sheetContent .sh-foot { padding: 8px 10px; font-size: 7px; color: #b8c4cf; font-style: italic; border-top: 1px solid #eee; }
      /* ─── COVER V2 ─── */
      @import url('https://fonts.googleapis.com/css2?family=Anton&display=swap');
      #sheetContent .cover-v2 {
        width: 210mm; min-height: 297mm;
        position: relative; overflow: hidden;
        display: flex; flex-direction: column;
        background: #F2F2EF;
        page-break-after: always; break-after: page;
        box-shadow: 0 2px 20px rgba(0,0,0,0.12);
        margin-bottom: 20px;
      }
      #sheetContent .cover-v2-grid { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
      #sheetContent .cover-v2-header {
        position: relative; z-index: 2;
        display: flex; justify-content: space-between; align-items: flex-start;
        padding: 9mm 10mm 0 10mm;
        flex-shrink: 0;
      }
      #sheetContent .cover-v2-logo-fa { height: 11mm; width: auto; }
      #sheetContent .cover-v2-logo-inv { height: 7mm; width: auto; margin-top: 2mm; }
      #sheetContent .cover-v2-title-zone {
        position: relative; z-index: 2;
        padding: 16mm 8mm 0 8mm;
        text-align: center;
        flex-shrink: 0;
      }
      #sheetContent .cover-v2-title {
        font-family: 'Anton', 'Arial Black', Arial, sans-serif;
        font-weight: 400; font-size: 72px; line-height: 1;
        color: #1B3A5C; letter-spacing: 0.5px;
      }
      #sheetContent .cover-v2-subtitle {
        font-family: 'Anton', 'Arial Black', Arial, sans-serif;
        font-weight: 400; font-size: 22px; line-height: 1.2;
        color: #1B3A5C; margin-top: 4mm;
      }
      /* Spacer flex */
      #sheetContent .cover-v2-spacer { display: none; }
      /* PLP SVG — position absolute sur la cover, pleine hauteur */
      #sheetContent .cover-v2-plp-svg {
        position: absolute;
        inset: 0; width: 100%; height: 100%;
        z-index: 3;
        pointer-events: none;
        overflow: visible;
      }
    `;
    document.head.appendChild(styleEl);
  }

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

  // ── Sous-titre dynamique selon type machine ──
  var coverSousTitre = isHS ? "Fiche de sélection d'une pompe à chaleur" : "Fiche de sélection d'un groupe d'eau glacée";

  // ── Logos en base64 depuis les project files ──
  var FA_B64 = "/9j/4AAQSkZJRgABAgAAAQABAAD/wAARCADgBQgDACIAAREBAhEB/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMAAAERAhEAPwD5/ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAroPAn/JQ/DX/YVtf/Rq1z9dB4E/5KH4a/7Ctr/6NWgD7fooooAKKKKAPgCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiirFqAJDIekals++Pl/XFADjFFCQJtzP3jUgEexJzz7Y/XIppNq2AEmT1YsH/AEwP51ATnrSUASyxGNgMhgRkMOhHr+n6VFVlB5lu8fVk+dR69mH5YP0BqtQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAV0HgT/kofhr/ALCtr/6NWufroPAn/JQ/DX/YVtf/AEatAH2/RRRQAUUUUAfBIjSFQ0oLuQCEzgY6gk+/oMcHrTfOGSVhiUHtgnH0ySaS43/aJPMAD7juA6A55qGgCdJo162sLfUt/RhSPKjdLeNfoW/qTUNFAEqtF/FGT9Gx/Q07fa94Zf8Av6P/AImoKKALG+0/54z/APf4f/E0b7T/AJ4zf9/h/wDE1XooAn32v/PGX/v6P/iaN9t2hkH1lH/xNQUUASloc8RsB7vn+gpqsoPMat9Sf6GmUUAWBPGP+XSE/Uv/APFUG4i/584PwL//ABVV6KAJjNGeltEPxb/GmhwD/q0/HJ/rUdFAEvm/9M4/++aUzZ4McZH+7j+VQ0UAWDJCx+a3CgDH7tiM+5zn9MUPCuzfE+9B1yMFfqP6jPb6VXqaKTy5Q2NwPDKe47igCGipZo/KnkjB3BWK59cGoqACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqzNiKNYB1HzSZ/ven4fzJpLcBd0zAFY8YBHBY9P5E++Md6hJLEknJJyTQA2iiigCaGTy5VfGcHkHofY+xpJ4/KmZOq9VOMZB5B/LBqKrDfvLVWwN0Z2n3B5H9R+VAFeiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACug8Cf8lD8Nf9hW1/9GrXP10HgT/kofhr/sK2v/o1aAPt+iiigAooooA+CiPtCh0H7xR86jqR/eH9R7Z9cVaUEg5HBHerH2lnO6aOOU9MtkH6kggk/XNAFairJuQP9VDHE2PvLnP6k4+opI555HCGWRt3y4LEjnigCvRRRQAUVZt2ZVnKkqwTII4P3l6fhmmfap/+ezH6nP8AOgCGipvtU39/9B/hS/ap+0rD6cUAQUVN9qn/AOezj6MaUXl0OlzMPo5/xoAgpwRm6An6Cpvt13/z9T/9/D/jTGuZ3+9NIfqxNAAsEzfdic/RSaX7Lcf88Jf++DUNFAE32W4/54S/98GmOrI21lKkdiMGmVOs/wC7EborqBgZ6r9D/Tpz0oAgqWKMyyBF6n16Ad8+2OvpTibYkkLKB/dLA/rgfypXnGxkiXYjcHnLMOvJ/wAMdKAGXDrJcyumdrOSM+maioooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKs242FpyOIxxnux6D+Z98GgAuB5YWAf8ALPO7/eOM/lgD8M96rUpOetJQAUVYgUFyzjKICzD19vxJA9s5ouMMVlAAEi5IHqOD+vOO2RQBXqxbcyGMn5ZRsPOBk8jJ9AcH8Kr0UAKQQcHqKSrFyd7ib/nq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OPjD/oJaH/3/AJv/AI1R/wAM4+MP+glof/f+b/41X0/RQB8wf8M4+MP+glof/f8Am/8AjVH/AAzj4w/6CWh/9/5v/jVfT9FAHzB/wzj4w/6CWh/9/wCb/wCNUf8ADOPjD/oJaH/3/m/+NV9P0UAfMH/DOPjD/oJaH/3/AJv/AI1R/wAM4+MP+glof/f+b/41X0/RQB8wf8M4+MP+glof/f8Am/8AjVH/AAzj4w/6CWh/9/5v/jVfT9FAHzB/wzj4w/6CWh/9/wCb/wCNUf8ADOPjD/oJaH/3/m/+NV9P0UAfMH/DOPjD/oJaH/3/AJv/AI1Wp4a+AXirRvFWkapcahozQWV7DcSLHNKWKo4YgZjAzgeor6LooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//Z";
  var INV_B64 = "/9j/4AAQSkZJRgABAgAAAQABAAD/wAARCAGIBiADACIAAREBAhEB/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMAAAERAhEAPwD5/ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKcqM7BVGSavwWKrhpfmPp2oApRwySn5FJ96spp7H77gew5rQAAGAAB7UUAVV0+IdSx/HFP+xwf3P1NT1FLcRwj5jz6DrQA37HB/zz/U0ySC0jGXAH4mq0t9I/C/IPbrVYksckkmgCWUwn/Vqw9yahopyoz/dUn6CgBtFWFs52/gx9TTxp8pHJUfjQBUoq3/Z8v95P1pslm8SFmdMfWgCtRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRU8drLIMhcD1NS/2fJj7659KAKdFSyW0sXLLx6ioqACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqSKJpn2qPqfSkjjaVwijk1rQwrDHtX8T60AJDAkC4UcnqaloooAKKKo3l11jjP1NADrm825SLr3NZ5JY5JyaTrVmC0eXk/Kvr60AVwCxwBk+lWorGR+XOwfrV6KGOIYVfx71JQBBHaQx/wAO4+rVOAAMAY+lFFABRRUc0qwxlm/AetABNMsKbm/AetZc07zNlj9B6U2WVpXLMefT0plABRRRQAUUUUAFFFFABRRRQAUUUUAFFFWxYSEA7loAqUVc/s+X+8lH9ny/3koAp0VPPbNAFLEHPpUFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRTljd/uqT+FADaKtJYyt1wv1NTCxiQZkkP8qAM+lCk9AT9BV8vZxdFDH86ab8D/VxAfWgCsttM3SM1KLCY9do+pprXszfxY+gqJpXb7zsfxoAsGzRRl50FIYrVTzMx+gqrRQBYJtR0WQn60hlgxxB+bVBRQArEFiQMD0pKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKv2dsCBK4z6CqKjcwHqcVtqAqgDoBigBaKKKADqOazry2EZ8xB8p6j0rRpkyh4XU9xQBi0UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUAZNFW7GHe/mEcL0+tAFq1txDHkj5z1qxRRQAUUVDcTiCPP8R6CgCK8udi+Wh+Y9T6VnYLHHUmlJLtknJJrRtbURgO4y5/SgBttZhcPIMt2HpVyiigAooooAKKKKAAnAJPAFZNzN50hP8I6VavptqeUDyeT9KzqACiiigAooooAKKKKACiiigAooooAKKKKAAVuL90fSsMVuL90fSgBaKKKAKWo/cj+prPrQ1H7kf1NZ9ABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRShWKlgDgdTQAlFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUuM0AJRViKzlk5xtHqauR2UUfLfMffpQBnJE8hwqk1aj09zy7BfYc1Ye7hhG1eT6LVSS9lf7uFHtQBaEFtAMtj/gRpj38acRrn9BWeWLHJJJ96SgCy97M/QhR7VXLMxyxJPuaSigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAVTtYH0Oa21IZQR0IrDq/Z3IAETnHoaAL1FFFABUc7BIHbPY4qSs28uRIfLQ/KOp9aAKlFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAOVSzBR1JrYijEUYQdqqWEPWU/RavUAFFFIzBVLE4AoASSRY0Lt0FZE0rTSFm/AelPubgzP/sDoKfaW/mtvYfIP1oAlsrbH71x/ug1eoooAKKKKACiiigApGYIpY9B1papX82FEQ6nk0AUpZDLIXPc0yiigAooooAKKKKACiiigAooooAKKKKACiiigAFbi/dH0rDFbi/dH0oAWiiigClqP3I/qaz60NR+5H9TWfQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVJDMYmyOVPUHvUdFAFyS2WVPNg5HdfSqZ4qWCdoXyOncVcmt0uU82LG4/rQBnUUpUqSCMEUlABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFAGTgVZhs3l5b5V9TV+K3jhHygZ9TQBRisXfl/lH61ejgihGQB/vGo5r1I+F+Zv0qhLPJMfmbj0FAF2W+ROE+c/pVKW4ll+83HoKiooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCeK7ljGM5Hoam/tF/7i/nVKigCaW5ll4Y4HoKhoooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAp8URlkCDvTQCTgDJrUtbfyUyfvnr7UATqoRAq9BS0VBNdRw8Zy3oKAJXdUUsxwBWZc3JmbA4QdvWmTTvM2WPHYdqbHG0rhVHNADoITPJtHTufStZECKFUYApsMSwptX8T61JQAUUUUAFFFFABRRRQA13EaFm6AVjyOZJGc9TVm9n3t5angdfc1ToAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAAVuL90fSsMVuL90fSgBaKKKAKWo/cj+prPrQ1H7kf1NZ9ABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVZtbjyXwfuHr7VWooA1Lm2E670xv9fWswgqSCMEVesrj/lk5/3aku7YSrvQfOP1oAzKKCMcUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUVct7IvhpMhfTuaAK8ULythB+NaEFokXLfM3qanVVjTCgKBVS4vgMrFyf71AFmWdIV+Y89hWdNdyS8fdX0FQMxYksck96SgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKUAscAZJpKUEg5BwaAL9vAkGJJWXd2GelPkvol+7ljWYST1ooAsS3ksnAO0egqDrQAScAZq3DYs2DJ8q+negCvDC8z7VH1PpWpDAkK4Uc9z609EWNQqgAU6gAooooAKKKKACiiigAqrd3IjXYp+c/pS3N0IRtXl/5VmFixJJyTQAmaKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAFbi/dH0rDFbi/dH0oAWiiigClqP3I/qaz60NR+5H9TWfQAUUUUAFFFFABRRRQAUUUUAFFKAScCl2N/dP5UANop2xv7p/KjY390/lQA2ijpRQAUUUUAFFFFABRRinCN26Ix/CgBtFTfZZ/wDnm1H2Sf8A55mgCGipvss//PM00wSr1jb8qAI6KXBHUUlABRRRQAUUUUAFFFFABRRRQAoJByO1a1tOJos5+YdayKlgmMMoYdO4oAtXtt1lQf7w/rVCtwEMuRyCKy7u38mTK/cPT2oAr0UUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFORGdgqgkmnRQvM21R9T6VqQwJCuF69zQBHb2axfM/zP8AyqaSRYk3OcCmT3CwLzy3ZazJZmmbcx/D0oAknumm4HCelV6KKACiiigAooooAKKKKACiiigAoopQrN0BP0FACUVKtvM3SNqX7JP/AM8zQBDRU32Sf/nmaa1vMvWNqAI6KUqw6gj60lABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUuxiOFP5UAJRTtjf3T+VGxv7p/KgBtFKQR1BFJQAUUUUAFFFFABRRShWbopP0FACUVKLeZhxG35UotJz/AMszQBDRU32Sf/nmaQ20yjJjagCKilKMvVSPqKSgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKUAnoM0AJRTtjf3T+VGxv7p/KgBtFO2N/dP5U08GgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKACegoAKKlW3mbpG1PFlOf4R+dAFeirYsJfVaQ2Ew/un8aAKtFWDZTgfdH51G0Eq9Y2/KgCOijFFABRRRQAUUU5GKMGHUUAPS3lk+6hx6mrUen95G/AUsV+pwJBg+o6VbV1cZVgR7UANjhjiGEUD3qSiigAooooAKKKKACig8DJqtLexR8L8x9qALOQBk9Ko3F6BlYuT/eqtNcyTdTgegqGgBSSSSTkmkoooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAFbi/dH0rDFbi/dH0oAWiiigClqP3I/qaz60NR+5H9TWfQAUUUUAFFFFABRRRQAUUUUATWn/AB8x/Wtesi0/4+o/rWvQAUYoooAxJP8AWv8A7xptOk/1r/7xptABRUkUDzNhR9T6Vow2kcXJG5vU0AUYrSWXnG0epq2lhGv3yWNW6KAGLDGn3UUfhT6KKACiiigAooooAayIwwyg/UVA9lE3IBU+1WaKAMyWykTlfmHtVYgg4NblRTW8cw+YYb1FAGPRU01u8B55HYioaACiiigAooooAKKKKAL9jP8A8sm+q1bkjWWMo3Q/pWMjFGDA8jmtmKQSxq470AZEkbRuVbqKZWneQeZHvUfMv6isygAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACpoLdp244UdTS29u07eijqa1ERY1CqMAUAJHGsSBVHH86iuboQjavL/AMqS6uhENqffP6VmEknJOSaAFZi7FmOSe9NoooAKKKKACiiigAooooAKKVVLHCjJ9qvQWOMNL/3yKAKaRPIcIpNW49PP/LRsewq8qhRhQAPaloAhS1hT+AE+pqUADoAPpS0UAFFFFABRRRQAhUEYIBqF7SF/4MH2qeigDPk09hzG2fY1UeNozhlIrbprqrjDAEe9AGJRV6exxlov++TVIgg4IwaAEooooAKKKKACiiigAooooAKKKKACti2/49o/pWPWxbf8e0f+7QBLRiiigChqP3k+lUavaj95Poao0AFFKAWIAGSavQWPRpf++RQBTSJ5DhFJq3Hp5xmR/wABV5VCjCgAUtAEKWsKdEB+vNSgAdAB9KWigAooooAKKKKAAgHqAahe2hfqgB9RxU1FAFCTTz1jbPsaqPE8Zw6kGtqkZVcYYAj3oAw6KuT2RXLRZI9O9U6ACiiigAooooAKKKKACiiigAooooAKs2P/AB8/garVZsf+Pn/gJoA1KKKKADFYsv8ArX/3jW1WLL/rn/3jQAyiiigAooooAKKKKACiiigAooooAKKKmgtnmPAwvqaAIe9WIrOWTnG0epq/FbRxDgZPqamoAqpYxry2WNWFjRPuqB9BTqKACiiigAooooAKKKKAGtGjjDKD+FVpLCNvuErVuigDJltJYuSM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iiigAooooAKKKKACiiigAooooAKKKKACiiigC5p/+ub/AHa0aztP/wBc3+7WjQAUUUUAYj/fb602nP8Afb602gAooooAKKKKACiiigAooooAVSVYMOoOa21YMoYdCM1h1q2T77YA9V4oAsVl3qbbgn+8M1qVT1BMor+hxQBnVsW8flQKvfqazbWPzJ1HYcmtegBCQASe1Y0rmSRnPc1pXkmy3IHVuKyqACiiigAooooAKKKKACiiigAooooAKKKKACiiigDZgfzIEb25qSqWnyZDRntyKu0AFVb6PfBuA5Xn8KtUhAYEHoaAMOipJojFKVPTt9KjoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK2Lb/j2j/3ax62Lb/j2j/3aAJaKKKAKeof6pP96s6tHUP9Un+9WdQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAKO1bnasMdq3O1ABRRRQBn6h/rE+lUqu6h/rE+lUqACiiigAooooAKKKKACrNj/x8/8AATVarNj/AMfP/ATQBqUUUUAFYsv+uf8A3jW1WLL/AK5/940AMooooAKKKKACiiigC1YPtn29mGK06xEYo4YdQc1tKwdQw6EZoAWiiigDKvI/LnPo3IqvWrdw+bCSPvLyKyqACiiigAooooAKKKKACiiigAooooAKKKKACiiigAq5YR7pS5HCjj61TAJOB1rYt4vJhC9+poAlooooAKybt99w3oOBWlNIIomc9hxWOTmgBKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAAVuL90fSsMVuL90fSgBaKKKAKWo/cj+prPrQ1H7kf1NZ9ABRRRQAUUUUAFFFFABRRRQBNaf8fUf1rXrItP+PqP61r0AFFFFAGRd/8AH1J9ahqa7/4+pPrUNABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQBc0//AFzf7taNZ2n/AOub/drRoAKKKKAMR/vt9abTn++31ptABRRRQAUUUUAFFFFABRRRQAVd098OyeozVKpbd9lwje9AGxUVwm+Bx7VLSH0oAp6fHhGkPU8CrtNjQRoEHQU6gDOv33ShM/dFU6fM/mTM3qaZQAUUUUAFFFFABRRRQAUUUUAFFFFA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ABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAewf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQB8wf8M4+MP+glof8A3/m/+NUf8M4+MP8AoJaH/wB/5v8A41X0/RQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH/2Q==";

  // ── Cover V2 — maquette fidèle ──
  h += '<div class="cover-v2">';

  // SVG : fond + dégradé diagonal + 2 lignes V + 2 lignes H
  h += '<svg class="cover-v2-grid" viewBox="0 0 794 1123" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">';
  h += '<defs>';
  // Fond de base identique au sommaire
  h += '<linearGradient id="diagFade" x1="0%" y1="100%" x2="100%" y2="0%">';
  h += '<stop offset="0%" stop-color="#F2F2EF" stop-opacity="1"/>';
  h += '<stop offset="35%" stop-color="#FAFAFA" stop-opacity="1"/>';
  h += '<stop offset="65%" stop-color="#FAFAFA" stop-opacity="1"/>';
  h += '<stop offset="100%" stop-color="#F2F2EF" stop-opacity="1"/>';
  h += '</linearGradient>';
  h += '</defs>';
  h += '<rect width="794" height="1123" fill="#F2F2EF"/>';
  h += '<rect width="794" height="1123" fill="url(#diagFade)"/>';
  // 2 lignes verticales (tiers)
  h += '<line x1="265" y1="0" x2="265" y2="1123" stroke="#D8DAE0" stroke-width="0.8"/>';
  h += '<line x1="530" y1="0" x2="530" y2="1123" stroke="#D8DAE0" stroke-width="0.8"/>';
  // 2 lignes horizontales (tiers)
  h += '<line x1="0" y1="374" x2="794" y2="374" stroke="#D8DAE0" stroke-width="0.8"/>';
  h += '<line x1="0" y1="748" x2="794" y2="748" stroke="#D8DAE0" stroke-width="0.8"/>';
  h += '</svg>';

  // Logos haut de page — PNG noirs sur fond clair : France Air ok, Invenio ok
  h += '<div class="cover-v2-header">';
  h += '<img class="cover-v2-logo-fa" src="data:image/png;base64,' + FA_B64 + '" alt="France Air"/>';
  h += '<img class="cover-v2-logo-inv" src="data:image/png;base64,' + INV_B64 + '" alt="Invenio"/>';
  h += '</div>';

  // Titre + sous-titre centrés
  h += '<div class="cover-v2-title-zone">';
  h += '<div class="cover-v2-title">' + nomProjet + '</div>';
  h += '<div class="cover-v2-subtitle">' + coverSousTitre + '</div>';
  h += '</div>';

  // Spacer flexible — pousse PLP vers le bas
  // PLP géant en SVG absolu — fiable en print
  var plpLabel = gammeShort; // "PLP"
  var szLabel = (sz || '').replace(/^0+/, ''); // supprimer zéros initiaux : "045" → "45"
  h += '<svg class="cover-v2-plp-svg" viewBox="0 0 794 1123" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMax meet">';
  // "PLP" : x=-12 pour coller au bord gauche, y=1110 (plus haut qu'avant = 1140)
  // font-size=520 pour remplir vraiment le tiers bas
  h += '<text x="-12" y="1090" ';
  h += 'font-family="Anton,Arial Black,Arial,sans-serif" ';
  h += 'font-size="520" font-weight="400" ';
  h += 'fill="#1B3A5C" ';
  h += 'letter-spacing="-12">';
  h += plpLabel;
  h += '</text>';
  // "45" : positionné juste après le dernier P
  // PLP 3 lettres × ~290px chacune (520px font) = ~870px → mais avec kerning ça coupe plus tôt
  // On place le "45" à x=640, y=1060 (un peu au-dessus de la baseline PLP)
  h += '<text x="510" y="1010" ';
  h += 'font-family="Anton,Arial Black,Arial,sans-serif" ';
  h += 'font-size="175" font-weight="400" ';
  h += 'fill="#00A896" ';
  h += 'letter-spacing="-3">';
  h += szLabel;
  h += '</text>';
  h += '</svg>';

  h += '</div>'; // .cover-v2

  // ══════════════════════════════════════════
  // PAGE 2 — SOMMAIRE
  // ══════════════════════════════════════════
  h += '<div class="plp-pg plp-pg-som" style="padding:0;background:#F2F2EF!important">';
  h += '<div class="plp-som">';
  h += '<div class="plp-som-l"><div class="plp-som-txt">SOMMAIRE</div></div>';
  h += '<div class="plp-som-r">';
  ['TABLEAU COMPARATIF','PRESCRIPTION TECHNIQUE','OPTIONS ET ACCESSOIRES','PLANS DIMENSIONNELS','VISUELS PRODUIT'].forEach(function(lbl, i) {
    h += '<div class="plp-som-item" style="align-items:baseline">'
       + '<span class="plp-som-lbl" style="line-height:1">'+lbl+'</span>'
       + '<span class="plp-som-num" style="line-height:1">0'+(i+1)+'.</span>'
       + '</div>';
  });
  h += '</div>';
  // Pas de logo haut droite
  h += '</div></div>';

  // ══════════════════════════════════════════
  // PAGE 3 — TABLEAU COMPARATIF
  // ══════════════════════════════════════════
  var typeLabel = isHS ? 'PAC réversible — R290' : "Groupe d'eau glacée — R290";
  var sousTitre = isHS ? "PAC réversible air-eau R290" : "Groupe d'eau glacée air-eau R290";

  h += '<div class="plp-pg">';
  h += plpHdr();
  h += plpBand('01', 'Tableau comparatif', 'Gamme PLP — ' + sousTitre);
  h += '<table class="plp-tb"><thead><tr><th class="plp-lc">PARAMETRE</th><th><span class="plp-thr">'+modele+'</span><span class="plp-thc">'+typeLabel+'</span></th></tr></thead>';

  // Refroidissement
  h += '<tbody style="break-inside:avoid;page-break-inside:avoid"><tr class="plp-gr"><td colspan="2">Refroidissement</td></tr>';
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
    h += '</tbody><tbody style="break-inside:avoid;page-break-inside:avoid"><tr class="plp-gr"><td colspan="2">Chauffage</td></tr>';
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
  h += '</tbody><tbody style="break-inside:avoid;page-break-inside:avoid"><tr class="plp-gr"><td colspan="2">Hydraulique</td></tr>';
  h += '<tr><td class="plp-lc">Débit d\'eau</td><td>'+(rf.debitEau||'—')+'<span class="plp-unit"> m³/h</span></td></tr>';
  h += '<tr><td class="plp-lc">Pertes de charge réseau</td><td>'+(rf.perteCharge||'—')+'<span class="plp-unit"> kPa</span></td></tr>';
  h += '<tr><td class="plp-lc">Pompe intégrée</td><td>'+buildPumpWrap(d)+'</td></tr>';

  // Electrique
  h += '</tbody><tbody style="break-inside:avoid;page-break-inside:avoid"><tr class="plp-gr"><td colspan="2">Électrique</td></tr>';
  h += '<tr><td class="plp-lc">Courant absorbé max (FLA)</td><td>'+(cd.maxCourant||'—')+'<span class="plp-unit"> A</span></td></tr>';
  h += '<tr><td class="plp-lc">Courant de démarrage (LRA)</td><td>'+(cd.courantDemarrage||'—')+'<span class="plp-unit"> A</span></td></tr>';
  h += '<tr><td class="plp-lc">Alimentation</td><td>'+(d.alimentation||'400 V / 3+N / 50 Hz')+'</td></tr>';

  // Acoustique
  h += '</tbody><tbody style="break-inside:avoid;page-break-inside:avoid"><tr class="plp-gr"><td colspan="2">Acoustique</td></tr>';
  h += '<tr><td class="plp-lc">Puissance acoustique Lw</td><td>';
  h += buildAcouWrap(cd.lwStandard,cd.lwSilencieuse,cd.lwUltra,cd.lpStandard,cd.lpSilencieuse,cd.lpUltra,state.versionAcoustique,'lw');
  h += '<span class="plp-unit" style="display:block;text-align:center;margin-top:2px">dB(A)</span></td></tr>';
  h += '<tr><td class="plp-lc">Pression acoustique Lp (10 m)</td><td>';
  h += buildAcouWrap(cd.lwStandard,cd.lwSilencieuse,cd.lwUltra,cd.lpStandard,cd.lpSilencieuse,cd.lpUltra,state.versionAcoustique,'lp');
  h += '<span class="plp-unit" style="display:block;text-align:center;margin-top:2px">dB(A)</span></td></tr>';

  // Réfrigérant & divers
  h += '</tbody><tbody style="break-inside:avoid;page-break-inside:avoid"><tr class="plp-gr"><td colspan="2">Réfrigérant &amp; divers</td></tr>';
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
  h += plpBand('03','Options et accessoires','Prix nets — remise ' + (state.remiseOptions || 0) + ' %');

  var allOpts = CONFIG.options.filter(function(o) { return o.type.includes(d.type); });
  var cats2 = [], catMap = {};
  allOpts.forEach(function(o) {
    if (!catMap[o.cat]) { catMap[o.cat] = []; cats2.push(o.cat); }
    catMap[o.cat].push(o);
  });

  var remise = typeof state.remiseOptions === 'number' ? state.remiseOptions : 0;

  cats2.forEach(function(cat) {
    h += '<div class="plp-cat" style="break-before:avoid;page-break-before:avoid">'+cat+'</div>';
    catMap[cat].forEach(function(opt) {
      var isSel = !!state.selectedOptions[opt.id];
      var p = getPrice(opt, sz);
      var pNet = '';
      if (p === 'Sur demande') { pNet = 'Sur demande'; }
      else if (p === 'N.D') { pNet = 'N.D'; }
      else if (p === 0) { pNet = 'Inclus'; }
      else if (typeof p === 'number') {
        var net = p * (1 - remise / 100);
        pNet = fmt(Math.round(net)) + ' €';
      }
      var desc = (typeof OPTION_DESCRIPTIONS !== 'undefined' && OPTION_DESCRIPTIONS[opt.id]) ? OPTION_DESCRIPTIONS[opt.id] : '';
      // Nettoyer les emojis du début des lignes de description
      var descClean = desc.replace(/🔧\s*Fonctionnement\s*/g, '<span class="plp-opt-section">Fonctionnement</span> ')
                         .replace(/✅\s*Quand la sélectionner\s*/g, '<span class="plp-opt-section">Quand la sélectionner</span> ');
      h += '<div class="plp-opt '+(isSel?'plp-sel':'plp-unsel')+'" style="break-inside:avoid;page-break-inside:avoid">';
      h += '<div class="plp-opt-info"><div class="plp-opt-name">'+opt.nom+'</div>';
      if (descClean) h += '<div class="plp-opt-desc">'+descClean+'</div>';
      h += '</div>';
      h += '<div class="plp-opt-prix"><div class="plp-opt-ht">'+pNet+'</div></div>';
      h += '<div class="plp-opt-chk"><div class="plp-chkbox'+(isSel?' checked':'')+'">'+( isSel?'&#10003;':'')+'</div><div class="plp-chk-lbl">'+(isSel?'Retenu':'')+'</div></div>';
      h += '</div>';
    });
  });

  // Récap options sélectionnées — prix nets
  if (selOpts.length > 0) {
    h += '<div class="plp-recap" style="break-inside:avoid;page-break-inside:avoid"><div class="plp-recap-t">Récapitulatif des options sélectionnées</div>';
    h += '<table class="plp-recap-tb"><thead><tr><th>Option</th><th style="text-align:right">Prix net</th></tr></thead><tbody>';
    var totalNet = 0;
    selOpts.forEach(function(o) {
      var p = getPrice(o, sz);
      var px = typeof p === 'number' ? p : 0;
      var net = px * (1 - remise / 100);
      totalNet += net;
      h += '<tr><td>'+o.nom+'</td><td style="text-align:right">'+(px?fmt(Math.round(net))+' €':'Sur devis')+'</td></tr>';
    });
    h += '<tr class="plp-recap-total"><td>TOTAL OPTIONS</td><td style="text-align:right">'+fmt(Math.round(totalNet))+' €</td></tr>';
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
