/* RAF Nutrition — single working food search v2 */
(function(){'use strict';
  const norm=s=>String(s||'').toLocaleLowerCase('ar').replace(/[إأآا]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').trim();
  function removeDuplicates(){
    const boxes=[...document.querySelectorAll('#raf-food-search')];
    boxes.slice(1).forEach(i=>i.closest('.card')?.remove());
  }
  function enhance(){
    const form=document.querySelector('#meal-builder');
    if(!form)return;
    removeDuplicates();
    let box=document.querySelector('#raf-food-search')?.closest('.card');
    if(!box){
      box=document.createElement('div');box.className='card';box.id='raf-single-food-search';box.style.marginBottom='16px';
      box.innerHTML='<label><b>Search food / ابحث عن الأكل</b><input id="raf-food-search" type="search" placeholder="Chicken, rice, فول، عيش..." autocomplete="off" style="width:100%;margin-top:8px"><p id="raf-food-search-status" class="muted" style="margin:8px 0 0">اكتب اسم الأكل، ثم افتح قائمة الوجبة لاختيار النتيجة.</p></label>';
      form.parentNode.insertBefore(box,form);
    }
    const search=box.querySelector('#raf-food-search');
    if(search.dataset.bound==='1')return;
    search.dataset.bound='1';
    const apply=()=>{
      const q=norm(search.value);let shown=0;
      form.querySelectorAll('select[name^="food_"]').forEach(sel=>{
        [...sel.options].forEach((o,i)=>{const match=!q||i===0||norm(o.textContent).includes(q);o.hidden=!match;o.disabled=!match;if(match&&i>0)shown++});
        if(sel.value && sel.selectedOptions[0]?.disabled)sel.value='';
      });
      const status=box.querySelector('#raf-food-search-status');
      status.textContent=q?(shown?`تم العثور على ${shown} اختيار مطابق — افتح قائمة الوجبة.`:'لا توجد نتيجة. جرّب اسمًا آخر.'):'اكتب اسم الأكل، ثم افتح قائمة الوجبة لاختيار النتيجة.';
    };
    search.addEventListener('input',apply);apply();
  }
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
  enhance();
})();
