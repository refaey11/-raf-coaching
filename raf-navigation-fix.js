/* RAF Coaching — reliable client navigation */
(function(){
 function home(){location.hash='client-portal';if(typeof window.render==='function')window.render('client-portal');else window.dispatchEvent(new Event('hashchange'));}
 document.addEventListener('click',function(e){
  const b=e.target.closest('button,a'); if(!b)return;
  const t=(b.textContent||'').trim().toLowerCase();
  const isHome=t==='home'||t.includes('back to client home')||t.includes('back to home')||b.dataset.view==='dashboard';
  if(isHome){e.preventDefault();e.stopImmediatePropagation();home();}
 },true);
})();
