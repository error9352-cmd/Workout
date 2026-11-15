/* Remaining function declarations extracted from the original app core. */

function pgAnim(){const c=document.body.classList;c.add('tabchg');clearTimeout(pgAnim.t);pgAnim.t=setTimeout(()=>c.remove('tabchg'),1300)}

async function syncLock(){try{if(getA()&&!WL&&navigator.wakeLock){WL=await navigator.wakeLock.request('screen');WL.addEventListener('release',()=>{WL=null})}else if(!getA()&&WL){await WL.release();WL=null}}catch(e){}}
