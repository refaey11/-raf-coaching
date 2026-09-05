/* RAF Coaching — stable exercise add/replace UI */
(function(){
  'use strict';
  function read(key,fallback){try{const v=JSON.parse(localStorage.getItem(key)||'null');return v==null?fallback:v}catch(e){return fallback}}
  function write(key,value){localStorage.setItem(key,JSON.stringify(value))}
  function getData(){
    const profile=read('rafProfile',{});
    const all=read('rafPrograms',{});
    const name=profile.name||'Current Client';
    const program=all[name]||(window.RAF&&typeof RAF.buildProgram==='function'?RAF.buildProgram(profile):{exercises:[]});
    program.exercises=Array.isArray(program.exercises)?program.exercises:[];
    return {profile,all,name,program};
  }
  function redraw(){
    if(location.hash.replace('#','')==='program'&&typeof window.render==='function')window.render('program');
  }
  function enhance(){
    const form=document.querySelector('#program-form');
    if(!form||document.querySelector('#raf-extra-program-panel'))return;
    const panel=document.createElement('div');
    panel.id='raf-extra-program-panel';
    panel.className='card';
    panel.innerHTML='<h3>Exercise selection & replacements</h3><p class="muted">Add mobility, corrective, flexibility, or cardio exercises to the current program.</p><div class="raf-replace-grid"></div>';
    const grid=panel.querySelector('.raf-replace-grid');
    const extras=(window.RAF&&Array.isArray(RAF.RAF_EXERCISES)?RAF.RAF_EXERCISES:[]).filter(e=>['Corrective / Injury','Mobility','Flexibility','Cardio'].includes(e.category));
    extras.forEach(ex=>{
      const row=document.createElement('div');
      row.className='workout';
      row.innerHTML='<div><strong>'+String(ex.name||'Exercise')+'</strong><div class="muted">'+String(ex.category||'')+' · '+String(ex.finding||'')+'</div><small>'+String(ex.sets||'')+' sets · '+String(ex.reps||ex.duration||'')+' · '+String(ex.equipment||'')+'</small></div><button type="button" class="secondary raf-add-replace" data-exercise-id="'+String(ex.id||'')+'">Add / replace</button>';
      grid.appendChild(row);
    });
    form.insertBefore(panel,form.firstElementChild);
  }
  document.addEventListener('click',function(event){
    const button=event.target.closest('.raf-add-replace');
    if(!button)return;
    event.preventDefault();
    event.stopPropagation();
    const id=button.getAttribute('data-exercise-id');
    const exercise=(window.RAF&&Array.isArray(RAF.RAF_EXERCISES)?RAF.RAF_EXERCISES:[]).find(e=>String(e.id)===String(id));
    if(!exercise)return;
    const data=getData();
    const list=data.program.exercises;
    const category=exercise.category;
    let index=-1;
    if(category==='Cardio')index=list.findIndex(e=>e&&e.category==='Cardio');
    else if(category)index=list.findIndex(e=>e&&e.category===category);
    if(index>=0)list[index]=exercise;
    else if(!list.some(e=>e&&e.id===exercise.id))list.push(exercise);
    data.all[data.name]=data.program;
    write('rafPrograms',data.all);
    button.textContent='Saved ✓';
    button.disabled=true;
    setTimeout(redraw,150);
  },true);
  const observer=new MutationObserver(enhance);
  observer.observe(document.body,{childList:true,subtree:true});
  enhance();
})();