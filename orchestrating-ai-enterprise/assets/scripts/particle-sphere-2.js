class ParticleSphere extends HTMLElement {
  constructor() { super(); this.target = 0; this.cur = 0; this.userSet = false; }
  assemble(on, user) { this.target = on ? 1 : 0; if (user) this.userSet = true; clearTimeout(this.autoT); this.dispatchEvent(new CustomEvent('orchestrate', { bubbles: true, detail: { on: !!on } })); this.kick(); }
  connectedCallback() {
    this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%';
    const c = this.canvas = document.createElement('canvas');
    c.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(c);
    this.ctx = c.getContext('2d');
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(this);
    this.visible = true;
    this.io = new IntersectionObserver(es => {
      const e = es[0]; this.visible = e.isIntersecting;
      if (e.intersectionRatio >= 0.5 && !this.userSet && this.target === 0 && !this.autoT) this.autoT = setTimeout(() => { this.autoT = 0; this.assemble(true); }, 2000);
      if (e.intersectionRatio < 0.5) { clearTimeout(this.autoT); this.autoT = 0; }
      if (!e.isIntersecting && !this.userSet) { this.cur = 0; if (this.target) this.assemble(false); }
      if (this.visible) this.kick();
    }, { threshold: [0, 0.5] }); this.io.observe(this);
    this.sec = this.closest('section');
    this.onClick = () => { this.locked = !this.locked; };
    this.mx = -1e4; this.my = -1e4; this.mOn = 0;
    this.onMove = e => { const r = this.getBoundingClientRect(); this.mx = e.clientX - r.left; this.my = e.clientY - r.top; this.mOn = 1; this.kick(); };
    this.onLeave = () => { this.mOn = 0; };
    if (!this.reduce && matchMedia('(hover: hover)').matches && this.sec) { this.sec.addEventListener('mousemove', this.onMove); this.sec.addEventListener('mouseleave', this.onLeave); }
    this.resize(); this.build(); this.t0 = performance.now(); this.kick();
  }
  disconnectedCallback() {
    cancelAnimationFrame(this.raf); this.raf = 0;
    this.ro.disconnect(); this.io.disconnect();
    clearTimeout(this.autoT);
    if (this.sec) { this.sec.removeEventListener('mousemove', this.onMove); this.sec.removeEventListener('mouseleave', this.onLeave); }
  }
  kick() { if (!this.raf) this.raf = requestAnimationFrame(t => this.frame(t)); }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.w = this.clientWidth || 1; this.h = this.clientHeight || 1;
    this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  build() {
    const n = this.w < 700 ? 900 : 1700, M = 40;
    let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    this.M = M;
    this.ps = Array.from({ length: n }, (_, i) => ({
      m: i % M, u: rnd(), sp: 0.04 + rnd() * 0.05,
      x: rnd(), y: rnd(), vx: (rnd() - 0.5) * 0.5, vy: (rnd() - 0.5) * 0.5,
      ox: 0, oy: 0, delay: rnd() * 0.35, coral: rnd() < 0.32, sz: 3.2928 + rnd() * 5.1744
    }));
  }
  frame(now) {
    this.raf = 0;
    if (!this.visible) return;
    const t = (now - this.t0) / 1000, dt = Math.min(0.05, (now - (this.last || now)) / 1000); this.last = now;
    const target = this.target;
    this.cur += (target - this.cur) * Math.min(1, dt * 0.7);
    const { ctx, w, h, M } = this;
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    const host = this.closest('[data-particles]'), dx = host ? parseFloat(host.dataset.dx) || 0 : 0;
    const cx = w * (parseFloat(this.getAttribute('cx')) || 0.78) + dx, cy = h * 0.5;
    const R = Math.min(w * 0.18, h * 0.38), rot = t * 0.18, tilt = 0.35;
    const ct = Math.cos(tilt), st = Math.sin(tilt), f = R * 3.2;
    const motion = this.reduce ? 0 : 1, MR = 110, MR2 = MR * MR, MP = 16;
    for (const p of this.ps) {
      p.x += p.vx * dt * motion * (1 - this.cur * 0.8); p.y += p.vy * dt * motion * (1 - this.cur * 0.8);
      if (p.x < 0) p.x += 1; else if (p.x > 1) p.x -= 1;
      if (p.y < 0) p.y += 1; else if (p.y > 1) p.y -= 1;
      p.u += p.sp * dt * motion; if (p.u > 1) p.u -= 1;
      const th = (p.m / M) * Math.PI * 2 + rot, ph = p.u * Math.PI;
      let sx = Math.sin(ph) * Math.cos(th), sy = -Math.cos(ph), sz = Math.sin(ph) * Math.sin(th);
      const y2 = sy * ct - sz * st, z2 = sy * st + sz * ct;
      const persp = f / (f - z2 * R);
      const tx = cx + sx * R * persp, ty = cy + y2 * R * persp;
      const k = Math.max(0, Math.min(1, (this.cur - p.delay) / (1 - p.delay)));
      const e = k * k * (3 - 2 * k);
      const bx = p.x * w + (tx - p.x * w) * e, by = p.y * h + (ty - p.y * h) * e;
      let fx = 0, fy = 0;
      if (this.mOn) { const ddx = bx - this.mx, ddy = by - this.my, d2 = ddx * ddx + ddy * ddy; if (d2 < MR2) { const d = Math.sqrt(d2) || 1, s = (1 - d / MR) * MP; fx = ddx / d * s; fy = ddy / d * s; } }
      p.ox += (fx - p.ox) * Math.min(1, dt * 5); p.oy += (fy - p.oy) * Math.min(1, dt * 5);
      const x = bx + p.ox, y = by + p.oy;
      const depth = 0.55 + 0.45 * ((z2 + 1) / 2) * e + 0.45 * (1 - e) * 0.6;
      const fade = Math.sin(ph) * e + (1 - e);
      const a = (0.35 + 0.65 * e) * depth * (0.3 + 0.7 * fade);
      ctx.fillStyle = p.coral ? '#FF5A4D' : '#4040D9'; ctx.globalAlpha = Math.max(0, Math.min(1, p.coral ? a : a * 1.25));
      const sz2 = p.sz * (0.8 + 0.7 * depth);
      ctx.beginPath(); ctx.arc(x, y, sz2 / 2, 0, 6.2832); ctx.fill();
      if (!p.coral && e > 0.5) { ctx.fillStyle = '#758CE5'; ctx.globalAlpha = Math.max(0, Math.min(1, a * 0.35)); ctx.beginPath(); ctx.arc(x, y, sz2, 0, 6.2832); ctx.fill(); }
    }
    this.streams(ctx, t, cx, cy, R, h);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    this.bloom();
    this.kick();
  }

  streams(ctx, t, cx, cy, R, h) {
    const on = Math.max(0, Math.min(1, (this.cur - 0.5) / 0.5)); if (on <= 0) return;
    const L = [[-1.9, -0.62, 0], [-0.95, -0.3, 1], [0.15, 0.04, 0], [1.1, 0.34, 1], [2.0, 0.6, 0]];
    const tt = this.reduce ? 0 : t;
    ctx.lineWidth = 1; ctx.lineCap = 'round';
    L.forEach(([ox, a, coral], li) => {
      const sx = cx + ox * R, ex = cx + Math.sin(a) * R * 0.92, ey = cy - Math.cos(a) * R * 0.92;
      const p0 = [sx, -10], p1 = [sx, (ey - R * 0.2) * 0.55], p2 = [ex, ey - R * 0.75], p3 = [ex, ey];
      const bz = u => { const m = 1 - u, A = m * m * m, B = 3 * m * m * u, C = 3 * m * u * u, D = u * u * u; return [A * p0[0] + B * p1[0] + C * p2[0] + D * p3[0], A * p0[1] + B * p1[1] + C * p2[1] + D * p3[1]]; };
      ctx.strokeStyle = '#758CE5'; ctx.globalAlpha = 0.35 * on;
      ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.bezierCurveTo(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1]); ctx.stroke();
      for (let k = 0; k < 3; k++) {
        const u = ((tt * (0.11 + li * 0.012) + k / 3 + li * 0.17) % 1 + 1) % 1, [x, y] = bz(u * u * (3 - 2 * u) * 0.5 + u * 0.5);
        const al = Math.sin(Math.PI * u) * on, col = (coral && k === 0) ? '#FF5A4D' : '#4040D9';
        ctx.fillStyle = col === '#FF5A4D' ? col : '#758CE5'; ctx.globalAlpha = al * 0.3; ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.2832); ctx.fill();
        ctx.fillStyle = col; ctx.globalAlpha = al; ctx.beginPath(); ctx.arc(x, y, 3, 0, 6.2832); ctx.fill();
      }
    });
  }

  set bloom(v) { this._bk = +v; }
  get bloomK() { const v = this._bk ?? parseFloat(this.getAttribute('bloom')); return isNaN(v) ? 1.8 : v; }
  bloom() {
    const K = this.bloomK; if (K <= 0) return;
    const c = this.canvas, W = c.width, H = c.height, ctx = this.ctx;
    if (!this._bl) this._bl = [[4, 2.5, .85], [10, 3, .7]].map(([s, b, a]) => ({ s, b, a, c: document.createElement('canvas') }));
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over';
    for (const L of this._bl) {
      const bw = Math.max(1, Math.ceil(W / L.s)), bh = Math.max(1, Math.ceil(H / L.s));
      if (L.c.width !== bw || L.c.height !== bh) { L.c.width = bw; L.c.height = bh; }
      const bx = L.c.getContext('2d'); bx.clearRect(0, 0, bw, bh); bx.filter = 'blur(' + L.b + 'px)'; bx.drawImage(c, 0, 0, bw, bh); bx.filter = 'none';
      let r = L.a * K; while (r > 0) { ctx.globalAlpha = Math.min(1, r); ctx.drawImage(L.c, 0, 0, W, H); r -= 1; }
    }
    ctx.restore();
  }
}
if (!customElements.get('particle-sphere')) customElements.define('particle-sphere', ParticleSphere);
