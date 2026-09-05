/* RAF stable core: one safe save/replace path for mobile and desktop */
(function(){
  'use strict';
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function normalize(ex){
    return {...ex,muscles:Array.isArray(ex?.muscles)?ex.muscles:[],equipment:ex?.equipment||'Not specified',instruction:ex?.instruction||'Perform with controlled technique.',name:ex?.name||'Exercise',id:ex?.id||('exercise-'+Date.now())};
  }
  function saveAssessment(form){
    const d=Object.fromEntries(new FormData(form));
    d.age=Number(d.age||0); d.days=Number(d.days||4);
    const clients=read('rafClients',[]).filter(c=>c.name!==d.name);
    clients.push(d); write('rafClients',clients); write('rafProfile',d);
    location.hash='program'; if(window.render) window.render('program'); else location.reload();
  }
  function saveProgram(form){
    const profile=read('rafProfile',null); if(!profile?.name)return;
    const programs=read('rafPrograms',{}); let p=programs[profile.name];
    if(!p && window.RAF?.buildProgram)p=RAF.buildProgram(profile);
    if(!p)return;
    p={...p,variables:{...(p.variables||{})}};
    const fd=new FormData(form);
    if(fd.get('sets')!==null)p.variables.sets=Number(fd.get('sets'))||1;
    if(fd.get('reps')!==null)p.variables.reps=fd.get('reps');
    if(fd.get('tempo')!==null)p.variables.tempo=fd.get('tempo');
    if(fd.get('rest')!==null)p.variables.rest=fd.get('rest');
    if(fd.get('rir')!==null)p.variables.rir=Number(fd.get('rir'))||0;
    const old=Array.isArray(p.exercises)?p.exercises.map(normalize):[];
    p.exercises=old.map((ex,i)=>{const id=fd.get('exercise_'+i);return (window.RAF?.RAF_EXERCISES||[]).find(x=>x.id===id)||ex});
    write('rafPrograms',programs);
    const st=document.querySelector('#program-status');if(st)st.textContent='Saved successfully ✓';
  }
  document.addEventListener('submit',function(e){
    const f=e.target;
    if(f?.id==='assessment-form'){e.preventDefault();e.stopImmediatePropagation();saveAssessment(f)}
    if(f?.id==='program-form'){e.preventDefault();e.stopImmediatePropagation();saveProgram(f)}
  },true);
  window.addEventListener('error',function(e){
    if(String(e.message||'').includes('join')){e.preventDefault();location.hash='clients';location.reload()}
  });
})();