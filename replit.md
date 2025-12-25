# Undone Standards

## Overview

Undone Standards is a static marketing and product site for clinic-ready operational tools (aftercare guides for medical aesthetics). The site serves as an extension of the main Undone Design Studio brand, presenting downloadable/purchasable patient instruction guides with a premium, minimalist dark-mode aesthetic.

The project is a simple static HTML/CSS/JS site with no backend, database, or build system. It's designed for instant deployment on Replit or any static hosting platform.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- Pure HTML5, CSS3, and vanilla JavaScript
- No frameworks, bundlers, or build tools
- Static file serving via the `serve` npm package

**Design System:**
- Dark mode aesthetic with CSS custom properties (design tokens)
- Typography: System fonts (Inter/SF Pro) with clear hierarchy
- Color palette: Deep blacks (#05050a), muted purples (#7b6cff), high-contrast text
- Layout: Max-width container (960px), vertical rhythm, generous whitespace

**File Structure:**
```
/                     → Root index (standards landing)
/standards/           → Standards section index
/standards/*.html     → Individual product pages
/assets/styles.css    → Global stylesheet with design tokens
/assets/app.js        → Client-side interactivity
```

**JavaScript Patterns:**
- Intersection Observer for scroll-triggered fade animations
- Keyboard shortcuts (press 'G' to trigger buy button)
- Data attributes (`data-buy`, `data-preview`) for declarative behavior
- Centralized URL configuration in `CONFIG` object for external links

### Content Architecture

**Page Types:**
1. Index pages (landing/navigation)
2. Product detail pages (injectables-aftercare, laser-aftercare)

**Navigation Pattern:**
- Persistent header with brand orb, wordmark, and nav links
- Back links on detail pages
- External links open in new tabs

### Styling Approach

- Mobile-first responsive design using `clamp()` for fluid typography
- CSS custom properties for consistent theming
- Subtle gradient backgrounds and border treatments
- Animation via CSS transitions and JS-controlled class toggling

## External Dependencies

### NPM Packages
- **serve** (v14.2.5): Static file server for local development and Replit deployment

### External Links (Configurable)
All external URLs are centralized in `assets/app.js`:
- **Studio URL**: https://undonedesign.studio (main brand site)
- **Etsy Store**: https://undonebydesign.etsy.com (product purchase destination)

### Fonts
- System font stack only (Inter, SF Pro, system defaults)
- No external font loading or CDN dependencies

### Hosting
- Designed for static hosting (Replit, Netlify, Vercel, or any static server)
- No server-side processing required
- No database or API dependencies