/* RAF Coaching — workout engine v3 */
(function(){
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const oldRender=window.render;
  const visual=e=>e.image||`data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360"><rect width="100%" height="100%" fill="#eef2f5"/><circle cx="320" cy="105" r="30" fill="#7b8794"/><path d="M320 140 L320 235 M320 165 L220 215 M320 165 L420 215 M320 235 L245 315 M320 235 L395 315" stroke="#52606d" stroke-width="18" stroke-linecap="round" fill="none"/><text x="320" y=" forty" text-anchor="middle" font-family="Arial" font-size="22" fill="#243b53">${esc(e.name||'Exercise')}</text></svg>`)}`;
  function normalize(plan){
    if(!plan)return null;
    if(!Array.isArray(plan.days))plan.days=[{name:'Day 1',focus:'Full Body',exercises:Array.isArray(plan.exercises)?plan.exercises:[]}];
    plan.days.forEach((d,i)=>{d.name=d.name||`Day ${i+1}`;d.exercises=Array.isArray(d.exercises)?d.exercises:[]});
    return plan;
  }
  function workout(){
    const p=read('rafProfile',null), programs=read('rafPrograms',{}), plan=normalize(p&&programs[p.name]);
    if(!p||!plan)return '<div class="card"><h2>Workout</h2><p class="muted">Create or open a client first.</p><button class="primary" data-view="assessment">Open assessment</button></div>';
    const selected=Math.max(0,Math.min(Number(sessionStorage.getItem('rafWorkoutDay')||0),plan.days.length-1)), day=plan.days[selected];
    const tabs=plan.days.map((d,i)=>`<button class="${i===selected?'primary':'secondary'}" data-workout-day="${i}">${esc(d.name)}</button>`).join(' ');
    const ex=day.exercises;
    return `<div class="hero"><p class="eyebrow">NASM / OPT WORKOUT</p><h2>${esc(p.name)} · Phase ${esc(plan.phase||'1')}</h2><p class="muted">${esc(plan.phaseName||'Stabilization Endurance')} · ${esc(p.goal||'')}</p></div><div class="card"><h3>Training days</h3><div style="display:flex;gap:8px;flex-wrap:wrap">${tabs}</div><p class="muted">${esc(day.focus||'Program session')}</p></div><div class="card"><h3>Session settings</h3><div class="form-grid"><label>Sets<input id="wo-sets" type="number" min="1" value="${plan.variables?.sets||3}"></label><label>Reps<input id="wo-reps" value="${esc(plan.variables?.reps||'10-12')}"></label><label>Tempo<input id="wo-tempo" value="${esc(plan.variables?.tempo||'2/0/2')}"></label><label>Rest<input id="wo-rest" value="${esc(plan.variables?.rest||'60 sec')}"></label></div></div><div class="card"><h3>${esc(day.name)} · Exercise sequence</h3>${ex.length?ex.map((e,i)=>`<article class="workout" style="display:flex;gap:16px;align-items:flex-start;margin:16px 0"><img src="${visual(e)}" alt="${esc(e.name)}" style="width:150px;height:90px;object-fit:cover;border-radius:12px"><div style="flex:1"><strong>${i+1}. ${esc(e.name)}</strong><div class="muted">${esc((e.muscles||[]).join(' · '))} · ${esc(e.equipment||'Bodyweight')}</div><p>${esc(e.instruction||'Controlled technique. Maintain alignment and breathing.')}</p><div class="muted">${esc(e.sets||plan.variables?.sets||3)} sets · ${esc(e.reps||plan.variables?.reps||'10-12')} reps · ${esc(e.rest||plan.variables?.rest||'60 sec')}</div><label>Completed <input type="checkbox" data-done="${i}"></label></div></article>`).join(''):'<p class="muted">No exercises in this day yet. Add exercises from Program Builder.</p>'}</div><button class="primary" id="save-workout">Save workout session</button><p id="wo-status" class="muted"></p>`;
  }
  function bind(){
    document.querySelectorAll('[data-workout-day]').forEach(b=>b.addEventListener('click',()=>{sessionStorage.setItem('rafWorkoutDay',b.dataset.workoutDay);window.render('workout')}));
    document.querySelector('#save-workout')?.addEventListener('click',()=>{const p=read('rafProfile',null),plan=normalize(p&&read('rafPrograms',{})[p.name]),day=plan?.days?.[Number(sessionStorage.getItem('rafWorkoutDay')||0)];const logs=read('rafWorkoutLogs',[]);logs.push({client:p?.name,day:day?.name,date:new Date().toISOString(),settings:{sets:document.querySelector('#wo-sets')?.value,reps:document.querySelector('#wo-reps')?.value,tempo:document.querySelector('#wo-tempo')?.value,rest:document.querySelector('#wo-rest')?.value},completed:[...document.querySelectorAll('[data-done]')].map(x=>x.checked)});save('rafWorkoutLogs',logs);document.querySelector('#wo-status').textContent='Workout session saved ✓'});
  }
  window.render=function(name){if(name!=='workout')return oldRender(name);document.querySelector('#page-title').textContent='Workout';document.querySelector('#app-content').innerHTML=workout();document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.view===name));bind()};
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-view="workout"]');if(b){e.preventDefault();location.hash='workout';window.render('workout')}},true);
})();