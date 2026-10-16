// Carried over from the Claude Design file "Sound.dc.html".
// The logic class is the design's own code; View is its template as JSX.
import React from 'react';
import { DCLogic, page, sty, BASE } from '../lib/dc.js';

const PAGE = 'sound';
const COL = [232, 34, 44];
const HOME = BASE + '?from=dive';
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = x => x * x * (3 - 2 * x);
const easeIO = k => .5 - .5 * Math.cos(Math.PI * k);
const rng = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const TAU = Math.PI * 2;
// each kind of piece has its own colour, from the site's palette; tint is the pale version the haze style glows in
const KINDS = { field: { label: 'Field', cs: 'rgb(22,168,82)', tint: 'rgb(170,232,196)' }, music: { label: 'Music', cs: 'rgb(232,34,44)', tint: 'rgb(255,172,168)' }, voice: { label: 'Voice', cs: 'rgb(138,64,214)', tint: 'rgb(212,186,248)' } };
// two art directions. many: the wave is built of hundreds of small coloured pieces, like cut paper set in layers of glass.
// haze: a cold misty ground with grain and drifting light, and the wave as thin glowing lines
const THEMES = {
  many: { bg: '#0e1117', ink: '#f3efe6', muted: '#a9a49a', disp: "'Newsreader', Georgia, serif", dispStyle: 'italic', dispW: 300, dispCase: 'none', dispLs: '-0.025em', body: "'Newsreader', Georgia, serif", neutral: '#e9e3d6', grain: .16, dispSize: 'min(clamp(56px, 9vw, 112px), 14vh)', labBg: 'transparent', labPad: '0', labRad: '0', labSh: 'none', listBg: 'transparent', listPad: '0', listRad: '0', trSize: 'clamp(18px, 2.8vh, 22px)', trCase: 'none', trLs: 'normal', chipPad: '6px 0' },
  haze: { bg: '#2a3036', ink: '#f4f6f7', muted: '#c9d1d7', disp: "'Six Caps', 'Hanken Grotesk', sans-serif", dispStyle: 'normal', dispW: 400, dispCase: 'uppercase', dispLs: '0.01em', body: "'Hanken Grotesk', system-ui, sans-serif", neutral: '#eef3f6', grain: .34, dispSize: 'min(clamp(56px, 9vw, 112px), 14vh)', labBg: 'transparent', labPad: '0', labRad: '0', labSh: 'none', listBg: 'transparent', listPad: '0', listRad: '0', trSize: 'clamp(18px, 2.8vh, 22px)', trCase: 'none', trLs: 'normal', chipPad: '6px 0' },
  // stark: pale grey ground, black lines, white label strips with black type
  stark: { bg: '#dfdfdc', ink: '#0c0c0c', muted: '#45474a', disp: "'Michroma', 'Hanken Grotesk', sans-serif", dispStyle: 'normal', dispW: 400, dispCase: 'uppercase', dispLs: '0.02em', body: "'JetBrains Mono', monospace", neutral: '#0c0c0c', grain: .12, dispSize: 'min(clamp(36px, 5.6vw, 72px), 9vh)', labBg: '#f7f7f5', labPad: '.3em .5em .24em', labRad: '.14em', labSh: '0 1px 2px rgba(0,0,0,.14)', listBg: '#f7f7f5', listPad: '2px 14px', listRad: '4px', trSize: '13px', trCase: 'uppercase', trLs: '.04em', chipPad: '5px 9px' }
};
// the cut-paper colours mixed in among a piece's own colour
const PAL = ['rgb(232,34,44)', 'rgb(255,196,0)', 'rgb(24,88,224)', 'rgb(255,118,18)', 'rgb(22,168,82)', 'rgb(138,64,214)', 'rgb(244,138,172)', 'rgb(233,227,214)', 'rgb(110,200,230)'];
// albums are just categories. Placeholder pieces: give one a src (an audio file next to this page) and it plays that file with its real waveform;
// without one it plays a synthesised stand-in of its kind. dur is in seconds (taken from the file when there is one)
const ALBUMS = [
  // img: the album's photo (black & white, white ground) laid into the page in the stark style; imgX: 0 puts it flush left, 1 flush against the panel; imgY: shift up (negative) as a fraction of the page height; imgFlip: upside down; imgMirror: left to right.
  // other photos ready to swap in: images/stair-ramp.jpg, images/great-buddha.jpg, images/wave-figure.jpg
  { title: 'Water', img: BASE + 'images/lone-tree.jpg', imgX: 1, imgY: -.2, tracks: [
    { title: 'Low tide, Panglao', kind: 'field', date: '2026-11-06', dur: 134 },
    { title: 'Breathe-up before a dive', kind: 'voice', date: '2026-11-12', dur: 65 },
    { title: 'Boat engine, 6 a.m.', kind: 'field', date: '2026-11-15', dur: 92 },
    { title: 'Surface', kind: 'music', date: '2026-12-01', dur: 188 }] },
  { title: 'Studio', img: BASE + 'images/great-buddha.jpg', imgX: 1, imgMirror: true, tracks: [
    { title: 'Sketch no. 4', kind: 'music', date: '2026-03-02', dur: 166 },
    { title: 'Tape loop', kind: 'music', date: '2026-04-19', dur: 118 },
    { title: 'Late take, talking', kind: 'voice', date: '2026-05-07', dur: 52 }] },
  { title: 'Notes', img: BASE + 'images/driftwood.jpg', imgX: 1, imgFlip: true, tracks: [
    { title: 'Voice memo, train', kind: 'voice', date: '2026-02-11', dur: 80 },
    { title: 'Rain on the roof', kind: 'field', date: '2026-06-23', dur: 160 },
    { title: 'Humming the melody', kind: 'voice', date: '2026-08-30', dur: 38 }] }
];
// cyberpunk accents for the stark style: neon magenta and cyan
const NEON_M = '#ff2bd6', NEON_C = '#00e5ff';
const pad2 = n => String(n).padStart(2, '0');
const fmtDate = iso => { const d = new Date(iso + 'T12:00:00'); return isNaN(d) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };
const fmtDur = s => Math.floor(s / 60) + ':' + pad2(Math.floor(s % 60));
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0; };
// a piece's loudness over its length, 0..1 at N_ENV points: swells for field recordings, sections and beats for music, phrases and pauses for voice
const N_ENV = 400;
function envOf(tr) {
  const r = rng(hash(tr.title)), e = new Float32Array(N_ENV);
  if (tr.kind === 'field') { const f = [1 + r() * 2, 3 + r() * 3, 7 + r() * 5], p = [r() * 6, r() * 6, r() * 6]; for (let i = 0; i < N_ENV; i++) { const u = i / N_ENV; e[i] = .5 + .2 * Math.sin(u * f[0] * TAU + p[0]) + .12 * Math.sin(u * f[1] * TAU + p[1]) + .06 * Math.sin(u * f[2] * TAU + p[2]) + (r() - .5) * .14; } }
  else if (tr.kind === 'music') { const secs = [.35, .6, .9, .55, .95, .4]; for (let i = 0; i < N_ENV; i++) { const k = Math.min(secs.length - 1, Math.floor(i / N_ENV * secs.length)); e[i] = secs[k] * (.78 + .22 * Math.abs(Math.sin(i * Math.PI / 4))) + (r() - .5) * .1; } }
  else { let i = 0; while (i < N_ENV) { const L = 10 + Math.floor(r() * 24), lv = .5 + r() * .4; for (let k = 0; k < L && i < N_ENV; k++) e[i++] = lv * (.6 + .4 * r()); const G = 3 + Math.floor(r() * 7); for (let k = 0; k < G && i < N_ENV; k++) e[i++] = .04 + r() * .04; } }
  const o = new Float32Array(N_ENV); for (let i = 0; i < N_ENV; i++) { const a = e[Math.max(0, i - 1)], b = e[Math.min(N_ENV - 1, i + 1)]; o[i] = clamp((a + 2 * e[i] + b) / 4 * Math.min(1, i / 6, (N_ENV - 1 - i) / 6), .03, 1); }
  return o;
}
function envFromBuf(buf) { const d = buf.getChannelData(0), e = new Float32Array(N_ENV), step = Math.max(4, Math.floor(d.length / N_ENV)); let mx = 1e-6;
  for (let i = 0; i < N_ENV; i++) { let s = 0, c = 0; for (let j = i * step; j < (i + 1) * step && j < d.length; j += 4) { s += d[j] * d[j]; c++; } e[i] = Math.sqrt(s / Math.max(1, c)); mx = Math.max(mx, e[i]); }
  for (let i = 0; i < N_ENV; i++) e[i] = .04 + .9 * e[i] / mx; return e; }
const envAt = (e, u) => { const x = clamp(u, 0, 1) * (e.length - 1), i = Math.floor(x), f = x - i; return e[i] * (1 - f) + e[Math.min(e.length - 1, i + 1)] * f; };
// an album's pieces end to end, for the resting wave, and which piece sits at each point of it
const mixOf = tracks => { const tot = tracks.reduce((s, t) => s + t.dur, 0), e = new Float32Array(N_ENV); for (let i = 0; i < N_ENV; i++) { let u = i / (N_ENV - 1) * tot, k = 0; while (k < tracks.length - 1 && u > tracks[k].dur) { u -= tracks[k].dur; k++; } e[i] = envAt(tracks[k].env, u / tracks[k].dur); } return e; };
const kindAt = (tracks, u) => { const tot = tracks.reduce((s, t) => s + t.dur, 0); let v = u * tot, k = 0; while (k < tracks.length - 1 && v > tracks[k].dur) { v -= tracks[k].dur; k++; } return tracks[k].kind; };
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16];
const VOWELS = [[730, 1090], [270, 2290], [300, 870], [530, 1840], [660, 1720], [440, 1020]];
// pieces per half-column in the many style
const FK = 20;
// pixel faces for the panel screen, on a 12 x 10 grid: lit cells for page k at time t (blinks, bubbles, singing, thinking dots)
const FACE = (k, t) => { const P = [], put = a => a.forEach(p => P.push(p)), blink = t % 3.6 < .14;
  const eyes = (dx = 0) => put(blink ? [[3 + dx, 3], [4 + dx, 3], [7 + dx, 3], [8 + dx, 3]] : [[3 + dx, 2], [4 + dx, 2], [7 + dx, 2], [8 + dx, 2], [3 + dx, 3], [4 + dx, 3], [7 + dx, 3], [8 + dx, 3]]);
  if (k === 0) { eyes(); put([[2, 6], [9, 6], [3, 7], [8, 7], [4, 8], [5, 8], [6, 8], [7, 8]]); }
  else if (k === 1) { put([[3, 2], [4, 3], [3, 4], [8, 2], [7, 3], [8, 4], [5, 6], [6, 6], [4, 7], [7, 7], [5, 8], [6, 8]]); const b = Math.floor(t * 4) % 7; if (b < 6) P.push([10, 8 - b]); if (b > 2) P.push([11, 10 - b]); }
  else if (k === 2) { put(blink ? [[3, 3], [4, 3], [5, 3], [7, 3], [8, 3], [9, 3]] : [[4, 2], [3, 3], [5, 3], [8, 2], [7, 3], [9, 3]]);
    put(Math.floor(t * 5) % 2 ? [[4, 6], [5, 6], [6, 6], [7, 6], [4, 7], [7, 7], [4, 8], [5, 8], [6, 8], [7, 8]] : [[5, 7], [6, 7], [5, 8], [6, 8]]); const ny = Math.floor(t * 3) % 2; put([[11, ny], [11, 1 + ny], [10, 2 + ny]]); }
  else { eyes(1); put([[4, 7], [5, 7], [6, 7], [7, 7]]); const d = Math.floor(t * 2.5) % 4; for (let q = 0; q < d; q++) P.push([7 + q * 2, 0]); }
  return P; };
// pointer over empty ground: a pause sign while a piece plays, a play sign while it is paused (black with a white edge so it reads on any ground)
const svgCur = body => "url(\"data:image/svg+xml," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'><g fill='#0c0c0c' stroke='#fff' stroke-width='1.5' stroke-linejoin='round'>" + body + "</g></svg>") + "\") 16 16, pointer";
const CUR_PAUSE = svgCur("<rect x='8.5' y='7' width='5.5' height='18' rx='1'/><rect x='18' y='7' width='5.5' height='18' rx='1'/>");
const CUR_PLAY = svgCur("<path d='M10 6.5 L25 16 L10 25.5 Z'/>");
const CUR_SCRUB = svgCur("<rect x='14.5' y='4' width='3' height='24' rx='1'/><path d='M3.5 16 L11 10.5 L11 21.5 Z'/><path d='M28.5 16 L21 10.5 L21 21.5 Z'/>");

class Component extends DCLogic {
  state = { navHov: null, album: 0, hover: null, playing: null, paused: false, W: 1200, H: 800 };
  canvasRef = React.createRef(); contentRef = React.createRef(); rootRef = React.createRef(); flapA = React.createRef(); flapB = React.createRef(); wheelRef = React.createRef();
  wvOf() { return (this.props.deck ?? true) ? innerWidth - 194 : innerWidth; }
  freeEl(el) { return !!el && !(el.closest && el.closest('button:not([aria-label="Pause"]),a,ol,h2,p,[data-navk]')); }
  // the band round the wave where the pointer scrubs instead of pausing / resuming
  inBand(x, y, el) { const c = this.cur; if (!c || this.strip || x == null || x > this.wvOf() || !this.freeEl(el)) return false; return Math.abs(x - this.posOf() / c.tr.dur * this.wvOf()) < 9; }
  setCursor(el, x, y) { const r = this.rootRef.current; if (!r) return; if (el) { this.curEl = el; this.mp = [x, y]; } el = this.curEl; const [mx, my] = this.mp || [], c = this.cur, free = this.freeEl(el), band = !!this.scrub || this.inBand(mx, my, el);
    this.hx = this.scrub ? this.scrub.x : null;
    const v = c && free ? (band ? CUR_SCRUB : c.paused ? CUR_PLAY : CUR_PAUSE) : ''; if (r.style.cursor !== v) r.style.cursor = v; }
  seek(u) { const c = this.cur; if (!c) return; const off = clamp(u, 0, 1) * c.tr.dur; if (c.paused) { c.off = off; this.forceUpdate(); } else this.play(c.tr, off); }
  // arriving from another page, once the dots have become faders the page tunes in like a radio finding its station:
  // sig is the signal strength, rising with a few dropouts; u is the time since tuning began
  tuneAt(t) { if (!this.arr) return null; const u = t - 1.6; if (u > 1.9) return null; const drop = [.3, .55, .82].reduce((m, c) => Math.max(m, Math.exp(-(((u - c) / .035) ** 2))), 0); return { u, sig: u <= 0 ? 0 : clamp(smooth(clamp(u / 1.2, 0, 1)) * (1 - .75 * drop), 0, 1) }; }
  recentScrub() { return performance.now() - (this.scrubAt || 0) < 350; }
  scrubDown = e => { if (e.button || !this.inBand(e.clientX, e.clientY, e.target)) return; e.preventDefault(); this.scrub = { x: e.clientX }; this.hx = e.clientX;
    // the playhead itself follows the pointer; a playing piece jumps along with it every few frames (rough, like dragging tape)
    const mv = ev => { this.scrub.x = clamp(ev.clientX, 0, this.wvOf()); const now = performance.now(), c = this.cur;
      if (c && !c.paused && now - (this.scrub.at || 0) > 70) { this.scrub.at = now; const sc = this.scrub; this.scrub = null; this.seek(sc.x / this.wvOf()); this.scrub = sc; } };
    const up = ev => { removeEventListener('mousemove', mv); removeEventListener('mouseup', up); const u = this.scrub.x / this.wvOf(); this.scrub = null; this.scrubAt = performance.now(); this.seek(u); this.setCursor(ev.target, ev.clientX, ev.clientY); };
    addEventListener('mousemove', mv); addEventListener('mouseup', up); };
  t = 0; live = 0; mx = 0; pf = 0; labs = {}; S = [0, 1, 2, 3, 4, 5, 6].map(() => ({ on: 0, k: 0, yp: 300, y0: 300, tp: -9 }));
  albums = ALBUMS.map((a, ai) => { const tracks = a.tracks.map((tr, ti) => ({ ...tr, id: ai + '-' + ti, ai, ti, env: envOf(tr) })); return { ...a, tracks, mix: mixOf(tracks) }; });
  strip = false;
  get look() { const s = this.props.style ?? 'stark'; return THEMES[s] ? s : 'stark'; }
  componentDidMount() {
    // arriving from Home or Freediving: their menu dots are handed over and fly in to become this page's faders
    if (/from=page/.test(location.search)) try { const nf = JSON.parse(sessionStorage.getItem('nav-from') || 'null'); if (nf) this.arr = { nf }; sessionStorage.removeItem('nav-from'); } catch (e) {}
    const r = rng(7), gc = document.createElement('canvas'); gc.width = gc.height = 220;
    { const x = gc.getContext('2d'), im = x.createImageData(220, 220); for (let i = 0; i < im.data.length; i += 4) { const v = 128 + (r() - .5) * 150; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } x.putImageData(im, 0, 0); }
    this.grainC = gc; this.lc = document.createElement('canvas');
    this.setState({ W: innerWidth, H: innerHeight });
    this.onResize = () => this.setState({ W: innerWidth, H: innerHeight });
    // one album per scroll gesture: a gesture is armed after a short pause in wheel events and fires once it has moved far enough
    this.onWheel = e => { const now = performance.now(); if (now - (this.lastWheel || 0) > 180) { this.acc = 0; this.armed = true; } this.lastWheel = now; this.acc += e.deltaY; if (this.armed && Math.abs(this.acc) > 30 && now - (this.lastStep || 0) > 650) { this.armed = false; this.lastStep = now; this.step(this.acc > 0 ? 1 : -1); } };
    this.onKey = e => { const tg = e.target && e.target.tagName || ''; if (/INPUT|TEXTAREA|SELECT/.test(tg)) return; const k = e.key;
      if (k === 'ArrowDown' || k === 'PageDown') { e.preventDefault(); this.step(1); } else if (k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); this.step(-1); }
      else if (k === ' ' && this.cur && !/BUTTON|^A$/.test(tg)) { e.preventDefault(); this.toggle(); } else if (k === 'Escape') this.stop(); };
    this.onTS = e => { this.ty = e.touches[0].clientY; }; this.onTE = e => { if (this.ty == null) return; const dy = this.ty - e.changedTouches[0].clientY; this.ty = null; if (Math.abs(dy) > 50) this.step(dy > 0 ? 1 : -1); };
    this.onPM = e => { this.mxT = e.clientX / innerWidth * 2 - 1; };
    addEventListener('resize', this.onResize); addEventListener('wheel', this.onWheel, { passive: true }); addEventListener('keydown', this.onKey); addEventListener('touchstart', this.onTS, { passive: true }); addEventListener('touchend', this.onTE); addEventListener('pointermove', this.onPM);
    // pieces with a file: decode it for its real waveform and length
    this.albums.forEach(a => a.tracks.forEach(tr => { if (!tr.src) return; const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext; if (!OAC) return;
      fetch(tr.src).then(res => res.arrayBuffer()).then(b => new OAC(1, 1, 44100).decodeAudioData(b)).then(buf => { tr.buf = buf; tr.dur = buf.duration; tr.env = envFromBuf(buf); a.mix = mixOf(a.tracks); this.forceUpdate(); }).catch(() => {}); }));
    this.raf = requestAnimationFrame(this.tick);
  }
  componentWillUnmount() { cancelAnimationFrame(this.raf); removeEventListener('resize', this.onResize); removeEventListener('wheel', this.onWheel); removeEventListener('keydown', this.onKey); removeEventListener('touchstart', this.onTS); removeEventListener('touchend', this.onTE); removeEventListener('pointermove', this.onPM); this.stopNodes(); try { this.ac && this.ac.close(); } catch (e) {} }
  componentDidUpdate(prev) { requestAnimationFrame(() => this.setCursor()); if (prev.style !== this.props.style) { this.t = 0; this.disp = null; this.listBottom = 0; } }
  step(d) { this.goAlbum(this.state.album + d)(); }
  goAlbum = a => () => { a = clamp(a, 0, this.albums.length - 1); if (a === this.state.album) return; if (this.strip && this.cur) this.stop(); this.flipPrev = this.state.album; this.flipT0 = this.t; this.setState({ album: a, hover: null }); };
  trById(id) { const [a, b] = id.split('-').map(Number); return this.albums[a].tracks[b]; }
  // ---- sound
  ensureAC() { if (!this.ac) { const AC = window.AudioContext || window.webkitAudioContext; this.ac = new AC(); this.an = this.ac.createAnalyser(); this.an.fftSize = 512; this.an.connect(this.ac.destination); this.anBuf = new Float32Array(512); } if (this.ac.state === 'suspended') this.ac.resume(); }
  play(tr, off = 0) {
    this.stopNodes(); this.ensureAC(); const ac = this.ac, now = ac.currentTime, out = ac.createGain(); out.gain.value = 0; out.connect(this.an);
    const N = { out, list: [] }, on = this.props.synth ?? true;
    if (tr.buf) { const s = ac.createBufferSource(); s.buffer = tr.buf; s.connect(out); out.gain.value = 1; s.start(now, off); N.list.push(s); N.file = 1; }
    else if (on && tr.kind === 'field') { const nb = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = nb.getChannelData(0); let b = 0; for (let i = 0; i < d.length; i++) { b = .97 * b + .03 * (Math.random() * 2 - 1); d[i] = b * 4 + (Math.random() * 2 - 1) * .12; }
      const s = ac.createBufferSource(); s.buffer = nb; s.loop = true; const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600; f.Q.value = .5; s.connect(f); f.connect(out); s.start(); N.list.push(s); N.f = f; }
    else if (on && tr.kind === 'music') { const lead = ac.createOscillator(), ng = ac.createGain(), bass = ac.createOscillator(), bg = ac.createGain(); lead.type = 'triangle'; bass.type = 'sine'; ng.gain.value = 0; bg.gain.value = .45;
      lead.connect(ng); ng.connect(out); bass.connect(bg); bg.connect(out); lead.start(); bass.start(); N.list.push(lead, bass); Object.assign(N, { lead, ng, bass }); }
    else if (on && tr.kind === 'voice') { const saw = ac.createOscillator(), lfo = ac.createOscillator(), lg = ac.createGain(), b1 = ac.createBiquadFilter(), b2 = ac.createBiquadFilter(), g2 = ac.createGain();
      saw.type = 'sawtooth'; saw.frequency.value = 118; lfo.frequency.value = 5.2; lg.gain.value = 2.5; lfo.connect(lg); lg.connect(saw.frequency);
      [b1, b2].forEach(b => { b.type = 'bandpass'; b.Q.value = 9; saw.connect(b); }); g2.gain.value = .6; b1.connect(out); b2.connect(g2); g2.connect(out); saw.start(); lfo.start(); N.list.push(saw, lfo); Object.assign(N, { saw, b1, b2 }); }
    this.cur = { tr, t0: now - off, N, nextNote: off, nextVowel: off, n: Math.floor(off / .3125), seed: hash(tr.title), paused: false, off };
    this.setState({ playing: tr.id, paused: false });
  }
  stopNodes() { const c = this.cur; if (!c || !c.N) return; c.N.list.forEach(n => { try { n.stop(); } catch (e) {} }); try { c.N.out.disconnect(); } catch (e) {} c.N = { list: [] }; }
  stop() { this.stopNodes(); this.cur = null; this.live = 0; if (this.state.playing) this.setState({ playing: null, paused: false }); }
  toggle() { const c = this.cur; if (!c) return; if (c.paused) this.play(c.tr, c.off); else { c.off = this.ac.currentTime - c.t0; this.stopNodes(); c.paused = true; this.setState({ paused: true }); } }
  click(tr) { if (this.cur && this.cur.tr.id === tr.id) this.toggle(); else this.play(tr); }
  posOf() { const c = this.cur; if (!c) return 0; if (this.scrub) return clamp(this.scrub.x / this.wvOf(), 0, 1) * c.tr.dur; return c.paused ? c.off : clamp(this.ac.currentTime - c.t0, 0, c.tr.dur); }
  audioTick() { const c = this.cur; if (!c || c.paused) return; const ac = this.ac, now = ac.currentTime, pos = now - c.t0, tr = c.tr;
    if (pos >= tr.dur) { const nx = this.albums[tr.ai].tracks[tr.ti + 1]; if (nx) this.play(nx); else this.stop(); return; }
    const e = envAt(tr.env, pos / tr.dur), N = c.N;
    if (N.f) { N.out.gain.setTargetAtTime(.32 * e, now, .08); N.f.frequency.setTargetAtTime(220 + 1300 * e * e, now, .12); }
    if (N.lead) { N.out.gain.setTargetAtTime(.1 * (.35 + .65 * e), now, .1);
      while (c.nextNote <= pos + .05) { const deg = SCALE[Math.floor(rng(c.seed + c.n * 7919)() * SCALE.length)], at = now + Math.max(0, c.nextNote - pos); N.lead.frequency.setValueAtTime(220 * Math.pow(2, deg / 12), at); N.ng.gain.setTargetAtTime(1, at, .008); N.ng.gain.setTargetAtTime(0, at + .06, .14);
        if (c.n % 8 === 0) N.bass.frequency.setValueAtTime(55 * Math.pow(2, [0, 5, 7, 3][((c.n / 8) % 4) | 0] / 12), at); c.n++; c.nextNote += .3125; } }
    if (N.saw) { N.out.gain.setTargetAtTime(e > .2 ? .7 * e : 0, now, .03); N.saw.frequency.setTargetAtTime(108 + 22 * Math.sin(pos * .9), now, .2);
      while (c.nextVowel <= pos) { const v = VOWELS[Math.floor(rng(c.seed + (c.nextVowel * 100 | 0))() * VOWELS.length)]; N.b1.frequency.setTargetAtTime(v[0], now, .03); N.b2.frequency.setTargetAtTime(v[1], now, .03); c.nextVowel += .14 + .06 * Math.sin(c.nextVowel * 3); } }
    let lv = e; if (N.file || N.f || N.lead || N.saw) { this.an.getFloatTimeDomainData(this.anBuf); let s = 0; for (let i = 0; i < this.anBuf.length; i++) s += this.anBuf[i] * this.anBuf[i]; lv = clamp(Math.sqrt(s / this.anBuf.length) * 6, 0, 1); }
    this.live += (lv - this.live) * .3; }
  // ---- nav (same as the other pages)
  dotOf(k) { const d = document.querySelector('[data-navk="' + k + '"] [data-navdot]'); if (!d) return null; const r = d.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
  // kind: 'home' (faders turn back into dots and the panel slides away, Home picks the dots up), 'dive' (same, then the dots fly up into Freediving's menu), 'other' (plain fade)
  leave(href, kind) { return e => { if (e) e.preventDefault(); if (this.out) return; this.stop(); this.out = { href, t: 0, k: kind }; }; }
  stay = e => { if (e) e.preventDefault(); };
  goHome = this.leave(HOME, 'home');
  GO = { freediving: this.leave(BASE + 'freediving/', 'dive'), sound: this.stay, journal: this.leave(BASE + 'journal/', 'other') };
  tick = now => {
    this.raf = requestAnimationFrame(this.tick);
    const dt = Math.min(.05, (now - (this.last || now)) / 1000); this.last = now; this.t += dt;
    if (this.arr && (this.t > 4.5 || this.out)) this.arr = null;
    if (this.out) { this.out.t += dt; const lim = this.out.k === 'home' ? 1.25 : this.out.k === 'dive' ? 1.95 : .55;
      if (this.out.t > lim && !this.left) { this.left = true; if (this.out.k === 'home') try { const o = { ...(this.dotPos || {}) }; o.ink = o.home; sessionStorage.setItem('nav-from', JSON.stringify(o)); } catch (x) {} location.href = this.out.href; } }
    this.mx += ((this.mxT || 0) - this.mx) * Math.min(1, dt * 3);
    this.audioTick(); this.draw(dt); this.flipTick(); this.wheelTick(dt);
  };
  // album names sit round an unseen drum centred on the counter: neighbours just above and below, further ones smaller and squashed;
  // changing album rolls the drum, so the next name turns in behind the counter and the old one turns out the other side
  wheelTick(dt) { const box = this.wheelRef.current; if (!box) return; this.wh = this.wh == null ? this.state.album : this.wh + (this.state.album - this.wh) * Math.min(1, dt * 5);
    const sec = this.contentRef.current && this.contentRef.current.querySelectorAll('section')[this.state.album], h2 = sec && sec.querySelector('h2');
    if (h2) { const ty = h2.getBoundingClientRect().top - sec.getBoundingClientRect().top + h2.offsetHeight / 2; this.railY = this.railY == null ? ty : this.railY + (ty - this.railY) * Math.min(1, dt * 8); box.style.top = this.railY.toFixed(1) + 'px'; }
    box.querySelectorAll('[data-wi]').forEach(el => { const d = +el.getAttribute('data-wi') - this.wh, a = d * .5, y = Math.sin(clamp(a, -1.5, 1.5)) * 150, sc = Math.cos(clamp(a, -1.5, 1.5));
      const op = smooth(clamp((Math.abs(y) - 40) / 18, 0, 1)) * clamp((1.45 - Math.abs(a)) / .35, 0, 1) * (.35 + .65 * sc);
      el.style.transform = 'translate(-50%, -50%) translateY(' + y.toFixed(1) + 'px) scaleY(' + sc.toFixed(3) + ')'; el.style.opacity = op.toFixed(3); el.style.pointerEvents = op > .4 ? '' : 'none'; }); }
  // the album counter flips like a clock: the old number's top folds down, then the new number's bottom lands
  flipTick() { const A = this.flapA.current, B = this.flapB.current; if (!A || !B) return; const ft = this.flipT0 == null ? 2 : (this.t - this.flipT0) / .6;
    if (ft >= 1) { if (A.style.visibility !== 'hidden') { A.style.visibility = B.style.visibility = 'hidden'; } if (this.flipPrev != null && this.flipPrev !== this.state.album) { this.flipPrev = this.state.album; this.forceUpdate(); } return; }
    const e = easeIO(clamp(ft, 0, 1)); A.style.visibility = e < .5 ? 'visible' : 'hidden'; A.style.transform = 'rotateX(' + (-180 * e).toFixed(1) + 'deg)'; B.style.visibility = e >= .5 ? 'visible' : 'hidden'; B.style.transform = 'rotateX(' + (180 - 180 * e).toFixed(1) + 'deg)'; }
  // ---- nav strings: Home, Freediving, Sound, Journal and three loose strings run down the right edge. Touching one sets off a sharp synth-like wave on it;
  // touching a page string also slides it (and every string to its left) over, and the page's name shows in the gap
  strOn(i, e) { const S = this.S[i], r = rng((Math.random() * 1e9) | 0); if (S.offAt != null && S.on) { S.offAt = null; return; } S.offAt = null; S.on = 1; S.tv = (S.tv || 0) + (r() - .5) * 1.4; S.tp = this.t; S.yp = e && e.clientY != null ? e.clientY : innerHeight * .3; S.y0 = S.yp;
    S.yp0 = S.ly = S.yp;
    const per = 10 + r() * 20; S.wv = { type: Math.floor(r() * 5), per, half: per * (1.4 + r()), amp: 6 + r() * 6, dir: r() < .5 ? -1 : 1, v: 520 + r() * 420, seed: (r() * 1e6) | 0 }; }
  strMove(i, e) { if (e && e.clientY != null) this.S[i].yp = e.clientY; }
  strOff(i) { this.S[i].offAt = this.t + .18; }
  drawStrings(ctx, W, H, t, dt, TH, live, fo) {
    const look = this.look, md = this.props.strings ?? 'fader', PI = look === 'stark' && (this.props.deck ?? true) ? '#f2f2f0' : TH.ink, PM = look === 'stark' ? '#8a8f94' : TH.muted, cols = [PI, 'rgb(24,88,224)', 'rgb(232,34,44)', 'rgb(255,196,0)', 'rgb(255,118,18)', 'rgb(22,168,82)', 'rgb(138,64,214)'], names = ['Home', 'Freediving', 'Sound', 'Journal'],
      LAB = [PI, 'rgb(120,166,255)', 'rgb(255,112,108)', 'rgb(255,206,60)'], pf = this.pf, lf = look === 'haze' ? "500 14px 'Hanken Grotesk', sans-serif" : look === 'stark' ? "400 11px Michroma, sans-serif" : "italic 400 21px Newsreader, Georgia, serif", nm = i => look !== 'many' ? names[i].toUpperCase() : names[i];
    ctx.font = lf;
    for (let i = 0; i < 7; i++) { const S = this.S[i]; if (S.offAt != null && t >= S.offAt) { S.on = 0; S.tp = t; S.offAt = null; } S.th = S.th || 0; S.tv = (S.tv || 0) + (-S.th * 30 - (S.tv || 0) * 2.2) * dt; S.th += S.tv * dt; S.k += ((S.on ? 1 : 0) - S.k) * Math.min(1, dt * 7); S.ly = (S.ly ?? S.yp) + (S.yp - (S.ly ?? S.yp)) * Math.min(1, dt * 12); }
    // a hovered page string, and every string to its left, moves over by the width of the page's name, opening a gap for it on the string's right
    const open = [0, 1, 2, 3].map(i => { const S = this.S[i]; if (!S.lw || S.lf !== lf) { S.lw = ctx.measureText(nm(i)).width + 34; S.lf = lf; } return easeIO(clamp(S.k, 0, 1)) * S.lw; });
    // asm: how built the panel is (knobs, screen, faders); slide: how far it has slid off to the right
    const A = this.arr, O = this.out && this.out.k !== 'other' ? this.out : null; let asm = 1, slide = 0;
    if (A) { asm = smooth(clamp((t - 1.1) / .6, 0, 1)); slide = 1 - easeIO(clamp((t - .3) / 1, 0, 1)); }
    if (O) { asm = 1 - smooth(clamp(O.t / .45, 0, 1)); slide = easeIO(clamp((O.t - .3) / .8, 0, 1)); }
    const SX = slide * (200 + open.reduce((a2, v) => a2 + v, 0)), foFace = fo; fo = 1 - (1 - fo) * asm;
    const SP = 22, X = j => W + SX - (22 + (6 - j) * SP) - open.reduce((acc, v, i) => acc + (i >= j ? v : 0), 0);
    // the strings sit on a piece of equipment: a dark mixer face that widens as a string opens, with slots, bridges, channel numbers and LEDs
    // hover zones follow the strings and stretch across the open gap, so the pointer stays inside while it moves onto the name
    if (!this.zoneEls || !this.zoneEls.every(el => el && el.isConnected)) this.zoneEls = ['home', 'freediving', 'sound', 'journal', 'c4', 'c5', 'c6'].map(k => document.querySelector('[data-navk="' + k + '"]'));
    this.zoneEls.forEach((el, i) => { if (!el) return; el.style.right = 'auto'; el.style.left = (X(i) - SP / 2).toFixed(1) + 'px'; el.style.width = (SP + (i < 4 ? open[i] : 0)).toFixed(1) + 'px'; });
    let ya = 0, yb = H;
    if (this.props.deck ?? true) {
      const px0 = X(0) - 22, px1 = W + SX, py0 = 0, py1 = H, haze = look === 'haze'; ya = py0 + 168; yb = py1 - 32;
      const cy = look === 'stark' && (this.props.cyber ?? true), rrect = (x, y, w, h, r) => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); };
      ctx.save(); ctx.globalAlpha = 1 - foFace;
      const face = ctx.createLinearGradient(0, py0, 0, py1); face.addColorStop(0, cy ? '#110d1a' : haze ? '#21272d' : look === 'stark' ? '#151515' : '#191d24'); face.addColorStop(1, cy ? '#07060c' : haze ? '#161a1e' : look === 'stark' ? '#0a0a0a' : '#0f1217');
      ctx.fillStyle = face; ctx.fillRect(px0, py0 - 40, px1 - px0 + 40, py1 - py0 + 80);
      ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0;
      if (cy) { // a neon seam down the panel's edge, magenta into cyan, and a faint circuit grid on the face
        const sg = ctx.createLinearGradient(0, py0, 0, py1); sg.addColorStop(0, NEON_M); sg.addColorStop(1, NEON_C); ctx.fillStyle = sg; ctx.shadowColor = NEON_M; ctx.shadowBlur = 12; ctx.fillRect(px0, py0, 1.5, py1 - py0); ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
        ctx.fillStyle = 'rgba(0,229,255,.05)'; for (let gy = py0 + 8; gy < py1; gy += 16) ctx.fillRect(px0 + 2, gy, px1 - px0, 1); }
      else { ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(px0, py0, 1, py1 - py0); }
      // the panel's display: the piece that is playing (scrolling if it is long), its time, and a thin progress line
      // the screen stretches with the panel; the song keeps its fixed spot on the right and the extra room on the left shows the page you are about to go to
      { const c = this.cur, dx0 = W + SX - (22 + 6 * SP) - 22 + 12, dw = px1 - 12 - dx0, dy0 = 14, dh = 46, room = dw - 16, bx = px0 + 12, ext = dx0 - bx;
        ctx.fillStyle = cy ? '#04030a' : '#050607'; rrect(bx, dy0, px1 - 12 - bx, dh, 3); ctx.fill(); ctx.strokeStyle = cy ? 'rgba(0,229,255,.45)' : 'rgba(255,255,255,.07)'; ctx.lineWidth = 1; rrect(bx + .5, dy0 + .5, px1 - 12 - bx - 1, dh - 1, 2.5); ctx.stroke();
        if (ext > 24) { let hi = -1, hk = 0; for (let q = 0; q < 4; q++) if (this.S[q].k > hk) { hk = this.S[q].k; hi = q; }
          ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(dx0 - 1, dy0 + 8, 1, dh - 16);
          if (hi >= 0) { ctx.save(); ctx.beginPath(); ctx.rect(bx + 8, dy0, ext - 14, dh); ctx.clip(); ctx.globalAlpha = (1 - fo) * smooth(clamp((hk - .3) / .7, 0, 1)); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
            // a little pixel face for the page: Home smiles, Freediving holds its breath with bubbles, Sound sings, Journal thinks
            const fp = 3, fx = Math.round(bx + 4 + (ext - 8 - 12 * fp) / 2), fy = dy0 + 8, on = FACE(hi, t); ctx.fillStyle = LAB[hi];
            const ga = ctx.globalAlpha; ctx.globalAlpha = ga * .08; for (let r = 0; r < 10; r++) for (let q = 0; q < 12; q++) ctx.fillRect(fx + q * fp, fy + r * fp, fp - .6, fp - .6);
            ctx.globalAlpha = ga; on.forEach(([q, r]) => ctx.fillRect(fx + q * fp, fy + r * fp, fp - .6, fp - .6)); ctx.restore(); } }
        ctx.save(); ctx.beginPath(); ctx.rect(dx0 + 8, dy0, room, dh); ctx.clip(); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
        if (c) { const pos = this.posOf(), ttl = c.tr.title.toUpperCase(); ctx.font = "500 11px 'JetBrains Mono', monospace"; ctx.fillStyle = cy ? NEON_C : '#e9edf0'; if (cy) { ctx.shadowColor = NEON_C; ctx.shadowBlur = 6; } const tw = ctx.measureText(ttl).width;
          if (tw <= room) ctx.fillText(ttl, dx0 + 8, dy0 + 15); else { const L = tw + 36, o = (t * 28) % L; ctx.fillText(ttl, dx0 + 8 - o, dy0 + 15); ctx.fillText(ttl, dx0 + 8 - o + L, dy0 + 15); }
          ctx.shadowBlur = 0; ctx.font = "400 9.5px 'JetBrains Mono', monospace"; ctx.fillStyle = cy ? NEON_M : PM; ctx.fillText(fmtDur(pos) + ' / ' + fmtDur(c.tr.dur) + (c.paused ? '  PAUSED' : ''), dx0 + 8, dy0 + 30);
          ctx.fillStyle = cy ? 'rgba(0,229,255,.18)' : 'rgba(255,255,255,.12)'; ctx.fillRect(dx0 + 8, dy0 + 38, room, 1.5); ctx.fillStyle = cy ? NEON_M : KINDS[c.tr.kind].cs; if (cy) { ctx.shadowColor = NEON_M; ctx.shadowBlur = 6; } ctx.fillRect(dx0 + 8, dy0 + 38, room * clamp(pos / c.tr.dur, 0, 1), 1.5); }
        else { ctx.font = "400 9.5px 'JetBrains Mono', monospace"; ctx.fillStyle = PM; ctx.fillText('STANDBY', dx0 + 8, dy0 + dh / 2); }
        if (cy) { ctx.shadowBlur = 0; ctx.fillStyle = 'rgba(0,0,0,.35)'; for (let sy2 = dy0 + 1; sy2 < dy0 + dh; sy2 += 2) ctx.fillRect(bx, sy2, px1 - 12 - bx, 1); }
        ctx.restore(); }
      if (md === 'scope') { const sx0 = X(0) - 12, sx1 = W + SX - 12; ctx.globalAlpha = 1 - fo; ctx.fillStyle = '#05080a'; rrect(sx0, ya - 6, sx1 - sx0, yb - ya + 12, 4); ctx.fill();
        ctx.fillStyle = 'rgba(150,220,200,.07)'; for (let i = 0; i < 7; i++) ctx.fillRect(X(i) - .5, ya - 6, 1, yb - ya + 12); for (let y = ya + 24; y < yb; y += 30) ctx.fillRect(sx0, y, sx1 - sx0, 1); }
      ctx.font = "500 9px 'JetBrains Mono', monospace"; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let i = 0; i < 7; i++) { const xs = X(i), S = this.S[i];
        if (md !== 'cable' && md !== 'scope') { ctx.globalAlpha = 1 - fo; ctx.fillStyle = 'rgba(0,0,0,.4)'; rrect(xs - 3, ya, 6, yb - ya, 3); ctx.fill(); }
        ctx.globalAlpha = (1 - fo) * .75; ctx.fillStyle = PM; ctx.fillText(pad2(i + 1), xs, ya - 14);
        // two knobs per channel; a hovered channel's knobs turn up, Sound's twitch with the level
        [84, 120].forEach((ky, r) => { const base = -2.3 + 4.6 * rng(i * 31 + r * 7 + 3)(), ang = base + (i === 2 ? .35 * live * Math.sin(t * 9 + r) : .9 * easeIO(clamp(S.k, 0, 1)));
          ctx.globalAlpha = 1 - fo; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.beginPath(); ctx.arc(xs, ky + 1, 7.2, 0, TAU); ctx.fill();
          ctx.fillStyle = cy ? '#1d1828' : '#2f363d'; ctx.beginPath(); ctx.arc(xs, ky, 6.6, 0, TAU); ctx.fill();
          if (cy) { ctx.strokeStyle = r ? NEON_M : NEON_C; ctx.globalAlpha = (1 - fo) * .85; ctx.lineWidth = 1.2; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 5; ctx.beginPath(); ctx.arc(xs, ky, 8.8, -Math.PI / 2 - 2.3, -Math.PI / 2 + ang); ctx.stroke(); ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'; ctx.globalAlpha = 1 - fo; } ctx.strokeStyle = 'rgba(255,255,255,.1)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(xs, ky, 6.1, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
          ctx.strokeStyle = i < 4 ? cols[i] : PM; ctx.lineWidth = 1.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(xs + Math.sin(ang) * 1.5, ky - Math.cos(ang) * 1.5); ctx.lineTo(xs + Math.sin(ang) * 5.4, ky - Math.cos(ang) * 5.4); ctx.stroke(); ctx.lineCap = 'butt'; });
        // no LED under the fader: the colour lives in the fader cap's stripe, which the menu dots squash into
      }
      // an open channel lights a small meter window in the gap between its knobs and the next channel's
      for (let i = 0; i < 4; i++) { if (open[i] < 24) continue; const S = this.S[i], xs = X(i), ka = smooth(clamp((clamp(S.k, 0, 1) - .3) / .7, 0, 1)) * (1 - fo); if (ka <= .01) continue;
        const x0 = xs + 14, x1 = xs + SP + open[i] - 14, w = x1 - x0; ctx.globalAlpha = ka; ctx.fillStyle = '#0b0e11'; rrect(x0, 70, w, 64, 3); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.07)'; ctx.lineWidth = 1; rrect(x0 + .5, 70.5, w - 1, 63, 2.5); ctx.stroke();
        const nSeg = Math.floor((w - 12) / 6); if (nSeg < 2) continue;
        [84, 120].forEach((ky, r) => { const nz = rng(((t * 12) | 0) * 13 + i * 5 + r)(), lv = live ? clamp(live * (1.15 - .12 * r) + .06 * (nz - .5), 0, 1) : 0;
          for (let q = 0; q < nSeg; q++) { const on = (q + 1) / nSeg <= lv * ka; ctx.globalAlpha = ka * (on ? 1 : .1); ctx.fillStyle = on && q >= nSeg - 2 ? '#f4f6f7' : LAB[i]; ctx.fillRect(x0 + 6 + q * 6, ky - 5, 4, 10); } }); }
      ctx.globalAlpha = 1 - fo; const bx0 = X(0) - 10, bw = W + SX - 14 - bx0;
      [ya - 2, yb - 1].forEach((by, q) => { ctx.fillStyle = cy ? '#241d33' : '#3b444c'; ctx.fillRect(bx0, by, bw, 3); ctx.fillStyle = cy ? (q ? NEON_M : NEON_C) : 'rgba(255,255,255,.14)'; if (cy) { ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8; } ctx.fillRect(bx0, by, bw, 1); ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'; });
      ctx.restore(); ctx.font = lf;
    }
    for (let i = 0; i < 7; i++) { const S = this.S[i], wv = S.wv, xs = X(i), since = t - S.tp, pc = wv ? S.yp0 + wv.dir * wv.v * since : 0, aT = wv && since < (H + 2 * wv.half) / wv.v ? Math.exp(-.5 * since) : 0;
      // each touch picks a fresh hard-edged wave: saw, square, triangle, heartbeat or stepped noise, running along the string round the pointer
      const shape = ph => { const u = ph - Math.floor(ph); switch (wv.type) { case 0: return 2 * u - 1; case 1: return u < .5 ? 1 : -1; case 2: return 1 - 4 * Math.abs(u - .5);
        case 3: return u < .08 ? u / .08 * .25 : u < .12 ? .25 - (u - .08) / .04 * 1.4 : u < .17 ? -1.15 + (u - .12) / .05 * 2.15 : u < .22 ? 1 - (u - .17) / .05 * 1.2 : u < .3 ? -.2 + (u - .22) / .08 * .2 : 0;
        default: return rng(wv.seed + Math.floor(ph * 3))() * 2 - 1; } };
      const dxAt = y => { let d = 0; if (aT > .002 && Math.abs(y - pc) < wv.half) d += wv.amp * aT * (.5 + .5 * Math.cos(Math.PI * (y - pc) / wv.half)) * shape((y - pc) / wv.per + .5);
        if (md === 'scope' && i === 2 && live && this.anBuf) { const q = clamp((y - ya) / (yb - ya), 0, 1); d += this.anBuf[Math.floor(q * 511)] * 40 * Math.sin(Math.PI * q); }
        if (i === 2) d += (live * 3.5 * Math.sin(t * 46 + y * .015) + (t < 1.4 ? 4 * Math.exp(-3 * t) * Math.sin(t * 38) : 0)) * Math.sin(Math.PI * clamp((y - ya) / (yb - ya), 0, 1)); return d; };
      const alpha = (i === 2 ? 1 : 1 - .82 * pf) * (1 - fo) * (i > 3 ? .7 : 1);
      const trace = w => { ctx.beginPath(); let y = ya; ctx.moveTo(xs + dxAt(ya), ya); while (y < yb) { y = Math.min(yb, y + (aT > .002 && Math.abs(y - pc) < wv.half + 12 ? 2 : (md === 'scope' && i === 2 && live ? 3 : 10))); ctx.lineTo(xs + dxAt(y), y); } ctx.lineWidth = w; ctx.stroke(); };
      const kk = clamp(S.k, 0, 1), big = i < 4; ctx.lineJoin = 'miter'; ctx.lineCap = 'butt'; ctx.strokeStyle = cols[i]; ctx.fillStyle = cols[i];
      if (md === 'fader') {
        // a fader: thin track, lit below the cap; the cap rests at its own level, rides the music on Sound, and follows the pointer on hover
        // caps start at the bottom, follow the pointer while hovered and stay where they were left
        // faders keep their colour while a piece plays (the other strings dim towards Sound; these don't)
        const alpha = (1 - fo) * (i > 3 ? .7 : 1);
        const lo = ya + 14, hi = yb - 14; if (S.on) S.hold = clamp(S.ly, lo, hi); S.hold = clamp(S.hold ?? hi, lo, hi);
        const tgt = S.hold; S.cy = S.cy == null ? hi : S.cy + (tgt - S.cy) * Math.min(1, dt * 10);
        if (big) { ctx.globalAlpha = alpha * .35; ctx.fillStyle = PM; for (let q = 0; q <= 10; q++) ctx.fillRect(xs - 9, ya + 10 + (yb - ya - 20) * q / 10, q % 5 ? 2 : 4, 1); ctx.fillStyle = cols[i]; }
        ctx.globalAlpha = alpha * .22; ctx.fillRect(xs - .75, ya, 1.5, yb - ya);
        ctx.globalAlpha = alpha * (.35 + .65 * Math.max(kk, i === 2 ? .75 : 0)); ctx.fillRect(xs - 1, S.cy, 2, yb - S.cy);
        const cw = big ? 16 : 12, ch = big ? 26 : 20, cg = ctx.createLinearGradient(0, S.cy - ch / 2, 0, S.cy + ch / 2); cg.addColorStop(0, '#59626b'); cg.addColorStop(.5, '#3a4249'); cg.addColorStop(1, '#262c31');
        ctx.globalAlpha = Math.max(alpha, .5) * (1 - fo); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 3; ctx.fillStyle = cg; ctx.fillRect(xs - cw / 2, S.cy - ch / 2, cw, ch); ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
        ctx.fillStyle = 'rgba(255,255,255,.14)'; ctx.fillRect(xs - cw / 2 + 2, S.cy - ch / 2 + 4, cw - 4, 1); ctx.fillRect(xs - cw / 2 + 2, S.cy + ch / 2 - 5, cw - 4, 1);
        ctx.fillStyle = cols[i]; if (look === 'stark' && (this.props.cyber ?? true)) { ctx.shadowColor = cols[i]; ctx.shadowBlur = 8; } ctx.fillRect(xs - cw / 2 + 1, S.cy - 1, cw - 2, 2); ctx.shadowBlur = 0; ctx.shadowColor = 'transparent';
      } else if (md === 'led') {
        // a column of square LEDs: the touch wave lights them as it passes; Sound fills from the bottom with the level
        const sz = big ? 5 : 4;
        for (let y = ya + 2; y < yb - 2; y += 8) { const q = (y - ya) / (yb - ya); let b = Math.min(1, Math.abs(dxAt(y)) / 5); if (i === 2 && live && 1 - q < live * .95) b = 1; b = Math.max(b, kk * .3);
          ctx.globalAlpha = alpha * (.1 + .9 * b); ctx.fillRect(xs - sz / 2, y, sz, sz); if (b > .5) { ctx.globalAlpha = alpha * .2 * b; ctx.fillRect(xs - sz / 2 - 2, y - 2, sz + 4, sz + 4); } }
      } else if (md === 'cable') {
        // a patch cable between a jack at the top and one at the bottom, slack bowing it sideways; touching it sets it swinging
        const bow = [5, -4, 6, -5, 4, -6, 5][i] + S.th * 120, w = big ? 5 : 4, y0 = ya + 20, y1 = yb - 20;
        const cx = y => { const u = clamp((y - y0) / (y1 - y0), 0, 1); return xs + bow * Math.sin(Math.PI * u) + (i === 2 ? live * 2.5 * Math.sin(t * 30 + y * .02) * Math.sin(Math.PI * u) : 0); };
        [[ya, 1], [yb, -1]].forEach(([jy, s]) => { ctx.globalAlpha = 1 - fo; ctx.fillStyle = '#3b444c'; ctx.beginPath(); ctx.arc(xs, jy, 7, 0, TAU); ctx.fill(); ctx.fillStyle = '#0b0e11'; ctx.beginPath(); ctx.arc(xs, jy, 4.5, 0, TAU); ctx.fill();
          ctx.globalAlpha = alpha; ctx.fillStyle = '#9ba4ac'; ctx.fillRect(xs - 3, s > 0 ? jy - 2 : jy - 12, 6, 14); ctx.fillStyle = cols[i]; ctx.fillRect(xs - 4, s > 0 ? jy + 10 : jy - 20, 8, 10); });
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        [['rgba(0,0,0,.45)', w + 3, 2], [cols[i], w, 0], ['rgba(255,255,255,.28)', 1, -1.2]].forEach(([c, lw, ox]) => { ctx.globalAlpha = alpha; ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(cx(y0) + ox, y0); for (let y = y0 + 8; y <= y1; y += 8) ctx.lineTo(cx(y) + ox, y); ctx.lineTo(cx(y1) + ox, y1); ctx.stroke(); });
        ctx.lineCap = 'butt';
      } else if (md === 'scope') {
        // a phosphor trace: a wide soft pass for the glow and a fine bright one on top; Sound draws the live waveform
        ctx.lineJoin = 'round'; ctx.globalAlpha = alpha * .22; trace(big ? 7 : 5); ctx.globalAlpha = alpha * .45; trace(big ? 3 : 2.2); ctx.globalAlpha = alpha; trace(big ? 1.4 : 1.1);
      } else { ctx.globalAlpha = alpha; trace(big ? 3 : 2); }
      if (i < 4 && open[i] > 1) { const k = clamp(S.k, 0, 1); ctx.globalAlpha = (1 - fo) * smooth(clamp((k - .45) / .55, 0, 1)); ctx.fillStyle = LAB[i]; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(nm(i), xs + (SP + open[i]) / 2, clamp(S.ly, ya + 24, yb - 24)); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; } }
    // arriving / leaving, each string is a dot: arriving, the dots fly in from where the last page left them and settle on the fader caps;
    // leaving, the caps turn back into dots (and for Freediving they fly up into that page's menu)
    const KEYS = ['home', 'freediving', 'sound', 'journal', 'c4', 'c5', 'c6'], OFF = { home: 26, freediving: 78, sound: 130, journal: 182, c4: 224, c5: 256, c6: 288 };
    const bz = (P0, P1, C1, C2, u) => { const a = (1 - u) ** 3, b = 3 * (1 - u) ** 2 * u, c = 3 * (1 - u) * u * u, d = u ** 3; return [a * P0[0] + b * C1[0] + c * C2[0] + d * P1[0], a * P0[1] + b * C1[1] + c * C2[1] + d * P1[1]]; };
    this.dotPos = {};
    if (A && t < 2.2 || O) for (let i = 0; i < 7; i++) { const S = this.S[i], k = KEYS[i], cap = [X(i) - SX, md === 'fader' && S.cy != null ? S.cy : yb - 14]; let p = cap, a = A ? 1 - smooth(clamp((t - 1.3) / .4, 0, 1)) : 1 - asm;
      // with faders, each dot squashes into its cap's coloured stripe as it lands (and leaving, the stripe rounds back into the dot), so it stays solid throughout
      const fm = md === 'fader' ? (A ? smooth(clamp((t - 1.2 - i * .06) / .3, 0, 1)) : asm) : 0; if (md === 'fader') a = 1;
      if (A) { const f = A.nf[k] || (k === 'home' && A.nf.ink); if (f) p = A.nf.low ? bz(f, cap, [f[0], f[1] + (cap[1] - f[1]) * .4], [cap[0], cap[1] - 30], easeIO(clamp((t - .25 - i * .06) / .8, 0, 1))) : bz(f, cap, [f[0] - 120, f[1] + 160], [cap[0] - 60, cap[1] - 220], easeIO(clamp((t - .25 - i * .06) / 1, 0, 1))); else a *= smooth(clamp((t - .6) / .5, 0, 1)); }
      if (O && O.k === 'dive') { const D = [W - 316 + OFF[k], 28]; p = bz(cap, D, [cap[0] - 80, cap[1] - 200], [D[0] - 40, D[1] + 160], easeIO(clamp((O.t - .85 - i * .05) / .9, 0, 1))); }
      this.dotPos[k] = p; if (a <= .01) continue;
      const pp = 1 - slide, c0 = i === 0 ? 'rgb(' + [20, 20, 20].map((v, q) => Math.round(v + ([242, 242, 240][q] - v) * pp)).join(',') + ')' : cols[i];
      const r0 = i < 4 ? 8 : 5.5, sw = (i < 4 ? 16 : 12) - 2, dw = 2 * r0 + (sw - 2 * r0) * fm, dh = 2 * r0 + (2 - 2 * r0) * fm;
      ctx.globalAlpha = a; ctx.fillStyle = c0; if (fm > 0 && look === 'stark' && (this.props.cyber ?? true)) { ctx.shadowColor = c0; ctx.shadowBlur = 8 * fm; }
      ctx.beginPath(); if (fm <= 0) ctx.arc(p[0], p[1], r0, 0, TAU); else if (ctx.roundRect) ctx.roundRect(p[0] - dw / 2, p[1] - dh / 2, dw, dh, dh / 2); else ctx.rect(p[0] - dw / 2, p[1] - dh / 2, dw, dh); ctx.fill(); ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'; }
    ctx.globalAlpha = 1; ctx.lineJoin = 'round'; }
  // ---- layout
  // the wave lies flat across the middle of the page and opens up and down while a piece plays
  geom(W, H) { const m = clamp(W * .05, 26, 56), amp = Math.min(H * .3, 260); return { m, amp, yB: Math.round(H / 2) }; }
  segsOf(ai, W, m) { const tr = this.albums[ai].tracks, gap = W < 700 ? 16 : 28, avail = W - m - 140 - gap * (tr.length - 1), wt = tr.map(t => Math.pow(t.dur, .6)), sw = wt.reduce((a, b) => a + b, 0); let x = m;
    return tr.map((t, k) => { const w = avail * wt[k] / sw, s = { tr: t, x0: x, x1: x + w }; x += w + gap; return s; }); }
  // the many style's pieces: for every column, FK slots above the baseline and FK below, each its own shape, size, tilt, colour and depth
  frags(n) { if (this.F && this.F.n === n) return this.F; const T = n * FK * 2, r = rng(99), F = { n, dx: new Float32Array(T), sz: new Float32Array(T), rot: new Float32Array(T), sh: new Uint8Array(T), pal: new Uint8Array(T), ck: new Float32Array(T), z: new Uint8Array(T), dy: new Float32Array(T) };
    for (let f = 0; f < T; f++) { F.dx[f] = (r() - .5) * 7; F.sz[f] = 2.5 + r() * 5.5; F.rot[f] = r() * TAU; F.sh[f] = Math.floor(r() * 5); F.pal[f] = Math.floor(r() * PAL.length); F.ck[f] = r(); F.z[f] = Math.floor(r() * 3); F.dy[f] = (r() - .5) * 3; }
    return (this.F = F); }
  drawFrag(ctx, dpr, sh, px, py, rot, sz) { const c = Math.cos(rot), s = Math.sin(rot); ctx.setTransform(dpr * c, dpr * s, -dpr * s, dpr * c, dpr * px, dpr * py);
    if (sh === 0) ctx.fillRect(-sz / 2, -sz * .3, sz, sz * .6);
    else if (sh === 1) { ctx.beginPath(); ctx.arc(0, 0, sz * .45, 0, TAU); ctx.fill(); }
    else if (sh === 2) { ctx.beginPath(); ctx.moveTo(0, -sz * .55); ctx.lineTo(sz * .5, sz * .4); ctx.lineTo(-sz * .5, sz * .4); ctx.closePath(); ctx.fill(); }
    else if (sh === 3) ctx.fillRect(-sz, -.7, sz * 2, 1.4);
    else { ctx.beginPath(); ctx.arc(0, 0, sz * .42, 0, TAU); ctx.lineWidth = 1.1; ctx.stroke(); } }
  draw(dt) {
    const cv = this.canvasRef.current; if (!cv) return;
    const W = innerWidth, H = innerHeight, dpr = Math.min(2, devicePixelRatio || 1), look = this.look, TH = THEMES[look];
    if (cv.width !== Math.round(W * dpr) || cv.height !== Math.round(H * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); this.grainP = null; }
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.filter = 'none';
    const t = this.t, fo = this.out ? smooth(clamp(this.out.t / .45, 0, 1)) : 0, { m, amp, yB } = this.geom(W, H), Wv = (this.props.deck ?? true) ? W - 194 : W, cyber = look === 'stark' && (this.props.cyber ?? true);
    const al = this.albums[this.state.album], c = this.cur, pos = this.posOf(), segs = this.strip ? this.segsOf(this.state.album, W, m) : null, hov = this.state.hover, hovTr = hov ? this.trById(hov) : null;
    let playX = null;
    if (c) { const u = pos / c.tr.dur; if (!this.strip) playX = u * Wv; else { const sg = segs.find(q => q.tr.id === c.tr.id); if (sg) playX = sg.x0 + u * (sg.x1 - sg.x0); } }
    const live = c && !c.paused ? this.live : 0, D = this.dotOf(PAGE) || [W - 160, 28];
    // ground
    if (look === 'haze') {
      const gr = ctx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#1f252b'); gr.addColorStop(.55, '#3a434b'); gr.addColorStop(1, '#5f6a73'); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'screen';
      [[.2, .32, .42, '226,204,192', .2], [.8, .2, .34, '196,212,228', .18], [.55, .82, .5, '214,222,232', .16]].forEach(([bx, by, br, rgb, a], k) => { const x = (bx + .05 * Math.sin(t * .07 + k * 2)) * W, y = (by + .04 * Math.cos(t * .05 + k)) * H, rr = br * Math.max(W, H), g = ctx.createRadialGradient(x, y, 0, x, y, rr); g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')'); g.addColorStop(1, 'rgba(' + rgb + ',0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); });
      ctx.globalCompositeOperation = 'source-over';
    } else if (look === 'stark') {
      const gr = ctx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#eaeae7'); gr.addColorStop(1, '#d0d1ce'); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
      const vg = ctx.createRadialGradient(W * .42, H * .45, Math.min(W, H) * .2, W * .42, H * .45, Math.max(W, H) * .8); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.12)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
      if (!this.grainP) this.grainP = ctx.createPattern(this.grainC, 'repeat'); ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = TH.grain; ctx.fillStyle = this.grainP; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    } else { ctx.fillStyle = TH.bg; ctx.fillRect(0, 0, W, H); }
    // stark: each album's photo, full height, multiplied into the grey so its white ground disappears and only the darks show; crossfades between albums
    if (look === 'stark') { const ph = this.photos || (this.photos = {}), pr = Math.min(dpr, 1.5), tn = this.tuneAt(t), pa = (this.props.photo ?? .9) * (this.arr ? (tn ? tn.sig : t < 1.6 ? 0 : 1) : smooth(clamp((t - .2) / 1.2, 0, 1))) * (1 - fo);
      this.albums.forEach((a, ai) => { if (!a.img) return; let P = ph[a.img]; if (!P) { P = ph[a.img] = { im: new Image(), k: 0 }; P.im.src = a.img; }
        const ok = P.im.complete && P.im.naturalWidth > 0; P.k += ((ai === this.state.album && ok ? 1 : 0) - P.k) * Math.min(1, dt * 2.4); if (P.k < .004 || !ok) return;
        // full height, pushed right against the panel; imgY lifts it so the subject sits in the open top right, above the track list
        const ih = H, iw = Math.round(ih * P.im.naturalWidth / P.im.naturalHeight), iy = Math.round((a.imgY ?? 0) * H), ix = Math.round((a.imgX ?? 1) * (Wv - iw));
        if (!P.c || P.key !== ih + 'x' + pr + 'cm' + !!a.imgFlip + !!a.imgMirror) { P.key = ih + 'x' + pr + 'cm' + !!a.imgFlip + !!a.imgMirror; P.c = document.createElement('canvas'); P.c.width = Math.round(iw * pr); P.c.height = Math.round(ih * pr); const px = P.c.getContext('2d');
          if (a.imgFlip) { px.translate(0, P.c.height); px.scale(1, -1); } if (a.imgMirror) { px.translate(P.c.width, 0); px.scale(-1, 1); } px.drawImage(P.im, 0, 0, P.c.width, P.c.height); px.setTransform(1, 0, 0, 1, 0, 0);
          // soften every edge into white so the photo has no frame
          const cw = P.c.width, chh = P.c.height, fx = cw * .2, fy = chh * .08;
          [[0, 0, fx, 0, 0, 0, fx, chh], [cw, 0, cw - fx, 0, cw - fx, 0, fx, chh], [0, 0, 0, fy, 0, 0, cw, fy], [0, chh, 0, chh - fy, 0, chh - fy, cw, fy]].forEach(([x0, y0, x1, y1, rx, ry, rw, rh]) => { const gg = px.createLinearGradient(x0, y0, x1, y1); gg.addColorStop(0, 'rgba(255,255,255,1)'); gg.addColorStop(1, 'rgba(255,255,255,0)'); px.fillStyle = gg; px.fillRect(rx, ry, rw, rh); });
          // tinted copies for the cyberpunk colour split: green+blue lifted (darks print cyan), red+blue lifted (darks print magenta)
          const tint = rgb => { const t2 = document.createElement('canvas'); t2.width = cw; t2.height = chh; const tx = t2.getContext('2d'); tx.drawImage(P.c, 0, 0); tx.globalCompositeOperation = 'lighter'; tx.fillStyle = rgb; tx.fillRect(0, 0, cw, chh); return t2; }; P.cC = tint('rgb(0,255,255)'); P.cM = tint('rgb(255,0,255)'); }
        const al = pa * smooth(P.k); ctx.globalCompositeOperation = 'multiply';
        if (cyber) { const gl = Math.max(this.flipT0 != null ? clamp(1 - (t - this.flipT0) / .5, 0, 1) : 0, tn ? (1 - tn.sig) * smooth(clamp(tn.u / .1, 0, 1)) : 0), jx = 3 + gl * (8 + 12 * Math.random()), jy = gl * (Math.random() - .5) * 8;
          ctx.globalAlpha = al * .75; ctx.drawImage(P.cC, ix - jx, iy + jy, iw, ih); ctx.drawImage(P.cM, ix + jx, iy - jy, iw, ih);
          if (gl > 0) { ctx.globalAlpha = al; for (let q = 0; q < 5; q++) { const sy = Math.random() * ih, sh = 4 + Math.random() * 34, sx = (Math.random() - .5) * 60 * gl, k2 = P.c.height / ih; ctx.drawImage(P.c, 0, sy * k2, P.c.width, sh * k2, ix + sx, iy + sy, iw, sh); } } }
        ctx.globalAlpha = al; ctx.drawImage(P.c, ix, iy, iw, ih); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; });
      // static while tuning in: grain that thins out as the signal locks on
      if (tn && tn.u > 0) { const sa = .5 * (1 - tn.sig) * smooth(clamp(tn.u / .12, 0, 1)); if (sa > .01) {
        if (!this.staticC) { const c2 = document.createElement('canvas'); c2.width = c2.height = 160; const x2 = c2.getContext('2d'), im = x2.createImageData(160, 160); for (let q = 0; q < im.data.length; q += 4) { const v = Math.random() < .5 ? 20 : 235; im.data[q] = im.data[q + 1] = im.data[q + 2] = v; im.data[q + 3] = Math.random() * 255; } x2.putImageData(im, 0, 0); this.staticP = ctx.createPattern(c2, 'repeat'); this.staticC = c2; }
        ctx.save(); ctx.globalAlpha = sa; ctx.translate(Math.random() * 160, Math.random() * 160); ctx.fillStyle = this.staticP; ctx.fillRect(-160, -160, this.wvOf() + 160, H + 160); ctx.restore(); } }
      // fine scanlines over the ground and photo
      if (cyber) { if (!this.scanP) { const sc = document.createElement('canvas'); sc.width = 1; sc.height = 3; const sx = sc.getContext('2d'); sx.fillStyle = 'rgba(0,0,0,.05)'; sx.fillRect(0, 0, 1, 1); this.scanP = ctx.createPattern(sc, 'repeat'); } ctx.globalAlpha = 1 - fo; ctx.fillStyle = this.scanP; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; } }
    // a soft light of the playing piece's colour round the playhead
    if (playX != null && look !== 'stark') { const rr = amp * 1.6, g = ctx.createRadialGradient(playX, yB, 0, playX, yB, rr), k = KINDS[c.tr.kind], col = (look === 'haze' ? k.tint : k.cs).slice(4, -1); g.addColorStop(0, 'rgba(' + col + ',' + (.1 + .16 * live) * (1 - fo) + ')'); g.addColorStop(1, 'rgba(' + col + ',0)'); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.fillRect(playX - rr, yB - rr, rr * 2, rr * 2); ctx.globalCompositeOperation = 'source-over'; }
    // arrival. many: the red dot breaks into pieces that fly down and build the wave, left to right. haze: the red dot blooms into a soft light
    // that sinks to the baseline and cools, and the lines form out of it from the middle outwards
    const arrD = this.arr ? .9 : 0, introDone = t > 3.4 + arrD, eqRise = x => { const h = (((Math.floor(x / 10) + 7) * 2654435761) >>> 0) % 1000 / 1000, k = clamp((t - 1.75 - h * .45) / .32, 0, 1); return k <= 0 ? 0 : k >= 1 ? 1 : 1 + 2.2 * (k - 1) ** 3 + 1.2 * (k - 1) ** 2; }, introG = this.arr ? (x => introDone ? 1 : eqRise(x)) : look === 'many' ? (x => introDone ? 1 : smooth(clamp((t - arrD - (1.0 + .9 * x / W)) / .45, 0, 1))) : (x => introDone ? 1 : smooth(clamp((t - arrD - .3 - 1.1 * Math.abs(x / W - .5)) / .8, 0, 1)));
    // targets for each column: height, strength and which kind of piece it belongs to
    const pieces = look === 'many' || (look === 'stark' && (this.props.wave ?? 'pieces') === 'pieces'), g = pieces ? (W < 600 ? 8 : 10) : (W < 600 ? 3 : 4), n = Math.ceil(W / g);
    if (!this.disp || this.disp.length !== n) { this.disp = new Float32Array(n); this.alp = new Float32Array(n); this.colK = new Array(n).fill(null); }
    const kE = 1 - Math.exp(-dt * 6);
    for (let i = 0; i < n; i++) { const x = i * g + g / 2; let env = 0, kk = null, a = .3;
      // resting: flat; hovering a piece lifts it a little; playing (or paused): the piece's full wave, and nothing else
      if (!this.strip) { if (c) { env = envAt(c.tr.env, Math.min(1, x / Wv)); kk = c.tr.kind; a = x <= playX ? 1 : .22; } else if (hovTr) { env = envAt(hovTr.env, x / Wv) * .14; kk = hovTr.kind; a = .62; } else kk = kindAt(al.tracks, Math.min(1, x / Wv)); }
      else { const sg = segs.find(q => x >= q.x0 && x <= q.x1); if (sg) { const id = sg.tr.id, e0 = envAt(sg.tr.env, (x - sg.x0) / (sg.x1 - sg.x0)); kk = sg.tr.kind; if (c && c.tr.id === id) { env = e0; a = x <= playX ? 1 : .22; } else if (c) a = 0; else if (hov === id) { env = e0 * .14; a = .66; } else a = .36; } else if (c) a = 0; }
      // changes sweep in from the left
      const k = Math.min(1, kE * (.6 + .8 * (1 - i / n)));
      this.disp[i] += (env - this.disp[i]) * k; this.alp[i] += (a - this.alp[i]) * k; if (kk) this.colK[i] = kk; }
    if (pieces) {
      const F = this.frags(n), step = amp / FK, par = this.mx * 5, jit = look === 'stark' ? .45 : 1;
      // the played part of the wave dances with the music: each column follows its own band of the spectrum, strongest just behind the playhead
      let spec = null; if (playX != null && live && this.an) { if (!this.fBuf) this.fBuf = new Uint8Array(this.an.frequencyBinCount); this.an.getByteFrequencyData(this.fBuf); spec = this.fBuf; }
      if (!this.sp || this.sp.length !== n) this.sp = new Float32Array(n);
      // scrub aids. settle: while the playhead is dragged the pieces gather into neat lines (all of them, or only round the pointer for lens);
      // ghost: faint lines always under the pieces; contour: a fine outline round the wave
      const sm = this.props.settle ?? 'lens', ghost = this.props.ghost ?? false, contour = this.props.contour ?? false;
      this.stl = (this.stl || 0) + ((this.scrub && sm !== 'off' ? 1 : 0) - (this.stl || 0)) * Math.min(1, dt * 9); if (this.scrub) this.lensX = this.scrub.x;
      if (!this.hhA || this.hhA.length !== n) this.hhA = new Float32Array(n); this.hhA.fill(-1);
      for (let i = 0; i < n; i++) { const x = i * g + g / 2, ig = introG(x); if (ig <= 0) continue;
        const b = spec && x <= playX ? spec[2 + (i * 37) % 140] / 255 * Math.exp(-(playX - x) / (W * .3)) : 0; this.sp[i] += (b - this.sp[i]) * .45;
        const hh = this.disp[i] * amp * (.92 + .08 * Math.sin(t * 1.3 + i * .37)) * ig * (1 + 1.2 * this.sp[i]), kc = this.colK[i] ? KINDS[this.colK[i]].cs : TH.neutral, e = playX != null && live ? live * Math.exp(-(((x - playX) / 52) ** 2)) : 0;
        const sk = sm === 'lens' ? this.stl * Math.exp(-(((x - (this.lensX ?? -1e4)) / 110) ** 2)) : this.stl; this.hhA[i] = hh;
        if (ghost || sk > .01) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.fillStyle = kc; ctx.globalAlpha = this.alp[i] * (1 - fo) * Math.max(ghost ? .22 : 0, sk); const lw = 1 + sk; ctx.fillRect(x - lw / 2, yB - Math.max(.6, hh), lw, Math.max(1.2, hh * 2)); }
        for (let h = 0; h < 2; h++) for (let j = 0; j < FK; j++) { const off = (j + .5) * step; if (off > hh + step * .5) break;
          const f = (i * FK + j) * 2 + h, sd = h ? 1 : -1, z = F.z[f], lastF = j ? clamp((hh - off) / step + .5, 0, 1) : 1;
          let px = x + F.dx[f] * jit + par * (z - 1), py = yB + sd * (off + F.dy[f]), rot = F.rot[f] + Math.sin(t * .5 + f) * .08;
          if (e) { py += sd * e * (6 + off * .4); rot += e * 2.4 * (f % 2 ? 1 : -1); px += e * F.dx[f] * 2; }
          if (sk > .01) { px += (x - px) * sk; py += (yB + sd * off - py) * sk; rot *= 1 - sk; }
          ctx.globalAlpha = this.alp[i] * (.5 + .25 * z) * lastF * (1 - fo) * (1 - .85 * sk); const col = F.ck[f] < .62 ? kc : look === 'stark' && F.pal[f] === 7 ? TH.ink : PAL[F.pal[f]]; ctx.fillStyle = col; ctx.strokeStyle = col;
          this.drawFrag(ctx, dpr, F.sh[f], px, py, rot, F.sz[f] * (.7 + .2 * z)); } }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (contour) { ctx.globalAlpha = .85 * (1 - fo); ctx.strokeStyle = TH.ink; ctx.lineWidth = 1; ctx.lineJoin = 'round';
        for (const sd of [-1, 1]) { ctx.beginPath(); let on = false; for (let i = 0; i < n; i++) { const hv = this.hhA[i]; if (hv < 0) { on = false; continue; } const x = i * g + g / 2, y = yB + sd * Math.max(.5, hv); if (on) ctx.lineTo(x, y); else { ctx.moveTo(x, y); on = true; } } ctx.stroke(); } }
      // the red dot's pieces in flight
      if (!introDone && look === 'many') { const rr = rng(5); ctx.fillStyle = 'rgb(' + COL.join(',') + ')'; ctx.strokeStyle = ctx.fillStyle;
        for (let k = 0; k < 130; k++) { const tx = (k + .5) / 130 * W, r1 = rr(), r2 = rr(), r3 = rr(), t0 = .25 + .9 * tx / W * .8 + r1 * .18, u = clamp((t - t0) / (.75 + r2 * .2), 0, 1); if (u <= 0 || u >= 1) continue;
          const ee = easeIO(u), C1 = [D[0] - 80 - r2 * 260, D[1] + 60 + r3 * 220], E = [tx, yB + (r3 - .5) * 6], q = 1 - ee, px = q * q * D[0] + 2 * q * ee * C1[0] + ee * ee * E[0], py = q * q * D[1] + 2 * q * ee * C1[1] + ee * ee * E[1];
          ctx.globalAlpha = (1 - smooth(clamp((u - .82) / .18, 0, 1))) * (1 - fo); this.drawFrag(ctx, dpr, Math.floor(r1 * 5), px, py, r2 * TAU + u * 6, 3 + r3 * 5); }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    } else {
      // haze: the lines are drawn to their own layer, then laid over the ground twice, blurred for the glow and sharp on top
      const lc = this.lc; if (lc.width !== cv.width || lc.height !== cv.height) { lc.width = cv.width; lc.height = cv.height; }
      const lx = lc.getContext('2d'); lx.setTransform(1, 0, 0, 1, 0, 0); lx.clearRect(0, 0, lc.width, lc.height); lx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (let i = 0; i < n; i++) { const x = i * g + g / 2, ig = introG(x); if (ig <= 0) continue;
        let hh = this.disp[i] * amp * (.9 + .1 * Math.sin(t * 1.7 + i * .23)) * ig;
        if (playX != null && live) { const d = (x - playX) / 46; hh *= 1 + .7 * live * Math.exp(-d * d) * (.75 + .25 * Math.sin(t * 23 + i)); }
        hh = Math.max(.6, hh); lx.globalAlpha = this.alp[i]; lx.fillStyle = this.colK[i] ? KINDS[this.colK[i]][look === 'stark' ? 'cs' : 'tint'] : TH.neutral; lx.fillRect(x - .5, yB - hh, 1, hh * 2); }
      if (playX != null) { lx.globalAlpha = .95; lx.fillStyle = cyber ? NEON_M : look === 'stark' ? TH.ink : '#ffffff'; lx.fillRect(Math.round(playX) - .5, 0, 1, H); }
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = look === 'stark' ? 'multiply' : 'screen';
      if ('filter' in ctx) { ctx.filter = 'blur(' + Math.round((look === 'stark' ? 4 : 7) * dpr) + 'px)'; ctx.globalAlpha = (look === 'stark' ? .3 : .85) * (1 - fo); ctx.drawImage(lc, 0, 0); ctx.filter = 'none'; }
      ctx.globalAlpha = 1 - fo; ctx.drawImage(lc, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    // playhead (many draws it here; haze has it in the glowing layer) and the time beside it
    if (playX != null) { if (pieces) { ctx.globalAlpha = .9 * (1 - fo); if (cyber) { ctx.fillStyle = NEON_M; ctx.shadowColor = NEON_M; ctx.shadowBlur = 12; ctx.fillRect(Math.round(playX) - .75, 0, 1.5, H); ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'; } else { ctx.fillStyle = TH.ink; ctx.fillRect(Math.round(playX) - .5, 0, 1, H); } }
    }
    // scrub marker: a line where the pointer would jump to, with that time under it
    // while a piece plays, everything but its wave fades out
    this.pf += (((c && !c.paused) ? 1 : 0) - this.pf) * Math.min(1, dt * 2.5); 
    // handing over to / from Home and Freediving: their paper ground comes in under the panel
    const pap = this.arr ? 1 - smooth(clamp((t - .2) / 1, 0, 1)) : this.out && this.out.k !== 'other' ? smooth(clamp((this.out.t - .25) / .7, 0, 1)) : 0;
    if (pap > 0) { ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = pap; ctx.fillStyle = '#f5f3ee'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    this.drawStrings(ctx, W, H, t, dt, TH, live, this.out && this.out.k !== 'other' ? 0 : fo);
    const ta = (this.arr ? (t >= 1.7 ? 1 : 0) : smooth(clamp((t - 1.4) / .8, 0, 1))) * (1 - fo), el = this.contentRef.current;
    if (el) { el.style.opacity = (ta * (1 - this.pf)).toFixed(3); el.style.pointerEvents = this.pf > .5 ? 'none' : ''; el.style.transform = 'translateY(' + ((1 - ta) * (this.arr ? 0 : 8)).toFixed(1) + 'px)'; this.typeIn(t); }
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  }
  // arriving: the album's labels and tracks type in, a character at a time, like a mixer readout; the album rail flickers on with the signal
  typeIn(t) { if (this.typed) return; const sec = this.contentRef.current && this.contentRef.current.querySelectorAll('section')[this.state.album], rail = this.wheelRef.current; if (!sec) return;
    const els = [];
    if (this.arr) { const h2 = sec.querySelector('h2'), meta = h2 && h2.parentElement.querySelector('p'); if (meta) els.push([meta, .15]); if (h2) els.push([h2, .35]); sec.querySelectorAll('ol > li').forEach((li, i) => els.push([li, .6 + i * .12])); }
    const u = t - 1.7, done = !this.arr || u > 2.2;
    els.forEach(([e, d]) => { const n = Math.max(4, (e.textContent || '').trim().length), k = clamp((u - d) / clamp(n * .028, .25, .7), 0, 1), kq = Math.floor(k * n) / n; e.style.clipPath = done || k >= 1 ? '' : 'inset(0 ' + ((1 - kq) * 100).toFixed(2) + '% 0 0)'; });
    if (rail) { const tn = this.tuneAt(t); rail.style.opacity = done || !tn ? '' : (tn.sig > .35 && Math.random() > .15 * (1 - tn.sig) ? 1 : .15).toString(); }
    if (done) { this.typed = true; if (rail) rail.style.opacity = ''; } }
  renderVals() {
    const { W, H, album, playing, paused } = this.state, G = this.geom(W, H), n = this.albums.length;
    const trV = tr => { const k = KINDS[tr.kind], cur = playing === tr.id; return { mark: cur ? (paused ? '❙❙' : '▶') : pad2(tr.ti + 1), title: tr.title, kind: k.label, col: this.look === 'stark' ? THEMES.stark.ink : k.cs, date: fmtDate(tr.date), dur: fmtDur(tr.dur), state: cur ? (paused ? 'Paused' : 'Playing') : 'Play',
      play: () => this.click(tr), on: () => { if (this.state.hover !== tr.id) this.setState({ hover: tr.id }); }, off: () => { if (this.state.hover === tr.id) this.setState({ hover: null }); } }; };
    const albums = this.albums.map((a, ai) => { const tot = a.tracks.reduce((s, t) => s + t.dur, 0); return { title: a.title, meta: pad2(ai + 1) + ' / ' + pad2(n) + ' · ' + a.tracks.length + ' pieces · ' + fmtDur(tot), tracks: a.tracks.map(trV),
      hasNext: ai < n - 1, next: ai < n - 1 ? '↓ ' + this.albums[ai + 1].title : '', goNext: this.goAlbum(ai + 1) }; });
    const segs = this.strip ? this.segsOf(album, W, G.m).map(sg => ({ ...trV(sg.tr), left: Math.round(sg.x0), width: Math.round(sg.x1 - sg.x0), top: Math.round(G.yB - 96), height: 122 })) : [];
    return {
      th: (() => { const T = THEMES[this.look], cy = this.look === 'stark' && (this.props.cyber ?? true); return { ...T, titleSh: cy ? '2px 0 0 rgba(255,43,214,.85), -2px 0 0 rgba(0,229,255,.85)' : 'none', cardInk: cy ? NEON_C : '#f2f2f0', cardSh: cy ? '0 0 8px rgba(0,229,255,.75), 1px 0 0 ' + NEON_M : 'none' }; })(),
      // what scrolling up / down leads to: the album above at the top edge, the one below at the bottom edge
      flapA: this.flapA, flapB: this.flapB, flipTo: pad2(album + 1), flipFrom: pad2((this.flipPrev ?? album) + 1),
      wheelRef: this.wheelRef, wheelItems: this.albums.map((a, ai) => ({ i: ai, num: pad2(ai + 1), title: a.title, go: this.goAlbum(ai) })),
      upList: this.albums.slice(0, album).map((a, ai) => ({ num: pad2(ai + 1), title: a.title, go: this.goAlbum(ai) })),
      downList: this.albums.slice(album + 1).map((a, k) => ({ num: pad2(album + k + 2), title: a.title, go: this.goAlbum(album + k + 1) })),
      upNum: album > 0 ? pad2(album) : '', upTitle: album > 0 ? this.albums[album - 1].title : '',
      downNum: album < n - 1 ? pad2(album + 2) : '', downTitle: album < n - 1 ? this.albums[album + 1].title : '',
      panelW: (this.props.deck ?? true) ? '194px' : '0px',
      isList: !this.strip, isStrip: this.strip, albums, cur: albums[album], segs,
      albumY: 'translateY(' + (-album * 100) + 'vh)', titleY: 'translateY(' + (-album * 1.02) + 'em)',
      prevName: album > 0 ? '↑ ' + this.albums[album - 1].title : '', prevOp: album > 0 ? 1 : 0, prevPe: album > 0 ? 'auto' : 'none',
      nextName: album < n - 1 ? '↓ ' + this.albums[album + 1].title : '', nextOp: album < n - 1 ? 1 : 0, nextPe: album < n - 1 ? 'auto' : 'none',
      goPrev: this.goAlbum(album - 1), goNext: this.goAlbum(album + 1),
      canvasRef: this.canvasRef, contentRef: this.contentRef, goHome: this.goHome,
      navOff: () => this.setState({ navHov: null }),
      isPlaying: !!playing && !paused, pauseAll: e => { if (this.recentScrub() || this.inBand(e.clientX, e.clientY, e.target)) return; this.toggle(); },
      scrubDown: this.scrubDown, bgLeave: () => { this.hx = null; },
      // while paused, a click on empty ground (not a label, list, button or link) resumes
      rootRef: this.rootRef, bgMove: e => this.setCursor(e.target, e.clientX, e.clientY),
      bgClick: e => { if (!this.cur || !this.cur.paused || this.recentScrub() || this.inBand(e.clientX, e.clientY, e.target)) return; const el = e.target; if (el && el.closest && el.closest('button,a,ol,h2,p,[data-navk]')) return; this.toggle(); },
      str: Object.fromEntries(['home', 'freediving', 'sound', 'journal', 'c4', 'c5', 'c6'].map((k, i) => [k, { on: e => this.strOn(i, e), move: e => this.strMove(i, e), off: () => this.strOff(i), go: this.GO[k] }]))
    };
  }
}

function View(v) {
  return (
    <>
    {"\n    "}
    <div ref={v.rootRef} onClick={v.bgClick} onMouseMove={v.bgMove} onMouseDown={v.scrubDown} onMouseLeave={v.bgLeave} style={sty(`position:fixed;inset:0;overflow:hidden;color:${v.th?.ink ?? ''};background:${v.th?.bg ?? ''};font-family:${v.th?.body ?? ''};-webkit-font-smoothing:antialiased`)}>
      {"\n      \n  \n      "}
      <canvas ref={v.canvasRef} style={sty("position:absolute;inset:0;width:100%;height:100%;pointer-events:none")} />
      {"\n      \n  \n      \n      "}
      <div ref={v.contentRef} style={sty("position:absolute;inset:0;overflow:hidden;opacity:0")}>
        {"\n        "}
        <div style={sty(`position:absolute;left:0;right:0;top:0;transform:${v.albumY ?? ''};transition:transform .9s cubic-bezier(.65,0,.2,1)`)}>
          {"\n          "}
          {(v.albums || []).map((al, $index) => (
            <React.Fragment key={$index}>
              {"\n            "}
              <section aria-label={al?.title} style={sty("position:relative;height:100vh")}>
                {"\n              "}
                <div style={sty("position:absolute;left:calc(clamp(26px, 5vw, 56px) + 76px);right:214px;bottom:calc(50% + 30px);display:flex;flex-direction:column;align-items:flex-start;gap:clamp(8px, 1.6vh, 14px)")}>
                  {"\n                "}
                  <p style={sty(`margin:0;font-family:'JetBrains Mono', monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${v.th?.muted ?? ''};background:${v.th?.labBg ?? ''};padding:${v.th?.chipPad ?? ''};border-radius:3px`)}>
                    {al?.meta}
                  </p>
                  {"\n                "}
                  <h2 style={sty(`margin:0;font-family:${v.th?.disp ?? ''};font-style:${v.th?.dispStyle ?? ''};font-weight:${v.th?.dispW ?? ''};text-transform:${v.th?.dispCase ?? ''};font-size:${v.th?.dispSize ?? ''};line-height:.95;letter-spacing:${v.th?.dispLs ?? ''};text-shadow:${v.th?.titleSh ?? ''};background:${v.th?.labBg ?? ''};padding:${v.th?.labPad ?? ''};border-radius:${v.th?.labRad ?? ''};box-shadow:${v.th?.labSh ?? ''}`)}>
                    {al?.title}
                  </h2>
                  {"\n              "}
                </div>
                {"\n              "}
                <div style={sty("position:absolute;left:calc(clamp(26px, 5vw, 56px) + 76px);top:calc(50% + 30px);width:min(820px, max(280px, calc(100% - clamp(26px, 5vw, 56px) - 366px)));display:flex;flex-direction:column;align-items:flex-start;gap:12px")}>
                  {"\n                "}
                  <ol style={sty(`list-style:none;margin:0;width:100%;box-sizing:border-box;background:${v.th?.listBg ?? ''};padding:${v.th?.listPad ?? ''};border-radius:${v.th?.listRad ?? ''};display:flex;flex-direction:column;border-top:1px solid color-mix(in srgb, currentColor 18%, transparent)`)}>
                    {"\n                "}
                    {(al?.tracks || []).map((tr, $index) => (
                      <React.Fragment key={$index}>
                        {"\n                  "}
                        <li style={sty($index < (al?.tracks || []).length - 1 ? "border-bottom:1px solid color-mix(in srgb, currentColor 18%, transparent)" : "")}>
                          {"\n                    "}
                          <button type="button" onClick={tr?.play} onMouseEnter={tr?.on} onMouseLeave={tr?.off} onFocus={tr?.on} onBlur={tr?.off} aria-label={`${tr?.state ?? ''}: ${tr?.title ?? ''}`} style={sty("width:100%;display:flex;flex-wrap:wrap;align-items:baseline;column-gap:20px;row-gap:4px;padding:clamp(7px, 1.6vh, 14px) 6px;box-sizing:border-box;border:0;background:none;color:inherit;text-align:left;cursor:pointer;font:inherit")} style-hover="background:color-mix(in srgb, currentColor 7%, transparent)">
                            {"\n                      "}
                            <span style={sty(`margin:0;font-family:'JetBrains Mono', monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${v.th?.muted ?? ''};color:inherit;width:28px;flex:none`)}>
                              {tr?.mark}
                            </span>
                            {"\n                      "}
                            <span style={sty(`flex:1 1 240px;min-width:0;font-size:${v.th?.trSize ?? ''};text-transform:${v.th?.trCase ?? ''};letter-spacing:${v.th?.trLs ?? ''};line-height:1.25`)}>
                              {tr?.title}
                            </span>
                            {"\n                      "}
                            <span style={sty(`display:flex;align-items:baseline;gap:20px;flex:none;margin:0;font-family:'JetBrains Mono', monospace;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${v.th?.muted ?? ''}`)}>
                              {"\n                        "}
                              <span style={sty("display:flex;align-items:center;gap:7px")}>
                                <span style={sty(`width:8px;height:8px;border-radius:50%;background:${tr?.col ?? ''}`)} />
                                {tr?.kind}
                              </span>
                              {"\n                        "}
                              <span>
                                {tr?.date}
                              </span>
                              {"\n                        "}
                              <span style={sty("min-width:40px;text-align:right")}>
                                {tr?.dur}
                              </span>
                              {"\n                      "}
                            </span>
                            {"\n                    "}
                          </button>
                          {"\n                  "}
                        </li>
                        {"\n                "}
                      </React.Fragment>
                    ))}
                    {"\n              "}
                  </ol>
                  {"\n              "}
                </div>
                {"\n            "}
              </section>
              {"\n          "}
            </React.Fragment>
          ))}
          {"\n        "}
        </div>
        {"\n        "}
        <div ref={v.wheelRef} style={sty("position:absolute;left:18px;top:50%;width:64px;height:0")}>
          {"\n          "}
          {(v.wheelItems || []).map((ab, $index) => (
            <React.Fragment key={$index}>
              {"\n            "}
              <button type="button" data-wi={ab?.i} onClick={ab?.go} aria-label={`Album ${ab?.num ?? ''}: ${ab?.title ?? ''}`} style={sty(`position:absolute;left:50%;top:0;transform:translate(-50%, -50%);opacity:0;white-space:nowrap;border:0;cursor:pointer;padding:5px 9px;border-radius:3px;font-family:'JetBrains Mono', monospace;font-size:10px;letter-spacing:.08em;text-transform:uppercase;background:${v.th?.labBg ?? ''};color:${v.th?.ink ?? ''};box-shadow:${v.th?.labSh ?? ''};will-change:transform, opacity`)}>
                {ab?.title}
              </button>
              {"\n          "}
            </React.Fragment>
          ))}
          {"\n          "}
          <div aria-hidden="true" style={sty(`position:absolute;left:0;top:-42px;width:64px;height:84px;perspective:320px;font-family:Michroma, sans-serif;font-size:26px;letter-spacing:-0.02em;line-height:1;color:${v.th?.cardInk ?? ''};text-shadow:${v.th?.cardSh ?? ''};box-shadow:0 2px 6px rgba(0,0,0,.25);border-radius:6px`)}>
            {"\n          "}
            <div style={sty("position:absolute;inset:0 0 50% 0;overflow:hidden;border-radius:6px 6px 0 0;background:#161616")}>
              <div style={sty("position:absolute;left:0;right:0;top:0;height:84px;display:grid;place-items:center")}>
                {v.flipTo}
              </div>
            </div>
            {"\n          "}
            <div style={sty("position:absolute;inset:50% 0 0 0;overflow:hidden;border-radius:0 0 6px 6px;background:#111111")}>
              <div style={sty("position:absolute;left:0;right:0;top:-42px;height:84px;display:grid;place-items:center")}>
                {v.flipFrom}
              </div>
            </div>
            {"\n          "}
            <div ref={v.flapA} style={sty("position:absolute;inset:0 0 50% 0;overflow:hidden;border-radius:6px 6px 0 0;background:#161616;transform-origin:50% 100%;backface-visibility:hidden;visibility:hidden")}>
              <div style={sty("position:absolute;left:0;right:0;top:0;height:84px;display:grid;place-items:center")}>
                {v.flipFrom}
              </div>
            </div>
            {"\n          "}
            <div ref={v.flapB} style={sty("position:absolute;inset:50% 0 0 0;overflow:hidden;border-radius:0 0 6px 6px;background:#111111;transform-origin:50% 0;backface-visibility:hidden;visibility:hidden")}>
              <div style={sty("position:absolute;left:0;right:0;top:-42px;height:84px;display:grid;place-items:center")}>
                {v.flipTo}
              </div>
            </div>
            {"\n          "}
            <div style={sty("position:absolute;left:0;right:0;top:50%;height:1px;margin-top:-.5px;background:#000000")} />
            {"\n        "}
          </div>
          {"\n        "}
        </div>
        {"\n\n\n      "}
      </div>
      {"\n      \n      \n      \n  \n      "}
      <div role="navigation" aria-label="Pages" style={sty("position:absolute;inset:0;z-index:5;pointer-events:none")}>
        {"\n        "}
        <a href={BASE + "?from=dive"} onClick={v.goHome} aria-label="Home" data-navk="home" onMouseEnter={v.str?.home?.on} onMouseMove={v.str?.home?.move} onMouseLeave={v.str?.home?.off} onFocus={v.str?.home?.on} onBlur={v.str?.home?.off} style={sty("position:absolute;top:0;bottom:0;right:121px;width:18px;display:block;pointer-events:auto;cursor:pointer")}>
          <span data-navdot="1" style={sty("position:absolute;left:50%;top:50%;width:1px;height:1px")} />
        </a>
        {"\n        "}
        <a href={BASE + "freediving/"} onClick={v.str?.freediving?.go} aria-label="Freediving" data-navk="freediving" onMouseEnter={v.str?.freediving?.on} onMouseMove={v.str?.freediving?.move} onMouseLeave={v.str?.freediving?.off} onFocus={v.str?.freediving?.on} onBlur={v.str?.freediving?.off} style={sty("position:absolute;top:0;bottom:0;right:103px;width:18px;display:block;pointer-events:auto;cursor:pointer")}>
          <span data-navdot="1" style={sty("position:absolute;left:50%;top:50%;width:1px;height:1px")} />
        </a>
        {"\n        "}
        <a href={BASE + "sound/"} onClick={v.str?.sound?.go} aria-current="page" aria-label="Sound" data-navk="sound" onMouseEnter={v.str?.sound?.on} onMouseMove={v.str?.sound?.move} onMouseLeave={v.str?.sound?.off} onFocus={v.str?.sound?.on} onBlur={v.str?.sound?.off} style={sty("position:absolute;top:0;bottom:0;right:85px;width:18px;display:block;pointer-events:auto;cursor:pointer")}>
          <span data-navdot="1" style={sty("position:absolute;left:50%;top:50%;width:1px;height:1px")} />
        </a>
        {"\n        "}
        <a href={BASE + "journal/"} onClick={v.str?.journal?.go} aria-label="Journal" data-navk="journal" onMouseEnter={v.str?.journal?.on} onMouseMove={v.str?.journal?.move} onMouseLeave={v.str?.journal?.off} onFocus={v.str?.journal?.on} onBlur={v.str?.journal?.off} style={sty("position:absolute;top:0;bottom:0;right:67px;width:18px;display:block;pointer-events:auto;cursor:pointer")}>
          <span data-navdot="1" style={sty("position:absolute;left:50%;top:50%;width:1px;height:1px")} />
        </a>
        {"\n        "}
        <span data-navk="c4" aria-hidden="true" onMouseEnter={v.str?.c4?.on} onMouseMove={v.str?.c4?.move} onMouseLeave={v.str?.c4?.off} style={sty("position:absolute;top:0;bottom:0;right:49px;width:18px;pointer-events:auto")}>
          <span data-navdot="1" style={sty("position:absolute;left:50%;top:50%;width:1px;height:1px")} />
        </span>
        {"\n        "}
        <span data-navk="c5" aria-hidden="true" onMouseEnter={v.str?.c5?.on} onMouseMove={v.str?.c5?.move} onMouseLeave={v.str?.c5?.off} style={sty("position:absolute;top:0;bottom:0;right:31px;width:18px;pointer-events:auto")}>
          <span data-navdot="1" style={sty("position:absolute;left:50%;top:50%;width:1px;height:1px")} />
        </span>
        {"\n        "}
        <span data-navk="c6" aria-hidden="true" onMouseEnter={v.str?.c6?.on} onMouseMove={v.str?.c6?.move} onMouseLeave={v.str?.c6?.off} style={sty("position:absolute;top:0;bottom:0;right:13px;width:18px;pointer-events:auto")}>
          <span data-navdot="1" style={sty("position:absolute;left:50%;top:50%;width:1px;height:1px")} />
        </span>
        {"\n      "}
      </div>
      {"\n      "}
      {v.isPlaying ? (
        <>
          {"\n        "}
          <button type="button" aria-label="Pause" onClick={v.pauseAll} style={sty("position:absolute;inset:0;z-index:4;border:0;padding:0;background:none;cursor:inherit;opacity:0")} />
          {"\n      "}
        </>
      ) : null}
      {"\n    "}
    </div>
    </>
  );
}

export default page(Component, View, {"style":"stark","cyber":true,"photo":0.9,"deck":true,"strings":"fader","wave":"pieces","settle":"lens","contour":false,"ghost":false,"synth":true});
