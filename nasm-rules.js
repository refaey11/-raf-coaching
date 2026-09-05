/* NASM Essentials 6e implementation layer — source-derived rules */
const NASM_RULES={
  assessment:['posture','movement','flexibility','core','balance','cardiorespiratory','health history','goals'],
  opt:{1:{name:'Stabilization Endurance',reps:'12–20',sets:'1–3',tempo:'4/2/1',rest:'0–90 sec',intensity:'50–70% 1RM'},2:{name:'Strength Endurance',reps:'8–12',sets:'2–4',tempo:'2/0/2',rest:'0–60 sec'},3:{name:'Hypertrophy',reps:'6–12',sets:'3–5',tempo:'2/0/2',rest:'0–60 sec',intensity:'75–85% 1RM'},4:{name:'Maximal Strength',reps:'1–5',sets:'4–6',tempo:'X/0/X',rest:'2–5 min',intensity:'85–100% 1RM'},5:{name:'Power',reps:'1–10',sets:'3–5',tempo:'X/0/X',rest:'1–5 min',intensity:'30–45% 1RM or up to 10% bodyweight'}},
  progression:'Progress only when posture, technique, range of motion, and control are acceptable.',
  regression:'If ideal posture or technique cannot be maintained, regress the exercise.',
  components:['flexibility','SMR','core','balance','plyometrics','SAQ','resistance','cardiorespiratory']
};
window.NASM_RULES=NASM_RULES;