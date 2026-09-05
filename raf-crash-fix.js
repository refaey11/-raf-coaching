/* RAF crash guard: normalize saved exercises before Program Builder renders. */
(function () {
  'use strict';
  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || ''); } catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }
  function normalizeExercise(ex) {
    ex = ex || {};
    if (!Array.isArray(ex.muscles)) ex.muscles = ex.muscle ? [ex.muscle] : ['General'];
    if (!ex.equipment) ex.equipment = 'Not specified';
    if (!ex.instruction) ex.instruction = 'Perform with controlled technique.';
    if (!ex.name) ex.name = 'Exercise';
    return ex;
  }
  function repair() {
    var programs = read('rafPrograms', {});
    if (programs && typeof programs === 'object') {
      Object.keys(programs).forEach(function (name) {
        var p = programs[name];
        if (!p || typeof p !== 'object') return;
        if (!p.variables) p.variables = { sets: 3, reps: '8–12', tempo: 'Controlled', rest: '60s', rir: 2, name: 'Custom Program' };
        if (!Array.isArray(p.exercises)) p.exercises = [];
        p.exercises = p.exercises.map(normalizeExercise);
      });
      write('rafPrograms', programs);
    }
    if (window.RAF && Array.isArray(RAF.RAF_EXERCISES)) RAF.RAF_EXERCISES = RAF.RAF_EXERCISES.map(normalizeExercise);
  }
  repair();
  document.addEventListener('raf:program-updated', repair);
  window.addEventListener('hashchange', repair);
})();
