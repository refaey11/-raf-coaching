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
  const original=window.RAF.RAF_EXERCISES||[];
  const chapter7=[
    {id:'smr-gastrocnemius-soleus',name:'Gastrocnemius/Soleus Foam Roll',name_ar:'تحرير العضلة التوأمية والنعلية بالرول',pattern:'flexibility',level:'beginner',muscles:['calves'],equipment:'foam roll',instruction:'Roll slowly to locate a tender spot, then hold until discomfort reduces; minimum 30 seconds.',method:'self-myofascial release',opt_phases:[1]},
    {id:'smr-tfl-it-band',name:'Tensor Fascia Latae/Iliotibial Band Foam Roll',name_ar:'تحرير TFL/الشريط الحرقفي الظنبوبي بالرول',pattern:'flexibility',level:'beginner',muscles:['TFL','IT band'],equipment:'foam roll',instruction:'Roll slowly from the hip toward the lateral knee and hold the tender spot until discomfort reduces; minimum 30 seconds.',method:'self-myofascial release',opt_phases:[1]},
    {id:'ais-90-90-hamstring',name:'90/90 Hamstring',name_ar:'إطالة أوتار الركبة 90/90',pattern:'flexibility',level:'intermediate',muscles:['hamstrings'],equipment:'bodyweight',instruction:'Perform controlled active-isolated repetitions with a 1–2 second hold for 5–10 reps.',method:'active-isolated',opt_phases:[2,3,4]},
    {id:'ais-supine-biceps-femoris',name:'Supine Biceps Femoris',name_ar:'إطالة العضلة ذات الرأسين الفخذية من الاستلقاء',pattern:'flexibility',level:'intermediate',muscles:['hamstrings'],equipment:'bodyweight',instruction:'Perform controlled active-isolated repetitions with a 1–2 second hold for 5–10 reps.',method:'active-isolated',opt_phases:[2,3,4]},
    {id:'ais-active-pectoral',name:'Active Pectoral Stretch',name_ar:'إطالة الصدر النشطة',pattern:'flexibility',level:'intermediate',muscles:['chest'],equipment:'bodyweight',instruction:'Use controlled active-isolated repetitions with a 1–2 second hold for 5–10 reps.',method:'active-isolated',opt_phases:[2,3,4]},
    {id:'ais-levator-scapulae',name:'Levator Scapulae',name_ar:'إطالة رافعة لوح الكتف',pattern:'flexibility',level:'intermediate',muscles:['neck','shoulders'],equipment:'bodyweight',instruction:'Use controlled active-isolated repetitions with a 1–2 second hold for 5–10 reps.',method:'active-isolated',opt_phases:[2,3,4]},
    {id:'dynamic-leg-swings-front-back',name:'Leg Swings: Front to Back',name_ar:'مرجحة الرجل أمامًا وخلفًا',pattern:'flexibility',level:'advanced',muscles:['hips','hamstrings'],equipment:'bodyweight',instruction:'Perform dynamic movement through a controlled comfortable range; regress if compensations appear.',method:'dynamic',opt_phases:[5]},
    {id:'dynamic-leg-swings-side-side',name:'Leg Swings: Side to Side',name_ar:'مرجحة الرجل جانبيًا',pattern:'flexibility',level:'advanced',muscles:['hips','adductors'],equipment:'bodyweight',instruction:'Perform dynamic movement through a controlled comfortable range; regress if compensations appear.',method:'dynamic',opt_phases:[5]},
    {id:'dynamic-lunge-with-rotation',name:'Lunge with Rotation',name_ar:'اندفاع مع دوران',pattern:'flexibility',level:'advanced',muscles:['hips','thoracic spine'],equipment:'bodyweight',instruction:'Perform dynamic movement with optimal neuromuscular control; regress if compensations appear.',method:'dynamic',opt_phases:[5]},
    {id:'dynamic-push-up-with-rotation',name:'Push-up with Rotation',name_ar:'ضغط مع دوران',pattern:'flexibility',level:'advanced',muscles:['chest','thoracic spine'],equipment:'bodyweight',instruction:'Perform dynamic movement with optimal neuromuscular control; regress if compensations appear.',method:'dynamic',opt_phases:[5]}
  ];
  window.RAF.RAF_EXERCISES=[...original,...extra,...chapter7.filter(x=>!original.some(y=>y.id===x.id))];
  const oldChoose=window.RAF.chooseExercises;
  if(oldChoose) window.RAF.chooseExercises=function(p={},phase=1){
    const base=oldChoose(p,phase),selected=[];const add=id=>{const e=window.RAF.RAF_EXERCISES.find(x=>x.id===id);if(e&&!selected.some(x=>x.id===id))selected.push(e)};
    if(p.posture==='Forward head'||p.posture==='Rounded shoulders'||p.mobility==='Shoulder'||p.flexibility==='Chest/shoulders'){add('wall-slide');add('cat-cow');add('ais-active-pectoral');}
    if(p.mobility==='Ankle'||p.flexibility==='Calves'){add('calf-mobility');add('smr-gastrocnemius-soleus');}
    if(p.mobility==='Hip'||p.flexibility==='Hip flexors'){add('glute-bridge');add('hip-flexor-stretch');}
    if(p.mobility==='Thoracic spine'||p.mobility==='Multiple areas'){add('cat-cow');add('dynamic-lunge-with-rotation');}
    if(p.painArea==='Back'||p.posture==='Anterior pelvic tilt'){add('dead-bug');add('bird-dog');}
    return [...selected,...base].slice(0,10);
  };
  window.RAF.RAF_EXERCISES.forEach(e=>{if(!e.pattern)e.pattern='accessory';if(!e.name_ar)e.name_ar=e.name;});
  window.RAF.NASM_CH7={exercises:chapter7,source:'NASM Essentials of Personal Fitness Training Sixth Edition, Chapter 7'};
})();
