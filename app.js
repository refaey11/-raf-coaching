const content = document.querySelector('#app-content');
const title = document.querySelector('#page-title');
const read = (key, fallback) => { try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; } catch { return fallback; } };
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
let saved = read('rafProfile', null);
let clients = read('rafClients', []);
let programs = read('rafPrograms', {});

function safeExercise(e) {
  return { ...e, muscles: Array.isArray(e?.muscles) ? e.muscles : [], equipment: e?.equipment || 'Not specified', instruction: e?.instruction || 'Perform with controlled technique.' };
}
function freshProgram(profile) {
  const p = RAF.buildProgram(profile) || {};
  p.variables = p.variables || {};
  p.exercises = Array.isArray(p.exercises) ? p.exercises.map(safeExercise) : [];
  return p;
}
function getProgram(profile) {
  const base = freshProgram(profile);
  const stored = programs[profile.name];
  if (!stored || typeof stored !== 'object') return base;
  return { ...base, ...stored, variables: { ...base.variables, ...(stored.variables || {}) }, exercises: Array.isArray(stored.exercises) ? stored.exercises.map(safeExercise) : base.exercises };
}
function exerciseOptions(selected) { return (RAF.RAF_EXERCISES || []).map(e => `<option value="${e.id}" ${e.id === selected ? 'selected' : ''}>${e.name}</option>`).join(''); }

const views = {
 dashboard: { title: 'Dashboard', html: () => `<div class="hero"><p class="eyebrow">RAF COACHING</p><h2>Build a smarter coaching journey.</h2><p class="muted">Manage clients, assessments and individualized NASM/OPT-based plans.</p><button class="primary" data-view="clients">Open clients →</button></div><div class="grid"><div class="card"><div class="stat">${clients.length}</div><div class="label">Clients</div></div><div class="card"><div class="stat">${saved ? RAF.selectOPTPhase(saved) : '—'}</div><div class="label">Current OPT phase</div></div></div>` },
 clients: { title: 'Clients', html: () => `<div class="hero"><p class="eyebrow">COACH WORKSPACE</p><h2>Your clients</h2><p class="muted">Create a client profile and open their coaching workspace.</p><button class="primary" data-view="assessment">+ Add client</button></div><div class="card">${clients.length ? clients.map((c, i) => `<div class="workout"><div><strong>${c.name}</strong><div class="muted">Age ${c.age} · ${c.goal} · ${c.days} days/week</div></div><button class="secondary" data-client="${i}">Open profile</button></div>`).join('') : '<p class="muted">No clients yet. Add your first client.</p>'}</div>` },
 assessment: { title: 'Client Assessment', html: () => `<div class="hero"><p class="eyebrow">STEP 1 · ASSESSMENT</p><h2>Create a client profile.</h2><p class="muted">The coach remains the final decision-maker. This tool does not diagnose injuries.</p></div><form id="assessment-form" class="card form-grid"><label>Name<input name="name" required value="${saved?.name || ''}"></label><label>Age<input name="age" type="number" min="13" max="100" required value="${saved?.age || ''}"></label><label>Goal<select name="goal"><option value="muscle">Muscle gain</option><option value="fat-loss">Fat loss</option><option value="strength">Strength</option><option value="power">Power</option></select></label><label>Experience<select name="experience"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select></label><label>Technique<select name="technique"><option value="good">Good technique</option><option value="needs-regression">Needs regression</option></select></label><label>Limitations<select name="limitations"><option value="none">None reported</option><option value="knee">Knee limitation</option><option value="back">Back limitation</option></select></label><label>Training days<input name="days" type="number" min="1" max="7" value="${saved?.days || 4}"></label><label>Equipment<select name="equipment"><option value="gym">Full gym</option><option value="home">Home equipment</option></select></label><button class="primary" type="submit">Save client & generate program</button></form>` },
 program: { title: 'Program Builder', html: () => programHTML() },
 rules: { title: 'NASM Rules', html: () => `<div class="hero"><p class="eyebrow">COACHING KNOWLEDGE BASE</p><h2>NASM / OPT rules</h2><p class="muted">The engine uses these rules as decision support; the coach approves every program.</p></div>` }
};
function programHTML() {
  saved = read('rafProfile', null); programs = read('rafPrograms', {});
  if (!saved) return '<div class="card"><p class="muted">Complete the assessment first.</p><button class="primary" data-view="assessment" type="button">Open assessment</button></div>';
  const current = getProgram(saved), v = current.variables || {};
  return `<div class="hero"><p class="eyebrow">NASM / OPT PROGRAM BUILDER</p><h2>${saved.name} · Phase ${current.phase || ''}</h2><p class="muted">${current.phaseName || v.name || ''} · ${current.goal || saved.goal || ''}</p><p class="muted">${v.sets || ''} sets · ${v.reps || ''} reps · Tempo ${v.tempo || ''} · Rest ${v.rest || ''} · RIR ${v.rir ?? ''}</p></div><div class="card"><strong>Why this decision?</strong><p class="muted">${current.decision?.reason || 'Based on the assessment and selected goal.'}</p><strong>Progression rule</strong><p class="muted">${current.progression?.rule || 'Progress gradually after successful execution.'}</p></div><form id="program-form"><div class="card form-grid"><label>Sets<input name="sets" type="number" min="1" max="10" value="${v.sets || 3}"></label><label>Reps<input name="reps" value="${v.reps || ''}"></label><label>Tempo<input name="tempo" value="${v.tempo || ''}"></label><label>Rest<input name="rest" value="${v.rest || ''}"></label><label>RIR<input name="rir" type="number" min="0" max="5" value="${v.rir ?? 2}"></label></div><div class="card"><p class="muted">Choose a different exercise whenever you want.</p>${current.exercises.map((e, i) => `<div class="workout"><div><strong>${i + 1}. ${e.name}</strong><div class="muted">${e.muscles.join(' · ')} · ${e.equipment}</div><small>${e.instruction}</small><label>Replace exercise<select name="exercise_${i}">${exerciseOptions(e.id)}</select></label></div><span class="tag">${v.reps || ''}</span></div>`).join('')}</div><button class="primary" type="submit">Save customized program</button></form><p id="program-status" class="muted"></p>`;
}
function bind() {
  document.querySelectorAll('[data-view]').forEach(x => x.onclick = () => { location.hash = x.dataset.view; render(x.dataset.view); });
  document.querySelectorAll('[data-client]').forEach(x => x.onclick = () => { saved = clients[Number(x.dataset.client)]; write('rafProfile', saved); location.hash = 'program'; render('program'); });
  const form = document.querySelector('#assessment-form');
  if (form) form.onsubmit = e => { e.preventDefault(); const data = Object.fromEntries(new FormData(form)); data.age = Number(data.age); data.days = Number(data.days); saved = data; clients = [...clients.filter(c => c.name !== data.name), data]; write('rafProfile', data); write('rafClients', clients); if (!programs[data.name]) { programs[data.name] = freshProgram(data); write('rafPrograms', programs); } location.hash = 'program'; render('program'); };
  const pf = document.querySelector('#program-form');
  if (pf) pf.onsubmit = e => { e.preventDefault(); const current = getProgram(saved), data = Object.fromEntries(new FormData(pf)); current.variables = { ...current.variables, sets: Number(data.sets), reps: data.reps, tempo: data.tempo, rest: data.rest, rir: Number(data.rir) }; current.exercises = current.exercises.map((old, i) => safeExercise((RAF.RAF_EXERCISES || []).find(x => x.id === data[`exercise_${i}`]) || old)); programs[saved.name] = current; write('rafPrograms', programs); const status = document.querySelector('#program-status'); if (status) status.textContent = 'Saved locally ✓'; };
}
function render(view = 'dashboard') { saved = read('rafProfile', null); clients = read('rafClients', []); programs = read('rafPrograms', {}); const v = views[view] || views.dashboard; title.textContent = v.title; content.innerHTML = v.html(); document.querySelectorAll('.nav-item').forEach(x => x.classList.toggle('active', x.dataset.view === view)); bind(); }
window.addEventListener('error', e => console.error('RAF runtime error:', e.error || e.message));
render(location.hash.replace('#', '') || 'dashboard');