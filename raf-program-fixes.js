/* RAF Coaching — program flexibility and screening options */
(function(){
  const extraExercises=[
    {id:'glute-bridge',name:'Glute Bridge',pattern:'hinge',level:'beginner',muscles:['glutes'],equipment:'bodyweight',instruction:'Brace and squeeze glutes without arching.'},
    {id:'split-squat',name:'Supported Split Squat',pattern:'squat',level:'beginner',muscles:['quads','glutes'],equipment:'bodyweight',instruction:'Use support and stay in a pain-free range.'},
    {id:'wall-pushup',name:'Wall Push-up',pattern:'push',level:'beginner',muscles:['chest','triceps'],equipment:'bodyweight',instruction:'Keep ribs down and move with control.'},
    {id:'dead-bug',name:'Dead Bug',pattern:'core',level:'beginner',muscles:['core'],equipment:'bodyweight',instruction:'Maintain neutral spine while moving opposite limbs.'},
    {id:'bird-dog',name:'Bird Dog',pattern:'core',level:'beginner',muscles:['core','back'],equipment:'bodyweight',instruction:'Reach long without rotating the pelvis.'},
    {id:'band-row',name:'Resistance Band Row',pattern:'pull',level:'beginner',muscles:['back','biceps'],equipment:'band',instruction:'Pull elbows back while keeping the trunk stable.'},
    {id:'calf-raise',name:'Calf Raise',pattern:'carry',level:'beginner',muscles:['calves'],equipment:'bodyweight',instruction:'Rise slowly and control the lowering phase.'},
    {id:'mobility-ankle',name:'Knee-to-Wall Ankle Mobility',pattern:'mobility',level:'beginner',muscles:['ankle'],equipment:'bodyweight',instruction:'Move the knee forward without lifting the heel.'},
    {id:'thoracic-rotation',name:'Quadruped Thoracic Rotation',pattern:'mobility',level:'beginner',muscles:['thoracic spine'],equipment:'bodyweight',instruction:'Rotate gently through the upper back.'}
  ];
  function enhance(){
    if(!window.RAF||!document.body)return;
    extraExercises.forEach(x=>{if(!RAF.RAF_EXERCISES.some(e=>e.id===x.id))RAF.RAF_EXERCISES.push(x)});
    const form=document.querySelector('#assessment-form');
    if(form&&!form.dataset.fixEnhanced){
      form.dataset.fixEnhanced='1';
      const anchor=form.querySelector('button[type=submit]');
      [['injuryType','Injury / pain area','none|Knee|Back|Shoulder|Hip|Ankle|Other'],['mobilityNeed','Mobility focus','none|Ankle mobility|Hip mobility|Shoulder mobility|Thoracic mobility|Multiple areas'],['exercisePreference','Exercise preference','all|Bodyweight|Bands|Machines|Dumbbells']].forEach(([n,l,vals])=>{const w=document.createElement('label');w.innerHTML=l+'<select name="'+n+'">'+vals.split('|').map(v=>'<option value="'+v+'">'+v+'</option>').join('')+'</select>';form.insertBefore(w,anchor)});
    }
    const pf=document.querySelector('#program-form');
    if(pf&&!pf.dataset.flexEnhanced){
      pf.dataset.flexEnhanced='1';
      const box=pf.querySelector('.card:nth-of-type(2)'); if(!box)return;
      const add=document.createElement('div');add.className='card';add.innerHTML='<strong>Add exercises</strong><p class="muted">You are not limited to six exercises. Add as many as the session needs.</p><div id="extra-exercises"></div><button type="button" class="secondary" id="add-exercise">+ Add another exercise</button>';
      pf.insertBefore(add,pf.querySelector('button[type=submit]'));
      const list=add.querySelector('#extra-exercises');
      add.querySelector('#add-exercise').onclick=()=>{const s=document.createElement('select');s.name='extra_exercise';s.innerHTML=RAF.RAF_EXERCISES.map(e=>'<option value="'+e.id+'">'+e.name+'</option>').join('');list.appendChild(s)};
      pf.addEventListener('submit',()=>setTimeout(()=>{const saved=JSON.parse(localStorage.getItem('rafPrograms')||'{}');const profile=JSON.parse(localStorage.getItem('rafProfile')||'null');if(!profile)return;const p=saved[profile.name];if(!p)return;const ids=[...list.querySelectorAll('select')].map(s=>s.value);p.exercises=[...p.exercises,...ids.map(id=>RAF.RAF_EXERCISES.find(e=>e.id===id)).filter(Boolean)];saved[profile.name]=p;localStorage.setItem('rafPrograms',JSON.stringify(saved))},50));
    }
  }
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});enhance();
})();