// Finding 01 maturity S-curve built from hero-style particles
class ParticleWave extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%';
    const c = this.canvas = document.createElement('canvas');
    c.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(c); this.ctx = c.getContext('2d');
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.ro = new ResizeObserver(() => { this.resize(); this.build(); }); this.ro.observe(this);
    this.io = new IntersectionObserver(es => {
      this.visible = es[0].isIntersecting;
      if (es[0].intersectionRatio >= 0.3 && !this.t0) this.t0 = performance.now();
      if (!es[0].isIntersecting) this.t0 = 0;
      if (this.visible) this.kick();
    }, { threshold: [0, 0.3] });
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
    let s = 5; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const n = this.w < 700 ? 150 : 260, lines = [1, .55, .38, .24];
    this.ps = [];
    lines.forEach((wt, li) => {
      const m = Math.round(n * (li ? .55 : 1));
      for (let i = 0; i < m; i++) this.ps.push({ li, u: (i + rnd() * .6) / m, sx: rnd(), sy: rnd(), coral: rnd() < (li ? .18 : .32), sz: 2.94 + rnd() * 4.62, wt, jit: (rnd() - .5) * (li ? 6 : 3) });
    });
    // faint fill particles under the curve
    for (let i = 0; i < n * .6; i++) this.ps.push({ li: -1, u: rnd(), v: rnd(), sx: rnd(), sy: rnd(), coral: false, sz: 2.24 + rnd() * 2.80, wt: .16, jit: 0 });
  }
  frame(now) {
    this.raf = 0; if (!this.visible) return;
    const { ctx, w, h } = this, T = !this.t0 ? 0 : this.reduce ? 99 : (now - this.t0) / 1000;
    const clamp = v => Math.max(0, Math.min(1, v)), sm = v => { v = clamp(v); return v * v * (3 - 2 * v); };
    const yB = h * .94, yT = h * .2, live = clamp((T - 2.6) / 1.5), mo = this.reduce ? 0 : 1;
    const amp = h * .012 * live, ph = T * .35 * mo;
    const Y = (u, p, a) => yB - (yB - yT) / (1 + Math.exp(-(u - .5) * 7.5)) + Math.sin(u * 9 + p) * a;
    const b = sm(T / 2.6);
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    for (const p of this.ps) {
      const k = sm((b - p.u * .85) / .15);
      let tx = p.u * w, ty;
      if (p.li < 0) { const top = Y(p.u, ph, amp); ty = top + (h - top) * (.08 + p.v * .92); }
      else ty = Y(p.u, ph + p.li * .7, amp * (1 + p.li)) + h * .035 * p.li + p.jit;
      const fx = p.sx * w + Math.sin(T * .6 + p.sy * 9) * 10 * mo, fy = p.sy * h;
      const x = fx + (tx - fx) * k, y = fy + (ty - fy) * k;
      const a = (0.12 + 0.88 * k) * p.wt * (p.li < 0 ? (1 - ((y - Y(p.u, ph, amp)) / h)) : 1);
      const sz = p.sz * (p.li > 0 ? .75 : 1);
      ctx.fillStyle = p.coral ? '#FF5A4D' : '#4040D9'; ctx.globalAlpha = clamp(p.coral ? a : a * 1.25);
      ctx.beginPath(); ctx.arc(x, y, sz / 2, 0, 6.2832); ctx.fill();
      if (!p.coral && k > .5 && p.li >= 0) { ctx.fillStyle = '#758CE5'; ctx.globalAlpha = clamp(a * .35); ctx.beginPath(); ctx.arc(x, y, sz, 0, 6.2832); ctx.fill(); }
    }
    ctx.globalCompositeOperation = 'source-over';
    [.1, .4, .7].forEach((u, i) => {
      const x = u * w, y = Y(u, ph, amp), a = clamp((b - u) / .12), ld = sm((T - 2.6 * u - .5) / .8);
      ctx.globalAlpha = .7 * a; ctx.strokeStyle = '#FF5A4D'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(Math.round(x) + .5, 0); ctx.lineTo(Math.round(x) + .5, y * ld); ctx.stroke();
      const r = 5 * sm(a); ctx.globalAlpha = 1; ctx.fillStyle = '#FF5A4D'; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
      const q = (T * .4 + i * .33) % 1; ctx.globalAlpha = live * (1 - q) * .6; ctx.beginPath(); ctx.arc(x, y, 5 + q * 16, 0, 6.2832); ctx.stroke();
    });
    ctx.globalAlpha = 1;
    this.kick();
  }

}
if (!customElements.get('particle-wave')) customElements.define('particle-wave', ParticleWave);
