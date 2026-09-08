/* RAF Coaching — single stable navigation controller */
(function(){
  'use strict';
  const routes=new Set(['dashboard','clients','assessment','program','rules','workout','nutrition','progress','client-workspace']);
  const titles={dashboard:'Dashboard',clients:'Clients',assessment:'Assessment',program:'Program Builder',rules:'NASM Rules',workout:'Workout',nutrition:'Nutrition',progress:'Progress', 'client-workspace':'Client Workspace'};
  let current='';
  const session=()=>{try{return JSON.parse(localStorage.getItem('rafSession')||'{}')}catch{return{}}};
  const route=v=>routes.has(v)?v:'dashboard';
  function paint(v){
    document.querySelectorAll('.nav-item[data-view]').forEach(b=>{
      const on=b.dataset.view===v;
      b.classList.toggle('active',on);
      b.setAttribute('aria-current',on?'page':'false');
    });
    const title=document.querySelector('#page-title');
    if(title&&titles[v]) title.textContent=titles[v];
  }
  function render(v,write){
    v=route(v);
    if(write && location.hash.slice(1)!==v) history.replaceState({view:v},'',location.pathname+'#'+v);
    paint(v);
    if(current===v) return;
    current=v;
    if(typeof window.render==='function') window.render(v);
    requestAnimationFrame(()=>paint(v));
  }
  function onClick(e){
    const el=e.target.closest('.nav-item[data-view], [data-route]');
    if(!el) return;
    const v=el.dataset.view||el.dataset.route;
    if(!routes.has(v)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    render(v,true);
  }
  document.addEventListener('click',onClick,true);
  window.addEventListener('hashchange',()=>{current='';render(location.hash.slice(1),false)});
  window.addEventListener('popstate',()=>{current='';render(location.hash.slice(1),false)});
  function init(){
    const v=route(location.hash.slice(1)||'dashboard');
    current='';
    render(v,false);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
  window.rafNavigate=render;
})();
