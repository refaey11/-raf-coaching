/* RAF Coaching — persistent program state */
(function(){
  function read(k,f){try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}}
  function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
  function preserveExtras(name,before){
    if(!name||!before)return;
    const programs=read('rafPrograms',{}), current=programs[name];
    if(!current)return;
    const ids=new Set((current.exercises||[]).map(e=>e.id));
    const extras=(before.exercises||[]).filter(e=>!ids.has(e.id));
    if(extras.length){current.exercises=[...(current.exercises||[]),...extras];programs[name]=current;write('rafPrograms',programs)}
  }
  document.addEventListener('submit',function(ev){
    const form=ev.target; if(!form||form.id!=='program-form')return;
    const profile=read('rafProfile',null); if(!profile||!window.RAF)return;
    const before=read('rafPrograms',{})[profile.name];
    setTimeout(function(){preserveExtras(profile.name,before)},0);
  },true);
  document.addEventListener('raf:program-updated',function(){
    const profile=read('rafProfile',null); if(!profile)return;
    const programs=read('rafPrograms',{}); if(programs[profile.name])write('rafPrograms',programs);
  });
})();
