/* Gruenbeck card - built file. Edit the sources in card/src/, then run card/build.mjs. */
(() => {
  // src/constants.js
  var CARD_VERSION = "0.3.0";
  var DOMAIN = "gruenbeck_cloud_se";
  var FONT = "Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif";
  var VIEW_W = 504;
  var PAD_L = 15;
  var DH = 95;
  var VIEW_H = 704 + DH;
  var VALVE_DX = -38;
  var PIPE_DY = 14;
  var CONTROLS = [
    { key: "iq_mode", icon: "iq", label: "iq_mode", y: 197.6 },
    { key: "buzzer", icon: "bell", label: "buzzer", y: 252.9 },
    { key: "live_mode", icon: "live", label: "live", y: 308.1 },
    { key: "track_regeneration", icon: "radar", label: "track", y: 363.4 },
    { key: "led_ring_permanent", icon: "ring", label: "permanent", y: 444.6 },
    { key: "led_ring_failure", icon: "failure", label: "failure", y: 499.9 },
    { key: "led_ring_message", icon: "message", label: "message", y: 555.1 },
    { key: "led_ring_flow", icon: "water", label: "led_flow", y: 610.4 }
  ];
  var GREEN = "#5aa02c";
  var GRID_ROW_H = 38;
  var VALUE_FS = 15;
  var ROW_ICON_SCALE = 1.2;
  var PILL_FS = 14.5;
  var LAMP_R = 16.8;
  var METER_RIGHT = 490;
  var LID_LEFT = 6.75;
  var LID_RIGHT = 291.25;
  var ROW_GREY = "#56616d";
  var ROW_BG = "#d9e2eb";
  var LAST_SCALE = 1.12;
  var LAMP_CY = 29;

  // src/i18n/de.json
  var de_default = {
    name: "Grünbeck Enthärtung",
    description: "Grafik der Enthärtungsanlage mit Bedienung, ohne Konfiguration.",
    plant: "Anlage",
    error: "Störung",
    raw: "Roh",
    raw_water: "Rohwasserhärte",
    soft_water: "Weichwasserhärte",
    soft: "Weich",
    flow: "Durchfluss",
    water: "Wasserverbrauch",
    today: "Heute",
    month: "Monat",
    year: "Jahr",
    total: "Gesamt",
    capacity: "Restkapazität",
    regen_count: "Regenerationen",
    salt_usage: "Salzverbrauch",
    salt_range: "Salzreichweite",
    resin: "Anlage",
    lime: "Zurückgehaltener Kalk",
    salt: "Salz",
    salt_ok: "OK",
    salt_low: "Nachfüllen",
    no_sensor: "kein Sensor",
    led_ring: "LED-Ring",
    iq_mode: "iQ-Mode",
    buzzer: "Signal",
    live: "Live",
    track: "Reg. live",
    permanent: "Dauerhaft",
    failure: "Störung",
    message: "Meldung",
    led_flow: "Durchfluss",
    confirm_on: "{name} einschalten?",
    confirm_off: "{name} ausschalten?",
    yes: "Ja",
    details: "Details",
    cancel: "Abbrechen",
    no_change: "Keine neuen Daten seit {date}",
    today_short: "heute",
    on: "an",
    off: "aus",
    unavailable: "nicht verfügbar",
    regeneration: "Regeneration",
    phase: "Regenerationsphase",
    brightness: "Helligkeit LED-Ring",
    yesterday_short: "gestern",
    tomorrow_short: "morgen",
    next_window: "Nächstes Regenerationsfenster",
    last_regeneration: "Letzte Regeneration",
    last_poll: "Letzte Abfrage",
    data_changed: "Daten zuletzt geändert",
    avg_flow: "Mittlerer Durchfluss (letztes Intervall)",
    maintenance: "Wartung",
    inspection: "Inspektion",
    days_left: "in {n} Tagen",
    overdue: "seit {n} Tagen überfällig",
    regenerations: "Regenerationen",
    at_capacity: "bei {v}",
    no_history: "Noch keine Regeneration aufgezeichnet",
    due: "Fällig",
    last_done: "Zuletzt",
    mark_done: "Erledigt",
    mark_done_q: "{name} als erledigt markieren?",
    resets_inspection: "Die Inspektion wird dabei ebenfalls zurückgesetzt.",
    status: "Status",
    refills: "Salz nachgefüllt",
    refills_now: "Aktuell: Salz nachfüllen",
    refills_none: "Noch keine Nachfüllung erkannt",
    refills_none_hint: "Die Zeit wird aufgezeichnet, sobald die Salzwarnung verschwindet.",
    lime_per_salt: "Kalk je kg Salz",
    flow_chart: "Durchfluss",
    max_flow: "max",
    last_regen_title: "Letzte Regeneration",
    regen_time: "Beendet",
    regen_capacity: "Kapazität davor",
    regen_duration: "Dauer",
    regen_steps: "Schritte",
    regen_steps_missing: "Für diese Regeneration wurden keine Schritte aufgezeichnet. Das geschieht ab dieser Version.",
    todo: "Was ist zu tun?",
    todo_inspection: [
      "Installation und Schläuche auf Leckagen, Pfützen, Beschädigung und Korrosion prüfen",
      "Netzkabel und Stecker prüfen",
      "Salzvorrat prüfen: Tabletten über dem Wasserstand, nicht verklumpt; Salzverbrauch beurteilen",
      "Weichwasserhärte prüfen",
      "Steuerventil: aus dem Spülwasserschlauch darf im Betrieb nichts tropfen",
      "Steuerung auf Meldungen prüfen",
      "Leckagesensor testen"
    ],
    todo_inspection_note: "Halbjährlich (Intervall der Anlage). Dazwischen alle 2 Monate: Leckagen, Salzvorrat und Meldungen kurz prüfen.",
    todo_maintenance: [
      "Roh- und Weichwasserhärte messen, Verschneideventil einstellen",
      "Wasserzähler, Injektor, Soleventil, Elektroden und Salzbehälter prüfen und reinigen",
      "Boost-Mode starten, Saugleistung und Chlorstrom prüfen",
      "Fehlerspeicher auslesen, Software aktualisieren, Arbeiten dokumentieren"
    ],
    todo_maintenance_note: "Jährlich, nur durch den Kundendienst. Bei „Wartung fällig“ den Kundendienst kontaktieren.",
    notify_none: "Benachrichtigungen einrichten",
    notify_active: "Benachrichtigungen aktiv ({n})",
    minutes: "{n} Min",
    iq: "iQ",
    salt_since_start: "seit Beginn der Aufzeichnung",
    salt_caption: "seit der letzten Nachfüllung",
    last_refill: "Zuletzt nachgefüllt",
    usage_before: "Verbrauch davor",
    usage_before_n: "Verbrauch davor: {v}",
    no_data: "Noch keine Daten",
    sum: "Summe",
    days: "Tage",
    salt_per_m3: "Salz pro m³",
    lime_per_m3: "Kalk pro m³",
    salt_per_lime: "Salz je kg Kalk",
    done_from: "ab {d}",
    avg_day: "Ø pro Tag (30 Tage)",
    avg_flow_short: "Ø Durchfluss",
    error_number: "Nummer",
    error_text: "Beschreibung",
    error_time: "Zeitpunkt",
    water_meter: "Wasseruhr",
    flow_now: "Durchfluss",
    close: "Schließen",
    phases: {
      inactive: "Inaktiv",
      fill_salt_tank: "Salzbehälter füllen",
      salting: "Besalzen",
      displacement: "Verdrängen",
      backwashing: "Rückspülen",
      washing_out: "Auswaschen",
      other: "Sonstige"
    },
    plant_ok: "Anlage OK",
    no_device: "Keine Grünbeck-Anlage gefunden. Ist die Integration Grünbeck Cloud SE eingerichtet?",
    choose_device: "Mehrere Grünbeck-Anlagen gefunden. Bitte in der Karte ein Gerät auswählen.",
    device: "Gerät",
    device_help: "Nur bei mehreren Anlagen nötig. Mit nur einer Anlage bleibt das Feld leer, die Karte findet sie selbst. Jedes Gerät der Anlage genügt (auch Anlageeinstellungen, Tageswerte, Wartung).",
    language: "Sprache der Karte",
    language_help: "Automatisch = Sprache deines Benutzerprofils. Stellt auch Zahlen- und Datumsformat darauf ein.",
    service_done_days: "„Erledigt“ möglich ab (Tage vor Fälligkeit)",
    service_done_days_help: "Der Knopf für Wartung und Inspektion ist erst so viele Tage vor dem Fälligkeitsdatum aktiv. Standard 30.",
    opt_auto: "Automatisch",
    opt_tint: "Blaugrau",
    opt_light: "Hell",
    opt_transparent: "Transparent",
    background_help: "Blaugrau (Standard) und Hell sind feste Farben. Transparent lässt den Dashboard-Hintergrund durchscheinen, am besten bei hellen Dashboards.",
    show_controls: "Bedienleiste anzeigen",
    show_controls_help: "Zeigt die Schalter (iQ-Modus, Signalton, LED und weitere) im Deckel der Anlage. Aus = reine Anzeige. Standard: an.",
    background: "Hintergrund",
    confirm: "Vor dem Schalten nachfragen",
    confirm_help: "Zeigt vor jedem Schalten eine Rückfrage. Schützt vor versehentlichem Antippen. Standard: an.",
    group_general: "Allgemein",
    group_display: "Darstellung",
    group_behavior: "Verhalten"
  };

  // src/i18n/en.json
  var en_default = {
    name: "Grünbeck softener",
    description: "Picture of the water softener with controls, no configuration needed.",
    plant: "Device",
    error: "Failure",
    raw: "Raw",
    raw_water: "Raw water hardness",
    soft_water: "Soft water hardness",
    soft: "Soft",
    flow: "Flow",
    water: "Water usage",
    today: "Today",
    month: "Month",
    year: "Year",
    total: "Total",
    capacity: "Remaining capacity",
    regen_count: "Regenerations",
    salt_usage: "Salt usage",
    salt_range: "Salt supply",
    resin: "Device",
    lime: "Lime retained",
    salt: "Salt",
    salt_ok: "OK",
    salt_low: "Refill",
    no_sensor: "no sensor",
    led_ring: "LED ring",
    iq_mode: "iQ mode",
    buzzer: "Buzzer",
    live: "Live",
    track: "Reg. live",
    permanent: "Permanent",
    failure: "Failure",
    message: "Message",
    led_flow: "Flow",
    confirm_on: "Turn on {name}?",
    confirm_off: "Turn off {name}?",
    yes: "Yes",
    details: "Details",
    cancel: "Cancel",
    no_change: "No new data since {date}",
    today_short: "today",
    on: "on",
    off: "off",
    unavailable: "unavailable",
    regeneration: "Regeneration",
    phase: "Regeneration phase",
    brightness: "LED ring brightness",
    yesterday_short: "yesterday",
    tomorrow_short: "tomorrow",
    next_window: "Next regeneration window",
    last_regeneration: "Last regeneration",
    last_poll: "Last poll",
    data_changed: "Data last changed",
    avg_flow: "Average flow (last interval)",
    maintenance: "Maintenance",
    inspection: "Inspection",
    days_left: "in {n} days",
    overdue: "{n} days overdue",
    regenerations: "Regenerations",
    at_capacity: "at {v}",
    no_history: "No regeneration recorded yet",
    due: "Due",
    last_done: "Last",
    mark_done: "Done",
    mark_done_q: "Mark {name} as done?",
    resets_inspection: "This also resets the inspection.",
    status: "Status",
    refills: "Salt refilled",
    refills_now: "Now: salt needs refilling",
    refills_none: "No refill detected yet",
    refills_none_hint: "The time is recorded as soon as the salt warning goes away.",
    lime_per_salt: "Lime per kg salt",
    flow_chart: "Flow",
    max_flow: "max",
    last_regen_title: "Last regeneration",
    regen_time: "Finished",
    regen_capacity: "Capacity before",
    regen_duration: "Duration",
    regen_steps: "Steps",
    regen_steps_missing: "No steps were recorded for this regeneration. This starts with this version.",
    todo: "What to do",
    todo_inspection: [
      "Check installation and hoses for leaks, puddles, damage and corrosion",
      "Check mains cable and plug",
      "Check the salt supply: tablets above the water level, no clumping; assess salt usage",
      "Check the soft water hardness",
      "Control valve: no water may drip from the rinse hose during operation",
      "Check the control unit for messages",
      "Test the leak sensor"
    ],
    todo_inspection_note: "Every six months (the unit's interval). In between, every 2 months: briefly check leaks, salt supply and messages.",
    todo_maintenance: [
      "Measure raw and soft water hardness, adjust the blending valve",
      "Check and clean water meter, injector, brine valve, electrodes and salt tank",
      "Start Boost mode, check suction and chlorine current",
      "Read out the error memory, update software, document the work"
    ],
    todo_maintenance_note: 'Yearly, customer service only. When "Maintenance due" shows, contact customer service.',
    notify_none: "Set up notifications",
    notify_active: "Notifications active ({n})",
    minutes: "{n} min",
    iq: "iQ",
    salt_since_start: "since recording began",
    salt_caption: "since the last refill",
    last_refill: "Last refilled",
    usage_before: "Usage before",
    usage_before_n: "Usage before: {v}",
    no_data: "No data yet",
    sum: "Total",
    days: "Days",
    salt_per_m3: "Salt per m³",
    lime_per_m3: "Lime per m³",
    salt_per_lime: "Salt per kg lime",
    done_from: "from {d}",
    avg_day: "Avg per day (30 days)",
    avg_flow_short: "Avg flow",
    error_number: "Number",
    error_text: "Description",
    error_time: "Time",
    water_meter: "Water meter",
    flow_now: "Flow",
    close: "Close",
    phases: {
      inactive: "Inactive",
      fill_salt_tank: "Filling salt tank",
      salting: "Salting",
      displacement: "Displacement",
      backwashing: "Backwashing",
      washing_out: "Washing out",
      other: "Other"
    },
    plant_ok: "Device OK",
    no_device: "No Grünbeck softener found. Is the Grünbeck Cloud SE integration set up?",
    choose_device: "Several Grünbeck softeners found. Please select a device in the card.",
    device: "Device",
    device_help: "Only needed with several softeners. With a single softener leave it empty, the card finds it itself. Any device of the softener works (also Plant settings, Daily values, Maintenance).",
    language: "Card language",
    language_help: "Automatic = the language of your user profile. Also sets the number and date format.",
    service_done_days: '"Done" possible from (days before due)',
    service_done_days_help: "The button for maintenance and inspection only works this many days before the due date. Default 30.",
    opt_auto: "Automatic",
    opt_tint: "Blue-grey",
    opt_light: "Light",
    opt_transparent: "Transparent",
    background_help: "Blue-grey (default) and Light are fixed colors. Transparent lets the dashboard background show through, best on light dashboards.",
    show_controls: "Show controls",
    show_controls_help: "Shows the switches (iQ mode, buzzer, LED and more) in the lid of the softener. Off = display only. Default: on.",
    background: "Background",
    confirm: "Ask before switching",
    confirm_help: "Asks for confirmation before every switch. Protects against accidental taps. Default: on.",
    group_general: "General",
    group_display: "Display",
    group_behavior: "Behavior"
  };

  // src/i18n/index.js
  var TEXT = { de: de_default, en: en_default };

  // src/util.js
  var esc = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var text = (x, y, content, attrs = "") => `<text x="${x}" y="${y}" font-family="${FONT}" ${attrs}>${esc(content)}</text>`;

  // src/style.js
  var STYLE = `
  :host { display: block; }
  ha-card { overflow: hidden; position: relative; background: #dce5ed; }
  ha-card.clear { background: none; }
  ha-card.dark .rl { stroke: rgba(255,255,255,.28); }
  ha-card.dark .rv { fill: #e6e9ec; }
  ha-card.dark .ric { filter: brightness(1.7); }
  ha-card.dark .ric .bdt { fill: #1b2127; }
  svg { display: block; width: 100%; height: auto; user-select: none; -webkit-user-select: none; }
  .switch, .tap { cursor: pointer; }
  .switch:hover .track { filter: brightness(0.96); }
  .flow .chevron { animation: flow 1.5s linear infinite; opacity: 0; }
  .spin { transform-box: fill-box; transform-origin: 50% 50%; animation: spin 2.4s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes flow {
    0% { transform: translateX(0); opacity: 0; }
    20% { opacity: .9; }
    80% { opacity: .9; }
    100% { transform: translateX(30px); opacity: 0; }
  }
  .regen { animation: pulse 2s ease-in-out infinite; }
  .bubble { transform-box: fill-box; animation: bubble 3s ease-in-out infinite; }
  @keyframes bubble { 0% { transform: translateY(0); } 50% { transform: translateY(-7px); opacity: .25; } 100% { transform: translateY(0); } }
  @keyframes pulse { 50% { opacity: .55; } }
  @media (prefers-reduced-motion: reduce) {
    .flow .chevron, .regen, .bubble, .spin { animation: none; }
    .flow .chevron { opacity: .8; }
  }
  .dialog-bg { position: absolute; inset: 0; background: rgba(20, 30, 40, .35); display: flex; align-items: center; justify-content: center; }
  .dialog { background: #fff; color: #263238; border-radius: 12px; padding: 14px 16px; max-width: 80%; box-shadow: 0 6px 24px rgba(0,0,0,.2); font-family: ${FONT}; }
  .dialog .change { display: flex; align-items: center; justify-content: center; gap: 10px; }
  .dialog .name { font-size: 12px; color: #8a96a3; text-align: center; margin: 6px 0 14px; }
  .dialog .buttons { display: flex; justify-content: center; gap: 18px; }
  .dialog button { border: 0; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; }
  .dialog .cancel { background: #eef3f8; }
  .panel { width: 340px; max-width: 92%; box-sizing: border-box; }
  .panel .head { display: flex; align-items: center; gap: 4px; margin-bottom: 10px; }
  .panel .title { flex: 1; font-size: 15px; font-weight: 700; }
  .panel button.icon { width: 32px; height: 32px; background: transparent; border-radius: 50%; }
  .panel .list { list-style: none; margin: 0; padding: 0; max-height: 300px; overflow-y: auto; font-size: 13px; }
  .panel .list li { display: flex; justify-content: space-between; gap: 12px; padding: 7px 2px; border-bottom: 1px solid #e3e8e2; }
  .panel .list li:last-child { border-bottom: 0; }
  .panel .dim { color: #6b7785; }
  .panel .list .wrap { text-align: right; max-width: 70%; overflow-wrap: anywhere; }
  .panel .saltlist { margin-top: 10px; }
  .panel .note { color: #6b7785; font-size: 13px; line-height: 1.4; padding: 8px 2px 4px; text-align: left; }
  .panel .note b { color: #2b3136; font-weight: 700; }
  .panel .empty { color: #8a96a3; font-size: 13px; padding: 18px 0; text-align: center; }
  .panel .ask { font-size: 13px; text-align: center; margin: 14px 0 10px; }
  .panel .buttons { margin-top: 14px; }
  .panel button.round { border-radius: 50%; width: 40px; height: 40px; }
  .panel .bigtotal { font-size: 22px; font-weight: 700; text-align: center; margin: 4px 0 8px; color: #2b3136; }
  .panel .dim.center { text-align: center; font-size: 13px; }
  .panel .small { font-size: 11px; margin-top: 4px; }
  .panel .todo { margin: 4px 2px 6px; padding: 0 0 0 18px; font-size: 13px; color: #4a5561; line-height: 1.35; }
  .panel .todo li { margin: 4px 0; }
  .panel .todonote { font-size: 11.5px; color: #8a96a3; margin: 8px 2px 0; }
  .panel .statushead { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 6px 0 10px; text-align: center; }
  .panel .statushead .dot { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .panel .statushead .big { font-size: 18px; font-weight: 800; color: #2a3340; }
  .panel .statuslist { font-size: 12px; color: #6b7785; }
  .panel .statuslist li { padding: 4px 2px; }
  .panel .navrow { display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 12px; padding: 9px 12px; border-radius: 10px; background: #eef3f0; color: #2e6b1f; font-size: 13px; font-weight: 600; cursor: pointer; }
  .panel .navrow.on { color: #4a5561; background: #f3f5f4; font-weight: 500; }
  .panel .subhead { font-size: 12px; font-weight: 700; color: #4a5561; margin: 12px 2px 2px; text-transform: uppercase; letter-spacing: .04em; }
  .panel .ask.warn { color: #ef6c00; font-weight: 700; margin: 4px 0 8px; }
  .panel .ask .hint { font-size: 12px; color: #8a96a3; margin-top: 4px; }
  .panel .cancel-done { background: #eef3f8; }
  .panel button.pill { width: auto; height: 40px; border-radius: 20px; padding: 0 18px; gap: 6px; color: #fff; font: 600 14px ${FONT}; }
  .panel .seg { display: flex; background: #eef3f0; border-radius: 10px; padding: 3px; gap: 2px; margin-bottom: 10px; }
  .panel .seg button { flex: 1; width: auto; height: 30px; border-radius: 8px; background: transparent; color: #4a5561; font: 600 12.5px ${FONT}; }
  .panel .seg button.on { background: #fff; color: #2b3136; box-shadow: 0 1px 3px rgba(0,0,0,.12); }
  .panel button.pill span { white-space: nowrap; }
  .panel button.pill:disabled { background: #c9d1d9 !important; color: #5b6478; cursor: default; }
  .panel .ratios { list-style: none; margin: 8px 0 0; padding: 0; font-size: 13px; color: #4a5561; }
  .panel .ratios li { display: flex; justify-content: space-between; padding: 4px 2px; border-top: 1px solid #e3e8e2; }
  .panel .sum { display: flex; justify-content: space-between; font-size: 13px; margin-top: 6px; color: #4a5561; }
  .dialog .yes { background: #3d8bd6; }
  .tip { position: absolute; max-width: 70%; background: #263238; color: #fff; font-family: ${FONT}; font-size: 13px; line-height: 1.35; padding: 8px 10px; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,.25); white-space: pre-line; z-index: 2; display: flex; gap: 8px; align-items: flex-start; }
  .tip button { flex: none; background: rgba(255,255,255,.15); border: 0; border-radius: 50%; width: 26px; height: 26px; padding: 0; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  svg { -webkit-touch-callout: none; }
`;

  // src/editor.js
  function getConfigForm() {
    const lang = (document.querySelector("home-assistant")?.hass?.language || "en").startsWith("de") ? "de" : "en";
    const T = TEXT[lang];
    const opt = (names) => names.map((value) => ({ value, label: T[`opt_${value}`] || value }));
    const select = (options) => ({ select: { mode: "dropdown", options: opt(options) } });
    const group = (name, expanded, schema) => ({ type: "expandable", name: `group_${name}`, title: T[`group_${name}`], flatten: true, expanded, schema });
    return {
      // Three groups, flattened: the saved YAML stays a flat list of options
      schema: [
        group("general", true, [
          { name: "device", selector: { device: { integration: DOMAIN } } },
          { name: "language", selector: { select: { mode: "dropdown", options: [{ value: "", label: T.opt_auto }, { value: "de", label: "Deutsch" }, { value: "en", label: "English" }] } } }
        ]),
        group("display", true, [
          { name: "background", default: "tint", selector: select(["tint", "light", "transparent"]) },
          { name: "show_controls", default: true, selector: { boolean: {} } }
        ]),
        group("behavior", false, [
          { name: "confirm", default: true, selector: { boolean: {} } },
          { name: "service_done_days", default: 30, selector: { number: { min: 1, max: 365, mode: "box", unit_of_measurement: lang === "de" ? "Tage" : "days" } } }
        ])
      ],
      computeLabel: (schema) => T[schema.name] || schema.name,
      computeHelper: (schema) => T[`${schema.name}_help`] || ""
    };
  }

  // src/methods/data.js
  var dataMethods = {
    get _t() {
      const lang = (this._config.language || this._hass?.language || "en").slice(0, 2);
      return TEXT[lang] || TEXT.en;
    },
    // --- data -------------------------------------------------------------
    async _loadInfo(force = false) {
      if (!this._hass || this._loading) return;
      if (!force && this._info && Date.now() - this._infoTime < 15 * 60 * 1e3) return;
      this._loading = true;
      try {
        this._info = await this._hass.callWS({ type: `${DOMAIN}/card_info` });
      } catch {
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
        devices[root] ?? (devices[root] = { device_id: root, name: main?.name_by_user || main?.name || "Grünbeck", entities: {}, salt: null, lime: null });
        devices[root].entities[entry.translation_key] = entry.entity_id;
      }
      return Object.values(devices);
    },
    _device() {
      const list = this._info || [];
      const wanted = this._config.device;
      if (wanted) {
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
      return id ? this._hass.states[id] : void 0;
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
          return this._kg(value / 1e3);
        case "kg":
          return this._kg(value);
        case "L/min":
          return `${this._number(value, 1)} L/min`;
        case "%":
          return `${this._number(value, 0)} %`;
        case "°dH":
          return `${this._number(value, 0)} °dH`;
        case void 0:
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
        minimumFractionDigits: digits
      }).format(value);
    },
    _liters(value) {
      if (value == null) return "–";
      if (Math.abs(value) >= 1e5) return `${this._number(value / 1e3, 1)} m³`;
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
      const age = Date.now() - this._statsTime;
      const changed = this._hass.states[id]?.state !== this._statsCur;
      if (this._statsFor === id && age < 10 * 60 * 1e3 && !(changed && age > 5 * 60 * 1e3)) return;
      this._statsLoading = true;
      const stats = {};
      for (const period of ["day"]) {
        try {
          const res = await this._hass.callWS({
            type: "recorder/statistic_during_period",
            statistic_id: id,
            calendar: { period },
            types: ["change"]
          });
          stats[period] = typeof res?.change === "number" ? res.change : null;
        } catch {
          stats[period] = null;
        }
      }
      try {
        const res = await this._hass.callWS({
          type: "recorder/statistics_during_period",
          start_time: new Date(Date.now() - 3 * 3600 * 1e3).toISOString(),
          statistic_ids: [id],
          period: "5minute",
          types: ["state"]
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
      const now = /* @__PURE__ */ new Date();
      const names = {
        [dayKey(now)]: this._t.today_short,
        [dayKey(new Date(now.getTime() - 864e5))]: this._t.yesterday_short,
        [dayKey(new Date(now.getTime() + 864e5))]: this._t.tomorrow_short
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
      const d = /* @__PURE__ */ new Date(`${value.slice(0, 10)}T12:00:00Z`);
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
      const now = /* @__PURE__ */ new Date();
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
      const now = /* @__PURE__ */ new Date();
      const r = this._ratios(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30), new Date(now.getFullYear(), now.getMonth(), now.getDate()));
      return r[what] == null ? "–" : `${this._number(r[what], 0)} g/m³`;
    },
    // Error number out of the message, e.g. "E12" or "42"
    _errorCode(message) {
      return (String(message || "").match(/\b[A-Za-z]{0,2}\d{1,4}\b/) || [""])[0];
    }
  };

  // src/shapes.js
  var BUBBLES = [[160.7, 456.4, 1.4, 0.41], [139.2, 310.5, 1.6, 0.52], [135.5, 345.1, 2, 0.55], [130.7, 398.3, 2.4, 0.56], [203.5, 508, 1.9, 0.4], [158, 513.5, 3, 0.3], [140, 340.9, 1.8, 0.42], [180.8, 349.1, 1.4, 0.4], [159.1, 429.3, 3, 0.49], [173.5, 442.9, 2.5, 0.27], [211.5, 485.9, 2.9, 0.53], [161.3, 385.1, 1.6, 0.47], [128.8, 297.3, 1.8, 0.31], [156.3, 293.4, 1.4, 0.3], [132.7, 375.8, 1.4, 0.56], [183.2, 318.9, 1.9, 0.37], [158.5, 312.1, 2.9, 0.6], [168.7, 407.5, 1.6, 0.29], [156.5, 349.6, 2.9, 0.31], [124.9, 531.1, 2.3, 0.3], [176.3, 286.7, 2.3, 0.59], [207.9, 463.7, 1.9, 0.38], [139.2, 483.7, 2.3, 0.52], [155.2, 338.5, 2.8, 0.59], [206.8, 492.8, 2.8, 0.51], [145.1, 416.5, 2, 0.26], [125.5, 353.5, 1.9, 0.49], [217.1, 397.8, 3, 0.6], [216.9, 376, 1.8, 0.33], [142.1, 333.6, 2.5, 0.57], [205.6, 406.4, 2.5, 0.53], [131.1, 454.3, 3, 0.52], [196.7, 406, 1.7, 0.53], [155.5, 491.4, 3.1, 0.39], [162.3, 530, 2.6, 0.31], [135.2, 319.5, 3, 0.53], [137.1, 498.2, 3.1, 0.48], [157.2, 424.7, 1.7, 0.25], [218.4, 451.4, 2.3, 0.58], [165.5, 510.2, 2.9, 0.32], [147.5, 357, 1.8, 0.46], [148.3, 390.4, 1.7, 0.57], [157.6, 400.7, 2.4, 0.57], [164.1, 522.3, 2.3, 0.44], [174.3, 284.5, 2.2, 0.31], [123.1, 490.9, 1.7, 0.42], [194.3, 426.8, 2, 0.43], [177.5, 487, 1.6, 0.45], [147.2, 352.9, 2.8, 0.43], [178.1, 480.6, 3, 0.41], [183.1, 413.3, 2.3, 0.49], [167.3, 420.6, 2.3, 0.58], [191.6, 511.4, 3, 0.34], [177.9, 529.1, 2.9, 0.3], [134.7, 396.5, 1.6, 0.33], [129.9, 456.7, 2.8, 0.56], [137.9, 469, 2.5, 0.3], [209.7, 535.5, 1.8, 0.58], [162, 408.4, 3.1, 0.54], [138.5, 393.7, 2.3, 0.37], [142, 363.8, 2.6, 0.26], [177.3, 396.1, 1.4, 0.37], [184.3, 415.1, 1.6, 0.59], [200.4, 536.6, 1.6, 0.34], [126.5, 485.6, 1.9, 0.3], [164.3, 520.6, 2.8, 0.34], [137.5, 522.7, 2.4, 0.5], [131.5, 294.8, 2.6, 0.4], [129.9, 527.8, 2.5, 0.53], [130.9, 506, 1.6, 0.55], [167.5, 369.2, 2.4, 0.57], [149.1, 313.7, 2.3, 0.33], [133.5, 322.3, 1.6, 0.32], [153.5, 360.3, 2.8, 0.35], [172, 326.7, 2, 0.26], [147.3, 283.6, 2.6, 0.44], [141.3, 405.1, 3, 0.29], [203.5, 393.9, 2.3, 0.54], [161.5, 413.6, 2.6, 0.59], [156.5, 499.7, 2.6, 0.47], [162.5, 371.5, 1.6, 0.3], [129.6, 475.5, 1.9, 0.31], [131.1, 502.1, 2.9, 0.48], [150.5, 343.7, 1.9, 0.41], [138.3, 397.5, 1.9, 0.59], [218.7, 424.3, 1.8, 0.59], [153.2, 373.9, 1.4, 0.38], [169.5, 412.6, 1.8, 0.43], [123.2, 349.5, 1.6, 0.39], [126.8, 285.5, 1.9, 0.33]];
  var DEFS = `<defs>
 <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f8fb"/><stop offset="1" stop-color="#e6eef5"/></linearGradient>
 <linearGradient id="bgTint" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3eaf1"/><stop offset="1" stop-color="#d0dbe5"/></linearGradient>
 <linearGradient id="pipe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7fafc"/><stop offset=".5" stop-color="#d7e0e8"/><stop offset="1" stop-color="#b7c3ce"/></linearGradient>
 <linearGradient id="flowIn" x1="0" x2="1"><stop offset="0" stop-color="#5f86a8" stop-opacity=".2"/><stop offset="1" stop-color="#4b7295"/></linearGradient>
 <linearGradient id="flowOut" x1="0" x2="1"><stop offset="0" stop-color="#6fc0f7"/><stop offset="1" stop-color="#bfe5fc" stop-opacity=".2"/></linearGradient>
 <linearGradient id="flowIdle" x1="0" x2="1"><stop offset="0" stop-color="#b7c3ce" stop-opacity=".2"/><stop offset="1" stop-color="#9fb0c0"/></linearGradient>
 <linearGradient id="flowIdleOut" x1="0" x2="1"><stop offset="0" stop-color="#9fb0c0"/><stop offset="1" stop-color="#b7c3ce" stop-opacity=".2"/></linearGradient>
 <linearGradient id="body" x1="0" x2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".55" stop-color="#f1f5f9" stop-opacity=".9"/><stop offset="1" stop-color="#dde5ec" stop-opacity=".95"/></linearGradient>
 <linearGradient id="lid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e9eef3"/></linearGradient>
 <linearGradient id="resin" x1="0" x2="1"><stop offset="0" stop-color="#8ec5f2"/><stop offset=".5" stop-color="#5aa5e6"/><stop offset="1" stop-color="#3b84c9"/></linearGradient>
 <linearGradient id="tab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3e9ef"/></linearGradient>
 <filter id="shadow" x="-10%" y="-10%" width="120%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#1f3b57" flood-opacity=".12"/></filter>
</defs>`;
  var VALVES = `<g transform="translate(${VALVE_DX} 0)"><g fill="#9aa7b3"><rect x="136" y="18" width="30" height="8" rx="3"/><rect x="196" y="18" width="30" height="8" rx="3"/><rect x="146" y="24" width="10" height="32" rx="3"/><rect x="206" y="24" width="10" height="32" rx="3"/><rect x="176" y="30" width="12" height="26" rx="3" fill="#7d8b97"/></g>
<rect x="124" y="48" width="114" height="34" rx="8" fill="url(#pipe)" stroke="#b7c3ce"/>
<rect x="160" y="80" width="18" height="70" fill="url(#pipe)"/><rect x="196" y="80" width="18" height="70" fill="url(#pipe)"/></g>`;
  var BODY = (x, lid, taper = 0) => {
    const step = taper ? 1.5 : 0;
    const l = x + step;
    const r = 292 - step;
    const bl = l + taper;
    const br = r - taper;
    return `M${x} 162 Q${x} 144 ${x + 20} 144 H272 Q292 144 292 162 V${lid} H${r} L${br} ${676 + DH} Q${br} ${696 + DH} ${br - 20} ${696 + DH} H${bl + 20} Q${bl} ${696 + DH} ${bl} ${676 + DH} L${l} ${lid} H${x} Z`;
  };
  var CABINET = (x, lid = 222, taper = 0) => `<path d="${BODY(x, lid, taper)}" fill="url(#body)" stroke="#c4cfd9" stroke-width="1.5" filter="url(#shadow)"/>
<path d="M${x} 162 Q${x} 144 ${x + 20} 144 H272 Q292 144 292 162 V${lid} H${x} Z" fill="url(#lid)" stroke="#c4cfd9" stroke-width="1.2"/>
<line x1="${x}" y1="${lid}" x2="292" y2="${lid}" stroke="#cfd8e1"/>
`;

  // src/icons.js
  var ICONS = {
    iq: "M21.33,12.91C21.42,14.46 20.71,15.95 19.44,16.86L20.21,18.35C20.44,18.8 20.47,19.33 20.27,19.8C20.08,20.27 19.69,20.64 19.21,20.8L18.42,21.05C18.25,21.11 18.06,21.14 17.88,21.14C17.37,21.14 16.89,20.91 16.56,20.5L14.44,18C13.55,17.85 12.71,17.47 12,16.9C11.5,17.05 11,17.13 10.5,17.13C9.62,17.13 8.74,16.86 8,16.34C7.47,16.5 6.93,16.57 6.38,16.56C5.59,16.57 4.81,16.41 4.08,16.11C2.65,15.47 1.7,14.07 1.65,12.5C1.57,11.78 1.69,11.05 2,10.39C1.71,9.64 1.68,8.82 1.93,8.06C2.3,7.11 3,6.32 3.87,5.82C4.45,4.13 6.08,3 7.87,3.12C9.47,1.62 11.92,1.46 13.7,2.75C14.12,2.64 14.56,2.58 15,2.58C16.36,2.55 17.65,3.15 18.5,4.22C20.54,4.75 22,6.57 22.08,8.69C22.13,9.8 21.83,10.89 21.22,11.82C21.29,12.18 21.33,12.54 21.33,12.91M16.33,11.5C16.9,11.57 17.35,12 17.35,12.57A1,1 0 0,1 16.35,13.57H15.72C15.4,14.47 14.84,15.26 14.1,15.86C14.35,15.95 14.61,16 14.87,16.07C20,16 19.4,12.87 19.4,12.82C19.34,11.39 18.14,10.27 16.71,10.33A1,1 0 0,1 15.71,9.33A1,1 0 0,1 16.71,8.33C17.94,8.36 19.12,8.82 20.04,9.63C20.09,9.34 20.12,9.04 20.12,8.74C20.06,7.5 19.5,6.42 17.25,6.21C16,3.25 12.85,4.89 12.85,5.81V5.81C12.82,6.04 13.06,6.53 13.1,6.56A1,1 0 0,1 14.1,7.56C14.1,8.11 13.65,8.56 13.1,8.56V8.56C12.57,8.54 12.07,8.34 11.67,8C11.19,8.31 10.64,8.5 10.07,8.56V8.56C9.5,8.61 9.03,8.21 9,7.66C8.92,7.1 9.33,6.61 9.88,6.56C10.04,6.54 10.82,6.42 10.82,5.79V5.79C10.82,5.13 11.07,4.5 11.5,4C10.58,3.75 9.59,4.08 8.59,5.29C6.75,5 6,5.25 5.45,7.2C4.5,7.67 4,8 3.78,9C4.86,8.78 5.97,8.87 7,9.25C7.5,9.44 7.78,10 7.59,10.54C7.4,11.06 6.82,11.32 6.3,11.13C5.57,10.81 4.75,10.79 4,11.07C3.68,11.34 3.68,11.9 3.68,12.34C3.68,13.08 4.05,13.77 4.68,14.17C5.21,14.44 5.8,14.58 6.39,14.57C6.24,14.31 6.11,14.04 6,13.76C5.81,13.22 6.1,12.63 6.64,12.44C7.18,12.25 7.77,12.54 7.96,13.08C8.36,14.22 9.38,15 10.58,15.13C11.95,15.06 13.17,14.25 13.77,13C14,11.62 15.11,11.5 16.33,11.5M18.33,18.97L17.71,17.67L17,17.83L18,19.08L18.33,18.97M13.68,10.36C13.7,9.83 13.3,9.38 12.77,9.33C12.06,9.29 11.37,9.53 10.84,10C10.27,10.58 9.97,11.38 10,12.19A1,1 0 0,0 11,13.19C11.57,13.19 12,12.74 12,12.19C12,11.92 12.07,11.65 12.23,11.43C12.35,11.33 12.5,11.28 12.66,11.28C13.21,11.31 13.68,10.9 13.68,10.36Z",
    bell: "M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21M19.75,3.19L18.33,4.61C20.04,6.3 21,8.6 21,11H23C23,8.07 21.84,5.25 19.75,3.19M1,11H3C3,8.6 3.96,6.3 5.67,4.61L4.25,3.19C2.16,5.25 1,8.07 1,11Z",
    live: "M13,2.05V4.05C17.39,4.59 20.5,8.58 19.96,12.97C19.5,16.61 16.64,19.5 13,19.93V21.93C18.5,21.38 22.5,16.5 21.95,11C21.5,6.25 17.73,2.5 13,2.03V2.05M5.67,19.74C7.18,21 9.04,21.79 11,22V20C9.58,19.82 8.23,19.25 7.1,18.37L5.67,19.74M7.1,5.74C8.22,4.84 9.57,4.26 11,4.06V2.06C9.05,2.25 7.19,3 5.67,4.26L7.1,5.74M5.69,7.1L4.26,5.67C3,7.19 2.25,9.04 2.05,11H4.05C4.24,9.58 4.8,8.23 5.69,7.1M4.06,13H2.06C2.26,14.96 3.03,16.81 4.27,18.33L5.69,16.9C4.81,15.77 4.24,14.42 4.06,13M10,16.5L16,12L10,7.5V16.5Z",
    radar: "M19.07,4.93L17.66,6.34C19.1,7.79 20,9.79 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12C4,7.92 7.05,4.56 11,4.07V6.09C8.16,6.57 6,9.03 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12C18,10.34 17.33,8.84 16.24,7.76L14.83,9.17C15.55,9.9 16,10.9 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12C8,10.14 9.28,8.59 11,8.14V10.28C10.4,10.63 10,11.26 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12C14,11.26 13.6,10.62 13,10.28V2H12A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,9.24 20.88,6.74 19.07,4.93Z",
    ring: "M12 5C15.87 5 19 8.13 19 12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12C5 8.13 8.13 5 12 5M12 2C17.5 2 22 6.5 22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4Z",
    failure: "M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
    message: "M13 11H11V5H13M13 15H11V13H13M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z",
    water: "M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z",
    cloudOff: "M19.8 22.6L17.15 20H6.5Q4.2 20 2.6 18.4T1 14.5Q1 12.58 2.19 11.08 3.38 9.57 5.25 9.15 5.33 8.95 5.4 8.76 5.5 8.57 5.55 8.35L1.4 4.2L2.8 2.8L21.2 21.2M6.5 18H15.15L7.1 9.95Q7.05 10.23 7.03 10.5 7 10.73 7 11H6.5Q5.05 11 4.03 12.03 3 13.05 3 14.5 3 15.95 4.03 17 5.05 18 6.5 18M21.6 18.75L20.15 17.35Q20.58 17 20.79 16.54 21 16.08 21 15.5 21 14.45 20.27 13.73 19.55 13 18.5 13H17V11Q17 8.93 15.54 7.46 14.08 6 12 6 11.33 6 10.7 6.16 10.07 6.33 9.5 6.68L8.05 5.23Q8.93 4.63 9.91 4.31 10.9 4 12 4 14.93 4 16.96 6.04 19 8.07 19 11 20.73 11.2 21.86 12.5 23 13.78 23 15.5 23 16.5 22.63 17.31 22.25 18.15 21.6 18.75Z",
    clock: "M11 7V13L16.2 16.1L17 14.9L12.5 12.2V7H11M20 12V18H22V12H20M20 20V22H22V20H20M18 20C16.3 21.3 14.3 22 12 22C6.5 22 2 17.5 2 12S6.5 2 12 2C16.8 2 20.9 5.4 21.8 10H19.7C18.8 6.6 15.7 4 12 4C7.6 4 4 7.6 4 12S7.6 20 12 20C14.4 20 16.5 18.9 18 17.3V20Z",
    raw: "M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z M10,12.6A1.1,1.1 0 1,0 10.01,12.6Z M14,13.4A1.1,1.1 0 1,0 14.01,13.4Z M11.6,16.2A1.1,1.1 0 1,0 11.61,16.2Z",
    soft: "M21.75 16.25L17 21L14.25 18L15.41 16.84L17 18.43L20.59 14.84L21.75 16.25M17.62 12C16.31 8.1 12 3.25 12 3.25S6 10 6 14C6 17.31 8.69 20 12 20H12.34C12.12 19.36 12 18.7 12 18C12 14.82 14.5 12.22 17.62 12Z",
    wrench: "M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.6,20.4C23.1,20 23.1,19.3 22.7,19Z",
    magnify: "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z",
    autorenew: "M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z",
    cog: "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",
    info: "M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
  };
  var svgIcon = (path, color, size = 26) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"><path d="${path}" fill="${color}"/></svg>`;
  var ARROW = "M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z";
  var CHECK = "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z";
  var CROSS = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";
  var SALT_STACK = (cx, cy, color, w = 1.5, bg = "none") => {
    const tab = (x, y, rx, a) => {
      const ry = rx * 0.6, th = rx * 0.45;
      return `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M${-rx} 0 V${th} A${rx} ${ry} 0 0 0 ${rx} ${th} V0" fill="${bg}" stroke="${color}" stroke-width="${w}" stroke-linejoin="round"/><ellipse rx="${rx}" ry="${ry}" fill="${bg}" stroke="${color}" stroke-width="${w}"/></g>`;
    };
    return tab(cx - 5.8, cy + 3, 5.4, -6) + tab(cx + 5.8, cy + 3, 5.4, 6) + tab(cx - 0.4, cy - 3.2, 5.4, 12);
  };
  var LIME_CRYSTALS = (color, bg, w, facet = false) => `<g fill="${bg}" stroke="${color}" stroke-width="${w}" stroke-linejoin="round"><path d="M5.8 10 L8.9 13.2 L8.2 24.6 H2.8 L2.6 14 Z"/><path d="M22.2 10.8 L25.4 14.2 L25.2 24.6 H19.8 L19.1 13.6 Z"/><path d="M14 2.4 L18.4 8 L17.4 24.6 H10.6 L9.6 8 Z"/>${facet ? `<path d="M9.6 8 L14 11 L18.4 8 M14 11 V22" fill="none" stroke-width="${w * 2 / 3}" stroke-linecap="round"/>` : ""}</g>`;
  var OUTLINE_DROP = (x, y, k, color) => `<path transform="translate(${x} ${y}) scale(${k})" d="M0 0 c0 0 -3.8 4.2 -3.8 6.6 a3.8 3.8 0 0 0 7.6 0 c0 -2.4 -3.8 -6.6 -3.8 -6.6 Z" fill="${ROW_BG}" stroke="${color}" stroke-width="${1.5 / k}" stroke-linejoin="round"/>`;
  var avgBadge = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="6.4" fill="#3d8bd6" stroke="${ROW_BG}" stroke-width="1.6"/><text x="${cx}" y="${cy + 3.4}" text-anchor="middle" font-family="${FONT}" font-size="10" font-weight="800" class="bdt" fill="#fff">Ø</text>`;
  var GLYPH_BOX = { wrench: [0.96, 1.1, 22.03, 21.9], magnify: [3, 3, 17.5, 17.5] };
  var GLYPH_SIZE = { wrench: 19.8, magnify: 20 };
  var glyphPath = (name, cx, cy, size = 17, fill = "#3d8bd6") => {
    const [bx, by, bw, bh] = GLYPH_BOX[name];
    const k = size / Math.max(bw, bh);
    return `<path d="${ICONS[name]}" fill="${fill}" transform="translate(${(cx - (bx + bw / 2) * k).toFixed(2)} ${(cy - (by + bh / 2) * k).toFixed(2)}) scale(${k.toFixed(4)})"/>`;
  };
  var CLOCK_ICON = (cy) => `<circle cx="329" cy="${cy}" r="8.9" fill="none" stroke="#3d8bd6" stroke-width="2"/><path d="M329 ${cy - 4.8} V${cy} l3.6 2.4" fill="none" stroke="#3d8bd6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
  var LAST_ICON = (cy) => `<path d="M335 ${cy - 3} a7 7 0 1 0 1 5" fill="none" stroke="#3d8bd6" stroke-width="1.8" stroke-linecap="round"/><path d="M336 ${cy - 8} v5 h-5" fill="none" stroke="#3d8bd6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M326 ${cy} l2.2 2.2 4 -4" fill="none" stroke="#3d8bd6" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  var COUNT_ICON = (cy) => `<text x="329" y="${cy + 7.5}" text-anchor="middle" font-family="${FONT}" font-size="23" font-weight="700" fill="#3d8bd6">#</text>`;
  var HEADER_BOX = {
    water: [-3.75, -5.47, 7.5, 10.47],
    salt: [-11.2, -6.8, 22.4, 15.6],
    lime: [-11.4, -11.2, 22.8, 22.2],
    tank: [-7.6, -13.4, 15.2, 26.4]
  };
  var OUTLINE_WATER = (cx, cy) => `<path d="${ICONS.water}" fill="#3d8bd6" stroke="#fff" stroke-width="2.4" stroke-linejoin="round" transform="translate(${cx - 7.5} ${cy - 7.5}) scale(${15 / 24})"/>`;
  var HEADER_ICONS = {
    water: (cx, cy) => OUTLINE_WATER(cx, cy),
    // The plant: straight lid, slightly tapered body, the LED strip between
    tank: (cx, cy) => `<g transform="translate(${cx - 14} ${cy - 14.5})"><path d="M7.5 2.2 H20.5 V6.6 L19.7 26.4 H8.3 L7.5 6.6 Z" fill="#3d8bd6" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/><path d="M7.5 6.6 H20.5" stroke="#fff" stroke-width="2.6"/></g>`,
    regen: (cx, cy) => `<path d="${ICONS.autorenew}" fill="#fff" transform="translate(${cx - 7.5} ${cy - 7.5}) scale(${15 / 24})"/>`,
    cog: (cx, cy) => `<path d="${ICONS.cog}" fill="#fff" transform="translate(${cx - 7.5} ${cy - 7.5}) scale(${15 / 24})"/>`,
    // Glowing ring: the LED ring of the softener
    led: (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="4" fill="none" stroke="#fff" stroke-width="2"/>` + [0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<line x1="${cx}" y1="${cy - 6}" x2="${cx}" y2="${cy - 8}" stroke="#fff" stroke-width="1.5" stroke-linecap="round" transform="rotate(${a} ${cx} ${cy})"/>`).join(""),
    lime: (cx, cy) => `<g transform="translate(${cx - 14} ${cy - 13.6})">${LIME_CRYSTALS("#fff", "#3d8bd6", 1.8, true)}</g>`,
    salt: (cx, cy) => SALT_STACK(cx, cy, "#fff", 1.5, "#3d8bd6")
  };

  // src/methods/picture.js
  var pictureMethods = {
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
      const arrows = (x0) => [0, 1, 2].map((i) => `<path class="chevron" style="animation-delay:${(i * 0.5).toFixed(1)}s" d="M${x0 + i * 30} 59 l9 6 -9 6" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
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
      const value = regenerating && progress != null ? `R ${Math.round(progress)}%` : capacity == null ? "--" : `${Math.round(capacity)}%`;
      return `<g class="tap" data-more="${regenerating ? "regeneration_running" : "mrescapa1"}"><title>${esc(`${regenerating ? `${this._t.regeneration}: ${value}
` : ""}${this._t.capacity}: ${this._fmt("mresidcap1")}, ${this._fmt("mrescapa1")}`)}</title>
      ${this._lidSplit ? this._screen(capacity, regenerating, progress) : this._lidBottom > 222 ? `<rect x="${this._displayX}" y="154" width="48" height="${this._stripLow ? 66 : 94}" rx="6" fill="#fbfcfa" stroke="#c4cfd9" stroke-width="1.2"/>
           <rect x="${this._displayX + 3}" y="157" width="42" height="${this._stripLow ? 60 : 88}" rx="4" fill="none" stroke="#e6ebe3"/>
           ${text(this._displayX + 24, this._stripLow ? 186 : 197, value.replace("%", ""), `text-anchor="middle" font-size="${value.length > 4 ? 16 : 22}" font-weight="700" fill="#2b3136"`)}
           ${text(this._displayX + 24, this._stripLow ? 206 : 218, "%", 'text-anchor="middle" font-size="13" font-weight="700" fill="#5a9e32"')}` : `<rect x="234" y="157" width="50" height="26" rx="4" fill="#fbfcfa" stroke="#c4cfd9" stroke-width="1.2"/>
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
      const liters = raw == null ? null : unit === "L" ? raw : raw * 1e3;
      const dashes = 6;
      const lit = Math.round(pct / 100 * dashes);
      let gauge = "";
      for (let i = 0; i < dashes; i++) {
        const y = 207 - i * 9;
        const bow = Math.abs(i - (dashes - 1) / 2) * 2.2;
        const color = i < lit ? regenerating ? "#ef6c00" : "#7cc24a" : "#dfe5ea";
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
      const tip = brightness == null ? this._t.led_ring || "LED" : `${this._t.brightness}: ${this._fmt("led_brightness")}`;
      return `<rect class="led tap" data-more="led_brightness" x="6.8" y="${this._stripY}" width="${this._lidBottom > 222 && !this._stripLow ? 217 : 284.4}" height="20" rx="1.5" fill="${fill}" opacity="${lit ? level.toFixed(2) : 1}"><title>${esc(tip)}</title></rect>`;
    },
    _resin(capacity, regenerating, flow) {
      const g = this._geo;
      const pct = capacity == null ? 100 : Math.max(0, Math.min(100, capacity));
      const ix = g.x;
      const iw = g.w;
      const iy0 = g.top;
      const iy1 = g.shelf;
      const full = iy0 + 16;
      const empty = iy1 - 12;
      const top = empty - (empty - full) * pct / 100;
      const bx = (b) => (ix + (b - 112) / 120 * iw).toFixed(1);
      const by = (b) => +(iy0 + (b - 238) / 330 * (iy1 - iy0)).toFixed(1);
      const bubbles = BUBBLES.filter((b) => by(b[1]) > top + 6).map((b, i) => `<circle cx="${bx(b[0])}" cy="${by(b[1])}" r="${b[2]}" fill="#ffffff" opacity="${b[3]}"${flow > 0 ? ` class="bubble" style="animation-delay:-${(i * 0.37 % 3).toFixed(2)}s"` : ""}/>`).join("");
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
      const geo = this._geo;
      const inset = this._taper * (geo.shelf - this._lidBottom) / (696 + DH - this._lidBottom);
      const g = { ...geo, x: geo.x + inset, w: geo.w - 2 * inset };
      return `<rect x="${g.x + 2}" y="${g.shelf + 13}" width="${g.w - 4}" height="5" fill="#9fb0c0" opacity=".16"/>
      <rect x="${g.x}" y="${g.shelf}" width="${g.w}" height="12" rx="6" fill="url(#lid)" stroke="#c4cfd9" stroke-width="1.2"/>
      <line x1="${g.x + 8}" y1="${g.shelf + 3.5}" x2="${g.x + g.w - 8}" y2="${g.shelf + 3.5}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity=".9"/>`;
    },
    _salt(saltLow) {
      const g = this._geo;
      const bottom = 676 + DH;
      let seed = saltLow ? 5 : 11;
      const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
      const margin = 1.5 + this._taper + 17;
      const x0 = g.x + margin, wd = g.w - 2 * margin;
      const H = Math.min(100, bottom - g.shelf - 40);
      const dome = (u) => saltLow ? 44 * Math.pow(Math.max(0, 1 - Math.pow((u - 0.5) / 0.3, 2)), 0.9) : H * (0.7 + 0.3 * (1 - Math.pow(2 * u - 1, 2)));
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
      return `
      ${this._lamps(error, saltLow)}
      ${this._iconPill(43, y, "raw", "#9aa7b3", this._fmt("raw_water_hardness"), t.raw_water, "raw_water_hardness", void 0, "left")}
      ${this._iconPill(243, y, "soft", "#3d8bd6", this._fmt("soft_water_hardness"), t.soft_water, "soft_water_hardness", void 0, "right")}`;
    },
    // Water meter built into the pipe right of the valve: the total counter,
    // below it the wheel and the counter of the current flow
    _meter(flow) {
      if (!this._entityId("calculated_water_consumption") && !this._entityId("mflow1")) return "";
      const t = this._t;
      const total = (this._num("calculated_water_consumption") || 0) / 1e3;
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
      const cxPlant = METER_RIGHT - r;
      let plant;
      if (error) {
        const last = this._state("last_error")?.state;
        const msg = last && !["unknown", "unavailable"].includes(last) ? last : t.error;
        const code = this._errorCode(msg);
        const icon = code ? big(cxPlant, text(cxPlant, cy + 4, code, `text-anchor="middle" font-size="${code.length > 3 ? 9.5 : 11.5}" font-weight="800" fill="#fff"`)) : big(cxPlant, `<path d="${ICONS.failure}" fill="#fff" transform="translate(${cxPlant - 10} ${cy - 10}) scale(${20 / 24})"/>`);
        plant = lamp(cxPlant, "#d32f2f", true, icon, msg, ' data-panel="error" data-info="last_error"');
      } else if (this._on("no_data_change")) {
        const since = this._formatDate(this._state("no_data_change").attributes.since);
        plant = lamp(cxPlant, "#9aa7b3", true, big(cxPlant, `<path d="${ICONS.cloudOff}" fill="#fff" transform="translate(${cxPlant - 9} ${cy - 9}) scale(${18 / 24})"/>`), t.no_change.replace("{date}", since), ' data-panel="status" data-info="no_data_change"');
      } else {
        plant = lamp(cxPlant, "#5a9e32", true, big(cxPlant, `<path d="M${cxPlant - 6} ${cy + 0.5} l4.6 4.6 l8 -9.6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>`), t.plant_ok, ' data-panel="status"');
      }
      if (!this._hasSaltSensor()) return plant;
      const cxSalt = cxPlant - 2 * r - 6;
      const salt = lamp(
        cxSalt,
        saltLow ? "#ef6c00" : "#8a96a3",
        !!saltLow,
        big(cxSalt, SALT_STACK(cxSalt, cy, saltLow ? "#fff" : "#8a96a3", 1.3, saltLow ? "#ef6c00" : "#f2f4f7")),
        (saltLow ? `${t.salt_range}: ${t.salt_low}` : t.salt_range) + (() => {
          const l = this._refillInfo().slice(-1)[0];
          return l ? `
${t.last_refill}: ${this._formatDate(l.time)}` + (l.kg == null ? "" : ` (${t.usage_before_n.replace("{v}", this._kg(l.kg))})`) : "";
        })(),
        ' data-panel="refills"'
      );
      return salt + plant;
    }
  };

  // src/stats-layout.js
  var HEAD_H = 25;
  var HEAD_K = { water: 0.9, tank: 1.02, lime: 0.97, salt: 1.12 };
  var headScale = (icon) => {
    const [, , bw, bh] = HEADER_BOX[icon];
    return Math.min(HEAD_H * (HEAD_K[icon] ?? 1) / bh, 31 / bw);
  };
  var HEAD_LEFT = Math.min(...Object.keys(HEAD_K).map((k) => 332 - HEADER_BOX[k][2] * headScale(k) / 2));
  var HEAD_INK_DX = { salt: 0.43, tank: -1.12 };
  var ROW_INK = { cal: [-8.83, 13.63], avg30: [-8.83, 23.88], flow: [-13.23, 21.44], frac_salt: [-20.02, 16.51], frac_lime: [-18.29, 16.51], clock: [-10.68, 10.68], last: [-9.26, 9.41], count: [-8.96, 9.58], wrench: [-11.88, 11.88], magnify: [-12, 12] };
  var VALUE_X = HEAD_LEFT + Math.max(...Object.values(ROW_INK).map(([l, r]) => r - l)) + 9;

  // src/methods/stats.js
  var statsMethods = {
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
      const dx = -14;
      let out = `<g><title>${esc(title)}</title>${this._headIcon(icon, HEAD_LEFT, y + 14, "#e7ecef")}</g>`;
      out += `<rect x="354" y="${y + 13}" width="134" height="2.5" rx="1" fill="#3d8bd6"/>`;
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
        const kind = row.period ? row.period === "avg30" ? "avg30" : "cal" : row.glyph || row.ink;
        const ink = ROW_INK[kind];
        const sx = ink ? HEAD_LEFT - (18 + dx + 329 + ink[0]) : 0;
        let pic = "";
        if (row.period) pic = this._calendar(ry, row.period);
        else if (row.glyph) pic = glyphPath(row.glyph, 329, ry + 10, GLYPH_SIZE[row.glyph]);
        else pic = row.icon ? row.iscale ? `<g transform="translate(329 ${ry + 10}) scale(${row.iscale}) translate(-329 ${-(ry + 10)})">${row.icon(ry + 10)}</g>` : row.icon(ry + 10) : "";
        pic = pic.replace(/#3d8bd6/g, ROW_GREY);
        out += `<g class="ric" data-ink="${kind}" transform="translate(${18 + dx + sx} ${(rh - 20) / 2}) translate(329 ${ry + 10}) scale(${ROW_ICON_SCALE}) translate(-329 ${-(ry + 10)})">${pic}</g>`;
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
      const mark = { today: String((/* @__PURE__ */ new Date()).getDate()), avg30: "30" }[period];
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
          regenerating ? { icon: CLOCK_ICON, ink: "clock", value: this._fmt("regeneration_phase"), color: "#ef6c00", weight: 700, more: "regeneration_phase", title: t.phase } : { icon: CLOCK_ICON, ink: "clock", value: this._on("iq_mode") ? t.iq : this._relDate(this._state("next_regeneration_window")?.state), color: "#333", info: "next_regeneration_window", title: t.next_window },
          ...this._entityId("last_regeneration") ? [{ icon: LAST_ICON, iscale: LAST_SCALE, ink: "last", value: this._relDate(this._state("last_regeneration")?.state), color: "#555", more: "last_regeneration", panel: "lastregen", title: t.last_regeneration }] : [],
          { icon: COUNT_ICON, ink: "count", label: "", value: this._fmt("mcountreg"), color: "#555", more: "mcountreg", panel: this._entityId("last_regeneration") ? "regen" : void 0, title: t.regen_count },
          ...this._serviceRows()
        ]]
      ];
      const rowCount = boxes.reduce((n, [, , rows]) => n + rows.length, 0);
      const used = rowCount * GRID_ROW_H + boxes.length * 32;
      const gap = Math.max(4, (552 + DH - used) / (boxes.length - 1));
      let y = 144;
      let out = "";
      for (const [title, icon, rows, panel] of boxes) {
        const box = this._gridBox(y, title, rows, icon, panel || void 0);
        out += box.svg;
        y = box.bottom + gap;
      }
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
        return { time: r, kg: g / 1e3 };
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
      const kg = grams / 1e3;
      const since = last ? t.salt_caption : t.salt_since_start;
      const W = 300;
      const H = 70;
      const max = 35;
      const x = (v) => Math.min(v, max) / max * W;
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
      const prevLine = lastInfo ? `<ul class="list saltlist"><li><span>${esc(t.last_refill)}</span><span>${esc(this._formatDate(lastInfo.time))}</span></li><li><span>${esc(t.usage_before)}</span><span>${esc(lastInfo.kg == null ? "–" : this._kg(lastInfo.kg))}</span></li></ul>` : "";
      const warn = this._on("salt_warning") ? `<div class="ask warn">${esc(t.refills_now)}</div>` : "";
      return `${warn}<div class="bigtotal">${esc(this._kg(kg))}</div>
      <div class="dim center">${esc(since)}</div>
      <div class="chart"><svg viewBox="0 0 ${W} ${H}" width="100%">${out}</svg></div>
      ${prevLine}`;
    },
    // Salt or lime per m³ water: the large symbol, a slash and a small drop
    _fracIcon(cy, what) {
      const c = "#3d8bd6";
      const top = what === "salt" ? `<g transform="translate(320.6 ${cy - 3.6}) scale(.72) translate(-320.6 ${-(cy - 3.6)})">${SALT_STACK(320.6, cy - 3.6, c, 1.8 / 0.72, ROW_BG)}</g>` : `<g transform="translate(${320.6 - 14 * 0.6} ${cy - 3.6 - 13 * 0.6}) scale(.6)">${LIME_CRYSTALS(c, ROW_BG, 2 / 0.6 * 0.5 + 1.2)}</g>`;
      return `${top}${OUTLINE_DROP(340.4, cy + 3.2, 0.62, c)}<line x1="336.5" y1="${cy - 8}" x2="331.9" y2="${cy + 8.5}" stroke="${c}" stroke-width="1.5" stroke-linecap="round"/>`;
    },
    // Average flow: an outlined arrow over two waves, with a Ø badge, so it
    // differs from the plain flow shown in the meter
    _avgFlowIcon(cy) {
      const c = "#3d8bd6";
      const wave = (y) => `<path d="M319.5 ${y} q2 -2.4 4 0 t4 0 t4 0 t4 0" fill="none" stroke="${c}" stroke-width="1.7" stroke-linecap="round"/>`;
      const ay = cy - 5.6;
      return `<path d="M320 ${ay - 1.3} H326.4 V${ay - 3.6} L333 ${ay} L326.4 ${ay + 3.6} V${ay + 1.3} H320 Z" fill="${ROW_BG}" stroke="${c}" stroke-width="1.3" stroke-linejoin="round"/>` + wave(cy + 1.2) + wave(cy + 6.2) + avgBadge(338, cy + 6.2);
    },
    // Water, salt and lime blocks, short term values first. The charts and
    // the totals are in the windows behind the rows.
    _statBoxes(t, s) {
      const hasSalt = !!this._entityId("salt_total");
      const hasLime = !!this._entityId("lime_total");
      const dayAvg = (what, unit) => {
        const v = this._avg30(what);
        return v == null ? "–" : unit === "L" ? this._liters(v) : this._kg(v / 1e3);
      };
      const waterRows = [
        { period: "today", label: t.today, value: this._period("water_today", s.day, (x) => this._liters(x)), more: "calculated_water_consumption", panel: "chart:water:day" },
        ...this._entityId("average_flow_rate") ? [{ icon: (cy) => this._avgFlowIcon(cy), iscale: 1.16, ink: "flow", label: t.avg_flow_short, value: this._fmt("average_flow_rate"), more: "average_flow_rate", title: t.avg_flow }] : [],
        { period: "avg30", label: t.avg_day, value: dayAvg("water", "L"), more: "calculated_water_consumption", panel: "chart:water:month" }
      ];
      const rows = (what, has) => [
        { period: "avg30", label: t.avg_day, value: dayAvg(what, "kg"), more: `${what}_total`, panel: has && `chart:${what}:month` },
        { icon: (cy) => this._fracIcon(cy, what), ink: `frac_${what}`, label: t[`${what}_per_m3`], value: this._ratio30(what), more: `${what}_total`, panel: has && `chart:${what}:month` }
      ];
      return [
        [t.water, "water", waterRows, "chart:water:days"],
        [t.salt_usage, "salt", rows("salt", hasSalt), hasSalt && "chart:salt:days"],
        ...hasLime || Object.keys(this._dayMap("lime")).length ? [[t.lime, "lime", rows("lime", hasLime), hasLime && "chart:lime:days"]] : []
      ];
    }
  };

  // src/methods/controls.js
  var controlsMethods = {
    // Both groups on the lid: display in the middle between them
    get _lidSplit() {
      const groups = this._controlGroups();
      return groups.length > 0 && groups.every(([, , list]) => list.length <= 4);
    },
    get _displayX() {
      return this._lidSplit ? 125 : 236;
    },
    // LED strip at the bottom of the lid, below all buttons
    get _stripLow() {
      return this._lidBottom > 222;
    },
    get _stripY() {
      return this._stripLow ? 228 : 191;
    },
    // Lid: taller when the LED buttons sit on it below the strip
    get _lidBottom() {
      if (!this._controlGroups().some(([, icon]) => icon === "led")) return this._lidSplit ? 230 : 222;
      return 250;
    },
    // Body below the lid narrows slightly towards the bottom like the softliQ
    // (lid to foot 104 : 88, the lid itself stays straight)
    get _taper() {
      return 22;
    },
    _controlGroups() {
      const t = this._t;
      return [
        [t.led_ring, "led", CONTROLS.filter((c) => c.key.startsWith("led_ring_") && this._entityId(c.key)), "#5a9e32"],
        [t.plant, "cog", CONTROLS.filter((c) => !c.key.startsWith("led_ring_") && this._entityId(c.key)), "#4a5561"]
      ].filter(([, , list]) => list.length);
    },
    // Inner space of the cabinet for resin and salt: x, width, top of the
    // resin, the plate between resin and salt, rows of salt
    get _geo() {
      return { x: 6.75, w: 284.5, top: this._lidBottom + 2, shelf: 641, salt: 9 };
    },
    _controls() {
      return this._controlLid(this._controlGroups());
    },
    // Buttons on the lid: device settings left of the display, LED buttons
    // right below the LED strip
    _controlLid(groups) {
      let out = "";
      if (this._lidSplit) {
        const rows = [167, 205];
        for (const [, icon, list, accent] of groups) {
          const cols = icon === "led" ? [230, 268] : [30, 68];
          list.forEach((c, i) => {
            out += this._toggleSvg(c, accent, cols[i % 2], rows[Math.floor(i / 2) % 2]);
          });
        }
        return out;
      }
      for (const [, icon, list, accent] of groups) {
        const led = icon === "led";
        const cy = this._stripLow ? led ? 205 : 167 : led ? 235 : 168;
        const step = (230 - 12) / 4;
        list.forEach((c, i) => {
          out += this._toggleSvg(c, accent, 12 + step * (i + 0.5), cy);
        });
      }
      return out;
    },
    // Round control button: filled in the group colour when on
    _toggleSvg(c, accent, cx, cy, size = 1) {
      const t = this._t;
      const st = this._state(c.key);
      const on = st?.state === "on";
      const missing = !st || st.state === "unavailable";
      const iconFill = on ? accent : missing ? "#c0c8d0" : "#7b8794";
      const stroke = on ? accent : "#d3dde7";
      const stateText = missing ? t.unavailable : on ? t.on : t.off;
      let out = `<g class="${missing ? "" : "switch"}" data-key="${c.key}" data-label="${esc(t[c.label])}">`;
      out += `<title>${esc(`${t[c.label]}: ${stateText}`)}</title>`;
      const br = 14 * size;
      const fill = on ? accent : missing ? "#eef3f8" : accent;
      const tint = on || missing ? "" : ' fill-opacity=".13" stroke-opacity=".4"';
      out += `<circle class="track" cx="${cx}" cy="${cy}" r="${br}" fill="${fill}" stroke="${missing ? stroke : accent}"${tint}${missing ? ' stroke-dasharray="3 3"' : ""}/>`;
      out += `<path d="${ICONS[c.icon]}" fill="${on ? "#ffffff" : missing ? iconFill : accent}"${on || missing ? "" : ' fill-opacity=".6"'} transform="translate(${cx - 8.5 * size} ${cy - 8.5 * size}) scale(${17 * size / 24})"/>`;
      out += `<rect x="${cx - 30}" y="${cy - 20}" width="60" height="40" fill="transparent"/>`;
      return out + `</g>`;
    },
    // Value with a pictogram instead of a text label; the name is the tooltip
    _iconPill(x, y, icon, iconColor, value, title, more, color = "#2b3a47", align = "left") {
      const fs = PILL_FS;
      const halo = 'stroke="#ffffff" stroke-width="3" paint-order="stroke" stroke-linejoin="round"';
      const textW = String(value).length * fs * 0.6;
      const iconX = align === "left" ? LID_LEFT - 3.3 : LID_RIGHT - textW - 4 - 20 + 3.3;
      const textX = align === "left" ? iconX + 3.3 + 20 + 1 : LID_RIGHT;
      const anchor = align === "left" ? "start" : "end";
      return `<g data-info="${more}"><title>${esc(`${title}: ${value}`)}</title>
      <rect x="${iconX - 2}" y="${y - 12}" width="${textX + (align === "left" ? textW : 0) - iconX + 4}" height="22" fill="transparent"/>
      <path d="${ICONS[icon]}" fill="${iconColor}" fill-rule="evenodd" ${halo} transform="translate(${iconX} ${y - 11}) scale(${20 / 24})"/>
      ${text(textX, y + 4.8, value, `text-anchor="${anchor}" font-size="${fs}" font-weight="700" fill="${color}" stroke="#ffffff" stroke-width="3.6" paint-order="stroke" stroke-linejoin="round"`)}
    </g>`;
    },
    _confirmDialog() {
      if (!this._confirm) return "";
      const t = this._t;
      const q = (this._confirm.on ? t.confirm_off : t.confirm_on).replace("{name}", this._confirm.label);
      const def = CONTROLS.find((c) => c.key === this._confirm.key);
      const accent = this._confirm.key.startsWith("led_ring_") ? "#5a9e32" : "#4a5561";
      const state = (on) => `<svg viewBox="0 0 40 40" width="36" height="36" aria-hidden="true">
        <circle cx="20" cy="20" r="18" fill="${accent}" ${on ? "" : 'fill-opacity=".13" stroke-opacity=".4"'} stroke="${accent}"/>
        ${def ? `<path d="${ICONS[def.icon]}" fill="${on ? "#fff" : accent}" ${on ? "" : 'fill-opacity=".6"'} transform="translate(8 8)"/>` : ""}
      </svg>`;
      const icon = (path, color) => `<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="${path}" fill="${color}"/></svg>`;
      return `<div class="dialog-bg"><div class="dialog" role="dialog" aria-label="${esc(q)}" title="${esc(q)}">
      <div class="change">${state(this._confirm.on)}${icon(ARROW, "#8a96a3")}${state(!this._confirm.on)}</div>
      <div class="name">${esc(this._confirm.label)}</div>
      <div class="buttons">
        <button class="cancel" title="${esc(t.cancel)}" aria-label="${esc(t.cancel)}">${icon(CROSS, "#5b6478")}</button>
        <button class="yes" style="background:${accent}" title="${esc(t.yes)}" aria-label="${esc(t.yes)}">${icon(CHECK, "#fff")}</button>
      </div>
    </div></div>`;
    },
    _toggle(key, label) {
      if (this._config.confirm === false) {
        this._callToggle(key);
        return;
      }
      this._confirm = { key, label, on: this._on(key) };
      this._update();
    },
    _callToggle(key) {
      const id = this._entityId(key);
      if (id) this._hass.callService("switch", "toggle", { entity_id: id });
    },
    _moreInfo(key) {
      const entityId = this._entityId(key);
      if (!entityId) return;
      this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
    }
  };

  // src/methods/panels.js
  var panelsMethods = {
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
        const history2 = (this._state("last_regeneration")?.attributes?.history || []).slice().reverse();
        body = history2.length ? `<ul class="list">${history2.map((h) => {
          const parts = [];
          if (h.capacity_percent != null) parts.push(`${this._number(h.capacity_percent, 0)} %`);
          if (h.capacity_liters != null) parts.push(`(${this._liters(h.capacity_liters)})`);
          return `<li><span>${esc(this._formatDate(h.time))}</span><span class="dim">${parts.length ? esc(t.at_capacity.replace("{v}", parts.join(" "))) : ""}</span></li>`;
        }).join("")}</ul>` : `<div class="empty">${esc(t.no_history)}</div>`;
      } else if (p.kind === "lastregen") {
        title = t.last_regen_title;
        more = "last_regeneration";
        const history2 = this._state("last_regeneration")?.attributes?.history || [];
        const h = history2.length ? history2[history2.length - 1] : null;
        if (!h) body = `<div class="empty">${esc(t.no_history)}</div>`;
        else {
          const rows = [`<li><span>${esc(t.regen_time)}</span><span>${esc(this._formatDate(h.time))}</span></li>`];
          const cap = [];
          if (h.capacity_percent != null) cap.push(`${this._number(h.capacity_percent, 0)} %`);
          if (h.capacity_liters != null) cap.push(`(${this._liters(h.capacity_liters)})`);
          if (cap.length) rows.push(`<li><span>${esc(t.regen_capacity)}</span><span>${esc(cap.join(" "))}</span></li>`);
          const steps = Array.isArray(h.steps) ? h.steps : [];
          if (steps.length) {
            const minutes = Math.round((new Date(h.time) - new Date(steps[0].time)) / 6e4);
            if (minutes > 0 && minutes < 24 * 60) rows.push(`<li><span>${esc(t.regen_duration)}</span><span>${esc(t.minutes.replace("{n}", minutes))}</span></li>`);
          }
          body = `<ul class="list">${rows.join("")}</ul>`;
          body += steps.length ? `<div class="subhead">${esc(t.regen_steps)}</div><ul class="list">${steps.map((st) => `<li><span>${esc(t.phases?.[st.phase] || t.phases?.other || st.phase)}</span><span class="dim">${esc(this._clock(st.time))}</span></li>`).join("")}</ul>` : `<div class="empty">${esc(t.regen_steps_missing)}</div>`;
        }
      } else if (p.kind === "status") {
        title = t.status;
        more = "last_poll";
        const down = this._on("no_data_change");
        const head = down ? `<span class="dot" style="background:#9aa7b3"><svg viewBox="0 0 24 24" width="28" height="28"><path d="${ICONS.cloudOff}" fill="#fff"/></svg></span><span class="big">${esc(t.no_change.replace("{date}", this._formatDate(this._state("no_data_change").attributes.since)))}</span>` : `<span class="dot" style="background:#5a9e32"><svg viewBox="0 0 24 24" width="28" height="28"><path d="M6 12.5 l4.6 4.6 l8 -9.6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span><span class="big">${esc(t.plant_ok)}</span>`;
        const lines = [];
        lines.push(`<li><span>${esc(t.last_poll)}</span><span>${esc(this._formatDate(this._state("last_poll")?.state))}</span></li>`);
        if (this._entityId("data_last_changed")) lines.push(`<li><span>${esc(t.data_changed)}</span><span>${esc(this._formatDate(this._state("data_last_changed")?.state))}</span></li>`);
        body = `<div class="statushead">${head}</div><ul class="list statuslist">${lines.join("")}</ul>`;
        const notes = this._dev?.notifications;
        if (Array.isArray(notes)) {
          body += notes.length ? `<div class="navrow on" data-nav="/config/automation/dashboard">${esc(t.notify_active.replace("{n}", notes.length))}</div>` : `<div class="navrow" data-nav="/config/blueprint/dashboard">${esc(t.notify_none)} ›</div>`;
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
        body = now + (list.length ? `<ul class="list">${list.map((r) => `<li><span>${esc(this._formatDate(r.time))}</span><span class="dim">${esc(t.usage_before_n.replace("{v}", r.kg == null ? "–" : this._kg(r.kg)))}</span></li>`).join("")}</ul>` : `<div class="note"><b>${esc(t.refills_none)}</b><br>${esc(t.refills_none_hint)}</div>`);
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
          body += p.confirm ? `<div class="ask">${esc(t.mark_done_q.replace("{name}", t[kind]))}${kind === "maintenance" && this._entityId("next_inspection") ? `<div class="hint">${esc(t.resets_inspection)}</div>` : ""}</div>
             <div class="buttons"><button class="round cancel-done" title="${esc(t.cancel)}" aria-label="${esc(t.cancel)}">${svgIcon(CROSS, "#5b6478")}</button>
             <button class="round yes-done" style="background:${GREEN}" title="${esc(t.yes)}" aria-label="${esc(t.yes)}">${svgIcon(CHECK, "#fff")}</button></div>` : this._doneButton(kind, days);
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
      const info = more && this._entityId(more) ? `<button class="icon info" title="${esc(t.details)}" aria-label="${esc(t.details)}">${svgIcon(ICONS.info, "#5b6478", 20)}</button>` : "";
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
      const now = /* @__PURE__ */ new Date();
      const lang = this._locale;
      const d = (y2, m2, day, h = 0) => new Date(y2, m2, day, h);
      const y = now.getFullYear();
      const m = now.getMonth();
      if (period === "day") {
        const start = d(y, m, now.getDate());
        const buckets2 = Array.from({ length: 24 }, (_, h) => d(y, m, now.getDate(), h));
        return { start, end: d(y, m, now.getDate() + 1), unit: "hour", buckets: buckets2, labels: buckets2.map((b, h) => h % 6 === 0 ? String(h) : "") };
      }
      if (period === "days") {
        const buckets2 = Array.from({ length: 14 }, (_, i) => d(y, m, now.getDate() - 14 + i));
        const fmt2 = new Intl.DateTimeFormat(lang, { weekday: "short" });
        return {
          start: buckets2[0],
          end: d(y, m, now.getDate()),
          unit: "day",
          buckets: buckets2,
          labels: buckets2.map((b, i) => i % 2 === 1 ? fmt2.format(b).replace(".", "").slice(0, 2) : "")
        };
      }
      if (period === "month") {
        const days = new Date(y, m + 1, 0).getDate();
        const buckets2 = Array.from({ length: days }, (_, i) => d(y, m, i + 1));
        return { start: d(y, m, 1), end: d(y, m + 1, 1), unit: "day", buckets: buckets2, labels: buckets2.map((b, i) => i === 0 || (i + 1) % 5 === 0 ? String(i + 1) : "") };
      }
      if (period === "total") {
        const buckets2 = Array.from({ length: 5 }, (_, i) => d(y - 4 + i, 0, 1));
        return { start: buckets2[0], end: d(y + 1, 0, 1), unit: "month", buckets: buckets2, labels: buckets2.map((b) => String(b.getFullYear())) };
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
            types: [flow ? "max" : "change"]
          });
          const field = flow ? "max" : "change";
          if (p.period === "total") {
            const perYear = /* @__PURE__ */ new Map();
            for (const r of res?.[id] || []) {
              const yr = new Date(r.start).getFullYear();
              if (typeof r[field] === "number") perYear.set(yr, (perYear.get(yr) || 0) + r[field]);
            }
            values = range.buckets.map((b) => perYear.has(b.getFullYear()) ? perYear.get(b.getFullYear()) : null);
          } else {
            const byStart = new Map((res?.[id] || []).map((r) => [new Date(r.start).getTime(), r[field]]));
            values = range.buckets.map((b) => byStart.has(b.getTime()) ? byStart.get(b.getTime()) : null);
          }
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
        const years = range.buckets.map((b) => b.getFullYear());
        const sums = years.map((yr) => {
          let sum = null;
          for (const [day, v] of Object.entries(map)) if (day.startsWith(`${yr}-`) && typeof v === "number") sum = (sum || 0) + v / 1e3;
          return sum;
        });
        const first = Math.max(0, sums.findIndex((v) => v != null));
        range.buckets = range.buckets.slice(first);
        range.labels = range.labels.slice(first);
        return { values: sums.slice(first), labels: range.labels, buckets: range.buckets.map((b) => b.getTime()), end: range.end.getTime(), range: { start: new Date(2e3, 0, 1), end: range.end } };
      }
      const values = range.buckets.map((b, i) => {
        const end = range.buckets[i + 1] || range.end;
        let sum = null;
        for (let d = new Date(b); d < end; d.setDate(d.getDate() + 1)) {
          const v = map[this._iso(d)];
          if (typeof v === "number") sum = (sum || 0) + v / 1e3;
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
          const d = /* @__PURE__ */ new Date(`${day}T12:00:00`);
          if (d < start || d >= end || typeof v !== "number" || typeof water[day] !== "number") continue;
          g += v;
          liters += water[day];
        }
        out[what] = liters > 0 ? g / liters * 1e3 : null;
      }
      out.saltPerLime = out.salt != null && out.lime ? out.salt / out.lime : null;
      return out;
    },
    _ratioList(range, noTotal = false) {
      const t = this._t;
      const r = this._ratios(range.start, range.end);
      const g = (v) => v == null ? "–" : `${this._number(v, 0)} g/m³`;
      const what = this._panel.what;
      const limePerSalt = r.salt ? r.lime / r.salt : null;
      const rows = what === "salt" ? [
        [t.total, !noTotal && this._entityId("salt_total") ? this._fmt("salt_total") : null],
        [t.salt_per_m3, r.salt == null ? null : g(r.salt)],
        [t.salt_per_lime, r.saltPerLime == null ? null : `${this._number(r.saltPerLime, 1)} kg`]
      ] : [
        [t.total, !noTotal && this._entityId("lime_total") ? this._fmt("lime_total") : null],
        [t.lime_per_m3, r.lime == null ? null : g(r.lime)],
        [t.lime_per_salt, limePerSalt == null ? null : `${this._number(limePerSalt, 2)} kg`]
      ];
      const shown = rows.filter(([, v]) => v != null);
      return shown.length ? `<ul class="ratios">${shown.map(([n, v]) => `<li><span>${esc(n)}</span><span>${esc(v)}</span></li>`).join("")}</ul>` : "";
    },
    // "Done" only shortly before the due date (option service_done_days,
    // default 30) or when overdue
    _doneButton(kind, days) {
      const t = this._t;
      const window2 = Number(this._config.service_done_days ?? 30);
      const locked = days != null && days > window2;
      let label = t.mark_done;
      if (locked) {
        const due = this._state(`next_${kind}`)?.state;
        const from = due && /^\d{4}-\d{2}-\d{2}/.test(due) ? /* @__PURE__ */ new Date(`${due.slice(0, 10)}T12:00:00`) : null;
        if (from) {
          from.setDate(from.getDate() - window2);
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
      const nums = (values || []).map((v) => typeof v === "number" && v > 0 ? v : 0);
      const total = nums.reduce((a, b) => a + b, 0);
      if (!values || !values.some((v) => v != null)) return `<div class="chart empty">${esc(t.no_data)}</div>`;
      const fmt = (v) => p.what === "flow" ? `${this._number(v, 1)} L/min` : p.what === "water" ? this._liters(v) : this._kg(v);
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
        const h = (base - top) * v / max;
        const x = i * step + (step - bw) / 2;
        const current = now >= buckets[i] && (i === n - 1 ? now < (p.data.end ?? Infinity) : now < buckets[i + 1]);
        out += `<rect x="${x.toFixed(1)}" y="${(base - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(h, values[i] != null ? 0.5 : 0).toFixed(1)}" rx="1.5" fill="${GREEN}" opacity="${current ? 1 : 0.7}"><title>${esc(`${labels[i] || i + 1}: ${values[i] == null ? "–" : fmt(values[i])}`)}</title></rect>`;
        if (labels[i]) out += `<text x="${(i * step + step / 2).toFixed(1)}" y="${H - 6}" text-anchor="middle" font-size="10" fill="#8a96a3" font-family="${FONT}">${esc(labels[i])}</text>`;
      });
      out += `<text x="0" y="11" font-size="10" fill="#8a96a3" font-family="${FONT}">${esc(t.max_flow)} ${esc(fmt(max))}</text>`;
      return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" width="100%">${out}</svg></div>
      ${p.what === "flow" ? "" : `<div class="sum"><span>${esc(t.sum)}</span><b>${esc(fmt(total))}</b></div>`}`;
    }
  };

  // src/methods/interaction.js
  var interactionMethods = {
    // --- interaction ------------------------------------------------------
    _bind() {
      const root = this.shadowRoot;
      root.querySelectorAll("svg *").forEach((el) => {
        if (!el.querySelector(":scope > title") || el.classList.contains("switch") || el.dataset.more || el.dataset.panel) return;
        if (el.parentElement?.closest("[data-panel], [data-more]")) return;
        el.addEventListener("click", (ev) => {
          ev.stopPropagation();
          this._showTip(el, ev, el.dataset.info);
        });
      });
      root.querySelectorAll("svg [data-panel]").forEach((el) => {
        this._press(el, () => this._openPanel(el.dataset.panel), (ev) => this._showTip(el, ev, el.dataset.info));
      });
      this._bindPanel();
      root.querySelectorAll(".switch").forEach((el) => {
        this._press(el, () => this._toggle(el.dataset.key, el.dataset.label), (ev) => this._showTip(el, ev, el.dataset.key));
      });
      root.querySelectorAll("[data-more]").forEach((el) => {
        if (el.classList.contains("switch")) return;
        this._press(el, () => this._moreInfo(el.dataset.more), (ev) => this._showTip(el, ev, el.dataset.more));
      });
      root.querySelector("ha-card")?.addEventListener("click", () => this._hideTip());
      root.querySelector(".dialog .yes")?.addEventListener("click", () => {
        const key = this._confirm.key;
        this._confirm = null;
        this._callToggle(key);
        this._update();
      });
      root.querySelector(".dialog .cancel")?.addEventListener("click", () => {
        this._confirm = null;
        this._update();
      });
    },
    // Tooltip as a bubble near the finger, with a button for the details
    _showTip(el, ev, more) {
      this._hideTip();
      const title = el.querySelector(":scope > title")?.textContent;
      const card = this.shadowRoot.querySelector("ha-card");
      if (!title || !card) return;
      const tip = document.createElement("div");
      tip.className = "tip";
      tip.setAttribute("role", "tooltip");
      const span = document.createElement("span");
      span.textContent = title;
      tip.appendChild(span);
      if (more && this._entityId(more)) {
        const button = document.createElement("button");
        button.title = this._t.details;
        button.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18"><path d="${ICONS.info}" fill="#fff"/></svg>`;
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          this._hideTip();
          this._moreInfo(more);
        });
        tip.appendChild(button);
      }
      tip.addEventListener("click", (e) => e.stopPropagation());
      card.appendChild(tip);
      const box = card.getBoundingClientRect();
      const x = (ev?.clientX ?? box.left + box.width / 2) - box.left;
      const y = (ev?.clientY ?? box.top + box.height / 2) - box.top;
      const left = Math.max(8, Math.min(box.width - tip.offsetWidth - 8, x - tip.offsetWidth / 2));
      const top = y - tip.offsetHeight - 16 > 8 ? y - tip.offsetHeight - 16 : y + 20;
      tip.style.left = `${left}px`;
      tip.style.top = `${top}px`;
      this._tipTimer = setTimeout(() => this._hideTip(), 5e3);
    },
    _hideTip() {
      clearTimeout(this._tipTimer);
      this.shadowRoot?.querySelectorAll(".tip").forEach((tip) => tip.remove());
    },
    // Tap acts, holding for half a second shows the tooltip
    _press(el, tap, hold) {
      let timer = null;
      let held = false;
      let last = null;
      el.addEventListener("pointerdown", (ev) => {
        held = false;
        last = { clientX: ev.clientX, clientY: ev.clientY };
        timer = setTimeout(() => {
          held = true;
          hold(last);
        }, 500);
      });
      const cancel = () => clearTimeout(timer);
      el.addEventListener("pointerleave", cancel);
      el.addEventListener("pointercancel", cancel);
      el.addEventListener("click", (ev) => {
        ev.stopPropagation();
        cancel();
        if (!held) tap();
      });
      el.addEventListener("contextmenu", (ev) => ev.preventDefault());
    }
  };

  // src/card.js
  var GruenbeckCard = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._config = {};
      this._info = null;
      this._infoTime = 0;
      this._stats = {};
      this._statsTime = 0;
      this._confirm = null;
      this._panel = null;
      this._lastKey = "";
    }
    static getStubConfig() {
      return {};
    }
    static getConfigForm() {
      return getConfigForm();
    }
    setConfig(config) {
      const cleaned = { ...config || {} };
      for (const key of ["language", "device"]) if (cleaned[key] === "") delete cleaned[key];
      this._config = { show_controls: true, confirm: true, ...cleaned };
      this._lastKey = "";
      if (this._hass) this._update();
    }
    set hass(hass) {
      this._hass = hass;
      this._loadInfo();
      this._update();
    }
    getCardSize() {
      return 9;
    }
    getGridOptions() {
      return { columns: 12, min_columns: 6 };
    }
    // --- rendering --------------------------------------------------------
    _update() {
      if (!this._hass) return;
      this._dev = this._device();
      if (this._dev) this._loadStats();
      const ids = this._dev ? Object.values(this._dev.entities).concat(Object.values(this._config.entities || {})) : [];
      const key = JSON.stringify([
        ids.map((id) => {
          const st = this._hass.states[id];
          return st ? [st.state, st.attributes.unit_of_measurement] : null;
        }),
        this._stats,
        this._statsState,
        this._confirm,
        this._panel,
        this._hass.language
      ]);
      if (key === this._lastKey) return;
      this._lastKey = key;
      this._render();
    }
    _render() {
      const t = this._t;
      if (!this._info) {
        this.shadowRoot.innerHTML = `<ha-card></ha-card>`;
        return;
      }
      if (!this._dev) {
        const msg = this._info.length > 1 ? t.choose_device : t.no_device;
        this.shadowRoot.innerHTML = `<ha-card><div style="padding:16px">${esc(msg)}</div></ha-card>`;
        return;
      }
      this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <ha-card class="${this._config.background === "transparent" ? `clear${this._hass.themes?.darkMode ? " dark" : ""}` : ""}">
        <svg viewBox="${-PAD_L} 0 ${VIEW_W + PAD_L} ${VIEW_H}" role="img" aria-label="${esc(this._dev.name)}">
          ${this._svg()}
        </svg>
        ${this._confirmDialog()}
        ${this._panelDialog()}
      </ha-card>`;
      this._bind();
    }
  };
  for (const methods of [dataMethods, pictureMethods, statsMethods, controlsMethods, panelsMethods, interactionMethods]) {
    Object.defineProperties(GruenbeckCard.prototype, Object.getOwnPropertyDescriptors(methods));
  }

  // src/index.js
  if (!customElements.get("gruenbeck-card")) {
    customElements.define("gruenbeck-card", GruenbeckCard);
    window.customCards = window.customCards || [];
    const lang = (navigator.language || "en").startsWith("de") ? "de" : "en";
    window.customCards.push({
      type: "gruenbeck-card",
      name: TEXT[lang].name,
      description: TEXT[lang].description,
      preview: true,
      documentationURL: "https://github.com/sventiffe/gruenbeck_cloud_se"
    });
    console.info(`%c GRUENBECK-CARD %c ${CARD_VERSION} `, "color:#fff;background:#3d8bd6", "color:#3d8bd6;background:#fff");
  }
})();
