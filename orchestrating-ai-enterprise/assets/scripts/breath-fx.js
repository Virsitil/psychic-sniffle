// <breath-fx> — light parallax graphics for the breath spreads.
// Variant is read live from <html data-breath-fx="a|b|c"> so the review switcher can flip all three spreads at once.
const sm = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const rng = seed => { let q = seed % 2147483647 || 7; return () => (q = (q * 16807) % 2147483647) / 2147483647; };
const TINT = { sky: ['#B9C8F5', '#C4E6FA', '#FFC7C0', '#9FAEEE'], lilac: ['#B5B8F0', '#CEC8F7', '#FFC4BD', '#93A4EA'] };

class BreathFx extends HTMLElement {
  connectedCallback() {
    if (this.c) return;
    this.style.cssText = 'position:absolute;inset:0;display:block;pointer-events:none';
    this.c = document.createElement('canvas'); this.c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
    this.appendChild(this.c); this.x = this.c.getContext('2d');
    this.sec = this.closest('section');
    this.seed = [...(this.getAttribute('seed') || 'x')].reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) >>> 0;
    this.tint = TINT[this.getAttribute('tint')] || TINT.sky; this.mode = this.getAttribute('mode') || '';
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fit = () => { const r = this.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1); this.w = r.width; this.h = r.height; this.c.width = r.width * d; this.c.height = r.height * d; this.x.setTransform(d, 0, 0, d, 0, 0); this.build(); };
    new ResizeObserver(fit).observe(this); fit();
    const loop = now => { if (!this.isConnected) return; const r = this.getBoundingClientRect(); if (r.bottom > -100 && r.top < innerHeight + 100) this.draw(now / 1000, r); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  build() {
    const R = rng(this.seed), w = this.w, h = this.h, zone = (x, y) => Math.abs(x - .5) < .3 && Math.abs(y - .5) < .26; // keep the headline area clear
    // A: soft gradient strata
    this.blobs = Array.from({ length: 6 }, (_, i) => ({ x: R(), y: R(), rx: .22 + R() * .3, ry: .14 + R() * .2, c: this.tint[i % 4], a: i % 4 === 2 ? .6 : .85, z: .15 + R() * .55, ph: R() * 6.28 }));
    // B: particle drift at three depths
    this.dots = [];
    [[80, 1, 2, .38, .18], [42, 2, 3.6, .55, .42], [12, 6, 11, .28, .85]].forEach(([n, r0, r1, a, z]) => { for (let i = 0; i < n; i++) { let x, y, k = 0; do { x = R(); y = R(); } while (zone(x, y) && k++ < 8); this.dots.push({ x, y, r: r0 + R() * (r1 - r0), a, z, coral: R() < .12, ph: R() * 6.28 }); } });
    // C: hexagon lattice outlines
    this.hexes = [];
    for (let i = 0; i < 11; i++) { let x, y, k = 0; do { x = R(); y = R(); } while (zone(x, y) && k++ < 12); this.hexes.push({ x, y, s: 18 + R() * 120, z: .2 + R() * .7, rot: R() * 1.05, sp: (R() - .5) * .12, dot: R() < .35, coral: R() < .3, ph: R() * 6.28 }); }
    this.plus = []; for (let i = 0; i < 10; i++) { let x, y, k = 0; do { x = R(); y = R(); } while (zone(x, y) && k++ < 12); this.plus.push({ x, y, z: .1 + R() * .4 }); }
  }
  hex(cx, cy, r, rot) { const x = this.x; x.beginPath(); for (let i = 0; i < 6; i++) { const a = rot - Math.PI / 2 + i * Math.PI / 3, px = cx + r * Math.cos(a), py = cy + r * Math.sin(a); i ? x.lineTo(px, py) : x.moveTo(px, py); } x.closePath(); }
  draw(t, r) {
    const x = this.x, w = this.w, h = this.h, vh = innerHeight; if (!w) return;
    const p = (vh - r.top) / (vh + r.height), par = (p - .5) * 2; // -1 entering … 1 leaving
    const vis = sm(p / .25) * (1 - sm((p - .78) / .22)), T = this.reduce ? 0 : t;
    const v = document.documentElement.getAttribute('data-breath-fx') || 'b';
    x.clearRect(0, 0, w, h); if (vis <= 0) return;
    if (this.mode === 'road') { this.road(t, p, par, vis, T); x.globalAlpha = 1; return; }
    if (this.mode === 'rise') { this.rise(t, p, vis, T); x.globalAlpha = 1; return; }
    if (this.mode === 'stream') { this.stream(t, p, par, vis, T); x.globalAlpha = 1; return; }
    if (v === 'a') {
      for (const b of this.blobs) {
        const cx = (b.x + Math.sin(T * .05 + b.ph) * .03) * w, cy = b.y * h - par * b.z * h * .45;
        const g = x.createRadialGradient(0, 0, 0, 0, 0, 1); g.addColorStop(0, b.c); g.addColorStop(1, 'rgba(255,255,255,0)');
        x.save(); x.translate(cx, cy); x.scale(b.rx * w, b.ry * h * (1 + .08 * Math.sin(T * .1 + b.ph))); x.globalAlpha = b.a * vis; x.fillStyle = g; x.beginPath(); x.arc(0, 0, 1, 0, 6.2832); x.fill(); x.restore();
      }
    } else if (v === 'b') {
      for (const d of this.dots) {
        const cx = (d.x + Math.sin(T * .08 + d.ph) * .006) * w, cy = ((d.y - par * d.z * .55) % 1.2 + 1.2) % 1.2 * h - h * .1;
        const col = d.coral ? '255,90,77' : d.z > .5 ? '117,140,229' : '64,64,217';
        x.globalAlpha = d.a * vis;
        if (d.z > .8) { const g = x.createRadialGradient(cx, cy, 0, cx, cy, d.r * 2); g.addColorStop(0, `rgba(${col},.9)`); g.addColorStop(1, `rgba(${col},0)`); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, d.r * 2, 0, 6.2832); x.fill(); }
        else { x.fillStyle = `rgb(${col})`; x.beginPath(); x.arc(cx, cy, d.r, 0, 6.2832); x.fill(); }
      }
    } else {
      x.lineWidth = 1;
      for (const k of this.hexes) {
        const cx = k.x * w, cy = k.y * h - par * k.z * h * .5, rot = k.rot + par * k.sp * 4 + T * k.sp * .15;
        x.globalAlpha = (.2 + .35 * k.z) * vis; x.strokeStyle = '#758CE5'; this.hex(cx, cy, k.s, rot); x.stroke();
        if (k.s > 60) { x.globalAlpha *= .45; this.hex(cx, cy, k.s * .72, rot); x.stroke(); }
        if (k.dot) { const q = (T * .05 + k.ph) % 1 * 6, i = Math.floor(q), f = q - i, a0 = rot - Math.PI / 2 + i * Math.PI / 3, a1 = a0 + Math.PI / 3;
          const px = cx + k.s * (Math.cos(a0) + (Math.cos(a1) - Math.cos(a0)) * f), py = cy + k.s * (Math.sin(a0) + (Math.sin(a1) - Math.sin(a0)) * f);
          x.globalAlpha = .8 * vis; x.fillStyle = k.coral ? '#FF5A4D' : '#4040D9'; x.beginPath(); x.arc(px, py, 2.4, 0, 6.2832); x.fill(); }
      }
      x.strokeStyle = '#052140';
      for (const q of this.plus) { const px = q.x * w, py = q.y * h - par * q.z * h * .4; x.globalAlpha = .3 * vis; x.beginPath(); x.moveTo(px - 5, py); x.lineTo(px + 5, py); x.moveTo(px, py - 5); x.lineTo(px, py + 5); x.stroke(); }
    }
    x.globalAlpha = 1;
  }
  // fibre pathway: strands fan in from the floor, converge at the centre and rise as one column to the top of the section
  road(t, p, par, vis, T) {
    const x = this.x, w = this.w, h = this.h, cxm = w / 2, hj = h * .7 + par * 14, colW = Math.min(150, w * .12);
    const reveal = sm((p - .06) / .38);
    if (!this.lines) {
      const R = rng(this.seed + 5), cols = ['#4040D9', '#4040D9', '#758CE5', '#758CE5', '#914796'];
      this.lines = Array.from({ length: 170 }, (_, i) => { const u = R(), side = u - .5; return { xb: side * 1.5, xc: side * (.7 + R() * .3), bend: .55 + R() * .3, c: R() < .05 ? '#FF5A4D' : cols[Math.floor(R() * cols.length)], a: .14 + R() * .22, lw: .5 + R() * .7 }; });
      this.flow = Array.from({ length: 900 }, () => ({ l: Math.floor(R() * 170), s0: R(), sp: .035 + R() * .07, r: .8 + R() * 1.9, glow: R() < .2 }));
    }
    const A = .42; // share of each path spent in the fan before turning upward
    const pt = (L, s) => {
      const xb = cxm + L.xb * w, xc = cxm + L.xc * colW;
      if (s < A) { const q = s / A, y0 = h + 12, x1 = xb + (xc - xb) * L.bend, y1 = h * .95, x2 = xc, y2 = hj + (h - hj) * .35, mt = 1 - q;
        return [mt * mt * mt * xb + 3 * mt * mt * q * x1 + 3 * mt * q * q * x2 + q * q * q * xc, mt * mt * mt * y0 + 3 * mt * mt * q * y1 + 3 * mt * q * q * y2 + q * q * q * hj]; }
      const q = (s - A) / (1 - A); return [xc, hj - q * (hj + 10)];
    };
    const smax = reveal;
    // flipped: strands fan in from the top, converge and run down out of the section into the Conclusion below
    x.save(); x.translate(0, h); x.scale(1, -1);
    for (const L of this.lines) {
      x.globalAlpha = vis * L.a; x.strokeStyle = L.c; x.lineWidth = L.lw; x.beginPath();
      for (let k = 0; k <= 40; k++) { const s = k / 40 * smax, [px, py] = pt(L, s); k ? x.lineTo(px, py) : x.moveTo(px, py); }
      x.stroke();
    }
    for (const f of this.flow) {
      const s = (f.s0 + T * f.sp) % 1; if (s > smax) continue;
      const L = this.lines[f.l], [px, py] = pt(L, s), fadeTop = 1 - sm((s - .97) / .03), a = vis * fadeTop * sm((smax - s) / .05) * (.55 + .45 * Math.sin(T * 3 + f.s0 * 40));
      if (f.glow) { x.globalAlpha = a * .25; x.fillStyle = L.c; x.beginPath(); x.arc(px, py, f.r * 3, 0, 6.2832); x.fill(); }
      x.globalAlpha = a; x.fillStyle = L.c; x.beginPath(); x.arc(px, py, f.r, 0, 6.2832); x.fill();
    }
    x.restore();
    this.clearing(vis);
  }
  // soft clearing behind the headline so it stays legible over the strands
  clearing(vis) {
    const x = this.x, tb = this.sec && this.sec.querySelector('[data-breath-in]'), me = this.getBoundingClientRect();
    if (tb) { const r = tb.getBoundingClientRect(), mx = r.left - me.left + r.width / 2, my = r.top - me.top + r.height / 2, rx = r.width * .62 + 40, ry = r.height * .75 + 40;
      x.save(); x.translate(mx, my); x.scale(rx, ry); const g = x.createRadialGradient(0, 0, 0, 0, 0, 1);
      g.addColorStop(0, 'rgba(241,240,252,.92)'); g.addColorStop(.6, 'rgba(241,240,252,.7)'); g.addColorStop(1, 'rgba(241,240,252,0)');
      x.globalAlpha = vis; x.fillStyle = g; x.beginPath(); x.arc(0, 0, 1, 0, 6.2832); x.fill(); x.restore(); }
  }
  // a column of data falls from the top, fans into strands and fills an ascending bar chart from the floor up
  stream(t, p, par, vis, T) {
    const x = this.x, w = this.w, h = this.h, cxm = w / 2, cols = 9, per = 4, rowsMax = 20;
    const span = Math.min(w * .78, 1040), u = Math.min(span / (cols * 7.2), h * .24 / rowsMax), gap = u * 7.2;
    const x0 = cxm - (cols - 1) * gap / 2, base = h * .95, hj = h * .6 + par * 10, colW = Math.min(110, w * .09);
    const reveal = sm((p - .06) / .3);
    if (!this.bars) {
      const R = rng(this.seed + 13);
      this.bars = Array.from({ length: cols }, (_, i) => { const q = i / (cols - 1); return { n: Math.round(4 + (rowsMax - 4) * Math.pow(q, 1.15)), col: i === cols - 1 ? [255, 90, 77] : [Math.round(117 + (64 - 117) * q), Math.round(140 + (64 - 140) * q), Math.round(229 + (217 - 229) * q)] }; });
      this.strands = []; this.bars.forEach((b, i) => { for (let k = 0; k < 14; k++) this.strands.push({ i, xc: (R() - .5), xt: (R() - .5) * per * u * .9, a: .12 + R() * .2, lw: .5 + R() * .6, mix: R() < .3 }); });
      this.drops = Array.from({ length: 760 }, () => ({ s: Math.floor(R() * this.strands.length), s0: R(), sp: .05 + R() * .08, r: .8 + R() * 1.8, glow: R() < .18 }));
      this.dots = []; this.bars.forEach((b, i) => { for (let j = 0; j < b.n; j++) for (let k = 0; k < per; k++) this.dots.push({ i, j, k, sz: .8 + R() * .45, ph: R() * 6.28 }); });
    }
    const fill = this.bars.map((b, i) => sm((p - .26 - i * .028) / .24));
    const A = .56;
    const pt = (S, s) => {
      const b = this.bars[S.i], xc = cxm + S.xc * colW, xt = x0 + S.i * gap + S.xt, yt = base - Math.max(1, b.n * fill[S.i]) * u - u * .6;
      if (s < A) return [xc, -10 + (hj + 10) * s / A];
      const q = (s - A) / (1 - A), mt = 1 - q, y1 = hj + (yt - hj) * .55, y2 = yt - (yt - hj) * .5;
      return [mt * mt * mt * xc + 3 * mt * mt * q * xc + 3 * mt * q * q * xt + q * q * q * xt, mt * mt * mt * hj + 3 * mt * mt * q * y1 + 3 * mt * q * q * y2 + q * q * q * yt];
    };
    const colOf = S => S.mix ? '#914796' : `rgb(${this.bars[S.i].col})`;
    for (const S of this.strands) {
      x.globalAlpha = vis * S.a; x.strokeStyle = colOf(S); x.lineWidth = S.lw; x.beginPath();
      for (let k = 0; k <= 36; k++) { const [px, py] = pt(S, k / 36 * reveal); k ? x.lineTo(px, py) : x.moveTo(px, py); }
      x.stroke();
    }
    for (const d of this.drops) {
      const s = (d.s0 + T * d.sp) % 1; if (s > reveal) continue;
      const S = this.strands[d.s], [px, py] = pt(S, s), a = vis * sm(s / .06) * (1 - sm((s - .9) / .1)) * sm((reveal - s) / .05) * (.6 + .4 * Math.sin(T * 3 + d.s0 * 30));
      if (d.glow) { x.globalAlpha = a * .25; x.fillStyle = colOf(S); x.beginPath(); x.arc(px, py, d.r * 3, 0, 6.2832); x.fill(); }
      x.globalAlpha = a; x.fillStyle = colOf(S); x.beginPath(); x.arc(px, py, d.r, 0, 6.2832); x.fill();
    }
    for (const c of this.dots) {
      const b = this.bars[c.i], shown = b.n * fill[c.i]; if (c.j >= shown) continue;
      const e = Math.min(1, shown - c.j), px = x0 + c.i * gap + (c.k - (per - 1) / 2) * u, py = base - c.j * u, r = u * .3 * c.sz * (1 + .1 * Math.sin(T * 1.4 + c.ph));
      x.globalAlpha = vis * e * .2; x.fillStyle = `rgb(${b.col})`; x.beginPath(); x.arc(px, py, r * 2.1, 0, 6.2832); x.fill();
      x.globalAlpha = vis * e; x.beginPath(); x.arc(px, py, r, 0, 6.2832); x.fill();
    }
    this.clearing(vis);
  }
  // particles rise from below and settle into an ascending bar chart
  rise(t, p, vis, T) {
    const x = this.x, w = this.w, h = this.h, cols = 9, rowsMax = 22, per = 4;
    const span = Math.min(w * .82, 1100), u = Math.min(span / (cols * 7.2), h * .26 / rowsMax), gap = u * 7.2;
    const x0 = w / 2 - (cols - 1) * gap / 2, base = h * .92;
    if (!this.cells) {
      const R = rng(this.seed + 9); this.cells = [];
      for (let i = 0; i < cols; i++) { const n = Math.round(5 + (rowsMax - 5) * Math.pow(i / (cols - 1), 1.15));
        for (let j = 0; j < n; j++) for (let k = 0; k < per; k++) this.cells.push({ i, j, k, sx: R(), sy: R(), ph: R() * 6.28, sz: .8 + R() * .45, dl: i / cols * .35 + j / rowsMax * .18 + R() * .08, top: j >= n - 2 }); }
    }
    const build = (p - .12) / .42;
    for (const c of this.cells) {
      const e = sm((build - c.dl) / .35);
      const tx = x0 + c.i * gap + (c.k - (per - 1) / 2) * u, ty = base - c.j * u;
      const sx = x0 - gap + c.sx * (gap * (cols + 1)), sy = h + 30 + c.sy * h * .25;
      const px = sx + (tx - sx) * e + Math.sin(T * .8 + c.ph) * 3 * (1 - e), py = sy + (ty - sy) * e;
      const q = c.i / (cols - 1), col = c.top && c.i === cols - 1 ? [255, 90, 77] : [Math.round(117 + (64 - 117) * q), Math.round(140 + (64 - 140) * q), Math.round(229 + (217 - 229) * q)];
      const a = vis * (.35 + .65 * e), r = u * .3 * c.sz * (1 + .12 * Math.sin(T * 1.4 + c.ph) * e);
      if (e > .6) { x.globalAlpha = a * .2; x.fillStyle = `rgb(${col})`; x.beginPath(); x.arc(px, py, r * 2.1, 0, 6.2832); x.fill(); }
      x.globalAlpha = a; x.fillStyle = `rgb(${col})`; x.beginPath(); x.arc(px, py, r, 0, 6.2832); x.fill();
    }
  }

}
if (!customElements.get('breath-fx')) customElements.define('breath-fx', BreathFx);
