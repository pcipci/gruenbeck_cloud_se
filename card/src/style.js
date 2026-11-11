/*
 * The CSS of the card (STYLE) as one string, inserted into the shadow DOM.
 * Includes the dark variant used with the transparent background.
 */
import { FONT } from "./constants.js";

export const STYLE = `
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
