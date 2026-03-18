// ══════════════════════════════════════════════════════════════
// turso-sync.js — Synchronisation Turso → variables locales
// ══════════════════════════════════════════════════════════════
// Ce fichier se charge APRÈS db.js et data.js, AVANT app.js.
// Il tente de charger les données depuis Turso et écrase les
// variables globales (CONFIG, CLIENTS). Si Turso est down,
// l'app fonctionne normalement avec les données de data.js.
//
// Ordre de chargement dans index.html :
//   1. js/db.js          (connexion Turso)
//   2. js/data.js        (données locales = fallback)
//   3. js/turso-sync.js  (ce fichier — écrase avec Turso)
//   4. js/app.js         (logique app)
// ══════════════════════════════════════════════════════════════

var TURSO_CONNECTED = false;
var TURSO_SYNC_DONE = false;

var TursoSync = (function () {

  // ── Synchroniser tout au démarrage ──────────
  async function init() {
    try {
      var ok = await DB.init();
      if (!ok) {
        console.warn("⚠️ Turso inaccessible — fallback sur data.js");
        TURSO_SYNC_DONE = true;
        return false;
      }
      TURSO_CONNECTED = true;
      console.log("🔄 Synchronisation Turso → CONFIG...");

      // Lancer toutes les synchros en parallèle
      await Promise.all([
        syncClients(),
        syncBasePrices(),
        syncOptions(),
        syncContacts()
      ]);

      TURSO_SYNC_DONE = true;
      console.log("✅ Synchronisation terminée — données Turso actives");
      return true;

    } catch (e) {
      console.warn("⚠️ Erreur synchro Turso:", e.message, "— fallback sur data.js");
      TURSO_SYNC_DONE = true;
      return false;
    }
  }

  // ── Clients ─────────────────────────────────
  async function syncClients() {
    try {
      var count = await DB.clients.count();
      if (count === 0) {
        console.log("  ℹ️ Aucun client dans Turso — conservation des clients locaux");
        return;
      }

      // Charger tous les clients depuis Turso
      var rows = await DB.query(
        "SELECT code_client, raison_sociale FROM clients ORDER BY raison_sociale"
      );

      if (rows && rows.length > 0) {
        CLIENTS = rows.map(function (r) {
          return [r.code_client, r.raison_sociale];
        });
        console.log("  ✅ Clients: " + CLIENTS.length.toLocaleString("fr-FR") + " chargés depuis Turso");

        // Mettre à jour le compteur si la fonction existe
        if (typeof updateClientCount === "function") {
          updateClientCount();
        }
      }
    } catch (e) {
      console.warn("  ⚠️ Clients: fallback local —", e.message);
    }
  }

  // ── Prix de base machines ───────────────────
  async function syncBasePrices() {
    try {
      var rows = await DB.query(
        "SELECT m.taille, m.prix_base_ht FROM modeles m " +
        "JOIN gammes g ON m.gamme_id = g.id " +
        "WHERE g.code_gamme LIKE 'PLP%' AND m.prix_base_ht > 0 " +
        "GROUP BY m.taille"
      );

      if (rows && rows.length > 0) {
        var updated = 0;
        rows.forEach(function (r) {
          if (r.taille && r.prix_base_ht > 0) {
            CONFIG.basePrices[r.taille] = r.prix_base_ht;
            updated++;
          }
        });
        if (updated > 0) {
          console.log("  ✅ Prix de base: " + updated + " tailles mises à jour");
        }
      }
    } catch (e) {
      console.warn("  ⚠️ Prix de base: fallback local —", e.message);
    }
  }

  // ── Options & prix par taille ───────────────
  async function syncOptions() {
    try {
      // Charger les options avec leurs prix
      var rows = await DB.query(
        "SELECT o.code_option, o.designation, o.categorie, o.compatible_types, " +
        "op.taille, op.prix_ht " +
        "FROM options o " +
        "LEFT JOIN options_prix op ON o.id = op.option_id " +
        "ORDER BY o.categorie, o.designation, op.taille"
      );

      if (!rows || rows.length === 0) {
        console.log("  ℹ️ Aucune option dans Turso — conservation du catalogue local");
        return;
      }

      // Regrouper par option
      var optionsMap = {};
      rows.forEach(function (r) {
        if (!optionsMap[r.code_option]) {
          optionsMap[r.code_option] = {
            id: r.code_option,
            cat: r.categorie || "",
            nom: r.designation,
            type: (r.compatible_types || "CS,HS").split(","),
            prix: {}
          };
        }
        if (r.taille && r.prix_ht !== null) {
          optionsMap[r.code_option].prix[r.taille] = r.prix_ht;
        }
      });

      var tursoOptions = Object.values(optionsMap);

      if (tursoOptions.length > 0) {
        // Fusionner : mettre à jour les options existantes, ajouter les nouvelles
        tursoOptions.forEach(function (tOpt) {
          var localIdx = CONFIG.options.findIndex(function (o) { return o.id === tOpt.id; });
          if (localIdx !== -1) {
            // Mettre à jour les prix depuis Turso
            if (Object.keys(tOpt.prix).length > 0) {
              Object.assign(CONFIG.options[localIdx].prix, tOpt.prix);
            }
            // Mettre à jour le nom et la catégorie si différents
            if (tOpt.nom) CONFIG.options[localIdx].nom = tOpt.nom;
            if (tOpt.cat) CONFIG.options[localIdx].cat = tOpt.cat;
          } else {
            // Nouvelle option depuis Turso
            CONFIG.options.push(tOpt);
          }
        });
        console.log("  ✅ Options: " + tursoOptions.length + " synchronisées (" + Object.keys(tursoOptions[0].prix).length + " tailles)");
      }
    } catch (e) {
      console.warn("  ⚠️ Options: fallback local —", e.message);
    }
  }

  // ── Contacts France Air ─────────────────────
  async function syncContacts() {
    try {
      var rows = await DB.query(
        "SELECT nom, prenom, poste, email, telephone, region FROM contacts_fa ORDER BY region, nom"
      );

      if (!rows || rows.length === 0) {
        console.log("  ℹ️ Aucun contact FA dans Turso — conservation des contacts locaux");
        return;
      }

      // Regrouper par région
      var contactsByRegion = {};
      rows.forEach(function (r) {
        if (!contactsByRegion[r.region]) {
          contactsByRegion[r.region] = [];
        }
        contactsByRegion[r.region].push({
          nom: (r.prenom ? r.prenom + " " : "") + r.nom,
          poste: r.poste || "",
          tel: r.telephone || "",
          email: r.email || ""
        });
      });

      // Fusionner avec CONFIG.contacts
      Object.keys(contactsByRegion).forEach(function (region) {
        CONFIG.contacts[region] = contactsByRegion[region];
      });

      console.log("  ✅ Contacts FA: " + rows.length + " contacts dans " + Object.keys(contactsByRegion).length + " régions");
    } catch (e) {
      console.warn("  ⚠️ Contacts: fallback local —", e.message);
    }
  }

  // ── Recherche clients hybride ───────────────
  // Remplace la recherche locale par une recherche Turso
  // avec fallback sur le tableau CLIENTS local
  async function searchClients(query) {
    if (!query || query.length < 2) return [];

    if (TURSO_CONNECTED) {
      try {
        var rows = await DB.clients.search(query);
        return rows.map(function (r) {
          return [r.code_client, r.raison_sociale];
        });
      } catch (e) {
        console.warn("Recherche Turso échouée, fallback local");
      }
    }

    // Fallback local
    var ql = query.toLowerCase();
    return CLIENTS.filter(function (c) {
      return c[0].toLowerCase().includes(ql) || c[1].toLowerCase().includes(ql);
    }).slice(0, 50);
  }

  // ── Sauvegarder un nouveau client dans Turso ──
  async function saveClient(code, nom) {
    if (!TURSO_CONNECTED) return;
    try {
      await DB.clients.upsert({ code_client: code, raison_sociale: nom });
    } catch (e) {
      console.warn("Sauvegarde client Turso échouée:", e.message);
    }
  }

  // ── Sauvegarder les prix modifiés dans Turso ──
  async function savePrices() {
    if (!TURSO_CONNECTED) return;
    try {
      var count = 0;
      for (var i = 0; i < CONFIG.options.length; i++) {
        var o = CONFIG.options[i];
        var rows = await DB.query("SELECT id FROM options WHERE code_option = ?", [o.id]);
        if (!rows || rows.length === 0) continue;
        var optId = rows[0].id;

        var sizes = Object.keys(o.prix);
        for (var j = 0; j < sizes.length; j++) {
          var s = sizes[j];
          var p = o.prix[s];
          if (typeof p === "number") {
            await DB.options.updatePrix(optId, s, p);
            count++;
          }
        }
      }
      console.log("✅ " + count + " prix sauvegardés dans Turso");
    } catch (e) {
      console.warn("Sauvegarde prix Turso échouée:", e.message);
    }
  }

  // ── API publique ────────────────────────────
  return {
    init: init,
    searchClients: searchClients,
    saveClient: saveClient,
    savePrices: savePrices,
    isConnected: function () { return TURSO_CONNECTED; },
    isDone: function () { return TURSO_SYNC_DONE; }
  };

})();
