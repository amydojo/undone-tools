# Undone

## Overview

Undone is a static HTML, CSS, and JavaScript site with three intentionally isolated areas:

1. Studio homepage at `/` using `.studio-*`
2. Standards product library at `/standards/` using `.std-*`
3. Chaos Vault at `/chaos-vault/` using `.cv-*`

There is no backend, database, bundler, or required analytics provider.

## Replit workflow

Run:

```bash
npx http-server . -p 5000 -c-1
```

The `.replit` Project workflow uses this command and exposes the static site through the webview.

## Standards commerce architecture

- `assets/products.js` is the single source of truth for product identity and Etsy destinations.
- `assets/analytics.js` is a no-network event adapter.
- `assets/app.js` handles shared interaction, campaign attribution, checkout links, keyboard shortcut behavior, and sticky mobile CTAs.
- `assets/commerce.css` contains only `.std-*` customer-facing commerce styles.

Active products use a working Etsy shop fallback until exact listing URLs are supplied. Replace those values with exact Etsy Share & Save listing URLs without removing their existing query parameters.

## Checkout behavior

Active product CTAs include a literal Etsy `href`, so checkout still works if JavaScript fails. JavaScript upgrades the destination with safe attribution parameters.

Pressing `G` opens the primary checkout CTA only on an active product page. The shortcut does not fire inside inputs, textareas, selects, or editable content.

## Analytics behavior

No external provider is configured. Events are emitted locally through `window.UndoneAnalytics` and the `undone:analytics` browser event. Debug logging is off unless `window.UNDONE_ANALYTICS_DEBUG = true` is set before an interaction.

## Safety and content

The new product proof pages avoid treatment instructions and label structural previews clearly. Archived injectables and laser pages are not active products or clinical protocols.

See `PRODUCT_CONTENT_NEEDED.md` for unconfirmed product details and owner actions.
