// ══════════════════════════════════════════════════════════════
// projet-save.js — Sauvegarde, versioning & rechargement
// ══════════════════════════════════════════════════════════════
// Charger APRÈS db.js et turso-sync.js.
//
//   ProjetSave.save()              → sauvegarde (crée V2 si modifié)
//   ProjetSave.openFromCRM(id)     → redirige vers selector.html?projet=ID
//   ProjetSave.loadFromURL()       → recharge un projet depuis l'URL
//
// Versioning :
//   - Nouveau projet → AFF-2025-XXXX
//   - Modification d'un projet chargé → AFF-2025-XXXX-V2, V3...
//   - L'ancienne version reste intacte dans l'historique
// ══════════════════════════════════════════════════════════════

var ProjetSave = (function () {

  // ID du projet chargé depuis le CRM (null si nouveau)
  var _loadedProjetId = null;
  var _loadedReference = null;
  var _loadedOptionsHash = null;

  // Générer un hash simple des options sélectionnées pour détecter les changements
  function optionsHash() {
    if (!state || !state.selectedOptions) return '';
    var keys = Object.keys(state.selectedOptions).filter(function (k) {
      return state.selectedOptions[k];
    }).sort();
    return keys.join(',');
  }

  // Vérifier si les options ont changé par rapport au chargement
  function hasChanged() {
    if (!_loadedProjetId) return false;
    return optionsHash() !== _loadedOptionsHash;
  }

  // Trouver la prochaine version disponible pour une référence
  async function getNextVersion(baseRef) {
    // Retirer le -VX existant pour trouver la base
    var cleanRef = baseRef.replace(/-V\d+$/, '');

    var rows = await DB.query(
      "SELECT reference FROM projets WHERE reference LIKE ? ORDER BY reference DESC",
      [cleanRef + '%']
    );

    if (rows.length === 0) return cleanRef;

    // Trouver le numéro de version le plus haut
    var maxV = 1;
    rows.forEach(function (r) {
      var match = r.reference.match(/-V(\d+)$/);
      if (match) {
        var v = parseInt(match[1]);
        if (v > maxV) maxV = v;
      }
    });

    return cleanRef + '-V' + (maxV + 1);
  }


  // ── Sauvegarder la fiche ────────────────────
  async function save() {
    if (!TURSO_CONNECTED || typeof DB === 'undefined') {
      console.warn('ProjetSave: Turso non connecté');
      return null;
    }

    try {
      var d = state.parsedData;
      if (!d) return null;

      var numP = document.getElementById('inputNumProjet');
      var nomP = document.getElementById('inputNomProjet');
      var nomProjet = (nomP && nomP.value) ? nomP.value.trim() : (d.modele || 'Sans nom');

      // Déterminer la référence
      var reference;
      var isNewVersion = false;

      if (_loadedProjetId && hasChanged()) {
        // Options modifiées → créer une nouvelle version
        reference = await getNextVersion(_loadedReference);
        isNewVersion = true;
        console.log('📋 Options modifiées → nouvelle version: ' + reference);
      } else if (numP && numP.value && numP.value.trim()) {
        reference = numP.value.trim();
      } else {
        reference = 'AFF-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + String(Math.floor(Math.random() * 9000) + 1000);
      }

      // Trouver ou créer le client
      var clientId = null;
      if (state.selectedClient) {
        var clientCode = state.selectedClient.code || 'MANUEL';
        var clientNom = state.selectedClient.nom || '';
        if (clientCode && clientNom) {
          var existing = await DB.clients.getByCode(clientCode);
          if (existing) {
            clientId = existing.id;
          } else {
            var created = await DB.clients.upsert({
              code_client: clientCode,
              raison_sociale: clientNom
            });
            if (created) clientId = created.id;
          }
        }
      }

      // Trouver le contact FA
      var contactFaId = null;
      if (state.contact && state.region) {
        var faRows = await DB.query(
          "SELECT id FROM contacts_fa WHERE nom LIKE ? AND region = ? LIMIT 1",
          ['%' + state.contact.nom.split(' ').pop() + '%', state.region]
        );
        if (faRows.length > 0) contactFaId = faRows[0].id;
      }

      // Calculer le montant
      var selOpts = CONFIG.options.filter(function (o) {
        return state.selectedOptions[o.id] && o.type.includes(d.type);
      });
      var montant = CONFIG.basePrices[d.size] || 0;
      selOpts.forEach(function (o) {
        var p = getPrice(o, d.size);
        if (typeof p === 'number') montant += p;
      });

      // Sérialiser les données
      var donneesCsd = JSON.stringify({
        parsedData: d,
        selectedOptions: state.selectedOptions,
        machineType: state.machineType,
        selectedModel: state.selectedModel,
        selectedSize: state.selectedSize,
        region: state.region,
        contact: state.contact,
        versionAcoustique: state.versionAcoustique,
        dimensionImage: state.dimensionImage
      });

      var projetId;

      if (_loadedProjetId && !isNewVersion) {
        // Mise à jour du même projet (pas de changement d'options)
        projetId = _loadedProjetId;
        await DB.query(
          "UPDATE projets SET nom_projet=?, client_id=?, contact_fa_id=?, " +
          "taille=?, type_machine=?, montant_ht=?, donnees_csd=?, updated_at=datetime('now') " +
          "WHERE id=?",
          [nomProjet, clientId, contactFaId, d.size || '', d.type || '', montant, donneesCsd, projetId]
        );
        console.log('📋 Projet mis à jour: ' + reference);
      } else {
        // Nouveau projet ou nouvelle version
        // Si c'est une V2+, marquer l'ancien comme "révisé"
        if (isNewVersion && _loadedProjetId) {
          await DB.query(
            "UPDATE projets SET notes = COALESCE(notes,'') || ? WHERE id = ?",
            [' [Révisé → ' + reference + ']', _loadedProjetId]
          );
        }

        var proj = await DB.projets.create({
          reference: reference,
          nom_projet: nomProjet,
          client_id: clientId,
          contact_fa_id: contactFaId,
          taille: d.size || '',
          type_machine: d.type || '',
          statut: 'en_cours',
          montant_ht: montant,
          donnees_csd: donneesCsd,
          notes: isNewVersion ? 'Révision de ' + _loadedReference : ''
        });
        projetId = proj ? proj.id : null;
        console.log('📋 Projet créé: ' + reference + (isNewVersion ? ' (nouvelle version)' : ''));
      }

      // Sauvegarder les options
      if (projetId) {
        await DB.query("DELETE FROM projets_options WHERE projet_id = ?", [projetId]);
        for (var i = 0; i < selOpts.length; i++) {
          var opt = selOpts[i];
          var optRows = await DB.query("SELECT id FROM options WHERE code_option = ?", [opt.id]);
          if (optRows.length > 0) {
            var prix = getPrice(opt, d.size);
            await DB.query(
              "INSERT INTO projets_options (projet_id, option_id, prix_ht) VALUES (?, ?, ?)",
              [projetId, optRows[0].id, typeof prix === 'number' ? prix : 0]
            );
          }
        }
      }

      // Mettre à jour le champ référence affiché
      if (numP) numP.value = reference;

      // Mettre à jour l'état interne
      _loadedProjetId = projetId;
      _loadedReference = reference;
      _loadedOptionsHash = optionsHash();

      return projetId;

    } catch (e) {
      console.warn('ProjetSave erreur:', e.message);
      return null;
    }
  }


  // ── Ouvrir un projet depuis le CRM ──────────
  function openFromCRM(projetId) {
    window.location.href = 'selector.html?projet=' + projetId;
  }


  // ── Charger un projet depuis l'URL ──────────
  async function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    var projetId = params.get('projet');
    if (!projetId) return false;

    if (!TURSO_CONNECTED || typeof DB === 'undefined') {
      console.warn('ProjetSave: Turso non connecté');
      return false;
    }

    try {
      console.log('📂 Chargement du projet #' + projetId + '...');

      var projet = await DB.projets.getById(parseInt(projetId));
      if (!projet || !projet.donnees_csd) {
        console.warn('Projet introuvable ou sans données CSD');
        return false;
      }

      var saved = JSON.parse(projet.donnees_csd);
      if (!saved || !saved.parsedData) {
        console.warn('Données CSD invalides');
        return false;
      }

      // Restaurer l'état
      state.parsedData = saved.parsedData;
      state.selectedOptions = saved.selectedOptions || {};
      state.machineType = saved.machineType || saved.parsedData.type;
      state.selectedModel = saved.selectedModel;
      state.selectedSize = saved.selectedSize || saved.parsedData.size;
      state.region = saved.region || '';
      state.contact = saved.contact || null;
      state.versionAcoustique = saved.versionAcoustique || 'standard';
      state.dimensionImage = saved.dimensionImage || null;

      // Restaurer le client
      if (projet.client_id) {
        var client = await DB.clients.getById(projet.client_id);
        if (client) {
          state.selectedClient = { code: client.code_client, nom: client.raison_sociale };
          var selText = document.getElementById('clientSelectedText');
          var selBox = document.getElementById('clientSelected');
          if (selText) selText.textContent = client.raison_sociale + ' — ' + client.code_client;
          if (selBox) selBox.classList.add('visible');
        }
      }

      // Restaurer les sélections visuelles
      if (state.machineType) selectType(state.machineType);

      // Remplir les champs projet
      var numP = document.getElementById('inputNumProjet');
      var nomP = document.getElementById('inputNomProjet');
      if (numP) numP.value = projet.reference || '';
      if (nomP) nomP.value = projet.nom_projet || '';

      // Stocker les infos du projet chargé pour le versioning
      _loadedProjetId = parseInt(projetId);
      _loadedReference = projet.reference;
      _loadedOptionsHash = optionsHash();

      // Message
      var vMatch = projet.reference.match(/-V(\d+)$/);
      var vLabel = vMatch ? ' (Version ' + vMatch[1] + ')' : '';
      showMsg('success', '📂 Projet "' + projet.nom_projet + '"' + vLabel + ' chargé — modifiez les options et regénérez le PDF. Si vous changez les options, une nouvelle version sera créée automatiquement.');

      // Aller à l'étape config
      setTimeout(function () { goToStep(1); }, 300);

      console.log('✅ Projet rechargé: ' + projet.reference);
      return true;

    } catch (e) {
      console.warn('ProjetSave load erreur:', e.message);
      return false;
    }
  }


  return {
    save: save,
    openFromCRM: openFromCRM,
    loadFromURL: loadFromURL,
    hasChanged: hasChanged
  };

})();
