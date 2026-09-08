/* RAF Nutrition Search Fix v2 */
(function(){'use strict';
  const aliases={
    'عيش':'bread','عيش بلدي':'egyptian baladi bread','عيش مصري':'egyptian baladi bread','رز':'rice','أرز':'rice','فول':'fava beans','فول مدمس':'fava beans','طعمية':'falafel','بيض':'egg','بياض':'egg white','فراخ':'chicken','دجاج':'chicken','لحمة':'beef','كبدة':'liver','تونة':'tuna','سردين':'sardines','جبنة':'cheese','جبنه':'cheese','بطاطس':'potato','بطاطا':'sweet potato','مكرونة':'pasta','شوفان':'oats','عدس':'lentil','حمص':'chickpeas','ملوخية':'molokhia','بامية':'okra','فاصوليا':'green beans','طماطم':'tomato','خيار':'cucumber','جزر':'carrot','موز':'banana','تفاح':'apple','برتقال':'orange','جوافة':'guava','مانجا':'mango','عنب':'grapes','بطيخ':'watermelon','بلح':'dates','زيت زيتون':'olive oil','طحينة':'tahini','فول سوداني':'peanuts','لوز':'almonds','عين جمل':'walnuts','أفوكادو':'avocado'
  };
  const norm=s=>String(s||'').toLowerCase().trim().replace(/[إأآا]/g,'ا').replace(/ة/g,'ه');
  function matches(text,q){q=norm(q); if(!q)return true; const expanded=aliases[q]||q; return norm(text).includes(q)||norm(text).includes(norm(expanded));}
  function cleanDuplicateSearches(){
    const nodes=[...document.querySelectorAll('#meal-builder label')];
    nodes.forEach(label=>{if(/search food|ابحث عن الأكل/i.test(label.textContent||'')){const parent=label.closest('.card')||label.parentElement; if(parent && parent.querySelectorAll('select[name^="food_"]').length===0) parent.remove();}});
  }
  function enhance(){
    const form=document.querySelector('#meal-builder'); if(!form)return;
    cleanDuplicateSearches();
    let box=document.querySelector('#raf-food-search-v2');
    if(!box){box=document.createElement('div');box.id='raf-food-search-v2';box.className='card';box.style.marginBottom='16px';box.innerHTML='<label><b>Search food / ابحث عن الأكل</b><input id="raf-food-search-input-v2" type="search" placeholder="Chicken, rice, فول، عيش، فاكهة..." style="width:100%;margin-top:8px"><small style="display:block;margin-top:6px;opacity:.7">اكتب اسم الأكل بالعربي أو الإنجليزي، ثم اختار من القوائم.</small></label>';form.parentNode.insertBefore(box,form);}
    const input=box.querySelector('input'); if(input.dataset.bound==='1')return; input.dataset.bound='1';
    input.addEventListener('input',()=>{const q=input.value; form.querySelectorAll('select[name^="food_"]').forEach(sel=>{[...sel.options].forEach((o,i)=>{o.hidden=i!==0&&!matches(o.textContent,q);});});});
  }
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true}); enhance();
})();
