(function(){let cur=null;
const set=(ba,x)=>{const r=ba.getBoundingClientRect(),p=Math.max(0,Math.min(100,(x-r.left)/r.width*100));ba.style.setProperty('--x',p+'%');const i=ba.querySelector('.bi');if(i)i.value=Math.round(p)};
document.addEventListener('pointerdown',e=>{const ba=e.target.closest&&e.target.closest('.ba');if(!ba)return;cur=ba;try{ba.setPointerCapture(e.pointerId)}catch(_){}set(ba,e.clientX)});
document.addEventListener('pointermove',e=>{if(cur)set(cur,e.clientX)});
['pointerup','pointercancel'].forEach(t=>document.addEventListener(t,()=>{cur=null}));
document.addEventListener('input',e=>{const i=e.target;if(i.classList&&i.classList.contains('bi'))i.closest('.ba').style.setProperty('--x',i.value+'%')});
})();
