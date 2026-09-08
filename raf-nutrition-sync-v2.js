(()=>{'use strict';
const PLAN_KEY='rafNutritionPlans',FOOD_KEY='rafNutritionFoodLogs',FOLLOW_KEY='rafNutritionFollowup',ASSESS_KEY='rafNutritionAssessments';
function active(){try{const x=JSON.parse(localStorage.getItem('rafActiveClient')||'null');if(x)return x}catch(e){}return null}
function clientId(){const c=active();return c&&(c.id||c.uuid)||null}
function aliases(){const c=active()||{};return [...new Set([c.id,c.uuid,c.email,c.name].filter(Boolean).map(String))]}
function read(k){try{return JSON.parse(localStorage.getItem(k)||'{}')}catch(e){return {}}}
function mirror(k,value){const all=read(k);aliases().forEach(a=>all[a]=value);localStorage.setItem(k,JSON.stringify(all));}
function supa(){return window.supabaseClient||window.supabase||null}
async function push(table,payload){const s=supa(),id=clientId();if(!s||!id||!s.from)return false;try{const r=await s.from(table).upsert({...payload,client_id:id},{onConflict:payload.log_date?'client_id,log_date':'client_id'});return !r.error}catch(e){return false}}
async function sync(){const id=clientId();if(!id)return;const p=read(PLAN_KEY);const plan=aliases().map(a=>p[a]).find(Boolean);if(plan)await push('nutrition_plans',{client_id:id,plan,updated_at:new Date().toISOString()});const f=read(FOOD_KEY);const foods=aliases().map(a=>f[a]).find(Boolean);if(Array.isArray(foods)){for(const x of foods){await push('nutrition_food_logs',{client_id:id,meal_name:x.meal_name||x.meal||'Meal',food_name:x.food_name||x.food||'',grams:Number(x.grams||0),calories:Number(x.calories||0),protein:Number(x.protein||0),carbs:Number(x.carbs||x.carbs_g||0),fat:Number(x.fat||0),log_date:x.log_date||new Date().toISOString().slice(0,10)})}}}
window.RAFNutritionSync={activeClientId:clientId,sync,mirror};
window.addEventListener('rafNutritionPlanUpdated',sync);window.addEventListener('rafNutritionFoodUpdated',sync);window.addEventListener('rafNutritionFollowupUpdated',sync);window.addEventListener('rafNutritionAssessmentUpdated',sync);setTimeout(sync,1200);
})();