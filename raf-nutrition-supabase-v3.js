(()=>{'use strict';
const URL='https://zkymvovbpfrwjyfwylbq.supabase.co',KEY='sb_publishable_9SgCU4D-48kgotUdi79gfQ_NaouEXbO';
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const selected=()=>read('rafActiveClient',null)||read('rafProfile',null);const role=()=>window.RAF_AUTH_ROLE||{};
const uuid=v=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
const db=()=>window.supabase?.createClient?window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,storageKey:'raf-auth-v3'}}):null;
const key=c=>c?.id||c?.email||c?.name||'default';
async function resolve(){const c=selected(),direct=c?.id||c?.user_id||c?.client_id;if(uuid(direct))return direct;const s=db(),coach=role().userId;if(!s||!coach)return null;const links=await s.from('coach_clients').select('client_id').eq('coach_id',coach);if(links.error)return null;const ids=(links.data||[]).map(x=>x.client_id);if(!ids.length)return null;const p=await s.from('profiles').select('id,full_name').in('id',ids);if(p.error)return null;const name=String(c?.name||c?.full_name||'').trim().toLowerCase();return p.data.find(x=>String(x.full_name||'').trim().toLowerCase()===name)?.id||null}
async function load(){const s=db();if(!s)return null;const id=role().isCoach?await resolve():role().userId;if(!uuid(id))return null;const r=await s.from('nutrition_plans').select('*').eq('client_id',id).eq('active',true).order('updated_at',{ascending:false}).limit(1).maybeSingle();if(r.error)return null;return r.data||null}
function cache(p){if(!p)return;const c=selected(),all=read('rafNutritionPlans',{}),k=key(c);all[k]={...p,bmr:p.bmr,rmr:p.bmr,height:p.height_cm,weight:p.weight_kg,activity:p.activity_level,protein:p.protein_g,carbs:p.carbs_g,fat:p.fat_g,fiber:p.fiber_g,water:p.water_ml,updatedAt:p.updated_at};localStorage.setItem('rafNutritionPlans',JSON.stringify(all));window.dispatchEvent(new CustomEvent('rafNutritionRemoteLoaded',{detail:p}))}
async function save(){if(!role().isCoach)return null;const c=selected(),p=read('rafNutritionPlans',{})[key(c)],id=await resolve(),s=db(),coach=role().userId;if(!s||!uuid(id)||!uuid(coach)||!p?.calories)throw Error('Nutrition target or client is not ready');
const off=await s.from('nutrition_plans').update({active:false}).eq('client_id',id).eq('active',true);if(off.error)throw off.error;
const row={client_id:id,coach_id:coach,sex:p.sex||null,age:+p.age||null,height_cm:+(p.height||p.height_cm)||null,weight_kg:+(p.weight||p.weight_kg)||null,activity_level:p.activity||p.activity_level||null,goal:p.goal||null,bmr:+(p.bmr||p.rmr)||null,tdee:+p.tdee||null,calories:+p.calories||null,protein_g:+(p.protein||p.protein_g)||null,carbs_g:+(p.carbs||p.carbs_g)||null,fat_g:+(p.fat||p.fat_g)||null,fiber_g:+(p.fiber||p.fiber_g)||0,water_ml:+(p.water||p.water_ml)||0,notes:p.notes||null,active:true,updated_at:new Date().toISOString()};
const r=await s.from('nutrition_plans').insert(row).select('*').single();if(r.error)throw r.error;cache(r.data);return r.data}
async function hydrate(){if(role().isCoach)return;const p=await load();if(p)cache(p)}
window.RAF_NUTRITION_SUPABASE_V3={load,save,hydrate,resolve};
document.addEventListener('raf-auth-ready',()=>setTimeout(hydrate,100));
document.addEventListener('rafNutritionPlanUpdated',()=>setTimeout(()=>save().catch(e=>console.warn('RAF nutrition sync failed',e)),150));
setTimeout(hydrate,1600);
})();