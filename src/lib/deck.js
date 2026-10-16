// The Sound page's DJ deck (after a Pioneer Opus-Quad): a controller running off the bottom of the screen, so only its top shows.
// Left deck: a small deck display and track-search buttons over a jog wheel, half hidden below the edge, that scrubs. Middle: the album clock
// (a flip counter in a tall display, album names rolling above and below it), the main screen (now playing over the album's track list), cue and play / pause, and the volume fader. Right deck: the beat pads, square,
// two rows of four: the four pages, three for the pages still to come (orange, green, purple) and one spare. The menu dots fly into the pads.
// It lives here so Home can drop its dots straight onto the pads when it hands over to Sound.
export const DECK_KEYS = ['home', 'freediving', 'sound', 'journal', 'c4', 'c5', 'c6'];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function deckGeo(W, H) {
  const hV = Math.round(clamp(H * .36, 200, 300)), x0 = 12, x1 = W - 12, w = x1 - x0, y0 = H - hV, cyM = y0 + hV / 2;
  // the mixer in the middle, a deck either side of it
  const Mw = Math.round(clamp(w * .46, 440, 640)), mx0 = Math.round((W - Mw) / 2), mx1 = mx0 + Mw, L = mx0 - x0;
  // left deck: the deck display and the two track-search buttons along the top, the jog wheel under them, centred
  const jr = Math.round(clamp(Math.min(hV - 104, L / 2 - 14), 56, 240)), jog = [x0 + L / 2, H + 6, jr];
  const dscr = [x0 + 18, y0 + 16, L - 36, 40], bw2 = Math.floor((L - 36 - 8) / 2), prev = [x0 + 18, y0 + 64, bw2, 24], next = [x0 + 26 + bw2, y0 + 64, bw2, 24];
  // middle: clock, screen, then cue / play and the volume fader
  const clock = [mx0 + 16, Math.round(cyM - 42), 64, 84], clockScr = [mx0 + 8, y0 + 16, 80, hV - 32];
  const vol = { x: mx1 - 26, y0: y0 + 34, y1: H - 22 }, bx = mx1 - 70, cue = [bx, Math.round(cyM - 28), 18], play = [bx, Math.round(cyM + 28), 18];
  const scr = [mx0 + 96, y0 + 16, Mw - 96 - 104, hV - 32];
  // right deck: square beat pads, two rows of four
  const Rw = x1 - mx1 - 28, gap = 8, s = Math.floor(Math.min((Rw - 3 * gap) / 4, (hV - 40 - gap) / 2)), gx = mx1 + 14 + Math.round((Rw - (4 * s + 3 * gap)) / 2), gy = Math.round(y0 + (hV - (2 * s + gap)) / 2 - 4);
  const cell = (i, r) => [gx + i * (s + gap), gy + r * (s + gap), s, s];
  const pads = [0, 1, 2, 3].map(i => cell(i, 0)), cpads = [0, 1, 2].map(i => cell(i, 1)), spare = cell(3, 1);
  return { x0, y0, x1, y1: H, w, h: hV, mx0, mx1, jog, dscr, prev, next, cue, play, clock, clockScr, scr, vol, pads, cpads, spare, lo: vol.y0 + 8, hi: vol.y1 - 8 };
}
// where each menu dot lands: the centre of its beat pad
export const padOf = (G, k) => { const i = DECK_KEYS.indexOf(k === 'ink' ? 'home' : k), p = i < 4 ? G.pads[i] : G.cpads[i - 4]; return [p[0] + p[2] / 2, p[1] + p[3] / 2]; };
