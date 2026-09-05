/* RAF Coaching — unified client context for Assessment, Workout, Nutrition and Progress */
(function(){
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const slug=s=>String(s||'client').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'client';
  function ensure(){
    let list=read('rafClients',[]); let changed=false;
    list=list.map((c,i)=>{if(c&&c.id)return c;changed=true;return {...c,id:`${slug(c?.name)}-${i+1}`}});
    if(changed)write('rafClients',list);
    let p=read('rafProfile',null);
    if(p){let match=list.find(c=>c.id===p.id)||(list.find(c=>c.name===p.name));if(match){p={...match,...p,id:match.id};write('rafProfile',p)}}
    return {list,profile:p};
  }
  function setActive(c){if(!c)return;write('rafProfile',c);write('rafActiveClientId',c.id);window.RAF_ACTIVE_CLIENT=c;}
  function active(){const x=ensure(),id=localStorage.getItem('rafActiveClientId');const c=x.list.find(v=>v.id===id)||x.profile||x.list[0]||null;if(c)setActive(c);return c}
  function patchNutrition(){
    const {list,profile}=ensure(),sel=document.querySelector('#raf-nutrition-client');
    if(sel){[...sel.options].forEach((o,i)=>{if(list[i])o.value=list[i].id});if(profile){const i=list.findIndex(c=>c.id===profile.id);if(i>=0)sel.value=profile.id}sel.onchange=()=>{const c=list.find(x=>x.id===sel.value);if(c){setActive(c);location.hash='nutrition';if(typeof window.render==='function')window.render('nutrition');setTimeout(patchNutrition,30)}}}
    const form=document.querySelector('#raf-nutrition-form');
    if(form&&!form.dataset.unifiedContext){form.dataset.unifiedContext='1';form.addEventListener('submit',()=>{const c=active();if(!c)return;setTimeout(()=>{const all=read('rafNutrition',{}),nameKey=c.name,idKey=c.id;if(all[nameKey]&&!all[idKey])all[idKey]=all[nameKey];write('rafNutrition',all)},50)},true)}
  }
  function patchProfileLinks(){document.querySelectorAll('[data-client]').forEach(btn=>{if(btn.dataset.contextPatched)return;btn.dataset.contextPatched='1';btn.addEventListener('click',()=>{const {list}=ensure(),c=list[+btn.dataset.client];if(c)setActive(c)},true)})}
  active();
  document.addEventListener('click',()=>setTimeout(()=>{patchProfileLinks();patchNutrition()},30),true);
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{patchProfileLinks();patchNutrition()},100));
  setInterval(()=>{patchProfileLinks();if(location.hash==='#nutrition')patchNutrition()},1000);
})();
