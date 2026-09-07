/* RAF Coaching — Supabase authentication bridge v3 */
(function(){
  const U='https://zkymvovbpfrwjyfwylbq.supabase.co';
  const K='sb_publishable_9SgCU4D-48kgotUdi79gfQ_NaouEXbO';
  const redirect=()=>window.location.origin+window.location.pathname;
  let c;
  const removeOld=()=>['raf-auth-gate','raf-auth-overlay','raf-supa-auth'].forEach(id=>document.getElementById(id)?.remove());
  const clearLocal=()=>{try{localStorage.removeItem('rafSession')}catch(e){}};
  const ready=()=>window.dispatchEvent(new CustomEvent('raf-auth-ready'));
  const saveSession=async(u,fallbackName='')=>{
    const name=fallbackName||u.user_metadata?.full_name||u.email||'Client';
    const q=await c.from('profiles').select('full_name,role').eq('id',u.id).maybeSingle();
    const profile=q.error?null:q.data;
    const role=profile?.role||u.user_metadata?.role||'client';
    if(!['client','coach'].includes(role))throw new Error('Unauthorized account.');
    localStorage.setItem('rafSession',JSON.stringify({id:u.id,userId:u.id,name:profile?.full_name||name,role,supabase:true}));
  };
  function addLogoutButton(){
    if(!c||!document.getElementById('app-content'))return;
    const existing=document.getElementById('raf-logout-btn'); if(existing)return;
    const b=document.createElement('button'); b.id='raf-logout-btn'; b.type='button'; b.textContent=localStorage.getItem('rafLanguage')==='ar'?'تسجيل الخروج':'Log out'; b.className='nav-item raf-logout-button';
    b.style.cssText='display:block;width:100%;margin-top:10px;background:transparent;color:inherit;border:1px solid currentColor;border-radius:14px;padding:11px 16px;font-weight:700;font-size:14px;cursor:pointer;text-align:center';
    b.onclick=async()=>{b.disabled=true;b.textContent=localStorage.getItem('rafLanguage')==='ar'?'جارٍ تسجيل الخروج...':'Signing out...';await c.auth.signOut();clearLocal();location.reload()};
    const home=[...document.querySelectorAll('button,a')].find(x=>/^(home|الرئيسية)\s*[⌂⌂⌂]?$/i.test((x.textContent||'').trim())||/\bhome\b|الرئيسية/i.test(x.textContent||''));
    if(home?.parentElement){const w=document.createElement('div');w.className='raf-home-actions';w.style.cssText='display:flex;flex-direction:column;align-items:stretch;gap:10px';home.parentElement.insertBefore(w,home);w.appendChild(home);w.appendChild(b)}
    else {const target=document.querySelector('.topbar')||document.querySelector('.main')||document.body;target.appendChild(b)}
  }
  function show(){
    removeOld();document.getElementById('raf-logout-btn')?.remove();const o=document.createElement('div');o.id='raf-supa-auth';
    o.innerHTML='<div style="position:fixed;inset:0;background:#080c09;z-index:999999;display:grid;place-items:center;padding:22px"><form id="raf-supa-form" style="width:min(460px,100%);background:#101712;border:1px solid #304238;border-radius:28px;padding:30px;color:#f5f7f5"><h2>RAF Coaching</h2><p>سجّل الدخول إلى مساحتك الخاصة.</p><input id="raf-email" type="email" required placeholder="البريد الإلكتروني"><input id="raf-password" type="password" required minlength="6" placeholder="كلمة السر"><input id="raf-name" placeholder="الاسم الكامل (للحساب الجديد فقط)"><button type="button" data-mode="signin">تسجيل الدخول</button><button type="button" data-mode="signup">إنشاء حساب عميل</button><button type="button" id="raf-forgot" style="background:none;color:#c1ff63;border:0;text-decoration:underline">نسيت كلمة السر؟</button><div id="raf-auth-msg"></div></form></div>';
    document.body.appendChild(o);o.querySelectorAll('button[data-mode]').forEach(b=>b.onclick=e=>{e.preventDefault();submitAuth(b.dataset.mode)});o.querySelector('#raf-forgot').onclick=resetPassword;
  }
  async function resetPassword(){const m=document.getElementById('raf-auth-msg'),email=document.getElementById('raf-email').value.trim();if(!email){m.textContent='اكتب بريدك الإلكتروني أولًا.';return}m.textContent='جارٍ إرسال رسالة استعادة كلمة السر...';const r=await c.auth.resetPasswordForEmail(email,{redirectTo:redirect()});m.textContent=r.error?'تعذر إرسال الرسالة. حاول مرة أخرى.':'تم إرسال رسالة استعادة كلمة السر إلى بريدك الإلكتروني ✓'}
  async function submitAuth(mode){
    const m=document.getElementById('raf-auth-msg'),email=document.getElementById('raf-email').value.trim(),password=document.getElementById('raf-password').value,name=document.getElementById('raf-name').value.trim();m.style.color='';m.textContent='جارٍ تنفيذ الطلب...';
    const buttons=[...document.querySelectorAll('#raf-supa-form button[data-mode]')];buttons.forEach(x=>x.disabled=true);
    try{
      if(mode==='signup'){await c.auth.signOut();clearLocal()}
      const r=mode==='signup'?await c.auth.signUp({email,password,options:{data:{full_name:name,role:'client'},emailRedirectTo:redirect()}}):await c.auth.signInWithPassword({email,password});
      if(r.error){const msg=r.error.message||'';m.textContent=msg.includes('already registered')?'البريد الإلكتروني ده مستخدم بالفعل. جرّب تسجيل الدخول.':msg.includes('Invalid login credentials')?'البريد الإلكتروني أو كلمة السر غير صحيحين.':'تعذر تنفيذ العملية. تأكد من البيانات وحاول مرة أخرى.';return}
      const u=r.data.user;if(!u||!r.data.session){m.textContent='تم إنشاء الحساب ✓ وتم إرسال رسالة تأكيد إلى بريدك الإلكتروني. افتح الرسالة واضغط «تأكيد البريد الإلكتروني»، ثم ارجع هنا وسجّل الدخول.';m.style.color='#c1ff63';return}
      await saveSession(u,name);m.textContent='تم تسجيل الدخول بنجاح ✓';m.style.color='#c1ff63';setTimeout(()=>location.reload(),500);
    }catch(err){console.error('RAF auth error',err);m.textContent='تم التحقق من الحساب، لكن تعذر تحميل البيانات. حدّث الصفحة وحاول تسجيل الدخول مرة أخرى.'}
    finally{buttons.forEach(x=>x.disabled=false)}
  }
  function boot(){if(!window.supabase)return;c=window.supabase.createClient(U,K);window.rafSupabase=c;const rdy=()=>{addLogoutButton();ready()};const observer=new MutationObserver(()=>{addLogoutButton()});observer.observe(document.body,{childList:true,subtree:true});c.auth.getSession().then(async r=>{if(r.data.session){try{await saveSession(r.data.session.user);removeOld();rdy()}catch(err){console.error(err);await c.auth.signOut();clearLocal();show()}}else{clearLocal();show()}})}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
