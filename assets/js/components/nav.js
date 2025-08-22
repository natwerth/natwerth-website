/* ── HEADER COMPONENT SCRIPT
   Version: 1.1.0  •  Date: 2025-08-13
   Change: no behavioral changes; kept for parity with styles. ── */
(function(){
  const header     = document.getElementById('siteHeader');
  const panel      = document.getElementById('mobilePanel');
  const btn        = document.getElementById('menuToggle');
  const backdrop   = document.getElementById('sharedBackdrop');
  const searchBtn  = document.getElementById('searchToggle');
  const closeBtn   = document.getElementById('closeSearch');
  const searchForm = document.getElementById('desktopSearch');
  const searchBox  = searchForm ? searchForm.querySelector('input') : null;

  let lastFocus = null;

  function setHeaderVar(){
    if(!header) return;
    const h = header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }

  function openPanel(){
    if(!panel || !btn) return;
    lastFocus = document.activeElement;
    panel.hidden = false;
    requestAnimationFrame(()=> panel.classList.add('open'));
    btn.classList.add('is-active');
    btn.setAttribute('aria-expanded','true');
    document.documentElement.classList.add('no-scroll','menu-open');
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
      document.activeElement.blur();
    }
  }

  function closePanel(){
    if(!panel || !btn) return;
    panel.classList.remove('open');
    btn.classList.remove('is-active');
    btn.setAttribute('aria-expanded','false');
    document.documentElement.classList.remove('no-scroll','menu-open');
    panel.addEventListener('transitionend', function te(e){
      if(e.propertyName === 'transform' && !panel.classList.contains('open')){
        panel.hidden = true;
        panel.removeEventListener('transitionend', te);
        if(lastFocus && typeof lastFocus.focus === 'function'){
          lastFocus.focus({preventScroll:true});
        }
      }
    });
  }

  function toggleMenu(){
    if(!panel) return;
    panel.classList.contains('open') ? closePanel() : openPanel();
  }

  function openSearch(){
    if(!header || !searchBtn) return;
    header.classList.add('search-open');
    searchBtn.setAttribute('aria-expanded','true');
    searchBtn.setAttribute('aria-label','Close search');
    if(searchBox){ setTimeout(()=> searchBox.focus({preventScroll:true}), 40); }
  }

  function closeSearch(){
    if(!header || !searchBtn) return;
    header.classList.remove('search-open');
    searchBtn.setAttribute('aria-expanded','false');
    searchBtn.setAttribute('aria-label','Open search');
  }

  function toggleSearch(){
    if(!header) return;
    header.classList.contains('search-open') ? closeSearch() : openSearch();
  }

  setHeaderVar();
  window.addEventListener('resize', setHeaderVar, {passive:true});
  window.addEventListener('orientationchange', setHeaderVar);

  if(btn) btn.addEventListener('click', toggleMenu);
  if(backdrop) backdrop.addEventListener('click', ()=>{ if (document.documentElement.classList.contains('menu-open')) closePanel(); });
  if(panel){
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', closePanel));
  }
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ closePanel(); closeSearch(); } });

  // Desktop search
  if(searchBtn) searchBtn.addEventListener('click', toggleSearch);
  if(closeBtn) closeBtn.addEventListener('click', closeSearch);
  document.addEventListener('click', (e)=>{ if(header && !header.contains(e.target)) closeSearch(); });
})();

 /* Tiny global toast + copy helper */
 window.NW = window.NW || {};
 NW.toast = (msg = 'Copied!') => {
  let el = document.querySelector('.c-toast');
  if(!el){
   el = document.createElement('div');
   el.className = 'c-toast';
   el.setAttribute('role','status');
   el.setAttribute('aria-live','polite');
   el.textContent = msg;
   document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('is-visible');
  clearTimeout(NW._toastTimer);
  NW._toastTimer = setTimeout(()=> el.classList.remove('is-visible'), 1200);
 };

 NW.copy = async (text) => {
  try { await navigator.clipboard.writeText(text); NW.toast(`Copied ${text}`); }
  catch {
   const ta = document.createElement('textarea'); ta.value=text; document.body.appendChild(ta);
   ta.select(); try{ document.execCommand('copy'); NW.toast(`Copied ${text}`);} finally{ ta.remove(); }
  }
 };

 /* Delegate clicks on any .c-copy[data-copy] */
 document.addEventListener('click', (e)=>{
  const btn = e.target.closest('.c-copy[data-copy]');
  if(btn) NW.copy(btn.getAttribute('data-copy'));
 });