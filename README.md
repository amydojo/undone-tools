# undone — standards chamber (v3)

## upload to replit (instant)
1) create a new HTML/CSS/JS repl
2) upload the entire folder contents (keep structure)
3) run → open `/` or `/standards/`

## update links (single source of truth)
edit: `assets/app.js`

- CONFIG.STUDIO_URL
- CONFIG.ETSY_INJECTABLES_URL
- CONFIG.ETSY_LASER_URL

product buttons use `data-buy="injectables"` / `data-buy="laser"` so you never hunt URLs across files.

## pages
- / (renders standards index)
- /standards/
- /standards/injectables-aftercare.html
- /standards/laser-aftercare.html (scaffold)
