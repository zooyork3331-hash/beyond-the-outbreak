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
  // Global News & Events navigation added automatically on all existing pages.
  // Keeps the original page HTML unchanged (important for the existing custom guides).
  if (!document.querySelector('link[href="news.css"]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = 'news.css';
    document.head.appendChild(css);
  }
  const mainNav = document.querySelector('.nav-list');
  if (mainNav && !mainNav.querySelector('a[href="news.html"]')) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'nav-link'; link.href = 'news.html'; link.textContent = 'News & Events';
    if (window.location.pathname.endsWith('/news.html')) link.setAttribute('aria-current','page');
    item.appendChild(link);
    const discord = mainNav.querySelector('[data-link="discord"]');
    mainNav.insertBefore(item, discord && discord.closest('li') || null);
  }
  document.querySelectorAll('.footer-grid > div').forEach(group => {
    const heading = group.querySelector('h3');
    if (heading && heading.textContent.trim().toUpperCase() === 'COMMUNITY' && !group.querySelector('a[href="news.html"]')) {
      const link = document.createElement('a'); link.href='news.html'; link.textContent='News & Events';
      heading.after(link);
    }
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
