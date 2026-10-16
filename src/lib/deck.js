// The Sound page's DJ deck (after a Pioneer Opus-Quad): a controller running off the bottom of the screen, so only its top shows.
// Left deck: the album clock (a flip counter, album names rolling beside it), a jog wheel half hidden below the edge that scrubs, and cue and
// play / pause in the corner. Middle: the main screen, now playing over the album's track list, with the volume fader beside it. Right deck:
// the beat pads, square, the four pages above three for the pages still to come (orange, green, purple). The menu dots fly into the pads.
// It lives here so Home can drop its dots straight onto the pads when it hands over to Sound.
export const DECK_KEYS = ['home', 'freediving', 'sound', 'journal', 'c4', 'c5', 'c6'];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function deckGeo(W, H) {
  const hV = Math.round(clamp(H * .29, 170, 222)), x0 = 12, x1 = W - 12, w = x1 - x0, y0 = H - hV;
  // the mixer in the middle, a deck either side of it
  const Mw = Math.round(clamp(w * .4, 320, 500)), mx0 = Math.round((W - Mw) / 2), mx1 = mx0 + Mw, L = mx0 - x0;
  // left deck
  const jr = Math.round(clamp(Math.min(hV - 28, L / 2 - 36), 56, 200)), jog = [x0 + 62 + jr, H + 6, jr];
  const cue = [x0 + 32, H - 70, 16], play = [x0 + 32, H - 28, 16], clock = [x0 + 14, y0 + 12, 64, 84];
  // middle: the screen, and the volume fader standing beside it
  const scr = [mx0 + 12, y0 + 12, Mw - 64, hV - 24], vol = { x: mx1 - 26, y0: y0 + 30, y1: H - 18 };
  // right deck: square beat pads, four over three (the lower row set half a pad in)
  const Rw = x1 - mx1 - 28, s = Math.floor(Math.min((Rw - 18) / 4, (hV - 34) / 2)), gx = mx1 + 14 + Math.round((Rw - (4 * s + 18)) / 2), gy = y0 + 14;
  const pads = [0, 1, 2, 3].map(i => [gx + i * (s + 6), gy, s, s]), cpads = [0, 1, 2].map(i => [gx + Math.round((s + 6) / 2) + i * (s + 6), gy + s + 8, s, s]);
  return { x0, y0, x1, y1: H, w, h: hV, mx0, mx1, jog, cue, play, clock, scr, vol, pads, cpads, lo: vol.y0 + 8, hi: vol.y1 - 8 };
}
// where each menu dot lands: the centre of its beat pad
export const padOf = (G, k) => { const i = DECK_KEYS.indexOf(k === 'ink' ? 'home' : k), p = i < 4 ? G.pads[i] : G.cpads[i - 4]; return [p[0] + p[2] / 2, p[1] + p[3] / 2]; };
