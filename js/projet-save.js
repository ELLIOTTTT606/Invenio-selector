// ══════════════════════════════════════════════════════════════
// projet-save.js — Sauvegarde & rechargement des fiches
// ══════════════════════════════════════════════════════════════
// Charger APRÈS db.js et turso-sync.js, AVANT ou APRÈS app.js.
//
// Deux fonctions principales :
//   ProjetSave.save()  → sauvegarde la fiche actuelle dans Turso
//   ProjetSave.load(projetId) → recharge une fiche depuis Turso
//
// La sauvegarde est appelée automatiquement au moment du PDF.
// Le rechargement est appelé depuis le CRM quand on clique sur un projet.
// ══════════════════════════════════════════════════════════════

var ProjetSave = (function () {

  // ── Sauvegarder la fiche actuelle ───────────
  async function save() {
    if (!TURSO_CONNECTED || typeof DB === 'undefined') {
      console.warn('ProjetSave: Turso non connecté, sauvegarde ignorée');
      return null;
    }

    try {
      var d = state.parsedData;
      if (!d) return null;

      var numP = document.getElementById('inputNumProjet');
      var nomP = document.getElementById('inputNomProjet');
      var reference = (numP && numP.value) ? numP.value.trim() : ('AFF-' + Date.now());
      var nomProjet = (nomP && nomP.value) ? nomP.value.trim() : (d.modele || 'Sans nom');

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

      // Calculer le montant total
      var selOpts = CONFIG.options.filter(function (o) {
        return state.selectedOptions[o.id] && o.type.includes(d.type);
      });
      var montant = CONFIG.basePrices[d.size] || 0;
      selOpts.forEach(function (o) {
        var p = getPrice(o, d.size);
        if (typeof p === 'number') montant += p;
      });

      // Sérialiser les données CSD pour pouvoir les recharger
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

      // Vérifier si le projet existe déjà (même référence)
      var existingProj = await DB.query(
        "SELECT id FROM projets WHERE reference = ?", [reference]
      );

      var projetId;
      if (existingProj.length > 0) {
        // Mise à jour
        projetId = existingProj[0].id;
        await DB.query(
          "UPDATE projets SET nom_projet=?, client_id=?, contact_fa_id=?, " +
          "taille=?, type_machine=?, montant_ht=?, donnees_csd=?, updated_at=datetime('now') " +
          "WHERE id=?",
          [nomProjet, clientId, contactFaId, d.size || '', d.type || '', montant, donneesCsd, projetId]
        );
        console.log('📋 Projet mis à jour: ' + reference);
      } else {
        // Création
        var proj = await DB.projets.create({
          reference: reference,
          nom_projet: nomProjet,
          client_id: clientId,
          contact_fa_id: contactFaId,
          taille: d.size || '',
          type_machine: d.type || '',
          statut: 'en_cours',
          montant_ht: montant,
          donnees_csd: donneesCsd
        });
        projetId = proj ? proj.id : null;
        console.log('📋 Projet créé: ' + reference);
      }

      // Sauvegarder les options sélectionnées
      if (projetId) {
        // Supprimer les anciennes options
        await DB.query("DELETE FROM projets_options WHERE projet_id = ?", [projetId]);

        // Insérer les nouvelles
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
        console.log('📋 ' + selOpts.length + ' options sauvegardées');
      }

      return projetId;

    } catch (e) {
      console.warn('ProjetSave erreur:', e.message);
      return null;
    }
  }


  // ── Charger un projet depuis Turso ──────────
  // Redirige vers selector.html avec l'ID du projet en paramètre
  function openFromCRM(projetId) {
    window.location.href = 'selector.html?projet=' + projetId;
  }


  // ── Recharger l'état depuis Turso (appelé au chargement de selector.html) ──
  async function loadFromURL() {
    var params = new URLSearchParams(window.location.search);
    var projetId = params.get('projet');
    if (!projetId) return false;

    if (!TURSO_CONNECTED || typeof DB === 'undefined') {
      console.warn('ProjetSave: Turso non connecté, impossible de charger le projet');
      return false;
    }

    try {
      console.log('📂 Chargement du projet #' + projetId + '...');

      var projet = await DB.projets.getById(parseInt(projetId));
      if (!projet || !projet.donnees_csd) {
        console.warn('Projet introuvable ou sans données CSD');
        return false;
      }

      // Désérialiser les données
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

      // Afficher un message
      showMsg('success', '📂 Projet "' + projet.nom_projet + '" chargé — vous pouvez le modifier et regénérer le PDF');

      // Aller directement à l'étape config (step 1)
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
    loadFromURL: loadFromURL
  };

})();
