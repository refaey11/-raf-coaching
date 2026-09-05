/* RAF Coaching — StairMaster naming and direct cardio replacement */
(function(){
  const CARDIO_IDS=['walking-cardio','stair-climber','stairmaster','jump-rope','rowing-machine','ski-erg','elliptical'];
  const stair={id:'stairmaster',name:'StairMaster',category:'Cardio',finding:'Cardiovascular conditioning / lower-body endurance',level:'Intermediate',equipment:'StairMaster machine',sets:'1',duration:'10–20 min',tempo:'Steady',rest:'—',instruction:'Use a controlled pace and avoid leaning heavily on the handles.'};
  function run(){
    if(!window.RAF)return;
    RAF.RAF_EXERCISES=RAF.RAF_EXERCISES||[];
    RAF.RAF_EXERCISES=RAF.RAF_EXERCISES.filter(e=>e.id!=='stair-climber'&&e.name!=='Stair Climber');
    if(!RAF.RAF_EXERCISES.some(e=>e.id===stair.id))RAF.RAF_EXERCISES.push(stair);
    document.querySelectorAll('#assessment-findings article,#raf-machine-library article').forEach(card=>{if(card.textContent.includes('Stair Climber'))card.remove()});
    document.querySelectorAll('#assessment-findings .library-section').forEach(section=>{if(section.textContent.includes('Cardio')){const grid=section.querySelector('.library-grid');if(grid&&!grid.textContent.includes('StairMaster')){const article=document.createElement('article');article.className='workout library-card';article.innerHTML='<strong>StairMaster</strong><div class="muted">Cardiovascular conditioning / lower-body endurance</div><div class="exercise-meta">1 set · 10–20 min · Tempo Steady · Rest —</div><small>Level: Intermediate · Equipment: StairMaster machine</small><p>Use a controlled pace and avoid leaning heavily on the handles.</p><button type="button" class="secondary">Replace current cardio</button>';article.querySelector('button').onclick=function(){const p=JSON.parse(localStorage.getItem('rafProfile')||'{}'),all=JSON.parse(localStorage.getItem('rafPrograms')||'{}'),n=p.name||'Current Client',prog=all[n]||{exercises:[]};prog.exercises=(prog.exercises||[]).filter(e=>e.category!=='Cardio');prog.exercises.push(stair);all[n]=prog;localStorage.setItem('rafPrograms',JSON.stringify(all));this.textContent='Replaced ✓';document.dispatchEvent(new CustomEvent('raf:program-updated'))};grid.appendChild(article)}});
  }
  new MutationObserver(run).observe(document.body,{childList:true,subtree:true});run();
})();
