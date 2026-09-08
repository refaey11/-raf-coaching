/* RAF Coaching — persist and restore nutrition meal rows */
(function(){'use strict';
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch(e){return f}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const client=()=>read('rafActiveClient',null)||read('rafProfile',null)||{name:'Client'};
const key=c=>c?.id||c?.email||c?.name||'default';
function restore(){
 const plan=read('rafNutritionPlans',{})[key(client())]; if(!plan||!plan.mealItems)return;
 Object.entries(plan.mealItems).forEach(([name,value])=>{const el=document.querySelector(`[name="${CSS.escape(name)}"]`);if(el)el.value=value});
}
function saveRows(){
 const form=document.querySelector('#meal-builder'); if(!form)return;
 const items={}; form.querySelectorAll('select[name^="food_"],input[name^="grams_"]').forEach(el=>items[el.name]=el.value);
 const all=read('rafNutritionPlans',{}),k=key(client()); all[k]=all[k]||{}; all[k].mealItems=items; write('rafNutritionPlans',all);
}
document.addEventListener('submit',e=>{if(e.target?.id==='meal-builder')setTimeout(saveRows,50)},true);
new MutationObserver(()=>{if(document.querySelector('#meal-builder'))setTimeout(restore,0)}).observe(document.body,{childList:true,subtree:true});
})();
