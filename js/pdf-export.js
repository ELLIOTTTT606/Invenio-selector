// ══════════════════════════════════════════════════════════════
// PDF EXPORT v3 — Print-native (window.print)
// Page 1  : Cover (fond sombre, logo France Air, visuel PLP)
// Page 2+ : Contenu fiche PLP (sommaire, tableau, prescription,
//            options, plans, visuels) — style Barlow Condensed
// ══════════════════════════════════════════════════════════════

function getFontLinks() {
  return [
    'https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap',
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600;700&display=swap',
    'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:ital,wght@0,400;0,600;1,400&display=swap',
    'https://fonts.googleapis.com/css2?family=Anton&display=swap'
  ].map(function(href) {
    return '<link rel="preconnect" href="https://fonts.googleapis.com"/>' +
           '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>' +
           '<link rel="stylesheet" href="' + href + '"/>';
  }).join('\n');
}

function getPrintCSS() {
  return `

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

    /* ═══════════════════════════════════════════
       VARIABLES GLOBALES
       ═══════════════════════════════════════════ */
    :root {
      /* Cover (navy/teal) */
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
      /* PLP pages */
      --plp-bl:  #00527A;
      --plp-bld: #003D5C;
      --plp-cr:  #F2F2EF;
      --plp-wh:  #FFFFFF;
      --plp-gy:  #CCCCCC;
      --plp-tx:  #333333;
      --plp-bk:  #111111;
      --plp-sel: #D6E8F2;
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
       SAUT DE PAGE ENTRE COVER ET CONTENU PLP
       ═══════════════════════════════════════════ */
    .plp-page-break {
      page-break-after: always;
      break-after: page;
      height: 0;
      clear: both;
      display: block;
    }

    /* ═══════════════════════════════════════════
       COVER PAGE (Page 1)
       ═══════════════════════════════════════════ */
    .cover {
      width: 210mm;
      height: 297mm;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: #00527A !important;
      color: #fff;
      page-break-after: always;
      break-after: page;
    }

    .cover .product-hero { flex: 1; position: relative; background: #F2F2EF !important; border: 1px solid rgba(255,255,255,0.45); border-radius: 3px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.15); }

    .cover .info-value { font-size: 12px !important; font-weight: 600; color: #1B3A5C; line-height: 1.3; }
    .cover .info-label { font-size: 8px !important; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: #1ba1a4; margin-bottom: 1mm; }
    .cover .info-card { background: rgba(255,255,255,0.92) !important; border: 1px solid rgba(255,255,255,0.08); border-radius: 3px; padding: 4mm 6mm; overflow: hidden; min-width: 0; }

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
    .cover .machine-image { height: 100%; width: auto; object-fit: contain; filter: drop-shadow(0 10px 35px rgba(0,0,0,0.35)) drop-shadow(0 4px 12px rgba(0,0,0,0.25)); }
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
       PLP PAGES (2+) — Barlow Condensed
       ═══════════════════════════════════════════ */
    .plp-pg {
      width: 210mm;
      min-height: auto;
      padding: 15mm 12mm;
      background: #fff !important;
      position: relative;
      page-break-before: always;
      break-before: page;
      display: flex;
      flex-direction: column;
      font-family: 'Barlow', Arial, sans-serif;
      font-size: 9.5px;
      line-height: 1.65;
      color: var(--plp-tx);
    }
    .plp-opt-section { font-weight: 600; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--plp-bl); }
    .plp-pg:first-of-type { page-break-before: auto; break-before: auto; }
    .plp-pg-som { padding-top: 0 !important; padding-bottom: 0 !important; min-height: 297mm !important; }

    /* Header */
    .plp-hdr { height: 36px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--plp-gy); margin-bottom: 16px; padding-bottom: 6px; flex-shrink: 0; }
    .plp-hdr-logo img { height: 24px; }
    .plp-hdr-r { text-align: right; }
    .plp-hdr-proj { font-family: 'Barlow', sans-serif; font-size: 8px; color: #666; }
    .plp-hdr-ref { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 8px; color: var(--plp-tx); }

    /* Footer */
    .plp-ftr { height: 24px; border-top: 1px solid var(--plp-gy); display: flex; align-items: center; justify-content: space-between; font-family: 'Barlow', sans-serif; font-size: 7.5px; color: #666; text-transform: uppercase; letter-spacing: .1em; margin-top: auto; padding-top: 5px; flex-shrink: 0; }

    /* Band */
    .plp-band { background: var(--plp-bl) !important; padding: 12px 24px; margin-bottom: 18px; flex-shrink: 0; }
    .plp-band-t { font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; font-weight: 700; font-size: 18px; text-transform: uppercase; color: var(--plp-wh); letter-spacing: .05em; }
    .plp-band-s { font-family: 'Barlow', sans-serif; font-size: 9px; color: rgba(255,255,255,.8); margin-top: 2px; }

    /* Logo */
    .plp-logo { display: inline-flex; align-items: baseline; gap: 4px; text-decoration: none; }
    .plp-logo-fa { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 16px; color: var(--plp-bl); letter-spacing: -.02em; }
    .plp-logo-sep { font-family: 'Barlow', sans-serif; font-weight: 300; font-size: 12px; color: var(--plp-gy); margin: 0 2px; }
    .plp-logo-inv { font-family: 'Barlow', sans-serif; font-weight: 400; font-size: 11px; color: #666; letter-spacing: .05em; font-style: italic; }
    .plp-logo-sm .plp-logo-fa { font-size: 13px; }
    .plp-logo-sm .plp-logo-sep { font-size: 10px; }
    .plp-logo-sm .plp-logo-inv { font-size: 9px; }

    /* ─── SOMMAIRE ─── */
    .plp-som { display: flex; width: 210mm; height: 297mm; background: #F2F2EF !important; position: relative; }
    .plp-som-l { width: 22%; display: flex; align-items: flex-start; padding: 40mm 0 0 12mm; overflow: hidden; }
    .plp-som-txt { writing-mode: vertical-rl; transform: rotate(180deg); font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; font-weight: 800; font-size: 180px; text-transform: uppercase; color: #00527A; line-height: .82; letter-spacing: -2px; }
    .plp-som-r { width: 78%; display: flex; flex-direction: column; justify-content: center; padding: 0 14mm 0 0; gap: 8mm; }
    .plp-som-item { display: flex; align-items: baseline; justify-content: flex-end; }
    .plp-som-lbl { font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: .12em; color: #00527A; text-align: right; flex: 1; }
    .plp-som-num { font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; font-weight: 800; font-size: 80px; line-height: 1; color: #00527A; margin-left: 8mm; min-width: 110px; text-align: right; }
    .plp-som-logo { display: none; }
    .plp-som-logo img { height: 32px; }

    /* ─── TABLEAU COMPARATIF ─── */
    .plp-tb { width: 100%; border-collapse: collapse; font-size: 9px; }
    .plp-tb th, .plp-tb td { padding: 6px 10px; vertical-align: middle; }
    .plp-tb thead th { background: var(--plp-bl) !important; color: var(--plp-wh); font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; font-weight: 700; text-align: center; padding: 10px 12px; border: none; font-size: 10px; }
    .plp-tb thead th + th { border-left: 1px solid rgba(255,255,255,.2); }
    .plp-tb thead th.plp-lc { text-align: left; font-size: 8px; text-transform: uppercase; }
    .plp-tb .plp-lc { width: 32%; text-align: left; font-family: 'Barlow', sans-serif; font-size: 9px; color: var(--plp-tx); background: var(--plp-cr) !important; border-right: 2px solid var(--plp-bl); }
    .plp-tb tbody td { text-align: center; border-bottom: 1px solid var(--plp-gy); font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; font-weight: 600; font-size: 10px; color: var(--plp-bk); background: var(--plp-cr) !important; }
    .plp-tb .plp-gr td { background: var(--plp-wh) !important; font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: .08em; color: var(--plp-bl); padding: 8px 12px; text-align: left; border-top: 2px solid var(--plp-bl); border-bottom: 1px solid var(--plp-gy); }
    .plp-unit { font-family: 'Barlow', sans-serif; font-weight: 400; font-size: 8px; color: #666; margin-left: 3px; }
    .plp-thr { display: block; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 12px; }
    .plp-thc { display: block; font-family: 'Barlow', sans-serif; font-weight: 400; font-size: 8px; opacity: .75; margin-top: 2px; }

    /* Acoustique mini cols */
    .plp-acou-wrap { display: flex; gap: 4px; justify-content: center; }
    .plp-acou-col { flex: 1; text-align: center; padding: 4px 3px; border-radius: 2px; font-family: 'Barlow Condensed', sans-serif; font-size: 9px; }
    .plp-acou-col.active { background: var(--plp-bl) !important; color: var(--plp-wh); font-weight: 700; }
    .plp-acou-col.inactive { background: #e8e8e8 !important; color: #aaa; font-weight: 400; }
    .plp-acou-lbl { font-size: 6.5px; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 2px; display: block; }
    .plp-acou-val { font-size: 10px; font-weight: 700; display: block; }

    /* Pompe cards */
    .plp-pump-wrap { display: flex; gap: 4px; justify-content: center; }
    .plp-pump-card { flex: 1; text-align: center; padding: 6px 4px; border-radius: 3px; font-family: 'Barlow Condensed', sans-serif; max-width: 80px; }
    .plp-pump-on { background: var(--plp-bl) !important; color: var(--plp-wh); }
    .plp-pump-off { background: #e8e8e8 !important; color: #aaa; }
    .plp-pump-icon { font-size: 8px; display: block; margin-bottom: 1px; }
    .plp-pump-lbl { font-weight: 700; font-size: 10px; display: block; letter-spacing: .05em; }
    .plp-pump-data { font-size: 7.5px; font-weight: 400; display: block; margin-top: 2px; line-height: 1.3; opacity: .85; }

    /* ─── PRESCRIPTION ─── */
    .plp-presc { padding: 0 8px; }
    .plp-pb { margin-bottom: 20px; break-inside: avoid; page-break-inside: avoid; }
    .plp-pb-t { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 9.5px; text-transform: uppercase; letter-spacing: .06em; color: var(--plp-bk); margin-bottom: 6px; padding-bottom: 5px; border-bottom: 1px solid var(--plp-bl); }
    .plp-pb-x { font-family: 'Barlow', sans-serif; font-size: 9.5px; line-height: 1.65; color: var(--plp-tx); }
    .plp-li { padding-left: 16px; position: relative; margin-bottom: 2px; }
    .plp-li::before { content: "–"; position: absolute; left: 0; color: #666; }

    /* ─── OPTIONS ─── */
    .plp-cat { font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: .1em; color: var(--plp-bl); background: var(--plp-cr) !important; padding: 8px 12px; border-left: 4px solid var(--plp-bl); margin: 20px 0 8px; }
    .plp-opt { display: flex; align-items: flex-start; padding: 10px 12px; border-bottom: 1px solid #e0e0e0; break-inside: avoid; page-break-inside: avoid; }
    .plp-opt.plp-sel { background: var(--plp-sel) !important; border-left: 3px solid var(--plp-bl); }
    .plp-opt.plp-unsel { opacity: .6; }
    .plp-opt-info { flex: 55%; min-width: 0; }
    .plp-opt-name { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 9.5px; text-transform: uppercase; letter-spacing: .04em; color: var(--plp-bk); }
    .plp-opt-desc { font-family: 'Barlow', sans-serif; font-size: 9px; color: #555; line-height: 1.5; margin-top: 3px; }
    .plp-opt-use { font-family: 'Barlow', sans-serif; font-style: italic; font-size: 8.5px; color: #777; margin-top: 4px; }
    .plp-opt-prix { width: 25%; text-align: right; padding-left: 12px; }
    .plp-opt-ht { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 9.5px; color: var(--plp-bk); }
    .plp-opt-ttc { font-family: 'Barlow', sans-serif; font-size: 8.5px; color: #666; margin-top: 2px; }
    .plp-opt-chk { width: 20%; display: flex; flex-direction: column; align-items: center; padding-left: 8px; }
    .plp-chkbox { width: 16px; height: 16px; border: 1.5px solid var(--plp-bl); display: flex; align-items: center; justify-content: center; font-size: 11px; color: var(--plp-wh); }
    .plp-chkbox.checked { background: var(--plp-bl) !important; }
    .plp-chk-lbl { font-size: 7px; color: #666; margin-top: 3px; text-transform: uppercase; }

    /* ─── RÉCAP OPTIONS ─── */
    .plp-recap { border: 2px solid var(--plp-bl); padding: 16px 24px; margin-top: 24px; break-inside: avoid; page-break-inside: avoid; }
    .plp-recap-t { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 13px; text-transform: uppercase; color: var(--plp-bl); margin-bottom: 12px; }
    .plp-recap-tb { width: 100%; border-collapse: collapse; font-size: 9px; }
    .plp-recap-tb th { background: var(--plp-bl) !important; color: var(--plp-wh); font-size: 8px; text-transform: uppercase; padding: 5px 8px; text-align: left; font-family: 'Barlow Condensed', sans-serif; }
    .plp-recap-tb td { padding: 5px 8px; border-bottom: .5px solid #e0e0e0; font-family: 'Barlow', sans-serif; }
    .plp-recap-tb tr:nth-child(even) td { background: var(--plp-cr) !important; }
    .plp-recap-total td { background: var(--plp-bld) !important; color: var(--plp-wh); font-weight: 600; font-size: 10px; text-transform: uppercase; padding: 7px 8px; }

    /* ─── IMAGES / PLANS ─── */
    .plp-iz { border: 1px dashed #bbb; background: #f9f9f9 !important; display: flex; align-items: center; justify-content: center; text-align: center; padding: 20px; font-size: 9px; color: #999; font-style: italic; min-height: 200mm; }
    .plp-cap { font-family: 'Barlow', sans-serif; font-style: italic; font-size: 8px; color: #666; text-align: center; margin-top: 8px; }

    /* ─── DISCLAIMER ─── */
    .sh-foot {
      padding: 4mm 10mm;
      font-size: 7px;
      color: #b8c4cf;
      font-style: italic;
      line-height: 1.5;
      border-top: 1px solid #eee;
      font-family: 'Inter', sans-serif;
    }

    /* ─── COVER V2 ─── */
    .cover-v2 {
      width: 210mm; height: 297mm;
      position: relative; overflow: hidden;
      display: flex; flex-direction: column;
      background: #F2F2EF !important;
      page-break-after: always; break-after: page;
    }
    .cover-v2-grid { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
    .cover-v2-header {
      position: relative; z-index: 2;
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 9mm 10mm 0 10mm; flex-shrink: 0;
    }
    .cover-v2-logo-fa { height: 11mm; width: auto; }
    .cover-v2-logo-inv { height: 7mm; width: auto; margin-top: 2mm; }
    .cover-v2-title-zone {
      position: relative; z-index: 2;
      padding: 16mm 8mm 0 8mm;
      text-align: center; flex-shrink: 0;
    }
    .cover-v2-title {
      font-family: 'Anton', 'Arial Black', Arial, sans-serif;
      font-weight: 400; font-size: 58px; line-height: 1;
      color: #1B3A5C; letter-spacing: 0.5px;
    }
    .cover-v2-subtitle {
      font-family: 'Anton', 'Arial Black', Arial, sans-serif;
      font-weight: 400; font-size: 19px; line-height: 1.2;
      color: #1B3A5C; margin-top: 4mm;
    }
    .cover-v2-spacer { display: none; }
    .cover-v2-plp-svg {
      position: absolute;
      inset: 0; width: 100%; height: 100%;
      z-index: 3; pointer-events: none; overflow: visible;
    }
    /* Fix tableau : pas de min-height forcing, sauts de page naturels */
    .plp-pg { min-height: auto !important; }

    /* ─── UTILITAIRES GLOBAUX ─── */
    img { max-width: 100%; }
    a { text-decoration: none; color: inherit; }
    .plp-opt, .plp-pb, .plp-recap, .plp-tb, .plp-recap-tb { break-inside: avoid; page-break-inside: avoid; }
  `;
}


/**
 * downloadPDF — injecte le contenu dans un iframe caché puis print.
 * Avantages vs popup :
 * - Même origine → pas de blocage CSP/CORS
 * - onload fiable → CSS appliqué avant impression
 * - Fonts Google dans le cache navigateur
 */
function downloadPDF() {
  var el = document.getElementById("sheetContent");
  if (!el) { alert("Aucune fiche à exporter."); return; }

  var btn = document.querySelector('.preview-actions .btn-primary');
  var origText = btn ? btn.textContent : '';
  if (btn) { btn.textContent = '⏳ Préparation...'; btn.disabled = true; }

  if (typeof ProjetSave !== 'undefined') { ProjetSave.save(); }

  setTimeout(function() {
    try {
      _printViaIframe(el);
    } catch(err) {
      console.error('PDF export error:', err);
      alert("Erreur lors de la préparation du PDF. Essayez Ctrl+P directement.");
    } finally {
      setTimeout(function() {
        if (btn) { btn.textContent = origText; btn.disabled = false; }
      }, 4000);
    }
  }, 100);
}


/**
 * _printViaIframe — iframe caché dans le DOM principal (même origine).
 * Le CSS et les fonts s'appliquent correctement, onload est fiable.
 */
function _printViaIframe(sourceEl) {
  // Supprimer un iframe précédent
  var old = document.getElementById('__print_iframe__');
  if (old) old.parentNode.removeChild(old);

  var iframe = document.createElement('iframe');
  iframe.id = '__print_iframe__';
  iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;visibility:hidden;';
  document.body.appendChild(iframe);

  var content = sourceEl.innerHTML;

  var html = '<!DOCTYPE html><html lang="fr"><head>';
  html += '<meta charset="UTF-8"/>';
  html += '<title>Fiche de Sélection</title>';
  html += getFontLinks();
  html += '<style>' + getPrintCSS() + '</style>';
  html += '</head><body>';
  html += content;
  html += '</body></html>';

  iframe.onload = function() {
    var iDoc = iframe.contentDocument || iframe.contentWindow.document;
    var doP = function() {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(function() {
        if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
      }, 2000);
    };
    if (iDoc.fonts && iDoc.fonts.ready) {
      iDoc.fonts.ready.then(doP);
    } else {
      setTimeout(doP, 1500);
    }
  };

  var iDoc = iframe.contentDocument || iframe.contentWindow.document;
  iDoc.open();
  iDoc.write(html);
  iDoc.close();
}


// ══════════════════════════════════════════════════════════════
// FONCTIONS UTILITAIRES (anciennes — conservées pour compatibilité)
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
