/* RAF Coaching — single authoritative navigation owner */
(function(){
 'use strict';
 const allowed=new Set(['dashboard','clients','assessment','program','rules','workout','nutrition','progress','client-workspace','client-portal']);
 const titles={dashboard:'Dashboard',clients:'Clients',assessment:'Assessment',program:'Program Builder',rules:'NASM Rules',workout:'Workout',nutrition:'Nutrition',progress:'Progress','client-workspace':'Client Workspace','client-portal':'Client Home'};
 let busy=false;
 function route(){const r=location.hash.slice(1);return allowed.has(r)?r:'dashboard'}
 function sync(r){document.querySelectorAll('.nav-item[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===r));const t=document.querySelector('#page-title');if(t)t.textContent=titles[r]||'Dashboard'}
 function render(r){r=allowed.has(r)?r:'dashboard';if(busy){sync(r);return}busy=true;try{sync(r);if(typeof window.render==='function')window.render(r);sync(r)}finally{setTimeout(()=>{busy=false;sync(route())},0)}}
 document.addEventListener('click',e=>{const b=e.target.closest('.nav-item[data-view]');if(!b||!allowed.has(b.dataset.view))return;e.preventDefault();e.stopImmediatePropagation();const r=b.dataset.view;if(route()!==r)history.pushState({view:r},'',location.pathname+'#'+r);render(r)},true);
 window.addEventListener('popstate',()=>render(route()));
 window.addEventListener('hashchange',()=>render(route()));
 window.rafNavigate=r=>render(r);
 const observer=new MutationObserver(()=>sync(route()));
 function boot(){sync(route());observer.observe(document.body,{childList:true,subtree:true});render(route())}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
