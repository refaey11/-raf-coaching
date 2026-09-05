(()=>{
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}},save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const map={
    'forward head':['wall-slide','cat-cow'],
    'rounded shoulders':['wall-slide','cat-cow'],
    'anterior pelvic tilt':['glute-bridge','hip-flexor-stretch','dead-bug'],
    'knees inward':['glute-bridge'],
    'feet turn out':['calf-mobility'],
    'ankle':['calf-mobility'],
    'hip':['glute-bridge','hip-flexor-stretch'],
    'shoulder':['wall-slide'],
    'thoracic spine':['cat-cow'],
    'back':['dead-bug','bird-dog'],
    'chest/shoulders':['wall-slide'],
    'hip flexors':['hip-flexor-stretch'],
    'calves':['calf-mobility']
  };
  function enrich(){
    const ps=read('rafPrograms',{}),lib=window.RAF?.RAF_EXERCISES||[];let changed=false;
    Object.values(ps).forEach(p=>{
      const findings=Array.isArray(p.assessmentFindings)?p.assessmentFindings:[];
      const ids=[...new Set(findings.flatMap(f=>{const text=String(f.focus||f.value||'').toLowerCase();return Object.entries(map).filter(([key])=>text.includes(key)).flatMap(([,v])=>v)}))];
      const existing=(p.days?.[0]?.exercises||[]).filter(e=>e.assessmentGenerated);
      const day=p.days?.[0]; if(!day)return;
      ids.forEach(id=>{
        const hit=lib.find(x=>x.id===id); if(!hit||existing.some(e=>e.id===id))return;
        day.exercises.push({...hit,id,assessmentGenerated:true,category:'corrective',sets:2,reps:'8-12',tempo:'controlled',rest:'30-60 sec',notes:'Perform pain-free; reassess before progression.'});changed=true;
      });
      p.exercises=day.exercises;
    });
    if(changed)save('rafPrograms',ps);
  }
  document.addEventListener('DOMContentLoaded',enrich);
})();
