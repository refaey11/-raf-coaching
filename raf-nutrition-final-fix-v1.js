/* RAF Nutrition: authoritative calculator and save handler */
(function(){'use strict';
const read=(k,f)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?f:v}catch(e){return f}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const foods=()=>Array.isArray(window.RAF_FOODS)?window.RAF_FOODS:[];
const client=()=>read('rafActiveClient',null)||read('rafProfile',null)||{name:'Client'};
const key=c=>c&&(c.id||c.email||c.name)||'default';
function calc(form){return [...form.querySelectorAll('fieldset.meal-box')].map(box=>{const x={calories:0,protein:0,carbs:0,fat:0,items:[]};box.querySelectorAll('select[name^="food_"]').forEach(s=>{const suffix=s.name.slice(5),g=Number(form.querySelector('[name="grams_'+suffix+'"]')?.value)||0,f=foods()[Number(s.value)];if(f&&g>0){const q=g/100;x.calories+=f[2]*q;x.protein+=f[3]*q;x.carbs+=f[4]*q;x.fat+=f[5]*q;x.items.push({name:f[0],grams:g})}});['calories','protein','carbs','fat'].forEach(k=>x[k]=Math.round(x[k]));return x})}
function show(form,t){let el=document.getElementById('raf-authoritative-total');if(!el){el=document.createElement('section');el.id='raf-authoritative-total';el.className='card';form.parentNode.appendChild(el)}const sum=k=>t.reduce((a,x)=>a+x[k],0);el.innerHTML='<p class="eyebrow">CALCULATED TOTALS</p>'+t.map((x,i)=>'<p><b>Meal '+(i+1)+':</b> '+x.calories+' kcal · P '+x.protein+'g · C '+x.carbs+'g · F '+x.fat+'g</p>').join('')+'<p><b>Day total:</b> '+sum('calories')+' kcal · P '+sum('protein')+'g · C '+sum('carbs')+'g · F '+sum('fat')+'g</p>'}
function saveMeals(form){const all=read('rafNutritionPlans',{}),k=key(client()),p=all[k]||{};p.mealTotals=calc(form);p.meals=p.mealTotals.length;all[k]=p;write('rafNutritionPlans',all);show(form,p.mealTotals)}
function bind(){const f=document.getElementById('meal-builder');if(f&&!f.dataset.authCalc){f.dataset.authCalc='1';const r=()=>show(f,calc(f));f.addEventListener('input',r);f.addEventListener('change',r);r()}}
document.addEventListener('submit',e=>{const f=e.target;if(!(f instanceof HTMLFormElement))return;if(f.id==='meal-builder'){e.preventDefault();e.stopImmediatePropagation();saveMeals(f)}},true);
new MutationObserver(bind).observe(document.body,{childList:true,subtree:true});bind();
})();
