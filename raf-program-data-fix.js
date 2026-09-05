(()=>{
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const profile=read('rafProfile',null);
  if(!profile?.name)return;
  const programs=read('rafPrograms',{});
  const p=programs[profile.name];
  if(!p||!Array.isArray(p.days))return;
  const wanted=Math.max(1,Math.min(7,Number(profile.days)||1));
  let changed=false;
  if(p.days.length!==wanted){
    p.days=Array.from({length:wanted},(_,i)=>p.days[i]||({name:`Day ${i+1}`,focus:'Training session',exercises:[]}));
    p.days=p.days.slice(0,wanted);
    changed=true;
  }
  p.days=p.days.map((d,i)=>({...d,name:`Day ${i+1}`,focus:d.focus||'Training session',exercises:Array.isArray(d.exercises)?d.exercises:[]}));
  p.variables=p.variables||{};
  if(!p.variables.sets){p.variables.sets=3;changed=true}
  if(!p.variables.reps){p.variables.reps='10-12';changed=true}
  if(!p.variables.tempo){p.variables.tempo='2/0/2';changed=true}
  if(!p.variables.rest){p.variables.rest='60 sec';changed=true}
  p.exercises=p.days[0]?.exercises||[];
  if(changed){programs[profile.name]=p;write('rafPrograms',programs);if(location.hash==='#program'&&!sessionStorage.getItem('rafProgramDataFixed')){sessionStorage.setItem('rafProgramDataFixed','1');location.reload()}}
})();