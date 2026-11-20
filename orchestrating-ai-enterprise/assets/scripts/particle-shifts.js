// Section 2 shift graphics, story-style particles. mode: "columns" | "bowtie"
class ParticleShifts extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%';
    const c = this.canvas = document.createElement('canvas');
    c.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(c); this.ctx = c.getContext('2d');
    this.mode = this.getAttribute('mode') || 'columns';
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.cur = 0; this.target = 0;
    this.ro = new ResizeObserver(() => { this.resize(); this.build(); }); this.ro.observe(this);
    this.io = new IntersectionObserver(es => { const e = es[0]; this.visible = e.isIntersecting; this.target = e.intersectionRatio > 0.4 ? 1 : (e.isIntersecting ? this.target : 0); if (this.visible) this.kick(); }, { threshold: [0, 0.4] });
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
    const { w, h } = this; let s = 13; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const rings = [], lines = [];
    if (this.mode === 'columns') {
      const rows = 5, r = h / rows / 2 * 0.72, gx = r * 3.4, x0 = r + 2;
      const cols = [[0, 1, 3, 4], [0, 1, 2, 3, 4], [0, 0.75, 1.5, 2.5, 3.25, 4]];
      cols.forEach((rs, c) => {
        const cx = x0 + c * gx;
        rs.forEach(rr => rings.push({ cx, cy: r + rr * (h - 2 * r) / 4, r, c }));
        lines.push({ x: cx + r * 1.55, c });
      });
      this.nc = 3;
    } else if (this.mode === 'rows') {
      const r = Math.min((h - 4) / 9.35, (w - 4) / 10), gy = r * 3.4, y0 = r + 2;
      const rowsP = [[0, 1, 3, 4], [0, 1, 2, 3, 4], [0, 0.75, 1.5, 2.5, 3.25, 4]];
      rowsP.forEach((cs, c) => {
        const cy = y0 + c * gy;
        cs.forEach(cc => rings.push({ cx: r + 2 + cc * (w - 2 * r - 4) / 4, cy, r, c }));
        lines.push({ y: cy + r * 1.55, c });
      });
      this.nc = 3;
    } else if (this.mode === 'expand') {
      const cy = h / 2, cx = Math.min(w / 2, h / 2 + 2);
      [0.15, 0.3, 0.46].forEach((k, c) => rings.push({ cx, cy, r: h * k, c }));
      this.nc = 3;
    } else if (this.mode === 'adapt') {
      const r = h / 6.2, x0 = 2 + r * 1.5, x1 = w - 2 - r * 1.5;
      lines.push({ x: 2, c: 0 }); lines.push({ x: w - 2, c: 3 });
      for (let i = 0; i < 4; i++) rings.push({ cx: x0 + i * (x1 - x0) / 3, cy: h * (i % 2 ? 0.66 : 0.34), r, c: i });
      this.nc = 4;
    } else if (this.mode === 'rise') {
      const r = Math.min((h - 4) / 8.3, (w - 4) / 8.3), g = r * 2.1;
      [1, 2, 3, 4].forEach((n, c) => { for (let i = 0; i < n; i++) rings.push({ cx: 2 + r + c * g, cy: h - 2 - r - i * g, r, c }); });
      this.nc = 4;
    } else {
      const counts = [4, 3, 2, 3, 4], r = h / 4 / 2 * 0.8, gx = r * 2.05, x0 = r + 2;
      counts.forEach((n, c) => { for (let i = 0; i < n; i++) rings.push({ cx: x0 + c * gx, cy: h / 2 + (i - (n - 1) / 2) * r * 2.1, r, c }); });
      this.nc = counts.length;
    }
    this.rings = rings; this.lines = lines; this.ps = [];
    rings.forEach((g, gi) => { const n = Math.max(10, Math.round(g.r * 2.2)); for (let i = 0; i < n; i++) this.ps.push({ g, a: i / n * 6.2832 + rnd() * .1, sz: 2.52 + rnd() * 2.24, delay: rnd() * .45, x: rnd(), y: rnd(), dir: gi % 2 ? 1 : -1 }); });
    lines.forEach(l => { const n = Math.round((l.y != null ? w : h) / 4); for (let i = 0; i < n; i++) this.ps.push({ l, u: i / n, sz: 2.24 + rnd() * 1.68, delay: rnd() * .45, x: rnd(), y: rnd() }); });
  }
  frame(now) {
    this.raf = 0; if (!this.visible) return;
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000); this.last = now;
    const tgt = this.reduce ? this.target : this.target;
    this.cur += (tgt - this.cur) * Math.min(1, this.reduce ? 1 : dt * 2.2);
    const { ctx, w, h, nc } = this, T = this.reduce ? 0 : now / 1000;
    ctx.clearRect(0, 0, w, h);
    const sm = v => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
    const col = q => `rgb(${Math.round(255 + (64 - 255) * q)},${Math.round(90 + (64 - 90) * q)},${Math.round(77 + (217 - 77) * q)})`;
    if (this.cur > 0.05) {
      ctx.lineWidth = 1; ctx.strokeStyle = '#052140'; ctx.globalAlpha = 0.09 * this.cur;
      for (const g of this.rings) { ctx.beginPath(); ctx.arc(g.cx, g.cy, g.r, 0, 6.2832); ctx.stroke(); }
      for (const l of this.lines) { ctx.beginPath(); if (l.y != null) { ctx.moveTo(0, l.y); ctx.lineTo(w, l.y); } else { ctx.moveTo(l.x, 0); ctx.lineTo(l.x, h); } ctx.stroke(); }
    }
    for (const p of this.ps) {
      let tx, ty, q;
      if (p.g) { const a = p.a + T * .35 * p.dir; tx = p.g.cx + Math.cos(a) * p.g.r; ty = p.g.cy + Math.sin(a) * p.g.r; q = p.g.c / Math.max(1, nc - 1); }
      else if (p.l.y != null) { tx = ((p.u + T * .06) % 1) * w; ty = p.l.y; q = p.l.c / Math.max(1, nc - 1); }
      else { tx = p.l.x; ty = ((p.u + T * .06) % 1) * h; q = p.l.c / Math.max(1, nc - 1); }
      const k = Math.max(0, Math.min(1, (this.cur - p.delay) / (1 - p.delay))), e = sm(k);
      const x = p.x * w + (tx - p.x * w) * e, y = p.y * h + (ty - p.y * h) * e;
      ctx.fillStyle = col(q * e); ctx.globalAlpha = (0.3 + 0.65 * e) * (p.l ? 0.7 : 1);
      ctx.beginPath(); ctx.arc(x, y, p.sz / 2, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    this.kick();
  }
}
if (!customElements.get('particle-shifts')) customElements.define('particle-shifts', ParticleShifts);
