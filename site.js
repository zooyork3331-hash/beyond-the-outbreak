(() => {
  const settings = window.BTO_SETTINGS || {};
  // Apply photos only if the matching file actually exists; otherwise keep the styled placeholder.
  document.querySelectorAll('[data-photo]').forEach(el => {
    const name = el.getAttribute('data-photo');
    if (!/^[a-z0-9-]+$/.test(name)) return;
    const url = `assets/photos/${name}.jpg`;
    const image = new Image();
    image.onload = () => { el.style.backgroundImage = `url("${url}")`; el.classList.add('has-photo'); };
    image.src = url;
  });
  const destinations = { discord: settings.discordInvite, support: settings.supportLink };
  Object.entries(destinations).forEach(([key, url]) => {
    document.querySelectorAll(`[data-link="${key}"]`).forEach(el => {
      if (typeof url === 'string' && /^https:\/\//i.test(url)) {
        el.href = url; el.target = '_blank'; el.rel = 'noopener noreferrer';
        el.classList.remove('hide');
      } else { el.classList.add('hide'); }
    });
  });
  const addr = { deerisle: settings.deerIsleAddress, badlands: settings.badlandsAddress };
  Object.entries(addr).forEach(([key, value]) => {
    const address = String(value || '').trim();
    document.querySelectorAll(`[data-address="${key}"]`).forEach(el => {
      el.textContent = address || 'To be announced';
    });
    document.querySelectorAll(`[data-copy-address="${key}"]`).forEach(el => {
      if (!address) { el.classList.add('hide'); return; }
      el.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(address);
          const original = el.textContent;
          el.textContent = 'Copied ✓';
          setTimeout(() => { el.textContent = original; }, 1800);
        } catch {
          window.prompt('Copy this server address:', address);
        }
      });
    });
  });
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-list');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); toggle.textContent = '☰';
    }));
  }
})();
