/* RAF Coaching — exercise classification labels for coach program builder */
(function(){'use strict';
  const categoryFor=(e)=>{
    const text=JSON.stringify(e||{}).toLowerCase();
    if(/injury|pain|rehab|post.?surgery|osteo|arthritis/.test(text)) return {en:'Injury / Rehab',ar:'إصابة / تأهيل'};
    if(/static|stretch|flexibility|hamstring|soleus|adductor|pectoral|trapezius|scalene|levator|biceps femoris/.test(text)) return {en:'Stretching / Flexibility',ar:'استرتش / مرونة'};
    if(/mobility|foam roll|smr|dorsiflexion|tfl|iliotibial|ankle mobility|thoracic rotation/.test(text)) return {en:'Mobility / SMR',ar:'موبيلتي / تحرير أنسجة'};
    if(/posture|deviation|corrective|activation|dead bug|bird dog|glute bridge|wall slide/.test(text)) return {en:'Corrective / Posture',ar:'تصحيحي / انحرافات'};
    if(/dynamic|lunge with rotation|medicine ball rotation|russian twist|leg swings|push-up with rotation/.test(text)) return {en:'Dynamic Flexibility',ar:'مرونة ديناميكية'};
    return {en:'Strength / Conditioning',ar:'قوة / لياقة'};
  };
  const find=(id)=>((window.RAF&&window.RAF.RAF_EXERCISES)||[]).find(e=>String(e.id)===String(id))||{};
  function enhance(){
    document.querySelectorAll('select[name^="exercise_"]').forEach(sel=>{
      if(sel.dataset.categorized==='1')return;
      [...sel.options].forEach(opt=>{
        if(!opt.value)return;
        const e=find(opt.value), c=categoryFor({...e,name:opt.textContent,id:opt.value});
        opt.textContent=`${opt.textContent} — ${c.en} / ${c.ar}`;
        opt.dataset.category=c.en;
      });
      const label=sel.closest('label');
      if(label&&!label.querySelector('.exercise-category-hint')){
        const hint=document.createElement('small');
        hint.className='exercise-category-hint muted';
        hint.textContent='Choose by purpose: corrective, mobility, stretching, or strength.';
        label.appendChild(hint);
      }
      sel.dataset.categorized='1';
    });
  }
  new MutationObserver(enhance).observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('DOMContentLoaded',()=>setTimeout(enhance,300));
})();
