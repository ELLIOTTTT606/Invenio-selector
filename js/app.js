// ─── MODELS_DB — Gammes Galletti ──────────────────────────────────────────────
var MODELS_DB = {
  HS: [
    { gamme: 'PLN',     nom: 'PLN',     refrigerant: 'R290',  sizes: ['52','72','82','104','114','134','154'] },
    { gamme: 'MLP',     nom: 'MLP',     refrigerant: 'R290',  sizes: ['06','08','10','12','16','26','30'] },
    { gamme: 'PLP',     nom: 'PLP',     refrigerant: 'R290',  sizes: ['37','45','52','57','62'] },
    { gamme: 'MLI',     nom: 'MLI',     refrigerant: 'R32',   sizes: ['06','08','10','12','16','18','22','26','30'] },
    { gamme: 'GLE',     nom: 'GLE',     refrigerant: 'R454B', sizes: ['658','748','818','900','942','1072'] },
    { gamme: 'PLE',     nom: 'PLE',     refrigerant: 'R454B', sizes: ['52','62','72','82','92','102','122','132','142','152'] },
    { gamme: 'VLS',     nom: 'VLS',     refrigerant: 'R454B', sizes: ['162','202','234','254','274','314','344','374','414','456','546','576'] },
    { gamme: 'PLI',     nom: 'PLI',     refrigerant: 'R454B', sizes: ['35','40','45','50'] },
    { gamme: 'LCX',     nom: 'LCX',     refrigerant: 'R410A', sizes: ['92','102','122','124','142','144','162','164','174','194','214','244','274','294','324','364'] },
    { gamme: 'MPE',     nom: 'MPE',     refrigerant: 'R410A', sizes: ['04','05','07','08','09','10','13','14','15','18','20','21','24','27','28','32','35','40','54','66','30','34','42','61','69','76'] },
    { gamme: 'LCC',     nom: 'LCC',     refrigerant: 'R410A', sizes: ['52','62','72','82','92','102','112','132','142','162','182','204'] },
    { gamme: 'MPED',    nom: 'MPED',    refrigerant: 'R410A', sizes: ['07','08','10','13','15','18','20','24','27','28','32','35','40','54','66','30','34','45','61','69','76'] },
    { gamme: 'EVITECH', nom: 'EVITECH', refrigerant: 'R410A', sizes: ['52','62','72','82','92','104','124','154','174','184'] },
  ],
  CS: [
    { gamme: 'PLN',     nom: 'PLN',     refrigerant: 'R290',  sizes: ['52','72','82','104','114','134','154'] },
    { gamme: 'PLP',     nom: 'PLP',     refrigerant: 'R290',  sizes: ['37','45','52','57','62'] },
    { gamme: 'GLE',     nom: 'GLE',     refrigerant: 'R454B', sizes: ['658','748','818','900','942','1072'] },
    { gamme: 'PLE',     nom: 'PLE',     refrigerant: 'R454B', sizes: ['52','62','72','82','92','102','122','132','142','152'] },
    { gamme: 'VLS',     nom: 'VLS',     refrigerant: 'R454B', sizes: ['162','202','234','254','274','314','344','374','414','456','546','576'] },
    { gamme: 'PLI',     nom: 'PLI',     refrigerant: 'R454B', sizes: ['35','40','45','50'] },
    { gamme: 'LCX',     nom: 'LCX',     refrigerant: 'R410A', sizes: ['92','102','122','124','142','144','162','164','174','194','214','244','274','294','324','364'] },
    { gamme: 'MPE',     nom: 'MPE',     refrigerant: 'R410A', sizes: ['04','05','07','08','09','10','13','14','15','18','20','21','24','27','28','32','35','40','54','66','30','34','42','61','69','76'] },
    { gamme: 'LCC',     nom: 'LCC',     refrigerant: 'R410A', sizes: ['52','62','72','82','92','102','112','132','142','162','182','204'] },
    { gamme: 'MPED',    nom: 'MPED',    refrigerant: 'R410A', sizes: ['07','08','10','13','15','18','20','24','27','28','32','35','40','54','66','30','34','45','61','69','76'] },
  ]
};

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
      if (r && r[0] && r[1]) {
        var _atc = r[3] ? String(r[3]).trim() : '';
        var _validAtc = _atc && _atc !== 'SIEGE' && !_atc.startsWith('Rep ') && _atc.length > 3 ? _atc : '';
        CLIENTS.push([String(r[0]).trim(), String(r[1]).trim(), String(r[2]||'').trim(), _validAtc]);
      }
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
    results = CLIENTS.filter(function(c) {
      var n = (c[1]||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
      var q2 = ql.normalize('NFD').replace(/[̀-ͯ]/g,'');
      return c[0].toLowerCase().includes(ql) || n.includes(q2) || (c[2]||'').startsWith(q);
    }).slice(0, 50);
  }
  if (results.length === 0) { box.innerHTML = '<div style="padding:10px;font-size:11px;color:#999">Aucun résultat</div>'; box.classList.add("open"); return; }
  box.innerHTML = results.map(function(c) {
    var _cp = (c[2]||'').replace(/'/g,"\\'");
    var _atc = (c[3]||'').replace(/'/g,"\\'");
    return '<div class="client-result" onclick="pickClient(\'' + c[0].replace(/'/g,"\\'") + '\',\'' + c[1].replace(/'/g,"\\'") + '\',\'' + _cp + '\',\'' + _atc + '\')"><span>' + c[1] + '</span><span class="code">' + c[0] + '</span></div>';
  }).join('');
  box.classList.add("open");
}

function pickClient(code, nom, cp, atc) {
  state.selectedClient = {code, nom, cp: cp||'', atc: atc||''};
  // Déclencher affichage interlocuteurs si on est en step 1
  if (state.step === 1 && typeof renderInterlocuteurs === 'function') {
    var _deptBadge = document.getElementById('deptBadge');
    var _dept = getDeptFromCP(cp||'');
    if (_deptBadge) _deptBadge.textContent = _dept ? 'Dép. '+_dept : '';
    document.getElementById('cardInterlocuteurs').style.display = '';
    renderInterlocuteurs(cp||'', atc||'');
  }
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
    var _savedModel = state.selectedModel;
    var _savedSize = state.selectedSize;
    if (data._hasHeating && state.machineType === "CS") {
      showMsg("warning","⚠️ Ce fichier contient des données chauffage — type corrigé en PAC.");
      state.machineType = "HS"; selectType("HS");
    } else if (!data._hasHeating && state.machineType === "HS") {
      showMsg("warning","⚠️ Pas de données chauffage — type corrigé en Groupe d'Eau Glacée.");
      state.machineType = "CS"; selectType("CS");
    }
    state.selectedModel = _savedModel;
    state.selectedSize = _savedSize;
    data.type = state.machineType;
    data.size = state.selectedSize;
    state.parsedData = data;
    if (!state.selectedModel) state.selectedModel = data.gamme || '';
    if (!state.selectedSize) state.selectedSize = data.size || '';
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
  // Afficher interlocuteurs si client déjà sélectionné
  var _ci = state.selectedClient;
  if (_ci && _ci.cp && typeof renderInterlocuteurs === 'function') {
    document.getElementById('cardInterlocuteurs').style.display = '';
    var _dept = getDeptFromCP(_ci.cp);
    var _badge = document.getElementById('deptBadge');
    if (_badge) _badge.textContent = _dept ? 'Dép. ' + _dept : '';
    renderInterlocuteurs(_ci.cp, _ci.atc || '');
  }
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
      #sheetContent .plp-som-l { width: 22%; display: flex; align-items: flex-start; padding: 8mm 0 0 0; overflow: hidden; }
      #sheetContent .plp-som-txt { writing-mode: vertical-rl; transform: rotate(180deg); font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 230px; text-transform: uppercase; color: #00527A; line-height: .82; letter-spacing: -4px; }
      #sheetContent .plp-som-r { width: 78%; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 14mm 30mm 0; gap: 6mm; }
      #sheetContent .plp-som-item { display: flex; align-items: baseline; justify-content: flex-end; }
      #sheetContent .plp-som-lbl { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: .06em; color: #00527A; text-align: right; flex: 1; }
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
const gammeShort = state.selectedModel || (d.gamme || 'PLP').split(' ')[0];
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

  h += '<div class="cover-v2">';

// Bloc titre centré verticalement dans la zone dégradée (y≈310 sur viewBox 1123)
  h += '<text x="397" y="290" ';
  h += 'font-family="Anton,Arial Black,Arial,sans-serif" ';
  h += 'font-size="60" fill="#2f4a6f" text-anchor="middle">';
  h += nomProjet;
  h += '</text>';
  h += '<text x="397" y="340" ';
  h += 'font-family="Anton,Arial Black,Arial,sans-serif" ';
  h += 'font-size="22" fill="#2f4a6f" text-anchor="middle">';
  h += coverSousTitre;
  h += '</text>';

  h += '</svg>';
  h += '</div>'; // .cover-v2

  // ══════════════════════════════════════════
  // PAGE 2 — SOMMAIRE
  // ══════════════════════════════════════════
  h += '<div class="plp-pg plp-pg-som" style="padding:0;background:#F2F2EF!important">';
  h += '<div class="plp-som">';
  h += '<div class="plp-som-l" style="overflow:visible!important"><div class="plp-som-txt" style="padding-bottom:10mm">SOMMAIRE</div></div>';  h += '<div class="plp-som-r">';
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

 // Injecter la cover selon la gamme sélectionnée
  var _gammeForCover = state.selectedModel || gammeShort;
  var _sz = state.selectedSize || (state.parsedData && state.parsedData.size) || '';
  function _setCover(src) {
    var img = document.getElementById('coverImg');
    if (img && typeof src === 'string') img.src = src;
  }
  if (typeof COVERS !== 'undefined') {
    _setCover((COVERS[_gammeForCover] && COVERS[_gammeForCover][_sz]) ? COVERS[_gammeForCover][_sz] : '');
  } else {
    var s = document.createElement('script');
    s.src = 'js/covers.js';
    s.onload = function() { _setCover((COVERS && COVERS[_gammeForCover] && COVERS[_gammeForCover][_sz]) ? COVERS[_gammeForCover][_sz] : ''); };
    s.onerror = function() { _setCover(''); };
    document.head.appendChild(s);
  }
}

// ══════════════════════════════════════════════
// ADMIN (Step 3)

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
// CARTE DÉPARTEMENT + INTERLOCUTEURS
// Requiert : dept_paths.js, dept_contacts.js, clients_cp.js
// ══════════════════════════════════════════════
function getDeptFromCP(cp) {
  if (!cp) return '';
  var s = String(cp).trim().replace(/[^0-9AB]/gi,'').padStart(5,'0');
  if (/^20[0-2]/i.test(s)) return '2A';
  if (/^20[3-5]/i.test(s)) return '2B';
  return s.slice(0,2);
}

function matchATCPair(atcName, pairs) {
  if (!atcName || !pairs || !pairs.length) return 0;
  var q = atcName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[-\s]/g,'');
  for (var i = 0; i < pairs.length; i++) {
    if (pairs[i].tci && pairs[i].tci.nom) {
      var cn = pairs[i].tci.nom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[-\s]/g,'');
      var lastName = cn.split(' ').pop() || '';
      if (cn === q || cn.includes(q) || q.includes(lastName)) return i;
    }
  }
  return 0;
}

function renderInterlocuteurs(cp, atcName) {
  var wrap = document.getElementById('interlocuteursWrap');
  var mapWrap = document.getElementById('deptMapWrap');
  if (!wrap) return;

  var dept = getDeptFromCP(cp);
  if (!dept || typeof DEPT_CONTACTS === 'undefined') {
    wrap.innerHTML = '<div style="font-size:11px;color:rgba(255,255,255,.4)">Aucun département identifié</div>';
    return;
  }

  var pairs = DEPT_CONTACTS[dept] || [];
  var midx = matchATCPair(atcName, pairs);
  var pair = pairs[midx] || pairs[0];
  var region = pair ? pair.region : '';

  // Carte SVG
  if (mapWrap && typeof DEPT_PATHS !== 'undefined') {
    var svgH = '<svg viewBox="0 0 500 560" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">';
    Object.keys(DEPT_PATHS).forEach(function(d) {
      var isActive = d === dept;
      var paths = DEPT_PATHS[d];
      (paths||[]).forEach(function(p) {
        svgH += '<path d="'+p+'" fill="'+(isActive?'#2f4a6f':'rgba(47,74,111,.13)')+'" stroke="'+(isActive?'#5b84b1':'rgba(47,74,111,.32)')+'" stroke-width="'+(isActive?2:.6)+'"/>';
      });
    });
    svgH += '</svg>';
    mapWrap.innerHTML = svgH;
  }

  // Interlocuteurs
  if (!pair) {
    wrap.innerHTML = '<div style="font-size:11px;color:rgba(255,255,255,.4)">Aucun interlocuteur défini pour le dép. '+dept+'</div>';
    return;
  }

  var h = '';
  if (pairs.length > 1) {
    h += '<div style="font-size:10px;color:rgba(255,255,255,.4);margin-bottom:6px">'+pairs.length+' paires TCI/TCS sur ce département — correspondance ATC</div>';
  }
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';

  function contactCard(c, role, color) {
    if (!c) return '<div style="padding:10px;border-radius:8px;background:rgba(255,255,255,.04);border:0.5px solid rgba(255,255,255,.1);font-size:11px;color:rgba(255,255,255,.3);font-style:italic">'+role+' non défini</div>';
    var ini = (c.nom.split(/[\s-]+/).filter(function(w){return w.length>1;}).map(function(w){return w[0];}).join('') || c.nom.slice(0,2)).toUpperCase();
    return '<div style="padding:10px;border-radius:8px;background:rgba(255,255,255,.06);border:0.5px solid rgba(255,255,255,.12)">'
      + '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'
      + '<div style="width:28px;height:28px;border-radius:50%;background:'+color+';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#fff">'+ini+'</div>'
      + '<div><div style="font-size:12px;font-weight:500;color:#fff">'+c.nom+'</div><div style="font-size:10px;color:rgba(255,255,255,.5)">'+role+'</div></div>'
      + '</div>'
      + (c.email ? '<div style="font-size:10px;color:#5b84b1;margin-top:2px">'+c.email+'</div>' : '')
      + (c.tel ? '<div style="font-size:10px;color:rgba(255,255,255,.5);margin-top:1px">'+c.tel+'</div>' : '')
      + '<div style="display:flex;gap:6px;margin-top:8px">'
      + (c.email ? '<a href="mailto:'+c.email+'" style="padding:3px 8px;font-size:10px;border-radius:4px;border:0.5px solid rgba(91,132,177,.4);color:#5b84b1;text-decoration:none;background:rgba(91,132,177,.08)">Email</a>' : '')
      + (c.tel ? '<a href="tel:'+c.tel.replace(/\s/g,'')+'" style="padding:3px 8px;font-size:10px;border-radius:4px;border:0.5px solid rgba(255,255,255,.1);color:rgba(255,255,255,.5);text-decoration:none;background:rgba(255,255,255,.04)">Appeler</a>' : '')
      + '</div></div>';
  }

  h += contactCard(pair.tci, 'TCI — Itinérant', '#2f4a6f');
  h += contactCard(pair.tcs, 'TCS — Sédentaire', '#0F6E56');
  h += '</div>';

  // Bouton modifier
  h += '<div style="margin-top:8px;text-align:right"><span onclick="openEditInterlocuteurs()" style="font-size:10px;color:rgba(255,255,255,.35);cursor:pointer;text-decoration:underline">Modifier les interlocuteurs</span></div>';

  wrap.innerHTML = h;

  // Stocker dans state pour la fiche PDF
  state.interlocuteurs = { tci: pair.tci, tcs: pair.tcs, region: region, dept: dept };
}

function openEditInterlocuteurs() {
  var wrap = document.getElementById('interlocuteursWrap');
  if (!wrap) return;
  var cur = state.interlocuteurs || {};
  var tciNom = (cur.tci && cur.tci.nom) || '';
  var tcsNom = (cur.tcs && cur.tcs.nom) || '';
  wrap.innerHTML = '<div style="display:flex;flex-direction:column;gap:8px">'
    + '<div><label style="font-size:10px;color:rgba(255,255,255,.5);display:block;margin-bottom:3px">TCI (itinérant)</label>'
    + '<input id="editTCI" type="text" value="'+tciNom+'" style="width:100%;padding:6px 10px;border-radius:6px;border:0.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-size:12px;font-family:inherit"/></div>'
    + '<div><label style="font-size:10px;color:rgba(255,255,255,.5);display:block;margin-bottom:3px">TCS (sédentaire)</label>'
    + '<input id="editTCS" type="text" value="'+tcsNom+'" style="width:100%;padding:6px 10px;border-radius:6px;border:0.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-size:12px;font-family:inherit"/></div>'
    + '<div style="display:flex;gap:8px;justify-content:flex-end">'
    + '<button onclick="cancelEditInterlocuteurs()" style="padding:5px 12px;border-radius:5px;border:0.5px solid rgba(255,255,255,.15);background:none;color:rgba(255,255,255,.5);font-size:11px;cursor:pointer;font-family:inherit">Annuler</button>'
    + '<button onclick="applyEditInterlocuteurs()" style="padding:5px 12px;border-radius:5px;border:none;background:#2f4a6f;color:#fff;font-size:11px;cursor:pointer;font-family:inherit">Appliquer</button>'
    + '</div></div>';
}

function applyEditInterlocuteurs() {
  var tciNom = (document.getElementById('editTCI')||{}).value || '';
  var tcsNom = (document.getElementById('editTCS')||{}).value || '';
  if (!state.interlocuteurs) state.interlocuteurs = {};
  if (tciNom) state.interlocuteurs.tci = Object.assign({}, state.interlocuteurs.tci || {}, {nom: tciNom});
  if (tcsNom) state.interlocuteurs.tcs = Object.assign({}, state.interlocuteurs.tcs || {}, {nom: tcsNom});
  // Re-render avec overrides
  var wrap = document.getElementById('interlocuteursWrap');
  if (!wrap) return;
  renderInterlocuteurs(
    (state.selectedClient && state.selectedClient.cp) || '',
    (state.selectedClient && state.selectedClient.atc) || ''
  );
}

function cancelEditInterlocuteurs() {
  renderInterlocuteurs(
    (state.selectedClient && state.selectedClient.cp) || '',
    (state.selectedClient && state.selectedClient.atc) || ''
  );
}

// Charger clients_cp.js si CLIENTS_RAW pas encore chargé
(function() {
  if (typeof CLIENTS_RAW !== 'undefined') return;
  var s = document.createElement('script');
  s.src = 'js/clients_cp.js';
  s.onload = function() {
    if (typeof CLIENTS_RAW === 'undefined') return;
    var lines = CLIENTS_RAW.split('\n');
    CLIENTS = [];
    lines.forEach(function(line) {
      var p = line.split('|');
      if (p.length >= 2 && p[0] && p[1]) {
        CLIENTS.push([p[0], p[1], p[2]||'', p[3]||'']);
      }
    });
    updateClientCount();
    console.log('✅ ' + CLIENTS.length.toLocaleString('fr-FR') + ' clients chargés depuis clients_cp.js');
  };
  s.onerror = function() { console.warn('clients_cp.js non trouvé — import manuel requis'); };
  document.head.appendChild(s);

  // Charger dept_paths.js
  var s2 = document.createElement('script');
  s2.src = 'js/dept_paths.js';
  document.head.appendChild(s2);

  // Charger dept_contacts.js
  var s3 = document.createElement('script');
  s3.src = 'js/dept_contacts.js';
  document.head.appendChild(s3);
})();

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
