(()=>{'use strict';
const COACH='refaey11@icloud.com';
const COACH_VIEWS=new Set(['clients','assessment','program','rules']);
const norm=e=>String(e||'').trim().toLowerCase();
function supa(){return window.supabaseClient||((window.supabase&&typeof window.supabase.auth?.getUser==='function')?window.supabase:null)}
async function authUser(){const s=supa();if(!s)return null;try{const r=await s.auth.getUser();return r?.data?.user||null}catch(e){return null}}
function localUser(){try{return JSON.parse(localStorage.getItem('rafProfile')||localStorage.getItem('rafActiveClient')||'null')}catch(e){return null}}
async function resolve(){const u=await authUser();const l=localUser();const email=norm(u?.email||l?.email);const authenticated=!!u;const isCoach=email===COACH;window.RAF_AUTH_ROLE={authenticated,email,role:isCoach?'coach':'client',isCoach};return window.RAF_AUTH_ROLE}
function hideCoachNav(isCoach){document.querySelectorAll('.nav-item[data-view]').forEach(b=>{const v=b.dataset.view;b.style.display=(!isCoach&&COACH_VIEWS.has(v))?'none':''})}
function blockCoachClicks(isCoach){document.addEventListener('click',e=>{const b=e.target.closest?.('[data-view]');if(!b||isCoach)return;const v=b.dataset.view;if(COACH_VIEWS.has(v)){e.preventDefault();e.stopImmediatePropagation();location.hash='dashboard';window.render?.('dashboard')}},true)}
async function enforce(){const r=await resolve();hideCoachNav(r.isCoach);blockCoachClicks(r.isCoach);if(!r.isCoach&&COACH_VIEWS.has(location.hash.slice(1))){history.replaceState(null,'','#dashboard');window.render?.('dashboard')}return r}
window.RAF_AUTH={resolve,enforce,coachEmail:COACH};
setTimeout(enforce,0);setTimeout(enforce,500);setTimeout(enforce,1500);
window.addEventListener('hashchange',()=>enforce());
const s=supa();if(s?.auth?.onAuthStateChange)s.auth.onAuthStateChange(()=>setTimeout(enforce,0));
})();