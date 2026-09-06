/* RAF Coaching — role boundary guard v4 */
(function(){
  const read=(k,f=null)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const coachOnly=new Set(['dashboard','clients','assessment','program','rules']);
  function session(){return read('rafSession',{});}
  function approved(){return read('rafClientOnboarding',{}).status==='approved';}
  function clientProfile(){
    const s=session(),o=read('rafClientOnboarding',{});
    return {id:s.userId||s.id||null,clientId:s.userId||s.id||null,name:s.name||o.clientName||'Client',age:o.age,goal:o.goal,trainingDays:o.training_days||o.days,days:o.training_days||o.days,equipment:o.equipment};
  }
  function applyNav(){
    if(session().role!=='client')return;
    document.querySelectorAll('.nav-item').forEach(btn=>{if(coachOnly.has(btn.dataset.view))btn.remove();});
  }
  function blockDemoPlan(){
    if(session().role!=='client'||approved())return;
    if(!['#nutrition','#workout','#progress'].includes(location.hash))return;
    const root=document.querySelector('#app-content');if(!root)return;
    root.innerHTML='<section class="hero"><p class="eyebrow">CLIENT PORTAL</p><h2>Your plan is not assigned yet</h2><p class="muted">The sample workout and nutrition content is hidden. Your coach must review your information and assign your real plan before it appears here.</p><button class="primary" id="return-client-home">Back to Client Home</button></section>';
    root.querySelector('#return-client-home')?.addEventListener('click',()=>window.render?.('client-portal'));
  }
  function lockClientView(){
    if(session().role!=='client')return;
    localStorage.setItem('rafProfile',JSON.stringify(clientProfile()));
    document.querySelectorAll('#raf-progress-client,#raf-nutrition-client,#raf-client-picker,.client-picker').forEach(el=>{const label=el.closest('label');(label||el).remove();});
    const title=document.querySelector('#app-content .hero h2');
    if(title&&location.hash==='#progress')title.textContent='My Progress';
  }
  const original=window.render;
  window.render=function(view){
    const s=session();
    if(s.role==='client'&&coachOnly.has(view))view='client-portal';
    if(s.role==='client')localStorage.setItem('rafProfile',JSON.stringify(clientProfile()));
    const result=original?.(view);
    setTimeout(()=>{applyNav();lockClientView();blockDemoPlan();},0);
    return result;
  };
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{applyNav();lockClientView();blockDemoPlan();},150));
  window.addEventListener('hashchange',()=>setTimeout(()=>{applyNav();lockClientView();blockDemoPlan();},50));
})();
