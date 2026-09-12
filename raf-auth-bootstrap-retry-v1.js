(()=>{'use strict';
function retry(){try{if(window.RAF_AUTH_V3?.boot)window.RAF_AUTH_V3.boot()}catch(e){}}
retry();setTimeout(retry,100);setTimeout(retry,300);setTimeout(retry,700);setTimeout(retry,1500);
})();