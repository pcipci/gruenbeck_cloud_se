/*
 * Measurements of the statistics blocks on the right (header symbol size,
 * row pictogram ink boxes, where the value text starts). They are computed
 * from the pictograms in icons.js so all rows line up.
 */
import { HEADER_BOX } from "./icons.js";

// Header symbols: one height, the visibly lighter ones a bit larger
export const HEAD_H = 25;

export const HEAD_K = { water: 0.9, tank: 1.02, lime: 0.97, salt: 1.12 };

export const headScale = (icon) => {
  const [, , bw, bh] = HEADER_BOX[icon];
  return Math.min((HEAD_H * (HEAD_K[icon] ?? 1)) / bh, 31 / bw);
};

// Header symbols are flush left: the left edge of the widest one centred
// on x 332
export const HEAD_LEFT = Math.min(...Object.keys(HEAD_K).map((k) => 332 - (HEADER_BOX[k][2] * headScale(k)) / 2));

// Strokes reach a little past the boxes above; measured in the browser so
// that the drawn left edges are flush
export const HEAD_INK_DX = { salt: 0.43, tank: -1.12 };

// Ink of each row pictogram as drawn (left, right edge relative to x 329,
// after the row scale); measured in the browser
export const ROW_INK = { cal: [-8.83, 13.63], avg30: [-8.83, 23.88], flow: [-13.23, 21.44], frac_salt: [-20.02, 16.51], frac_lime: [-18.29, 16.51], clock: [-10.68, 10.68], last: [-9.26, 9.41], count: [-8.96, 9.58], wrench: [-11.88, 11.88], magnify: [-12, 12] };

// Values of all rows start at one x, right of the widest pictogram
export const VALUE_X = HEAD_LEFT + Math.max(...Object.values(ROW_INK).map(([l, r]) => r - l)) + 9;
