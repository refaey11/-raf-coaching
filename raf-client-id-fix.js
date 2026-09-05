/* RAF Coaching — stable client identity bridge */
(function(){
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
 const key=c=>String(c?.id||('client-'+String(c?.name||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-')));
 function ensure(){
  const cs=read('rafClients',[]); let changed=false;
  const out=cs.map((c,i)=>{if(c.id)return c;changed=true;return {...c,id:key(c)+'-'+i}});
  if(changed)write('rafClients',out);
  const p=read('rafProfile',null); if(p&&!p.id){const match=out.find(c=>c.name===p.name);write('rafProfile',match||{...p,id:key(p)+'-active'})}
  return out;
 }
 function patch(){
  const cs=ensure(),sel=document.querySelector('#raf-nutrition-client'); if(!sel)return;
  [...sel.options].forEach((o,i)=>{const c=cs[i];if(c)o.value=c.id});
  const active=read('rafProfile',null); if(active){const i=cs.findIndex(c=>c.id===active.id);if(i>=0)sel.value=cs[i].id}
  sel.onchange=function(){const c=cs.find(x=>x.id===sel.value);if(!c)return;write('rafProfile',c);location.hash='nutrition';window.render('nutrition');setTimeout(patch,0)};
  const form=document.querySelector('#raf-nutrition-form'); if(form&&!form.dataset.idBridge){form.dataset.idBridge='1';form.addEventListener('submit',function(){const c=read('rafProfile',null);if(!c)return;setTimeout(()=>{const all=read('rafNutrition',{}),legacy=all[c.name];if(legacy){all[key(c)]=legacy;write('rafNutrition',all)}},20)},true)}
 }
 document.addEventListener('click',e=>{if(e.target.closest('[data-view="nutrition"]'))setTimeout(patch,0)},true);
 document.addEventListener('DOMContentLoaded',()=>setTimeout(patch,0));
 setInterval(()=>{if(location.hash==='#nutrition')patch()},700);
})();