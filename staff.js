// Beyond the Outbreak — Staff & Support enhancements.
(() => {
  const staffConfig = window.BTO_STAFF || {};
  const sharedSettings = window.BTO_SETTINGS || {};
  const invite = typeof sharedSettings.discordInvite === 'string' ? sharedSettings.discordInvite.trim() : '';
  const ticketUrl = typeof staffConfig.ticketChannelUrl === 'string' ? staffConfig.ticketChannelUrl.trim() : '';
  const validDiscord = url => /^https:\/\/(discord\.gg\/|discord(?:app)?\.com\/)/i.test(url);
  const directTickets = validDiscord(ticketUrl);
  const destination = directTickets ? ticketUrl : (validDiscord(invite) ? invite : '');
  const supportButtons = document.querySelectorAll('[data-staff-support-link]');
  supportButtons.forEach(link => {
    if (!destination) { link.classList.add('hide'); return; }
    link.href = destination;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = directTickets ? 'Open Support Tickets ↗' : 'Join Our Discord ↗';
    link.classList.remove('hide');
  });
  const note = document.querySelector('#staff-discord-note');
  if (note) note.textContent = directTickets
    ? 'This button opens our Ticket Tool panel message in Discord. If you have not joined yet, use Join Discord in the top menu first. Then select the ticket option on the panel.'
    : 'Open our Discord and use the support method listed there. A direct ticket-channel link has not been configured.';

  const roster = document.getElementById('staff-roster');
  const members = Array.isArray(staffConfig.members) ? staffConfig.members.filter(p => p && typeof p.name === 'string' && p.name.trim()) : [];
  if (roster) {
    roster.replaceChildren();
    for (const person of members) {
      const article = document.createElement('article'); article.className = 'staff-person';

      let emblem;
      const avatar = typeof person.avatar === 'string' ? person.avatar.trim() : '';
      if (avatar) {
        emblem = document.createElement('img');
        emblem.className = 'staff-emblem staff-avatar';
        emblem.src = avatar;
        emblem.alt = `${person.name} profile image`;
        emblem.loading = 'lazy';
        emblem.decoding = 'async';
      } else {
        emblem = document.createElement('span');
        emblem.className = 'staff-emblem';
        emblem.setAttribute('aria-hidden', 'true');
        emblem.textContent = person.name.trim().slice(0, 1).toUpperCase();
      }

      const body = document.createElement('div'); body.className = 'staff-person-copy';
      const overline = document.createElement('div'); overline.className = 'staff-role'; overline.textContent = String(person.role || 'Community Staff');
      const name = document.createElement('h3'); name.textContent = person.name;
      const desc = document.createElement('p'); desc.textContent = String(person.description || 'Member of the Beyond the Outbreak team.');
      body.append(overline, name, desc); article.append(emblem, body); roster.append(article);
    }
    if (!members.length) {
      const p = document.createElement('p');
      p.className = 'staff-empty';
      p.textContent = 'The staff roster will be available soon. You can still reach the community through Discord.';
      roster.append(p);
    }
  }
  const copy = document.querySelector('[data-copy-report]');
  if (copy) copy.addEventListener('click', async () => {
    const template = `BEYOND THE OUTBREAK — SUPPORT REQUEST
Server: Deer Isle / Badlands
Type: Player report / Bug / Lost items / Other
In-game name(s):
Approximate date & time (include timezone):
Location:
What happened:
Evidence (screenshots / clips / logs):
What help are you requesting:`;
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(template);
      const original = copy.textContent;
      copy.textContent = 'Copied ✓';
      setTimeout(() => { copy.textContent = original; }, 1800);
    } catch {
      window.prompt('Copy your support template:', template);
    }
  });
})();
