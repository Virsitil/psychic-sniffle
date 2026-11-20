// Story graphic: intelligence (top lobe) → orchestration (crossing) → outcomes (bottom lobe). Scroll drives assembly + flow.
class ParticleStory extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%';
    const c = this.canvas = document.createElement('canvas');
    c.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(c); this.ctx = c.getContext('2d');
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.cur = 0; this.flowS = 0; this.S = 6;
    let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    this.ps = [];
    for (let k = 0; k < this.S; k++) for (let i = 0; i < 200; i++) this.ps.push({ k, u: i / 200 + rnd() * 0.002, sz: 2.52 + rnd() * 2.24, delay: rnd() * 0.45, x: rnd(), y: rnd() });
    this.build();
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(this);
    this.io = new IntersectionObserver(es => { this.visible = es[0].isIntersecting; if (this.visible) this.kick(); }); this.io.observe(this);
    this.resize();
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
    const g = 0.05, c1 = -0.5, c2 = 0.55;
    this.paths = [];
    for (let k = 0; k < this.S; k++) {
      const r1 = 0.38 - (this.S - 1) * g + k * g, r2 = 0.6 - k * g, be = Math.acos((r1 + r2) / (c2 - c1));
      const pts = [], N = 150;
      const P = (c, r, an) => [c + r * Math.cos(an), -r * Math.sin(an)];
      const line = (p, q) => { for (let i = 0; i < 40; i++) pts.push([p[0] + (q[0] - p[0]) * i / 40, p[1] + (q[1] - p[1]) * i / 40]); };
      line(P(c1, r1, be), P(c2, r2, Math.PI + be));
      for (let i = 0; i < N; i++) pts.push(P(c2, r2, Math.PI + be + (2 * Math.PI - 2 * be) * i / N));
      line(P(c2, r2, Math.PI - be), P(c1, r1, -be));
      for (let i = 0; i < N; i++) pts.push(P(c1, r1, -be - (2 * Math.PI - 2 * be) * i / N));
      const cum = [0]; for (let i = 1; i <= pts.length; i++) { const p = pts[i - 1], q = pts[i % pts.length]; cum.push(cum[i - 1] + Math.hypot(q[0] - p[0], q[1] - p[1])); }
      this.paths.push({ pts, cum, L: cum[cum.length - 1] });
    }
    // crossing point x where top lobe meets bottom lobe
    this.cross = c1 + (c2 - c1) * (0.38 - (this.S - 1) * g + 2.5 * g) / (0.38 - (this.S - 1) * g + 0.6);
  }
  pt(u, k) {
    const { pts, cum, L } = this.paths[k], d = (((u % 1) + 1) % 1) * L;
    let lo = 0, hi = pts.length; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= d) lo = m; else hi = m; }
    const p = pts[lo], q = pts[(lo + 1) % pts.length], f = (d - cum[lo]) / ((cum[lo + 1] - cum[lo]) || 1);
    return [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f];
  }
  frame(now) {
    this.raf = 0; if (!this.visible) return;
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000); this.last = now;
    const sec = this.closest('section'), vh = innerHeight;
    let p = 1;
    if (sec) { const r = sec.getBoundingClientRect(); p = Math.max(0, Math.min(1, (vh - r.top) / (r.height + vh * 0.2))); }
    const target = this.reduce ? 1 : Math.max(0, Math.min(1, (p - 0.08) / 0.3));
    this.cur += (target - this.cur) * Math.min(1, dt * 4);
    // flow = slow drift + scroll position, eased so scrolling pushes particles along the strands
    const flowT = this.reduce ? 0 : now / 1000 * 0.025 + p * 1.4;
    this.flowS += (flowT - this.flowS) * Math.min(1, dt * 5);
    const { ctx, w, h, S } = this;
    ctx.clearRect(0, 0, w, h);
    const A = Math.max(10, Math.min((h - 72) / 2.03, w / 1.3)), ox = w * 0.42, oy = h * 0.5 - A * 0.135;
    const X = (sx, sy) => ox + sy * A, Y = (sx, sy) => oy + sx * A; // rotate: shape x → screen y
    const sm = v => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
    const mix = sxv => sm((sxv + 0.35) / 0.7); // 0 top (intelligence, coral) → 1 bottom (outcomes, blue)
    const col = (m, k) => { const q = Math.min(1, m + (k === 0 ? 0.15 : 0)); return [Math.round(255 + (64 - 255) * q), Math.round(90 + (64 - 90) * q), Math.round(77 + (217 - 77) * q)]; };
    if (this.cur > 0.05) {
      ctx.lineWidth = 1;
      for (let k = 0; k < S; k++) {
        ctx.beginPath();
        for (let i = 0; i <= 200; i++) { const [sx, sy] = this.pt(i / 200, k); i ? ctx.lineTo(X(sx, sy), Y(sx, sy)) : ctx.moveTo(X(sx, sy), Y(sx, sy)); }
        ctx.strokeStyle = '#052140'; ctx.globalAlpha = 0.09 * this.cur; ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    for (const pt of this.ps) {
      const [sx, sy] = this.pt(pt.u + this.flowS * (pt.k % 2 ? 1 : 0.88), pt.k);
      const tx = X(sx, sy), ty = Y(sx, sy);
      const kk = Math.max(0, Math.min(1, (this.cur - pt.delay) / (1 - pt.delay))), e = kk * kk * (3 - 2 * kk);
      const px = pt.x * w + (tx - pt.x * w) * e, py = pt.y * h + (ty - pt.y * h) * e;
      const [r, g, b] = col(mix(sx) * e, pt.k);
      ctx.fillStyle = `rgb(${r},${g},${b})`; ctx.globalAlpha = 0.3 + 0.65 * e;
      ctx.beginPath(); ctx.arc(px, py, pt.sz / 2, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    // labels
    const L = Math.max(0, (this.cur - 0.6) / 0.4);
    if (L > 0) {
      ctx.globalAlpha = L;
      ctx.font = '600 11px "Plus Jakarta Sans", Tenorite, sans-serif'; ctx.textBaseline = 'middle';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '2px';
      const topY = Y(-0.5 - 0.38, 0), botY = Y(0.55 + 0.6, 0), crossY = Y(this.cross, 0);
      ctx.textAlign = 'center'; ctx.fillStyle = '#FF5A4D'; ctx.fillText('INTELLIGENCE', ox, topY - 22);
      ctx.fillStyle = '#4040D9'; ctx.fillText('OUTCOMES', ox, botY + 22);
      ctx.textAlign = 'left'; ctx.fillStyle = '#052140';
      let lx = ox + A * 0.62; const tw = ctx.measureText('ORCHESTRATION').width; if (lx + 14 + tw > w - 2) lx = w - 2 - tw - 14;
      ctx.fillText('ORCHESTRATION', lx + 14, crossY);
      ctx.strokeStyle = '#052140'; ctx.globalAlpha = L * 0.35; ctx.beginPath(); ctx.moveTo(ox + A * 0.12, crossY); ctx.lineTo(lx + 6, crossY); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    this.kick();
  }
}
if (!customElements.get('particle-story')) customElements.define('particle-story', ParticleStory);
