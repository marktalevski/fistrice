// The Sound page's DJ deck (after a Pioneer Opus-Quad): a controller running off the bottom of the screen, so only its top shows.
// A jog wheel, half hidden below the edge, that scrubs; cue and play / pause in the left deck's corner; the four page pads as a row of hot-cue
// pads across the top of the left deck; across the top of the right deck three more pads for the pages still to come (orange, green, purple),
// over a browse screen of the album; and in the middle the main
// screen (waveform, time) over a knob and a fader per channel. It lives here so Home can drop its menu dots straight into the deck's faders.
export const DECK_KEYS = ['home', 'freediving', 'sound', 'journal', 'c4', 'c5', 'c6'];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function deckGeo(W, H) {
  const hV = Math.round(clamp(H * .29, 170, 222)), x0 = 12, x1 = W - 12, w = x1 - x0, y0 = H - hV;
  // the mixer in the middle, a deck either side of it
  const Mw = Math.round(clamp(w * .4, 300, 470)), mx0 = Math.round((W - Mw) / 2), mx1 = mx0 + Mw, L = mx0 - x0;
  const jr = Math.round(clamp(Math.min(hV - 58, L / 2 - 36), 56, 200)), jy = H + 6;
  const jog = [x0 + 62 + jr, jy, jr];
  const cue = [x0 + 32, H - 70, 16], play = [x0 + 32, H - 28, 16];
  const pw = Math.floor((L - 28 - 3 * 6) / 4), pads = [0, 1, 2, 3].map(i => [x0 + 14 + i * (pw + 6), y0 + 14, pw, 30]);
  const pw3 = Math.floor((x1 - mx1 - 28 - 2 * 6) / 3), cpads = [0, 1, 2].map(i => [mx1 + 14 + i * (pw3 + 6), y0 + 14, pw3, 30]);
  const ascr = [mx1 + 14, y0 + 56, x1 - mx1 - 28, H - 14 - (y0 + 56)];
  const scr = [mx0 + 12, y0 + 12, Mw - 24, Math.round(clamp(hV * .44, 80, 96))];
  const knobY = scr[1] + scr[3] + 16, fy0 = knobY + 16, fy1 = H - 10, sp = (Mw - 24) / 7, faders = DECK_KEYS.map((k, i) => mx0 + 12 + sp * (i + .5));
  return { x0, y0, x1, y1: H, w, h: hV, mx0, mx1, jog, cue, play, pads, cpads, ascr, scr, knobY, faders, fy0, fy1, sp, lo: fy0 + 8, hi: fy1 - 8 };
}
