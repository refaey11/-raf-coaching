(function(){
  let busy=false;
  document.addEventListener('raf:program-updated',function(){
    if(busy || location.hash.slice(1)!=='program') return;
    if(typeof window.render!=='function') return;
    busy=true;
    window.render('program');
    setTimeout(function(){busy=false},0);
  });
})();
