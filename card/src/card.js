/*
 * The card element itself (class GruenbeckCard, a plain HTMLElement with a shadow DOM).
 *
 * This file only holds the life cycle that Home Assistant calls:
 *   setConfig(config)  - the YAML/editor options arrive here
 *   set hass(hass)     - called on every state change, triggers a redraw
 *   _update/_render    - decide whether anything changed, then draw the SVG
 * Everything else is split into method groups in methods/ and added to the
 * class at the bottom of this file, so `this` works the same everywhere.
 */
import { PAD_L, VIEW_H, VIEW_W } from "./constants.js";
import { esc } from "./util.js";
import { STYLE } from "./style.js";
import { getConfigForm } from "./editor.js";
import { dataMethods } from "./methods/data.js";
import { pictureMethods } from "./methods/picture.js";
import { statsMethods } from "./methods/stats.js";
import { controlsMethods } from "./methods/controls.js";
import { panelsMethods } from "./methods/panels.js";
import { interactionMethods } from "./methods/interaction.js";

class GruenbeckCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._info = null; // websocket answer: list of softeners
    this._infoTime = 0;
    this._stats = {}; // water statistics per period
    this._statsTime = 0;
    this._confirm = null; // pending switch confirmation
    this._panel = null; // open panel: regeneration list, service, chart
    this._lastKey = "";
  }

  static getStubConfig() {
    return {};
  }

  static getConfigForm() {
    return getConfigForm();
  }

  setConfig(config) {
    const cleaned = { ...(config || {}) };
    for (const key of ["language", "device"]) if (cleaned[key] === "") delete cleaned[key];
    this._config = { show_controls: true, confirm: true, ...cleaned };
    this._lastKey = "";
    if (this._hass) this._update();
  }

  set hass(hass) {
    this._hass = hass;
    this._loadInfo();
    this._update();
  }

  getCardSize() {
    return 9;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  // --- rendering --------------------------------------------------------
  _update() {
    if (!this._hass) return;
    this._dev = this._device();
    if (this._dev) this._loadStats();
    // Only redraw when something shown on the card changed
    const ids = this._dev ? Object.values(this._dev.entities).concat(Object.values(this._config.entities || {})) : [];
    const key = JSON.stringify([
      ids.map((id) => {
        const st = this._hass.states[id];
        return st ? [st.state, st.attributes.unit_of_measurement] : null;
      }),
      this._stats,
      this._statsState,
      this._confirm,
      this._panel,
      this._hass.language,
    ]);
    if (key === this._lastKey) return;
    this._lastKey = key;
    this._render();
  }

  _render() {
    const t = this._t;
    if (!this._info) {
      this.shadowRoot.innerHTML = `<ha-card></ha-card>`;
      return;
    }
    if (!this._dev) {
      const msg = this._info.length > 1 ? t.choose_device : t.no_device;
      this.shadowRoot.innerHTML = `<ha-card><div style="padding:16px">${esc(msg)}</div></ha-card>`;
      return;
    }
    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <ha-card class="${this._config.background === "transparent" ? `clear${this._hass.themes?.darkMode ? " dark" : ""}` : ""}">
        <svg viewBox="${-PAD_L} 0 ${VIEW_W + PAD_L} ${VIEW_H}" role="img" aria-label="${esc(this._dev.name)}">
          ${this._svg()}
        </svg>
        ${this._confirmDialog()}
        ${this._panelDialog()}
      </ha-card>`;
    this._bind();
  }
}

// Method groups (see the files in methods/) are added to the class here
for (const methods of [dataMethods, pictureMethods, statsMethods, controlsMethods, panelsMethods, interactionMethods]) {
  Object.defineProperties(GruenbeckCard.prototype, Object.getOwnPropertyDescriptors(methods));
}

export { GruenbeckCard };
