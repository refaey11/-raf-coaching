/* RAF Coaching — cleanup only; navigation is owned by raf-navigation-stable-v2.js */
(function(){
  'use strict';
  function cleanup(){
    document.querySelectorAll('#raf-review-button,[id*="review-queue"]').forEach(el=>el.remove());
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',cleanup,{once:true});
  else cleanup();
})();
