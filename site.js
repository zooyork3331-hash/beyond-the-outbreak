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
  // Keep the normal community invite. Route all existing Support buttons
  // to the new informational page, not directly to an external checkout.
  document.querySelectorAll('[data-link="discord"]').forEach(el => {
    const url = settings.discordInvite;
    if (typeof url === 'string' && /^https:\/\//i.test(url)) {
      el.href = url; el.target = '_blank'; el.rel = 'noopener noreferrer';
      el.classList.remove('hide');
    } else { el.classList.add('hide'); }
  });
  document.querySelectorAll('[data-link="support"]').forEach(el => {
    el.href = 'support.html'; el.removeAttribute('target'); el.removeAttribute('rel');
    el.classList.remove('hide');
  });
  const addr = { pripyat: settings.pripyatAddress, badlands: settings.badlandsAddress };
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
  // Global Staff & Support link: becomes available on all pages without editing each HTML file.
  if (mainNav && !mainNav.querySelector('a[href="staff.html"]')) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'nav-link'; link.href = 'staff.html'; link.textContent = 'Staff & Support';
    if (window.location.pathname.endsWith('/staff.html')) link.setAttribute('aria-current', 'page');
    item.appendChild(link);
    const discordLink = mainNav.querySelector('[data-link="discord"]');
    mainNav.insertBefore(item, discordLink ? discordLink.closest('li') : null);
  }
  document.querySelectorAll('.footer-grid > div').forEach(group => {
    const heading = group.querySelector('h3');
    if (heading && heading.textContent.trim().toUpperCase() === 'COMMUNITY' && !group.querySelector('a[href="staff.html"]')) {
      const link = document.createElement('a'); link.href='staff.html'; link.textContent='Staff & Support';
      heading.after(link);
    }
  });
  // A single Support link appears across all pages, including older guides.
  if (!document.querySelector('link[href="support-nav.css"]')) {
    const navStyles = document.createElement('link');
    navStyles.rel = 'stylesheet'; navStyles.href = 'support-nav.css';
    document.head.appendChild(navStyles);
  }
  if (mainNav && !mainNav.querySelector('a[href="support.html"]')) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.className = 'nav-link'; link.href = 'support.html'; link.textContent = 'Support Us';
    if (window.location.pathname.endsWith('/support.html')) link.setAttribute('aria-current','page');
    item.appendChild(link);
    const discordLink = mainNav.querySelector('[data-link="discord"]');
    mainNav.insertBefore(item, discordLink ? discordLink.closest('li') : null);
  }
  document.querySelectorAll('.footer-grid > div').forEach(group => {
    const heading = group.querySelector('h3');
    if (heading && heading.textContent.trim().toUpperCase() === 'COMMUNITY' && !group.querySelector('a[href="support.html"]')) {
      const link = document.createElement('a'); link.href='support.html'; link.textContent='Support the Servers';
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
