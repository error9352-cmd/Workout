(function(){const R=document.documentElement,vv=window.visualViewport;if(!vv)return;
const upd=()=>{const kb=Math.max(0,Math.round(innerHeight-vv.height-vv.offsetTop));R.style.setProperty('--kb',kb+'px');R.style.setProperty('--vt',Math.round(vv.offsetTop)+'px');document.body.classList.toggle('kb',kb>120)};
const sp=e=>{for(let p=e.parentElement;p;p=p.parentElement){const o=getComputedStyle(p).overflowY;if((o==='auto'||o==='scroll')&&p.scrollHeight>p.clientHeight)return p}return document.scrollingElement};
const fit=()=>{const e=document.activeElement;if(!e||!/^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName))return;const vb=vv.offsetTop+vv.height-16,r=e.getBoundingClientRect(),c=sp(e);
if(r.bottom>vb)c.scrollBy({top:r.bottom-vb+8,behavior:'smooth'});else if(r.top<vv.offsetTop+60)c.scrollBy({top:r.top-vv.offsetTop-80,behavior:'smooth'})};
vv.addEventListener('resize',()=>{upd();setTimeout(fit,60)});vv.addEventListener('scroll',upd);
document.addEventListener('focusin',e=>{if(/^(INPUT|TEXTAREA)$/.test(e.target.tagName))setTimeout(()=>{upd();fit()},320)});
document.addEventListener('focusout',()=>setTimeout(upd,120));upd()})();
