/* RAF Coaching — nutrition must use the selected client */
(function(){'use strict';
  const read=(k,f=null)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const session=()=>read('rafSession',{});
  const selected=()=>{const id=localStorage.getItem('rafActiveClientId');const list=read('rafClients',[]);return list.find(c=>String(c?.id)===String(id))||read('rafActiveClient',null)||null};
  function apply(){
    if(location.hash!=='#nutrition')return;
    const s=session(), c=selected();
    if(s.role!=='coach')return;
    const form=document.querySelector('#raf-plan-form');
    if(!form)return;
    const name=document.querySelector('#np-name');
    if(!c){
      if(name){name.value='';name.placeholder='Select a client from Clients first';name.disabled=true;name.required=false;}
      const b=form.querySelector('button[type="submit"]');if(b)b.disabled=true;
      return;
    }
    if(name){name.value=c.name||c.full_name||'Client';name.disabled=true;name.required=false;name.title='Selected client';}
    ['age','weight','height'].forEach(k=>{const el=document.querySelector('#np-'+k);if(el&&c[k]!=null&&c[k]!=='')el.value=c[k];});
    const note=document.querySelector('#np-notes');if(note&&c.notes)note.value=c.notes;
    const b=form.querySelector('button[type="submit"]');if(b)b.disabled=false;
    const h=form.closest('.card')?.querySelector('h3');if(h)h.textContent='Selected client: '+(c.name||c.full_name||'Client');
  }
  const old=window.RAFNutrition?.render;
  if(old)window.RAFNutrition.render=function(){const r=old.apply(this,arguments);setTimeout(apply,30);return r};
  document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,250));
  document.addEventListener('click',()=>setTimeout(apply,80),true);
  window.addEventListener('hashchange',()=>setTimeout(apply,150));
})();
