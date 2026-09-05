/* RAF Coaching final stability fix */
(function () {
  'use strict';
  const read = (key, fallback) => { try { const value = JSON.parse(localStorage.getItem(key)); return value == null ? fallback : value; } catch (_) { return fallback; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (_) { return false; } };
  const list = () => window.RAF && Array.isArray(RAF.RAF_EXERCISES) ? RAF.RAF_EXERCISES : [];
  function state() {
    const profile = read('rafProfile', null);
    if (!profile || !profile.name || !window.RAF || typeof RAF.buildProgram !== 'function') return null;
    const programs = read('rafPrograms', {});
    const base = RAF.buildProgram(profile);
    const saved = programs[profile.name];
    const program = saved && Array.isArray(saved.exercises) ? saved : base;
    program.exercises = Array.isArray(program.exercises) ? program.exercises : [];
    return { profile, programs, program };
  }
  function persist(s) {
    if (!s) return false;
    s.programs[s.profile.name] = s.program;
    return write('rafPrograms', s.programs) && write('rafCurrentProgram', s.program);
  }
  function save(form) {
    const s = state(); if (!s) return;
    const data = Object.fromEntries(new FormData(form));
    s.program.variables = { ...(s.program.variables || {}), sets: Number(data.sets) || 1, reps: data.reps || '', tempo: data.tempo || '', rest: data.rest || '', rir: Number(data.rir) || 0 };
    s.program.exercises = s.program.exercises.map((old, i) => list().find(x => String(x.id) === String(data['exercise_' + i])) || old);
    persist(s);
    const status = document.querySelector('#program-status');
    if (status) status.textContent = 'Saved successfully ✓ Refresh-safe';
  }
  function addReplace(button) {
    const id = button.getAttribute('data-exercise-id');
    const s = state(); const selected = list().find(x => String(x.id) === String(id));
    if (!s || !selected) return;
    const items = s.program.exercises; let index = -1;
    if (selected.category === 'Cardio') index = items.findIndex(x => x && x.category === 'Cardio');
    else if (selected.category) index = items.findIndex(x => x && x.category === selected.category);
    if (index >= 0) items[index] = selected;
    else if (!items.some(x => x && String(x.id) === String(selected.id))) items.push(selected);
    persist(s);
    button.textContent = 'Saved ✓';
    setTimeout(() => { button.textContent = 'Add / replace'; button.disabled = false; }, 900);
  }
  document.addEventListener('submit', function (e) {
    if (e.target && e.target.id === 'program-form') { e.preventDefault(); e.stopImmediatePropagation(); save(e.target); }
  }, true);
  document.addEventListener('click', function (e) {
    const button = e.target.closest && e.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-exercise-id') && /add\s*\/\s*replace/i.test(button.textContent || '')) {
      e.preventDefault(); e.stopImmediatePropagation(); addReplace(button);
    }
  }, true);
})();
