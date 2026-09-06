/* RAF Coaching — legacy local auth disabled. Supabase bridge is the only authentication layer. */
(function(){
  function removeLegacyGate(){
    document.getElementById('raf-auth-gate')?.remove();
    document.getElementById('raf-auth-overlay')?.remove();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',removeLegacyGate);
  else removeLegacyGate();
})();
