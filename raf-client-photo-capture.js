/* RAF Coaching — client assessment photos + hide legacy review button */
(function(){'use strict';
 function hideReview(){
  var style=document.getElementById('raf-hide-review-style');
  if(!style){style=document.createElement('style');style.id='raf-hide-review-style';style.textContent='#raf-review-button{display:none!important}';document.head.appendChild(style)}
  document.querySelectorAll('#raf-review-button').forEach(function(x){x.remove()});
 }
 function addPhotos(){
  var form=document.getElementById('client-assessment-form');
  if(!form||form.querySelector('#raf-photo-fields'))return;
  var box=document.createElement('section');box.id='raf-photo-fields';box.className='assessment-panel';
  box.innerHTML='<h3>Assessment photos</h3><p class="muted">Upload front, side, and back photos. These will be attached to your client file.</p><div class="form-grid"><label>Front photo<input type="file" accept="image/*" name="front_photo"></label><label>Side photo<input type="file" accept="image/*" name="side_photo"></label><label>Back photo<input type="file" accept="image/*" name="back_photo"></label></div>';
  var actions=form.querySelector('.assessment-actions');form.insertBefore(box,actions||null);
 }
 function dataURL(file){return new Promise(function(resolve,reject){if(!file)return resolve('');var r=new FileReader();r.onload=function(){resolve(r.result)};r.onerror=reject;r.readAsDataURL(file)})}
 async function savePhotos(){
  var form=document.getElementById('client-assessment-form');if(!form)return;
  var photos={};for(const n of ['front_photo','side_photo','back_photo']){var f=form.elements[n]?.files?.[0];if(f)photos[n]=await dataURL(f)}
  if(!Object.keys(photos).length)return;
  var db=window.rafSupabase;var s={};try{s=JSON.parse(localStorage.getItem('rafSession')||'{}')}catch{}
  if(db&&s.id){var q=await db.from('client_onboarding').select('id,notes').eq('client_id',s.id).order('created_at',{ascending:false}).limit(1).maybeSingle();if(!q.error&&q.data){var n={};try{n=typeof q.data.notes==='string'?JSON.parse(q.data.notes):(q.data.notes||{})}catch{};Object.assign(n,photos);await db.from('client_onboarding').update({notes:JSON.stringify(n)}).eq('id',q.data.id)}}
 }
 var obs=new MutationObserver(function(){hideReview();addPhotos()});
 obs.observe(document.body,{childList:true,subtree:true});
 document.addEventListener('submit',function(e){if(e.target?.id==='client-assessment-form')savePhotos()},true);
 document.addEventListener('DOMContentLoaded',function(){hideReview();addPhotos()});
 window.addEventListener('raf-auth-ready',hideReview);hideReview();
})();
