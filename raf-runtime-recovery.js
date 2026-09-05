/* RAF Coaching runtime recovery: prevents broken saved programs from crashing Program Builder. */
(function(){
  'use strict';
  function read(k,f){try{var v=JSON.parse(localStorage.getItem(k)||'null');return v==null?f:v}catch(e){return f}}
  function repair(){
    var profile=read('rafProfile',null); if(!profile||!profile.name)return;
    var all=read('rafPrograms',{}); var p=all[profile.name];
    if(!p||!p.variables||!Array.isArray(p.exercises)){
      delete all[profile.name];
      try{localStorage.setItem('rafPrograms',JSON.stringify(all));}catch(e){}
    }
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('[data-client]');
    if(b)repair();
  },true);
  window.addEventListener('error',function(){
    var c=document.querySelector('#app-content');
    if(c&&/program/i.test(location.hash)){
      c.innerHTML='<div class="card"><h2>حدث خطأ في تحميل البرنامج</h2><p class="muted">تم تنظيف النسخة التالفة. ارجع للعملاء وافتح البروفايل مرة أخرى.</p><button class="primary" type="button" onclick="location.hash=\'clients\';location.reload()">الرجوع للعملاء</button></div>';
    }
  });
  repair();
})();
