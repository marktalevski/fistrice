// Reel, a little cassette tape with arms and legs, lives on the Sound deck's screen. It is drawn fresh each frame on a 22 x 20 grid: a rounded
// cassette shell (squashed and stretched by the pose), a cream label with a stripe in the song's ink, two reels for eyes (they turn while it
// dances) and the tape window for a mouth, with stubby arms and feet, so each animation is only a set of numbers: where the body is and how
// squashed, where the arms and feet are, which eyes and mouth. reel(mode, t, o) gives the lit cells as [x, y, colour].
// Modes: idle, sleep and yawn (resting); dance (a piece is playing: o.move, o.mp and o.dir say which move, how far in, which way); and the little
// turns a beat pad sets off: wave, jump, rewind, boom, happy, spin, yawn. o: { tau: seconds since the mode began, lv: loudness 0..1, ink: the
// colour for notes, stars and the label stripe }
export const REEL_W = 22, REEL_H = 20;
export const REEL_IDLES = ['idle', 'sleep', 'yawn'];
// the dance's moves, and how many beats each lasts (a trio is a sway with two copies beside it, drawn by the deck)
export const REEL_MOVES = { sway: 4, slide: 4, spin: 2, hop: 4, shimmy: 4, jumpspin: 2, breakdance: 4, trio: 4, pose: 2,
  squish: 4, clap: 4, robot: 4, twist: 4, armwave: 4, bob: 4, float: 4, backflip: 2, stomp: 4, disco: 4 };
// which moves suit slow music and which fast (the rest suit any): slow music favours the first, fast the second
export const REEL_SLOW = ['sway', 'slide', 'bob', 'float', 'armwave', 'squish'];
export const REEL_FAST = ['hop', 'spin', 'jumpspin', 'breakdance', 'backflip', 'stomp', 'robot', 'clap', 'twist', 'shimmy'];
export const REEL_REACTS = ['wave', 'jump', 'rewind', 'boom', 'happy', 'spin', 'yawn'];
// outline, shell, shell shade, shell highlight, label, reel window, reel hub, mouth, feet, white, the Zs
const C = { o: '#0e2a30', b: '#3a9aa6', s: '#24707a', h: '#86d6de', l: '#f3ead2', e: '#14161c', hub: '#e9edf0', m: '#14161c', f: '#2a3036', w: '#ffffff', z: '#9fd8ff' };
const STAR = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
const ZED = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
const REW = [[1, 0], [0, 1], [1, 2], [3, 0], [2, 1], [3, 2]];
const ARC_L = [[1, 0], [0, 1], [0, 2], [0, 3], [1, 4]], ARC_R = [[0, 0], [1, 1], [1, 2], [1, 3], [0, 4]];
const s01 = v => Math.max(0, Math.min(1, v));

export function reel(mode, t, o = {}) {
  const tau = o.tau ?? t, lv = o.lv ?? 0, ink = o.ink || '#ffd84a';
  let spin = mode === 'dance' ? t * 6 : 0, bx = 11, by = 11, rx = 6.3, ry = 5.9, aL = -.35, aR = -.35, fL = [0, 0], fR = [0, 0], edx = 0, eyes = 'open', mouth = 'none', flip = false;
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
    // one move of the dance; mp is how many beats into it it is. The moves:
    // sway, slide (a moonwalk: facing one way, gliding the other; the deck moves it), spin, hop, shimmy, jumpspin, breakdance, pose
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
    // squish: squashes and stretches like jelly on each beat
    else if (mv === 'squish') { const k = Math.sin(mp * Math.PI * 2); ry *= 1 + .14 * k; rx *= 1 - .1 * k; by -= k * .7; aL = aR = k > 0 ? .9 : -.5; eyes = k > .3 ? 'happy' : eyes; mouth = k > 0 ? 'big' : 'smile'; }
    // clap: claps overhead on every beat, a little hop with each
    else if (mv === 'clap') { const k = up > .5 ? 1 : 0; aL = aR = k ? 1.4 : .6; by -= up * .8; eyes = 'happy'; mouth = 'big'; if (k && f > .45 && f < .6) add(STAR, 10, 0, ink); }
    // robot: stiff, in steps: arms snap between poses on the half beat, the body ticks side to side, no bounce
    else if (mv === 'robot') { const h = Math.floor(mp * 2) % 4; bx += [-1, 0, 1, 0][h]; aL = [1.3, -.4, .3, 1.3][h]; aR = [-.4, 1.3, .3, -.4][h]; eyes = 'open'; mouth = 'none'; edx = [-1, 0, 1, 0][h]; }
    // twist: low, feet swapping as it turns this way and that
    else if (mv === 'twist') { const k = Math.sin(mp * Math.PI * 2); ry *= .92; by += .6; flip = k < 0; fL = [k * 1.4, 0]; fR = [-k * 1.4, 0]; aL = .3 + .4 * k; aR = .3 - .4 * k; eyes = 'happy'; mouth = 'smile'; }
    // armwave: the arms rise one after the other, like a stadium wave, slow and smooth
    else if (mv === 'armwave') { const k = mp * Math.PI; aL = .5 + .9 * Math.sin(k); aR = .5 + .9 * Math.sin(k - 1.3); by -= .4 * Math.sin(k * 2); edx = Math.sin(k) > 0 ? -1 : 1; mouth = 'smile'; }
    // bob: a bob to the beat, reels shut, in the groove
    else if (mv === 'bob') { const d = f < .25 ? f / .25 : 1 - (f - .25) / .75; by += d * 1.1; ry *= 1 - .06 * d; eyes = 'shut'; mouth = 'smile'; aL = aR = -.3 + .2 * d; }
    // float: swells a little and drifts in the air, arms paddling slowly
    else if (mv === 'float') { rx = 7.1; ry = 6.8; by = 9.6 + .9 * Math.sin(mp * Math.PI); aL = aR = .4 + .5 * Math.sin(mp * Math.PI * 2); fL = fR = [0, -1]; mouth = 'puff'; }
    // backflip: a crouch, a big jump turning over at the top, and a squashed landing
    else if (mv === 'backflip') { const c = mp / 2; let h = 0, sq = 0; if (c < .12) sq = c / .12; else if (c < .82) { const u = (c - .12) / .7; h = Math.sin(u * Math.PI) * 4.8; o.flipY = u > .3 && u < .7; } else sq = 1 - (c - .82) / .18;
      by -= h; ry *= 1 - .14 * sq; rx *= 1 + .1 * sq; by += sq * .8; aL = aR = h > .5 ? 1.25 : -.5; eyes = h > .5 ? 'shut' : 'open'; mouth = h > .5 ? 'big' : 'smile'; }
    // stomp: heavy stomps, one foot then the other, a shake on each landing
    else if (mv === 'stomp') { const sd = beat % 2 ? 1 : -1, lift = up * 2; if (sd < 0) fL = [0, -lift]; else fR = [0, -lift]; bx += land * (Math.random() - .5) * .9; ry *= 1 - .08 * land; aL = aR = .1; eyes = 'open'; mouth = land > .3 ? 'big' : 'smile'; }
    // disco: one arm pointing up across, the other down, swapping every two beats, hips bouncing
    else if (mv === 'disco') { const sd = Math.floor(mp / 2) % 2 ? 1 : -1; if (sd > 0) { aR = 1.45; aL = -.6; } else { aL = 1.45; aR = -.6; } bx += sd * .7; by -= up * .5; edx = sd; eyes = 'open'; mouth = 'smile'; }
  } else if (mode === 'wave') {
    const w = Math.sin(tau * 9); aR = 1.15 + .35 * w; aL = -.4; eyes = blink ? 'shut' : 'open'; mouth = 'smile'; edx = 1; by += .2 * Math.sin(tau * 3);
  } else if (mode === 'jump') {
    // a crouch, a spring up (stretched), and a squashed landing
    const c = (tau % 1.1) / 1.1; let h = 0, sq = 0;
    if (c < .2) sq = c / .2; else if (c < .7) { const u = (c - .2) / .5; h = Math.sin(u * Math.PI) * 4.5; sq = -.6 * Math.sin(u * Math.PI); } else if (c < .85) sq = 1 - (c - .7) / .15;
    by -= h; ry *= 1 - .14 * sq; rx *= 1 + .1 * sq; by += sq * .8; aL = aR = h > .5 ? 1.2 : -.5; eyes = h > .5 ? 'happy' : 'open'; mouth = h > .5 ? 'big' : 'smile';
    if (h > 3) add(STAR, 18, 2, ink);
  } else if (mode === 'rewind') {
    // the reels spin fast backwards and little rewind marks stream off to the left
    spin = -tau * 18; eyes = 'open'; mouth = 'o'; aL = aR = .2; bx += .3 * Math.sin(tau * 20);
    for (let n = 0; n < 3; n++) { const u = (tau * 1.8 + n / 3) % 1; add(REW, 1 + (1 - u) * 4, 8 + (n - 1) * 3, u > .7 ? C.w : ink); }
  } else if (mode === 'boom') {
    // a bass thump: the body pulses and sound arcs ring out from both sides
    const k = Math.abs(Math.sin(tau * 6)); rx *= 1 + .08 * k; ry *= 1 + .08 * k; mouth = 'big'; eyes = 'happy'; aL = aR = .9 * k;
    if (k > .5) { add(ARC_L, 1, 7, ink); add(ARC_R, 19, 7, ink); }
  } else if (mode === 'happy') {
    // both arms up, ^^ reels, stars round it
    const b = Math.abs(Math.sin(tau * 5)); by -= b * 1.2; aL = aR = 1.35; eyes = 'happy'; mouth = 'big';
    for (let n = 0; n < 3; n++) { const a = tau * 2 + n * 2.1; add(STAR, 10 + Math.cos(a) * 9.5, 8 + Math.sin(a) * 6.5, n === 1 ? C.w : ink); }
  } else if (mode === 'spin') {
    // a twirl (it turns side to side quickly), then a pose
    const c = tau % 1.6; if (c < 1) { flip = Math.floor(c * 8) % 2 === 1; aL = aR = .25; eyes = 'shut'; by -= Math.sin(c * Math.PI) * 1.2; }
    else { aL = 1.3; aR = -.2; eyes = 'open'; mouth = 'smile'; add(STAR, 18, 3, ink); }
  }
  // feet, then the shell over them, then the arms
  const sh = [];
  sh.push({ k: 'f', cx: bx - 3.1 + fL[0], cy: by + ry * .82 + fL[1], rx: 2.1, ry: 1.3 });
  sh.push({ k: 'f', cx: bx + 3.1 + fR[0], cy: by + ry * .82 + fR[1], rx: 2.1, ry: 1.3 });
  const hw = rx * 1.2, hh = ry * .82; sh.push({ k: 'b', cx: bx, cy: by, rx: hw, ry: hh });
  // an arm sits on the shell's side, at most about 50 degrees up it, so a raised arm stays a stub at its shoulder
  [[-1, aL], [1, aR]].forEach(([sd, a]) => { const ph = Math.max(-.6, Math.min(1.4, a)) * .62; sh.push({ k: 'a', cx: bx + sd * (hw + .4) * Math.cos(ph), cy: by + .6 - (hh + .2) * Math.sin(ph), rx: 1.5, ry: 1.4 }); });
  const inside = (s, px, py) => { const u = (px - s.cx) / s.rx, v = (py - s.cy) / s.ry; if (s.k !== 'b') return u * u + v * v <= 1; return Math.abs(u) <= 1 && Math.abs(v) <= 1 && !(Math.abs(u) > .82 && Math.abs(v) > .72); };
  const own = new Int8Array(REEL_W * REEL_H).fill(-1), at = (x, y) => x < 0 || y < 0 || x >= REEL_W || y >= REEL_H ? -1 : own[y * REEL_W + x];
  for (let y = 0; y < REEL_H; y++) for (let x = 0; x < REEL_W; x++) sh.forEach((s, i) => { if (inside(s, x + .5, y + .5)) own[y * REEL_W + x] = i; });
  const out = [], lab0 = Math.round(by - hh * .62), lab1 = Math.round(by + hh * .12);
  for (let y = 0; y < REEL_H; y++) for (let x = 0; x < REEL_W; x++) { const i = at(x, y), N = [at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)];
    if (i < 0) { if (N.some(n => n >= 0)) out.push([x, y, C.o]); continue; }
    const s = sh[i], u = (x + .5 - s.cx) / s.rx, v = (y + .5 - s.cy) / s.ry;
    if (s.k === 'b' && N.some(n => n >= 0 && sh[n].k === 'f')) { out.push([x, y, C.o]); continue; }
    if (s.k === 'f') { out.push([x, y, C.f]); continue; }
    if (s.k === 'a') { out.push([x, y, v > .2 ? C.s : C.b]); continue; }
    // the shell: the label across its upper half (a stripe of the song's ink along its top), shaded below and down the right, lit top left
    if (Math.abs(u) < .78 && y >= lab0 && y <= lab1) { out.push([x, y, y === lab0 ? ink : C.l]); continue; }
    out.push([x, y, v > .55 || u > .8 ? C.s : u < -.6 && v < -.5 ? C.h : C.b]); }
  // the face on the label: two reels for eyes (they turn while it dances), the tape window for a mouth
  const fx0 = Math.round(bx) + edx, ey = Math.round(by - hh * .2), L = fx0 - 3, R = fx0 + 2, put = (x, y, col) => out.push([x, y, col]);
  const spokes = [[0, -1], [1, 0], [0, 1], [-1, 0]], turn = ((Math.floor(spin) % 4) + 4) % 4;
  if (eyes === 'open') [L, R].forEach(x => { put(x - 1, ey, C.e); put(x + 1, ey, C.e); put(x, ey - 1, C.e); put(x, ey + 1, C.e); put(x, ey, C.hub); const [dx, dy] = spokes[turn]; put(x + dx, ey + dy, C.hub); });
  else if (eyes === 'shut') [L, R].forEach(x => { put(x - 1, ey, C.e); put(x, ey, C.e); put(x + 1, ey, C.e); });
  else if (eyes === 'happy') [L, R].forEach(x => { put(x - 1, ey + 1, C.e); put(x, ey, C.e); put(x + 1, ey + 1, C.e); });
  const my = Math.round(by + hh * .48);
  if (mouth === 'smile') { put(fx0 - 2, my, C.m); put(fx0 - 1, my + 1, C.m); put(fx0, my + 1, C.m); put(fx0 + 1, my, C.m); }
  else if (mouth === 'o') { put(fx0 - 1, my, C.m); put(fx0, my, C.m); put(fx0 - 1, my + 1, C.m); put(fx0, my + 1, C.m); }
  else if (mouth === 'big') { for (let q = -2; q <= 1; q++) { put(fx0 + q, my, C.m); put(fx0 + q, my + 1, C.m); } }
  else if (mouth === 'puff') { put(fx0 - 1, my, C.m); put(fx0, my, C.m); }
  let cells = out;
  if (flip) cells = cells.map(([x, y, c]) => [Math.round(2 * bx) - 1 - x, y, c]);
  if (o.flipY) cells = cells.map(([x, y, c]) => [x, Math.round(2 * by) - 1 - y, c]);
  return cells.concat(fx).filter(([x, y]) => x >= 0 && y >= 0 && x < REEL_W && y < REEL_H);
}
