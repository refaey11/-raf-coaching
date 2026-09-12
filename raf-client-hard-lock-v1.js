(()=>{'use strict';
const COACH='refaey11@icloud.com';
const COACH_VIEWS=new Set(['clients','assessment','program','rules']);
const norm=v=>String(v||'').trim().toLowerCase();
const isCoach=()=>norm(window.RAF_AUTH_ROLE?.email||'')===COACH;
const guard=()=>{
 if(isCoach()) return;
 document.querySelectorAll('[data-view]').forEach(el=>{if(COACH_VIEWS.has(el.dataset.view)) el.style.display='none'});
 const h=location.hash.replace('#','');
 if(COACH_VIEWS.has(h)){history.replaceState(null,'','#dashboard');try{window.render?.('dashboard')}catch(e){}}
 document.querySelectorAll('form').forEach(form=>{
   const text=norm(form.innerText);
   if(text.includes('program builder')||text.includes('create program')||text.includes('assessment')) form.addEventListener('submit',e=>{e.preventDefault();e.stopImmediatePropagation()},true);
 });
 document.querySelectorAll('button,a').forEach(el=>{
   const text=norm(el.innerText||el.textContent);
   if(/save (program|nutrition plan)|create (program|nutrition plan)|build program|generate program/.test(text)){
     el.disabled=true;el.style.display='none';
   }
 });
};
const boot=()=>{guard();new MutationObserver(guard).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style']});window.addEventListener('hashchange',guard)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
document.addEventListener('raf-auth-ready',guard);
})();