/* RAF Coaching — corrective, mobility and flexibility exercise library */
(function(){
  const extra=[
    {id:'cat-cow',name:'Cat-Cow Mobility',pattern:'mobility',level:'beginner',muscles:['thoracic spine'],equipment:'bodyweight',instruction:'Move slowly through comfortable spinal flexion and extension.'},
    {id:'child-pose',name:'Child’s Pose',pattern:'mobility',level:'beginner',muscles:['back','hips'],equipment:'bodyweight',instruction:'Breathe comfortably and stop if symptoms increase.'},
    {id:'dead-bug',name:'Dead Bug',pattern:'core',level:'beginner',muscles:['core'],equipment:'bodyweight',instruction:'Keep the ribs down and move opposite limbs with control.'},
    {id:'bird-dog',name:'Bird Dog',pattern:'core',level:'beginner',muscles:['core','back'],equipment:'bodyweight',instruction:'Maintain a neutral spine while reaching opposite arm and leg.'},
    {id:'glute-bridge',name:'Glute Bridge',pattern:'hinge',level:'beginner',muscles:['glutes'],equipment:'bodyweight',instruction:'Squeeze glutes without arching the lower back.'},
    {id:'hip-flexor-stretch',name:'Half-kneeling Hip Flexor Stretch',pattern:'flexibility',level:'beginner',muscles:['hip flexors'],equipment:'bodyweight',instruction:'Tuck the pelvis gently and hold a pain-free stretch.'},
    {id:'calf-mobility',name:'Ankle Dorsiflexion Mobility',pattern:'mobility',level:'beginner',muscles:['calves','ankle'],equipment:'bodyweight',instruction:'Drive the knee forward while keeping the heel down.'},
    {id:'wall-slide',name:'Wall Slide',pattern:'mobility',level:'beginner',muscles:['shoulders','thoracic spine'],equipment:'bodyweight',instruction:'Keep the ribs controlled and move only through a comfortable range.'}
  ];
  const original=window.RAF.RAF_EXERCISES; window.RAF.RAF_EXERCISES=[...original,...extra];
  const oldChoose=window.RAF.chooseExercises;
  window.RAF.chooseExercises=function(p={},phase=1){
    const base=oldChoose(p,phase); const selected=[];
    const add=(id)=>{const e=window.RAF.RAF_EXERCISES.find(x=>x.id===id);if(e&&!selected.some(x=>x.id===id))selected.push(e)};
    if(p.posture==='Forward head'||p.posture==='Rounded shoulders'||p.mobility==='Shoulder'||p.flexibility==='Chest/shoulders'){add('wall-slide');add('cat-cow')}
    if(p.mobility==='Ankle'||p.flexibility==='Calves'){add('calf-mobility')}
    if(p.mobility==='Hip'||p.flexibility==='Hip flexors'){add('glute-bridge');add('hip-flexor-stretch')}
    if(p.mobility==='Thoracic spine'||p.mobility==='Multiple areas'){add('cat-cow')}
    if(p.painArea==='Back'||p.posture==='Anterior pelvic tilt'){add('dead-bug');add('bird-dog')}
    return [...selected,...base].slice(0,10);
  };
  window.RAF.RAF_EXERCISES.forEach(e=>{if(!e.pattern)e.pattern='accessory'});
})();
