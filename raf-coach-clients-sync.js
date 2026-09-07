/* RAF Coaching — sync registered Supabase client accounts into coach Clients */
(function(){
  async function sync(){
    const session=JSON.parse(localStorage.getItem('rafSession')||'null');
    if(!session||session.role!=='coach'||!window.rafSupabase)return;
    const q=await window.rafSupabase.from('profiles').select('id,full_name,role,created_at').eq('role','client').order('created_at',{ascending:false});
    if(q.error||!Array.isArray(q.data))return;
    const remote=q.data.map(p=>({id:p.id,name:p.full_name||'Client',age:'',goal:'',days:4,remote:true}));
    const local=JSON.parse(localStorage.getItem('rafClients')||'[]');
    const merged=[...remote,...local.filter(c=>!c.id||!remote.some(r=>r.id===c.id))];
    localStorage.setItem('rafClients',JSON.stringify(merged));
    if(location.hash.slice(1)==='clients'){
      const nav=document.querySelector('[data-view="clients"]');
      if(nav)nav.click();
    }
  }
  window.addEventListener('raf-auth-ready',()=>setTimeout(sync,150));
  document.addEventListener('DOMContentLoaded',()=>setTimeout(sync,900));
})();