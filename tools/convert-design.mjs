// Converter: Claude Design .dc.html → React component (logic copied verbatim,
// template turned into JSX) + Astro page. It was used once to build the site; the
// generated files have been edited since, so never point it at this repo's src/.
// For a new design version, write into a scratch folder and diff against src/:
//   node tools/convert-design.mjs Mark-T-Website ../scratch-site
import { parse } from 'parse5';
import fs from 'node:fs';
import path from 'node:path';

const [designDir, root] = process.argv.slice(2);

const PAGES = [
  { file: 'Home - Brush Lines v2.dc.html', name: 'Home', route: 'index', title: 'Mark T' },
  { file: 'Freediving v2.dc.html', name: 'Freediving', route: 'freediving', title: 'Freediving · Mark T' },
  { file: 'Sound.dc.html', name: 'Sound', route: 'sound', title: 'Sound · Mark T' },
  { file: 'Journal.dc.html', name: 'Journal', route: 'journal', title: 'Journal · Mark T' },
  { file: 'Site Editor.dc.html', name: 'Editor', route: 'editor', title: 'Editor · Mark T', noindex: true },
];

// design file name (either spelling) → path under the site base
const LINKS = [
  ['Home%20-%20Brush%20Lines%20v2', ''], ['Home - Brush Lines v2', ''],
  ['Freediving%20v2', 'freediving/'], ['Freediving v2', 'freediving/'],
  ['Site%20Editor', 'editor/'], ['Site Editor', 'editor/'],
  ['Sound', 'sound/'], ['Journal', 'journal/'],
];
const linkFor = href => { for (const [f, r] of LINKS) if (href.startsWith(f + '.dc.html')) return r + href.slice((f + '.dc.html').length); return null; };

const EVENTS = { onclick: 'onClick', onmouseenter: 'onMouseEnter', onmouseleave: 'onMouseLeave', onfocus: 'onFocus', onblur: 'onBlur', onchange: 'onChange', oninput: 'onInput', onkeydown: 'onKeyDown' };
const RENAME = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex', crossorigin: 'crossOrigin', readonly: 'readOnly', maxlength: 'maxLength' };
const VOID = new Set(['input', 'img', 'br', 'hr', 'meta', 'link']);
const DROP = new Set(['hint-placeholder-val', 'hint-placeholder-count']);

const attr = (el, n) => (el.attrs.find(a => a.name === n) || {}).value;
const kids = el => (el.tagName === 'template' ? el.content : el).childNodes || [];

function expr(src, scope) {
  const e = src.trim();
  if (e === 'true' || e === 'false' || /^-?\d+(\.\d+)?$/.test(e)) return e;
  if (!/^[$A-Za-z_][$\w]*(\.[$A-Za-z_][$\w]*)*$/.test(e)) throw new Error('unexpected template expression: ' + e);
  const [head, ...rest] = e.split('.');
  return (scope.has(head) ? head : 'v.' + head) + rest.map(r => '?.' + r).join('');
}
// "a {{ x }} b" → JS expression string
function interp(s, scope) {
  const parts = s.split(/\{\{([\s\S]+?)\}\}/g);
  if (parts.length === 1) return JSON.stringify(s);
  if (parts.length === 3 && parts[0] === '' && parts[2] === '') return expr(parts[1], scope);
  return '`' + parts.map((p, i) => i & 1 ? '${' + expr(p, scope) + ' ?? \'\'}' : p.replace(/[`\\$]/g, c => '\\' + c)).join('') + '`';
}

function jsx(node, scope, ind) {
  const pad = '  '.repeat(ind);
  if (node.nodeName === '#text') {
    const t = node.value;
    if (!t.includes('{{')) { if (!t.trim() && !t.includes(' ')) return ''; return pad + '{' + JSON.stringify(t) + '}\n'; }
    return t.split(/\{\{([\s\S]+?)\}\}/g).map((p, i) => i & 1 ? pad + '{' + expr(p, scope) + '}\n' : p ? pad + '{' + JSON.stringify(p) + '}\n' : '').join('');
  }
  if (node.nodeName === '#comment' || !node.tagName) return '';
  const tag = node.tagName;
  if (tag === 'sc-for') {
    const as = attr(node, 'as') || 'item', sub = new Set([...scope, as, '$index']);
    const list = interp(attr(node, 'list') || '', scope);
    return pad + '{(' + list + ' || []).map((' + as + ', $index) => (\n' + pad + '  <React.Fragment key={$index}>\n' +
      kids(node).map(c => jsx(c, sub, ind + 2)).join('') + pad + '  </React.Fragment>\n' + pad + '))}\n';
  }
  if (tag === 'sc-if') {
    return pad + '{' + interp(attr(node, 'value') || '', scope) + ' ? (\n' + pad + '  <>\n' +
      kids(node).map(c => jsx(c, scope, ind + 2)).join('') + pad + '  </>\n' + pad + ') : null}\n';
  }
  if (tag.includes('-')) throw new Error('unsupported tag: ' + tag);
  const props = [];
  for (const { name, value } of node.attrs) {
    if (DROP.has(name)) continue;
    let k = EVENTS[name] || RENAME[name] || name;
    if (name.startsWith('on') && !EVENTS[name]) throw new Error('unmapped event: ' + name);
    if (name === 'style') { props.push('style={sty(' + interp(value, scope) + ')}'); continue; }
    if (name === 'href' && !value.includes('{{')) { const r = linkFor(value); if (r != null) { props.push('href={BASE + ' + JSON.stringify(r) + '}'); continue; } }
    const v = interp(value, scope);
    props.push(v.startsWith('"') ? k + '=' + v : k + '={' + v + '}');
  }
  const open = '<' + tag + (props.length ? ' ' + props.join(' ') : '');
  const ch = kids(node);
  if (VOID.has(tag) || !ch.length) return pad + open + ' />\n';
  return pad + open + '>\n' + ch.map(c => jsx(c, scope, ind + 1)).join('') + pad + '</' + tag + '>\n';
}

const find = (n, pred) => { if (pred(n)) return n; for (const c of n.childNodes || []) { const r = find(c, pred); if (r) return r; } return null; };

for (const P of PAGES) {
  const doc = parse(fs.readFileSync(path.join(designDir, P.file), 'utf8'));
  const xdc = find(doc, n => n.tagName === 'x-dc');
  const helmet = find(xdc, n => n.tagName === 'helmet');
  const script = find(doc, n => n.tagName === 'script' && attr(n, 'type') === 'text/x-dc');
  let code = script.childNodes.map(c => c.value).join('');
  const propsDef = attr(script, 'data-props');
  const defaults = {};
  if (propsDef) for (const [k, d] of Object.entries(JSON.parse(propsDef))) defaults[k] = d.default;

  // page links and the data module, as the built site names them
  code = code.replace(/(['"`])([^'"`]*?)\.dc\.html/g, (m, q, f) => { const r = linkFor(f + '.dc.html'); if (r == null) throw new Error('unknown page link ' + m); return 'BASE + ' + q + r; });
  code = code.replace(/import\((['"])\.\/site-data\.js\1\)/g, "import('../lib/site-data.js')");
  if (/\.dc\.html|support\.js/.test(code)) throw new Error(P.file + ': leftover design reference');

  const tpl = kids(xdc).filter(n => n !== helmet);
  const body = tpl.map(n => jsx(n, new Set(), 2)).join('');
  const out = `// Carried over from the Claude Design file "${P.file}".
// The logic class is the design's own code; View is its template as JSX.
import React from 'react';
import { DCLogic, page, sty, BASE } from '../lib/dc.js';
${code.replace(/^\n+/, '\n').replace(/\s+$/, '\n')}
function View(v) {
  return (
    <>
${body}    </>
  );
}

export default page(Component, View, ${JSON.stringify(defaults)});
`;
  fs.mkdirSync(path.join(root, 'src/components'), { recursive: true });
  fs.writeFileSync(path.join(root, 'src/components', P.name + '.jsx'), out);

  // head: the design's font links and page CSS
  const headLinks = kids(helmet).filter(n => n.tagName === 'link').map(n => '    <link ' + n.attrs.map(a => a.value === '' ? a.name : `${a.name}="${a.value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`).join(' ') + ' />').join('\n');
  const styleText = kids(helmet).filter(n => n.tagName === 'style').map(n => kids(n).map(c => c.value).join('')).join('\n').trim();
  const astro = `---
import Base from '../layouts/Base.astro';
import ${P.name} from '../components/${P.name}.jsx';
---
<Base title=${JSON.stringify(P.title)}${P.noindex ? ' noindex' : ''}>
  <Fragment slot="head">
${headLinks}
    <style is:inline>
${styleText.split('\n').map(l => '      ' + l).join('\n')}
    </style>
  </Fragment>
  <${P.name} client:only="react" />
</Base>
`;
  fs.mkdirSync(path.join(root, 'src/pages'), { recursive: true });
  fs.writeFileSync(path.join(root, 'src/pages', P.route + '.astro'), astro);
  console.log('ok', P.file, '→', P.name + '.jsx', Object.keys(defaults).length ? defaults : '');
}
