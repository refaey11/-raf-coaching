/* RAF Coaching — machine exercise library + 3D-style visuals */
(function(){
  const machines=[
    {id:'machine-chest-press',name:'Machine Chest Press',category:'Machine Strength',finding:'Chest strength / beginner-friendly pressing',level:'Beginner',equipment:'Chest press machine',sets:'3',reps:'8–12',tempo:'2-1-2',rest:'60–90s',instruction:'Keep shoulders down, wrists neutral, and press without locking aggressively.'},
    {id:'machine-row',name:'Seated Cable / Machine Row',category:'Machine Strength',finding:'Upper-back strength / rounded shoulders support',level:'Beginner',equipment:'Row machine',sets:'3',reps:'10–12',tempo:'2-1-2',rest:'60–90s',instruction:'Pull elbows back while keeping the spine neutral.'},
    {id:'lat-pulldown-machine',name:'Lat Pulldown Machine',category:'Machine Strength',finding:'Back strength / vertical pulling',level:'Beginner',equipment:'Lat pulldown',sets:'3',reps:'8–12',tempo:'2-1-2',rest:'60–90s',instruction:'Pull toward the upper chest without swinging.'},
    {id:'leg-press-machine',name:'Leg Press Machine',category:'Machine Strength',finding:'Lower-body strength with supported trunk',level:'Beginner',equipment:'Leg press',sets:'3',reps:'10–15',tempo:'3-1-2',rest:'90s',instruction:'Use a comfortable range and keep knees tracking over toes.'},
    {id:'leg-curl-machine',name:'Seated / Lying Leg Curl',category:'Machine Strength',finding:'Hamstring strength',level:'Beginner',equipment:'Leg curl machine',sets:'3',reps:'10–15',tempo:'2-1-2',rest:'60s',instruction:'Move smoothly and avoid lifting the hips.'},
    {id:'leg-extension-machine',name:'Leg Extension Machine',category:'Machine Strength',finding:'Quadriceps strength',level:'Beginner',equipment:'Leg extension',sets:'2–3',reps:'10–15',tempo:'2-1-2',rest:'60s',instruction:'Use controlled motion and a pain-free range.'},
    {id:'cable-face-pull',name:'Cable Face Pull',category:'Machine Strength',finding:'Rear delts / scapular control',level:'Beginner',equipment:'Cable machine + rope',sets:'2–3',reps:'12–15',tempo:'2-1-2',rest:'45–60s',instruction:'Pull toward the face while keeping ribs controlled.'}
  ];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function visual(name){return '<div class="raf-3d-visual" aria-label="3D exercise illustration"><div class="raf-3d-person">●<br>╱│╲<br>╱ ╲</div><div class="raf-3d-machine">▰━━▰<br>┃ ▣ ┃<br>┗━━━┛</div><small>3D exercise guide</small></div>'}
  function install(){
    if(!window.RAF)return;
    RAF.RAF_EXERCISES=RAF.RAF_EXERCISES||[];
    machines.forEach(x=>{if(!RAF.RAF_EXERCISES.some(e=>e.id===x.id))RAF.RAF_EXERCISES.push(x)});
    if(document.querySelector('#program-form')&&!document.querySelector('#raf-machine-library')){
      const box=document.createElement('section');box.id='raf-machine-library';box.className='library-section';
      box.innerHTML='<h3>🏋️ Machine Exercises</h3><p class="muted">بدائل أجهزة الجيم مع شكل توضيحي ثلاثي الأبعاد.</p><div class="library-grid">'+machines.map(e=>'<article class="workout library-card machine-card">'+visual(e.name)+'<strong>'+esc(e.name)+'</strong><div class="muted">'+esc(e.finding)+'</div><div class="exercise-meta">'+e.sets+' sets · '+e.reps+' · Tempo '+e.tempo+' · Rest '+e.rest+'</div><small>Equipment: '+esc(e.equipment)+'</small><p>'+esc(e.instruction)+'</p><button type="button" class="secondary raf-machine-add" data-id="'+e.id+'">Add to program</button></article>').join('')+'</div>';
      document.querySelector('#program-form').appendChild(box);
      box.querySelectorAll('.raf-machine-add').forEach(btn=>btn.onclick=()=>{const ex=machines.find(x=>x.id===btn.dataset.id);const p=JSON.parse(localStorage.getItem('rafProfile')||'{}'),all=JSON.parse(localStorage.getItem('rafPrograms')||'{}'),n=p.name||'Current Client',prog=all[n]||{exercises:[]};prog.exercises=Array.isArray(prog.exercises)?prog.exercises:[];if(!prog.exercises.some(x=>x.id===ex.id))prog.exercises.push(ex);all[n]=prog;localStorage.setItem('rafPrograms',JSON.stringify(all));btn.textContent='Added ✓';btn.disabled=true;document.dispatchEvent(new CustomEvent('raf:program-updated'))});
    }
  }
  new MutationObserver(install).observe(document.body,{childList:true,subtree:true});install();
})();