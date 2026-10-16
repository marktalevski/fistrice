// The Sound page's DJ deck (after a Pioneer Opus-Quad): a controller running off the bottom of the screen, so only its top shows.
// Left deck: a jog wheel that scrubs. Middle: the album clock (a flip counter in a tall display, the album names rolling round it), the main
// screen (now playing over the album's track list), cue and play / pause, and the volume fader. Right deck: six numbered knobs (a combination
// lock, for something to come) beside the beat pads, square, two wide and four tall: the four pages, three for the pages still to come
// (orange, green, purple) and one spare. The menu dots fly into the pads.
// It lives here so Home can drop its dots straight onto the pads when it hands over to Sound.
export const DECK_KEYS = ['home', 'freediving', 'sound', 'journal', 'c4', 'c5', 'c6'];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function deckGeo(W, H) {
  const hV = Math.round(clamp(H * .36, 200, 300)), x0 = 12, x1 = W - 12, w = x1 - x0, y0 = H - hV, cyM = y0 + hV / 2;
  // the mixer in the middle, a deck either side of it
  const Mw = Math.round(clamp(w * .46, 440, 640)), mx0 = Math.round((W - Mw) / 2), mx1 = mx0 + Mw, L = mx0 - x0;
  // left deck: the jog wheel, a whole circle, as large as the deck allows
  const jr = Math.round(clamp(Math.min((hV - 24) / 2, L / 2 - 16), 56, 170)), jog = [x0 + L / 2, y0 + hV / 2, jr];
  // middle: clock, screen, then cue / play and the volume fader
  const clock = [mx0 + 16, Math.round(cyM - 42), 64, 84], clockScr = [mx0 + 8, y0 + 16, 80, hV - 32];
  const vol = { x: mx1 - 26, y0: y0 + 34, y1: H - 22 }, bx = mx1 - 70, cue = [bx, Math.round(cyM - 28), 18], play = [bx, Math.round(cyM + 28), 18];
  const scr = [mx0 + 96, y0 + 16, Mw - 96 - 104, hV - 32];
  // right deck: the six knobs (two across, three down) on the left, and on the right square beat pads, two wide and four tall, filled row by
  // row (pages first, then the three to come, then the spare)
  const Rw = x1 - mx1 - 28, gap = 8, s = Math.floor(Math.min((Rw * .5 - gap) / 2, (hV - 28 - 3 * gap) / 4)), gx = x1 - 14 - (2 * s + gap), gy = Math.round(y0 + (hV - (4 * s + 3 * gap)) / 2 - 2);
  const cell = n => [gx + (n % 2) * (s + gap), gy + Math.floor(n / 2) * (s + gap), s, s];
  const pads = [0, 1, 2, 3].map(cell), cpads = [4, 5, 6].map(cell), spare = cell(7);
  const kx0 = mx1 + 14, kw = gx - 18 - kx0, kc = Math.floor(Math.min(kw / 2, (hV - 32) / 3)), kgx = kx0 + (kw - 2 * kc) / 2, kgy = y0 + (hV - 3 * kc) / 2;
  const knobs = [0, 1, 2, 3, 4, 5].map(i => [kgx + (i % 2 + .5) * kc, kgy + (Math.floor(i / 2) + .5) * kc, kc * .25]);
  return { x0, y0, x1, y1: H, w, h: hV, mx0, mx1, jog, knobs, kc, cue, play, clock, clockScr, scr, vol, pads, cpads, spare, lo: vol.y0 + 8, hi: vol.y1 - 8 };
}
// where each menu dot lands: the centre of its beat pad
export const padOf = (G, k) => { const i = DECK_KEYS.indexOf(k === 'ink' ? 'home' : k), p = i < 4 ? G.pads[i] : G.cpads[i - 4]; return [p[0] + p[2] / 2, p[1] + p[3] / 2]; };
