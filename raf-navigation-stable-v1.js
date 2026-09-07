(function(){'use strict';
const content=()=>document.querySelector('#app-content');
const title=()=>document.querySelector('#page-title');
const valid=new Set(['dashboard','clients','assessment','program','rules','workout','nutrition','progress','client-workspace']);
let busy=false;
function normalize(v){return valid.has(v)?v:'dashboard'}
function setActive(v){document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===v));}
function go(raw,write=true){const v=normalize(raw);if(busy)return;busy=true;setActive(v);if(write&&location.hash.slice(1)!==v)history.pushState({view:v},'',`#${v}`);const root=content();if(root){root.classList.remove('raf-route-in');void root.offsetWidth;root.classList.add('raf-route-in')}try{window.render&&window.render(v);if(title()&&v!=='client-workspace')title().textContent=({dashboard:'Dashboard',clients:'Clients',assessment:'Assessment',program:'Program Builder',rules:'NASM Rules',workout:'Workout',nutrition:'Nutrition',progress:'Progress'})[v]||'Dashboard'}finally{setTimeout(()=>busy=false,120)}}
function handle(e){const b=e.target.closest('[data-view]');if(!b)return;e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();go(b.dataset.view)}
document.addEventListener('click',handle,true);
window.addEventListener('popstate',()=>go(location.hash.slice(1),false));
window.addEventListener('hashchange',()=>go(location.hash.slice(1),false));
document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>go(location.hash.slice(1)||'dashboard',false),0));
window.rafNavigate=go;
})();