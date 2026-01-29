document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.js-tsc-locator').forEach(initLocator);
});

function initLocator(root) {
  const searchInput = root.querySelector('.tsc-search-input');
  const regionSelect = root.querySelector('.tsc-filter-region');
  const typeSelect = root.querySelector('.tsc-filter-type');
  const items = Array.from(root.querySelectorAll('.tsc-item'));
  const noResultsEl = root.querySelector('.tsc-no-results');
  const mapFrame = root.querySelector('.tsc-map-frame');

  function applyFilters() {
    const q = (searchInput?.value || '').trim().toLowerCase();
    const regionVal = (regionSelect?.value || 'all').toLowerCase();
    const typeVal = (typeSelect?.value || 'all').toLowerCase();

    let anyVisible = false;
    let firstVisible = null;

    items.forEach((item) => {
      const name = (item.dataset.name || '').toLowerCase();
      const addr = (item.dataset.address || '').toLowerCase();
      const region = (item.dataset.region || '').toLowerCase();
      const tagsRaw = (item.dataset.tags || '').toLowerCase();

      const matchesSearch =
        !q || name.includes(q) || addr.includes(q);

      const matchesRegion =
        regionVal === 'all' ||
        regionVal === '' ||
        region === regionVal;

      const matchesType =
        typeVal === 'all' ||
        typeVal === '' ||
        tagsRaw.includes(typeVal);

      const visible = matchesSearch && matchesRegion && matchesType;

      item.style.display = visible ? '' : 'none';

      if (visible) {
        anyVisible = true;
        if (!firstVisible) firstVisible = item;
      }
    });

    if (noResultsEl) {
      noResultsEl.hidden = anyVisible;
    }

    // Update selected item + map
    items.forEach((item) => item.classList.remove('is-selected'));

    if (firstVisible) {
      firstVisible.classList.add('is-selected');
      const mapUrl = firstVisible.dataset.map;
      if (mapFrame && mapUrl) {
        if (mapFrame.src !== mapUrl) {
          mapFrame.src = mapUrl;
        }
      }
    }
  }

  // Click behaviour
  items.forEach((item) => {
    item.addEventListener('click', () => {
      items.forEach((i) => i.classList.remove('is-selected'));
      item.classList.add('is-selected');

      const mapUrl = item.dataset.map;
      if (mapUrl && mapFrame) {
        if (mapFrame.src !== mapUrl) {
          mapFrame.src = mapUrl;
        }
      }

      const website = item.dataset.website;
      // If it’s a pure online retailer, clicking the "card"
      // doesn’t auto-open the site (that’s annoying on mobile);
      // the user can tap the link text instead.
    });
  });

  // Wire filters
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  if (regionSelect) {
    regionSelect.addEventListener('change', applyFilters);
  }
  if (typeSelect) {
    typeSelect.addEventListener('change', applyFilters);
  }

  applyFilters();
}
