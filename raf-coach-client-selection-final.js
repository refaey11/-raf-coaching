/* RAF Coaching — final coach/client selection repair */
(function(){'use strict';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const coach=()=>read('rafSession',{}).role==='coach';
function selectClient(c){if(!c)return;write('rafActiveClient',c);localStorage.setItem('rafActiveClientId',String(c.id||c.client_id||''));write('rafProfile',c);window.RAF_ACTIVE_CLIENT=c;}
async function remoteClients(){
 const db=window.rafSupabase;if(!db)return [];
 const q=await db.from('profiles').select('id,full_name,role,created_at').eq('role','client').order('created_at',{ascending:false});
 return q.error||!Array.isArray(q.data)?[]:q.data.map(p=>({id:p.id,name:p.full_name||'Client',full_name:p.full_name||'Client',remote:true}));
}
async function repairList(){
 if(!coach()||location.hash!=='#clients')return;
 const remote=await remoteClients();
 const local=read('rafClients',[]).filter(c=>c&&c.id&&String(c.role||'').toLowerCase()!=='coach'&&String(c.email||'').toLowerCase()!=='refaey11@icloud.com');
 const merged=[...remote,...local.filter(c=>!remote.some(r=>String(r.id)===String(c.id)))];
 write('rafClients',merged);
 const root=document.querySelector('#app-content');
 if(!root)return;
 const buttons=root.querySelectorAll('[data-cw-client]');
 buttons.forEach(b=>b.onclick=()=>{const c=merged[+b.dataset.cwClient];selectClient(c);window.RAFClientWorkspace?.open?.(c);});
 if(!merged.length){
  const old=root.querySelector('.cw-list');
  if(old)old.innerHTML='<p class="muted">No registered clients found. Make sure the client completed signup and is saved in Supabase.</p>';
 }
}
function bind(){
 document.addEventListener('click',e=>{const b=e.target.closest('[data-cw-client]');if(!b)return;const list=read('rafClients',[]);const c=list[+b.dataset.cwClient];if(c)selectClient(c);},true);
 window.addEventListener('hashchange',()=>setTimeout(repairList,250));
 document.addEventListener('DOMContentLoaded',()=>setTimeout(repairList,700));
}
bind();
})();
