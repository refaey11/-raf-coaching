/* RAF Coaching — client onboarding */
(function(){
  const S='rafSession',K='rafClientOnboarding';
  const read=(k,f=null)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const db=()=>window.rafSupabase;
  async function existing(s){
    if(!db()||!s?.id)return null;
    const r=await db().from('client_onboarding').select('id,client_id,age,goal,experience,training_days,equipment,notes,status,created_at').eq('client_id',s.id).maybeSingle();
    if(r.error)throw r.error;
    return r.data;
  }
  async function saveRemote(s,d){
    if(!db()||!s.id)throw new Error('Authentication is still loading.');
    const row={client_id:s.id,age:d.age,goal:d.goal,experience:d.experience,training_days:d.days,equipment:d.equipment,notes:d.notes||'',status:'pending-review'};
    const r=await db().from('client_onboarding').upsert(row,{onConflict:'client_id'});
    if(r.error)throw r.error;
    return await existing(s);
  }
  function cache(s,r){
    write(K,{clientId:s.id,clientName:s.name,age:r.age,goal:r.goal,experience:r.experience,days:r.training_days,equipment:r.equipment,notes:r.notes||'',status:r.status,createdAt:r.created_at||new Date().toISOString(),remoteId:r.id});
  }
  async function start(){
    const s=read(S);if(!s||s.role!=='client')return;
    if(read(K))return;
    try{const r=await existing(s);if(r){cache(s,r);return}}catch(err){console.error('onboarding lookup failed',err)}
    if(document.getElementById('raf-onboarding'))return;
    const shade=document.createElement('div');shade.id='raf-onboarding';
    shade.innerHTML='<div class="card" style="max-width:560px;margin:6vh auto;padding:28px"><p class="eyebrow">CLIENT ONBOARDING</p><h2>Let’s build your starting profile</h2><p class="muted">Answer these basics before your assessment. Your coach will review the information before assigning a plan.</p><form id="raf-onboarding-form" class="form-grid"><label>Age<input name="age" type="number" min="13" max="100" required></label><label>Primary goal<select name="goal"><option value="fat-loss">Fat loss</option><option value="muscle-gain">Muscle gain</option><option value="strength">Strength</option><option value="general-fitness">General fitness</option></select></label><label>Training experience<select name="experience"><option>beginner</option><option>intermediate</option><option>advanced</option></select></label><label>Training days per week<input name="days" type="number" min="1" max="7" value="3" required></label><label>Equipment<select name="equipment"><option value="gym">Gym</option><option value="home">Home</option><option value="none">No equipment</option></select></label><label>Anything your coach should know?<textarea name="notes" rows="3"></textarea></label><button class="primary" type="submit">Save and continue →</button><p id="raf-onboarding-status" class="muted"></p></form></div>';
    Object.assign(shade.style,{position:'fixed',inset:'0',background:'rgba(5,8,7,.94)',zIndex:'9998',overflow:'auto',padding:'16px'});document.body.appendChild(shade);
    shade.querySelector('form').onsubmit=async e=>{e.preventDefault();const form=e.currentTarget,d=Object.fromEntries(new FormData(form));d.age=Number(d.age);d.days=Number(d.days);const st=shade.querySelector('#raf-onboarding-status'),btn=form.querySelector('button');btn.disabled=true;st.textContent='Saving...';try{const remote=await saveRemote(s,d);cache(s,remote||d);shade.remove();location.hash='client-portal';window.render?.('client-portal')}catch(err){console.error(err);st.textContent='Could not save: '+(err.message||'please try again');btn.disabled=false}};
  }
  document.addEventListener('DOMContentLoaded',()=>setTimeout(start,600));
  window.addEventListener('raf-auth-ready',()=>setTimeout(start,100));
})();
