/* RAF Coaching — client-linked progress dashboard v2 */
(function(){
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function active(){const cs=read('rafClients',[]),id=localStorage.getItem('rafActiveClientId'),p=read('rafProfile',null);return cs.find(c=>c.id===id)||p||cs[0]||null}
 function render(){
  if(location.hash!=='#progress')return;
  const root=document.querySelector('#app-content');if(!root)return;
  const c=active();
  const raw=read('rafWorkoutLogs',[]).filter(x=>(c?.id&&x.clientId===c.id)||(!x.clientId&&x.client===c?.name));
  const seen=new Set();
  const logs=raw.filter(x=>{const completed=(x.completed||[]).filter(Boolean).length;const key=`${x.day||''}|${String(x.date||'').slice(0,16)}|${completed}`;if(seen.has(key))return false;seen.add(key);return true});
  root.innerHTML=`<div class="hero"><p class="eyebrow">CLIENT PROGRESS</p><h2>${esc(c?.name||'Progress')}</h2><p class="muted">Workout history and completion tracking for the active client.</p></div><div class="card"><h3>Workout history</h3>${logs.length?logs.slice().reverse().map(x=>`<article class="workout"><strong>${esc(x.day||'Training session')}</strong><div class="muted">${esc(new Date(x.date).toLocaleDateString())} · ${esc((x.completed||[]).filter(Boolean).length)} completed</div></article>`).join(''):'<p class="muted">No saved workout sessions yet.</p>'}</div>`;
  document.querySelector('#page-title').textContent='Progress';
 }
 document.addEventListener('click',e=>{if(e.target.closest('[data-view="progress"]'))setTimeout(render,30)},true);window.addEventListener('hashchange',render);document.addEventListener('DOMContentLoaded',()=>setTimeout(render,100));setInterval(render,1000);
})();
