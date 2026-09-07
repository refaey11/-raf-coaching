/* RAF Coaching — keep Review Queue out of the coach homepage. The review feature remains available from the client workspace. */
(function(){
  'use strict';
  function hide(){
    document.getElementById('raf-review-button')?.remove();
    document.querySelectorAll('#raf-review-button').forEach(function(el){el.remove()});
  }
  hide();
  document.addEventListener('DOMContentLoaded',hide);
  window.addEventListener('raf-auth-ready',hide);
  setInterval(hide,1000);
})();
