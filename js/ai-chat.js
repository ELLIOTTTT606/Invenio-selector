// ══════════════════════════════════════════════
// AI ASSISTANT (enhanced with file upload + actions)
// ══════════════════════════════════════════════
let aiHistory = [];
let aiAttachedFile = null;
let aiFileContent = null;

function toggleAI() {
  document.getElementById("aiPanel").classList.toggle("open");
  if (document.getElementById("aiPanel").classList.contains("open")) {
    document.getElementById("aiInput").focus();
  }
}

async function handleAIFile(f) {
  if (!f) return;
  aiAttachedFile = f;
  var preview = document.getElementById("aiFilePreview");
  document.getElementById("aiFileName").textContent = "📎 " + f.name + " (" + (f.size/1024).toFixed(0) + " Ko)";
  preview.style.display = "flex";
  
  // Pre-read the file content
  try {
    if (f.name.match(/\.(xlsx|xls)$/i)) {
      var data = await f.arrayBuffer();
      var wb = XLSX.read(data, {type:"array"});
      var content = "FICHIER EXCEL: " + f.name + "\nFeuilles: " + wb.SheetNames.join(", ") + "\n\n";
      wb.SheetNames.forEach(function(sn) {
        var ws = wb.Sheets[sn];
        var rows = XLSX.utils.sheet_to_json(ws, {header:1});
        content += "=== Feuille '" + sn + "' (" + rows.length + " lignes) ===\n";
        // Show first 15 rows for context
        rows.slice(0, 15).forEach(function(r, i) {
          content += "Ligne " + (i+1) + ": " + JSON.stringify(r) + "\n";
        });
        if (rows.length > 15) content += "... (" + (rows.length-15) + " lignes supplémentaires)\n";
        content += "\n";
      });
      aiFileContent = content;
    } else if (f.name.match(/\.(csv|txt|json)$/i)) {
      aiFileContent = "FICHIER " + f.name + ":\n" + await f.text();
    } else {
      aiFileContent = "FICHIER: " + f.name + " (" + f.type + ", " + f.size + " octets). Contenu binaire non lisible directement.";
    }
  } catch(e) {
    aiFileContent = "FICHIER: " + f.name + " — Erreur de lecture: " + e.message;
  }
}

function clearAIFile() {
  aiAttachedFile = null;
  aiFileContent = null;
  document.getElementById("aiFilePreview").style.display = "none";
  document.getElementById("aiFile").value = "";
}

function openPriceUpdate() {
  // Open AI panel with a pre-filled context about price update
  var panel = document.getElementById("aiPanel");
  if (!panel.classList.contains("open")) toggleAI();
  
  var msgsDiv = document.getElementById("aiMsgs");
  msgsDiv.innerHTML += '<div class="ai-msg bot"><b>📥 Mise à jour des prix</b><br><br>Pour actualiser les prix des options et accessoires, joignez votre fichier Excel avec le bouton 📎 ci-dessous.<br><br><b>Format attendu :</b><br>• Fichier <code>.xlsx</code> identique au fichier <code>08-PLP_2025-C-H.xlsx</code><br>• Feuille 1 : <b>C-version</b> (GEG) — Feuille 2 : <b>H-version</b> (PAC)<br>• Colonne A : Code option — Colonne B : Désignation<br>• Colonnes D à H : Prix par taille (037, 045, 052, 057, 062)<br><br>Si votre fichier a un format différent, <b>joignez-le quand même</b> — je l\'analyserai et vous guiderai pour l\'adapter. Je peux aussi mettre à jour les prix directement si vous me le demandez.</div>';
  msgsDiv.scrollTop = msgsDiv.scrollHeight;
}

function buildAIContext() {
  // Build context with current app state for the AI
  let ctx = "Tu es l'assistant technique expert des produits Galletti (PAC et groupes d'eau glacée). Tu travailles pour INVENIO / France Air.\n\n";
  ctx += "CONTEXTE APPLICATION:\n";
  ctx += "- Application de génération de fiches de sélection PAC/GEG Galletti\n";
  ctx += "- Gammes disponibles: PLP (tailles 037, 045, 052, 057, 062), PLE et MLI (à venir)\n";
  ctx += "- Réfrigérant: R290 (propane, GWP=3)\n\n";
  
  ctx += "FORMAT FICHIER EXCEL PRIX:\n";
  ctx += "- Fichier .xlsx avec 3 feuilles: 'C-version' (GEG), 'H-version' (PAC), 'Plans'\n";
  ctx += "- Colonne A: Code option, Colonne B: Désignation\n";
  ctx += "- Colonnes D-H: Prix par taille (D=037, E=045, F=052, G=057, H=062)\n";
  ctx += "- Structure identique au fichier 08-PLP_2025-C-H.xlsx\n\n";
  
  ctx += "FORMAT FICHIER CLIENTS:\n";
  ctx += "- Fichier .xlsx avec 2 colonnes: A=Code client, B=Nom client\n";
  ctx += "- Première ligne = en-têtes (Code, Nom)\n\n";
  
  ctx += "FORMAT FICHIER CSD:\n";
  ctx += "- Fichier .docx exporté depuis le configurateur Galletti (SELMAC)\n";
  ctx += "- Contient les données de sélection technique (températures, puissances, rendements)\n";
  ctx += "- Structure interne: ZIP avec afchunk2.docx (données techniques), afchunk3.docx (prestations), afchunk4.docx (dimensions)\n\n";

  ctx += "CATALOGUE OPTIONS (avec prix par taille 037/045/052/057/062):\n";
  CONFIG.options.forEach(function(o) {
    var prices = CONFIG.sizes.map(function(s){return s+":"+o.prix[s]+"€";}).join(" ");
    ctx += "- " + o.nom + " [" + o.type.join("/") + "] " + prices;
    var desc = OPTION_DESCRIPTIONS[o.id];
    if (desc) ctx += " — " + desc.replace(/<[^>]+>/g, " ").substring(0, 150);
    ctx += "\n";
  });

  ctx += "\nPRIX DE BASE MACHINE:\n";
  CONFIG.sizes.forEach(function(s) { ctx += "PLP " + s + ": " + CONFIG.basePrices[s] + " € HT\n"; });

  if (state.parsedData) {
    var d = state.parsedData;
    ctx += "\nMACHINE ACTUELLEMENT CHARGÉE: " + d.modele + " (" + d.type + ") taille " + d.size + "\n";
    if (d.resultsFroid.puissanceFrigo) ctx += "Puissance froid: " + d.resultsFroid.puissanceFrigo + " kW\n";
    if (d.resultsChaud && d.resultsChaud.puissanceChauffage) ctx += "Puissance chaud: " + d.resultsChaud.puissanceChauffage + " kW\n";
    ctx += "Réfrigérant: " + (d.refrigerant || "R290") + "\n";
  }

  ctx += "\nSTRUCTURE PARSER CSD ACTUELLE:\n";
  ctx += getCurrentMappingSummary();
  ctx += "\nACTIONS DISPONIBLES:\n";
  ctx += "1. MISE À JOUR DES PRIX: [ACTION:UPDATE_PRICES][{\"id\":\"option_id\",\"prices\":{\"037\":prix,...}}, ...][/ACTION]\n";
  ctx += "2. MISE À JOUR DES CLIENTS: [ACTION:UPDATE_CLIENTS][[\"code1\",\"nom1\"],[\"code2\",\"nom2\"],...][/ACTION]\n";
  ctx += "   - Ceci REMPLACE toute la base clients. Inclure TOUS les clients du fichier.\n";
  ctx += "   - Si le fichier a beaucoup de lignes, inclure les 50 premières et indiquer le total.\n";
  ctx += "3. CORRECTION CSD: [ACTION:UPDATE_CSD]{\"modele\":\"...\",\"resultsFroid\":{\"puissanceFrigo\":\"...\"}, ...}[/ACTION]\n";
  ctx += "   - Pour corriger/compléter les données extraites du CSD\n";
  ctx += "4. PROPOSITION CHANGEMENT STRUCTURE: [ACTION:PROPOSE_MAPPING]{\"fieldName\":{\"section\":\"results_cooling\",\"newLabel\":\"Nouveau label\",\"newPattern\":\"regex_string\",\"flags\":\"i\"}, ...}[/ACTION]\n";
  ctx += "   - IMPORTANT: utilise TOUJOURS PROPOSE_MAPPING (jamais APPLY_MAPPING directement)\n";
  ctx += "   - L'utilisateur verra un avertissement avec boutons Oui/Non avant application\n";
  ctx += "   - Sections valides: input_fields, results_cooling, results_heating, common_fields, general_fields\n\n";
  
  ctx += "RÈGLES:\n";
  ctx += "- Réponds en français, de manière concise et pratique\n";
  ctx += "- Si on te demande un prix, donne le prix exact du catalogue ci-dessus\n";
  ctx += "- Si on te demande le format d'un fichier Excel, explique précisément la structure attendue\n";
  ctx += "- Pour les questions techniques, sois précis et pédagogique\n";
  ctx += "- Tu peux utiliser **gras** et `code`\n";
  ctx += "- Quand un fichier est joint, analyse-le et explique son contenu\n";
  ctx += "- Si l'utilisateur demande de mettre à jour les prix et que tu as les données, tu PEUX exécuter l'action en incluant dans ta réponse un bloc [ACTION:UPDATE_PRICES] suivi d'un JSON array et [/ACTION]\n";
  ctx += "- Format ACTION: [{\"id\":\"option_id\",\"prices\":{\"037\":prix,\"045\":prix,...}}, ...]\n";
  ctx += "- Les IDs d'options valides sont: " + CONFIG.options.map(function(o){return o.id;}).join(", ") + "\n";
  ctx += "- Ne fais une ACTION que si l'utilisateur le demande explicitement\n";
  ctx += "- Si le fichier joint n'a pas le bon format, analyse-le, explique ce que tu vois, et propose d'adapter\n";
  ctx += "- Si l'utilisateur décrit la structure de son fichier, aide-le à mapper ses colonnes vers le format attendu\n";
  ctx += "- Pour les clients: si l'utilisateur dit 'mets à jour les clients' après avoir joint un fichier, extrais code+nom et utilise ACTION:UPDATE_CLIENTS\n";
  ctx += "- Pour le CSD: si des données manquent et que l'utilisateur joint le fichier ou donne les valeurs, utilise ACTION:UPDATE_CSD\n";
  ctx += "- Quand tu analyses un fichier, sois précis: nombre de lignes, colonnes trouvées, exemples de données\n";
  ctx += "- Si un format change, explique les différences et propose une solution\n";
  ctx += "- CHANGEMENT DE STRUCTURE CSD: si l'utilisateur joint un fichier CSD qui a une structure différente:\n";
  ctx += "  1. Analyse les labels de chaque ligne du fichier (cherche dans le XML les <w:t> tags)\n";
  ctx += "  2. Compare avec le MAPPING ACTUEL ci-dessus\n";
  ctx += "  3. Identifie les labels qui ont changé (ex: 'Cooling capacity' au lieu de 'Puissance de refroidissement')\n";
  ctx += "  4. Pose des questions si certains mappings sont ambigus\n";
  ctx += "  5. Propose les changements via ACTION:PROPOSE_MAPPING (JAMAIS APPLY_MAPPING)\n";
  ctx += "  6. L'interface affichera automatiquement un avertissement avec les conséquences\n";
  ctx += "- Lors de l'analyse d'un CSD joint, montre les premières lignes du fichier et indique quels champs correspondent\n";
  ctx += "- Si un label a changé de langue (FR→EN ou inversement), signale-le explicitement\n";
  return ctx;
}

async function sendAI() {
  var input = document.getElementById("aiInput");
  var q = input.value.trim();
  if (!q) return;
  
  // Add user message
  var msgsDiv = document.getElementById("aiMsgs");
  msgsDiv.innerHTML += '<div class="ai-msg user">' + escapeHtml(q) + '</div>';
  input.value = "";
  msgsDiv.scrollTop = msgsDiv.scrollHeight;
  
  // Show typing indicator
  msgsDiv.innerHTML += '<div class="ai-typing" id="aiTyping">L\'assistant réfléchit...</div>';
  msgsDiv.scrollTop = msgsDiv.scrollHeight;
  document.getElementById("aiSend").disabled = true;

  // Build messages for API
  aiHistory.push({role: "user", content: q});
  
  // Keep only last 10 messages to stay within context
  var recentHistory = aiHistory.slice(-10);

  try {
    var response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1000,
        system: buildAIContext(),
        messages: recentHistory
      })
    });
    var data = await response.json();
    var reply = data.content ? data.content.map(function(c){return c.text||"";}).join("") : "Désolé, je n'ai pas pu répondre. Réessayez.";
    
    aiHistory.push({role: "assistant", content: reply});
    
    // Remove typing indicator and add response
    var typing = document.getElementById("aiTyping");
    if (typing) typing.remove();
    
    // Convert markdown-like formatting
    reply = reply.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
    reply = reply.replace(/\n/g, '<br>');
    
    msgsDiv.innerHTML += '<div class="ai-msg bot">' + reply + '</div>';
  } catch(e) {
    var typing = document.getElementById("aiTyping");
    if (typing) typing.remove();
    msgsDiv.innerHTML += '<div class="ai-msg bot" style="color:#c0392b">Erreur de connexion à l\'assistant. Vérifiez votre connexion internet et réessayez.</div>';
    console.error("AI error:", e);
  }
  
  document.getElementById("aiSend").disabled = false;
  msgsDiv.scrollTop = msgsDiv.scrollHeight;
  input.focus();
}


// ══════════════════════════════════════════════
// AI-POWERED UPDATES FOR ALL DATA SOURCES
// ══════════════════════════════════════════════

function openClientUpdate() {
  var panel = document.getElementById("aiPanel");
  if (!panel.classList.contains("open")) toggleAI();
  
  var msgsDiv = document.getElementById("aiMsgs");
  msgsDiv.innerHTML += '<div class="ai-msg bot"><b>📥 Mise à jour de la base clients</b><br><br>Joignez votre fichier Excel avec le bouton 📎 ci-dessous.<br><br><b>Format attendu :</b><br>• Fichier <code>.xlsx</code><br>• Colonne A : <b>Code client</b><br>• Colonne B : <b>Nom du client</b><br>• Première ligne = en-têtes<br><br>Si votre fichier a un format différent, <b>joignez-le quand même</b>. Je l\'analyserai et vous proposerai d\'adapter la structure. Vous pouvez aussi me décrire votre fichier et je vous guiderai.<br><br>Dites ensuite <b>"mets à jour les clients"</b> et j\'appliquerai les changements.</div>';
  msgsDiv.scrollTop = msgsDiv.scrollHeight;
}

function offerCSDHelp(data, missing) {
  var panel = document.getElementById("aiPanel");
  if (!panel.classList.contains("open")) toggleAI();
  
  var msgsDiv = document.getElementById("aiMsgs");
  var msg = '<b>⚠️ Données CSD incomplètes</b><br><br>';
  msg += 'Le fichier CSD a été partiellement lu, mais il manque : <b>' + missing.join(', ') + '</b>.<br><br>';
  msg += 'Cela peut signifier que le format de la fiche de sélection Galletti a changé. ';
  msg += 'Plusieurs possibilités :<br><br>';
  msg += '• <b>Joignez le fichier CSD</b> avec 📎 et demandez-moi : "analyse la structure de ce fichier"<br>';
  msg += '• Je comparerai avec la structure connue et identifierai les changements<br>';
  msg += '• Si des labels ont changé, je vous proposerai d\'adapter le parser avec votre validation<br>';
  msg += '• Vous pouvez aussi continuer avec les données partielles<br><br>';
  msg += '<i>Les données trouvées : ' + (data.modele || '?') + ', ';
  msg += (data.resultsFroid.puissanceFrigo ? 'Pfroid=' + data.resultsFroid.puissanceFrigo + 'kW' : 'pas de puissance froid') + ', ';
  if (data.resultsChaud && data.resultsChaud.puissanceChauffage) msg += 'Pchaud=' + data.resultsChaud.puissanceChauffage + 'kW, ';
  msg += (data.commonData.lwStandard ? 'Lw=' + data.commonData.lwStandard + 'dB(A)' : 'pas de Lw') + '</i>';
  
  msgsDiv.innerHTML += '<div class="ai-msg bot">' + msg + '</div>';
  msgsDiv.scrollTop = msgsDiv.scrollHeight;
}

function escapeHtml(t) {
  var d = document.createElement("div");
  d.textContent = t;
  return d.innerHTML;
}
