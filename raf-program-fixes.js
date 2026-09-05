/* RAF Coaching — organized assessment exercise library */
(function(){
  const extras=[
    {id:'glute-bridge',name:'Glute Bridge',category:'Corrective / Injury',finding:'Low back pain / anterior pelvic tilt',level:'Beginner',equipment:'Bodyweight',sets:'2–3',reps:'10–15',tempo:'2-1-2',rest:'45–60s',instruction:'Brace, keep ribs down, and squeeze the glutes without arching.'},
    {id:'dead-bug',name:'Dead Bug',category:'Corrective / Injury',finding:'Low back pain / poor core control',level:'Beginner',equipment:'Bodyweight',sets:'2–3',reps:'6–10/side',tempo:'Slow',rest:'45–60s',instruction:'Maintain a neutral spine while moving opposite limbs slowly.'},
    {id:'bird-dog',name:'Bird Dog',category:'Corrective / Injury',finding:'Back pain / spinal control',level:'Beginner',equipment:'Bodyweight',sets:'2–3',reps:'6–10/side',tempo:'Slow',rest:'45–60s',instruction:'Reach long without rotating the pelvis or lumbar spine.'},
    {id:'wall-slide',name:'Wall Slide',category:'Corrective / Injury',finding:'Rounded shoulders / forward head',level:'Beginner',equipment:'Bodyweight',sets:'2–3',reps:'8–12',tempo:'2-1-2',rest:'45–60s',instruction:'Keep ribs down and slide the arms without pain.'},
    {id:'thoracic-rotation',name:'Quadruped Thoracic Rotation',category:'Mobility',finding:'Thoracic / shoulder mobility',level:'Beginner',equipment:'Bodyweight',sets:'2',reps:'8/side',tempo:'Controlled',rest:'30–45s',instruction:'Rotate gently through the upper back, not the lower back.'},
    {id:'mobility-ankle',name:'Knee-to-Wall Ankle Mobility',category:'Mobility',finding:'Ankle mobility / feet turn out',level:'Beginner',equipment:'Bodyweight',sets:'2',duration:'30–45s/side',tempo:'Controlled',rest:'30s',instruction:'Drive the knee forward while keeping the heel down.'},
    {id:'hip-flexor-stretch',name:'Half-kneeling Hip Flexor Stretch',category:'Flexibility',finding:'Hip flexors / anterior pelvic tilt',level:'Beginner',equipment:'Bodyweight',sets:'2',duration:'30–45s/side',tempo:'Breathe',rest:'30s',instruction:'Tuck the pelvis slightly and stretch without lumbar extension.'},
    {id:'cat-cow',name:'Cat-Cow Mobility',category:'Mobility',finding:'Spinal mobility / back stiffness',level:'Beginner',equipment:'Bodyweight',sets:'2',reps:'8–10',tempo:'Slow',rest:'30s',instruction:'Move slowly through a comfortable spinal range.'},
    {id:'walking-cardio',name:'Walking / Treadmill',category:'Cardio',finding:'General conditioning',level:'Beginner',equipment:'Treadmill or outdoor',sets:'1',duration:'15–30 min',tempo:'Conversational pace',rest:'—',instruction:'Maintain a pace where you can speak in full sentences.'}
  ];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const options={
    posture:['none','Forward head','Rounded shoulders','Anterior pelvic tilt','Knees inward','Feet turn out','Spinal deviation — refer out'],
    injuryType:['none','Low back pain','Knee pain','Shoulder pain','Hip pain','Ankle pain','Other'],
    mobilityNeed:['none','Ankle mobility','Hip mobility','Shoulder mobility','Thoracic mobility','Multiple areas'],
    flexibilityNeed:['none','Calves','Hip flexors','Hamstrings','Chest / shoulders','Multiple areas'],
    movementQuality:['not-tested','Good control','Needs regression','Pain or compensation']
  };
  function enhance(){
    if(!window.RAF||!document.body)return;
    RAF.RAF_EXERCISES=RAF.RAF_EXERCISES||[]; extras.forEach(x=>{if(!RAF.RAF_EXERCISES.some(e=>e.id===x.id))RAF.RAF_EXERCISES.push(x)});
    const form=document.querySelector('#assessment-form');
    if(form&&!form.dataset.comprehensive){
      form.dataset.comprehensive='1'; const anchor=form.querySelector('button[type=submit]');
      Object.entries(options).forEach(([name,vals])=>{const w=document.createElement('label');w.innerHTML='<strong>'+({posture:'🧍 Posture / deviation',injuryType:'🩹 Injuries / pain areas',mobilityNeed:'🦴 Mobility problems',flexibilityNeed:'🤸 Flexibility problems',movementQuality:'🎯 Movement quality'}[name])+'</strong><select name="'+name+'" multiple size="4">'+vals.map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join('')+'</select><small class="muted">Hold Ctrl/Cmd to select more than one.</small>';form.insertBefore(w,anchor)});
    }
    const host=document.querySelector('#program-form')||document.querySelector('main')||document.body;
    if(document.querySelector('#assessment-findings'))return;
    const profile=JSON.parse(localStorage.getItem('rafProfile')||'{}'); const text=JSON.stringify(profile).toLowerCase();
    const related=extras.filter(e=>e.category==='Cardio'||text.includes('back')||text.includes('shoulder')||text.includes('hip')||text.includes('ankle')||text.includes('pelvic')||text.includes('mobility')||text.includes('multiple')||text.includes('deviation'));
    const groups=['Corrective / Injury','Mobility','Flexibility','Cardio'];
    const card=document.createElement('div');card.id='assessment-findings';card.className='card';card.innerHTML='<h2>Assessment Exercise Library</h2><p class="muted">اختار أكتر من إصابة أو مشكلة. التمارين متقسمة حسب النوع.</p>'+groups.map(g=>'<section class="library-section"><h3>'+({'Corrective / Injury':'🩹 Injury / Corrective','Mobility':'🦴 Mobility','Flexibility':'🤸 Flexibility','Cardio':'❤️ Cardio'}[g])+'</h3><div class="library-grid">'+related.filter(e=>e.category===g).map(e=>'<article class="workout library-card"><strong>'+esc(e.name)+'</strong><div class="muted">'+esc(e.finding)+'</div><div class="exercise-meta">'+esc(e.sets)+' sets · '+esc(e.reps||e.duration)+' · Tempo '+esc(e.tempo)+' · Rest '+esc(e.rest)+'</div><small>Level: '+esc(e.level)+' · Equipment: '+esc(e.equipment)+'</small><p>'+esc(e.instruction)+'</p><button type="button" class="secondary add-library-exercise" data-exercise="'+e.id+'">Add to program</button></article>').join('')||'<p class="muted">No exercises selected for this section.</p>'+'</div></section>').join('');host.insertBefore(card,host.firstChild);
    card.querySelectorAll('.add-library-exercise').forEach(btn=>btn.onclick=()=>{const ex=RAF.RAF_EXERCISES.find(e=>e.id===btn.dataset.exercise);const pfile=JSON.parse(localStorage.getItem('rafProfile')||'{}');const saved=JSON.parse(localStorage.getItem('rafPrograms')||'{}');const name=pfile.name||'Current Client';const p=saved[name]||RAF.buildProgram(pfile)||{exercises:[]};p.exercises=p.exercises||[];if(!p.exercises.some(e=>e.id===ex.id))p.exercises.push(ex);saved[name]=p;localStorage.setItem('rafPrograms',JSON.stringify(saved));btn.textContent='Added ✓';btn.disabled=true;document.dispatchEvent(new CustomEvent('raf:program-updated'))});
  }
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true}); enhance();
})();