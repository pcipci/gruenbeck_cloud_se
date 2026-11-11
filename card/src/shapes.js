/*
 * Fixed pieces of the picture that do not depend on the device state: the
 * SVG definitions (gradients), valve block, housing outline and resin bubbles.
 */
import { DH, VALVE_DX } from "./constants.js";

// Resin bubbles
export const BUBBLES = [[160.7,456.4,1.4,0.41],[139.2,310.5,1.6,0.52],[135.5,345.1,2.0,0.55],[130.7,398.3,2.4,0.56],[203.5,508.0,1.9,0.4],[158.0,513.5,3.0,0.3],[140.0,340.9,1.8,0.42],[180.8,349.1,1.4,0.4],[159.1,429.3,3.0,0.49],[173.5,442.9,2.5,0.27],[211.5,485.9,2.9,0.53],[161.3,385.1,1.6,0.47],[128.8,297.3,1.8,0.31],[156.3,293.4,1.4,0.3],[132.7,375.8,1.4,0.56],[183.2,318.9,1.9,0.37],[158.5,312.1,2.9,0.6],[168.7,407.5,1.6,0.29],[156.5,349.6,2.9,0.31],[124.9,531.1,2.3,0.3],[176.3,286.7,2.3,0.59],[207.9,463.7,1.9,0.38],[139.2,483.7,2.3,0.52],[155.2,338.5,2.8,0.59],[206.8,492.8,2.8,0.51],[145.1,416.5,2.0,0.26],[125.5,353.5,1.9,0.49],[217.1,397.8,3.0,0.6],[216.9,376.0,1.8,0.33],[142.1,333.6,2.5,0.57],[205.6,406.4,2.5,0.53],[131.1,454.3,3.0,0.52],[196.7,406.0,1.7,0.53],[155.5,491.4,3.1,0.39],[162.3,530.0,2.6,0.31],[135.2,319.5,3.0,0.53],[137.1,498.2,3.1,0.48],[157.2,424.7,1.7,0.25],[218.4,451.4,2.3,0.58],[165.5,510.2,2.9,0.32],[147.5,357.0,1.8,0.46],[148.3,390.4,1.7,0.57],[157.6,400.7,2.4,0.57],[164.1,522.3,2.3,0.44],[174.3,284.5,2.2,0.31],[123.1,490.9,1.7,0.42],[194.3,426.8,2.0,0.43],[177.5,487.0,1.6,0.45],[147.2,352.9,2.8,0.43],[178.1,480.6,3.0,0.41],[183.1,413.3,2.3,0.49],[167.3,420.6,2.3,0.58],[191.6,511.4,3.0,0.34],[177.9,529.1,2.9,0.3],[134.7,396.5,1.6,0.33],[129.9,456.7,2.8,0.56],[137.9,469.0,2.5,0.3],[209.7,535.5,1.8,0.58],[162.0,408.4,3.1,0.54],[138.5,393.7,2.3,0.37],[142.0,363.8,2.6,0.26],[177.3,396.1,1.4,0.37],[184.3,415.1,1.6,0.59],[200.4,536.6,1.6,0.34],[126.5,485.6,1.9,0.3],[164.3,520.6,2.8,0.34],[137.5,522.7,2.4,0.5],[131.5,294.8,2.6,0.4],[129.9,527.8,2.5,0.53],[130.9,506.0,1.6,0.55],[167.5,369.2,2.4,0.57],[149.1,313.7,2.3,0.33],[133.5,322.3,1.6,0.32],[153.5,360.3,2.8,0.35],[172.0,326.7,2.0,0.26],[147.3,283.6,2.6,0.44],[141.3,405.1,3.0,0.29],[203.5,393.9,2.3,0.54],[161.5,413.6,2.6,0.59],[156.5,499.7,2.6,0.47],[162.5,371.5,1.6,0.3],[129.6,475.5,1.9,0.31],[131.1,502.1,2.9,0.48],[150.5,343.7,1.9,0.41],[138.3,397.5,1.9,0.59],[218.7,424.3,1.8,0.59],[153.2,373.9,1.4,0.38],[169.5,412.6,1.8,0.43],[123.2,349.5,1.6,0.39],[126.8,285.5,1.9,0.33]];

export const DEFS = `<defs>
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

export const VALVES = `<g transform="translate(${VALVE_DX} 0)"><g fill="#9aa7b3"><rect x="136" y="18" width="30" height="8" rx="3"/><rect x="196" y="18" width="30" height="8" rx="3"/><rect x="146" y="24" width="10" height="32" rx="3"/><rect x="206" y="24" width="10" height="32" rx="3"/><rect x="176" y="30" width="12" height="26" rx="3" fill="#7d8b97"/></g>
<rect x="124" y="48" width="114" height="34" rx="8" fill="url(#pipe)" stroke="#b7c3ce"/>
<rect x="160" y="80" width="18" height="70" fill="url(#pipe)"/><rect x="196" y="80" width="18" height="70" fill="url(#pipe)"/></g>`;

// Outline of the body: straight lid, below it a slight step and a body that
// narrows by taper on each side towards the bottom
export const BODY = (x, lid, taper = 0) => {
  const step = taper ? 1.5 : 0;
  const l = x + step;
  const r = 292 - step;
  const bl = l + taper;
  const br = r - taper;
  return `M${x} 162 Q${x} 144 ${x + 20} 144 H272 Q292 144 292 162 V${lid} H${r} L${br} ${676 + DH} Q${br} ${696 + DH} ${br - 20} ${696 + DH} H${bl + 20} Q${bl} ${696 + DH} ${bl} ${676 + DH} L${l} ${lid} H${x} Z`;
};

// Cabinet from x to 292; wider when the switches sit on the device. The
// gap to the boxes right keeps device and statistics apart
export const CABINET = (x, lid = 222, taper = 0) => `<path d="${BODY(x, lid, taper)}" fill="url(#body)" stroke="#c4cfd9" stroke-width="1.5" filter="url(#shadow)"/>
<path d="M${x} 162 Q${x} 144 ${x + 20} 144 H272 Q292 144 292 162 V${lid} H${x} Z" fill="url(#lid)" stroke="#c4cfd9" stroke-width="1.2"/>
<line x1="${x}" y1="${lid}" x2="292" y2="${lid}" stroke="#cfd8e1"/>
`;
