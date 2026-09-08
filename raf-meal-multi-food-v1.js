/* RAF Nutrition — unlimited food items per meal */
(function(){'use strict';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch(e){return f}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const key=c=>c?.id||c?.email||c?.name||'default';
function addRows(){
 const form=document.querySelector('#meal-builder'); if(!form||form.dataset.multiFood==='1')return;
 form.dataset.multiFood='1';
 form.querySelectorAll('fieldset.meal-box').forEach((box,m)=>{
   for(let r=5;r<=8;r++){
    const row=document.createElement('div');row.className='form-grid meal-row';
    row.innerHTML=`<select name="food_${m}_${r}"><option value="">Choose another food</option></select><input name="grams_${m}_${r}" type="number" min="0" placeholder="grams">`;
    const source=box.querySelector('select[name^="food_"]');
    if(source)row.querySelector('select').innerHTML=source.innerHTML.replace('Choose food','Choose another food');
    box.appendChild(row);
   }
   const hint=document.createElement('p');hint.className='muted';hint.textContent='You can add several protein, carbohydrate, vegetable, fruit and fat foods in the same meal.';box.appendChild(hint);
 });
 form.addEventListener('submit',function(e){
   e.preventDefault();e.stopImmediatePropagation();
   const all=read('rafNutritionPlans',{}), c=read('rafActiveClient',null)||read('rafProfile',null)||{name:'Client'}, k=key(c), plan=all[k]||{}, totals=[];
   form.querySelectorAll('fieldset.meal-box').forEach(box=>{const x={calories:0,protein:0,carbs:0,fat:0,items:[]};box.querySelectorAll('select[name^="food_"]').forEach(sel=>{const grams=+form.querySelector(`[name="grams_${sel.name.slice(5)}"]`)?.value||0;const i=sel.value;if(i!==''&&grams>0&&window.RAF_FOODS?.[+i]){const f=window.RAF_FOODS[+i],q=grams/100;x.calories+=f[2]*q;x.protein+=f[3]*q;x.carbs+=f[4]*q;x.fat+=f[5]*q;x.items.push({name:f[0],grams})}});x.calories=Math.round(x.calories);x.protein=Math.round(x.protein);x.carbs=Math.round(x.carbs);x.fat=Math.round(x.fat);totals.push(x)});
   plan.mealTotals=totals;all[k]=plan;write('rafNutritionPlans',all);location.hash='nutrition';window.render?.('nutrition');
 },true);
}
new MutationObserver(addRows).observe(document.body,{childList:true,subtree:true});addRows();
})();