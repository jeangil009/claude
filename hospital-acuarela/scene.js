// scene.js — "Cómo nace un hospital": timeline, geometry, painted groups and the five sheets
const GY = 860, FH = 130;                                   // ground line and floor height of the elevation
const BL = [{ x0: 320, x1: 580, n: 2, id: 'L' }, { x0: 580, x1: 1340, n: 4, id: 'M' }, { x0: 1340, x1: 1580, n: 2, id: 'R' }];
const COLX = [580, 770, 960, 1150, 1340];
const VERM = '#c8442a';
const C = { wall: '#e2d0b0', wallW: '#d8cdb4', shade: '#c4ae88', slab: '#8d8374', conc: '#a9a79f', concD: '#7e7b74', rust: '#a4532e', win: '#a9bccb', winD: '#5f7486',
  roof: '#8a7f72', trunk: '#6b4f3a', soil1: '#8a6a4a', soil2: '#c48a62', soil3: '#b9a98a', rock: '#8a98a6', water: '#3f7fa8', power: '#d19a2e', oxy: '#5f9a6a', air: '#8fa4b0', lit: '#efc46a', crane: '#c99a3b' };

// ---------- timeline (seconds) ----------
const T = {
  mist: [1.0, 3.333], flag: [3.333, 3.9], tape: [4.3, 5.6], ghost: [4.8, 6.6], noteLote: 5.0,
  slideB: [7.4, 8.4], soil: [8.5, 11.8], core: [9.0, 10.6], pit: [10.2, 12.3], pad: [15.0, 16.4], rebar: [15.8, 17.3], pour: [17.0, 18.7],
  slideC: [18.7, 19.7], floors: [[19.5, 20.83], [20.9, 22.5], [22.6, 24.17], [24.2, 25.83]], tower: [19.8, 24.0], jib: [24.0, 25.2], load: [25.0, 25.7],
  walls: [25.9, 28.2], wins: [27.2, 28.6], roof: [27.8, 28.7], trees: [27.9, 28.8], crane_out: [28.0, 28.8], xray: [28.8, 30.3],
  nets: { water: 30.5, power: 31.2, oxy: 32.0, air: 32.65 }, netDur: 1.0,
  slideD: [34.4, 35.4], mistD: [40.4, 42.0], dusk: [41.0, 43.3], lamp: 43.33, win1: 44.17, burst: [45.83, 46.7], fade: [47.3, 49.4], last: [48.8, 49.3],
};
const VO = [   // id, start, dur, subtitle text
  ['v01', 1.0, 3.704, 'Antes de cuidar a nadie, un hospital es solo un terreno vacío.'],
  ['v02', 8.0, 4.251, 'Primero se estudia el suelo, y se excava hasta encontrar terreno firme.'],
  ['v03', 17.0, 5.155, 'Sobre esa base se levanta el esqueleto: columnas, vigas y losas, piso por piso.'],
  ['v04', 26.6, 6.711, 'Después se cierran los muros. Y por dentro corre lo invisible: agua, electricidad, oxígeno y aire limpio.'],
  ['v05', 38.0, 2.979, 'Al final llegan los pisos, las camas, los equipos.'],
  ['v06', 42.4, 4.638, 'Cuando se enciende la primera luz, la obra termina. Y empieza lo importante.'],
];
const STAGES = [[4.0, 7.6, '01', 'Terreno'], [8.6, 18.4, '02', 'Cimentación'], [19.8, 28.6, '03', 'Estructura'], [29.4, 33.4, '04', 'Instalaciones'], [36.6, 40.9, '05', 'Acabados'], [43.4, 48.4, '06', 'Puesta en marcha']];
const BARS = 72 / 60;  // beats per second
const BEAT = 60 / 72, BAR = BEAT * 4;

// ---------- cameras ----------
const camA = t => ({ cx: lerp(960, 1110, eio(seg(t, 3.2, 8.2))), cy: 540, z: 1 });
const CBz = monotone([[7.4, 1], [14.6, 1], [18.7, 1.5]]), CBx = monotone([[7.4, 960], [18.7, 975]]), CBy = monotone([[7.4, 540], [11.8, 540], [14.6, 730], [18.7, 745]]);
const camB = t => ({ cx: CBx(t), cy: CBy(t), z: CBz(t) });
const CCz = monotone([[18.6, 1.55], [25.4, 1.55], [28.8, 1.02], [31, 1.22], [34.6, 1.3]]);
const CCx = monotone([[18.6, 1130], [25.4, 1130], [28.8, 900], [34.6, 1060]]);
const CCy = monotone([[18.6, 598], [25.2, 448], [28.8, 560], [34.6, 600]]);
const camC = t => ({ cx: CCx(t), cy: CCy(t), z: CCz(t) });
const WINF = { f: 2, i: 5 };                                // the window that stays lit to the end
const wcx = i => 635 + 90 * i, wfy = f => GY - FH * (f + 1) + 30;
const CEz = monotone([[40.4, 1.4], [44.8, 1.0], [47.0, 1.0], [49.4, 3.8]]);
const CEx = monotone([[40.4, 1230], [44.8, 960], [47.0, 960], [49.4, wcx(5)]]);
const CEy = monotone([[40.4, 520], [44.8, 570], [47.0, 570], [49.4, wfy(2) + 30]]);
const camE = t => ({ cx: CEx(t), cy: CEy(t), z: CEz(t) });

let CAM = { cx: 960, cy: 540, z: 1 };
function useCam(c, cam) { CAM = cam; c.translate(W / 2, H / 2); c.scale(cam.z, cam.z); c.translate(-cam.cx, -cam.cy); }
const W2S = (x, y) => [W / 2 + (x - CAM.cx) * CAM.z, H / 2 + (y - CAM.cy) * CAM.z];

// ---------- groups ----------
const G = {}, B = {}, R = {}, WINS = [];
function addTree(g, x, s) {
  const h = 150 * s, S = [];
  const tr = mk(qcurve(x, GY + 2, x + rnd(-5, 5), GY - h * .6, rnd(-6, 6), 8), 15 * s, C.trunk, { prof: 'trunk', nb: 3, a: .9 }); gadd(g, St(tr)); gadd(g, St(edgeOf(tr, 1, 3, INK2, .7)));
  for (const [dx, dy, r] of [[0, .86, 62], [-30, .7, 44], [34, .72, 46], [4, 1.05, 40]]) clump(S, x + dx * s, GY - h * dy, r * s, 46, ['#8ea860', '#6f8d5a', '#4e6e3c', '#a7b48e'], { sx: 1.1, sy: .9, l0: 10, l1: 22, w0: 7, w1: 13, a0: .7, a1: .95 });
  S.forEach(s2 => gadd(g, St(s2)));
}
function addWindow(g, cx, y0, w, h, lit) {
  const x0 = cx - w / 2, x1 = cx + w / 2;
  gadd(g, Wash(wobRect(x0, y0, x1, y0 + h, 1.5, 22), mixc(C.win, '#d9e3ea', rnd(0, .35)), .88, { j: 1.4 }));
  rectOutline(g, x0, y0, x1, y0 + h, 3, INK2, { a: .7 });
  seg2(g, cx, y0 + 3, cx, y0 + h - 3, 2.4, INK2, { a: .55 });
  seg2(g, x0 - 3, y0 + h + 3, x1 + 3, y0 + h + 3, 4, C.slab, { a: .75 });
}

function buildElev() {
  // sky: morning and dusk, clouds, hills, ground
  G.skyM = Grp(); gadd(G.skyM, Wash(wobRect(-500, -400, 2600, 850, 16, 160), '#dfe3dc', .62, { dir: 'y', j: 6 })); for (const [yb, a] of [[360, .22], [520, .18], [680, .14]]) gadd(G.skyM, Wash(wobRect(-500, -400, 2600, yb, 16, 160), '#c6d4da', a, { dir: 'y', j: 10 }));
  for (const [cx, cy, rx, ry] of [[420, 190, 190, 36], [1300, 120, 230, 40], [1760, 260, 150, 30], [820, 300, 120, 24]]) gadd(G.skyM, Wash(blob(cx, cy, rx, ry, 16, .2), '#cfd8d9', .5, { j: 5 }));
  G.skyD = Grp(); gadd(G.skyD, Wash(wobRect(-500, 240, 2600, 850, 16, 160), '#ecd0b0', .66, { dir: 'y', j: 6 })); gadd(G.skyD, Wash(wobRect(-500, -400, 2600, 560, 16, 160), '#c5a9b3', .55, { dir: 'y', j: 8 })); gadd(G.skyD, Wash(wobRect(-500, -400, 2600, 300, 16, 160), '#8d93ad', .45, { dir: 'y', j: 8 }));
  for (const [cx, cy, rx, ry] of [[480, 260, 200, 30], [1400, 180, 240, 34], [1800, 330, 140, 26]]) gadd(G.skyD, Wash(blob(cx, cy, rx, ry, 16, .2), '#b79aa5', .45, { j: 5 }));
  G.far = Grp([Wash(bandPoly(-500, 2600, 770, 880, 34, .004, 1), '#b9c3b0', .55, { j: 3 })]);
  G.mid = Grp([Wash(bandPoly(-500, 2600, 812, 880, 18, .007, 2), '#a8b698', .55, { j: 3 })]);
  G.ground = Grp(); gadd(G.ground, Wash(bandPoly(-500, 2600, 858, 1500, 3, .02, 0), '#d8ca98', .72, { j: 3 }));
  for (let i = 0; i < 7; i++) { const y = 880 + i * 70 + rnd(-6, 6); gadd(G.ground, St(mk(qcurve(-300, y, 2500, y + rnd(-8, 8), rnd(-14, 14), 12), 40, '#c9bb86', { prof: 'even', nb: 5, a: .3, rough: .25 }))); }
  gadd(G.ground, Wash([[1400, 862], [1560, 862], [1760, 1100], [1230, 1100]], '#eadfc4', .65, { j: 3 }));
  for (let i = 0; i < 80; i++) { const x = rnd(-300, 2400), y = 866 + rnd(0, 16), h2 = rnd(10, 24); seg2(G.ground, x, y, x + rnd(-6, 6), y - h2, 3.2, pick(['#8ea860', '#a7b48e', '#6f8d5a']), { prof: 'tip', a: .8, bend: rnd(-4, 4) }); }
  // walls, floor lines, windows
  G.walls = Grp(); G.wins = Grp(); G.roof = Grp(); G.canopy = Grp(); G.door = Grp(); G.lampOff = Grp(); G.lampOn = Grp();
  for (let f = 0; f < 4; f++) for (const b of BL) {
    if (f >= b.n) continue;
    const y1 = GY - FH * f, y0 = y1 - FH, col = b.id === 'M' ? C.wall : C.wallW;
    gadd(G.walls, Wash(wobRect(b.x0, y0, b.x1, y1, 2.5, 80), col, .82, { j: 2 }));
    hatch(G.walls, b.x0 + 2, y0 + 3, b.x1 - 2, y1 - 3, mixc(col, '#fff6e0', .4), { w: 26, a: .6 }); hatch(G.walls, b.x0 + 2, y0 + 6, b.x1 - 2, y1 - 6, mixc(col, C.shade, .5), { w: 34, a: .3, nb: 3 });
    gadd(G.walls, Wash(wobRect(b.x1 - 46, y0, b.x1, y1, 2, 20), C.shade, .4, { j: 2 }));
    seg2(G.walls, b.x0 - 4, y0, b.x1 + 4, y0, 5, C.slab, { a: .8 });
  }
  seg2(G.walls, 300, GY, 1600, GY, 6, C.slab, { a: .85, bend: 2 });
  for (let f = 0; f < 4; f++) for (const b of BL) {
    if (f >= b.n) continue;
    const y0 = GY - FH * (f + 1) + 30, w = 52, h = 58;
    let cxs = [];
    if (b.id === 'M') cxs = [0, 1, 2, 3, 4, 5, 6, 7].map(wcx);
    else if (b.id === 'L') cxs = [372, 450, 528];
    else if (f === 1) cxs = [1385, 1460, 1535];
    for (const cx of cxs) { addWindow(G.wins, cx, y0, w, h); WINS.push({ f, cx, y0, w, h, b: b.id, i: b.id === 'M' ? Math.round((cx - 635) / 90) : -1 }); }
  }
  // right wing ground floor: glazed entrance hall
  gadd(G.door, Wash(wobRect(1380, 750, 1560, 860, 1.5, 30), C.win, .8, { j: 1.5 })); for (let x = 1380; x <= 1560; x += 45) seg2(G.door, x, 750, x, 860, 3, INK2, { a: .6 });
  gadd(G.door, Wash(wobRect(1448, 770, 1496, 860, 1.5, 30), C.winD, .6, { j: 1.4 })); rectOutline(G.door, 1380, 750, 1560, 860, 3.4, INK2, { a: .7 });
  for (const cx of [372, 450, 528]) addWindow(G.door, cx, GY - 90, 52, 58);                 // left wing ground floor windows
  // roof and canopy
  gadd(G.roof, Wash(wobRect(570, 326, 1350, 348, 2, 60), C.roof, .85, { j: 1.5 })); seg2(G.roof, 566, 326, 1354, 326, 5, INK2, { a: .8 });
  gadd(G.roof, Wash(wobRect(985, 282, 1110, 326, 2, 30), '#a79e90', .85, { j: 1.5 })); rectOutline(G.roof, 985, 282, 1110, 326, 3, INK2, { a: .7 });
  seg2(G.roof, 1060, 282, 1060, 236, 3, INK2, { a: .8 }); seg2(G.roof, 1060, 250, 1078, 262, 2.2, INK2, { a: .6, bend: 0 });
  gadd(G.roof, Wash(wobRect(310, 592, 590, 608, 2, 60), C.roof, .85, { j: 1.5 })); gadd(G.roof, Wash(wobRect(1330, 592, 1590, 608, 2, 60), C.roof, .85, { j: 1.5 }));
  seg2(G.roof, 306, 592, 594, 592, 4.5, INK2, { a: .8 }); seg2(G.roof, 1326, 592, 1594, 592, 4.5, INK2, { a: .8 });
  gadd(G.canopy, Wash(wobRect(1368, 706, 1574, 726, 2, 40), C.slab, .88, { j: 1.5 })); seg2(G.canopy, 1364, 726, 1578, 726, 5, INK2, { a: .8 });
  for (const x of [1384, 1558]) line(G.canopy, qcurve(x, 726, x, 860, 0, 6), 11, C.conc, { nb: 3, a: .9 });
  seg2(G.lampOff, 1470, 726, 1470, 738, 3, INK2, { a: .85 }); gadd(G.lampOff, Wash(blob(1470, 746, 8, 8, 10, .1), '#6b4f3a', .9, { j: 1 }));
  gadd(G.lampOn, Wash(blob(1470, 746, 34, 34, 14, .1), '#e8795a', .26, { j: 3 })); gadd(G.lampOn, Wash(blob(1470, 746, 10, 10, 10, .1), VERM, .98, { j: 1 }));
  // trees and shrubs (left and right of the building)
  G.treesL = Grp(); G.treesR = Grp();
  addTree(G.treesL, 215, 1.05); addTree(G.treesL, 120, .8); addTree(G.treesR, 1700, 1.1); addTree(G.treesR, 1810, .85);
  G.shrubs = Grp(); for (let x = 600; x < 1340; x += 44) { const S = []; clump(S, x + rnd(-8, 8), GY - 12, 17, 18, ['#8ea860', '#6f8d5a', '#4e6e3c'], { sx: 1.4, sy: .7, l0: 8, l1: 16, w0: 6, w1: 11 }); S.forEach(s => gadd(G.shrubs, St(s))); }
  for (const x of [330, 520, 1400, 1560]) { const S = []; clump(S, x, GY - 10, 16, 16, ['#8ea860', '#6f8d5a', '#4e6e3c'], { sx: 1.4, sy: .7, l0: 8, l1: 16, w0: 6, w1: 11 }); S.forEach(s => gadd(G.shrubs, St(s))); }
  // lit windows (one group each); the first one is the one that stays on
  for (const w of WINS) w.lit = Grp([Wash(wobRect(w.cx - w.w / 2 - 9, w.y0 - 7, w.cx + w.w / 2 + 9, w.y0 + w.h + 7, 3, 20), '#f2d79a', .38, { j: 3 }), Wash(wobRect(w.cx - w.w / 2 + 2, w.y0 + 2, w.cx + w.w / 2 - 2, w.y0 + w.h - 2, 2, 20), C.lit, .92, { j: 1.5 })]);
  for (const w of WINS) w.at = (w.b === 'M' && w.f === WINF.f && w.i === WINF.i) ? T.win1 : T.burst[0] + rnd(0, .8) * (T.burst[1] - T.burst[0]) / .8;
  // lot: stakes, flag, tape, ghost outline
  G.flag = Grp(); const st = mk(qcurve(1470, GY + 6, 1470, GY - 76, 0, 6), 8, C.trunk, { prof: 'tip', nb: 2, a: .92 }); gadd(G.flag, St(st));
  gadd(G.flag, Wash([[1472, GY - 76], [1536, GY - 66], [1520, GY - 52], [1538, GY - 40], [1472, GY - 48]], VERM, .95, { j: 1.6 }));
  line(G.flag, qcurve(1474, GY - 72, 1532, GY - 62, 3, 6), 10, VERM, { nb: 3, a: .8 });
  G.tape = Grp();
  for (const x of [520, 790, 1050, 1250]) { line(G.tape, qcurve(x, GY + 8, x, GY - 34, 0, 5), 6, C.trunk, { prof: 'tip', nb: 0, a: .9 }); gadd(G.tape, Wash(blob(x + 1, GY - 38, 5, 5, 8, .1), '#d9a441', .9, { j: 1 })); }
  const tp = [[520, GY - 30], [790, GY - 28], [1050, GY - 31], [1250, GY - 29], [1470, GY - 33]];
  for (let i = 0; i < tp.length - 1; i++) line(G.tape, qcurve(tp[i][0], tp[i][1], tp[i + 1][0], tp[i + 1][1], rnd(-4, 4), 8), 2.4, INK2, { a: .6 });
  G.ghost = Grp(); const path = [[580, GY], [580, 340], [1340, 340], [1340, GY]];
  for (let i = 0; i < path.length - 1; i++) { const [ax, ay] = path[i], [bx, by] = path[i + 1], L = Math.hypot(bx - ax, by - ay), n = Math.round(L / 62); for (let k = 0; k < n; k++) { const a0 = k / n, a1 = a0 + .62 / n; seg2(G.ghost, lerp(ax, bx, a0), lerp(ay, by, a0), lerp(ax, bx, a1), lerp(ay, by, a1), 3.4, C.slab, { a: .55 }); } }
  // structure, per floor (columns, bracing, slab)
  G.floors = [];
  for (let f = 0; f < 4; f++) {
    const g = Grp(), y1 = GY - FH * f, y0 = y1 - FH; G.floors.push(g);
    const cols = [...COLX]; if (f < 2) cols.push(320, 450, 1460, 1580);
    for (const x of cols) { const s = mk(qcurve(x, y1, x + rnd(-1, 1), y0, 0, 6), 22, C.conc, { prof: 'even', nb: 4, a: .9, rough: .12 }); gadd(g, St(s)); gadd(g, St(edgeOf(s, 1, 3, INK2, .6))); }
    const bays = []; for (let i = 0; i < 4; i++) bays.push([COLX[i], COLX[i + 1]]); if (f < 2) { bays.push([320, 450], [450, 580], [1340, 1460], [1460, 1580]); }
    for (const [a, b] of bays) { seg2(g, a + 10, y1 - 4, b - 10, y0 + 6, 3, C.crane, { a: .55 }); seg2(g, b - 10, y1 - 4, a + 10, y0 + 6, 3, C.crane, { a: .55 }); }
    const sp = f < 2 ? [310, 1590] : [570, 1350];
    gadd(g, Wash(wobRect(570, y0 - 8, 1350, y0 + 8, 1.5, 50), '#b8b2a4', .88, { j: 1.4 })); seg2(g, 566, y0 + 8, 1354, y0 + 8, 5, INK2, { a: .7 });
    if (f < 2) { gadd(g, Wash(wobRect(310, y0 - 8, 580, y0 + 8, 1.5, 50), '#b8b2a4', .88, { j: 1.4 })); gadd(g, Wash(wobRect(1340, y0 - 8, 1590, y0 + 8, 1.5, 50), '#b8b2a4', .88, { j: 1.4 })); seg2(g, 306, y0 + 8, 584, y0 + 8, 5, INK2, { a: .7 }); seg2(g, 1336, y0 + 8, 1594, y0 + 8, 5, INK2, { a: .7 }); }
  }
  G.slab0 = Grp(); gadd(G.slab0, Wash(wobRect(300, GY - 6, 1600, GY + 8, 2, 60), '#b8b2a4', .85, { j: 1.4 }));
  // crane: tower, jib, load
  G.tower = Grp(); G.jib = Grp(); G.load = Grp();
  const tx0 = 1640, tx1 = 1672, top = 140;
  gadd(G.tower, Wash(wobRect(1618, GY - 8, 1694, GY + 10, 2, 30), C.slab, .85, { j: 1.4 }));
  for (const x of [tx0, tx1]) { const s = mk(qcurve(x, GY, x, top, 0, 14), 7, C.crane, { prof: 'even', nb: 2, a: .9, rough: .1 }); gadd(G.tower, St(s)); }
  for (let y = GY; y > top + 40; y -= 40) { seg2(G.tower, tx0, y, tx1, y - 40, 3, C.crane, { a: .8, bend: 0 }); seg2(G.tower, tx1, y, tx0, y - 40, 3, C.crane, { a: .55, bend: 0 }); }
  gadd(G.tower, Wash(wobRect(1632, top - 22, 1680, top + 8, 1.5, 20), '#b9893a', .9, { j: 1.4 }));
  const jy = top + 14;
  line(G.jib, qcurve(1656, jy, 960, jy, 0, 16), 6, C.crane, { a: .9, rough: .1 }); line(G.jib, qcurve(1656, jy + 22, 960, jy + 22, 0, 16), 5, C.crane, { a: .8, rough: .1 });
  for (let x = 1656; x > 990; x -= 44) { seg2(G.jib, x, jy, x - 22, jy + 22, 2.6, C.crane, { a: .75, bend: 0 }); seg2(G.jib, x - 22, jy + 22, x - 44, jy, 2.6, C.crane, { a: .75, bend: 0 }); }
  line(G.jib, qcurve(1656, jy, 1800, jy, 0, 6), 6, C.crane, { a: .9, rough: .1 }); gadd(G.jib, Wash(wobRect(1740, jy + 2, 1804, jy + 40, 2, 20), C.slab, .88, { j: 1.5 }));
  seg2(G.jib, 1656, top - 10, 960, jy, 2.4, INK2, { a: .5, bend: 0 }); seg2(G.jib, 1656, top - 10, 1800, jy, 2.4, INK2, { a: .5, bend: 0 });
  gadd(G.jib, Wash(wobRect(1090, jy + 22, 1124, jy + 36, 1.5, 12), '#b9893a', .9, { j: 1 }));
  seg2(G.load, 1107, jy + 36, 1107, 400, 2.4, INK2, { a: .8, bend: 0 }); gadd(G.load, Wash(wobRect(1062, 400, 1152, 424, 1.5, 20), '#a9a79f', .92, { j: 1.4 })); rectOutline(G.load, 1062, 400, 1152, 424, 3, INK2, { a: .75 });
  seg2(G.load, 1107, 392, 1072, 400, 2, INK2, { a: .7, bend: 0 }); seg2(G.load, 1107, 392, 1142, 400, 2, INK2, { a: .7, bend: 0 });
  // interior (x-ray): rooms, partitions, shaft; nets
  G.int = Grp();
  for (let f = 0; f < 4; f++) for (const b of BL) {
    if (f >= b.n) continue;
    const y1 = GY - FH * f, y0 = y1 - FH, nr = b.id === 'M' ? 5 : 2, rw = (b.x1 - b.x0) / nr;
    for (let r = 0; r < nr; r++) gadd(G.int, Wash(wobRect(b.x0 + r * rw + 3, y0 + 12, b.x0 + (r + 1) * rw - 3, y1 - 4, 1.5, 40), r % 2 ? '#ece4d2' : '#ddd5c0', .78, { j: 1.5 }));
    for (let r = 1; r < nr; r++) seg2(G.int, b.x0 + r * rw, y0 + 10, b.x0 + r * rw, y1 - 2, 4.5, INK2, { a: .72 });
    if (b.id === 'M') for (let r = 0; r < nr; r++) { const bx = b.x0 + r * rw + 28; if ((f + r) % 2 === 0) { gadd(G.int, Wash(wobRect(bx, y1 - 30, bx + 78, y1 - 16, 1, 20), '#f4eddc', .9, { j: 1 })); rectOutline(G.int, bx, y1 - 30, bx + 78, y1 - 16, 2.4, INK2, { a: .6 }); seg2(G.int, bx, y1 - 44, bx, y1 - 14, 3, INK2, { a: .6 }); } }
  }
  for (const x of [860, 900]) seg2(G.int, x, GY - FH * 4 + 8, x, GY, 3.4, INK2, { a: .7 });
  gadd(G.int, Wash(wobRect(866, GY - FH * 3 + 24, 894, GY - FH * 3 + 86, 1, 12), C.shade, .8, { j: 1 }));
  for (const x of [COLX[0] + 0]) { }
  G.nets = {};
  const NX = { water: [620, 1320], oxy: [640, 1310], power: [1300, 600], air: [1320, 600] };
  const mkNet = (key, col, w, off, riserX, o = {}) => {
    const g = Grp(); G.nets[key] = g;
    line(g, qcurve(riserX, GY - 4, riserX, GY - FH * 4 + 14, 0, 14), w, col, { a: .9, nb: o.nb ?? 2, rough: .12 });
    for (let f = 0; f < 4; f++) {
      const y = GY - FH * (f + 1) + off, xa = riserX, xb = key === 'water' || key === 'oxy' ? 1280 - (key === 'oxy' ? 10 : 0) : 650 + (key === 'air' ? 10 : 0);
      let pts = [[xa, y]]; const n = 22; for (let k = 1; k <= n; k++) pts.push([lerp(xa, xb, k / n), y + (key === 'power' ? (k % 2 ? -3.2 : 3.2) : 0)]);
      line(g, pts, w, col, { a: .85, nb: o.nb ?? 2, rough: .1 });
      const nr = 5; for (let r = 0; r < nr; r++) {
        const x = 580 + (r + .5) * 152 + (key === 'oxy' ? 24 : key === 'power' ? -28 : key === 'water' ? -10 : 0);
        if (key === 'water') { seg2(g, x, y, x, y + 14, 3, col, { a: .85 }); gadd(g, Wash(blob(x, y + 20, 5, 7, 8, .1), col, .9, { j: .8 })); }
        else if (key === 'power') { gadd(g, Wash(wobRect(x - 6, y + 4, x + 6, y + 16, .8, 8), col, .95, { j: .8 })); }
        else if (key === 'oxy') { seg2(g, x, y, x, y + 18, 3, col, { a: .85 }); gadd(g, Wash(blob(x, y + 23, 6, 6, 8, .1), col, .92, { j: .8 })); }
        else { seg2(g, x - 10, y + 12, x - 3, y + 18, 2.6, col, { a: .8, bend: 0 }); seg2(g, x + 10, y + 12, x + 3, y + 18, 2.6, col, { a: .8, bend: 0 }); seg2(g, x - 3, y + 18, x + 3, y + 18, 2.6, col, { a: .8, bend: 0 }); }
      }
    }
  };
  mkNet('air', C.air, 16, 24, 1320, { nb: 5 }); mkNet('power', C.power, 4.5, 46, 1300, { nb: 0 }); mkNet('water', C.water, 6, 66, 620); mkNet('oxy', C.oxy, 6, 88, 640);
}

function buildSection() {
  const SY = 380;
  B.sky = Grp([Wash(wobRect(-500, -300, 2600, SY + 6, 8, 160), '#e3e6de', .5, { dir: 'y', j: 5 })]);
  B.bands = [];
  const defs = [[SY, 455, C.soil1, .82, 8], [455, 645, C.soil2, .82, 10], [645, 835, C.soil3, .85, 12], [835, 1700, C.rock, .85, 12]];
  defs.forEach(([ya, yb, col, a, amp], k) => {
    const g = Grp(); gadd(g, Wash(bandPoly(-500, 2600, ya, yb + 14, amp, .008, k * 1.3), col, a, { j: 3, dir: 'x' })); B.bands.push(g);
    if (k === 0) for (let i = 0; i < 40; i++) { const x = rnd(-300, 2400), y = rnd(SY + 12, 440); seg2(g, x, y, x + rnd(10, 26), y + rnd(-3, 3), 3, '#5c4630', { a: .55 }); }
    if (k === 1) for (let i = 0; i < 26; i++) { const x = rnd(-300, 2400), y = rnd(470, 630); seg2(g, x, y, x + rnd(40, 110), y + rnd(-8, 8), 4, '#a8704a', { a: .4, bend: rnd(-8, 8) }); }
    if (k === 2) for (let i = 0; i < 150; i++) { const x = rnd(-300, 2400), y = rnd(660, 830), r = rnd(3, 8); gadd(g, Wash(blob(x, y, r, r * .75, 7, .25), pick(['#8d8374', '#d6c7a8', '#a79d88']), .8, { j: .8 })); }
    if (k === 3) for (let i = 0; i < 22; i++) { const x = rnd(-300, 2400), y = rnd(860, 1300); seg2(g, x, y, x + rnd(-60, 60), y + rnd(30, 90), 3, '#6c7a88', { a: .55, bend: rnd(-10, 10) }); }
  });
  B.pit = Grp(); gadd(B.pit, Wash([[520, SY - 2], [1400, SY - 2], [1330, 850], [590, 850]], PAPERC, 1, { j: 3, dir: 'y' }));
  seg2(B.pit, 520, SY, 592, 850, 6, INK2, { a: .85, bend: -6 }); seg2(B.pit, 1400, SY, 1328, 850, 6, INK2, { a: .85, bend: 6 }); seg2(B.pit, 590, 851, 1330, 851, 6, INK2, { a: .85, bend: 2 });
  gadd(B.pit, Wash(blob(1520, SY - 14, 110, 34, 14, .14), C.soil1, .85, { j: 3 })); for (let i = 0; i < 14; i++) seg2(B.pit, rnd(1430, 1600), SY - rnd(4, 30), rnd(1430, 1600), SY - rnd(4, 30), 5, '#5c4630', { a: .5 });
  B.flag = Grp(); const st = mk(qcurve(1700, SY + 10, 1700, SY - 70, 0, 6), 7, C.trunk, { prof: 'tip', nb: 2, a: .92 }); gadd(B.flag, St(st));
  gadd(B.flag, Wash([[1702, SY - 70], [1760, SY - 60], [1744, SY - 47], [1762, SY - 36], [1702, SY - 42]], VERM, .95, { j: 1.6 }));
  B.grass = Grp(); for (let i = 0; i < 70; i++) { const x = rnd(-300, 2400); if (x > 500 && x < 1420) continue; const y = SY + rnd(-2, 4); seg2(B.grass, x, y, x + rnd(-6, 6), y - rnd(10, 24), 3.2, pick(['#8ea860', '#a7b48e', '#6f8d5a']), { prof: 'tip', a: .8, bend: rnd(-4, 4) }); }
  // core sample specimen
  B.core = Grp(); const cx0 = 1690, cx1 = 1752, cy0 = 470;
  [[470, 502, C.soil1], [502, 592, C.soil2], [592, 682, C.soil3], [682, 800, C.rock]].forEach(([ya, yb, col]) => gadd(B.core, Wash(wobRect(cx0, ya, cx1, yb, 1.5, 30), col, .88, { j: 1.4, dir: 'y' })));
  rectOutline(B.core, cx0, cy0, cx1, 800, 3.4, INK2, { a: .8 }); for (let y = 470; y <= 800; y += 33) seg2(B.core, cx1 + 4, y, cx1 + 16, y, 2.4, INK2, { a: .7, bend: 0 });
  B.foot = Grp(); B.rebar = Grp(); B.pour = Grp();
  for (const x of COLX) {
    gadd(B.foot, Wash(wobRect(x - 64, 820, x + 64, 850, 1.5, 30), C.conc, .9, { j: 1.4 })); rectOutline(B.foot, x - 64, 820, x + 64, 850, 3, INK2, { a: .7 });
    for (const y of [828, 836, 844]) seg2(B.rebar, x - 58, y, x + 58, y, 2.6, C.rust, { a: .85, bend: 0 });
    for (const dx of [-36, -12, 12, 36]) seg2(B.rebar, x + dx, 822, x + dx + rnd(-2, 2), 690, 3.4, C.rust, { a: .9, bend: 0 });
    for (const y of [760, 720, 690]) rectOutline(B.rebar, x - 38, y, x + 38, y + 8, 2.2, C.rust, { a: .75 });
    gadd(B.pour, Wash(wobRect(x - 30, 700, x + 30, 822, 1.5, 30), '#9aa6ad', .8, { j: 1.4, dir: 'u' })); gadd(B.pour, Wash(wobRect(x - 66, 818, x + 66, 852, 1.5, 30), '#9aa6ad', .5, { j: 1.4, dir: 'u' }));
    for (const dx of [-26, 20]) seg2(B.pour, x + dx, 814, x + dx, 836, 3, '#8794a0', { a: .6, bend: 0 });
  }
}

function buildRoom() {
  R.wall = Grp([Wash(wobRect(330, 170, 1590, 760, 3, 90), '#d0d8c8', .78, { j: 2.4, dir: 'y' })]); hatch(R.wall, 336, 176, 1584, 754, '#d7dfd0', { w: 46, a: .35, nb: 4 });
  R.floor = Grp([Wash([[330, 750], [1590, 750], [1720, 1010], [200, 1010]], '#cdb592', .8, { j: 2.4, dir: 'y' })]);
  for (let i = 0; i < 9; i++) { const x = 330 + i * 157; seg2(R.floor, lerp(x, 200 + i * 190, 0), 752, 200 + i * 190, 1008, 3, '#a98a64', { a: .4, bend: 0 }); }
  seg2(R.floor, 330, 752, 1590, 752, 7, '#8a6a4a', { a: .75 });
  R.win = Grp(); gadd(R.win, Wash(wobRect(470, 250, 780, 570, 2, 60), '#bcd0dc', .85, { j: 1.8, dir: 'y' })); gadd(R.win, Wash(blob(600, 330, 90, 22, 12, .2), '#e6ecee', .6, { j: 3 }));
  rectOutline(R.win, 470, 250, 780, 570, 7, INK2, { a: .85 }); seg2(R.win, 625, 252, 625, 568, 5, INK2, { a: .8 }); seg2(R.win, 472, 410, 778, 410, 5, INK2, { a: .8 }); seg2(R.win, 456, 575, 794, 575, 9, '#8a6a4a', { a: .8 });
  R.curt = Grp(); gadd(R.curt, Wash([[440, 235], [490, 235], [510, 585], [440, 585]], '#d9c9a8', .8, { j: 2, dir: 'y' })); gadd(R.curt, Wash([[760, 235], [810, 235], [810, 585], [740, 585]], '#d9c9a8', .8, { j: 2, dir: 'y' }));
  for (const x of [455, 470, 780, 795]) seg2(R.curt, x, 240, x + rnd(-4, 4), 580, 3, '#b59f78', { a: .55 });
  R.bed = Grp(); gadd(R.bed, Wash(wobRect(965, 420, 1005, 730, 2, 40), '#8a6a4a', .9, { j: 1.4 })); gadd(R.bed, Wash(wobRect(985, 560, 1500, 668, 3, 50), '#ece3d2', .95, { j: 2 })); gadd(R.bed, Wash(wobRect(985, 640, 1500, 668, 2, 50), '#cfc4ae', .7, { j: 2 }));
  gadd(R.bed, Wash(blob(1085, 545, 78, 24, 14, .1), '#f4eddc', .95, { j: 2 })); gadd(R.bed, Wash(wobRect(1250, 575, 1500, 665, 3, 50), '#bfd0d4', .55, { j: 2.4 }));
  rectOutline(R.bed, 985, 560, 1500, 668, 3.6, INK2, { a: .75 }); for (const x of [1010, 1480]) seg2(R.bed, x, 668, x, 742, 8, '#8a6a4a', { a: .9, bend: 0 });
  seg2(R.bed, 1250, 580, 1252, 662, 3, '#8f8a78', { a: .6 });
  R.stand = Grp(); gadd(R.stand, Wash(wobRect(1525, 590, 1600, 740, 2, 30), '#a98a64', .9, { j: 1.5 })); rectOutline(R.stand, 1525, 590, 1600, 740, 3, INK2, { a: .75 }); seg2(R.stand, 1525, 660, 1600, 660, 3, INK2, { a: .6 });
  R.lamp = Grp(); seg2(R.lamp, 1562, 588, 1562, 548, 5, INK2, { a: .85 }); gadd(R.lamp, Wash([[1528, 548], [1596, 548], [1580, 496], [1544, 496]], '#e0b25a', .92, { j: 1.4 })); gadd(R.lamp, Wash(blob(1562, 540, 90, 76, 16, .1), '#f0d9a0', .42, { j: 4 }));
  R.iv = Grp(); seg2(R.iv, 905, 750, 905, 360, 4, INK2, { a: .85 }); seg2(R.iv, 870, 366, 940, 366, 4, INK2, { a: .85 }); for (const dx of [-26, 26]) seg2(R.iv, 905 + dx * 1.2, 748, 905, 735, 4, INK2, { a: .8, bend: 0 });
  gadd(R.iv, Wash(wobRect(878, 378, 922, 460, 2, 20), '#c9d8de', .85, { j: 1.4 })); rectOutline(R.iv, 878, 378, 922, 460, 2.6, INK2, { a: .7 }); seg2(R.iv, 900, 460, 960, 560, 2.4, '#8794a0', { a: .8, bend: 6 });
  R.light = Grp([Wash([[470, 760], [790, 760], [900, 960], [380, 960]], '#efdcae', .5, { j: 3, dir: 'y' })]);
  R.mon = Grp(); gadd(R.mon, Wash(wobRect(1170, 330, 1330, 430, 2, 30), '#5f7486', .78, { j: 1.5 })); rectOutline(R.mon, 1170, 330, 1330, 430, 4, INK2, { a: .8 });
  seg2(R.mon, 1186, 392, 1318, 392, 2.4, '#bfe0c6', { a: .9, bend: 0 }); seg2(R.mon, 1186, 392, 1212, 372, 2.4, '#bfe0c6', { a: .9, bend: 0 });
}
const NOTHING = 0;
