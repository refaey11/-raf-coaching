/* RAF Coaching — final navigation guard: one click, one route, no orientation changes */
(function(){
  'use strict';
  const allowed=new Set(['dashboard','clients','assessment','program','rules','workout','nutrition','progress','client-workspace','client-portal']);
  const title={dashboard:'Dashboard',clients:'Clients',assessment:'Assessment',program:'Program Builder',rules:'NASM Rules',workout:'Workout',nutrition:'Nutrition',progress:'Progress','client-workspace':'Client Workspace','client-portal':'Client Home'};
  function route(){let r=location.hash.slice(1);if(!allowed.has(r))r='dashboard';return r}
  function sync(){const r=route();document.querySelectorAll('.nav-item[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===r));const t=document.querySelector('#page-title');if(t)t.textContent=title[r]||'Dashboard'}
  document.addEventListener('click',function(e){const b=e.target.closest('[data-view]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();const r=b.dataset.view;if(!allowed.has(r))return;history.pushState({view:r},'',location.pathname+'#'+r);sync();if(typeof window.render==='function')window.render(r);sync()},true);
  window.addEventListener('popstate',function(){const r=route();sync();window.render?.(r);sync()});
  window.addEventListener('hashchange',function(){const r=route();sync();window.render?.(r);sync()});
  const boot=()=>{sync();window.render?.(route());sync()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
