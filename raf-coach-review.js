/* RAF Coaching — structured coach assessment review */
(function(){
  'use strict';
  const read=(k,f=null)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const session=()=>read('rafSession',{});
  let rows=[];
  async function isCoach(){
    const s=session(),db=window.rafSupabase;
    if(!db||!s.id)return false;
    const r=await db.from('profiles').select('role').eq('id',s.id).maybeSingle();
    return !r.error&&r.data?.role==='coach';
  }
  async function load(){
    if(!(await isCoach()))return [];
    const r=await window.rafSupabase.from('client_onboarding').select('*').order('created_at',{ascending:false});
    if(r.error)throw r.error;
    rows=r.data||[];return rows;
  }
  function parseNotes(row){
    if(!row.notes)return {};
    if(typeof row.notes==='object')return row.notes;
    try{return JSON.parse(row.notes)}catch{return {notes:row.notes}}
  }
  function field(label,value){return value!==undefined&&value!==null&&value!==''?`<div class="raf-review-field"><span>${label}</span><strong>${esc(value)}</strong></div>`:''}
  function card(row,index){
    const n=parseNotes(row),health=n.health||{},movement=n.movement||{},basic=n.basic||{};
    const name=n.name||row.client_name||row.clientName||'Client';
    const photos=[n.front_photo,n.side_photo,n.back_photo,n.front,n.side,n.back].filter(Boolean);
    return `<article class="raf-review-card"><div class="raf-review-card-head"><div><p class="raf-review-kicker">CLIENT ASSESSMENT</p><h3>${esc(name)}</h3><span class="raf-review-status">Waiting for coach review</span></div><div class="raf-review-date">${esc(row.created_at?new Date(row.created_at).toLocaleDateString(): '')}</div></div><div class="raf-review-section"><h4>Basic information</h4><div class="raf-review-grid">${field('Age',row.age||basic.age)}${field('Height',n.height||basic.height)}${field('Weight',n.weight||basic.weight)}${field('Goal',row.goal)}${field('Experience',row.experience)}${field('Training days',row.training_days)}${field('Equipment',row.equipment)}</div></div><div class="raf-review-section"><h4>Health screening</h4><div class="raf-review-grid">${field('Blood pressure',health.blood_pressure||health.has_bp)}${field('Blood sugar',health.blood_sugar||health.has_sugar)}${field('Medication',health.medication)}${field('Medical history',health.medical)}${field('Pain',health.has_pain)}${field('Pain area',health.pain_area)}${field('Pain level',health.pain_level)}</div></div><div class="raf-review-section"><h4>Movement assessment</h4><div class="raf-review-grid">${field('Posture',movement.posture)}${field('Movement',movement.movement)}${field('Mobility',movement.mobility)}${field('Flexibility',movement.flexibility)}${field('Notes',n.notes||row.notes)}</div></div>${photos.length?`<div class="raf-review-section"><h4>Assessment photos</h4><div class="raf-review-photos">${photos.map((p,i)=>`<img src="${esc(p)}" alt="Assessment photo ${i+1}">`).join('')}</div></div>`:''}<div class="raf-review-actions"><button class="raf-review-approve" data-a="${index}">Approve assessment</button><button class="raf-review-reassess" data-r="${index}">Request reassessment</button></div></article>`;
  }
  async function review(id,status){
    const s=session(),r=await window.rafSupabase.from('client_onboarding').update({status,reviewed_by:s.id,reviewed_at:new Date().toISOString()}).eq('id',id);
    if(r.error)return alert(r.error.message);
    document.getElementById('raf-review-modal')?.remove();await openReview();
  }
  async function openReview(){
    if(!(await isCoach()))return;
    try{await load()}catch(e){return alert('Could not load assessments: '+e.message)}
    document.getElementById('raf-review-modal')?.remove();
    const pending=rows.filter(x=>(x.status||'pending-review')==='pending-review');
    const m=document.createElement('div');m.id='raf-review-modal';m.innerHTML=`<div class="raf-review-shell"><div class="raf-review-title"><div><p class="raf-review-kicker">COACH WORKSPACE</p><h2>Assessment Review</h2><p>Review the client file before creating a program.</p></div><button id="raf-review-close" class="raf-review-close">×</button></div><div class="raf-review-list">${pending.length?pending.map(card).join(''):'<div class="raf-review-empty">No new assessments waiting for review.</div>'}</div></div>`;
    document.body.appendChild(m);
    m.querySelector('#raf-review-close').onclick=()=>m.remove();
    m.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>review(pending[+b.dataset.a].id,'approved'));
    m.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>review(pending[+b.dataset.r].id,'needs-reassessment'));
  }
  function injectStyle(){if(document.getElementById('raf-review-style'))return;const s=document.createElement('style');s.id='raf-review-style';s.textContent=`#raf-review-modal{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.78);padding:18px;overflow:auto;font-family:inherit}.raf-review-shell{width:min(900px,100%);margin:3vh auto;background:#0e1712;border:1px solid #34483a;border-radius:28px;padding:24px;color:#edf5ee;box-shadow:0 20px 80px #000}.raf-review-title{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:20px}.raf-review-title h2{margin:4px 0;font-size:30px}.raf-review-title p{margin:0;color:#9caf9e}.raf-review-kicker{font-size:11px;letter-spacing:2px;color:#a8c878!important}.raf-review-close{width:46px;height:46px;border-radius:14px;border:1px solid #526456;background:#e8e8e8;color:#111;font-size:28px}.raf-review-card{border:1px solid #34483a;background:#152119;border-radius:22px;padding:20px;margin:14px 0}.raf-review-card-head{display:flex;justify-content:space-between;gap:12px}.raf-review-card h3{font-size:25px;margin:2px 0 8px}.raf-review-status{font-size:12px;color:#b9d98a}.raf-review-date{color:#8fa293;font-size:12px}.raf-review-section{border-top:1px solid #2b3b30;margin-top:18px;padding-top:14px}.raf-review-section h4{margin:0 0 12px;font-size:15px;color:#cce5b0}.raf-review-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}.raf-review-field{background:#0e1712;border-radius:12px;padding:10px}.raf-review-field span{display:block;color:#8fa293;font-size:11px;margin-bottom:4px}.raf-review-field strong{font-size:14px;word-break:break-word}.raf-review-photos{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.raf-review-photos img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:14px;border:1px solid #405342}.raf-review-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:20px}.raf-review-actions button{border:0;border-radius:12px;padding:13px 18px;font-weight:800;cursor:pointer}.raf-review-approve{background:#c1ff63;color:#14200f}.raf-review-reassess{background:#29382d;color:#e9f3e8;border:1px solid #526456!important}.raf-review-empty{padding:40px;text-align:center;color:#aab9aa}@media(max-width:600px){.raf-review-shell{padding:16px}.raf-review-photos{grid-template-columns:1fr 1fr}.raf-review-title h2{font-size:24px}}`;document.head.appendChild(s)}
  async function init(){injectStyle();if(document.getElementById('raf-review-button'))return;if(!(await isCoach()))return;const t=document.querySelector('.topbar');if(!t)return;const b=document.createElement('button');b.id='raf-review-button';b.type='button';b.textContent='Review Queue';b.style.cssText='margin-left:auto;background:#18221b;color:#dcebdc;border:1px solid #405342;border-radius:12px;padding:10px 13px;font-weight:700';b.onclick=openReview;t.appendChild(b);load().catch(console.error)}
  document.addEventListener('DOMContentLoaded',()=>setTimeout(init,500));window.addEventListener('raf-auth-ready',()=>setTimeout(init,100));window.RAFCoachReview={open:openReview,refresh:load};
})();