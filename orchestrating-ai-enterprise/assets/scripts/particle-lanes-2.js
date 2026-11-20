class ParticleLanes extends HTMLElement {
  constructor() { super(); this.target = 0; this.cur = 0; this.userSet = false; }
  assemble(on, user) { this.target = on ? 1 : 0; if (user) this.userSet = true; clearTimeout(this.autoT); this.dispatchEvent(new CustomEvent('orchestrate', { bubbles: true, detail: { on: !!on } })); this.kick(); }
  connectedCallback() {
    this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%';
    const c = this.canvas = document.createElement('canvas');
    c.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(c);
    this.ctx = c.getContext('2d');
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.ro = new ResizeObserver(() => { this.resize(); this.build(); }); this.ro.observe(this);
    this.visible = true;
    this.io = new IntersectionObserver(es => {
      const e = es[0]; this.visible = e.isIntersecting;
      if (e.intersectionRatio >= 0.5 && !this.userSet && this.target === 0 && !this.autoT) this.autoT = setTimeout(() => { this.autoT = 0; this.assemble(true); }, 900);
      if (e.intersectionRatio < 0.5) { clearTimeout(this.autoT); this.autoT = 0; }
      if (!e.isIntersecting && !this.userSet) { this.cur = 0; if (this.target) this.assemble(false); }
      if (this.visible) this.kick();
    }, { threshold: [0, 0.5] }); this.io.observe(this);
    this.resize(); this.build(); this.t0 = performance.now(); this.kick();
  }
  disconnectedCallback() { cancelAnimationFrame(this.raf); this.raf = 0; this.ro.disconnect(); this.io.disconnect(); clearTimeout(this.autoT); }
  kick() { if (!this.raf) this.raf = requestAnimationFrame(t => this.frame(t)); }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.w = this.clientWidth || 1; this.h = this.clientHeight || 1;
    this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  build() {
    const small = this.w < 700, C = small ? 5 : 7, D = small ? 3 : 4, K = small ? 50 : 60;
    let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    this.lanes = [];
    for (let r = 0; r < D; r++) for (let c = 0; c < C; c++) this.lanes.push({ X: -1 + 2 * c / (C - 1), Z: -1 + 2 * r / (D - 1), off: rnd() });
    this.C = C; this.D = D; this.K = K;
    const old = this.ps, n = this.lanes.length * K;
    this.ps = Array.from({ length: n }, (_, i) => ({
      lane: i % this.lanes.length, slot: Math.floor(i / this.lanes.length),
      x: old && old[i] ? old[i].x : rnd(), y: old && old[i] ? old[i].y : rnd(),
      vx: (rnd() - 0.5) * 0.5, vy: (rnd() - 0.5) * 0.5,
      delay: rnd() * 0.22, coral: rnd() < 0.32, sz: 2.94 + rnd() * 4.62
    }));
  }
  frame(now) {
    this.raf = 0;
    if (!this.visible) return;
    const t = (now - this.t0) / 1000, dt = Math.min(0.05, (now - (this.last || now)) / 1000); this.last = now;
    this.cur += (this.target - this.cur) * Math.min(1, dt * 1.6);
    const { ctx, w, h, K, C, D, lanes } = this;
    ctx.clearRect(0, 0, w, h);
    const motion = this.reduce ? 0 : 1;
    const cx = w * 0.72, cy = h * 0.5, S = Math.min(w * 0.2, h * 0.3) * 0.8, f = S * 4.2, HY = 1.35;
    const rot = -0.62 + Math.sin(t * 0.12 * motion) * 0.22, cr = Math.cos(rot), sr = Math.sin(rot), tilt = 0.3, ct = Math.cos(tilt), st = Math.sin(tilt);
    const P = (X, Y, Z) => { const x1 = X * cr - Z * sr, z1 = X * sr + Z * cr, y2 = Y * ct - z1 * st, z2 = Y * st + z1 * ct, k = f / (f - z2 * S); return [cx + x1 * S * k, cy + y2 * S * k, z2]; };
    const flow = (t * 0.09 * motion) % 1;
    if (this.cur > 0.05) {
      const g = this.cur;
      ctx.lineWidth = 1;
      const line = (a, b, al) => { ctx.strokeStyle = 'rgba(117,140,229,' + al.toFixed(3) + ')'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); };
      const dA = z => 0.35 + 0.65 * (z + 1.6) / 3.2;
      for (const L of lanes) { const a = P(L.X, -HY, L.Z), b = P(L.X, HY, L.Z); line(a, b, 0.1 * g * dA((a[2] + b[2]) / 2)); }
      for (const Y of [-HY, HY]) for (let r = 0; r < D; r++) for (let c = 0; c < C; c++) {
        const L = lanes[r * C + c], a = P(L.X, Y, L.Z);
        if (c < C - 1) { const M = lanes[r * C + c + 1]; line(a, P(M.X, Y, M.Z), 0.06 * g * dA(a[2])); }
        if (r < D - 1) { const M = lanes[(r + 1) * C + c]; line(a, P(M.X, Y, M.Z), 0.06 * g * dA(a[2])); }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    for (const p of this.ps) {
      p.x += p.vx * dt * motion * (1 - this.cur * 0.8); p.y += p.vy * dt * motion * (1 - this.cur * 0.8);
      if (p.x < 0) p.x += 1; else if (p.x > 1) p.x -= 1;
      if (p.y < 0) p.y += 1; else if (p.y > 1) p.y -= 1;
      const L = lanes[p.lane], ph = (p.slot / K + flow + L.off) % 1;
      const [tx, ty, z2] = P(L.X, HY - 2 * HY * ph, L.Z);
      const k = Math.max(0, Math.min(1, (this.cur - p.delay) / (1 - p.delay)));
      const e = k * k * (3 - 2 * k);
      const x = p.x * w + (tx - p.x * w) * e, y = p.y * h + (ty - p.y * h) * e;
      const dn = Math.max(0, Math.min(1, (z2 + 1.6) / 3.2));
      const depth = 0.55 + 0.45 * dn * e + 0.45 * (1 - e) * 0.6;
      const edge = Math.min(1, Math.min(ph, 1 - ph) / 0.12);
      const a = (0.35 + 0.65 * e) * depth * ((1 - e) * 0.7 + e * edge);
      ctx.fillStyle = p.coral ? '#FF5A4D' : '#4040D9'; ctx.globalAlpha = Math.max(0, Math.min(1, p.coral ? a : a * 1.25));
      const sz2 = p.sz * (0.8 + 0.7 * depth);
      ctx.beginPath(); ctx.arc(x, y, sz2 / 2, 0, 6.2832); ctx.fill();
      if (!p.coral && e > 0.5) { ctx.fillStyle = '#758CE5'; ctx.globalAlpha = Math.max(0, Math.min(1, a * 0.35)); ctx.beginPath(); ctx.arc(x, y, sz2, 0, 6.2832); ctx.fill(); }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    this.kick();
  }

}
if (!customElements.get('particle-lanes')) customElements.define('particle-lanes', ParticleLanes);
