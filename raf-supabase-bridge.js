/* RAF Coaching — Supabase authentication bridge v5 */
(function(){
  const U='https://zkymvovbpfrwjyfwylbq.supabase.co';
  const K='sb_publishable_9SgCU4D-48kgotUdi79gfQ_NaouEXbO';
  const COACH_EMAIL='refaey11@icloud.com';
  const redirect=()=>window.location.origin+window.location.pathname;
  let c;
  const ar=()=>localStorage.getItem('rafLanguage')==='ar';
  const t=(en,arabic)=>ar()?arabic:en;
  const removeOld=()=>['raf-auth-gate','raf-auth-overlay','raf-supa-auth'].forEach(id=>document.getElementById(id)?.remove());
  const clearLocal=()=>{try{localStorage.removeItem('rafSession')}catch(e){}};
  const ready=()=>window.dispatchEvent(new CustomEvent('raf-auth-ready'));
  const saveSession=async(u,fallbackName='')=>{
    const name=fallbackName||u.user_metadata?.full_name||u.email||'Client';
    const q=await c.from('profiles').select('full_name,role').eq('id',u.id).maybeSingle();
    const profile=q.error?null:q.data;
    const role=(String(u.email||'').toLowerCase()===COACH_EMAIL)?'coach':(profile?.role||u.user_metadata?.role||'client');
    if(!['client','coach'].includes(role))throw new Error('Unauthorized account.');
    localStorage.setItem('rafSession',JSON.stringify({id:u.id,userId:u.id,name:profile?.full_name||name,role,supabase:true}));
  };
  function addLogoutButton(){if(!c||!document.getElementById('app-content')||document.getElementById('raf-logout-btn'))return;const b=document.createElement('button');b.id='raf-logout-btn';b.type='button';b.textContent=t('Log out','تسجيل الخروج');b.className='nav-item raf-logout-button';b.style.cssText='display:block;width:100%;margin-top:10px;background:transparent;color:inherit;border:1px solid currentColor;border-radius:14px;padding:11px 16px;font-weight:700;font-size:14px;cursor:pointer;text-align:center';b.onclick=async()=>{b.disabled=true;try{await c.auth.signOut()}finally{clearLocal();location.reload()}};document.querySelector('.sidebar nav')?.appendChild(b)}
  function show(){removeOld();const o=document.createElement('div');o.id='raf-supa-auth';o.innerHTML=`<div style="position:fixed;inset:0;background:#080c09;z-index:999999;display:grid;place-items:center;padding:22px"><form id="raf-supa-form" style="width:min(460px,100%);background:#101712;border:1px solid #304238;border-radius:28px;padding:30px;color:#f5f7f5"><h2>RAF Coaching</h2><p>${t('Sign in to your private coaching space.','سجّل الدخول إلى مساحتك الخاصة.')}</p><input id="raf-email" type="email" required placeholder="${t('Email address','البريد الإلكتروني')}"><input id="raf-password" type="password" required minlength="6" placeholder="${t('Password','كلمة السر')}"><input id="raf-name" placeholder="${t('Full name (new account only)','الاسم الكامل (للحساب الجديد فقط)')}"><button type="button" data-mode="signin">${t('Sign in','تسجيل الدخول')}</button><button type="button" data-mode="signup">${t('Create client account','إنشاء حساب عميل')}</button><button type="button" id="raf-forgot">${t('Forgot password?','نسيت كلمة السر؟')}</button><div id="raf-auth-msg"></div></form></div>`;document.body.appendChild(o);o.querySelectorAll('button[data-mode]').forEach(b=>b.onclick=e=>{e.preventDefault();submitAuth(b.dataset.mode)});o.querySelector('#raf-forgot').onclick=resetPassword}
  async function resetPassword(){const m=document.getElementById('raf-auth-msg'),email=document.getElementById('raf-email').value.trim();if(!email){m.textContent=t('Enter your email first.','اكتب بريدك الإلكتروني أولًا.');return}const r=await c.auth.resetPasswordForEmail(email,{redirectTo:redirect()});m.textContent=r.error?t('Could not send the email.','تعذر إرسال الرسالة.'):t('Password reset email sent.','تم إرسال رسالة استعادة كلمة السر.')}
  async function submitAuth(mode){const m=document.getElementById('raf-auth-msg'),email=document.getElementById('raf-email').value.trim(),password=document.getElementById('raf-password').value,name=document.getElementById('raf-name').value.trim();m.textContent=t('Processing...','جارٍ تنفيذ الطلب...');try{if(mode==='signup'){await c.auth.signOut();clearLocal()}const r=mode==='signup'?await c.auth.signUp({email,password,options:{data:{full_name:name,role:'client'},emailRedirectTo:redirect()}}):await c.auth.signInWithPassword({email,password});if(r.error){m.textContent=r.error.message;return}const u=r.data.user;if(!u||!r.data.session){m.textContent=t('Account created. Check your confirmation email.','تم إنشاء الحساب. راجع رسالة تأكيد البريد.');return}await saveSession(u,name);location.reload()}catch(err){console.error(err);m.textContent=t('Could not complete the request.','تعذر تنفيذ العملية.')}}
  function boot(){if(!window.supabase)return;c=window.supabase.createClient(U,K);window.rafSupabase=c;c.auth.getSession().then(async r=>{if(r.data.session){try{await saveSession(r.data.session.user);removeOld();addLogoutButton();ready()}catch(err){await c.auth.signOut();clearLocal();show()}}else{clearLocal();show()}})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();