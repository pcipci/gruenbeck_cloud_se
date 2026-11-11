/*
 * Two tiny helpers for building SVG strings: esc() makes text safe for
 * innerHTML, text() returns a <text> element.
 */
import { FONT } from "./constants.js";

export const esc = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const text = (x, y, content, attrs = "") =>
  `<text x="${x}" y="${y}" font-family="${FONT}" ${attrs}>${esc(content)}</text>`;
