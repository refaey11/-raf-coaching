/* RAF Coaching — role boundary guard v3 */
(function(){
  const read=(k,f=null)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const clientViews=new Set(['client-portal','workout','nutrition','progress']);
  const coachOnly=new Set(['dashboard','clients','assessment','program','rules']);
  function session(){return read('rafSession',{});}
  function clientProfile(){
    const s=session(),o=read('rafClientOnboarding',{});
    return {id:s.userId||s.id||null,clientId:s.userId||s.id||null,name:s.name||o.clientName||'Client',age:o.age,goal:o.goal,trainingDays:o.days,days:o.days,equipment:o.equipment};
  }
  function applyNav(){
    if(session().role!=='client')return;
    document.querySelectorAll('.nav-item').forEach(btn=>{if(coachOnly.has(btn.dataset.view))btn.remove();});
  }
  function lockClientView(){
    if(session().role!=='client')return;
    const p=clientProfile();
    localStorage.setItem('rafProfile',JSON.stringify(p));
    const selectors=['#raf-progress-client','#raf-nutrition-client','#raf-client-picker'];
    selectors.forEach(sel=>document.querySelectorAll(sel).forEach(el=>{const label=el.closest('label');(label||el).remove();}));
    document.querySelectorAll('.client-picker').forEach(el=>el.remove());
    const title=document.querySelector('#app-content .hero h2');
    if(title&&location.hash==='#progress')title.textContent='My Progress';
    const subtitle=document.querySelector('#app-content .hero .muted');
    if(subtitle&&location.hash==='#progress')subtitle.textContent='Your private workout history and completion tracking.';
  }
  const original=window.render;
  window.render=function(view){
    const s=session();
    if(s.role==='client'&&coachOnly.has(view))view='client-portal';
    if(s.role==='client')localStorage.setItem('rafProfile',JSON.stringify(clientProfile()));
    const result=original?.(view);
    setTimeout(()=>{applyNav();lockClientView();},0);
    return result;
  };
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{applyNav();lockClientView();},150));
  window.addEventListener('hashchange',()=>setTimeout(()=>{applyNav();lockClientView();},50));
})();
