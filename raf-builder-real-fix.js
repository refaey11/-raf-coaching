(()=>{
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const exerciseOptions=()=>((window.RAF&&window.RAF.RAF_EXERCISES)||[]).map(e=>`<option value="${esc(e.id)}">${esc(e.name)}</option>`).join('');
  function resizeProgram(name,days){
    const programs=read('rafPrograms',{}),p=programs[name]||{};
    p.variables=p.variables||{};
    p.days=Array.isArray(p.days)?p.days:[];
    while(p.days.length<days)p.days.push({name:`Day ${p.days.length+1}`,focus:'Training session',exercises:[]});
    p.days=p.days.slice(0,days).map((d,i)=>({...d,name:d.name||`Day ${i+1}`,exercises:Array.isArray(d.exercises)?d.exercises:[]}));
    p.exercises=p.days[0]?.exercises||[];p.variables.sets=p.variables.sets||3;p.variables.reps=p.variables.reps||'10-12';p.variables.tempo=p.variables.tempo||'2/0/2';p.variables.rest=p.variables.rest||'60 sec';
    programs[name]=p;write('rafPrograms',programs);
  }
  document.addEventListener('submit',e=>{
    const f=e.target;if(!f||f.id!=='assessment-form')return;
    e.preventDefault();e.stopImmediatePropagation();
    const d=Object.fromEntries(new FormData(f));d.age=+d.age;d.days=Math.max(1,Math.min(7,+d.days||1));
    const clients=read('rafClients',[]).filter(c=>c.name!==d.name);clients.push(d);
    write('rafProfile',d);write('rafClients',clients);resizeProgram(d.name,d.days);
    location.hash='program';if(typeof window.render==='function')window.render('program');else location.reload();
  },true);
  function enhance(){
    const form=document.querySelector('#program-form');if(!form||form.dataset.realFix)return;
    form.dataset.realFix='1';
    const card=[...form.querySelectorAll('.card')].find(x=>x.querySelector('select[name^="exercise_"]'));if(!card)return;
    const title=card.querySelector('h3');if(title)title.insertAdjacentHTML('afterend','<p class="muted">Add or remove exercises freely. Save this day when finished.</p>');
    const controls=document.createElement('div');controls.style='display:flex;gap:10px;flex-wrap:wrap;margin-top:14px';controls.innerHTML='<button type="button" class="secondary" data-add-ex>+ Add exercise</button><button type="button" class="secondary" data-remove-ex>− Remove last</button>';card.appendChild(controls);
    const renumber=()=>[...card.querySelectorAll('select[name^="exercise_"]')].forEach((s,i)=>{s.name=`exercise_${i}`;const l=s.closest('label');if(l)l.firstChild.textContent=`Exercise ${i+1}`});
    controls.querySelector('[data-add-ex]').onclick=()=>{const n=card.querySelectorAll('select[name^="exercise_"]').length;const l=document.createElement('label');l.innerHTML=`Exercise ${n+1}<select name="exercise_${n}"><option value="">-- Empty --</option>${exerciseOptions()}</select>`;controls.before(l)};
    controls.querySelector('[data-remove-ex]').onclick=()=>{const rows=card.querySelectorAll('select[name^="exercise_"]');if(rows.length>1)rows[rows.length-1].closest('label').remove();renumber()};
  }
  new MutationObserver(enhance).observe(document.documentElement,{subtree:true,childList:true});enhance();
})();