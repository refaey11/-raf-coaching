/* RAF Coaching — replace Stair Climber with StairMaster */
(function(){
  const stair={id:'stairmaster',name:'StairMaster',category:'Cardio',finding:'Cardiovascular conditioning / lower-body endurance',level:'Intermediate',equipment:'StairMaster machine',sets:'1',duration:'10–20 min',tempo:'Steady',rest:'—',instruction:'Use a controlled pace and avoid leaning heavily on the handles.'};
  function clean(){
    if(!window.RAF)return;
    RAF.RAF_EXERCISES=Array.isArray(RAF.RAF_EXERCISES)?RAF.RAF_EXERCISES:[];
    RAF.RAF_EXERCISES=RAF.RAF_EXERCISES.filter(e=>e.id!=='stair-climber'&&e.name!=='Stair Climber');
    if(!RAF.RAF_EXERCISES.some(e=>e.id==='stairmaster'))RAF.RAF_EXERCISES.push(stair);
    document.querySelectorAll('article,button,div,section').forEach(el=>{
      if(el.children.length>0 && el.textContent.trim()==='Stair Climber') el.remove();
    });
    document.querySelectorAll('article').forEach(card=>{
      if(card.textContent.includes('Stair Climber')) card.remove();
    });
  }
  clean();
  new MutationObserver(clean).observe(document.body,{childList:true,subtree:true});
})();
