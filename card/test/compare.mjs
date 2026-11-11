// Compares two builds of the card: both are loaded into the mock page, put
// into the same device states and options, every window is opened, and the
// HTML they draw is compared. Use it for changes that must not alter the
// picture (refactoring, clean-up):
//
//   git stash; node build.mjs /tmp/before.js; git stash pop
//   node build.mjs /tmp/after.js
//   npm install --no-save playwright && npx playwright install chromium   (once)
//   node test/compare.mjs /tmp/before.js /tmp/after.js
//
// It prints the first differences, or "identical".
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "url";
import path from "path";

const [before, after] = process.argv.slice(2).map((file) => pathToFileURL(path.resolve(file)).href);
const mock = pathToFileURL(path.join(path.dirname(fileURLToPath(import.meta.url)), "mock.html")).href;

// Device states: name -> list of [entity key, state, attributes]
const hoursAgo = (h) => new Date(Date.parse("2026-11-06T12:00:00Z") - h * 3600000).toISOString();
const STATES = {
  normal: [],
  regenerating: [["regeneration_running", "on"], ["regeneration_phase", "salting"], ["mregpercent1", "42"]],
  error: [["has_error", "on", { last_error: { message: "E12", date: hoursAgo(2), isResolved: false } }], ["last_error", "E12"]],
  salt_low: [["salt_warning", "on", { refills: [hoursAgo(960), hoursAgo(2160)] }]],
  never_refilled: [["salt_warning", "off", { refills: [] }]],
  no_data_change: [["no_data_change", "on", { since: hoursAgo(30) }]],
  fixed_times: [["iq_mode", "off"], ["next_regeneration_window", hoursAgo(-5)]],
  unavailable: ["mrescapa1", "mresidcap1", "mflow1", "salt_total", "calculated_water_consumption"].map((key) => [key, "unavailable"]),
  water_flowing: [["mflow1", "7.5", { unit_of_measurement: "L/min" }]],
  overdue: [["inspection_days_remaining", "-3"], ["maintenance_days_remaining", "12"]],
};
const CONFIGS = [{}, { language: "de" }, { background: "transparent" }, { show_controls: false, background: "light" }, { confirm: false, service_done_days: 200 }];

async function draw(browser, cardUrl) {
  const out = [];
  for (const [stateName, changes] of Object.entries(STATES)) {
    for (const [index, config] of CONFIGS.entries()) {
      const page = await browser.newPage({ viewport: { width: 560, height: 900 } });
      page.on("pageerror", (error) => out.push(`ERROR ${stateName} ${index}: ${error.message}`));
      await page.clock.install({ time: new Date("2026-11-06T12:00:00Z") });
      await page.goto(`${mock}?card=${encodeURIComponent(cardUrl)}`);
      await page.waitForFunction(() => document.querySelector("gruenbeck-card")?._dev);
      await page.evaluate(([changes, config]) => {
        const card = document.querySelector("gruenbeck-card");
        const hass = card._hass;
        for (const [key, state, attributes = {}] of changes) {
          const id = card._dev.entities[key] || `sensor.softener_${key}`;
          card._dev.entities[key] = id;
          hass.states[id] = { entity_id: id, state, attributes, last_changed: new Date().toISOString() };
        }
        hass.themes = { darkMode: config.background === "transparent" };
        card.setConfig(config);
        card._lastKey = "";
        card.hass = hass;
      }, [changes, config]);
      await page.waitForTimeout(300);
      // The style sheet is left out: it is compared by eye, with screenshots
      const html = () => page.evaluate(() => document.querySelector("gruenbeck-card").shadowRoot.innerHTML.replace(/<style>[\s\S]*?<\/style>/, "").replace(/\s+/g, " "));
      out.push(`${stateName}/${index}: ${await html()}`);
      const panels = await page.evaluate(() => [...new Set([...document.querySelector("gruenbeck-card").shadowRoot.querySelectorAll("[data-panel]")].map((el) => el.getAttribute("data-panel")))]);
      for (const panel of panels) {
        await page.evaluate((panel) => document.querySelector("gruenbeck-card")._openPanel(panel), panel);
        await page.waitForTimeout(250);
        out.push(`${stateName}/${index}/${panel}: ${await html()}`);
        await page.evaluate(() => document.querySelector("gruenbeck-card")._closePanel());
      }
      await page.close();
    }
  }
  return out;
}

const browser = await chromium.launch();
const [a, b] = [await draw(browser, before), await draw(browser, after)];
await browser.close();
let differences = 0;
a.forEach((text, i) => {
  if (text === b[i]) return;
  differences++;
  if (differences > 5) return;
  let at = 0;
  while (at < text.length && text[at] === (b[i] || "")[at]) at++;
  console.log(`DIFFERENT ${text.slice(0, 50)}\n  before: ${text.slice(Math.max(0, at - 60), at + 100)}\n  after:  ${(b[i] || "").slice(Math.max(0, at - 60), at + 100)}`);
});
const errors = [...a, ...b].filter((line) => line.startsWith("ERROR"));
console.log(`${a.length} drawings compared, ${differences} different, ${errors.length} script errors${errors.length ? `\n${errors.slice(0, 5).join("\n")}` : ""}`);
console.log(differences || errors.length ? "NOT identical" : "identical");
process.exit(differences || errors.length ? 1 : 0);
