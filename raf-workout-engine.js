/* RAF Coaching — workout engine v1 */
(function(){
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const oldRender=window.render;
  function workout(){
    const p=read('rafProfile',null), programs=read('rafPrograms',{});
    const plan=p&&programs[p.name];
    if(!p||!plan)return '<div class="card"><h2>Workout</h2><p class="muted">Create or open a client first.</p><button class="primary" data-view="assessment">Open assessment</button></div>';
    const ex=Array.isArray(plan.exercises)?plan.exercises:[];
    return `<div class="hero"><p class="eyebrow">NASM / OPT WORKOUT</p><h2>${esc(p.name)} · Phase ${esc(plan.phase||'')}</h2><p class="muted">${esc(plan.phaseName||'')} · ${esc(p.goal||'')}</p></div><div class="card"><h3>Session settings</h3><div class="form-grid"><label>Sets<input id="wo-sets" type="number" min="1" value="${plan.variables?.sets||3}"></label><label>Reps<input id="wo-reps" value="${esc(plan.variables?.reps||'10-12')}"></label><label>Tempo<input id="wo-tempo" value="${esc(plan.variables?.tempo||'2/0/2')}"></label><label>Rest<input id="wo-rest" value="${esc(plan.variables?.rest||'60 sec')}"></label></div></div><div class="card"><h3>Exercise sequence</h3>${ex.length?ex.map((e,i)=>`<article class="workout" style="align-items:flex-start"><div style="flex:1"><strong>${i+1}. ${esc(e.name)}</strong><div class="muted">${esc((e.muscles||[]).join(' · '))} · ${esc(e.equipment||'')}</div><p>${esc(e.instruction||'Controlled technique.')}</p><label>Completed <input type="checkbox" data-done="${i}"></label></div></article>`).join(''):'<p class="muted">No exercises in this program yet. Add exercises from Program Builder.</p>'}</div><button class="primary" id="save-workout">Save workout session</button><p id="wo-status" class="muted"></p>`;
  }
  window.render=function(name){if(name!=='workout')return oldRender(name);document.querySelector('#page-title').textContent='Workout';document.querySelector('#app-content').innerHTML=workout();document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.view===name));document.querySelector('#save-workout')?.addEventListener('click',()=>{const p=read('rafProfile',null);const logs=read('rafWorkoutLogs',[]);logs.push({client:p?.name,date:new Date().toISOString(),completed:[...document.querySelectorAll('[data-done]')].map(x=>x.checked)});save('rafWorkoutLogs',logs);document.querySelector('#wo-status').textContent='Workout session saved ✓'});};
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-view="workout"]');if(b){e.preventDefault();location.hash='workout';window.render('workout')}},true);
})();