/* RAF Coaching — client-linked progress dashboard v3 */
(function(){
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
 const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function clients(){return read('rafClients',[]).filter(Boolean)}
 function active(){const cs=clients(),id=localStorage.getItem('rafActiveClientId'),p=read('rafProfile',null);return cs.find(c=>c.id===id)||p||cs[0]||null}
 function render(){
  if(location.hash!=='#progress')return;
  const root=document.querySelector('#app-content');if(!root)return;
  const cs=clients(),c=active();
  if(c){write('rafProfile',c);if(c.id)write('rafActiveClientId',c.id)}
  const raw=read('rafWorkoutLogs',[]).filter(x=>(c?.id&&x.clientId===c.id)||(!x.clientId&&x.client===c?.name));
  const seen=new Set();
  const logs=raw.filter(x=>{const completed=(x.completed||[]).filter(Boolean).length;const key=`${x.day||''}|${String(x.date||'').slice(0,16)}|${completed}`;if(seen.has(key))return false;seen.add(key);return true});
  const selector=cs.length?`<label class="client-picker">Active client<select id="raf-progress-client">${cs.map(x=>`<option value="${esc(x.id||x.name)}" ${(x.id||x.name)===(c?.id||c?.name)?'selected':''}>${esc(x.name||'Unnamed client')}</option>`).join('')}</select></label>`:'';
  root.innerHTML=`<div class="hero"><p class="eyebrow">CLIENT PROGRESS</p><h2>${esc(c?.name||'Progress')}</h2><p class="muted">Workout history and completion tracking for the active client.</p>${selector}</div><div class="card"><h3>Workout history</h3>${logs.length?logs.slice().reverse().map(x=>`<article class="workout"><strong>${esc(x.day||'Training session')}</strong><div class="muted">${esc(new Date(x.date).toLocaleDateString())} · ${esc((x.completed||[]).filter(Boolean).length)} completed</div></article>`).join(''):'<p class="muted">No saved workout sessions yet.</p>'}</div>`;
  const sel=document.querySelector('#raf-progress-client');
  if(sel)sel.onchange=()=>{const chosen=cs.find(x=>(x.id||x.name)===sel.value);if(chosen){write('rafProfile',chosen);if(chosen.id)write('rafActiveClientId',chosen.id);render()}};
  const title=document.querySelector('#page-title');if(title)title.textContent='Progress';
 }
 document.addEventListener('click',e=>{if(e.target.closest('[data-view="progress"]'))setTimeout(render,30)},true);
 window.addEventListener('hashchange',render);
 document.addEventListener('DOMContentLoaded',()=>setTimeout(render,100));
 setInterval(render,1000);
})();
