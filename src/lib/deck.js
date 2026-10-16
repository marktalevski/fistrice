// The Sound page's DJ deck (after a Pioneer Opus-Quad): a controller running off the bottom of the screen, so only its top shows.
// Left deck: a jog wheel that scrubs. Middle: the album clock (a flip counter in a tall display, the album names rolling round it), the main
// screen (now playing over the album's track list), and the volume fader with play / pause under it. Right deck: six numbered knobs (a combination
// lock, for something to come) in a row under the beat pads, square, four wide and two tall: the four pages, three for the pages still to come
// (orange, green, purple) and one spare. The menu dots fly into the pads.
// It lives here so Home can drop its dots straight onto the pads when it hands over to Sound.
export const DECK_KEYS = ['home', 'freediving', 'sound', 'journal', 'c4', 'c5', 'c6'];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function deckGeo(W, H) {
  const hV = Math.round(clamp(H * .4, 220, 330)), x0 = 12, x1 = W - 12, w = x1 - x0, y0 = H - hV, cyM = y0 + hV / 2;
  // the mixer in the middle, a deck either side of it
  const Mw = Math.round(clamp(w * .46, 440, 640)), mx0 = Math.round((W - Mw) / 2), mx1 = mx0 + Mw, L = mx0 - x0;
  // left deck: the jog wheel, a whole circle, as large as the deck allows
  const jr = Math.round(clamp(Math.min((hV - 18) / 2 - 12, L / 2 - 22), 56, 170)), jog = [x0 + L / 2, y0 + hV / 2, jr];
  // middle: clock, screen, then the volume fader with play / pause under it (set after the knobs, whose size the button matches)
  const clock = [mx0 + 16, Math.round(cyM - 42), 64, 84], clockScr = [mx0 + 8, y0 + 16, 80, hV - 32];
  const scr = [mx0 + 96, y0 + 16, Mw - 96 - 60, hV - 32];
  // right deck: square beat pads above, four wide and two tall (the four pages, then the three to come and the spare), and the six knobs in a
  // row along the bottom
  const Rw = x1 - mx1 - 28, gap = 8, kc = Math.floor(Math.min(Rw / 6, 64)), s = Math.floor(Math.min((Rw - 3 * gap) / 4, (hV - 30 - kc - 10 - gap) / 2));
  const gx = mx1 + 14 + Math.round((Rw - (4 * s + 3 * gap)) / 2), gy = y0 + 14 + Math.round((hV - 30 - kc - 10 - (2 * s + gap)) / 2);
  const cell = n => [gx + (n % 4) * (s + gap), gy + Math.floor(n / 4) * (s + gap), s, s];
  const pads = [0, 1, 2, 3].map(cell), cpads = [4, 5, 6].map(cell), spare = cell(7);
  const pr = Math.round(kc * .3), play = [mx1 - 28, H - 18 - pr, pr], vol = { x: mx1 - 28, y0: y0 + 34, y1: play[1] - pr - 24 };
  // the knob row sits centred in the space between the pads and the bottom edge
  const kgx = mx1 + 14 + (Rw - 6 * kc) / 2, ky = Math.round((gy + 2 * s + gap + H - 12) / 2), knobs = [0, 1, 2, 3, 4, 5].map(i => [kgx + (i + .5) * kc, ky, kc * .27]);
  return { x0, y0, x1, y1: H, w, h: hV, mx0, mx1, jog, knobs, kc, play, clock, clockScr, scr, vol, pads, cpads, spare, lo: vol.y0 + 8, hi: vol.y1 - 8 };
}
// where each menu dot lands: the centre of its beat pad
export const padOf = (G, k) => { const i = DECK_KEYS.indexOf(k === 'ink' ? 'home' : k), p = i < 4 ? G.pads[i] : G.cpads[i - 4]; return [p[0] + p[2] / 2, p[1] + p[3] / 2]; };
