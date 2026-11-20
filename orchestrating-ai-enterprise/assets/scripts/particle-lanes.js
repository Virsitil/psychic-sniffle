// Paradox: unorchestrated = one coral stream wandering off course; orchestrated = particles turn electric blue and settle into the
// "intelligence -> orchestration -> outcomes" figure-eight strands from the Story section, laid horizontally.
class ParticleLanes extends HTMLElement {
  constructor() { super(); this.target = 0; this.cur = 0; this.userSet = false; }
  assemble(on, user) { this.target = on ? 1 : 0; if (user) this.userSet = true; clearTimeout(this.autoT); this.dispatchEvent(new CustomEvent('orchestrate', { bubbles: true, detail: { on: !!on } })); this.kick(); }
  connectedCallback() {
    this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%';
    const c = this.canvas = document.createElement('canvas');
    c.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(c); this.ctx = c.getContext('2d');
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.S = 6; this.buildPaths();
    let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    this.ps = [];
    for (let k = 0; k < this.S; k++) for (let i = 0; i < 70; i++) this.ps.push({ k, u: i / 70 + rnd() * .01, j: rnd() - .5, ph: rnd() * 6.28, sp: .8 + rnd() * .4, sz: 3 + rnd() * 3.2, delay: rnd() * .5 });
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(this);
    this.io = new IntersectionObserver(es => { this.visible = es[0].isIntersecting; if (!this.visible && this.target) this.assemble(false); if (this.visible) this.kick(); }); this.io.observe(this);
    // hover over the graphic orchestrates it; leaving releases it. Touch: tap toggles.
    const inside = e => { const r = c.getBoundingClientRect(), g = this.box; return g && e.clientX - r.left > g[0] && e.clientX - r.left < g[2] && e.clientY - r.top > g[1] && e.clientY - r.top < g[3]; };
    c.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; const on = inside(e); c.style.cursor = on ? 'pointer' : ''; if (on !== !!this.target) this.assemble(on, true); });
    c.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch' && this.target) this.assemble(false, true); });
    c.addEventListener('click', e => { if (inside(e) && (e.pointerType === 'touch' || matchMedia('(hover: none)').matches)) this.assemble(!this.target, true); });
    this.resize(); this.t0 = performance.now(); this.kick();
  }
  disconnectedCallback() { cancelAnimationFrame(this.raf); this.raf = 0; this.ro.disconnect(); this.io.disconnect(); clearTimeout(this.autoT); }
  kick() { if (!this.raf) this.raf = requestAnimationFrame(t => this.frame(t)); }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.w = this.clientWidth || 1; this.h = this.clientHeight || 1;
    this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  buildPaths() {
    const g = 0.05, c1 = -0.5, c2 = 0.55, S = this.S;
    this.paths = [];
    for (let k = 0; k < S; k++) {
      const r1 = 0.38 - (S - 1) * g + k * g, r2 = 0.6 - k * g, be = Math.acos((r1 + r2) / (c2 - c1));
      const pts = [], N = 150, P = (c, r, an) => [c + r * Math.cos(an), -r * Math.sin(an)];
      const line = (p, q) => { for (let i = 0; i < 40; i++) pts.push([p[0] + (q[0] - p[0]) * i / 40, p[1] + (q[1] - p[1]) * i / 40]); };
      line(P(c1, r1, be), P(c2, r2, Math.PI + be));
      for (let i = 0; i < N; i++) pts.push(P(c2, r2, Math.PI + be + (2 * Math.PI - 2 * be) * i / N));
      line(P(c2, r2, Math.PI - be), P(c1, r1, -be));
      for (let i = 0; i < N; i++) pts.push(P(c1, r1, -be - (2 * Math.PI - 2 * be) * i / N));
      const cum = [0]; for (let i = 1; i <= pts.length; i++) { const p = pts[i - 1], q = pts[i % pts.length]; cum.push(cum[i - 1] + Math.hypot(q[0] - p[0], q[1] - p[1])); }
      this.paths.push({ pts, cum, L: cum[cum.length - 1] });
    }
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
    this.cur += (this.target - this.cur) * Math.min(1, this.reduce ? 1 : dt * 0.9);
    const sm = v => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
    const { ctx, w, h, S } = this, mo = this.reduce ? 0 : 1, T = (now - this.t0) / 1000 * mo;
    ctx.clearRect(0, 0, w, h);
    // layout: horizontal figure-eight on the right; shape spans x -0.88..1.15, y -0.6..0.6
    const wide = w > 820, A = Math.max(40, Math.min((wide ? w * 0.4 : w * 0.8) / 2.03, h * 0.56 / 1.2)), cx = wide ? w * 0.75 : w * 0.5, cy = h * 0.5, ox = cx - 0.135 * A;
    this.box = [ox - 1.05 * A, cy - .75 * A, ox + 1.3 * A, cy + .75 * A];
    const X = sx => ox + sx * A, Y = sy => cy + sy * A;
    const x0 = X(-0.95), x1 = X(1.2), span = x1 - x0;
    const wy = x => cy + Math.sin((x - x0) / span * 7 + T * 1.1) * A * .32 + Math.sin((x - x0) / span * 13 - T * .7) * A * .14;
    const flow = T * 0.03;
    // orchestrated lanes (strands) draw in
    const lv = sm((this.cur - .35) / .65);
    if (lv > .01) {
      ctx.lineWidth = 1; ctx.strokeStyle = '#758CE5'; ctx.globalAlpha = .28 * lv;
      for (let k = 0; k < S; k++) { ctx.beginPath(); for (let i = 0; i <= 240; i++) { const [sx, sy] = this.pt(i / 240, k); i ? ctx.lineTo(X(sx), Y(sy)) : ctx.moveTo(X(sx), Y(sy)); } ctx.closePath(); ctx.stroke(); }
    }
    const lerp = (a, b, t) => a + (b - a) * t;
    const col = t => `rgb(${Math.round(lerp(255, 64, t))},${Math.round(lerp(90, 64, t))},${Math.round(lerp(77, 217, t))})`;
    for (const q of this.ps) {
      const e = sm((this.cur - q.delay) / (1 - q.delay));
      // wandering stream position
      const uw = ((q.u + T * 0.05 * q.sp) % 1 + 1) % 1, wx = x0 + uw * span, spread = A * .5 * (0.4 + 0.6 * Math.abs(Math.sin(T * .5 + q.ph)));
      const wyy = wy(wx) + q.j * spread * 2;
      // orchestrated strand position
      const [sx, sy] = this.pt(q.u + flow * (q.k % 2 ? 1 : 0.88), q.k), tx = X(sx), ty = Y(sy);
      const x = lerp(wx, tx, e), y = lerp(wyy, ty, e);
      const fadeW = Math.min(1, Math.min(uw, 1 - uw) / .08);
      const al = lerp(0.75 * fadeW, 0.9, e), r = q.sz / 2 * lerp(1, .82, e);
      if (e > .5) { ctx.fillStyle = '#758CE5'; ctx.globalAlpha = al * .3 * (e - .5) * 2; ctx.beginPath(); ctx.arc(x, y, r * 2, 0, 6.2832); ctx.fill(); }
      ctx.fillStyle = col(e); ctx.globalAlpha = al; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    }
    // lead particle: source of the stream; settles at the tip of the intelligence lobe
    const eL = sm(this.cur), lx = lerp(x0 - 6, X(-0.9) - 10, eL), ly = lerp(wy(x0), cy, eL);
    ctx.fillStyle = eL > .5 ? '#758CE5' : '#FF5A4D'; ctx.globalAlpha = .25; ctx.beginPath(); ctx.arc(lx, ly, 15, 0, 6.2832); ctx.fill();
    ctx.fillStyle = col(eL); ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(lx, ly, 7, 0, 6.2832); ctx.fill();
    const hint = 1 - sm(this.cur * 3);
    if (hint > .01 && !matchMedia('(hover: none)').matches) {
      ctx.font = '600 11px "Sofia Pro", "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '2px';
      ctx.fillStyle = '#303D52'; ctx.globalAlpha = .7 * hint; ctx.fillText('HOVER TO ORCHESTRATE', cx, cy + A * .82);
    }
    ctx.globalAlpha = 1;
    this.kick();
  }
}
if (!customElements.get('particle-lanes')) customElements.define('particle-lanes', ParticleLanes);
