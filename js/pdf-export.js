// ══════════════════════════════════════════════════════════════
// PDF EXPORT v2 — Print-native (iframe + window.print)
// ══════════════════════════════════════════════════════════════
// Remplace l'approche html2pdf.js (html2canvas → raster → jsPDF)
// par un rendu PDF vectoriel natif du navigateur.
//
// Avantages :
// - Texte sélectionnable et cherchable dans le PDF
// - Fonts Inter / DM Mono rendues nativement (pas rasterisées)
// - SVG, gradients, ombres fidèles au rendu écran
// - Fichier PDF 5-10x plus léger
// - Découpage de pages propre via @page + page-break-*
// - Fonctionne 100% côté client, zéro dépendance serveur
//
// Fonctionnement :
// 1. Clone le HTML de #sheetContent
// 2. L'injecte dans une iframe cachée avec un CSS print dédié
// 3. Appelle iframe.contentWindow.print()
// 4. Le navigateur ouvre la boîte de dialogue "Enregistrer en PDF"
//
// Note : L'utilisateur choisit "Enregistrer en PDF" dans la boîte
// d'impression de Chrome/Edge/Firefox. C'est le standard pour avoir
// un rendu vectoriel parfait côté client.
// ══════════════════════════════════════════════════════════════


/**
 * CSS complet injecté dans l'iframe de print.
 * Reprend les styles de main.css + cover.css + pdf.css,
 * mais optimisé pour @page A4 portrait avec dimensions fixes.
 */
function getPrintCSS() {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 0;
    }

    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    :root {
      --navy:   #1a3050;
      --navy-l: #2a4a6e;
      --navy-d: #0f1f33;
      --teal:   #147888;
      --teal-l: #1a9aaf;
      --teal-p: #e6f4f7;
      --bg:     #f2f4f6;
      --tx:     #1a1a1a;
      --tx2:    #4a5568;
      --tx3:    #8896a6;
      --tx4:    #b8c4cf;
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 210mm;
      font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      font-size: 10px;
      color: var(--tx);
      background: #fff;
    }

    /* ═══════════════════════════════════════════
       COVER PAGE
       ═══════════════════════════════════════════ */
    .cover {
      width: 210mm;
      height: 297mm;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: linear-gradient(160deg, #0d1926 0%, #1a3050 30%, #1e3d5f 60%, #162d47 100%) !important;
      color: #fff;
      page-break-after: always;
      break-after: page;
    }

    .cover .page-network { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
    .cover .accent-bar { position: absolute; top: 0; left: 0; width: 100%; height: 3.5px; background: linear-gradient(90deg, #1ba1a4 0%, #147888 40%, transparent 80%); z-index: 5; }

    .cover .header { padding: 10mm 8mm 0 8mm; z-index: 2; flex-shrink: 0; }
    .cover .company-logo { height: 24mm; width: auto; mix-blend-mode: screen; }

    .cover .title-section { padding: 8mm 8mm 0 8mm; z-index: 2; flex-shrink: 0; }
    .cover .title-label { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #1ba1a4; margin-bottom: 2mm; }
    .cover .project-title { font-family: 'Inter', sans-serif; font-size: 32px; font-weight: 700; color: #fff; line-height: 1.25; max-width: 75%; }
    .cover .title-underline { width: 30mm; height: 2px; background: linear-gradient(90deg, #1ba1a4, transparent); margin-top: 5mm; border-radius: 1px; }

    .cover .info-section { padding: 8mm 8mm 0 8mm; z-index: 2; flex-shrink: 0; width: 100%; overflow: hidden; }
    .cover .info-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2mm; width: 100%; }
    .cover .info-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm; margin-top: 2mm; width: 100%; }
    .cover .info-card { background: rgba(255,255,255,0.90) !important; border: 1px solid rgba(255,255,255,0.08); border-radius: 3px; padding: 3.5mm 5mm; overflow: hidden; min-width: 0; }
    .cover .info-label { font-size: 7px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #1ba1a4; margin-bottom: 1mm; }
    .cover .info-value { font-size: 10px; font-weight: 600; color: #1B3A5C; line-height: 1.3; }

    .cover .separator { margin: 5mm 8mm 0 8mm; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.2), transparent 70%); flex-shrink: 0; }

    .cover .product-section { padding: 0 8mm 8mm 8mm; display: flex; align-items: stretch; min-height: 0; margin-top: auto; height: 55%; flex: none; }
    .cover .product-hero { flex: 1; position: relative; background: rgba(255,255,255,0.90) !important; border: 1px solid rgba(255,255,255,0.45); border-radius: 3px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.15); }

    .cover .arc-svg { position: absolute; top: 0; right: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
    .cover .hero-shine { display: block; opacity: 0.5; position: absolute; top: 0; left: 0; right: 0; height: 35%; background: linear-gradient(180deg, rgba(255,255,255,0.1) 0%, transparent 100%); z-index: 1; pointer-events: none; }

    .cover .plp-title { position: absolute; top: 7mm; left: 50%; transform: translateX(-50%); font-family: 'Bebas Neue', sans-serif; font-size: 80px; font-weight: 900; color: #1B3A5C; letter-spacing: 0.12em; line-height: 1; z-index: 2; display: flex; align-items: baseline; gap: 0; }
    .cover .plp-size { font-size: 32px; color: #1ba1a4; font-weight: 900; letter-spacing: 0.06em; font-style: italic; margin-left: -2px; }
    .cover .side-brand { position: absolute; right: 4mm; top: 53%; transform: translateY(-47%) rotate(180deg); writing-mode: vertical-rl; font-family: 'IBM Plex Sans', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.90); z-index: 4; white-space: nowrap; }

    .cover .machine-wrapper { position: absolute; left: 8mm; top: 55%; transform: translateY(-45%); height: 66%; width: auto; max-width: 55%; z-index: 2; }
    .cover .machine-image { height: 100%; width: auto; object-fit: contain; filter: drop-shadow(0 10px 35px rgba(0,0,0,0.35)) drop-shadow(0 4px 12px rgba(0,0,0,0.25)) drop-shadow(0 2px 6px rgba(27,79,114,0.2)); }
    .cover .machine-glow { position: absolute; left: 5%; top: 10%; width: 90%; height: 80%; background: radial-gradient(ellipse at 50% 55%, rgba(27,161,164,0.15) 0%, rgba(27,79,114,0.08) 40%, transparent 70%); z-index: -1; pointer-events: none; display: block; opacity: 0.7; }
    .cover .machine-reflect { display: none !important; }
    .cover .tech-lines { display: none !important; }

    .cover .cert-stack { position: absolute; right: 20mm; top: 52%; transform: translateY(-48%); display: flex; flex-direction: column; align-items: center; gap: 5mm; z-index: 2; }
    .cover .cert-img-eurovent { height: 18mm; width: auto; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15)); }
    .cover .cert-img-r290 { height: 20mm; width: auto; object-fit: contain; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15)); }

    .cover .particle { display: none !important; }
    .cover .footer-line { height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.10), transparent 60%); margin: 0 8mm; flex-shrink: 0; }
    .cover .footer { padding: 3.5mm 8mm 8mm 8mm; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; z-index: 2; }
    .cover .footer-left { font-size: 7px; color: rgba(255,255,255,0.50); letter-spacing: 0.04em; }
    .cover .footer-brand { font-weight: 700; color: #1ba1a4; letter-spacing: 0.06em; }
    .cover .footer-right { font-size: 7px; color: rgba(255,255,255,0.30); letter-spacing: 0.04em; }

    /* ═══════════════════════════════════════════
       PAGE BREAK BETWEEN COVER AND CONTENT
       ═══════════════════════════════════════════ */
    .page-break {
      page-break-after: always;
      break-after: page;
      height: 0;
      clear: both;
    }

    /* ═══════════════════════════════════════════
       FICHE TECHNIQUE (pages de contenu)
       ═══════════════════════════════════════════ */
    .sh-sec {
      padding: 7mm 10mm;
      border-bottom: 1px solid #eee;
      break-inside: avoid;
    }
    .sh-sec:last-child { border-bottom: none; }

    .stitle { display: flex; align-items: center; gap: 8px; margin-bottom: 4mm; }
    .sbar { width: 3px; height: 18px; border-radius: 2px; background: var(--teal); }
    .stitle h3 { font-size: 14px; font-weight: 600; color: var(--navy); }

    .sh-sub { font-size: 8px; font-weight: 700; color: var(--teal); text-transform: uppercase; letter-spacing: 1.5px; margin: 3mm 0 2mm; }

    .sh-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; }
    .sh-grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2mm; }

    .tbl-title { font-size: 10px; font-weight: 600; margin-bottom: 1mm; color: var(--navy); }
    .mt { width: 100%; border-collapse: collapse; font-size: 9px; }
    .mt td { padding: 1.5mm 2mm; border-bottom: 1px solid #f0f2f4; }
    .mt tr:nth-child(even) { background: #f7f9fb !important; }
    .mt .v { text-align: right; font-family: 'DM Mono', monospace; font-weight: 500; color: var(--navy); }

    .dc { background: #f7f9fb !important; padding: 2mm 3mm; border-radius: 3px; border: 1px solid #eef0f2; break-inside: avoid; }
    .dc-l { font-size: 7px; color: var(--tx3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.5mm; }
    .dc-v { font-size: 10px; font-family: 'DM Mono', monospace; font-weight: 500; color: var(--navy); }

    /* Acoustique */
    .ac-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3mm; }
    .ac-card { padding: 3mm; border-radius: 4px; text-align: center; border: 1px solid #e2e6ea; background: #fff !important; break-inside: avoid; }
    .ac-sel { border: 2px solid var(--teal); background: var(--teal-p) !important; }
    .ac-dim { opacity: 0.35; }
    .ac-card h4 { font-size: 10px; font-weight: 600; color: var(--navy); margin-bottom: 0.5mm; }
    .ac-sub { font-size: 7px; color: var(--tx3); margin-bottom: 2mm; }
    .ac-big { font-size: 20px; font-family: 'DM Mono', monospace; color: var(--teal); font-weight: 600; }
    .ac-sm { font-size: 12px; font-family: 'DM Mono', monospace; color: var(--tx3); }
    .ac-unit { font-size: 7px; color: var(--tx3); margin-bottom: 1mm; }

    /* Prestations */
    .prest-list { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5mm; }
    .prest-item { padding: 1.5mm 3mm; font-size: 9px; color: var(--tx2); border-radius: 3px; display: flex; gap: 2mm; align-items: flex-start; line-height: 1.4; }
    .prest-item:nth-child(odd) { background: #f7f9fb !important; }
    .prest-icon { color: var(--teal); font-weight: 700; flex-shrink: 0; }

    /* Dimensions image */
    .dim-img { max-width: 100%; border: 1px solid #eee; border-radius: 3px; }

    /* Options table */
    .sh-table { width: 100%; border-collapse: collapse; font-size: 9px; break-inside: avoid; }
    .sh-table th { padding: 2mm 3mm; background: var(--navy) !important; color: #fff; font-size: 8px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; }
    .sh-table td { padding: 2mm 3mm; border-bottom: 1px solid #f0f2f4; }
    .sh-table tr:nth-child(even) { background: #f7f9fb !important; }
    .sh-table .r { text-align: right; }
    .sh-table tfoot td { font-weight: 700; }

    /* Footer disclaimer */
    .sh-foot {
      padding: 4mm 10mm;
      font-size: 7px;
      color: var(--tx4);
      font-style: italic;
      line-height: 1.5;
      border-top: 1px solid #eee;
    }

    /* ═══════════════════════════════════════════
       GLOBAL PRINT RULES
       ═══════════════════════════════════════════ */
    img { max-width: 100%; }
    a { text-decoration: none; color: inherit; }

    /* Avoid page breaks inside important blocks */
    .sh-sec, .ac-card, .dc, .sh-table, .prest-item {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  `;
}


/**
 * Ouvre le contenu de la fiche dans une fenêtre/iframe de print
 * pour générer un PDF vectoriel natif.
 */
function downloadPDF() {
  var el = document.getElementById("sheetContent");
  if (!el) { alert("Aucune fiche à exporter."); return; }

  var btn = document.querySelector('.preview-actions .btn-primary');
  var origText = btn ? btn.textContent : '';
  if (btn) { btn.textContent = '⏳ Préparation...'; btn.disabled = true; }

  // Petit délai pour laisser le DOM se stabiliser
  setTimeout(function() {
    try {
      _printViaWindow(el);
    } catch(err) {
      console.error('PDF export error:', err);
      alert("Erreur lors de la préparation du PDF. Essayez Ctrl+P directement.");
    } finally {
      if (btn) { btn.textContent = origText; btn.disabled = false; }
    }
  }, 100);
}


/**
 * Stratégie : ouvrir une nouvelle fenêtre avec le HTML complet
 * et un CSS print optimisé, puis appeler print().
 *
 * Avantages vs iframe :
 * - Pas de restrictions cross-origin
 * - Meilleure compatibilité Firefox
 * - L'utilisateur voit la preview avant d'imprimer
 */
function _printViaWindow(sourceEl) {
  // Collecter les images base64 depuis les assets cachés
  var images = {};
  ['asset_machine', 'asset_eurovent', 'asset_r290', 'asset_franceair_white'].forEach(function(id) {
    var img = document.getElementById(id);
    if (img) images[id] = img.src;
  });

  // Cloner le contenu
  var content = sourceEl.innerHTML;

  // Construire le HTML complet
  var html = '<!DOCTYPE html>\n<html lang="fr">\n<head>\n';
  html += '<meta charset="UTF-8"/>\n';
  html += '<title>Fiche de Sélection</title>\n';
  html += '<style>\n' + getPrintCSS() + '\n</style>\n';
  html += '</head>\n<body>\n';
  html += content;
  html += '\n</body>\n</html>';

  // Ouvrir dans une nouvelle fenêtre
  var printWin = window.open('', '_blank', 'width=900,height=1200');
  if (!printWin) {
    alert("Le navigateur a bloqué la fenêtre popup.\nAutorisez les popups pour ce site, ou utilisez Ctrl+P.");
    return;
  }

  printWin.document.open();
  printWin.document.write(html);
  printWin.document.close();

  // Attendre le chargement des fonts puis imprimer
  printWin.onload = function() {
    // Attendre que les Google Fonts soient chargées
    setTimeout(function() {
      printWin.focus();
      printWin.print();
      // Note : on ne ferme pas la fenêtre automatiquement
      // pour que l'utilisateur puisse réessayer si besoin
    }, 1500);
  };

  // Fallback si onload ne se déclenche pas
  setTimeout(function() {
    try {
      if (!printWin.closed) {
        printWin.focus();
        printWin.print();
      }
    } catch(e) {}
  }, 3000);
}


// ══════════════════════════════════════════════════════════════
// FONCTIONS UTILITAIRES (conservées de l'original)
// ══════════════════════════════════════════════════════════════

function st(t) {
  return '<div class="stitle"><div class="sbar"></div><h3>' + t + '</h3></div>';
}

function cT(t, d, c) {
  if (!d || !d.tempEntreeEau) return "";
  const r = [
    ["Temp. entrée eau",      (d.tempEntreeEau || "—") + " °C"],
    ["Temp. sortie eau",      (d.tempSortieEau || "—") + " °C"],
    ["Glycol",                (d.glycol || "—") + " %"],
    ["Temp. air extérieur",   (d.tempAirExt || "—") + " °C"],
    ["Humidité relative",     (d.humiditeRel || "—") + " %"],
    ["Charge",                (d.charge || "—") + " %"]
  ];
  let h = '<div><div class="tbl-title" style="color:' + c + '">' + t + '</div><table class="mt"><tbody>';
  r.forEach(([l, v]) => { h += '<tr><td>' + l + '</td><td class="v">' + v + '</td></tr>'; });
  return h + '</tbody></table></div>';
}

function rT(t, d, m) {
  if (!d) return "";
  const f = m === "f";
  const r = f ? [
    ["Puiss. frigorifique",       (d.puissanceFrigo || "—") + " kW"],
    ["Puiss. frigo [UNI]",        (d.puissanceFrigoUNI || "—") + " kW"],
    ["Débit eau",                 (d.debitEau || "—") + " l/h"],
    ["Perte de charge",           (d.perteCharge || "—") + " kPa"],
    ["Puiss. abs. compress.",     (d.puissAbsCompresseurs || "—") + " kW"],
    ["Puiss. abs. totale",        (d.puissAbsTotale || "—") + " kW"],
    ["Puiss. abs. totale [UNI]",  (d.puissAbsTotaleUNI || "—") + " kW"],
    ["Courant abs. total",        (d.courantAbsTotal || "—") + " A"],
    ["EER",                       (d.eer || "—") + " W/W"],
    ["EER [UNI]",                 (d.eerUNI || "—") + " W/W"],
    ["SEER",                      (d.seer || "—") + " Wh/Wh"],
    ["ηs Cooling",                d.etasC || "—"]
  ] : [
    ["Puiss. calorifique",        (d.puissanceChauffage || "—") + " kW"],
    ["Puiss. calor. [UNI]",       (d.puissanceChauffageUNI || "—") + " kW"],
    ["Débit eau",                 (d.debitEau || "—") + " l/h"],
    ["Perte de charge",           (d.perteCharge || "—") + " kPa"],
    ["Puiss. abs. compress.",     (d.puissAbsCompresseurs || "—") + " kW"],
    ["Puiss. abs. totale",        (d.puissAbsTotale || "—") + " kW"],
    ["Puiss. abs. totale [UNI]",  (d.puissAbsTotaleUNI || "—") + " kW"],
    ["Courant abs. total",        (d.courantAbsTotal || "—") + " A"],
    ["COP",                       (d.cop || "—") + " W/W"],
    ["COP [UNI]",                 (d.copUNI || "—") + " W/W"],
    ["SCOP",                      (d.scop || "—") + " Wh/Wh"],
    ["ηs Heating",                d.etasH || "—"]
  ];
  const c = f ? "#147888" : "#c0392b";
  let h = '<div><div class="tbl-title" style="color:' + c + '">' + t + '</div><table class="mt"><tbody>';
  r.forEach(([l, v]) => { h += '<tr><td>' + l + '</td><td class="v">' + v + '</td></tr>'; });
  return h + '</tbody></table></div>';
}

function dc(l, v) {
  return '<div class="dc"><div class="dc-l">' + l + '</div><div class="dc-v">' + v + '</div></div>';
}
