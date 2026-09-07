/* RAF Coaching — legacy local auth disabled; remove any stale gate injected by older bundles. */
(function(){
  'use strict';
  function removeLegacyGate(){
    ['raf-auth-gate','raf-auth-overlay','auth-gate','auth-overlay'].forEach(id=>document.getElementById(id)?.remove());
    document.querySelectorAll('[data-legacy-auth],[data-auth-gate]').forEach(el=>el.remove());
  }
  function start(){
    removeLegacyGate();
    const observer=new MutationObserver(removeLegacyGate);
    observer.observe(document.documentElement,{childList:true,subtree:true});
    setTimeout(()=>observer.disconnect(),15000);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
