// ─── MODELS_DB — Gammes Galletti ─────────────────────────────────────────────
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

// ─── CARTE FRANCE — données régions ───────────────────────────────────────────
var FRANCE_REGIONS = {
  'NORD': {
    path: 'M185,30 L240,25 L265,55 L270,90 L245,110 L210,100 L185,80 Z',
    cx: 225, cy: 68,
    contacts: []
  },
  'EST': {
    path: 'M265,55 L320,45 L345,80 L340,130 L300,145 L265,115 L245,110 L270,90 Z',
    cx: 300, cy: 95,
    contacts: []
  },
  'PARIS EST': {
    path: 'M210,100 L245,110 L265,115 L255,145 L220,155 L195,135 Z',
    cx: 230, cy: 128,
    contacts: []
  },
  'PARIS OUEST': {
    path: 'M155,90 L210,100 L195,135 L165,145 L140,120 Z',
    cx: 178, cy: 118,
    contacts: []
  },
  'OUEST': {
    path: 'M60,100 L155,90 L140,120 L150,175 L120,220 L70,240 L30,200 L25,145 Z',
    cx: 100, cy: 168,
    contacts: []
  },
  'CENTRE EST': {
    path: 'M195,135 L255,145 L300,145 L305,210 L270,250 L220,255 L180,225 L165,180 Z',
    cx: 240, cy: 195,
    contacts: []
  },
  'SUD OUEST': {
    path: 'M30,200 L120,220 L150,175 L165,180 L180,225 L160,290 L120,330 L60,340 L20,290 Z',
    cx: 100, cy: 270,
    contacts: []
  },
  'SUD EST': {
    path: 'M180,225 L220,255 L270,250 L305,210 L330,260 L310,330 L260,365 L180,355 L140,310 L120,330 L160,290 Z',
    cx: 240, cy: 295,
    contacts: []
  }
};

// ─── STATE ────────────────────────────────────────────────────────────────────
var state = {
  machineType: null, file: null, fileType: null, parsedData: null,
  selectedModel: null, selectedSize: null, selectedClient: null,
  region: '', contact: null, versionAcoustique: 'standard',
  selectedOptions: {}, step: 0, dimensionImage: null,
  remiseOptions: 0,
};

// ─── FILE PARSING — détection depuis le nom du fichier ───────────────────────
function parseFilename(filename) {
  var name = filename.replace(/\.[^.]+$/, '').toUpperCase().replace(/[-_ ]/g, '');
  var result = { gamme: null, size: null, type: null };

  // Détection gamme (ordre par longueur décroissante)
  var gammes = Object.keys(MODELS_DB.HS).map(function(i) { return MODELS_DB.HS[i].gamme; })
    .concat(Object.keys(MODELS_DB.CS).map(function(i) { return MODELS_DB.CS[i].gamme; }))
    .filter(function(v, i, a) { return a.indexOf(v) === i; })
    .sort(function(a, b) { return b.length - a.length; });

  for (var i = 0; i < gammes.length; i++) {
    if (name.startsWith(gammes[i])) {
      result.gamme = gammes[i];
      break;
    }
  }

  if (result.gamme) {
    var rest = name.slice(result.gamme.length);
    // Détection type : H ou HS = PAC, C ou CS = GEG
    var typeMatch = rest.match(/(HS|CS|H|C)$/i);
    if (typeMatch) {
      result.type = typeMatch[1].toUpperCase().startsWith('H') ? 'HS' : 'CS';
      rest = rest.slice(0, rest.length - typeMatch[1].length);
    }
    // Détection taille
    var allSizes = [];
    var allModels = (MODELS_DB.HS || []).concat(MODELS_DB.CS || []);
    allModels.forEach(function(m) {
      if (m.gamme === result.gamme) {
        m.sizes.forEach(function(s) { if (allSizes.indexOf(s) === -1) allSizes.push(s); });
      }
    });
    // Chercher la taille la plus longue qui match
    allSizes.sort(function(a, b) { return b.length - a.length; });
    for (var j = 0; j < allSizes.length; j++) {
      if (rest === allSizes[j] || rest.includes(allSizes[j])) {
        result.size = allSizes[j];
        break;
      }
    }
  }
  return result;
}

// ─── FILE HANDLING ────────────────────────────────────────────────────────────
function handleCSD(f) {
  if (!f) return;
  var isDocx = f.name.match(/\.docx?$/i);
  var isPdf = f.name.match(/\.pdf$/i);
  if (!isDocx && !isPdf) { showMsg('error', 'Format non supporté. Importez un fichier .docx ou .pdf'); return; }
  state.file = f;
  state.fileType = isPdf ? 'pdf' : 'docx';

  // Update UI
  var box = document.getElementById('dropCSD');
  box.classList.add('has-file');
  document.getElementById('uz-title').textContent = f.name;
  document.getElementById('uz-sub').textContent = (f.size / 1024).toFixed(0) + ' Ko — ' + (isPdf ? 'PDF' : 'DOCX');

  // Parse filename
  var detected = parseFilename(f.name);
  var detWrap = document.getElementById('detWrap');
  detWrap.style.display = 'flex';
  document.getElementById('detGamme').textContent = detected.gamme || 'Gamme non détectée';
  document.getElementById('detSize').textContent = detected.size ? 'Taille ' + detected.size : 'Taille non détectée';
  document.getElementById('detType').textContent = detected.type === 'HS' ? 'Pompe à chaleur' : detected.type === 'CS' ? "Groupe d'eau glacée" : 'Type non détecté';

  // Auto-fill selectors
  if (detected.type) {
    selectType(detected.type);
    if (detected.gamme) {
      var selModel = document.getElementById('selModel');
      selModel.value = detected.gamme;
      state.selectedModel = detected.gamme;
      onModelChange(detected.size);
    }
  }

  hideMsg();
  checkReady();
}

// Drag & drop
(function() {
  var drop = document.getElementById('dropCSD');
  if (!drop) return;
  drop.addEventListener('dragover', function(e) { e.preventDefault(); drop.style.borderColor = '#2f4a6f'; });
  drop.addEventListener('dragleave', function() { drop.style.borderColor = ''; });
  drop.addEventListener('drop', function(e) { e.preventDefault(); drop.style.borderColor = ''; handleCSD(e.dataTransfer.files[0]); });
})();

// ─── TYPE / MODEL / SIZE ──────────────────────────────────────────────────────
function selectType(type) {
  state.machineType = type;
  document.getElementById('choicePAC').className = 'type-btn' + (type === 'HS' ? ' active' : '');
  document.getElementById('choiceGEG').className = 'type-btn' + (type === 'CS' ? ' active' : '');
  var sel = document.getElementById('selModel');
  sel.innerHTML = '<option value="">Sélectionner</option>';
  sel.disabled = false;
  (MODELS_DB[type] || []).forEach(function(m) {
    var opt = document.createElement('option');
    opt.value = m.gamme;
    opt.textContent = m.nom;
    if (m.sizes.length === 0) { opt.disabled = true; opt.textContent += ' (bientôt disponible)'; }
    sel.appendChild(opt);
  });
  document.getElementById('selSize').innerHTML = '<option value="">Gamme d\'abord</option>';
  document.getElementById('selSize').disabled = true;
  checkReady();
}

function onModelChange(preSize) {
  var gamme = document.getElementById('selModel').value;
  state.selectedModel = gamme || null;
  var selS = document.getElementById('selSize');
  if (!gamme) { selS.innerHTML = '<option value="">Gamme d\'abord</option>'; selS.disabled = true; checkReady(); return; }
  var model = (MODELS_DB[state.machineType] || []).find(function(m) { return m.gamme === gamme; });
  selS.innerHTML = '<option value="">Taille</option>';
  (model ? model.sizes : []).forEach(function(s) {
    var opt = document.createElement('option'); opt.value = s; opt.textContent = s; selS.appendChild(opt);
  });
  selS.disabled = false;
  if (preSize && model && model.sizes.indexOf(preSize) !== -1) { selS.value = preSize; state.selectedSize = preSize; }
  selS.onchange = function() { state.selectedSize = selS.value || null; checkReady(); };
  checkReady();
}

// ─── CLIENTS ──────────────────────────────────────────────────────────────────
async function loadClientsExcel(f) {
  if (!f) return;
  showMsg('success', '⏳ Chargement des clients...');
  try {
    var data = await f.arrayBuffer();
    var wb = XLSX.read(data, { type: 'array' });
    var ws = wb.Sheets[wb.SheetNames[0]];
    var rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
    var start = 0;
    if (rows.length > 0 && typeof rows[0][0] === 'string' && rows[0][0].toLowerCase().includes('code')) start = 1;
    CLIENTS = [];
    for (var i = start; i < rows.length; i++) {
      var r = rows[i];
      if (r && r[0] && r[1]) CLIENTS.push([String(r[0]).trim(), String(r[1]).trim()]);
    }
    if (typeof TursoSync !== 'undefined' && TursoSync.isConnected()) {
      DB.clients.bulkImport(CLIENTS).then(function(n) { console.log('✅ ' + n + ' clients synchronisés'); });
    }
    updateClientCount();
    showMsg('success', '✅ ' + CLIENTS.length.toLocaleString('fr-FR') + ' clients importés');
    setTimeout(hideMsg, 2500);
  } catch(e) { showMsg('error', 'Erreur lecture Excel : ' + e.message); }
}

async function searchClient(q) {
  var box = document.getElementById('clientResults');
  if (!q || q.length < 2) { box.classList.remove('open'); return; }
  var results;
  if (typeof TursoSync !== 'undefined' && TursoSync.isConnected()) {
    results = await TursoSync.searchClients(q);
  } else {
    var ql = q.toLowerCase();
    results = CLIENTS.filter(function(c) { return c[0].toLowerCase().includes(ql) || c[1].toLowerCase().includes(ql); }).slice(0, 50);
  }
  if (!results.length) { box.innerHTML = '<div style="padding:10px;font-size:12px;color:rgba(255,255,255,.3)">Aucun résultat</div>'; box.classList.add('open'); return; }
  box.innerHTML = results.map(function(c) {
    return '<div class="client-result" onclick="pickClient(\'' + c[0].replace(/'/g, "\\'") + '\',\'' + c[1].replace(/'/g, "\\'") + '\')">' +
      '<span>' + c[1] + '</span><span class="code">' + c[0] + '</span></div>';
  }).join('');
  box.classList.add('open');
}

function pickClient(code, nom) {
  state.selectedClient = { code: code, nom: nom };
  document.getElementById('clientResults').classList.remove('open');
  document.getElementById('clientSearch').value = '';
  document.getElementById('clientManual').value = '';
  document.getElementById('clientSelectedText').textContent = nom + ' — ' + code;
  document.getElementById('clientSelected').classList.add('visible');
  checkReady();
}

function clearClient() {
  state.selectedClient = null;
  document.getElementById('clientSelected').classList.remove('visible');
  document.getElementById('clientSearch').value = '';
  document.getElementById('clientManual').value = '';
  checkReady();
}

function onManualClient(val) {
  if (val && val.length > 1) {
    state.selectedClient = { code: '', nom: val };
    document.getElementById('clientSelectedText').textContent = val;
    document.getElementById('clientSelected').classList.add('visible');
  } else if (!val) {
    state.selectedClient = null;
    document.getElementById('clientSelected').classList.remove('visible');
  }
  checkReady();
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.client-search-wrap')) {
    var box = document.getElementById('clientResults');
    if (box) box.classList.remove('open');
  }
});

function updateClientCount() {
  var el = document.getElementById('clientCount');
  if (el) el.textContent = CLIENTS.length.toLocaleString('fr-FR') + ' clients en base';
  var searchEl = document.getElementById('clientSearch');
  if (searchEl) searchEl.placeholder = 'Rechercher parmi ' + CLIENTS.length.toLocaleString('fr-FR') + ' clients…';
}

// ─── VALIDATION ───────────────────────────────────────────────────────────────
function checkReady() {
  var ready = state.file && state.machineType && state.selectedModel && state.selectedSize;
  var btn = document.getElementById('btnGo');
  if (btn) btn.disabled = !ready;
}

// ─── ANALYZE & GO ────────────────────────────────────────────────────────────
async function analyzeAndGo() {
  hideMsg();
  document.getElementById('loader').style.display = 'block';
  document.getElementById('btnGo').disabled = true;
  try {
    if (state.fileType === 'pdf') {
      showMsg('error', 'Le parsing PDF n\'est pas encore disponible. Exportez la fiche en .docx depuis le configurateur Galletti.');
      document.getElementById('loader').style.display = 'none';
      checkReady();
      return;
    }
    var _savedModel = state.selectedModel;
    var _savedSize = state.selectedSize;
    var data = await parseDocx(state.file);
    if (data._hasHeating && state.machineType === 'CS') {
      showMsg('warning', 'Ce fichier contient des données chauffage — type corrigé en PAC.');
      state.machineType = 'HS'; selectType('HS');
    } else if (!data._hasHeating && state.machineType === 'HS') {
      showMsg('warning', "Pas de données chauffage — type corrigé en Groupe d'Eau Glacée.");
      state.machineType = 'CS'; selectType('CS');
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
    if (!data.modele) missing.push('modèle');
    if (!data.resultsFroid.puissanceFrigo && !data.resultsChaud) missing.push('puissances');
    if (!data.commonData.lwStandard) missing.push('données acoustiques');
    if (!data.date) missing.push('date');
    if (missing.length > 0) {
      showMsg('warning', 'Données incomplètes : ' + missing.join(', ') + '. Le format du fichier a peut-être changé.');
      setTimeout(function() { offerCSDHelp(data, missing); }, 500);
    } else {
      showMsg('success', data.modele + ' — ' + (data.type === 'HS' ? 'PAC' : 'GEG') + ' — Taille ' + data.size);
    }
    // Copier num/nom projet du step 0 vers step 1
    var n1 = document.getElementById('inputNumProjet');
    var n2 = document.getElementById('inputNumProjet2');
    if (n1 && n2 && n1.value) n2.value = n1.value;
    var m1 = document.getElementById('inputNomProjet');
    var m2 = document.getElementById('inputNomProjet2');
    if (m1 && m2 && m1.value) m2.value = m1.value;
    setTimeout(function() { goToStep(1); }, 800);
  } catch(e) {
    showMsg('error', 'Erreur : ' + e.message); console.error(e);
  } finally {
    document.getElementById('loader').style.display = 'none'; checkReady();
  }
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
function goToStep(n) {
  if (n >= 1 && !state.parsedData) return;
  state.step = n;
  ['step0','step1','step2','step3'].forEach(function(id, i) {
    var el = document.getElementById(id);
    if (el) el.classList.toggle('visible', i === n);
  });
  document.querySelectorAll('.nav-step').forEach(function(el) {
    var s = parseInt(el.dataset.step);
    el.className = 'nav-step' + (s === n ? ' active' : s < n ? ' done' : ' disabled');
    el.onclick = function() { if (s <= n || (s <= 3 && state.parsedData)) goToStep(s); };
  });
  if (n === 1) buildConfig();
  if (n === 2) buildPreview();
  if (n === 3) buildAdmin();
  window.scrollTo(0, 0);
}

// ─── CARTE FRANCE ─────────────────────────────────────────────────────────────
function buildFranceMap(activeRegion) {
  var svg = document.getElementById('france-map');
  if (!svg) return;

  var html = '';
  Object.keys(FRANCE_REGIONS).forEach(function(nom) {
    var r = FRANCE_REGIONS[nom];
    var isActive = nom === activeRegion;
    var fill = isActive ? '#2f4a6f' : 'rgba(255,255,255,.06)';
    var stroke = isActive ? '#5b84b1' : 'rgba(255,255,255,.12)';
    var textColor = isActive ? '#fff' : 'rgba(255,255,255,.35)';
    var label = nom.replace('PARIS EST', 'P. EST').replace('PARIS OUEST', 'P. OUEST').replace('CENTRE EST', 'C. EST').replace('SUD OUEST', 'S. OUEST').replace('SUD EST', 'S. EST');
    html += '<path d="' + r.path + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="1.5" style="cursor:pointer;transition:fill .2s" onclick="selectRegionMap(\'' + nom + '\')" />';
    html += '<text x="' + r.cx + '" y="' + (r.cy + 4) + '" text-anchor="middle" font-size="10" fill="' + textColor + '" style="pointer-events:none;font-family:IBM Plex Sans,sans-serif;font-weight:500">' + label + '</text>';
  });
  svg.innerHTML = html;
}

function buildRegionList(activeRegion) {
  var list = document.getElementById('regionList');
  if (!list) return;
  list.innerHTML = Object.keys(FRANCE_REGIONS).map(function(nom) {
    var isActive = nom === activeRegion;
    return '<div class="region-item' + (isActive ? ' active' : '') + '" onclick="selectRegionMap(\'' + nom + '\')">' +
      '<div class="region-dot"></div>' + nom + '</div>';
  }).join('');
}

function selectRegionMap(nom) {
  state.region = nom;
  // Sync with dropdown
  var selRegion = document.getElementById('selRegion');
  if (selRegion) { selRegion.value = nom; onRegionChange(); }
  buildFranceMap(nom);
  buildRegionList(nom);
  buildContactCards(nom);
}

function buildContactCards(region) {
  var wrap = document.getElementById('contactCards');
  if (!wrap) return;
  var contacts = CONFIG.contacts[region] || [];
  if (!contacts.length) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'flex';
  wrap.innerHTML = contacts.map(function(c) {
    var isTCS = c.poste && c.poste.toLowerCase().includes('sédentaire');
    var initials = c.nom.split(' ').filter(function(w) { return w === w.toUpperCase() && w.length > 1; }).slice(0, 2).map(function(w) { return w[0]; }).join('') || c.nom.substring(0, 2).toUpperCase();
    return '<div class="contact-card">' +
      '<div class="avatar ' + (isTCS ? 'tcs' : 'tci') + '">' + initials + '</div>' +
      '<div><div class="contact-name">' + c.nom + '</div>' +
      '<div class="contact-role">' + c.poste + '</div>' +
      '<div class="contact-detail">' + (c.email || '') + (c.tel ? ' — ' + c.tel : '') + '</div></div></div>';
  }).join('');
}

// ─── CONFIG (STEP 1) ──────────────────────────────────────────────────────────
function buildConfig() {
  var d = state.parsedData, isHS = d.type === 'HS';
  var gamme = state.selectedModel || d.gamme || 'PLP';
  var sz = state.selectedSize || d.size || '';
  document.getElementById('cfgTitle').textContent = gamme + ' ' + sz;
  document.getElementById('cfgSub').textContent = (isHS ? 'Pompe à chaleur' : "Groupe d'eau glacée") + ' — Taille ' + sz;

  // Région / contact dropdowns
  var sr = document.getElementById('selRegion');
  sr.innerHTML = '<option value="">Sélectionner</option>';
  Object.keys(CONFIG.contacts).forEach(function(r) {
    sr.innerHTML += '<option value="' + r + '">' + r + '</option>';
  });
  if (state.region) { sr.value = state.region; onRegionChange(); }

  // Sync projet fields
  var n0 = document.getElementById('inputNumProjet');
  var n1 = document.getElementById('inputNumProjet2');
  if (n0 && n1 && !n1.value && n0.value) n1.value = n0.value;
  var m0 = document.getElementById('inputNomProjet');
  var m1 = document.getElementById('inputNomProjet2');
  if (m0 && m1 && !m1.value && m0.value) m1.value = m0.value;

  // Remise
  var remEl = document.getElementById('inputRemise');
  if (remEl) remEl.value = state.remiseOptions || 0;

  buildFranceMap(state.region || null);
  buildRegionList(state.region || null);
  if (state.region) buildContactCards(state.region);

  buildAcoustic();
  buildOptions();
}

function onRegionChange() {
  state.region = document.getElementById('selRegion').value;
  var sc = document.getElementById('selContact');
  sc.innerHTML = '<option value="">Sélectionner</option>';
  sc.disabled = !state.region;
  (CONFIG.contacts[state.region] || []).forEach(function(c) {
    sc.innerHTML += '<option value="' + c.nom + '">' + c.nom + ' — ' + c.poste + '</option>';
  });
  state.contact = null;
  var ci = document.getElementById('contactInfo');
  if (ci) ci.style.display = 'none';
  buildFranceMap(state.region || null);
  buildRegionList(state.region || null);
  buildContactCards(state.region);
}

function onContactChange() {
  var n = document.getElementById('selContact').value;
  state.contact = (CONFIG.contacts[state.region] || []).find(function(c) { return c.nom === n; }) || null;
  var b = document.getElementById('contactInfo');
  if (state.contact) {
    b.style.display = 'block';
    b.innerHTML = '<div style="font-size:12px;color:rgba(255,255,255,.5);padding:8px 0;">' +
      (state.contact.tel ? state.contact.tel + ' — ' : '') + (state.contact.email || '') + '</div>';
  } else {
    b.style.display = 'none';
  }
}

function buildAcoustic() {
  var cd = state.parsedData.commonData;
  var vs = [
    { key: 'standard', label: 'Standard', desc: 'Aucune isolation', lw: cd.lwStandard, lp: cd.lpStandard },
    { key: 'silencieuse', label: 'Silencieuse', desc: 'Capot compresseur', lw: cd.lwSilencieuse, lp: cd.lpSilencieuse },
    { key: 'ultra', label: 'Ultra Silencieuse', desc: 'Capot + ventil. BV', lw: cd.lwUltra, lp: cd.lpUltra }
  ];
  var g = document.getElementById('acousticGrid');
  g.innerHTML = '';
  vs.forEach(function(v) {
    var c = document.createElement('div');
    c.className = 'acoustic-card' + (state.versionAcoustique === v.key ? ' selected' : '');
    c.onclick = function() { state.versionAcoustique = v.key; buildAcoustic(); };
    c.innerHTML = '<h4>' + v.label + '</h4><div class="desc">' + v.desc + '</div>' +
      '<div class="vals"><span class="lw">Lw ' + (v.lw || '—') + ' dB(A)</span><span class="lp">Lp ' + (v.lp || '—') + ' dB(A)</span></div>';
    g.appendChild(c);
  });
}

function getPrice(o, sz) {
  if (!sz || o.prix[sz] === undefined) return 0;
  var p = o.prix[sz];
  if (p === '?') return 'Sur demande';
  var v = parseInt(p) || 0;
  if (v === 0) {
    var allZero = CONFIG.sizes.every(function(s) { return (parseInt(o.prix[s]) || 0) === 0; });
    if (allZero) return 0;
    return 'N.D';
  }
  return v;
}

function fmt(n) { return n === 'Sur demande' ? n : n.toLocaleString('fr-FR'); }

function fmtPrix(n) {
  if (typeof n !== 'number' || isNaN(n)) return '—';
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function buildOptions() {
  var d = state.parsedData, sz = state.selectedSize || d.size;
  var remEl = document.getElementById('inputRemise');
  if (remEl) state.remiseOptions = parseFloat(remEl.value) || 0;
  var app = CONFIG.options.filter(function(o) { return o.type.includes(d.type); });
  var cats = [...new Set(app.map(function(o) { return o.cat; }))];
  var c = document.getElementById('optionsContainer');
  c.innerHTML = '';
  cats.forEach(function(cat) {
    var items = app.filter(function(o) { return o.cat === cat; });
    var title = document.createElement('div');
    title.className = 'cat-title';
    title.textContent = cat;
    c.appendChild(title);
    var g = document.createElement('div');
    g.className = 'opt-grid';
    items.forEach(function(opt) {
      var p = getPrice(opt, sz);
      var it = document.createElement('div');
      it.className = 'opt-item' + (state.selectedOptions[opt.id] ? ' checked' : '');
      var remise = state.remiseOptions || 0;
      var prixNet = (typeof p === 'number' && p > 0 && remise > 0)
        ? Math.round(p * (1 - remise / 100)).toLocaleString('fr-FR') + ' € <span style="text-decoration:line-through;opacity:.4;font-size:11px">' + fmt(p) + '€</span>'
        : (p === 'Sur demande' ? 'Sur demande' : p === 'N.D' ? 'Non dispo.' : p === 0 ? 'Inclus' : fmt(p) + ' €');
      var desc = OPTION_DESCRIPTIONS[opt.id] || '';
      it.innerHTML = '<div class="opt-row" style="display:flex;align-items:center;gap:12px;padding:10px 12px;border:1px solid rgba(255,255,255,.07);border-radius:8px;cursor:pointer;">' +
        '<div class="opt-chk">' + (state.selectedOptions[opt.id] ? '✓' : '') + '</div>' +
        '<span class="opt-name">' + opt.nom + (opt.note ? ' <em style="font-size:11px;opacity:.5">(' + opt.note + ')</em>' : '') + '</span>' +
        '<span class="opt-price">' + prixNet + '</span></div>' +
        (desc ? '<div class="opt-desc" style="display:none;padding:8px 12px;font-size:12px;color:rgba(255,255,255,.4);line-height:1.6;">' + desc + '</div>' : '');
      it.querySelector('.opt-row').addEventListener('click', function() {
        state.selectedOptions[opt.id] = !state.selectedOptions[opt.id];
        it.classList.toggle('checked');
        it.querySelector('.opt-chk').textContent = state.selectedOptions[opt.id] ? '✓' : '';
        updateTotal();
      });
      g.appendChild(it);
    });
    c.appendChild(g);
  });
  updateTotal();
}

function updateTotal() {
  var d = state.parsedData, sz = state.selectedSize || d.size;
  var remEl = document.getElementById('inputRemise');
  state.remiseOptions = remEl ? (parseFloat(remEl.value) || 0) : 0;
  var sel = CONFIG.options.filter(function(o) { return state.selectedOptions[o.id] && o.type.includes(d.type); });
  var t = 0, n = 0, sd = false, nd = false;
  sel.forEach(function(o) {
    var p = getPrice(o, sz);
    if (p === 'Sur demande') sd = true;
    else if (p === 'N.D') nd = true;
    else t += p;
    n++;
  });
  var el = document.getElementById('optTotal');
  if (el) el.textContent = n ? n + ' option' + (n > 1 ? 's' : '') + ' • ' + fmt(t) + ' € HT' + (sd ? ' + sur demande' : '') + (nd ? ' N.D' : '') : '';
}

// ─── HELPERS FICHE ────────────────────────────────────────────────────────────
function buildAcouWrap(lw_std, lw_ins, lw_ultra, lp_std, lp_ins, lp_ultra, versionKey, type) {
  var vals = type === 'lw' ? [lw_std, lw_ins, lw_ultra] : [lp_std, lp_ins, lp_ultra];
  var labels = ['Std', 'Inso', 'S-Inso'];
  var keys = ['standard', 'silencieuse', 'ultra'];
  var h = '<div class="plp-acou-wrap">';
  labels.forEach(function(lbl, i) {
    var active = keys[i] === versionKey ? 'active' : 'inactive';
    h += '<div class="plp-acou-col ' + active + '"><span class="plp-acou-lbl">' + lbl + '</span><span class="plp-acou-val">' + (vals[i] || '—') + '</span></div>';
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
  h += '<div class="plp-pump-card ' + (hasPump ? 'plp-pump-off' : 'plp-pump-on') + '"><span class="plp-pump-icon">' + (hasPump ? '✕' : '●') + '</span><span class="plp-pump-lbl">Sans</span></div>';
  h += '<div class="plp-pump-card ' + (hasLP || hasLPD || hasLPI ? 'plp-pump-on' : 'plp-pump-off') + '"><span class="plp-pump-icon">●</span><span class="plp-pump-lbl">BP</span><span class="plp-pump-data">' + pdc + ' kPa</span></div>';
  h += '<div class="plp-pump-card ' + (hasHP ? 'plp-pump-on' : 'plp-pump-off') + '"><span class="plp-pump-icon">●</span><span class="plp-pump-lbl">HP</span></div>';
  return h + '</div>';
}

// ─── PREVIEW (STEP 2) ─────────────────────────────────────────────────────────
function buildPreview() {
  if (!document.getElementById('__plp_preview_css__')) {
    var styleEl = document.createElement('style');
    styleEl.id = '__plp_preview_css__';
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:ital,wght@0,400;0,600;1,400&display=swap');
      #sheetContent { background: #e8e8e8; padding: 20px; }
      #sheetContent .plp-pg { width: 210mm; min-height: 297mm; padding: 20mm; background: #fff !important; position: relative; margin: 0 auto 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.15); }
      #sheetContent .cover-v2 { width: 210mm; height: 297mm; position: relative; overflow: hidden; display: flex; flex-direction: column; background: #F2F2EF !important; margin: 0 auto 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.15); }
      #sheetContent .plp-hdr { height: 36px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #CCC; margin-bottom: 16px; padding-bottom: 6px; flex-shrink: 0; }
      #sheetContent .plp-hdr-proj { font-family: 'Barlow', sans-serif; font-size: 8px; color: #666; }
      #sheetContent .plp-hdr-ref { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 8px; color: #333; }
      #sheetContent .plp-ftr { height: 24px; border-top: 1px solid #CCC; display: flex; align-items: center; justify-content: space-between; font-family: 'Barlow', sans-serif; font-size: 7.5px; color: #666; text-transform: uppercase; letter-spacing: .1em; margin-top: auto; padding-top: 5px; flex-shrink: 0; }
      #sheetContent .plp-band { background: #2f4a6f !important; padding: 12px 24px; margin-bottom: 18px; flex-shrink: 0; }
      #sheetContent .plp-band-t { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 18px; text-transform: uppercase; color: #fff; letter-spacing: .05em; }
      #sheetContent .plp-band-s { font-family: 'Barlow', sans-serif; font-size: 9px; color: rgba(255,255,255,.8); margin-top: 2px; }
      #sheetContent .plp-som { display: flex; width: 210mm; height: 297mm; background: #F2F2EF !important; position: relative; overflow: hidden; }
      #sheetContent .plp-som-l { width: 22%; display: flex; align-items: flex-start; padding: 8mm 0 0 0; overflow: visible !important; }
      #sheetContent .plp-som-txt { writing-mode: vertical-rl; transform: rotate(180deg); font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 230px; text-transform: uppercase; color: #2f4a6f; line-height: .82; letter-spacing: -4px; padding-bottom: 10mm; }
      #sheetContent .plp-som-r { width: 78%; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 14mm 30mm 0; gap: 6mm; }
      #sheetContent .plp-som-item { display: flex; align-items: baseline; justify-content: flex-end; }
      #sheetContent .plp-som-lbl { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: .06em; color: #2f4a6f; text-align: right; flex: 1; }
      #sheetContent .plp-som-num { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 90px; line-height: 1; color: #2f4a6f; margin-left: 6mm; min-width: 115px; text-align: right; }
      #sheetContent .plp-tb { width: 100%; border-collapse: collapse; font-size: 9px; }
      #sheetContent .plp-tb th, #sheetContent .plp-tb td { padding: 6px 10px; vertical-align: middle; }
      #sheetContent .plp-tb thead th { background: #2f4a6f !important; color: #fff; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; text-align: center; padding: 10px 12px; font-size: 10px; border: none; }
      #sheetContent .plp-tb thead th + th { border-left: 1px solid rgba(255,255,255,.2); }
      #sheetContent .plp-tb thead th.plp-lc { text-align: left; font-size: 8px; text-transform: uppercase; }
      #sheetContent .plp-tb .plp-lc { width: 32%; text-align: left; font-family: 'Barlow', sans-serif; font-size: 9px; color: #333; background: #F2F2EF !important; border-right: 2px solid #2f4a6f; }
      #sheetContent .plp-tb tbody td { text-align: center; border-bottom: 1px solid #CCC; font-family: 'Barlow Condensed', sans-serif; font-weight: 600; font-size: 10px; color: #111; background: #F2F2EF !important; }
      #sheetContent .plp-tb .plp-gr td { background: #fff !important; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: #2f4a6f; padding: 8px 12px; text-align: left; border-top: 2px solid #2f4a6f; border-bottom: 1px solid #CCC; }
      #sheetContent .plp-acou-wrap { display: flex; gap: 4px; justify-content: center; }
      #sheetContent .plp-acou-col { flex: 1; text-align: center; padding: 4px 3px; border-radius: 2px; font-family: 'Barlow Condensed', sans-serif; font-size: 9px; }
      #sheetContent .plp-acou-col.active { background: #2f4a6f !important; color: #fff; font-weight: 700; }
      #sheetContent .plp-acou-col.inactive { background: #e8e8e8 !important; color: #aaa; }
      #sheetContent .plp-acou-lbl { font-size: 6.5px; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 2px; display: block; }
      #sheetContent .plp-acou-val { font-size: 10px; font-weight: 700; display: block; }
      #sheetContent .plp-pump-wrap { display: flex; gap: 4px; justify-content: center; }
      #sheetContent .plp-pump-card { flex: 1; text-align: center; padding: 6px 4px; border-radius: 3px; font-family: 'Barlow Condensed', sans-serif; max-width: 80px; }
      #sheetContent .plp-pump-on { background: #2f4a6f !important; color: #fff; }
      #sheetContent .plp-pump-off { background: #e8e8e8 !important; color: #aaa; }
      #sheetContent .plp-pump-icon { font-size: 8px; display: block; margin-bottom: 1px; }
      #sheetContent .plp-pump-lbl { font-weight: 700; font-size: 10px; display: block; }
      #sheetContent .plp-pump-data { font-size: 7.5px; display: block; margin-top: 2px; opacity: .85; }
      #sheetContent .plp-presc { padding: 0 8px; }
      #sheetContent .plp-pb { margin-bottom: 20px; }
      #sheetContent .plp-pb-t { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 9.5px; text-transform: uppercase; letter-spacing: .06em; color: #111; margin-bottom: 6px; padding-bottom: 5px; border-bottom: 1px solid #2f4a6f; }
      #sheetContent .plp-pb-x { font-family: 'Barlow', sans-serif; font-size: 9.5px; line-height: 1.65; color: #333; }
      #sheetContent .plp-cat { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: .1em; color: #2f4a6f; background: #F2F2EF !important; padding: 8px 12px; border-left: 4px solid #2f4a6f; margin: 20px 0 8px; }
      #sheetContent .plp-opt { display: flex; align-items: flex-start; padding: 10px 12px; border-bottom: 1px solid #e0e0e0; }
      #sheetContent .plp-opt.plp-sel { background: #D6E8F2 !important; border-left: 3px solid #2f4a6f; }
      #sheetContent .plp-opt.plp-unsel { opacity: .6; }
      #sheetContent .plp-opt-name { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 9.5px; text-transform: uppercase; }
      #sheetContent .plp-opt-desc { font-family: 'Barlow', sans-serif; font-size: 9px; color: #555; line-height: 1.5; margin-top: 3px; }
      #sheetContent .plp-opt-ht { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 9.5px; }
      #sheetContent .plp-chkbox { width: 16px; height: 16px; border: 1.5px solid #2f4a6f; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #fff; }
      #sheetContent .plp-chkbox.checked { background: #2f4a6f !important; }
      #sheetContent .plp-recap { border: 2px solid #2f4a6f; padding: 16px 24px; margin-top: 24px; }
      #sheetContent .plp-recap-t { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 13px; text-transform: uppercase; color: #2f4a6f; margin-bottom: 12px; }
      #sheetContent .plp-recap-tb th { background: #2f4a6f !important; color: #fff; font-size: 8px; text-transform: uppercase; padding: 5px 8px; text-align: left; font-family: 'Barlow Condensed', sans-serif; }
      #sheetContent .plp-recap-tb td { padding: 5px 8px; border-bottom: .5px solid #e0e0e0; font-family: 'Barlow', sans-serif; }
      #sheetContent .plp-recap-total td { background: #2f4a6f !important; color: #fff; font-weight: 600; }
      #sheetContent .plp-iz { border: 1px dashed #bbb; background: #f9f9f9 !important; display: flex; align-items: center; justify-content: center; text-align: center; padding: 20px; font-size: 9px; color: #999; min-height: 200mm; }
      #sheetContent .plp-unit { font-family: 'Barlow', sans-serif; font-weight: 400; font-size: 8px; color: #666; margin-left: 3px; }
      #sheetContent .plp-thr { display: block; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 12px; }
      #sheetContent .plp-thc { display: block; font-family: 'Barlow', sans-serif; font-weight: 400; font-size: 8px; opacity: .75; margin-top: 2px; }
      #sheetContent .plp-li { padding-left: 16px; position: relative; margin-bottom: 2px; }
      #sheetContent .plp-li::before { content: "–"; position: absolute; left: 0; color: #666; }
    `;
    document.head.appendChild(styleEl);
  }

  var d = state.parsedData, isHS = d.type === 'HS', sz = state.selectedSize || d.size;
  var numP = document.getElementById('inputNumProjet2').value || document.getElementById('inputNumProjet').value;
  var nomP = document.getElementById('inputNomProjet2').value || document.getElementById('inputNomProjet').value;
  var selOpts = CONFIG.options.filter(function(o) { return state.selectedOptions[o.id] && o.type.includes(d.type); });
  var total = 0;
  selOpts.forEach(function(o) { var p = getPrice(o, sz); if (typeof p === 'number') total += p; });
  var cl = state.selectedClient;
  var cd = d.commonData || {};
  var rf = d.resultsFroid || {};
  var rc = d.resultsChaud || {};
  var nomProjet = nomP || 'Projet';
  var refProjet = numP || '—';
  var clientNom = cl ? cl.nom : '—';
  var dateStr = d.date || new Date().toLocaleDateString('fr-FR');
  var gamme = state.selectedModel || (d.gamme || 'PLP').split(' ')[0];
  var modele = d.modele || (gamme + sz + (isHS ? 'HS' : 'CS'));
  var gammeShort = gamme;

  function plpHdr() {
    return '<div class="plp-hdr"><div class="plp-hdr-logo"><div style="font-family:Barlow Condensed,sans-serif;font-weight:800;font-size:13px;color:#2f4a6f">FRANCE AIR <span style="opacity:.4">×</span> Invenio</div></div>' +
      '<div class="plp-hdr-r"><div class="plp-hdr-proj">' + nomProjet + '</div><div class="plp-hdr-ref">' + refProjet + '</div></div></div>';
  }
  function plpFtr(label, num) {
    return '<div class="plp-ftr"><span>' + label.toUpperCase() + '</span><span>Page ' + num + '</span></div>';
  }
  function plpBand(num, titre, sous) {
    return '<div class="plp-band"><div class="plp-band-t">' + num + ' — ' + titre + '</div>' + (sous ? '<div class="plp-band-s">' + sous + '</div>' : '') + '</div>';
  }

  var h = '';

  // PAGE 1 — COVER
  var coverSousTitre = isHS ? "Fiche de sélection d'une pompe à chaleur" : "Fiche de sélection d'un groupe d'eau glacée";
  var szDisplay = sz ? String(parseInt(sz, 10)) : '';

  h += '<div class="cover-v2">';
  h += '<img id="coverImg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0" src="" alt="Cover"/>';
  h += '<svg style="position:absolute;inset:0;width:100%;height:100%;z-index:2;overflow:visible" viewBox="0 0 794 1123" xmlns="http://www.w3.org/2000/svg">';
  h += '<text x="397" y="290" font-family="Anton,Arial Black,Arial,sans-serif" font-size="58" fill="#2f4a6f" text-anchor="middle" font-weight="400">' + nomProjet + '</text>';
  h += '<text x="397" y="340" font-family="Anton,Arial Black,Arial,sans-serif" font-size="22" fill="#2f4a6f" text-anchor="middle" font-weight="400">' + coverSousTitre + '</text>';
  h += '</svg>';
  h += '</div>';

  // PAGE 2 — SOMMAIRE
  h += '<div class="plp-pg" style="padding:0;background:#F2F2EF!important">';
  h += '<div class="plp-som">';
  h += '<div class="plp-som-l" style="overflow:visible!important"><div class="plp-som-txt" style="padding-bottom:10mm">SOMMAIRE</div></div>';
  h += '<div class="plp-som-r">';
  ['TABLEAU COMPARATIF','PRESCRIPTION TECHNIQUE','OPTIONS ET ACCESSOIRES','PLANS DIMENSIONNELS','VISUELS PRODUIT'].forEach(function(lbl, i) {
    h += '<div class="plp-som-item"><span class="plp-som-lbl" style="line-height:1">' + lbl + '</span><span class="plp-som-num" style="line-height:1">0' + (i+1) + '.</span></div>';
  });
  h += '</div></div></div>';

  // PAGE 3 — TABLEAU COMPARATIF
  var typeLabel = isHS ? 'PAC réversible — R290' : "Groupe d'eau glacée — R290";
  var sousTitre = isHS ? 'PAC réversible air-eau R290' : "Groupe d'eau glacée air-eau R290";
  h += '<div class="plp-pg">';
  h += plpHdr();
  h += plpBand('01', 'Tableau comparatif', 'Gamme ' + gammeShort + ' — ' + sousTitre);
  h += '<table class="plp-tb"><thead><tr><th class="plp-lc">PARAMETRE</th><th><span class="plp-thr">' + modele + '</span><span class="plp-thc">' + typeLabel + '</span></th></tr></thead>';

  var rows = [];
  if (rf.puissanceFrigo) rows.push(['Puiss. frigorifique', rf.puissanceFrigo + ' kW']);
  if (rf.puissanceFrigoUNI) rows.push(['Puiss. frigo [UNI]', rf.puissanceFrigoUNI + ' kW']);
  if (rf.debitEau) rows.push(['Débit eau', rf.debitEau + ' l/h']);
  if (rf.perteCharge) rows.push(['Perte de charge', rf.perteCharge + ' kPa']);
  if (rf.puissAbsTotale) rows.push(['Puiss. absorbée totale', rf.puissAbsTotale + ' kW']);
  if (rf.eer) rows.push(['EER', rf.eer]);
  if (rf.seer) rows.push(['SEER', rf.seer]);
  if (isHS && rc) {
    if (rc.puissanceChauffage) rows.push(['Puiss. calorifique', rc.puissanceChauffage + ' kW']);
    if (rc.cop) rows.push(['COP', rc.cop]);
    if (rc.scop) rows.push(['SCOP', rc.scop]);
  }
  if (cd.lwStandard) rows.push(['Niveau sonore Lw', buildAcouWrap(cd.lwStandard, cd.lwSilencieuse, cd.lwUltra, cd.lpStandard, cd.lpSilencieuse, cd.lpUltra, state.versionAcoustique, 'lw')]);
  if (cd.lpStandard) rows.push(['Niveau sonore Lp', buildAcouWrap(cd.lwStandard, cd.lwSilencieuse, cd.lwUltra, cd.lpStandard, cd.lpSilencieuse, cd.lpUltra, state.versionAcoustique, 'lp')]);
  rows.push(['Pompe', buildPumpWrap(d)]);

  var tbody = '<tbody>';
  rows.forEach(function(r) { tbody += '<tr><td class="plp-lc">' + r[0] + '</td><td>' + r[1] + '</td></tr>'; });
  h += tbody + '</tbody></table>';
  h += plpFtr('Tableau comparatif', 3);
  h += '</div>';

  // PAGE 4 — PRESCRIPTION
  h += '<div class="plp-pg">';
  h += plpHdr();
  h += plpBand('02', 'Prescription technique', modele + ' — ' + sousTitre);
  h += '<div class="plp-presc">';
  if (d.prescription && d.prescription.length) {
    d.prescription.forEach(function(p) {
      h += '<div class="plp-pb"><div class="plp-pb-t">' + (p.titre || '') + '</div><div class="plp-pb-x">' + (p.contenu || '').replace(/\n/g,'<br/>') + '</div></div>';
    });
  } else {
    h += '<div class="plp-pb"><div class="plp-pb-t">Caractéristiques générales</div><div class="plp-pb-x">Données de prescription non disponibles dans le fichier CSD.</div></div>';
  }
  h += '</div>';
  h += plpFtr('Prescription technique', 4);
  h += '</div>';

  // PAGE 5 — OPTIONS
  h += '<div class="plp-pg">';
  h += plpHdr();
  h += plpBand('03', 'Options et accessoires', modele);
  var remise = state.remiseOptions || 0;
  var cats2 = [...new Set(CONFIG.options.filter(function(o) { return o.type.includes(d.type); }).map(function(o) { return o.cat; }))];
  cats2.forEach(function(cat) {
    h += '<div class="plp-cat">' + cat + '</div>';
    CONFIG.options.filter(function(o) { return o.cat === cat && o.type.includes(d.type); }).forEach(function(opt) {
      var p = getPrice(opt, sz);
      var isSel = state.selectedOptions[opt.id];
      var pNet = (typeof p === 'number' && p > 0 && remise > 0) ? Math.round(p * (1 - remise/100)) : p;
      var pStr = pNet === 'Sur demande' ? 'Sur demande' : pNet === 'N.D' ? 'N.D.' : pNet === 0 ? 'Inclus' : fmtPrix(pNet) + ' € HT';
      h += '<div class="plp-opt ' + (isSel ? 'plp-sel' : 'plp-unsel') + '">';
      h += '<div style="flex:55%;min-width:0"><div class="plp-opt-name">' + opt.nom + '</div>';
      if (OPTION_DESCRIPTIONS[opt.id]) h += '<div class="plp-opt-desc">' + OPTION_DESCRIPTIONS[opt.id].replace(/<[^>]+>/g,' ').substring(0,150) + '</div>';
      h += '</div><div style="width:25%;text-align:right;padding-left:12px"><div class="plp-opt-ht">' + pStr + '</div>';
      if (remise > 0 && typeof p === 'number' && p > 0) h += '<div style="font-size:8px;color:#999;text-decoration:line-through">' + fmtPrix(p) + ' €</div>';
      h += '</div>';
      h += '<div style="width:20%;display:flex;flex-direction:column;align-items:center;padding-left:8px"><div class="plp-chkbox ' + (isSel ? 'checked' : '') + '">' + (isSel ? '✓' : '') + '</div></div>';
      h += '</div>';
    });
  });
  if (selOpts.length > 0) {
    var totalNet = 0;
    selOpts.forEach(function(o) { var p = getPrice(o, sz); if (typeof p === 'number') totalNet += remise > 0 ? Math.round(p*(1-remise/100)) : p; });
    h += '<div class="plp-recap"><div class="plp-recap-t">Récapitulatif options sélectionnées</div>';
    h += '<table class="plp-recap-tb" style="width:100%;border-collapse:collapse"><thead><tr><th>Option</th><th style="text-align:right">Prix HT</th></tr></thead><tbody>';
    selOpts.forEach(function(o) {
      var p = getPrice(o, sz);
      var pNet = (typeof p === 'number' && p > 0 && remise > 0) ? Math.round(p*(1-remise/100)) : p;
      h += '<tr><td>' + o.nom + '</td><td style="text-align:right">' + (typeof pNet === 'number' && pNet > 0 ? fmtPrix(pNet) + ' €' : pNet) + '</td></tr>';
    });
    h += '<tr class="plp-recap-total"><td>Total options</td><td style="text-align:right">' + fmtPrix(totalNet) + ' € HT</td></tr>';
    h += '</tbody></table></div>';
  }
  h += plpFtr('Options et accessoires', 5);
  h += '</div>';

  // PAGE 6 — PLANS
  h += '<div class="plp-pg">';
  h += plpHdr();
  h += plpBand('04', 'Plans dimensionnels', modele);
  var dimImg = state.dimensionImage || (document.getElementById('asset_dimension') && document.getElementById('asset_dimension').src);
  if (dimImg && dimImg.length > 100) {
    h += '<div style="text-align:center;padding:16px 0"><img src="' + dimImg + '" style="max-width:100%;max-height:200mm;object-fit:contain" /></div>';
  } else {
    h += '<div class="plp-iz">[ Plans dimensionnels — ' + modele + ' ]<br/><br/>À remplacer par le plan Galletti</div>';
  }
  h += plpFtr('Plans dimensionnels', 6);
  h += '</div>';

  // PAGE 7 — VISUELS
  h += '<div class="plp-pg">';
  h += plpHdr();
  h += plpBand('05', 'Visuels produit', modele + ' — Configuration retenue');
  var assetM = document.getElementById('asset_machine');
  if (assetM && assetM.src && assetM.src.length > 100) {
    h += '<div style="text-align:center;padding:16px 0"><img src="' + assetM.src + '" style="max-width:80%;max-height:160mm;object-fit:contain" /></div>';
  } else {
    h += '<div class="plp-iz">[ Visuel produit — ' + modele + ' ]<br/><br/>À remplacer par le visuel Galletti</div>';
  }
  h += '<div style="font-family:Barlow,sans-serif;font-style:italic;font-size:8px;color:#666;text-align:center;margin-top:8px">' + modele + ' — ' + (isHS ? "PAC réversible R290" : "Groupe d'eau glacée R290") + ' — Configuration retenue</div>';
  h += plpFtr('Visuels produit', 7);
  h += '</div>';

  document.getElementById('sheetContent').innerHTML = h;

  // Charger la cover
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
    s.onload = function() {
      var sz2 = state.selectedSize || (state.parsedData && state.parsedData.size) || '';
      _setCover((COVERS && COVERS[_gammeForCover] && COVERS[_gammeForCover][sz2]) ? COVERS[_gammeForCover][sz2] : '');
    };
    s.onerror = function() { _setCover(''); };
    document.head.appendChild(s);
  }
}

// ─── ADMIN (STEP 3) ───────────────────────────────────────────────────────────
function buildAdmin() {
  var h = '<div class="admin-intro">Gérez les données de l\'application.</div>';
  h += '<div class="card"><div class="card-label">Mise à jour des prix</div>';
  h += '<div class="admin-import" onclick="document.getElementById(\'filePrices\').click()"><h4>Importer un fichier Excel de prix</h4><p>Remplace les prix actuels pour la session en cours</p></div>';
  h += '<input type="file" id="filePrices" accept=".xlsx,.xls" style="display:none" onchange="loadPricesExcel(this.files[0])">';
  h += '<div class="admin-format">Format attendu : feuilles C-version (GEG) et H-version (PAC), colonnes D–H = tailles.</div></div>';
  h += '<div class="card"><div class="card-label">Contacts</div>';
  Object.keys(CONFIG.contacts).forEach(function(r) {
    h += '<div class="admin-region">' + r + '</div><table class="admin-tbl"><thead><tr><th>Nom</th><th>Poste</th><th>Tél</th><th>Email</th></tr></thead><tbody>';
    CONFIG.contacts[r].forEach(function(c) {
      h += '<tr><td>' + c.nom + '</td><td>' + c.poste + '</td><td>' + c.tel + '</td><td>' + c.email + '</td></tr>';
    });
    h += '</tbody></table>';
  });
  h += '</div>';
  document.getElementById('adminContent').innerHTML = h;
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function openModal(content) {
  document.getElementById('modalContent').innerHTML = content;
  document.getElementById('modalOverlay').style.display = 'flex';
}
function closeModal() {
  document.getElementById('modalOverlay').style.display = 'none';
}
document.getElementById('modalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

function openPriceUpdate() {
  openModal('<div class="card-label" style="margin-bottom:12px">Actualiser les prix</div>' +
    '<div class="admin-import" onclick="document.getElementById(\'filePricesModal\').click()" style="margin-bottom:12px"><h4>Importer Excel de prix</h4><p>08-PLP_2025-C-H.xlsx</p></div>' +
    '<input type="file" id="filePricesModal" accept=".xlsx,.xls" style="display:none" onchange="loadPricesExcel(this.files[0]);closeModal()">' +
    '<button class="btn" onclick="closeModal()">Annuler</button>');
}

function openClientUpdate() {
  openModal('<div class="card-label" style="margin-bottom:12px">Actualiser la base clients</div>' +
    '<div class="admin-import" onclick="document.getElementById(\'fileClientsModal\').click()" style="margin-bottom:12px"><h4>Importer Excel clients</h4><p>Colonnes : Code client, Nom client</p></div>' +
    '<input type="file" id="fileClientsModal" accept=".xlsx,.xls" style="display:none" onchange="loadClientsExcel(this.files[0]);closeModal()">' +
    '<button class="btn" onclick="closeModal()">Annuler</button>');
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
function showMsg(type, msg) {
  hideMsg();
  var el = document.getElementById('msg');
  el.className = 'msg ' + type + ' visible';
  el.textContent = msg;
}
function hideMsg() {
  var el = document.getElementById('msg');
  el.className = 'msg';
}

// ─── CSD HELP ─────────────────────────────────────────────────────────────────
function offerCSDHelp(data, missing) {
  // Placeholder — peut être étendu
  console.log('Données manquantes :', missing);
}

// ─── EXCEL PRICES ─────────────────────────────────────────────────────────────
async function loadPricesExcel(f) {
  if (!f) return;
  showMsg('success', '⏳ Lecture du fichier prix...');
  try {
    var data = await f.arrayBuffer(), wb = XLSX.read(data, { type: 'array' });
    var cSheet = wb.Sheets['C-version'] || wb.Sheets[wb.SheetNames[0]];
    var hSheet = wb.Sheets['H-version'] || wb.Sheets[wb.SheetNames[1]];
    var updated = 0;
    [cSheet, hSheet].forEach(function(ws) {
      if (!ws) return;
      XLSX.utils.sheet_to_json(ws, { header: 1 }).forEach(function(row) {
        if (!row[1]) return;
        var des = String(row[1]).trim().toLowerCase();
        CONFIG.options.forEach(function(opt) {
          if (des.includes(opt.nom.toLowerCase()) || opt.nom.toLowerCase().includes(des)) {
            var np = {}, si = { 3:'037', 4:'045', 5:'052', 6:'057', 7:'062' };
            for (var ci in si) { var v = row[parseInt(ci)]; if (v !== undefined && v !== null && v !== '') { np[si[ci]] = typeof v === 'number' ? v : parseInt(String(v).replace(/[^\d]/g, '')) || 0; } }
            if (Object.keys(np).length > 0) { Object.assign(opt.prix, np); updated++; }
          }
        });
      });
    });
    showMsg('success', '✅ ' + updated + ' prix mis à jour.');
    if (typeof TursoSync !== 'undefined' && TursoSync.isConnected()) {
      TursoSync.savePrices().then(function() { showMsg('success', '✅ Prix sauvegardés dans Turso.'); });
    }
    if (state.step === 1 && state.parsedData) buildOptions();
    if (state.step === 3) buildAdmin();
  } catch(e) { showMsg('error', 'Erreur : ' + e.message); }
}

// ─── RAPPEL MENSUEL ───────────────────────────────────────────────────────────
function isFirstMondayOfMonth() { var t = new Date(); return t.getDay() === 1 && t.getDate() <= 7; }
function checkMonthlyReminder() {
  var key = 'plp_reminder_dismissed', now = new Date(), mk = now.getFullYear() + '-' + (now.getMonth() + 1);
  try { if (localStorage.getItem(key) === mk) return; } catch(e) {}
  if (isFirstMondayOfMonth()) { var m = document.getElementById('updateReminder'); if (m) m.style.display = 'flex'; }
}
function dismissReminder() {
  var m = document.getElementById('updateReminder'); if (m) m.style.display = 'none';
  try { var n = new Date(); localStorage.setItem('plp_reminder_dismissed', n.getFullYear() + '-' + (n.getMonth() + 1)); } catch(e) {}
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
updateClientCount();
checkMonthlyReminder();
buildFranceMap(null);

if (typeof TursoSync !== 'undefined') {
  TursoSync.init().then(function(ok) {
    if (ok) { updateClientCount(); console.log('App synchronisée avec Turso'); }
  });
}

(async function() {
  if (typeof TursoSync !== 'undefined') await TursoSync.init();
  if (typeof ProjetSave !== 'undefined') await ProjetSave.loadFromURL();
})();
