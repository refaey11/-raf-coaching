/* RAF Coaching — final persistence, save, add/replace and refresh-safe fix */
(function(){
  'use strict';
  const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?f:v}catch(e){return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const exercises=()=>window.RAF&&Array.isArray(RAF.RAF_EXERCISES)?RAF.RAF_EXERCISES:[];
  function state(){
    const profile=read('rafProfile',null); if(!profile||!profile.name)return null;
    const all=read('rafPrograms',{});
    if(!all[profile.name] && window.RAF && typeof RAF.buildProgram==='function') all[profile.name]=RAF.buildProgram(profile);
    const program=all[profile.name];
    if(program){ program.exercises=Array.isArray(program.exercises)?program.exercises:[]; all[profile.name]=program; write('rafPrograms',all); }
    return {profile,all,program};
  }
  function refresh(){ if(typeof window.render==='function') window.render(location.hash.replace('#','')||'dashboard'); }
  function saveProgram(form){
    const s=state(); if(!s||!s.program)return;
    const fd=new FormData(form), p=s.program;
    p.variables={...(p.variables||{}),
      sets:Number(fd.get('sets'))||p.variables?.sets||1,
      reps:fd.get('reps')||p.variables?.reps||'',
      tempo:fd.get('tempo')||p.variables?.tempo||'',
      rest:fd.get('rest')||p.variables?.rest||'',
      rir:Number(fd.get('rir'))||0};
    p.exercises=(p.exercises||[]).map((old,i)=>exercises().find(x=>String(x.id)===String(fd.get('exercise_'+i)))||old);
    s.all[s.profile.name]=p; write('rafPrograms',s.all);
    const status=document.querySelector('#program-status'); if(status)status.textContent='Saved successfully ✓ Changes remain after refresh';
  }
  function addOrReplace(button, id){
    const s=state(); if(!s||!s.program)return;
    const ex=exercises().find(x=>String(x.id)===String(id)); if(!ex)return;
    const list=s.program.exercises;
    let i=-1;
    if(ex.category==='Cardio') i=list.findIndex(x=>x&&x.category==='Cardio');
    else if(ex.category) i=list.findIndex(x=>x&&x.category===ex.category);
    if(i>=0)list[i]=ex; else if(!list.some(x=>x&&x.id===ex.id))list.push(ex);
    s.all[s.profile.name]=s.program; write('rafPrograms',s.all);
    if(button){button.textContent='Saved ✓';button.disabled=true;}
    refresh();
  }
  document.addEventListener('submit',function(e){
    if(e.target&&e.target.id==='program-form'){e.preventDefault();e.stopImmediatePropagation();saveProgram(e.target);}
  },true);
  document.addEventListener('click',function(e){
    const b=e.target.closest('button'); if(!b)return;
    const id=b.getAttribute('data-exercise-id');
    if(id && (b.classList.contains('raf-add-replace') || /add\s*\/\s*replace/i.test(b.textContent))){e.preventDefault();e.stopImmediatePropagation();addOrReplace(b,id);return;}
    if(/^add to program$/i.test(b.textContent.trim())){
      e.preventDefault();e.stopImmediatePropagation();
      const card=b.closest('article,.workout,.card'); const name=card&&card.querySelector('strong')?.textContent.trim();
      const ex=exercises().find(x=>x.name===name); if(ex)addOrReplace(b,ex.id);
    }
  },true);
  window.addEventListener('DOMContentLoaded',()=>{state();});
  state();
})();
