/*
 * The statistics blocks on the right (water, salt, lime, device) with their
 * rows and calendar pictograms, plus the bottom strip with salt and service
 * rows and the small icons for the statistics.
 */
import { DH, FONT, GREEN, GRID_ROW_H, LAST_SCALE, ROW_BG, ROW_GREY, ROW_ICON_SCALE, VALUE_FS } from "../constants.js";
import { esc } from "../util.js";
import { CLOCK_ICON, COUNT_ICON, GLYPH_SIZE, HEADER_BOX, HEADER_ICONS, LAST_ICON, LIME_CRYSTALS, OUTLINE_DROP, SALT_STACK, avgBadge, glyphPath } from "../icons.js";
import { HEAD_INK_DX, HEAD_LEFT, ROW_INK, VALUE_X, headScale } from "../stats-layout.js";

export const statsMethods = {
  // Header pictogram without circle, scaled to one height (at most 28 wide)
  // and centred on (cx, cy), drawn in the block colour
  _headIcon(icon, left, cy, back) {
    const [bx, by, , bh] = HEADER_BOX[icon];
    const scale = headScale(icon);
    const ox = left - bx * scale + (HEAD_INK_DX[icon] ?? 0);
    const oy = cy - (by + bh / 2) * scale;
    const svg = HEADER_ICONS[icon](0, 0).replace(/#3d8bd6/g, back).replace(/#fff(fff)?\b/gi, "#3d8bd6");
    return `<g class="hic" transform="translate(${ox.toFixed(2)} ${oy.toFixed(2)}) scale(${scale.toFixed(3)})">${svg}</g>`;
  },

  _gridBox(y, title, rows, icon, panel) {
    const rh = GRID_ROW_H;
    // Header: symbol in the block colour with a strong line through its
    // middle; the rows move left under it, so the values get more room
    const dx = -14;
    let out = `<g><title>${esc(title)}</title>${this._headIcon(icon, HEAD_LEFT, y + 14, "#e7ecef")}</g>`;
    out += `<rect x="354" y="${y + 13}" width="134" height="2.5" rx="1" fill="#3d8bd6"/>`;
    // The block pictogram opens the block's chart
    if (panel) out = `<g class="tap" data-panel="${panel}"><title>${esc(title)}</title>${out}</g>`;
    y += 32;
    const height = rows.length * rh;
    rows.forEach((row, i) => {
      const ry = y + i * rh;
      const { cls, attrs } = this._rowAttrs(row);
      out += `<g class="${cls}"${attrs}>`;
      const tip = [row.label || row.title, row.value].filter(Boolean).join(": ") + (row.label && row.title ? ` (${row.title})` : "");
      out += `<title>${esc(tip)}</title>`;
      out += (i < rows.length - 1 ? `<line class="rl" x1="${VALUE_X - 4}" y1="${ry + rh}" x2="488" y2="${ry + rh}" stroke="#e3e8e2"/>` : "") + `<rect x="${332 + dx}" y="${ry}" width="164" height="${rh}" fill="transparent"/>`;
      // Row pictograms are drawn for x 318, moved into the row; on the
      // softliQ look their left edge is flush with the header symbols
      const kind = row.period ? (row.period === "avg30" ? "avg30" : "cal") : row.glyph || row.ink;
      const ink = ROW_INK[kind];
      const sx = ink ? HEAD_LEFT - (18 + dx + 329 + ink[0]) : 0;
      let pic = "";
      if (row.period) pic = this._calendar(ry, row.period);
      else if (row.glyph) pic = glyphPath(row.glyph, 329, ry + 10, GLYPH_SIZE[row.glyph]);
      else pic = row.icon ? (row.iscale ? `<g transform="translate(329 ${ry + 10}) scale(${row.iscale}) translate(-329 ${-(ry + 10)})">${row.icon(ry + 10)}</g>` : row.icon(ry + 10)) : "";
      // Row pictograms dark grey, the header symbols stay green
      pic = pic.replace(/#3d8bd6/g, ROW_GREY);
      out += `<g class="ric" data-ink="${kind}" transform="translate(${18 + dx + sx} ${(rh - 20) / 2}) translate(329 ${ry + 10}) scale(${ROW_ICON_SCALE}) translate(-329 ${-(ry + 10)})">${pic}</g>`;
      // Value right next to its pictogram, as on the softliQ screen
      out += `<text x="${ink ? VALUE_X : 372 + dx}" y="${ry + rh / 2 + 4.5}" text-anchor="start" font-family="${FONT}" font-size="${VALUE_FS}" font-weight="${row.weight || 600}" fill="${row.color || "#1565c0"}"${!row.color || ["#333", "#555"].includes(row.color) ? ' class="rv"' : ""}>${esc(row.value)}</text>`;
      out += `</g>`;
    });
    return { svg: out, bottom: y + height };
  },

  // Data attributes of a row: own panel, tooltip with details button, or the
  // more-info dialog
  _rowAttrs(row) {
    if (row.panel) return { cls: "tap", attrs: ` data-panel="${row.panel}"${row.more ? ` data-info="${row.more}"` : ""}` };
    if (row.info) return { cls: "", attrs: ` data-info="${row.info}"` };
    if (row.more) return { cls: "tap", attrs: ` data-more="${row.more}"` };
    return { cls: "", attrs: "" };
  },

  // Small calendar sheet as language neutral period label
  _calendar(ry, period) {
    // Outline sheet; today shows today's day of the month in bold, the 30
    // days average a 30 with a Ø badge
    const mark = { today: String(new Date().getDate()), avg30: "30" }[period];
    const c = "#3d8bd6";
    const bold = period === "today";
    let g = `<rect x="-12" y="-10" width="24" height="21" rx="3.4" fill="none" stroke="${c}" stroke-width="2"/><path d="M-12 -3.6 H12" stroke="${c}" stroke-width="2"/><path d="M-5.5 -12.5 V-8 M5.5 -12.5 V-8" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`;
    g += `<text x="0" y="8.6" text-anchor="middle" font-family="${FONT}" font-size="${mark.length > 2 ? 8.5 : 11.5}" font-weight="${bold ? 900 : 600}" fill="${c}"${bold ? ` stroke="${c}" stroke-width="0.55"` : ""}>${mark}</text>`;
    let out = `<g transform="translate(331 ${ry + 10.5}) scale(0.78)">${g}</g>`;
    if (period === "avg30") out += avgBadge(342.5, ry + 19);
    return out;
  },

  // Next maintenance and inspection: orange under 30 days, red when overdue
  _serviceRows() {
    const t = this._t;
    const rows = [];
    for (const [kind, glyph] of [["inspection", "magnify"], ["maintenance", "wrench"]]) {
      if (!this._entityId(`next_${kind}`)) continue;
      const days = this._num(`${kind}_days_remaining`);
      const color = days == null ? "#555" : days < 0 ? "#d32f2f" : days < 30 ? "#ef6c00" : "#555";
      const left = days == null ? "" : days < 0 ? t.overdue.replace("{n}", -days) : t.days_left.replace("{n}", days);
      rows.push({ glyph, label: t[kind], value: this._formatDay(this._state(`next_${kind}`)?.state), color, weight: days != null && days < 30 ? 700 : 600, more: `next_${kind}`, panel: `service:${kind}`, title: left });
    }
    return rows;
  },

  // Water counted since the last compiled statistic, so the periods are as
  // current as the sensor itself
  get _statsLive() {
    const now = this._num("calculated_water_consumption");
    const base = this._statsState;
    if (now == null || typeof base !== "number" || now < base) return 0;
    return now - base;
  },

  _tables(regenerating, saltLow) {
    const t = this._t;
    const live = this._statsLive;
    const s = Object.fromEntries(Object.entries(this._stats || {}).map(([k, v]) => [k, typeof v === "number" ? v + live : v]));

    const boxes = [
      ...this._statBoxes(t, s),
      [t.resin, "tank", [
        // Share and amount of the remaining capacity are on the display
        regenerating
          ? { icon: CLOCK_ICON, ink: "clock", value: this._fmt("regeneration_phase"), color: "#ef6c00", weight: 700, more: "regeneration_phase", title: t.phase }
          : { icon: CLOCK_ICON, ink: "clock", value: this._on("iq_mode") ? t.iq : this._relDate(this._state("next_regeneration_window")?.state), color: "#333", info: "next_regeneration_window", title: t.next_window },
        ...(this._entityId("last_regeneration")
          ? [{ icon: LAST_ICON, iscale: LAST_SCALE, ink: "last", value: this._relDate(this._state("last_regeneration")?.state), color: "#555", more: "last_regeneration", panel: "lastregen", title: t.last_regeneration }]
          : []),
        { icon: COUNT_ICON, ink: "count", label: "", value: this._fmt("mcountreg"), color: "#555", more: "mcountreg", panel: this._entityId("last_regeneration") ? "regen" : undefined, title: t.regen_count },
        ...this._serviceRows(),
      ]],
    ];
    const rowCount = boxes.reduce((n, [, , rows]) => n + rows.length, 0);
    const used = rowCount * GRID_ROW_H + boxes.length * 32;
    // Gaps so that the last box ends flush with the cabinet
    const gap = Math.max(4, (552 + DH - used) / (boxes.length - 1));
    let y = 144;
    let out = "";
    for (const [title, icon, rows, panel] of boxes) {
      const box = this._gridBox(y, title, rows, icon, panel || undefined);
      out += box.svg;
      // Gaps shrink when the boxes would not fit next to the cabinet
      y = box.bottom + gap;
    }
    // Like the softliQ screen: dark values, green pictograms
    return out.replace(/#3d8bd6/g, GREEN).replace(/#1565c0/g, "#2b3136").replace(/#bcd3ea/g, "#cfe5bf");
  },

  // Salt used since the last refill (the salt warning going away), on a
  // scale of 0 to 35 kg with stripes at the usual bag sizes
  // Refill times (oldest first) with the salt used in the cycle before each
  // one (kg), estimated from the daily salt values; null when unknown
  _refillInfo() {
    const refills = this._state("salt_warning")?.attributes?.refills || [];
    const map = this._dayMap("salt");
    const first = Object.keys(map).sort()[0] || null;
    return refills.map((r, i) => {
      if (i === 0) return { time: r, kg: null };
      const from = this._iso(new Date(refills[i - 1]));
      const to = this._iso(new Date(r));
      if (!first || first > from) return { time: r, kg: null };
      let g = 0;
      for (const [day, v] of Object.entries(map)) if (day >= from && day < to && typeof v === "number") g += v;
      return { time: r, kg: g / 1000 };
    });
  },

  _saltStat() {
    const t = this._t;
    const refills = this._state("salt_warning")?.attributes?.refills || [];
    const map = this._dayMap("salt");
    const days = Object.keys(map).sort();
    const last = refills.length ? refills[refills.length - 1] : null;
    const from = last ? this._iso(new Date(last)) : days[0] || "";
    let grams = 0;
    for (const [day, v] of Object.entries(map)) if (day >= from && typeof v === "number") grams += v;
    const kg = grams / 1000;
    const since = last ? t.salt_caption : t.salt_since_start;
    const W = 300;
    const H = 70;
    const max = 35;
    const x = (v) => (Math.min(v, max) / max) * W;
    const y0 = 30;
    let out = `<rect x="0" y="${y0}" width="${W}" height="22" rx="3" fill="#f3f5f4" stroke="#cfd8d2"/>`;
    for (let k = 0; k <= max; k++) {
      const big = [10, 25, 35].includes(k);
      const m5 = k % 5 === 0;
      const h = big ? 22 : m5 ? 15 : 8;
      const mx = x(k);
      out += `<rect x="${(mx - (big ? 1 : 0.6)).toFixed(1)}" y="${y0}" width="${big ? 2 : 1.2}" height="${h}" fill="#5b6478" opacity="${big ? 0.95 : m5 ? 0.8 : 0.5}"/>`;
      if (big) out += `<text x="${(k === 35 ? mx - 1 : mx).toFixed(1)}" y="${y0 + h + 13}" text-anchor="${k === 35 ? "end" : "middle"}" font-size="12" font-weight="700" fill="#5b6478" font-family="${FONT}">${k}</text>`;
    }
    const px = x(kg);
    out += `<path d="M${(px - 6).toFixed(1)} ${y0 - 14} L${(px + 6).toFixed(1)} ${y0 - 14} L${px.toFixed(1)} ${y0 - 1} Z" fill="#d32f2f"/><rect x="${(px - 1.2).toFixed(1)}" y="${y0 - 2}" width="2.4" height="34" fill="#d32f2f"/>`;
    const infos = this._refillInfo();
    const lastInfo = infos.length ? infos[infos.length - 1] : null;
    const prevLine = lastInfo
      ? `<ul class="list saltlist"><li><span>${esc(t.last_refill)}</span><span>${esc(this._formatDate(lastInfo.time))}</span></li><li><span>${esc(t.usage_before)}</span><span>${esc(lastInfo.kg == null ? "–" : this._kg(lastInfo.kg))}</span></li></ul>`
      : "";
    const warn = this._on("salt_warning") ? `<div class="ask warn">${esc(t.refills_now)}</div>` : "";
    return `${warn}<div class="bigtotal">${esc(this._kg(kg))}</div>
      <div class="dim center">${esc(since)}</div>
      <div class="chart"><svg viewBox="0 0 ${W} ${H}" width="100%">${out}</svg></div>
      ${prevLine}`;
  },

  // Salt or lime per m³ water: the large symbol, a slash and a small drop
  _fracIcon(cy, what) {
    const c = "#3d8bd6";
    const top = what === "salt"
      ? `<g transform="translate(320.6 ${cy - 3.6}) scale(.72) translate(-320.6 ${-(cy - 3.6)})">${SALT_STACK(320.6, cy - 3.6, c, 1.8 / 0.72, ROW_BG)}</g>`
      : `<g transform="translate(${320.6 - 14 * 0.6} ${cy - 3.6 - 13 * 0.6}) scale(.6)">${LIME_CRYSTALS(c, ROW_BG, 2 / 0.6 * 0.5 + 1.2)}</g>`;
    return `${top}${OUTLINE_DROP(340.4, cy + 3.2, 0.62, c)}<line x1="336.5" y1="${cy - 8}" x2="331.9" y2="${cy + 8.5}" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`;
  },

  // Average flow: an outlined arrow over two waves, with a Ø badge, so it
  // differs from the plain flow shown in the meter
  _avgFlowIcon(cy) {
    const c = "#3d8bd6";
    const wave = (y) => `<path d="M319.5 ${y} q2 -2.4 4 0 t4 0 t4 0 t4 0" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round"/>`;
    const ay = cy - 5.6;
    return `<path d="M320 ${ay - 1.3} H326.4 V${ay - 3.6} L333 ${ay} L326.4 ${ay + 3.6} V${ay + 1.3} H320 Z" fill="${ROW_BG}" stroke="${c}" stroke-width="1.3" stroke-linejoin="round"/>` +
      wave(cy + 1.2) + wave(cy + 6.2) + avgBadge(338, cy + 6.2);
  },

  // Water, salt and lime blocks, short term values first. The charts and
  // the totals are in the windows behind the rows.
  _statBoxes(t, s) {
    const hasSalt = !!this._entityId("salt_total");
    const hasLime = !!this._entityId("lime_total");
    const dayAvg = (what, unit) => {
      const v = this._avg30(what);
      return v == null ? "–" : unit === "L" ? this._liters(v) : this._kg(v / 1000);
    };
    const waterRows = [
      { period: "today", label: t.today, value: this._period("water_today", s.day, (x) => this._liters(x)), more: "calculated_water_consumption", panel: "chart:water:day" },
      ...(this._entityId("average_flow_rate")
        ? [{ icon: (cy) => this._avgFlowIcon(cy), iscale: 1.16, ink: "flow", label: t.avg_flow_short, value: this._fmt("average_flow_rate"), more: "average_flow_rate", title: t.avg_flow }]
        : []),
      { period: "avg30", label: t.avg_day, value: dayAvg("water", "L"), more: "calculated_water_consumption", panel: "chart:water:month" },
    ];
    const rows = (what, has) => [
      { period: "avg30", label: t.avg_day, value: dayAvg(what, "kg"), more: `${what}_total`, panel: has && `chart:${what}:month` },
      { icon: (cy) => this._fracIcon(cy, what), ink: `frac_${what}`, label: t[`${what}_per_m3`], value: this._ratio30(what), more: `${what}_total`, panel: has && `chart:${what}:month` },
    ];
    return [
      [t.water, "water", waterRows, "chart:water:days"],
      [t.salt_usage, "salt", rows("salt", hasSalt), hasSalt && "chart:salt:days"],
      ...(hasLime || Object.keys(this._dayMap("lime")).length ? [[t.lime, "lime", rows("lime", hasLime), hasLime && "chart:lime:days"]] : []),
    ];
  },
};
