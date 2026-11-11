/*
 * Shared constants: sizes of the drawing (viewBox), a few colours and the list
 * of control switches. Pure data, no logic, imports nothing.
 *
 * The drawing is 504 wide; all coordinates in the other files refer to this
 * coordinate system (x to the right, y down).
 */
// Set by build.mjs from the manifest of the integration
/* global __CARD_VERSION__ */
export const CARD_VERSION = __CARD_VERSION__;

export const DOMAIN = "gruenbeck_cloud_se";

export const FONT = "Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif";

export const VIEW_W = 504;

// Extra room left of the drawing, so the cabinet has the same margin as
// the statistics on the right
export const PAD_L = 15;

// The housing is 815 mm high and 360 mm wide: the drawing is 95 units taller
// than before, so that it has the proportions of the unit
export const DH = 95;

export const VIEW_H = 704 + DH;

// Valve block centred over the cabinet
export const VALVE_DX = -38;

// Pipe, valve, meter and hardness pills sit this much lower, so the status
// lamps have room above them
export const PIPE_DY = 14;

// Switches in the control panel: entity key, icon, label, y position
export const CONTROLS = [
  { key: "iq_mode", icon: "iq", label: "iq_mode", y: 197.6 },
  { key: "buzzer", icon: "bell", label: "buzzer", y: 252.9 },
  { key: "live_mode", icon: "live", label: "live", y: 308.1 },
  { key: "track_regeneration", icon: "radar", label: "track", y: 363.4 },
  { key: "led_ring_permanent", icon: "ring", label: "permanent", y: 444.6 },
  { key: "led_ring_failure", icon: "failure", label: "failure", y: 499.9 },
  { key: "led_ring_message", icon: "message", label: "message", y: 555.1 },
  { key: "led_ring_flow", icon: "water", label: "led_flow", y: 610.4 },
];

// Green of the softliQ screen
export const GREEN = "#5aa02c";

// Statistic rows: height, value size and the scale of the row pictograms
export const GRID_ROW_H = 38;

export const VALUE_FS = 15;

export const ROW_ICON_SCALE = 1.2;

// Hardness pills
export const PILL_FS = 14.5;

// Status lamps top right
export const LAMP_R = 16.8;

// Right edge of the water meter in the pipe
export const METER_RIGHT = 490;

// Left and right edge of the lid
export const LID_LEFT = 6.75;

export const LID_RIGHT = 291.25;

// Row pictograms in the softliQ look, and the background inside outlines
export const ROW_GREY = "#56616d";

export const ROW_BG = "#d9e2eb";

// Last regeneration pictogram scale
export const LAST_SCALE = 1.12;

export const LAMP_CY = 29;
