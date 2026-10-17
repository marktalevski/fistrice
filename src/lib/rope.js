// Where the Freediving rope (and its buoy) hangs: this far in from the left edge, on narrow screens and wide. Home draws the buoy and the
// surface in the same place when it hands over to Freediving, so both pages take it from here. It leaves room on the rope's left for the squid
export const ropeX = W => W < 720 ? 52 : 84;
