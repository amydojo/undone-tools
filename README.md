# Undone Tools

A static customer-facing site for Undone Studio, the Undone Standards product library, and the isolated Chaos Vault parts department.

## Run on Replit

The repository is configured as a static Replit project.

```bash
npx http-server . -p 5000 -c-1
```

Open `/` for Studio or `/standards/` for the product library.

## Customer-facing systems

- `/` uses the `.studio-*` namespace.
- `/standards/` uses the `.std-*` namespace.
- `/chaos-vault/` uses the `.cv-*` namespace and remains isolated from commerce.

Do not mix these namespaces.

## Etsy product configuration

All product destinations live in:

```text
assets/products.js
```

The two active products currently use the Undone by Design Etsy shop as a working fallback because exact listing URLs are not stored in the repository.

Replace each `checkoutUrl` with its exact Etsy Share & Save listing URL. Existing query parameters are preserved. Inbound UTM values are carried forward only when the destination does not already define that field.

## Commerce behavior

`assets/app.js` provides:

- checkout link hydration with a functional HTML fallback
- safe external-link attributes
- the `G` checkout shortcut on active product pages
- protection against firing the shortcut while typing
- session-scoped campaign attribution
- mobile sticky checkout visibility
- accordion and preview behavior

## Analytics adapter

`assets/analytics.js` emits local `undone:analytics` browser events and supports registered subscribers. It sends no network requests by default and does not claim that a provider is connected.

Tracked events:

- `product_page_viewed`
- `preview_activated`
- `primary_etsy_cta_clicked`
- `sticky_etsy_cta_clicked`
- `related_product_clicked`

To connect a provider later, register one subscriber at application startup:

```js
window.UndoneAnalytics.register((event) => {
  // Forward the event to an approved analytics provider.
});
```

Do not forward sensitive or free-form medical information.

## Product routes

Active:

- `/standards/microneedling-pre-care.html`
- `/standards/summer-skin-safety.html`

Concept archive:

- `/standards/injectables-aftercare.html`
- `/standards/laser-aftercare.html`

## Validation

Run:

```bash
node --check assets/products.js
node --check assets/analytics.js
node --check assets/app.js
node scripts/validate.mjs
```

The validation script checks required routes, purchase fallbacks, script order, product configuration, query-parameter preservation, and Commerce versus Chaos Vault namespace separation.

See `PRODUCT_CONTENT_NEEDED.md` for owner-supplied listing links, product facts, and authentic preview assets still needed.
