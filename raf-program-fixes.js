/* RAF Coaching — assessment library and add-to-program controls */
(function(){
  const extras=[
    {id:'glute-bridge',name:'Glute Bridge',pattern:'corrective',level:'beginner',muscles:['glutes'],equipment:'bodyweight',instruction:'Brace, keep ribs down, and squeeze the glutes without arching.'},
    {id:'dead-bug',name:'Dead Bug',pattern:'corrective',level:'beginner',muscles:['core'],equipment:'bodyweight',instruction:'Maintain a neutral spine while moving opposite limbs slowly.'},
    {id:'bird-dog',name:'Bird Dog',pattern:'corrective',level:'beginner',muscles:['core','back'],equipment:'bodyweight',instruction:'Reach long without rotating the pelvis or lumbar spine.'},
    {id:'wall-slide',name:'Wall Slide',pattern:'corrective',level:'beginner',muscles:['shoulders','upper back'],equipment:'bodyweight',instruction:'Keep the ribs down and slide the arms without pain.'},
    {id:'thoracic-rotation',name:'Quadruped Thoracic Rotation',pattern:'mobility',level:'beginner',muscles:['thoracic spine'],equipment:'bodyweight',instruction:'Rotate gently through the upper back, not the lower back.'},
    {id:'mobility-ankle',name:'Knee-to-Wall Ankle Mobility',pattern:'mobility',level:'beginner',muscles:['ankle'],equipment:'bodyweight',instruction:'Drive the knee forward while keeping the heel down.'},
    {id:'hip-flexor-stretch',name:'Half-kneeling Hip Flexor Stretch',pattern:'flexibility',level:'beginner',muscles:['hip flexors'],equipment:'bodyweight',instruction:'Tuck the pelvis slightly and stretch without lumbar extension.'},
    {id:'cat-cow',name:'Cat-Cow Mobility',pattern:'mobility',level:'beginner',muscles:['spine'],equipment:'bodyweight',instruction:'Move slowly through a comfortable spinal range.'}
  ];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function enhance(){
    if(!window.RAF||!document.body)return;
    extras.forEach(x=>{if(!RAF.RAF_EXERCISES.some(e=>e.id===x.id))RAF.RAF_EXERCISES.push(x)});
    const form=document.querySelector('#assessment-form');
    if(form&&!form.dataset.comprehensive){
      form.dataset.comprehensive='1';
      const anchor=form.querySelector('button[type=submit]');
      [['🧍 Posture / deviation','posture','none|Forward head|Rounded shoulders|Anterior pelvic tilt|Knees inward|Feet turn out|Spinal deviation — refer out'],['🩹 Pain / injury area','injuryType','none|Low back pain|Knee pain|Shoulder pain|Hip pain|Ankle pain|Other'],['🦴 Mobility focus','mobilityNeed','none|Ankle mobility|Hip mobility|Shoulder mobility|Thoracic mobility|Multiple areas'],['🤸 Flexibility focus','flexibilityNeed','none|Calves|Hip flexors|Hamstrings|Chest / shoulders|Multiple areas'],['🎯 Movement quality','movementQuality','not-tested|Good control|Needs regression|Pain or compensation']].forEach(([label,name,vals])=>{const w=document.createElement('label');w.innerHTML='<strong>'+label+'</strong><select name="'+name+'">'+vals.split('|').map(v=>'<option>'+esc(v)+'</option>').join('')+'</select>';form.insertBefore(w,anchor)});
    }
    const program=document.querySelector('#program-form');
    if(program&&!document.querySelector('#assessment-findings')){
      const profile=JSON.parse(localStorage.getItem('rafProfile')||'null')||{};
      const keys=[['posture','🧍'],['injuryType','🩹'],['mobilityNeed','🦴'],['flexibilityNeed','🤸'],['movementQuality','🎯'],['painArea','⚠️']];
      const findings=keys.map(([k,icon])=>profile[k]&&profile[k]!=='none'&&profile[k]!=='not-tested'?'<span class="tag">'+icon+' '+esc(profile[k])+'</span>':'').filter(Boolean).join('');
      const text=JSON.stringify(profile).toLowerCase();
      const related=extras.filter(e=>(text.includes('back')&&['corrective','mobility'].includes(e.pattern))||(text.includes('shoulder')&&e.id==='wall-slide')||(text.includes('hip')&&['glute-bridge','hip-flexor-stretch'].includes(e.id))||(text.includes('ankle')&&e.id==='mobility-ankle')||(text.includes('thoracic')&&e.id==='thoracic-rotation')||(text.includes('pelvic')&&['dead-bug','bird-dog'].includes(e.id))||text.includes('multiple')||text.includes('deviation'));
      const card=document.createElement('div');card.id='assessment-findings';card.className='card';card.innerHTML='<h3>Assessment findings</h3><p class="muted">Selected findings guide exercise choices. This is not a diagnosis; pain or suspected deviation requires clinical referral.</p><div class="tags">'+(findings||'<span class="muted">No specific findings selected.</span>')+'</div>'+(related.length?'<h3>Recommended exercise library</h3><div>'+related.map(e=>'<div class="workout"><div><strong>'+esc(e.name)+'</strong><div class="muted">'+esc(e.pattern)+' · '+esc(e.muscles.join(' · '))+' · '+esc(e.equipment)+'</div><small>'+esc(e.instruction)+'</small></div><button type="button" class="secondary add-library-exercise" data-exercise="'+e.id+'">Add to program</button></div>').join('')+'</div>':'');
      program.insertBefore(card,program.firstElementChild);
      card.querySelectorAll('.add-library-exercise').forEach(btn=>btn.onclick=()=>{const ex=RAF.RAF_EXERCISES.find(e=>e.id===btn.dataset.exercise);if(!ex)return;const saved=JSON.parse(localStorage.getItem('rafPrograms')||'{}');const name=(JSON.parse(localStorage.getItem('rafProfile')||'{}')).name;if(!name)return;const p=saved[name]||RAF.buildProgram(JSON.parse(localStorage.getItem('rafProfile')));p.exercises=p.exercises||[];if(!p.exercises.some(e=>e.id===ex.id))p.exercises.push(ex);saved[name]=p;localStorage.setItem('rafPrograms',JSON.stringify(saved));btn.textContent='Added ✓';btn.disabled=true});
    }
  }
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});enhance();
})();