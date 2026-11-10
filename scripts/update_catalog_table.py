#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Refresh CAS numbers and add the Sequence column to the products.html tables.

Data source: assets/data/details/<line>.js (generated from the spreadsheet by
build_product_data.py). A CAS missing from the new spreadsheet falls back to the
previously verified value in assets/catalog.js, so no confirmed CAS is lost.

The script is idempotent: any existing c-seq column / mobile sequence span is
removed before being rebuilt. Re-run it after regenerating the detail data.
"""
import html
import json
import pathlib
import re

D = pathlib.Path(__file__).resolve().parent.parent
EMPTY = {'', '-', '—', 'None', 'N/A', 'n/a'}
PLACEHOLDER = '—'


def clean(v):
    v = str(v or '').strip()
    return '' if v in EMPTY else v


def esc(v):
    return html.escape(v, quote=True)


# ---------------------------------------------------------------- load data
details = {}
for line in ('gmp', 'research', 'cosmetic', 'nutra', 'vet'):
    text = (D / 'assets' / 'data' / 'details' / f'{line}.js').read_text()
    match = re.search(r'PEP_DETAILS\|\|\{\},(\{.*\})\);\s*$', text, re.S)
    details.update(json.loads(match.group(1)))

cat_text = (D / 'assets' / 'catalog.js').read_text()
catalog = json.loads(re.search(r'window\.CATALOG\s*=\s*(\{.*\})\s*;?\s*$', cat_text, re.S).group(1))
old_cas = {p['slug']: clean(p.get('cas')) for p in catalog['products']}

by_slug = {}
for slug, rec in details.items():
    cas = clean(rec.get('cas')) or old_cas.get(slug, '')
    by_slug[slug] = {
        'cas': cas or PLACEHOLDER,
        'seq': clean(rec.get('seq')) or PLACEHOLDER,
        'name': rec['name'],
        'ref': rec['ref'],
        'sub': rec.get('subLabel') or rec.get('sub') or '',
    }

# ---------------------------------------------------------------- cell markup
def cas_cell(cas):
    if cas == PLACEHOLDER:
        return '<td class="c-cas"><span class="cas-none" title="No CAS registry number assigned">—</span></td>'
    return f'<td class="c-cas"><span class="c">{esc(cas)}</span></td>'


def seq_cell(seq):
    if seq == PLACEHOLDER:
        return '<td class="c-seq"><span class="seq-none">—</span></td>'
    return f'<td class="c-seq"><code title="{esc(seq)}">{esc(seq)}</code></td>'


def mobile_seq(seq):
    if seq == PLACEHOLDER:
        return ''
    return f'<span class="c-seq-m" title="{esc(seq)}">SEQ · {esc(seq)}</span>'


# ---------------------------------------------------------------- patch page
path = D / 'products.html'
s = path.read_text()

# idempotency: drop a previously generated sequence column / mobile span
s = re.sub(r'\s*<th class="c-seq">.*?</th>', '', s)
s = re.sub(r'\s*<td class="c-seq">.*?</td>', '', s)
s = re.sub(r'<span class="c-seq-m"[^>]*>.*?</span>', '', s)

# table headers
n_head = s.count('<th class="c-cas">CAS Number</th>')
s = s.replace('<th class="c-cas">CAS Number</th>',
              '<th class="c-cas">CAS Number</th>\n            <th class="c-seq">Sequence</th>')

row_re = re.compile(r'(<tr data-sub="[^"]*" data-q=")[^"]*(">)(.*?)(</tr>)', re.S)
counts = {'rows': 0, 'cas_filled': 0, 'seq_filled': 0, 'missing': []}


def patch_row(m):
    body = m.group(3)
    link = re.search(r'href="product\.html\?p=([^"]+)"', body)
    if not link:
        return m.group(0)
    slug = link.group(1)
    rec = by_slug.get(slug)
    if not rec:
        counts['missing'].append(slug)
        return m.group(0)

    # refresh the CAS cell and append the sequence cell
    new_cells = cas_cell(rec['cas']) + '\n          ' + seq_cell(rec['seq'])
    body, n = re.subn(r'<td class="c-cas">.*?</td>', lambda _: new_cells, body, count=1, flags=re.S)
    if not n:
        counts['missing'].append(slug + ' (no CAS cell)')
        return m.group(0)

    # mobile-only sequence under the product name, after the catalog no.
    if rec['seq'] != PLACEHOLDER:
        body = body.replace('</span></td>', '</span>' + mobile_seq(rec['seq']) + '</td>', 1)

    # rebuild the search index: name + CAS + ref + subcategory + sequence
    q = ' '.join(x for x in (
        rec['name'],
        '' if rec['cas'] == PLACEHOLDER else rec['cas'],
        rec['ref'], rec['sub'],
        '' if rec['seq'] == PLACEHOLDER else rec['seq'],
    ) if x).lower()

    counts['rows'] += 1
    counts['cas_filled'] += rec['cas'] != PLACEHOLDER
    counts['seq_filled'] += rec['seq'] != PLACEHOLDER
    return m.group(1) + esc(q) + m.group(2) + body + m.group(4)


s = row_re.sub(patch_row, s)
path.write_text(s)

# ---------------------------------------------------------------- sync catalog.js
for p in catalog['products']:
    rec = by_slug.get(p['slug'])
    if not rec:
        continue
    p['cas'] = '' if rec['cas'] == PLACEHOLDER else rec['cas']
    p['seq'] = '' if rec['seq'] == PLACEHOLDER else rec['seq']
(D / 'assets' / 'catalog.js').write_text(
    'window.CATALOG = ' + json.dumps(catalog, ensure_ascii=False, indent=1) + ';\n'
)

print(f'headers patched: {n_head} | rows patched: {counts["rows"]}')
print(f'CAS filled: {counts["cas_filled"]}/{counts["rows"]} | sequences filled: {counts["seq_filled"]}/{counts["rows"]}')
print('slugs without data:', counts['missing'][:10] or 'none')
