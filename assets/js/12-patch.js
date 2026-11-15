document.addEventListener('input',e=>{const t=e.target;if(t.id!=='shn')return;const a=ls.get('ap_sessions',[]);if(a.length){a[a.length-1].note=t.value.trim().slice(0,200);ls.set('ap_sessions',a)}});
