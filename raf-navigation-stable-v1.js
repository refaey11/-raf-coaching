/* RAF Coaching — safe navigation sync */
(function(){
  'use strict';
  const titles={dashboard:'Dashboard',clients:'Clients',assessment:'Assessment',program:'Program Builder',rules:'NASM Rules',workout:'Workout',nutrition:'Nutrition',progress:'Progress','client-portal':'Client Home','client-workspace':'Client Workspace'};
  function sync(){
    const route=location.hash.slice(1)||'dashboard';
    document.querySelectorAll('.nav-item[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===route));
    const title=document.querySelector('#page-title');
    if(title&&titles[route]) title.textContent=titles[route];
  }
  document.addEventListener('DOMContentLoaded',sync,{once:true});
  window.addEventListener('hashchange',sync);
  window.addEventListener('popstate',sync);
  window.rafNavigationSync=sync;
})();
