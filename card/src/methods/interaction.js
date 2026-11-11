/*
 * Event handling after each draw: binds taps and long presses, shows and
 * hides the tooltip bubbles.
 */
import { ICONS } from "../icons.js";

export const interactionMethods = {
  // --- interaction ------------------------------------------------------
  _bind() {
    const root = this.shadowRoot;
    // Tooltips need a mouse. On touch screens holding a symbol shows its
    // tooltip as a bubble; a tap on a symbol without own action does too
    root.querySelectorAll("svg *").forEach((el) => {
      if (!el.querySelector(":scope > title") || el.classList.contains("switch") || el.dataset.more || el.dataset.panel) return;
      if (el.parentElement?.closest("[data-panel], [data-more]")) return;
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._showTip(el, ev, el.dataset.info);
      });
    });
    root.querySelectorAll("svg [data-panel]").forEach((el) => {
      this._press(el, () => this._openPanel(el.dataset.panel), (ev) => this._showTip(el, ev, el.dataset.info));
    });
    this._bindPanel();
    root.querySelectorAll(".switch").forEach((el) => {
      this._press(el, () => this._toggle(el.dataset.key, el.dataset.label), (ev) => this._showTip(el, ev, el.dataset.key));
    });
    root.querySelectorAll("[data-more]").forEach((el) => {
      if (el.classList.contains("switch")) return;
      this._press(el, () => this._moreInfo(el.dataset.more), (ev) => this._showTip(el, ev, el.dataset.more));
    });
    root.querySelector("ha-card")?.addEventListener("click", () => this._hideTip());
    root.querySelector(".dialog .yes")?.addEventListener("click", () => {
      const key = this._confirm.key;
      this._confirm = null;
      this._callToggle(key);
      this._update();
    });
    root.querySelector(".dialog .cancel")?.addEventListener("click", () => {
      this._confirm = null;
      this._update();
    });
  },

  // Tooltip as a bubble near the finger, with a button for the details
  _showTip(el, ev, more) {
    this._hideTip();
    const title = el.querySelector(":scope > title")?.textContent;
    const card = this.shadowRoot.querySelector("ha-card");
    if (!title || !card) return;
    const tip = document.createElement("div");
    tip.className = "tip";
    tip.setAttribute("role", "tooltip");
    const span = document.createElement("span");
    span.textContent = title;
    tip.appendChild(span);
    if (more && this._entityId(more)) {
      const button = document.createElement("button");
      button.title = this._t.details;
      button.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18"><path d="${ICONS.info}" fill="#fff"/></svg>`;
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        this._hideTip();
        this._moreInfo(more);
      });
      tip.appendChild(button);
    }
    tip.addEventListener("click", (e) => e.stopPropagation());
    card.appendChild(tip);
    const box = card.getBoundingClientRect();
    const x = (ev?.clientX ?? box.left + box.width / 2) - box.left;
    const y = (ev?.clientY ?? box.top + box.height / 2) - box.top;
    const left = Math.max(8, Math.min(box.width - tip.offsetWidth - 8, x - tip.offsetWidth / 2));
    const top = y - tip.offsetHeight - 16 > 8 ? y - tip.offsetHeight - 16 : y + 20;
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
    this._tipTimer = setTimeout(() => this._hideTip(), 5000);
  },

  _hideTip() {
    clearTimeout(this._tipTimer);
    this.shadowRoot?.querySelectorAll(".tip").forEach((tip) => tip.remove());
  },

  // Tap acts, holding for half a second shows the tooltip
  _press(el, tap, hold) {
    let timer = null;
    let held = false;
    let last = null;
    el.addEventListener("pointerdown", (ev) => {
      held = false;
      last = { clientX: ev.clientX, clientY: ev.clientY };
      timer = setTimeout(() => {
        held = true;
        hold(last);
      }, 500);
    });
    const cancel = () => clearTimeout(timer);
    el.addEventListener("pointerleave", cancel);
    el.addEventListener("pointercancel", cancel);
    el.addEventListener("click", (ev) => {
      ev.stopPropagation();
      cancel();
      if (!held) tap();
    });
    el.addEventListener("contextmenu", (ev) => ev.preventDefault());
  },
};
