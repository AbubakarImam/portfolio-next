---
name: Abubakar Imam Abdulsalam — Full-Stack Field Manual
description: A parts-catalog/shop-manual system for a full-stack developer portfolio — specs, not screenshots, prove the work.
colors:
  shop: "#16181b"
  shop-deep: "#0b0c0e"
  blue: "#1d3f5c"
  blue-deep: "#14324a"
  paper: "#eaf3f7"
  steel: "#e7e9ea"
  accent: "#d9622c"
  accent-bright: "#ef7a41"
typography:
  display:
    fontFamily: "Courier Prime, ui-monospace, monospace"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  none: "0px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.shop-deep}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-bright}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.steel}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  spec-plate:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "20px 24px"
---

# Design System: Abubakar Imam Abdulsalam — Full-Stack Field Manual

## Overview

**Creative North Star: "The Shop Manual"**

This site is built as a machinist's build manual for an assembled system, not a resume page. Every claim ships with its spec: skills are itemized parts with part numbers, projects are numbered assemblies, and the three backend/systems builds — which have no pretty UI screenshot to lean on — are proven the way engineers actually prove a service: architecture layers, endpoint facts, and a security/observability checklist. A dark graphite shop floor, lit as if by a single work lamp, is hung with cyanotype-blue spec plates on a faint graph-paper grid; Courier Prime typewriter type stamps part numbers and headlines the way a real vintage parts catalog would; safety-orange marks the one accent — CTAs, active nav state, status stamps.

This direction replaced an earlier museum/gallery world (framed "exhibits," a "guestbook," serif wall-labels) that was built, screenshotted, and rejected by the actual user: it read as a visual artist's portfolio, not a software developer's. The correction is recorded as a Product Principle in PRODUCT.md. Nothing from the gallery world survives here — palette, type, structure, and section names were all replaced, not reskinned.

**Key Characteristics:**
- Dark, technical, unglamorous — a shop floor, not a showroom.
- Specs over screenshots: backend projects are proven with real architecture/security facts, not invented visuals.
- Typewritten stamps (part numbers, status tags, doc IDs) as the system's signature texture.
- One accent color only, used sparingly and always meaningfully (CTA, active state, "shipped" stamps).

## Colors

A two-material palette: a dark graphite "shop floor" ground, and lit cyanotype-blue "spec plate" panels laid on top of it, with a single safety-orange accent.

### Primary
- **Safety Orange** (`#d9622c`): The only accent. Primary CTA buttons, active table-of-contents state, status stamps ("Shipped", "In Service"), section-header eyebrow text and the dashed accent rule beneath it. Used on a deliberately small fraction of any viewport — its rarity is what makes a "Shipped" stamp read as a mark, not decoration.
- **Bright Orange** (`#ef7a41`): Hover/active state for the primary orange, and link-hover color on the dark shop floor.

### Neutral
- **Shop Floor** (`#16181b`): Page background — the dark graphite ground everything else sits on.
- **Shop Floor, Deep** (`#0b0c0e`): Footer and the fixed table-of-contents bar; the darkest recess.
- **Blueprint Blue** (`#1d3f5c`): Every spec plate — the Specifications block on the cover, the two Specification cards, all three Bill-of-Materials bins, all Systems-Assembly cards, and every frontend-assembly caption block. Always paired with the `blueprint-grid` graph-paper texture.
- **Blueprint Blue, Deep** (`#14324a`): Reserved for imagery overlays (a subtle multiply tint on photos) so photographs don't fight the blueprint palette.
- **Paper** (`#eaf3f7`): Text printed on blueprint-blue plates.
- **Steel** (`#e7e9ea`): Text printed directly on the dark shop floor (headlines, body copy outside plates).

### Named Rules
**The One Accent Rule.** Safety orange is the only saturated color in the system. If a second accent color feels necessary, the fix is contrast or type weight, never a second hue.

**The Plate/Floor Rule.** Content that is "on record" (a spec, a stamp, a caption, a fact) sits on a blueprint-blue plate. Content that is narrative or navigational (headlines, body prose, nav) sits directly on the shop floor. Nothing renders on a plain white or light-neutral background anywhere in the system.

## Typography

**Display Font:** Courier Prime (with ui-monospace, monospace fallback)
**Label/Body Font:** Archivo (with ui-sans-serif, system-ui, sans-serif fallback)

**Character:** Courier Prime is a real typewriter face — it's what a hand-typed 1970s parts catalog or field manual actually looked like, not a "tech mono" cliché. Archivo is a plain, confident grotesque that carries UI chrome, navigation, and body prose without competing with the stamped display type.

### Hierarchy
- **Display** (700, `clamp(2.25rem, 5vw, 3.75rem)`, 1.15): The name on the cover sheet and every section's stamped title (`SpecHeader`). Always uppercase, tight tracking.
- **Title** (700, 1.125–1.5rem): Assembly/project titles, spec-card headings. Uppercase, tight tracking, set in Courier Prime for the "stamped" feel.
- **Body** (400–500, 0.875–1.125rem, Archivo): Bio copy, highlight bullets, form labels. 65–75ch max width where prose runs long (Specification section).
- **Label** (500–700, 0.55–0.75rem, Archivo, uppercase, 0.15–0.35em tracking): Section eyebrows ("Sec. 01"), nav labels, part numbers' sibling text, stamp text.

### Named Rules
**The Stamp Rule.** Anything that reads as a fact printed on the object itself — a part number, a doc ID, a status stamp, a section number — is set in Courier Prime. Anything that is UI chrome or flowing prose is set in Archivo. The two faces are never used interchangeably.

## Layout

Single scrollable route, five anchored sections (`#cover #spec #bom #assemblies #request`), navigated by a fixed pill-shaped table-of-contents bar at the bottom center (`TableOfContents`), which scroll-spies via `IntersectionObserver` and highlights the active section in orange. Container width is `90%` of viewport up to a `max-w-6xl` cap, consistent across every section. Sections use generous vertical rhythm (`py-24` mobile, `py-32` desktop). Two grid patterns repeat throughout: a `[38-40%, 1fr]` two-column split for image+text sections (Specification), and a responsive card grid (`sm:2 / lg:3` columns) for the frontend assembly cards. Systems (backend) assemblies are full-width stacked rows, not grid cards, because their content (highlight lists, layer stacks) needs more horizontal room than a screenshot card does.

## Elevation & Depth

Flat by design — no drop shadows anywhere. Depth is conveyed entirely through the shop-floor/blueprint-plate material contrast (dark recess vs. lit blue plate) and 1–2px hairline borders (`--color-blue-line`), never through shadow blur.

### Named Rules
**The No-Shadow Rule.** This system never uses `box-shadow` for elevation. A plate reads as "lit" through color and grid texture, not through a drop shadow.

## Shapes

Zero border-radius everywhere — every plate, button, image frame, and input is a hard rectangle, reinforcing the printed-document/stamped-part character. Borders are always 1–2px solid hairlines in `--color-blue-line`, never soft or blurred. Status stamps (`.stamp`) get a small counter-rotation (`-3deg`) to read as physically stamped rather than perfectly typeset.

## Components

### Buttons
- **Shape:** Hard rectangle, no radius.
- **Primary:** Safety-orange background (`#d9622c`), shop-deep text, bold Archivo, uppercase, `0.08em` tracking, `12px 24px` padding. Hover → bright orange (`#ef7a41`).
- **Secondary/Ghost:** Transparent background, `1px` blue-line border, steel text. Hover → orange border + orange-bright text.

### Cards / Spec Plates
- **Corner Style:** None (0px radius).
- **Background:** Blueprint blue + `blueprint-grid` graph-paper texture.
- **Shadow Strategy:** None — see Elevation & Depth.
- **Border:** 1px `blue-line` hairline.
- **Internal Padding:** `20–32px`, scaling with card size.

### Inputs / Fields (Service Request form)
- **Style:** No border box — a single bottom hairline (`border-b border-blue-line`) on a transparent background, in keeping with the "form on a page" register rather than a boxed web-app input.
- **Focus:** Border color shifts to bright orange; no glow/ring.

### Navigation (Table of Contents)
- Fixed pill bar, bottom-center, `shop-deep/90` background with a hairline border, backdrop-blur. Each tab shows a Courier Prime section number and (desktop-only) an Archivo uppercase label. Active tab: bright-orange text plus a small orange underline mark, driven by scroll-spy.

### Signature Component: Layer Stack
A small staircase of bordered rectangles (`LayerStack`), each labeled with an architecture layer name (e.g. "gRPC + Webhook" → "Application Core" → "Infrastructure" → "Postgres + RabbitMQ"), left-indented per step. Stands in for a screenshot on the three backend Systems Assemblies, where a real architecture fact is more honest evidence than a decorative diagram would be.

## Do's and Don'ts

### Do:
- **Do** keep every "on record" fact (spec, stamp, caption, highlight list) on a blueprint-blue plate; keep narrative and navigation on the bare shop floor.
- **Do** set part numbers, doc IDs, and stamps in Courier Prime; set everything else in Archivo.
- **Do** back every project claim — frontend or backend — with a real, working link (repo and/or demo); for backend systems with no public demo, link source only rather than fabricating a URL.
- **Do** use the `LayerStack` pattern (or an equivalent real-fact spec block) for any future project that has architecture but no screenshot, instead of a generic placeholder image.

### Don't:
- **Don't** introduce a second accent color. Safety orange is the only saturated hue in the system.
- **Don't** add border-radius or box-shadow anywhere — both are foreign to this world's printed/stamped character.
- **Don't** reintroduce serif display type, parchment/cream plates, or "gallery/exhibit/guestbook" language — that is the explicitly rejected prior world (see PRODUCT.md's Design Correction).
- **Don't** claim authorship of forked or undocumented repos on this page; every backend project listed was verified against its own README first.
