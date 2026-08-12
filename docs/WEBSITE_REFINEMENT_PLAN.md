# Website Refinement Plan — 2flyKeithLogan.com

## Executive Summary

This plan outlines the frontend architecture and CSS/JS layout refinements for `2flyKeithLogan.com`. The goal is to elevate mobile responsiveness, eliminate unnecessary vertical scrolling and oversized dead space, compress first-screen composition, and bring major CTAs ("LISTEN", "WATCH", "PLAYABLE EXPERIENCES", "HELP 2FLY CREATE") above the fold across all mobile viewports while preserving the creator's artistic direction.

---

## Target Viewport Audit & Composition Analysis

| Viewport | Device Class | First-Screen Findings | Primary Defect | Refinement Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **360x800** | Compact Mobile | Hero title & copy fill 90% of screen height; stage & CTAs pushed far below fold (>1100px total hero height). | Excessive vertical padding (58px), oversized typography (`clamp(54px, 6.7vw, 106px)`), stage `min-height: 550px`. | Compress `.hero-copy` padding to `24px 16px`, scale hero H1 font, reduce `.hero-stage` min-height to `360px`, tighten CTA button grid. |
| **390x844** | Standard Mobile | CTAs visible only after scrolling 400px; hero cover rail scale is squeezed (`translateZ(-230px)`). | Large gap between `.hero-slogan` and button actions; stage metadata box overflows vertically. | Compact hero action layout, refine cover rail 3D transform scale for 390px width, position hub controls inline. |
| **430x932** | Large Mobile | Stage backdrop word text clipping horizontally (`left: -2vw`); hero CTA button row wraps awkwardly into 3 rows. | Unregulated flex wrapping on `.actions`; vertical margin on `.eyebrow` and `.hero-slogan`. | Enforce CSS grid for `.hero-primary-actions` (2x2 grid on mobile), adjust `overflow-x: hidden` boundaries. |
| **1366x768** | Standard Laptop | Media player bar at bottom (`bottom: 12px`, `height: 72px`) overlaps hero stage controls on smaller laptop displays. | Fixed media player z-index & bottom offset overlap with `.hero-meta`. | Add CSS media query for short desktop viewports (`max-height: 800px`) to compress footer/player margins. |
| **1920x1080** | Full HD Desktop | High-resolution presentation looks sharp; cover rail transform scale (`scale(1.52)`) creates slight overlap on 1080p. | Hero stage backdrop text scaled slightly off-center. | Polish cover rail focal spacing and backdrop gradient alignment. |

---

## Specific Refinement Deliverables (Part A)

### 1. Mobile Responsiveness & First-Screen Composition
- **Hero Height Compression**: Reduce mobile hero total height from `~1300px` to `~780px` so that both hero copy, CTA buttons, and interactive cover stage are visible in the first two scroll flicks.
- **Hero Copy Layout**:
  - Reduce `.hero-copy` padding from `58px 20px` to `28px 18px` on screens below `680px`.
  - Adjust `.hero h1` typography clamp on mobile to `clamp(36px, 9vw, 54px)` for crisp multi-line readability.
  - Reduce line margins around `.eyebrow` and `.hero-slogan`.
- **CTA Grid Optimization**:
  - Transform `.hero-primary-actions` from loose flex wrapping into a clean 2x2 grid on screens $\le 480\text{px}$.
  - Primary CTAs ("LISTEN", "WATCH", "PLAYABLE EXPERIENCES", "HELP 2FLY CREATE") will display with consistent touch target heights ($44\text{px}$ minimum).

### 2. Elimination of Dead Space & Oversized Padding
- **Hero Stage Rescaling**:
  - On mobile ($\le 680\text{px}$), reduce `.hero-stage` `min-height` from `550px` / `760px` to `380px`.
  - Adjust `.hero-cover[data-pos="2"]` scale on mobile from `1.52` to `1.18` to keep album artwork perfectly centered without overlapping top carousel controls.
- **Section Padding Normalization**:
  - Reduce mobile section padding from `padding: 88px 5vw` to `padding: 44px 18px`.

### 3. Navigation & Header Clarity
- **Mobile Menu Overlay**:
  - Enhance `.mobile-nav` with smooth slide-down animation and backdrop blur (`backdrop-filter: blur(12px)`).
  - Add active state indicators to mobile nav items so users always know their current active section hash (`#home`, `#music`, `#videos`, `#experiences`, `#support`).
- **Skip Navigation Link**:
  - Ensure `.skip` link operates cleanly with visible focus outline for keyboard/screen-reader accessibility.

### 4. Media Player & Overlay Stability
- **Fixed Player Docking**:
  - On mobile, lock `.media-player` cleanly to bottom `0px` with fixed height ($58\text{px}$) and z-index $100$.
  - Ensure audio seek bar and track titles remain legible without text truncation artifacts.
- **Experience Overlay Modal (`#experienceOverlay`)**:
  - Set iframe height to `calc(100vh - 80px)` on mobile with explicit safe area inset padding (`env(safe-area-inset-bottom)`).
  - Ensure close button (`.overlay-close`) has a $48\text{px} \times 48\text{px}$ touch target anchored at top-right for instant modal closing.

### 5. Horizontal Overflow Protection
- **Global Containment**:
  - Set `overflow-x: hidden` on `html, body, #main, .hero, .hero-stage`.
  - Fix `.hero-stage:after` backdrop word text clipping by constraining width to `max-width: 100vw`.

---

## Implementation Sequence

1. **Branch Creation**: Create feature branch `feature/website-refinement`.
2. **CSS Token & Layout Refinements**: Modify `css/app.css` to add optimized media queries for mobile viewports ($\le 480\text{px}$, $\le 680\text{px}$, $\le 1100\text{px}$).
3. **HTML Navigation & CTA Markup**: Update `index.html` header, CTA button wrappers, and form field autocomplete attributes.
4. **Local HTTP Verification**: Run local Node static server (`node server.js`) and audit in Chrome DevTools across all 5 target viewports.
5. **QA Engineer Sign-off**: Verify desktop, mobile, navigation, console logs, and confirm all 8 playable experiences launch cleanly.
