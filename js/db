// ══════════════════════════════════════════════════════════════
// db.js — Couche d'accès à la base de données Turso
// ══════════════════════════════════════════════════════════════
// Utilise l'API HTTP Turso (v2/pipeline) directement via fetch().
// Aucune dépendance, aucun npm, fonctionne sur GitHub Pages.
//
// Usage :
//   await DB.init();
//   const clients = await DB.clients.search("Dalkia");
//   await DB.clients.upsert({ code_client: "CLI-042", raison_sociale: "Dalkia" });
//   await DB.projets.create({ ... });
// ══════════════════════════════════════════════════════════════

const DB = (function () {

  // ── Configuration Turso ───────────────────────
  const TURSO_URL = "https://invenio-elliotttt606.aws-eu-west-1.turso.io";
  const TURSO_TOKEN = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzM4MjM3OTksImlkIjoiMDE5ZDAwMjItNjkwMS03NzMzLTk0YjAtZGM1YjNjNTQwNjE0IiwicmlkIjoiOTc4N2E5ZjktODY0Yi00NzA4LTgzN2MtMDJhNmE5ZjQ4ZGRhIn0.NQvxioIqEGR7aGccEGTdQux_Pa5uQ2Q8LILIb9r4RrxHOweZdrQ9Y8r2IDsl6ghuojAdJDB8qK1OewzPZ9n2Dw";

  // ── Requête HTTP brute vers Turso ─────────────
  async function query(sql, args) {
    var stmt = { sql: sql };
    if (args && args.length > 0) {
      stmt.args = args.map(function (a) {
        if (a === null || a === undefined) return { type: "null", value: null };
        if (typeof a === "number") {
          return Number.isInteger(a)
            ? { type: "integer", value: String(a) }
            : { type: "float", value: a };
        }
        return { type: "text", value: String(a) };
      });
    }

    var resp = await fetch(TURSO_URL + "/v2/pipeline", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + TURSO_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requests: [
          { type: "execute", stmt: stmt },
          { type: "close" }
        ]
      })
    });

    if (!resp.ok) {
      throw new Error("Turso HTTP " + resp.status + ": " + (await resp.text()));
    }

    var data = await resp.json();
    var result = data.results && data.results[0];

    if (result && result.type === "error") {
      throw new Error("Turso SQL: " + (result.error && result.error.message || "Unknown error"));
    }

    if (!result || !result.response || !result.response.result) {
      return [];
    }

    // Transformer les résultats en objets JS
    var cols = result.response.result.cols.map(function (c) { return c.name; });
    var rows = result.response.result.rows || [];

    return rows.map(function (row) {
      var obj = {};
      row.forEach(function (cell, i) {
        obj[cols[i]] = cell.type === "null" ? null
          : cell.type === "integer" ? parseInt(cell.value)
          : cell.type === "float" ? parseFloat(cell.value)
          : cell.value;
      });
      return obj;
    });
  }

  // Exécuter plusieurs requêtes dans un batch
  async function batch(statements) {
    var requests = statements.map(function (s) {
      var stmt = { sql: s.sql };
      if (s.args && s.args.length > 0) {
        stmt.args = s.args.map(function (a) {
          if (a === null || a === undefined) return { type: "null", value: null };
          if (typeof a === "number") {
            return Number.isInteger(a)
              ? { type: "integer", value: String(a) }
              : { type: "float", value: a };
          }
          return { type: "text", value: String(a) };
        });
      }
      return { type: "execute", stmt: stmt };
    });
    requests.push({ type: "close" });

    var resp = await fetch(TURSO_URL + "/v2/pipeline", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + TURSO_TOKEN,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ requests: requests })
    });

    if (!resp.ok) {
      throw new Error("Turso batch HTTP " + resp.status);
    }

    return await resp.json();
  }

  // ══════════════════════════════════════════════
  // CLIENTS
  // ══════════════════════════════════════════════
  var clients = {

    // Recherche par raison sociale ou code (LIKE)
    search: async function (q) {
      if (!q || q.length < 2) return [];
      var like = "%" + q + "%";
      return await query(
        "SELECT * FROM clients WHERE raison_sociale LIKE ?1 OR code_client LIKE ?1 ORDER BY raison_sociale LIMIT 50",
        [like]
      );
    },

    // Récupérer tous les clients
    getAll: async function () {
      return await query("SELECT * FROM clients ORDER BY raison_sociale");
    },

    // Récupérer un client par ID
    getById: async function (id) {
      var rows = await query("SELECT * FROM clients WHERE id = ?", [id]);
      return rows[0] || null;
    },

    // Récupérer un client par code
    getByCode: async function (code) {
      var rows = await query("SELECT * FROM clients WHERE code_client = ?", [code]);
      return rows[0] || null;
    },

    // Créer ou mettre à jour un client (upsert sur code_client)
    upsert: async function (data) {
      await query(
        "INSERT INTO clients (code_client, raison_sociale, adresse, code_postal, ville, pays) " +
        "VALUES (?, ?, ?, ?, ?, ?) " +
        "ON CONFLICT(code_client) DO UPDATE SET " +
        "raison_sociale=excluded.raison_sociale, adresse=excluded.adresse, " +
        "code_postal=excluded.code_postal, ville=excluded.ville, " +
        "pays=excluded.pays, updated_at=datetime('now')",
        [
          data.code_client || "",
          data.raison_sociale || "",
          data.adresse || "",
          data.code_postal || "",
          data.ville || "",
          data.pays || "France"
        ]
      );
      var rows = await query("SELECT * FROM clients WHERE code_client = ?", [data.code_client]);
      return rows[0] || null;
    },

    // Importer un tableau de clients [[code, nom], ...]
    bulkImport: async function (arr) {
      var stmts = arr.map(function (c) {
        return {
          sql: "INSERT INTO clients (code_client, raison_sociale) VALUES (?, ?) " +
               "ON CONFLICT(code_client) DO UPDATE SET raison_sociale=excluded.raison_sociale, updated_at=datetime('now')",
          args: [c[0], c[1]]
        };
      });
      // Batch par paquets de 50
      var imported = 0;
      for (var i = 0; i < stmts.length; i += 50) {
        var chunk = stmts.slice(i, i + 50);
        await batch(chunk);
        imported += chunk.length;
      }
      return imported;
    },

    // Compter le nombre total de clients
    count: async function () {
      var rows = await query("SELECT COUNT(*) AS n FROM clients");
      return rows[0] ? rows[0].n : 0;
    }
  };

  // ══════════════════════════════════════════════
  // CONTACTS FRANCE AIR
  // ══════════════════════════════════════════════
  var contactsFa = {

    getByRegion: async function (region) {
      return await query("SELECT * FROM contacts_fa WHERE region = ? ORDER BY nom", [region]);
    },

    getAll: async function () {
      return await query("SELECT * FROM contacts_fa ORDER BY region, nom");
    },

    upsert: async function (data) {
      await query(
        "INSERT INTO contacts_fa (nom, prenom, poste, email, telephone, region, agence) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?) " +
        "ON CONFLICT DO NOTHING",
        [data.nom, data.prenom || "", data.poste || "", data.email || "",
         data.telephone || "", data.region, data.agence || ""]
      );
    }
  };

  // ══════════════════════════════════════════════
  // PROJETS (fiches de sélection)
  // ══════════════════════════════════════════════
  var projets = {

    // Créer un nouveau projet
    create: async function (data) {
      var ref = data.reference || ("PRJ-" + Date.now());
      await query(
        "INSERT INTO projets (reference, nom_projet, client_id, contact_fa_id, modele_id, " +
        "taille, type_machine, statut, montant_ht, date_creation, date_validite, notes, donnees_csd) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          ref,
          data.nom_projet || "",
          data.client_id || null,
          data.contact_fa_id || null,
          data.modele_id || null,
          data.taille || "",
          data.type_machine || "",
          data.statut || "en_cours",
          data.montant_ht || 0,
          data.date_creation || new Date().toISOString().split("T")[0],
          data.date_validite || "",
          data.notes || "",
          data.donnees_csd || ""
        ]
      );
      var rows = await query("SELECT * FROM projets WHERE reference = ?", [ref]);
      return rows[0] || null;
    },

    // Récupérer un projet par ID
    getById: async function (id) {
      var rows = await query(
        "SELECT p.*, c.code_client, c.raison_sociale, " +
        "fa.nom AS fa_nom, fa.prenom AS fa_prenom, fa.region AS fa_region " +
        "FROM projets p " +
        "LEFT JOIN clients c ON p.client_id = c.id " +
        "LEFT JOIN contacts_fa fa ON p.contact_fa_id = fa.id " +
        "WHERE p.id = ?", [id]
      );
      return rows[0] || null;
    },

    // Lister les projets d'un client
    getByClient: async function (clientId) {
      return await query(
        "SELECT p.*, c.raison_sociale FROM projets p " +
        "LEFT JOIN clients c ON p.client_id = c.id " +
        "WHERE p.client_id = ? ORDER BY p.created_at DESC",
        [clientId]
      );
    },

    // Lister tous les projets (avec pagination)
    getAll: async function (limit, offset) {
      return await query(
        "SELECT p.*, c.code_client, c.raison_sociale " +
        "FROM projets p LEFT JOIN clients c ON p.client_id = c.id " +
        "ORDER BY p.created_at DESC LIMIT ? OFFSET ?",
        [limit || 50, offset || 0]
      );
    },

    // Mettre à jour le statut d'un projet
    updateStatut: async function (projetId, statut) {
      await query(
        "UPDATE projets SET statut = ?, updated_at = datetime('now') WHERE id = ?",
        [statut, projetId]
      );
    },

    // Mettre à jour le montant
    updateMontant: async function (projetId, montant) {
      await query(
        "UPDATE projets SET montant_ht = ?, updated_at = datetime('now') WHERE id = ?",
        [montant, projetId]
      );
    },

    // Sauvegarder les options sélectionnées pour un projet
    saveOptions: async function (projetId, optionsArray) {
      // Supprimer les anciennes options
      await query("DELETE FROM projets_options WHERE projet_id = ?", [projetId]);
      // Insérer les nouvelles
      if (optionsArray && optionsArray.length > 0) {
        var stmts = optionsArray.map(function (o) {
          return {
            sql: "INSERT INTO projets_options (projet_id, option_id, prix_ht) VALUES (?, ?, ?)",
            args: [projetId, o.option_id, o.prix_ht || 0]
          };
        });
        await batch(stmts);
      }
    },

    // Récupérer les options d'un projet
    getOptions: async function (projetId) {
      return await query(
        "SELECT po.*, o.designation, o.categorie FROM projets_options po " +
        "JOIN options o ON po.option_id = o.id WHERE po.projet_id = ?",
        [projetId]
      );
    },

    // Compter les projets
    count: async function (statut) {
      if (statut) {
        var rows = await query("SELECT COUNT(*) AS n FROM projets WHERE statut = ?", [statut]);
      } else {
        var rows = await query("SELECT COUNT(*) AS n FROM projets");
      }
      return rows[0] ? rows[0].n : 0;
    }
  };

  // ══════════════════════════════════════════════
  // OPTIONS & PRIX
  // ══════════════════════════════════════════════
  var options = {

    getAll: async function () {
      return await query("SELECT * FROM options ORDER BY categorie, designation");
    },

    getPrix: async function (optionId) {
      return await query("SELECT * FROM options_prix WHERE option_id = ? ORDER BY taille", [optionId]);
    },

    getAllWithPrix: async function () {
      return await query(
        "SELECT o.*, op.taille, op.prix_ht FROM options o " +
        "LEFT JOIN options_prix op ON o.id = op.option_id " +
        "ORDER BY o.categorie, o.designation, op.taille"
      );
    },

    // Mettre à jour un prix
    updatePrix: async function (optionId, taille, prix) {
      await query(
        "INSERT INTO options_prix (option_id, taille, prix_ht) VALUES (?, ?, ?) " +
        "ON CONFLICT(option_id, taille) DO UPDATE SET prix_ht = excluded.prix_ht",
        [optionId, taille, prix]
      );
    }
  };

  // ══════════════════════════════════════════════
  // STATS CLIENT (Phase 2 — déjà prêt)
  // ══════════════════════════════════════════════
  var stats = {

    // Stats d'un client
    getClientStats: async function (clientId) {
      var rows = await query(
        "SELECT " +
        "  COUNT(*) AS total_projets, " +
        "  SUM(CASE WHEN statut = 'en_cours' THEN 1 ELSE 0 END) AS en_cours, " +
        "  SUM(CASE WHEN statut = 'gagne' THEN 1 ELSE 0 END) AS gagnes, " +
        "  SUM(CASE WHEN statut = 'perdu' THEN 1 ELSE 0 END) AS perdus, " +
        "  SUM(CASE WHEN statut = 'gagne' THEN montant_ht ELSE 0 END) AS ca_gagne, " +
        "  SUM(montant_ht) AS ca_total, " +
        "  ROUND(100.0 * SUM(CASE WHEN statut = 'gagne' THEN 1 ELSE 0 END) / MAX(COUNT(*), 1), 1) AS taux_conversion, " +
        "  MIN(date_creation) AS premiere_demande, " +
        "  MAX(date_creation) AS derniere_demande " +
        "FROM projets WHERE client_id = ?",
        [clientId]
      );
      return rows[0] || null;
    },

    // Dashboard global
    getDashboard: async function () {
      var rows = await query(
        "SELECT " +
        "  COUNT(*) AS total_projets, " +
        "  SUM(CASE WHEN statut = 'gagne' THEN 1 ELSE 0 END) AS gagnes, " +
        "  SUM(CASE WHEN statut = 'perdu' THEN 1 ELSE 0 END) AS perdus, " +
        "  SUM(CASE WHEN statut = 'en_cours' THEN 1 ELSE 0 END) AS en_cours, " +
        "  SUM(montant_ht) AS ca_total, " +
        "  SUM(CASE WHEN statut = 'gagne' THEN montant_ht ELSE 0 END) AS ca_gagne, " +
        "  (SELECT COUNT(*) FROM clients) AS total_clients " +
        "FROM projets"
      );
      return rows[0] || null;
    },

    // Top clients par CA
    getTopClients: async function (limit) {
      return await query(
        "SELECT c.id, c.code_client, c.raison_sociale, " +
        "  COUNT(p.id) AS nb_projets, " +
        "  SUM(CASE WHEN p.statut = 'gagne' THEN 1 ELSE 0 END) AS nb_gagnes, " +
        "  SUM(CASE WHEN p.statut = 'gagne' THEN p.montant_ht ELSE 0 END) AS ca_gagne, " +
        "  ROUND(100.0 * SUM(CASE WHEN p.statut = 'gagne' THEN 1 ELSE 0 END) / MAX(COUNT(p.id), 1), 1) AS taux_conversion " +
        "FROM clients c JOIN projets p ON c.id = p.client_id " +
        "GROUP BY c.id ORDER BY ca_gagne DESC LIMIT ?",
        [limit || 10]
      );
    }
  };

  // ══════════════════════════════════════════════
  // INIT — Test de connexion
  // ══════════════════════════════════════════════
  async function init() {
    try {
      var rows = await query("SELECT 1 AS ok");
      if (rows && rows[0] && rows[0].ok === 1) {
        console.log("✅ Turso connecté — invenio.db");
        return true;
      }
    } catch (e) {
      console.error("❌ Turso connexion échouée:", e.message);
    }
    return false;
  }

  // ══════════════════════════════════════════════
  // API PUBLIQUE
  // ══════════════════════════════════════════════
  return {
    init: init,
    query: query,
    batch: batch,
    clients: clients,
    contactsFa: contactsFa,
    projets: projets,
    options: options,
    stats: stats
  };

})();
