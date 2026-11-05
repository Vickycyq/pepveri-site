/* PepVeri Biotech — 产品数据（事实参数：品名 / CAS / 分子式 / 纯度 / 规格） */
const CATEGORIES = {
  incretin: "Incretin Sequence Peptides",
  reference: "Biochemical Reference Peptides",
  neuropeptide: "Neuropeptide Sequences",
  cosmetic: "Cosmetic Peptide Ingredients",
};

const PRODUCTS = [
  { name: "Semaglutide", alias: "", cat: "incretin", cas: "910463-68-2", purity: "≥99.0% (HPLC)", formula: "C187H291N45O59", mw: "4113.58 g/mol", form: "Lyophilized White Powder", moq: "1g / 10g / 100g / 1kg", lead: "1–3 Business Days",
    desc: "31-residue synthetic peptide carrying an Aib8 substitution and a C18 fatty-diacid side chain, prepared by SPPS as an analytical reference material." },
  { name: "Tirzepatide", alias: "", cat: "incretin", cas: "2023788-19-2", purity: "≥99.0% (HPLC)", formula: "C225H348N48O68", mw: "4813.45 g/mol", form: "Lyophilized White Powder", moq: "1g / 10g / 100g / 1kg", lead: "1–3 Business Days",
    desc: "39-residue synthetic peptide with dual Aib substitutions and a C20 fatty-diacid moiety, supplied as a high-purity chemical reference." },
  { name: "Retatrutide", alias: "Analytical Reference Standard", cat: "incretin", cas: "2381089-83-2", purity: "≥99.0% (HPLC)", formula: "C221H342N46O68", mw: "4731.33 g/mol", form: "Lyophilized White Powder", moq: "1g / 10g / 100g / 1kg", lead: "1–3 Business Days",
    desc: "Multi-modified 39-residue synthetic peptide, characterized by analytical HPLC and high-resolution mass spectrometry." },
  { name: "Cagrilintide", alias: "", cat: "incretin", cas: "1415456-99-3", purity: "≥99.0% (HPLC)", formula: "C156H250N42O49", mw: "3530.0 g/mol", form: "Lyophilized White Powder", moq: "1g / 10g / 100g", lead: "1–3 Business Days",
    desc: "Synthetic polypeptide analogue bearing sequence substitutions and a lipophilic side-chain, produced as an in vitro reference compound." },
  { name: "BPC-157", alias: "Pentadecapeptide", cat: "reference", cas: "137525-51-0", purity: "≥99.0% (HPLC)", formula: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val", mw: "1419.53 g/mol", form: "Lyophilized White Powder", moq: "1g / 10g / 50g / 500g", lead: "1–2 Business Days",
    desc: "15-residue synthetic pentadecapeptide with a defined primary structure, supplied as a laboratory reference reagent." },
  { name: "TB-500", alias: "Thymosin β4 Fragment", cat: "reference", cas: "885340-08-9", purity: "≥99.0% (HPLC)", formula: "C212H350N56O78S", mw: "4963.49 g/mol", form: "Lyophilized White Powder", moq: "1g / 10g / 50g / 500g", lead: "1–2 Business Days",
    desc: "Linear synthetic peptide replicating a defined Thymosin Beta-4 sequence fragment, filled into sterile borosilicate vials." },
  { name: "KPV", alias: "Lys-Pro-Val Tripeptide", cat: "reference", cas: "67727-97-3", purity: "≥99.0% (HPLC)", formula: "C16H30N4O6", mw: "374.43 g/mol", form: "Lyophilized White Powder", moq: "1g / 10g / 100g", lead: "1–2 Business Days",
    desc: "Tripeptide of L-lysine, L-proline and L-valine, produced by solid-phase synthesis for analytical assay use." },
  { name: "Epithalon", alias: "Epitalon Tetrapeptide", cat: "neuropeptide", cas: "307297-39-8", purity: "≥99.0% (HPLC)", formula: "C14H22N4O9", mw: "390.35 g/mol", form: "Lyophilized White Powder", moq: "1g / 10g / 100g", lead: "1–2 Business Days",
    desc: "Tetrapeptide composed of alanine, glutamic acid, aspartic acid and glycine, made by SPPS for biochemical research." },
  { name: "DSIP", alias: "Delta Sleep-Inducing Peptide", cat: "neuropeptide", cas: "62568-57-4", purity: "≥99.0% (HPLC)", formula: "C35H48N10O15", mw: "848.81 g/mol", form: "Lyophilized White Powder", moq: "1g / 10g / 50g", lead: "1–2 Business Days",
    desc: "Nine-residue linear neuropeptide with defined stereochemistry, manufactured for MS and biochemical laboratory work." },
  { name: "MOTS-c", alias: "Mitochondrial-Derived Peptide", cat: "neuropeptide", cas: "1627580-64-6", purity: "≥98.0% (HPLC)", formula: "C79H139N23O28S2", mw: "2174.6 g/mol", form: "Lyophilized White Powder", moq: "1g / 10g / 50g", lead: "1–3 Business Days",
    desc: "16-residue peptide corresponding to a mitochondrial 12S rRNA open-reading-frame sequence, lyophilized under nitrogen." },
  { name: "Selank", alias: "TP-7 Heptapeptide", cat: "neuropeptide", cas: "129954-34-3", purity: "≥99.0% (HPLC)", formula: "C33H49N15O9", mw: "751.86 g/mol", form: "Lyophilized White Powder", moq: "1g / 10g / 100g", lead: "1–2 Business Days",
    desc: "Seven-residue synthetic peptide prepared by SPPS, intended for chromatographic calibration and chemical assays." },
  { name: "Semax", alias: "Heptapeptide Standard", cat: "neuropeptide", cas: "80714-61-0", purity: "≥99.0% (HPLC)", formula: "C37H57N11O10S", mw: "813.98 g/mol", form: "Lyophilized White Powder", moq: "1g / 10g / 100g", lead: "1–2 Business Days",
    desc: "Heptapeptide sequence stabilized by a C-terminal Pro-Gly-Pro motif, supplied as a high-purity reference material." },
  { name: "GHK-Cu (HCl)", alias: "Copper Tripeptide-1 Hydrochloride", cat: "cosmetic", cas: "89030-95-5", purity: "≥99.0% (HPLC)", formula: "[Gly-His-Lys]·Cu·2HCl", mw: "403.93 g/mol (free base)", form: "Vibrant Blue Crystalline Powder", moq: "10g / 100g / 1kg / 10kg", lead: "1–2 Business Days",
    desc: "Chelated copper tripeptide complex in hydrochloride form, a deep-blue cosmetic ingredient made under ISO-compliant conditions." },
  { name: "GHK-Cu (Acetate)", alias: "Copper Tripeptide-1 Acetate", cat: "cosmetic", cas: "49557-75-7", purity: "≥99.0% (HPLC)", formula: "[Gly-His-Lys]·Cu·xCH₃COOH", mw: "403.93 g/mol (base)", form: "Vibrant Blue Fine Powder", moq: "10g / 100g / 1kg / 10kg", lead: "1–2 Business Days",
    desc: "Acetate counter-ion form of copper tripeptide-1, with a mild ionic profile suited to premium topical skincare." },
  { name: "Acetyl Octapeptide-3", alias: "Snap-8", cat: "cosmetic", cas: "868844-74-0", purity: "≥98.0% (HPLC)", formula: "C41H70N16O14S", mw: "1075.17 g/mol", form: "Lyophilized White Powder", moq: "10g / 100g / 1kg", lead: "1–2 Business Days",
    desc: "N-acetyl / C-amide octapeptide cosmetic raw material with good aqueous solubility for topical formulation." },
  { name: "Palmitoyl Pentapeptide-4", alias: "Matrixyl", cat: "cosmetic", cas: "214047-00-4", purity: "≥98.0% (HPLC)", formula: "C39H75N7O10", mw: "802.05 g/mol", form: "Lyophilized White Powder", moq: "10g / 100g / 1kg / 10kg", lead: "1–2 Business Days",
    desc: "Lipopeptide coupling a palmitoyl chain to the Lys-Thr-Thr-Lys-Ser pentapeptide, for skincare formulation development." },
  { name: "Conopeptide", alias: "Mu-conotoxin / XEP-018", cat: "cosmetic", cas: "936616-33-0", purity: "≥98.0% (HPLC)", formula: "22 AA biomimetic sequence", mw: "—", form: "Lyophilized White Powder", moq: "5g / 50g / 500g", lead: "1–3 Business Days",
    desc: "22-residue peptide patterned after marine biomimetic sequences, with verified disulfide-bridge folding." },
  { name: "Palmitoyl Tetrapeptide-10", alias: "Crystalide", cat: "cosmetic", cas: "2173129-37-6", purity: "≥98.0% (HPLC)", formula: "C26H48N6O8", mw: "556.69 g/mol", form: "Lyophilized White Powder", moq: "10g / 100g / 1kg", lead: "1–2 Business Days",
    desc: "Palmitoylated tetrapeptide active for high-performance cosmetic formulation, compatible with gels and emulsions." },
  { name: "Palmitoyl Tetrapeptide-7", alias: "Pal-GQPR", cat: "cosmetic", cas: "221227-05-0", purity: "≥98.0% (HPLC)", formula: "C34H62N8O8", mw: "694.90 g/mol", form: "Lyophilized White Powder", moq: "10g / 100g / 1kg / 10kg", lead: "1–2 Business Days",
    desc: "Lipopeptide conjugating palmitic acid to the Gly-Gln-Pro-Arg tetrapeptide, a common topical skincare active." },
  { name: "Acetyl Hexapeptide-1", alias: "Melitane", cat: "cosmetic", cas: "448844-34-2", purity: "≥98.0% (HPLC)", formula: "C40H58N10O10", mw: "851.03 g/mol", form: "Lyophilized White Powder", moq: "10g / 100g / 1kg", lead: "1–2 Business Days",
    desc: "Terminally acetylated and amidated hexapeptide used in hair-care and topical cosmetic development." },
  { name: "Myristoyl Pentapeptide-4", alias: "SymPeptide 230", cat: "cosmetic", cas: "959610-24-3", purity: "≥98.0% (HPLC)", formula: "C35H63N7O9", mw: "725.92 g/mol", form: "Lyophilized White Powder", moq: "10g / 100g / 1kg", lead: "1–2 Business Days",
    desc: "Myristoylated, amidated pentapeptide manufactured for eyelash serums and topical cosmetic formulations." },
  { name: "Glutathione", alias: "L-Glutathione Reduced (GSH)", cat: "cosmetic", cas: "70-18-8", purity: "≥99.0% (HPLC)", formula: "C10H17N3O6S", mw: "307.32 g/mol", form: "Crystalline White Powder", moq: "100g / 1kg / 25kg", lead: "1–2 Business Days",
    desc: "Endogenous tripeptide of glutamate, cysteine and glycine, offered at ultra-high purity for skincare and lab research." },
];

const FEATURED = ["Retatrutide", "GHK-Cu (Acetate)", "Glutathione"];

/* 通用工具 */
function casChip(p) {
  return p.cas + (p.name.startsWith("Glutathione") ? "" : "");
}

function renderFeatured(el) {
  const list = FEATURED.map(n => PRODUCTS.find(p => p.name === n)).filter(Boolean);
  el.innerHTML = list.map((p, i) => `
    <div class="feat-card">
      <div class="feat-top">
        <div class="tags">
          <span class="tag">${i === 0 ? "Triple Agonist Standard" : i === 1 ? "Copper Peptide" : "Tripeptide Standard"}</span>
          <span class="tag">HPLC ≥99%</span>
        </div>
        <h3>${p.name}</h3>
        <div class="purity">${p.purity} • ${p.form}</div>
      </div>
      <div class="feat-body">
        <div class="spec-row"><span>CAS Number</span><span>${p.cas}</span></div>
        <div class="spec-row"><span>Formula</span><span>${p.formula}</span></div>
        <div class="spec-row"><span>Grade</span><span>${CATEGORIES[p.cat]}</span></div>
        <div class="spec-row"><span>Purity (HPLC)</span><span>${p.purity}</span></div>
        <div class="spec-row"><span>MOQ</span><span>${p.moq}</span></div>
        <a class="btn" href="catalog.html?search=${encodeURIComponent(p.cas)}">View in Catalog</a>
      </div>
    </div>`).join("");
}

function renderCatalog(el, filter, query, limit) {
  let list = PRODUCTS;
  if (filter && filter !== "all") list = list.filter(p => p.cat === filter);
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.alias || "").toLowerCase().includes(q) ||
      p.cas.includes(q)
    );
  }
  const total = list.length;
  if (limit) list = list.slice(0, limit);
  if (!list.length) {
    el.innerHTML = '<p style="color:var(--ink-soft)">No products match your search. Try another name or CAS number.</p>';
    return;
  }
  el.innerHTML = list.map(p => `
    <div class="product-card" data-cat="${p.cat}">
      <div class="cat">${CATEGORIES[p.cat]}</div>
      <h3>${p.name}</h3>
      ${p.alias ? `<div class="alias">${p.alias}</div>` : ""}
      <span class="purity-badge">${p.purity}</span>
      <div class="specs">
        <div class="spec-row"><span>CAS Number</span><span>${p.cas}</span></div>
        <div class="spec-row"><span>Formula / MW</span><span>${p.formula}${p.mw && p.mw !== "—" ? " · " + p.mw : ""}</span></div>
        <div class="spec-row"><span>Physical Form</span><span>${p.form}</span></div>
        <div class="spec-row"><span>Standard MOQ</span><span>${p.moq}</span></div>
        <div class="spec-row"><span>Quality Docs</span><span>HPLC · MS · COA</span></div>
      </div>
      <p class="desc">${p.desc}</p>
      <div class="foot">
        <span class="lead-time">Lead: ${p.lead}</span>
        <a class="btn btn-sm" href="contact.html?product=${encodeURIComponent(p.name)}">Request Quote</a>
      </div>
    </div>`).join("");
}
