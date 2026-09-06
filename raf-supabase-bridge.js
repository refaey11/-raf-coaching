/* RAF Coaching — Supabase authentication bridge */
(function(){
  const U='https://zkymvovbpfrwjyfwylbq.supabase.co';
  const K='sb_publishable_9SgCU4D-48kgotUdi79gfQ_NaouEXbO';
  let c;
  const removeOld=()=>['raf-auth-gate','raf-auth-overlay','raf-supa-auth'].forEach(id=>document.getElementById(id)?.remove());
  const saveSession=async(u,fallbackName='')=>{
    const name=fallbackName||u.user_metadata?.full_name||u.email||'Client';
    const q=await c.from('profiles').select('full_name,role').eq('id',u.id).maybeSingle();
    if(q.error) throw q.error;
    let profile=q.data;
    if(!profile){
      const ins=await c.from('profiles').insert({id:u.id,full_name:name,role:'client'}).select('full_name,role').single();
      if(ins.error) throw ins.error;
      profile=ins.data;
    }
    const role=profile.role||'client';
    if(!['client','coach'].includes(role)) throw new Error('Account is not authorized.');
    localStorage.setItem('rafSession',JSON.stringify({id:u.id,userId:u.id,name:profile.full_name||name,role,supabase:true}));
  };
  function show(){
    removeOld();const o=document.createElement('div');o.id='raf-supa-auth';
    o.innerHTML='<div style="position:fixed;inset:0;background:#080c09;z-index:999999;display:grid;place-items:center;padding:22px"><form id="raf-supa-form" style="width:min(460px,100%);background:#101712;border:1px solid #304238;border-radius:28px;padding:30px;color:#f5f7f5"><h2>RAF Coaching</h2><p>Your account must be approved before accessing the platform.</p><input id="raf-email" type="email" required placeholder="Email"><input id="raf-password" type="password" required minlength="6" placeholder="Password"><input id="raf-name" placeholder="Full name (new client only)"><button data-mode="signin">Sign in</button><button data-mode="signup">Create client account</button><div id="raf-auth-msg"></div></form></div>';
    document.body.appendChild(o);o.querySelectorAll('button').forEach(b=>b.onclick=e=>{e.preventDefault();submitAuth(b.dataset.mode)});
  }
  async function submitAuth(mode){
    const m=document.getElementById('raf-auth-msg'),email=document.getElementById('raf-email').value.trim(),password=document.getElementById('raf-password').value,name=document.getElementById('raf-name').value.trim();m.textContent='Working...';
    const r=mode==='signup'?await c.auth.signUp({email,password,options:{data:{full_name:name,role:'client'}}}):await c.auth.signInWithPassword({email,password});
    if(r.error){m.textContent=r.error.message;return}const u=r.data.user;if(!u){m.textContent='Check your email to confirm the account.';return}
    try{await saveSession(u,name);location.reload()}catch(err){console.error(err);m.textContent=err.message||'Could not load your account.';}
  }
  async function boot(){if(!window.supabase)return;c=window.supabase.createClient(U,K);window.rafSupabase=c;const r=await c.auth.getSession();if(r.data.session){try{await saveSession(r.data.session.user);removeOld()}catch(err){console.error(err);await c.auth.signOut();show()}}else show()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
