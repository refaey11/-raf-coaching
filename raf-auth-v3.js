(()=>{'use strict';
const COACH='refaey11@icloud.com';
const $=s=>document.querySelector(s);
const norm=e=>String(e||'').trim().toLowerCase();
function sb(){return window.supabaseClient||((window.supabase&&window.supabase.auth)?window.supabase:null)}
function clearLocal(){['rafProfile','rafActiveClient','rafActiveClientId'].forEach(k=>localStorage.removeItem(k));}
function showGate(){let g=$('#raf-supa-auth');if(g)return g.style.display='flex';g=document.createElement('div');g.id='raf-supa-auth';g.innerHTML='<div><form id="raf-supa-form"><h2>RAF Coaching</h2><p id="raf-auth-sub">Sign in to continue</p><input id="raf-auth-email" type="email" autocomplete="email" placeholder="Email" required><input id="raf-auth-password" type="password" autocomplete="current-password" placeholder="Password" required><button type="submit" data-mode="signin">Sign In</button><button type="button" id="raf-forgot">Forgot password?</button><div id="raf-auth-msg" role="status"></div></form></div>';document.body.appendChild(g);$('#raf-supa-form').addEventListener('submit',signin);$('#raf-forgot').addEventListener('click',forgot)}
function hideGate(){const g=$('#raf-supa-auth');if(g)g.style.display='none'}
async function signin(e){e.preventDefault();const s=sb(),msg=$('#raf-auth-msg');if(!s){msg.textContent='Authentication is not configured yet.';return}msg.textContent='Signing in…';const email=norm($('#raf-auth-email').value),password=$('#raf-auth-password').value;if(!email||!password)return;const r=await s.auth.signInWithPassword({email,password});if(r.error){msg.textContent=r.error.message;return}await refresh(r.data.user)}
async function forgot(){const s=sb(),email=norm($('#raf-auth-email').value),msg=$('#raf-auth-msg');if(!s||!email){msg.textContent='Enter your email first.';return}const r=await s.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname});msg.textContent=r.error?r.error.message:'Password reset email sent.'}
async function refresh(user){if(!user){clearLocal();showGate();return null}const email=norm(user.email),role=email===COACH?'coach':'client';window.RAF_AUTH_ROLE={authenticated:true,email,role,isCoach:role==='coach',userId:user.id};hideGate();document.body.dataset.rafRole=role;document.dispatchEvent(new CustomEvent('raf-auth-ready',{detail:window.RAF_AUTH_ROLE}));return window.RAF_AUTH_ROLE}
async function boot(){const s=sb();if(!s){showGate();return}const r=await s.auth.getSession();await refresh(r.data?.session?.user||null);s.auth.onAuthStateChange((_e,session)=>refresh(session?.user||null));}
window.RAF_AUTH_V3={boot,refresh,logout:async()=>{const s=sb();if(s)await s.auth.signOut();clearLocal();showGate()}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();