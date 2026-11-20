// Hero: particles shoot down into a hexagon frame and assemble into a rotating sphere inside it.
class HexSphere extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block'; this.style.width = '100%'; this.style.height = '100%';
    const c = this.canvas = document.createElement('canvas');
    c.style.cssText = 'display:block;width:100%;height:100%';
    this.appendChild(c); this.ctx = c.getContext('2d'); this.sec = this.closest('section');
    c.addEventListener('click', e => { if (!this.close) return; const r = c.getBoundingClientRect(), g = this.geo || {}; if (Math.hypot(e.clientX - r.left - g.cx, e.clientY - r.top - g.cy) < (g.R || 0) * 1.05) { this.t0 = performance.now(); this.kick(); } });
    c.addEventListener('mousemove', e => { const r = c.getBoundingClientRect(), g = this.geo || {}; c.style.cursor = this.close && Math.hypot(e.clientX - r.left - g.cx, e.clientY - r.top - g.cy) < (g.R || 0) * 1.05 ? 'pointer' : ''; });
    this.reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    // variant "close": a sparser, larger all-blue outcome sphere with a smaller coral sphere turning inside it
    this.close = this.getAttribute('variant') === 'close';
    const ga = Math.PI * (3 - Math.sqrt(5)), shell = (N, inner) => {
      for (let i = 0; i < N; i++) {
        const y = 1 - (i + .5) / N * 2, r = Math.sqrt(1 - y * y), th = i * ga;
        this.ps.push({ x: Math.cos(th) * r, y, z: Math.sin(th) * r, inner, coral: inner, sz: this.close ? (inner ? 2.4 : 2.6) + rnd() * (inner ? 3 : 4.2) : (inner ? 2.4 + rnd() * 2.8 : 2.1 + rnd() * 3.2), sx: rnd(), delay: rnd() * 1.6, ctl: rnd() - .5 });
      }
    };
    this.ps = [];
    if (this.close) { shell(260, false); shell(90, true); } else { shell(860, false); shell(150, true); }
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(this);
    this.io = new IntersectionObserver(es => { this.visible = es[0].isIntersecting; if (this.visible) { if (this.t0 == null) this.t0 = performance.now() - (this.hasAttribute('assembled') ? 1e5 : 0); this.kick(); } }); this.io.observe(this);
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
  hexPath(cx, cy, R, rr, keep) {
    const ctx = this.ctx, pts = [];
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]); }
    if (!keep) ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const p0 = pts[(i + 5) % 6], p1 = pts[i], p2 = pts[(i + 1) % 6];
      const d1 = Math.hypot(p1[0] - p0[0], p1[1] - p0[1]), d2 = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      const a = [p1[0] + (p0[0] - p1[0]) * rr / d1, p1[1] + (p0[1] - p1[1]) * rr / d1], b = [p1[0] + (p2[0] - p1[0]) * rr / d2, p1[1] + (p2[1] - p1[1]) * rr / d2];
      i ? ctx.lineTo(a[0], a[1]) : ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(p1[0], p1[1], b[0], b[1]);
    }
    ctx.closePath(); return pts;
  }
  frame(now) {
    this.raf = 0; if (!this.visible) return;
    const { ctx, w, h } = this, sm = v => { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
    let T = this.reduce ? 99 : (now - this.t0) / 1000;
    if (this.close && !this.reduce && this.sec) { // build on scroll (reversible): map section progress onto the build timeline
      const r = this.sec.getBoundingClientRect(), p = (innerHeight - r.top) / (innerHeight + r.height), v = Math.max(0, Math.min(1, (p - .15) / .4));
      this.Ts = (this.Ts == null ? 0 : this.Ts) + (v * 3.8 - (this.Ts || 0)) * .12; T = this.Ts;
    }
    let P = 1;
    if (!this.close) { // hero: progress through the sticky scroll stage (reversible)
      const sr = this.sec ? this.sec.getBoundingClientRect() : null, span = sr ? Math.max(1, sr.height - innerHeight) : 1;
      const P0 = .62, tgt = this.reduce ? 1 : P0 + (1 - P0) * Math.max(0, Math.min(1, -sr.top / span / .85)); // opens part-way: agents visible but not yet orchestrated
      this.Ps = this.Ps == null ? tgt : this.Ps + (tgt - this.Ps) * .1; P = this.Ps;
    }
    const fw = Math.min(w, 1360), off = (w - fw) / 2; // keep the hero graphic aligned to the content grid on very wide screens
    let wide = w > 820, R = Math.min(h * 0.37, wide ? fw * 0.19 : w * 0.38), cx = wide ? off + fw * 0.75 : w * 0.5, cy = wide ? h * 0.5 : h * 0.62;
    // optional anchor: when the section has a [data-pf-anchor] cell, centre the hexagon in it (canvas still fills the section)
    const an = this.sec && this.sec.querySelector('[data-pf-anchor]');
    if (an) { const r = an.getBoundingClientRect(), me = this.canvas.getBoundingClientRect(); if (r.width > 0) { R = Math.min(r.width, r.height) * .4; cx = r.left - me.left + r.width / 2; cy = r.top - me.top + r.height / 2; wide = true; } }
    this.geo = { cx, cy, R };
    const Tw = this.reduce ? 0 : now / 1000; // wall clock for ambient motion (not reset by click)
    ctx.clearRect(0, 0, w, h);
    if (!this.close && P < .7) { // soft lilac fog that makes the opening field read as almost solid
      const fg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * .8), fa = (1 - sm(P / .7)) * sm(P / .45);
      fg.addColorStop(0, `rgba(176,186,240,${.55 * fa})`); fg.addColorStop(.6, `rgba(196,204,244,${.45 * fa})`); fg.addColorStop(1, `rgba(214,222,248,${.35 * fa})`);
      ctx.fillStyle = fg; ctx.fillRect(0, 0, w, h);
    }
    ctx.save(); if (!wide) ctx.globalAlpha = .35;
    const br = this.reduce ? 0 : 1, s3 = 1.16 + .035 * Math.sin(Tw * .9) * br, s2 = 1 + .022 * Math.sin(Tw * .9 - .9) * br;
    if (!this.close) {
    // hero: the inner hexagon is outlined in white from the first frame; the rest of the graphic builds as the particles gather
    const base = ctx.globalAlpha, D = 1 - sm(P / .55);
    const fIn = sm((P - .3) / .35), fCube = sm((P - .4) / .3), f2 = sm((P - .45) / .3), f3 = sm((P - .55) / .3), grow = f => .93 + .07 * f;
    // the two banded hexagons: BMC Coral in the un-orchestrated start, warming to lilac as the scene is orchestrated
    // the two banded hexagons fill in lilac as the scene is orchestrated (their coral start state is drawn as thin strokes above the particles)
    { const L0 = 1 - D;
      if (L0 > .01) { ctx.globalAlpha = base * L0 * (.55 + .12 * Math.sin(Tw * .9) * br); this.hexPath(cx, cy, R * s3, R * s3 * .09); this.hexPath(cx, cy, R * s2, R * s2 * .085, true); ctx.fillStyle = 'rgba(196,196,242,.55)'; ctx.fill('evenodd');
      ctx.globalAlpha = base * L0; this.hexPath(cx, cy, R * s2, R * s2 * .085); this.hexPath(cx, cy, R * .9, R * .09, true); ctx.fillStyle = 'rgba(178,178,238,.85)'; ctx.fill('evenodd'); } }
    ctx.lineWidth = 1; ctx.strokeStyle = '#758CE5';
    // (hero outline ripple replaced by the radiating weave)
    this.hexPath(cx, cy, R * .9, R * .09);
    if (fIn > 0) { const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * .92); g.addColorStop(0, 'rgba(208,208,246,0)'); g.addColorStop(.55, 'rgba(208,208,246,0)'); g.addColorStop(1, 'rgba(190,190,240,.55)'); ctx.globalAlpha = base * fIn; ctx.fillStyle = g; ctx.fill(); }
    // the white outline warms to lilac as the scene lightens, then hands over to the filled hexagon
    const L = 1 - D, sc0 = [255, 255, 255], sc1 = [117, 140, 229];
    if (this.tl == null) this.tl = now; const tl = this.reduce ? 1e9 : now - this.tl, dIn = sm(tl / 1700), dCube = sm((tl - 700) / 1500), per = 6 * R * .9;
    ctx.strokeStyle = `rgb(${sc0.map((v, j) => Math.round(v + (sc1[j] - v) * L)).join(',')})`; ctx.lineWidth = 1; ctx.globalAlpha = base * (.85 - .45 * fIn);
    if (dIn < 1) { ctx.setLineDash([per * 1.06 * dIn, per * 2]); ctx.lineDashOffset = 0; } ctx.stroke(); ctx.setLineDash([]);
    // a small white particle patrols the outline while the scene is dark
    if (D > .02 && dIn > .95) { const V = []; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; V.push([cx + R * .9 * Math.cos(a), cy + R * .9 * Math.sin(a)]); }
      const at = q => { q = ((q % 1) + 1) % 1 * 6; const i = Math.floor(q), f = q - i, A = V[i], B = V[(i + 1) % 6]; return [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f]; };
      const u0 = Tw * .045; ctx.fillStyle = '#ffffff';
      for (let k = 0; k < 14; k++) { const [x, y] = at(u0 - k * .0035); ctx.globalAlpha = base * D * sm((dIn - .95) / .05) * (k ? .5 * (1 - k / 14) : 1); ctx.beginPath(); ctx.arc(x, y, k ? 1.4 * (1 - k / 18) : 2.2, 0, 6.2832); ctx.fill(); }
      const [gx, gy] = at(u0); ctx.globalAlpha = base * D * .25; ctx.beginPath(); ctx.arc(gx, gy, 6, 0, 6.2832); ctx.fill(); }
    { // cube guide lines: white with the outline at the start, Electric Blue once the scene is light
      const Ri = R * .68, pts = [];
      for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; pts.push([cx + Ri * Math.cos(a), cy + Ri * Math.sin(a)]); }
      ctx.lineWidth = 1; ctx.strokeStyle = `rgb(${[255, 255, 255].map((v, j) => Math.round(v + ([64, 64, 217][j] - v) * L)).join(',')})`; ctx.globalAlpha = (.55 * D + .45 * fCube * (1 - D)) * (wide ? 1 : .35);
      const cubeLen = 6 * Ri;
      ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
      if (dCube < 1) ctx.setLineDash([cubeLen * dCube, cubeLen * 2]); ctx.stroke(); ctx.setLineDash([]);
      const sp = sm((dCube - .35) / .65);
      if (sp > 0) { ctx.beginPath(); [0, 2, 4].forEach(i => { ctx.moveTo(cx, cy); ctx.lineTo(cx + (pts[i][0] - cx) * sp, cy + (pts[i][1] - cy) * sp); }); ctx.stroke(); }
    }
    } else {
    const fade = this.close ? 1 : sm((P - .3) / .45), base = ctx.globalAlpha;
    // three concentric hexagons: the outer two breathe slowly (offset phases), the inner one holds the glow
    const br = this.reduce ? 0 : 1;
    const s3 = 1.16 + .035 * Math.sin(Tw * .9) * br, s2 = 1 + .022 * Math.sin(Tw * .9 - .9) * br;
    if (!this.close) { ctx.globalAlpha = base * fade * (.55 + .12 * Math.sin(Tw * .9) * br);
    this.hexPath(cx, cy, R * s3, R * s3 * .09); ctx.fillStyle = 'rgba(196,196,242,.55)'; ctx.fill(); }
    ctx.globalAlpha = base * fade;
    this.hexPath(cx, cy, R * s2, R * s2 * .085); if (this.close) this.hexPath(cx, cy, R * .9, R * .09, true); ctx.fillStyle = 'rgba(178,178,238,.85)'; ctx.fill(this.close ? 'evenodd' : 'nonzero');
    // five outer hexagon outlines, fading out as they move away from the graphic
    {
      ctx.lineWidth = 1; ctx.strokeStyle = '#758CE5'; const s0 = this.close ? s2 : s3;
      const nO = this.close ? 9 : 5; for (let i = 1; i <= nO; i++) { const sc = s0 + i * .13 + .01 * i * Math.sin(Tw * .9 - .9 - i * .35) * br; ctx.globalAlpha = base * fade * .42 * Math.pow(1 - i / (nO + 1), 1.3); this.hexPath(cx, cy, R * sc, R * sc * .085); ctx.stroke(); }
      ctx.globalAlpha = base * fade;
    }
    if (!this.close) { this.hexPath(cx, cy, R * .9, R * .09);
    const g = ctx.createRadialGradient(cx, cy, R * .42, cx, cy, R * .92);
    g.addColorStop(0, '#ffffff'); g.addColorStop(.35, '#ffffff'); g.addColorStop(.7, '#c3c3f1'); g.addColorStop(1, '#9b9be8');
    ctx.fillStyle = g; ctx.fill(); }
    else { this.hexPath(cx, cy, R * .9, R * .09); ctx.strokeStyle = 'rgba(117,140,229,.55)'; ctx.lineWidth = 1; ctx.stroke(); }
    // isometric cube guide lines (hero only)
    if (!this.close) {
    const Ri = R * .68, pts = [];
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; pts.push([cx + Ri * Math.cos(a), cy + Ri * Math.sin(a)]); }
    ctx.lineWidth = 1; ctx.strokeStyle = '#4040D9'; ctx.globalAlpha = .45 * fade * (wide ? 1 : .35);
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
    [0, 2, 4].forEach(i => { ctx.moveTo(cx, cy); ctx.lineTo(pts[i][0], pts[i][1]); });
    ctx.stroke();
    }
    }
    ctx.restore();
    if (this.close) this.twist(ctx, cx, cy, R, s2, sm((T - 2.4) / 1.2), wide);
    else { this.twist(ctx, cx, cy, R, s2, sm((P - .86) / .12), wide); this.twist(ctx, cx, cy, R, s2, sm((P - .64) / .3), wide, { rIn: R * s3 * 1.02, rOut: R * 2.1, N: 16, tw: Math.PI / 4, fade: true, Tw }); }
    if (!this.close) this.field(ctx, w, h, cx, cy, R, P, Tw, wide, sm);
    if (!this.close) { // coral bands sit above the scattered particles in the un-orchestrated start, then hand back to the lilac bands beneath
      const Dc = 1 - sm(P / .55);
      if (Dc > .01) {
        ctx.lineWidth = 1; ctx.strokeStyle = '#FF5A4D';
        ctx.globalAlpha = Dc * .9; this.hexPath(cx, cy, R * s2, R * s2 * .085); ctx.stroke();
        ctx.globalAlpha = Dc * .6; this.hexPath(cx, cy, R * s3, R * s3 * .09); ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    else {
    // particles: shoot down from above into the hexagon, then settle onto a rotating sphere
    const SR0 = R * (this.close ? .44 : .42), rot0 = Tw * .25, tilt = .35, ct = Math.cos(tilt), st = Math.sin(tilt);
    const entryY = cy - R;
    const list = [];
    for (const p of this.ps) {
      const rot = p.inner ? -rot0 * 1.5 : rot0, cr = Math.cos(rot), sr = Math.sin(rot), SR = p.inner ? SR0 * .42 : SR0;
      const x1 = p.x * cr + p.z * sr, z1 = -p.x * sr + p.z * cr, y2 = p.y * ct - z1 * st, z2i = p.y * st + z1 * ct, z2 = p.inner ? z2i * .42 : z2i;
      const k = 3.2 / (3.2 - z2), tx = cx + x1 * SR * k, ty = cy + y2 * SR * k, depth = (z2 + 1) / 2;
      const u = Math.max(0, Math.min(1, (T - .5 - p.delay) / 1.5)), e = 1 - Math.pow(1 - u, 3);
      if (u <= 0) continue;
      // quadratic path: from above the frame, through the top of the hexagon, onto the sphere
      const sx = cx + (p.sx - .5) * R * 2.4, sy = -20, qx = cx + p.ctl * R * .5, qy = entryY + R * .15;
      const m = 1 - e, x = m * m * sx + 2 * m * e * qx + e * e * tx, y = m * m * sy + 2 * m * e * qy + e * e * ty;
      list.push({ p, x, y, depth, e, u });
    }
    list.sort((a, b) => a.depth - b.depth);
    for (const o of list) {
      const { p, x, y, depth, e, u } = o, r = p.sz / 2 * (0.75 + 0.6 * depth * e + (1 - e) * .5);
      const a = (0.35 + 0.65 * depth) * (0.4 + 0.6 * e) * (wide ? 1 : .5);
      if (u < 1) { // short motion streak while falling
        const ee = 1 - Math.pow(1 - Math.max(0, u - .05), 3);
        ctx.strokeStyle = p.coral ? '#FF5A4D' : '#4040D9'; ctx.globalAlpha = a * .35 * (1 - e); ctx.lineWidth = r;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 28 * (1 - e)); ctx.stroke();
      }
      if (!p.coral) { ctx.fillStyle = '#758CE5'; ctx.globalAlpha = a * .35; ctx.beginPath(); ctx.arc(x, y, r * 2, 0, 6.2832); ctx.fill(); }
      ctx.fillStyle = p.coral ? '#FF5A4D' : '#4040D9'; ctx.globalAlpha = Math.min(1, p.coral ? a : a * 1.2);
      ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    }
    }
    // guards: coral patrols the inner hexagon clockwise; electric blue patrols the breathing outer hexagon counter-clockwise
    const on = (this.close ? 1 : sm((P - .78) / .18)) * (wide ? 1 : .5);
    const guard = (Rp, s0, dir, col, halo) => {
      const V = [];
      for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; V.push([cx + Rp * Math.cos(a), cy + Rp * Math.sin(a)]); }
      const at = s => { s = ((s % 6) + 6) % 6; const i = Math.floor(s), f = s - i, a = V[i], b = V[(i + 1) % 6]; return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]; };
      for (let k = 14; k >= 1; k--) { const [x, y] = at(s0 - dir * k * .02); ctx.fillStyle = col; ctx.globalAlpha = on * .5 * (1 - k / 15); ctx.beginPath(); ctx.arc(x, y, 3.2 * (1 - k / 20), 0, 6.2832); ctx.fill(); }
      const [gx, gy] = at(s0);
      ctx.fillStyle = halo; ctx.globalAlpha = on * .3; ctx.beginPath(); ctx.arc(gx, gy, 12, 0, 6.2832); ctx.fill();
      ctx.fillStyle = col; ctx.globalAlpha = on; ctx.beginPath(); ctx.arc(gx, gy, 5, 0, 6.2832); ctx.fill();
    };
    if (!this.close) guard(R * .9, Tw * .55, 1, '#FF5A4D', '#FF5A4D');
    guard((this.close ? R * s2 * .97 : R * s3 * .985), -Tw * .42, -1, '#4040D9', '#758CE5');
    ctx.globalAlpha = 1;
    this.kick();
  }
  field(ctx, w, h, cx, cy, R, P, Tw, wide, sm) {
    // the opening screen is filled edge to edge with particles; scrolling gathers them into the sphere
    if (!this.fp) {
      let q = 11; const rn = () => (q = (q * 16807) % 2147483647) / 2147483647;
      const N = Math.round(Math.max(1100, Math.min(4200, w * h / 300))), light = [[201, 207, 245], [183, 193, 242], [220, 226, 250], [169, 182, 238], [142, 158, 234]];
      this.fp = [];
      for (let i = 0; i < N; i++) {
        const sp = this.ps[i % this.ps.length], extra = i >= this.ps.length;
        this.fp.push({ fx: rn(), fy: rn(), ph: rn() * 6.28, sp, extra, d: rn(), r0: 3 + rn() * 6.4, c0: sp.coral && !extra ? [255, 186, 178] : light[Math.floor(rn() * light.length)], sw: (rn() - .5) * 2, pulse: !extra && rn() < .035, cd: sp.coral && !extra ? [70, 38, 64] : [[16, 44, 88], [20, 52, 102], [28, 62, 120], [18, 48, 96]][Math.floor(rn() * 4)] });
      }
    }
    const SR0 = R * .357, rot0 = Tw * .25, tilt = .35, ct = Math.cos(tilt), st = Math.sin(tilt), cr = Math.cos(rot0), sr = Math.sin(rot0), cri = Math.cos(-rot0 * 1.4), sri = Math.sin(-rot0 * 1.4);
    const list = [];
    for (const f of this.fp) {
      const p = f.sp, c_ = p.inner ? cri : cr, s_ = p.inner ? sri : sr, SRp = p.inner ? SR0 * .42 : SR0, x1 = p.x * c_ + p.z * s_, z1 = -p.x * s_ + p.z * c_, y2 = p.y * ct - z1 * st, z2 = p.y * st + z1 * ct;
      const k = 3.2 / (3.2 - z2), tx = cx + x1 * SRp * k, ty = cy + y2 * SRp * k, depth = p.inner ? .5 + z2 * .15 : (z2 + 1) / 2;
      const u = Math.max(0, Math.min(1, (P - f.d * .42) / .5)), e = u * u * (3 - 2 * u);
      const sx = (f.fx + Math.sin(Tw * .25 + f.ph) * .012) * w, sy = (f.fy + Math.cos(Tw * .21 + f.ph) * .012) * h;
      const dx = tx - sx, dy = ty - sy, bend = Math.sin(e * Math.PI) * f.sw * .18;
      const x = sx + dx * e - dy * bend, y = sy + dy * e + dx * bend;
      let a = (1 - e) * .78 + e * (0.35 + 0.65 * depth);
      if (f.extra) a *= 1 - sm((e - .55) / .4);
      if (a < .01) continue;
      list.push({ f, x, y, e, a, depth });
    }
    list.sort((A, B) => A.depth * A.e - B.depth * B.e);
    const M = wide ? 1 : .6, D = 1 - sm(P / .55); // D: midnight opening state
    for (const o of list) {
      const { f, x, y, e, a, depth } = o, p = f.sp, c1 = p.coral && !f.extra ? [255, 90, 77] : [64, 64, 217];
      const r1 = p.sz / 2 * (0.75 + 0.6 * depth), r = f.r0 * (1 - e) + r1 * e;
      if (e > .6 && !p.coral) { ctx.fillStyle = '#758CE5'; ctx.globalAlpha = a * .35 * (e - .6) / .4 * M; ctx.beginPath(); ctx.arc(x, y, r * 2, 0, 6.2832); ctx.fill(); }
      const c0 = [0, 1, 2].map(j => f.cd[j] * D + f.c0[j] * (1 - D));
      ctx.fillStyle = `rgb(${Math.round(c0[0] + (c1[0] - c0[0]) * e)},${Math.round(c0[1] + (c1[1] - c0[1]) * e)},${Math.round(c0[2] + (c1[2] - c0[2]) * e)})`;
      ctx.globalAlpha = Math.min(1, a * (1 + .2 * e)) * M * (1 - D * .62); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
      if (f.pulse && e > .9) { const pz = Math.max(0, Math.sin(Tw * 1.3 + f.ph * 3)); ctx.globalAlpha = .16 * pz * pz * a * M; ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, 6.2832); ctx.fill(); }
    }
    ctx.globalAlpha = 1;
  }
  // string-art ribbon on the lilac band: stacked hexagons, each rotated and shrunk a little, drawn in once the sphere has formed
  twist(ctx, cx, cy, R, s2, fr, wide, o = {}) {
    if (fr <= .001) return;
    const N = o.N || 24, rOut = o.rOut || R * s2 * 1.0, rIn = o.rIn || R * .9, tw = (o.tw || Math.PI / 10) + (o.Tw ? Math.sin(o.Tw * .15) * .06 : 0);
    const pal = [[145, 71, 150], [255, 90, 77], [64, 64, 217], [117, 140, 229], [64, 64, 217], [5, 33, 64]];
    const shown = fr * N;
    ctx.save(); ctx.lineWidth = .75;
    for (let k = 0; k < N; k++) {
      const vis = Math.max(0, Math.min(1, shown - k)); if (vis <= 0) break;
      const f = o.fade ? 1 - k / (N - 1) : k / (N - 1), r = o.fade ? rIn + (rOut - rIn) * Math.pow(k / (N - 1), 1.35) : rOut - (rOut - rIn) * f, rot = -Math.PI / 2 + tw * (o.fade ? k / (N - 1) : f), V = [];
      for (let i = 0; i < 6; i++) { const a = rot + i * Math.PI / 3; V.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
      for (let i = 0; i < 6; i++) {
        const c0 = pal[i], c1 = pal[(i + 1) % 6], c = c0.map((v, j) => Math.round(v + (c1[j] - v) * f));
        ctx.strokeStyle = `rgb(${c.join(',')})`; ctx.globalAlpha = vis * (o.fade ? (wide ? .8 : .45) * (Math.pow(f, 1.2) * .9 + .08) : (wide ? .5 : .3) * (.6 + .4 * Math.sin(f * Math.PI)));;
        ctx.beginPath(); ctx.moveTo(V[i][0], V[i][1]); ctx.lineTo(V[(i + 1) % 6][0], V[(i + 1) % 6][1]); ctx.stroke();
      }
    }
    ctx.restore();
  }
}
if (!customElements.get('hex-sphere')) customElements.define('hex-sphere', HexSphere);
