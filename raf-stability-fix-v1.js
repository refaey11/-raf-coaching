/* RAF stability layer: one safe navigation handler and correct active state */
(function(){
  'use strict';
  const root=document;
  const getView=()=>{
    const active=root.querySelector('.nav-item.active');
    return active?.dataset?.view || 'dashboard';
  };
  function syncActive(view){
    root.querySelectorAll('.nav-item[data-view]').forEach(btn=>{
      const on=btn.dataset.view===view;
      btn.classList.toggle('active',on);
      btn.setAttribute('aria-current',on?'page':'false');
    });
  }
  function navigate(view){
    if(!view) return;
    syncActive(view);
    try{history.replaceState({view},'',location.pathname+'#'+view);}catch(e){}
    if(typeof window.render==='function') window.render(view);
    else if(typeof window.view==='function') window.view(view);
    requestAnimationFrame(()=>syncActive(view));
  }
  function bind(){
    root.querySelectorAll('.nav-item[data-view]').forEach(btn=>{
      if(btn.dataset.rafStableBound) return;
      btn.dataset.rafStableBound='1';
      btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();navigate(btn.dataset.view);},true);
    });
    const hash=location.hash.replace(/^#/,'');
    if(hash && root.querySelector('.nav-item[data-view="'+hash+'"]')) navigate(hash);
    else syncActive(getView());
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(bind,50)); else setTimeout(bind,50);
  window.addEventListener('hashchange',()=>{const v=location.hash.slice(1);if(v) navigate(v);});
  window.rafNavigate=navigate;
})();
