/* RAF Nutrition — food search and NASM guidance additions */
(function(){'use strict';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function enhance(){const form=document.querySelector('#meal-builder');if(!form||form.dataset.searchFixed)return;form.dataset.searchFixed='1';
 const box=document.createElement('div');box.className='card';box.style.marginBottom='16px';box.innerHTML='<label><b>Search food / ابحث عن الأكل</b><input id="raf-food-search" type="search" placeholder="Chicken, rice, فول، عيش..." autocomplete="off"></label><p class="muted">اكتب اسم الأكل بالإنجليزي أو العربي، ثم اختار من القوائم.</p>';
 form.parentNode.insertBefore(box,form);
 const search=box.querySelector('input');const selects=[...form.querySelectorAll('select[name^="food_"]')];
 const apply=()=>{const q=search.value.trim().toLowerCase();selects.forEach(sel=>{[...sel.options].forEach((o,i)=>{if(i===0){o.hidden=false;return}o.hidden=!!q&&!o.textContent.toLowerCase().includes(q)});if(sel.selectedOptions[0]?.hidden)sel.value=''})};search.addEventListener('input',apply);
 const note=document.createElement('p');note.className='muted';note.innerHTML='<b>NASM guidance:</b> القيم تقريبية لكل 100 جم، والخطة هنا إرشاد غذائي عام وليست علاجًا غذائيًا لحالة مرضية.';form.parentNode.insertBefore(note,form);
}
new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});enhance();
})();
