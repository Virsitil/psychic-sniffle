// Leadership question: particle accretion disk around a dark core. Props: speed, tilt, turbulence, density, glow
class ParticleVortex extends HTMLElement {
  set speed(v) { this._sp = +v; } set tilt(v) { this._ti = +v; } set turbulence(v) { this._tu = +v; }
  set density(v) { const n = +v; if (n && n !== this._de) { this._de = n; if (this.w) this.build(); } } set glow(v) { this._gl = +v; }
  num(k, a, d) { const v = this[k] ?? parseFloat(this.getAttribute(a)); return isNaN(v) ? d : v; }
  connectedCallback() {
    this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%';
    const c = this.canvas = document.createElement('canvas');
    c.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(c); this.ctx = c.getContext('2d');
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.cur = 0; this.sim = 0; this.sec = this.closest('section');
    this.ro = new ResizeObserver(() => { this.resize(); this.build(); }); this.ro.observe(this);
    this.io = new IntersectionObserver(es => { this.visible = es[0].isIntersecting; if (this.visible) this.kick(); }); this.io.observe(this);
    this.resize(); this.build();
  }
  disconnectedCallback() { cancelAnimationFrame(this.raf); this.raf = 0; this.ro.disconnect(); this.io.disconnect(); }
  kick() { if (!this.raf) this.raf = requestAnimationFrame(t => this.frame(t)); }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    this.w = this.clientWidth || 1; this.h = this.clientHeight || 1;
    this.canvas.width = this.w * dpr; this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  build() {
    let s = 21; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const base = this._de ?? (parseFloat(this.getAttribute('density')) || 1);
    const n = Math.round((this.w < 700 ? 450 : 900) * base);
    this.ps = Array.from({ length: n }, () => {
      const r = 1.9 + Math.pow(rnd(), 0.9) * 7.6;
      return { r, a: rnd() * 6.2832, y: (rnd() - .5) * (1.2 / r), sz: 3.2928 + rnd() * 5.1744, coral: rnd() < .3, sx: rnd(), sy: rnd(), delay: rnd() * .4, ph: rnd() * 6.28 };
    });
  }
  frame(now) {
    const Rc0 = u => 1.05 * u;
    this.raf = 0; if (!this.visible) return;
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000); this.last = now;
    const { ctx, w, h } = this, mo = this.reduce ? 0 : 1;
    const SP = this.num('_sp', 'speed', 1), TI = this.num('_ti', 'tilt', 1.35), TU = this.num('_tu', 'turbulence', 1), GL = this.num('_gl', 'glow', 1.4);
    let p = .5; if (this.sec) { const r = this.sec.getBoundingClientRect(); p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height))); }
    this.cur += ((p > .12 ? 1 : 0) - this.cur) * Math.min(1, dt * 1.4);
    // scroll pulls the disk in and spins it up
    const comp = 1 - .3 * Math.max(0, (p - .45) / .55), spin = 1 + 1.4 * Math.max(0, (p - .45) / .55);
    this.sim += dt * SP * spin * mo;
    const T = now / 1000;
    const wide = w > 820; let cx = wide ? w * (w < 1200 ? .8 : .74) : w * .5, cy = h * .52; const U = 0.7 * Math.min(w * (wide ? (w < 1200 ? .036 : .046) : .07), h * (w < 1200 ? .068 : .08));
    if (wide && this.sec) { const hd = this.sec.querySelector('[data-words-in] p'); if (hd) { const me = this.getBoundingClientRect(), hr = hd.getBoundingClientRect(), rg = document.createRange(); rg.selectNodeContents(hd); const tr = rg.getBoundingClientRect(); cy = hr.top + hr.height / 2 - me.top; cx = Math.max(w * .6, Math.min(w - Rc0(U) * 2.2, tr.right - me.left + Rc0(U) * 2.4)); } }
    const tilt = TI, ct = Math.cos(tilt), st = Math.sin(tilt), rot = T * .05 * mo;
    ctx.clearRect(0, 0, w, h);
    const sm = v => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
    const P = (x, y, z) => { const x1 = x * Math.cos(rot) - z * Math.sin(rot), z1 = x * Math.sin(rot) + z * Math.cos(rot), y2 = y * ct - z1 * st, z2 = y * st + z1 * ct, k = 22 / (22 - z2); return [cx + x1 * U * k, cy + y2 * U * k, z2, k]; };
    const Rc = 1.7 * U;
    const back = [], front = [];
    ctx.globalCompositeOperation = 'source-over';
    const COLS = ['#FF5A4D', '#4040D9'], NB = 4, buckets = [];
    for (let i = 0; i < COLS.length * NB; i++) buckets.push([]);
    for (const q of this.ps) {
      const om = 1.6 / Math.pow(q.r, 1.5), ang = q.a + this.sim * om, r = q.r * comp;
      const wob = Math.sin(ang * 3 + q.ph + T * .6 * mo) * .18 * TU * (r / 6);
      const X = Math.cos(ang) * r, Z = Math.sin(ang) * r, Y = q.y + wob;
      const [tx, ty, z2, k] = P(X, Y, Z);
      const e = sm((this.cur - q.delay) / (1 - q.delay));
      const x = q.sx * w + (tx - q.sx * w) * e, y = q.sy * h + (ty - q.sy * h) * e;
      if (e > .9 && z2 < 0 && Math.hypot(x - cx, y - cy) < Rc * .98) continue;
      const dop = 1 + .35 * Math.cos(ang - rot) * e * Math.cos(tilt);
      const heat = sm((4.2 - q.r) / 2.4);
      const fade = sm((q.r - 1.9) / .6) * (1 - sm((q.r - 8.3) / 1.2));
      const al = (0.25 + 0.75 * e) * fade * dop * (0.55 + 0.45 * k);
      if (al < .04) continue;
      const ci = q.coral ? 0 : 1;
      const bi = Math.min(NB - 1, Math.floor(al * NB));
      const len = Math.min(14, 3 + om * SP * spin * 26) * e;
      const [bx, by] = P(Math.cos(ang - .05) * r, Y, Math.sin(ang - .05) * r);
      const dx = x - bx, dy = y - by, d = Math.hypot(dx, dy) || 1;
      buckets[ci * NB + bi].push(x, y, x - dx / d * len, y - dy / d * len, q.sz * (.7 + .5 * k) * .5);
    }
    ctx.lineCap = 'round'; ctx.lineWidth = 1;
    buckets.forEach((B, i) => {
      if (!B.length) return;
      const col = COLS[Math.floor(i / NB)], A = ((i % NB) + .5) / NB;
      // lilac halo on blue particles (matches hero sphere)
      if (col !== '#FF5A4D') { ctx.fillStyle = '#758CE5'; ctx.globalAlpha = A * .35;
      ctx.beginPath(); for (let j = 0; j < B.length; j += 5) { const r = B[j + 4] * 2; ctx.moveTo(B[j] + r, B[j + 1]); ctx.arc(B[j], B[j + 1], r, 0, 6.2832); } ctx.fill(); }
      // solid dot
      ctx.fillStyle = col; ctx.globalAlpha = Math.min(1, col === '#FF5A4D' ? A : A * 1.25);
      ctx.beginPath(); for (let j = 0; j < B.length; j += 5) { const r = B[j + 4]; ctx.moveTo(B[j] + r, B[j + 1]); ctx.arc(B[j], B[j + 1], r, 0, 6.2832); } ctx.fill();
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    
    // core: gyroscope rings (electric blue)
    this.gyro(ctx, cx, cy, Rc, T * mo, this.cur);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    this.kick();
  }
  gyro(ctx, cx, cy, R, t, al) {
    if (al <= 0.01) return;
    // rings from the brand mark: [centerY (in R), radius (in R), gimbal]
    const rings = [[0, 1, 0], [-0.342, 0.658, 1], [0.342, 0.658, 1], [0, 0.317, 2]];
    const rx = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; };
    const ry = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; };
    const rz = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; };
    const a0 = t * 0.35, a1 = t * 0.55, a2 = -t * 0.8;
    const F = 4.5, N = 96;
    ctx.save(); ctx.lineWidth = Math.max(1.5, R * 0.018); ctx.lineCap = 'round'; ctx.strokeStyle = '#4040D9';
    for (const [oy, r, g] of rings) {
      let prev = null;
      for (let i = 0; i <= N; i++) {
        const th = i / N * 6.2832;
        let p = [Math.cos(th) * r, oy + Math.sin(th) * r, 0];
        if (g === 2) p = rx(ry(p, a2), 0.6);
        if (g >= 1) p = rx(p, a1);
        p = ry(rz(p, 0.15), a0);
        p = rx(p, 0.25);
        const k = F / (F - p[2]), q = [cx + p[0] * R * k, cy + p[1] * R * k, p[2]];
        if (prev) { ctx.globalAlpha = al * (0.45 + 0.55 * ((prev[2] + q[2]) / 2 + 1) / 2); ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(q[0], q[1]); ctx.stroke(); }
        prev = q;
      }
    }
    ctx.restore();
  }
  bloom(K) {
    const c = this.canvas, W = c.width, H = c.height, ctx = this.ctx;
    if (!this._bl) this._bl = [[6, 3, .9]].map(([s, b, a]) => ({ s, b, a, c: document.createElement('canvas') }));
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
if (!customElements.get('particle-vortex')) customElements.define('particle-vortex', ParticleVortex);
