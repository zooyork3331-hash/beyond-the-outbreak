/* Beyond the Outbreak — auto-refresh hosted live status banners.
   Third-party image widgets work on static GitHub Pages without a browser API/CORS requirement.
   Source: https://gamemonitoring.net/dayz/servers/14372044/banners
*/
(() => {
  'use strict';
  const REFRESH_MS = 120000; // Approx 2 minutes; the monitoring provider polls separately.
  const widgets = [...document.querySelectorAll('[data-live-widget]')];
  if (!widgets.length) return;

  const update = (widget, available, text) => {
    widget.classList.toggle('is-unavailable', !available);
    const fallback = widget.querySelector('[data-live-fallback]');
    if (fallback) fallback.hidden = available;
    const note = widget.querySelector('[data-live-refresh-note]');
    if (note) note.textContent = text;
  };

  const refreshOne = widget => {
    const img = widget.querySelector('img[data-live-img]');
    if (!img) return;
    const source = img.dataset.liveSrc;
    if (!source || !source.startsWith('https://widgets.gamemonitoring.net/')) return;
    const url = source + '?refresh=' + Math.floor(Date.now() / REFRESH_MS);
    const preload = new Image();
    preload.onload = () => {
      img.src = url;
      update(widget, true, 'Updated ' + new Date().toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}) + ' · approximate live count');
    };
    preload.onerror = () => update(widget, false, 'Tracker currently unreachable.');
    preload.src = url;
  };
  widgets.forEach(widget => {
    const img = widget.querySelector('img[data-live-img]');
    if (!img) return;
    img.addEventListener('load', () => update(widget, true, 'Live count · updates periodically'));
    img.addEventListener('error', () => update(widget, false, 'Tracker currently unreachable.'));
    if (img.complete && img.naturalWidth === 0) update(widget, false, 'Tracker currently unreachable.');
  });
  window.setInterval(() => {
    if (!document.hidden) widgets.forEach(refreshOne);
  }, REFRESH_MS);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) widgets.forEach(refreshOne);
  });
})();
