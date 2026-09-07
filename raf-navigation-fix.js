/* RAF Coaching — safe navigation and coach UI cleanup */
(function(){
  'use strict';
  const role=()=>{try{return JSON.parse(localStorage.getItem('rafSession')||'{}').role||''}catch{return''}};
  function goHome(){
    const target=role()==='client'?'client-portal':'dashboard';
    location.hash=target;
    if(typeof window.render==='function') window.render(target);
    else window.dispatchEvent(new Event('hashchange'));
  }
  function cleanup(){
    // Assessment belongs to the individual client portal/file, not the coach home navigation.
    document.querySelectorAll('[data-view="assessment"]').forEach(el=>el.remove());
    // Review Queue must not be displayed on the coach dashboard.
    document.querySelectorAll('#raf-review-button,[id*="review-queue"],button').forEach(el=>{
      const text=(el.textContent||'').trim().toLowerCase();
      if(text==='review queue'||text.includes('review queue')) el.remove();
    });
  }
  document.addEventListener('click',function(e){
    const b=e.target.closest('button,a'); if(!b)return;
    const text=(b.textContent||'').trim().toLowerCase();
    const isHome=b.dataset.view==='dashboard'||text==='home'||text==='back to home'||text.includes('back to client home');
    if(isHome){e.preventDefault();e.stopImmediatePropagation();goHome();}
  },true);
  new MutationObserver(cleanup).observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',cleanup);
  window.addEventListener('raf-auth-ready',cleanup);
  setTimeout(cleanup,300);
  setInterval(cleanup,1000);
})();
