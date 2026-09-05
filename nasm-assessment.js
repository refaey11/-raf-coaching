/* RAF Coaching — NASM assessment extension
   Chapter 6: record assessment findings and produce non-diagnostic programming guidance. */
(function(){
  const extra=[
    ['posture','Posture findings','none|Forward head|Rounded shoulders|Anterior pelvic tilt|Knees inward|Feet turn out'],
    ['movement','Movement assessment','not-tested|Good control|Needs regression|Pain or compensation'],
    ['mobility','Mobility limitation','none|Ankle|Hip|Shoulder|Thoracic spine|Multiple areas'],
    ['flexibility','Flexibility limitation','none|Calves|Hip flexors|Hamstrings|Chest/shoulders|Multiple areas'],
    ['painArea','Pain/injury area','none|Knee|Shoulder|Back|Hip|Ankle|Other']
  ];
  const guidance={
    'Knees inward':'Review ankle/hip mobility and lower-extremity control; regress loaded squatting until alignment is acceptable.',
    'Feet turn out':'Review foot/ankle and hip mobility; use a controlled squat variation and reassess.',
    'Anterior pelvic tilt':'Review lumbopelvic control and flexibility; prioritize controlled core and hip work.',
    'Rounded shoulders':'Review shoulder/thoracic mobility and scapular control before progression.',
    'Forward head':'Review cervical/thoracic posture and control; avoid forcing painful ranges.',
    'Pain or compensation':'Stop the provoking assessment, document the finding, and refer when pain or symptoms require medical evaluation.'
  };
  function enhance(){
    const form=document.querySelector('#assessment-form');
    if(!form||form.dataset.nasmEnhanced)return;
    form.dataset.nasmEnhanced='1';
    const anchor=form.querySelector('button[type=submit]');
    extra.forEach(([name,label,values])=>{const wrap=document.createElement('label');wrap.innerHTML=label+'<select name="'+name+'">'+values.split('|').map(v=>'<option value="'+v+'">'+v+'</option>').join('')+'</select>';form.insertBefore(wrap,anchor)});
    const note=document.createElement('p');note.className='muted';note.textContent='Chapter 6: record findings before selecting exercises. Assessment is not a diagnosis.';form.insertBefore(note,anchor);
  }
  function evaluate(){
    const f=document.querySelector('#assessment-form');if(!f)return;
    const data=Object.fromEntries(new FormData(f));const findings=[data.posture,data.movement].filter(x=>x&&x!=='none'&&x!=='not-tested');
    const box=document.querySelector('#nasm-assessment-guidance')||document.createElement('div');box.id='nasm-assessment-guidance';box.className='card';
    box.innerHTML='<h3>Assessment guidance</h3>'+((data.painArea&&data.painArea!=='none')?'<p>'+guidance['Pain or compensation']+'</p>':'')+(findings.length?findings.map(x=>'<p><strong>'+x+':</strong> '+(guidance[x]||'Document the finding and select an appropriate regression before progression.')+'</p>').join(''):'<p class="muted">No flagged finding recorded.</p>');
    f.parentNode.insertBefore(box,f.nextSibling);
  }
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('change',e=>{if(e.target.closest('#assessment-form'))evaluate()});
  enhance();
})();