(() => {
  'use strict';

  const input = document.getElementById('vault-search');
  const clearButton = document.getElementById('vault-search-clear');
  const status = document.getElementById('vault-search-status');
  const searchableItems = Array.from(document.querySelectorAll('[data-searchable]'));

  if (!input || !clearButton || !status || searchableItems.length === 0) return;

  const normalize = (value) => String(value || '').trim().toLowerCase();

  function update() {
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

  input.addEventListener('input', update);
  clearButton.addEventListener('click', () => {
    input.value = '';
    update();
    input.focus();
  });

  update();
})();
