(()=>{'use strict';
const COACH='refaey11@icloud.com';const SUPABASE_URL='https://zkymvovbpfrwjyfwylbq.supabase.co';const SUPABASE_KEY='sb_publishable_9SgCU4D-48kgotUdi79gfQ_NaouEXbO';
let client,booted=false;
const norm=v=>String(v||'').trim().toLowerCase();
function sb(){if(client)return client;if(window.supabase?.createClient)client=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false});return client}
function publish(user){if(!user){window.RAF_AUTH_ROLE={authenticated:false,email:'',role:'client',isCoach:false};return}const email=norm(user.email);window.RAF_AUTH_ROLE={authenticated:true,email,role:email===COACH?'coach':'client',isCoach:email===COACH,userId:user.id};document.body.dataset.rafRole=window.RAF_AUTH_ROLE.role;document.dispatchEvent(new CustomEvent('raf-auth-ready',{detail:window.RAF_AUTH_ROLE}))}
async function boot(){if(booted)return;const s=sb();if(!s)return;booted=true;s.auth.onAuthStateChange((event,session)=>{publish(session?.user||null);if(event==='SIGNED_OUT')location.replace('login.html')});const r=await s.auth.getSession();if(r.error){booted=false;return}if(!r.data?.session?.user){location.replace('login.html');return}publish(r.data.session.user)}
window.RAF_AUTH_V3={boot,refresh:publish,logout:async()=>{const s=sb();if(s)await s.auth.signOut();location.replace('login.html')}};boot();
})();