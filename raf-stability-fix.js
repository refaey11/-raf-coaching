/* RAF Coaching — final interaction safety layer */
(function(){
  function read(k,f){try{return JSON.parse(localStorage.getItem(k)||'')}catch(e){return f}}
  function saveAssessment(form){
    const data=Object.fromEntries(new FormData(form));
    data.age=Number(data.age); data.days=Number(data.days);
    const profile=read('rafProfile',{}); const clients=read('rafClients',[]); const programs=read('rafPrograms',{});
    localStorage.setItem('rafProfile',JSON.stringify(data));
    localStorage.setItem('rafClients',JSON.stringify([...clients.filter(c=>c.name!==data.name),data]));
    if(window.RAF&&RAF.buildProgram){programs[data.name]=programs[data.name]||RAF.buildProgram(data);localStorage.setItem('rafPrograms',JSON.stringify(programs));}
    location.hash='program'; if(typeof window.render==='function')window.render('program');
  }
  document.addEventListener('submit',function(e){
    if(e.target&&e.target.id==='assessment-form'){e.preventDefault();e.stopImmediatePropagation();saveAssessment(e.target)}
  },true);
  document.addEventListener('click',function(e){
    const b=e.target.closest('button'); if(!b)return;
    if(b.id==='custom-exercise-add')return;
    if(b.classList.contains('add-library-exercise'))return;
    if(b.textContent.trim()==='Add to program'){
      const card=b.closest('article'); const name=card&&card.querySelector('strong')&&card.querySelector('strong').textContent.trim();
      const ex=window.RAF&&RAF.RAF_EXERCISES&&RAF.RAF_EXERCISES.find(x=>x.name===name); if(!ex)return;
      const p=read('rafProfile',{}), all=read('rafPrograms',{}), n=p.name||'Current Client'; const prog=all[n]||(RAF.buildProgram?RAF.buildProgram(p):{exercises:[]}); prog.exercises=prog.exercises||[];
      if(!prog.exercises.some(x=>x.id===ex.id))prog.exercises.push(ex); all[n]=prog; localStorage.setItem('rafPrograms',JSON.stringify(all)); b.textContent='Added ✓'; b.disabled=true; e.preventDefault(); e.stopImmediatePropagation();
    }
  },true);
})();
