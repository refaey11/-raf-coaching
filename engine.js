/* RAF Coaching — NASM/OPT program engine (client-side MVP) */
const RAF_EXERCISES=[
 {id:'squat',name:'Back Squat',pattern:'squat',level:'intermediate',muscles:['quads','glutes'],equipment:'barbell'},
 {id:'bench',name:'Bench Press',pattern:'push',level:'intermediate',muscles:['chest','triceps'],equipment:'barbell'},
 {id:'incline-db',name:'Incline Dumbbell Press',pattern:'push',level:'beginner',muscles:['upper chest','shoulders'],equipment:'dumbbells'},
 {id:'lat-pulldown',name:'Lat Pulldown',pattern:'pull',level:'beginner',muscles:['lats','biceps'],equipment:'cable'},
 {id:'row',name:'Seated Row',pattern:'pull',level:'beginner',muscles:['back','biceps'],equipment:'cable'},
 {id:'rdl',name:'Romanian Deadlift',pattern:'hinge',level:'intermediate',muscles:['hamstrings','glutes'],equipment:'dumbbells'},
 {id:'leg-press',name:'Leg Press',pattern:'squat',level:'beginner',muscles:['quads','glutes'],equipment:'machine'},
 {id:'leg-curl',name:'Leg Curl',pattern:'hinge',level:'beginner',muscles:['hamstrings'],equipment:'machine'},
 {id:'lateral-raise',name:'Lateral Raise',pattern:'carry',level:'beginner',muscles:['side delts'],equipment:'dumbbells'},
 {id:'curl',name:'Dumbbell Curl',pattern:'pull',level:'beginner',muscles:['biceps'],equipment:'dumbbells'}
];
function selectOPTPhase(profile={}){if(profile.technique==='needs-regression'||profile.limitations)return 1;if(profile.goal==='muscle')return 3;if(profile.goal==='strength')return 4;if(profile.goal==='power')return 5;return 2}
function acuteVariables(phase){return ({1:{name:'Stabilization Endurance',sets:'1–3',reps:'12–20',tempo:'4/2/1',rest:'0–90 sec',rir:3},2:{name:'Strength Endurance',sets:'2–4',reps:'8–12',tempo:'2/0/2',rest:'0–60 sec',rir:2},3:{name:'Hypertrophy',sets:'3–5',reps:'6–12',tempo:'2/0/2',rest:'0–60 sec',rir:1},4:{name:'Maximal Strength',sets:'4–6',reps:'1–5',tempo:'X/0/X',rest:'2–5 min',rir:2},5:{name:'Power',sets:'3–5',reps:'1–5',tempo:'X/0/X',rest:'2–5 min',rir:2}})[phase]}
function buildProgram(profile={}){const phase=selectOPTPhase(profile),v=acuteVariables(phase);let pool=RAF_EXERCISES;if(profile.limitations)pool=pool.filter(e=>!['rdl','squat'].includes(e.id));return {phase,variables:v,exercises:pool.slice(0,6)}}
window.RAF={RAF_EXERCISES,selectOPTPhase,acuteVariables,buildProgram};