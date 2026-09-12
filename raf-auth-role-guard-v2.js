(()=>{'use strict';
const COACH='refaey11@icloud.com';
const COACH_VIEWS=new Set(['clients','assessment','program','rules']);
const norm=e=>String(e||'').trim().toLowerCase();
function supa(){return window.supabaseClient||((window.supabase&&typeof window.supabase.auth?.getUser==='function')?window.supabase:null)}
async function authUser(){const s=supa();if(!s)return null;try{return (await s.auth.getUser())?.data?.user||null}catch(e){return null}}
async function resolve(){const u=await authUser();const email=norm(u?.email);const authenticated=!!u;const isCoach=email===COACH;window.RAF_AUTH_ROLE={authenticated,email,role:isCoach?'coach':'client',isCoach,userId:u?.id||null};return window.RAF_AUTH_ROLE}
function hideCoachNav(isCoach){document.querySelectorAll('.nav-item[data-view]').forEach(b=>{b.style.display=(!isCoach&&COACH_VIEWS.has(b.dataset.view))?'none':''})}
let clickGuardInstalled=false;
function blockCoachClicks(isCoach){if(clickGuardInstalled)return;clickGuardInstalled=true;document.addEventListener('click',e=>{const b=e.target.closest?.('[data-view]');if(!b)return;const v=b.dataset.view;if(!window.RAF_AUTH_ROLE?.isCoach&&COACH_VIEWS.has(v)){e.preventDefault();e.stopImmediatePropagation();location.hash='dashboard';window.render?.('dashboard')}},true)}
async function enforce(){const r=await resolve();hideCoachNav(r.isCoach);blockCoachClicks(r.isCoach);if(!r.authenticated)return r;if(!r.isCoach&&COACH_VIEWS.has(location.hash.slice(1))){history.replaceState(null,'','#dashboard');window.render?.('dashboard')}return r}
window.RAF_AUTH={resolve,enforce,coachEmail:COACH};
window.addEventListener('raf-auth-ready',()=>enforce());
window.addEventListener('hashchange',()=>enforce());
setTimeout(enforce,250);
})();