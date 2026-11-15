/*
 * ATHLETIC PHYSIQUE — PHASE 2B CANDIDATE MODULE
 *
 * Copied from 00-app-core.js for dependency review.
 * NOT loaded by index.html yet.
 */

function themeCard(){const t=ls.get('ap_theme','biru');return `<section class="card"><h2>Warna aksen</h2><div class="thm">${[['biru','Biru','#3B82F6,#22D3EE'],['hijau','Hijau','#16A34A,#A3E635'],['oranye','Oranye','#EA580C,#FBBF24'],['ungu','Ungu','#8B5CF6,#E879F9'],['merah','Merah','#E11D48,#FB7185']].map(x=>`<button class="th" data-th="${x[0]}" aria-pressed="${t===x[0]}"><i style="background:linear-gradient(135deg,${x[2]})"></i>${x[1]}</button>`).join('')}</div></section>`}

function slideNav(a,p){const c=a.cur||0;return `<div class="chips" aria-label="Daftar latihan">${p.ex.map((e,i)=>{const dn=a.sets[i].length&&a.sets[i].every(s=>s.done);return `<button class="chip" ${i===c?'aria-current="true"':''} data-sl="${i}" aria-label="Latihan ${i+1}: ${e[0]}">${dn?'✓':i+1}${a.pair&&a.pair[i]!=null?'⇄':''}</button>`}).join('')}</div><div class="snr"><span>Latihan ${c+1} dari ${p.ex.length}</span><span class="snb"><button class="chip" data-xl="1">Daftar</button><button class="chip" data-finish="1">Selesai</button></span></div>`}

function undoToast(m,fn){toast(m);const t=$('toast');t.textContent=m+' ';const b=document.createElement('button');b.textContent='Urungkan';b.style.cssText='background:rgba(255,255,255,.25);border:0;color:#fff;border-radius:10px;padding:6px 12px;font:700 15px Barlow,sans-serif;margin-left:6px';b.onclick=()=>{fn();t.hidden=true};t.appendChild(b);clearTimeout(t._h);t._h=setTimeout(()=>{t.hidden=true},6000)}

function toast(m){
 let t=$('toast');
 if(!t){t=document.createElement('div');t.id='toast';t.className='toast';t.setAttribute('role','status');t.setAttribute('aria-live','polite');document.body.appendChild(t)}
 clearTimeout(t._h);clearTimeout(t._b);
 t._toastToken=(t._toastToken||0)+1;const token=t._toastToken;
 t.hidden=true;t.classList.remove('bye');
 t.textContent=m;t.className='toast '+(/dulu|harus|^Isi|^Minimal|gagal|penuh|tidak|^Belum|^Masukkan|valid|sudah ada|^Selesaikan|^Tekan|^Buat|^Semua hari/i.test(m)?'warn':'ok');
 t.hidden=false;
 t._h=setTimeout(()=>{
   if(t._toastToken!==token)return;
   t.classList.add('bye');
   t._b=setTimeout(()=>{
     if(t._toastToken!==token)return;
     t.hidden=true;t.classList.remove('bye');t.style.removeProperty('display');
   },430);
 },3500);
}

function render(){
 document.body.classList.toggle('wk',tab==='workout'&&!!getA());
 document.getElementById('app').innerHTML=view();
 document.getElementById('nav').innerHTML=Object.keys(NAMA).map(k=>`<button class="tab" data-go="${k}" ${k===tab?'aria-current="page"':''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</svg>${NAMA[k]}</button>`).join('');
 document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{tab=b.dataset.go;pgAnim();render();scrollTo(0,0)});
 document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>startWorkout(+b.dataset.start));
 document.querySelectorAll('[data-f]').forEach(inp=>inp.oninput=()=>{const a=getA();a.sets[+inp.dataset.i][+inp.dataset.j][inp.dataset.f]=inp.value;ls.set('ap_active',a)});
 document.querySelectorAll('[data-wtimer]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i,j=+b.dataset.j;if(WT&&WT.i===i&&WT.j===j){wtCommit();rr();return}wtStart(i,j);wtRefresh()});
 document.querySelectorAll('[data-done]').forEach(b=>b.onclick=()=>{const [i,j]=b.dataset.done.split('-').map(Number);const a=getA(),st=a.sets[i][j],e=SX(a).ex[i],m=exMode(e),raw=m==='time'?st.value:st.reps;if(!st.done&&!(parseFloat(String(raw).replace(',','.'))>0)){const f=document.querySelector(`[data-f="${m==='time'?'value':'reps'}"][data-i="${i}"][data-j="${j}"]`);if(f){f.classList.add('err');setTimeout(()=>f.classList.remove('err'),1500)}toast(m==='time'?'Isi durasi dulu.':'Isi jumlah repetisi dulu.');return}let adv=false;st.done=!st.done;if(st.done&&a.sets[i].every(x=>x.done)&&i<a.sets.length-1&&(a.cur||0)===i){a.cur=i+1;adv=true;slideDir='r';toast('Latihan selesai. Lanjut: '+SX(a).ex[i+1][0])}ls.set('ap_active',a);if(st.done){const nm=e[0],pj=a.pair?a.pair[i]:null;let sw=false;if(pj!=null&&!st.w&&a.sets[pj]){const dA=a.sets[i].filter(x=>x.done&&!x.w).length,dB=a.sets[pj].filter(x=>x.done&&!x.w).length,left=a.sets[pj].some(x=>!x.done&&!x.w);sw=true;if(dA>dB&&left){a.cur=pj;slideDir=pj>i?'r':'l';ls.set('ap_active',a);stopRest();toast('Superset: lanjut ke '+SX(a).ex[pj][0])}else if(a.sets[i].every(x=>x.done)&&a.sets[pj].every(x=>x.done)&&(i===a.sets.length-1||pj===a.sets.length-1))stopRest();else restStart(Math.max(restFor(nm),restFor(SX(a).ex[pj][0])))}if(!sw){if(i===a.sets.length-1&&a.sets[i].every(x=>x.done))stopRest();else restStart(restFor(nm))}if(m==='weight'){const kg=parseFloat(String(st.kg).replace(',','.'))||0,bs=bestKg(nm);if(bs>0&&kg>bs&&!st.w)toast('PR baru! '+nm+' '+kg+' kg')}}rr();if(adv){scrollTo(0,0);const n=$('slide');if(n)n.scrollTop=0}});
 document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{const a=getA(),i=+b.dataset.add,l=a.sets[i],m=exMode(SX(a).ex[i]),last=l[l.length-1]||{};l.push({kg:m==='weight'?String(last.kg||''):'',reps:m!=='time'?String(last.reps||''):'',value:m==='time'?String(last.value??''):'',done:false});ls.set('ap_active',a);rr()});
 document.querySelectorAll('[data-finish]').forEach(b=>b.onclick=()=>{const a=getA(),p=SX(a),log={};let vol=0;p.ex.forEach((e,i)=>{const m=exMode(e),d=a.sets[i].filter(s=>s.done&&!s.w).map(s=>m==='time'?({mode:'time',value:parseFloat(String(s.value??'').replace(',','.'))||0,unit:modeUnit(e)}):m==='bodyweight'?({mode:'bodyweight',reps:parseInt(s.reps)||0}):({mode:'weight',kg:parseFloat(String(s.kg).replace(',','.'))||0,reps:parseInt(s.reps)||0,...(s.rpe?{rpe:+s.rpe}:{})}));if(d.length){log[e[0]]=d;if(m==='weight')d.forEach(x=>vol+=x.kg*x.reps)}});if(!Object.keys(log).length){toast('Tekan Catat pada minimal satu set dulu.');return}const s=sessions(),oldBest={};s.forEach(x=>Object.entries(x.log||{}).forEach(([n,v])=>v.forEach(r=>{oldBest[n]=Math.max(oldBest[n]||0,+r.kg||0)})));const newPr=[];Object.entries(log).forEach(([n,v])=>{const weighted=v.filter(x=>x.mode==='weight'||x.mode==null),m=weighted.length?Math.max(...weighted.map(x=>x.kg||0)):0;if(m>0&&m>(oldBest[n]||0))newPr.push(n+' '+kf(m)+' kg')});s.push({date:a.date,name:a.name,minutes:Math.max(1,Math.round((Date.now()-a.start)/60000)),volume:vol,log});ls.set('ap_sessions',s);stopRest();ls.set('ap_active',null);tab='history';render();scrollTo(0,0);const counted=Object.values(log).reduce((n,v)=>n+v.length,0),detail=vol>0?' · volume '+Math.round(vol)+' kg':'';toast('Workout selesai: '+Object.keys(log).length+' latihan, '+counted+' set'+detail+(newPr.length?' · PR: '+newPr.slice(0,2).join(', ')+(newPr.length>2?' +'+(newPr.length-2):''):''))});
 document.querySelectorAll('[data-cancel]').forEach(b=>b.onclick=()=>{if(b.dataset.arm){stopRest();ls.set('ap_active',null);render()}else{b.dataset.arm='1';b.textContent='Tekan lagi untuk membatalkan';b.style.color='#ff8a8a';setTimeout(()=>{if(b.isConnected){delete b.dataset.arm;b.textContent='Batalkan workout';b.style.color=''}},3000)}});
 document.querySelectorAll('[data-up]').forEach(b=>b.onclick=()=>{const a=getA(),i=+b.dataset.up,pv=prev(SX(a).ex[i][0]);if(pv){const nk=String(Math.max(...pv.map(x=>x.kg))+2.5);a.sets[i].forEach(s=>{if(!s.done)s.kg=nk})}a.up=a.up||{};a.up[i]=1;ls.set('ap_active',a);rr()});
 document.querySelectorAll('[data-no]').forEach(b=>b.onclick=()=>{const a=getA();a.up=a.up||{};a.up[+b.dataset.no]=1;ls.set('ap_active',a);rr()});
 document.querySelectorAll('[data-vd]').forEach(b=>b.onclick=()=>{viewDay=+b.dataset.vd;render()});{const ac=document.querySelector('.dpick [aria-current]');if(ac)ac.parentNode.scrollLeft=Math.max(0,ac.offsetLeft-14)}
 document.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{editing=!editing;render()});
 document.querySelectorAll('[data-en]').forEach(inp=>inp.onchange=()=>{const [k,i]=inp.dataset.en.split('-');if(inp.value.trim()){PROG[k].ex[i][0]=inp.value.trim();PROG[k].ex[i][2]=exMode(PROG[k].ex[i])}saveProg()});
 document.querySelectorAll('[data-et]').forEach(inp=>inp.onchange=()=>{const [k,i]=inp.dataset.et.split('-');if(inp.value.trim()){PROG[k].ex[i][1]=inp.value.trim();PROG[k].ex[i][2]=exMode(PROG[k].ex[i])}saveProg()});
 document.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{const [k,i]=b.dataset.del.split('-');arm(b,'Yakin?',()=>{PROG[k].ex.splice(+i,1);saveProg();render()})});
 document.querySelectorAll('[data-addex]').forEach(b=>b.onclick=()=>{const n=$('nn').value.trim();if(!n){toast('Isi nama gerakan dulu.');return}{const tg=$('nt').value.trim()||'3 × 10–12';PROG[b.dataset.addex].ex.push([n,tg,exMode([n,tg])]);}saveProg();render()});
 document.querySelectorAll('[data-rg]').forEach(b=>b.onclick=()=>{range=+b.dataset.rg;rr()});
 document.querySelectorAll('[data-savebody]').forEach(b=>b.onclick=()=>{const f={};['kg','waist','chest','shoulder','arm','thigh'].forEach(k=>{const v=parseFloat($('bm_'+k).value.replace(',','.'));if(v>0)f[k]=Math.round(v*10)/10});
  if(!Object.keys(f).length){toast('Isi minimal satu pengukuran.');return}
  const B=ls.get('ap_body',[]),ex=B.find(x=>x.d===todayIso);if(ex)Object.assign(ex,f);else B.push({d:todayIso,...f});ls.set('ap_body',B);
  if(f.kg){weights=weights.filter(x=>x.d!==todayIso).concat({d:todayIso,kg:f.kg});ls.set('ap_weights',weights)}
  rr()});
 document.querySelectorAll('[data-cmp]').forEach(s=>s.onchange=()=>{if(s.dataset.cmp==='a')cmpA=+s.value;else cmpB=+s.value;rr()});
 document.querySelectorAll('[data-delp]').forEach(b=>b.onclick=()=>{arm(b,'Yakin?',()=>{PHOTOS=PHOTOS.filter(p=>p.id!==+b.dataset.delp);savePh();rr()})});
 const pf=$('pf');if(pf)pf.onchange=()=>{const f=pf.files[0];if(!f)return;const url=URL.createObjectURL(f),im=new Image();
  im.onload=()=>{const s=Math.min(1,640/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);
   const data=c.toDataURL('image/jpeg',.7);URL.revokeObjectURL(url);PHOTOS.push({id:Date.now(),d:($('pd')&&$('pd').value)||todayIso,img:data,pose:phPose});
   savePh();
   rr()};
  im.onerror=()=>alert('Foto tidak bisa dibaca. Coba foto lain.');im.src=url};
 const pcam=$('pcam');if(pcam)pcam.onclick=()=>{const f=$('pf');if(f){f.setAttribute('capture','environment');f.click()}};
 document.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{const a=getA(),i=+b.dataset.i,j=+b.dataset.j,st=a.sets[i][j],f=b.dataset.a,pv=prev(SX(a).ex[i][0]);
  if(f==='timerSec'){st.timerSec=Math.max(5,(parseInt(st.timerSec,10)||wtTargetSeconds(i,j))+(+b.dataset.d));ls.set('ap_active',a);rr();return}
  let cur=parseFloat(String(st[f]).replace(',','.'));if(isNaN(cur))cur=(f==='reps'&&pv&&pv[j])?pv[j].reps:0;
  st[f]=String(Math.max(0,Math.round((cur+(+b.dataset.d))*10)/10));ls.set('ap_active',a);rr()});
 document.querySelectorAll('[data-cp]').forEach(b=>b.onclick=()=>{const a=getA(),i=+b.dataset.i,j=+b.dataset.j;let s=null;
  if(j>0&&a.sets[i][j-1].reps!==''&&!a.sets[i][j-1].w)s=a.sets[i][j-1];else{const pv=prev(SX(a).ex[i][0]);const wj=j-a.sets[i].slice(0,j).filter(x=>x.w).length;if(pv&&pv[wj])s=pv[wj]}
  if(!s)return;a.sets[i][j].kg=String(s.kg);a.sets[i][j].reps=String(s.reps);ls.set('ap_active',a);rr()});
 document.querySelectorAll('.mus2').forEach(d=>d.ontoggle=()=>{musOpen=d.open});
 document.querySelectorAll('[data-hl]').forEach(b=>b.onclick=()=>{hlOn=!hlOn;rr()});
 document.querySelectorAll('[data-sl]').forEach(b=>b.onclick=()=>goSlide(+b.dataset.sl));
 const ap=$('app');ap.ontouchstart=e=>{ap._x=e.touches[0].clientX;ap._y=e.touches[0].clientY};
 ap.ontouchend=e=>{const a=getA();if(tab!=='workout'||!a||ap._x==null)return;const dx=e.changedTouches[0].clientX-ap._x,dy=e.changedTouches[0].clientY-ap._y;ap._x=null;
  if(Math.abs(dx)<70||Math.abs(dx)<Math.abs(dy)*1.5)return;const n=SX(a).ex.length,t2=(a.cur||0)+(dx<0?1:-1);if(t2<0||t2>=n)return;a.cur=t2;ls.set('ap_active',a);render();scrollTo(0,0)};
 ap.ontouchstart=e=>{const a=getA();ap._x=null;ap._swipeIgnore=false;if(tab!=='workout'||!a)return;const t=e.target&&e.target.closest?e.target.closest('input,textarea,select,button,a,label,.chips,.set,.rest,.sheet,.sheetbg'):null;if(t){ap._swipeIgnore=true;return}ap._x=e.touches[0].clientX;ap._y=e.touches[0].clientY;ap._drag=false};
 ap.ontouchmove=e=>{if(ap._x==null||ap._swipeIgnore)return;const dx=e.touches[0].clientX-ap._x,dy=e.touches[0].clientY-ap._y;if(!ap._drag&&(Math.abs(dx)<10||Math.abs(dx)<Math.abs(dy)))return;ap._drag=true;const el=$('slide');if(!el)return;
  const a=getA(),n=SX(a).ex.length,c=a.cur||0,edge=(dx>0&&c===0)||(dx<0&&c===n-1),m=edge?dx*.25:dx*.9;el.style.transition='none';el.style.transform=`translateX(${m}px)`;el.style.opacity=String(1-Math.min(.5,Math.abs(m)/300))};
 ap.ontouchend=e=>{if(ap._x==null||ap._swipeIgnore){ap._x=null;ap._swipeIgnore=false;ap._drag=false;return}const dx=e.changedTouches[0].clientX-ap._x,drag=ap._drag;ap._x=null;ap._drag=false;if(!drag)return;
  const a=getA(),el=$('slide'),n=SX(a).ex.length,c=a.cur||0,t=c+(dx<0?1:-1);
  if(Math.abs(dx)>=70&&t>=0&&t<n){if(el){el.style.transition='transform .14s ease-in,opacity .14s';el.style.transform=`translateX(${dx<0?-60:60}px)`;el.style.opacity='0'}
   setTimeout(()=>{a.cur=t;ls.set('ap_active',a);slideDir=dx<0?'r':'l';render();scrollTo(0,0)},140)}
  else if(el){el.style.transition='transform .25s cubic-bezier(.22,.9,.3,1),opacity .25s';el.style.transform='';el.style.opacity=''}};
 document.querySelectorAll('.exw').forEach(w=>{if(!w.dataset.s)w.onclick=()=>{hlOn=!hlOn;rr()}});
 document.querySelectorAll('[data-ep]').forEach(b=>b.onclick=()=>{editP=true;render()});
 document.querySelectorAll('[data-pc]').forEach(b=>b.onclick=()=>{editP=false;render()});
 document.querySelectorAll('[data-ps]').forEach(b=>b.onclick=()=>{const h=parseFloat($('pr_h').value.replace(',','.')),w=parseFloat($('pr_s').value.replace(',','.')),f=parseInt($('pr_f').value);
  if(!(h>100&&h<250)){toast('Tinggi badan harus 100–250 cm.');return}if(!(w>20&&w<300)){toast('Berat awal harus 20–300 kg.');return}if(!(f>=1&&f<=7)){toast('Frekuensi latihan 1–7 kali seminggu.');return}
  ls.set('ap_profile',{name:$('pr_n').value.trim(),height:h,startKg:w,freq:f,goal:$('pr_g').value.trim()});editP=false;render();toast('Profil disimpan')});
 document.querySelectorAll('[data-hr]').forEach(b=>b.onclick=()=>{histRange=+b.dataset.hr;render();});
 document.querySelectorAll('#histQ').forEach(i=>i.oninput=()=>{histQ=i.value;const v=i.value;render();const n=$('histQ');if(n){n.focus();n.setSelectionRange(v.length,v.length)}});
 document.querySelectorAll('[data-dels]').forEach(b=>b.onclick=()=>{arm(b,'Tekan lagi untuk hapus',()=>{const s=sessions(),ix=+b.dataset.dels,rm=s.splice(ix,1)[0];ls.set('ap_sessions',s);rr();undoToast('Sesi dihapus.',()=>{const t=sessions();t.splice(ix,0,rm);ls.set('ap_sessions',t);rr()})})});
 document.querySelectorAll('[data-delall]').forEach(b=>b.onclick=()=>{arm(b,'Tekan lagi untuk hapus semua',()=>{const old=sessions();ls.set('ap_sessions',[]);render();undoToast('Semua riwayat dihapus.',()=>{ls.set('ap_sessions',old);render()})})});
 document.querySelectorAll('[data-dn]').forEach(i=>i.onchange=()=>{const k=i.dataset.dn;if(i.value.trim())PROG[k].n=i.value.trim();saveProg()});
 document.querySelectorAll('[data-df]').forEach(i=>i.onchange=()=>{PROG[i.dataset.df].f=i.value.trim();saveProg()});
 document.querySelectorAll('[data-dw]').forEach(s=>s.onchange=()=>{const k=+s.dataset.dw,t=+s.value;if(t===k)return;const tmp=PROG[t];PROG[t]=PROG[k];if(tmp)PROG[k]=tmp;else delete PROG[k];viewDay=t;saveProg();render()});
 document.querySelectorAll('[data-addday]').forEach(b=>b.onclick=()=>{if(window.apAddDay){window.apAddDay();return}const e=[1,2,3,4,5,6,0].find(k=>!PROG[k]);if(e===undefined){toast('Semua hari sudah terisi.');return}PROG[e]={n:'Hari baru',f:'Fokus latihan',ex:[]};viewDay=e;editing=true;saveProg();render()});
 document.querySelectorAll('[data-delday]').forEach(b=>b.onclick=()=>arm(b,'Tekan lagi untuk hapus',()=>{if(days().length<2){toast('Minimal satu hari latihan.');return}delete PROG[b.dataset.delday];viewDay=null;saveProg();render()}));
 document.querySelectorAll('[data-bk]').forEach(b=>b.onclick=()=>{const t=$('bk'),m=b.dataset.bk;
  if(m==='exp'){const o={v:1,d:{}};BK.forEach(k=>{const v=ls.get(k,null);if(v!=null)o.d[k]=v});t.value=JSON.stringify(o);ls.set('ap_lastbk',todayIso);toast('Cadangan dibuat. Tekan Salin.')}
  else if(m==='copy'){if(!t.value){toast('Buat cadangan dulu.');return}t.setAttribute('inputmode','none');t.select();setTimeout(()=>t.removeAttribute('inputmode'),600);try{navigator.clipboard.writeText(t.value).then(()=>toast('Tersalin.'),()=>{document.execCommand('copy');toast('Tersalin.')})}catch(e){try{document.execCommand('copy');toast('Tersalin.')}catch(e2){toast('Tekan lama teks, lalu pilih Salin.')}}}
  else{let o;try{o=JSON.parse(t.value);if(!o||!o.d)throw 0}catch(e){toast('Teks cadangan tidak valid.');return}
   arm(b,'Tekan lagi untuk menimpa data',()=>{for(const k in o.d){if(BK.includes(k))ls.set(k,o.d[k])}const p0=ls.get('ap_prog',null);if(p0)PROG=p0;weights=ls.get('ap_weights',weights);render();toast('Data dipulihkan.')})}});
 syncLock();
 const sv=document.getElementById('saveKg');
 if(sv)sv.onclick=()=>{const v=parseFloat(document.getElementById('kg').value.replace(',','.'));
  if(!(v>20&&v<300)){toast('Masukkan berat badan 20–300 kg.');return}
  weights=weights.filter(x=>x.d!==todayIso).concat({d:todayIso,kg:Math.round(v*10)/10});ls.set('ap_weights',weights);render()};
 const sh=document.getElementById('saveBmiHeight');
 if(sh)sh.onclick=()=>{const el=document.getElementById('bmiHeight'),v=parseFloat(String(el.value).replace(',','.'));if(!(v>=100&&v<=250)){toast('Masukkan tinggi badan 100–250 cm.');return}const p=prof();p.height=Math.round(v*10)/10;ls.set('ap_profile',p);render();toast('Tinggi badan tersimpan.')};}
