# Undone

## Overview

Undone is a design studio and standards library focused on operational clarity for clinics. The site uses a "diagnostic reveal" pattern to demonstrate restraint and assume visitor intelligence.

## Recent Changes (December 2025)

- **Cinematic Diagnostic Hero**: Implemented a three-line reveal pattern (Primary → Diagnostic → Resolution) on the homepage.
- **Atmospheric Canvas**: Re-tuned particle system for ultra-slow drift with "freeze" states during the diagnostic beat.
- **Spatial Storytelling**: Added 128px vertical "gaps" and hairline dividers to visualize the infrastructure problem.
- **Typography Overhaul**: Standardized on a clean sans-serif stack (Inter/SF Pro) with weight restraint (max 500/600).
- **Mobile Refinement**: Fixed text clipping, adjusted fluid spacing, and optimized header padding for smaller screens.

## Design Principles

- **Diagnostic Tension**: Use pacing and spacing to create anticipation.
- **Recognition over Persuasion**: Let the user arrive at the conclusion themselves.
- **Apple-tier Motion**: 8-10px drifts, cubic-bezier easing, and meaningful staggers.
- **Pure Aesthetics**: #000 background, rgba(255,255,255,0.1) borders, and subtle purple accents.

## Technical Architecture

- **Vanilla Stack**: Pure HTML/CSS/JS with no build system.
- **Namespace Isolation**: `.studio-*` for homepage and `.std-*` for standards library.
- **Performance**: IntersectionObserver for reveal animations and canvas lifecycle management.
- **Deployment**: Static hosting via `http-server` on port 5000.
