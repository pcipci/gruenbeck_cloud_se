// Static check of the sources: node_modules/.bin/eslint src   (or: npm run lint)
const browser = ["window", "document", "customElements", "HTMLElement", "navigator", "console", "CustomEvent", "Event", "MouseEvent", "setTimeout", "clearTimeout", "requestAnimationFrame", "Intl", "getComputedStyle", "performance", "history", "location"];
export default [
  {
    files: ["src/**/*.js"],
    languageOptions: { ecmaVersion: 2022, sourceType: "module", globals: Object.fromEntries(browser.map((name) => [name, "readonly"])) },
    rules: { "no-undef": "error", "no-unused-vars": ["error", { args: "none" }], "no-dupe-keys": "error", "no-unreachable": "error" },
  },
];
