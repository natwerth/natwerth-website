document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-include]').forEach(async el => {
    const url = el.getAttribute('data-include');
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      el.outerHTML = await res.text(); // replace placeholder with fetched HTML
    } catch (e) {
      console.error('Include failed:', url, e);
    }
  });
});