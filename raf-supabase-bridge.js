/* RAF Coaching — Supabase authentication bridge */
(function(){
  const U='https://zkymvovbpfrwjyfwylbq.supabase.co';
  const K='sb_publishable_9SgCU4D-48kgotUdi79gfQ_NaouEXbO';
  const redirect=()=>window.location.origin+window.location.pathname;
  let c;

  const removeOld=()=>['raf-auth-gate','raf-auth-overlay','raf-supa-auth'].forEach(id=>document.getElementById(id)?.remove());
  const clearLocal=()=>{ try{localStorage.removeItem('rafSession');}catch(e){} };
  const ready=()=>window.dispatchEvent(new CustomEvent('raf-auth-ready'));

  const saveSession=async(u,fallbackName='')=>{
    const name=fallbackName||u.user_metadata?.full_name||u.email||'Client';
    const q=await c.from('profiles').select('full_name,role').eq('id',u.id).maybeSingle();
    if(q.error) throw q.error;
    const profile=q.data||{full_name:name,role:'client'};
    const role=profile.role||'client';
    if(!['client','coach'].includes(role)) throw new Error('الحساب غير مصرح له بالدخول.');
    localStorage.setItem('rafSession',JSON.stringify({id:u.id,userId:u.id,name:profile.full_name||name,role,supabase:true}));
  };

  function addLogoutButton(){
    if(document.getElementById('raf-logout-btn')) return;
    const b=document.createElement('button');
    b.id='raf-logout-btn';
    b.type='button';
    b.textContent='تسجيل الخروج';
    b.className='nav-item raf-logout-button';
    b.style.cssText='display:block;width:100%;margin-top:10px;background:transparent;color:inherit;border:1px solid currentColor;border-radius:14px;padding:11px 16px;font-weight:700;font-size:14px;cursor:pointer;text-align:center';
    b.onclick=async()=>{
      b.disabled=true; b.textContent='جارٍ تسجيل الخروج...';
      await c.auth.signOut();
      clearLocal();
      location.reload();
    };
    const home=[...document.querySelectorAll('button,a')].find(x=>/home/i.test(x.textContent||''));
    if(home?.parentElement){
      const wrap=document.createElement('div');
      wrap.className='raf-home-actions';
      wrap.style.cssText='display:flex;flex-direction:column;align-items:stretch;gap:10px';
      home.parentElement.insertBefore(wrap,home);
      wrap.appendChild(home);
      wrap.appendChild(b);
    }else{
      const nav=document.querySelector('nav')||document.querySelector('.topbar');
      (nav||document.body).appendChild(b);
    }
  }

  function show(){
    removeOld();
    document.getElementById('raf-logout-btn')?.remove();
    const o=document.createElement('div'); o.id='raf-supa-auth';
    o.innerHTML='<div style="position:fixed;inset:0;background:#080c09;z-index:999999;display:grid;place-items:center;padding:22px"><form id="raf-supa-form" style="width:min(460px,100%);background:#101712;border:1px solid #304238;border-radius:28px;padding:30px;color:#f5f7f5"><h2>RAF Coaching</h2><p>سجّل الدخول إلى مساحتك الخاصة.</p><input id="raf-email" type="email" required placeholder="البريد الإلكتروني"><input id="raf-password" type="password" required minlength="6" placeholder="كلمة السر"><input id="raf-name" placeholder="الاسم الكامل (للحساب الجديد فقط)"><button type="button" data-mode="signin">تسجيل الدخول</button><button type="button" data-mode="signup">إنشاء حساب عميل</button><button type="button" id="raf-forgot" style="background:none;color:#c1ff63;border:0;text-decoration:underline">نسيت كلمة السر؟</button><div id="raf-auth-msg"></div></form></div>';
    document.body.appendChild(o);
    o.querySelectorAll('button[data-mode]').forEach(b=>b.onclick=e=>{e.preventDefault();submitAuth(b.dataset.mode)});
    o.querySelector('#raf-forgot').onclick=resetPassword;
  }

  async function resetPassword(){
    const m=document.getElementById('raf-auth-msg'),email=document.getElementById('raf-email').value.trim();
    if(!email){m.textContent='اكتب بريدك الإلكتروني أولًا، ثم اضغط «نسيت كلمة السر؟».';return}
    m.textContent='جارٍ إرسال رسالة استعادة كلمة السر...';
    const r=await c.auth.resetPasswordForEmail(email,{redirectTo:redirect()});
    m.textContent=r.error?'تعذر إرسال الرسالة. تأكد من البريد وحاول مرة أخرى.':'تم إرسال رسالة استعادة كلمة السر إلى بريدك الإلكتروني ✓';
  }

  async function submitAuth(mode){
    const m=document.getElementById('raf-auth-msg'),email=document.getElementById('raf-email').value.trim(),password=document.getElementById('raf-password').value,name=document.getElementById('raf-name').value.trim();
    m.textContent='جارٍ تنفيذ الطلب...';
    if(mode==='signup'){
      await c.auth.signOut();
      clearLocal();
    }
    const r=mode==='signup'?await c.auth.signUp({email,password,options:{data:{full_name:name,role:'client'},emailRedirectTo:redirect()}}):await c.auth.signInWithPassword({email,password});
    if(r.error){
      const msg=r.error.message||'';
      m.textContent=msg.includes('already registered')?'البريد الإلكتروني ده مستخدم بالفعل. جرّب تسجيل الدخول.':msg.includes('Invalid login credentials')?'البريد الإلكتروني أو كلمة السر غير صحيحين.':'حصل خطأ أثناء العملية. حاول مرة أخرى.';
      return;
    }
    const u=r.data.user;
    if(!u){
      m.textContent='تم إنشاء الحساب، وتم إرسال رسالة تأكيد إلى بريدك الإلكتروني. افتح الرسالة واضغط رابط التأكيد، ثم ارجع للموقع وسجّل الدخول.';
      m.style.color='#c1ff63';
      return;
    }
    try{
      await saveSession(u,name);
      m.textContent=mode==='signup'?'تم إنشاء الحساب وتسجيل الدخول بنجاح ✓':'تم تسجيل الدخول بنجاح ✓';
      m.style.color='#c1ff63';
      setTimeout(()=>location.reload(),700);
    }catch(err){
      console.error(err);
      m.textContent='تم تسجيل الدخول، لكن تعذر تحميل بيانات الحساب. جرّب تحديث الصفحة، ولو استمرت المشكلة تواصل مع المدرب.';
    }
  }

  async function boot(){
    if(!window.supabase)return;
    c=window.supabase.createClient(U,K); window.rafSupabase=c;
    const r=await c.auth.getSession();
    if(r.data.session){
      try{await saveSession(r.data.session.user);removeOld();addLogoutButton();ready();}
      catch(err){console.error(err);await c.auth.signOut();clearLocal();show();}
    }else{clearLocal();show();}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
