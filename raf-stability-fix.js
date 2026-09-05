/* RAF Coaching — reliable final interaction layer */
(function(){
  'use strict';
  function read(k,f){try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?f:v}catch(e){return f}}
  function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function refresh(){if(typeof window.render==='function')window.render('program')}
  function saveAssessment(form){
    const data=Object.fromEntries(new FormData(form));
    data.age=Number(data.age); data.days=Number(data.days);
    const clients=read('rafClients',[]), programs=read('rafPrograms',{});
    write('rafProfile',data);
    write('rafClients',[...clients.filter(c=>c.name!==data.name),data]);
    if(window.RAF&&typeof RAF.buildProgram==='function')programs[data.name]=programs[data.name]||RAF.buildProgram(data);
    write('rafPrograms',programs); location.hash='program'; refresh();
  }
  function saveProgram(form){
    const profile=read('rafProfile',{}), all=read('rafPrograms',{});
    if(!profile.name||!window.RAF||typeof RAF.buildProgram!=='function')return;
    const base=all[profile.name]||RAF.buildProgram(profile), data=Object.fromEntries(new FormData(form));
    base.variables={...(base.variables||{}),sets:Number(data.sets),reps:data.reps,tempo:data.tempo,rest:data.rest,rir:Number(data.rir)};
    if(Array.isArray(base.exercises))base.exercises=base.exercises.map((old,i)=>RAF.RAF_EXERCISES.find(x=>x.id===data['exercise_'+i])||old);
    all[profile.name]=base; write('rafPrograms',all);
    const status=document.querySelector('#program-status'); if(status)status.textContent='Saved locally · Coach approval pending';
  }
  function addExercise(button){
    const card=button.closest('article,.workout,.card');
    const name=card&&card.querySelector('strong')&&card.querySelector('strong').textContent.trim();
    const ex=window.RAF&&Array.isArray(RAF.RAF_EXERCISES)&&RAF.RAF_EXERCISES.find(x=>x.name===name);
    if(!ex)return;
    const p=read('rafProfile',{}), all=read('rafPrograms',{}), n=p.name||'Current Client';
    const prog=all[n]||(RAF.buildProgram?RAF.buildProgram(p):{exercises:[]}); prog.exercises=Array.isArray(prog.exercises)?prog.exercises:[];
    if(!prog.exercises.some(x=>x.id===ex.id))prog.exercises.push(ex);
    all[n]=prog; write('rafPrograms',all); button.textContent='Added ✓'; button.disabled=true;
  }
  document.addEventListener('submit',function(e){
    const form=e.target;
    if(!form)return;
    if(form.id==='assessment-form'){e.preventDefault();e.stopImmediatePropagation();saveAssessment(form)}
    else if(form.id==='program-form'){e.preventDefault();e.stopImmediatePropagation();saveProgram(form)}
  },true);
  document.addEventListener('click',function(e){
    const b=e.target.closest('button'); if(!b)return;
    if(b.textContent.trim()==='Add to program'){e.preventDefault();e.stopImmediatePropagation();addExercise(b)}
  },true);
})();