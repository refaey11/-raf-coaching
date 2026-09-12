(()=>{'use strict';
const COACH='refaey11@icloud.com';
const COACH_VIEWS=new Set(['clients','assessment','program','rules']);
const norm=e=>String(e||'').trim().toLowerCase();
function role(){const r=window.RAF_AUTH_ROLE;if(r&&r.authenticated)return r;return {authenticated:false,email:'',role:'client',isCoach:false}}
function hideCoachNav(isCoach){document.querySelectorAll('.nav-item[data-view]').forEach(b=>{b.style.display=(!isCoach&&COACH_VIEWS.has(b.dataset.view))?'none':''})}
let clickGuardInstalled=false;
function blockCoachClicks(){if(clickGuardInstalled)return;clickGuardInstalled=true;document.addEventListener('click',e=>{const b=e.target.closest?.('[data-view]');if(!b)return;const r=role();if(!r.authenticated)return;const v=b.dataset.view;if(!r.isCoach&&COACH_VIEWS.has(v)){e.preventDefault();e.stopImmediatePropagation();location.hash='dashboard';window.render?.('dashboard')}},true)}
function enforce(){const r=role();hideCoachNav(r.isCoach);blockCoachClicks();if(!r.authenticated)return r;if(!r.isCoach&&COACH_VIEWS.has(location.hash.slice(1))){history.replaceState(null,'','#dashboard');window.render?.('dashboard')}return r}
window.RAF_AUTH={resolve:async()=>role(),enforce,coachEmail:COACH};
window.addEventListener('raf-auth-ready',enforce);
window.addEventListener('hashchange',enforce);
enforce();
})();