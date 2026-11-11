// Builds the single file that Home Assistant loads.
//
//   npm install      (once, fetches esbuild)
//   node build.mjs   -> ../custom_components/gruenbeck_cloud_se/frontend/gruenbeck-card.js
//
// The version shown in the browser console is taken from the manifest of
// the integration, so there is only one place to change it.
// Optional arguments: node build.mjs <output file> <manifest.json>
import { build } from "esbuild";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const here = path.dirname(fileURLToPath(import.meta.url));
const integration = path.join(here, "..", "custom_components", "gruenbeck_cloud_se");
const out = process.argv[2] || path.join(integration, "frontend", "gruenbeck-card.js");
const manifest = process.argv[3] || path.join(integration, "manifest.json");
const version = JSON.parse(readFileSync(manifest, "utf8")).version;

await build({
  entryPoints: [path.join(here, "src", "index.js")],
  bundle: true,
  format: "iife",
  target: "es2020",
  charset: "utf8",
  outfile: out,
  define: { __CARD_VERSION__: JSON.stringify(version) },
  banner: { js: "/* Gruenbeck card - built file. Edit the sources in card/src/, then run card/build.mjs. */" },
});
console.log("built", out, "version", version);
