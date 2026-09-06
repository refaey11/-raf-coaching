/* RAF Coaching — role boundary guard */
(function(){
  const read=(k,f=null)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  function sessionProfile(){
    const s=read('rafSession',{}), onboarding=read('rafClientOnboarding',{});
    return {id:s.userId||s.id||null,clientId:s.userId||s.id||null,name:s.name||onboarding.clientName||'Client',age:onboarding.age,goal:onboarding.goal,trainingDays:onboarding.days,days:onboarding.days,equipment:onboarding.equipment};
  }
  const oldRender=window.render;
  window.render=function(view){
    const s=read('rafSession',{});
    if(s.role==='client' && view==='nutrition'){
      const p=sessionProfile();
      localStorage.setItem('rafProfile',JSON.stringify(p));
      oldRender?.(view);
      setTimeout(()=>{
        const select=document.querySelector('#raf-nutrition-client');
        if(select){
          const label=select.closest('label');
          if(label) label.remove(); else select.remove();
        }
        const title=document.querySelector('#app-content .hero h2');
        if(title) title.textContent=(p.name||'Client')+' · Nutrition';
      },0);
      return;
    }
    return oldRender?.(view);
  };
})();
