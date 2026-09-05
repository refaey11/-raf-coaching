/* RAF Coaching — NASM corrective decision layer */
(function(){
  const C={
    'Forward head':{overactive:['upper trapezius','levator scapulae','suboccipitals'],underactive:['deep cervical flexors','lower trapezius'],correctives:['Chin tuck','Thoracic extension','Wall slide']},
    'Rounded shoulders':{overactive:['pectoralis major/minor','latissimus dorsi'],underactive:['mid/lower trapezius','rhomboids','rotator cuff'],correctives:['Doorway pec stretch','Band row','Wall slide']},
    'Anterior pelvic tilt':{overactive:['hip flexors','lumbar extensors'],underactive:['glutes','abdominals'],correctives:['Half-kneeling hip-flexor stretch','Glute bridge','Dead bug']},
    'Knees inward':{overactive:['adductors','lateral gastrocnemius'],underactive:['gluteus medius','external rotators'],correctives:['Hip-abduction activation','Supported squat','Step-down control']},
    'Feet turn out':{overactive:['soleus','lateral gastrocnemius','hip external rotators'],underactive:['medial gastrocnemius','hip internal rotators'],correctives:['Calf mobility','Tripod-foot drill','Controlled squat']}
  };
  const old=window.RAF.buildProgram;
  window.RAF.correctiveRules=C;
  window.RAF.buildProgram=function(p={}){
    const base=old(p), findings=[];
    if(p.posture&&C[p.posture]) findings.push({type:'posture',finding:p.posture,...C[p.posture]});
    if(p.movement==='Needs regression'||p.technique==='needs-regression') findings.push({type:'movement',finding:'Movement quality requires regression',correctives:['Reduce load','Shorten range','Use supported variation']});
    if(p.mobility&&p.mobility!=='none') findings.push({type:'mobility',finding:p.mobility,correctives:['Use pain-free mobility drill','Reassess range before loading']});
    if(p.flexibility&&p.flexibility!=='none') findings.push({type:'flexibility',finding:p.flexibility,correctives:['Use appropriate flexibility method','Avoid forcing end range']});
    if(p.painArea&&p.painArea!=='none') findings.push({type:'safety',finding:p.painArea,correctives:['Stop painful movement','Use regression and refer when symptoms persist']});
    base.corrective=findings;
    base.decision.reason += findings.length?' Corrective findings were recorded and must be addressed before progression.':'';
    if(findings.some(x=>x.type==='safety')) base.decision.status='needs-review';
    return base;
  };
})();