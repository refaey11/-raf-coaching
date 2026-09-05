/* RAF Coaching — persistent program state */
(function(){
  'use strict';
  function read(k,f){try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch(e){return f}}
  function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function saveCustomizedProgram(form){
    const profile=read('rafProfile',null);
    if(!profile||!profile.name||!window.RAF)return;
    const all=read('rafPrograms',{});
    const current=all[profile.name]||RAF.buildProgram(profile);
    const data=Object.fromEntries(new FormData(form));
    current.variables={...(current.variables||{}),sets:Number(data.sets||current.variables?.sets||1),reps:data.reps||current.variables?.reps||'',tempo:data.tempo||current.variables?.tempo||'',rest:data.rest||current.variables?.rest||'',rir:Number(data.rir??current.variables?.rir??0)};
    current.exercises=(current.exercises||[]).map((old,i)=>RAF.RAF_EXERCISES.find(e=>e.id===data['exercise_'+i])||old);
    all[profile.name]=current;
    write('rafPrograms',all);
    const status=document.querySelector('#program-status');
    if(status)status.textContent='Saved locally · Coach approval pending';
  }
  document.addEventListener('submit',function(ev){
    if(ev.target&&ev.target.id==='program-form')setTimeout(function(){saveCustomizedProgram(ev.target)},0);
  },false);
  document.addEventListener('raf:program-updated',function(){
    const profile=read('rafProfile',null);if(!profile||!profile.name)return;
    const all=read('rafPrograms',{});if(all[profile.name])write('rafPrograms',all);
  });
})();