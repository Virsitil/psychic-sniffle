// Leadership question: three concentric orbiting particle rings (matches "adds up to" expand graphic), hero-sized particles.
class ParticleVortex extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%';
    const c = this.canvas = document.createElement('canvas');
    c.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(c); this.ctx = c.getContext('2d');
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.cur = 0; this.sec = this.closest('section');
    this.ro = new ResizeObserver(() => { this.resize(); this.build(); }); this.ro.observe(this);
    this.io = new IntersectionObserver(es => { this.visible = es[0].isIntersecting; if (this.visible) this.kick(); }); this.io.observe(this);
    this.resize(); this.build();
  }
  disconnectedCallback() { cancelAnimationFrame(this.raf); this.raf = 0; this.ro.disconnect(); this.io.disconnect(); }
  kick() { if (!this.raf) this.raf = requestAnimationFrame(t => this.frame(t)); }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.w = this.clientWidth || 1; this.h = this.clientHeight || 1;
    this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  layout() {
    const { w, h } = this, wide = w > 820;
    const R = Math.min(h * 0.3, wide ? w * 0.17 : w * 0.38);
    let cx = wide ? w * 0.74 : w * 0.5, cy = h * 0.45; this.txt = null;
    if (wide && this.sec) {
      const hd = this.sec.querySelector('[data-words-in] p');
      if (hd) {
        const me = this.getBoundingClientRect(), hr = hd.getBoundingClientRect(), rg = document.createRange(); rg.selectNodeContents(hd);
        const tr = rg.getBoundingClientRect();
        this.txt = [tr.left - me.left, tr.top - me.top, tr.right - me.left, tr.bottom - me.top];
        cy = hr.top + hr.height / 2 - me.top;
        cx = Math.max(w * .6, Math.min(w - R * 1.15, tr.right - me.left + R * 1.25));
      }
    }
    return { cx, cy, R };
  }
  build() {
    let s = 13; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const { R } = this.layout();
    this.ps = [];
    [0.33, 0.65, 1].forEach((k, c) => {
      const n = Math.max(12, Math.round(6.2832 * R * k / 15));
      for (let i = 0; i < n; i++) this.ps.push({ c, k, a: i / n * 6.2832 + rnd() * .12, sz: 3.2928 + rnd() * 5.1744, delay: rnd() * .45, x: rnd(), y: rnd(), dir: c % 2 ? 1 : -1 });
    });
  }
  frame(now) {
    this.raf = 0; if (!this.visible) return;
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000); this.last = now;
    let p = .5; if (this.sec) { const r = this.sec.getBoundingClientRect(); p = (innerHeight - r.top) / (innerHeight + r.height); }
    this.cur += ((p > .15 ? 1 : 0) - this.cur) * Math.min(1, this.reduce ? 1 : dt * 1.6);
    const { ctx, w, h } = this, T = this.reduce ? 0 : now / 1000;
    const { cx, cy, R } = this.layout();
    ctx.clearRect(0, 0, w, h);
    const sm = v => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
    const col = q => `rgb(${Math.round(255 + (64 - 255) * q)},${Math.round(90 + (64 - 90) * q)},${Math.round(77 + (217 - 77) * q)})`;
    if (this.cur > 0.05) {
      ctx.lineWidth = 1; ctx.strokeStyle = '#052140'; ctx.globalAlpha = 0.09 * this.cur;
      for (const k of [0.33, 0.65, 1]) { ctx.beginPath(); ctx.arc(cx, cy, R * k, 0, 6.2832); ctx.stroke(); }
    }
    const B = this.txt, pad = 48;
    for (const q of this.ps) {
      const a = q.a + T * .22 * q.dir, tx = cx + Math.cos(a) * R * q.k, ty = cy + Math.sin(a) * R * q.k;
      const e = sm((this.cur - q.delay) / (1 - q.delay));
      const x = q.x * w + (tx - q.x * w) * e, y = q.y * h + (ty - q.y * h) * e;
      let al = 0.3 + 0.65 * e;
      if (B) { const dd = Math.hypot(Math.max(B[0] - x, 0, x - B[2]), Math.max(B[1] - y, 0, y - B[3])); if (dd < pad) al *= 0.18 + 0.82 * sm(dd / pad); }
      const t = (q.c / 2) * e, blue = t > 0.5;
      const r = q.sz / 2;
      if (blue && e > .5) { ctx.fillStyle = '#758CE5'; ctx.globalAlpha = al * .35; ctx.beginPath(); ctx.arc(x, y, r * 2, 0, 6.2832); ctx.fill(); }
      ctx.fillStyle = col(t); ctx.globalAlpha = Math.min(1, blue ? al * 1.15 : al);
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    this.kick();
  }
}
if (!customElements.get('particle-vortex')) customElements.define('particle-vortex', ParticleVortex);
