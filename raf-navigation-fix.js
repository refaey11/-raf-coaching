/* RAF Coaching — reliable client navigation */
(function(){
 function home(){
  if(typeof window.render==='function') window.render('client-portal');
  else {location.hash='client-portal';window.dispatchEvent(new Event('hashchange'));}
 }
 document.addEventListener('click',function(e){
  const b=e.target.closest('button,a'); if(!b)return;
  const t=(b.textContent||'').trim().toLowerCase();
  if(t.includes('back to client home')||t.includes('back to home')){e.preventDefault();e.stopImmediatePropagation();home();}
 },true);
})();
