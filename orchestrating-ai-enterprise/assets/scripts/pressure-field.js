class PressureField extends HTMLElement {
  connectedCallback() {
    this.style.cssText = 'position:absolute;inset:0;display:block;pointer-events:none';
    const c = this.canvas = document.createElement('canvas');
    c.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(c); this.ctx = c.getContext('2d');
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.vals = (this.getAttribute('values') || '46,45,45,38,35,25,23').split(',').map(Number);
    this.on = 0; this.cur = 0;
    let s = 3; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    this.ps = [];
    this.vals.forEach((v, i) => { const n = Math.round(v * 0.9); for (let j = 0; j < n; j++) this.ps.push({ i, u: rnd(), sp: 0.12 + rnd() * 0.08, off: (rnd() - 0.5) * 0.5, sz: 2.24 + rnd() * 2.24 }); });
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(this);
    this.io = new IntersectionObserver(es => { const e = es[0]; this.visible = e.isIntersecting; if (e.intersectionRatio >= 0.35) this.on = 1; else if (!e.isIntersecting) { this.on = 0; this.cur = 0; } if (this.visible) this.kick(); }, { threshold: [0, 0.35] });
    this.io.observe(this); this.resize();
  }
  disconnectedCallback() { cancelAnimationFrame(this.raf); this.raf = 0; this.ro.disconnect(); this.io.disconnect(); }
  kick() { if (!this.raf) this.raf = requestAnimationFrame(t => this.frame(t)); }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.w = this.clientWidth || 1; this.h = this.clientHeight || 1;
    this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  frame(now) {
    this.raf = 0; if (!this.visible) return;
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000); this.last = now;
    this.cur += (this.on - this.cur) * Math.min(1, dt * 1.5);
    const { ctx, w, h, vals } = this, n = vals.length, S = Math.min(w, h);
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2, cy = w * (parseFloat(this.getAttribute('cy')) || 0.5), RX = w * (parseFloat(this.getAttribute('rx')) || 0.32), RY = w * (parseFloat(this.getAttribute('ry')) || 0.32), core = w * (parseFloat(this.getAttribute('core')) || 0.12);
    const t = now / 1000;
    vals.forEach((v, i) => {
      const a = -Math.PI / 2 + i * 2 * Math.PI / n, nx = cx + Math.cos(a) * RX, ny = cy + Math.sin(a) * RY;
      ctx.strokeStyle = `rgba(117,140,229,${(0.35 * this.cur).toFixed(3)})`; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(nx, ny); ctx.lineTo(cx, cy); ctx.stroke();
    });
    // pressure ring around the core
    const pulse = this.reduce ? 0 : Math.sin(t * 2.2) * 0.5 + 0.5;
    ctx.strokeStyle = `rgba(255,90,77,${(0.5 * this.cur * (0.4 + 0.6 * pulse)).toFixed(3)})`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, core * (1.12 + 0.1 * pulse), 0, 6.2832); ctx.stroke();
    for (const p of this.ps) {
      if (!this.reduce) { p.u += p.sp * dt * (vals[p.i] / 40); if (p.u > 1) p.u -= 1; }
      const a = -Math.PI / 2 + p.i * 2 * Math.PI / n;
      const k = 1 - p.u + (core * 1.05 / Math.hypot(Math.cos(a) * RX, Math.sin(a) * RY)) * p.u, perp = p.off * S * 0.04 * (1 - p.u);
      const x = cx + Math.cos(a) * RX * k - Math.sin(a) * perp, y = cy + Math.sin(a) * RY * k + Math.cos(a) * perp;
      const near = Math.max(0, (p.u - 0.6) / 0.4);
      const al = this.cur * Math.min(1, p.u * 6) * (1 - near * 0.3);
      const cr = Math.round(64 + (255 - 64) * near), cg = Math.round(64 + (90 - 64) * near), cb = Math.round(217 + (77 - 217) * near);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${al.toFixed(3)})`;
      ctx.beginPath(); ctx.arc(x, y, p.sz / 2, 0, 6.2832); ctx.fill();
    }
    this.kick();
  }
}
if (!customElements.get('pressure-field')) customElements.define('pressure-field', PressureField);
