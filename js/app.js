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
      #sheetContent .plp-som { display: flex; width: 210mm; height: 297mm; background: #F2F2EF !important; position: relative; overflow: hidden; }
      #sheetContent .plp-som-l { width: 22%; display: flex; align-items: flex-start; padding: 0; overflow: hidden; }
      #sheetContent .plp-som-txt { writing-mode: vertical-rl; transform: rotate(180deg); font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 210px; text-transform: uppercase; color: #00527A; line-height: .82; letter-spacing: -4px; height: 297mm; display: flex; align-items: center; }
      #sheetContent .plp-som-r { width: 78%; display: flex; flex-direction: column; justify-content: center; padding: 0 14mm 0 0; gap: 10mm; }
      #sheetContent .plp-som-item { display: flex; align-items: baseline; justify-content: flex-end; }
      #sheetContent .plp-som-lbl { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: #00527A; text-align: right; flex: 1; }
      #sheetContent .plp-som-num { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 90px; line-height: 1; color: #00527A; margin-left: 6mm; min-width: 115px; text-align: right; }
      #sheetContent .plp-som-logo { display: none; }
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

  // ── PAGE 1 — COVER (PNG fixe + overlay SVG dynamique) ──
  var coverSousTitre = isHS ? "Fiche de sélection d'une pompe à chaleur" : "Fiche de sélection d'un groupe d'eau glacée";
  var szDisplay = sz ? String(parseInt(sz, 10)) : '';

  // PNG cover PLP (base64 embarqué)
  var COVER_PLP_B64 = "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J3OnoB4B5+50nc6QeAeabdJ3OkHgWHm7nSdzp+kHhHmi3SdzpB4dw83c6dDudP0g8I8026fpO5U/SDwfEefudPQTbp6JB4B5+50nc6egHrj2O50dCdyp+kHgWHm7nT0L3OnoB4Ogh5u50nc6fpB4SXm7nT9J3On6QeAefudOhFukHgHn7nSdzpB65Lz9yp+km1R9IPDA83cqfpO50/T9oPCPN3On6ftO50/T9oPD8DoebudP0/adzpB4Nw88W6eg7nT0A8Ejz9zo6DudPQD1x7Hc6egB7QamoAamoAamoAagAAAAGpqAAAAHEAGoAcQAagAAagAgLqAABqAIACgAaoC6oKCKICoACiagqAAogAACoAAABqAw22nNrFeW37ylmWG205tYry2/eUsyAAACAqKAEoAKJIGoKAkyTIAogAAAAAAAAAABJKAKEgiooCACkiAKJIAKCAAEkgAAAAEiKAgoBIgCiAMVtdzfxHnW/eUsqxW13N/Eedb69IMrIKCAABIASAAEgigBIigIKAgoIBIAAEAAEABIEgiyICwipAKkEgEgSASQAQAAQAAhIBKoAEkAEAAABBIQAkLIBIhIAsAPOHEcQAamoAamoAamoAcYAABqagBqAAAAGpqAIoGoAIocQAaoCmqKCKAAmoC6oKCKJqCpqAAqAqagACgJqAAAKmoAAAAAAAw22nNrFeW37ylmGH205tYry2/eUsyACAKACAAogAKAmoAKIAAAAABIAAAAAIAoSBKCgJKygCiAAoJIAKhIAAABIEgAIoASIAokgKigkgoDEbXf2BiPOt+8pZaWK2u5v4jzrfvKQZUlUAAkAACQAAAAlAUkQBZEBUJAAAJAkAIAAIARZAJIRQRUgkCCQACQCQAAAIJEBUJUEIAAACAIAIJAJEWQRZIQFRUgFEAewHEcQAcRxABqagBqagBqgKIAvEagBqagCKAAcRqACAvEagCCgAaoCmqAAoAGqAqAAKgKIAAoIqagGoAAAGoAAAAAAICgAw22nNrFeW37ylmdWG205tYry2/eUsyCKGoCCgAgAKAgAKIAAAAAABIAAAAIAoAIKASIAokgSCgIAAqAASBIAAABJyICgSCKAEoKAhIAogDFbXc38R51v3lLKsVtdzfxHnW+vSDKgoJIAASAEiAoEgigBKCgkqgAABBIAAAEAAEEgiyICospAKkA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AIAB5wAAUEFAQVAAAA1NQA1AVAANQA1AAAADUAAA1AAAADVAUAEUAA1QF1RQEUNQDVAAUAE1ANQUEVNQDUFBFQA1ABh9tObWK8tv3lLMsNtpzbxXlt+8pZgDUAANQAAAAAABBQAQAUAEAFEBUFAEAAAAAAAANQNQAAkAAkAABABQQBUWQSQUBCQAVAAAJAAYna7+wMR51vr0stLE7W838R51v3lIMsCAKEgSgoEiKCAAAAAAQBAAABCKCKkEgCoASAEBJAAAAAAIASqAsIEAEABIEgBABBIQAiyQAkCgipBIBIAAAAAagA84AAAAAAKCAABqagBqAAgKagBqAAAAGpqACAupqAIoABqAGqKAigAaoCmqKCCgAmoBqCgiiAqAAKmoKmoACpqAADDbac28V5bfvKWZYfbTm1ivLb95SzGoAAAGoAAAICooAGqAKACAAogEgoCAAKmoEgAEgABIGoABMkyAAAIKAgAKIACgIABIAASBIAAABIgKxO13N/Eedb95SyzE7Xc38R51vr0gywACCgIKAgAAABAAAAABAEAIKAgoJJASAEAAAAACKAEIoIqQSAAABAAAAAAQAiyICwioCoAAEgAAQBAAAPPxnGAHGcYAAAAAAAAagBqagAgKIoGpqACKAAagBqgKaooCKAAagCALqigIomoKaoACgIqagLqgACpqCpqAAAAAAAAAMNtpzbxXlt+8pZlh9tObWK8tv3lLMAAAigAaooIoAIKCKICoKACAAoCAAogAAAAAEgagAGoAAAIKAioAokgAoCAAKgAEgSAASSAAAigBLE7W838R51vr0sqxW1vN/Eedb95SDLEkoCkiAqAAAAAAABIAAIAogBKpAKhJAAAEkAAEAAABIgKigCABIQSAABBIAQEkAJAoEkISAAASEABIAQAAQAgsAPPqagBqcYAcYACKAgoAAAGpqAGoAIApqigIoCKAAapxgpqgC6ooCKGoAgC6oKCCmoAgBqCggqagqagAAAGoBqAAGoBqAAADD7ac28V5bfvKWXYfbPm3ivLb95SzIAIC6ooACACgAaoAKAIACiAAAKgAAAAAAAAAagABqAgoAgAogAKAgAKIAAAAASSAASBIACKAMTtdzfxHnW+vSyzE7Xf2BiPOt9ekGVUQBRAAAAkACQAAAAAgJBFISQFEAJACAIAAAAACCQRRACVQAJIAAAkgAAgkAkQFhFSAVBQQAAAAAACACAA1EAexqagBqagBqcYAIoCCgIKAAagBqmsgogCmqALqnGoCCgIpqmoKIAuqCggpxAipqAqagAKAipqAGoACoAABqAAAAAABqAAABqDD7ac2sV5bfvKWY1YbbPm3ivLb95SzIIoagIKCKGoCCgiiAqCgiiAAoCagAAAAAAAAAIoAICgAIACiSACgIACiAAAqAAAAABIABJIACAMVtbzfxHnW/eUssxO13N/Eedb69IMqogAAAAAAAEAAAIoAkCgJAASEAAQAAAAAAAIKCSsIABAASAEAABIAQigSJBICiAQSAASAEAAEEgBCAsIqQCwADz6moAamoAamoAnGcagIKAgoCCmoAmpqCicYCmqAGpxiggoCC6wmoKIAuqagAKAgamoKmoAAoIBqCpqAAAAagAAAGoBqigAACACgDD7ac2sV5bfvKWYYbbTm3ivLb95SzAAoAJqACgAgAKAIAAqAAAAAAAGoAAAIKACAKACAAogAKAgAKIAAAAAAAAAgoBIgChIJIKAxO1vN/Eedb69LKsVtdzfxHnW+vSDKyBIAAAAAAAAEAAQiyQAgoCAAQAEgSAEAAICkiAqCgIAAAAQAAAQSACLJACCgkkAAAASAASQAABIigiiACgPPqmoAamoAuqagBqcYoJxigIKAgpxAguqagomoCiAGpqAAKCAagKmoAagAAABqAABqAABqAABqAABqAagCKAAICooAGqAuqCgw22fNvFeW37ylmWH205t4ry2/eUsuC6oKCKICoKCKIAAAqagAAAAAGoAAAAGoAAaoAoAIKACAAoCAAogAAAAAAAACCgAgCgAgoCCgMTtbzfxHnW+vSyrFbXc38R51vr0gyoAAAAAAAAIAogEKIBAEAAQAAAAABIAIAogBKoABAAAAAEhBIAIAsiAQKgKgAAABAAABAACCgSkAAEAPY1NUAXU1QA1NQA1NQAAAFAQVAANQA1AUQANQA1AAFTiADUBUADUAAAANQDUAAAANUBdQAANQBAFRQANUBdUFBFE1BUAGH2z5t4ry2/eUsyw22nNvFeW37ylmdQE1AAUAQABU1BUAADUAAAAAAANUAUAE1FBFEBUFAEABQBAAVAAAFQAAAAAEFABAFABBQEFAQAXkYna3+wMR51vr0sqxW13N/Eedb69IMqAAAAABJASCKIAogCiAAAEgABAAAAAAigioAAAAAQAAEgAAEkIoIqQAAAAABIAABIEgiiAEqgKhJAKIA8/EcQAamoAamoAamoAagAAACgIHEABqagKgAagBqAAAAGpqAABqAAAAGoAagAAAGqApqigigAGqAuqCgiiagqagAKACAMPtnzbxXlt+8pZhh9s+beK8tv3lLMgCagAKCKmoAAAGoAAAagAAAIoAGoCCgAgAoAgAKIACggAAAAAAAAACCgAgCgAgoCCgIAAADE7W/wBgYjzrfXpZZitreb+I86316QZUAAAAAARQJEhQQAAAAAAAAAAJAEUAQUEAACAAAAACCQARZIAQUBAAAAAAPoAAJIARQARZBFSAAkAIFAebiOIAOI4gANQA1NQA1NQAAAAAA4gA1NQAADiADU1AAAADUAAA1AAAADUARQNUUAA1ANUABQAEBU1AAUAEAAUEVNQGH2z5t4ry2/eUsww+2fNvE+W37ylmAFQAAAAAAAAA1AABAXVFAA1QBQAEAFE1BUFBFEABQEkAAAAAAAAAEFABAFABBQEAFQAAAAAGJ2t/sDEedb69LLMVtbzfxHnW+vSDKgAAAIKAgoCQKCEAAAAAAAACAoICoqAqAAAAABJBBIAAIogCyICoAAAAAEgABAACAqKQAgoCABIQABADzgAHEAHEcQAamoAamoAagAAAAABqagBqAAAamoAAAAagBqgKaooCKAAagCALqigIoACALqgoIomoKIAAoIqagGoAAGoMPtnzbxXlt+8pZhh9s+beK8tv3lLMAAagGoAAAGoAAagGoAihqAgoIogKgoAIACgIagAAKgAKgAAAagAAAigBIgCgAgoCCggAAAAAAADE7W/2BiPOt9ellmK2t5v4jzrfXpBlQABFAQUBABUAAAAgACAAAABAFEAFQACAAIAAAAAIACQSQFEAFQAAAJAAAJABFIQBRACVSAAkAAAAB5wAAAAAOI1ADU1ADUAAAAAADUANQAQBTUANUUBFAANUBRAF1RQEUABNQFTUUEFABNQFTUABQAQA1AAA1ANQAABh9s+beK8tv3lLMMPtnzbxXlt+8pZgAAANQAAANUBQAA1QAUAE1ABQBNQAUQFQAFEAAADUAAAAAAAAABAFACUFAQUBAAAAAAAAAAYna3+wMR51vr0ssxO1vN/Eedb69IMsgoCCgIKAgAqAAAAAAABIQAAgCiACoAAASAEBIAAAgoCQKCSAAAAAAAABACKAJAoJKpBIAQAEgBASQAADziAKIAoigAAamoAamoAIoCCgAAAamoAgCiKBqigIKAAmoKIAuqaiggoAGqApqgAKAipqAqagACgipqAAAAagAAAAw+2fNvFeW37ylmGH2z5t4ry2/eUswBqAAABqigAICoKACAqCgiiAagoIogAKCAAAAqAAAAAACAKAAigAgKgoCCgIAAAAAAAAAAADE7W/2BiPOt9ellWK2t5v4jzrfXpBlkFAQAVAAAAAAAAAAEUBBQQAAAAAAAAACAAIJACEJAVABUACQAAAAAAQFRSAEFASAAkCQAgAAAAB5xAFEAUQBRAFEUDU1ADVFAQUBBQADUATUBRAF1TUUEFARQ1AEAVNQAFARRNQUQA1AAFTUFQANQAANQDUAAAA1ANQAYfbPm3ivLb95SzDD7Z828V5bfvKWYAEUEUNQDVFBFAA1QAUAEAAUATUABUBUAAVANQAAAAAAAAAEFABAFEBUAFQUBAAAAAAAAAAQUBidrf7AxHnW+vSyrFbW838R51vr0gyyAAAAEgAAAAAAAACCgIKAgAEABJBBIAQAAAiiAKIBBKoBAAAAAABAAASCKIAogBKoAEgAAEgABBIAAPOIAogCiAKIAogC6mqAGpqoCCgIKAgpqAJqcYKIAqagBxigIKmoKJqAqagACggqagKgBqAAAAGoBqAABqAABqAAAAIoMNtnzbxXlt+8pZlh9s+beK8tv3lLMagGqAAoAJqACgAmoACgCAAKCKgAAAAAAAagAAAgoAICooAaiAKIAogAAAAAAAAAAAACCgIKAxO1v8AYGI86316WVYra3+wMR51vr0gyoAAAAABIAAAAAIKAgoCCggAAAAAAQSAEEgikIAogAqAAAAAAAAACKAJBICkIAKgEEgBASQAAAABqADziAKIAogCiAKIApqgC6pqAAoCCgIKmoCpqagogCpqAGoAAoCBqagogBqAAAAGoAagAAAGoAagAAAGqAuoAAGoBqgDD7Z828T5bfvKWYYjbPm3ivLb95SzAAmoC6oKACAuqCgiiAqAAogAAAqAAAAAagAAgKAACAKACCgiiAKIAAAAAAAAAAAIoCCgIKAgoIxW1v8AYGI86316WVYra3+wMR51vr0gyoAAAAAAAAAAACCgIAAAAAAAAAAAAigipBIAQAAAAAAAQAAEgCCgIKCSQQSAEEgAAAAQAAigAgD2BOM4wUTjOMFEAUQBRAFQANTUANQABQEFAQNTUBU1AVAA1AAAAA1AAA1NQAAADUANQAAAA1ANUUBFAAADVFBFAATUBiNs5/8AtvFeW37yll2H2z5t4ry2/eUsyCKICoACiagqagAKgKmoAAAGoAAAGoAAACKAAAgoAIC6oKAgoIAAAAAAAAAAAAAAgoCCgIKAgAMVtb/YGI86316WVYra3+wMR51vr0gyoAAAAAAACKAIAAAAAAAAAAACCgIKAgoCAAAAAAAAAACAsAkAqEkAqAAAAQEgEEEgAAAgKipAKADzBqagBqcYKIAogCiACoAGoAamoAAACoABqAGoCoAGpqAAAAGoAagBqAHGAAHEagAgLqAABqACAuqKAihqAIACgAIDEbZ828T5bfvKWXYfbPm3ifLb95SzAAqagqagACgCAAKCBqAagABqAagAAgKAACAKAAgAogKgoCAAAAAAAAAAAAAAigCCgIAKgAAAMVtb/YGI86316WVYra3+wMR51vr0gyoAAAAAAICggAAAAAEAQEgEAAAAIoAgoCCgIAAAAAAAAICggCiAEqkAAQAAAAAABIAAIAogAoDzBqagBqagBqcYAcZxgKgAAAABqagBrIAAAAAAamoAABqAGsgAAABqAGqKBqigAGoAICpqoCCgAaoCpqKCCgAmoBqCgiiagxG2fNvFeW37yll9WH2z5t4ny2/eUswAKAioAAAKmoBqAAAAAABqAIoAACCgAgLqgoAgAogAAAAAAAAAAAAAIAogKioCoKAgAqAAAAxW1v8AYGI86316WVYra3+wMR51vr0gyoAAAAigiiAAAAAQABAABIAAQBBJIBCEqCAAAAAAAAAAAAAAiiAKIAKgAAEAAQEgAACC8gEiAAAGoQA84amoAamoAamoAHGAAAAAABqagBqAAAAAAGpqAAAagBqAAAAGpqAcSALqACKAAaoCmqKCCgAICpqAAoCKmoCpqAAqAw+2fNvE+W37ylmWG2z5t4ny2/eUswBqCgioAAAAagGoAAAGoAigAaiAKAAgAogKgoCAAGoAAAAAAAAAAAACKIAogAAAAAAAAAADFbW/2BiPOt9ellWK2t/sDEedb69IMqAAAAgAAAAAAAEgAAAAAEoCwSIAABAAAAAA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";

  h += '<div class="cover-v2">';

  // Image de fond pleine page
  h += '<img style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0" ';
  h += 'src="data:image/png;base64,' + COVER_PLP_B64 + '" alt="Cover"/>';

  // SVG overlay : titre + sous-titre + numéro taille
  h += '<svg style="position:absolute;inset:0;width:100%;height:100%;z-index:2;overflow:visible" ';
  h += 'viewBox="0 0 794 1123" xmlns="http://www.w3.org/2000/svg">';

  // Titre projet (centré, y=236, font-size=60)
  h += '<text x="397" y="236" ';
  h += 'font-family="Anton,Arial Black,Arial,sans-serif" ';
  h += 'font-size="60" fill="#1B3A5C" text-anchor="middle">';
  h += nomProjet;
  h += '</text>';

  // Sous-titre (centré, y=236+60+2=298, font-size=23)
  h += '<text x="397" y="298" ';
  h += 'font-family="Anton,Arial Black,Arial,sans-serif" ';
  h += 'font-size="23" fill="#1B3A5C" text-anchor="middle">';
  h += coverSousTitre;
  h += '</text>';

  // Numéro taille (x=603, y=1123, font-size=115)
  h += '<text x="603" y="1123" ';
  h += 'font-family="Anton,Arial Black,Arial,sans-serif" ';
  h += 'font-size="115" fill="#00A896">';
  h += szDisplay;
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
