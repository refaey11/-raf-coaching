/* RAF Coaching — single navigation owner */
(function(){
  'use strict';
  const valid=new Set(['dashboard','clients','assessment','program','rules','workout','nutrition','progress','client-workspace','client-portal']);
  const labels={dashboard:'Dashboard',clients:'Clients',assessment:'Assessment',program:'Program Builder',rules:'NASM Rules',workout:'Workout',nutrition:'Nutrition',progress:'Progress','client-workspace':'Client Workspace','client-portal':'Client Home'};
  let rendering=false;
  function session(){try{return JSON.parse(localStorage.getItem('rafSession')||'{}')}catch{return {}}}
  function normalize(value){
    const v=valid.has(value)?value:'dashboard';
    return session().role==='client'&&v==='dashboard'?'client-portal':v;
  }
  function go(value,write){
    const v=normalize(value);
    if(rendering)return;
    rendering=true;
    try{
      if(write&&location.hash.slice(1)!==v)history.pushState({view:v},'',location.pathname+'#'+v);
      document.querySelectorAll('.nav-item[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
      const root=document.querySelector('#app-content');
      if(root){root.classList.remove('raf-route-in');void root.offsetWidth;root.classList.add('raf-route-in');}
      if(typeof window.render==='function')window.render(v);
      const t=document.querySelector('#page-title');if(t)t.textContent=labels[v]||'Dashboard';
      document.querySelectorAll('.nav-item[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
    }finally{setTimeout(()=>rendering=false,80)}
  }
  document.addEventListener('click',function(e){
    const b=e.target.closest('[data-view]');if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();go(b.dataset.view,true);
  },true);
  window.addEventListener('popstate',()=>go(location.hash.slice(1),false));
  window.addEventListener('hashchange',()=>go(location.hash.slice(1),false));
  window.rafNavigate=go;
  function boot(){go(location.hash.slice(1)||'dashboard',false)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
