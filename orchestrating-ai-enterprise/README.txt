Orchestrating the AI Enterprise — landing page (v2)
====================================================

index.html
  The complete, working page. It is fully self-contained: every image, font
  and animation script is already embedded inside it, so it runs on its own
  (Netlify, any static host, or opened locally). Deploy this file as-is.

assets/
  Copies of everything embedded in index.html, as separate files, for reuse
  or for a developer rebuilding the page:
    images/   photos (man with tablet, two colleagues, building) and BMC logo
    fonts/    Sofia Pro (Light / Medium / Bold) plus the bundled web fonts
    scripts/  the animation components (custom elements), e.g.
              hex-sphere.js      hero + closing hexagon / particle sphere
              paradox-field.js   AI Execution Paradox particle stacks
              breath-fx.js       "Looking ahead" pathway + Conclusion chart
              particle-*.js      other section particle animations

graphics/
  High-resolution transparent PNG stills of the key graphics (hero and
  closing hexagon spheres, people cut-outs) and the Midnight BMC logo.

source/page-template.html
  The page's readable HTML/CSS markup (all copy, layout and section
  structure) as authored, before bundling. Useful for a production rebuild
  where text should be served as plain HTML for SEO/AEO.

Note: index.html does not load anything from assets/ — those are copies.
Editing a file in assets/ will not change index.html.
