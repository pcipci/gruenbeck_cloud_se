/*
 * The small windows opened by tapping a block: regeneration list,
 * maintenance/inspection with the "done" button, bar charts per period for
 * water, salt and lime (data from the recorder statistics).
 */
import { FONT, GREEN } from "../constants.js";
import { esc } from "../util.js";
import { CHECK, CROSS, ICONS, svgIcon } from "../icons.js";

export const panelsMethods = {
  // --- panels -----------------------------------------------------------
  // Own small windows instead of the history dialog where a history graph
  // says little: list of regenerations, maintenance/inspection with a done
  // button, bar charts per period for water, salt and lime
  _openPanel(spec) {
    this._hideTip();
    const [kind, what, period, info] = spec.split(":");
    this._panel = { kind, what, period, info };
    if (kind === "chart") this._loadChart();
    this._update();
  },

  _closePanel() {
    this._panel = null;
    this._update();
  },

  _panelDialog() {
    const p = this._panel;
    if (!p) return "";
    const t = this._t;
    let title = "";
    let body = "";
    let more = "";
    if (p.kind === "regen") {
      title = `${t.regenerations}: ${this._fmt("mcountreg")}`;
      more = "last_regeneration";
      const history = (this._state("last_regeneration")?.attributes?.history || []).slice().reverse();
      body = history.length
        ? `<ul class="list">${history.map((h) => {
            const parts = [];
            if (h.capacity_percent != null) parts.push(`${this._number(h.capacity_percent, 0)} %`);
            if (h.capacity_liters != null) parts.push(`(${this._liters(h.capacity_liters)})`);
            return `<li><span>${esc(this._formatDate(h.time))}</span><span class="dim">${parts.length ? esc(t.at_capacity.replace("{v}", parts.join(" "))) : ""}</span></li>`;
          }).join("")}</ul>`
        : `<div class="empty">${esc(t.no_history)}</div>`;
    } else if (p.kind === "lastregen") {
      title = t.last_regen_title;
      more = "last_regeneration";
      const history = this._state("last_regeneration")?.attributes?.history || [];
      const h = history.length ? history[history.length - 1] : null;
      if (!h) body = `<div class="empty">${esc(t.no_history)}</div>`;
      else {
        const rows = [`<li><span>${esc(t.regen_time)}</span><span>${esc(this._formatDate(h.time))}</span></li>`];
        const cap = [];
        if (h.capacity_percent != null) cap.push(`${this._number(h.capacity_percent, 0)} %`);
        if (h.capacity_liters != null) cap.push(`(${this._liters(h.capacity_liters)})`);
        if (cap.length) rows.push(`<li><span>${esc(t.regen_capacity)}</span><span>${esc(cap.join(" "))}</span></li>`);
        const steps = Array.isArray(h.steps) ? h.steps : [];
        if (steps.length) {
          const minutes = Math.round((new Date(h.time) - new Date(steps[0].time)) / 60000);
          if (minutes > 0 && minutes < 24 * 60) rows.push(`<li><span>${esc(t.regen_duration)}</span><span>${esc(t.minutes.replace("{n}", minutes))}</span></li>`);
        }
        body = `<ul class="list">${rows.join("")}</ul>`;
        body += steps.length
          ? `<div class="subhead">${esc(t.regen_steps)}</div><ul class="list">${steps.map((st) => `<li><span>${esc(t.phases?.[st.phase] || t.phases?.other || st.phase)}</span><span class="dim">${esc(this._clock(st.time))}</span></li>`).join("")}</ul>`
          : `<div class="empty">${esc(t.regen_steps_missing)}</div>`;
      }
    } else if (p.kind === "status") {
      title = t.status;
      more = "last_poll";
      const down = this._on("no_data_change");
      const head = down
        ? `<span class="dot" style="background:#9aa7b3"><svg viewBox="0 0 24 24" width="28" height="28"><path d="${ICONS.cloudOff}" fill="#fff"/></svg></span><span class="big">${esc(t.no_change.replace("{date}", this._formatDate(this._state("no_data_change").attributes.since)))}</span>`
        : `<span class="dot" style="background:#5a9e32"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M6 12.5 l4.6 4.6 l8 -9.6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="big">${esc(t.plant_ok)}</span>`;
      const lines = [];
      lines.push(`<li><span>${esc(t.last_poll)}</span><span>${esc(this._formatDate(this._state("last_poll")?.state))}</span></li>`);
      if (this._entityId("data_last_changed")) lines.push(`<li><span>${esc(t.data_changed)}</span><span>${esc(this._formatDate(this._state("data_last_changed")?.state))}</span></li>`);
      body = `<div class="statushead">${head}</div><ul class="list statuslist">${lines.join("")}</ul>`;
      const notes = this._dev?.notifications;
      if (Array.isArray(notes)) {
        body += notes.length
          ? `<div class="navrow on" data-nav="/config/automation/dashboard">${esc(t.notify_active.replace("{n}", notes.length))}</div>`
          : `<div class="navrow" data-nav="/config/blueprint/dashboard">${esc(t.notify_none)} ›</div>`;
      }
    } else if (p.kind === "saltstat") {
      title = t.salt_usage;
      more = "salt_warning";
      body = this._saltStat();
    } else if (p.kind === "refills") {
      title = t.refills;
      more = "salt_warning";
      const list = this._refillInfo().reverse();
      const now = this._on("salt_warning") ? `<div class="ask warn">${esc(t.refills_now)}</div>` : "";
      body = now + (list.length
        ? `<ul class="list">${list.map((r) => `<li><span>${esc(this._formatDate(r.time))}</span><span class="dim">${esc(t.usage_before_n.replace("{v}", r.kg == null ? "–" : this._kg(r.kg)))}</span></li>`).join("")}</ul>`
        : `<div class="note"><b>${esc(t.refills_none)}</b><br>${esc(t.refills_none_hint)}</div>`);
    } else if (p.kind === "service") {
      const kind = p.what;
      title = t[kind];
      more = `next_${kind}`;
      const days = this._num(`${kind}_days_remaining`);
      const left = days == null ? "" : days < 0 ? t.overdue.replace("{n}", -days) : t.days_left.replace("{n}", days);
      const color = days == null ? "" : days < 0 ? "#d32f2f" : days < 30 ? "#ef6c00" : "";
      body = `<ul class="list">
          <li><span>${esc(t.due)}</span><span style="${color ? `color:${color};font-weight:700` : ""}">${esc(this._formatDay(this._state(`next_${kind}`)?.state))}${left ? ` · ${esc(left)}` : ""}</span></li>
          ${this._entityId(`last_${kind}`) ? `<li><span>${esc(t.last_done)}</span><span>${esc(this._formatDay(this._state(`last_${kind}`)?.state))}</span></li>` : ""}
        </ul>`;
      if (this._entityId(`${kind}_done`)) {
        body += p.confirm
          ? `<div class="ask">${esc(t.mark_done_q.replace("{name}", t[kind]))}${kind === "maintenance" && this._entityId("next_inspection") ? `<div class="hint">${esc(t.resets_inspection)}</div>` : ""}</div>
             <div class="buttons"><button class="round cancel-done" title="${esc(t.cancel)}" aria-label="${esc(t.cancel)}">${svgIcon(CROSS, "#5b6478")}</button>
             <button class="round yes-done" style="background:${GREEN}" title="${esc(t.yes)}" aria-label="${esc(t.yes)}">${svgIcon(CHECK, "#fff")}</button></div>`
          : this._doneButton(kind, days);
      }
      const ul = (l) => `<ul class="todo">${l.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
      if (kind === "inspection") {
        body += `<div class="subhead">${esc(t.todo)}</div>${ul(t.todo_inspection)}<div class="todonote">${esc(t.todo_inspection_note)}</div>`;
      } else if (kind === "maintenance") {
        body += `<div class="subhead">${esc(t.todo)}</div>${ul(t.todo_maintenance)}<div class="todonote">${esc(t.todo_maintenance_note)}</div>`;
      }
    } else if (p.kind === "error") {
      title = t.error;
      more = "last_error";
      const st = this._state("last_error");
      const msg = st && !["unknown", "unavailable"].includes(st.state) ? st.state : "";
      const code = this._errorCode(msg);
      body = `<ul class="list">
          ${code ? `<li><span>${esc(t.error_number)}</span><span>${esc(code)}</span></li>` : ""}
          <li><span>${esc(t.error_text)}</span><span class="wrap">${esc(msg || t.error)}</span></li>
          ${st?.last_changed ? `<li><span>${esc(t.error_time)}</span><span>${esc(this._formatDate(st.last_changed))}</span></li>` : ""}
        </ul>`;
    } else if (p.kind === "chart") {
      const names = { water: t.water, salt: t.salt_usage, lime: t.lime, flow: t.flow_chart };
      title = names[p.what];
      more = p.info || { water: "calculated_water_consumption", salt: "salt_total", lime: "lime_total", flow: "mflow1" }[p.what];
      const periods = p.what === "flow" ? ["day", "days"] : p.what === "water" ? ["day", "days", "month", "year", "total"] : ["days", "month", "year", "total"];
      const label = { day: t.today, days: t.days, month: t.month, year: t.year, total: t.total };
      body = `<div class="seg">${periods.map((x) => `<button class="period${x === p.period ? " on" : ""}" data-period="${x}">${esc(label[x])}</button>`).join("")}</div>`;
      if (p.period === "total" && p.what !== "flow") body += `<div class="bigtotal">${esc(this._totalText(p.what))}</div>`;
      body += this._chartSvg();
      if (p.what !== "water" && p.what !== "flow" && p.data?.range) body += this._ratioList(p.data.range, p.period === "total");
    }
    const info = more && this._entityId(more)
      ? `<button class="icon info" title="${esc(t.details)}" aria-label="${esc(t.details)}">${svgIcon(ICONS.info, "#5b6478", 20)}</button>` : "";
    return `<div class="dialog-bg panel-bg"><div class="dialog panel" role="dialog" aria-label="${esc(title)}">
      <div class="head"><span class="title">${esc(title)}</span>${info}<button class="icon close" title="${esc(t.close)}" aria-label="${esc(t.close)}">${svgIcon(CROSS, "#5b6478", 20)}</button></div>
      ${body}
    </div></div>`;
  },

  _bindPanel() {
    const root = this.shadowRoot;
    const p = this._panel;
    if (!p) return;
    root.querySelector(".panel-bg")?.addEventListener("click", (ev) => {
      if (ev.target === ev.currentTarget) this._closePanel();
    });
    root.querySelector(".panel")?.addEventListener("click", (ev) => ev.stopPropagation());
    root.querySelector(".panel .close")?.addEventListener("click", () => this._closePanel());
    root.querySelector(".panel .info")?.addEventListener("click", () => {
      const key = { regen: "last_regeneration", error: "last_error", service: `next_${p.what}`, chart: p.info || { water: "calculated_water_consumption", salt: "salt_total", lime: "lime_total", flow: "mflow1" }[p.what], saltstat: "salt_warning", lastregen: "last_regeneration", status: "last_poll", refills: "salt_warning" }[p.kind];
      this._closePanel();
      this._moreInfo(key);
    });
    root.querySelectorAll(".panel [data-nav]").forEach((el) => {
      el.addEventListener("click", () => {
        this._closePanel();
        history.pushState(null, "", el.dataset.nav);
        window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
      });
    });
    root.querySelector(".panel .done")?.addEventListener("click", () => {
      this._panel = { ...p, confirm: true };
      this._update();
    });
    root.querySelector(".panel .cancel-done")?.addEventListener("click", () => {
      this._panel = { ...p, confirm: false };
      this._update();
    });
    root.querySelector(".panel .yes-done")?.addEventListener("click", () => {
      const id = this._entityId(`${p.what}_done`);
      if (id) this._hass.callService("button", "press", { entity_id: id });
      this._closePanel();
    });
    root.querySelectorAll(".panel .period").forEach((el) => {
      el.addEventListener("click", () => {
        this._panel = { ...p, period: el.dataset.period, data: null };
        this._loadChart();
        this._update();
      });
    });
  },

  // Calendar period with its buckets: start, end, recorder period, bucket
  // starts and labels
  _chartRange(period) {
    const now = new Date();
    const lang = this._locale;
    const d = (y, m, day, h = 0) => new Date(y, m, day, h);
    const y = now.getFullYear();
    const m = now.getMonth();
    if (period === "day") {
      const start = d(y, m, now.getDate());
      const buckets = Array.from({ length: 24 }, (_, h) => d(y, m, now.getDate(), h));
      return { start, end: d(y, m, now.getDate() + 1), unit: "hour", buckets, labels: buckets.map((b, h) => (h % 6 === 0 ? String(h) : "")) };
    }
    if (period === "days") {
      // Last 14 days up to yesterday; today has its own tab
      const buckets = Array.from({ length: 14 }, (_, i) => d(y, m, now.getDate() - 14 + i));
      const fmt = new Intl.DateTimeFormat(lang, { weekday: "short" });
      return { start: buckets[0], end: d(y, m, now.getDate()), unit: "day", buckets,
        labels: buckets.map((b, i) => (i % 2 === 1 ? fmt.format(b).replace(".", "").slice(0, 2) : "")) };
    }
    if (period === "month") {
      const days = new Date(y, m + 1, 0).getDate();
      const buckets = Array.from({ length: days }, (_, i) => d(y, m, i + 1));
      return { start: d(y, m, 1), end: d(y, m + 1, 1), unit: "day", buckets, labels: buckets.map((b, i) => (i === 0 || (i + 1) % 5 === 0 ? String(i + 1) : "")) };
    }
    if (period === "total") {
      // One bar per year, up to five years back
      const buckets = Array.from({ length: 5 }, (_, i) => d(y - 4 + i, 0, 1));
      return { start: buckets[0], end: d(y + 1, 0, 1), unit: "month", buckets, labels: buckets.map((b) => String(b.getFullYear())) };
    }
    const buckets = Array.from({ length: 12 }, (_, i) => d(y, i, 1));
    const fmt = new Intl.DateTimeFormat(lang, { month: "narrow" });
    return { start: d(y, 0, 1), end: d(y + 1, 0, 1), unit: "month", buckets, labels: buckets.map((b) => fmt.format(b)) };
  },

  async _loadChart() {
    const p = this._panel;
    if (!p || p.kind !== "chart") return;
    if (p.what !== "water" && p.what !== "flow" && this._dev?.days) {
      this._panel = { ...p, data: this._dayChart(p.what, p.period) };
      this._update();
      return;
    }
    const key = { water: "calculated_water_consumption", salt: "salt_total", lime: "lime_total", flow: "mflow1" }[p.what];
    const id = this._entityId(key) || (p.what === "flow" ? this._entityId("average_flow_rate") : null);
    const range = this._chartRange(p.period);
    let values = null;
    if (id) {
      try {
        const flow = p.what === "flow";
        const res = await this._hass.callWS({
          type: "recorder/statistics_during_period",
          start_time: range.start.toISOString(),
          end_time: range.end.toISOString(),
          statistic_ids: [id],
          period: range.unit,
          types: [flow ? "max" : "change"],
        });
        const field = flow ? "max" : "change";
        if (p.period === "total") {
          // Months added up to years
          const perYear = new Map();
          for (const r of res?.[id] || []) {
            const yr = new Date(r.start).getFullYear();
            if (typeof r[field] === "number") perYear.set(yr, (perYear.get(yr) || 0) + r[field]);
          }
          values = range.buckets.map((b) => (perYear.has(b.getFullYear()) ? perYear.get(b.getFullYear()) : null));
        } else {
          const byStart = new Map((res?.[id] || []).map((r) => [new Date(r.start).getTime(), r[field]]));
          values = range.buckets.map((b) => (byStart.has(b.getTime()) ? byStart.get(b.getTime()) : null));
        }
        // Years without any data in front are left out
        if (p.period === "total") {
          const first = values.findIndex((v) => v != null);
          if (first > 0) {
            values = values.slice(first);
            range.buckets = range.buckets.slice(first);
            range.labels = range.labels.slice(first);
          }
        }
      } catch {
        values = null;
      }
    }
    // Only apply when the same chart is still open
    if (this._panel && this._panel.kind === "chart" && this._panel.what === p.what && this._panel.period === p.period) {
      this._panel = { ...this._panel, data: { values, labels: range.labels, buckets: range.buckets.map((b) => b.getTime()), end: range.end.getTime() } };
      this._update();
    }
  },

  // Bars of salt or lime (kg) for a period; "days" are the last 14 days up
  // to yesterday
  _dayChart(what, period) {
    const map = this._dayMap(what);
    const range = this._chartRange(period);
    if (period === "total") {
      // Years without any day in front are left out
      const years = range.buckets.map((b) => b.getFullYear());
      const sums = years.map((yr) => {
        let sum = null;
        for (const [day, v] of Object.entries(map)) if (day.startsWith(`${yr}-`) && typeof v === "number") sum = (sum || 0) + v / 1000;
        return sum;
      });
      const first = Math.max(0, sums.findIndex((v) => v != null));
      range.buckets = range.buckets.slice(first);
      range.labels = range.labels.slice(first);
      return { values: sums.slice(first), labels: range.labels, buckets: range.buckets.map((b) => b.getTime()), end: range.end.getTime(), range: { start: new Date(2000, 0, 1), end: range.end } };
    }
    const values = range.buckets.map((b, i) => {
      const end = range.buckets[i + 1] || range.end;
      let sum = null;
      for (let d = new Date(b); d < end; d.setDate(d.getDate() + 1)) {
        const v = map[this._iso(d)];
        if (typeof v === "number") sum = (sum || 0) + v / 1000;
      }
      return sum;
    });
    return { values, labels: range.labels, buckets: range.buckets.map((b) => b.getTime()), end: range.end.getTime(), range: { start: range.start, end: range.end } };
  },

  // Salt and lime per m³ water and salt per kg lime, over the days that have
  // a water value and the value in question
  _ratios(start, end) {
    const water = this._dayMap("water");
    const out = {};
    for (const what of ["salt", "lime"]) {
      const map = this._dayMap(what);
      let g = 0;
      let liters = 0;
      for (const [day, v] of Object.entries(map)) {
        const d = new Date(`${day}T12:00:00`);
        if (d < start || d >= end || typeof v !== "number" || typeof water[day] !== "number") continue;
        g += v;
        liters += water[day];
      }
      out[what] = liters > 0 ? (g / liters) * 1000 : null; // g per m³
    }
    out.saltPerLime = out.salt != null && out.lime ? out.salt / out.lime : null;
    return out;
  },

  _ratioList(range, noTotal = false) {
    const t = this._t;
    const r = this._ratios(range.start, range.end);
    const g = (v) => (v == null ? "–" : `${this._number(v, 0)} g/m³`);
    const what = this._panel.what;
    // Figures without data (e.g. no cloud water values) are left out
    const limePerSalt = r.salt ? r.lime / r.salt : null;
    const rows = what === "salt"
      ? [
          [t.total, !noTotal && this._entityId("salt_total") ? this._fmt("salt_total") : null],
          [t.salt_per_m3, r.salt == null ? null : g(r.salt)],
          [t.salt_per_lime, r.saltPerLime == null ? null : `${this._number(r.saltPerLime, 1)} kg`],
        ]
      : [
          [t.total, !noTotal && this._entityId("lime_total") ? this._fmt("lime_total") : null],
          [t.lime_per_m3, r.lime == null ? null : g(r.lime)],
          [t.lime_per_salt, limePerSalt == null ? null : `${this._number(limePerSalt, 2)} kg`],
        ];
    const shown = rows.filter(([, v]) => v != null);
    return shown.length ? `<ul class="ratios">${shown.map(([n, v]) => `<li><span>${esc(n)}</span><span>${esc(v)}</span></li>`).join("")}</ul>` : "";
  },

  // "Done" only shortly before the due date (option service_done_days,
  // default 30) or when overdue
  _doneButton(kind, days) {
    const t = this._t;
    const window = Number(this._config.service_done_days ?? 30);
    const locked = days != null && days > window;
    let label = t.mark_done;
    if (locked) {
      const due = this._state(`next_${kind}`)?.state;
      const from = due && /^\d{4}-\d{2}-\d{2}/.test(due) ? new Date(`${due.slice(0, 10)}T12:00:00`) : null;
      if (from) {
        from.setDate(from.getDate() - window);
        label = t.done_from.replace("{d}", new Intl.DateTimeFormat(this._locale, { day: "2-digit", month: "2-digit" }).format(from));
      }
    }
    return `<div class="buttons"><button class="pill done" style="background:${GREEN}"${locked ? " disabled" : ""}>${svgIcon(CHECK, locked ? "#5b6478" : "#fff", 18)}<span>${esc(label)}</span></button></div>`;
  },

  _chartSvg() {
    const p = this._panel;
    const t = this._t;
    if (!p.data) return `<div class="chart empty">…</div>`;
    const { values, labels, buckets } = p.data;
    const nums = (values || []).map((v) => (typeof v === "number" && v > 0 ? v : 0));
    const total = nums.reduce((a, b) => a + b, 0);
    if (!values || !values.some((v) => v != null)) return `<div class="chart empty">${esc(t.no_data)}</div>`;
    const fmt = (v) => (p.what === "flow" ? `${this._number(v, 1)} L/min` : p.what === "water" ? this._liters(v) : this._kg(v));
    const W = 300;
    const H = 150;
    const top = 18;
    const base = H - 20;
    const n = nums.length;
    const step = W / n;
    const bw = Math.max(2, step * 0.7);
    const max = Math.max(...nums, 0) || 1;
    const now = Date.now();
    let out = `<line x1="0" y1="${base}" x2="${W}" y2="${base}" stroke="#d5dde4"/>`;
    nums.forEach((v, i) => {
      const h = ((base - top) * v) / max;
      const x = i * step + (step - bw) / 2;
      const current = now >= buckets[i] && (i === n - 1 ? now < (p.data.end ?? Infinity) : now < buckets[i + 1]);
      out += `<rect x="${x.toFixed(1)}" y="${(base - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, values[i] != null ? 0.5 : 0).toFixed(1)}" rx="1.5" fill="${GREEN}" opacity="${current ? 1 : 0.7}"><title>${esc(`${labels[i] || i + 1}: ${values[i] == null ? "–" : fmt(values[i])}`)}</title></rect>`;
      if (labels[i]) out += `<text x="${(i * step + step / 2).toFixed(1)}" y="${H - 6}" text-anchor="middle" font-size="10" fill="#8a96a3" font-family="${FONT}">${esc(labels[i])}</text>`;
    });
    out += `<text x="0" y="11" font-size="10" fill="#8a96a3" font-family="${FONT}">${esc(t.max_flow)} ${esc(fmt(max))}</text>`;
    return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" width="100%">${out}</svg></div>
      ${p.what === "flow" ? "" : `<div class="sum"><span>${esc(t.sum)}</span><b>${esc(fmt(total))}</b></div>`}`;
  },
};
