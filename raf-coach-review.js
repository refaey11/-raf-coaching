/* RAF Coach Review Queue
   Local prototype: reviews onboarding requests saved in localStorage.
*/
(function () {
  'use strict';

  const SESSION_KEY = 'rafSession';
  const ONBOARDING_KEY = 'rafClientOnboarding';

  function session() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (_) { return null; }
  }

  function getRequest() {
    try { return JSON.parse(localStorage.getItem(ONBOARDING_KEY) || 'null'); } catch (_) { return null; }
  }

  function saveRequest(data) {
    localStorage.setItem(ONBOARDING_KEY, JSON.stringify(data));
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function openReview() {
    const request = getRequest();
    const old = document.getElementById('raf-review-modal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'raf-review-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;padding:18px;font-family:inherit;';
    modal.innerHTML = `
      <div style="width:min(620px,100%);max-height:90vh;overflow:auto;background:#101713;border:1px solid #344239;border-radius:24px;padding:24px;color:#edf5ee;box-shadow:0 24px 80px #000">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:18px">
          <div><div style="font-size:12px;letter-spacing:3px;color:#a7b8aa">COACH REVIEW</div><h2 style="margin:8px 0 0;font-size:28px">New client requests</h2></div>
          <button id="raf-review-close" style="background:#202a23;color:#fff;border:1px solid #3a493d;border-radius:12px;padding:10px 14px;font-size:20px">×</button>
        </div>
        ${request ? `
          <div style="background:#18221b;border:1px solid #344239;border-radius:16px;padding:16px;display:grid;gap:10px">
            <div><strong>Client:</strong> ${esc(request.clientName)}</div>
            <div><strong>Status:</strong> ${esc(request.status || 'pending-review')}</div>
            <div><strong>Age:</strong> ${esc(request.age)}</div>
            <div><strong>Goal:</strong> ${esc(request.goal)}</div>
            <div><strong>Experience:</strong> ${esc(request.experience)}</div>
            <div><strong>Training days:</strong> ${esc(request.daysPerWeek)}</div>
            <div><strong>Equipment:</strong> ${esc(request.equipment)}</div>
            <div><strong>Notes:</strong> ${esc(request.notes || '—')}</div>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:18px">
            <button id="raf-approve" style="flex:1;background:#bdf26b;color:#091008;border:0;border-radius:13px;padding:14px;font-weight:800">Approve client</button>
            <button id="raf-reassess" style="flex:1;background:#28352c;color:#fff;border:1px solid #526454;border-radius:13px;padding:14px;font-weight:700">Request reassessment</button>
          </div>
        ` : '<div style="padding:28px 8px;color:#a7b8aa;text-align:center">No onboarding requests yet.</div>'}
      </div>`;
    document.body.appendChild(modal);
    document.getElementById('raf-review-close').onclick = () => modal.remove();

    if (request) {
      document.getElementById('raf-approve').onclick = () => {
        request.status = 'approved';
        request.approvedAt = new Date().toISOString();
        request.approvedBy = (session() || {}).name || 'Coach';
        saveRequest(request);
        modal.remove();
        alert('Client approved. You can now build the program.');
        updateBadge();
      };
      document.getElementById('raf-reassess').onclick = () => {
        request.status = 'needs-reassessment';
        request.reviewedAt = new Date().toISOString();
        saveRequest(request);
        modal.remove();
        alert('Reassessment requested.');
        updateBadge();
      };
    }
  }

  function updateBadge() {
    const button = document.getElementById('raf-review-button');
    const request = getRequest();
    if (!button) return;
    const pending = request && request.status === 'pending-review';
    button.innerHTML = pending ? 'Review Queue <span style="background:#bdf26b;color:#091008;border-radius:99px;padding:2px 7px;margin-left:5px">1</span>' : 'Review Queue';
  }

  function init() {
    const s = session();
    if (!s || String(s.role).toLowerCase() !== 'coach') return;
    const topbar = document.querySelector('.topbar');
    if (!topbar || document.getElementById('raf-review-button')) return;
    const button = document.createElement('button');
    button.id = 'raf-review-button';
    button.type = 'button';
    button.style.cssText = 'margin-left:auto;margin-right:12px;background:#18221b;color:#dcebdc;border:1px solid #405342;border-radius:12px;padding:10px 13px;font-weight:700;cursor:pointer;';
    button.onclick = openReview;
    topbar.appendChild(button);
    updateBadge();
  }

  document.addEventListener('DOMContentLoaded', init);
  window.RAFCoachReview = { open: openReview, refresh: updateBadge };
})();
