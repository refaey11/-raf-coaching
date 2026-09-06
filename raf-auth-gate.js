/* RAF Coaching — temporary local auth gate. Replace with real backend auth later. */
(function(){
  const KEY='rafSession';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))}catch{return null}};
  const write=v=>localStorage.setItem(KEY,JSON.stringify(v));
  const esc=s=>String(s||'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  function show(){
    if(read())return;
    const shade=document.createElement('div'); shade.id='raf-auth-gate';
    shade.innerHTML='<div class="card" style="max-width:460px;margin:8vh auto;padding:28px"><p class="eyebrow">RAF COACHING</p><h2>Welcome to your coaching space</h2><p class="muted">Choose how you want to enter. This is a local prototype until real account authentication is connected.</p><form id="raf-auth-form" class="form-grid"><label>Your name<input name="name" required placeholder="Enter your name"></label><label>Continue as<select name="role"><option value="coach">Coach</option><option value="client">Client</option></select></label><button class="primary" type="submit">Continue →</button></form></div>';
    Object.assign(shade.style,{position:'fixed',inset:'0',background:'rgba(5,8,7,.94)',zIndex:'9999',overflow:'auto',padding:'16px'});
    document.body.appendChild(shade);
    shade.querySelector('form').onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.currentTarget));write({name:d.name,role:d.role,createdAt:new Date().toISOString()});shade.remove();if(d.role==='client'){location.hash='client-portal';window.render?.('client-portal')}};
  }
  function addLogout(){const top=document.querySelector('.topbar');if(!top||top.querySelector('[data-raf-logout]'))return;const b=document.createElement('button');b.textContent='Exit';b.className='secondary';b.dataset.rafLogout='1';b.onclick=()=>{localStorage.removeItem(KEY);location.reload()};top.appendChild(b)}
  document.addEventListener('DOMContentLoaded',()=>{show();addLogout()});
})();
