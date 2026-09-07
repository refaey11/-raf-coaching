/* RAF Coaching — Arabic / English language toggle v2 */
(function(){
  const translations={
    'Dashboard':'لوحة التحكم','Clients':'العملاء','Assessment':'التقييم','Program Builder':'منشئ البرامج','NASM Rules':'قواعد NASM','Workout':'التمرين','Nutrition':'التغذية','Progress':'التقدم','Home':'الرئيسية','PERSONAL COACHING PLATFORM':'منصة التدريب الشخصي','CLIENT PORTAL':'مساحة العميل','Welcome,':'مرحبًا،','Your private coaching space for workouts, nutrition, progress and check-ins.':'مساحتك الخاصة للتمارين والتغذية والتقدم والمتابعة.','Plan pending coach approval':'الخطة في انتظار موافقة المدرب','Your information was submitted successfully.':'تم إرسال بياناتك بنجاح.','Your coach must review and approve it before your real plan appears.':'يجب على المدرب مراجعة بياناتك والموافقة عليها قبل ظهور خطتك الفعلية.','Waiting for review':'في انتظار المراجعة','Check-in':'المتابعة','Upload your latest body measurements and progress photos for your coach.':'ارفع أحدث قياسات جسمك وصور تقدمك إلى مدربك.','Body weight (kg)':'وزن الجسم (كجم)','Height (cm)':'الطول (سم)','Sign in':'تسجيل الدخول','Create client account':'إنشاء حساب عميل','Forgot password?':'نسيت كلمة السر؟','Log out':'تسجيل الخروج','Logout':'تسجيل الخروج','Save':'حفظ','Cancel':'إلغاء','Submit':'إرسال','Next':'التالي','Back':'رجوع','Edit':'تعديل','Delete':'حذف','Loading...':'جارٍ التحميل...','No data available':'لا توجد بيانات متاحة','Waiting for review':'في انتظار المراجعة','English':'English','العربية':'العربية'};
  const reverse=Object.fromEntries(Object.entries(translations).map(([e,a])=>[a,e]));
  let lang=localStorage.getItem('rafLanguage')||'en', applying=false;
  function translateText(node){
    if(node.nodeType!==3)return;
    let value=node.nodeValue;
    const dict=lang==='ar'?translations:reverse;
    Object.keys(dict).sort((a,b)=>b.length-a.length).forEach(key=>{if(value.includes(key))value=value.split(key).join(dict[key]);});
    node.nodeValue=value;
  }
  function apply(){
    if(applying)return; applying=true;
    document.documentElement.lang=lang; document.documentElement.dir=lang==='ar'?'rtl':'ltr';
    document.body.classList.toggle('raf-arabic',lang==='ar');
    document.querySelectorAll('body *').forEach(el=>{
      if(el.id==='raf-language-toggle')return;
      el.childNodes.forEach(translateText);
      ['placeholder','title','aria-label'].forEach(attr=>{const v=el.getAttribute?.(attr);if(!v)return;const d=lang==='ar'?translations:reverse;el.setAttribute(attr,d[v]||v)});
    });
    const b=document.getElementById('raf-language-toggle'); if(b)b.textContent=lang==='ar'?'English':'العربية';
    applying=false;
  }
  function addButton(){
    if(document.getElementById('raf-language-toggle'))return;
    const b=document.createElement('button'); b.id='raf-language-toggle'; b.type='button';
    b.onclick=()=>{lang=lang==='ar'?'en':'ar';localStorage.setItem('rafLanguage',lang);apply()};
    b.style.cssText='position:fixed;top:18px;right:110px;z-index:99998;background:#101712;color:#c1ff63;border:1px solid #304238;border-radius:999px;padding:10px 15px;font-weight:700;font-size:14px;cursor:pointer';
    document.body.appendChild(b); apply();
  }
  function boot(){addButton();let queued=false;const observer=new MutationObserver(()=>{if(queued||applying)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})});observer.observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
