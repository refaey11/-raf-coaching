/* RAF Coaching — coach sees client files, not the client assessment screen */
(function(){'use strict';
  function session(){try{return JSON.parse(localStorage.getItem('rafSession')||'null')||{}}catch{return {}}}
  function isCoach(){return session().role==='coach'}
  function clean(){
    if(!isCoach())return;
    document.querySelectorAll('[data-view="assessment"]').forEach(el=>el.remove());
    document.querySelectorAll('#raf-review-button').forEach(el=>el.remove());
    document.querySelectorAll('[data-view="client-assessment"],a[href*="client-assessment"]').forEach(el=>el.remove());
    const hash=location.hash.replace('#','');
    if(hash==='assessment'||hash==='client-assessment'){
      location.hash='clients';
      document.querySelector('[data-view="clients"]')?.click();
    }
  }
  function start(){clean();setTimeout(clean,300);setTimeout(clean,1000)}
  document.addEventListener('DOMContentLoaded',start);
  window.addEventListener('raf-auth-ready',start);
  window.addEventListener('hashchange',clean);
  const old=window.render;
  if(typeof old==='function')window.render=function(){const r=old.apply(this,arguments);setTimeout(clean,20);return r};
  new MutationObserver(clean).observe(document.body,{childList:true,subtree:true});
})();
