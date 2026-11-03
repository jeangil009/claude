// main.js — sheets, transitions, notes, subtitles, render(t)
const cv = document.getElementById('c'), ctx = cv.getContext('2d');
window.DUR = 50;
let PAPER_IMG, LAY, LAY2, LAYCV, LAY2CV, LASTTEXTS = [];
const P = (t, a, b) => seg(t, a, b);

// ---------- mist helpers ----------
function mistY(x, t, t0, t1) { return lerp(H + 160, -170, ss(seg(t, t0, t1))) + 46 * Math.sin(x * .0055 + t * .7) + 24 * Math.sin(x * .0151 + 1.7 + t * .4); }
function mistPath(c, t, t0, t1) { c.beginPath(); c.moveTo(-10, H + 220); for (let x = -10; x <= W + 10; x += 16) c.lineTo(x, mistY(x, t, t0, t1)); c.lineTo(W + 10, H + 220); c.closePath(); }
function eraseBelow(c, t, t0, t1) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = 'destination-out'; mistPath(c, t, t0, t1); c.fill(); c.restore(); }
function veilBelow(c, t, t0, t1, a) { c.save(); c.fillStyle = rgba(PAPERC, a); mistPath(c, t, t0, t1); c.fill(); c.restore(); }
function clearLayer(L) { L.setTransform(1, 0, 0, 1, 0, 0); L.globalCompositeOperation = 'source-over'; L.globalAlpha = 1; L.clearRect(0, 0, W, H); }

// ---------- notes (hand-written, with a pen leader) ----------
function note(c, id, txt, t, t0, t1, a, lx, ly, o = {}) {
  if (t < t0 || t > t1) return;
  const fade = Math.min(ss(seg(t, t0, t0 + .25)), 1 - ss(seg(t, t1 - .4, t1)));
  const ap = o.noLeader ? [lx, ly] : W2S(a[0], a[1]);
  c.save(); c.globalAlpha = fade;
  const size = o.size || 40, al = o.align || 'left';
  c.font = `500 ${size}px Caveat`; const w = c.measureText(txt).width, x0 = al === 'right' ? lx - w : al === 'center' ? lx - w / 2 : lx;
  const sx = o.fromX ?? (ap[0] > x0 + w / 2 ? x0 + w + 8 : x0 - 8), sy = ly - size * .28;
  if (!o.noLeader) leader(c, sx, sy, ap[0], ap[1], P(t, t0 + .1, t0 + .7), o.bend ?? 22);
  const bb = hand(c, txt, lx, ly, P(t, t0, t0 + .7), { size, align: al, col: o.col });
  c.restore();
  if (bb) LASTTEXTS.push({ id, text: txt, x0: bb[0], y0: bb[1], x1: bb[2], y1: bb[3] });
}

// ---------- sheet A: finished hospital → mist → empty lot ----------
function backdrop(c, skyD = 0, morn = 1) {
  drawGroup(c, G.skyM, 1, { am: morn }); if (skyD > 0) drawGroup(c, G.skyD, 1, { am: skyD });
  drawGroup(c, G.far, 1); drawGroup(c, G.mid, 1); drawGroup(c, G.ground, 1);
}
function finished(L, o = {}) {
  drawGroup(L, G.treesL, o.trees ?? 1, o); drawGroup(L, G.treesR, o.trees ?? 1, o);
  drawGroup(L, G.walls, o.walls ?? 1, o); drawGroup(L, G.wins, o.wins ?? 1, o); drawGroup(L, G.door, o.door ?? 1, o);
  drawGroup(L, G.canopy, o.canopy ?? 1, o); drawGroup(L, G.roof, o.roof ?? 1, o); drawGroup(L, G.shrubs, o.shrubs ?? 1, o);
  drawGroup(L, G.lampOff, o.lampOff ?? 1, o);
}
function sheetA(c, t) {
  c.drawImage(PAPER_IMG, 0, 0);
  const cam = camA(t);
  c.save(); useCam(c, cam); backdrop(c);
  clearLayer(LAY); LAY.save(); useCam(LAY, cam); finished(LAY); LAY.restore();
  c.restore();
  if (t >= T.mist[0]) eraseBelow(LAY, t, T.mist[0], T.mist[1]);
  c.drawImage(LAYCV, 0, 0);
  if (t >= T.mist[0]) { const vp = t < T.mist[1] ? .55 : .55 * (1 - ss(seg(t, T.mist[1], T.mist[1] + 1.2))); if (vp > 0.003) veilBelow(c, t, T.mist[0], T.mist[1], vp); }
  c.save(); useCam(c, cam);
  drawGroup(c, G.ghost, P(t, ...T.ghost)); drawGroup(c, G.tape, P(t, ...T.tape)); drawGroup(c, G.flag, P(t, ...T.flag));
  c.restore();
  note(c, 'terreno', 'terreno', t, T.noteLote, 7.6, [1470, GY - 60], 1060, 640, { size: 44 });
}

// ---------- sheet B: cross-section (soil, pit, footings) ----------
function sheetB(c, t) {
  c.drawImage(PAPER_IMG, 0, 0);
  const cam = camB(t); c.save(); useCam(c, cam);
  const view = [cam.cx - W / 2 / cam.z - 40, cam.cy - H / 2 / cam.z - 40, cam.cx + W / 2 / cam.z + 40, cam.cy + H / 2 / cam.z + 40], o = { view, live: false };
  drawGroup(c, B.sky, P(t, 7.5, 8.5)); drawGroup(c, B.grass, P(t, 8.4, 9.4));
  const s0 = T.soil[0], sd = [[s0, s0 + 1.3], [s0 + .9, s0 + 2.2], [s0 + 1.8, s0 + 3.1], [s0 + 2.5, s0 + 3.5]];
  B.bands.forEach((g, i) => drawGroup(c, g, P(t, sd[i][0], sd[i][1]), o));
  drawGroup(c, B.flag, P(t, 8.6, 9.2)); drawGroup(c, B.core, P(t, ...T.core), o);
  drawGroup(c, B.pit, P(t, ...T.pit), o);
  drawGroup(c, B.foot, P(t, ...T.pad), o); drawGroup(c, B.rebar, P(t, ...T.rebar), o); drawGroup(c, B.pour, P(t, ...T.pour), o);
  c.restore();
  note(c, 'suelo', 'estudio de suelo', t, 9.5, 14.6, [1690, 560], 1330, 330, { size: 42, align: 'left', bend: -26 });
  note(c, 'excav', 'excavación', t, 11.2, 15.4, [556, 640], 120, 520, { size: 44, bend: 20 });
  note(c, 'zapatas', 'zapatas', t, 15.3, 19.2, [1404, 835], 1560, 980, { size: 42, bend: -20 });
  note(c, 'acero', 'acero', t, 16.2, 19.2, [890, 740], 240, 900, { size: 42, bend: 24 });
  note(c, 'hormigon', 'hormigón', t, 17.0, 19.4, [1346, 770], 1630, 700, { size: 42, bend: -16 });
}

// ---------- sheet C: structure → walls → x-ray ----------
function sheetC(c, t) {
  c.drawImage(PAPER_IMG, 0, 0);
  const cam = camC(t), o = { view: [cam.cx - W / 2 / cam.z - 60, cam.cy - H / 2 / cam.z - 60, cam.cx + W / 2 / cam.z + 60, cam.cy + H / 2 / cam.z + 60] };
  c.save(); useCam(c, cam);
  backdrop(c);
  drawGroup(c, G.slab0, P(t, 19.3, 19.7), o);
  G.floors.forEach((g, f) => drawGroup(c, g, P(t, ...T.floors[f]), o));
  const xr = P(t, T.xray[0] - .1, T.xray[0] + .2);
  if (t >= T.xray[0] - .1) { drawGroup(c, G.int, xr, o); for (const k of ['air', 'power', 'water', 'oxy']) drawGroup(c, G.nets[k], P(t, T.nets[k], T.nets[k] + T.netDur), o); }
  const crane = 1 - ss(seg(t, ...T.crane_out));
  if (crane > 0) {
    c.save(); c.globalAlpha = crane;
    drawGroup(c, G.tower, P(t, ...T.tower), o); drawGroup(c, G.jib, P(t, ...T.jib), o);
    if (t > T.load[0]) { c.save(); c.translate(1107, 154); c.rotate(.018 * Math.sin(1.3 * t)); c.translate(-1107, -154); drawGroup(c, G.load, P(t, ...T.load), { live: true, view: o.view }); c.restore(); }
    c.restore();
  }
  clearLayer(LAY); LAY.save(); useCam(LAY, cam);
  finished(LAY, { walls: P(t, ...T.walls), wins: P(t, ...T.wins), door: P(t, T.wins[0] + .3, T.wins[1]), canopy: P(t, T.walls[1] - .6, T.roof[0] + .3), roof: P(t, ...T.roof), trees: 0, shrubs: 0, lampOff: P(t, T.roof[0], T.roof[1]), view: o.view });
  LAY.restore();
  if (t >= T.xray[0]) {
    const e = ss(seg(t, ...T.xray)); LAY.save(); LAY.setTransform(1, 0, 0, 1, 0, 0); LAY.globalCompositeOperation = 'destination-out'; LAY.beginPath(); const X = lerp(-120, W + 140, e); LAY.moveTo(-200, -20);
    for (let y = -20; y <= H + 20; y += 14) LAY.lineTo(X + 34 * Math.sin(y * .018 + t * 1.2) + 14 * Math.sin(y * .047), y); LAY.lineTo(-200, H + 20); LAY.closePath(); LAY.fill(); LAY.restore();
  }
  c.restore(); c.drawImage(LAYCV, 0, 0);
  c.save(); useCam(c, cam); drawGroup(c, G.treesL, P(t, ...T.trees), o); drawGroup(c, G.treesR, P(t, ...T.trees), o); drawGroup(c, G.shrubs, P(t, T.trees[0] + .2, T.trees[1]), o); c.restore();
  note(c, 'columnas', 'columnas y vigas', t, 19.7, 22.6, [770, GY - FH * 1.5], 150, 300, { size: 42, bend: -26 });
  note(c, 'losas', 'losas, piso por piso', t, 21.3, 25.6, [1150, GY - FH * 3], 760, 250, { size: 42, bend: -22 });
  note(c, 'agua', 'agua', t, T.nets.water, 35.0, [620, GY - FH * 3 + 66], 70, 250, { size: 42, col: '#2c6086', bend: -14 });
  note(c, 'luz', 'electricidad', t, T.nets.power, 35.0, [1300, GY - FH * 3 + 46], 1450, 250, { size: 42, col: '#9a6c12', bend: 14 });
  note(c, 'oxigeno', 'oxígeno', t, T.nets.oxy, 35.0, [640, GY - FH * 2 + 88], 70, 350, { size: 42, col: '#3f7550', bend: -14 });
  note(c, 'aire', 'aire limpio', t, T.nets.air, 35.0, [1320, GY - FH * 2 + 24], 1450, 350, { size: 42, col: '#5d7684', bend: 14 });
}

// ---------- sheet D: one quiet room ----------
function sheetD(c, t) {
  c.drawImage(PAPER_IMG, 0, 0);
  const z = lerp(1, 1.14, ss(seg(t, 35.4, 41))), cx = lerp(960, 1010, ss(seg(t, 35.4, 41))), cy = lerp(540, 560, ss(seg(t, 35.4, 41)));
  c.save(); useCam(c, { cx, cy, z });
  drawGroup(c, R.wall, P(t, 35.4, 36.4)); drawGroup(c, R.floor, P(t, 35.8, 36.7)); drawGroup(c, R.win, P(t, 36.3, 37.2)); drawGroup(c, R.curt, P(t, 36.9, 37.5));
  drawGroup(c, R.bed, P(t, 36.7, 38.6)); drawGroup(c, R.iv, P(t, 38.5, 39.2)); drawGroup(c, R.stand, P(t, 38.8, 39.4)); drawGroup(c, R.mon, P(t, 39.3, 39.8));
  drawGroup(c, R.lamp, P(t, 39.4, 40.2)); drawGroup(c, R.light, P(t, 39.8, 40.8), { am: .9 });
  c.restore();
}

// ---------- sheet E: dusk, lights, the last window ----------
function sheetE(c, t) {
  c.drawImage(PAPER_IMG, 0, 0);
  const cam = camE(t), dusk = ss(seg(t, ...T.dusk)), live = cam.z > 1.6, view = [cam.cx - W / 2 / cam.z - 60, cam.cy - H / 2 / cam.z - 60, cam.cx + W / 2 / cam.z + 60, cam.cy + H / 2 / cam.z + 60];
  const o = { live, view };
  c.save(); useCam(c, cam);
  drawGroup(c, G.skyM, 1, { am: 1 - dusk * .85 }); if (dusk > 0) drawGroup(c, G.skyD, 1, { am: dusk });
  drawGroup(c, G.far, 1); drawGroup(c, G.mid, 1); drawGroup(c, G.ground, 1);
  const buildingAm = 1;
  finished(c, { ...o, lampOff: 1 - ss(seg(t, T.lamp - .1, T.lamp + .1)) });
  const lampP = P(t, T.lamp, T.lamp + .5); if (lampP > 0) drawGroup(c, G.lampOn, lampP, { ...o, am: 1 });
  for (const w of WINS) { const p = P(t, w.at, w.at + .45); if (p > 0) drawGroup(c, w.lit, p, { live: o.live, view }); }
  const sill = G.sill || (G.sill = withSeed(91, () => St(mk(qcurve(wcx(5) - 46, wfy(2) + 80, wcx(5) + 46, wfy(2) + 80, 2, 8), 3.2, '#6b4f3a', { prof: 'even', nb: 0, a: .85 }))));
  c.restore();
  // everything fades to paper except the last window
  const f = ss(seg(t, ...T.fade));
  if (f > 0) {
    const [sx, sy] = W2S(wcx(5), wfy(2) + 30), r0 = 118 * Math.max(1, CAM.z / 3.8), r1 = 430 * Math.max(1, CAM.z / 3.8);
    const g = c.createRadialGradient(sx, sy, r0, sx, sy, r1); g.addColorStop(0, rgba(PAPERC, 0)); g.addColorStop(.3, rgba(PAPERC, f * .96)); g.addColorStop(1, rgba(PAPERC, f));
    c.save(); c.fillStyle = g; c.fillRect(0, 0, W, H); c.restore();
  }
  const lp = P(t, ...T.last);
  if (lp > 0) { c.save(); useCam(c, cam); drawS(c, sill.s, lp * .6); c.restore(); }
}

// ---------- sheets and transitions ----------
const SHEETS = [
  { t0: 0, draw: sheetA }, { t0: 7.4, tr: T.slideB, type: 'up', draw: sheetB }, { t0: 18.7, tr: T.slideC, type: 'left', draw: sheetC },
  { t0: 34.4, tr: T.slideD, type: 'up', draw: sheetD }, { t0: 40.4, tr: T.mistD, type: 'mist', draw: sheetE },
];
function shadowEdge(c, type, d) {
  c.save();
  if (type === 'up') { const g = c.createLinearGradient(0, d - 34, 0, d); g.addColorStop(0, 'rgba(60,45,30,0)'); g.addColorStop(1, 'rgba(60,45,30,.16)'); c.fillStyle = g; c.fillRect(0, d - 34, W, 34); c.fillStyle = 'rgba(255,250,240,.5)'; c.fillRect(0, d, W, 2); }
  else { const g = c.createLinearGradient(d - 34, 0, d, 0); g.addColorStop(0, 'rgba(60,45,30,0)'); g.addColorStop(1, 'rgba(60,45,30,.16)'); c.fillStyle = g; c.fillRect(d - 34, 0, 34, H); c.fillStyle = 'rgba(255,250,240,.5)'; c.fillRect(d, 0, 2, H); }
  c.restore();
}
function composite(t) {
  let k = 0; for (let i = 0; i < SHEETS.length; i++) if (t >= SHEETS[i].t0) k = i;
  const S = SHEETS[k];
  if (!S.tr || t >= S.tr[1]) { S.draw(ctx, t); return; }
  const prev = SHEETS[k - 1], e = eio(seg(t, S.tr[0], S.tr[1]));
  if (S.type === 'mist') {
    S.draw(ctx, t);
    clearLayer(LAY2); prev.draw(LAY2, t); eraseBelow(LAY2, t, S.tr[0], S.tr[1]);
    ctx.drawImage(LAY2CV, 0, 0); veilBelow(ctx, t, S.tr[0], S.tr[1], .5 * (1 - ss(seg(t, S.tr[1] - .6, S.tr[1]))));
    return;
  }
  prev.draw(ctx, t);
  const dx = S.type === 'left' ? (1 - e) * W : 0, dy = S.type === 'up' ? (1 - e) * H : 0;
  ctx.save(); ctx.translate(dx, dy); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.clip(); S.draw(ctx, t); ctx.restore();
  shadowEdge(ctx, S.type, S.type === 'up' ? dy : dx);
}

// ---------- HUD and subtitles ----------
function stageCard(c, t) {
  for (const [a, b, n, name] of STAGES) {
    if (t < a || t > b) continue;
    const al = Math.min(ss(seg(t, a, a + .5)), 1 - ss(seg(t, b - .5, b)));
    c.save(); c.globalAlpha = al;
    c.font = '400 22px "IBM Plex Mono"'; c.letterSpacing = '4px'; const sub = `${n} / 06`;
    c.lineJoin = 'round'; c.lineWidth = 10; c.strokeStyle = rgba(PAPERC, .9); c.strokeText(sub, 84, 96); c.fillStyle = rgba(INK2, .85); c.fillText(sub, 84, 96); c.letterSpacing = '0px';
    c.font = '500 56px "Cormorant Garamond"'; c.strokeText(name, 84, 156); c.fillStyle = rgba(INK, .9); c.fillText(name, 84, 156);
    withSeed(5 + +n, () => { const s = mk(qcurve(84, 176, 84 + 150, 176, 3, 8), 8, n === '06' ? VERM : C.soil2, { prof: 'even', nb: 3, a: .85 }); drawS(c, s, ss(seg(t, a + .1, a + .8))); });
    c.restore();
    LASTTEXTS.push({ id: 'stage' + n, text: name, x0: 84, y0: 108, x1: 84 + c.measureText(name).width, y1: 160 });
  }
}
function wrapLines(c, txt, maxW) {
  const w = txt.split(' '); let lines = [], cur = '';
  for (const s of w) { const tst = cur ? cur + ' ' + s : s; if (c.measureText(tst).width > maxW && cur) { lines.push(cur); cur = s; } else cur = tst; }
  lines.push(cur);
  if (lines.length === 2) { // balance
    const all = txt.split(' '); let best = lines, bd = 1e9;
    for (let i = 1; i < all.length; i++) { const a = all.slice(0, i).join(' '), b = all.slice(i).join(' '); const d = Math.abs(c.measureText(a).width - c.measureText(b).width); if (d < bd && c.measureText(a).width < maxW && c.measureText(b).width < maxW) { bd = d; best = [a, b]; } }
    lines = best;
  }
  return lines;
}
function subtitles(c, t) {
  for (const [id, s, d, txt] of VO) {
    const a = s - .15, b = s + d + .6;
    if (t < a || t > b) continue;
    const al = Math.min(ss(seg(t, a, a + .25)), 1 - ss(seg(t, b - .35, b)));
    c.save(); c.globalAlpha = al; c.font = 'italic 500 38px "Cormorant Garamond"'; c.textAlign = 'center'; c.lineJoin = 'round';
    const lines = wrapLines(c, txt, 1400), y0 = H - 48 - (lines.length - 1) * 46;
    lines.forEach((ln, i) => { const y = y0 + i * 46; c.lineWidth = 16; c.strokeStyle = rgba(PAPERC, .92); c.strokeText(ln, W / 2, y); c.strokeText(ln, W / 2, y); c.fillStyle = rgba(INK, .8); c.fillText(ln, W / 2, y); });
    c.restore();
  }
}

function render(t) {
  LASTTEXTS = [];
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  composite(t);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .6; ctx.drawImage(PAPER_IMG, 0, 0); ctx.restore();
  stageCard(ctx, t); subtitles(ctx, t);
}
window.render = render;
window.TEXTS = t => { render(t); return LASTTEXTS; };

// ---------- events for the mixer ----------
const EV = [];
const ev = (t, type, o = {}) => EV.push({ t, type, ...o });
VO.forEach(([id, s, d]) => ev(s, 'vo', { id, dur: d }));
ev(T.mist[0], 'mist', { dur: T.mist[1] - T.mist[0] }); ev(T.flag[0], 'flag'); ev(T.mistD[0], 'mist', { dur: T.mistD[1] - T.mistD[0], soft: 1 });
ev(T.slideB[0], 'slide', { dur: 1, pan: -.2 }); ev(T.slideC[0], 'slide', { dur: 1, pan: .3 }); ev(T.slideD[0], 'slide', { dur: 1, pan: 0 });
const RS = (a, b, g = .6, pan = 0) => ev(a, 'rustle', { dur: b - a, gain: g, pan });
RS(T.tape[0], T.tape[1], .5, .3); RS(T.ghost[0], T.ghost[1], .5, 0); RS(...T.flag, .6, .4);
RS(T.soil[0], T.soil[0] + 3.4, .7, 0); RS(...T.core, .5, .4); RS(...T.pit, .8, -.2); RS(...T.pad, .5, 0); RS(...T.rebar, .5, 0); RS(...T.pour, .7, 0);
T.floors.forEach(f => RS(f[0], f[1], .7, 0)); RS(...T.tower, .5, .5); RS(...T.jib, .5, .2);
RS(...T.walls, .8, 0); RS(...T.wins, .5, 0); RS(...T.roof, .5, 0); RS(...T.trees, .5, -.4);
for (const k of ['water', 'power', 'oxy', 'air']) { RS(T.nets[k], T.nets[k] + T.netDur, .5, k === 'water' ? -.4 : k === 'power' ? .4 : k === 'oxy' ? -.2 : .2); ev(T.nets[k], 'net', { kind: k }); }
RS(35.4, 36.4, .5, 0); RS(36.4, 38.6, .6, 0.2); RS(38.6, 40.2, .5, 0); RS(...T.fade, .4, 0);
T.floors.forEach(f => ev(f[1] - .15, 'slab')); ev(T.pit[0] + .4, 'dig', { dur: 1.6 }); ev(T.pour[0], 'pour', { dur: 1.5 });
ev(T.lamp, 'light', { big: 1 }); ev(36.67, 'drop');
ev(T.last[1], 'lift');
window.EV = EV;

// ---------- init ----------
(async () => {
  PAPER_IMG = new Image(); PAPER_IMG.src = 'paper.jpg'; await PAPER_IMG.decode();
  LAYCV = document.createElement('canvas'); LAYCV.width = W; LAYCV.height = H; LAY2CV = document.createElement('canvas'); LAY2CV.width = W; LAY2CV.height = H; LAY = LAYCV.getContext('2d'); LAY2 = LAY2CV.getContext('2d');
  await Promise.all(['500 56px "Cormorant Garamond"', 'italic 500 38px "Cormorant Garamond"', '500 40px Caveat', '400 22px "IBM Plex Mono"'].map(f => document.fonts.load(f)));
  withSeed(11, buildElev); withSeed(23, buildSection); withSeed(37, buildRoom);
  WINS.forEach(w => ev(w.at, 'light'));
  window.READY = true;
})();
