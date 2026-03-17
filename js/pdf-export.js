function downloadPDF() {
    var el = document.getElementById("sheetContent");
    var btn = document.querySelector('.preview-actions .btn-primary');
    var origText = btn.textContent;
    btn.textContent = '⏳ Génération en cours...';
    btn.disabled = true;

    // ── Forcer la largeur A4 sur TOUTE la chaîne de conteneurs ──
    var previewScreen = el.closest('.preview-screen');
    var screenDiv = el.closest('.screen');

    // Sauvegarder les styles originaux
    var origStyles = {
        screen: screenDiv ? screenDiv.style.cssText : '',
        preview: previewScreen ? previewScreen.style.cssText : '',
        sheet: el.style.cssText
    };

    // Forcer 794px sur toute la chaîne
    if (screenDiv) {
        screenDiv.style.width = '794px';
        screenDiv.style.maxWidth = '794px';
        screenDiv.style.padding = '0';
        screenDiv.style.margin = '0';
        screenDiv.style.overflow = 'visible';
    }
    if (previewScreen) {
        previewScreen.style.width = '794px';
        previewScreen.style.maxWidth = '794px';
        previewScreen.style.padding = '0';
        previewScreen.style.margin = '0';
    }
    el.style.width = '794px';
    el.style.maxWidth = '794px';
    el.style.margin = '0';
    el.style.padding = '0';
    el.style.boxShadow = 'none';
    el.style.borderRadius = '0';
    el.style.background = '#ffffff';

    el.classList.add('pdf-mode');

    // Forcer un reflow
    void el.offsetHeight;

    var d = state.parsedData || {};
    var cl = state.selectedClient;
    var fileName = 'Fiche_Selection_'
        + (d.gamme || 'PLP').replace(/\s+/g, '_') + '_'
        + (d.size || '')
        + (cl ? '_' + cl.nom.replace(/[^a-zA-Z0-9àâäéèêëïîôùûüÿçÀÂÄÉÈÊËÏÎÔÙÛÜŸÇ\- ]/g, '').replace(/\s+/g, '_') : '')
        + '.pdf';

    var opt = {
        margin: [0, 0, 0, 0],
        filename: fileName,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            scrollY: 0,
            windowWidth: 794,
            backgroundColor: '#ffffff'
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: {
            mode: ['css'],
            after: ['.cover'],
            avoid: ['.sh-sec', '.dc', '.ac-card', '.sh-table', '.sh-grid2', '.sh-grid3']
        }
    };

    // ── Fonction de restauration ──
    function restore() {
        el.classList.remove('pdf-mode');
        if (screenDiv) screenDiv.style.cssText = origStyles.screen;
        if (previewScreen) previewScreen.style.cssText = origStyles.preview;
        el.style.cssText = origStyles.sheet;
        btn.textContent = origText;
        btn.disabled = false;
    }

    html2pdf().set(opt).from(el).save().then(function () {
        restore();
    }).catch(function (err) {
        console.error('PDF error:', err);
        restore();
        alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
    });
}

function st(t) {
    return '<div class="stitle"><div class="sbar"></div><h3>' + t + '</h3></div>';
}

function cT(t, d, c) {
    if (!d || !d.tempEntreeEau) return "";
    const r = [
        ["Temp. entrée eau", (d.tempEntreeEau || "—") + " °C"],
        ["Temp. sortie eau", (d.tempSortieEau || "—") + " °C"],
        ["Glycol", (d.glycol || "—") + " %"],
        ["Temp. air extérieur", (d.tempAirExt || "—") + " °C"],
        ["Humidité relative", (d.humiditeRel || "—") + " %"],
        ["Charge", (d.charge || "—") + " %"]
    ];
    let h = '<div><div class="tbl-title" style="color:' + c + '">' + t + '</div><table class="mt"><tbody>';
    r.forEach(([l, v]) => { h += '<tr><td>' + l + '</td><td class="v">' + v + '</td></tr>'; });
    return h + '</tbody></table></div>';
}

function rT(t, d, m) {
    if (!d) return "";
    const f = m === "f";
    const r = f ? [
        ["Puiss. frigorifique", (d.puissanceFrigo || "—") + " kW"],
        ["Puiss. frigo [UNI]", (d.puissanceFrigoUNI || "—") + " kW"],
        ["Débit eau", (d.debitEau || "—") + " l/h"],
        ["Perte de charge", (d.perteCharge || "—") + " kPa"],
        ["Puiss. abs. compress.", (d.puissAbsCompresseurs || "—") + " kW"],
        ["Puiss. abs. totale", (d.puissAbsTotale || "—") + " kW"],
        ["Puiss. abs. totale [UNI]", (d.puissAbsTotaleUNI || "—") + " kW"],
        ["Courant abs. total", (d.courantAbsTotal || "—") + " A"],
        ["EER", (d.eer || "—") + " W/W"],
        ["EER [UNI]", (d.eerUNI || "—") + " W/W"],
        ["SEER", (d.seer || "—") + " Wh/Wh"],
        ["ηs Cooling", d.etasC || "—"]
    ] : [
        ["Puiss. calorifique", (d.puissanceChauffage || "—") + " kW"],
        ["Puiss. calor. [UNI]", (d.puissanceChauffageUNI || "—") + " kW"],
        ["Débit eau", (d.debitEau || "—") + " l/h"],
        ["Perte de charge", (d.perteCharge || "—") + " kPa"],
        ["Puiss. abs. compress.", (d.puissAbsCompresseurs || "—") + " kW"],
        ["Puiss. abs. totale", (d.puissAbsTotale || "—") + " kW"],
        ["Puiss. abs. totale [UNI]", (d.puissAbsTotaleUNI || "—") + " kW"],
        ["Courant abs. total", (d.courantAbsTotal || "—") + " A"],
        ["COP", (d.cop || "—") + " W/W"],
        ["COP [UNI]", (d.copUNI || "—") + " W/W"],
        ["SCOP", (d.scop || "—") + " Wh/Wh"],
        ["ηs Heating", d.etasH || "—"]
    ];
    const c = f ? "#147888" : "#c0392b";
    let h = '<div><div class="tbl-title" style="color:' + c + '">' + t + '</div><table class="mt"><tbody>';
    r.forEach(([l, v]) => { h += '<tr><td>' + l + '</td><td class="v">' + v + '</td></tr>'; });
    return h + '</tbody></table></div>';
}

function dc(l, v) {
    return '<div class="dc"><div class="dc-l">' + l + '</div><div class="dc-v">' + v + '</div></div>';
}
