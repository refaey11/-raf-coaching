/* RAF Coaching — client-facing portal */
(function(){
 'use strict';
 const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
 const session=()=>read('rafSession',{});
 const isClient=()=>String(session().role||'').toLowerCase()==='client';
 function removeForCoach(){
   if(isClient())return;
   document.querySelectorAll('.nav-item[data-view="client-portal"]').forEach(el=>el.remove());
 }
 function start(){
   removeForCoach();
   if(!isClient())return;
   const nav=document.querySelector('nav');
   if(nav&&!nav.querySelector('[data-view="client-portal"]')){
     const b=document.createElement('button');
     b.className='nav-item';
     b.dataset.view='client-portal';
     b.innerHTML='♙ <span>Client Home</span>';
     nav.appendChild(b);
     b.addEventListener('click',()=>{location.hash='client-portal';window.render?.('client-portal')});
   }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 new MutationObserver(removeForCoach).observe(document.documentElement,{childList:true,subtree:true});
})();
