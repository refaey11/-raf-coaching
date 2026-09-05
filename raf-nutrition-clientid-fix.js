/* RAF Coaching — nutrition persistence and daily totals fix */
(function(){
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}, write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const key=p=>p?.id||p?.clientId||p?.name;
  const migrate=()=>{const old=read('rafNutrition',{}), out={}; Object.keys(old).forEach(k=>{const c=read('rafClients',[]).find(x=>x.id===k||x.clientId===k||x.name===k); out[key(c)||k]=old[k]}); write('rafNutrition',out)};
  document.addEventListener('DOMContentLoaded',migrate);
  const oldRender=window.render;
  window.render=function(name){oldRender(name); if(name!=='nutrition')return; const f=document.querySelector('#raf-nutrition-form'), p=read('rafProfile',null); if(!f||!p)return; const status=document.querySelector('#raf-nutrition-status'); const total=()=>{let k=0,pr=0,cb=0,ft=0; document.querySelectorAll('.meal-food').forEach(x=>{const s=x.value.toLowerCase(), grams=t=>{const m=s.match(new RegExp(t+'\\s*(\\d+(?:\\.\\d+)?)?\\s*g?','i'));return m?+(m[1]||100):0}; const db={eggs:[143,13,1,10],oats:[389,17,66,7],chicken:[165,31,0,4],rice:[130,3,28,0],fish:[120,26,0,2],potatoes:[77,2,17,0],banana:[89,1,23,0],apple:[52,0,14,0],bread:[265,9,49,3]}; Object.keys(db).forEach(t=>{const q=grams(t)/100,z=db[t];k+=z[0]*q;pr+=z[1]*q;cb+=z[2]*q;ft+=z[3]*q})}); return {k:Math.round(k),p:Math.round(pr),c:Math.round(cb),f:Math.round(ft)}};
    const box=document.createElement('p'); box.className='muted'; box.id='raf-daily-total'; f.appendChild(box); const refresh=()=>{const t=total();box.textContent=`Daily food total: ${t.k} kcal · P ${t.p}g · C ${t.c}g · F ${t.f}g`}; f.addEventListener('input',refresh); refresh();
    const submit=f.onsubmit; f.onsubmit=e=>{if(submit)submit.call(f,e); const all=read('rafNutrition',{}),d=Object.fromEntries(new FormData(f)); d.clientId=key(p); all[key(p)]=all[key(p)]||d; all[key(p)]={...all[key(p)],...d,clientId:key(p)}; write('rafNutrition',all); if(status)status.textContent='Saved locally ✓';};
  };
})();