/*
 * The main picture: pipes, display, resin tank, salt, badges, status lamps
 * and the water meter. Each method returns an SVG string for one part and
 * reads its values through the data methods.
 */
import { DH, FONT, LAMP_CY, LAMP_R, METER_RIGHT, PAD_L, PIPE_DY, VALVE_DX, VIEW_H, VIEW_W } from "../constants.js";
import { esc, text } from "../util.js";
import { BODY, BUBBLES, CABINET, DEFS, VALVES } from "../shapes.js";
import { ICONS, SALT_STACK } from "../icons.js";

export const pictureMethods = {
  _svg() {
    const capacity = this._num("mresidcap1");
    const flow = this._num("mflow1") || 0;
    const saltLow = this._on("salt_warning");
    const regenerating = this._on("regeneration_running");
    const error = this._on("has_error");
    const lit = this._ledLit(flow, error, saltLow);
    const brightness = this._num("led_brightness");

    return `
      ${DEFS}
      <rect x="${-PAD_L}" width="${VIEW_W + PAD_L}" height="${VIEW_H}" fill="${{ light: "url(#bg)", transparent: "none" }[this._config.background] || "url(#bgTint)"}"/>
      ${this._pipes(flow)}
      ${CABINET(6, this._lidBottom, this._taper)}
      ${this._display(capacity, regenerating)}
      ${this._led(lit, brightness)}
      <clipPath id="bodyClip"><path d="${BODY(6, this._lidBottom, this._taper)}"/></clipPath>
      <g clip-path="url(#bodyClip)">
        ${this._salt(saltLow)}
        ${this._shelf()}
        ${this._resin(capacity, regenerating, flow)}
      </g>
      ${this._tables(regenerating, saltLow)}
      ${this._config.show_controls === false ? "" : this._controls()}
      ${this._header(error, flow, regenerating, saltLow)}
    `;
  },

  // LED strip on the lid: lit like the ring on the device
  _hasLed() {
    return Object.keys(this._dev.entities).some((k) => k.startsWith("led_ring_") || k === "led_brightness");
  },

  _hasSaltSensor() {
    return Boolean(this._entityId("salt_warning"));
  },

  _ledLit(flow, error, saltLow) {
    if (this._on("led_ring_permanent")) return true;
    if (this._on("led_ring_failure") && error) return true;
    if (this._on("led_ring_message") && (error || saltLow)) return true;
    if (this._on("led_ring_flow") && flow > 0) return true;
    return false;
  },

  _pipes(flow) {
    const moving = flow > 0;
    const arrows = (x0) =>
      [0, 1, 2]
        .map((i) => `<path class="chevron" style="animation-delay:${(i * 0.5).toFixed(1)}s" d="M${x0 + i * 30} 59 l9 6 -9 6" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`)
        .join("");
    const DY = PIPE_DY;
    return `<g transform="translate(0 ${DY})">
      <rect x="${-PAD_L}" y="54" width="${504 + PAD_L}" height="22" fill="url(#pipe)"/>
      <path d="M${-PAD_L} 59 H${118 + VALVE_DX} l14 6 -14 6 H${-PAD_L} Z" fill="${moving ? "url(#flowIn)" : "url(#flowIdle)"}"/>
      <path d="M${250 + VALVE_DX} 59 H${356 + VALVE_DX} l14 6 -14 6 H${250 + VALVE_DX} Z" fill="${moving ? "url(#flowOut)" : "url(#flowIdleOut)"}"/>
      ${moving ? `<g class="flow">${arrows(30 + VALVE_DX / 2)}${arrows(282 + VALVE_DX)}</g>` : ""}
      ${VALVES}
      ${this._meter(flow)}</g>`;
  },

  // Display on the lid: remaining capacity, progress while regenerating
  _display(capacity, regenerating) {
    const progress = this._num("mregpercent1");
    const value = regenerating && progress != null
      ? `R ${Math.round(progress)}%`
      : capacity == null ? "--" : `${Math.round(capacity)}%`;
    return `<g class="tap" data-more="${regenerating ? "regeneration_running" : "mrescapa1"}"><title>${esc(`${regenerating ? `${this._t.regeneration}: ${value}\n` : ""}${this._t.capacity}: ${this._fmt("mresidcap1")}, ${this._fmt("mrescapa1")}`)}</title>
      ${this._lidSplit
        ? this._screen(capacity, regenerating, progress)
        : this._lidBottom > 222
        // Tall display next to both button rows
        // Light display like on the softliQ: dark digits, green unit
        ? `<rect x="${this._displayX}" y="154" width="48" height="${this._stripLow ? 66 : 94}" rx="6" fill="#fbfcfa" stroke="#c4cfd9" stroke-width="1.2"/>
           <rect x="${this._displayX + 3}" y="157" width="42" height="${this._stripLow ? 60 : 88}" rx="4" fill="none" stroke="#e6ebe3"/>
           ${text(this._displayX + 24, this._stripLow ? 186 : 197, value.replace("%", ""), `text-anchor="middle" font-size="${value.length > 4 ? 16 : 22}" font-weight="700" fill="#2b3136"`)}
           ${text(this._displayX + 24, this._stripLow ? 206 : 218, "%", 'text-anchor="middle" font-size="13" font-weight="700" fill="#5a9e32"')}`
        : `<rect x="234" y="157" width="50" height="26" rx="4" fill="#fbfcfa" stroke="#c4cfd9" stroke-width="1.2"/>
           ${text(259, 175, value, 'text-anchor="middle" font-size="13" font-weight="700" fill="#2b3136" letter-spacing=".5"')}`}
    </g>`;
  },

  // Display like the touch screen of the softliQ: dark frame, white
  // screen, remaining soft water in the middle, capacity as green dashes
  // left and right
  _screen(capacity, regenerating, progress) {
    const pct = capacity == null ? 0 : Math.max(0, Math.min(100, capacity));
    const st = this._state("mrescapa1");
    const raw = this._num("mrescapa1");
    const unit = st?.attributes?.unit_of_measurement;
    const liters = raw == null ? null : unit === "L" ? raw : raw * 1000;
    const dashes = 6;
    const lit = Math.round((pct / 100) * dashes);
    let gauge = "";
    for (let i = 0; i < dashes; i++) {
      // From the bottom up along a slight curve
      const y = 207 - i * 9;
      const bow = Math.abs(i - (dashes - 1) / 2) * 2.2;
      const color = i < lit ? (regenerating ? "#ef6c00" : "#7cc24a") : "#dfe5ea";
      gauge += `<line x1="${105 + bow}" y1="${y}" x2="${113 + bow}" y2="${y}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
      gauge += `<line x1="${193 - bow}" y1="${y}" x2="${185 - bow}" y2="${y}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
    }
    const sub = regenerating && progress != null ? `R ${Math.round(progress)} %` : capacity == null ? "–" : `${Math.round(capacity)} %`;
    const big = liters == null ? "–" : this._number(liters, 0);
    return `<rect x="94" y="150" width="110" height="72" rx="13" fill="#2b3136"/>
      <rect x="98" y="154" width="102" height="64" rx="9" fill="#fbfcfa"/>
      ${gauge}
      <text x="149" y="192" text-anchor="middle" font-family="${FONT}" font-size="${big.length > 4 ? 15 : 19}" font-weight="700" fill="#2b3136">${esc(big)}<tspan font-size="10" font-weight="600" fill="#5b6478" dx="2">L</tspan></text>
      ${text(149, 210, sub, `text-anchor="middle" font-size="10.5" font-weight="700" fill="${regenerating ? "#ef6c00" : "#5a9e32"}"`)}`;
  },

  _led(lit, brightness) {
    if (!this._hasLed()) return "";
    const level = brightness == null ? 1 : Math.max(0.35, Math.min(1, brightness / 100));
    const fill = lit ? "#c5e8a4" : "#dfe4e9";
    // No label on the strip: brightness is in the tooltip, a tap opens the
    // brightness slider
    const tip = brightness == null ? this._t.led_ring || "LED" : `${this._t.brightness}: ${this._fmt("led_brightness")}`;
    return `<rect class="led tap" data-more="led_brightness" x="6.8" y="${this._stripY}" width="${this._lidBottom > 222 && !this._stripLow ? 217 : 284.4}" height="20" rx="1.5" fill="${fill}" opacity="${lit ? level.toFixed(2) : 1}"><title>${esc(tip)}</title></rect>`;
  },

  _resin(capacity, regenerating, flow) {
    const g = this._geo;
    const pct = capacity == null ? 100 : Math.max(0, Math.min(100, capacity));
    // Resin across the inner width of the cabinet above the plate
    const ix = g.x;
    const iw = g.w;
    const iy0 = g.top;
    const iy1 = g.shelf;
    const full = iy0 + 16;
    const empty = iy1 - 12;
    const top = empty - ((empty - full) * pct) / 100;
    // Bubble positions are drawn for a 120 x 330 area and spread to the tank
    const bx = (b) => (ix + ((b - 112) / 120) * iw).toFixed(1);
    const by = (b) => +(iy0 + ((b - 238) / 330) * (iy1 - iy0)).toFixed(1);
    const bubbles = BUBBLES.filter((b) => by(b[1]) > top + 6)
      .map((b, i) => `<circle cx="${bx(b[0])}" cy="${by(b[1])}" r="${b[2]}" fill="#ffffff" opacity="${b[3]}"${flow > 0 ? ` class="bubble" style="animation-delay:-${((i * 0.37) % 3).toFixed(2)}s"` : ""}/>`)
      .join("");
    const wave = `M${ix} ${top} Q${ix + iw / 4} ${top - 9} ${ix + iw / 2} ${top} T${ix + iw} ${top} V${top + 6} H${ix} Z`;
    const title = `<title>${esc(`${this._t.capacity}: ${capacity == null ? "–" : Math.round(capacity) + " %"}`)}</title>`;
    return `
      <clipPath id="tankClip"><rect x="${ix}" y="${iy0}" width="${iw}" height="${iy1 - iy0}"/></clipPath>
      <g clip-path="url(#tankClip)" class="resin tap" data-more="mrescapa1">${title}
        <rect x="${ix}" y="${iy0}" width="${iw}" height="${iy1 - iy0}" fill="transparent"/>
        <rect x="${ix}" y="${top}" width="${iw}" height="${iy1 + 8 - top}" fill="url(#resin)" opacity=".85" class="${regenerating ? "regen" : ""}"/>
        ${bubbles}
        ${pct > 1 ? `<path d="${wave}" fill="#b8dcf8" opacity=".8"/>` : ""}
      </g>`;
  },

  // Perforated plate between the salt and the resin bottle, the bottle
  // stands on it
  _shelf() {
    // Soft plate in the style of the lid, with a light edge and shadow
    const geo = this._geo;
    const inset = (this._taper * (geo.shelf - this._lidBottom)) / (696 + DH - this._lidBottom);
    const g = { ...geo, x: geo.x + inset, w: geo.w - 2 * inset };
    return `<rect x="${g.x + 2}" y="${g.shelf + 13}" width="${g.w - 4}" height="5" fill="#9fb0c0" opacity=".16"/>
      <rect x="${g.x}" y="${g.shelf}" width="${g.w}" height="12" rx="6" fill="url(#lid)" stroke="#c4cfd9" stroke-width="1.2"/>
      <line x1="${g.x + 8}" y1="${g.shelf + 3.5}" x2="${g.x + g.w - 8}" y2="${g.shelf + 3.5}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity=".9"/>`;
  },

  _salt(saltLow) {
    const g = this._geo;
    // Round tablets of one size at random angles, dense at the bottom and
    // looser further up. They stay inside the tapered tank, so none is cut
    // off at the side; the top ones stay fully visible below the plate.
    // With the salt warning only a small flat heap in the middle.
    const bottom = 676 + DH;
    let seed = saltLow ? 5 : 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const margin = 1.5 + this._taper + 17;
    const x0 = g.x + margin, wd = g.w - 2 * margin;
    const H = Math.min(100, bottom - g.shelf - 40);
    const dome = (u) => saltLow
      ? 44 * Math.pow(Math.max(0, 1 - Math.pow((u - 0.5) / 0.3, 2)), 0.9)
      : H * (0.7 + 0.3 * (1 - Math.pow(2 * u - 1, 2)));
    const items = [];
    const place = (depth, count) => {
      for (let k = 0; k < count; k++) {
        const x = x0 + rnd() * wd;
        const top = dome(Math.min(1, Math.max(0, (x - x0) / wd)));
        if (top <= 1) continue;
        items.push({ x, y: bottom - depth(top), a: (rnd() - 0.5) * 70, tone: rnd() });
      }
    };
    if (saltLow) place((top) => Math.pow(rnd(), 0.8) * top, 70);
    else {
      place(() => rnd() * 26, Math.round(wd * 26 / 85));
      place((top) => 14 + Math.pow(rnd(), 1.2) * Math.max(0, top - 14), Math.round(wd * H / 210));
    }
    items.sort((a, b) => a.y - b.y);
    const rx = 11, ry = rx * 0.64, th = 4.2;
    const tablets = items.map((p) => {
      const sh = Math.round(228 - p.tone * 14);
      return `<g transform="translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.a.toFixed(0)})"><path d="M${-rx} 0 V${th} A${rx} ${ry} 0 0 0 ${rx} ${th} V0 Z" fill="rgb(${sh - 22},${sh - 12},${sh})" stroke="#9fb0c0" stroke-width=".8"/><ellipse rx="${rx}" ry="${ry}" fill="${p.tone > 0.5 ? "#fdfeff" : "#f2f6fa"}" stroke="#9fb0c0" stroke-width=".8"/></g>`;
    }).join("");
    return `
      <path d="M${g.x + 4} ${658 + DH} Q${g.x + g.w / 2} ${652 + DH} ${g.x + g.w - 2} ${658 + DH} V${676 + DH} Q${g.x + g.w - 2} ${694 + DH} ${g.x + g.w - 20} ${694 + DH} H${g.x + 22} Q${g.x + 4} ${694 + DH} ${g.x + 4} ${676 + DH} Z" fill="#cfe6fa" opacity=".55"/>
      <g class="salt tap" data-panel="saltstat"><title>${esc(`${this._t.salt_range}: ${!this._hasSaltSensor() ? this._t.no_sensor : saltLow ? this._t.salt_low : this._t.salt_ok}`)}</title>${tablets}</g>`;
  },

  _header(error, flow, regenerating, saltLow) {
    const t = this._t;
    const y = 66 + PIPE_DY;
    // Raw and soft water mirrored around the valve, in the pipe
    return `
      ${this._lamps(error, saltLow)}
      ${this._iconPill(43, y, "raw", "#9aa7b3", this._fmt("raw_water_hardness"), t.raw_water, "raw_water_hardness", undefined, "left")}
      ${this._iconPill(243, y, "soft", "#3d8bd6", this._fmt("soft_water_hardness"), t.soft_water, "soft_water_hardness", undefined, "right")}`;
  },

  // Water meter built into the pipe right of the valve: the total counter,
  // below it the wheel and the counter of the current flow
  _meter(flow) {
    if (!this._entityId("calculated_water_consumption") && !this._entityId("mflow1")) return "";
    const t = this._t;
    const total = (this._num("calculated_water_consumption") || 0) / 1000;
    const n = Math.floor(total);
    const tdigits = String(n).padStart(5, "0").slice(-5).split("").concat(String(Math.floor((total - n) * 10)));
    const fi = Math.floor(flow);
    const fdigits = String(Math.min(fi, 999)).padStart(3, "0").split("").concat(String(Math.round((flow - fi) * 10) % 10));
    const cw = 11.4;
    const counter = (x0, y0, digits) => digits.map((d, i) => {
      const x = x0 + i * cw;
      const red = i === digits.length - 1;
      return `<rect x="${x}" y="${y0}" width="${cw - 0.8}" height="16" rx="1.4" fill="${red ? "#c0392b" : "#2b3136"}"/>${text(x + (cw - 0.8) / 2, y0 + 12, d, 'text-anchor="middle" font-size="12" font-weight="700" fill="#fff"')}`;
    }).join("");
    const moving = flow > 0;
    const color = moving ? "#1565c0" : "#5b6478";
    const blades = [0, 120, 240].map((a) => `<path d="M356 70 L351 60.4 A11 11 0 0 1 361 60.4 Z" fill="#3d8bd6" transform="rotate(${a} 356 70)"/>`).join("");
    const tip = `${t.water_meter}: ${this._number(total, 1)} m³, ${t.flow_now}: ${this._number(flow, 1)} L/min`;
    return `<g><title>${esc(tip)}</title>
      <rect x="336" y="44" width="154" height="52" rx="12" fill="url(#pipe)" stroke="#b7c3ce"/>
      <g class="tap" data-panel="chart:water:total"><title>${esc(`${t.water_meter}: ${this._number(total, 1)} m³`)}</title>
        <rect x="378" y="46" width="108" height="26" fill="transparent"/>
        ${counter(381, 50, tdigits)}${text(381 + 6 * cw + 3, 62.5, "m³", 'font-size="12" font-weight="700" fill="#5b6478"')}
      </g>
      <g class="tap" data-panel="chart:water:day:mflow1"><title>${esc(`${t.flow_now}: ${this._number(flow, 1)} L/min`)}</title>
        <rect x="338" y="72" width="148" height="22" fill="transparent"/>
        <circle cx="356" cy="70" r="17" fill="#ffffff" stroke="#9aa7b3" stroke-width="2"/>
        <g class="${moving ? "spin" : ""}">${blades}</g><circle cx="356" cy="70" r="2.4" fill="#7d8b97"/>
        ${counter(381, 74, fdigits)}${text(381 + 4 * cw + 3, 86.5, "L/min", `font-size="12" font-weight="700" fill="${color}"`)}
      </g>
    </g>`;
  },

  // Two fixed round lamps like the buttons on the lid: salt (left) and the
  // plant (right). Colour and symbol change, never the size.
  _lamps(error, saltLow) {
    const t = this._t;
    const cy = LAMP_CY;
    const r = LAMP_R;
    const k = LAMP_R / 14;
    const big = (cx, svg) => `<g transform="translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})">${svg}</g>`;
    const lamp = (cx, fill, on, icon, title, attrs) => `<g class="tap"${attrs}><title>${esc(title)}</title>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${on ? "" : 'fill-opacity=".13" stroke-opacity=".4"'} stroke="${fill}" stroke-width="1.5"/>${icon}</g>`;
    // Right edge on the right edge of the water meter
    const cxPlant = METER_RIGHT - r;
    let plant;
    if (error) {
      const last = this._state("last_error")?.state;
      const msg = last && !["unknown", "unavailable"].includes(last) ? last : t.error;
      const code = this._errorCode(msg);
      const icon = code
        ? big(cxPlant, text(cxPlant, cy + 4, code, `text-anchor="middle" font-size="${code.length > 3 ? 9.5 : 11.5}" font-weight="800" fill="#fff"`))
        : big(cxPlant, `<path d="${ICONS.failure}" fill="#fff" transform="translate(${cxPlant - 10} ${cy - 10}) scale(${20 / 24})"/>`);
      plant = lamp(cxPlant, "#d32f2f", true, icon, msg, ' data-panel="error" data-info="last_error"');
    } else if (this._on("no_data_change")) {
      const since = this._formatDate(this._state("no_data_change").attributes.since);
      plant = lamp(cxPlant, "#9aa7b3", true, big(cxPlant, `<path d="${ICONS.cloudOff}" fill="#fff" transform="translate(${cxPlant - 9} ${cy - 9}) scale(${18 / 24})"/>`), t.no_change.replace("{date}", since), ' data-panel="status" data-info="no_data_change"');
    } else {
      plant = lamp(cxPlant, "#5a9e32", true, big(cxPlant, `<path d="M${cxPlant - 6} ${cy + 0.5} l4.6 4.6 l8 -9.6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`), t.plant_ok, ' data-panel="status"');
    }
    // Only plants with a salt sensor have the salt lamp
    if (!this._hasSaltSensor()) return plant;
    const cxSalt = cxPlant - 2 * r - 6;
    const salt = lamp(cxSalt, saltLow ? "#ef6c00" : "#8a96a3", !!saltLow, big(cxSalt, SALT_STACK(cxSalt, cy, saltLow ? "#fff" : "#8a96a3", 1.3, saltLow ? "#ef6c00" : "#f2f4f7")),
      (saltLow ? `${t.salt_range}: ${t.salt_low}` : t.salt_range) + (() => {
        const l = this._refillInfo().slice(-1)[0];
        return l ? `\n${t.last_refill}: ${this._formatDate(l.time)}` + (l.kg == null ? "" : ` (${t.usage_before_n.replace("{v}", this._kg(l.kg))})`) : "";
      })(), ' data-panel="refills"');
    return salt + plant;
  },
};
