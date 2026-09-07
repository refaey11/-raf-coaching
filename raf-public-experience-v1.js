/* RAF Coaching — premium public experience v1 */
(function(){
  'use strict';
  const hasSession=()=>{try{return !!JSON.parse(localStorage.getItem('rafSession')||'null')}catch{return false}};
  function mount(){
    if(hasSession()) return;
    const shell=document.querySelector('.app-shell');
    if(!shell||document.getElementById('raf-public-home')) return;
    shell.style.display='none';
    const page=document.createElement('main');
    page.id='raf-public-home';
    page.innerHTML=`
      <section class="raf-public-hero">
        <div class="raf-public-nav"><div class="raf-public-brand"><span>R</span><strong>RAF <small>COACHING</small></strong></div><button class="raf-public-login" id="raf-public-login">Sign in</button></div>
        <div class="raf-public-hero-grid"><div><p class="raf-public-kicker">PERSONAL COACHING PLATFORM</p><h1>Train with a plan.<br><em>Progress with purpose.</em></h1><p class="raf-public-lead">Personal training and nutrition coaching built around your body, your goals, and your progress.</p><div class="raf-public-actions"><button class="raf-public-cta" id="raf-public-start">Start your coaching journey <span>→</span></button><button class="raf-public-text" id="raf-public-learn">Explore the experience</button></div></div><div class="raf-public-visual"><div class="raf-public-orb"></div><div class="raf-public-card"><span>YOUR WEEK</span><strong>Built around you.</strong><div><b>Workout</b><b>Nutrition</b><b>Progress</b></div></div></div></div>
      </section>
      <section class="raf-public-proof"><p>One clear system for your coaching journey</p><div><span>Personal assessment</span><span>Structured training</span><span>Nutrition guidance</span><span>Progress tracking</span></div></section>
      <section class="raf-public-features"><div><p class="raf-public-kicker">THE REF METHOD</p><h2>Everything your progress needs.<br>Nothing you don't.</h2></div><div class="raf-public-feature-grid"><article><b>01</b><h3>Know your starting point</h3><p>Assessment-led coaching that turns your goals into a clear direction.</p></article><article><b>02</b><h3>Follow a real plan</h3><p>Training and nutrition organized into one simple weekly experience.</p></article><article><b>03</b><h3>See what changes</h3><p>Track progress, review check-ins, and adjust with your coach.</p></article></div></section>`;
    document.body.prepend(page);
    const open=()=>{page.remove();shell.style.display='';window.dispatchEvent(new Event('raf:open-auth'));};
    ['raf-public-login','raf-public-start'].forEach(id=>document.getElementById(id)?.addEventListener('click',open));
    document.getElementById('raf-public-learn')?.addEventListener('click',()=>document.querySelector('.raf-public-features')?.scrollIntoView({behavior:'smooth'}));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,250)); else setTimeout(mount,250);
})();