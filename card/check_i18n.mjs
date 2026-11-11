// Checks that every language file has exactly the keys of en.json.
//   node check_i18n.mjs
import fs from "fs";
const dir = new URL("./src/i18n/", import.meta.url);
const flat = (o, p = "") => Object.entries(o).flatMap(([k, v]) => (v && typeof v === "object" ? flat(v, p + k + ".") : [p + k]));
const ref = new Set(flat(JSON.parse(fs.readFileSync(new URL("en.json", dir)))));
let bad = 0;
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
  const keys = new Set(flat(JSON.parse(fs.readFileSync(new URL(f, dir)))));
  for (const k of ref) if (!keys.has(k)) { console.log(f, "misses", k); bad++; }
  for (const k of keys) if (!ref.has(k)) { console.log(f, "has extra", k); bad++; }
}
console.log(bad ? `${bad} problems` : "all language files have the same keys");
process.exit(bad ? 1 : 0);
