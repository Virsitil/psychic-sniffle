// Hover-to-orchestrate particle field. The canvas fills its whole section; the animation lives in the area of the
// section's [data-pf-anchor] element, so nothing is ever cut off by a box edge.
// mode "stack" (default): floating particles settle into stacked columns rising left to right.
// mode "waffle": 100 particles settle into a 10x10 grid coloured by stage (production / pilot / planned / not yet).
class ParadoxField extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%';
    const c = this.canvas = document.createElement('canvas'); c.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(c); this.ctx = c.getContext('2d');
    this.mode = this.getAttribute('mode') || 'stack'; this.trigger = this.getAttribute('trigger') || 'hover';
    this.sec = this.closest('section');
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.hover = matchMedia('(hover: hover)').matches;
    this.cur = 0; this.target = 0;
    const inArea = e => { const r = c.getBoundingClientRect(), A = this.A; if (!A) return false; const x = e.clientX - r.left, y = e.clientY - r.top, px = A.w * .08, py = A.h * .08; return x > A.x - px && x < A.x + A.w + px && y > A.y - py && y < A.y + A.h + py; };
    c.addEventListener('pointermove', e => { if (e.pointerType === 'touch' || this.trigger === 'scroll') return; const on = inArea(e); c.style.cursor = on ? 'pointer' : ''; this.target = on ? 1 : 0; });
    c.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch' && this.trigger !== 'scroll') this.target = 0; });
    c.addEventListener('click', e => { if (this.trigger !== 'scroll' && (e.pointerType === 'touch' || !this.hover) && inArea(e)) this.target = this.target ? 0 : 1; });
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
  area() {
    const a = this.sec && this.sec.querySelector('[data-pf-anchor]');
    if (!a) return { x: this.w * .5, y: this.h * .15, w: this.w * .45, h: this.h * .7 };
    const r = a.getBoundingClientRect(), me = this.canvas.getBoundingClientRect();
    return { x: r.left - me.left, y: r.top - me.top, w: r.width || 1, h: r.height || 1 };
  }
  build() {
    let s = 21; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    this.ps = [];
    if (this.mode === 'waffle') {
      for (let n = 0; n < 100; n++) {
        const cat = n < 4 ? 0 : n < 7 ? 1 : n < 24 ? 2 : 3;
        this.ps.push({ gi: n % 10, gj: Math.floor(n / 10), cat, x: rnd(), y: rnd(), ph: rnd() * 6.28, sp: .4 + rnd() * .6, coral: rnd() < .35, sz: 3.9 + rnd() * 6.0, delay: (Math.floor(n / 10) / 10) * .4 + rnd() * .2 });
      }
    } else {
      const cols = 16, rows = 16; this.cols = cols; this.rows = rows;
      for (let i = 0; i < cols; i++) {
        const n = Math.max(2, Math.round(rows * (.22 + .72 * i / (cols - 1))));
        for (let j = 0; j < n; j++) this.ps.push({ gi: i, gj: j, q: i / (cols - 1), x: rnd(), y: rnd(), ph: rnd() * 6.28, sp: .4 + rnd() * .6, coral: rnd() < .35, sz: 3.9 + rnd() * 6.0, delay: (i / cols) * .45 + rnd() * .15 + j * .008 });
      }
    }
  }
  frame(now) {
    this.raf = 0; if (!this.visible) return;
    const dt = Math.min(.05, (now - (this.last || now)) / 1000); this.last = now;
    if (this.trigger === 'scroll' && this.sec) { // scroll-driven and reversible: order builds as the section moves up the screen
      const r = this.sec.getBoundingClientRect(), p = (innerHeight - r.top) / (innerHeight + r.height), v = Math.max(0, Math.min(1, (p - .28) / .3));
      this.target = this.reduce ? 1 : v * v * (3 - 2 * v);
    }
    this.cur += (this.target - this.cur) * Math.min(1, this.reduce ? 1 : dt * (this.trigger === 'scroll' ? 4 : 1.6));
    const { ctx, w, h } = this, T = this.reduce ? 0 : now / 1000, E = this.cur, A = this.A = this.area();
    const sm = v => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
    const rgb = q => [Math.round(255 - 191 * q), Math.round(90 - 26 * q), Math.round(77 + 140 * q)];
    ctx.clearRect(0, 0, w, h);
    // drifting coral glow inside the area
    const bx = A.x + A.w * (.5 + .2 * Math.sin(T * .21)), by = A.y + A.h * (.45 + .16 * Math.cos(T * .17)), br = Math.min(A.w, A.h) * (.62 - .25 * E);
    const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
    g.addColorStop(0, `rgba(255,90,77,${.4 * (1 - .7 * E)})`); g.addColorStop(.5, `rgba(255,150,140,${.18 * (1 - .7 * E)})`); g.addColorStop(1, 'rgba(201,195,246,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // ordered layout
    let cell, ox, oy;
    if (this.mode === 'waffle') { cell = Math.min(A.w * .8 / 10, A.h * .8 / 10); ox = A.x + (A.w - cell * 10) / 2 + cell / 2; oy = A.y + (A.h - cell * 10) / 2 + cell / 2; }
    else { cell = Math.min(A.w * .96 / this.cols, A.h * .84 / this.rows); ox = A.x + (A.w - cell * this.cols) / 2 + cell / 2; oy = A.y + A.h * .9 - cell / 2; }
    // faint lane lines / grid behind the stacks; they firm up as the particles settle
    if (this.mode !== 'waffle') {
      const top = oy - (this.rows - .5) * cell, bot = oy + cell * .5, l = ox - cell * .5, rr = ox + (this.cols - .5) * cell;
      ctx.lineWidth = 1; ctx.strokeStyle = '#052140';
      ctx.globalAlpha = .05 + .08 * E;
      for (let i = 0; i <= this.cols; i++) { const x = Math.round(l + i * cell) + .5; ctx.beginPath(); ctx.moveTo(x, top - cell); ctx.lineTo(x, bot + cell * .6); ctx.stroke(); }
      ctx.globalAlpha = .035 + .05 * E;
      for (let j = 0; j <= this.rows; j += 1) { const y = Math.round(bot - j * cell) + .5; ctx.beginPath(); ctx.moveTo(l - cell * .6, y); ctx.lineTo(rr + cell * .6, y); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
    const CAT = [[64, 64, 217], [117, 140, 229], [255, 90, 77], [169, 184, 214]];
    for (const p of this.ps) {
      const k = sm((E - p.delay) / (1 - p.delay));
      const tx = ox + p.gi * cell, ty = this.mode === 'waffle' ? oy + p.gj * cell : oy - p.gj * cell;
      const fx = bx + (p.x - .5) * A.w * .9 + Math.sin(T * p.sp + p.ph) * 22, fy = by + (p.y - .5) * A.h * .85 + Math.cos(T * p.sp * .8 + p.ph) * 18;
      const x = fx + (tx - fx) * k, y = fy + (ty - fy) * k;
      const pulse = 1 + .28 * Math.sin(T * 1.6 * p.sp + p.ph) * (1 - k);
      let r = p.sz / 2 * pulse * (1 - .15 * k), a = (.55 + .3 * Math.sin(T * 1.6 * p.sp + p.ph + 1)) * (1 - k) + .95 * k;
      const c0 = rgb(p.coral ? 0 : 1); let c1, halo;
      if (this.mode === 'waffle') { c1 = CAT[p.cat]; halo = p.cat < 2 ? k : 0; if (p.cat === 3) { a = a * (1 - k) + .55 * k; r = r * (1 - k) + Math.min(r, cell * .22) * k; } else r = r * (1 - k) + cell * .3 * k; }
      else { c1 = rgb(p.q); halo = p.q > .45 ? p.q : 0; }
      const col = c0.map((v, i) => Math.round(v + (c1[i] - v) * k));
      const blueish = this.mode === 'waffle' ? (p.coral ? 0 : 1 - k) + halo : (p.coral ? 0 : 1) * (1 - k) + halo * k;
      if (blueish > .3) { ctx.fillStyle = '#758CE5'; ctx.globalAlpha = a * .32 * Math.min(1, blueish); ctx.beginPath(); ctx.arc(x, y, r * 2, 0, 6.2832); ctx.fill(); }
      ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`; ctx.globalAlpha = Math.min(1, a); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    }
    ctx.globalAlpha = 1;
    this.kick();
  }
}
if (!customElements.get('paradox-field')) customElements.define('paradox-field', ParadoxField);
