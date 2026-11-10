#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Build product-detail data for PepVeri from the catalog spreadsheet.

Input : Downloads/catalog-peptides-shopify-with-related.xlsx  (297 SKUs, A–AF)
Output: assets/data/index.js                  slug -> product line id
        assets/data/details/<line>.js         full record per product, per line
Usage : python3 scripts/build_product_data.py [path/to/catalog.xlsx]
"""
import json
import os
import re
import sys

import openpyxl

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_XLSX = os.path.expanduser('~/Downloads/catalog-peptides-shopify-with-related.xlsx')
XLSX = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_XLSX
OUT = os.path.join(ROOT, 'assets', 'data')

# ---------------------------------------------------------------- translations
# Every Chinese value in `target_tag` (110 unique) and `pathway` (10 unique).
TARGET_EN = {
    '67LR 层粘连蛋白受体': '67LR laminin receptor',
    'ACTH(4-7) 类似物（神经保护）': 'ACTH(4-7) analogue (neuroprotection research)',
    'Aβ 聚集／淀粉样纤维': 'Aβ aggregation / amyloid fibrils',
    'BPC-157（组织修复研究）': 'BPC-157 (tissue-repair research)',
    'CCK1／CCK2 受体': 'CCK1 / CCK2 receptors',
    'CCK2 受体': 'CCK2 receptor',
    'CaV2.2（N 型）': 'CaV2.2 (N-type)',
    'Caspase-1 蛋白酶（荧光底物）': 'Caspase-1 protease (fluorogenic substrate)',
    'Caspase-3 蛋白酶（荧光底物）': 'Caspase-3 protease (fluorogenic substrate)',
    'Caspase-8 蛋白酶（荧光底物）': 'Caspase-8 protease (fluorogenic substrate)',
    'Caspase-9 蛋白酶（荧光底物）': 'Caspase-9 protease (fluorogenic substrate)',
    'GAL1-3 受体': 'GAL1-3 receptors',
    'GHK 基质因子（铜肽）': 'GHK matrikine (copper peptide)',
    'GHRH 受体': 'GHRH receptor',
    'GHSR1a': 'GHSR1a',
    'GHSR1a（生长激素促泌）': 'GHSR1a (GH secretagogue)',
    'GIP 受体': 'GIP receptor',
    'GIP／GLP-1 双受体': 'GIP / GLP-1 dual receptor',
    'GLP-1 受体': 'GLP-1 receptor',
    'GLP-1 受体（拮抗）': 'GLP-1 receptor (antagonist)',
    'GLP-2 受体': 'GLP-2 receptor',
    'GnRH 受体（拮抗）': 'GnRH receptor (antagonist)',
    'GnRH 受体（激动）': 'GnRH receptor (agonist)',
    'ISG15 化修饰': 'ISG15 conjugation',
    'K0 连接多泛素链': 'K0-linked polyubiquitin chain',
    'K11 连接多泛素链': 'K11-linked polyubiquitin chain',
    'K27 连接多泛素链': 'K27-linked polyubiquitin chain',
    'K29 连接多泛素链': 'K29-linked polyubiquitin chain',
    'K33 连接多泛素链': 'K33-linked polyubiquitin chain',
    'K48 连接多泛素链': 'K48-linked polyubiquitin chain',
    'K6 连接多泛素链': 'K6-linked polyubiquitin chain',
    'K63 连接多泛素链': 'K63-linked polyubiquitin chain',
    'KCa1.1（BK）': 'KCa1.1 (BK)',
    'KCa1.1（BK）；兼 Kv1.2/1.3': 'KCa1.1 (BK); also Kv1.2/1.3',
    'KCa1.1（BK，选择性）': 'KCa1.1 (BK, selective)',
    'KCa2.1/2.2/2.3（SK1-3）': 'KCa2.1/2.2/2.3 (SK1-3)',
    'KISS1R（GPR54）': 'KISS1R (GPR54)',
    'Kv1 家族（亚型待确认）': 'Kv1 family (subtype to be confirmed)',
    'Kv1.1/1.2/1.3': 'Kv1.1/1.2/1.3',
    'Kv1.1/1.2/1.6': 'Kv1.1/1.2/1.6',
    'Kv1.1/Kv1.3': 'Kv1.1/Kv1.3',
    'Kv1.2/Kv1.3': 'Kv1.2/Kv1.3',
    'Kv1.3（Kv1.1/1.2/1.6 较弱）': 'Kv1.3 (weaker on Kv1.1/1.2/1.6)',
    'Kv1.3（Kv1.1/1.6）': 'Kv1.3 (Kv1.1/1.6)',
    'Kv1（Shaker 型）': 'Kv1 (Shaker-type)',
    'Kv4.2/Kv4.3': 'Kv4.2/Kv4.3',
    'Legumain 可切割 ADC 连接子': 'Legumain-cleavable ADC linker',
    'MC1R／MC4R 激动': 'MC1R / MC4R agonist',
    'MC1R／黑色素生成': 'MC1R / melanogenesis',
    'MC3R': 'MC3R',
    'MC4R': 'MC4R',
    'MMP-2': 'MMP-2',
    'MMP-9': 'MMP-9',
    'N-钙粘蛋白': 'N-cadherin',
    'NEDD8 化修饰': 'NEDD8 conjugation',
    'NaV1.4（NaV1.2/1.5 较弱）': 'NaV1.4 (weaker on NaV1.2/1.5)',
    'NaV1.4（骨骼肌）': 'NaV1.4 (skeletal muscle)',
    'NaV1.7': 'NaV1.7',
    'NaV1.7（NaV1.8）': 'NaV1.7 (NaV1.8)',
    'OX1R／OX2R': 'OX1R / OX2R',
    'PAC1／VPAC 受体': 'PAC1 / VPAC receptors',
    'PTH1 受体': 'PTH1 receptor',
    'PrP 淀粉样片段': 'PrP amyloid fragment',
    'SNARE 复合物（类肉毒机制）': 'SNARE complex (botulinum-like mechanism)',
    'SSTR1-5': 'SSTR1-5',
    'SUMO 化修饰': 'SUMOylation',
    'Sclerostin 表位片段': 'Sclerostin epitope fragment',
    'Secretin 受体': 'Secretin receptor',
    'T 细胞成熟（胸腺五肽）': 'T-cell maturation (thymopentin)',
    'Tau 聚集（PHF 基序）': 'Tau aggregation (PHF motif)',
    'Tuftsin 类似物（抗焦虑研究）': 'Tuftsin analogue (anxiolytic research)',
    'V2／V1 受体': 'V2 / V1 receptors',
    'VPAC1／VPAC2 受体': 'VPAC1 / VPAC2 receptors',
    'Y1／Y2／Y5 受体': 'Y1 / Y2 / Y5 receptors',
    'Y2 受体': 'Y2 receptor',
    'hGH 片段（脂解研究）': 'hGH fragment (lipolysis research)',
    'α-MSH 三肽（抗炎 NF-κB）': 'α-MSH tripeptide (NF-κB inflammation research)',
    'α-Synuclein 聚集（NAC）': 'α-Synuclein aggregation (NAC)',
    'α1β1／α2β1 整合素': 'α1β1 / α2β1 integrins',
    'α2β1 整合素（胶原）': 'α2β1 integrin (collagen)',
    'α3β4 nAChR': 'α3β4 nAChR',
    'α4β1 整合素（VLA-4）': 'α4β1 integrin (VLA-4)',
    'α5β1 协同位点': 'α5β1 synergy site',
    'α7 nAChR（α3β2）': 'α7 nAChR (α3β2)',
    'α7／α3β2 nAChR': 'α7 / α3β2 nAChR',
    'αvβ3／α5β1 整合素': 'αvβ3 / α5β1 integrins',
    'αvβ3／αvβ5 整合素': 'αvβ3 / αvβ5 integrins',
    'δ 阿片受体': 'δ-opioid receptor',
    'κ 阿片受体': 'κ-opioid receptor',
    'μ 阿片受体': 'μ-opioid receptor',
    '催产素受体': 'Oxytocin receptor',
    '免疫调节（T 细胞）': 'Immune modulation (T cells)',
    '凝血酶（丝氨酸蛋白酶）': 'Thrombin (serine protease)',
    '去泛素化酶（DUB）': 'Deubiquitinase (DUB)',
    '定制序列化妆品肽': 'Custom-sequence cosmetic peptide',
    '层粘连蛋白-5／DEJ 支持': 'Laminin-5 / DEJ support',
    '层粘连蛋白（神经细胞黏附）': 'Laminin (neuronal adhesion)',
    '抗体识别表位': 'Antibody-recognised epitope',
    '抗氧化／抗糖化': 'Antioxidant / glycation research',
    '整合素阴性对照': 'Integrin negative control',
    '机械敏感通道 Piezo1／TRPC6': 'Mechanosensitive channels Piezo1 / TRPC6',
    '杂质参照品（母肽衍生）': 'Impurity reference (parent-peptide derived)',
    '泛素 C 端双甘氨酸（去泛素化产物）': 'Ubiquitin C-terminal diglycine (DUB product)',
    '泛素（蛋白酶体／相互作用）': 'Ubiquitin (proteasome / interaction studies)',
    '生长抑素受体 SSTR2／SSTR5': 'Somatostatin receptors SSTR2 / SSTR5',
    '眼周微循环／淋巴引流': 'Periorbital microcirculation / lymphatic drainage',
    '睡眠调节肽': 'Sleep-regulation peptide',
    '磷脂膜通透（蜂毒肽）': 'Phospholipid membrane permeabilisation (melittin)',
    '端粒／衰老研究肽': 'Telomere / senescence research peptide',
    '线粒体肽（AMPK 代谢）': 'Mitochondrial peptide (AMPK metabolism)',
    '组织蛋白酶 B 可切割 ADC 连接子': 'Cathepsin B-cleavable ADC linker',
    '组织蛋白酶 B（半胱氨酸蛋白酶）': 'Cathepsin B (cysteine protease)',
    '组织蛋白酶 D（天冬氨酸蛋白酶）': 'Cathepsin D (aspartic protease)',
    '细胞外基质信号肽（胶原／弹性蛋白）': 'ECM signalling peptide (collagen / elastin)',
    '细胞膜穿透（CPP）': 'Cell-membrane penetration (CPP)',
    '细菌膜通透': 'Bacterial membrane permeabilisation',
    '细菌膜通透（抗菌肽）': 'Bacterial membrane permeabilisation (AMP)',
    '细菌膜（环肽）': 'Bacterial membrane (cyclic peptide)',
    '肌动蛋白结合／组织修复': 'Actin binding / tissue repair',
    '肌肉型 nAChR（α1/δ）': 'Muscle-type nAChR (α1/δ)',
    '肌肉型 nAChR（拮抗）': 'Muscle-type nAChR (antagonist)',
    '胰蛋白酶（丝氨酸蛋白酶）': 'Trypsin (serine protease)',
    '胰高血糖素受体 GCGR': 'Glucagon receptor GCGR',
    '胶原片段（皮肤／营养）': 'Collagen fragment (skin / nutrition research)',
    '胸腺素 β4 片段（肌动蛋白结合）': 'Thymosin β4 fragment (actin binding)',
    '蛋白水解物（营养／配方）': 'Protein hydrolysate (nutrition / formulation)',
    '角蛋白表达': 'Keratin expression',
    '谷胱甘肽（抗氧化）': 'Glutathione (antioxidant)',
    '钙激活蛋白酶 Calpain': 'Calpain (calcium-activated protease)',
    '铜肽（毛囊／发根）': 'Copper peptide (hair-follicle research)',
    '降钙素受体': 'Calcitonin receptor',
}

PATHWAY_EN = {
    'APP 加工 → Aβ 单体 → 寡聚 → 纤维': 'APP processing → Aβ monomer → oligomer → fibril',
    'Tau 磷酸化 → PHF6 聚集 → 神经纤维缠结': 'Tau phosphorylation → PHF6 aggregation → neurofibrillary tangles',
    'α-Syn 聚集（NAC 核心）': 'α-Syn aggregation (NAC core)',
    '泛素链识别：K48（蛋白酶体）／K63（信号）': 'Ubiquitin chain recognition: K48 (proteasome) / K63 (signalling)',
    '去泛素化：Ub-AMC 底物 → UCHL1 / USP7': 'Deubiquitination: Ub-AMC substrate → UCHL1 / USP7',
    '膜通透 → 抑菌 → 耐药菌替代方案': 'Membrane permeabilisation → bacterial killing → antibiotic-alternative research',
    '游离肽 ↔ 铜复合物（GHK ↔ GHK-Cu）': 'Free peptide ↔ copper complex (GHK ↔ GHK-Cu)',
    '凋亡蛋白酶级联：Caspase-8 / Caspase-9 → Caspase-3': 'Apoptotic caspase cascade: Caspase-8 / Caspase-9 → Caspase-3',
    '蛋白 → 水解 → 小肽（吸收／功效）': 'Protein → hydrolysis → small peptides (absorption / bioactivity)',
    '酶切释放：Cathepsin B 底物 ↔ Val-Cit linker': 'Enzymatic release: Cathepsin B substrate ↔ Val-Cit linker',
}

PACKS = {
    'gmp': ['1 g', '5 g', '10 g', '25 g', 'Bulk'],
    'research': ['1 mg', '5 mg', '10 mg', '25 mg', '100 mg'],
    'cosmetic': ['10 mg', '100 mg', '1 g', 'Bulk'],
    'nutra': ['100 g', '1 kg', '25 kg'],
    'vet': ['10 mg', '100 mg', '1 g', 'Bulk'],
}

CJK = re.compile(r'[\u4e00-\u9fff]')


def clean(v):
    if v is None:
        return ''
    return str(v).strip()


def seo_title(r):
    """<=60 chars where possible: product name first, then RUO + catalog no."""
    n, ref = r['name'], r['ref']
    for cand in ('%s | RUO Peptide %s | PepVeri' % (n, ref),
                 '%s | RUO Peptide | PepVeri' % n,
                 '%s | PepVeri' % n):
        if len(cand) <= 60:
            return cand
    return '%s | PepVeri' % n


def seo_desc(r):
    """120-155 chars: keyword + purity + CoA/HPLC-MS + packs + CTA."""
    n = r['name']
    pr = re.sub(r'\s*\(HPLC\)', '', r['purity']).strip()  # avoid "HPLC ... HPLC"
    pack = r['packs'][0]
    cands = [
        '%s: RUO research peptide from PepVeri. %s purity by HPLC, batch CoA with LC-MS identity, '
        'packs from %s. Quote within 1 business day.' % (n, pr, pack),
        '%s: RUO research peptide, %s purity by HPLC, batch CoA with LC-MS data, packs from %s. '
        'Quote in 1 business day.' % (n, pr, pack),
        '%s: RUO research peptide, %s purity by HPLC, CoA with LC-MS identity, packs from %s.'
        % (n, pr, pack),
        '%s: RUO research peptide, %s purity by HPLC, batch CoA with LC-MS identity.' % (n, pr),
    ]
    for cand in cands:
        if 118 <= len(cand) <= 155:
            return cand
    for cand in cands:
        if len(cand) <= 155:
            return cand
    return cands[-1][:152].rsplit(' ', 1)[0] + '.'


def translate(table, value):
    value = clean(value)
    if not value:
        return ''
    if value in table:
        return table[value]
    if not CJK.search(value):
        return value
    raise SystemExit('Untranslated value: %r' % value)


# ---------------------------------------------------------------- read sheets
wb = openpyxl.load_workbook(XLSX, data_only=True)
ws = wb.active
hdr = [c.value for c in ws[1]]
rows = []
for raw in ws.iter_rows(min_row=2, values_only=True):
    d = {k: clean(v) for k, v in zip(hdr, raw)}
    if d['Name']:
        rows.append(d)

# catalog.js supplies slug / ref / line / sub / sub-label (already published)
cat = open(os.path.join(ROOT, 'assets', 'catalog.js'), encoding='utf-8').read()
cdata = json.loads(re.search(r'window\.CATALOG\s*=\s*(\{.*\})\s*;?\s*$', cat, re.S).group(1))
light = {p['name']: p for p in cdata['products']}
line_name = {l['id']: l['name'] for l in cdata['lines']}
sub_label = {}
for line in cdata['lines']:
    for sb in line['subs']:
        sub_label[(line['id'], sb['name'])] = sb.get('label') or sb['name']

missing = [r['Name'] for r in rows if r['Name'] not in light]
if missing:
    raise SystemExit('Names missing from catalog.js: %s' % missing[:5])


def build(r):
    name = r['Name']
    p = light[name]
    line = p['line']

    overview = [x.strip() for x in r['产品简介'].split('\n') if x.strip()]
    apps = []
    for ln in r['Applications'].split('\n'):
        ln = ln.strip()
        if not ln:
            continue
        for piece in re.split(r'(?<=[a-z])\s*·\s*', ln):
            piece = piece.strip(' •-–—')
            if piece:
                apps.append(piece)

    mm = re.search(r'MW\s*([\d.,]+)', r['分子式、分子量'])
    moq = r['包装、MOQ、交付周期']
    moq = 'Contact us for current lead time' if moq == '咨询客服' else moq

    aliases = r['别名']
    if aliases in ('-', '—', 'N/A', 'n/a', 'none'):
        aliases = ''

    return {
        'name': name,
        'slug': p['slug'],
        'ref': p['ref'],
        'line': line,
        'sub': p['sub'],
        'subLabel': sub_label.get((line, p['sub']), p['sub']),
        'lineLabel': line_name.get(line, 'Catalog Peptides'),
        'packs': PACKS.get(line, PACKS['research']),
        'cas': '' if r['CAS No.'] in ('N/A', 'n/a', '-') else r['CAS No.'],
        'inci': '' if r['INCI'] in ('N/A', 'n/a', '-') else r['INCI'],
        'seq': r['Sequence'],
        'aliases': aliases,
        'formula': r['分子式、分子量'].split('\n')[0].strip(),
        'mw': mm.group(1) if mm else '',
        'appearance': r['外观'],
        'purity': r['Purity'],
        'mods': r['Modification'],
        'solubility': r['Solubility'],
        'storage': r['Storage condition'],
        'shelf': r['Shelf life'],
        'format': r['Format'],
        'grade': r['Grade'],
        'note': r['Note'],
        'short': r['Short listing description'],
        'overview': overview,
        'apps': apps,
        'docs': r['可交付文档 & 服务'],
        'moq': moq,
        'safety': r['安全 & 合规声明'],
        'target': translate(TARGET_EN, r['target_tag 靶点/机制']),
        'family': r['family 家族'],
        'pathway': [s.strip() for s in translate(PATHWAY_EN, r['pathway 通路配套']).split('→') if s.strip()] or None,
        'control': r['control_of 对照配对'] or None,
        '_relatedRaw': [r[k] for k in ('related_1 关联推荐', 'related_2', 'related_3',
                                       'related_4', 'related_5', 'related_6') if r[k]],
    }


records = [build(r) for r in rows]
byname = {x['name']: x for x in records}
SUFFIXES = (' (API Grade)', ' (Cosmetic Grade)', ' (Oral Grade)', ' (Feed Grade)', ' (Pet Grade)')


def resolve(n):
    n = clean(n)
    if n in byname:
        return n
    for s in SUFFIXES:
        if n + s in byname:
            return n + s
    base = n.split(' / ')[0].strip().lower()
    hits = [k for k in byname if k.lower().startswith(base)]
    return hits[0] if len(hits) == 1 else None


def reason(a, b):
    if a['control'] and resolve(a['control']) == b['name']:
        return 'Control pair'
    if b['control'] and resolve(b['control']) == a['name']:
        return 'Control pair'
    if a['family'] and a['family'] == b['family']:
        return 'Same family'
    ta = {t.strip() for t in re.split(r'[;,]', a['target']) if t.strip()}
    tb = {t.strip() for t in re.split(r'[;,]', b['target']) if t.strip()}
    if ta & tb:
        return 'Same target'
    if a['pathway'] and a['pathway'] == b['pathway']:
        return 'Same pathway'
    return ''


unresolved = set()
for a in records:
    rel = []
    for n in a.pop('_relatedRaw'):
        full = resolve(n)
        if not full:
            unresolved.add(n)
            continue
        b = byname[full]
        rel.append({
            'name': b['name'], 'slug': b['slug'], 'ref': b['ref'], 'purity': b['purity'],
            'target': b['target'], 'reason': reason(a, b),
        })
    a['related'] = rel
    if a['control']:
        cs = resolve(a['control'])
        a['controlSlug'] = byname[cs]['slug'] if cs else ''

# ---------------------------------------------------------------- seo fields
for r in records:
    r['seoTitle'] = seo_title(r)
    r['seoDesc'] = seo_desc(r)

tlen = [len(r['seoTitle']) for r in records]
dlen = [len(r['seoDesc']) for r in records]
print('seo title  min %d  max %d  <=60: %d/%d' % (min(tlen), max(tlen), sum(1 for x in tlen if x <= 60), len(tlen)))
print('seo desc   min %d  max %d  120-155: %d/%d' % (min(dlen), max(dlen), sum(1 for x in dlen if 120 <= x <= 155), len(dlen)))
if max(dlen) > 155:
    print('  ! over-length desc:', [r['name'] for r in records if len(r['seoDesc']) > 155][:5])

# ---------------------------------------------------------------- write files
os.makedirs(os.path.join(OUT, 'details'), exist_ok=True)

by_line = {}
for r in records:
    by_line.setdefault(r['line'], []).append(r)

total = 0
for line, recs in sorted(by_line.items()):
    payload = {r['slug']: r for r in recs}
    js = ('window.PEP_DETAILS=Object.assign(window.PEP_DETAILS||{},'
          + json.dumps(payload, ensure_ascii=False, separators=(',', ':')) + ');\n')
    path = os.path.join(OUT, 'details', line + '.js')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(js)
    kb = os.path.getsize(path) / 1024
    total += kb
    print('%-9s %3d products  %6.0f KB' % (line, len(recs), kb))

index = {r['slug']: r['line'] for r in records}
with open(os.path.join(OUT, 'index.js'), 'w', encoding='utf-8') as f:
    f.write('window.PEP_LINE=' + json.dumps(index, separators=(',', ':')) + ';\n')

print('total data %.0f KB | slugs %d' % (total, len(index)))
if unresolved:
    print('UNRESOLVED related names:', sorted(unresolved))
else:
    print('all related references resolved')

# ---------------------------------------------------------------- sanity check
bad = [r['name'] for r in records if not r['overview'] or not r['seq']]
print('records missing overview/sequence:', bad[:5] or 'none')
print('no related list:', len([r for r in records if not r['related']]))
