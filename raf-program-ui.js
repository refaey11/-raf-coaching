/* RAF Coaching — program UI fixes */
(function(){
  function getData(){
    const profile=JSON.parse(localStorage.getItem('rafProfile')||'{}');
    const all=JSON.parse(localStorage.getItem('rafPrograms')||'{}');
    const name=profile.name||'Current Client';
    const p=all[name]||(window.RAF&&RAF.buildProgram?RAF.buildProgram(profile):{exercises:[]});
    p.exercises=Array.isArray(p.exercises)?p.exercises:[];
    return {profile,all,name,p};
  }
  function save(d){d.all[d.name]=d.p;localStorage.setItem('rafPrograms',JSON.stringify(d.all));}
  function refresh(){if(location.hash.replace('#','')==='program'&&typeof window.render==='function')window.render('program');}
  function enhance(){
    const program=document.querySelector('#program-form');
    if(!program||document.querySelector('#raf-extra-program-panel'))return;
    const d=getData();
    const panel=document.createElement('div');panel.id='raf-extra-program-panel';panel.className='card';
    panel.innerHTML='<h3>Exercise selection & replacements</h3><p class="muted">Your program can contain more than six exercises. Add mobility, corrective, flexibility, or cardio alternatives, then refresh the program view.</p><div class="raf-replace-grid"></div>';
    const grid=panel.querySelector('.raf-replace-grid');
    const extras=(window.RAF&&RAF.RAF_EXERCISES||[]).filter(e=>['Corrective / Injury','Mobility','Flexibility','Cardio'].includes(e.category));
    extras.forEach(e=>{const row=document.createElement('div');row.className='workout';row.innerHTML='<div><strong>'+e.name+'</strong><div class="muted">'+(e.category||'')+' · '+(e.finding||'')+'</div><small>'+(e.sets||'')+' sets · '+(e.reps||e.duration||'')+' · '+(e.equipment||'')+'</small></div><button type="button" class="secondary">Add / replace</button>';row.querySelector('button').onclick=()=>{const current=d.p.exercises||[];const cat=e.category==='Cardio'?'Cardio':e.category;let idx=current.findIndex(x=>x.category===cat);if(idx<0)idx=current.findIndex(x=>String(x.name||'').toLowerCase().includes('cardio'));if(cat==='Cardio'&&idx>=0)current[idx]=e;else if(!current.some(x=>x.id===e.id))current.push(e);d.p.exercises=current;save(d);refresh();};grid.appendChild(row);});
    program.insertBefore(panel,program.firstElementChild);
  }
  document.addEventListener('raf:program-updated',refresh);
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
  enhance();
})();