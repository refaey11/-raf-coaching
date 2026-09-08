(function(){
  const originalRender=window.render;
  const foods={
    'Eggs':[70,6,0,5],
    'Chicken breast':[165,31,0,4],
    'Tuna':[116,26,0,1],
    'Domty white cheese':[250,14,4,20],
    'Rice cooked':[130,3,28,0],
    'Oats':[389,17,66,7],
    'Potato':[87,2,20,0],
    'Banana':[89,1,23,0],
    'Apple':[52,0,14,0],
    'Olive oil':[884,0,0,100],
    'Almonds':[579,21,22,50],
    'Vegetables':[30,2,6,0]
  };
  function addRemaining(){
    if(location.hash.slice(1)!=='nutrition') return;
    const root=document.querySelector('#app-content');
    if(!root || root.querySelector('.raf-remaining-targets')) return;
    const target=[...root.querySelectorAll('.card')].find(x=>x.querySelector('#save-meals'));
    if(!target) return;
    const plan=JSON.parse(localStorage.getItem('rafNutritionPlans')||'{}');
    const client=JSON.parse(localStorage.getItem('rafActiveClient')||'null')||JSON.parse(localStorage.getItem('rafProfile')||'null')||{};
    const key=client.id||client.email||client.name||'default';
    const n=plan[key]||{};
    const card=document.createElement('div');
    card.className='card raf-remaining-targets';
    card.innerHTML='<small>REMAINING TARGETS</small><div class="raf-remaining-grid"><div><span>Calories remaining</span><strong data-rem="cal">0 kcal</strong><small data-used="cal">Used 0 kcal</small></div><div><span>Protein remaining</span><strong data-rem="protein">0 g</strong><small data-used="protein">Used 0 g</small></div><div><span>Carbs remaining</span><strong data-rem="carbs">0 g</strong><small data-used="carbs">Used 0 g</small></div><div><span>Fat remaining</span><strong data-rem="fat">0 g</strong><small data-used="fat">Used 0 g</small></div></div>';
    target.insertAdjacentElement('afterend',card);
    const update=()=>{
      const used=[0,0,0,0];
      target.querySelectorAll('.meal-row').forEach(row=>{
        const food=foods[row.querySelector('select')?.value];
        const grams=Number(row.querySelector('input')?.value||0);
        if(food){for(let i=0;i<4;i++) used[i]+=food[i]*grams/100;}
      });
      const goals=[Number(n.calories||0),Number(n.protein||0),Number(n.carbs||0),Number(n.fat||0)];
      const names=['cal','protein','carbs','fat'];
      const units=['kcal','g','g','g'];
      names.forEach((name,i)=>{
        card.querySelector('[data-rem="'+name+'"]').textContent=Math.max(0,Math.round(goals[i]-used[i]))+' '+units[i];
        card.querySelector('[data-used="'+name+'"]').textContent='Used '+Math.round(used[i])+' / '+Math.round(goals[i])+' '+units[i];
      });
    };
    target.querySelectorAll('select,input').forEach(el=>el.addEventListener('input',update));
    target.querySelectorAll('select,input').forEach(el=>el.addEventListener('change',update));
    update();
  }
  window.render=function(name){originalRender(name);setTimeout(addRemaining,0);};
  if(location.hash.slice(1)==='nutrition') setTimeout(addRemaining,0);
})();