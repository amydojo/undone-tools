(() => {
  'use strict';

  const body = document.body;
  const input = document.getElementById('vault-search');
  const clearButton = document.getElementById('vault-search-clear');
  const status = document.getElementById('vault-search-status');
  const searchableItems = Array.from(document.querySelectorAll('[data-searchable]'));
  const menuButton = document.querySelector('.vault-menu-toggle');
  const menu = document.getElementById('vault-nav');
  const recordsButton = document.getElementById('vault-records-toggle');
  const recordsGrid = document.getElementById('vault-record-grid');
  const searchShortcut = document.querySelector('[data-vault-focus-search]');

  const normalize = (value) => String(value || '').trim().toLowerCase();

  function setMenu(open) {
    if (!menuButton || !menu) return;
    menu.classList.toggle('is-open', open);
    body.classList.toggle('vault-menu-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? 'Close' : 'Menu';
  }

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        setMenu(false);
        menuButton.focus();
      }
    });
  }

  function updateSearch() {
    if (!input || !clearButton || !status || searchableItems.length === 0) return;

    const query = normalize(input.value);
    let visibleCount = 0;

    searchableItems.forEach((item) => {
      const haystack = normalize(`${item.dataset.searchable} ${item.textContent}`);
      const matches = query.length === 0 || haystack.includes(query);
      item.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    clearButton.hidden = query.length === 0;

    if (query.length === 0) {
      status.textContent = 'Showing the whole archive.';
    } else if (visibleCount === 0) {
      status.textContent = `No archive entries match “${input.value.trim()}”.`;
    } else {
      status.textContent = `${visibleCount} archive ${visibleCount === 1 ? 'entry' : 'entries'} match “${input.value.trim()}”.`;
    }
  }

  if (input && clearButton && status && searchableItems.length > 0) {
    input.addEventListener('input', updateSearch);
    clearButton.addEventListener('click', () => {
      input.value = '';
      updateSearch();
      input.focus();
    });
    updateSearch();
  }

  if (searchShortcut && input) {
    searchShortcut.addEventListener('click', () => {
      setMenu(false);
      document.querySelector('.vault-search-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => input.focus(), 250);
    });
  }

  if (recordsButton && recordsGrid) {
    recordsButton.addEventListener('click', () => {
      const open = recordsButton.getAttribute('aria-expanded') !== 'true';
      recordsButton.setAttribute('aria-expanded', String(open));
      recordsButton.textContent = open ? 'Hide source records' : 'Show source records';
      recordsGrid.classList.toggle('is-open', open);
    });
  }
})();
