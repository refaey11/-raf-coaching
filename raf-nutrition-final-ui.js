/* RAF Nutrition UI: keep existing controls, move remaining cards to the bottom, and update live. */
(function(){'use strict';
  const q=s=>document.querySelector(s);
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch(e){return f}};
  const client=()=>read('rafActiveClient',null)||read('rafProfile',null)||{name:'Client'};
  const key=c=>c?.id||c?.email||c?.name||'default';
  const foods=()=>window.RAF_FOODS||[];
  function locate(){
    const all=[...document.querySelectorAll('section,div')];
    return all.find(x=>/REMAINING TARGETS|Calories remaining/i.test(x.textContent||'') && x.querySelectorAll('input,select').length===0);
  }
  function move(){
    const card=locate();
    const builder=q('#meal-builder');
    if(card&&builder){const section=builder.closest('section')||builder; if(section.parentElement && card.parentElement!==section.parentElement) section.parentElement.appendChild(card); else if(card!==section.parentElement.lastElementChild) section.parentElement.appendChild(card);}
    update();
  }
  function update(){
    const card=locate(); if(!card)return;
    const plan=read('rafNutritionPlans',{})[key(client())]||{};
    let used={calories:0,protein:0,carbs:0,fat:0};
    document.querySelectorAll('#meal-builder select').forEach((sel,i)=>{
      const row=sel.closest('.meal-row')||sel.parentElement; const grams=+(row?.querySelector('input')?.value||0); const f=foods()[+sel.value];
      if(f&&grams>0){const k=grams/100;used.calories+=f[2]*k;used.protein+=f[3]*k;used.carbs+=f[4]*k;used.fat+=f[5]*k;}
    });
    const vals={calories:Math.round(used.calories),protein:Math.round(used.protein),carbs:Math.round(used.carbs),fat:Math.round(used.fat)};
    const targets={calories:+plan.calories||0,protein:+plan.protein||0,carbs:+plan.carbs||0,fat:+plan.fat||0};
    const labels={calories:'Calories',protein:'Protein',carbs:'Carbs',fat:'Fat'};
    Object.keys(labels).forEach(k=>{const nodes=[...card.querySelectorAll('*')].filter(n=>n.children.length===0&&new RegExp(labels[k]+' remaining','i').test(n.textContent||'')); const box=nodes[0]?.parentElement; if(box){const num=[...box.querySelectorAll('*')].find(n=>n.children.length===0&&/^[-\d,]+/.test((n.textContent||'').trim())); if(num)num.textContent=Math.max(0,Math.round(targets[k]-vals[k])).toLocaleString(); const usedNode=[...box.querySelectorAll('*')].find(n=>n.children.length===0&&/Used /i.test(n.textContent||'')); if(usedNode)usedNode.textContent=`Used ${Math.round(vals[k]).toLocaleString()} / ${Math.round(targets[k]).toLocaleString()} ${k==='calories'?'kcal':'g'}`;}});
  }
  function boot(){move(); document.addEventListener('input',update,true); document.addEventListener('change',()=>setTimeout(update,0),true); new MutationObserver(()=>move()).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
