/* RAF Nutrition final calculation fix */
(function(){'use strict';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch(e){return f}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const client=()=>read('rafActiveClient',null)||read('rafProfile',null)||{name:'Client'};
const key=c=>c?.id||c?.email||c?.name||'default';
function calculate(form){
 const foods=window.RAF_FOODS||[]; const totals=[];
 form.querySelectorAll('fieldset.meal-box').forEach(box=>{
  const x={calories:0,protein:0,carbs:0,fat:0,items:[]};
  box.querySelectorAll('select[name^="food_"]').forEach(sel=>{
   const suffix=sel.name.slice(5), grams=Number(form.querySelector(`[name="grams_${suffix}"]`)?.value)||0, f=foods[Number(sel.value)];
   if(f&&grams>0){const q=grams/100;x.calories+=Number(f[2])*q;x.protein+=Number(f[3])*q;x.carbs+=Number(f[4])*q;x.fat+=Number(f[5])*q;x.items.push({name:f[0],grams});}
  });
  ['calories','protein','carbs','fat'].forEach(k=>x[k]=Math.round(x[k])); totals.push(x);
 }); return totals;
}
function bind(){
 const form=document.querySelector('#meal-builder'); if(!form||form.dataset.finalFix==='1')return; form.dataset.finalFix='1';
 const show=()=>{let box=document.querySelector('#raf-live-total');if(!box){box=document.createElement('section');box.id='raf-live-total';box.className='card';form.parentNode.appendChild(box)}const t=calculate(form),sum=t.reduce((a,x)=>({calories:a.calories+x.calories,protein:a.protein+x.protein,carbs:a.carbs+x.carbs,fat:a.fat+x.fat}),{calories:0,protein:0,carbs:0,fat:0});box.innerHTML=`<p class="eyebrow">LIVE MEAL TOTALS</p>${t.map((x,i)=>`<p><b>Meal ${i+1}:</b> ${x.calories} kcal · P ${x.protein}g · C ${x.carbs}g · F ${x.fat}g</p>`).join('')}<p><b>Day total:</b> ${sum.calories} kcal · P ${sum.protein}g · C ${sum.carbs}g · F ${sum.fat}g</p>`};
 form.addEventListener('input',show);form.addEventListener('change',show);
 form.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation();const all=read('rafNutritionPlans',{}),k=key(client()),plan=all[k]||{},totals=calculate(form);plan.mealTotals=totals;all[k]=plan;write('rafNutritionPlans',all);if(typeof window.render==='function')window.render('nutrition');},true);show();
}
new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});bind();
})();