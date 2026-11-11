# Grünbeck card – source code

This folder holds the **source** of the card `custom:gruenbeck-card`. Home Assistant loads one built file,
`custom_components/gruenbeck_cloud_se/frontend/gruenbeck-card.js`; `build.mjs` creates it from the files in `src/`.
Do not edit the built file by hand, it is overwritten on every build. What the card does for a user is described in [docs/card.md](../docs/card.md).

## Build

```
npm install        # once, fetches esbuild and eslint
npm run check      # same keys in all language files, no undefined or unused names
node build.mjs     # writes ../custom_components/gruenbeck_cloud_se/frontend/gruenbeck-card.js
```

The version printed in the browser console comes from `manifest.json` of the integration, so the version is changed in one place only.

## Where to find what

Start with `src/card.js`, it is the card itself and only a few lines per step. Every other file has a comment at the top that says what it is for.

| File | What it does |
| --- | --- |
| `src/index.js` | Registers the element and tells the card picker about it |
| `src/card.js` | The card element: `setConfig`, `set hass`, redraw only on changes |
| `src/editor.js` | Visual editor (three groups: General, Display, Behavior) |
| `src/i18n/*.json` | All texts, one file per language |
| `src/constants.js` | Sizes of the drawing, colours, list of control switches |
| `src/shapes.js` | Fixed parts of the picture (housing, valves, gradients) |
| `src/icons.js` | Pictograms and their helper functions |
| `src/stats-layout.js` | Measures of the statistics rows, derived from the icons |
| `src/style.js` | CSS of the card |
| `src/methods/data.js` | Finds the device and entities, reads and formats values, loads statistics |
| `src/methods/picture.js` | Draws the main picture (pipes, display, tank, salt, lamps, meter) |
| `src/methods/stats.js` | Draws the statistics blocks and the bottom strip |
| `src/methods/controls.js` | Control lid, switches, confirmation dialog |
| `src/methods/panels.js` | Windows opened by tapping a block: lists, charts, "done" button |
| `src/methods/interaction.js` | Taps, long presses, tooltips |

The files in `methods/` are groups of methods of the same class. They are attached to the class at the end of `card.js`, so `this` inside them is the card. A method that returns SVG is named after the part it draws (`_display`, `_resin`, `_salt` ...) and returns a string.

## How data flows

1. Home Assistant calls `set hass` on every state change.
2. `_update` finds the softener (`methods/data.js`: websocket `gruenbeck_cloud_se/card_info` returns the entity ids and the daily values) and checks whether anything shown has changed.
3. If so, `_render` builds the whole SVG from the parts in `methods/picture.js` and `methods/stats.js` and puts it into the shadow DOM.
4. `_bind` (`methods/interaction.js`) attaches taps to the new elements; panels (`methods/panels.js`) draw their own dialogs.

## Add or change something

* **A text:** add the key to every `src/i18n/<lang>.json`, then run `npm run check`.
* **An option in the editor:** add it to `src/editor.js` (in the fitting group), plus `<name>` and `<name>_help` in the language files; read it in the code via `this._config.<name>`.
* **A language:** copy `en.json`, translate the values, import it in `src/i18n/index.js`.
* **A row in the statistics:** `methods/stats.js`, method `_tables`; pictograms go to `icons.js`.

## Checking a change

* `npm run check` finds missing texts and undefined or unused names.
* `test/mock.html` is a page with a fake Home Assistant object and invented values. Serve this folder with any web server and open it to look at the card without a softener.
* `test/compare.mjs` compares two builds of the card: it puts both into ten device states (normal, regenerating, error, salt low, no data, ...) with five sets of options, opens every window and compares what they draw. Use it for changes that must not alter the picture; the header of the file shows how. It needs Playwright, which is not installed by `npm install`.

A shift of a few pixels in the style sheet is not found by the comparison, so look at the card in the mock page after changing `style.js`.
