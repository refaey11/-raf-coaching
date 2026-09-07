/* RAF Coaching — persist every new signup as a real client */
(function(){'use strict';
  function boot(){
    const db=window.rafSupabase;
    if(!db)return;
    db.auth.onAuthStateChange(async(event,session)=>{
      if(event!=='SIGNED_IN'||!session?.user)return;
      const u=session.user;
      const role=u.user_metadata?.role||'client';
      if(role!=='client')return;
      const name=u.user_metadata?.full_name||u.email||'Client';
      const {error}=await db.from('profiles').upsert({id:u.id,full_name:name,role:'client'},{onConflict:'id'});
      if(error)console.error('Client profile creation failed',error);
      else localStorage.setItem('rafSession',JSON.stringify({id:u.id,userId:u.id,name,role:'client',supabase:true}));
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
