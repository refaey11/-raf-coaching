/* RAF Coaching — preflight, navigation and runtime stability fix */
(function () {
  'use strict';
  function read(key, fallback) { try { var raw=localStorage.getItem(key); return raw?JSON.parse(raw):fallback; } catch(e){ return fallback; } }
  function write(key,value) { try { localStorage.setItem(key,JSON.stringify(value)); } catch(e){} }
  var profile=read('rafProfile',null), programs=read('rafPrograms',{});
  if(profile&&profile.name&&programs&&programs[profile.name]){
    var p=programs[profile.name];
    if(!p||!p.variables||!Array.isArray(p.exercises)){ delete programs[profile.name]; write('rafPrograms',programs); localStorage.removeItem('rafCurrentProgram'); }
  }
  var supported=['dashboard','clients','assessment','program','rules'];
  var hash=(location.hash||'#dashboard').slice(1);
  if(hash&&supported.indexOf(hash)===-1) location.hash='#dashboard';
  var busy=false;
  function safeRender(){
    if(busy||typeof window.render!=='function') return;
    busy=true;
    try { var view=(location.hash||'#dashboard').slice(1)||'dashboard'; if(supported.indexOf(view)===-1)view='dashboard'; window.render(view); }
    catch(error){ console.error('RAF render error:',error); var c=document.querySelector('#app-content'); if(c)c.innerHTML='<div class="card"><h2>تعذر تحميل الصفحة</h2><p class="muted">ارجع للعملاء وافتح الملف مرة أخرى.</p><button class="primary" type="button" onclick="location.hash=\'#clients\';location.reload()">الرجوع للعملاء</button></div>'; }
    setTimeout(function(){busy=false;},0);
  }
  window.addEventListener('hashchange',safeRender);
  window.addEventListener('pageshow',function(){setTimeout(safeRender,0);});
})();
