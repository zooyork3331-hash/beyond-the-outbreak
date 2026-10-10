/* Beyond the Outbreak — support settings renderer (static-site safe). */
(() => {
  'use strict';
  const config = window.BTO_SUPPORT || {};
  const url = typeof config.donationUrl === 'string' ? config.donationUrl.trim() : '';
  // Require a real HTTPS link, not a browser script or an embedded payment form.
  const validDonationUrl = /^https:\/\/[^\s/]+(?:\/[^\s]*)?$/i.test(url);
  const donate = document.getElementById('support-donate');
  const pending = document.getElementById('support-pending');
  if (donate && validDonationUrl) {
    donate.href = url;
    donate.target = '_blank';
    donate.rel = 'noopener noreferrer';
    donate.textContent = (String(config.donationButtonText || 'Contribute Securely').slice(0,50)) + ' ↗';
    donate.classList.remove('hide');
    if (pending) pending.classList.add('hide');
  }
  const isAmount = v => typeof v === 'number' && Number.isFinite(v) && v >= 0;
  const hasGoal = isAmount(config.monthlyGoal) && config.monthlyGoal > 0;
  const hasRaised = isAmount(config.amountRaised);
  const amountText = x => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:0}).format(x);
  const goal = document.getElementById('support-goal');
  const raised = document.getElementById('support-raised');
  const track = document.getElementById('support-progress');
  const foot = document.getElementById('support-progress-note');
  const period = document.getElementById('support-period');
  const date = document.getElementById('support-updated');
  if (hasGoal && goal) goal.textContent = amountText(config.monthlyGoal);
  if (hasRaised && raised) raised.textContent = amountText(config.amountRaised);
  if (hasGoal && hasRaised && track) {
    const percentage = Math.min(100,Math.round(config.amountRaised/config.monthlyGoal*100));
    track.style.width = percentage + '%';
    const meter = document.getElementById('support-meter');
    if (meter) {meter.setAttribute('role','progressbar');meter.setAttribute('aria-valuemin','0');meter.setAttribute('aria-valuenow',String(Math.min(config.amountRaised,config.monthlyGoal)));meter.setAttribute('aria-valuemax',String(config.monthlyGoal));meter.setAttribute('aria-label',`${amountText(config.amountRaised)} raised toward ${amountText(config.monthlyGoal)} monthly goal`);}
    if (foot) foot.textContent = `${percentage}% of this month's funding goal reported. Updated manually by the staff.`;
  } else if (foot) foot.textContent = 'We have not published a monthly funding target yet. No donation totals are being claimed.';
  if (period && typeof config.monthLabel === 'string' && config.monthLabel.trim()) period.textContent=config.monthLabel.trim();
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(config.lastUpdated || '')) date.textContent='Figures updated: '+config.lastUpdated;
})();
