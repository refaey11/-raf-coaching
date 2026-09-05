/* RAF Coaching — comprehensive assessment findings + exercise library */
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
      const groups=[
       ['🧍 Posture / deviation','posture','none|Forward head|Rounded shoulders|Anterior pelvic tilt|Knees inward|Feet turn out|Spinal deviation — refer out'],
       ['🩹 Pain / injury area','injuryType','none|Low back pain|Knee pain|Shoulder pain|Hip pain|Ankle pain|Other'],
       ['🦴 Mobility focus','mobilityNeed','none|Ankle mobility|Hip mobility|Shoulder mobility|Thoracic mobility|Multiple areas'],
       ['🤸 Flexibility focus','flexibilityNeed','none|Calves|Hip flexors|Hamstrings|Chest / shoulders|Multiple areas'],
       ['🎯 Movement quality','movementQuality','not-tested|Good control|Needs regression|Pain or compensation']
      ];
      groups.forEach(([label,name,vals])=>{const w=document.createElement('label');w.innerHTML='<strong>'+label+'</strong><select name="'+name+'">'+vals.split('|').map(v=>'<option>'+esc(v)+'</option>').join('')+'</select>';form.insertBefore(w,anchor)});
    }
    const program=document.querySelector('#program-form');
    if(program&&!document.querySelector('#assessment-findings')){
      const profile=JSON.parse(localStorage.getItem('rafProfile')||'null')||{};
      const keys=[['posture','🧍'],['injuryType','🩹'],['mobilityNeed','🦴'],['flexibilityNeed','🤸'],['movementQuality','🎯'],['painArea','⚠️']];
      const findings=keys.map(([k,icon])=>profile[k]&&profile[k]!=='none'&&profile[k]!=='not-tested'?'<span class="tag">'+icon+' '+esc(profile[k])+'</span>':'').filter(Boolean).join('');
      const related=extras.filter(e=>{const p=JSON.stringify(profile).toLowerCase();return (p.includes('back')&&['corrective','mobility'].includes(e.pattern))||(p.includes('shoulder')&&e.id==='wall-slide')||(p.includes('hip')&&['glute-bridge','hip-flexor-stretch'].includes(e.id))||(p.includes('ankle')&&e.id==='mobility-ankle')||(p.includes('thoracic')&&e.id==='thoracic-rotation')||(p.includes('pelvic')&&['dead-bug','bird-dog'].includes(e.id))||p.includes('multiple')||p.includes('deviation')});
      const card=document.createElement('div');card.id='assessment-findings';card.className='card';card.innerHTML='<h3>Assessment findings</h3><p class="muted">Selected findings guide exercise choices. This is not a diagnosis; pain or suspected deviation requires clinical referral.</p><div class="tags">'+(findings||'<span class="muted">No specific findings selected.</span>')+'</div>'+(related.length?'<h3>Recommended corrective / mobility / flexibility library</h3><div>'+related.map(e=>'<div class="workout"><div><strong>'+esc(e.name)+'</strong><div class="muted">'+esc(e.pattern)+' · '+esc(e.muscles.join(' · '))+' · '+esc(e.equipment)+'</div><small>'+esc(e.instruction)+'</small></div><span class="tag">Recommended</span></div>').join('')+'</div>':'');
      program.insertBefore(card,program.firstElementChild);
    }
  }
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});enhance();
})();