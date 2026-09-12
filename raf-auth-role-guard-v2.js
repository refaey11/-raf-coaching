(()=>{'use strict';
const COACH='refaey11@icloud.com';const COACH_VIEWS=new Set(['clients','assessment','program','rules']);
function role(){return window.RAF_AUTH_ROLE||{authenticated:false,isCoach:false,role:'client'}}
function hideCoachNav(){const r=role();document.querySelectorAll('.nav-item[data-view]').forEach(b=>{b.style.display=(!r.isCoach&&COACH_VIEWS.has(b.dataset.view))?'none':''})}
let installed=false;
function blockClicks(){if(installed)return;installed=true;document.addEventListener('click',e=>{const r=role(),b=e.target.closest?.('[data-view]');if(!b||r.isCoach)return;if(COACH_VIEWS.has(b.dataset.view)){e.preventDefault();e.stopImmediatePropagation();location.hash='dashboard';window.render?.('dashboard')}},true)}
function enforce(){const r=role();hideCoachNav();blockClicks();if(r.authenticated&&!r.isCoach&&COACH_VIEWS.has(location.hash.slice(1))){history.replaceState(null,'','#dashboard');window.render?.('dashboard')}return r}
window.RAF_AUTH={...(window.RAF_AUTH||{}),enforce};document.addEventListener('raf-auth-ready',enforce);window.addEventListener('hashchange',enforce);setTimeout(enforce,0);
})();