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
    // base rings (always), plus extra rings that fade in as the section gets busier: [radius k, appear-at]
    this.rings = [[0.33, -1], [0.65, -1], [1, -1], [0.49, 0.2], [0.82, 0.4], [1.17, 0.6], [0.18, 0.75]];
    this.rings.forEach(([k, th], ri) => {
      const n = Math.max(12, Math.round(6.2832 * R * k / 15)) * 3;
      for (let i = 0; i < n; i++) {
        const lv = i % 3; // lv 0 = base density, 1-2 = extra density layers
        this.ps.push({ k, ri, th: Math.max(th, lv === 0 ? -1 : lv === 1 ? 0.3 : 0.6) + (lv ? rnd() * .1 : 0), a: i / n * 6.2832 + rnd() * .08, sz: 3.2928 + rnd() * 5.1744, delay: rnd() * .45, x: rnd(), y: rnd(), dir: ri % 2 ? 1 : -1, sp: 0.85 + rnd() * .3, wob: rnd() * 6.28 });
      }
    });
  }
  frame(now) {
    this.raf = 0; if (!this.visible) return;
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000); this.last = now;
    const sm = v => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
    let p = .5; if (this.sec) { const r = this.sec.getBoundingClientRect(); p = (innerHeight - r.top) / (innerHeight + r.height); }
    // scroll-driven and fully reversible: build in, then grow busier and larger
    const bT = this.reduce ? 1 : sm((p - .08) / .3), gT = this.reduce ? 0 : sm((p - .38) / .47);
    const lerp = Math.min(1, dt * 5);
    this.cur += (bT - this.cur) * lerp; this.g = (this.g || 0) + (gT - (this.g || 0)) * lerp;
    const g = this.g;
    this.sim = (this.sim || 0) + dt * (this.reduce ? 0 : .22 * (1 + 2.2 * g));
    const { ctx, w, h } = this, T = this.reduce ? 0 : now / 1000;
    const L = this.layout(), cx = L.cx, cy = L.cy, R = L.R * (1 + .45 * g);
    ctx.clearRect(0, 0, w, h);
    const col = q => `rgb(${Math.round(255 + (64 - 255) * q)},${Math.round(90 + (64 - 90) * q)},${Math.round(77 + (217 - 77) * q)})`;
    if (this.cur > 0.05) {
      ctx.lineWidth = 1; ctx.strokeStyle = '#052140';
      for (const [k, th] of this.rings) { const v = th < 0 ? 1 : sm((g - th) / .2); if (v < .02) continue; ctx.globalAlpha = 0.09 * this.cur * v; ctx.beginPath(); ctx.arc(cx, cy, R * k, 0, 6.2832); ctx.stroke(); }
    }
    const B = this.txt, pad = 48;
    for (const q of this.ps) {
      const vis = q.th < 0 ? 1 : sm((g - q.th) / .2); if (vis < .01) continue;
      const a = q.a + this.sim * q.dir * q.sp, rr = R * q.k * (1 + g * .05 * Math.sin(T * 1.3 + q.wob));
      const tx = cx + Math.cos(a) * rr, ty = cy + Math.sin(a) * rr;
      const e = sm((this.cur - q.delay) / (1 - q.delay)) * vis;
      const x = q.x * w + (tx - q.x * w) * e, y = q.y * h + (ty - q.y * h) * e;
      let al = (0.3 + 0.65 * e) * vis;
      if (B) { const dd = Math.hypot(Math.max(B[0] - x, 0, x - B[2]), Math.max(B[1] - y, 0, y - B[3])); if (dd < pad) al *= 0.18 + 0.82 * sm(dd / pad); }
      const t = Math.max(0, Math.min(1, (q.k - .18) / .99)) * e, blue = t > 0.5, r = q.sz / 2;
      if (blue && e > .5) { ctx.fillStyle = '#758CE5'; ctx.globalAlpha = al * .35; ctx.beginPath(); ctx.arc(x, y, r * 2, 0, 6.2832); ctx.fill(); }
      ctx.fillStyle = col(t); ctx.globalAlpha = Math.min(1, blue ? al * 1.15 : al);
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    this.kick();
  }
}
if (!customElements.get('particle-vortex')) customElements.define('particle-vortex', ParticleVortex);
