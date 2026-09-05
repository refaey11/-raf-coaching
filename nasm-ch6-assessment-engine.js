/* RAF Coaching — NASM Chapter 6 assessment engine
   Converts recorded findings into coaching actions without diagnosing. */
(function(){
  const rules={
    posture:{
      'Forward head':{focus:'postural control',action:'Regress loaded overhead work; prioritize thoracic mobility and cervical/scapular control.'},
      'Rounded shoulders':{focus:'scapular control',action:'Prioritize thoracic mobility, scapular retraction/depression and controlled pulling.'},
      'Anterior pelvic tilt':{focus:'lumbopelvic control',action:'Prioritize hip-flexor mobility, glute activation and core control.'},
      'Knees inward':{focus:'lower-extremity alignment',action:'Regress single-leg loading; prioritize hip-abductor control and knee tracking.'},
      'Feet turn out':{focus:'lower-extremity alignment',action:'Check ankle/hip mobility and regress depth or load until alignment is controlled.'}
    },
    movement:{
      'Needs regression':{action:'Use a simpler variation and reassess technique before progression.'},
      'Pain or compensation':{action:'Stop the provoking movement, document the response and refer when pain persists or is unexplained.'}
    },
    mobility:{'Ankle':{action:'Use ankle mobility work and reduce depth/load until the required range is controlled.'},'Hip':{action:'Use hip mobility work and controlled range of motion.'},'Shoulder':{action:'Use shoulder/thoracic mobility work and avoid painful ranges.'},'Thoracic spine':{action:'Use thoracic mobility work before loaded movement.'},'Multiple areas':{action:'Use a conservative regression and address the limiting areas separately.'}},
    flexibility:{'Calves':{action:'Add calf flexibility work before reassessing squat/lunge mechanics.'},'Hip flexors':{action:'Add hip-flexor flexibility work and reassess lumbopelvic position.'},'Hamstrings':{action:'Add hamstring flexibility work and reassess hinge mechanics.'},'Chest/shoulders':{action:'Add chest/shoulder flexibility work and reassess overhead/scapular control.'},'Multiple areas':{action:'Address the limiting areas separately before progression.'}}
  };
  function derive(data){
    const findings=[]; const keys=['posture','movement','mobility','flexibility'];
    keys.forEach(k=>{const v=data&&data[k]; if(!v||v==='none'||v==='not-tested'||v==='Good control')return; const r=rules[k]&&rules[k][v]; if(r)findings.push({source:k,value:v,...r});});
    if(data&&data.painArea&&data.painArea!=='none')findings.push({source:'painArea',value:data.painArea,focus:'pain/injury flag',action:'Do not progress through pain; document symptoms and refer to an appropriate healthcare professional when indicated.'});
    return {findings,ready:findings.length===0};
  }
  window.RAF_NASM_CH6={rules,derive};
})();
