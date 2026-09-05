/* RAF Coaching — comprehensive corrective, mobility and flexibility library */
(function(){
  const groups={
    'Low back pain':['Dead Bug','Bird Dog','Glute Bridge','Child’s Pose'],
    'Scoliosis / spinal deviation':['Bird Dog','Dead Bug','Quadruped Thoracic Rotation','Wall Slide'],
    'Anterior pelvic tilt':['Glute Bridge','Dead Bug','Half-kneeling Hip Flexor Stretch'],
    'Rounded shoulders':['Wall Slide','Band Row','Child’s Pose','Quadruped Thoracic Rotation'],
    'Forward head':['Wall Slide','Chin Tuck','Quadruped Thoracic Rotation'],
    'Knees inward':['Supported Split Squat','Glute Bridge','Lateral Band Walk'],
    'Feet turn out':['Knee-to-Wall Ankle Mobility','Glute Bridge','Supported Split Squat'],
    'Shoulder':['Wall Slide','Band Row','Child’s Pose'],
    'Hip':['Glute Bridge','Half-kneeling Hip Flexor Stretch','Supported Split Squat'],
    'Ankle':['Knee-to-Wall Ankle Mobility','Calf Raise'],
    'Back':['Dead Bug','Bird Dog','Child’s Pose'],
    'Thoracic spine':['Quadruped Thoracic Rotation','Wall Slide','Child’s Pose'],
    'Multiple areas':['Cat-Cow Mobility','Dead Bug','Bird Dog','Wall Slide']
  };
  const extra=[
    {id:'chin-tuck',name:'Chin Tuck',pattern:'corrective',level:'beginner',muscles:['deep neck flexors'],equipment:'bodyweight',instruction:'Gently draw the chin straight back without looking down.'},
    {id:'lateral-band-walk',name:'Lateral Band Walk',pattern:'corrective',level:'beginner',muscles:['glute medius'],equipment:'band',instruction:'Keep knees aligned with toes and take controlled side steps.'},
    {id:'cat-cow',name:'Cat-Cow Mobility',pattern:'mobility',level:'beginner',muscles:['spine'],equipment:'bodyweight',instruction:'Move slowly through comfortable spinal flexion and extension.'},
    {id:'child-pose',name:'Child’s Pose',pattern:'flexibility',level:'beginner',muscles:['back','hips'],equipment:'bodyweight',instruction:'Breathe slowly and stay within a comfortable range.'},
    {id:'hip-flexor-stretch',name:'Half-kneeling Hip Flexor Stretch',pattern:'flexibility',level:'beginner',muscles:['hip flexors'],equipment:'bodyweight',instruction:'Tuck the pelvis gently and shift forward without arching.'},
    {id:'wall-slide',name:'Wall Slide',pattern:'corrective',level:'beginner',muscles:['shoulders','upper back'],equipment:'bodyweight',instruction:'Keep ribs controlled and slide arms without pain.'}
  ];
  function install(){
    if(!window.RAF)return;
    RAF.RAF_EXERCISES=RAF.RAF_EXERCISES||[];
    extra.forEach(x=>{if(!RAF.RAF_EXERCISES.some(e=>e.id===x.id))RAF.RAF_EXERCISES.push(x)});
    RAF.RAF_CORRECTIVE_GROUPS=groups;
    RAF.getAssessmentLibrary=function(profile){
      const text=JSON.stringify(profile||{}).toLowerCase();
      const keys=Object.keys(groups).filter(k=>text.includes(k.toLowerCase()));
      const names=[...new Set(keys.flatMap(k=>groups[k]))];
      return RAF.RAF_EXERCISES.filter(e=>names.includes(e.name)).map(e=>({...e,reason:keys.filter(k=>groups[k].includes(e.name)).join(' · ')}));
    };
  }
  install();
  new MutationObserver(install).observe(document.documentElement,{childList:true,subtree:true});
})();