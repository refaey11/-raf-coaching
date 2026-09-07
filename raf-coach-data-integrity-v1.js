/* RAF Coaching — coach/client data integrity */
(function(){'use strict';
  const COACH_EMAIL='refaey11@icloud.com';
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  function clean(){
    const s=read('rafSession',{}), email=String(s.email||s.user_email||'').toLowerCase();
    if(email===COACH_EMAIL && s.role!=='coach'){s.role='coach';write('rafSession',s)}
    if(s.role!=='coach')return;
    const list=read('rafClients',[]);
    const cleanList=list.filter(c=>{
      const ce=String(c?.email||c?.user_email||'').toLowerCase();
      const cr=String(c?.role||'').toLowerCase();
      const n=String(c?.name||c?.full_name||'').trim().toLowerCase();
      return ce!==COACH_EMAIL && cr!=='coach' && n!=='c.refaey' && n!=='refaey11';
    });
    if(cleanList.length!==list.length)write('rafClients',cleanList);
    const active=read('rafActiveClient',null), profile=read('rafProfile',null);
    if(active && (String(active.email||'').toLowerCase()===COACH_EMAIL || active.role==='coach'))localStorage.removeItem('rafActiveClient');
    if(profile && (String(profile.email||'').toLowerCase()===COACH_EMAIL || profile.role==='coach'))localStorage.removeItem('rafProfile');
  }
  function guardNutrition(){
    const s=read('rafSession',{}); if(s.role!=='coach'||location.hash!=='#nutrition')return;
    const c=read('rafActiveClient',null)||read('rafCurrentClient',null);
    if(!c){const r=document.querySelector('#app-content');if(r)r.innerHTML='<section class="hero"><p class="eyebrow">COACH WORKSPACE</p><h2>Select a real client first</h2><p class="muted">الكوتش لا يظهر كعميل. افتح ملف محمد أو أي عميل من Clients ثم ادخل Nutrition.</p><button class="primary" id="integrity-clients">Back to Clients</button></section>';document.querySelector('#integrity-clients')?.addEventListener('click',()=>window.render?.('clients'))}
  }
  clean();
  document.addEventListener('DOMContentLoaded',()=>{clean();setTimeout(guardNutrition,250)});
  window.addEventListener('hashchange',()=>setTimeout(()=>{clean();guardNutrition()},100));
  setInterval(()=>{clean();if(location.hash==='#nutrition')guardNutrition()},700);
})();