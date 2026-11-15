/* Athletic Physique — extracted from original index.html script block 8 (line 3339) */
(function(){const PL=[25,20,15,10,5,2.5,1.25],f=v=>String(v).replace('.',',');
function calc(t,bar){let r=Math.round((t-bar)/2*100)/100;if(!(r>=0))return null;const o=[];PL.forEach(p=>{while(r>=p-1e-9){o.push(p);r=Math.round((r-p)*100)/100}});return{o,left:r}}
function openPlate(init){let bar=20;const o=document.createElement('div');o.className='sheetbg';
o.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-label="Kalkulator plat"><div class="grab"></div><h2>Kalkulator plat</h2><label for="pk">Beban total (kg)</label><input id="pk" inputmode="decimal" value="${init||''}" placeholder="60"><label>Berat barbel</label><div class="chips">${[20,15,10].map(b=>`<button class="chip" data-pb="${b}" ${b===bar?'aria-current="true"':''}>${b} kg</button>`).join('')}</div><div id="pres" aria-live="polite"></div><button class="btn" id="pcl">Tutup</button></div>`;
const inp=o.querySelector('#pk'),res=o.querySelector('#pres');
const upd=()=>{const t=parseFloat(String(inp.value).replace(',','.'));if(!(t>0)){res.innerHTML='<p class="sub" style="margin-top:12px">Isi beban total untuk melihat plat per sisi.</p>';return}
const c=calc(t,bar);if(!c){res.innerHTML='<p class="sub" style="margin-top:12px">Beban lebih ringan dari barbel.</p>';return}
res.innerHTML=`<div class="stk">${c.o.length?c.o.map(p=>`<span class="plt" style="height:${24+p}px">${f(p)}</span>`).join(''):'<span class="sub">Hanya barbel</span>'}</div><p class="sub" style="text-align:center;margin-top:8px">Per sisi: ${c.o.length?c.o.map(f).join(' + ')+' kg':'tanpa plat'}${c.left>0?'. Sisa '+f(c.left)+' kg per sisi tidak ada plat yang pas.':''}</p>`};
inp.oninput=upd;o.querySelectorAll('[data-pb]').forEach(b=>b.onclick=()=>{bar=+b.dataset.pb;o.querySelectorAll('[data-pb]').forEach(x=>x.removeAttribute('aria-current'));b.setAttribute('aria-current','true');upd()});
const x=()=>{o.classList.add('out');setTimeout(()=>o.remove(),250);document.removeEventListener('keydown',kd)},kd=e=>{if(e.key==='Escape')x()};
o.onclick=e=>{if(e.target===o)x()};o.querySelector('#pcl').onclick=x;document.body.appendChild(o);document.addEventListener('keydown',kd);upd();o.querySelector('#pcl').focus()}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-plat]');if(!b)return;const k=[...b.closest('.card').querySelectorAll('[data-f=kg]')].map(i=>parseFloat(String(i.value).replace(',','.'))).filter(v=>v>0);openPlate(k.length?k[k.length-1]:'')});
})();
