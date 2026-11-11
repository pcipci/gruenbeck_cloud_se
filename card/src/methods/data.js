/*
 * Data side of the card: finds the device and its entities (via the websocket
 * command gruenbeck_cloud_se/card_info), reads states and formats numbers, dates
 * and durations in the card or profile language, loads the period statistics.
 * No drawing here.
 */
import { DOMAIN } from "../constants.js";
import { TEXT } from "../i18n/index.js";

export const dataMethods = {
  get _t() {
    const lang = (this._config.language || this._hass?.language || "en").slice(0, 2);
    return TEXT[lang] || TEXT.en;
  },

  // --- data -------------------------------------------------------------
  async _loadInfo(force = false) {
    if (!this._hass || this._loading) return;
    if (!force && this._info && Date.now() - this._infoTime < 15 * 60 * 1000) return;
    this._loading = true;
    try {
      this._info = await this._hass.callWS({ type: `${DOMAIN}/card_info` });
    } catch {
      // Older integration or no admin rights needed: fall back to the
      // entity registry entries the frontend already has
      this._info = this._infoFromRegistry();
    }
    this._infoTime = Date.now();
    this._loading = false;
    this._lastKey = "";
    this._update();
  },

  _infoFromRegistry() {
    const hass = this._hass;
    const devices = {};
    for (const entry of Object.values(hass.entities || {})) {
      if (entry.platform !== DOMAIN || !entry.translation_key) continue;
      const device = hass.devices?.[entry.device_id];
      const root = device?.via_device_id || entry.device_id;
      if (!root) continue;
      const main = hass.devices?.[root];
      devices[root] ??= { device_id: root, name: main?.name_by_user || main?.name || "Grünbeck", entities: {}, salt: null, lime: null };
      devices[root].entities[entry.translation_key] = entry.entity_id;
    }
    return Object.values(devices);
  },

  _device() {
    const list = this._info || [];
    const wanted = this._config.device;
    if (wanted) {
      // A sub device (e.g. "Grünbeck Einstellungen") points to its softener
      const parent = this._hass.devices?.[wanted]?.via_device_id;
      return list.find((d) => d.device_id === wanted || d.device_id === parent || d.name === wanted) || null;
    }
    return list.length === 1 ? list[0] : null;
  },

  _entityId(key) {
    return this._config.entities?.[key] || this._dev?.entities?.[key];
  },

  _state(key) {
    const id = this._entityId(key);
    return id ? this._hass.states[id] : undefined;
  },

  _num(key) {
    const value = parseFloat(this._state(key)?.state);
    return Number.isFinite(value) ? value : null;
  },

  _on(key) {
    return this._state(key)?.state === "on";
  },

  // All numbers and dates use one locale: the card language if set,
  // otherwise the language of the Home Assistant profile
  get _locale() {
    return this._config.language || this._hass.locale?.language || this._hass.language || "en";
  },

  // Values are formatted by the card itself, with fixed decimals per unit,
  // so every row looks the same regardless of the entity's precision
  _fmt(key) {
    const st = this._state(key);
    if (!st || st.state === "unavailable" || st.state === "unknown") return "–";
    const unit = st.attributes.unit_of_measurement;
    const value = Number(st.state);
    if (st.state === "" || !Number.isFinite(value)) {
      const phase = this._t.phases?.[st.state];
      if (phase) return phase;
      return this._hass.formatEntityState && !this._config.language ? this._hass.formatEntityState(st) : st.state;
    }
    switch (unit) {
      case "L":
        return this._liters(value);
      case "m³":
        return `${this._number(value, 2)} m³`;
      case "g":
        return this._kg(value / 1000);
      case "kg":
        return this._kg(value);
      case "L/min":
        return `${this._number(value, 1)} L/min`;
      case "%":
        return `${this._number(value, 0)} %`;
      case "°dH":
        return `${this._number(value, 0)} °dH`;
      case undefined:
      case null:
      case "":
        return this._number(value, Number.isInteger(value) ? 0 : 2);
      default:
        return `${this._number(value, Number.isInteger(value) ? 0 : 2)} ${unit}`;
    }
  },

  _number(value, digits) {
    return new Intl.NumberFormat(this._locale, {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    }).format(value);
  },

  _liters(value) {
    if (value == null) return "–";
    if (Math.abs(value) >= 100000) return `${this._number(value / 1000, 1)} m³`;
    return `${this._number(value, 0)} L`;
  },

  _kg(value) {
    if (value == null) return "–";
    return `${this._number(value, 2)} kg`;
  },

  _formatDate(value) {
    const t = value ? new Date(value) : null;
    if (!t || Number.isNaN(t.getTime())) return "–";
    const tz = this._hass.config?.time_zone;
    const lang = this._locale;
    const opts = { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: tz };
    // 24 h unless the profile asks for 12 h and no card language is set
    const timeFormat = this._config.language ? "language" : this._hass.locale?.time_format;
    if (timeFormat === "12") opts.hour12 = true;
    else if (timeFormat === "24" || lang.startsWith("de")) opts.hourCycle = "h23";
    try {
      return new Intl.DateTimeFormat(lang, opts).format(t).replace(",", "");
    } catch {
      delete opts.timeZone;
      return new Intl.DateTimeFormat(lang, opts).format(t).replace(",", "");
    }
  },

  // Water usage per calendar period from the long term statistics of the
  // calculated water consumption (total increasing, includes today)
  async _loadStats() {
    const id = this._entityId("calculated_water_consumption");
    if (!id || this._statsLoading) return;
    // Reload every 10 minutes, or sooner once the sensor changed and the
    // recorder had time (5 min) to compile it
    const age = Date.now() - this._statsTime;
    const changed = this._hass.states[id]?.state !== this._statsCur;
    if (this._statsFor === id && age < 10 * 60 * 1000 && !(changed && age > 5 * 60 * 1000)) return;
    this._statsLoading = true;
    const stats = {};
    for (const period of ["day"]) {
      try {
        const res = await this._hass.callWS({
          type: "recorder/statistic_during_period",
          statistic_id: id,
          calendar: { period },
          types: ["change"],
        });
        stats[period] = typeof res?.change === "number" ? res.change : null;
      } catch {
        stats[period] = null;
      }
    }
    // Sensor state at the last compiled statistic: what the sensor counted
    // since then is added live to every period
    try {
      const res = await this._hass.callWS({
        type: "recorder/statistics_during_period",
        start_time: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        statistic_ids: [id],
        period: "5minute",
        types: ["state"],
      });
      const list = res?.[id] || [];
      this._statsState = list.length ? list[list.length - 1].state : null;
    } catch {
      this._statsState = null;
    }
    this._statsCur = this._hass.states[id]?.state;
    this._stats = stats;
    this._statsFor = id;
    this._statsTime = Date.now();
    this._statsLoading = false;
    this._lastKey = "";
    this._update();
  },

  // Override entity (e.g. own utility meter) wins over the computed value
  _period(key, computed, format) {
    if (this._config.entities?.[key]) return this._fmt(key);
    return format(computed);
  },

  // "heute 02:00", "gestern 02:14", "morgen 02:00", otherwise "28.10. 02:14"
  _relDate(value) {
    const d = value ? new Date(value) : null;
    if (!d || Number.isNaN(d.getTime())) return "–";
    const tz = this._hass.config?.time_zone;
    const dayKey = (x) => {
      try {
        return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(x);
      } catch {
        return new Intl.DateTimeFormat("en-CA").format(x);
      }
    };
    const now = new Date();
    const names = {
      [dayKey(now)]: this._t.today_short,
      [dayKey(new Date(now.getTime() - 86400000))]: this._t.yesterday_short,
      [dayKey(new Date(now.getTime() + 86400000))]: this._t.tomorrow_short,
    };
    const name = names[dayKey(d)];
    if (!name) return this._formatDate(value);
    return `${name} ${this._formatTime(d)}`;
  },

  _formatTime(d) {
    const opts = { hour: "2-digit", minute: "2-digit", timeZone: this._hass.config?.time_zone };
    const timeFormat = this._config.language ? "language" : this._hass.locale?.time_format;
    if (timeFormat === "12") opts.hour12 = true;
    else if (timeFormat === "24" || this._locale.startsWith("de")) opts.hourCycle = "h23";
    try {
      return new Intl.DateTimeFormat(this._locale, opts).format(d);
    } catch {
      delete opts.timeZone;
      return new Intl.DateTimeFormat(this._locale, opts).format(d);
    }
  },

  // Date only values (YYYY-MM-DD), shown with year
  _formatDay(value) {
    if (!value || !/^\d{4}-\d{2}-\d{2}/.test(value)) return "–";
    const d = new Date(`${value.slice(0, 10)}T12:00:00Z`);
    return new Intl.DateTimeFormat(this._locale, { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(d);
  },

  // Daily values the integration remembers, by ISO date. The recorder books
  // salt and lime on the day the cloud delivers them (a day late), these are
  // on the right day
  _dayMap(what) {
    return this._dev?.days?.[what] || {};
  },

  _iso(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  },

  // Total of water, salt or lime for the total tab
  _totalText(what) {
    const key = { water: "calculated_water_consumption", salt: "salt_total", lime: "lime_total" }[what];
    return this._entityId(key) ? this._fmt(key) : "–";
  },

  // Short clock time
  _clock(value) {
    const d = value ? new Date(value) : null;
    if (!d || Number.isNaN(d.getTime())) return "–";
    try {
      return new Intl.DateTimeFormat(this._locale, { hour: "2-digit", minute: "2-digit", timeZone: this._hass.config?.time_zone }).format(d);
    } catch {
      return new Intl.DateTimeFormat(this._locale, { hour: "2-digit", minute: "2-digit" }).format(d);
    }
  },

  // Average per day over the last 30 days that have a value (the cloud
  // history may be shorter); null without any
  _avg30(what) {
    const map = this._dayMap(what);
    const now = new Date();
    let sum = 0;
    let n = 0;
    for (let k = 1; k <= 30; k++) {
      const v = map[this._iso(new Date(now.getFullYear(), now.getMonth(), now.getDate() - k))];
      if (typeof v === "number") {
        sum += v;
        n++;
      }
    }
    return n ? sum / n : null;
  },

  // Salt or lime per m³ water over the last 30 days, in g/m³
  _ratio30(what) {
    const now = new Date();
    const r = this._ratios(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30), new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    return r[what] == null ? "–" : `${this._number(r[what], 0)} g/m³`;
  },

  // Error number out of the message, e.g. "E12" or "42"
  _errorCode(message) {
    return (String(message || "").match(/\b[A-Za-z]{0,2}\d{1,4}\b/) || [""])[0];
  },
};
