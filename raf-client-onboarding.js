/* RAF Coaching — client onboarding prototype */
(function(){
  const S='rafSession', K='rafClientOnboarding';
  const read=(k,f=null)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  function start(){
    const s=read(S); if(!s||s.role!=='client'||read(K)) return;
    const shade=document.createElement('div'); shade.id='raf-onboarding';
    shade.innerHTML='<div class="card" style="max-width:560px;margin:6vh auto;padding:28px"><p class="eyebrow">CLIENT ONBOARDING</p><h2>Let’s build your starting profile</h2><p class="muted">Answer these basics before your assessment. Your coach will review the information before assigning a plan.</p><form id="raf-onboarding-form" class="form-grid"><label>Age<input name="age" type="number" min="13" max="100" required></label><label>Primary goal<select name="goal"><option value="fat-loss">Fat loss</option><option value="muscle-gain">Muscle gain</option><option value="strength">Strength</option><option value="general-fitness">General fitness</option></select></label><label>Training experience<select name="experience"><option>beginner</option><option>intermediate</option><option>advanced</option></select></label><label>Training days per week<input name="days" type="number" min="1" max="7" value="3" required></label><label>Equipment<select name="equipment"><option value="gym">Gym</option><option value="home">Home</option><option value="none">No equipment</option></select></label><label>Anything your coach should know?<textarea name="notes" rows="3"></textarea></label><button class="primary" type="submit">Save and continue →</button></form></div>';
    Object.assign(shade.style,{position:'fixed',inset:'0',background:'rgba(5,8,7,.94)',zIndex:'9998',overflow:'auto',padding:'16px'});
    document.body.appendChild(shade);
    shade.querySelector('form').onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget));d.age=Number(d.age);d.days=Number(d.days);write(K,{...d,clientName:s.name,status:'pending-review',createdAt:new Date().toISOString()});shade.remove();location.hash='client-portal';window.render?.('client-portal')};
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(start,80));
})();
