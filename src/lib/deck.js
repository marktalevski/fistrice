// The Sound page's DJ deck, a controller along the bottom of the screen (after the DDJ-FLX4): a jog wheel with cue and play / pause on the
// left, a mixer in the middle (screen, then a knob and a fader per channel) and four page pads on the right. It lives here so Home can drop
// its menu dots straight into the deck's faders when it hands over to Sound.
export const DECK_KEYS = ['home', 'freediving', 'sound', 'journal', 'c4', 'c5', 'c6'];

export function deckGeo(W, H) {
  const h = H < 660 ? 150 : 176, w = Math.min(W - 24, 1080), x0 = Math.round((W - w) / 2), y0 = Math.round(H - h - 12), x1 = x0 + w, y1 = y0 + h, cyM = y0 + h / 2;
  // jog wheel and its two buttons
  const jr = Math.round(h / 2 - 20), jog = [x0 + 26 + jr, cyM, jr], bx = jog[0] + jr + 36, cue = [bx, cyM - 26, 16], play = [bx, cyM + 26, 16];
  // four page pads, two by two
  const pw = W < 760 ? 74 : 96, ph = Math.round((h - 56) / 2), px0 = x1 - 20 - pw * 2 - 8, py0 = y0 + Math.round((h - ph * 2 - 8) / 2);
  const pads = [0, 1, 2, 3].map(i => [px0 + (i % 2) * (pw + 8), py0 + Math.floor(i / 2) * (ph + 8), pw, ph]);
  // the mixer between them: the screen across the top, a knob row, then the faders
  const mx0 = bx + 40, mx1 = px0 - 26, scr = [mx0, y0 + 14, mx1 - mx0, 34], knobY = y0 + 66, fy0 = y0 + 84, fy1 = y1 - 14, sp = (mx1 - mx0) / 7;
  const faders = DECK_KEYS.map((k, i) => mx0 + sp * (i + .5));
  return { x0, y0, x1, y1, w, h, jog, cue, play, pads, scr, knobY, faders, fy0, fy1, sp, lo: fy0 + 10, hi: fy1 - 10 };
}
