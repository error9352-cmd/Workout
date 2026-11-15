/* Athletic Physique — extracted from original index.html script block 22 (line 3624) */
(function(){
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-rpe]');if(!b)return;const [i,j,n]=b.dataset.rpe.split('-').map(Number),a=getA();if(!a||!a.sets[i]||!a.sets[i][j])return;const st=a.sets[i][j];st.rpe=st.rpe===n?'':n;ls.set('ap_active',a);rr()});
const cell=v=>{v=String(v==null?'':v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
function dl(name,rows){const txt='\ufeff'+rows.map(r=>r.map(cell).join(',')).join('\r\n'),blob=new Blob([txt],{type:'text/csv;charset=utf-8'});let f=null;try{f=new File([blob],name,{type:'text/csv'})}catch(x){}
if(f&&navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],title:name}).catch(()=>{});return}
const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000)}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-csv]');if(!b)return;
if(b.dataset.csv==='bb'){const w=(ls.get('ap_weights',[])||[]).slice().sort((x,y)=>x.d<y.d?-1:1);if(!w.length){toast('Belum ada data berat badan.');return}dl('berat-badan.csv',[['Tanggal','Berat_kg']].concat(w.map(x=>[x.d,x.kg])));return}
const rows=[['Tanggal','Sesi','Durasi_menit','Gerakan','Set','Beban_kg','Reps','RPE','Est_1RM_kg','Volume_set_kg']];
(ls.get('ap_sessions',[])||[]).forEach(s=>Object.entries(s.log||{}).forEach(([n,v])=>v.forEach((x,j)=>{const kg=+x.kg||0,rp=+x.reps||0;rows.push([s.date,s.name,s.minutes,n,j+1,kg,rp,x.rpe||'',rp>1?Math.round(kg*(1+rp/30)*10)/10:kg,Math.round(kg*rp*10)/10])})));
if(rows.length<2){toast('Belum ada riwayat latihan.');return}dl('riwayat-latihan.csv',rows)});

addEventListener('offline',()=>toast('Anda offline. Data tetap tersimpan di perangkat.'));addEventListener('online',()=>toast('Kembali online.'));
})();
