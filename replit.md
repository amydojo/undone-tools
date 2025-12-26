# Undone

## Overview

Undone is a dual-system static site with:
1. **Studio homepage** (`/`) — Gotham-inspired procedural hero showcasing operational clarity philosophy
2. **Standards library** (`/standards/`) — Clinic-ready operational documents with future-proof taxonomy

The project is a simple static HTML/CSS/JS site with no backend, database, or build system. It's designed for instant deployment on Replit or any static hosting platform.

## Recent Changes (December 2025)

- **Studio homepage redesign**: New Gotham-like procedural canvas hero with globe arc, orbital dot field, atmosphere rim glow, and lat/long grid lines
- **Dual namespace architecture**: `.studio-*` for homepage, `.std-*` for standards — complete isolation prevents CSS leakage
- **Canvas animation features**: IntersectionObserver pause when offscreen, prefers-reduced-motion support, mouse parallax (desktop only)
- **7-section studio layout**: Hero, positioning, marketing, materials, filter, standards bridge, closer
- **Standards library model**: 3 categories (Patient Communication, Patient Education, Clinic Operations)
- **Server switch**: Changed from `serve` to `http-server` with `-c-1` flag to disable caching

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- Pure HTML5, CSS3, and vanilla JavaScript
- No frameworks, bundlers, or build tools
- Static file serving via `http-server` npm package (with cache disabled)

**Design System:**
- Dark mode aesthetic with CSS custom properties (design tokens)
- Typography: System fonts (Inter/SF Pro) with clear hierarchy
- Color palette: Deep blacks (#05050a), muted purples (#7b6cff), high-contrast text
- Layout: Max-width container (1040px), vertical rhythm, generous whitespace
- Atmospheric radial gradients on `.std-shell` wrapper

**CSS Architecture:**
- Homepage uses `.studio-*` namespaced classes (`.studio-shell`, `.studio-hero`, `.studio-reveal`, etc.)
- Standards pages use `.std-*` namespaced classes (`.std-shell`, `.std-reveal`, `.std-card`, etc.)
- Both systems coexist in `/assets/styles.css` with clear section dividers — complete namespace isolation

**File Structure:**
```
/                     → Root index (homepage)
/standards/           → Standards section index (anti-hero positioning page)
/standards/*.html     → Individual product pages
/assets/styles.css    → Global stylesheet with design tokens
/assets/app.js        → Client-side interactivity
```

**JavaScript Patterns:**
- IntersectionObserver for scroll-triggered reveal animations
- Two animation systems: `.studio-reveal` for homepage, `.std-reveal` for standards
- Canvas-based procedural hero animation with IntersectionObserver pause when offscreen
- Mouse parallax on desktop (pointer: fine media query)
- Keyboard shortcuts (press 'G' to trigger checkout on product pages)
- Accessible accordions with aria-expanded and keyboard navigation
- Smooth scroll respecting prefers-reduced-motion
- Checkout URL wiring via `<meta name="checkout-url">` tag

### Content Architecture

**Page Types:**
1. Homepage (`/index.html`) - Studio design with procedural canvas hero, uses `.studio-*` classes
2. Standards landing (`/standards/index.html`) - Library model with 3 categories
3. Product detail pages (`/standards/injectables-aftercare.html`, `/standards/laser-aftercare.html`)

**Studio Homepage Sections:**
1. Hero (procedural canvas with globe, orbital dots)
2. Positioning (operational clarity)
3. Marketing (infrastructure approach)
4. Materials (work scope)
5. Filter (for/not-for)
6. Standards bridge (CTA to /standards/)
7. Closer

**Standards Landing Page Sections:**
1. Anti-hero opening (disarm)
2. What this is (taxonomy intro)
3. Product library (3 categories: Patient Communication, Patient Education, Clinic Operations)
4. Evolution note (coming soon items)
5. Closer with footer nav

**Product Page Sections:**
1. Hero with SYSTEM STANDARD eyebrow
2. Product module (4 includes, format, delivery, CTAs)
3. Protocol accordion (Day 0-1, Days 2-7, What's Normal, Red Flags)
4. Why this holds up (3 blocks)
5. Premium preview (id="preview")
6. FAQ accordion (3 items)

### Styling Approach

- Mobile-first responsive design using `clamp()` for fluid typography
- CSS custom properties for consistent theming
- Subtle gradient backgrounds and border treatments
- Animation via CSS transitions and JS-controlled class toggling
- Root-absolute asset paths (`/assets/`) for nested pages

## External Dependencies

### NPM Packages
- **http-server**: Static file server with cache control (`-c-1` disables caching)

### External Links (Configurable)
- **Checkout URLs**: Set via `<meta name="checkout-url">` in each product page head
- **Etsy Store**: https://undonebydesign.etsy.com (product purchase destination)

### Fonts
- System font stack only (Inter, SF Pro, system defaults)
- No external font loading or CDN dependencies

### Hosting
- Designed for static hosting (Replit, Netlify, Vercel, or any static server)
- No server-side processing required
- No database or API dependencies

## Workflow Configuration

**Frontend Server:**
- Command: `npx http-server . -p 5000 -c-1`
- Port: 5000
- Cache disabled for development
