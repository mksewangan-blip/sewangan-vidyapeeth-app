(function(){
'use strict';
let booted=false;
async function clearLegacyCaches(){
  try{if('serviceWorker' in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()));}}catch(e){}
  try{if(window.caches){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)));}}catch(e){}
}
function removeLegacyShell(){
  document.querySelectorAll('#appHeader,#appSidebar,#appFooter,.sv-home-header,.sv-bottom-nav,#sv24More,#sv22More,#sv20More').forEach(e=>{try{e.remove()}catch(_){}});
}
async function start(){
  if(booted)return; booted=true;
  await clearLegacyCaches();
  removeLegacyShell();
  // Reassert the one allowed auth/logout path after every legacy bundle has loaded.
  if(window.SV34){
    window.logoutUser=SV34.logout;
    window.logout=SV34.logout;
    window.showLogin=SV34.loginPage;
    window.authenticateUser=SV34.login;
    // One and only one cold-start restore.
    SV34.restore();
  }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
