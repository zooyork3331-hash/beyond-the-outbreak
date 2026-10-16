/* Badlands scheduled launch countdown — time is fixed to Oct 17 2026, 8:00 PM EDT. */
(() => {
  const clock = document.querySelector('[data-badlands-countdown]');
  if (!clock) return;
  // 8 PM EDT on October 17 equals 00:00 UTC on October 18.
  const launchAt = Date.parse('2026-10-18T00:00:00Z');
  const note = document.getElementById('bl-countdown-note');
  const target = {
    days: clock.querySelector('[data-bl-unit="days"]'),
    hours: clock.querySelector('[data-bl-unit="hours"]'),
    minutes: clock.querySelector('[data-bl-unit="minutes"]'),
    seconds: clock.querySelector('[data-bl-unit="seconds"]')
  };
  function update() {
    let remaining = Math.max(0, launchAt - Date.now());
    const days = Math.floor(remaining / 86400000); remaining %= 86400000;
    const hours = Math.floor(remaining / 3600000); remaining %= 3600000;
    const minutes = Math.floor(remaining / 60000); remaining %= 60000;
    const seconds = Math.floor(remaining / 1000);
    target.days.textContent = String(days);
    target.hours.textContent = String(hours).padStart(2,'0');
    target.minutes.textContent = String(minutes).padStart(2,'0');
    target.seconds.textContent = String(seconds).padStart(2,'0');
    if (Date.now() >= launchAt && note) {
      note.textContent = 'The scheduled opening time has arrived. Check Discord for confirmed availability and connection details.';
      return true;
    }
    return false;
  }
  if (!update()) {
    const timer = setInterval(() => { if (update()) clearInterval(timer); }, 1000);
  }
})();
