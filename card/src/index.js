/*
 * Entry point of the bundle: registers the custom element "gruenbeck-card" and
 * announces the card to the Home Assistant card picker (window.customCards).
 * Nothing else lives here. Start reading at card.js.
 *
 * The integration registers the built file as frontend module, so the card is
 * available as "custom:gruenbeck-card" without adding a resource. With one
 * softener it needs no configuration: the entities are looked up by their
 * unique id through the websocket command "gruenbeck_cloud_se/card_info".
 */
import { CARD_VERSION } from "./constants.js";
import { TEXT } from "./i18n/index.js";
import { GruenbeckCard } from "./card.js";

if (!customElements.get("gruenbeck-card")) {
  customElements.define("gruenbeck-card", GruenbeckCard);
  window.customCards = window.customCards || [];
  const lang = (navigator.language || "en").startsWith("de") ? "de" : "en";
  window.customCards.push({
    type: "gruenbeck-card",
    name: TEXT[lang].name,
    description: TEXT[lang].description,
    preview: true,
    documentationURL: "https://github.com/sventiffe/gruenbeck_cloud_se",
  });
  console.info(`%c GRUENBECK-CARD %c ${CARD_VERSION} `, "color:#fff;background:#3d8bd6", "color:#3d8bd6;background:#fff");
}
