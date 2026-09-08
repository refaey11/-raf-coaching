/* RAF Coaching — live nutrition remaining cards */
(function(){'use strict';
  const $=s=>document.querySelector(s);
  const num=v=>Math.round(Number(v)||0);
  function getPlan(){
    try{const c=JSON.parse(localStorage.getItem('rafActiveClient')||localStorage.getItem('rafProfile')||'null')||{};const k=c.id||c.email||c.name||'default';const all=JSON.parse(localStorage.getItem('rafNutritionPlans')||'{}');return all[k]||{};}catch(e){return {};}
  }
  function ensureCards(){
    const form=$('#meal-builder'); if(!form) return;
    let box=$('#raf-remaining-cards');
    if(!box){box=document.createElement('section');box.id='raf-remaining-cards';box.className='card';box.innerHTML='<p class="eyebrow">REMAINING TARGETS</p><div class="raf-rem-grid"></div>';form.parentNode.insertBefore(box,form);}
    update();
  }
  function update(){
    const plan=getPlan(), target={calories:num(plan.calories),protein:num(plan.protein),carbs:num(plan.carbs),fat:num(plan.fat)};
    const totals={calories:0,protein:0,carbs:0,fat:0};
    document.querySelectorAll('#meal-builder .meal-row').forEach(row=>{
      const sel=row.querySelector('select'), inp=row.querySelector('input'); if(!sel||!inp||sel.value==='')return;
      const f=(window.RAF_FOODS||[])[Number(sel.value)], g=Number(inp.value)||0; if(!f||g<=0)return; const q=g/100;
      totals.calories+=f[2]*q; totals.protein+=f[3]*q; totals.carbs+=f[4]*q; totals.fat+=f[5]*q;
    });
    const data=[['calories','Calories','kcal'],['protein','Protein','g'],['carbs','Carbs','g'],['fat','Fat','g']];
    const box=$('#raf-remaining-cards'); if(!box)return;
    box.querySelector('.raf-rem-grid').innerHTML=data.map(([k,l,u])=>{const rem=Math.max(0,target[k]-totals[k]);return `<div class="raf-rem-card"><span>${l} remaining</span><strong>${num(rem)} <small>${u}</small></strong><em>Used ${num(totals[k])} / ${target[k]||0} ${u}</em></div>`}).join('');
  }
  const style=document.createElement('style');style.textContent='#raf-remaining-cards{margin:16px 0}.raf-rem-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}.raf-rem-card{padding:14px;border:1px solid var(--border,#ddd);border-radius:14px;background:var(--surface,#fff)}.raf-rem-card span,.raf-rem-card em{display:block;font-size:.8rem;color:var(--muted,#777)}.raf-rem-card strong{display:block;font-size:1.45rem;margin:6px 0}.raf-rem-card small{font-size:.75rem}.raf-rem-card em{font-style:normal}@media(max-width:700px){.raf-rem-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}';document.head.appendChild(style);
  const old=window.render;window.render=function(v){const r=old&&old.apply(this,arguments);if(v==='nutrition')setTimeout(ensureCards,0);return r;};
  document.addEventListener('input',e=>{if(e.target.closest('#meal-builder'))update();});document.addEventListener('change',e=>{if(e.target.closest('#meal-builder'))update();});
  setTimeout(ensureCards,100);
})();
