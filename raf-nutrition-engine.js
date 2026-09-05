/* RAF Coaching — Nutrition Engine v1 */
(function(){
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function nutrition(){
    const p=read('rafProfile',null); if(!p)return '<div class="card"><h2>Nutrition</h2><p class="muted">Complete the assessment first.</p><button class="primary" data-view="assessment">Open assessment</button></div>';
    const saved=read('rafNutrition',{}), n=saved[p.name]||{};
    return `<div class="hero"><h2>${esc(p.name)} · Nutrition</h2><p class="muted">Initial planning workspace — coach reviews every recommendation.</p></div><form id="raf-nutrition-form" class="card form-grid"><label>Calories<input name="calories" type="number" min="800" max="10000" value="${n.calories||2000}"></label><label>Protein (g)<input name="protein" type="number" min="0" value="${n.protein||150}"></label><label>Carbs (g)<input name="carbs" type="number" min="0" value="${n.carbs||200}"></label><label>Fat (g)<input name="fat" type="number" min="0" value="${n.fat||65}"></label><label>Meals/day<input name="meals" type="number" min="1" max="8" value="${n.meals||4}"></label><label>Notes<textarea name="notes">${esc(n.notes||'')}</textarea></label><button class="primary" type="submit">Save nutrition plan</button><p id="raf-nutrition-status" class="muted"></p></form>`;
  }
  const old=window.render;
  window.render=function(name){if(name!=='nutrition')return old(name);document.querySelector('#page-title').textContent='Nutrition';document.querySelector('#app-content').innerHTML=nutrition();document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.view===name));const f=document.querySelector('#raf-nutrition-form');if(f)f.onsubmit=e=>{e.preventDefault();const p=read('rafProfile',null),d=Object.fromEntries(new FormData(f));d.calories=+d.calories;d.protein=+d.protein;d.carbs=+d.carbs;d.fat=+d.fat;d.meals=+d.meals;const all=read('rafNutrition',{});all[p.name]=d;write('rafNutrition',all);document.querySelector('#raf-nutrition-status').textContent='Saved locally ✓'};};
  document.addEventListener('click',e=>{const b=e.target.closest('[data-view="nutrition"]');if(b){e.preventDefault();location.hash='nutrition';window.render('nutrition')}},true);
})();