/* RAF Coaching — final client directory source */
(function(){'use strict';
  const COACH_EMAIL='refaey11@icloud.com';
  const read=(k,f=[])=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const isCoach=()=>read('rafSession',{}).role==='coach';
  const bad=p=>{const email=String(p.email||p.client_email||'').toLowerCase();const name=String(p.full_name||p.name||p.client_name||'').trim().toLowerCase();return email===COACH_EMAIL||name==='c.refaey'||name==='c.refaey — client profile'||name==='refaey'||name.includes('c.refaey');};
  async function sync(){
    if(!isCoach()||!window.rafSupabase)return;
    const db=window.rafSupabase, out=[];
    const p=await db.from('profiles').select('id,full_name,role,email,created_at').eq('role','client');
    (p.data||[]).filter(x=>!bad(x)).forEach(x=>out.push({id:x.id,name:x.full_name||'Client',full_name:x.full_name||'Client',email:x.email||'',remote:true}));
    const o=await db.from('client_onboarding').select('*').order('created_at',{ascending:false});
    (o.data||[]).filter(x=>!bad(x)).forEach(x=>{const id=x.user_id||x.client_id||x.id;if(!id)return;if(!out.some(y=>String(y.id)===String(id)))out.push({id,name:x.client_name||x.full_name||'Client',full_name:x.client_name||x.full_name||'Client',email:x.email||x.client_email||'',age:x.age,weight:x.weight,height:x.height,goal:x.goal,days:x.training_days||x.days,notes:x.notes,remote:true});});
    if(out.length)save('rafClients',out);
    else save('rafClients',[]);
    const active=read('rafActiveClient',null);if(active&&bad(active)){localStorage.removeItem('rafActiveClient');localStorage.removeItem('rafActiveClientId');localStorage.removeItem('rafProfile');}
    if(location.hash==='#clients')setTimeout(()=>document.querySelector('[data-view="clients"]')?.click(),80);
  }
  window.addEventListener('raf-auth-ready',()=>setTimeout(sync,250));
  document.addEventListener('DOMContentLoaded',()=>setTimeout(sync,1200));
  window.RAFClientDirectory={sync};
})();
