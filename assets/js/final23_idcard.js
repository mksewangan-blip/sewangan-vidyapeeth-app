(function(){'use strict';
const tr=(e,h)=>localStorage.getItem('sv_language')==='hi'?h:e;
const db=(k,f)=>{try{return window.SV12?.data?.(k,f)||[]}catch(e){try{return JSON.parse(localStorage.getItem(f)||'[]')}catch(_){return[]}}};
const usr=()=>{try{return JSON.parse(sessionStorage.getItem('svmsCurrentUser')||'{}')}catch(e){return{}}};
const val=(o,...ks)=>{for(const k of ks)if(o&&o[k]!=null&&String(o[k]).trim()!=='')return o[k];return''};
const popup=(m,t='success')=>window.SV12?.popup?SV12.popup(m,t):alert(m);
const findStudent=id=>db('STUDENTS','svms_students').find(s=>String(s.studentId||'')===String(id||''));
const centre=()=>{let a=db('CENTRES','svms_centres');return a.find(c=>String(c.centreId||'')===String(usr().centreId||''))||a[0]||{}};
function loadImage(src){return new Promise((res,rej)=>{let i=new Image();i.crossOrigin='anonymous';i.onload=()=>res(i);i.onerror=rej;i.src=src})}
function fit(ctx,text,x,y,maxW,size,bold=false){text=String(text||'');ctx.font=(bold?'700 ':'500 ')+size+'px Arial';while(ctx.measureText(text).width>maxW&&size>14){size--;ctx.font=(bold?'700 ':'500 ')+size+'px Arial'}ctx.fillText(text,x,y)}
async function qr(text){try{return await loadImage('https://api.qrserver.com/v1/create-qr-code/?size=180x180&data='+encodeURIComponent(text))}catch(e){return null}}
async function generate(id){
 let s=findStudent(id);if(!s)return popup(tr('Student record not found.','विद्यार्थी रिकॉर्ड नहीं मिला।'),'error');
 let c=centre(),cv=document.createElement('canvas');cv.width=1011;cv.height=639;let x=cv.getContext('2d');
 x.fillStyle='#fff';x.fillRect(0,0,1011,639);
 x.fillStyle='#2f6d00';x.beginPath();x.moveTo(0,0);x.lineTo(282,0);x.lineTo(0,164);x.fill();
 x.fillStyle='#ffd31c';x.beginPath();x.moveTo(0,120);x.lineTo(110,120);x.lineTo(0,260);x.fill();
 x.fillStyle='#2f6d00';x.beginPath();x.moveTo(1011,430);x.lineTo(1011,639);x.lineTo(560,639);x.fill();
 x.fillStyle='#ffd31c';x.beginPath();x.moveTo(910,324);x.lineTo(1011,380);x.lineTo(1011,500);x.lineTo(728,500);x.fill();
 x.fillStyle='#ff7317';x.beginPath();x.moveTo(962,365);x.lineTo(1011,392);x.lineTo(1011,469);x.lineTo(915,416);x.fill();
 x.strokeStyle='#688b2a';x.lineWidth=4;x.beginPath();x.moveTo(350,82);x.bezierCurveTo(585,145,760,118,978,154);x.stroke();
 x.strokeStyle='#d7b44a';x.lineWidth=3;x.beginPath();x.moveTo(380,96);x.bezierCurveTo(610,180,760,158,995,218);x.stroke();
 x.fillStyle='#426c12';fit(x,'Reg. No. : 02/2026',190,70,310,24,true);fit(x,'Sewangan Vidyapeeth',552,70,350,25,true);
 x.fillStyle='#666';fit(x,'Run under the aegis of Sewangan Charitable Trust',552,100,390,15,false);
 try{x.drawImage(await loadImage('assets/images/logo.png'),900,18,82,82)}catch(e){}
 x.fillStyle='#e9f3f8';x.fillRect(66,152,250,335);
 let p=val(s,'photoUrl','studentPhotoUrl','photo');if(p)try{let im=await loadImage(p),sc=Math.max(250/im.width,335/im.height),w=im.width*sc,h=im.height*sc;x.save();x.beginPath();x.rect(66,152,250,335);x.clip();x.drawImage(im,66+(250-w)/2,152+(335-h)/2,w,h);x.restore()}catch(e){}
 x.fillStyle='#09253d';fit(x,val(s,'name','studentName')||'Student Name',385,255,535,58,true);
 x.fillStyle='#2f6d00';x.beginPath();x.roundRect(382,300,365,45,10);x.fill();x.fillStyle='#fff';fit(x,'Student ID : '+val(s,'studentId','admissionNo'),395,331,335,23,true);
 x.fillStyle='#333';fit(x,'Class : '+val(s,'class','studentClass')+'   Roll No. : '+val(s,'rollNo'),388,395,500,22,false);
 fit(x,'+91 '+val(s,'fatherMobile','motherMobile','otherGuardianMobile','mobile'),388,438,500,22,false);fit(x,val(s,'address')||val(c,'address'),388,480,500,21,false);
 let profile=location.origin+location.pathname+'?student='+encodeURIComponent(val(s,'studentId'));let q=await qr(profile);if(q)x.drawImage(q,70,510,105,105);
 x.font='12px Arial';x.fillText(val(s,'studentId','admissionNo'),70,630);
 let data=cv.toDataURL('image/jpeg',.94),name=(val(s,'name','studentName')||'student').replace(/\s+/g,'_');window.__sv23ID={data,name};
 let html='<div class="sv23-card-result"><img src="'+data+'"><div class="sv23-id-actions"><button onclick="SV23ID.view()">👁 '+tr('View','देखें')+'</button><button onclick="SV23ID.download()">⬇ '+tr('Download','डाउनलोड')+'</button><button onclick="SV23ID.share()">↗ '+tr('Share','साझा करें')+'</button></div></div>';
 window.SV20?.openForm?.(tr('Student ID Card','विद्यार्थी आईडी कार्ड'),html)
}
function view(){let d=window.__sv23ID?.data;if(d)window.open(d,'_blank')}
function download(){let o=window.__sv23ID;if(!o)return;let a=document.createElement('a');a.href=o.data;a.download=o.name+'_ID_Card.jpg';a.click()}
async function share(){let o=window.__sv23ID;if(!o)return;try{let b=await(await fetch(o.data)).blob(),f=new File([b],o.name+'_ID_Card.jpg',{type:'image/jpeg'});if(navigator.canShare?.({files:[f]}))await navigator.share({files:[f],title:'Sewangan Vidyapeeth Student ID Card'});else download()}catch(e){download()}}
function patch(){if(window.SV22)SV22.idCard=generate}
window.SV23ID={generate,view,download,share};window.addEventListener('load',()=>setTimeout(patch,700));setTimeout(patch,1800);
})();