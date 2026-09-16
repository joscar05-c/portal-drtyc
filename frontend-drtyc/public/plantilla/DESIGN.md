---
name: Portal Cívico Institucional DRTC
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d5e3fd'
  on-surface: '#0d1c2f'
  on-surface-variant: '#44474f'
  inverse-surface: '#233144'
  inverse-on-surface: '#ebf1ff'
  outline: '#747781'
  outline-variant: '#c4c6d1'
  surface-tint: '#415e95'
  primary: '#001a42'
  on-primary: '#ffffff'
  primary-container: '#0b2f64'
  on-primary-container: '#7c98d4'
  inverse-primary: '#adc6ff'
  secondary: '#005cba'
  on-secondary: '#ffffff'
  secondary-container: '#5095fe'
  on-secondary-container: '#002d61'
  tertiary: '#410002'
  on-tertiary: '#ffffff'
  tertiary-container: '#690005'
  on-tertiary-container: '#ff665a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#28467c'
  secondary-fixed: '#d7e3ff'
  secondary-fixed-dim: '#aac7ff'
  on-secondary-fixed: '#001b3e'
  on-secondary-fixed-variant: '#00458e'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#f8f9ff'
  on-background: '#0d1c2f'
  surface-variant: '#d5e3fd'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Public Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-xl-mobile:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes a civic, authoritative, and citizen-first digital standard for the Regional Directorate of Transport and Communications (DRTC). It articulates institutional transparency, public reliability, and navigational efficiency. 

The aesthetic is grounded in modern corporate-governmental design:
- **Tone:** Dignified, highly structured, clear, and uncompromisingly accessible (WCAG 2.1 AA/AAA compliance).
- **Audience:** Citizens processing driving licenses, commercial cargo carriers, telecommunications operators, oversight authorities, and public servants.
- **Visual Movement:** Contemporary Institutional. Replaces bureaucratic clutter with deliberate white space, structured content grids, crisp micro-borders, and high legibility.
- **Key Tenet:** Trust through clarity. Priority is given to immediate service discovery, unambiguous procedural statuses, normative documentation, and robust form workflows.

## Colors

The color palette reflects institutional authority, functional guidance, and sovereign identity:

- **Primary (`#0B2F64` - Deep Institutional Navy):** Used for global navigation headers, dominant page landmarks, primary action controls, and high-level headings. It projects trust, constitutional sobriety, and permanence.
- **Secondary (`#0066CC` - Civic Blue):** The primary interaction and operational color. Applied to interactive links, active navigational states, focus outlines, step indicators, and secondary utility actions.
- **Tertiary (`#B91C1C` - Republican Crimson):** Reserved strictly for institutional urgency, identity crest markers, official notices, alert badges, and critical system statuses.
- **Neutrals (`#0F172A` to `#F8FAFC`):** 
  - Text primary is anchored at `#0F172A` for high-contrast legibility against light canvases.
  - Body text utilizes `#334155` for reduced eye strain during prolonged reading of regulatory texts.
  - Neutral borders use `#E2E8F0` and `#CBD5E1`.
  - Base background surfaces leverage `#F8FAFC` with `#FFFFFF` reserved for elevated cards and analytical modules.
- **Semantic Feedback:** Success states lean on `#15803D` (Forest Green), Warnings on `#B45309` (Amber Gold), and Info on `#0369A1` (Steel Blue).

## Typography

Public Sans is selected for its institutional precision, high x-height, and neutral editorial tone engineered specifically for official interfaces.

- **Legibility Rules:** Paragraph blocks must not exceed 75 characters per line to maintain readability during technical inquiries and procedural reviews.
- **Hierarchy Enforcement:** Section titles use tight letter-spacing (`-0.01em` to `-0.02em`) with strong semi-bold and bold weights to provide clear visual anchors.
- **Numeric Data:** Tabular and procedural reference numbers (e.g., Expediente N°, RUC, Placas) must use font variants with tabular figures (`tnum`) enabled to ensure vertical alignment across data grids and financial receipts.

## Layout & Spacing

The system implements a structured 12-column responsive grid system based on an 8px base grid rhythm (with a 4px baseline sub-grid for dense UI controls):

- **Desktop (>= 1280px):** 12 columns, max-width container of 1280px, `1.5rem` gutters, and `2rem` outer page margins.
- **Tablet (768px - 1279px):** 8 columns, `1.25rem` gutters, and `1.5rem` outer page margins.
- **Mobile (< 768px):** 4 columns, `1rem` gutters, and `1rem` margins. Full-width stacking for transactional forms and regulatory tables.
- **Component Spacing:** Component internal padding uses strict intervals: `0.5rem` (8px) for badge and compact tag padding, `1rem` (16px) for standard field controls, and `1.5rem` (24px) for card interiors and dialog boxes.

## Elevation & Depth

To preserve institutional sobriety and avoid distracting optical weight, the design system utilizes low-contrast outlines combined with subtle ambient depth:

- **Level 0 (Flat/Base):** Default canvas (`#F8FAFC`) with no shadow. Structural dividers use a solid 1px border of `#E2E8F0`.
- **Level 1 (Surface Cards / Procedural Items):** `#FFFFFF` surface accompanied by a 1px border of `#E2E8F0` and an ambient, low-contrast shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Hover / Active Cards / Dropdowns):** Subtle displacement: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)` with border shift to `#CBD5E1`.
- **Level 3 (Modals / Floating Search Bars / Portals):** `0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.06)` paired with a semi-opaque neutral scrim (`rgba(15, 23, 42, 0.6)`).

## Shapes

The design system adopts a **Soft (Level 1)** geometric standard. This balance provides a structured, professional appearance suitable for government software, avoiding both sterile, sharp corners and excessively informal pill shapes.

- **Base Radius (0.25rem / 4px):** Form controls, text inputs, table row highlights, and utility tags.
- **Large Radius (0.5rem / 8px):** Informational cards, procedure panels, modal dialogues, and document preview containers.
- **Extra-Large Radius (0.75rem / 12px):** Hero service banners and major citizen portal access hubs.
- **Full Radius (9999px):** Numerical status counters and round step indicators only.

## Components

### Buttons
- **Primary:** Solid `#0B2F64` background, white text, 4px border radius. Height of 44px (touch-target compliant). On hover, darkens to `#082247`. Focus ring: 3px solid `#0066CC` offset by 2px.
- **Secondary:** White background, `#0B2F64` text, 1px solid `#CBD5E1`. Hover background shifts to `#F1F5F9`.
- **Emergency / Citizen Alerts:** Solid `#B91C1C` background, white text. Reserved for road closures, critical alerts, and sanction resolutions.
- **Size Options:** Compact (36px height, 12px horizontal padding), Standard (44px height, 20px horizontal padding), Large (52px height, 28px horizontal padding).

### Chips & Badges
- **Status Indicators:** Pill-shaped or soft-rect (`0.25rem`), utilizing low-saturation backgrounds with high-contrast text:
  - *En Trámite (In Process):* `#EFF6FF` background, `#1D4ED8` text, `#BFDBFE` border.
  - *Aprobado / Vigente (Approved):* `#F0FDF4` background, `#15803D` text, `#BBF7D0` border.
  - *Observado / Vencido (Expired/Flagged):* `#FEF2F2` background, `#B91C1C` text, `#FECACA` border.

### Input Fields & Search Controls
- **Text Fields:** 44px height, `#FFFFFF` background, 1px solid `#CBD5E1` border, `0.25rem` radius. Labels are positioned strictly above inputs in `label-lg` weight with explicit indicator marks for mandatory fields.
- **Focus State:** 1px solid `#0066CC` with a 3px outward glow `rgba(0, 102, 204, 0.2)`.
- **Error State:** 1px solid `#B91C1C` with an accompanying inline helper text displaying an alert icon.

### Data Tables (Normativas y Resoluciones)
- **Header:** Background `#F1F5F9`, text `#334155` in `label-md` uppercase, tracking `0.05em`, border bottom 2px solid `#CBD5E1`.
- **Rows:** Alternating subtle zebra rows or white-to-hover transitions (`#F8FAFC`). Height: 48px minimum for regulatory ease. Action buttons inside rows (e.g., "Descargar PDF") must feature explicit titles.

### Accordions (Trámites y Preguntas Frecuentes)
- **Container:** Enclosed in a 1px `#E2E8F0` border with a 0.5rem radius.
- **Header Trigger:** Expands across 100% width with clear chevron rotation. Focus states must surround the entire header trigger.

### Civic Cards
- **Service Cards (Trámites Frecuentes):** White background, Level 1 elevation, left accent border (3px solid `#0066CC`). Provides quick direct links to driver’s license appointment bookings, carrier permits, and record searches.