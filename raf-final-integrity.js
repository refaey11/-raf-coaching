/* RAF Coaching — final runtime integrity layer */
(function(){
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const idOf=c=>c&&(c.id||c.clientId||c.name);
  function repair(){
    const clients=read('rafClients',[]), programs=read('rafPrograms',{}), nutrition=read('rafNutrition',{});
    const byName=Object.fromEntries(clients.map(c=>[String(c.name||'').trim(),c]));
    const outPrograms={};
    Object.keys(programs).forEach(k=>{
      const c=clients.find(x=>x.id===k||x.clientId===k||x.name===k)||byName[k];
      const key=idOf(c)||k, p=programs[k]||{};
      if(c){p.clientId=key;p.clientName=c.name}
      outPrograms[key]=p;
    });
    const outNutrition={};
    Object.keys(nutrition).forEach(k=>{
      const c=clients.find(x=>x.id===k||x.clientId===k||x.name===k)||byName[k];
      outNutrition[idOf(c)||k]=nutrition[k];
    });
    write('rafPrograms',outPrograms); write('rafNutrition',outNutrition);
    const active=read('rafActiveClientId',null), profile=read('rafProfile',null);
    const c=clients.find(x=>x.id===active||x.clientId===active)||profile;
    if(c){write('rafActiveClientId',idOf(c));write('rafProfile',c)}
    window.RAF_HEALTH={clients:clients.length,programKeys:Object.keys(outPrograms).length,nutritionKeys:Object.keys(outNutrition).length,activeClientId:idOf(c)||null,ok:clients.length===0||!!c};
  }
  window.RAF_REPAIR=repair;
  document.addEventListener('DOMContentLoaded',repair);
})();