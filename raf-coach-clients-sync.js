/* RAF Coaching — authoritative coach client sync */
(function(){
  'use strict';
  const COACH='refaey11@icloud.com';
  const read=(k,f=null)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch(e){return f}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
  async function sync(){
    const s=read('rafSession',{});
    if(s.role!=='coach'||!window.rafSupabase)return;
    const q=await window.rafSupabase.from('profiles').select('id,full_name,role,created_at').eq('role','client').order('created_at',{ascending:false});
    if(q.error||!Array.isArray(q.data))return;
    const remote=q.data.filter(p=>p.id!==s.id).map(p=>({id:p.id,client_id:p.id,name:p.full_name||'Client',age:'',goal:'',days:4,remote:true}));
    write('rafClients',remote);
    const active=read('rafActiveClient',null);
    if(active&&(!active.id||!remote.some(c=>c.id===active.id))){
      localStorage.removeItem('rafActiveClient');
      localStorage.removeItem('rafActiveClientId');
      localStorage.removeItem('rafCurrentClient');
      localStorage.removeItem('rafProfile');
    }
    window.dispatchEvent(new CustomEvent('raf-clients-synced'));
  }
  window.addEventListener('raf-auth-ready',()=>setTimeout(sync,250));
  document.addEventListener('DOMContentLoaded',()=>setTimeout(sync,1200));
})();