# Undone Standards

## Overview

Undone Standards is a static marketing and product site for clinic-ready operational tools (aftercare guides for medical aesthetics). The site serves as an extension of the main Undone Design Studio brand, presenting downloadable/purchasable patient instruction guides with a premium, minimalist dark-mode aesthetic.

The project is a simple static HTML/CSS/JS site with no backend, database, or build system. It's designed for instant deployment on Replit or any static hosting platform.

## Recent Changes (December 2025)

- **Studio-grade upgrade**: Revamped standards section to match Apple/Stripe visual quality
- **CSS namespacing**: All standards pages use `.std-*` prefixed classes to avoid conflicts with homepage
- **8-section landing page**: Anti-hero opening, identity reframe, process credibility, restraint section, visual proof with callouts, for/not-for manifesto, product cards, closer
- **Product page structure**: Hero, product module, 4-item protocol accordion, 3 why-this-holds-up blocks, premium preview, 3-item FAQ
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
- Homepage uses non-namespaced classes (`.container`, `.hero`, `.fade-in`, etc.)
- Standards pages use `.std-*` namespaced classes (`.std-shell`, `.std-reveal`, `.std-card`, etc.)
- Both systems coexist in `/assets/styles.css` with clear section divider

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
- Two animation systems: `.fade-in` for homepage, `.std-reveal` for standards
- Keyboard shortcuts (press 'G' to trigger checkout on product pages)
- Accessible accordions with aria-expanded and keyboard navigation
- Smooth scroll respecting prefers-reduced-motion
- Checkout URL wiring via `<meta name="checkout-url">` tag

### Content Architecture

**Page Types:**
1. Homepage (`/index.html`) - Original design, uses `.container` class
2. Standards landing (`/standards/index.html`) - Positioning page with 8 sections
3. Product detail pages (`/standards/injectables-aftercare.html`, `/standards/laser-aftercare.html`)

**Standards Landing Page Sections:**
1. Anti-hero opening (disarm)
2. Identity reframe (two-column)
3. Process credibility (quiet flex)
4. Restraint as the product
5. Visual proof (editorialized with callouts)
6. For/not-for manifesto filter
7. Product entry cards (conversion)
8. Closer with footer nav

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
