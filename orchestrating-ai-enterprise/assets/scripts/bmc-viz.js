// <bmc-viz> — scroll-driven SVG charts in the BMC "scientific" style.
// types: radial | lollipop | waffle | rose | dotring
// data: "Label|value|color;Label|value|color"   (color: b=Electric Blue, c=coral, l=lilac, m=midnight, s=pale)
// optional tabs: tabs="A;B" with data-0 / data-1 and src-0 / src-1, plus h (px height), max, center/centersub (dotring)
const C = { b: '#4040D9', c: '#FF5A4D', l: '#758CE5', m: '#052140', s: '#C9D3EE' };
const INK = '#052140', MUTE = '#5A6B85', LINE = 'rgba(5,33,64,.14)', TRACK = '#DDE3F0';
const FONT = "'Sofia Pro','Plus Jakarta Sans',system-ui,sans-serif";
const clamp = v => Math.max(0, Math.min(1, v)), ease = t => t * t * (3 - 2 * t);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const parse = s => (s || '').split(';').map(r => r.trim()).filter(Boolean).map(r => { const [l, v, c] = r.split('|'); return { l: l.trim(), v: parseFloat(v), c: C[(c || 'b').trim()] || c }; });
const tw = (s, fs) => s.length * fs * .54; // rough text width
function pill(x, y, txt, col, anchor) {
  const w = tw(txt, 13) + 18, x0 = anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x;
  return `<g><rect x="${x0}" y="${y - 12}" width="${w}" height="24" rx="12" fill="${col}"/><text x="${x0 + w / 2}" y="${y + 4.5}" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">${esc(txt)}</text></g>`;
}
const wrap = (x, y, txt, max, fs, col, lh, an = 'start') => { const out = []; let ln = ''; txt.split(' ').forEach(w => { if ((ln + ' ' + w).trim().length > max && ln) { out.push(ln); ln = w; } else ln = (ln + ' ' + w).trim(); }); if (ln) out.push(ln); return `<text x="${x}" y="${y}" font-size="${fs}" fill="${col}" text-anchor="${an}">` + out.map((l, i) => `<tspan x="${x}" dy="${i ? lh : 0}">${esc(l)}</tspan>`).join('') + '</text>'; };
const plus = (x, y, o = .45) => `<path d="M${x - 5} ${y}h10M${x} ${y - 5}v10" stroke="${INK}" stroke-opacity="${o}" stroke-width="1"/>`;

class BmcViz extends HTMLElement {
  connectedCallback() {
    if (this._on) return; this._on = 1;
    this.style.display = 'block'; this.style.width = '100%';
    this.type = this.getAttribute('type') || 'lollipop';
    this.H = parseFloat(this.getAttribute('h')) || 380;
    const tabs = (this.getAttribute('tabs') || '').split(';').filter(Boolean);
    this.sets = tabs.length ? tabs.map((_, i) => parse(this.getAttribute('data-' + i))) : [parse(this.getAttribute('data'))];
    this.srcs = tabs.length ? tabs.map((_, i) => this.getAttribute('src-' + i) || '') : [this.getAttribute('src') || ''];
    this.ti = 0; this.p = 0; this.pt = 0;
    const chrome = tabs.length > 0;
    this.innerHTML = (chrome ? `<div style="display:flex;justify-content:space-between;align-items:stretch;flex-wrap:wrap;gap:12px;border-bottom:1px solid ${LINE}">
      <div data-tabs style="display:flex;flex-wrap:wrap">${tabs.map((t, i) => `<button type="button" data-i="${i}" style="all:unset;cursor:pointer;font:600 12px/1 ${FONT};letter-spacing:.14em;text-transform:uppercase;padding:14px 18px;border-right:1px solid ${LINE}">${esc(t)}</button>`).join('')}</div>
</div>` : '')
      + `<div data-plot style="position:relative;width:100%;height:${this.H}px"></div>`
      + `<div data-src style="font:12px/1.5 ${FONT};color:${MUTE};margin-top:14px"></div>`;
    if (chrome) {
      this.style.border = '1px solid ' + LINE; this.style.background = 'rgba(255,255,255,.55)'; this.style.backdropFilter = 'blur(6px)';
      this.querySelector('[data-plot]').style.margin = '24px 0 0'; this.querySelector('[data-src]').style.padding = '0 20px 18px';
      this.querySelector('[data-plot]').style.width = 'calc(100% - 40px)'; this.querySelector('[data-plot]').style.marginLeft = '20px';
      this.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => { this.ti = +b.dataset.i; this.p = 0; this.paintTabs(); this.draw(true); }));
    }
    this.plot = this.querySelector('[data-plot]');
    this.paintTabs();
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    new ResizeObserver(() => this.draw(true)).observe(this.plot);
    const loop = () => {
      if (!this.isConnected) return;
      const r = this.plot.getBoundingClientRect(), vh = innerHeight;
      if (r.bottom > -200 && r.top < vh + 200) {
        this.pt = this.reduce ? 1 : clamp((vh - r.top) / (vh * .75));
        const np = this.p + (this.pt - this.p) * .09;
        if (Math.abs(np - this.p) > .0008 || this.type === 'bubbles') { this.p = Math.abs(this.pt - np) < .002 ? this.pt : np; this.draw(); }
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
  paintTabs() {
    this.querySelectorAll('[data-i]').forEach(b => { const on = +b.dataset.i === this.ti; b.style.background = on ? '#052140' : 'transparent'; b.style.color = on ? '#fff' : INK; });
    this.querySelector('[data-src]').textContent = this.srcs[this.ti] || '';
  }
  draw() {
    const w = this.plot.clientWidth, h = this.H; if (!w) return;
    const d = this.sets[this.ti], P = ease(clamp(this.p));
    const body = this[this.type] ? this[this.type](d, w, h, P) : '';
    this.plot.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true" focusable="false" style="display:block;overflow:visible" font-family="${FONT}">${body}</svg>`;
  }
  // concentric arcs (full circle = 100%), labels at ring starts, value pills at arc ends
  radial(d, w, h, P) {
    const n = d.length, maxL = Math.max(...d.map(x => tw(x.l, 13)));
    const narrow = w - maxL - 70 < 150, legH = narrow ? n * 26 + 16 : 0;
    const cx = narrow ? w / 2 : Math.min(w - (h / 2 - 16) - 40, maxL + 40), cy = (h - legH) / 2;
    const R = Math.min((h - legH) / 2 - 30, (narrow ? w / 2 : w - cx) - 40), gap = Math.min(34, R / (n + 1.6)), sw = gap * .52;
    let s = `<circle cx="${cx}" cy="${cy}" r="${R + gap * .6}" fill="none" stroke="${LINE}" stroke-dasharray="2 5"/>`;
    [0, .25, .5, .75].forEach(f => { const a = f * 6.2832 - 1.5708, rr = R + gap * .6; s += `<text x="${cx + Math.cos(a) * (rr + 14)}" y="${cy + Math.sin(a) * (rr + 14) + 4}" font-size="10" fill="${MUTE}" text-anchor="middle">${f * 100}%</text>`; });
    s += plus(cx, cy, .5);
    d.forEach((x, i) => {
      const r = R - i * gap, k = clamp(P * 1.25 - i * .08), a1 = -1.5708 + 6.2832 * x.v / 100 * ease(k);
      s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${TRACK}" stroke-width="${sw}" opacity=".55"/>`;
      if (k > 0) {
        const large = a1 + 1.5708 > Math.PI ? 1 : 0, ex = cx + Math.cos(a1) * r, ey = cy + Math.sin(a1) * r;
        s += `<path d="M${cx} ${cy - r}A${r} ${r} 0 ${large} 1 ${ex} ${ey}" fill="none" stroke="${x.c}" stroke-width="${sw}" stroke-linecap="round"/>`;
        if (k > .9) { const o = (k - .9) * 10; s += `<g opacity="${o}">${pill(ex + Math.cos(a1) * (sw / 2 + 4) + (Math.cos(a1) < -.2 ? -2 : 6), ey + Math.sin(a1) * (sw / 2 + 4), x.v + '%', x.c, Math.cos(a1) < -.2 ? 'end' : 'start')}</g>`; }
      }
      if (!narrow) s += `<text x="${cx - 12}" y="${cy - r + 5}" text-anchor="end" font-size="13" fill="${INK}">${esc(x.l)}</text>`;
      else s += `<circle cx="6" cy="${h - legH + 16 + i * 26}" r="5" fill="${x.c}"/><text x="20" y="${h - legH + 21 + i * 26}" font-size="13" fill="${INK}">${esc(x.l)}</text>`;
    });
    return s;
  }
  // dot plot with thin stems on a measured axis, + marks on grid intersections
  lollipop(d, w, h, P) {
    const max = parseFloat(this.getAttribute('max')) || 60, step = max <= 30 ? 5 : 10;
    const L = 0, T = 30, B = h - 26, Rr = w - 72, row = (B - T) / d.length, X = v => L + (Rr - L) * v / max;
    let s = '';
    for (let v = 0; v <= max; v += step) { const x = X(v); s += `<line x1="${x}" y1="${T - 10}" x2="${x}" y2="${B}" stroke="${LINE}" ${v ? 'stroke-dasharray="2 4"' : ''}/><text x="${x}" y="${h - 6}" font-size="10" text-anchor="middle" fill="${MUTE}">${v}%</text>`; s += plus(x, B, .4); }
    d.forEach((x, i) => {
      const y = T + row * i + row * .62, k = clamp(P * 1.3 - i * .06), xv = X(x.v * ease(k)), hi = i === 0;
      s += `<text x="${L}" y="${y - 13}" font-size="14" fill="${INK}" font-weight="${hi ? 700 : 400}">${esc(x.l)}</text>`;
      s += `<line x1="${X(0)}" y1="${y}" x2="${Rr}" y2="${y}" stroke="${TRACK}" stroke-width="1"/>`;
      s += `<line x1="${X(0)}" y1="${y}" x2="${xv}" y2="${y}" stroke="${x.c}" stroke-width="2"/>`;
      s += `<circle cx="${xv}" cy="${y}" r="13" fill="${x.c}" opacity=".14"/><circle cx="${xv}" cy="${y}" r="6.5" fill="${x.c}"/>`;
      if (k > .85) s += `<g opacity="${(k - .85) / .15}">${pill(xv + 18, y, x.v + '%', x.c, 'start')}</g>`;
    });
    return s;
  }
  // small-multiple 10×10 unit charts; each dot = 1% of respondents
  waffle(d, w, h, P) {
    const cols = w < 700 ? 2 : d.length, rows = Math.ceil(d.length / cols), cw = w / cols, chh = h / rows;
    const g = Math.min((cw - 24) / 10, (chh - 92) / 10), r = g * .32;
    let s = '';
    d.forEach((x, i) => {
      const ox = (i % cols) * cw + (cw - g * 10) / 2, oy = Math.floor(i / cols) * chh + 4, on = Math.round(x.v * clamp(P * 1.2 - i * .07));
      for (let j = 0; j < 100; j++) {
        const cx = ox + (j % 10) * g + g / 2, cy = oy + (9 - Math.floor(j / 10)) * g + g / 2, f = j < on;
        s += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(f ? r * 1.12 : r * .78).toFixed(2)}" fill="${f ? x.c : TRACK}"/>`;
      }
      const ty = oy + g * 10 + 34;
      s += plus(ox - 8, oy - 2, .35) + plus(ox + g * 10 + 8, oy - 2, .35);
      s += `<text x="${ox}" y="${ty}" font-size="30" font-weight="700" fill="${INK}" letter-spacing="-.5">${on}%</text>`;
      s += wrap(ox, ty + 22, x.l, Math.max(14, Math.floor((cw - 16) / 7.4)), 14, '#303D52', 18);
    });
    return s;
  }
  // polar-area (rose) chart: wedge area proportional to value
  rose(d, w, h, P) {
    const max = parseFloat(this.getAttribute('max')) || 60, n = d.length, cx = w / 2, cy = h / 2, R = Math.min(h / 2 - 66, w / 2 - 170);
    const rv = v => R * Math.sqrt(v / max);
    let s = '';
    [.25, .5, .75, 1].forEach(f => { const r = rv(max * f); s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${LINE}" stroke-dasharray="2 4"/>`; });
    s += `<line x1="${cx - R - 12}" y1="${cy}" x2="${cx + R + 12}" y2="${cy}" stroke="${LINE}"/><line x1="${cx}" y1="${cy - R - 12}" x2="${cx}" y2="${cy + R + 12}" stroke="${LINE}"/>`;
    const sl = 6.2832 / n, pad = .035;
    d.forEach((x, i) => {
      const k = ease(clamp(P * 1.3 - i * .07)), r = Math.max(.01, rv(x.v) * k), a0 = -1.5708 + i * sl + pad, a1 = a0 + sl - pad * 2, am = (a0 + a1) / 2;
      s += `<path d="M${cx} ${cy}L${cx + Math.cos(a0) * r} ${cy + Math.sin(a0) * r}A${r} ${r} 0 0 1 ${cx + Math.cos(a1) * r} ${cy + Math.sin(a1) * r}Z" fill="${x.c}" fill-opacity="${i === 0 ? .92 : .62}"/>`;
      const lr = rv(max) + 18, lx = cx + Math.cos(am) * lr, ly = cy + Math.sin(am) * lr, right = Math.cos(am) > .15, left = Math.cos(am) < -.15, an = right ? 'start' : left ? 'end' : 'middle';
      const dy = Math.sin(am) > .5 ? 14 : Math.sin(am) < -.5 ? -18 : 0;
      s += `<line x1="${cx + Math.cos(am) * (r + 3)}" y1="${cy + Math.sin(am) * (r + 3)}" x2="${cx + Math.cos(am) * (lr - 6)}" y2="${cy + Math.sin(am) * (lr - 6)}" stroke="${x.c}" stroke-opacity=".35" stroke-dasharray="1 3"/>`;
      const lines = Math.ceil(x.l.length / 24) > 1 ? 2 : 1, up = Math.sin(am) < -.5 ? (lines - 1) * 17 : 0;
      s += `<g opacity="${clamp((k - .6) / .4)}">${wrap(lx, ly + dy - up, x.l, 24, 13, INK, 17, an)}${pill(lx, ly + dy - up + (lines - 1) * 17 + 20, x.v + '%', x.c, an)}</g>`;
    });
    [.25, .5, .75, 1].forEach(f => { const r = rv(max * f); s += `<text x="${cx - r}" y="${cy + 14}" font-size="10" fill="${MUTE}" text-anchor="middle" paint-order="stroke" stroke="#fff" stroke-width="3">${Math.round(max * f)}%</text>`; });
    s += plus(cx, cy, .6);
    return s;
  }
  // 100 particles around a ring, coloured by share (part-to-whole)
  dotring(d, w, h, P) {
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 18, on = Math.round(100 * P);
    let s = `<circle cx="${cx}" cy="${cy}" r="${R + 14}" fill="none" stroke="${LINE}" stroke-dasharray="2 5"/><circle cx="${cx}" cy="${cy}" r="${R - 16}" fill="none" stroke="${LINE}"/>`;
    const seq = []; d.forEach(x => { for (let j = 0; j < Math.round(x.v); j++) seq.push(x.c); });
    for (let j = 0; j < 100; j++) {
      const a = -1.5708 + j / 100 * 6.2832, col = seq[j] || TRACK, vis = j < on;
      s += `<circle cx="${(cx + Math.cos(a) * R).toFixed(1)}" cy="${(cy + Math.sin(a) * R).toFixed(1)}" r="${vis ? 5.2 : 2.4}" fill="${vis ? col : TRACK}"/>`;
    }
    [0, .25, .5, .75].forEach(f => { const a = -1.5708 + f * 6.2832; s += plus(cx + Math.cos(a) * (R + 14), cy + Math.sin(a) * (R + 14), .5); });
    const c = this.getAttribute('center'), cs = this.getAttribute('centersub');
    if (c) s += `<text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="${Math.round(R * .34)}" font-weight="700" fill="${INK}" letter-spacing="-1">${esc(c)}</text>`;
    if (cs) s += `<text x="${cx}" y="${cy + R * .34}" text-anchor="middle" font-size="13" fill="#303D52">${esc(cs)}</text>`;
    return s;
  }
  // squarified treemap (part-to-whole); tile area proportional to share
  treemap(d, w, h, P) {
    const items = d.map((x, i) => ({ ...x, i })).sort((a, b) => b.v - a.v), tot = items.reduce((a, x) => a + x.v, 0), out = [];
    const worst = (row, side, sc) => { const s = row.reduce((a, x) => a + x.v * sc, 0), mx = Math.max(...row.map(x => x.v * sc)), mn = Math.min(...row.map(x => x.v * sc)); return Math.max(side * side * mx / (s * s), s * s / (side * side * mn)); };
    let x0 = 0, y0 = 0, W = w, H = h, rest = items.slice(), sc = w * h / tot;
    while (rest.length) {
      const side = Math.min(W, H); let row = [rest[0]], k = 1;
      while (k < rest.length && worst(row.concat(rest[k]), side, sc) <= worst(row, side, sc)) { row.push(rest[k]); k++; }
      const area = row.reduce((a, x) => a + x.v * sc, 0);
      if (W >= H) { const cw = area / H; let yy = y0; row.forEach(x => { const hh = x.v * sc / cw; out.push({ x, rx: x0, ry: yy, rw: cw, rh: hh }); yy += hh; }); x0 += cw; W -= cw; }
      else { const ch = area / W; let xx = x0; row.forEach(x => { const ww = x.v * sc / ch; out.push({ x, rx: xx, ry: y0, rw: ww, rh: ch }); xx += ww; }); y0 += ch; H -= ch; }
      rest = rest.slice(k);
    }
    let s = '';
    out.forEach((t, j) => {
      const k = ease(clamp(P * 1.4 - j * .12)), g = 3, rw = Math.max(0, t.rw - g), rh = Math.max(0, (t.rh - g) * k), ry = t.ry + (t.rh - g) - rh;
      const dark = [C.m, C.b].includes(t.x.c), tc = dark ? '#fff' : INK;
      s += `<rect x="${t.rx}" y="${ry}" width="${rw}" height="${rh}" rx="3" fill="${t.x.c}"/>`;
      if (k > .7 && rw > 44 && rh > 34) {
        const big = Math.min(56, Math.max(18, Math.sqrt(rw * rh) * .2));
        s += `<g opacity="${(k - .7) / .3}"><text x="${t.rx + 14}" y="${ry + 14 + big * .8}" font-size="${big}" font-weight="700" fill="${tc}" letter-spacing="-.5">${t.x.v}%</text>`;
        if (rh > big + 46 && rw > 150) s += wrap(t.rx + 14, ry + big + 38, t.x.l, Math.floor(rw / 7.6), 13, tc, 17);
        s += '</g>';
        s += plus(t.rx + rw - 12, ry + 12, dark ? .0 : .35);
      }
    });
    return s;
  }
  // packed bubbles; circle area proportional to share, gentle float
  bubbles(d, w, h, P) {
    const it = d.map(x => ({ ...x, r: Math.sqrt(x.v) })).sort((a, b) => b.r - a.r), pl = [];
    it.forEach((c, i) => {
      if (!i) { c.x = 0; c.y = 0; pl.push(c); return; }
      let best = null;
      const tryAt = (x, y) => { if (pl.every(o => Math.hypot(o.x - x, o.y - y) >= o.r + c.r + 1.2)) { const dd = Math.hypot(x, y * 1.6); if (!best || dd < best.d) best = { x, y, d: dd }; } };
      pl.forEach(a => { for (let t = 0; t < 72; t++) { const an = t / 72 * 6.2832; tryAt(a.x + Math.cos(an) * (a.r + c.r + 1.2), a.y + Math.sin(an) * (a.r + c.r + 1.2)); } });
      c.x = best.x; c.y = best.y; pl.push(c);
    });
    const mnx = Math.min(...pl.map(c => c.x - c.r)), mxx = Math.max(...pl.map(c => c.x + c.r)), mny = Math.min(...pl.map(c => c.y - c.r)), mxy = Math.max(...pl.map(c => c.y + c.r));
    const sc = Math.min((w - 20) / (mxx - mnx), (h - 20) / (mxy - mny)), ox = w / 2 - (mnx + mxx) / 2 * sc, oy = h / 2 - (mny + mxy) / 2 * sc, tm = performance.now() / 1000;
    let s = plus(10, 10, .35) + plus(w - 10, 10, .35) + plus(10, h - 10, .35) + plus(w - 10, h - 10, .35);
    pl.forEach((c, i) => {
      const k = ease(clamp(P * 1.4 - i * .1)), R = c.r * sc * (.9 + .1 * k) * k, fx = Math.sin(tm * .5 + i * 1.7) * 3, fy = Math.cos(tm * .4 + i * 2.3) * 3;
      const cx = ox + c.x * sc + fx, cy = oy + c.y * sc + fy, dark = [C.m, C.b].includes(c.c), tc = dark ? '#fff' : INK;
      if (R < 1) return;
      s += `<circle cx="${cx}" cy="${cy}" r="${R + 10}" fill="${c.c}" opacity=".07"/><circle cx="${cx}" cy="${cy}" r="${R}" fill="${c.c}"/>`;
      s += `<circle cx="${cx - R * .3}" cy="${cy - R * .35}" r="${R * .55}" fill="#fff" opacity="${dark ? .07 : .25}"/>`;
      if (k > .75) { const big = Math.max(18, R * .42); s += `<g opacity="${(k - .75) * 4}"><text x="${cx}" y="${cy + big * .25}" text-anchor="middle" font-size="${big}" font-weight="700" fill="${tc}" letter-spacing="-.5">${c.v}%</text>${wrap(cx, cy + big * .25 + 22, c.l, Math.max(10, Math.floor(R * 1.5 / 7.4)), 13, tc, 16, 'middle')}</g>`; }
    });
    return s;
  }
}
if (!customElements.get('bmc-viz')) customElements.define('bmc-viz', BmcViz);
