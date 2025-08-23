document.addEventListener('DOMContentLoaded', async () => {
  // include loader
  const spots = document.querySelectorAll('[data-include]');
  for (const el of spots) {
    const res = await fetch(el.getAttribute('data-include'), { cache: 'no-store' });
    if (!res.ok) { console.error('Include failed', res.status); continue; }
    el.outerHTML = await res.text();
  }

  // now that the header exists, wire up behavior:
  const $ = (s, r=document) => r.querySelector(s);
  const menuBtn = $('#menuToggle');
  const backdrop = $('#sharedBackdrop');
  const searchBtn = $('#searchToggle');
  const closeSearchBtn = $('#closeSearch');
  const desktopSearch = $('#desktopSearch');

  // mobile menu
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      const open = menuBtn.getAttribute('aria-expanded') === 'true';
      menuBtn.setAttribute('aria-expanded', String(!open));
      menuBtn.classList.toggle('is-active', !open);          // for your hamburger animation
      document.documentElement.classList.toggle('nav-open', !open);
      backdrop?.classList.toggle('is-visible', !open);
    });
  }

  // search toggle (desktop)
  const setSearch = (open) => {
    searchBtn?.setAttribute('aria-expanded', String(open));
    if (desktopSearch) desktopSearch.hidden = !open;         // simple, CSS-free
    document.documentElement.classList.toggle('search-open', open);
    backdrop?.classList.toggle('is-visible', open);
  };
  searchBtn?.addEventListener('click', () => setSearch(true));
  closeSearchBtn?.addEventListener('click', () => setSearch(false));
  backdrop?.addEventListener('click', () => {
    // close everything when backdrop is clicked
    setSearch(false);
    menuBtn?.setAttribute('aria-expanded','false');
    menuBtn?.classList.remove('is-active');
    document.documentElement.classList.remove('nav-open');
    backdrop?.classList.remove('is-visible');
  });
});