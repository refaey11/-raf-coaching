/* RAF Coaching — final persistence and save fix */
(function(){
  'use strict';
  const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?f:v}catch(e){return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  function saveProgram(form){
    const profile=read('rafProfile',null); if(!profile||!window.RAF)return;
    const all=read('rafPrograms',{});
    const old=all[profile.name] || RAF.buildProgram(profile);
    const base=RAF.buildProgram(profile);
    const fd=new FormData(form);
    const variables={...((old&&old.variables)||base.variables),sets:Number(fd.get('sets')||base.variables.sets),reps:fd.get('reps')||base.variables.reps,tempo:fd.get('tempo')||base.variables.tempo,rest:fd.get('rest')||base.variables.rest,rir:Number(fd.get('rir')||base.variables.rir)};
    const exercises=(old.exercises||base.exercises||[]).map((ex,i)=>{
      const id=fd.get('exercise_'+i);
      return (RAF.RAF_EXERCISES||[]).find(x=>x.id===id)||ex;
    });
    const saved={...old,...base,variables,exercises};
    all[profile.name]=saved;
    write('rafPrograms',all);
    const status=document.querySelector('#program-status');
    if(status)status.textContent='Saved successfully · Changes will remain after refresh';
    if(typeof window.render==='function')setTimeout(()=>window.render('program'),30);
  }
  document.addEventListener('submit',function(e){
    if(e.target&&e.target.id==='program-form'){
      e.preventDefault(); e.stopImmediatePropagation(); saveProgram(e.target);
    }
  },true);
})();
