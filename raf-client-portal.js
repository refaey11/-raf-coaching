/* RAF Coaching — client-facing portal */
(function(){
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  function clients(){return read('rafClients',[])}
  function active(){const cs=clients(), id=read('rafActiveClientId',null), p=read('rafProfile',null);return cs.find(c=>c.id===id||c.clientId===id)||p||cs[0]||null}
  function renderPortal(){
    const root=document.querySelector('#app-content'); if(!root)return;
    const c=active(), photos=read('rafClientPhotos',{}), key=c?.id||c?.clientId||c?.name||'guest', ph=photos[key]||{};
    root.innerHTML=`<section class="hero client-portal-hero"><p class="eyebrow">CLIENT PORTAL</p><h2>Welcome${c?.name?', '+esc(c.name):''}</h2><p class="muted">Your private coaching space for workouts, nutrition, progress and check-ins.</p></section>
    <div class="client-portal-grid">
      <article class="card"><h2>Today’s plan</h2><p class="muted">View your assigned workout and nutrition plan.</p><div class="portal-actions"><button class="primary" data-view="workout">Open workout</button><button class="secondary" data-view="nutrition">Open nutrition</button></div></article>
      <article class="card"><h2>Check-in</h2><p class="muted">Upload your latest body measurements and progress photos for your coach.</p><form id="client-checkin-form" class="form-grid"><label>Body weight (kg)<input name="weight" type="number" step="0.1" value="${esc(c?.weight||'')}"></label><label>Waist (cm)<input name="waist" type="number" step="0.1"></label><label>Front photo<input name="front" type="file" accept="image/*"></label><label>Side photo<input name="side" type="file" accept="image/*"></label><label>Back photo<input name="back" type="file" accept="image/*"></label><label>Notes<textarea name="notes" rows="3" placeholder="How are you feeling this week?"></textarea></label><button class="primary" type="submit">Save check-in</button></form><p id="client-checkin-status" class="muted"></p></article>
      <article class="card"><h2>Progress photos</h2><p class="muted">Only the active client’s photos are shown here.</p><div class="photo-preview-grid">${['front','side','back'].map(k=>ph[k]?`<figure><img src="${ph[k]}" alt="${k} progress photo"><figcaption>${k}</figcaption></figure>`:`<div class="photo-empty">No ${k} photo yet</div>`).join('')}</div></article>
      <article class="card"><h2>Coach communication</h2><p class="muted">Your coach can review your check-in, update your plan and request a reassessment.</p><button class="secondary" data-view="progress">View progress</button></article>
    </div>`;
    root.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>window.render?.(b.dataset.view)));
    root.querySelector('#client-checkin-form')?.addEventListener('submit',async e=>{e.preventDefault();const f=e.currentTarget,d=Object.fromEntries(new FormData(f));const out={...(read('rafClientCheckins',{})[key]||{}),...d,date:new Date().toISOString()};const all=read('rafClientCheckins',{});all[key]=out;const pAll=read('rafClientPhotos',{});for(const k of ['front','side','back']){const file=f.elements[k]?.files?.[0];if(file)out[k]=await new Promise(r=>{const rd=new FileReader();rd.onload=()=>r(rd.result);rd.readAsDataURL(file)})}pAll[key]={front:out.front||pAll[key]?.front,side:out.side||pAll[key]?.side,back:out.back||pAll[key]?.back};write('rafClientCheckins',all);write('rafClientPhotos',pAll);document.querySelector('#client-checkin-status').textContent='Check-in saved locally ✓';renderPortal()});
  }
  const old=window.render; window.render=function(name){if(name==='client-portal'){document.querySelectorAll('.nav-item').forEach(x=>x.classList.remove('active'));renderPortal();return} old?.(name)};
  document.addEventListener('DOMContentLoaded',()=>{const nav=document.querySelector('nav');if(nav&&!nav.querySelector('[data-view="client-portal"]')){const b=document.createElement('button');b.className='nav-item';b.dataset.view='client-portal';b.innerHTML='♙ <span>Client Portal</span>';nav.appendChild(b);b.addEventListener('click',()=>window.render('client-portal'))}});
})();