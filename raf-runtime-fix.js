/* RAF Coaching runtime stability and navigation fix */
(function () {
  'use strict';
  var busy = false;
  function currentView() {
    return (window.location.hash || '#dashboard').slice(1) || 'dashboard';
  }
  function safeRender() {
    if (busy || typeof window.render !== 'function') return;
    busy = true;
    try { window.render(currentView()); } catch (error) {
      console.error('RAF render error:', error);
      var content = document.querySelector('#app-content');
      if (content) content.innerHTML = '<div class="card"><h2>حدث خطأ في تحميل الصفحة</h2><p class="muted">اعمل Refresh مرة واحدة، ولو استمرت المشكلة افتح الصفحة من جديد.</p><button class="primary" type="button" onclick="location.hash=\'#dashboard\';location.reload()">الرجوع للوحة التحكم</button></div>';
    }
    window.setTimeout(function () { busy = false; }, 0);
  }
  window.addEventListener('hashchange', safeRender);
  window.addEventListener('pageshow', function () { window.setTimeout(safeRender, 0); });
  window.addEventListener('error', function (event) { console.error('RAF runtime error:', event.error || event.message); });
  window.addEventListener('unhandledrejection', function (event) { console.error('RAF promise error:', event.reason); });
})();
