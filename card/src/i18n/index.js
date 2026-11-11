/*
 * Card texts. The words live in de.json and en.json next to this file; the
 * bundler embeds them. To add a language: copy en.json to <lang>.json, translate
 * the values (keep the keys), import it below and add it to TEXT.
 */
import de from "./de.json";
import en from "./en.json";

export const TEXT = { de, en };
