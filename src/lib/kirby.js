// A little pixel Kirby for the Sound deck's screen. He is drawn fresh each frame on a 22 x 20 grid from a few ellipses (feet, body, arms),
// outlined, shaded, with his face on top, so each animation is only a set of numbers: where the body is and how squashed, where the arms
// and feet are, which eyes and mouth. kirby(mode, t, o) gives the lit cells as [x, y, colour].
// Modes: idle, sleep and yawn (resting); dance (a piece is playing: o.move, o.mp and o.dir say which move, how far in, which way); and the little turns a beat pad sets off: wave, jump, inhale, puff,
// happy, spin. o: { tau: seconds since the mode began, lv: loudness 0..1, ink: the colour for notes and stars }
export const KIRBY_W = 22, KIRBY_H = 20;
export const KIRBY_IDLES = ['idle', 'sleep', 'yawn'];
// the dance's moves, and how many beats each lasts (a trio is a sway with two clones beside him, drawn by the deck)
export const KIRBY_MOVES = { sway: 4, slide: 4, spin: 2, hop: 4, shimmy: 4, jumpspin: 2, breakdance: 4, trio: 4, pose: 2 };
export const KIRBY_REACTS = ['wave', 'jump', 'inhale', 'puff', 'happy', 'spin', 'sleep', 'yawn'];
const C = { o: '#3d1533', b: '#ff9ccd', s: '#e46aa6', h: '#ffd3e8', c: '#ff4f86', f: '#e3204c', fs: '#a3123a', e: '#150f24', eb: '#3158ff', w: '#ffffff', m: '#7d0f31', t: '#ff6f8f', z: '#cfd6ff' };
const STAR = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
const ZED = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
const s01 = v => Math.max(0, Math.min(1, v));

export function kirby(mode, t, o = {}) {
  const tau = o.tau ?? t, lv = o.lv ?? 0, ink = o.ink || '#ffd84a';
  // the pose: body centre and radii, arm angles (0 out to the side, up is positive), feet offsets, face
  let bx = 11, by = 11, rx = 6.3, ry = 5.9, aL = -.35, aR = -.35, fL = [0, 0], fR = [0, 0], edx = 0, eyes = 'open', mouth = 'none', flip = false, cheeks = true;
  const fx = [];   // extra cells: notes, stars, Zs, sparkles
  const add = (shape, x, y, col) => shape.forEach(([q, r]) => fx.push([Math.round(x) + q, Math.round(y) + r, col]));
  const blink = (t % 3.7) < .13;
  if (mode === 'idle') {
    // breathing, a blink now and then, and a look round every so often
    const br = Math.sin(t * 2.1); ry *= 1 + .03 * br; rx *= 1 - .015 * br; by += .25 * br;
    const lc = t % 9; edx = lc > 5 && lc < 6.4 ? -1 : lc > 6.4 && lc < 7.6 ? 1 : 0; eyes = blink ? 'shut' : 'open';
  } else if (mode === 'sleep') {
    const br = Math.sin(t * 1.3); ry *= .95 + .05 * br; rx *= 1.04 - .02 * br; by += .5 + .3 * br; eyes = 'shut'; mouth = br > .3 ? 'o' : 'none'; aL = aR = -.6;
    const zt = (t * .7) % 1; add(ZED, 17 + zt * 2, 4 - zt * 4, C.z); if (zt > .5) add(ZED, 19, 1 - (zt - .5) * 2, C.z);
  } else if (mode === 'yawn') {
    // rests, then every few seconds a big stretching yawn
    const y = (t % 5) / 5, k = y > .55 && y < .85 ? Math.sin((y - .55) / .3 * Math.PI) : 0; ry *= 1 + .12 * k; rx *= 1 - .05 * k; by -= k * .8;
    aL = aR = -.35 + 1.6 * k; eyes = k > .15 ? 'shut' : blink ? 'shut' : 'open'; mouth = k > .2 ? 'big' : 'none';
  } else if (mode === 'dance') {
    // one move of the dance; mp is how many beats into it he is. The moves (after his victory dances, and the <(^_^<) (>^_^)> one):
    // sway, slide (a moonwalk: facing one way, gliding the other; the deck moves him), spin, hop, shimmy, jumpspin, breakdance, pose
    const mv = o.move === 'trio' ? 'sway' : o.move || 'sway', mp = o.mp || 0, beat = Math.floor(mp), f = mp - beat, up = Math.sin(f * Math.PI), land = f < .15 ? 1 - f / .15 : 0, dir = o.dir || 1;
    eyes = blink ? 'shut' : 'open'; mouth = 'smile';
    if (mv === 'sway') { const sd = beat % 2 ? 1 : -1; bx += sd * 1.3; by -= up * (.6 + .8 * lv); if (sd < 0) { aL = .35; aR = 1.3; } else { aR = .35; aL = 1.3; } edx = sd; eyes = beat % 4 > 1 ? 'happy' : eyes; }
    else if (mv === 'slide') { edx = -dir; const st = Math.sin(mp * Math.PI * 2); fL = [st * 1.3, -Math.max(0, st) * .8]; fR = [-st * 1.3, -Math.max(0, -st) * .8]; bx -= dir * .4; by += .3 * Math.sin(mp * Math.PI * 4); aL = aR = -.25; ry *= .98; }
    else if (mv === 'spin') { flip = Math.floor(mp * 6) % 2 === 1; aL = aR = .2; eyes = 'shut'; mouth = 'none'; by -= up * 1.1; }
    else if (mv === 'hop') { by -= up * (1.6 + 1.6 * lv); ry *= 1 - .12 * land; rx *= 1 + .08 * land; aL = aR = up > .3 ? 1.35 : -.4; eyes = 'happy'; mouth = 'big'; }
    else if (mv === 'shimmy') { bx += Math.sin(mp * Math.PI * 8) * .7; const a = Math.floor(mp * 4) % 2; aL = a ? 1.3 : -.45; aR = a ? -.45 : 1.3; eyes = 'happy'; edx = a ? -1 : 1; }
    else if (mv === 'jumpspin') { const c = mp / 2; let h = 0, sq = 0; if (c < .12) sq = c / .12; else if (c < .82) { const u = (c - .12) / .7; h = Math.sin(u * Math.PI) * 4.6; flip = u > .25 && u < .75 && Math.floor(u * 12) % 2 === 1; } else sq = 1 - (c - .82) / .18;
      by -= h; ry *= 1 - .14 * sq; rx *= 1 + .1 * sq; by += sq * .8; aL = aR = h > .5 ? 1.25 : -.5; eyes = h > .5 ? 'happy' : 'open'; mouth = h > .5 ? 'big' : 'smile'; }
    else if (mv === 'breakdance') { ry *= .8; rx *= 1.08; by += 1.3; flip = Math.floor(mp * 8) % 2 === 1; fL = [0, -2.2 * Math.abs(Math.sin(mp * Math.PI * 2))]; fR = [0, -2.2 * Math.abs(Math.cos(mp * Math.PI * 2))]; aL = aR = .05; eyes = 'shut'; mouth = 'big'; }
    else if (mv === 'pose') { const k = Math.min(1, mp * 2); aL = -.4 + 1.75 * k; aR = -.3; eyes = 'happy'; mouth = 'big'; edx = -1; by -= Math.sin(Math.min(1, mp) * Math.PI) * 1.5; if (mp > .5) add(STAR, 2, 2, ink); }
  } else if (mode === 'wave') {
    const w = Math.sin(tau * 9); aR = 1.15 + .35 * w; aL = -.4; eyes = blink ? 'shut' : 'open'; mouth = 'smile'; edx = 1; by += .2 * Math.sin(tau * 3);
  } else if (mode === 'jump') {
    // a crouch, a spring up (stretched), and a squashed landing
    const c = (tau % 1.1) / 1.1; let h = 0, sq = 0;
    if (c < .2) sq = c / .2; else if (c < .7) { const u = (c - .2) / .5; h = Math.sin(u * Math.PI) * 4.5; sq = -.6 * Math.sin(u * Math.PI); } else if (c < .85) sq = 1 - (c - .7) / .15;
    by -= h; ry *= 1 - .14 * sq; rx *= 1 + .1 * sq; by += sq * .8; aL = aR = h > .5 ? 1.2 : -.5; eyes = h > .5 ? 'happy' : 'open'; mouth = h > .5 ? 'big' : 'smile';
    if (h > 3) add(STAR, 18, 2, ink);
  } else if (mode === 'inhale') {
    // mouth wide, puffing up, sparkles streaming in from the right
    const k = s01(tau / .5); mouth = 'big'; eyes = 'shut'; rx *= 1 + .06 * k; aL = aR = .1; bx -= .5;
    for (let n = 0; n < 3; n++) { const u = (tau * 1.6 + n / 3) % 1; fx.push([Math.round(21 - u * 7), Math.round(9 + (n - 1) * (1 - u) * 3), u > .8 ? C.w : ink]); }
  } else if (mode === 'puff') {
    // puffed up round, flapping, floating
    rx = 7.3; ry = 7; by = 10.2 + .8 * Math.sin(tau * 2.6); const fl = Math.sin(tau * 14); aL = aR = .5 + .5 * fl; mouth = 'puff'; eyes = blink ? 'shut' : 'open'; cheeks = true; fL = fR = [0, -1];
  } else if (mode === 'happy') {
    // both arms up, ^^ eyes, stars round him
    const b = Math.abs(Math.sin(tau * 5)); by -= b * 1.2; aL = aR = 1.35; eyes = 'happy'; mouth = 'big';
    for (let n = 0; n < 3; n++) { const a = tau * 2 + n * 2.1; add(STAR, 10 + Math.cos(a) * 9.5, 8 + Math.sin(a) * 6.5, n === 1 ? C.w : ink); }
  } else if (mode === 'spin') {
    // a twirl (he turns side to side quickly), then a pose
    const c = tau % 1.6; if (c < 1) { flip = Math.floor(c * 8) % 2 === 1; aL = aR = .25; eyes = 'shut'; by -= Math.sin(c * Math.PI) * 1.2; }
    else { aL = 1.3; aR = -.2; eyes = 'open'; mouth = 'smile'; add(STAR, 18, 3, ink); }
  }
  // feet, then the body over them, then the arms
  const sh = [];
  sh.push({ k: 'f', cx: bx - 2.9 + fL[0], cy: by + ry - .4 + fL[1], rx: 2.5, ry: 1.5 });
  sh.push({ k: 'f', cx: bx + 2.9 + fR[0], cy: by + ry - .4 + fR[1], rx: 2.5, ry: 1.5 });
  sh.push({ k: 'b', cx: bx, cy: by, rx, ry });
  // an arm sits on the body's edge, at most about 50 degrees up its side, so a raised arm stays a nub at his shoulder, never on his head
  [[-1, aL], [1, aR]].forEach(([sd, a]) => { const ph = Math.max(-.6, Math.min(1.4, a)) * .62; sh.push({ k: 'a', cx: bx + sd * (rx + .5) * Math.cos(ph), cy: by + 1 - (ry + .3) * Math.sin(ph), rx: 1.8, ry: 1.6 }); });
  const own = new Int8Array(KIRBY_W * KIRBY_H).fill(-1), at = (x, y) => x < 0 || y < 0 || x >= KIRBY_W || y >= KIRBY_H ? -1 : own[y * KIRBY_W + x];
  for (let y = 0; y < KIRBY_H; y++) for (let x = 0; x < KIRBY_W; x++) { const px = x + .5, py = y + .5;
    sh.forEach((s, i) => { if (((px - s.cx) / s.rx) ** 2 + ((py - s.cy) / s.ry) ** 2 <= 1) own[y * KIRBY_W + x] = i; }); }
  const out = [];
  for (let y = 0; y < KIRBY_H; y++) for (let x = 0; x < KIRBY_W; x++) { const i = at(x, y), N = [at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)];
    if (i < 0) { if (N.some(n => n >= 0)) out.push([x, y, C.o]); continue; }
    const s = sh[i], u = (x + .5 - s.cx) / s.rx, v = (y + .5 - s.cy) / s.ry;
    // the body is outlined where the feet tuck under it, and shaded where an arm lies over it
    if (s.k === 'b' && N.some(n => n >= 0 && sh[n].k === 'f')) { out.push([x, y, C.o]); continue; }
    if (s.k === 'f') { out.push([x, y, v > .3 ? C.fs : C.f]); continue; }
    if (s.k === 'a') { out.push([x, y, N.some(n => n >= 0 && sh[n].k === 'b') && v > 0 ? C.s : u * u + v * v < .3 && v < 0 ? C.h : C.b]); continue; }
    out.push([x, y, v > .6 || (u > .7 && v > .1) ? C.s : u < -.25 && v < -.45 ? C.h : C.b]); }
  // the face, set on the body
  const fx0 = Math.round(bx) + edx, ey = Math.round(by - 3.4), L = fx0 - 2, R = fx0 + 1, put = (x, y, col) => out.push([x, y, col]);
  if (eyes === 'open') [L, R].forEach(x => { put(x, ey, C.w); put(x, ey + 1, C.e); put(x, ey + 2, C.eb); });
  else if (eyes === 'shut') [L, R].forEach(x => { put(x - (x === L ? 1 : 0), ey + 2, C.e); put(x + (x === R ? 1 : 0), ey + 2, C.e); });
  else if (eyes === 'happy') [L, R].forEach(x => { put(x - 1, ey + 2, C.e); put(x, ey + 1, C.e); put(x + 1, ey + 2, C.e); });
  if (cheeks) { put(L - 2, ey + 3, C.c); put(L - 1, ey + 3, C.c); put(R + 1, ey + 3, C.c); put(R + 2, ey + 3, C.c); }
  const my = ey + 4;
  if (mouth === 'smile') { put(fx0 - 1, my, C.m); put(fx0, my, C.m); }
  else if (mouth === 'o') { put(fx0 - 1, my, C.m); put(fx0, my, C.m); put(fx0 - 1, my + 1, C.m); put(fx0, my + 1, C.m); }
  else if (mouth === 'big') { for (let q = -2; q <= 1; q++) put(fx0 + q, my, C.m); for (let q = -1; q <= 0; q++) { put(fx0 + q, my + 1, C.t); } put(fx0 - 2, my + 1, C.m); put(fx0 + 1, my + 1, C.m); }
  else if (mouth === 'puff') { put(fx0 - 1, my, C.m); }
  let cells = out;
  if (flip) cells = cells.map(([x, y, c]) => [Math.round(2 * bx) - 1 - x, y, c]);
  return cells.concat(fx).filter(([x, y]) => x >= 0 && y >= 0 && x < KIRBY_W && y < KIRBY_H);
}
