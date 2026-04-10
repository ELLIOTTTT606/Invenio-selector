// ─── MODELS_DB ────────────────────────────────────────────────────────────────
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

// ─── CONTACTS DB — France Air ─────────────────────────────────────────────────
var CONTACTS_DB = {
  "CENTRE EST": {
    "directeur": {"nom":"Léonard AUBERGER","poste":"Directeur régional","tel":"06 73 65 23 87","email":"leonard.auberger@france-air.com"},
    "tci": [
      {"nom":"Yann LOPEZ","tel":"06 78 98 72 89","email":"yann.lopez@france-air.com","secteur":"Saint-Priest (01 69)"},
      {"nom":"Tanguy CROGUENNEC","tel":"06 80 91 10 95","email":"tanguy.croguennec@france-air.com","secteur":"Dép. 69"},
      {"nom":"Anthony ARNAUD","tel":"06 87 60 87 32","email":"anthony.arnaud@france-air.com","secteur":"Dép. 42 69"},
      {"nom":"Rudy HADJADJ","tel":"06 07 35 66 57","email":"rudy.hadjadj@france-air.com","secteur":"Dép. 07 26 42"},
      {"nom":"Rodolphe LELIEVRE","tel":"06 83 81 10 34","email":"rodolphe.lelievre@france-air.com","secteur":"Dép. 73 74"},
      {"nom":"Nathalie POUZIOUX","tel":"06 82 82 38 29","email":"nathalie.pouzioux@france-air.com","secteur":"Dép. 38"},
      {"nom":"Romain BARRAUD","tel":"06 80 91 10 81","email":"romain.barraud@france-air.com","secteur":"Dép. 15 43 63"}
    ],
    "tcs": [
      {"nom":"Azzedine YAHI","tel":"04 72 90 16 40","email":"azzedine.Yahi@france-air.com","secteur":"Lyon"},
      {"nom":"Abdelkader MESBAH","tel":"04 72 90 16 40","email":"abdelkader.mesbah@france-air.com","secteur":"Lyon"},
      {"nom":"Matthieu RIBERON","tel":"04 72 90 16 40","email":"matthieu.riberon@france-air.com","secteur":"Lyon"},
      {"nom":"Hervé CELETTE","tel":"04 72 90 16 40","email":"herve.celette@france-air.com","secteur":"Lyon"},
      {"nom":"Anthony CORBET","tel":"04 72 90 16 40","email":"anthony.corbet@france-air.com","secteur":"Grenoble"},
      {"nom":"Gildas CLERC","tel":"04 72 90 16 40","email":"gildas.clerc@france-air.com","secteur":"Grenoble"},
      {"nom":"Nicolas SOULIER","tel":"04 73 35 08 22","email":"nicolas.soulier@france-air.com","secteur":"Clermont-Ferrand"}
    ]
  },
  "EST": {
    "directeur": {"nom":"Sébastien ANDLAUER","poste":"Directeur régional","tel":"06 85 54 08 04","email":"sebastien.andlauer@france-air.com"},
    "tci": [
      {"nom":"Rachid CHROUKATE","tel":"06 87 21 52 75","email":"rachid.chroukate@france-air.com","secteur":"Dép. 67"},
      {"nom":"Florent GARCIA","tel":"06 87 60 85 10","email":"florent.garcia@france-air.com","secteur":"Dép. 67"},
      {"nom":"André TROC","tel":"06 07 78 03 19","email":"andre.troc@france-air.com","secteur":"Dép. 25 52 68 70 90"},
      {"nom":"Jonathan DETTWILLER","tel":"06 80 18 51 36","email":"jonathan.dettwiller@france-air.com","secteur":"Dép. 57 Luxembourg"},
      {"nom":"Matthieu ROBERT","tel":"06 82 82 38 37","email":"matthieu.robert@france-air.com","secteur":"Dép. 54 88"},
      {"nom":"Quentin BOUDREY","tel":"06 88 77 72 74","email":"quentin.boudrey@france-air.com","secteur":"Dép. 08 10 51 55"},
      {"nom":"Olivier GENIAUT","tel":"06 74 84 77 70","email":"olivier.geniaut@france-air.com","secteur":"Dép. 21 39 71 89"}
    ],
    "tcs": [
      {"nom":"Seyrani GUNDOGAN","tel":"04 48 40 40 40","email":"seyrani.gundogan@france-air.com","secteur":"Strasbourg"},
      {"nom":"Damien BABE","tel":"04 48 40 40 40","email":"damien.babe@france-air.com","secteur":"Strasbourg"},
      {"nom":"Quentin JUD","tel":"04 48 40 40 40","email":"quentin.jud@france-air.com","secteur":"Metz"},
      {"nom":"Alice CLEMENT","tel":"04 48 40 40 40","email":"alice.clement@france-air.com","secteur":"Reims"},
      {"nom":"Blandine BOUDAUD","tel":"04 48 40 40 40","email":"blandine.boudaud@france-air.com","secteur":"Dijon"}
    ]
  },
  "NORD": {
    "directeur": {"nom":"Anne Charlotte LOTHER","poste":"Directrice régionale","tel":"06 74 97 61 41","email":"acharlotte.lother@france-air.com"},
    "tci": [
      {"nom":"Valentin GRADECKI","tel":"06 80 91 10 80","email":"valentin.gradecki@france-air.com","secteur":"Dép. 59"},
      {"nom":"Julien BERNARD","tel":"06 74 41 93 44","email":"julien.bernard@france-air.com","secteur":"Dép. 59"},
      {"nom":"Rémi DOUAY","tel":"06 82 76 29 82","email":"remi.douay@france-air.com","secteur":"Dép. 02 59"},
      {"nom":"Alexey MATYUSHOV","tel":"06 74 97 61 41","email":"alexey.matyushov@france-air.com","secteur":"Dép. 62"},
      {"nom":"Jean-Christophe GOUT","tel":"06 74 59 06 14","email":"jchristophe.gout@france-air.com","secteur":"Dép. 76"},
      {"nom":"Valentin GUERIN","tel":"06 32 04 68 52","email":"valentin.guerin@france-air.com","secteur":"Dép. 14 27 50 61"},
      {"nom":"Mikael LENOBLE","tel":"07 86 49 28 08","email":"mikael.lenoble@france-air.com","secteur":"Dép. 02 60 80"}
    ],
    "tcs": [
      {"nom":"Larbi HAMMANE","tel":"03 20 61 37 30","email":"larbi.hammane@france-air.com","secteur":"Lille"},
      {"nom":"Laurent FOUACHE","tel":"03 20 61 37 30","email":"laurent.fouache@france-air.com","secteur":"Lille"},
      {"nom":"Rodrigue DEMASSIET","tel":"03 20 61 37 30","email":"rodrigue.demassiet@france-air.com","secteur":"Rouen"},
      {"nom":"Thibault CHERON","tel":"03 20 61 37 30","email":"thibault.cheron@france-air.com","secteur":"Rouen"},
      {"nom":"Clément DAUNAS","tel":"03 20 61 37 30","email":"clement.daunas@france-air.com","secteur":"Nord"},
      {"nom":"Bruno LANIER","tel":"03 20 61 37 30","email":"bruno.lanier@france-air.com","secteur":"Nord"}
    ]
  },
  "OUEST": {
    "directeur": {"nom":"Dominique GABORIT","poste":"Directeur régional","tel":"06 86 44 71 72","email":"dominique.gaborit@france-air.com"},
    "tci": [
      {"nom":"Geoffrey DABIN","tel":"06 83 68 07 82","email":"geoffrey.dabin@france-air.com","secteur":"Dép. 79 85"},
      {"nom":"Samuel MICHEL","tel":"06 31 09 09 73","email":"samuel.michel@france-air.com","secteur":"Dép. 44 49 72 53"},
      {"nom":"Florian MARGUET","tel":"06 85 93 77 01","email":"florian.marguet@france-air.com","secteur":"Dép. 44"},
      {"nom":"Jean-Yves LE DIASCORN","tel":"06 80 91 10 89","email":"jyves.lediasc@france-air.com","secteur":"Dép. 35 56"},
      {"nom":"Nicolas LE FLOCH MORVAN","tel":"06 45 27 72 10","email":"nicolas.lefloch-morvan@france-air.com","secteur":"Dép. 29"},
      {"nom":"Stéphane COUASNON","tel":"06 88 20 60 08","email":"stephane.couasnon@france-air.com","secteur":"Dép. 22 35"},
      {"nom":"Nicolas JAULIN","tel":"06 82 95 25 97","email":"nicolas.jaulin@france-air.com","secteur":"Dép. 36 37 86"}
    ],
    "tcs": [
      {"nom":"Antoine MAUFFRAIS","tel":"02 51 77 84 10","email":"antoine.mauffrais@france-air.com","secteur":"Nantes"},
      {"nom":"Jordan RENARD","tel":"02 51 77 84 10","email":"jordan.renard@france-air.com","secteur":"Nantes"},
      {"nom":"Benoit ORHANT","tel":"02 51 77 84 10","email":"benoit.orhant@france-air.com","secteur":"Rennes"},
      {"nom":"Pierig ROULETTE","tel":"02 51 77 84 10","email":"pierig.roulette@france-air.com","secteur":"Rennes"},
      {"nom":"Joyce GUIGUI","tel":"04 73 35 08 22","email":"joyce.guigui@france-air.com","secteur":"Tours"}
    ]
  },
  "PARIS EST": {
    "directeur": {"nom":"Jan Erik CARDON","poste":"Directeur régional","tel":"06 73 18 08 43","email":"janerik.cardon@france-air.com"},
    "tci": [
      {"nom":"Christophe CHABANAIS","tel":"06 89 08 87 15","email":"christophe.chabanais@france-air.com","secteur":"Dép. 95"},
      {"nom":"Thomas KRAJEWSKI","tel":"06 73 19 47 53","email":"thomas.krajewski@france-air.com","secteur":"93 Sud"},
      {"nom":"Patrick FERT","tel":"07 48 10 32 01","email":"patrick.fert@france-air.com","secteur":"93 Nord / 95 Sud"},
      {"nom":"Frédéric GILLOT","tel":"06 74 90 57 04","email":"frederic.gillot@france-air.com","secteur":"94 Ouest"},
      {"nom":"Marc MENDES","tel":"06 77 27 80 85","email":"marc.mendes@france-air.com","secteur":"Dép. 77"},
      {"nom":"Mounia HIRECHE","tel":"06 77 34 26 97","email":"mounia.hireche@france-air.com","secteur":"94 Est"}
    ],
    "tcs": [
      {"nom":"Imad BENYAMNA","tel":"01 60 49 00 33","email":"imad.benyamna@france-air.com","secteur":"La Courneuve"},
      {"nom":"Maria CHEMALY","tel":"01 60 49 00 33","email":"maria.chemaly@france-air.com","secteur":"La Courneuve"},
      {"nom":"Leonardo BELLANOVA","tel":"01 60 49 00 33","email":"leonardo.bellanova@france-air.com","secteur":"La Courneuve"},
      {"nom":"Sylvain PLOMTEUX","tel":"01 69 34 85 00","email":"sylvain.plomteux@france-air.com","secteur":"Noisy"},
      {"nom":"Julien LABORDE","tel":"01 69 34 85 00","email":"julien.laborde@france-air.com","secteur":"Noisy"},
      {"nom":"Lucie DORGET","tel":"01 69 34 85 00","email":"lucie.dorget@france-air.com","secteur":"Noisy"}
    ]
  },
  "PARIS OUEST": {
    "directeur": {"nom":"Jean Baptiste RAGUET","poste":"Directeur régional","tel":"06 07 22 01 42","email":"jbaptiste.raguet@france-air.com"},
    "tci": [
      {"nom":"Aurélien DUBOIS","tel":"06 73 78 44 83","email":"aurelien.dubois@france-air.com","secteur":"91 Est"},
      {"nom":"Nicolas JONCKHEERE","tel":"06 22 70 92 68","email":"nicolas.jonckheere@france-air.com","secteur":"91 Ouest"},
      {"nom":"Christophe COUILLARD","tel":"06 77 87 78 73","email":"christophe.couillard@france-air.com","secteur":"Dép. 78"},
      {"nom":"Manuel CORDEIRO","tel":"06 74 84 77 77","email":"manuel.cordeiro@france-air.com","secteur":"92 Nord"},
      {"nom":"Marin BOISSAN","tel":"06 45 86 02 41","email":"marin.boissan@france-air.com","secteur":"92 Sud"},
      {"nom":"Loïc ESLIER","tel":"06 27 84 51 64","email":"loic.eslier@france-air.com","secteur":"Dép. 28 41 45"}
    ],
    "tcs": [
      {"nom":"Zineb BERNARD","tel":"01 69 34 85 00","email":"zineb.bernard@france-air.com","secteur":"Chilly"},
      {"nom":"Louis BERMEJO","tel":"01 69 34 85 00","email":"louis.bermejo@france-air.com","secteur":"Chilly"},
      {"nom":"Quentin BEDON","tel":"01 69 34 85 00","email":"quentin.bedon@france-air.com","secteur":"Chilly"},
      {"nom":"Aziz MAKLOUF","tel":"01 60 49 00 33","email":"aziz.maklouf@france-air.com","secteur":"Colombes"},
      {"nom":"Jérôme ROBERT","tel":"01 60 49 00 33","email":"jerome.robert@france-air.com","secteur":"Colombes"},
      {"nom":"Anderson LALANNE","tel":"01 69 34 85 00","email":"anderson.lalanne@france-air.com","secteur":"Colombes"}
    ]
  },
  "SUD EST": {
    "directeur": {"nom":"Christophe DIKBEYEKIAN","poste":"Directeur régional","tel":"06 80 91 10 91","email":"christophe.dikbeyekian@france-air.com"},
    "tci": [
      {"nom":"Jérôme HALINGRE","tel":"07 86 15 26 30","email":"jerome.halingre@france-air.com","secteur":"Dép. 13 83 84"},
      {"nom":"Bruno TAGLIARINO","tel":"06 79 27 16 06","email":"bruno.tagliarino@france-air.com","secteur":"Dép. 04 05 13"},
      {"nom":"Julien COLLESI","tel":"06 80 91 10 86","email":"Julien.collesi@france-air.com","secteur":"Dép. 06 83 Monaco"},
      {"nom":"Frédéric MARTIN","tel":"06 87 60 87 27","email":"frederic.martin@france-air.com","secteur":"Dép. 06 20 83"},
      {"nom":"Adrien BELTRAN","tel":"07 86 26 18 99","email":"adrien.beltran@france-air.com","secteur":"Dép. 34 66"},
      {"nom":"Olivier VIALA","tel":"06 08 76 46 93","email":"olivier.viala@france-air.com","secteur":"Dép. 11 30 34 48"}
    ],
    "tcs": [
      {"nom":"Nadine VEYRET","tel":"04 42 03 30 32","email":"nadine.veyret@france-air.com","secteur":"Aubagne"},
      {"nom":"Laurent SIDOLLE","tel":"04 42 03 30 32","email":"laurent.sidolle@france-air.com","secteur":"Aubagne"},
      {"nom":"Sylvain PONCET","tel":"04 42 03 30 32","email":"sylvain.poncet@france-air.com","secteur":"Nice"},
      {"nom":"Khalid AIT OMARAT","tel":"04 42 03 30 32","email":"khalid.ait-omarat@france-air.com","secteur":"Nice"},
      {"nom":"Sabine TASTEMAIN","tel":"04 42 03 30 32","email":"sabine.tastemain@france-air.com","secteur":"Montpellier"},
      {"nom":"Manon DELORT","tel":"04 42 03 30 32","email":"manon.delort@france-air.com","secteur":"Montpellier"}
    ]
  },
  "SUD OUEST": {
    "directeur": {"nom":"Emeline BABOLA","poste":"Directrice régionale","tel":"06 86 54 99 61","email":"emeline.babola@france-air.com"},
    "tci": [
      {"nom":"Jean-Luc GAURON","tel":"06 80 91 10 88","email":"jluc.gauron@france-air.com","secteur":"Dép. 31 Nord 32 46 82"},
      {"nom":"Jimmy RAMIER","tel":"06 75 23 62 59","email":"jimmy.ramier@france-air.com","secteur":"Dép. 09 12 31 Sud 81"},
      {"nom":"Olivier SANCHEZ","tel":"06 88 20 60 20","email":"olivier.sanchez@france-air.com","secteur":"Dép. 40 64 65"},
      {"nom":"Alain BALEYRAT","tel":"06 88 05 97 46","email":"alain.baleyrat@france-air.com","secteur":"Dép. 16 17 33 Nord"},
      {"nom":"José MONTERO","tel":"06 85 41 13 00","email":"jose.montero@france-air.com","secteur":"33 Ouest"},
      {"nom":"Bastien LAMONTAGNE","tel":"06 83 81 07 30","email":"bastien.lamontagne@france-air.com","secteur":"Dép. 19 24 87"},
      {"nom":"Quentin GOURIOU","tel":"07 48 15 26 14","email":"quentin.gouriou@france-air.com","secteur":"Dép. 33 Est 47"}
    ],
    "tcs": [
      {"nom":"Olivier MAURY","tel":"05 61 43 68 38","email":"olivier.maury@france-air.com","secteur":"Toulouse"},
      {"nom":"Yohann WOZNIAK","tel":"05 61 43 68 38","email":"yohann.wozniak@france-air.com","secteur":"Toulouse"},
      {"nom":"Quentin CABURET","tel":"05 61 43 68 38","email":"bayonne@france-air.com","secteur":"Bayonne"},
      {"nom":"Bruno BOUQUET","tel":"05 61 43 68 38","email":"bordeaux@france-air.com","secteur":"Bordeaux"},
      {"nom":"Quentin BERNOS","tel":"05 61 43 68 38","email":"bordeaux@france-air.com","secteur":"Bordeaux"},
      {"nom":"Hassane HAIMOUD","tel":"05 61 43 68 38","email":"bordeaux@france-air.com","secteur":"Bordeaux"}
    ]
  }
};

// ─── FRANCE MAP SVG — paths réels des régions France Air ─────────────────────
// Viewbox 0 0 600 680 — coordonnées approximatives des frontières réelles
var FRANCE_MAP_PATHS = {
  "NORD": {
    d: "M 230 10 L 320 10 L 355 30 L 370 55 L 350 80 L 330 95 L 295 100 L 270 90 L 245 75 L 225 55 L 210 35 Z",
    label: "NORD", lx: 290, ly: 55
  },
  "EST": {
    d: "M 330 95 L 355 30 L 370 55 L 410 50 L 440 75 L 450 120 L 440 155 L 415 175 L 385 180 L 355 165 L 330 140 L 310 120 L 295 100 Z",
    label: "EST", lx: 385, ly: 120
  },
  "PARIS EST": {
    d: "M 270 90 L 295 100 L 310 120 L 305 145 L 280 155 L 255 148 L 240 130 L 245 105 Z",
    label: "PARIS EST", lx: 278, ly: 125
  },
  "PARIS OUEST": {
    d: "M 210 95 L 245 75 L 245 105 L 240 130 L 220 140 L 195 130 L 185 110 Z",
    label: "PARIS OUEST", lx: 218, ly: 110
  },
  "OUEST": {
    d: "M 55 90 L 130 75 L 160 80 L 185 110 L 195 130 L 190 175 L 175 220 L 145 265 L 100 285 L 55 270 L 30 225 L 25 165 L 40 115 Z",
    label: "OUEST", lx: 115, ly: 185
  },
  "CENTRE EST": {
    d: "M 220 140 L 255 148 L 280 155 L 305 145 L 330 140 L 355 165 L 360 210 L 345 255 L 310 275 L 270 285 L 235 275 L 205 255 L 190 220 L 195 175 L 210 155 Z",
    label: "CENTRE EST", lx: 278, ly: 215
  },
  "SUD OUEST": {
    d: "M 55 270 L 100 285 L 145 265 L 175 280 L 190 310 L 185 350 L 165 390 L 130 415 L 85 420 L 45 395 L 25 350 L 30 290 Z",
    label: "SUD OUEST", lx: 115, ly: 345
  },
  "SUD EST": {
    d: "M 175 280 L 205 255 L 235 275 L 270 285 L 310 275 L 345 255 L 375 265 L 400 305 L 405 355 L 385 400 L 350 430 L 290 445 L 230 435 L 185 410 L 165 375 L 165 390 L 185 350 L 190 310 Z",
    label: "SUD EST", lx: 292, ly: 360
  }
};

// ─── STATE ────────────────────────────────────────────────────────────────────
var state = {
  machineType: null, file: null, fileType: null, parsedData: null,
  selectedModel: null, selectedSize: null, selectedClient: null,
  region: '', contact: null, versionAcoustique: 'standard',
  selectedOptions: {}, step: 0, dimensionImage: null,
  remiseOptions: 0
};

// ─── PARSING NOM DE FICHIER ───────────────────────────────────────────────────
function parseFilename(filename) {
  var name = filename.replace(/\.[^.]+$/, '').toUpperCase().replace(/[-_ ]/g, '');
  var result = { gamme: null, size: null, type: null };

  // Détection type : priorité sur HS/CS avant H/C seul
  if (/HS/.test(name)) result.type = 'HS';
  else if (/CS/.test(name)) result.type = 'CS';
  else if (/H/.test(name)) result.type = 'HS';
  else if (/C/.test(name)) result.type = 'CS';

  // Détection gamme (ordre longueur décroissante)
  var allGammes = [];
  ['HS','CS'].forEach(function(t) {
    (MODELS_DB[t] || []).forEach(function(m) {
      if (allGammes.indexOf(m.gamme) === -1) allGammes.push(m.gamme);
    });
  });
  allGammes.sort(function(a, b) { return b.length - a.length; });

  for (var i = 0; i < allGammes.length; i++) {
    if (name.startsWith(allGammes[i])) { result.gamme = allGammes[i]; break; }
  }

  // Détection taille
  if (result.gamme) {
    var rest = name.slice(result.gamme.length).replace(/H[S]?|C[S]?$/gi, '');
    var allSizes = [];
    ['HS','CS'].forEach(function(t) {
      (MODELS_DB[t] || []).forEach(function(m) {
        if (m.gamme === result.gamme) m.sizes.forEach(function(s) { if (allSizes.indexOf(s) === -1) allSizes.push(s); });
      });
    });
    allSizes.sort(function(a, b) { return b.length - a.length; });
    for (var j = 0; j < allSizes.length; j++) {
      if (rest === allSizes[j] || rest.startsWith(allSizes[j])) { result.size = allSizes[j]; break; }
    }
  }
  return result;
}

// ─── FILE HANDLING ────────────────────────────────────────────────────────────
function handleCSD(f) {
  if (!f) return;
  var isDocx = f.name.match(/\.docx?$/i);
  var isPdf  = f.name.match(/\.pdf$/i);
  if (!isDocx && !isPdf) { showMsg('error', 'Format non supporté (.docx ou .pdf)'); return; }
  state.file = f;
  state.fileType = isPdf ? 'pdf' : 'docx';

  document.getElementById('dropCSD').classList.add('has-file');
  document.getElementById('uz-title').textContent = f.name;
  document.getElementById('uz-sub').textContent = (f.size / 1024).toFixed(0) + ' Ko — ' + (isPdf ? 'PDF' : 'DOCX');

  var det = parseFilename(f.name);
  document.getElementById('detWrap').style.display = 'flex';
  document.getElementById('detGamme').textContent = det.gamme || 'Gamme non détectée';
  document.getElementById('detSize').textContent = det.size ? 'Taille ' + det.size : 'Taille non détectée';
  document.getElementById('detType').textContent = det.type === 'HS' ? 'Pompe à chaleur' : det.type === 'CS' ? "Groupe d'eau glacée" : 'Type non détecté';

  // Auto-remplir les selectors
  if (det.type) {
    selectType(det.type);
    if (det.gamme) {
      var selModel = document.getElementById('selModel');
      selModel.value = det.gamme;
      state.selectedModel = det.gamme;
      onModelChange(det.size);
    }
  }
  hideMsg(); checkReady();
}

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
    opt.value = m.gamme; opt.textContent = m.nom;
    if (!m.sizes.length) { opt.disabled = true; opt.textContent += ' (bientôt disponible)'; }
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
    var o = document.createElement('option'); o.value = s; o.textContent = s; selS.appendChild(o);
  });
  selS.disabled = false;
  if (preSize && model && model.sizes.indexOf(preSize) !== -1) { selS.value = preSize; state.selectedSize = preSize; }
  selS.onchange = function() { state.selectedSize = selS.value || null; checkReady(); };
  checkReady();
}

// ─── CLIENTS ──────────────────────────────────────────────────────────────────
async function searchClient(q) {
  var box = document.getElementById('clientResults');
  if (!q || q.length < 2) { box.classList.remove('open'); return; }
  var results;
  if (typeof TursoSync !== 'undefined' && TursoSync.isConnected()) {
    results = await TursoSync.searchClients(q);
  } else {
    var ql = q.toLowerCase();
    var q2 = ql.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
    results = CLIENTS.filter(function(c) {
      var n = (c[1]||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      return c[0].toLowerCase().includes(ql) || n.includes(q2) || (c[2]||'').startsWith(q);
    }).slice(0, 50);
  }
  if (!results.length) { box.innerHTML = '<div style="padding:10px;font-size:12px;color:rgba(255,255,255,.3)">Aucun résultat</div>'; box.classList.add('open'); return; }
  box.innerHTML = results.map(function(c) {
    var _cp = (c[2]||'').replace(/'/g,"\\'");
    var _atc = (c[3]||'').replace(/'/g,"\\'");
    return '<div class="client-result" onclick="pickClient(\'' + c[0].replace(/'/g,"\\'") + '\',\'' + c[1].replace(/'/g,"\\'") + '\',\'' + _cp + '\',\'' + _atc + '\')"><span>' + c[1] + '</span><span class="code">' + c[0] + (c[2] ? ' <span style=\"opacity:.5;font-size:10px\">' + c[2] + '</span>' : '') + '</span></div>';
  }).join('');
  box.classList.add('open');
}

function pickClient(code, nom, cp, atc) {
  state.selectedClient = { code: code, nom: nom, cp: cp||'', atc: atc||'' };
  document.getElementById('clientResults').classList.remove('open');
  document.getElementById('clientSearch').value = '';
  if (document.getElementById('clientManual')) document.getElementById('clientManual').value = '';
  document.getElementById('clientSelectedText').textContent = nom + ' — ' + code;
  document.getElementById('clientSelected').classList.add('visible');
  if (cp && typeof renderDeptInterlocuteurs === 'function') {
    renderDeptInterlocuteurs(cp, atc||'');
  }
  checkReady();
}

function clearClient() {
  state.selectedClient = null;
  document.getElementById('clientSelected').classList.remove('visible');
  document.getElementById('clientSearch').value = '';
  if (document.getElementById('clientManual')) document.getElementById('clientManual').value = '';
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
  var s = document.getElementById('clientSearch');
  if (s && CLIENTS.length) s.placeholder = 'Rechercher parmi ' + CLIENTS.length.toLocaleString('fr-FR') + ' clients…';
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
      showMsg('error', "Le parsing PDF n'est pas encore disponible. Exportez en .docx depuis le configurateur Galletti.");
      document.getElementById('loader').style.display = 'none'; checkReady(); return;
    }
    var _savedModel = state.selectedModel;
    var _savedSize  = state.selectedSize;
    var data = await parseDocx(state.file);
    if (data._hasHeating && state.machineType === 'CS') {
      showMsg('warning', 'Fichier PAC — type corrigé.'); state.machineType = 'HS'; selectType('HS');
    } else if (!data._hasHeating && state.machineType === 'HS') {
      showMsg('warning', "Fichier GEG — type corrigé."); state.machineType = 'CS'; selectType('CS');
    }
    state.selectedModel = _savedModel; state.selectedSize = _savedSize;
    data.type = state.machineType; data.size = state.selectedSize;
    state.parsedData = data;
    if (!state.selectedModel) state.selectedModel = (data.gamme || '').split(' ')[0];
    if (!state.selectedSize)  state.selectedSize  = data.size || '';
    state.dimensionImage = data.dimensionImage;

    var missing = [];
    if (!data.modele) missing.push('modèle');
    if (!data.resultsFroid.puissanceFrigo && !data.resultsChaud) missing.push('puissances');
    if (!data.commonData.lwStandard) missing.push('données acoustiques');
    if (!data.date) missing.push('date');
    if (missing.length) {
      showMsg('warning', 'Données incomplètes : ' + missing.join(', '));
      setTimeout(function() { offerCSDHelp(data, missing); }, 500);
    } else {
      showMsg('success', data.modele + ' — ' + (data.type === 'HS' ? 'PAC' : 'GEG') + ' — Taille ' + data.size);
    }
    // Sync projet
    var n0 = document.getElementById('inputNumProjet'), n1 = document.getElementById('inputNumProjet2');
    if (n0 && n1 && n0.value && !n1.value) n1.value = n0.value;
    var m0 = document.getElementById('inputNomProjet'), m1 = document.getElementById('inputNomProjet2');
    if (m0 && m1 && m0.value && !m1.value) m1.value = m0.value;

    setTimeout(function() { goToStep(1); }, 800);
  } catch(e) { showMsg('error', 'Erreur : ' + e.message); console.error(e); }
  finally { document.getElementById('loader').style.display = 'none'; checkReady(); }
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
function goToStep(n) {
  if (n >= 1 && !state.parsedData) return;
  state.step = n;
  ['step0','step1','step2','step3'].forEach(function(id, i) {
    var el = document.getElementById(id); if (el) el.classList.toggle('visible', i === n);
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
function buildFranceMap(active) {
  var svg = document.getElementById('france-map');
  if (!svg) return;
  var html = '';
  Object.keys(FRANCE_MAP_PATHS).forEach(function(nom) {
    var r = FRANCE_MAP_PATHS[nom];
    var isA = nom === active;
    html += '<path d="' + r.d + '" fill="' + (isA ? '#2f4a6f' : 'rgba(47,74,111,0.18)') + '" stroke="' + (isA ? '#5b84b1' : 'rgba(47,74,111,0.45)') + '" stroke-width="1.5" style="cursor:pointer;transition:all .25s" onclick="selectRegionMap(\'' + nom + '\')" />';
    html += '<text x="' + r.lx + '" y="' + (r.ly + 4) + '" text-anchor="middle" font-size="11" fill="' + (isA ? '#fff' : 'rgba(180,200,230,0.7)') + '" style="pointer-events:none;font-family:IBM Plex Sans,sans-serif;font-weight:' + (isA ? '600' : '400') + '">' + r.label + '</text>';
  });
  // Corse
  html += '<path d="M 430 415 L 445 405 L 455 415 L 460 435 L 450 455 L 435 460 L 425 445 L 425 428 Z" fill="' + (active === 'SUD EST' ? '#2f4a6f' : 'rgba(47,74,111,0.18)') + '" stroke="rgba(47,74,111,0.45)" stroke-width="1.5" style="cursor:pointer" onclick="selectRegionMap(\'SUD EST\')" />';
  svg.innerHTML = html;
}

function buildRegionList(active) {
  var list = document.getElementById('regionList');
  if (!list) return;
  list.innerHTML = Object.keys(CONTACTS_DB).map(function(nom) {
    var isA = nom === active;
    return '<div class="region-item' + (isA ? ' active' : '') + '" onclick="selectRegionMap(\'' + nom + '\')">' +
      '<div class="region-dot"></div>' + nom + '</div>';
  }).join('');
}

function selectRegionMap(nom) {
  state.region = nom;
  var sr = document.getElementById('selRegion');
  if (sr) { sr.value = nom; }
  buildFranceMap(nom);
  buildRegionList(nom);
  renderContactSection(nom);
}

// ─── SECTION INTERLOCUTEURS ───────────────────────────────────────────────────
function renderContactSection(region) {
  var wrap = document.getElementById('contactSection');
  if (!wrap) return;
  var db = CONTACTS_DB[region];
  if (!db) { wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';

  var html = '<div class="contact-section-title">Interlocuteurs — ' + region + '</div>';

  // Directeur
  if (db.directeur) {
    html += '<div class="contact-block">';
    html += '<div class="contact-role-label">Directeur régional</div>';
    html += buildContactCard(db.directeur, 'dir');
    html += '</div>';
  }

  // TCI
  if (db.tci && db.tci.length) {
    html += '<div class="contact-block">';
    html += '<div class="contact-role-label">TCI — Commerciaux itinérants</div>';
    html += '<div class="contact-grid">';
    // Montrer les 2 premiers, avec "voir plus" si besoin
    var tciDisplay = db.tci.slice(0, 4);
    tciDisplay.forEach(function(c) { html += buildContactCard(c, 'tci'); });
    html += '</div></div>';
  }

  // TCS
  if (db.tcs && db.tcs.length) {
    html += '<div class="contact-block">';
    html += '<div class="contact-role-label">TCS — Commerciaux sédentaires</div>';
    html += '<div class="contact-grid">';
    db.tcs.slice(0, 4).forEach(function(c) { html += buildContactCard(c, 'tcs'); });
    html += '</div></div>';
  }

  // Créateur de fiche (menu déroulant)
  html += '<div class="contact-block">';
  html += '<div class="contact-role-label">Créateur de la fiche</div>';
  html += '<select id="selCreateur" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.06);color:#fff;font-family:inherit;font-size:14px;outline:none;">';
  html += '<option value="">Sélectionner</option>';
  var allContacts = [];
  if (db.directeur) allContacts.push(db.directeur);
  (db.tci || []).forEach(function(c) { allContacts.push(c); });
  (db.tcs || []).forEach(function(c) { allContacts.push(c); });
  allContacts.forEach(function(c) {
    html += '<option value="' + c.nom + '">' + c.nom + (c.poste ? ' — ' + c.poste : '') + '</option>';
  });
  html += '</select>';
  html += '</div>';

  wrap.innerHTML = html;
}

function buildContactCard(c, type) {
  var initials = c.nom.split(' ').filter(function(w) { return w === w.toUpperCase() && w.length > 1; }).slice(0,2).map(function(w) { return w[0]; }).join('') || c.nom.substring(0,2).toUpperCase();
  return '<div class="contact-card-item">' +
    '<div class="avatar ' + type + '">' + initials + '</div>' +
    '<div class="contact-card-info">' +
    '<div class="contact-card-name">' + c.nom + '</div>' +
    (c.secteur ? '<div class="contact-card-secteur">' + c.secteur + '</div>' : '') +
    '<div class="contact-card-detail">' + (c.email || '') + '</div>' +
    '<div class="contact-card-detail">' + (c.tel || '') + '</div>' +
    '</div></div>';
}

// ─── CONFIG (STEP 1) ──────────────────────────────────────────────────────────
function buildConfig() {
  var d = state.parsedData, isHS = d.type === 'HS';
  var gamme = state.selectedModel || (d.gamme || 'PLP').split(' ')[0];
  var sz = state.selectedSize || d.size || '';
  document.getElementById('cfgTitle').textContent = gamme + ' ' + sz;
  document.getElementById('cfgSub').textContent = (isHS ? 'Pompe à chaleur' : "Groupe d'eau glacée") + ' — Taille ' + sz;

  // Région dropdown
  var sr = document.getElementById('selRegion');
  sr.innerHTML = '<option value="">Sélectionner</option>';
  Object.keys(CONFIG.contacts || CONTACTS_DB).forEach(function(r) {
    sr.innerHTML += '<option value="' + r + '">' + r + '</option>';
  });
  if (state.region) { sr.value = state.region; onRegionChange(); }

  // Sync projet
  var n0 = document.getElementById('inputNumProjet'), n1 = document.getElementById('inputNumProjet2');
  if (n0 && n1 && n0.value && !n1.value) n1.value = n0.value;
  var m0 = document.getElementById('inputNomProjet'), m1 = document.getElementById('inputNomProjet2');
  if (m0 && m1 && m0.value && !m1.value) m1.value = m0.value;

  var remEl = document.getElementById('inputRemise');
  if (remEl) remEl.value = state.remiseOptions || 0;

  buildFranceMap(state.region || null);
  buildRegionList(state.region || null);
  if (state.region) renderContactSection(state.region);

  buildAcoustic();
  buildOptions();
}

function onRegionChange() {
  state.region = document.getElementById('selRegion').value;
  var sc = document.getElementById('selContact');
  if (sc) {
    sc.innerHTML = '<option value="">Sélectionner</option>';
    sc.disabled = !state.region;
    (CONFIG.contacts[state.region] || []).forEach(function(c) {
      sc.innerHTML += '<option value="' + c.nom + '">' + c.nom + ' — ' + c.poste + '</option>';
    });
  }
  state.contact = null;
  buildFranceMap(state.region || null);
  buildRegionList(state.region || null);
  if (state.region) renderContactSection(state.region);
}

function onContactChange() {
  var n = document.getElementById('selContact') ? document.getElementById('selContact').value : '';
  state.contact = (CONFIG.contacts[state.region] || []).find(function(c) { return c.nom === n; }) || null;
}

function buildAcoustic() {
  var cd = state.parsedData.commonData;
  var vs = [
    { key: 'standard', label: 'Standard', desc: 'Aucune isolation', lw: cd.lwStandard, lp: cd.lpStandard },
    { key: 'silencieuse', label: 'Silencieuse', desc: 'Capot compresseur', lw: cd.lwSilencieuse, lp: cd.lpSilencieuse },
    { key: 'ultra', label: 'Ultra Silencieuse', desc: 'Capot + ventil. BV', lw: cd.lwUltra, lp: cd.lpUltra }
  ];
  var g = document.getElementById('acousticGrid'); g.innerHTML = '';
  vs.forEach(function(v) {
    var c = document.createElement('div');
    c.className = 'acoustic-card' + (state.versionAcoustique === v.key ? ' selected' : '');
    c.onclick = function() { state.versionAcoustique = v.key; buildAcoustic(); };
    c.innerHTML = '<h4>' + v.label + '</h4><div class="desc">' + v.desc + '</div><div class="vals"><span class="lw">Lw ' + (v.lw||'—') + ' dB(A)</span><span class="lp">Lp ' + (v.lp||'—') + ' dB(A)</span></div>';
    g.appendChild(c);
  });
}

function getPrice(o, sz) {
  if (!sz || o.prix[sz] === undefined) return 0;
  var p = o.prix[sz];
  if (p === '?') return 'Sur demande';
  var v = parseInt(p) || 0;
  if (v === 0) { var allZero = CONFIG.sizes.every(function(s) { return (parseInt(o.prix[s])||0)===0; }); if (allZero) return 0; return 'N.D'; }
  return v;
}
function fmt(n) { return n === 'Sur demande' ? n : n.toLocaleString('fr-FR'); }
function fmtPrix(n) { if (typeof n !== 'number' || isNaN(n)) return '—'; return n.toLocaleString('fr-FR', {minimumFractionDigits:2,maximumFractionDigits:2}); }

function buildOptions() {
  var d = state.parsedData, sz = state.selectedSize || d.size;
  var remEl = document.getElementById('inputRemise');
  if (remEl) state.remiseOptions = parseFloat(remEl.value) || 0;
  var app = CONFIG.options.filter(function(o) { return o.type.includes(d.type); });
  var cats = [...new Set(app.map(function(o) { return o.cat; }))];
  var c = document.getElementById('optionsContainer'); c.innerHTML = '';
  cats.forEach(function(cat) {
    var items = app.filter(function(o) { return o.cat === cat; });
    var title = document.createElement('div'); title.className = 'cat-title'; title.textContent = cat; c.appendChild(title);
    var g = document.createElement('div'); g.className = 'opt-grid';
    items.forEach(function(opt) {
      var p = getPrice(opt, sz);
      var it = document.createElement('div');
      it.className = 'opt-item' + (state.selectedOptions[opt.id] ? ' checked' : '');
      var remise = state.remiseOptions || 0;
      var pStr = p === 'Sur demande' ? 'Sur demande' : p === 'N.D' ? 'Non dispo.' : p === 0 ? 'Inclus' :
        (remise > 0 ? Math.round(p*(1-remise/100)).toLocaleString('fr-FR') + ' €' : fmt(p) + ' €');
      var desc = OPTION_DESCRIPTIONS[opt.id] || '';
      it.innerHTML = '<div class="opt-row" style="display:flex;align-items:center;gap:12px;">' +
        '<div class="opt-chk">' + (state.selectedOptions[opt.id] ? '✓' : '') + '</div>' +
        '<span class="opt-name">' + opt.nom + (opt.note ? ' <em style="font-size:11px;opacity:.5">(' + opt.note + ')</em>' : '') + '</span>' +
        '<span class="opt-price">' + pStr + '</span></div>' +
        (desc ? '<div class="opt-desc" style="display:none;padding:6px 12px;font-size:11px;color:rgba(255,255,255,.4)">' + desc + '</div>' : '');
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
  sel.forEach(function(o) { var p = getPrice(o, sz); if (p==='Sur demande') sd=true; else if(p==='N.D') nd=true; else t+=p; n++; });
  var el = document.getElementById('optTotal');
  if (el) el.textContent = n ? n + ' option' + (n>1?'s':'') + ' • ' + fmt(t) + ' € HT' + (sd?' + sur demande':'') + (nd?' (N.D)':'') : '';
}

function buildAcouWrap(lw_std,lw_ins,lw_ultra,lp_std,lp_ins,lp_ultra,versionKey,type) {
  var vals = type==='lw' ? [lw_std,lw_ins,lw_ultra] : [lp_std,lp_ins,lp_ultra];
  var labels = ['Std','Inso','S-Inso'], keys = ['standard','silencieuse','ultra'];
  var h = '<div class="plp-acou-wrap">';
  labels.forEach(function(lbl,i) { h += '<div class="plp-acou-col ' + (keys[i]===versionKey?'active':'inactive') + '"><span class="plp-acou-lbl">'+lbl+'</span><span class="plp-acou-val">'+(vals[i]||'—')+'</span></div>'; });
  return h + '</div>';
}

function buildPumpWrap(d) {
  var hasLP=state.selectedOptions['lp_pump'],hasHP=state.selectedOptions['hp_pump'],hasLPD=state.selectedOptions['lp_double_pump'],hasLPI=state.selectedOptions['lp_inverter'];
  var hasPump=hasLP||hasHP||hasLPD||hasLPI;
  var pdc=(d.resultsFroid&&d.resultsFroid.perteCharge)?d.resultsFroid.perteCharge:'—';
  return '<div class="plp-pump-wrap">' +
    '<div class="plp-pump-card '+(hasPump?'plp-pump-off':'plp-pump-on')+'"><span class="plp-pump-icon">'+(hasPump?'✕':'●')+'</span><span class="plp-pump-lbl">Sans</span></div>' +
    '<div class="plp-pump-card '+(hasLP||hasLPD||hasLPI?'plp-pump-on':'plp-pump-off')+'"><span class="plp-pump-icon">●</span><span class="plp-pump-lbl">BP</span><span class="plp-pump-data">'+pdc+' kPa</span></div>' +
    '<div class="plp-pump-card '+(hasHP?'plp-pump-on':'plp-pump-off')+'"><span class="plp-pump-icon">●</span><span class="plp-pump-lbl">HP</span></div></div>';
}

// ─── PREVIEW (STEP 2) — identique à app.js précédent ─────────────────────────
function buildPreview() {
  if (!document.getElementById('__plp_preview_css__')) {
    var styleEl = document.createElement('style');
    styleEl.id = '__plp_preview_css__';
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:ital,wght@0,400;0,600;1,400&display=swap');
      #sheetContent { background:#e8e8e8; padding:20px; }
      #sheetContent .plp-pg { width:210mm; min-height:297mm; padding:20mm; background:#fff!important; position:relative; margin:0 auto 20px; box-shadow:0 2px 12px rgba(0,0,0,0.15); }
      #sheetContent .cover-v2 { width:210mm; height:297mm; position:relative; overflow:hidden; display:flex; flex-direction:column; background:#F2F2EF!important; margin:0 auto 20px; box-shadow:0 2px 12px rgba(0,0,0,0.15); }
      #sheetContent .plp-hdr { height:36px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid #CCC; margin-bottom:16px; padding-bottom:6px; flex-shrink:0; }
      #sheetContent .plp-hdr-proj { font-family:'Barlow',sans-serif; font-size:8px; color:#666; }
      #sheetContent .plp-hdr-ref { font-family:'Barlow',sans-serif; font-weight:600; font-size:8px; color:#333; }
      #sheetContent .plp-ftr { height:24px; border-top:1px solid #CCC; display:flex; align-items:center; justify-content:space-between; font-family:'Barlow',sans-serif; font-size:7.5px; color:#666; text-transform:uppercase; letter-spacing:.1em; margin-top:auto; padding-top:5px; flex-shrink:0; }
      #sheetContent .plp-band { background:#2f4a6f!important; padding:12px 24px; margin-bottom:18px; flex-shrink:0; }
      #sheetContent .plp-band-t { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:18px; text-transform:uppercase; color:#fff; letter-spacing:.05em; }
      #sheetContent .plp-band-s { font-family:'Barlow',sans-serif; font-size:9px; color:rgba(255,255,255,.8); margin-top:2px; }
      #sheetContent .plp-som { display:flex; width:210mm; height:297mm; background:#F2F2EF!important; position:relative; overflow:hidden; }
      #sheetContent .plp-som-l { width:22%; display:flex; align-items:flex-start; padding:8mm 0 0 0; overflow:visible!important; }
      #sheetContent .plp-som-txt { writing-mode:vertical-rl; transform:rotate(180deg); font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:230px; text-transform:uppercase; color:#2f4a6f; line-height:.82; letter-spacing:-4px; padding-bottom:10mm; }
      #sheetContent .plp-som-r { width:78%; display:flex; flex-direction:column; justify-content:flex-end; padding:0 14mm 30mm 0; gap:6mm; }
      #sheetContent .plp-som-item { display:flex; align-items:baseline; justify-content:flex-end; }
      #sheetContent .plp-som-lbl { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:14px; text-transform:uppercase; letter-spacing:.06em; color:#2f4a6f; text-align:right; flex:1; }
      #sheetContent .plp-som-num { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:90px; line-height:1; color:#2f4a6f; margin-left:6mm; min-width:115px; text-align:right; }
      #sheetContent .plp-tb { width:100%; border-collapse:collapse; font-size:9px; }
      #sheetContent .plp-tb th, #sheetContent .plp-tb td { padding:6px 10px; vertical-align:middle; }
      #sheetContent .plp-tb thead th { background:#2f4a6f!important; color:#fff; font-family:'Barlow Condensed',sans-serif; font-weight:700; text-align:center; padding:10px 12px; font-size:10px; border:none; }
      #sheetContent .plp-tb thead th+th { border-left:1px solid rgba(255,255,255,.2); }
      #sheetContent .plp-tb thead th.plp-lc { text-align:left; font-size:8px; text-transform:uppercase; }
      #sheetContent .plp-tb .plp-lc { width:32%; text-align:left; font-family:'Barlow',sans-serif; font-size:9px; color:#333; background:#F2F2EF!important; border-right:2px solid #2f4a6f; }
      #sheetContent .plp-tb tbody td { text-align:center; border-bottom:1px solid #CCC; font-family:'Barlow Condensed',sans-serif; font-weight:600; font-size:10px; color:#111; background:#F2F2EF!important; }
      #sheetContent .plp-tb .plp-gr td { background:#fff!important; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:12px; text-transform:uppercase; color:#2f4a6f; padding:8px 12px; text-align:left; border-top:2px solid #2f4a6f; }
      #sheetContent .plp-acou-wrap { display:flex; gap:4px; justify-content:center; }
      #sheetContent .plp-acou-col { flex:1; text-align:center; padding:4px 3px; border-radius:2px; font-family:'Barlow Condensed',sans-serif; font-size:9px; }
      #sheetContent .plp-acou-col.active { background:#2f4a6f!important; color:#fff; font-weight:700; }
      #sheetContent .plp-acou-col.inactive { background:#e8e8e8!important; color:#aaa; }
      #sheetContent .plp-acou-lbl { font-size:6.5px; text-transform:uppercase; margin-bottom:2px; display:block; }
      #sheetContent .plp-acou-val { font-size:10px; font-weight:700; display:block; }
      #sheetContent .plp-pump-wrap { display:flex; gap:4px; justify-content:center; }
      #sheetContent .plp-pump-card { flex:1; text-align:center; padding:6px 4px; border-radius:3px; font-family:'Barlow Condensed',sans-serif; max-width:80px; }
      #sheetContent .plp-pump-on { background:#2f4a6f!important; color:#fff; }
      #sheetContent .plp-pump-off { background:#e8e8e8!important; color:#aaa; }
      #sheetContent .plp-pump-icon { font-size:8px; display:block; margin-bottom:1px; }
      #sheetContent .plp-pump-lbl { font-weight:700; font-size:10px; display:block; }
      #sheetContent .plp-pump-data { font-size:7.5px; display:block; margin-top:2px; opacity:.85; }
      #sheetContent .plp-presc { padding:0 8px; }
      #sheetContent .plp-pb { margin-bottom:20px; }
      #sheetContent .plp-pb-t { font-family:'Barlow',sans-serif; font-weight:600; font-size:9.5px; text-transform:uppercase; color:#111; margin-bottom:6px; padding-bottom:5px; border-bottom:1px solid #2f4a6f; }
      #sheetContent .plp-pb-x { font-family:'Barlow',sans-serif; font-size:9.5px; line-height:1.65; color:#333; }
      #sheetContent .plp-cat { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; text-transform:uppercase; color:#2f4a6f; background:#F2F2EF!important; padding:8px 12px; border-left:4px solid #2f4a6f; margin:20px 0 8px; }
      #sheetContent .plp-opt { display:flex; align-items:flex-start; padding:10px 12px; border-bottom:1px solid #e0e0e0; }
      #sheetContent .plp-opt.plp-sel { background:#D6E8F2!important; border-left:3px solid #2f4a6f; }
      #sheetContent .plp-opt.plp-unsel { opacity:.6; }
      #sheetContent .plp-opt-name { font-family:'Barlow',sans-serif; font-weight:600; font-size:9.5px; text-transform:uppercase; }
      #sheetContent .plp-opt-desc { font-family:'Barlow',sans-serif; font-size:9px; color:#555; line-height:1.5; margin-top:3px; }
      #sheetContent .plp-opt-ht { font-family:'Barlow',sans-serif; font-weight:600; font-size:9.5px; }
      #sheetContent .plp-chkbox { width:16px; height:16px; border:1.5px solid #2f4a6f; display:flex; align-items:center; justify-content:center; font-size:11px; color:#fff; }
      #sheetContent .plp-chkbox.checked { background:#2f4a6f!important; }
      #sheetContent .plp-recap { border:2px solid #2f4a6f; padding:16px 24px; margin-top:24px; }
      #sheetContent .plp-recap-t { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; text-transform:uppercase; color:#2f4a6f; margin-bottom:12px; }
      #sheetContent .plp-recap-tb { width:100%; border-collapse:collapse; font-size:9px; }
      #sheetContent .plp-recap-tb th { background:#2f4a6f!important; color:#fff; font-size:8px; padding:5px 8px; font-family:'Barlow Condensed',sans-serif; }
      #sheetContent .plp-recap-tb td { padding:5px 8px; border-bottom:.5px solid #e0e0e0; font-family:'Barlow',sans-serif; }
      #sheetContent .plp-recap-total td { background:#2f4a6f!important; color:#fff; font-weight:600; }
      #sheetContent .plp-iz { border:1px dashed #bbb; background:#f9f9f9!important; display:flex; align-items:center; justify-content:center; text-align:center; padding:20px; font-size:9px; color:#999; min-height:200mm; }
      #sheetContent .plp-unit { font-family:'Barlow',sans-serif; font-weight:400; font-size:8px; color:#666; margin-left:3px; }
      #sheetContent .plp-thr { display:block; font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:12px; }
      #sheetContent .plp-thc { display:block; font-family:'Barlow',sans-serif; font-weight:400; font-size:8px; opacity:.75; margin-top:2px; }
      #sheetContent .plp-li { padding-left:16px; position:relative; margin-bottom:2px; }
      #sheetContent .plp-li::before { content:"–"; position:absolute; left:0; color:#666; }
    `;
    document.head.appendChild(styleEl);
  }

  var d = state.parsedData, isHS = d.type === 'HS', sz = state.selectedSize || d.size;
  var numP = (document.getElementById('inputNumProjet2') && document.getElementById('inputNumProjet2').value) || (document.getElementById('inputNumProjet') && document.getElementById('inputNumProjet').value) || '';
  var nomP = (document.getElementById('inputNomProjet2') && document.getElementById('inputNomProjet2').value) || (document.getElementById('inputNomProjet') && document.getElementById('inputNomProjet').value) || '';
  var cl = state.selectedClient;
  var cd = d.commonData || {}, rf = d.resultsFroid || {}, rc = d.resultsChaud || {};
  var nomProjet = nomP || 'Projet';
  var refProjet = numP || '—';
  var gamme = state.selectedModel || (d.gamme || 'PLP').split(' ')[0];
  var modele = d.modele || (gamme + sz + (isHS ? 'HS' : 'CS'));

  function plpHdr() {
    return '<div class="plp-hdr"><div style="font-family:Barlow Condensed,sans-serif;font-weight:800;font-size:13px;color:#2f4a6f">FRANCE AIR <span style="opacity:.4">×</span> Invenio</div>' +
      '<div class="plp-hdr-r"><div class="plp-hdr-proj">' + nomProjet + '</div><div class="plp-hdr-ref">' + refProjet + '</div></div></div>';
  }
  function plpFtr(label, num) { return '<div class="plp-ftr"><span>' + label.toUpperCase() + '</span><span>Page ' + num + '</span></div>'; }
  function plpBand(num, titre, sous) { return '<div class="plp-band"><div class="plp-band-t">' + num + ' — ' + titre + '</div>' + (sous ? '<div class="plp-band-s">' + sous + '</div>' : '') + '</div>'; }

  var h = '';
  var coverSousTitre = isHS ? "Fiche de sélection d'une pompe à chaleur" : "Fiche de sélection d'un groupe d'eau glacée";
  var sousTitre = isHS ? 'PAC réversible air-eau' : "Groupe d'eau glacée air-eau";

  // PAGE 1 — COVER
  h += '<div class="cover-v2">';
  h += '<img id="coverImg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0" src="" alt="Cover"/>';
  h += '<svg style="position:absolute;inset:0;width:100%;height:100%;z-index:2;overflow:visible" viewBox="0 0 794 1123" xmlns="http://www.w3.org/2000/svg">';
  h += '<text x="397" y="290" font-family="Anton,Arial Black,Arial,sans-serif" font-size="58" fill="#2f4a6f" text-anchor="middle">' + nomProjet + '</text>';
  h += '<text x="397" y="340" font-family="Anton,Arial Black,Arial,sans-serif" font-size="22" fill="#2f4a6f" text-anchor="middle">' + coverSousTitre + '</text>';
  h += '</svg></div>';

  // PAGE 2 — SOMMAIRE
  h += '<div class="plp-pg" style="padding:0;background:#F2F2EF!important">';
  h += '<div class="plp-som"><div class="plp-som-l" style="overflow:visible!important"><div class="plp-som-txt" style="padding-bottom:10mm">SOMMAIRE</div></div><div class="plp-som-r">';
  ['TABLEAU COMPARATIF','PRESCRIPTION TECHNIQUE','OPTIONS ET ACCESSOIRES','PLANS DIMENSIONNELS','VISUELS PRODUIT'].forEach(function(lbl, i) {
    h += '<div class="plp-som-item"><span class="plp-som-lbl" style="line-height:1">' + lbl + '</span><span class="plp-som-num" style="line-height:1">0' + (i+1) + '.</span></div>';
  });
  h += '</div></div></div>';

  // PAGE 3 — TABLEAU
  h += '<div class="plp-pg">' + plpHdr() + plpBand('01','Tableau comparatif',gamme + ' — ' + sousTitre);
  h += '<table class="plp-tb"><thead><tr><th class="plp-lc">PARAMETRE</th><th><span class="plp-thr">' + modele + '</span><span class="plp-thc">' + (isHS ? 'PAC réversible' : "Groupe d'eau glacée") + '</span></th></tr></thead><tbody>';
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
  if (cd.lwStandard) rows.push(['Niveau sonore Lw', buildAcouWrap(cd.lwStandard,cd.lwSilencieuse,cd.lwUltra,cd.lpStandard,cd.lpSilencieuse,cd.lpUltra,state.versionAcoustique,'lw')]);
  if (cd.lpStandard) rows.push(['Niveau sonore Lp', buildAcouWrap(cd.lwStandard,cd.lwSilencieuse,cd.lwUltra,cd.lpStandard,cd.lpSilencieuse,cd.lpUltra,state.versionAcoustique,'lp')]);
  rows.push(['Pompe', buildPumpWrap(d)]);
  rows.forEach(function(r) { h += '<tr><td class="plp-lc">' + r[0] + '</td><td>' + r[1] + '</td></tr>'; });
  h += '</tbody></table>' + plpFtr('Tableau comparatif', 3) + '</div>';

  // PAGE 4 — PRESCRIPTION
  h += '<div class="plp-pg">' + plpHdr() + plpBand('02','Prescription technique',modele);
  h += '<div class="plp-presc">';
  if (d.prescription && d.prescription.length) {
    d.prescription.forEach(function(p) { h += '<div class="plp-pb"><div class="plp-pb-t">' + (p.titre||'') + '</div><div class="plp-pb-x">' + (p.contenu||'').replace(/\n/g,'<br/>') + '</div></div>'; });
  } else {
    h += '<div class="plp-pb"><div class="plp-pb-t">Caractéristiques générales</div><div class="plp-pb-x">Données de prescription non disponibles dans le fichier CSD.</div></div>';
  }
  h += '</div>' + plpFtr('Prescription technique', 4) + '</div>';

  // PAGE 5 — OPTIONS
  h += '<div class="plp-pg">' + plpHdr() + plpBand('03','Options et accessoires',modele);
  var remise = state.remiseOptions || 0;
  var selOpts = CONFIG.options.filter(function(o) { return state.selectedOptions[o.id] && o.type.includes(d.type); });
  var cats2 = [...new Set(CONFIG.options.filter(function(o) { return o.type.includes(d.type); }).map(function(o) { return o.cat; }))];
  cats2.forEach(function(cat) {
    h += '<div class="plp-cat">' + cat + '</div>';
    CONFIG.options.filter(function(o) { return o.cat===cat && o.type.includes(d.type); }).forEach(function(opt) {
      var p = getPrice(opt, sz), isSel = state.selectedOptions[opt.id];
      var pNet = (typeof p==='number' && p>0 && remise>0) ? Math.round(p*(1-remise/100)) : p;
      var pStr = pNet==='Sur demande'?'Sur demande':pNet==='N.D'?'N.D.':pNet===0?'Inclus':fmtPrix(pNet)+' € HT';
      h += '<div class="plp-opt '+(isSel?'plp-sel':'plp-unsel')+'">' +
        '<div style="flex:55%;min-width:0"><div class="plp-opt-name">'+opt.nom+'</div>' +
        (OPTION_DESCRIPTIONS[opt.id]?'<div class="plp-opt-desc">'+OPTION_DESCRIPTIONS[opt.id].replace(/<[^>]+>/g,' ').substring(0,150)+'</div>':'') +
        '</div><div style="width:25%;text-align:right;padding-left:12px"><div class="plp-opt-ht">'+pStr+'</div>' +
        (remise>0&&typeof p==='number'&&p>0?'<div style="font-size:8px;color:#999;text-decoration:line-through">'+fmtPrix(p)+' €</div>':'') +
        '</div><div style="width:20%;display:flex;flex-direction:column;align-items:center;padding-left:8px"><div class="plp-chkbox '+(isSel?'checked':'')+'">'+(isSel?'✓':'')+'</div></div></div>';
    });
  });
  if (selOpts.length) {
    var totalNet = 0;
    selOpts.forEach(function(o) { var p=getPrice(o,sz); if(typeof p==='number') totalNet+=remise>0?Math.round(p*(1-remise/100)):p; });
    h += '<div class="plp-recap"><div class="plp-recap-t">Récapitulatif</div>' +
      '<table class="plp-recap-tb"><thead><tr><th>Option</th><th style="text-align:right">Prix HT</th></tr></thead><tbody>';
    selOpts.forEach(function(o) {
      var p=getPrice(o,sz),pN=(typeof p==='number'&&p>0&&remise>0)?Math.round(p*(1-remise/100)):p;
      h+='<tr><td>'+o.nom+'</td><td style="text-align:right">'+(typeof pN==='number'&&pN>0?fmtPrix(pN)+' €':pN)+'</td></tr>';
    });
    h+='<tr class="plp-recap-total"><td>Total options</td><td style="text-align:right">'+fmtPrix(totalNet)+' € HT</td></tr>';
    h+='</tbody></table></div>';
  }
  h += plpFtr('Options et accessoires', 5) + '</div>';

  // PAGE 6 — PLANS
  h += '<div class="plp-pg">' + plpHdr() + plpBand('04','Plans dimensionnels',modele);
  var dimImg = state.dimensionImage || (document.getElementById('asset_dimension') && document.getElementById('asset_dimension').src);
  h += (dimImg&&dimImg.length>100) ? '<div style="text-align:center;padding:16px 0"><img src="'+dimImg+'" style="max-width:100%;max-height:200mm;object-fit:contain"/></div>' : '<div class="plp-iz">[ Plans dimensionnels — '+modele+' ]</div>';
  h += plpFtr('Plans dimensionnels', 6) + '</div>';

  // PAGE 7 — VISUELS
  h += '<div class="plp-pg">' + plpHdr() + plpBand('05','Visuels produit',modele+' — Configuration retenue');
  var assetM = document.getElementById('asset_machine');
  h += (assetM&&assetM.src&&assetM.src.length>100) ? '<div style="text-align:center;padding:16px 0"><img src="'+assetM.src+'" style="max-width:80%;max-height:160mm;object-fit:contain"/></div>' : '<div class="plp-iz">[ Visuel produit — '+modele+' ]</div>';
  h += '<div style="font-family:Barlow,sans-serif;font-style:italic;font-size:8px;color:#666;text-align:center;margin-top:8px">'+modele+' — '+(isHS?'PAC réversible':"Groupe d'eau glacée")+' — Configuration retenue</div>';
  h += plpFtr('Visuels produit', 7) + '</div>';

  document.getElementById('sheetContent').innerHTML = h;

  // Cover image
  var _g = state.selectedModel || gamme;
  var _sz = state.selectedSize || (state.parsedData && state.parsedData.size) || '';
  function _setCover(src) { var img = document.getElementById('coverImg'); if (img && typeof src === 'string') img.src = src; }
  if (typeof COVERS !== 'undefined') {
    _setCover((COVERS[_g] && COVERS[_g][_sz]) ? COVERS[_g][_sz] : '');
  } else {
    var s = document.createElement('script'); s.src = 'js/covers.js';
    s.onload = function() { _setCover((COVERS&&COVERS[_g]&&COVERS[_g][_sz])?COVERS[_g][_sz]:''); };
    s.onerror = function() { _setCover(''); };
    document.head.appendChild(s);
  }
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function buildAdmin() {
  var h = '<div class="admin-intro">Gérez les données de l\'application.</div>';
  h += '<div class="card"><div class="card-label">Mise à jour des prix</div>';
  h += '<div class="admin-import" onclick="document.getElementById(\'filePrices\').click()"><h4>Importer un fichier Excel de prix</h4><p>Remplace les prix actuels pour la session en cours</p></div>';
  h += '<input type="file" id="filePrices" accept=".xlsx,.xls" style="display:none" onchange="loadPricesExcel(this.files[0])"></div>';
  h += '<div class="card"><div class="card-label">Contacts par région</div>';
  Object.keys(CONTACTS_DB).forEach(function(r) {
    var db = CONTACTS_DB[r];
    h += '<div class="admin-region">' + r + '</div>';
    h += '<table class="admin-tbl"><thead><tr><th>Nom</th><th>Rôle</th><th>Secteur</th><th>Email</th><th>Tél</th></tr></thead><tbody>';
    if (db.directeur) h += '<tr><td><strong>' + db.directeur.nom + '</strong></td><td>' + db.directeur.poste + '</td><td>—</td><td>' + db.directeur.email + '</td><td>' + db.directeur.tel + '</td></tr>';
    (db.tci||[]).slice(0,3).forEach(function(c) { h += '<tr><td>' + c.nom + '</td><td>TCI</td><td>' + c.secteur + '</td><td>' + c.email + '</td><td>' + c.tel + '</td></tr>'; });
    (db.tcs||[]).slice(0,3).forEach(function(c) { h += '<tr><td>' + c.nom + '</td><td>TCS</td><td>' + c.secteur + '</td><td>' + c.email + '</td><td>' + c.tel + '</td></tr>'; });
    h += '</tbody></table>';
  });
  h += '</div>';
  document.getElementById('adminContent').innerHTML = h;
}

// ─── MODALS / MESSAGES ────────────────────────────────────────────────────────
function openModal(content) { document.getElementById('modalContent').innerHTML = content; document.getElementById('modalOverlay').style.display = 'flex'; }
function closeModal() { document.getElementById('modalOverlay').style.display = 'none'; }
document.getElementById('modalOverlay').addEventListener('click', function(e) { if (e.target === this) closeModal(); });

function openPriceUpdate() {
  openModal('<div class="card-label" style="margin-bottom:12px">Actualiser les prix</div>' +
    '<div class="admin-import" onclick="document.getElementById(\'filePricesM\').click()" style="margin-bottom:12px"><h4>Importer Excel de prix</h4><p>08-PLP_2025-C-H.xlsx</p></div>' +
    '<input type="file" id="filePricesM" accept=".xlsx,.xls" style="display:none" onchange="loadPricesExcel(this.files[0]);closeModal()">' +
    '<button class="btn" onclick="closeModal()">Annuler</button>');
}
function openClientUpdate() {
  openModal('<div class="card-label" style="margin-bottom:12px">Actualiser la base clients</div>' +
    '<div class="admin-import" onclick="document.getElementById(\'fileClientsM\').click()" style="margin-bottom:12px"><h4>Importer Excel clients</h4><p>Colonnes : Code client, Nom client</p></div>' +
    '<input type="file" id="fileClientsM" accept=".xlsx,.xls" style="display:none" onchange="loadClientsExcel(this.files[0]);closeModal()">' +
    '<button class="btn" onclick="closeModal()">Annuler</button>');
}

function showMsg(type, msg) { hideMsg(); var el = document.getElementById('msg'); el.className = 'msg ' + type + ' visible'; el.textContent = msg; }
function hideMsg() { var el = document.getElementById('msg'); el.className = 'msg'; }

function offerCSDHelp(data, missing) { console.log('Données manquantes :', missing); }

async function loadClientsExcel(f) {
  if (!f) return; showMsg('success', '⏳ Chargement des clients...');
  try {
    var data = await f.arrayBuffer(), wb = XLSX.read(data, {type:'array'});
    var ws = wb.Sheets[wb.SheetNames[0]];
    var rows = XLSX.utils.sheet_to_json(ws, {header:1});
    var start = (rows.length>0&&typeof rows[0][0]==='string'&&rows[0][0].toLowerCase().includes('code')) ? 1 : 0;
    CLIENTS = [];
    for (var i = start; i < rows.length; i++) {
      var r = rows[i];
      if (r && r[0] && r[1]) {
        var _atc = r[3] ? String(r[3]).trim() : '';
        var _validAtc = _atc && _atc !== 'SIEGE' && !_atc.startsWith('Rep ') && _atc.length > 3 ? _atc : '';
        CLIENTS.push([String(r[0]).trim(), String(r[1]).trim(), String(r[2]||'').trim(), _validAtc]);
      }
    }
    if (typeof TursoSync!=='undefined'&&TursoSync.isConnected()) DB.clients.bulkImport(CLIENTS);
    updateClientCount(); showMsg('success', '✅ ' + CLIENTS.length.toLocaleString('fr-FR') + ' clients importés'); setTimeout(hideMsg, 2500);
  } catch(e) { showMsg('error', 'Erreur : ' + e.message); }
}

async function loadPricesExcel(f) {
  if (!f) return; showMsg('success', '⏳ Lecture...');
  try {
    var data = await f.arrayBuffer(), wb = XLSX.read(data, {type:'array'});
    var cSheet = wb.Sheets['C-version']||wb.Sheets[wb.SheetNames[0]];
    var hSheet = wb.Sheets['H-version']||wb.Sheets[wb.SheetNames[1]];
    var updated = 0;
    [cSheet,hSheet].forEach(function(ws) {
      if (!ws) return;
      XLSX.utils.sheet_to_json(ws,{header:1}).forEach(function(row) {
        if (!row[1]) return;
        var des = String(row[1]).trim().toLowerCase();
        CONFIG.options.forEach(function(opt) {
          if (des.includes(opt.nom.toLowerCase())||opt.nom.toLowerCase().includes(des)) {
            var np={},si={3:'037',4:'045',5:'052',6:'057',7:'062'};
            for (var ci in si) { var v=row[parseInt(ci)]; if(v!==undefined&&v!==null&&v!==''){np[si[ci]]=typeof v==='number'?v:parseInt(String(v).replace(/[^\d]/g,''))||0;} }
            if (Object.keys(np).length) { Object.assign(opt.prix,np); updated++; }
          }
        });
      });
    });
    showMsg('success', '✅ ' + updated + ' prix mis à jour.');
    if (typeof TursoSync!=='undefined'&&TursoSync.isConnected()) TursoSync.savePrices().then(function(){showMsg('success','✅ Sauvegardé dans Turso.');});
    if (state.step===1&&state.parsedData) buildOptions();
    if (state.step===3) buildAdmin();
  } catch(e) { showMsg('error', 'Erreur : ' + e.message); }
}

function isFirstMondayOfMonth() { var t=new Date(); return t.getDay()===1&&t.getDate()<=7; }
function checkMonthlyReminder() {
  var key='plp_reminder_dismissed',now=new Date(),mk=now.getFullYear()+'-'+(now.getMonth()+1);
  try { if(localStorage.getItem(key)===mk) return; } catch(e) {}
  if (isFirstMondayOfMonth()) { var m=document.getElementById('updateReminder'); if(m) m.style.display='flex'; }
}
function dismissReminder() {
  var m=document.getElementById('updateReminder'); if(m) m.style.display='none';
  try { var n=new Date(); localStorage.setItem('plp_reminder_dismissed',n.getFullYear()+'-'+(n.getMonth()+1)); } catch(e) {}
}

// ─── INIT ─────────────────────────────────────────────────────────────────────
updateClientCount();
checkMonthlyReminder();
buildFranceMap(null);
buildRegionList(null);

if (typeof TursoSync !== 'undefined') {
  TursoSync.init().then(function(ok) { if(ok) { updateClientCount(); console.log('App synchronisée avec Turso'); } });
}

// ══════════════════════════════════════════════════════════════════════════════
// CARTE DÉPARTEMENT + INTERLOCUTEURS TCI/TCS
// ══════════════════════════════════════════════════════════════════════════════
function getDeptFromCP(cp) {
  if (!cp) return '';
  var s = String(cp).trim().padStart(5,'0');
  if (s.startsWith('200')||s.startsWith('201')||s.startsWith('202')) return '2A';
  if (s.startsWith('203')||s.startsWith('204')||s.startsWith('205')) return '2B';
  return s.slice(0,2);
}

function matchATCPair(atcName, pairs) {
  if (!atcName || !pairs || !pairs.length) return 0;
  var q = atcName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[-\s]/g,'');
  for (var i=0; i<pairs.length; i++) {
    if (pairs[i].tci && pairs[i].tci.nom) {
      var cn = pairs[i].tci.nom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[-\s]/g,'');
      var lastName = cn.split(' ').pop() || '';
      if (cn===q || cn.includes(q) || q.includes(lastName)) return i;
    }
  }
  return 0;
}

function renderDeptMap(dept) {
  var wrap = document.getElementById('deptMapWrap');
  if (!wrap || typeof DEPT_PATHS === 'undefined') return;
  var svg = '<svg viewBox="0 0 500 560" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block">';
  Object.keys(DEPT_PATHS).forEach(function(d) {
    var active = d === dept;
    (DEPT_PATHS[d]||[]).forEach(function(p) {
      svg += '<path d="'+p+'" fill="'+(active?'#2f4a6f':'rgba(47,74,111,.13)')+'" stroke="'+(active?'#5b84b1':'rgba(47,74,111,.32)')+'" stroke-width="'+(active?2:.6)+'"/>';
    });
  });
  svg += '</svg>';
  wrap.innerHTML = svg;
}

function buildContactCard2(c, role, color) {
  if (!c) return '<div style="padding:10px;border-radius:8px;background:rgba(255,255,255,.04);border:0.5px solid rgba(255,255,255,.08);font-size:11px;color:rgba(255,255,255,.25);font-style:italic">'+role+' non défini</div>';
  var parts = c.nom.split(/[\s\-]+/).filter(function(w){return w.length>1;});
  var ini = parts.map(function(w){return w[0];}).join('').slice(0,2).toUpperCase() || c.nom.slice(0,2).toUpperCase();
  return '<div style="padding:10px;border-radius:8px;background:rgba(255,255,255,.06);border:0.5px solid rgba(255,255,255,.12)">'
    +'<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">'
    +'<div style="width:30px;height:30px;border-radius:50%;background:'+color+';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#fff;flex-shrink:0">'+ini+'</div>'
    +'<div style="min-width:0"><div style="font-size:12px;font-weight:500;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+c.nom+'</div>'
    +'<div style="font-size:10px;color:rgba(255,255,255,.45)">'+role+'</div></div>'
    +'</div>'
    +(c.email?'<div style="font-size:10px;color:#5b84b1;margin-bottom:2px;word-break:break-all">'+c.email+'</div>':'')
    +(c.tel?'<div style="font-size:10px;color:rgba(255,255,255,.45)">'+c.tel+'</div>':'')
    +'<div style="display:flex;gap:6px;margin-top:8px">'
    +(c.email?'<a href="mailto:'+c.email+'" style="padding:3px 8px;font-size:10px;border-radius:4px;border:0.5px solid rgba(91,132,177,.5);color:#5b84b1;text-decoration:none;background:rgba(91,132,177,.1)">Email</a>':'')
    +(c.tel?'<a href="tel:'+c.tel.replace(/\s/g,'')+'" style="padding:3px 8px;font-size:10px;border-radius:4px;border:0.5px solid rgba(255,255,255,.15);color:rgba(255,255,255,.5);text-decoration:none;background:rgba(255,255,255,.05)">Appeler</a>':'')
    +'</div></div>';
}

function renderDeptInterlocuteurs(cp, atcName) {
  var card = document.getElementById('cardDeptInterlocuteurs');
  var wrap = document.getElementById('deptInterlocuteursWrap');
  if (!card || !wrap) return;
  var dept = getDeptFromCP(cp);
  if (!dept || typeof DEPT_CONTACTS === 'undefined') { card.style.display='none'; return; }
  card.style.display = '';
  var badge = document.getElementById('deptBadge');
  if (badge) badge.textContent = 'Dép. '+dept;
  renderDeptMap(dept);
  var pairs = DEPT_CONTACTS[dept] || [];
  if (!pairs.length) {
    wrap.innerHTML = '<div style="font-size:11px;color:rgba(255,255,255,.3);font-style:italic">Aucun interlocuteur pour le dép. '+dept+'</div>';
    return;
  }
  var midx = matchATCPair(atcName, pairs);
  var pair = pairs[midx] || pairs[0];
  var h = '';
  if (pairs.length > 1) h += '<div style="font-size:10px;color:rgba(255,255,255,.35);margin-bottom:8px;font-style:italic">'+pairs.length+' paires sur ce département — correspondance ATC auto</div>';
  h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';
  h += buildContactCard2(pair.tci, 'TCI — Itinérant', '#2f4a6f');
  h += buildContactCard2(pair.tcs, 'TCS — Sédentaire', '#0F6E56');
  h += '</div>';
  h += '<div style="margin-top:8px;text-align:right"><span onclick="editDeptInterlocuteurs()" style="font-size:10px;color:rgba(255,255,255,.3);cursor:pointer;text-decoration:underline">Modifier</span></div>';
  wrap.innerHTML = h;
  state.interlocuteurs = { tci: pair.tci, tcs: pair.tcs, region: pair.region, dept: dept };
}

function editDeptInterlocuteurs() {
  var wrap = document.getElementById('deptInterlocuteursWrap');
  if (!wrap) return;
  var cur = state.interlocuteurs || {};
  var tciNom = (cur.tci && cur.tci.nom) || '';
  var tcsNom = (cur.tcs && cur.tcs.nom) || '';
  wrap.innerHTML = '<div style="display:flex;flex-direction:column;gap:8px">'
    +'<div><div style="font-size:10px;color:rgba(255,255,255,.4);margin-bottom:3px">TCI (itinérant)</div>'
    +'<input id="ovTCI" type="text" value="'+tciNom+'" style="width:100%;padding:6px 10px;border-radius:6px;border:0.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-size:12px;font-family:inherit"/></div>'
    +'<div><div style="font-size:10px;color:rgba(255,255,255,.4);margin-bottom:3px">TCS (sédentaire)</div>'
    +'<input id="ovTCS" type="text" value="'+tcsNom+'" style="width:100%;padding:6px 10px;border-radius:6px;border:0.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;font-size:12px;font-family:inherit"/></div>'
    +'<div style="display:flex;gap:8px;justify-content:flex-end">'
    +'<button onclick="cancelDeptEdit()" style="padding:5px 12px;border-radius:5px;border:0.5px solid rgba(255,255,255,.15);background:none;color:rgba(255,255,255,.4);font-size:11px;cursor:pointer;font-family:inherit">Annuler</button>'
    +'<button onclick="applyDeptEdit()" style="padding:5px 12px;border-radius:5px;border:none;background:#2f4a6f;color:#fff;font-size:11px;cursor:pointer;font-family:inherit">Appliquer</button>'
    +'</div></div>';
}

function applyDeptEdit() {
  var tci = (document.getElementById('ovTCI')||{}).value||'';
  var tcs = (document.getElementById('ovTCS')||{}).value||'';
  if (!state.interlocuteurs) state.interlocuteurs = {};
  if (tci) state.interlocuteurs.tci = Object.assign({}, state.interlocuteurs.tci||{}, {nom:tci});
  if (tcs) state.interlocuteurs.tcs = Object.assign({}, state.interlocuteurs.tcs||{}, {nom:tcs});
  var cl = state.selectedClient || {};
  renderDeptInterlocuteurs(cl.cp||'', cl.atc||'');
}

function cancelDeptEdit() {
  var cl = state.selectedClient || {};
  renderDeptInterlocuteurs(cl.cp||'', cl.atc||'');
}

// Chargement automatique
(function loadDeptFiles() {
  function loadScript(src, cb) {
    var s = document.createElement('script'); s.src = src;
    if (cb) s.onload = cb;
    s.onerror = function() { console.warn('Impossible de charger ' + src); };
    document.head.appendChild(s);
  }
  if (typeof DEPT_PATHS === 'undefined') loadScript('js/dept_paths.js');
  if (typeof DEPT_CONTACTS === 'undefined') loadScript('js/dept_contacts.js');
  if (typeof CLIENTS_RAW !== 'undefined') {
    var lines = CLIENTS_RAW.split('\n'); CLIENTS = [];
    lines.forEach(function(l) { var p=l.split('|'); if(p.length>=2&&p[0]&&p[1]) CLIENTS.push([p[0],p[1],p[2]||'',p[3]||'']); });
    if (typeof updateClientCount==='function') updateClientCount();
    console.log('\u2705 '+CLIENTS.length.toLocaleString('fr-FR')+' clients');
  } else {
    loadScript('js/clients_cp.js', function() {
      if (typeof CLIENTS_RAW==='undefined') return;
      var lines = CLIENTS_RAW.split('\n'); CLIENTS = [];
      lines.forEach(function(l) { var p=l.split('|'); if(p.length>=2&&p[0]&&p[1]) CLIENTS.push([p[0],p[1],p[2]||'',p[3]||'']); });
      if (typeof updateClientCount==='function') updateClientCount();
      console.log('\u2705 '+CLIENTS.length.toLocaleString('fr-FR')+' clients chargés');
    });
  }
})();

(async function() {
  if (typeof TursoSync !== 'undefined') await TursoSync.init();
  if (typeof ProjetSave !== 'undefined') await ProjetSave.loadFromURL();
})();
