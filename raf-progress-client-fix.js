/* RAF Coaching — client-linked progress dashboard v3 */
(function(){
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
 const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const slug=s=>String(s||'client').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'client';
 function clients(){let cs=read('rafClients',[]),changed=false;cs=cs.map((c,i)=>{if(c?.id)return c;changed=true;return {...c,id:`${slug(c?.name)}-${i+1}`}});if(changed)write('rafClients',cs);return cs}
 function active(){const cs=clients(),id=localStorage.getItem('rafActiveClientId'),p=read('rafProfile',null);return cs.find(c=>c.id===id)||cs.find(c=>p&&c.name===p.name)||p||cs[0]||null}
 function setActive(c){if(!c)return;write('rafProfile',c);write('rafActiveClientId',c.id);window.RAF_ACTIVE_CLIENT=c}
 function render(){
  if(location.hash!=='#progress')return;
  const root=document.querySelector('#app-content');if(!root)return;
  const cs=clients(),c=active();if(c)setActive(c);
  const raw=read('rafWorkoutLogs',[]).filter(x=>(c?.id&&x.clientId===c.id)||(!x.clientId&&x.clientName===c?.name)||(!x.clientId&&x.client===c?.name));
  const seen=new Set();
  const logs=raw.filter(x=>{const completed=(x.completed||[]).filter(Boolean).length;const key=`${x.day||''}|${String(x.date||'').slice(0,16)}|${completed}`;if(seen.has(key))return false;seen.add(key);return true});
  const selector=cs.length?`<div class="card"><label><strong>Active client</strong><select id="progress-client">${cs.map(x=>`<option value="${esc(x.id)}" ${x.id===c?.id?'selected':''}>${esc(x.name||'Unnamed client')}</option>`).join('')}</select><p class="muted">Select a client to view their own workout history.</p></label></div>`:'';
  root.innerHTML=`<div class="hero"><p class="eyebrow">CLIENT PROGRESS</p><h2>${esc(c?.name||'Progress')}</h2><p class="muted">Workout history and completion tracking for the active client.</p></div>${selector}<div class="card"><h3>Workout history</h3>${logs.length?logs.slice().reverse().map(x=>`<article class="workout"><strong>${esc(x.day||'Training session')}</strong><div class="muted">${esc(new Date(x.date).toLocaleDateString())} · ${esc((x.completed||[]).filter(Boolean).length)} completed</div></article>`).join(''):'<p class="muted">No saved workout sessions yet.</p>'}</div>`;
  document.querySelector('#page-title').textContent='Progress';
  document.querySelector('#progress-client')?.addEventListener('change',e=>{const next=cs.find(x=>x.id===e.target.value);if(next){setActive(next);render()}});
 }
 document.addEventListener('click',e=>{if(e.target.closest('[data-view="progress"]'))setTimeout(render,30)},true);
 window.addEventListener('hashchange',render);
 document.addEventListener('DOMContentLoaded',()=>setTimeout(render,100));
 setInterval(render,1000);
})();