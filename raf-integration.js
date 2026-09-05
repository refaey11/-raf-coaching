/* RAF Coaching — stable button actions and home/new-client navigation */
(function(){
  let busy=false;
  const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
  const save=(key,value)=>localStorage.setItem(key,JSON.stringify(value));
  const esc=value=>String(value??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function message(title,detail){
    let box=document.querySelector('#raf-action-message');
    if(!box){box=document.createElement('div');box.id='raf-action-message';box.style.cssText='position:fixed;left:18px;right:18px;bottom:24px;z-index:9999;padding:16px 18px;border:1px solid #39d353;border-radius:16px;background:#132018;color:#fff;box-shadow:0 10px 30px #0008;font-size:16px;';document.body.appendChild(box)}
    box.innerHTML='<strong>'+esc(title)+'</strong><br><span style="opacity:.8">'+esc(detail)+'</span>';
    clearTimeout(box._timer);box._timer=setTimeout(()=>box.remove(),2600);
  }
  function addToProgram(button){
    const id=button.dataset.exercise;
    const library=window.RAF&&Array.isArray(RAF.RAF_EXERCISES)?RAF.RAF_EXERCISES:[];
    const exercise=library.find(item=>item.id===id);
    const profile=read('rafProfile',null);
    if(!exercise||!profile||!profile.name){message('Open or create a client first','The exercise was not added.');return}
    const programs=read('rafPrograms',{});
    const program=programs[profile.name]&&typeof programs[profile.name]==='object'?programs[profile.name]:{};
    program.exercises=Array.isArray(program.exercises)?program.exercises:[];
    if(program.exercises.some(item=>item.id===exercise.id)){button.textContent='Already added ✓';button.disabled=true;message('Already in program',exercise.name+' is already included.');return}
    program.exercises.push({...exercise,muscles:Array.isArray(exercise.muscles)?exercise.muscles:[]});
    programs[profile.name]=program;save('rafPrograms',programs);
    button.textContent='Added ✓';button.disabled=true;message('Exercise added to program',exercise.name+' has been added to your program.');
    if(typeof window.render==='function'&&!busy&&location.hash.slice(1)==='program'){busy=true;window.render('program');setTimeout(()=>busy=false,50)}
  }
  document.addEventListener('click',function(event){
    const button=event.target.closest&&event.target.closest('.add-library-exercise');
    if(button){event.preventDefault();event.stopImmediatePropagation();addToProgram(button);return}
    const home=event.target.closest&&event.target.closest('[data-raf-home]');
    if(home){event.preventDefault();localStorage.removeItem('rafProfile');location.hash='assessment';if(typeof window.render==='function')window.render('assessment')}
  },true);
  function homeButton(){
    const top=document.querySelector('.topbar');
    if(!top||top.querySelector('[data-raf-home]'))return;
    const b=document.createElement('button');b.type='button';b.dataset.rafHome='1';b.className='secondary';b.textContent='⌂ الصفحة الرئيسية';b.style.cssText='margin-left:12px;white-space:nowrap;';top.appendChild(b);
  }
  new MutationObserver(homeButton).observe(document.body,{childList:true,subtree:true});homeButton();
})();
