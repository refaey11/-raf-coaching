/* RAF navigation: single delegated handler, no competing renders */
(function(){
  'use strict';
  const valid=new Set(['dashboard','clients','assessment','program','rules','workout','nutrition','progress','client-workspace']);
  const labels={dashboard:'Dashboard',clients:'Clients',assessment:'Assessment',program:'Program Builder',rules:'NASM Rules',workout:'Workout',nutrition:'Nutrition',progress:'Progress'};
  let last='';
  function normalize(v){return valid.has(v)?v:'dashboard';}
  function sync(v){
    document.querySelectorAll('.nav-item[data-view]').forEach(b=>{
      const active=b.dataset.view===v;
      b.classList.toggle('active',active);
      b.setAttribute('aria-current',active?'page':'false');
    });
    const t=document.querySelector('#page-title');
    if(t && labels[v]) t.textContent=labels[v];
  }
  function go(raw,write){
    const v=normalize(raw);
    sync(v);
    if(write && location.hash.slice(1)!==v) history.replaceState({view:v},'',location.pathname+'#'+v);
    const root=document.querySelector('#app-content');
    if(root){root.classList.remove('raf-route-in');void root.offsetWidth;root.classList.add('raf-route-in');}
    if(last===v) return;
    last=v;
    if(typeof window.render==='function') window.render(v);
    requestAnimationFrame(()=>sync(v));
  }
  function click(e){
    const b=e.target.closest('.nav-item[data-view]');
    if(!b)return;
    e.preventDefault();e.stopImmediatePropagation();
    go(b.dataset.view,true);
  }
  document.addEventListener('click',click,true);
  window.addEventListener('popstate',()=>{last='';go(location.hash.slice(1),false);});
  window.addEventListener('hashchange',()=>{last='';go(location.hash.slice(1),false);});
  function init(){setTimeout(()=>{last='';go(location.hash.slice(1)||'dashboard',false);},100);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.rafNavigate=go;
})();
