(function(){
  let busy=false;
  function go(view){
    if(typeof window.render==='function') window.render(view);
    location.hash=view;
  }
  document.addEventListener('raf:program-updated',function(){
    if(busy || location.hash.slice(1)!=='program') return;
    busy=true; go('program'); setTimeout(function(){busy=false},50);
  });
  document.addEventListener('click',function(e){
    const add=e.target.closest('.add-library-exercise');
    if(add && add.disabled){ e.preventDefault(); }
  });
  function homeButton(){
    if(document.querySelector('#raf-home-button')) return;
    const b=document.createElement('button');
    b.id='raf-home-button'; b.type='button'; b.className='secondary'; b.textContent='⌂ الصفحة الرئيسية / تسجيل عميل جديد';
    b.onclick=function(){
      localStorage.removeItem('rafProfile');
      go('dashboard');
      setTimeout(function(){go('assessment')},0);
    };
    const top=document.querySelector('.topbar'); if(top) top.appendChild(b);
  }
  new MutationObserver(homeButton).observe(document.body,{childList:true,subtree:true});
  homeButton();
})();
