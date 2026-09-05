/* RAF Coaching — NASM assessment extension
   Adds broader screening fields without replacing the existing app. */
(function(){
  const extra=[
    ['posture','Posture findings','none|Forward head|Rounded shoulders|Anterior pelvic tilt|Knees inward|Feet turn out'],
    ['movement','Movement assessment','not-tested|Good control|Needs regression|Pain or compensation'],
    ['mobility','Mobility limitation','none|Ankle|Hip|Shoulder|Thoracic spine|Multiple areas'],
    ['flexibility','Flexibility limitation','none|Calves|Hip flexors|Hamstrings|Chest/shoulders|Multiple areas'],
    ['painArea','Pain/injury area','none|Knee|Shoulder|Back|Hip|Ankle|Other']
  ];
  function enhance(){
    const form=document.querySelector('#assessment-form');
    if(!form||form.dataset.nasmEnhanced)return;
    form.dataset.nasmEnhanced='1';
    const anchor=form.querySelector('button[type=submit]');
    extra.forEach(([name,label,values])=>{
      const wrap=document.createElement('label');
      wrap.innerHTML=label+'<select name="'+name+'">'+values.split('|').map(v=>'<option value="'+v+'">'+v+'</option>').join('')+'</select>';
      form.insertBefore(wrap,anchor);
    });
    const note=document.createElement('p');note.className='muted';note.textContent='NASM screening: record posture, movement, mobility, flexibility, and pain area before approving progression.';form.insertBefore(note,anchor);
  }
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
  enhance();
})();