/*
 * The visual editor. Home Assistant asks the card for a form schema
 * (getConfigForm); labels and help texts come from i18n/*.json by option name
 * (<name> and <name>_help). Add a new option here AND its two texts.
 */
import { DOMAIN } from "./constants.js";
import { TEXT } from "./i18n/index.js";

export function getConfigForm() {
  const lang = (document.querySelector("home-assistant")?.hass?.language || "en").startsWith("de") ? "de" : "en";
  const T = TEXT[lang];
  const opt = (names) => names.map((value) => ({ value, label: T[`opt_${value}`] || value }));
  const select = (options) => ({ select: { mode: "dropdown", options: opt(options) } });
  const group = (name, expanded, schema) => ({ type: "expandable", name: `group_${name}`, title: T[`group_${name}`], flatten: true, expanded, schema });
  return {
    // Three groups, flattened: the saved YAML stays a flat list of options
    schema: [
      group("general", true, [
        { name: "device", selector: { device: { integration: DOMAIN } } },
        { name: "language", selector: { select: { mode: "dropdown", options: [{ value: "", label: T.opt_auto }, { value: "de", label: "Deutsch" }, { value: "en", label: "English" }] } } },
      ]),
      group("display", true, [
        { name: "background", default: "tint", selector: select(["tint", "light", "transparent"]) },
        { name: "show_controls", default: true, selector: { boolean: {} } },
      ]),
      group("behavior", false, [
        { name: "confirm", default: true, selector: { boolean: {} } },
        { name: "service_done_days", default: 30, selector: { number: { min: 1, max: 365, mode: "box", unit_of_measurement: lang === "de" ? "Tage" : "days" } } },
      ]),
    ],
    computeLabel: (schema) => T[schema.name] || schema.name,
    computeHelper: (schema) => T[`${schema.name}_help`] || "",
  };
}
