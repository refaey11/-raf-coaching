(()=>{
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const resize=(p,wanted)=>{
    p=p&&typeof p==='object'?p:{};
    p.variables=p.variables||{};
    p.variables.sets=p.variables.sets??3;
    p.variables.reps=p.variables.reps??'10-12';
    p.variables.tempo=p.variables.tempo??'2/0/2';
    p.variables.rest=p.variables.rest??'60 sec';
    const old=Array.isArray(p.days)?p.days:[];
    p.days=Array.from({length:wanted},(_,i)=>old[i]||{name:`Day ${i+1}`,focus:i?'Training session':'Full Body',exercises:[]}).map((d,i)=>({...d,name:`Day ${i+1}`,focus:d.focus||'Training session',exercises:Array.isArray(d.exercises)?d.exercises:[]}));
    p.exercises=p.days[0]?.exercises||[];
    return p;
  };
  document.addEventListener('submit',e=>{
    const form=e.target;
    if(form?.id!=='assessment-form')return;
    e.preventDefault();e.stopImmediatePropagation();
    const d=Object.fromEntries(new FormData(form));
    d.age=Number(d.age);d.days=Math.max(1,Math.min(7,Number(d.days)||1));
    let clients=read('rafClients',[]),programs=read('rafPrograms',{});
    const existing=programs[d.name];
    let p=existing||window.RAF?.buildProgram?.(d)||{};
    p=resize(p,d.days);
    clients=[...clients.filter(c=>c.name!==d.name),d];
    programs[d.name]=p;
    write('rafProfile',d);write('rafClients',clients);write('rafPrograms',programs);
    sessionStorage.removeItem('rafProgramDataFixed');
    location.hash='program';location.reload();
  },true);
})();