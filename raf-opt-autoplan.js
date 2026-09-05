(()=>{
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  function apply(){
    const profile=read('rafProfile',null); if(!profile?.name||!window.RAF?.buildProgram)return;
    const programs=read('rafPrograms',{}), existing=programs[profile.name]||{};
    const base=window.RAF.buildProgram(profile), wanted=Math.max(1,Math.min(7,Number(profile.days)||1));
    const old=Array.isArray(existing.days)?existing.days:[];
    const days=Array.from({length:wanted},(_,i)=>{
      const prior=old[i]||{};
      if(Array.isArray(prior.exercises)&&prior.exercises.length)return {...prior,name:`Day ${i+1}`};
      const picked=window.RAF.chooseExercises(profile,base.phase)||[];
      const rotated=picked.map((e,j)=>picked[(j+i)%picked.length]).slice(0,6);
      return {name:`Day ${i+1}`,focus:i===0?'Primary training':`Training session ${i+1}`,exercises:rotated};
    });
    const p={...base,...existing,phase:base.phase,phaseName:base.phaseName,goal:base.goal,variables:{...base.variables,...(existing.variables||{})},days};
    p.exercises=days[0]?.exercises||[];
    programs[profile.name]=p;write('rafPrograms',programs);
    const form=document.querySelector('#program-form');
    if(form&&!sessionStorage.getItem('rafOptPlanApplied')){sessionStorage.setItem('rafOptPlanApplied','1');location.reload()}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else setTimeout(apply,0);
})();