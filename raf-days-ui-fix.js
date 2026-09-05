(function(){
  function refresh(){
    const root=document.querySelector('#app-content');
    if(!root)return;
    const title=(document.querySelector('#page-title')||{}).textContent||'';
    if(!/Program Builder/i.test(title))return;
    const form=root.querySelector('#program-form');
    if(!form||form.dataset.daysFixed)return;
    form.dataset.daysFixed='1';
    const note=document.createElement('div');
    note.className='card';
    note.innerHTML='<h3>How to organize the week</h3><p class="muted">Choose a Day button first, then select only the exercises for that day. Save this day before moving to the next one. Assessment only sets the number of training days; exercises are organized here.</p>';
    form.insertBefore(note,form.firstChild);
    const buttons=form.querySelectorAll('[data-builder-day]');
    buttons.forEach((b,i)=>{b.textContent='Day '+(i+1);});
  }
  new MutationObserver(refresh).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',refresh);
  setTimeout(refresh,300);
})();
