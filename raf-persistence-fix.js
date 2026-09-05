/* RAF Coaching — persistent program state */
(function(){
  function read(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function saveProgram(){
    const profile=read('rafProfile',null); if(!profile||!profile.name)return;
    const programs=read('rafPrograms',{}); const existing=programs[profile.name];
    if(!existing)return;
    programs[profile.name]=existing; localStorage.setItem('rafPrograms',JSON.stringify(programs));
  }
  document.addEventListener('submit',function(ev){
    const form=ev.target; if(!form||form.id!=='program-form')return;
    const profile=read('rafProfile',null); if(!profile||!window.RAF)return;
    const programs=read('rafPrograms',{}); const current=programs[profile.name]||RAF.buildProgram(profile);
    const data=Object.fromEntries(new FormData(form));
    current.variables={...current.variables,sets:Number(data.sets||current.variables.sets),reps:data.reps||current.variables.reps,tempo:data.tempo||current.variables.tempo,rest:data.rest||current.variables.rest,rir:Number(data.rir??current.variables.rir)};
    current.exercises=(current.exercises||[]).map((old,i)=>RAF.RAF_EXERCISES.find(e=>e.id===data['exercise_'+i])||old);
    programs[profile.name]=current; localStorage.setItem('rafPrograms',JSON.stringify(programs));
  },true);
  document.addEventListener('raf:program-updated',saveProgram);
  setTimeout(function(){if(location.hash.replace('#','')==='program'&&typeof window.render==='function')window.render('program')},250);
})();
