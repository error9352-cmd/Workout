/* Athletic Physique — extracted from original index.html script block 24 (line 3644) */
(function(){
function rpeSheet(){if(document.querySelector('[data-rpesheet]'))return;
const o=document.createElement('div');o.className='sheetbg';o.setAttribute('data-rpesheet','1');
const R=[[10,'Mentok','tidak sanggup tambah rep'],[9,'Sangat berat','sisa 1 rep'],[8,'Berat','sisa 2 rep'],[7,'Terkendali','sisa sekitar 3 rep'],[6,'Ringan','sisa 4 rep atau lebih']];
o.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-label="Apa itu RPE"><div class="grab"></div><h2>Apa itu RPE?</h2><p class="sub">RPE adalah nilai 1–10 untuk seberapa berat satu set terasa. Cara menilainya: setelah set selesai, tanyakan pada diri sendiri, "berapa rep lagi yang masih sanggup saya lakukan dengan teknik baik?"</p><div class="rpet" style="margin-top:12px">${R.map(r=>`<div class="row"><span><b>${r[0]}</b> ${r[1]}</span><span>${r[2]}</span></div>`).join('')}</div><p class="prev" style="margin-top:12px">Untuk pemula, jaga sebagian besar set di RPE 7–9. Tidak perlu tepat, perkiraan kasar sudah cukup dan akan makin akurat seiring latihan.</p><p class="prev">Mengisi RPE tidak wajib. Aplikasi memakainya untuk saran beban: set terasa ringan, Anda ditawari naik beban. Set hampir mentok, Anda diminta bertahan di beban yang sama dulu.</p><button class="btn" id="rpx">Mengerti</button></div>`;
const kd=e=>{if(e.key==='Escape')x()},x=()=>{o.classList.add('out');setTimeout(()=>o.remove(),250);document.removeEventListener('keydown',kd)};
o.onclick=e=>{if(e.target===o||e.target.closest('#rpx'))x()};
document.body.appendChild(o);document.addEventListener('keydown',kd);setTimeout(()=>{const b=o.querySelector('#rpx');if(b)b.focus()},60)}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-rpeinfo]')){e.preventDefault();rpeSheet()}});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('.rpel')){e.preventDefault();rpeSheet()}});
})();
