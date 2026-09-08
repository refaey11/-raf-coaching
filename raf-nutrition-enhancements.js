/* RAF Nutrition Enhancements v1 */
(function(){'use strict';
  function enhance(){
    if(!location.hash.includes('nutrition') && !document.querySelector('#nutrition-calc')) return;
    const builder=document.querySelector('#meal-builder');
    if(!builder || builder.dataset.enhanced==='1') return;
    builder.dataset.enhanced='1';
    const box=document.createElement('div'); box.className='card'; box.style.marginBottom='16px';
    box.innerHTML='<label><b>Search food / ابحث عن الأكل</b><input id="raf-food-search" type="search" placeholder="Chicken, rice, فول، عيش، فاكهة..." style="width:100%;margin-top:8px"></label><p class="muted" style="margin:8px 0 0">اكتب اسم الطعام لتصفية الاختيارات في كل الوجبات.</p>';
    builder.parentNode.insertBefore(box,builder);
    const input=box.querySelector('#raf-food-search');
    input.addEventListener('input',function(){
      const q=input.value.trim().toLowerCase();
      document.querySelectorAll('#meal-builder select').forEach(sel=>{
        Array.from(sel.options).forEach((o,i)=>{ if(i===0){o.hidden=false;return} o.hidden=!!q && !o.textContent.toLowerCase().includes(q); });
      });
    });
  }
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
  enhance();
})();
