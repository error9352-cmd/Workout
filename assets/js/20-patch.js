(function(){const app=document.getElementById('app');if(!app||!window.MutationObserver)return;
const rm=matchMedia('(prefers-reduced-motion: reduce)');
new MutationObserver(()=>{if(rm.matches||!document.body.classList.contains('tabchg'))return;
app.querySelectorAll('.stat .num').forEach(el=>{const t=el.textContent.trim();if(!/^\d{1,5}$/.test(t))return;const v=+t;if(v<2)return;const t0=performance.now();
const step=n=>{const p=Math.min(1,(n-t0)/650);el.textContent=Math.round(v*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step);else el.textContent=t};requestAnimationFrame(step)})}).observe(app,{childList:true})})();
