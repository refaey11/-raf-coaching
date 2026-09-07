/* RAF Coaching — final coach role recovery */
(function(){'use strict';
  const COACH='refaey11@icloud.com';
  const read=(k,f=null)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  function forceCoach(user){
    if(!user||String(user.email||'').toLowerCase()!==COACH)return false;
    const s=read('rafSession',{});
    write('rafSession',{...s,id:user.id,userId:user.id,name:'Karim Refaey',email:user.email,role:'coach',supabase:true});
    localStorage.removeItem('rafProfile');
    localStorage.removeItem('rafActiveClient');
    localStorage.removeItem('rafActiveClientId');
    localStorage.removeItem('rafCurrentClient');
    return true;
  }
  async function boot(){
    try{
      const db=window.rafSupabase;
      if(db){
        const r=await db.auth.getUser();
        if(forceCoach(r.data?.user)){
          window.dispatchEvent(new CustomEvent('raf-auth-ready'));
          if(location.hash==='#assessment'||location.hash==='#client-assessment'||location.hash==='#client-portal')location.hash='#dashboard';
          setTimeout(()=>{if(typeof window.render==='function')window.render('dashboard')},80);
        }
      }
    }catch(e){console.warn('coach role recovery failed',e)}
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(boot,500));
  window.addEventListener('raf-auth-ready',()=>setTimeout(boot,100));
})();
