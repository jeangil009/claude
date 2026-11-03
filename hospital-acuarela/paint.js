// paint.js — groups of washes and brush strokes that paint themselves in, with cached sprites
const SSF = 1.25;                       // sprite supersampling
const PAPERC = '#f1e9da';

function polyPass(poly, j) { return poly.map(p => [p[0] + rnd(-j, j), p[1] + rnd(-j, j)]); }
function wobRect(x0, y0, x1, y1, amp = 3, step = 40) {
  const pts = [], nx = Math.max(2, Math.round((x1 - x0) / step)), ny = Math.max(2, Math.round((y1 - y0) / step));
  for (let i = 0; i <= nx; i++) pts.push([lerp(x0, x1, i / nx) + rnd(-amp, amp), y0 + rnd(-amp, amp)]);
  for (let i = 1; i <= ny; i++) pts.push([x1 + rnd(-amp, amp), lerp(y0, y1, i / ny) + rnd(-amp, amp)]);
  for (let i = nx - 1; i >= 0; i--) pts.push([lerp(x0, x1, i / nx) + rnd(-amp, amp), y1 + rnd(-amp, amp)]);
  for (let i = ny - 1; i >= 1; i--) pts.push([x0 + rnd(-amp, amp), lerp(y0, y1, i / ny) + rnd(-amp, amp)]);
  return pts;
}
function blob(cx, cy, rx, ry, n = 14, amp = .12) {
  const pts = [];
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, k = 1 + rnd(-amp, amp); pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  return pts;
}
function bbPts(pts, pad = 0) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return [x0 - pad, y0 - pad, x1 + pad, y1 + pad];
}
// a wash: three passes with jittered vertices, so the edges pool and darken
function Wash(poly, col, a, o = {}) {
  const j = o.j ?? 2.2;
  return { k: 'w', P: [polyPass(poly, j), polyPass(poly, j), polyPass(poly, j)], col, a, dir: o.dir || 'x', bb: bbPts(poly, 8) };
}
function St(s) { return { k: 's', s, bb: bbox([s], 4) }; }
function Grp(items = []) { return { items, spr: null, _bb: null }; }
function gadd(g, it) { g.items.push(it); g._bb = null; g.spr = null; return g; }
function gbb(g) {
  if (g._bb) return g._bb;
  let b = [1e9, 1e9, -1e9, -1e9];
  for (const it of g.items) { b = [Math.min(b[0], it.bb[0]), Math.min(b[1], it.bb[1]), Math.max(b[2], it.bb[2]), Math.max(b[3], it.bb[3])]; }
  return g._bb = b;
}

function drawWash(c, it, p, am = 1) {
  if (p <= 0) return;
  const [x0, y0, x1, y1] = it.bb;
  c.save();
  if (p < 1) {
    const e = ss(p); c.beginPath();
    if (it.dir === 'x') { const X = x0 - 12 + (x1 - x0 + 24) * e; c.moveTo(x0 - 20, y0 - 20); for (let y = y0 - 20; y <= y1 + 20; y += 12) c.lineTo(X + 8 * Math.sin(y * .045), y); c.lineTo(x0 - 20, y1 + 20); }
    else if (it.dir === 'u') { const Y = y1 + 12 - (y1 - y0 + 24) * e; c.moveTo(x0 - 20, y1 + 20); for (let x = x0 - 20; x <= x1 + 20; x += 12) c.lineTo(x, Y + 8 * Math.sin(x * .045)); c.lineTo(x1 + 20, y1 + 20); }
    else { const Y = y0 - 12 + (y1 - y0 + 24) * e; c.moveTo(x0 - 20, y0 - 20); for (let x = x0 - 20; x <= x1 + 20; x += 12) c.lineTo(x, Y + 8 * Math.sin(x * .045)); c.lineTo(x1 + 20, y0 - 20); }
    c.closePath(); c.clip();
  }
  c.fillStyle = rgba(it.col, it.a / 3 * 1.6 * am);
  for (const P of it.P) { c.beginPath(); for (let i = 0; i < P.length; i++) i ? c.lineTo(P[i][0], P[i][1]) : c.moveTo(P[i][0], P[i][1]); c.closePath(); c.fill(); }
  c.restore();
}
function drawItem(c, it, p, am = 1) { if (it.k === 's') drawS(c, it.s, p, null, am); else drawWash(c, it, p, am); }

function gsprite(g) {
  if (g.spr) return g.spr;
  const [x0, y0, x1, y1] = gbb(g).map((v, i) => i < 2 ? Math.floor(v) : Math.ceil(v)), cv = document.createElement('canvas');
  cv.width = Math.max(1, Math.ceil((x1 - x0) * SSF)); cv.height = Math.max(1, Math.ceil((y1 - y0) * SSF));
  const c = cv.getContext('2d'); c.scale(SSF, SSF); c.translate(-x0, -y0);
  for (const it of g.items) drawItem(c, it, 1);
  return g.spr = { cv, x0, y0, w: x1 - x0, h: y1 - y0 };
}
// p: progress 0..1; o.live: draw stroke by stroke (needed when zooming in a lot); o.view: cull box; o.am: opacity
function drawGroup(c, g, p = 1, o = {}) {
  if (p <= 0 || !g.items.length) return;
  const am = o.am ?? 1;
  if (p >= 1 && !o.live) { const s = gsprite(g), ga = c.globalAlpha; c.globalAlpha = ga * am; c.drawImage(s.cv, s.x0, s.y0, s.w, s.h); c.globalAlpha = ga; return; }
  const N = g.items.length, dur = p >= 1 ? 1 : clamp(4 / N, .12, .5), v = o.view;
  for (let j = 0; j < N; j++) {
    const it = g.items[j], t0 = p >= 1 ? 0 : j / N * (1 - dur), q = p >= 1 ? 1 : (p - t0) / dur;
    if (q <= 0) continue;
    if (v) { const b = it.bb; if (b[2] < v[0] || b[0] > v[2] || b[3] < v[1] || b[1] > v[3]) continue; }
    drawItem(c, it, clamp(q), am);
  }
}

// ---------- shapes ----------
// horizontal brush hatch filling a rectangle (a wall painted with a loaded brush)
function hatch(g, x0, y0, x1, y1, col, o = {}) {
  const h = y1 - y0, w = o.w ?? 30, rows = Math.max(1, Math.round(h / (w * .85)));
  for (let i = 0; i < rows; i++) {
    const y = y0 + (i + .5) * h / rows + rnd(-2, 2), xa = x0 + rnd(-3, 3), xb = x1 + rnd(-3, 3);
    gadd(g, St(mk(qcurve(xa, y, xb, y + rnd(-2, 2), rnd(-3, 3), 6), h / rows * 1.15, col, { prof: 'even', nb: o.nb ?? 5, a: o.a ?? .55, rough: .18 })));
  }
}
function vhatch(g, x0, y0, x1, y1, col, o = {}) {
  const wd = x1 - x0, w = o.w ?? 26, cols = Math.max(1, Math.round(wd / (w * .85)));
  for (let i = 0; i < cols; i++) {
    const x = x0 + (i + .5) * wd / cols + rnd(-2, 2);
    gadd(g, St(mk(qcurve(x, y0 + rnd(-3, 3), x + rnd(-2, 2), y1 + rnd(-3, 3), rnd(-3, 3), 6), wd / cols * 1.15, col, { prof: 'even', nb: o.nb ?? 4, a: o.a ?? .55, rough: .18 })));
  }
}
function line(g, pts, w, col, o = {}) { gadd(g, St(mk(pts, w, col, { prof: o.prof || 'even', nb: o.nb ?? 0, a: o.a ?? .85, rough: o.rough ?? .3 }))); }
function seg2(g, x0, y0, x1, y1, w, col, o = {}) { line(g, qcurve(x0, y0, x1, y1, o.bend ?? rnd(-2, 2), o.n ?? 6), w, col, o); }
function rectOutline(g, x0, y0, x1, y1, w, col, o = {}) {
  line(g, [[x0 + rnd(-1, 1), y0 + rnd(-1, 1)], [x1 + rnd(-1, 1), y0 + rnd(-1, 1)], [x1 + rnd(-1, 1), y1 + rnd(-1, 1)], [x0 + rnd(-1, 1), y1 + rnd(-1, 1)], [x0 + rnd(-1, 1), y0 + rnd(-1, 1)]], w, col, o);
}
// densify a polyline so strokes keep smooth widths
function dens(pts, step = 24) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let k = 1; k <= n; k++) out.push([lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)]);
  }
  return out;
}
// wavy horizontal band top edge → polygon down to yb
function bandPoly(x0, x1, yTop, yBot, amp = 6, f = .012, ph = 0) {
  const pts = [];
  for (let x = x0; x <= x1; x += 40) pts.push([x, yTop + amp * Math.sin(x * f + ph) + amp * .5 * Math.sin(x * f * 2.3 + ph * 1.7)]);
  for (let x = x1; x >= x0; x -= 40) pts.push([x, yBot + amp * Math.sin(x * f + ph + 1.3) + amp * .5 * Math.sin(x * f * 2.1 + ph)]);
  return pts;
}

// ---------- handwriting ----------
const LEAD = {};
function leadStroke(key, pts) { return LEAD[key] || (LEAD[key] = withSeed(hash(key.length * 31 + key.charCodeAt(0)) * 1e4 | 0, () => mk(pts, 3, INK2, { prof: 'even', nb: 0, a: .8, rough: .25 }))); }
function hand(c, txt, x, y, p, o = {}) {
  if (p <= 0) return;
  const size = o.size || 38, al = o.align || 'left';
  c.save(); c.font = `${o.weight || 500} ${size}px Caveat`; c.textBaseline = 'alphabetic';
  const w = c.measureText(txt).width, x0 = al === 'right' ? x - w : al === 'center' ? x - w / 2 : x;
  c.beginPath(); c.rect(x0 - 10, y - size * 1.1, (w + 20) * ss(p), size * 1.5); c.clip();
  c.lineJoin = 'round'; c.lineWidth = 12; c.strokeStyle = rgba(PAPERC, .9); c.strokeText(txt, x0, y);
  c.fillStyle = rgba(o.col || INK, .9); c.fillText(txt, x0, y); c.fillText(txt, x0, y + .4);
  c.restore(); return [x0, y - size * .8, x0 + w, y + size * .25];
}
function leader(c, x0, y0, x1, y1, p, bend = 18) {
  if (p <= 0) return;
  const pts = qcurve(x0, y0, x1, y1, bend, 14), m = (pts.length - 1) * clamp(p), k = Math.floor(m), f = m - k;
  c.save(); c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = 2.4; c.strokeStyle = rgba(INK2, .8); c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i <= k; i++) c.lineTo(pts[i][0], pts[i][1]);
  if (f > 0 && k < pts.length - 1) c.lineTo(lerp(pts[k][0], pts[k + 1][0], f), lerp(pts[k][1], pts[k + 1][1], f));
  c.stroke();
  if (p >= 1) { c.fillStyle = rgba(INK2, .85); c.beginPath(); c.arc(x1, y1, 3.6, 0, 7); c.fill(); }
  c.restore();
}
