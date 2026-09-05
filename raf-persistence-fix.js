/* RAF Coaching — durable program persistence and reliable controls */
(function(){
  'use strict';
  const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k)||'null');return v==null?f:v}catch(e){return f}};
  const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
  const list=()=>window.RAF&&Array.isArray(RAF.RAF_EXERCISES)?RAF.RAF_EXERCISES:[];
  function get(){
    const profile=read('rafProfile',null); if(!profile||!profile.name)return null;
    const programs=read('rafPrograms',{});
    let program=programs[profile.name];
    if(!program&&window.RAF&&typeof RAF.buildProgram==='function'){
      program=RAF.buildProgram(profile); programs[profile.name]=program;
    }
    if(!program)return null;
    program.exercises=Array.isArray(program.exercises)?program.exercises:[];
    programs[profile.name]=program;
    write('rafPrograms',programs);
    write('rafCurrentProgram',program);
    return {profile,programs,program};
  }
  function persist(s){
    if(!s)return;
    s.programs[s.profile.name]=s.program;
    write('rafPrograms',s.programs);
    write('rafCurrentProgram',s.program);
  }
  function save(form){
    const s=get(); if(!s)return;
    const fd=new FormData(form), p=s.program;
    p.variables={...(p.variables||{}),sets:Number(fd.get('sets'))||p.variables?.sets||1,reps:fd.get('reps')||p.variables?.reps||'',tempo:fd.get('tempo')||p.variables?.tempo||'',rest:fd.get('rest')||p.variables?.rest||'',rir:fd.get('rir')===''?0:Number(fd.get('rir'))};
    p.exercises=p.exercises.map((old,i)=>list().find(x=>String(x.id)===String(fd.get('exercise_'+i)))||old);
    persist(s);
    const status=document.querySelector('#program-status'); if(status)status.textContent='Saved successfully ✓ Refresh-safe';
  }
  function addReplace(button,id){
    const s=get(), ex=list().find(x=>String(x.id)===String(id)); if(!s||!ex)return;
    const a=s.program.exercises; let i=-1;
    if(ex.category==='Cardio')i=a.findIndex(x=>x&&x.category==='Cardio');
    else if(ex.category)i=a.findIndex(x=>x&&x.category===ex.category);
    if(i>=0)a[i]=ex; else if(!a.some(x=>x&&String(x.id)===String(ex.id)))a.push(ex);
    persist(s);
    if(button){button.textContent='Saved ✓';button.disabled=true;}
  }
  document.addEventListener('submit',e=>{
    if(e.target&&e.target.id==='program-form'){e.preventDefault();e.stopImmediatePropagation();save(e.target);}
  },true);
  document.addEventListener('click',e=>{
    const b=e.target.closest('button'); if(!b)return;
    const id=b.getAttribute('data-exercise-id');
    if(id&&(b.classList.contains('raf-add-replace')||/add\s*\/\s*replace/i.test(b.textContent))){e.preventDefault();e.stopImmediatePropagation();addReplace(b,id);return;}
  },true);
  get();
})();
