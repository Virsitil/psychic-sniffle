// Ripple particles: two sources whose rings spread toward each other. Attrs: orient (vertical|horizontal), theme (light|dark), label-a, label-b, label-mid
class ParticleRipples extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%';
    const c = this.canvas = document.createElement('canvas');
    c.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(c); this.ctx = c.getContext('2d');
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.horiz = this.getAttribute('orient') === 'horizontal';
    this.dark = this.getAttribute('theme') === 'dark';
    const g = (...n) => { for (const k of n) { const v = this.getAttribute(k); if (v != null) return v === 'none' ? '' : v; } return null; };
    this.labels = [g('label-a', 'labela', 'labelA') ?? 'INTELLIGENCE', g('label-b', 'labelb', 'labelB') ?? 'OUTCOMES', g('label-mid', 'labelmid', 'labelMid') ?? 'ORCHESTRATION'];
    this.cur = 0; this.flowS = 0; this.R = 5;
    let s = 13; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    this.ps = [];
    for (const src of [0, 1]) for (let i = 0; i < this.R; i++) for (let j = 0; j < 64; j++) this.ps.push({ src, ring: i, f: (j + 0.5) / 64, sz: 2.52 + rnd() * 2.24, delay: rnd() * 0.45, x: rnd(), y: rnd() });
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(this);
    this.io = new IntersectionObserver(es => { this.visible = es[0].isIntersecting; if (this.visible) this.kick(); }); this.io.observe(this);
    this.resize();
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
    const sec = this.closest('section'), vh = innerHeight;
    let p = 1, target;
    if (sec) { const r = sec.getBoundingClientRect(); p = Math.max(0, Math.min(1, (vh - r.top) / (r.height + vh * 0.2))); }
    if (this.horiz) { const r = this.getBoundingClientRect(); target = r.top < vh * 0.8 && r.bottom > 0 ? 1 : 0; if (r.top > vh) this.cur = 0; }
    else target = Math.max(0, Math.min(1, (p - 0.08) / 0.3));
    if (this.reduce) target = 1;
    this.cur += (target - this.cur) * Math.min(1, dt * 4);
    const flowT = this.reduce ? 0.5 : now / 1000 * 0.12 + p * 3;
    this.flowS += (flowT - this.flowS) * Math.min(1, dt * 5);
    const { ctx, w, h, R, horiz } = this;
    ctx.clearRect(0, 0, w, h);
    const span = 1.25;
    // D = distance between sources; layout in axis frame (u along axis, v across)
    const D = horiz ? Math.min(w * 0.78, (h - 48) / 1.42) : Math.min(h - 64, w * 1.25);
    const cx = horiz ? w / 2 : w * 0.42, cy = horiz ? (h - 24) / 2 : h / 2;
    const S0 = horiz ? [cx - D / 2, cy] : [cx, cy - D / 2], S1 = horiz ? [cx + D / 2, cy] : [cx, cy + D / 2];
    const BASE = horiz ? [0, Math.PI] : [Math.PI / 2, -Math.PI / 2];
    const sp = D * 0.15, ph = ((this.flowS % 1) + 1) % 1;
    const radius = i => (i + ph) * sp;
    const life = r => Math.min(1, r / (sp * 0.8)) * Math.max(0, Math.min(1, (R * sp - r) / (sp * 1.2)));
    const sm = v => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
    const COL = this.dark ? ['#FF5A4D', '#758CE5'] : ['#FF5A4D', '#4040D9'];
    const INK = this.dark ? '#D6E8FC' : '#052140';
    if (this.cur > 0.05) {
      ctx.lineWidth = 1.5;
      for (const src of [0, 1]) for (let i = 0; i < R; i++) {
        const r = radius(i), o = src ? S1 : S0;
        ctx.strokeStyle = COL[src]; ctx.globalAlpha = (this.dark ? 0.22 : 0.16) * this.cur * life(r);
        ctx.beginPath(); ctx.arc(o[0], o[1], r, BASE[src] - span, BASE[src] + span); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    if (this.dark) ctx.globalCompositeOperation = 'source-over';
    for (const pt of this.ps) {
      const r = radius(pt.ring), o = pt.src ? S1 : S0, an = BASE[pt.src] - span + pt.f * span * 2;
      const tx = o[0] + Math.cos(an) * r, ty = o[1] + Math.sin(an) * r;
      const kk = Math.max(0, Math.min(1, (this.cur - pt.delay) / (1 - pt.delay))), e = kk * kk * (3 - 2 * kk);
      const px = pt.x * w + (tx - pt.x * w) * e, py = pt.y * h + (ty - pt.y * h) * e;
      const edge = 1 - Math.abs(pt.f - 0.5) * 2, fade = (0.25 + 0.75 * sm(edge * 1.6)) * life(r);
      const a = (1 - e) * 0.35 + e * fade * 0.95;
      if (a <= 0.01) continue;
      ctx.fillStyle = COL[pt.src]; ctx.globalAlpha = a;
      ctx.beginPath(); ctx.arc(px, py, pt.sz / 2, 0, 6.2832); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = this.cur;
    ctx.fillStyle = COL[0]; ctx.beginPath(); ctx.arc(S0[0], S0[1], 4, 0, 6.2832); ctx.fill();
    ctx.fillStyle = COL[1]; ctx.beginPath(); ctx.arc(S1[0], S1[1], 4, 0, 6.2832); ctx.fill();
    const L = Math.max(0, (this.cur - 0.6) / 0.4);
    if (L > 0) {
      ctx.globalAlpha = L;
      ctx.font = '600 11px "Plus Jakarta Sans", Tenorite, sans-serif'; ctx.textBaseline = 'middle';
      if (ctx.letterSpacing !== undefined) ctx.letterSpacing = '2px';
      const [la, lb, lm] = this.labels;
      if (horiz) {
        const ly = cy + D * 0.71 + 6;
        ctx.textAlign = 'left'; ctx.fillStyle = COL[0]; if (la) ctx.fillText(la, Math.max(0, S0[0] - 20), ly);
        ctx.textAlign = 'right'; ctx.fillStyle = COL[1]; if (lb) ctx.fillText(lb, Math.min(w, S1[0] + 20), ly);
        ctx.textAlign = 'center'; ctx.fillStyle = INK; if (lm) ctx.fillText(lm, cx, ly);
      } else {
        ctx.textAlign = 'center';
        ctx.fillStyle = COL[0]; if (la) ctx.fillText(la, S0[0], S0[1] - 18);
        ctx.fillStyle = COL[1]; if (lb) ctx.fillText(lb, S1[0], S1[1] + 18);
        if (lm) {
          const lx = cx + Math.sin(span) * D * 0.5 + 10;
          ctx.textAlign = 'left'; ctx.fillStyle = INK; ctx.fillText(lm, lx + 10, cy);
          ctx.strokeStyle = INK; ctx.globalAlpha = L * 0.35; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(cx + 8, cy); ctx.lineTo(lx + 2, cy); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
    this.kick();
  }
}
if (!customElements.get('particle-ripples')) customElements.define('particle-ripples', ParticleRipples);
