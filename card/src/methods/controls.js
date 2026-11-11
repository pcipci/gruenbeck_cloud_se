/*
 * The control lid on top of the housing (switches for iQ mode, buzzer, LED
 * ring ...), the pills and the confirmation dialog, and the calls that switch
 * an entity or open its more-info dialog.
 */
import { CONTROLS, LID_LEFT, LID_RIGHT, PILL_FS } from "../constants.js";
import { esc, text } from "../util.js";
import { ARROW, CHECK, CROSS, ICONS } from "../icons.js";

export const controlsMethods = {
  // Both groups on the lid: display in the middle between them
  get _lidSplit() {
    // Also without LED ring (SE18): display in the middle, buttons left
    const groups = this._controlGroups();
    return groups.length > 0 && groups.every(([, , list]) => list.length <= 4);
  },

  get _displayX() {
    return this._lidSplit ? 125 : 236;
  },

  // LED strip at the bottom of the lid, below all buttons
  get _stripLow() {
    return this._lidBottom > 222;
  },

  get _stripY() {
    return this._stripLow ? 228 : 191;
  },

  // Lid: taller when the LED buttons sit on it below the strip
  get _lidBottom() {
    if (!this._controlGroups().some(([, icon]) => icon === "led")) return this._lidSplit ? 230 : 222;
    return 250;
  },

  // Body below the lid narrows slightly towards the bottom like the softliQ
  // (lid to foot 104 : 88, the lid itself stays straight)
  get _taper() {
    return 22;
  },

  _controlGroups() {
    const t = this._t;
    // Only switches the device has (e.g. no LED ring on the softliQ SE18).
    // The LED group comes first, right below the green LED strip
    return [
      [t.led_ring, "led", CONTROLS.filter((c) => c.key.startsWith("led_ring_") && this._entityId(c.key)), "#5a9e32"],
      [t.plant, "cog", CONTROLS.filter((c) => !c.key.startsWith("led_ring_") && this._entityId(c.key)), "#4a5561"],
    ].filter(([, , list]) => list.length);
  },

  // Inner space of the cabinet for resin and salt: x, width, top of the
  // resin, the plate between resin and salt, rows of salt
  get _geo() {
    return { x: 6.75, w: 284.5, top: this._lidBottom + 2, shelf: 641, salt: 9 };
  },

  _controls() {
    return this._controlLid(this._controlGroups());
  },

  // Buttons on the lid: device settings left of the display, LED buttons
  // right below the LED strip
  _controlLid(groups) {
    let out = "";
    if (this._lidSplit) {
      // Display in the middle, device buttons left, LED buttons right,
      // each as two rows of two
      const rows = [167, 205];
      for (const [, icon, list, accent] of groups) {
        // Around the round display the pairs move a bit outwards
        const cols = icon === "led" ? [230, 268] : [30, 68];
        list.forEach((c, i) => {
          out += this._toggleSvg(c, accent, cols[i % 2], rows[Math.floor(i / 2) % 2]);
        });
      }
      return out;
    }
    for (const [, icon, list, accent] of groups) {
      const led = icon === "led";
      const cy = this._stripLow ? (led ? 205 : 167) : led ? 235 : 168;
      // Same even grid in both rows, left of the display
      const step = (230 - 12) / 4;
      list.forEach((c, i) => {
        out += this._toggleSvg(c, accent, 12 + step * (i + 0.5), cy);
      });
    }
    return out;
  },

  // Round control button: filled in the group colour when on
  _toggleSvg(c, accent, cx, cy, size = 1) {
    const t = this._t;
    const st = this._state(c.key);
    const on = st?.state === "on";
    const missing = !st || st.state === "unavailable";
    const iconFill = on ? accent : missing ? "#c0c8d0" : "#7b8794";
    const stroke = on ? accent : "#d3dde7";
    const stateText = missing ? t.unavailable : on ? t.on : t.off;
    let out = `<g class="${missing ? "" : "switch"}" data-key="${c.key}" data-label="${esc(t[c.label])}">`;
    out += `<title>${esc(`${t[c.label]}: ${stateText}`)}</title>`;
    // Round button: filled in the group colour when on. Small, the
    // invisible tap area below stays large enough for fingers
    const br = 14 * size;
    // Off: a light tint of the group colour, so the group stays clear
    const fill = on ? accent : missing ? "#eef3f8" : accent;
    const tint = on || missing ? "" : ' fill-opacity=".13" stroke-opacity=".4"';
    out += `<circle class="track" cx="${cx}" cy="${cy}" r="${br}" fill="${fill}" stroke="${missing ? stroke : accent}"${tint}${missing ? ' stroke-dasharray="3 3"' : ""}/>`;
    out += `<path d="${ICONS[c.icon]}" fill="${on ? "#ffffff" : missing ? iconFill : accent}"${on || missing ? "" : ' fill-opacity=".6"'} transform="translate(${cx - 8.5 * size} ${cy - 8.5 * size}) scale(${(17 * size) / 24})"/>`;
    out += `<rect x="${cx - 30}" y="${cy - 20}" width="60" height="40" fill="transparent"/>`;
    return out + `</g>`;
  },

  // Value with a pictogram instead of a text label; the name is the tooltip
  _iconPill(x, y, icon, iconColor, value, title, more, color = "#2b3a47", align = "left") {
    const fs = PILL_FS;
    // No frame, so the flowing water behind shows; a light edge keeps the
    // symbol and value readable. Left badge flush with the left edge of the
    // lid, right badge flush with its right edge. A tap shows the value as a
    // bubble, its details button opens the dialog
    const halo = 'stroke="#ffffff" stroke-width="3" paint-order="stroke" stroke-linejoin="round"';
    const textW = String(value).length * fs * 0.6;
    // The drop is drawn 3.3 inside its 20 px box
    const iconX = align === "left" ? LID_LEFT - 3.3 : LID_RIGHT - textW - 4 - 20 + 3.3;
    const textX = align === "left" ? iconX + 3.3 + 20 + 1 : LID_RIGHT;
    const anchor = align === "left" ? "start" : "end";
    return `<g data-info="${more}"><title>${esc(`${title}: ${value}`)}</title>
      <rect x="${iconX - 2}" y="${y - 12}" width="${textX + (align === "left" ? textW : 0) - iconX + 4}" height="22" fill="transparent"/>
      <path d="${ICONS[icon]}" fill="${iconColor}" fill-rule="evenodd" ${halo} transform="translate(${iconX} ${y - 11}) scale(${20 / 24})"/>
      ${text(textX, y + 4.8, value, `text-anchor="${anchor}" font-size="${fs}" font-weight="700" fill="${color}" stroke="#ffffff" stroke-width="3.6" paint-order="stroke" stroke-linejoin="round"`)}
    </g>`;
  },

  _confirmDialog() {
    if (!this._confirm) return "";
    const t = this._t;
    const q = (this._confirm.on ? t.confirm_off : t.confirm_on).replace("{name}", this._confirm.label);
    // Pictograms instead of words: the switch now, an arrow, the switch
    // after; check mark and cross as buttons. Words only as tooltip and for
    // screen readers
    const def = CONTROLS.find((c) => c.key === this._confirm.key);
    const accent = this._confirm.key.startsWith("led_ring_") ? "#5a9e32" : "#4a5561";
    const state = (on) => `<svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="${accent}" ${on ? "" : 'fill-opacity=".13" stroke-opacity=".4"'} stroke="${accent}"/>
        ${def ? `<path d="${ICONS[def.icon]}" fill="${on ? "#fff" : accent}" ${on ? "" : 'fill-opacity=".6"'} transform="translate(8 8)"/>` : ""}
      </svg>`;
    const icon = (path, color) => `<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="${path}" fill="${color}"/></svg>`;
    return `<div class="dialog-bg"><div class="dialog" role="dialog" aria-label="${esc(q)}" title="${esc(q)}">
      <div class="change">${state(this._confirm.on)}${icon(ARROW, "#8a96a3")}${state(!this._confirm.on)}</div>
      <div class="name">${esc(this._confirm.label)}</div>
      <div class="buttons">
        <button class="cancel" title="${esc(t.cancel)}" aria-label="${esc(t.cancel)}">${icon(CROSS, "#5b6478")}</button>
        <button class="yes" style="background:${accent}" title="${esc(t.yes)}" aria-label="${esc(t.yes)}">${icon(CHECK, "#fff")}</button>
      </div>
    </div></div>`;
  },

  _toggle(key, label) {
    if (this._config.confirm === false) {
      this._callToggle(key);
      return;
    }
    this._confirm = { key, label, on: this._on(key) };
    this._update();
  },

  _callToggle(key) {
    const id = this._entityId(key);
    if (id) this._hass.callService("switch", "toggle", { entity_id: id });
  },

  _moreInfo(key) {
    const entityId = this._entityId(key);
    if (!entityId) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
  },
};
