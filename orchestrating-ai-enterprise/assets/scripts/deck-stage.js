/* @ds-bundle: {"format":4,"namespace":"BMCDesignSystem_019df3","components":[{"name":"Badge","sourcePath":"components/Badge/Badge.jsx"},{"name":"Button","sourcePath":"components/Button/Button.jsx"},{"name":"Card","sourcePath":"components/Card/Card.jsx"},{"name":"StatCard","sourcePath":"components/StatCard/StatCard.jsx"}],"sourceHashes":{"components/Badge/Badge.jsx":"cb4829b9e709","components/Button/Button.jsx":"af80b1a5d189","components/Card/Card.jsx":"2b1c30497135","components/StatCard/StatCard.jsx":"a4e48fee8241","slides/deck-stage.js":"ad1c016a6256","ui_kits/helix/DashboardWidgets.jsx":"f2c7c05abb56","ui_kits/helix/IncidentCard.jsx":"f374c0ea2811","ui_kits/helix/Sidebar.jsx":"b022cab98cd6","ui_kits/helix/TopBar.jsx":"0ce5300c4fc8"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BMCDesignSystem_019df3 = window.BMCDesignSystem_019df3 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/Badge/Badge.jsx
try { (() => {
const BMC_BADGE_TONES = {
  critical: {
    bg: '#FFE8E6',
    fg: '#CC2A1F'
  },
  active: {
    bg: '#EDF3FF',
    fg: '#264580'
  },
  running: {
    bg: '#EEEEFF',
    fg: '#4040D9'
  },
  pending: {
    bg: '#F5EDF6',
    fg: '#914796'
  },
  neutral: {
    bg: '#F2F4F8',
    fg: '#3D4A5C'
  },
  midnight: {
    bg: '#052140',
    fg: '#EDFBFF'
  }
};
function Badge({
  tone = 'neutral',
  dot = true,
  children
}) {
  const t = BMC_BADGE_TONES[tone] || BMC_BADGE_TONES.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      background: t.bg,
      color: t.fg,
      fontFamily: "'Sofia Pro', 'Plus Jakarta Sans', system-ui, sans-serif",
      fontSize: 11,
      fontWeight: 700,
      padding: '3px 10px',
      borderRadius: 9999,
      letterSpacing: '0.02em'
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: t.fg
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Badge/Badge.jsx", error: String((e && e.message) || e) }); }

// components/Button/Button.jsx
try { (() => {
const BMC_BUTTON_VARIANTS = {
  primary: {
    background: '#FF5A4D',
    color: '#FFFFFF',
    border: '1.5px solid #FF5A4D'
  },
  secondary: {
    background: '#052140',
    color: '#FFFFFF',
    border: '1.5px solid #052140'
  },
  outline: {
    background: 'transparent',
    color: '#052140',
    border: '1.5px solid #052140'
  },
  ghost: {
    background: 'transparent',
    color: '#FF5A4D',
    border: '1.5px solid #FF5A4D'
  },
  subtle: {
    background: '#F7F8FD',
    color: '#052140',
    border: '1.5px solid #F7F8FD'
  },
  inverse: {
    background: 'transparent',
    color: '#FFFFFF',
    border: '1.5px solid #FFFFFF'
  }
};
const BMC_BUTTON_SIZES = {
  sm: {
    fontSize: 11,
    padding: '6px 14px'
  },
  md: {
    fontSize: 13,
    padding: '9px 20px'
  },
  lg: {
    fontSize: 15,
    padding: '12px 28px'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    disabled: disabled,
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      borderRadius: 4,
      fontFamily: "'Sofia Pro', 'Plus Jakarta Sans', system-ui, sans-serif",
      fontWeight: 700,
      letterSpacing: '0.01em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.4 : 1,
      transition: 'background 200ms ease, color 200ms ease',
      ...BMC_BUTTON_VARIANTS[variant],
      ...BMC_BUTTON_SIZES[size],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Button/Button.jsx", error: String((e && e.message) || e) }); }

// components/Card/Card.jsx
try { (() => {
const BMC_CARD_THEMES = {
  light: {
    bg: '#FFFFFF',
    title: '#052140',
    body: '#5A6474',
    border: '1px solid #E1E6F0'
  },
  dark: {
    bg: '#052140',
    title: '#FFFFFF',
    body: '#EDFBFF',
    border: '1px solid #052140'
  },
  sky: {
    bg: '#EDFBFF',
    title: '#052140',
    body: '#303D52',
    border: '1px solid #EDFBFF'
  }
};
function Card({
  theme = 'light',
  eyebrow,
  title,
  children,
  topRule = false,
  style
}) {
  const t = BMC_CARD_THEMES[theme] || BMC_CARD_THEMES.light;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: t.bg,
      border: t.border,
      borderTop: topRule ? '3px solid #FF5A4D' : t.border,
      borderRadius: 8,
      padding: '20px 22px',
      boxShadow: '0 2px 8px rgba(5,33,64,0.08)',
      fontFamily: "'Sofia Pro', 'Plus Jakarta Sans', system-ui, sans-serif",
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#FF5A4D',
      marginBottom: 8
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      color: t.title,
      lineHeight: 1.25,
      marginBottom: 8
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 300,
      color: t.body,
      lineHeight: 1.55
    }
  }, children));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Card/Card.jsx", error: String((e && e.message) || e) }); }

// components/StatCard/StatCard.jsx
try { (() => {
function StatCard({
  value,
  label,
  description,
  dark = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Sofia Pro', 'Plus Jakarta Sans', system-ui, sans-serif"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 56,
      fontWeight: 700,
      color: '#FF5A4D',
      lineHeight: 1,
      letterSpacing: '-0.02em',
      marginBottom: 8
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: dark ? '#FFFFFF' : '#052140',
      marginBottom: 6
    }
  }, label), description && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 300,
      color: dark ? '#EDFBFF' : '#5A6474',
      lineHeight: 1.55
    }
  }, description));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/StatCard/StatCard.jsx", error: String((e && e.message) || e) }); }

// slides/deck-stage.js
try { (() => {
/**
 * <deck-stage> — reusable web component for HTML decks.
 *
 * Handles:
 *  (a) speaker notes — reads <script type="application/json" id="speaker-notes">
 *      and posts {slideIndexChanged: N} to the parent window on nav.
 *  (b) keyboard navigation — ←/→, PgUp/PgDn, Space, Home/End, number keys.
 *  (c) press R to reset to slide 0 (with a tasteful keyboard hint).
 *  (d) bottom-center overlay showing slide count + hints, fades out on idle.
 *  (e) auto-scaling — inner canvas is a fixed design size (default 1920×1080)
 *      scaled with `transform: scale()` to fit the viewport, letterboxed.
 *      Set the `noscale` attribute to render at authored size (1:1) — the
 *      PPTX exporter sets this so its DOM capture sees unscaled geometry.
 *  (f) print — `@media print` lays every slide out as its own page at the
 *      design size, so the browser's Print → Save as PDF produces a clean
 *      one-page-per-slide PDF with no extra setup.
 *
 * Slides are HIDDEN, not unmounted. Non-active slides stay in the DOM with
 * `visibility: hidden` + `opacity: 0`, so their state (videos, iframes,
 * form inputs, React trees) is preserved across navigation.
 *
 * Lifecycle event — the component dispatches a `slidechange` CustomEvent on
 * itself whenever the active slide changes (including the initial mount).
 * The event bubbles and composes out of shadow DOM, so you can listen on
 * the <deck-stage> element or on document:
 *
 *   document.querySelector('deck-stage').addEventListener('slidechange', (e) => {
 *     e.detail.index         // new 0-based index
 *     e.detail.previousIndex // previous index, or -1 on init
 *     e.detail.total         // total slide count
 *     e.detail.slide         // the new active slide element
 *     e.detail.previousSlide // the prior slide element, or null on init
 *     e.detail.reason        // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
 *   });
 *
 * Persistence: none at the deck level. The host app keeps the current slide
 * in its own URL (?slide=) and re-delivers it via location.hash on load, so a
 * bare load with no hash always starts at slide 1.
 *
 * Usage:
 *   <deck-stage width="1920" height="1080">
 *     <section data-label="Title">...</section>
 *     <section data-label="Agenda">...</section>
 *   </deck-stage>
 *
 * Slides are the direct element children of <deck-stage>. Each slide is
 * automatically tagged with:
 *   - data-screen-label="NN Label"   (1-indexed, for comment flow)
 *   - data-om-validate="no_overflowing_text,no_overlapping_text,slide_sized_text"
 */

(() => {
  const DESIGN_W_DEFAULT = 1920;
  const DESIGN_H_DEFAULT = 1080;
  const OVERLAY_HIDE_MS = 1800;
  const VALIDATE_ATTR = 'no_overflowing_text,no_overlapping_text,slide_sized_text';
  const pad2 = n => String(n).padStart(2, '0');
  const stylesheet = `
    :host {
      position: fixed;
      inset: 0;
      display: block;
      background: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
      overflow: hidden;
    }

    .stage {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas {
      position: relative;
      transform-origin: center center;
      flex-shrink: 0;
      background: #fff;
      will-change: transform;
    }

    /* Slides live in light DOM (via <slot>) so authored CSS still applies.
       We absolutely position each slotted child to stack them. */
    ::slotted(*) {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      box-sizing: border-box !important;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
    ::slotted([data-deck-active]) {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }

    /* Tap zones for mobile — back/forward thirds like Stories.
       Transparent, no visible UI, don't block the overlay. */
    .tapzones {
      position: fixed;
      inset: 0;
      display: flex;
      z-index: 2147482000;
      pointer-events: none;
    }
    .tapzone {
      flex: 1;
      pointer-events: auto;
      -webkit-tap-highlight-color: transparent;
    }
    /* Only activate tap zones on coarse pointers (touch devices). */
    @media (hover: hover) and (pointer: fine) {
      .tapzones { display: none; }
    }

    .overlay {
      position: fixed;
      left: 50%;
      bottom: 22px;
      transform: translate(-50%, 6px) scale(0.92);
      filter: blur(6px);
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 4px;
      background: #000;
      color: #fff;
      border-radius: 999px;
      font-size: 12px;
      font-feature-settings: "tnum" 1;
      letter-spacing: 0.01em;
      opacity: 0;
      pointer-events: none;
      transition: opacity 260ms ease, transform 260ms cubic-bezier(.2,.8,.2,1), filter 260ms ease;
      transform-origin: center bottom;
      z-index: 2147483000;
      user-select: none;
    }
    .overlay[data-visible] {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, 0) scale(1);
      filter: blur(0);
    }

    .btn {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: 0;
      margin: 0;
      padding: 0;
      color: inherit;
      font: inherit;
      cursor: default;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      min-width: 28px;
      border-radius: 999px;
      color: rgba(255,255,255,0.72);
      transition: background 140ms ease, color 140ms ease;
      -webkit-tap-highlight-color: transparent;
    }
    .btn:hover { background: rgba(255,255,255,0.12); color: #fff; }
    .btn:active { background: rgba(255,255,255,0.18); }
    .btn:focus { outline: none; }
    .btn:focus-visible { outline: none; }
    .btn::-moz-focus-inner { border: 0; }
    .btn svg { width: 14px; height: 14px; display: block; }
    .btn.reset {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.02em;
      padding: 0 10px 0 12px;
      gap: 6px;
      color: rgba(255,255,255,0.72);
    }
    .btn.reset .kbd {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
      font-size: 10px;
      line-height: 1;
      color: rgba(255,255,255,0.88);
      background: rgba(255,255,255,0.12);
      border-radius: 4px;
    }

    .count {
      font-variant-numeric: tabular-nums;
      color: #fff;
      font-weight: 500;
      padding: 0 8px;
      min-width: 42px;
      text-align: center;
      font-size: 12px;
    }
    .count .sep { color: rgba(255,255,255,0.45); margin: 0 3px; font-weight: 400; }
    .count .total { color: rgba(255,255,255,0.55); }

    .divider {
      width: 1px;
      height: 14px;
      background: rgba(255,255,255,0.18);
      margin: 0 2px;
    }

    /* ── Print: one page per slide, no chrome ────────────────────────────
       The screen layout stacks every slide at inset:0 inside a scaled
       canvas; for print we want them in document flow at the authored
       design size so the browser paginates one slide per sheet. The
       @page size is set from the width/height attributes via the inline
       <style id="deck-stage-print-page"> that connectedCallback injects
       into <head> (the @page at-rule has no effect inside shadow DOM). */
    @media print {
      :host {
        position: static;
        inset: auto;
        background: none;
        overflow: visible;
        color: inherit;
      }
      .stage { position: static; display: block; }
      .canvas {
        transform: none !important;
        width: auto !important;
        height: auto !important;
        background: none;
        will-change: auto;
      }
      ::slotted(*) {
        position: relative !important;
        inset: auto !important;
        width: var(--deck-design-w) !important;
        height: var(--deck-design-h) !important;
        box-sizing: border-box !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto;
        break-after: page;
        page-break-after: always;
        break-inside: avoid;
        overflow: hidden;
      }
      ::slotted(*:last-child) {
        break-after: auto;
        page-break-after: auto;
      }
      .overlay, .tapzones { display: none !important; }
    }
  `;
  class DeckStage extends HTMLElement {
    static get observedAttributes() {
      return ['width', 'height', 'noscale'];
    }
    constructor() {
      super();
      this._root = this.attachShadow({
        mode: 'open'
      });
      this._index = 0;
      this._slides = [];
      this._notes = [];
      this._hideTimer = null;
      this._mouseIdleTimer = null;
      this._onKey = this._onKey.bind(this);
      this._onResize = this._onResize.bind(this);
      this._onSlotChange = this._onSlotChange.bind(this);
      this._onMouseMove = this._onMouseMove.bind(this);
      this._onTapBack = this._onTapBack.bind(this);
      this._onTapForward = this._onTapForward.bind(this);
    }
    get designWidth() {
      return parseInt(this.getAttribute('width'), 10) || DESIGN_W_DEFAULT;
    }
    get designHeight() {
      return parseInt(this.getAttribute('height'), 10) || DESIGN_H_DEFAULT;
    }
    connectedCallback() {
      this._render();
      this._loadNotes();
      this._syncPrintPageRule();
      window.addEventListener('keydown', this._onKey);
      window.addEventListener('resize', this._onResize);
      window.addEventListener('mousemove', this._onMouseMove, {
        passive: true
      });
      // Initial collection + layout happens via slotchange, which fires on mount.
    }
    disconnectedCallback() {
      window.removeEventListener('keydown', this._onKey);
      window.removeEventListener('resize', this._onResize);
      window.removeEventListener('mousemove', this._onMouseMove);
      if (this._hideTimer) clearTimeout(this._hideTimer);
      if (this._mouseIdleTimer) clearTimeout(this._mouseIdleTimer);
    }
    attributeChangedCallback() {
      if (this._canvas) {
        this._canvas.style.width = this.designWidth + 'px';
        this._canvas.style.height = this.designHeight + 'px';
        this._canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
        this._canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
        this._fit();
        this._syncPrintPageRule();
      }
    }
    _render() {
      const style = document.createElement('style');
      style.textContent = stylesheet;
      const stage = document.createElement('div');
      stage.className = 'stage';
      const canvas = document.createElement('div');
      canvas.className = 'canvas';
      canvas.style.width = this.designWidth + 'px';
      canvas.style.height = this.designHeight + 'px';
      canvas.style.setProperty('--deck-design-w', this.designWidth + 'px');
      canvas.style.setProperty('--deck-design-h', this.designHeight + 'px');
      const slot = document.createElement('slot');
      slot.addEventListener('slotchange', this._onSlotChange);
      canvas.appendChild(slot);
      stage.appendChild(canvas);

      // Tap zones (mobile): left third = back, right third = forward.
      const tapzones = document.createElement('div');
      tapzones.className = 'tapzones export-hidden';
      tapzones.setAttribute('aria-hidden', 'true');
      tapzones.setAttribute('data-noncommentable', '');
      const tzBack = document.createElement('div');
      tzBack.className = 'tapzone tapzone--back';
      const tzMid = document.createElement('div');
      tzMid.className = 'tapzone tapzone--mid';
      tzMid.style.pointerEvents = 'none';
      const tzFwd = document.createElement('div');
      tzFwd.className = 'tapzone tapzone--fwd';
      tzBack.addEventListener('click', this._onTapBack);
      tzFwd.addEventListener('click', this._onTapForward);
      tapzones.append(tzBack, tzMid, tzFwd);

      // Overlay: compact, solid black, with clickable controls.
      const overlay = document.createElement('div');
      overlay.className = 'overlay export-hidden';
      overlay.setAttribute('role', 'toolbar');
      overlay.setAttribute('aria-label', 'Deck controls');
      overlay.setAttribute('data-noncommentable', '');
      overlay.innerHTML = `
        <button class="btn prev" type="button" aria-label="Previous slide" title="Previous (←)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8l5 5"/></svg>
        </button>
        <span class="count" aria-live="polite"><span class="current">1</span><span class="sep">/</span><span class="total">1</span></span>
        <button class="btn next" type="button" aria-label="Next slide" title="Next (→)">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3l5 5-5 5"/></svg>
        </button>
        <span class="divider"></span>
        <button class="btn reset" type="button" aria-label="Reset to first slide" title="Reset (R)">Reset<span class="kbd">R</span></button>
      `;
      overlay.querySelector('.prev').addEventListener('click', () => this._go(this._index - 1, 'click'));
      overlay.querySelector('.next').addEventListener('click', () => this._go(this._index + 1, 'click'));
      overlay.querySelector('.reset').addEventListener('click', () => this._go(0, 'click'));
      this._root.append(style, stage, tapzones, overlay);
      this._canvas = canvas;
      this._slot = slot;
      this._overlay = overlay;
      this._countEl = overlay.querySelector('.current');
      this._totalEl = overlay.querySelector('.total');
    }

    /** @page must live in the document stylesheet — it's a no-op inside
     *  shadow DOM. Inject/update a single <head> style tag so the print
     *  sheet matches the design size and Save-as-PDF yields one slide per
     *  page with no margins. */
    _syncPrintPageRule() {
      const id = 'deck-stage-print-page';
      let tag = document.getElementById(id);
      if (!tag) {
        tag = document.createElement('style');
        tag.id = id;
        document.head.appendChild(tag);
      }
      tag.textContent = '@page { size: ' + this.designWidth + 'px ' + this.designHeight + 'px; margin: 0; } ' + '@media print { html, body { margin: 0 !important; padding: 0 !important; background: none !important; overflow: visible !important; height: auto !important; } ' + '* { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }';
    }
    _onSlotChange() {
      this._collectSlides();
      this._restoreIndex();
      this._applyIndex({
        showOverlay: false,
        broadcast: true,
        reason: 'init'
      });
      this._fit();
    }
    _collectSlides() {
      const assigned = this._slot.assignedElements({
        flatten: true
      });
      this._slides = assigned.filter(el => {
        // Skip template/style/script nodes even if someone slots them.
        const tag = el.tagName;
        return tag !== 'TEMPLATE' && tag !== 'SCRIPT' && tag !== 'STYLE';
      });
      this._slides.forEach((slide, i) => {
        const n = i + 1;
        // Determine a label for comment flow: prefer explicit data-label,
        // then an existing data-screen-label, then first heading, else "Slide".
        let label = slide.getAttribute('data-label');
        if (!label) {
          const existing = slide.getAttribute('data-screen-label');
          if (existing) {
            // Strip any leading number the author may have included.
            label = existing.replace(/^\s*\d+\s*/, '').trim() || existing;
          }
        }
        if (!label) {
          const h = slide.querySelector('h1, h2, h3, [data-title]');
          if (h) label = (h.textContent || '').trim().slice(0, 40);
        }
        if (!label) label = 'Slide';
        slide.setAttribute('data-screen-label', `${pad2(n)} ${label}`);

        // Validation attribute for comment flow / auto-checks.
        if (!slide.hasAttribute('data-om-validate')) {
          slide.setAttribute('data-om-validate', VALIDATE_ATTR);
        }
        slide.setAttribute('data-deck-slide', String(i));
      });
      if (this._totalEl) this._totalEl.textContent = String(this._slides.length || 1);
      if (this._index >= this._slides.length) this._index = Math.max(0, this._slides.length - 1);
    }
    _loadNotes() {
      const tag = document.getElementById('speaker-notes');
      if (!tag) {
        this._notes = [];
        return;
      }
      try {
        const parsed = JSON.parse(tag.textContent || '[]');
        if (Array.isArray(parsed)) this._notes = parsed;
      } catch (e) {
        console.warn('[deck-stage] Failed to parse #speaker-notes JSON:', e);
        this._notes = [];
      }
    }
    _restoreIndex() {
      // The host's ?slide= param is delivered as a #<int> hash (1-indexed) on
      // the iframe src. No hash → slide 1; the deck itself keeps no position
      // state across loads.
      const h = (location.hash || '').match(/^#(\d+)$/);
      if (h) {
        const n = parseInt(h[1], 10) - 1;
        if (n >= 0 && n < this._slides.length) this._index = n;
      }
    }
    _applyIndex({
      showOverlay = true,
      broadcast = true,
      reason = 'init'
    } = {}) {
      if (!this._slides.length) return;
      const prev = this._prevIndex == null ? -1 : this._prevIndex;
      const curr = this._index;
      // Keep the iframe's own hash in sync so an in-iframe location.reload()
      // (reload banner path in viewer-handle.ts) lands on the current slide,
      // not the stale deep-link hash from initial load.
      try {
        history.replaceState(null, '', '#' + (curr + 1));
      } catch (e) {}
      this._slides.forEach((s, i) => {
        if (i === curr) s.setAttribute('data-deck-active', '');else s.removeAttribute('data-deck-active');
      });
      if (this._countEl) this._countEl.textContent = String(curr + 1);
      if (broadcast) {
        // (1) Legacy: host-window postMessage for speaker-notes renderers.
        try {
          window.postMessage({
            slideIndexChanged: curr
          }, '*');
        } catch (e) {}

        // (2) In-page CustomEvent on the <deck-stage> element itself.
        //     Bubbles and composes out of shadow DOM so slide code can listen:
        //       document.querySelector('deck-stage').addEventListener('slidechange', e => {
        //         e.detail.index, e.detail.previousIndex, e.detail.total, e.detail.slide, e.detail.reason
        //       });
        const detail = {
          index: curr,
          previousIndex: prev,
          total: this._slides.length,
          slide: this._slides[curr] || null,
          previousSlide: prev >= 0 ? this._slides[prev] || null : null,
          reason: reason // 'init' | 'keyboard' | 'click' | 'tap' | 'api'
        };
        this.dispatchEvent(new CustomEvent('slidechange', {
          detail,
          bubbles: true,
          composed: true
        }));
      }
      this._prevIndex = curr;
      if (showOverlay) this._flashOverlay();
    }
    _flashOverlay() {
      if (!this._overlay) return;
      this._overlay.setAttribute('data-visible', '');
      if (this._hideTimer) clearTimeout(this._hideTimer);
      this._hideTimer = setTimeout(() => {
        this._overlay.removeAttribute('data-visible');
      }, OVERLAY_HIDE_MS);
    }
    _fit() {
      if (!this._canvas) return;
      // PPTX export sets noscale so the DOM capture sees authored-size
      // geometry — the scaled canvas is in shadow DOM, so the exporter's
      // resetTransformSelector can't reach .canvas.style.transform directly.
      if (this.hasAttribute('noscale')) {
        this._canvas.style.transform = 'none';
        return;
      }
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const s = Math.min(vw / this.designWidth, vh / this.designHeight);
      this._canvas.style.transform = `scale(${s})`;
    }
    _onResize() {
      this._fit();
    }
    _onMouseMove() {
      // Keep overlay visible while mouse moves; hide after idle.
      this._flashOverlay();
    }
    _onTapBack(e) {
      e.preventDefault();
      this._go(this._index - 1, 'tap');
    }
    _onTapForward(e) {
      e.preventDefault();
      this._go(this._index + 1, 'tap');
    }
    _onKey(e) {
      // Ignore when the user is typing.
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key;
      let handled = true;
      if (key === 'ArrowRight' || key === 'PageDown' || key === ' ' || key === 'Spacebar') {
        this._go(this._index + 1, 'keyboard');
      } else if (key === 'ArrowLeft' || key === 'PageUp') {
        this._go(this._index - 1, 'keyboard');
      } else if (key === 'Home') {
        this._go(0, 'keyboard');
      } else if (key === 'End') {
        this._go(this._slides.length - 1, 'keyboard');
      } else if (key === 'r' || key === 'R') {
        this._go(0, 'keyboard');
      } else if (/^[0-9]$/.test(key)) {
        // 1..9 jump to that slide; 0 jumps to 10.
        const n = key === '0' ? 9 : parseInt(key, 10) - 1;
        if (n < this._slides.length) this._go(n, 'keyboard');
      } else {
        handled = false;
      }
      if (handled) {
        e.preventDefault();
        this._flashOverlay();
      }
    }
    _go(i, reason = 'api') {
      if (!this._slides.length) return;
      const clamped = Math.max(0, Math.min(this._slides.length - 1, i));
      if (clamped === this._index) {
        this._flashOverlay();
        return;
      }
      this._index = clamped;
      this._applyIndex({
        showOverlay: true,
        broadcast: true,
        reason
      });
    }

    // Public API ------------------------------------------------------------

    /** Current slide index (0-based). */
    get index() {
      return this._index;
    }
    /** Total slide count. */
    get length() {
      return this._slides.length;
    }
    /** Programmatically navigate. */
    goTo(i) {
      this._go(i, 'api');
    }
    next() {
      this._go(this._index + 1, 'api');
    }
    prev() {
      this._go(this._index - 1, 'api');
    }
    reset() {
      this._go(0, 'api');
    }
  }
  if (!customElements.get('deck-stage')) {
    customElements.define('deck-stage', DeckStage);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "slides/deck-stage.js", error: String((e && e.message) || e) }); }

// ui_kits/helix/DashboardWidgets.jsx
try { (() => {
// BMC Helix ITSM — Dashboard Stat Cards & AI Insight

const helixDashStyles = {
  statCard: {
    background: '#fff',
    borderRadius: 8,
    padding: '18px 20px',
    border: '1px solid #E1E6F0',
    boxShadow: '0 2px 8px rgba(5,33,64,0.06)',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
  },
  statLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#8A96A8',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: 6
  },
  statNum: {
    fontSize: 36,
    fontWeight: 700,
    color: '#052140',
    lineHeight: 1,
    letterSpacing: '-0.02em'
  },
  statAccent: {
    color: '#FF5A4D'
  },
  statDelta: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    fontSize: 11,
    fontWeight: 600
  },
  statDesc: {
    fontSize: 11,
    color: '#8A96A8',
    marginTop: 4
  },
  aiCard: {
    background: '#052140',
    borderRadius: 8,
    padding: '16px 20px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 2px 8px rgba(5,33,64,0.1)',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
  },
  aiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  aiIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    background: 'rgba(255,90,77,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  aiTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.01em'
  },
  aiSub: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)'
  },
  aiBody: {
    fontSize: 13,
    color: '#D6E8FC',
    lineHeight: 1.55,
    marginBottom: 14
  },
  aiAction: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: '#FF5A4D',
    color: '#fff',
    fontSize: 11,
    fontWeight: 700,
    padding: '6px 14px',
    borderRadius: 4,
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
  },
  aiDismiss: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'transparent',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: 600,
    padding: '6px 12px',
    borderRadius: 4,
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
  },
  miniChart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 2,
    height: 28
  },
  miniBar: {
    flex: 1,
    borderRadius: '2px 2px 0 0',
    minWidth: 4
  },
  serviceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 0',
    borderBottom: '1px solid #F2F4F8',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
  },
  serviceDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0
  },
  serviceName: {
    flex: 1,
    fontSize: 12,
    fontWeight: 500,
    color: '#052140'
  },
  serviceStatus: {
    fontSize: 11,
    fontWeight: 600
  },
  serviceUptime: {
    fontSize: 10,
    color: '#8A96A8',
    width: 48,
    textAlign: 'right'
  }
};
function StatCard({
  label,
  value,
  accent,
  delta,
  deltaUp,
  desc,
  mini
}) {
  const barData = mini || [40, 60, 45, 70, 55, 80, 65];
  return /*#__PURE__*/React.createElement("div", {
    style: helixDashStyles.statCard
  }, /*#__PURE__*/React.createElement("div", {
    style: helixDashStyles.statLabel
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...helixDashStyles.statNum,
      ...(accent ? helixDashStyles.statAccent : {})
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: helixDashStyles.miniChart
  }, barData.map((h, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      ...helixDashStyles.miniBar,
      height: h * 0.28 + 'px',
      background: i === barData.length - 1 ? '#FF5A4D' : '#E1E6F0'
    }
  })))), delta && /*#__PURE__*/React.createElement("div", {
    style: {
      ...helixDashStyles.statDelta,
      color: deltaUp ? '#1A7A45' : '#CC2A1F'
    }
  }, /*#__PURE__*/React.createElement("span", null, deltaUp ? '↑' : '↓', " ", delta), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      color: '#8A96A8'
    }
  }, "vs last week")), desc && /*#__PURE__*/React.createElement("div", {
    style: helixDashStyles.statDesc
  }, desc));
}
function AIInsightCard({
  title,
  body,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: helixDashStyles.aiCard
  }, /*#__PURE__*/React.createElement("div", {
    style: helixDashStyles.aiHeader
  }, /*#__PURE__*/React.createElement("div", {
    style: helixDashStyles.aiIcon
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5z",
    stroke: "#FF5A4D",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: helixDashStyles.aiTitle
  }, title), /*#__PURE__*/React.createElement("div", {
    style: helixDashStyles.aiSub
  }, "BMC Helix AI \xB7 Just now"))), /*#__PURE__*/React.createElement("div", {
    style: helixDashStyles.aiBody
  }, body), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    style: helixDashStyles.aiAction
  }, action || 'Take Action', " \u2192"), /*#__PURE__*/React.createElement("button", {
    style: helixDashStyles.aiDismiss
  }, "Dismiss")));
}
function ServiceHealthItem({
  name,
  status,
  uptime
}) {
  const statusColor = status === 'Operational' ? '#1A7A45' : status === 'Degraded' ? '#F26B43' : '#CC2A1F';
  return /*#__PURE__*/React.createElement("div", {
    style: helixDashStyles.serviceItem
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...helixDashStyles.serviceDot,
      background: statusColor
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: helixDashStyles.serviceName
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      ...helixDashStyles.serviceStatus,
      color: statusColor
    }
  }, status), /*#__PURE__*/React.createElement("div", {
    style: helixDashStyles.serviceUptime
  }, uptime));
}
Object.assign(window, {
  StatCard,
  AIInsightCard,
  ServiceHealthItem
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/helix/DashboardWidgets.jsx", error: String((e && e.message) || e) }); }

// ui_kits/helix/IncidentCard.jsx
try { (() => {
// BMC Helix ITSM — Incident Card & List Components

const helixIncidentStyles = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '11px 20px',
    borderBottom: '1px solid #F2F4F8',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    cursor: 'pointer',
    transition: 'background 150ms',
    background: '#fff'
  },
  rowHover: {
    background: '#F7F8FD'
  },
  priority: {
    width: 4,
    height: 36,
    borderRadius: 2,
    flexShrink: 0
  },
  id: {
    fontSize: 11,
    fontWeight: 700,
    color: '#758CE5',
    fontFamily: 'monospace',
    width: 72,
    flexShrink: 0
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: 600,
    color: '#052140',
    lineHeight: 1.3
  },
  meta: {
    fontSize: 11,
    color: '#8A96A8',
    marginTop: 2,
    lineHeight: 1
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 9999
  },
  assignee: {
    width: 26,
    height: 26,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0
  },
  time: {
    fontSize: 11,
    color: '#8A96A8',
    width: 64,
    textAlign: 'right',
    flexShrink: 0
  },
  tableHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 20px',
    background: '#F7F8FD',
    borderBottom: '1px solid #E1E6F0',
    fontSize: 10,
    fontWeight: 700,
    color: '#8A96A8',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
  }
};
const PRIORITY_COLORS = {
  Critical: '#FF5A4D',
  High: '#F26B43',
  Medium: '#758CE5',
  Low: '#C2CBDB'
};
const STATUS_STYLES = {
  'Open': {
    bg: '#FFE8E6',
    color: '#CC2A1F'
  },
  'In Progress': {
    bg: '#EDF3FF',
    color: '#264580'
  },
  'Pending': {
    bg: '#EEEEFF',
    color: '#4040D9'
  },
  'Resolved': {
    bg: '#E6F6EE',
    color: '#1A7A45'
  },
  'Closed': {
    bg: '#F2F4F8',
    color: '#5A6474'
  }
};
const ASSIGNEE_COLORS = [{
  bg: '#D6E8FC',
  color: '#264580'
}, {
  bg: '#FFE8E6',
  color: '#CC2A1F'
}, {
  bg: '#EEEEFF',
  color: '#4040D9'
}, {
  bg: '#F5EDF6',
  color: '#914796'
}];
function PriorityDot({
  priority
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 4,
      height: 36,
      borderRadius: 2,
      flexShrink: 0,
      background: PRIORITY_COLORS[priority] || '#C2CBDB'
    }
  });
}
function StatusBadge({
  status
}) {
  const s = STATUS_STYLES[status] || STATUS_STYLES['Open'];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      ...helixIncidentStyles.badge,
      background: s.bg,
      color: s.color
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: s.color,
      display: 'inline-block'
    }
  }), status);
}
function AssigneeAvatar({
  initials,
  idx
}) {
  const c = ASSIGNEE_COLORS[idx % ASSIGNEE_COLORS.length];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...helixIncidentStyles.assignee,
      background: c.bg,
      color: c.color
    }
  }, initials);
}
function IncidentRow({
  incident,
  onClick,
  idx
}) {
  const [hovered, setHovered] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...helixIncidentStyles.row,
      ...(hovered ? helixIncidentStyles.rowHover : {})
    },
    onClick: () => onClick && onClick(incident),
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false)
  }, /*#__PURE__*/React.createElement(PriorityDot, {
    priority: incident.priority
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 72,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: helixIncidentStyles.id
  }, incident.id)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: helixIncidentStyles.title
  }, incident.title), /*#__PURE__*/React.createElement("div", {
    style: helixIncidentStyles.meta
  }, incident.category, " \xB7 ", incident.ci)), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 90,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(StatusBadge, {
    status: incident.status
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 68,
      flexShrink: 0,
      fontSize: 11,
      fontWeight: 600,
      color: PRIORITY_COLORS[incident.priority]
    }
  }, incident.priority), /*#__PURE__*/React.createElement(AssigneeAvatar, {
    initials: incident.assigneeInitials,
    idx: idx
  }), /*#__PURE__*/React.createElement("div", {
    style: helixIncidentStyles.time
  }, incident.updated));
}
function IncidentTable({
  incidents,
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      borderRadius: 8,
      border: '1px solid #E1E6F0',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(5,33,64,0.06)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: helixIncidentStyles.tableHead
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 4,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 72,
      flexShrink: 0
    }
  }, "ID"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, "Title / CI"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 90,
      flexShrink: 0
    }
  }, "Status"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 68,
      flexShrink: 0
    }
  }, "Priority"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 26,
      flexShrink: 0
    }
  }, "Owner"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      textAlign: 'right',
      flexShrink: 0
    }
  }, "Updated")), incidents.map((inc, i) => /*#__PURE__*/React.createElement(IncidentRow, {
    key: inc.id,
    incident: inc,
    onClick: onSelect,
    idx: i
  })));
}
Object.assign(window, {
  IncidentRow,
  IncidentTable,
  StatusBadge,
  PriorityDot
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/helix/IncidentCard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/helix/Sidebar.jsx
try { (() => {
// BMC Helix ITSM — Sidebar Component
// Exported to window.HelixSidebar

const HelixSidebarStyles = {
  sidebar: {
    width: 220,
    minWidth: 220,
    height: '100vh',
    background: '#052140',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
  },
  logo: {
    padding: '24px 20px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  logoText: {
    color: '#fff',
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: '-0.02em'
  },
  logoDot: {
    color: '#FF5A4D',
    fontSize: 26,
    lineHeight: 0
  },
  logoSub: {
    color: '#758CE5',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginTop: 2
  },
  nav: {
    flex: 1,
    padding: '12px 0',
    overflowY: 'auto'
  },
  section: {
    padding: '16px 20px 4px',
    fontSize: 9,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: '0.12em',
    textTransform: 'uppercase'
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 20px',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.65)',
    transition: 'all 150ms',
    borderLeft: '3px solid transparent',
    userSelect: 'none'
  },
  itemActive: {
    color: '#fff',
    background: 'rgba(255,255,255,0.08)',
    borderLeftColor: '#FF5A4D'
  },
  itemHover: {
    color: '#fff',
    background: 'rgba(255,255,255,0.05)'
  },
  icon: {
    width: 16,
    height: 16,
    opacity: 0.8,
    flexShrink: 0
  },
  badge: {
    marginLeft: 'auto',
    background: '#FF5A4D',
    color: '#fff',
    fontSize: 10,
    fontWeight: 700,
    borderRadius: 9999,
    padding: '1px 6px',
    lineHeight: '16px'
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#264580',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    color: '#D6E8FC',
    flexShrink: 0
  },
  userName: {
    fontSize: 12,
    fontWeight: 600,
    color: '#fff'
  },
  userRole: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)'
  }
};
function NavIcon({
  d
}) {
  return /*#__PURE__*/React.createElement("svg", {
    style: HelixSidebarStyles.icon,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: d
  }));
}
function NavItem({
  icon,
  label,
  badge,
  active,
  onClick
}) {
  const [hovered, setHovered] = React.useState(false);
  const style = {
    ...HelixSidebarStyles.item,
    ...(active ? HelixSidebarStyles.itemActive : {}),
    ...(!active && hovered ? HelixSidebarStyles.itemHover : {})
  };
  return /*#__PURE__*/React.createElement("div", {
    style: style,
    onClick: onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false)
  }, /*#__PURE__*/React.createElement(NavIcon, {
    d: icon
  }), /*#__PURE__*/React.createElement("span", null, label), badge && /*#__PURE__*/React.createElement("span", {
    style: HelixSidebarStyles.badge
  }, badge));
}
function HelixSidebar({
  active,
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: HelixSidebarStyles.sidebar
  }, /*#__PURE__*/React.createElement("div", {
    style: HelixSidebarStyles.logo
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: ((window.__resources&&window.__resources.bmcLogoWhite)||"assets/bmc-logo-white.svg"),
    alt: "BMC",
    style: {
      height: 24,
      width: "auto",
      display: "block",
      marginBottom: 6
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: HelixSidebarStyles.logoSub
  }, "Helix ITSM"))), /*#__PURE__*/React.createElement("nav", {
    style: HelixSidebarStyles.nav
  }, /*#__PURE__*/React.createElement("div", {
    style: HelixSidebarStyles.section
  }, "Overview"), /*#__PURE__*/React.createElement(NavItem, {
    icon: "M2 3h12M2 8h12M2 13h7",
    label: "Dashboard",
    active: active === 'dashboard',
    onClick: () => onNavigate('dashboard')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5l3.5-.5z",
    label: "AI Insights",
    active: active === 'insights',
    onClick: () => onNavigate('insights')
  }), /*#__PURE__*/React.createElement("div", {
    style: HelixSidebarStyles.section
  }, "Service Desk"), /*#__PURE__*/React.createElement(NavItem, {
    icon: "M3 3h10a1 1 0 011 1v6a1 1 0 01-1 1H9l-2 2-2-2H3a1 1 0 01-1-1V4a1 1 0 011-1z",
    label: "Incidents",
    badge: "14",
    active: active === 'incidents',
    onClick: () => onNavigate('incidents')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "M2 4h12v1H2zM4 7h8M4 10h6",
    label: "Service Requests",
    active: active === 'requests',
    onClick: () => onNavigate('requests')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "M8 2v12M2 8h12",
    label: "Changes",
    active: active === 'changes',
    onClick: () => onNavigate('changes')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "M2 2h12v12H2z",
    label: "Problems",
    active: active === 'problems',
    onClick: () => onNavigate('problems')
  }), /*#__PURE__*/React.createElement("div", {
    style: HelixSidebarStyles.section
  }, "Operations"), /*#__PURE__*/React.createElement(NavItem, {
    icon: "M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z",
    label: "CMDB",
    active: active === 'cmdb',
    onClick: () => onNavigate('cmdb')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "M8 14A6 6 0 108 2a6 6 0 000 12zM8 5v3l2 2",
    label: "SLA Management",
    active: active === 'sla',
    onClick: () => onNavigate('sla')
  }), /*#__PURE__*/React.createElement(NavItem, {
    icon: "M2 12l4-4 3 3 5-7",
    label: "Reports",
    active: active === 'reports',
    onClick: () => onNavigate('reports')
  }), /*#__PURE__*/React.createElement("div", {
    style: HelixSidebarStyles.section
  }, "Configure"), /*#__PURE__*/React.createElement(NavItem, {
    icon: "M6 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v1a1 1 0 002 0V6h1a1 1 0 000-2H7V3a1 1 0 00-1-1zM11 8a1 1 0 00-1 1v1H8a1 1 0 000 2h2v1a1 1 0 002 0v-1h1a1 1 0 000-2h-1V9a1 1 0 00-1-1z",
    label: "Settings",
    active: active === 'settings',
    onClick: () => onNavigate('settings')
  })), /*#__PURE__*/React.createElement("div", {
    style: HelixSidebarStyles.footer
  }, /*#__PURE__*/React.createElement("div", {
    style: HelixSidebarStyles.avatar
  }, "JD"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: HelixSidebarStyles.userName
  }, "Jane Doe"), /*#__PURE__*/React.createElement("div", {
    style: HelixSidebarStyles.userRole
  }, "IT Operations Manager"))));
}
Object.assign(window, {
  HelixSidebar,
  NavItem,
  NavIcon
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/helix/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/helix/TopBar.jsx
try { (() => {
// BMC Helix ITSM — Top Bar Component

const helixTopBarStyles = {
  bar: {
    height: 56,
    background: '#fff',
    borderBottom: '1px solid #E1E6F0',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    gap: 16,
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    flexShrink: 0
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: '#052140',
    letterSpacing: '-0.01em',
    marginRight: 8
  },
  breadcrumb: {
    fontSize: 12,
    color: '#8A96A8',
    display: 'flex',
    alignItems: 'center',
    gap: 4
  },
  search: {
    flex: 1,
    maxWidth: 380,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: '#F7F8FD',
    border: '1.5px solid #E1E6F0',
    borderRadius: 6,
    padding: '0 12px',
    height: 34
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontSize: 13,
    color: '#052140',
    outline: 'none',
    flex: 1
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    color: '#5A6474',
    transition: 'background 150ms',
    position: 'relative'
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#FF5A4D',
    border: '1.5px solid #fff'
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#D6E8FC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    color: '#264580',
    cursor: 'pointer',
    flexShrink: 0
  }
};
function HelixTopBar({
  title,
  breadcrumb
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: helixTopBarStyles.bar
  }, /*#__PURE__*/React.createElement("div", null, breadcrumb && /*#__PURE__*/React.createElement("div", {
    style: helixTopBarStyles.breadcrumb
  }, /*#__PURE__*/React.createElement("span", null, "BMC Helix"), /*#__PURE__*/React.createElement("span", null, "\u203A"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#052140'
    }
  }, breadcrumb)), /*#__PURE__*/React.createElement("div", {
    style: helixTopBarStyles.title
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: helixTopBarStyles.search
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "#8A96A8",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "7",
    r: "4.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.5 10.5l3 3"
  })), /*#__PURE__*/React.createElement("input", {
    style: helixTopBarStyles.searchInput,
    placeholder: "Search incidents, requests, assets\u2026",
    readOnly: true
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: '#C2CBDB',
      fontFamily: 'monospace'
    }
  }, "\u2318K")), /*#__PURE__*/React.createElement("button", {
    style: helixTopBarStyles.iconBtn
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 2a4.5 4.5 0 014.5 4.5c0 2.5.7 3.8 1.5 4.5H2c.8-.7 1.5-2 1.5-4.5A4.5 4.5 0 018 2zM6.5 11a1.5 1.5 0 003 0"
  })), /*#__PURE__*/React.createElement("div", {
    style: helixTopBarStyles.notifDot
  })), /*#__PURE__*/React.createElement("button", {
    style: helixTopBarStyles.iconBtn
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "8",
    r: "5.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 5v3l2 2"
  }))), /*#__PURE__*/React.createElement("button", {
    style: helixTopBarStyles.iconBtn
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "8",
    cy: "5",
    r: "2.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 14c0-3.3 2.7-5 6-5s6 1.7 6 5"
  }))), /*#__PURE__*/React.createElement("div", {
    style: helixTopBarStyles.avatar
  }, "JD"));
}
Object.assign(window, {
  HelixTopBar
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/helix/TopBar.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.StatCard = __ds_scope.StatCard;

})();
