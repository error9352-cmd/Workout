/* Athletic Physique — extracted from original index.html script block 11 (line 3398) */
(function(){
const T=[
{"n": "Full Body A", "l": "Pemula", "f": "Seluruh tubuh, pemula", "ex": [["Goblet Squat", "3 × 10–12"], ["Dumbbell Bench Press", "3 × 8–12"], ["Lat Pulldown", "3 × 8–12"], ["Dumbbell Shoulder Press", "2 × 10–12"], ["Dumbbell Romanian Deadlift", "2 × 10–12"], ["Plank", "3 × 30–40 detik"]]},
{"n": "Full Body B", "l": "Pemula", "f": "Seluruh tubuh, variasi", "ex": [["Leg Press", "3 × 10–12"], ["Incline Dumbbell Press", "3 × 8–12"], ["Seated Cable Row", "3 × 10–12"], ["Dumbbell Lateral Raise", "2 × 12–15"], ["Leg Curl", "2 × 10–15"], ["Cable Crunch", "3 × 12–15"]]},
{"n": "Full Body C", "l": "Pemula", "f": "Seluruh tubuh, dominan mesin", "ex": [["Leg Press", "3 × 12–15"], ["Chest Press Machine", "3 × 10–12"], ["Close Grip Pulldown", "3 × 10–12"], ["Machine Shoulder Press", "2 × 10–12"], ["Seated Leg Curl", "2 × 12–15"], ["Back Extension", "2 × 12–15"], ["Treadmill", "1 × 10–15 menit"]]},
{"n": "Upper Mesin", "l": "Pemula", "f": "Tubuh atas, aman dan mudah", "ex": [["Chest Press Machine", "3 × 10–12"], ["Seated Cable Row", "3 × 10–12"], ["Machine Shoulder Press", "2 × 10–12"], ["Lat Pulldown", "2 × 10–12"], ["Cable Curl", "2 × 12–15"], ["Triceps Pushdown", "2 × 12–15"]]},
{"n": "Lower Mesin", "l": "Pemula", "f": "Tubuh bawah, aman dan mudah", "ex": [["Leg Press", "3 × 10–15"], ["Leg Extension", "2 × 12–15"], ["Seated Leg Curl", "3 × 12–15"], ["Hip Abduction Machine", "2 × 12–15"], ["Seated Calf Raise", "3 × 12–15"], ["Crunch", "2 × 12–15"]]},
{"n": "Cardio dan Core", "l": "Pemula", "f": "Kardio ringan dan perut", "ex": [["Treadmill", "1 × 20–30 menit"], ["Plank", "3 × 30–40 detik"], ["Bicycle Crunch", "3 × 12–15"], ["Hanging Leg Raise", "3 × 8–12"], ["Side Plank", "2 × 20–30 detik"]]},
{"n": "Push", "l": "Menengah", "f": "Dada, bahu, triceps", "ex": [["Bench Press", "3 × 6–10"], ["Incline Dumbbell Press", "3 × 8–12"], ["Overhead Press", "3 × 8–10"], ["Cable Lateral Raise", "3 × 12–15"], ["Triceps Pushdown", "3 × 10–15"], ["Overhead Triceps Extension", "2 × 10–12"]]},
{"n": "Pull", "l": "Menengah", "f": "Punggung dan biceps", "ex": [["Lat Pulldown", "3 × 8–12"], ["Barbell Row", "3 × 8–10"], ["Seated Cable Row", "3 × 10–12"], ["Face Pull", "3 × 12–15"], ["Barbell Curl", "3 × 8–12"], ["Hammer Curl", "2 × 10–15"]]},
{"n": "Legs", "l": "Menengah", "f": "Paha, hamstring, betis", "ex": [["Barbell Squat", "3 × 6–10"], ["Leg Press", "3 × 10–12"], ["Dumbbell Romanian Deadlift", "3 × 8–12"], ["Leg Extension", "2 × 12–15"], ["Leg Curl", "2 × 10–15"], ["Standing Calf Raise", "3 × 12–15"]]},
{"n": "Upper Kekuatan", "l": "Menengah", "f": "Tubuh atas, beban lebih berat", "ex": [["Bench Press", "4 × 5–8"], ["Barbell Row", "4 × 6–8"], ["Overhead Press", "3 × 6–10"], ["Lat Pulldown", "3 × 8–10"], ["Dumbbell Biceps Curl", "2 × 10–12"], ["Triceps Pushdown", "2 × 10–12"]]},
{"n": "Lower Kekuatan", "l": "Menengah", "f": "Tubuh bawah, beban lebih berat", "ex": [["Barbell Squat", "4 × 5–8"], ["Dumbbell Romanian Deadlift", "3 × 8–10"], ["Leg Press", "3 × 10–12"], ["Leg Curl", "3 × 10–12"], ["Standing Calf Raise", "3 × 10–15"], ["Hanging Leg Raise", "3 × 8–12"]]},
{"n": "Bahu dan Lengan", "l": "Menengah", "f": "Bahu lebar dan lengan", "ex": [["Machine Shoulder Press", "3 × 8–12"], ["Dumbbell Lateral Raise", "4 × 12–15"], ["Rear Delt Fly", "3 × 12–15"], ["Barbell Curl", "3 × 8–12"], ["Skull Crusher", "3 × 8–12"], ["Hammer Curl", "2 × 10–12"], ["Overhead Triceps Extension", "2 × 10–12"]]},
{"n": "HIIT Kardio", "l": "Menengah", "f": "Kardio interval dan core", "ex": [["Treadmill", "1 × 15–20 menit"], ["Rowing Machine", "1 × 8–10 menit"], ["Lompat Tali", "3 × 60–90 detik"], ["Mountain Climber", "3 × 30–45 detik"], ["Russian Twist", "3 × 15–20"]]},
{"n": "Upper A", "l": "Menengah", "f": "Dada dan punggung", "ex": [["Chest Press Machine", "3 × 8–12"], ["Lat Pulldown", "3 × 8–12"], ["Seated Cable Row", "2 × 10–12"], ["Dumbbell Shoulder Press", "2 × 10–12"], ["Dumbbell Biceps Curl", "2 × 10–12"], ["Triceps Pushdown", "2 × 10–15"]]},
{"n": "Upper B", "l": "Menengah", "f": "Bahu lebar dan V-taper", "ex": [["Incline Chest Press", "3 × 8–12"], ["Chest-Supported Row", "3 × 10–12"], ["Lat Pulldown", "2 × 10–12"], ["Dumbbell Lateral Raise", "3 × 12–15"], ["Face Pull", "2 × 12–15"], ["Hammer Curl", "2 × 10–15"], ["Triceps Pushdown", "2 × 10–15"]]},
{"n": "Lower A", "l": "Menengah", "f": "Paha, hamstring, dan core", "ex": [["Leg Press", "3 × 10–12"], ["Goblet Squat", "3 × 10–12"], ["Dumbbell Romanian Deadlift", "3 × 10–12"], ["Seated Leg Curl", "2 × 10–15"], ["Plank", "3 × 30–40 detik"]]},
{"n": "Lower B", "l": "Menengah", "f": "Kaki dan core", "ex": [["Hack Squat", "3 × 10–12"], ["Leg Extension", "2 × 12–15"], ["Leg Curl", "3 × 10–15"], ["Seated Calf Raise", "3 × 12–15"], ["Cable Crunch", "3 × 12–15"], ["Pallof Press", "2 × 10–12 per sisi"], ["Sepeda Statis", "15–20 menit, intensitas sedang"]]},
{"n": "Push Hipertrofi", "l": "Lanjutan", "f": "Dada, bahu, triceps, volume tinggi", "ex": [["Incline Bench Press", "4 × 6–10"], ["Dumbbell Bench Press", "3 × 8–12"], ["Machine Shoulder Press", "3 × 8–12"], ["Cable Crossover", "3 × 12–15"], ["Cable Lateral Raise", "4 × 12–20"], ["Triceps Pushdown", "3 × 10–15"], ["Overhead Triceps Extension", "3 × 10–12"]]},
{"n": "Pull Hipertrofi", "l": "Lanjutan", "f": "Punggung dan biceps, volume tinggi", "ex": [["Pull Up", "4 × 6–10"], ["Chest-Supported Row", "3 × 8–12"], ["Close Grip Pulldown", "3 × 8–12"], ["Straight Arm Pulldown", "3 × 12–15"], ["Rear Delt Fly", "3 × 12–15"], ["Preacher Curl", "3 × 8–12"], ["Hammer Curl", "3 × 10–12"]]},
{"n": "Legs Hipertrofi", "l": "Lanjutan", "f": "Kaki, volume tinggi", "ex": [["Barbell Squat", "4 × 6–10"], ["Hack Squat", "3 × 8–12"], ["Dumbbell Romanian Deadlift", "3 × 8–12"], ["Leg Extension", "3 × 12–15"], ["Seated Leg Curl", "3 × 10–15"], ["Hip Thrust", "3 × 8–12"], ["Seated Calf Raise", "4 × 12–20"]]},
{"n": "Dada dan Punggung", "l": "Lanjutan", "f": "Dada dan punggung seimbang", "ex": [["Bench Press", "4 × 6–10"], ["Barbell Row", "4 × 6–10"], ["Incline Dumbbell Press", "3 × 8–12"], ["Lat Pulldown", "3 × 8–12"], ["Cable Crossover", "2 × 12–15"], ["Seated Cable Row", "2 × 10–12"]]},
{"n": "Power Upper", "l": "Expert", "f": "Tubuh atas, beban sangat berat", "ex": [["Bench Press", "5 × 3–5"], ["Pull Up", "4 × 4–6"], ["Overhead Press", "4 × 4–6"], ["Barbell Row", "4 × 5–6"], ["Close Grip Bench Press", "3 × 6–8"], ["Barbell Curl", "3 × 6–8"]]},
{"n": "Power Lower", "l": "Expert", "f": "Tubuh bawah, beban sangat berat", "ex": [["Barbell Squat", "5 × 3–5"], ["Deadlift", "3 × 3–5"], ["Front Squat", "3 × 5–6"], ["Hip Thrust", "3 × 6–8"], ["Standing Calf Raise", "4 × 8–10"], ["Ab Wheel Rollout", "3 × 8–12"]]},
{"n": "Volume Upper", "l": "Expert", "f": "Tubuh atas, volume tinggi", "ex": [["Incline Bench Press", "4 × 8–12"], ["Chest-Supported Row", "4 × 8–12"], ["Dumbbell Shoulder Press", "4 × 8–12"], ["Cable Crossover", "3 × 12–15"], ["Lat Pulldown", "4 × 10–12"], ["Cable Lateral Raise", "4 × 15–20"], ["Preacher Curl", "3 × 10–12"], ["Skull Crusher", "3 × 10–12"]]},
{"n": "Volume Lower", "l": "Expert", "f": "Tubuh bawah, volume tinggi", "ex": [["Front Squat", "4 × 6–8"], ["Bulgarian Split Squat", "3 × 8–10 per kaki"], ["Stiff Leg Deadlift", "4 × 6–8"], ["Leg Extension", "4 × 12–15"], ["Seated Leg Curl", "4 × 10–12"], ["Walking Lunge", "3 × 10–12 langkah"], ["Seated Calf Raise", "4 × 12–20"]]},
{"n": "Full Body Strength", "l": "Expert", "f": "Seluruh tubuh, fokus kekuatan", "ex": [["Barbell Squat", "4 × 4–6"], ["Bench Press", "4 × 4–6"], ["Barbell Row", "4 × 5–8"], ["Overhead Press", "3 × 5–8"], ["Deadlift", "2 × 3–5"], ["Hanging Leg Raise", "3 × 8–12"]]}];
function add(i){const t=T[i],names=Object.keys(PROG).filter(k=>+k>=7).map(k=>PROG[k].n);let n=t.n,c=2;while(names.includes(n))n=t.n+' '+c++;
const k=Math.max(6,...Object.keys(PROG).map(Number))+1;PROG[k]={n,f:t.f,ex:t.ex.map(x=>[x[0],x[1],x[2]||exMode(x)])};saveProg();render();toast(n+' ditambahkan. Ubah lewat tombol Ubah.')}
const LV=['Semua','Pemula','Menengah','Lanjutan','Expert'],LD={Semua:'Pilih level sesuai pengalaman Anda.',Pemula:'Mesin dan dumbbell, volume rendah. Cocok untuk 2–3 hari/minggu.',Menengah:'Mulai beban bebas, volume sedang. Cocok untuk 3–5 hari/minggu.',Lanjutan:'Volume tinggi untuk hipertrofi. Butuh dasar teknik yang kuat.',Expert:'Beban berat atau volume besar. Butuh pengalaman dan pemulihan yang baik.'};
let lv=ls.get('ap_tplv','Semua');if(!LV.includes(lv))lv='Semua';
function apSheet(html,cb){const o=document.createElement('div');o.className='sheetbg';o.innerHTML='<div class="sheet xs" role="dialog" aria-modal="true"><div class="grab"></div>'+html+'</div>';let done=false;const x=()=>{if(done)return;done=true;o.classList.add('out');setTimeout(()=>o.remove(),250);document.removeEventListener('keydown',kd);if(cb)cb()},kd=e=>{if(e.key==='Escape')x()};o.addEventListener('click',e=>{if(e.target===o)x()});document.body.appendChild(o);document.addEventListener('keydown',kd);return{o,x}}
function apExSheet(vk){const d=PROG[vk],LIB=window.apLIB,ALL=window.apALL;if(!d||!LIB)return;const LK=Object.keys(LIB);let cat=0,qs='',det=null;const has=n=>d.ex.findIndex(e=>e[0]===n);
 const sh=apSheet('<h2>Pilih gerakan</h2><div id="pxm"><p class="sub">Ketuk foto atau nama untuk melihat contoh gerakan. Target awal 3 × 8–12, bisa diubah di Edit program.</p><input id="pxs" placeholder="Cari gerakan…" aria-label="Cari gerakan"><div class="chips" id="pxc" style="margin-top:8px"></div><div id="pxl"></div></div><div id="pxv" hidden></div><button class="btn" id="pxd">Selesai</button>',()=>{render()}),o=sh.o;
 const dr=()=>{const m=o.querySelector('#pxm'),v=o.querySelector('#pxv');
  if(det){m.hidden=true;v.hidden=false;const on=has(det)>=0;v.innerHTML=apDetail(det,`<button class="btn${on?' ghost':''}" data-pg="${esc(det)}">${on?'Lepas dari hari ini':'Tambah ke hari ini'}</button>`);o.querySelector('.sheet').scrollTop=0}
  else{v.hidden=true;m.hidden=false;o.querySelector('#pxc').innerHTML=LK.map((k,i)=>`<button class="chip" data-pc="${i}" ${i===cat&&!qs?'aria-current="true"':''}>${k}</button>`).join('');const L=qs?ALL.filter(n=>n.toLowerCase().includes(qs)):LIB[LK[cat]];o.querySelector('#pxl').innerHTML=L.slice(0,40).map(n=>{const on=has(n)>=0;return apRow(n,'pg',on,on?'Dipilih ✓':'Tambah')}).join('')||'<p class="mute">Tidak ada hasil.</p>'}
  o.querySelector('#pxd').textContent='Selesai ('+d.ex.length+' gerakan)'};
 o.addEventListener('input',e=>{if(e.target.id==='pxs'){qs=e.target.value.trim().toLowerCase();dr()}});
 o.addEventListener('click',e=>{const v=e.target.closest('[data-pv]');if(v){det=v.dataset.pv;dr();return}if(e.target.closest('[data-pvb]')){det=null;dr();return}const c=e.target.closest('[data-pc]');if(c){cat=+c.dataset.pc;qs='';o.querySelector('#pxs').value='';dr();return}const g=e.target.closest('[data-pg]');if(g){const n=g.dataset.pg,i=has(n);if(i>=0)d.ex.splice(i,1);else {const tg=/Plank|Side Plank/.test(n)?'3 × 30–40 detik':/Treadmill|Sepeda Statis|Elliptical|Rowing Machine|Stair Climber|Jalan Cepat|Lompat Tali/.test(n)?'1 × 15–20 menit':'3 × 8–12';d.ex.push([n,tg,exMode([n,tg])]);}saveProg();dr();return}if(e.target.id==='pxd')sh.x()});dr()}
function apAddDay(){const free=[1,2,3,4,5,6,0].filter(k=>!PROG[k]);if(!free.length){toast('Semua hari sudah terisi.');return}let lvl=lv;
 const sh=apSheet('<h2>Tambah hari latihan</h2><label for="adw">Hari</label><select id="adw">'+free.map(k=>`<option value="${k}">${HARI[k]}</option>`).join('')+'</select><button class="btn" id="adb" style="margin-top:12px">Mulai dari kosong, lalu pilih gerakan</button><p class="sub" style="margin-top:14px">Atau pakai program siap pakai:</p><div class="chips" id="adc"></div><div id="adl"></div><button class="btn ghost sm" id="adx">Batal</button>'),o=sh.o;
 const dr=()=>{o.querySelector('#adc').innerHTML=LV.map(l=>`<button class="chip" data-lv="${l}" ${l===lvl?'aria-current="true"':''}>${l}</button>`).join('');o.querySelector('#adl').innerHTML=T.map((t,i)=>lvl==='Semua'||t.l===lvl?apTplCard(esc(t.n),t.l+' · '+esc(t.f)+', '+t.ex.length+' gerakan','<button class="chip" data-pt="'+i+'">Pakai</button>',t):'').join('')};
 const mk=(n,f,ex,ed)=>{const k=+o.querySelector('#adw').value;PROG[k]={n,f,ex};viewDay=k;editing=ed;saveProg();sh.x();render();scrollTo(0,0);return k};
 o.addEventListener('click',e=>{const c=e.target.closest('[data-lv]');if(c){lvl=c.dataset.lv;dr();return}const p=e.target.closest('[data-pt]');if(p){const t=T[+p.dataset.pt];mk(t.n,t.f,t.ex.map(x=>[x[0],x[1],x[2]||exMode(x)]),false);toast('Hari ditambahkan. Ketuk Edit program untuk mengubah.');return}if(e.target.id==='adb'){const k=mk('Hari baru','Fokus latihan',[],true);apExSheet(k);return}if(e.target.id==='adx')sh.x()});dr()}
function apInfoLine(n){const x=exInfo(n);if(!x)return 'Otot belum terdata';const f=a=>a.map(g=>MG[g]||g).join(', ');return 'Otot utama: '+f(x.p)+(x.s.length?' · bantu: '+f(x.s):'')}
function apThumb(n){const im=exImg(n);return im?`<img class="apt" loading="lazy" decoding="async" src="${im[1]}" alt="Foto ${esc(n)}">`:`<div class="apt apn">${esc(n.slice(0,1))}</div>`}
function apRow(n,act,on,lab){return `<div class="apr"><button class="apb" data-pv="${esc(n)}" aria-label="Lihat foto ${esc(n)}">${apThumb(n)}</button><button class="apb apm" data-pv="${esc(n)}"><b>${esc(n)}</b><small>${esc(apInfoLine(n))}</small></button><button class="chip" data-${act}="${esc(n)}" aria-pressed="${on?'true':'false'}">${lab}</button></div>`}
function apDetail(n,btn){const im=exImg(n);return `<button class="chip" data-pvb="1">‹ Kembali ke daftar</button><h2 style="margin-top:10px">${esc(n)}</h2>${im?`<div class="exw" data-s="1"><img class="exi" src="${im[1]}" alt="Foto ${esc(n)}"></div>`:''}<p class="sub">${esc(apInfoLine(n))}</p>${(typeof tipHtml==='function'&&tipHtml(n))||''}${btn}`}
function apSwap(i){const a=getA();if(!a)return;const cur=SX(a).ex[i];if(!cur)return;
 if(a.sets[i].some(s=>s.done)){toast('Gerakan ini sudah ada set tercatat. Selesaikan dulu, atau lanjut ke gerakan lain.');return}
 const ALL=window.apALL||[],inf=exInfo(cur[0]),used=SX(a).ex.map(e=>e[0]);let qs='',det=null;
 const sh=apSheet('<div id="swm"><h2>Ganti gerakan</h2><p class="sub">Mengganti <b>'+esc(cur[0])+'</b> hanya untuk sesi ini, kecuali kamu aktifkan pilihan di bawah.</p><button class="chip" id="swp" aria-pressed="false" style="margin-bottom:8px">Jadikan pengganti tetap di program</button><input id="swq" placeholder="Cari gerakan…" aria-label="Cari gerakan"><div class="chips" id="swc" style="margin-top:8px"></div><p class="pkh" id="swh"></p><div id="swl"></div><label for="swn">Atau ketik sendiri</label><div class="f"><input id="swn" maxlength="40" placeholder="Nama gerakan" style="flex:1"><button class="btn ghost sm" id="swa" style="margin:0">Pakai</button></div></div><div id="swd" hidden></div>'),o=sh.o;
 const same=n=>{const x=exInfo(n);return !!(x&&inf&&x.p[0]===inf.p[0])};
 const dr=()=>{const m=o.querySelector('#swm'),v=o.querySelector('#swd');
  if(det){m.hidden=true;v.hidden=false;v.innerHTML=apDetail(det,`<button class="btn" data-sp="${esc(det)}">Pakai gerakan ini</button>`);o.querySelector('.sheet').scrollTop=0;return}
  v.hidden=true;m.hidden=false;o.querySelector('#swc').innerHTML=['Dumbbell','Cable','Machine','Barbell'].map(k=>`<button class="chip" data-q="${k.toLowerCase()}" ${qs===k.toLowerCase()?'aria-current="true"':''}>${k}</button>`).join('');
  let L=ALL.filter(n=>n!==cur[0]&&!used.includes(n));
  if(qs)L=L.filter(n=>n.toLowerCase().includes(qs)).sort((x,y)=>same(y)-same(x));else if(inf)L=L.filter(same);
  o.querySelector('#swh').textContent=qs?'Hasil pencarian (otot sejenis di atas). Ketuk foto untuk melihat contoh.':(inf?'Otot sejenis. Ketuk foto untuk melihat contoh.':'Semua gerakan');
  o.querySelector('#swl').innerHTML=L.slice(0,40).map(n=>apRow(n,'sp',false,'Pakai')).join('')||'<p class="mute">Tidak ada hasil. Coba kata lain atau ketik sendiri.</p>'};
 const use=n=>{n=n.trim();if(!n)return;const b=getA();if(!b)return;if(!b.ex)b.ex=PROG[b.dow].ex.map(e=>e.slice());if(!b.src)b.src=b.ex.map(e=>e[0]);const tg=b.ex[i][1],pv=prev(n),k=pv&&pv.length?pv:null,perm=o.querySelector('#swp').getAttribute('aria-pressed')==='true';let sv=false;b.ex[i]=[n,tg,exMode([n,tg])];if(perm){const pi=PROG[b.dow].ex.findIndex(e=>e[0]===b.src[i]);if(pi>=0){PROG[b.dow].ex[pi]=[n,PROG[b.dow].ex[pi][1],exMode([n,PROG[b.dow].ex[pi][1]])];saveProg();b.src[i]=n;sv=true}}
  const sm=exMode([n,tg]);b.sets[i]=Array.from({length:P(tg).sets},(_,j)=>({kg:sm==='weight'&&k?String((k[j]||k[k.length-1]).kg||''):'',reps:sm!=='time'&&k?String((k[j]||k[k.length-1]).reps||''):'',value:sm==='time'&&k?String((k[j]||k[k.length-1]).value??(k[j]||k[k.length-1]).time??''):'',done:false}));if(b.up)delete b.up[i];ls.set('ap_active',b);sh.x();rr();toast('Diganti ke '+n+(sv?' dan disimpan di program':perm?'. Gerakan asal tidak ditemukan di program, jadi hanya berlaku di sesi ini':''))};
 o.addEventListener('input',e=>{if(e.target.id==='swq'){qs=e.target.value.trim().toLowerCase();dr()}});
 o.addEventListener('click',e=>{if(e.target.id==='swp'){e.target.setAttribute('aria-pressed',e.target.getAttribute('aria-pressed')==='true'?'false':'true');return}const v=e.target.closest('[data-pv]');if(v){det=v.dataset.pv;dr();return}if(e.target.closest('[data-pvb]')){det=null;dr();return}const q=e.target.closest('[data-q]');if(q){qs=qs===q.dataset.q?'':q.dataset.q;o.querySelector('#swq').value=qs;dr();return}const p=e.target.closest('[data-sp]');if(p){use(p.dataset.sp);return}if(e.target.id==='swa')use(o.querySelector('#swn').value)});dr()}
function apLater(i){const a=getA();if(!a)return;const n=a.sets.length;if(i>=n-1){toast('Ini sudah gerakan terakhir.');return}
 if(a.sets[i].some(s=>s.done)){toast('Sudah ada set tercatat, tidak bisa ditunda.');return}
 const nm=SX(a).ex[i][0],rm=k=>k===i?n-1:(k>i?k-1:k),mv=r=>{r.push(r.splice(i,1)[0])};
 if(!a.src)a.src=SX(a).ex.map(e=>e[0]);a.ex=SX(a).ex.map(e=>e.slice());mv(a.ex);mv(a.sets);mv(a.src);
 if(a.pair){const np={};Object.keys(a.pair).forEach(k=>{np[rm(+k)]=rm(+a.pair[k])});a.pair=np}
 if(a.up){const nu={};Object.keys(a.up).forEach(k=>{nu[rm(+k)]=a.up[k]});a.up=nu}
 a.cur=i;ls.set('ap_active',a);slideDir='r';rr();toast(nm+' ditunda ke akhir.')}
document.addEventListener('click',e=>{const w=e.target.closest&&e.target.closest('[data-swap]');if(w){apSwap(+w.dataset.swap);return}const l=e.target.closest&&e.target.closest('[data-later]');if(l)apLater(+l.dataset.later)});
window.apAddDay=apAddDay;
window.apTplCard=function(ti,me,btn,t){const o=window.apOpen.has(ti);return `<div style="padding:10px 0;border-top:1px solid var(--line)"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span data-tg="${ti}" role="button" tabindex="0" aria-expanded="${o}" style="flex:1;cursor:pointer"><b>${ti}</b> <span class="mute" data-ar>${o?'▾':'▸'}</span><small class="prev" style="display:block">${me}</small></span>${btn}</div><div data-tgb ${o?'':'hidden'}>${window.apExList(t)}</div></div>`};
window.apOpen=new Set();document.addEventListener('click',e=>{const h=e.target.closest&&e.target.closest('[data-tg]');if(!h)return;const k=h.dataset.tg,b=h.parentElement.nextElementSibling,op=b.hidden;b.hidden=!op;h.setAttribute('aria-expanded',op);h.querySelector('[data-ar]').textContent=op?'▾':'▸';op?window.apOpen.add(k):window.apOpen.delete(k)});
document.addEventListener('click',e=>{if(!(e.target.closest&&e.target.closest('[data-xl]')))return;const a=getA();if(!a)return;const p=SX(a),c=a.cur||0;
const sh=apSheet('<h2>Daftar gerakan</h2><p class="sub">Ketuk gerakan untuk berpindah.</p>'+p.ex.map((x,i)=>{const n=a.sets[i].length,d=a.sets[i].filter(s=>s.done).length;return `<div class="apr"><button class="apb" data-xg="${i}">${apThumb(x[0])}</button><button class="apb apm" data-xg="${i}"><b>${esc(x[0])}${i===c?' · sedang dilatih':''}</b><small>${esc(apInfoLine(x[0]))}</small></button><span class="mute" style="white-space:nowrap">${d===n&&n?'✓ ':''}${d}/${n} set<br>${esc(x[1])}</span></div>`}).join('')+'<button class="btn ghost" id="xlc">Tutup</button>');
sh.o.addEventListener('click',ev=>{const g=ev.target.closest('[data-xg]');if(g){sh.x();goSlide(+g.dataset.xg);return}if(ev.target.id==='xlc')sh.x()})});
window.pvLine=function(pv){if(!pv||!pv.length)return '<div class="pvl"><span>Belum ada riwayat latihan ini</span></div>';const m=pv[0]&&pv[0].mode||'weight';if(m==='time'){const u=pv[0].unit||'menit';return `<div class="pvl"><span>Terakhir <b>${pv.map(x=>(x.value??x.time??'')+' '+u).join(' · ')}</b></span></div>`}if(m==='bodyweight'){const rp=pv.filter(x=>x.rpe).map(x=>+x.rpe),av=rp.length?Math.round(rp.reduce((t,x)=>t+x,0)/rp.length*10)/10:0;return `<div class="pvl"><span>Terakhir <b>${pv.map(x=>x.reps+' reps').join(' · ')}</b>${av?' · RPE '+av:''}</span></div>`}const g=[];pv.forEach(x=>{const l=g[g.length-1];if(l&&l.kg===x.kg)l.r.push(x.reps);else g.push({kg:x.kg,r:[x.reps]})});const rp=pv.filter(x=>x.rpe).map(x=>+x.rpe),av=rp.length?Math.round(rp.reduce((t,x)=>t+x,0)/rp.length*10)/10:0,e=est1(pv);return `<div class="pvl"><span>Terakhir <b>${g.map(x=>x.kg+' kg × '+x.r.join('·')).join(' → ')}</b>${av?' · RPE '+av:''}</span>${e>0?'<small>1RM ≈ '+e+' kg</small>':''}</div>`};
window.apDet=new Set();document.addEventListener('toggle',e=>{const d=e.target;if(d.dataset&&d.dataset.dk){d.open?window.apDet.add(d.dataset.dk):window.apDet.delete(d.dataset.dk)}},true);
window.apExList=function(day){return day.ex.map(e=>`<div class="apr"><button class="apb" data-pvx="${esc(e[0])}" aria-label="Lihat foto ${esc(e[0])}">${apThumb(e[0])}</button><button class="apb apm" data-pvx="${esc(e[0])}"><b>${esc(e[0])}</b><small>${esc(apInfoLine(e[0]))}</small></button><span class="mute" style="white-space:nowrap">${esc(e[1])}</span></div>`).join('')};
document.addEventListener('click',e=>{const v=e.target.closest&&e.target.closest('[data-pvx]');if(!v)return;const n=v.dataset.pvx,im=exImg(n),sh=apSheet(`<h2>${esc(n)}</h2>${im?`<div class="exw" data-s="1"><img class="exi" src="${im[1]}" alt="Foto ${esc(n)}"></div>`:''}<p class="sub">${esc(apInfoLine(n))}</p>${(typeof tipHtml==='function'&&tipHtml(n))||''}<button class="btn ghost" id="pvxc">Tutup</button>`);sh.o.querySelector('#pvxc').onclick=sh.x});
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-pickex]');if(b){apExSheet(b.dataset.pickex);return}const n=e.target.closest&&e.target.closest('[data-nm]');if(n){const [k,nm]=n.dataset.nm.split('|');if(PROG[k]){PROG[k].n=nm;saveProg();render()}}});
function tplSheet(){const added=new Set(),o=document.createElement('div');o.className='sheetbg';
o.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-label="Template latihan"><div class="grab"></div><h2>Template latihan</h2><p class="sub">Ketuk Tambah, lalu ubah sesuai kebutuhan lewat tombol Ubah. Program utama Anda tidak berubah.</p><div class="chips" id="tlc"></div><p class="prev" id="tld"></p><div id="tll"></div><button class="btn" id="tpx" style="margin-top:14px">Selesai</button></div>`;
const draw=()=>{o.querySelector('#tlc').innerHTML=LV.map(l=>`<button class="chip" data-lv="${l}" ${l===lv?'aria-current="true"':''}>${l}</button>`).join('');o.querySelector('#tld').textContent=LD[lv];
o.querySelector('#tll').innerHTML=T.map((t,i)=>lv==='Semua'||t.l===lv?apTplCard(t.n,t.l+' · '+t.f+', '+t.ex.length+' gerakan',`<button class="chip" data-tp="${i}" ${added.has(i)?'disabled aria-pressed="true"':''}>${added.has(i)?'Ditambahkan ✓':'Tambah'}</button>`,t):'').join('')};
const x=()=>{o.classList.add('out');setTimeout(()=>o.remove(),250);document.removeEventListener('keydown',kd)},kd=e=>{if(e.key==='Escape')x()};
o.onclick=e=>{if(e.target===o)x();const c=e.target.closest('[data-lv]');if(c){lv=c.dataset.lv;ls.set('ap_tplv',lv);draw();return}const b=e.target.closest('[data-tp]');if(b&&!b.disabled){const i=+b.dataset.tp;add(i);added.add(i);draw()}};
o.querySelector('#tpx').onclick=x;draw();document.body.appendChild(o);document.addEventListener('keydown',kd)}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-tpl]'))tplSheet()});
const PL={Pemula:{2:['Full Body A','Full Body B'],3:['Full Body A','Full Body B','Full Body C'],4:['Upper Mesin','Lower Mesin','Full Body C','Cardio dan Core']},
Menengah:{3:['Push','Pull','Legs'],4:['Upper Kekuatan','Lower Kekuatan','Bahu dan Lengan','Legs'],5:['Push','Pull','Legs','Upper Kekuatan','Lower Kekuatan']},
Lanjutan:{4:['Push Hipertrofi','Pull Hipertrofi','Legs Hipertrofi','Bahu dan Lengan'],5:['Push Hipertrofi','Pull Hipertrofi','Legs Hipertrofi','Dada dan Punggung','Bahu dan Lengan'],6:['Push Hipertrofi','Pull Hipertrofi','Legs Hipertrofi','Push','Pull','Legs']},
Expert:{4:['Power Upper','Power Lower','Volume Upper','Volume Lower'],5:['Power Upper','Power Lower','Volume Upper','Volume Lower','HIIT Kardio'],6:['Power Upper','Power Lower','Volume Upper','Volume Lower','Bahu dan Lengan','HIIT Kardio']}},
DW={2:[1,4],3:[1,3,5],4:[1,2,4,6],5:[1,2,3,5,6],6:[1,2,3,4,5,6]},
RG={Pemula:[2,4,3],Menengah:[3,5,4],Lanjutan:[4,6,5],Expert:[4,6,5]},
RN={Pemula:'Fokus teknik dan konsistensi; otot dilatih sering dengan volume rendah.',Menengah:'Mulai tambah beban dan volume; pemulihan antar sesi makin penting.',Lanjutan:'Volume tinggi per otot; butuh tidur dan nutrisi yang baik.',Expert:'Beban berat dan volume besar; atur deload secara berkala.'};
function weeklyAdaptiveState(level,days){
  const base=Math.max(RG[level][0],Math.min(RG[level][1],Number(days)||RG[level][2]));
  const out={days:base,reason:'',action:'baseline',stats:null};
  try{
    const u=window.apUnifiedIntelligence;
    if(!u||typeof u.weeklyStats!=='function')return out;
    const w=u.weeklyStats('gym');out.stats=w;
    const a=Number(w.adherence)||0,r=Number(w.avgRpe)||0,v=Number(w.volumeDelta)||0;
    if(w.sessions===0){out.reason='Belum ada cukup data minggu sebelumnya; jadwal ini menjadi baseline.';return out}
    if(r>=8||a<0.6){
      out.days=Math.max(RG[level][0],base-1);
      out.action='recovery';
      out.reason=r>=8?'RPE minggu sebelumnya tinggi; frekuensi diturunkan satu tingkat untuk memberi ruang pemulihan.':`Konsistensi minggu sebelumnya ${Math.round(a*100)}%; frekuensi diturunkan satu tingkat agar lebih realistis.`;
      return out;
    }
    if(a>=0.9&&r>0&&r<=7&&v>=-10){
      out.days=Math.min(RG[level][1],base+1);
      out.action='progression';
      out.reason='Konsistensi tinggi, RPE terkendali, dan volume tidak turun tajam; frekuensi dapat dinaikkan satu tingkat.';
      return out;
    }
    out.reason='Frekuensi dipertahankan karena data belum menunjukkan kebutuhan untuk menambah atau mengurangi sesi.';
  }catch(e){}
  return out;
}
function adaptiveProgramState(level,days,goal){
  const base=(PL[level]&&PL[level][days])?PL[level][days].slice():[];
  const out={programs:base,focus:'',reason:'',stats:null};
  if(!base.length)return out;
  try{
    const u=window.apUnifiedIntelligence;
    if(!u)return out;
    const ctx=typeof u.context==='function'?u.context('gym'):null;
    const M=window.apUnifiedData&&typeof window.apUnifiedData.muscles==='function'?window.apUnifiedData.muscles:null;
    let weak=[];
    if(M){
      const end=typeof todayIso==='string'?todayIso:new Date().toISOString().slice(0,10);
      const d=new Date(end+'T00:00:00');d.setDate(d.getDate()-13);
      const mv=M(d.toISOString().slice(0,10),end)||{};
      weak=Object.entries(mv).filter(x=>Number(x[1])>0).sort((a,b)=>Number(a[1])-Number(b[1])).slice(0,2).map(x=>String(x[0]));
    }
    const label=g=>MG[g]||g;
    const aliases={Dada:['Dada','Chest'],Punggung:['Punggung','Back'],Bahu:['Bahu','Shoulder'],Lengan:['Lengan','Biceps','Triceps'],Kaki:['Kaki','Quadriceps','Hamstring','Glutes'],Core:['Core','Perut']};
    const matches=(name,keys)=>keys.some(k=>name.toLowerCase().includes(k.toLowerCase()));
    let focus=weak.map(label);
    if(!focus.length&&ctx&&ctx.goal)focus=ctx.goal==='Strength'?['Kekuatan']:ctx.goal==='Athletic Performance'?['Power']:[];
    if(focus.length){
      const pool=Object.values(T).filter(t=>t.l===level);
      const chosen=[];
      base.forEach((orig,idx)=>{
        let best=pool.find(t=>t.n===orig)||T.find(t=>t.n===orig);
        let bestScore=-1e9;
        pool.forEach(t=>{
          if(chosen.includes(t.n))return;
          let score=0;
          focus.forEach(f=>{const keys=aliases[f]||[f];if(matches(t.n,keys)||matches(t.f,keys))score+=4; t.ex.forEach(e=>{if(matches(e[0],keys))score+=2})});
          if(goal==='Kekuatan'&&/Kekuatan|Power/.test(t.n))score+=2;
          if(goal==='Power'&&/Power|HIIT/.test(t.n))score+=2;
          score-=Math.abs(idx-pool.indexOf(t))*0.05;
          if(score>bestScore){bestScore=score;best=t}
        });
        chosen.push(best.n);
      });
      if(chosen.length===base.length&&new Set(chosen).size===base.length){
        const changed=chosen.some((n,i)=>n!==base[i]);
        if(changed){out.programs=chosen;out.focus=focus.slice(0,2).join(' dan ');out.reason='Split tetap mengikuti level dan frekuensi Anda, tetapi penekanan program disesuaikan dengan area yang volumenya paling rendah pada dua minggu terakhir.';}
      }
    }
  }catch(e){}
  return out;
}
function weeklyCoachNote(level,days){
  const a=weeklyAdaptiveState(level,days);
  return a.reason||'Jadwal disusun dengan jeda pemulihan yang wajar di antara sesi.';
}
function restoreProg(){const o=ls.get('ap_prog_prev',null);if(!o)return false;if(getA()){toast('Selesaikan atau batalkan workout yang sedang berjalan dulu.');return false}
for(let k=0;k<=6;k++)delete PROG[k];Object.keys(o.prog).forEach(k=>{PROG[k]=o.prog[k]});saveProg();ls.set('ap_profile',Object.assign({},prof(),{freq:o.freq}));ls.set('ap_prog_prev',null);render();toast('Jadwal sebelumnya dikembalikan.');return true}
const GL={'Umum':'Bangun otot',"Six pack":'Six pack','Turun BB':'Turun berat badan','Kekuatan':'Kekuatan','Stamina':'Stamina',Bulking:'Massa otot (bulking)',Dada:'Dada bidang',Punggung:'Punggung lebar',Bahu:'Bahu lebar',Lengan:'Lengan besar',Kaki:'Kaki dan bokong',Vtaper:'Tubuh atletis (V-taper)',Postur:'Postur dan punggung sehat',Power:'Power dan atletik'},
GD={'Umum':'Program seimbang untuk membangun otot dan kekuatan tanpa perubahan.','Six pack':'Menambah 2 gerakan perut di tiap hari plus kardio ringan. Garis perut baru terlihat saat lemak tubuh rendah, jadi pola makan sangat menentukan.','Turun BB':'Repetisi lebih tinggi dan kardio di akhir tiap sesi. Defisit kalori dari makanan tetap faktor utama penurunan berat badan.','Kekuatan':'Gerakan utama (squat, deadlift, press, row dengan barbell) dilatih berat dengan repetisi rendah. Paling cocok untuk level menengah ke atas, dengan istirahat cukup antar set.','Stamina':'Menambah kardio di tiap sesi untuk daya tahan jantung dan napas.',Bulking:'Menambah satu set pada 3 gerakan pertama tiap hari untuk volume lebih besar. Butuh kalori cukup dan tidur yang baik.',Dada:'Menambah 2 gerakan dada di hari push atau full body.',Punggung:'Menambah 2 gerakan punggung di hari pull atau full body untuk punggung lebar dan tebal.',Bahu:'Menambah 2 gerakan bahu samping dan belakang agar bahu tampak lebar.',Lengan:'Menambah 2 gerakan biseps dan triceps di hari upper atau full body.',Kaki:'Menambah gerakan kaki dan bokong; hari upper mendapat 1 gerakan tambahan.',Vtaper:'Menekankan punggung lebar dan bahu samping agar pinggang tampak lebih ramping. Hari kaki tidak diubah.',Postur:'Menambah gerakan penguat punggung atas, punggung bawah, dan core untuk postur dan kesehatan punggung.',Power:'Menambah gerakan eksplosif dan kardio intens untuk performa atletik.'},
GC=[['Cable Crunch','3 × 12–15'],['Hanging Leg Raise','3 × 8–12'],['Plank','3 × 30–40 detik'],['Russian Twist','3 × 15–20'],['Bicycle Crunch','3 × 15–20'],['Ab Wheel Rollout','3 × 8–12']],
GK=[['Treadmill','1 × 15–20 menit'],['Elliptical','1 × 15–20 menit'],['Rowing Machine','1 × 10–15 menit'],['Stair Climber','1 × 15–20 menit']];
const NL=/Legs|Lower|Cardio|HIIT/,FM={Dada:{k:/Legs|Lower|Cardio|HIIT|Pull/,l:[['Incline Dumbbell Press','3 × 8–12'],['Chest Fly Machine','3 × 12–15'],['Cable Crossover','3 × 12–15'],['Push Up','2 × 10–15']]},Punggung:{k:/Legs|Lower|Cardio|HIIT|Push/,l:[['Lat Pulldown','3 × 8–12'],['Seated Cable Row','3 × 10–12'],['Straight Arm Pulldown','3 × 12–15'],['One Arm Dumbbell Row','3 × 8–12']]},Bahu:{k:NL,l:[['Dumbbell Lateral Raise','3 × 12–15'],['Rear Delt Fly','3 × 12–15'],['Cable Lateral Raise','3 × 12–15'],['Face Pull','3 × 12–15']]},Lengan:{k:NL,l:[['Dumbbell Biceps Curl','3 × 8–12'],['Triceps Pushdown','3 × 10–12'],['Hammer Curl','3 × 10–12'],['Overhead Triceps Extension','3 × 10–12']]},Vtaper:{k:NL,l:[['Lat Pulldown','3 × 8–12'],['Dumbbell Lateral Raise','3 × 12–15'],['Rear Delt Fly','3 × 12–15'],['Seated Cable Row','3 × 10–12']]},Postur:{k:/Cardio|HIIT/,l:[['Face Pull','3 × 12–15'],['Back Extension','2 × 12–15'],['Dead Bug','2 × 8–10'],['Plank','3 × 30–40 detik']]},Power:{k:null,l:[['Lompat Tali','3 × 60–90 detik'],['Mountain Climber','3 × 30–40 detik'],['Step Up','3 × 8–10'],['Hip Thrust','3 × 6–8']]}},KL=[['Hip Thrust','3 × 8–12'],['Bulgarian Split Squat','3 × 8–12'],['Walking Lunge','3 × 10–12'],['Hip Abduction Machine','3 × 12–15']];
function GM(g,ex,i,nm){nm=nm||'';let r=ex.map(v=>v.slice());const add=(c)=>{if(!r.some(e=>e[0]===c[0]))r.push(c.slice())};
if(g==='Six pack'){add(GC[(i*2)%GC.length]);add(GC[(i*2+1)%GC.length]);if(i%2===0)add(['Treadmill','1 × 10–15 menit'])}
else if(g==='Turun BB'){r=r.map(e=>{const m=e[1].match(/^(\d+) × (\d+)–(\d+)$/);return m&&+m[2]<10&&!/Barbell|Deadlift/.test(e[0])?[e[0],'3 × 12–15']:e});add(GK[i%GK.length])}
else if(g==='Kekuatan'){r=r.map(e=>/Deadlift/.test(e[0])&&!/Romanian|Stiff/.test(e[0])?[e[0],'3 × 3–5']:/Barbell (Squat|Row)|Front Squat|Bench Press|Overhead Press/.test(e[0])?[e[0],'4 × 4–6']:e)}
else if(g==='Stamina'){add(GK[i%GK.length]);if(i%2===1)add(['Lompat Tali','3 × 60–90 detik'])}
const f=FM[g];if(f&&!(f.k&&f.k.test(nm))){add(f.l[(i*2)%f.l.length]);add(f.l[(i*2+1)%f.l.length])}
if(g==='Kaki'){if(/Legs|Lower|Full/.test(nm)){add(KL[(i*2)%4]);add(KL[(i*2+1)%4])}else if(!/Cardio|HIIT/.test(nm))add(KL[i%4])}
if(g==='Bulking'){r=r.map((e,k)=>{const m=e[1].match(/^(\d+) × (\d+)–(\d+)$/);return k<3&&m&&+m[1]<4?[e[0],(+m[1]+1)+' × '+m[2]+'–'+m[3]]:e})}
return r}
function recSheet(){let st=ls.get('ap_recv',{l:'Pemula',d:+prof().freq||3}),armed=false;if(!RG[st.l])st.l='Pemula';if(!GL[st.g])st.g='Umum';
const adapt=weeklyAdaptiveState(st.l,st.d);if(adapt.stats&&adapt.stats.sessions&&adapt.days!==st.d)st={...st,d:adapt.days};
const fix=()=>{st.d=Math.min(RG[st.l][1],Math.max(RG[st.l][0],+st.d||RG[st.l][2]))};fix();
const o=document.createElement('div');o.className='sheetbg schedule-recommendation-modal';
o.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-label="Rekomendasi jadwal mingguan"><div class="grab"></div><h2>Rekomendasi jadwal mingguan</h2><p class="sub">Pilih level dan berapa kali Anda bisa latihan per minggu.</p><p class="pkh">Level</p><div class="chips" id="rl"></div><p class="pkh">Hari latihan per minggu</p><div class="chips" id="rd"></div><p class="pkh">Tujuan latihan</p><div class="chips" id="rg"></div><p class="prev" id="rgd"></p><p class="prev" id="rn"></p><div id="rp"></div><button class="btn" id="ra" style="margin-top:14px">Terapkan ke jadwal</button>${ls.get('ap_prog_prev',null)?'<button class="btn ghost sm" id="rr">Kembalikan jadwal sebelumnya</button>':''}<button class="btn ghost sm" id="rx">Tutup</button></div>`;
const plan=()=>{const ap=adaptiveProgramState(st.l,st.d,st.g);return ap.programs.map((n,i)=>{const t=T.find(t=>t.n===n);return Object.assign({},t,{ex:GM(st.g,t.ex,i,t.n)})})};
const draw=()=>{const a=RG[st.l][0],b=RG[st.l][1],r=RG[st.l][2];
o.querySelector('#rl').innerHTML=Object.keys(RG).map(l=>`<button class="chip" data-rl="${l}" ${l===st.l?'aria-current="true"':''}>${l}</button>`).join('');
o.querySelector('#rd').innerHTML=Array.from({length:b-a+1},(_,i)=>a+i).map(d=>`<button class="chip" data-rd="${d}" ${d===st.d?'aria-current="true"':''}>${d}x${d===r?' <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true" style="vertical-align:-1px;margin-left:3px"><path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.5 6.3-.9L12 2.8Z"/></svg>':''}</button>`).join('');
o.querySelector('#rg').innerHTML=Object.keys(GL).map(g=>`<button class="chip" data-rg="${g}" ${g===st.g?'aria-current="true"':''}>${GL[g]}</button>`).join('');o.querySelector('#rgd').textContent=GD[st.g];
const aps=adaptiveProgramState(st.l,st.d,st.g);
o.querySelector('#rn').textContent=RN[st.l]+' Umumnya '+r+' hari cukup; '+weeklyCoachNote(st.l,st.d)+' '+(adapt.action==='recovery'?'Rekomendasi adaptif: '+st.d+' hari.':adapt.action==='progression'?'Rekomendasi adaptif: '+st.d+' hari.':'')+(aps.reason?' '+aps.reason:'');
o.querySelector('#rp').innerHTML=plan().map((t,i)=>apTplCard(HARI[DW[st.d][i]]+' · '+t.n,t.f+', '+t.ex.length+' gerakan','',t)).join('');
armed=false;o.querySelector('#ra').textContent='Terapkan ke jadwal'};
const x=()=>{o.classList.add('out');setTimeout(()=>o.remove(),250);document.removeEventListener('keydown',kd)},kd=e=>{if(e.key==='Escape')x()};
o.onclick=e=>{if(e.target===o){x();return}const l=e.target.closest('[data-rl]'),d=e.target.closest('[data-rd]');
const g=e.target.closest('[data-rg]');if(g){st.g=g.dataset.rg;draw();return}if(l){st.l=l.dataset.rl;fix();draw();return}if(d){st.d=+d.dataset.rd;draw();return}
if(e.target.closest('#rx')){x();return}if(e.target.closest('#rr')){if(restoreProg())x();return}
if(e.target.closest('#ra')){const ap=o.querySelector('#ra');if(getA()){toast('Selesaikan atau batalkan workout yang sedang berjalan dulu.');return}
if(!armed){armed=true;ap.textContent='Tekan lagi untuk mengganti jadwal mingguan';return}
const old={prog:{},freq:prof().freq};for(let k=0;k<=6;k++)if(PROG[k])old.prog[k]=PROG[k];ls.set('ap_prog_prev',old);
for(let k=0;k<=6;k++)delete PROG[k];
plan().forEach((t,i)=>{PROG[DW[st.d][i]]={n:t.n,f:t.f,ex:t.ex.map(v=>v.slice())}});
saveProg();ls.set('ap_recv',st);ls.set('ap_profile',Object.assign({},prof(),{freq:st.d}));x();render();undoToast('Jadwal diperbarui: '+st.d+' hari per minggu.',restoreProg)}};
draw();document.body.appendChild(o);document.addEventListener('keydown',kd)}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-rec]'))recSheet()});
function onbSheet(){let l='Pemula',d=3;const fix=()=>{d=Math.min(RG[l][1],Math.max(RG[l][0],d))};
const o=document.createElement('div');o.className='sheetbg';
o.innerHTML=`<div class="sheet" role="dialog" aria-modal="true" aria-label="Selamat datang"><div class="grab"></div><h2>Selamat datang</h2><p class="sub">Isi sedikit data agar jadwal latihan sesuai dengan Anda. Semua bisa diubah kapan saja di Profil.</p><label for="ob_n">Nama</label><input id="ob_n" maxlength="30" autocomplete="off"><label for="ob_h">Tinggi (cm)</label><input id="ob_h" inputmode="decimal"><label for="ob_w">Berat badan (kg)</label><input id="ob_w" inputmode="decimal"><p class="pkh">Level</p><div class="chips" id="ob_l" style="flex-wrap:wrap"></div><p class="pkh">Hari latihan per minggu</p><div class="chips" id="ob_d"></div><p class="prev" id="ob_r"></p><button class="btn" id="ob_go" style="margin-top:14px">Buat jadwal saya</button><button class="btn ghost sm" id="ob_skip">Lewati dulu</button></div>`;
const draw=()=>{const a=RG[l][0],b=RG[l][1],r=RG[l][2];
o.querySelector('#ob_l').innerHTML=Object.keys(RG).map(k=>`<button class="chip" data-ol="${k}" ${k===l?'aria-current="true"':''}>${k}</button>`).join('');
o.querySelector('#ob_d').innerHTML=Array.from({length:b-a+1},(_,i)=>a+i).map(n=>`<button class="chip" data-od="${n}" ${n===d?'aria-current="true"':''}>${n}x${n===r?' <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true" style="vertical-align:-1px;margin-left:3px"><path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.5 6.3-.9L12 2.8Z"/></svg>':''}</button>`).join('');
o.querySelector('#ob_r').textContent=RN[l]};
const x=()=>{o.classList.add('out');setTimeout(()=>o.remove(),250);document.removeEventListener('keydown',kd)},kd=e=>{if(e.key==='Escape'){ls.set('ap_onb',1);x()}};
o.onclick=e=>{const L=e.target.closest('[data-ol]'),D=e.target.closest('[data-od]');
if(L){l=L.dataset.ol;fix();draw();return}if(D){d=+D.dataset.od;draw();return}
if(e.target.closest('#ob_skip')){ls.set('ap_onb',1);x();return}
if(e.target.closest('#ob_go')){const h=parseFloat(o.querySelector('#ob_h').value.replace(',','.')),w=parseFloat(o.querySelector('#ob_w').value.replace(',','.'));
if(!(h>100&&h<250)){toast('Tinggi badan harus 100–250 cm.');return}if(!(w>20&&w<300)){toast('Berat badan harus 20–300 kg.');return}
const plan=PL[l][d].map(n=>T.find(t=>t.n===n));for(let k=0;k<=6;k++)delete PROG[k];
plan.forEach((t,i)=>{PROG[DW[d][i]]={n:t.n,f:t.f,ex:t.ex.map(v=>v.slice())}});saveProg();
ls.set('ap_recv',{l,d});ls.set('ap_profile',{name:o.querySelector('#ob_n').value.trim(),height:h,startKg:w,freq:d,goal:''});
weights=weights.filter(q=>q.d!==todayIso).concat({d:todayIso,kg:w});ls.set('ap_weights',weights);ls.set('ap_onb',1);
x();render();toast('Jadwal dibuat: '+d+' hari per minggu.')}};
draw();document.body.appendChild(o);document.addEventListener('keydown',kd)}
if(!ls.get('ap_onb',false)&&!prof().height&&!Object.keys(PROG).length&&!getA())setTimeout(onbSheet,500);
})();
