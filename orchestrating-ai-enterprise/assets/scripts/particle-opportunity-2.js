// Finding 08 concepts. mode: "extend" | "rings" | "network"
class ParticleOpportunity extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%';
    const c = this.canvas = document.createElement('canvas');
    c.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(c); this.ctx = c.getContext('2d');
    this.mode = this.getAttribute('mode') || 'extend';
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let s = 9; this.rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    this.ro = new ResizeObserver(() => { this.resize(); this.build(); }); this.ro.observe(this);
    this.io = new IntersectionObserver(es => { this.visible = es[0].isIntersecting; if (this.visible) { if (!this.t0) this.t0 = performance.now(); this.kick(); } else this.t0 = 0; }, { threshold: 0.2 });
    this.io.observe(this); this.resize(); this.build();
  }
  disconnectedCallback() { cancelAnimationFrame(this.raf); this.raf = 0; this.ro.disconnect(); this.io.disconnect(); }
  kick() { if (!this.raf) this.raf = requestAnimationFrame(t => this.frame(t)); }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.w = this.clientWidth || 1; this.h = this.clientHeight || 1;
    this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  build() {
    const { w, h, rnd } = this;
    if (this.mode === 'extend3d') {
      const sm = w < 700, cols = sm ? 5 : 7, rows = cols, dep = cols;
      this.E = 2; this.cols = cols; this.rows = rows; this.dep = dep; this.slots = [];
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) for (let z = 0; z < dep; z++)
        this.slots.push({ c, r, z, X: -1 + 2 * c / (cols - 1), Y: -1 + 2 * r / (rows - 1), Z: -1 + 2 * z / (dep - 1), sx: w * (0.55 + rnd() * 0.55), sy: rnd() * h, vx: -(0.02 + rnd() * 0.03), ph: rnd() * 6.28, d: rnd(), coral: rnd() < 0.32, sz: 2.94 + rnd() * 4.62 });
      this.idx = (c, r, z) => (c * rows + r) * dep + z;
      this.cycle = (cols - this.E) * 0.7 + 4;
    } else if (this.mode === 'extend') {
      const cols = 14, rows = 11, gx = w * 0.84 / (cols - 1), gy = h * 0.76 / (rows - 1), x0 = w * 0.1, y0 = h * 0.12; this.gx = gx; this.gy = gy;
      this.E = 5; this.cols = cols; this.rows = rows;
      this.slots = [];
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) this.slots.push({ c, r, x: x0 + c * gx, y: y0 + r * gy, sx: w * (0.6 + rnd() * 0.5), sy: rnd() * h, vx: -(0.02 + rnd() * 0.03), ph: rnd() * 6.28, d: rnd() * 0.5 });
      this.cycle = (cols - this.E) * 0.9 + 4;
    } else if (this.mode === 'rings') {
      const cx = w / 2, cy = h / 2, S = Math.min(w, h);
      this.rings = [0.1, 0.17, 0.24, 0.32, 0.4, 0.48].map((r, k) => ({ r: r * S, k, n: Math.round(14 + k * 9), est: k < 3 }));
      this.pts = [];
      this.rings.forEach(rg => { for (let i = 0; i < rg.n; i++) this.pts.push({ rg, a: i / rg.n * 6.2832, sx: rnd() * w, sy: rnd() * h }); });
      this.cx = cx; this.cy = cy; this.cycle = 9;
    } else {
      const n = 46; this.nodes = [];
      for (let i = 0; i < n; i++) { const a = rnd() * 6.28, r = Math.sqrt(rnd()) * 0.22; this.nodes.push({ x: w * (0.32 + Math.cos(a) * r * 1.3), y: h * (0.5 + Math.sin(a) * r * 1.6), est: true }); }
      for (let i = 0; i < 34; i++) { const a = -1.4 + rnd() * 2.8, r = 0.32 + rnd() * 0.5; const nd = { x: w * (0.32 + Math.cos(a) * r), y: h * (0.5 + Math.sin(a) * r * 0.95), est: false, t: 0.4 + i * 0.16 + rnd() * 0.1 }; if (nd.x < w * 0.97 && nd.y > h * 0.05 && nd.y < h * 0.95) this.nodes.push(nd); }
      const near = (p, pool) => { let b = null, bd = 1e9; for (const q of pool) { if (q === p) continue; const d = (q.x - p.x) ** 2 + (q.y - p.y) ** 2; if (d < bd) { bd = d; b = q; } } return b; };
      const est = this.nodes.filter(n => n.est);
      this.links = [];
      est.forEach(p => { const sorted = est.filter(q => q !== p).sort((a, b) => ((a.x - p.x) ** 2 + (a.y - p.y) ** 2) - ((b.x - p.x) ** 2 + (b.y - p.y) ** 2)); sorted.slice(0, 2).forEach(q => this.links.push({ a: p, b: q, t: 0 })); });
      const placed = [...est];
      this.nodes.filter(n => !n.est).sort((a, b) => a.t - b.t).forEach(p => { const q = near(p, placed); this.links.push({ a: q, b: p, t: p.t + 0.5 }); placed.push(p); });
      this.cycle = 9;
    }
  }
  frame(now) {
    this.raf = 0; if (!this.visible) return;
    const { ctx, w, h } = this, T = this.reduce ? 1e6 : (now - this.t0) / 1000;
    const t = this.reduce ? this.cycle - 1 : T % this.cycle, fadeOut = Math.max(0, (t - (this.cycle - 1)) / 1);
    ctx.clearRect(0, 0, w, h);
    const sm = v => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
    const FS = this.FS || (this.FS = {}), dot = (x, y, r, col, a) => { if (a <= 0) return; ctx.fillStyle = FS[col] || (FS[col] = 'rgb(' + col + ')'); ctx.globalAlpha = Math.min(1, a); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1; };
    const BLUE = '117,140,229', CORAL = '255,90,77', DEEP = '64,64,217';
    if (this.mode === 'extend3d') {
      const { E, slots, cols, rows, dep, idx } = this, mo = this.reduce ? 0 : 1;
      const land = c => c < E ? 1 : sm((t - (c - E) * 0.7 - 0.2) / 0.8) * (1 - fadeOut);
      const cx = w * 0.54, cy = h * 0.5, S = Math.min(w * 0.22, h * 0.27), f = S * 4.2;
      const rot = -0.55 + Math.sin(T * 0.1 * mo) * 0.2, cr = Math.cos(rot), sr = Math.sin(rot), ti = 0.32, ct = Math.cos(ti), st = Math.sin(ti);
      for (const s of slots) { const x1 = s.X * cr - s.Z * sr, z1 = s.X * sr + s.Z * cr, y2 = s.Y * ct - z1 * st, z2 = s.Y * st + z1 * ct, k = f / (f - z2 * S); s.px = cx + x1 * S * k; s.py = cy + y2 * S * k; s.dn = Math.max(0, Math.min(1, (z2 + 1.6) / 3.2)); s.L = land(s.c); }
      ctx.lineWidth = 1;
      const link = (a, b, base) => { const o = Math.min(a.L, b.L); if (o < 0.95) return; ctx.strokeStyle = 'rgba(' + BLUE + ',' + (base * (0.35 + 0.65 * (a.dn + b.dn) / 2)).toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(a.px, a.py); ctx.lineTo(b.px, b.py); ctx.stroke(); };
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) for (let z = 0; z < dep; z++) {
        const a = slots[idx(c, r, z)];
        if (c < cols - 1) link(a, slots[idx(c + 1, r, z)], 0.2);
        if (r < rows - 1) link(a, slots[idx(c, r + 1, z)], 0.12);
        if (z < dep - 1) link(a, slots[idx(c, r, z + 1)], 0.1);
      }
      ctx.globalCompositeOperation = 'source-over';
      const ord = slots.slice().sort((a, b) => a.dn - b.dn);
      for (const s of ord) {
        const L = s.L;
        let fx = (s.sx + s.vx * w * T) % (w * 1.1); if (fx < -w * 0.05) fx += w * 1.1; fx = Math.max(w * 0.45, fx);
        const fy = s.sy + Math.sin(T * 0.8 + s.ph) * 12;
        const x = fx + (s.px - fx) * L, y = fy + (s.py - fy) * L;
        const depth = 0.55 + 0.45 * s.dn * L + 0.27 * (1 - L);
        const a = (0.35 + 0.65 * L) * depth, sz = s.sz * (0.8 + 0.7 * depth) / 2;
        const landed = sm((L - 0.7) / 0.3), coral = s.coral || landed < 1 && s.c >= E;
        if (s.c >= E && landed < 1) dot(x, y, sz, CORAL, a * (1 - landed));
        const ka = s.c < E ? 1 : landed;
        if (ka > 0) {
          if (s.coral) dot(x, y, sz, CORAL, a * ka);
          else { dot(x, y, sz, DEEP, a * 1.25 * ka); dot(x, y, sz * 2, BLUE, a * 0.35 * ka); }
        }
      }
    } else if (this.mode === 'extend') {
      const { E, rows, slots } = this;
      const land = c => c < E ? 1 : sm((t - (c - E) * 0.9 - 0.3) / 0.9) * (1 - fadeOut);
      ctx.lineWidth = 1;
      for (const s of slots) {
        const L = land(s.c);
        if (s.c > 0 && L > 0.95) { const Lp = land(s.c - 1); ctx.strokeStyle = `rgba(${BLUE},${(0.28 * Math.min(L, Lp)).toFixed(3)})`; ctx.beginPath(); ctx.moveTo(s.x - this.gx, s.y); ctx.lineTo(s.x, s.y); ctx.stroke(); }
        if (s.r > 0 && L > 0.95) { ctx.strokeStyle = `rgba(${BLUE},${(0.18 * L).toFixed(3)})`; ctx.beginPath(); ctx.moveTo(s.x, s.y - this.gy); ctx.lineTo(s.x, s.y); ctx.stroke(); }
      }
      ctx.globalCompositeOperation = 'source-over';
      for (const s of slots) {
        const L = land(s.c);
        const glow = (x, y, a) => { dot(x, y, 2, DEEP, a); dot(x, y, 4.2, BLUE, a * 0.3); };
        if (s.c < E) { glow(s.x, s.y, 0.95); continue; }
        let fx = (s.sx + s.vx * w * T) % (w * 1.1); if (fx < -w * 0.05) fx += w * 1.1; fx = Math.max(w * 0.5, fx);
        const fy = s.sy + Math.sin(T * 0.8 + s.ph) * 12;
        const x = fx + (s.x - fx) * L, y = fy + (s.y - fy) * L;
        const k = sm((L - 0.7) / 0.3);
        if (k > 0) glow(x, y, 0.95 * k);
        dot(x, y, 2.4 + s.d * 2, CORAL, 0.85 * (1 - k));
      }
    } else if (this.mode === 'rings') {
      const { cx, cy, rings, pts } = this;
      const on = rg => rg.est ? 1 : sm((t - 0.6 - (rg.k - 3) * 1.8) / 1.4) * (1 - fadeOut);
      ctx.lineWidth = 1;
      rings.forEach(rg => { const o = on(rg); ctx.strokeStyle = `rgba(${rg.est ? BLUE : CORAL},${((rg.est ? 0.22 : 0.3) * o).toFixed(3)})`; ctx.beginPath(); ctx.arc(cx, cy, rg.r, 0, 6.2832); ctx.stroke(); });
      // spokes from each new ring back to the established core
      rings.filter(r => !r.est).forEach(rg => { const o = sm((on(rg) - 0.6) / 0.4); if (!o) return; const inner = rings[rg.k - 1]; const rot = T * 0.05 * (rg.k % 2 ? 1 : -1);
        for (let i = 0; i < rg.n; i += 3) { const a = i / rg.n * 6.2832 + rot; ctx.strokeStyle = `rgba(${BLUE},${(0.25 * o).toFixed(3)})`; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * inner.r, cy + Math.sin(a) * inner.r); ctx.lineTo(cx + Math.cos(a) * rg.r, cy + Math.sin(a) * rg.r); ctx.stroke(); } });
      ctx.globalCompositeOperation = 'source-over';
      for (const p of pts) {
        const rg = p.rg, o = on(rg), rot = T * 0.05 * (rg.k % 2 ? 1 : -1);
        const tx = cx + Math.cos(p.a + rot) * rg.r, ty = cy + Math.sin(p.a + rot) * rg.r;
        const x = p.sx + (tx - p.sx) * o, y = p.sy + (ty - p.sy) * o;
        if (rg.est) dot(tx, ty, 2.4, BLUE, 0.9);
        else { dot(x, y, 2.4, CORAL, 0.35 + 0.55 * o); }
      }
      dot(cx, cy, Math.min(w, h) * 0.05, DEEP, 0.5);
    } else {
      const show = n => n.est ? 1 : sm((t - n.t) / 0.6) * (1 - fadeOut);
      ctx.lineWidth = 1;
      for (const l of this.links) {
        const o = l.b.est ? 1 : sm((t - l.t) / 0.5) * (1 - fadeOut); if (o <= 0) continue;
        const ex = l.a.x + (l.b.x - l.a.x) * o, ey = l.a.y + (l.b.y - l.a.y) * o;
        ctx.strokeStyle = `rgba(${BLUE},${(l.b.est ? 0.25 : 0.45).toFixed(3)})`; ctx.beginPath(); ctx.moveTo(l.a.x, l.a.y); ctx.lineTo(ex, ey); ctx.stroke();
        if (!l.b.est && o > 0 && o < 1) dot(ex, ey, 2, CORAL, 0.9);
      }
      ctx.globalCompositeOperation = 'source-over';
      for (const n of this.nodes) {
        if (n.est) { dot(n.x, n.y, 3, BLUE, 0.9); continue; }
        const o = show(n), linked = sm((t - n.t - 0.5) / 0.5) * (1 - fadeOut);
        const jx = Math.sin(T * 1.3 + n.x) * 6 * (1 - linked), jy = Math.cos(T * 1.1 + n.y) * 6 * (1 - linked);
        dot(n.x + jx, n.y + jy, 3.2, CORAL, 0.85 * o);
        if (linked > 0) { ctx.strokeStyle = `rgba(${CORAL},${(0.5 * linked).toFixed(3)})`; ctx.beginPath(); ctx.arc(n.x, n.y, 6, 0, 6.2832); ctx.stroke(); }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    this.kick();
  }

}
if (!customElements.get('particle-opportunity')) customElements.define('particle-opportunity', ParticleOpportunity);
