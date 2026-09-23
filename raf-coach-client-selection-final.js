/* RAF Coaching — coach/client selection (relationship-scoped) */
(function(){'use strict';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const isCoach=()=>!!(window.RAF_AUTH_ROLE&&window.RAF_AUTH_ROLE.isCoach);
function selectClient(c){if(!c)return;write('rafActiveClient',c);localStorage.setItem('rafActiveClientId',String(c.id||c.client_id||''));write('rafProfile',c);window.RAF_ACTIVE_CLIENT=c;}
async function remoteClients(){
 const db=window.rafSupabase;if(!db)return [];
 const session=await db.auth.getSession();
 const coachId=session?.data?.session?.user?.id;
 if(!coachId)return [];
 const links=await db.from('coach_clients').select('client_id').eq('coach_id',coachId);
 if(links.error||!Array.isArray(links.data)||!links.data.length)return [];
 const ids=links.data.map(x=>x.client_id).filter(Boolean);
 const q=await db.from('profiles').select('id,full_name,role,created_at').eq('role','client').in('id',ids).order('created_at',{ascending:false});
 return q.error||!Array.isArray(q.data)?[]:q.data.map(p=>({id:p.id,name:p.full_name||'Client',full_name:p.full_name||'Client',role:'client',remote:true}));
}
async function repairList(){
 if(!isCoach()||location.hash!=='#clients')return;
 const remote=await remoteClients();
 const local=read('rafClients',[]).filter(c=>c&&c.id&&String(c.role||'').toLowerCase()!=='coach');
 const merged=remote.map(r=>{const cached=local.find(c=>String(c.id)===String(r.id));return cached?{...cached,...r}:r;});
 write('rafClients',merged);
 const root=document.querySelector('#app-content');
 if(!root)return;
 const buttons=root.querySelectorAll('[data-cw-client]');
 buttons.forEach(b=>b.onclick=()=>{const c=merged[+b.dataset.cwClient];selectClient(c);window.RAFClientWorkspace?.open?.(c);});
 if(!merged.length){
  const old=root.querySelector('.cw-list');
  if(old)old.innerHTML='<p class="muted">No assigned clients found.</p>';
 }
}
function bind(){
 document.addEventListener('click',e=>{const b=e.target.closest('[data-cw-client]');if(!b)return;const list=read('rafClients',[]);const c=list[+b.dataset.cwClient];if(c)selectClient(c);},true);
 window.addEventListener('hashchange',()=>setTimeout(repairList,250));
 window.addEventListener('rafAuthRoleReady',()=>setTimeout(repairList,100));
 document.addEventListener('DOMContentLoaded',()=>setTimeout(repairList,700));
}
bind();
})();
