/* RAF Nutrition final interaction fix */
(function(){
  'use strict';
  const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?f:v}catch(e){return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const foods=()=>window.RAF_FOODS||[];
  const client=()=>read('rafActiveClient',null)||read('rafProfile',null)||{name:'Client'};
  const key=c=>c&& (c.id||c.email||c.name) || 'default';
  const savePlan=p=>{const all=read('rafNutritionPlans',{});all[key(client())]=p;write('rafNutritionPlans',all);return p};
  function calcMeals(form){
    const boxes=[...form.querySelectorAll('fieldset.meal-box')];
    return boxes.map(box=>{
      const out={calories:0,protein:0,carbs:0,fat:0,items:[]};
      box.querySelectorAll('select[name^="food_"]').forEach(sel=>{
        const suffix=sel.name.slice(5), grams=Number(form.querySelector('[name="grams_'+suffix+'"]')?.value)||0;
        const f=foods()[Number(sel.value)];
        if(f&&grams>0){const q=grams/100;out.calories+=f[2]*q;out.protein+=f[3]*q;out.carbs+=f[4]*q;out.fat+=f[5]*q;out.items.push({name:f[0],grams});}
      });
      out.calories=Math.round(out.calories);out.protein=Math.round(out.protein);out.carbs=Math.round(out.carbs);out.fat=Math.round(out.fat);return out;
    });
  }
  function renderTotals(form,totals){
    let el=document.getElementById('raf-final-live-totals');
    if(!el){el=document.createElement('section');el.id='raf-final-live-totals';el.className='card';form.parentNode.appendChild(el);}
    const sum=(k)=>totals.reduce((a,x)=>a+(x[k]||0),0);
    el.innerHTML='<p class="eyebrow">LIVE DAILY TOTALS</p>'+totals.map((x,i)=>'<p><b>Meal '+(i+1)+':</b> '+x.calories+' kcal · P '+x.protein+'g · C '+x.carbs+'g · F '+x.fat+'g</p>').join('')+'<p><b>Day total:</b> '+sum('calories')+' kcal · P '+sum('protein')+'g · C '+sum('carbs')+'g · F '+sum('fat')+'g</p>';
  }
  function calculateTargets(form){
    const d=Object.fromEntries(new FormData(form)),w=Number(d.weight),h=Number(d.height),a=Number(d.age);
    if(!(w>0&&h>0&&a>0)){alert('Please enter weight, height and age first.');return;}
    const rmr=Math.round(d.sex==='male'?10*w+6.25*h-5*a+5:10*w+6.25*h-5*a-161);
    const tdee=Math.round(rmr*Number(d.factor||1.55));
    const calories=Math.max(1200,Math.round(tdee+(d.goal==='fat-loss'?-350:d.goal==='muscle'?250:0)));
    const protein=Math.round(w*(d.goal==='muscle'?2:1.8)),fat=Math.round(w*.8),carbs=Math.max(0,Math.round((calories-protein*4-fat*9)/4));
    const all=read('rafNutritionPlans',{}),old=all[key(client())]||{};
    savePlan({...old,...d,rmr,tdee,calories,protein,fat,carbs,meals:Number(d.meals||old.meals||4)});
    window.render&&window.render('nutrition');
  }
  document.addEventListener('input',e=>{if(e.target.closest('#meal-builder')){const f=e.target.closest('#meal-builder');renderTotals(f,calcMeals(f));}},true);
  document.addEventListener('change',e=>{if(e.target.closest('#meal-builder')){const f=e.target.closest('#meal-builder');renderTotals(f,calcMeals(f));}},true);
  document.addEventListener('submit',e=>{
    const form=e.target;
    if(form.id==='nutrition-calc'){
      e.preventDefault();e.stopImmediatePropagation();calculateTargets(form);
    } else if(form.id==='meal-builder'){
      e.preventDefault();e.stopImmediatePropagation();
      const all=read('rafNutritionPlans',{}),p=all[key(client())]||{};p.mealTotals=calcMeals(form);p.meals=p.mealTotals.length;savePlan(p);renderTotals(form,p.mealTotals);setTimeout(()=>window.render&&window.render('nutrition'),50);
    }
  },true);
})();
