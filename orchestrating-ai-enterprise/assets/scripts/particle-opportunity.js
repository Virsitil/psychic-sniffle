// Finding 08: four colours of particles in disarray; after a pause they slowly align into four orchestrated lanes, three data streams per lane.
class ParticleOpportunity extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%';
    const c = this.canvas = document.createElement('canvas');
    c.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(c); this.ctx = c.getContext('2d');
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.cur = 0; this.sec = this.closest('section');
    this.ro = new ResizeObserver(() => { this.resize(); this.build(); }); this.ro.observe(this);
    this.io = new IntersectionObserver(es => { this.visible = es[0].isIntersecting; if (this.visible) this.kick(); else this.vt = 0; }); this.io.observe(this);
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
  geo() {
    // vertical layout: four lanes side by side, data flows up and down
    const { w, h } = this, an = this.sec && this.sec.querySelector('[data-pf-anchor]');
    let A = { x: 0, y: 0, w, h };
    if (an) { const r = an.getBoundingClientRect(), me = this.canvas.getBoundingClientRect(); if (r.width > 0) A = { x: r.left - me.left, y: r.top - me.top, w: r.width, h: r.height }; }
    this.A = A;
    const gh = Math.min(A.h * 0.9, 560), gw = Math.min(A.w * 0.85, gh * 0.78);
    return { x0: A.x + (A.w - gw) / 2, gw, y0: A.y + (A.h - gh) / 2, gh, lw: gw / 4 };
  }
  build() {
    let s = 9; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    const { gh } = this.geo(), per = Math.max(8, Math.round(gh / 32));
    this.ps = [];
    for (let lane = 0; lane < 4; lane++) for (let st = 0; st < 3; st++) {
      const sp = 0.035 + rnd() * 0.03, n = per + Math.round((rnd() - .5) * 4);
      for (let i = 0; i < n; i++)
        this.ps.push({ lane, st, sp, u: (i + rnd() * .4) / n, sz: 3.2928 + rnd() * 5.1744, x: rnd(), y: rnd(), vx: (rnd() - .5) * .06, vy: (rnd() - .5) * .06, delay: rnd() * .55 });
    }
  }
  frame(now) {
    this.raf = 0; if (!this.visible) return;
    const dt = Math.min(0.05, (now - (this.last || now)) / 1000); this.last = now;
    const sm = v => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
    // auto-build: linger in chaos, then slowly orchestrate; resets when the section leaves view
    let inView = true; if (this.sec) { const r = this.sec.getBoundingClientRect(); inView = r.top < innerHeight * .7 && r.bottom > innerHeight * .3; }
    if (inView) this.vt = (this.vt || 0) + dt;
    // scroll-driven and reversible: lanes form as the section moves up the screen, scatter again on the way back
    { const r = this.sec ? this.sec.getBoundingClientRect() : null, p = r ? (innerHeight - r.top) / (innerHeight + r.height) : .6;
      const tgt = this.reduce ? 1 : sm((p - .25) / .35); this.cur = (this.cur || 0) + (tgt - (this.cur || 0)) * Math.min(1, dt * 3); }
    const { ctx, w, h } = this, mo = this.reduce ? 0 : 1, T = now / 1000 * mo;
    const { x0, gw, y0, gh, lw } = this.geo();
    ctx.clearRect(0, 0, w, h);
    const COLS = ['#FF5A4D', '#BF517C', '#8049AA', '#4040D9'];
    const wave = (k, y) => Math.sin((y - y0) / gh * 6.2832 * 1.1 + T * (0.8 + k * .07) + k * 1.7) * lw * 0.06;
    const sx = (lane, st) => x0 + lane * lw + lw * (0.22 + st * 0.28);
    // lane dividers: thin lines that draw in as the system becomes orchestrated
    const lv = sm((this.cur - .15) / .6);
    if (lv > .01) {
      // lane dividers, tinted with the colours of the lanes either side
      const DIV = ['#FF5A4D', '#DF5665', '#9F4D93', '#5F46C2', '#4040D9'], len = gh * lv;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) {
        const x = Math.round(x0 + i * lw) + .5, ya = y0 + (gh - len) / 2, yb = y0 + (gh + len) / 2;
        const gr = ctx.createLinearGradient(0, ya, 0, yb); gr.addColorStop(0, DIV[i] + '00'); gr.addColorStop(.2, DIV[i]); gr.addColorStop(.8, DIV[i]); gr.addColorStop(1, DIV[i] + '00');
        ctx.strokeStyle = gr; ctx.globalAlpha = (i === 0 || i === 4 ? .22 : .32) * lv;
        ctx.beginPath(); ctx.moveTo(x, ya); ctx.lineTo(x, yb); ctx.stroke();
      }
    }
    for (const q of this.ps) {
      q.x += q.vx * dt * mo * (1 - this.cur); q.y += q.vy * dt * mo * (1 - this.cur);
      if (q.x < 0) q.x += 1; else if (q.x > 1) q.x -= 1; if (q.y < 0) q.y += 1; else if (q.y > 1) q.y -= 1;
      const dir = q.lane % 2 ? -1 : 1, u = ((q.u + dir * T * q.sp) % 1 + 1) % 1;
      const ty = y0 + u * gh, tx = sx(q.lane, q.st) + wave(q.lane * 3 + q.st, ty);
      const e = sm((this.cur - q.delay) / (1 - q.delay));
      const A = this.A, cxp = A.x - A.w * .1 + q.x * A.w * 1.2, cyp = A.y + q.y * A.h, x = cxp + (tx - cxp) * e, y = cyp + (ty - cyp) * e;
      const edge = Math.min(1, Math.min(u, 1 - u) / .1);
      const al = (0.4 + 0.55 * e) * ((1 - e) + e * edge), r = q.sz / 2 * (1 - .25 * e);
      if (q.lane === 3 && e > .5) { ctx.fillStyle = '#758CE5'; ctx.globalAlpha = al * .35; ctx.beginPath(); ctx.arc(x, y, r * 2, 0, 6.2832); ctx.fill(); }
      ctx.fillStyle = COLS[q.lane]; ctx.globalAlpha = Math.min(1, al); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    this.kick();
  }
}
if (!customElements.get('particle-opportunity')) customElements.define('particle-opportunity', ParticleOpportunity);
