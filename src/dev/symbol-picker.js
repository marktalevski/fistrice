// Local-only symbol picker for designing the Home symbols. astro.config.mjs injects it under `npm run dev` only, so the published
// site never has it: there the ink dot keeps picking at random.
// A row of symbol names along the top of Home: click one to brush it in, or press ← / → to step through them.
const home = () => window.__home;
let bar = null, want = null, timer = 0;

// the symbol is still being drawn (or a transition is running): keep asking until Home takes it
function show(name) {
  want = name; clearTimeout(timer);
  const tryIt = (n) => { const h = home(); if (want !== name) return; if (h && h.shuffle(name)) { want = null; mark(); return; } if (n < 60) timer = setTimeout(() => tryIt(n + 1), 100); };
  tryIt(0); mark();
}

function mark() {
  const cur = want || (home() && home().shapeName);
  if (bar) for (const b of bar.children) { const on = b.dataset.name === cur; b.style.background = on ? '#141414' : 'transparent'; b.style.color = on ? '#f5f3ee' : '#141414'; }
}

function build() {
  const h = home(); if (!h || !h.shapeName) { setTimeout(build, 200); return; }
  const names = h.constructor.SHAPES || [];
  bar = document.createElement('div');
  bar.setAttribute('data-dev', 'symbol-picker');
  bar.style.cssText = 'position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:50;display:flex;flex-wrap:wrap;justify-content:center;gap:4px;max-width:calc(100vw - 32px);padding:6px;border-radius:10px;background:rgba(245,243,238,.85);backdrop-filter:blur(4px);font:12px/1 system-ui, sans-serif;box-shadow:0 1px 6px rgba(0,0,0,.12)';
  for (const n of names) {
    const b = document.createElement('button'); b.textContent = n; b.dataset.name = n;
    b.style.cssText = 'border:1px solid #14141433;border-radius:6px;padding:4px 7px;cursor:pointer;font:inherit';
    b.onclick = () => show(n);
    bar.appendChild(b);
  }
  document.body.appendChild(bar); mark();
  addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const cur = want || home().shapeName, i = names.indexOf(cur), d = e.key === 'ArrowRight' ? 1 : -1;
    show(names[(i + d + names.length) % names.length]);
  });
  // the ink dot's own shuffle still works; keep the highlight in step with it
  setInterval(mark, 500);
}

// only on Home, which is the page that sets window.__home
if (/\/markt\/?$/.test(location.pathname) || /\/markt\/index\.html$/.test(location.pathname)) build();
