(function(){
  const SUPABASE_URL='https://zkymvovbpfrwjyfwylbq.supabase.co';
  const SUPABASE_KEY='sb_publishable_9SgCU4D-48kgotUdi79gfQ_NaouEXbO';
  let client;
  function esc(v){return String(v||'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));}
  function show(){
    document.getElementById('raf-auth-overlay')?.remove();
    document.getElementById('raf-auth-gate')?.remove();
    document.getElementById('raf-supa-auth')?.remove();
    const o=document.createElement('div'); o.id='raf-supa-auth';
    o.innerHTML=`<div style="position:fixed;inset:0;background:rgba(0,0,0,.82);z-index:99999;display:grid;place-items:center;padding:22px"><form id="raf-supa-form" style="width:min(460px,100%);background:#101712;border:1px solid #304238;border-radius:28px;padding:30px;color:#f5f7f5;font-family:inherit"><div style="letter-spacing:4px;color:#9aaa9e;font-size:13px">RAF COACHING</div><h2 style="font-size:32px;margin:22px 0 10px">Sign in to your space</h2><p style="color:#aab5ad;line-height:1.6">Your account is secured by Supabase.</p><label>Email<input id="raf-email" type="email" required placeholder="you@example.com" style="display:block;width:100%;box-sizing:border-box;margin:8px 0 16px;padding:15px;border-radius:14px;border:1px solid #3b4c40;background:#0b100d;color:white"></label><label>Password<input id="raf-password" type="password" required minlength="6" placeholder="At least 6 characters" style="display:block;width:100%;box-sizing:border-box;margin:8px 0 16px;padding:15px;border-radius:14px;border:1px solid #3b4c40;background:#0b100d;color:white"></label><label>Full name (for sign up)<input id="raf-name" placeholder="Your name" style="display:block;width:100%;box-sizing:border-box;margin:8px 0 16px;padding:15px;border-radius:14px;border:1px solid #3b4c40;background:#0b100d;color:white"></label><label>Account type<select id="raf-role" style="display:block;width:100%;box-sizing:border-box;margin:8px 0 18px;padding:15px;border-radius:14px;border:1px solid #3b4c40;background:#0b100d;color:white"><option value="client">Client</option><option value="coach">Coach</option></select></label><div style="display:flex;gap:10px"><button type="submit" data-mode="signin" style="flex:1;padding:15px;border:0;border-radius:14px;background:#c0f36a;color:#0b100d;font-weight:800">Sign in</button><button type="submit" data-mode="signup" style="flex:1;padding:15px;border:1px solid #536557;border-radius:14px;background:transparent;color:white;font-weight:700">Create account</button></div><div id="raf-auth-msg" style="margin-top:16px;color:#c0f36a;min-height:20px"></div></form></div>`;
    document.body.appendChild(o);
    o.querySelectorAll('button').forEach(b=>b.onclick=async e=>{e.preventDefault();await submit(b.dataset.mode)});
  }
  async function submit(mode){
    const msg=document.getElementById('raf-auth-msg');const email=document.getElementById('raf-email').value.trim();const password=document.getElementById('raf-password').value;const name=document.getElementById('raf-name').value.trim();const role=document.getElementById('raf-role').value;msg.textContent='Working...';
    const result=mode==='signup'?await client.auth.signUp({email,password,options:{data:{full_name:name,role}}}):await client.auth.signInWithPassword({email,password});
    if(result.error){msg.textContent=result.error.message;return;}
    const u=result.data.user;if(!u){msg.textContent='Check your email to confirm the account.';return;}
    let profile=(await client.from('profiles').select('full_name,role').eq('id',u.id).maybeSingle()).data;
    if(mode==='signup'||!profile){profile={full_name:name||u.user_metadata?.full_name||email.split('@')[0],role:role||u.user_metadata?.role||'client'};await client.from('profiles').upsert({id:u.id,full_name:profile.full_name,role:profile.role});}
    localStorage.setItem('rafSession',JSON.stringify({id:u.id,name:profile.full_name||email,role:profile.role||'client',createdAt:Date.now(),supabase:true}));location.reload();
  }
  function loadSdk(){return new Promise((resolve,reject)=>{if(window.supabase)return resolve();const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});}
  async function boot(){try{await loadSdk();client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);window.rafSupabase=client;const {data}=await client.auth.getSession();if(data.session){const u=data.session.user;const profile=(await client.from('profiles').select('full_name,role').eq('id',u.id).maybeSingle()).data;localStorage.setItem('rafSession',JSON.stringify({id:u.id,name:profile?.full_name||u.email,role:profile?.role||'client',createdAt:Date.now(),supabase:true}));document.getElementById('raf-auth-overlay')?.remove();document.getElementById('raf-auth-gate')?.remove();document.getElementById('raf-supa-auth')?.remove();}else show();}catch(e){console.error('RAF Supabase bootstrap failed',e);show();}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();