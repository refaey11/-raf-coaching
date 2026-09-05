const content=document.querySelector('#app-content');
const title=document.querySelector('#page-title');
let saved=JSON.parse(localStorage.getItem('rafProfile')||'null');
let clients=JSON.parse(localStorage.getItem('rafClients')||'[]');
let programs=JSON.parse(localStorage.getItem('rafPrograms')||'{}');

const views={
 dashboard:{title:'Dashboard',html:()=>`<div class="hero"><p class="eyebrow">RAF COACHING</p><h2>Build a smarter coaching journey.</h2><p class="muted">Manage clients, assessments and individualized NASM/OPT-based plans.</p><button class="primary" data-view="clients">Open clients →</button></div><div class="grid"><div class="card"><div class="stat">${clients.length}</div><div class="label">Clients</div></div><div class="card"><div class="stat">${saved?RAF.selectOPTPhase(saved):'—'}</div><div class="label">Current OPT phase</div></div></div>`},
 clients:{title:'Clients',html:()=>`<div class="hero"><p class="eyebrow">COACH WORKSPACE</p><h2>Your clients</h2><p class="muted">Create a client profile and open their coaching workspace.</p><button class="primary" data-view="assessment">+ Add client</button></div><div class="card">${clients.length?clients.map((c,i)=>`<div class="workout"><div><strong>${c.name}</strong><div class="muted">Age ${c.age} · ${c.goal} · ${c.days} days/week</div></div><button class="secondary" data-client="${i}">Open profile</button></div>`).join(''):'<p class="muted">No clients yet. Add your first client.</p>'}</div>`},
 assessment:{title:'Client Assessment',html:()=>`<div class="hero"><p class="eyebrow">STEP 1 · ASSESSMENT</p><h2>Create a client profile.</h2><p class="muted">The coach remains the final decision-maker. This tool does not diagnose injuries.</p></div><form id="assessment-form" class="card form-grid"><label>Name<input name="name" required value="${saved?.name||''}"></label><label>Age<input name="age" type="number" min="13" max="100" required value="${saved?.age||''}"></label><label>Goal<select name="goal"><option value="muscle">Muscle gain</option><option value="fat-loss">Fat loss</option><option value="strength">Strength</option><option value="power">Power</option></select></label><label>Experience<select name="experience"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label><label>Technique<select name="technique"><option value="good">Good technique</option><option value="needs-regression">Needs regression</option></select></label><label>Limitations<select name="limitations"><option value="">None reported</option><option value="knee">Knee limitation</option><option value="back">Back limitation</option></select></label><label>Training days<input name="days" type="number" min="1" max="7" value="${saved?.days||4}"></label><label>Equipment<select name="equipment"><option value="gym">Full gym</option><option value="home">Home equipment</option></select></label><button class="primary" type="submit">Save client & generate program</button></form>`},
 program:{title:'Program Builder',html:()=>programHTML()}
};

function programHTML(){
 if(!saved)return '<div class="card"><p class="muted">Complete the assessment first.</p><button class="primary" data-view="assessment">Open assessment</button></div>';
 const base=RAF.buildProgram(saved);
 const current=programs[saved.name]||base;
 return `<div class="hero"><p class="eyebrow">NASM / OPT PROGRAM BUILDER</p><h2>${saved.name} · Phase ${current.phase}</h2><p class="muted">Edit the acute variables, then save the coach-approved draft.</p></div><form id="program-form"><div class="card form-grid"><label>Sets<input name="sets" type="number" min="1" max="10" value="${current.variables.sets}"></label><label>Reps<input name="reps" value="${current.variables.reps}"></label><label>Tempo<input name="tempo" value="${current.variables.tempo}"></label><label>Rest<input name="rest" value="${current.variables.rest}"></label><label>RIR<input name="rir" type="number" min="0" max="5" value="${current.variables.rir}"></label></div><div class="card">${current.exercises.map((e,i)=>`<div class="workout"><div><strong>${i+1}. ${e.name}</strong><div class="muted">${e.muscles.join(' · ')} · ${e.equipment}</div></div><span class="tag">${current.variables.reps}</span></div>`).join('')}</div><button class="primary" type="submit">Save customized program</button></form><p id="program-status" class="muted"></p>`;
}

function render(view='dashboard'){
 const v=views[view]||views.dashboard;
 title.textContent=v.title;
 content.innerHTML=typeof v.html==='function'?v.html():v.html;
 document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.view===view));
 document.querySelectorAll('[data-view]').forEach(x=>x.onclick=()=>{location.hash=x.dataset.view;render(x.dataset.view)});
 document.querySelectorAll('[data-client]').forEach(x=>x.onclick=()=>{saved=clients[Number(x.dataset.client)];localStorage.setItem('rafProfile',JSON.stringify(saved));location.hash='program';render('program')});
 const form=document.querySelector('#assessment-form');
 if(form)form.onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form));data.age=Number(data.age);data.days=Number(data.days);data.limitations=Boolean(data.limitations);saved=data;clients=[...clients.filter(c=>c.name!==data.name),data];localStorage.setItem('rafProfile',JSON.stringify(data));localStorage.setItem('rafClients',JSON.stringify(clients));location.hash='program';render('program')};
 const pf=document.querySelector('#program-form');
 if(pf)pf.onsubmit=e=>{e.preventDefault();const base=RAF.buildProgram(saved);const data=Object.fromEntries(new FormData(pf));base.variables={...base.variables,sets:Number(data.sets),reps:data.reps,tempo:data.tempo,rest:data.rest,rir:Number(data.rir)};programs[saved.name]=base;localStorage.setItem('rafPrograms',JSON.stringify(programs));const status=document.querySelector('#program-status');if(status)status.textContent='Saved locally · Coach approval pending';};
}
render(location.hash.replace('#','')||'dashboard');