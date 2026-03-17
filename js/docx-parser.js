// ══════════════════════════════════════════════
// DOCX PARSER (fixed namespace-aware)
// ══════════════════════════════════════════════
async function parseDocx(file) {
  const buf = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(buf);
  const af2 = zip.file("word/afchunk2.docx");
  if (!af2) throw new Error("Structure CSD non reconnue : afchunk2.docx introuvable.");
  const af2zip = await JSZip.loadAsync(await af2.async("arraybuffer"));
  const af2xml = await af2zip.file("word/document.xml").async("text");
  let af3xml = "";
  const af3 = zip.file("word/afchunk3.docx");
  if (af3) { const af3zip = await JSZip.loadAsync(await af3.async("arraybuffer")); af3xml = await af3zip.file("word/document.xml").async("text"); }
  let dimImage = null;
  const af4 = zip.file("word/afchunk4.docx");
  if (af4) { try { const af4zip = await JSZip.loadAsync(await af4.async("arraybuffer")); const img = af4zip.file("media/image2.jpg"); if(img) dimImage = "data:image/jpeg;base64," + await img.async("base64"); } catch(e){} }
  const data = parseXml(af2xml, af3xml);
  data.dimensionImage = dimImage;
  return data;
}

function extractRows(xml) {
  const rows = [];
  const trRe = /<w:tr\b[^>]*>([\s\S]*?)<\/w:tr>/g;
  let trM;
  while ((trM = trRe.exec(xml)) !== null) {
    const cells = [];
    const tcRe = /<w:tc\b[^>]*>([\s\S]*?)<\/w:tc>/g;
    let tcM;
    while ((tcM = tcRe.exec(trM[1])) !== null) {
      const texts = [];
      const tRe = /<w:t[^>]*>([^<]*)<\/w:t>/g;
      let tM;
      while ((tM = tRe.exec(tcM[1])) !== null) { const v = tM[1].trim(); if(v) texts.push(v); }
      cells.push(texts.join(" ").trim());
    }
    rows.push(cells);
  }
  return rows;
}

function parseXml(techXml, prestXml) {
  const rows = extractRows(techXml);
  const d = { modele:"",date:"",gamme:"",size:null,_hasHeating:false,type:"",refroidissement:{},chauffage:null,resultsFroid:{},resultsChaud:null,commonData:{},prestations:[],refrigerant:"",gwp:"",poids:"",alimentation:"",dimensionImage:null };
  for (const row of rows) { for (const cell of row) { const m=cell.match(/PLP\d{3}[A-Z]+\d*[A-Z]*/); if(m&&!d.modele)d.modele=m[0]; } if(row[0]==="Date:"&&row[1])d.date=row[1]; }
  for (const row of rows) { if(row.length===1&&row[0].match(/^PLP\s*(CS|HS)/)){d.gamme=row[0];break;} if(row[1]&&row[1].match(/^PLP\s*(CS|HS)/)){d.gamme=row[1];break;} }
  d._hasHeating = /Chauffage/.test(techXml) && /Puissance de chauffage/.test(techXml);
  d.size = d.modele ? (d.modele.match(/\d{3}/)||[])[0] : null;
  let sec = "";
  let inI = false, inR = false;
  for (const row of rows) {
    const c0=(row[0]||"").trim(), c1=(row[1]||"").trim(), c2=(row[2]||"").trim();
    const val = row.length >= 3 ? c2 : c1;
    if(c0.includes("Données entrées")){inI=true;inR=false;sec="in_f";continue;}
    if(c0.includes("Données résultantes")){inI=false;inR=true;sec="re_f";continue;}
    if(c0==="Refroidissement"&&!val){sec=inI?"in_f":"re_f";continue;}
    if(c0==="Chauffage"&&!val){sec=inI?"in_c":"re_c";continue;}
    if(c0==="Common Data"||c0.startsWith("Common")){sec="co";continue;}
    if(c0.match(/Max.*courant.*absorbé/i))sec="co";
    if(sec==="in_f"){
      if(c0.match(/Temp.*entr.*eau/i))d.refroidissement.tempEntreeEau=val;
      if(c0.match(/Temp.*sort.*eau/i))d.refroidissement.tempSortieEau=val;
      if(c0==="Glycol côté utilisation")d.refroidissement.glycol=val;
      if(c0.match(/Temp.*[Aa]ir.*ext/i))d.refroidissement.tempAirExt=val;
      if(c0.match(/[Hh]umidit/))d.refroidissement.humiditeRel=val;
      if(c0.match(/[Pp]ourcentage.*[Cc]harge/))d.refroidissement.charge=val;
    }
    if(sec==="in_c"){
      if(!d.chauffage)d.chauffage={};
      if(c0.match(/Temp.*entr.*eau/i))d.chauffage.tempEntreeEau=val;
      if(c0.match(/Temp.*sort.*eau/i))d.chauffage.tempSortieEau=val;
      if(c0==="Glycol côté utilisation")d.chauffage.glycol=val;
      if(c0.match(/Temp.*[Aa]ir.*ext/i))d.chauffage.tempAirExt=val;
      if(c0.match(/[Hh]umidit/))d.chauffage.humiditeRel=val;
      if(c0.match(/[Pp]ourcentage.*[Cc]harge/))d.chauffage.charge=val;
    }
    if(sec==="re_f"){
      if(c0.match(/Puissance de refroidissement.*UNI/))d.resultsFroid.puissanceFrigoUNI=val;
      else if(c0.match(/Puissance de refroidissement/))d.resultsFroid.puissanceFrigo=val;
      if(c0.match(/Débit.*eau/i))d.resultsFroid.debitEau=val;
      if(c0.match(/Perte de charge/i))d.resultsFroid.perteCharge=val;
      if(c0.match(/Puissance absorbée par les compresseurs/))d.resultsFroid.puissAbsCompresseurs=val;
      if(c0.match(/Courant abs.*[Cc]ompresseurs/))d.resultsFroid.courantAbsCompresseurs=val;
      if(c0.match(/Puissance absorbée totale.*UNI/))d.resultsFroid.puissAbsTotaleUNI=val;
      else if(c0.match(/Puissance absorbée totale/))d.resultsFroid.puissAbsTotale=val;
      if(c0.match(/Courant absorbé total/))d.resultsFroid.courantAbsTotal=val;
      if(c0.match(/^EER\s*\(\*\)/))d.resultsFroid.eer=val;
      if(c0.match(/EER.*UNI/))d.resultsFroid.eerUNI=val;
      if(c0==="SEER")d.resultsFroid.seer=val;
      if(c0.match(/Eta.*[Cc]ool/))d.resultsFroid.etasC=val;
    }
    if(sec==="re_c"){
      if(!d.resultsChaud)d.resultsChaud={};
      if(c0.match(/Puissance de chauffage.*UNI/))d.resultsChaud.puissanceChauffageUNI=val;
      else if(c0.match(/Puissance de chauffage/))d.resultsChaud.puissanceChauffage=val;
      if(c0.match(/Débit.*eau/i))d.resultsChaud.debitEau=val;
      if(c0.match(/Perte de charge/i))d.resultsChaud.perteCharge=val;
      if(c0.match(/Puissance absorbée par les compresseurs/))d.resultsChaud.puissAbsCompresseurs=val;
      if(c0.match(/Courant abs.*[Cc]ompresseurs/))d.resultsChaud.courantAbsCompresseurs=val;
      if(c0.match(/Puissance absorbée totale.*UNI/))d.resultsChaud.puissAbsTotaleUNI=val;
      else if(c0.match(/Puissance absorbée totale/))d.resultsChaud.puissAbsTotale=val;
      if(c0.match(/Courant absorbé total/))d.resultsChaud.courantAbsTotal=val;
      if(c0.match(/^COP\s*\(\*\)/))d.resultsChaud.cop=val;
      if(c0.match(/COP.*UNI/))d.resultsChaud.copUNI=val;
      if(c0==="SCOP")d.resultsChaud.scop=val;
      if(c0.match(/Eta.*[Hh]eat/))d.resultsChaud.etasH=val;
    }
    if(sec==="co"){
      if(c0.match(/Max.*courant.*absorbé/i))d.commonData.maxCourant=val;
      if(c0.match(/Courant de démarrage/i))d.commonData.courantDemarrage=val;
      if(c0.match(/puissance acoustique.*Lw.*base/i))d.commonData.lwStandard=val;
      if(c0.match(/pression acoustique.*Lp.*base/i))d.commonData.lpStandard=val;
      if(c0.match(/Lw.*[Ss]ilensieuse/)&&!c0.match(/[Ss]uper/))d.commonData.lwSilencieuse=val;
      if(c0.match(/Lp.*Low Noise/)&&!c0.match(/Super/))d.commonData.lpSilencieuse=val;
      if(c0.match(/Lw.*[Ss]uper/))d.commonData.lwUltra=val;
      if(c0.match(/Lp.*Super Low/))d.commonData.lpUltra=val;
      if(c0.match(/Source Air Volumetric/))d.commonData.debitAir=val;
      if(c0==="Source Fans Number")d.commonData.nbVentilateurs=val;
      if(c0.match(/Source Fans Power/))d.commonData.puissVentilateurs=val;
      if(c0.match(/Source Fans Absorbed/))d.commonData.courantVentilateurs=val;
      if(c0.match(/Compresseurs.*Circuits/))d.commonData.compresseursCircuits=val;
      if(c0.match(/réservoir/i))d.commonData.capaciteReservoir=val;
      if(c0.match(/Alimentation/))d.alimentation=val;
      if(c0==="Réfrigérant")d.refrigerant=val;
      if(c0==="GWP")d.gwp=val;
      if(c0.match(/Poids/))d.poids=val;
    }
  }
  if(prestXml){const pR=extractRows(prestXml);const skip=["DESCRIPTION DE PRESTATIONS","N° de Projet:","Date:","Nom du Projet:"];for(const row of pR){for(const cell of row){if(cell&&cell.length>5&&!skip.some(s=>cell.startsWith(s))&&!cell.match(/^\[#\d+\]/)&&!cell.match(/^PLP/)&&!cell.match(/^\d{2}-\d{2}-\d{4}$/))d.prestations.push(cell);}}}
  if(!d.gamme&&d.modele)d.gamme=d.modele.includes("CS")?"PLP CS":d.modele.includes("HS")?"PLP HS":"PLP";
  return d;
}
