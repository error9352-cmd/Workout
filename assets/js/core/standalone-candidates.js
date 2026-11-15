/* Phase 2C — standalone candidates; not loaded yet. */

function adjRow(i,j,pv){const b=(a,d,t,l)=>`<button class="ok" data-a="${a}" data-d="${d}" data-i="${i}" data-j="${j}" aria-label="${l}">${t}</button>`;
 const cp=(j>0||(pv&&pv[0]))?`<button class="ok" data-cp="1" data-i="${i}" data-j="${j}" aria-label="Salin set sebelumnya">Salin</button>`:'';
 return `<div class="adj">${b('kg',-2.5,'−2,5 kg','Kurangi beban 2,5 kg')}${b('kg',2.5,'+2,5 kg','Tambah beban 2,5 kg')}${b('reps',-1,'−1 rep','Kurangi satu repetisi')}${b('reps',1,'+1 rep','Tambah satu repetisi')}${cp}</div>`}

function arm(b,txt,fn){if(b.dataset.arm){fn();return}b.dataset.arm='1';const o=b.textContent,oc=b.style.color;b.textContent=txt;b.style.color='#ff8a8a';
 setTimeout(()=>{if(b.isConnected){delete b.dataset.arm;b.textContent=o;b.style.color=oc}},3000)}

function avg7(){const c=new Date(today);c.setDate(c.getDate()-6);const w=weights.filter(x=>x.d>=iso(c));if(!w.length)return '';return `<div class="row"><span>Rata-rata 7 hari</span><span class="num" style="font-size:22px">${(w.reduce((a,x)=>a+x.kg,0)/w.length).toFixed(1)} kg</span></div>`}

function bestKg(n){let m=0;sessions().forEach(s=>{(s.log&&s.log[n]||[]).forEach(x=>{if(x.kg>m)m=x.kg})});return m}

function cut(){const d=new Date(today);d.setDate(d.getDate()-range);return iso(d)}

function e1(n){let b=0;sessions().forEach(x=>((x.log&&x.log[n])||[]).forEach(r=>{const k=+r.kg,c=+r.reps;if(k>0&&c>0&&c<=12){const v=k*(1+c/30);if(v>b)b=v}}));return b?`<p class="prev">Perkiraan 1RM: ${Math.round(b*2)/2} kg (rumus Epley)</p>`:''}

function editList(d,vk){return d.ex.map((e,i)=>`<div class="erow"><input data-en="${vk}-${i}" value="${e[0]}" aria-label="Nama latihan"><input data-et="${vk}-${i}" value="${e[1]}" aria-label="Target"><button class="ok" data-del="${vk}-${i}">Hapus</button></div>`).join('')+`<button class="btn ghost sm" data-pickex="${vk}">Pilih dari daftar gerakan</button><label>Tambah latihan (ketik sendiri)</label><div class="erow"><input id="nn" placeholder="Nama latihan"><input id="nt" placeholder="3 × 10–12"><button class="ok" data-addex="${vk}">Tambah</button></div>`}

function est1(a){let m=0;a.forEach(x=>{const v=x.reps>1?x.kg*(1+x.reps/30):x.kg;if(v>m)m=v});return Math.round(m*2)/2}

function exFig(e,n){if(!e[2].length)return `<div class="exw" data-s="1"><img class="exi" src="${e[1]}" alt="Contoh gerakan ${n}"></div>`;const ov=e[2],w=e[3],h=e[4];
 const els=hlOn?ov.map(o=>`<ellipse cx="${o[0]}" cy="${o[1]}" rx="${o[2]}" ry="${o[3]}" transform="rotate(${o[4]} ${o[0]} ${o[1]})" fill="#ff2a2a" fill-opacity="${o[5]==='p'?.55:.28}"/>`).join(''):'';
 return `<div class="exw"><img class="exi" src="${e[1]}" alt="Contoh gerakan ${n}"><svg class="exo" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="blr" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter></defs><g filter="url(#blr)">${els}</g></svg></div><button class="chip" data-hl="1" style="margin-top:8px">${hlOn?'Sembunyikan warna otot':'Tampilkan warna otot'}</button>${hlOn?'<div class="prev">Merah pekat: otot utama. Merah muda: otot pendukung. Posisi warna berupa perkiraan.</div>':''}`}

function exImg(n){return EXIMG.find(x=>new RegExp(x[0]).test(n))||null}

function exInfo(n){const e=EXI.find(x=>x[0].test(n));return e?{p:e[1],s:e[2]}:null}

function exMode(e){const n=String(e&&e[0]||'').trim(),t=String(e&&e[1]||'').toLowerCase(),m=String(e&&e[2]||'').toLowerCase();if(m==='time'||m==='waktu'||m==='duration')return 'time';if(m==='bodyweight'||m==='berat badan')return 'bodyweight';if(/menit|detik/.test(t))return 'time';if(/treadmill|sepeda statis|elliptical|rowing machine|stair climber|lompat tali|jalan cepat|plank|side plank/.test(n.toLowerCase()))return 'time';if(/push up|pull up|chin up|dips|crunch|bicycle crunch|hanging leg raise|russian twist|mountain climber|dead bug|ab wheel rollout/.test(n.toLowerCase()))return 'bodyweight';return 'weight'}

function exPts(re){const o=[];sessions().forEach(s=>{let m=0;for(const n in (s.log||{}))if(re.test(n))s.log[n].forEach(x=>{if(x.kg>m)m=x.kg});if(m>0)o.push({d:s.date,v:m})});return o}

function figure(inf){const fp=g=>inf.p.includes(g)?'fill="#2F7BFF"':inf.s.includes(g)?'fill="#2F7BFF" fill-opacity=".45"':null;
 const base='<circle cx="50" cy="12" r="9"/><rect x="32" y="24" width="36" height="50" rx="10"/><rect x="20" y="28" width="10" height="46" rx="5"/><rect x="70" y="28" width="10" height="46" rx="5"/><rect x="34" y="76" width="14" height="60" rx="6"/><rect x="52" y="76" width="14" height="60" rx="6"/>';
 const over=Object.keys(GS).map(g=>{const f=fp(g);return f?GS[g].replace(/\{f\}/g,f):''}).join('');
 return `<svg viewBox="0 0 200 152" style="width:110px;flex:none" role="img" aria-label="Otot yang dilatih"><g fill="#26304a">${base}</g><g fill="#26304a" transform="translate(100 0)">${base}</g>${over}<text x="50" y="150" font-size="9" text-anchor="middle" fill="#8C97B2">Depan</text><text x="150" y="150" font-size="9" text-anchor="middle" fill="#8C97B2">Belakang</text></svg>`}

function figure2(inf){const all=[...inf.p,...inf.s];
 const fp=g=>inf.p.includes(g)?'fill="#2F7BFF" stroke="#8fb8ff" stroke-width="1.5"':'fill="#2F7BFF" fill-opacity=".45" stroke="#6aa2ff" stroke-width="1"';
 const vs=['f','b'].filter(v=>all.some(g=>GS2[g][v]));
 const parts=vs.map((v,k)=>`<g transform="translate(${k*200} 0)"><g fill="#26304a" stroke="#3a4766" stroke-width="1.5">${BASE}</g>${all.map(g=>GS2[g][v]?GS2[g][v].replace(/\{f\}/g,fp(g)):'').join('')}<text x="100" y="302" font-size="13" text-anchor="middle" fill="#8C97B2">${v==='f'?'Tampak depan':'Tampak belakang'}</text></g>`).join('');
 return `<svg viewBox="0 0 ${vs.length*200} 308" style="width:${vs.length===1?170:320}px;max-width:100%" role="img" aria-label="Peta otot yang dilatih">${parts}</svg>`}

function fmt(d){const x=new Date(d+'T00:00:00');return x.getDate()+' '+BLN[x.getMonth()]}

function historyFiltered(){const all=sessions().map((s,k)=>({s,k}));const q=histQ.trim().toLowerCase();const cutoff=histRange?new Date(today.getTime()-((histRange-1)*86400000)):null;return all.filter(({s})=>{if(cutoff&&s.date<iso(cutoff))return false;if(!q)return true;const hay=[s.name,s.note,...Object.keys(s.log||{})].join(' ').toLowerCase();return hay.includes(q)}).reverse()}

function historyStats(items){const n=items.length,sets=items.reduce((a,{s})=>a+Object.values(s.log||{}).reduce((t,v)=>t+v.length,0),0),vol=items.reduce((a,{s})=>a+(s.volume||0),0),mins=items.reduce((a,{s})=>a+(s.minutes||0),0);return `<div class="history-summary"><div class="stat"><div class="num">${n}</div><small>sesi</small></div><div class="stat"><div class="num">${sets}</div><small>set</small></div><div class="stat"><div class="num">${vol>=10000?(Math.round(vol/100)/10)+'t':Math.round(vol).toLocaleString('id-ID')}</div><small>volume</small></div><div class="stat"><div class="num">${mins>=60?Math.floor(mins/60)+'j '+mins%60+'m':mins+'m'}</div><small>durasi</small></div></div>`}

function last(){return [...weights].sort((a,b)=>a.d.localeCompare(b.d)).slice(-1)[0]||{d:todayIso,kg:''}}

function modeLabel(m){return m==='time'?'WAKTU':m==='bodyweight'?'BERAT BADAN':'BEBAN + REP'}

function modeUnit(e){return /detik/i.test(String(e&&e[1]||''))?'detik':'menit'}

function monOf(s){const x=new Date(s+'T00:00:00');x.setDate(x.getDate()-((x.getDay()+6)%7));return iso(x)}

function mondayIso(){const d=new Date(today);d.setDate(d.getDate()-((d.getDay()+6)%7));return iso(d)}

function offlineNote(){if(!('serviceWorker' in navigator))return 'Mode offline tidak didukung di browser ini.';if(!/^https?:$/.test(location.protocol))return 'Mode offline aktif setelah aplikasi dibuka lewat alamat web (https), bukan dari file lokal.';return navigator.serviceWorker.controller?'Mode offline aktif: aplikasi bisa dibuka tanpa sinyal.':'Mode offline sedang disiapkan. Buka ulang aplikasi sekali saat online.'}

function phOpen(){return new Promise((ok,no)=>{try{const r=indexedDB.open('ap_db',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)}catch(e){no(e)}})}

function prCount(k){const ss=sessions(),s=ss[k];let n=0;for(const nm in (s.log||{})){const m=Math.max(...s.log[nm].map(x=>x.kg));let o=0;for(let i=0;i<k;i++){const l=ss[i].log&&ss[i].log[nm];if(l)l.forEach(x=>{if(x.kg>o)o=x.kg})}if(o>0&&m>o)n++}return n}

function prData(){
 const out={};
 sessions().forEach((s,si)=>Object.entries(s.log||{}).forEach(([n,v])=>{
  const clean=v.map(x=>({kg:+x.kg||0,reps:+x.reps||0,rpe:+x.rpe||0})).filter(x=>x.kg>0&&x.reps>0);
  if(!clean.length)return;
  const best=Math.max(...clean.map(x=>x.kg));
  const est=Math.max(...clean.map(x=>x.kg*(1+x.reps/30)));
  if(!out[n]||best>out[n].best||(best===out[n].best&&est>out[n].est))out[n]={name:n,best,est,date:s.date,index:si,reps:clean.find(x=>x.kg===best)?.reps||0};
 }));
 return Object.values(out).sort((a,b)=>b.best-a.best||b.est-a.est);
}

function prev(n){const s=sessions();for(let i=s.length-1;i>=0;i--){if(s[i].log&&s[i].log[n])return s[i].log[n]}return null}

function prevN(n,k){const o=[],q=sessions();for(let i=q.length-1;i>=0&&o.length<k;i--){const l=q[i].log&&q[i].log[n];if(l&&l.length)o.push(l)}return o}

function profileCard(){const p=prof();
 if(!editP)return `<section class="card"><h2>Profil</h2><div class="row"><span>Nama</span><span>${esc(p.name)||'Belum diisi'}</span></div><div class="row"><span>Tinggi</span><span>${p.height?p.height+' cm':'Belum diisi'}</span></div><div class="row"><span>Berat awal</span><span>${p.startKg?p.startKg+' kg':'Belum diisi'}</span></div><div class="row"><span>Frekuensi</span><span>${p.freq?p.freq+' kali seminggu':'Belum diisi'}</span></div><div class="row"><span>Tujuan</span><span>${esc(p.goal)||'Belum diisi'}</span></div><button class="btn ghost sm" data-ep="1">Edit profil</button></section>`;
 return `<section class="card"><h2>Edit profil</h2><label for="pr_n">Nama</label><input id="pr_n" value="${esc(p.name)}" maxlength="30"><label for="pr_h">Tinggi (cm)</label><input id="pr_h" inputmode="decimal" value="${p.height}"><label for="pr_s">Berat awal (kg)</label><input id="pr_s" inputmode="decimal" value="${p.startKg}"><label for="pr_f">Latihan per minggu</label><input id="pr_f" inputmode="numeric" value="${p.freq}"><label for="pr_g">Tujuan</label><input id="pr_g" value="${esc(p.goal)}" maxlength="60"><div class="f" style="margin-top:14px"><button class="btn ghost" data-pc="1" style="flex:1;margin:0">Batal</button><button class="btn" data-ps="1" style="flex:1;margin:0">Simpan</button></div></section>`}

function rangeChips(){return `<div class="chips">${RG.map(r=>`<button class="chip" ${r[0]===range?'aria-current="true"':''} data-rg="${r[0]}">${r[1]}</button>`).join('')}</div>`}

function recAct(t,i){return `<div class="pvl" style="color:var(--ink)"><span>${t}</span><span style="display:flex;gap:6px"><button class="ok" data-up="${i}" style="min-height:36px;padding:0 14px">Naikkan</button><button class="ok" data-no="${i}" style="min-height:36px;padding:0 14px;background:var(--card)">Nanti</button></span></div>`}

function recTxt(t){return `<div class="pvl" style="color:var(--ink)"><span>${t}</span></div>`}

function restFor(n){return /Leg Press|Hack Squat|Romanian|Goblet/.test(n)?150:/Plank|Crunch|Pallof/.test(n)?50:/Chest Press|Lat Pulldown|Row|Shoulder Press/.test(n)?105:75}

function ringCard(d){const f=Math.max(1,+prof().freq||4),r=Math.min(1,d/f),C=238.76,rem=Math.max(0,f-d);
return `<section class="card ringcard" aria-label="Target mingguan"><svg class="ring" viewBox="0 0 92 92" role="img" aria-label="${d} dari ${f} sesi"><defs><linearGradient id="rgr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset="1" stop-color="#3B82F6"/></linearGradient></defs><circle class="t" cx="46" cy="46" r="38" fill="none" stroke-width="9"/><circle class="v" cx="46" cy="46" r="38" fill="none" stroke="url(#rgr)" stroke-width="9" stroke-linecap="round" transform="rotate(-90 46 46)" stroke-dasharray="${C}" stroke-dashoffset="${(C*(1-r)).toFixed(1)}" style="--c:${C}"/><text class="n" x="46" y="54" text-anchor="middle">${d}/${f}</text></svg><div><h2>Target mingguan</h2><p class="sub">${rem?'Tinggal '+rem+' sesi lagi minggu ini':'Target minggu ini tercapai'}</p></div></section>`}

function rpeRow(i,j,v){const T={6:'Ringan, masih sisa 4 rep atau lebih',7:'Terkendali, masih sisa sekitar 3 rep',8:'Berat, masih sisa 2 rep',9:'Sangat berat, masih sisa 1 rep',10:'Mentok, tidak sanggup tambah rep'};return `<div class="rpe" role="group" aria-label="RPE set ${j+1}"><small>RPE</small><button type="button" class="rpeq" data-rpeinfo="1" aria-label="Apa itu RPE?">?</button>${[6,7,8,9,10].map(n=>`<button data-rpe="${i}-${j}-${n}" aria-pressed="${+v===n}" aria-label="RPE ${n}">${n}</button>`).join('')}${T[+v]?`<span class="rpec" role="status">${T[+v]}</span>`:''}</div>`}

function sc(){const c=slideDir?'in-'+slideDir:'';slideDir=null;return c}

function slideBtns(a,n){const c=a.cur||0;
 return `<div class="f" style="margin-top:14px">${c>0?`<button class="btn ghost" data-sl="${c-1}" style="margin:0;flex:1">Sebelumnya</button>`:''}${c>=n-1?'<button class="btn" data-finish="1" style="margin:0;flex:1">Selesaikan workout</button>':`<button class="btn" data-sl="${c+1}" style="margin:0;flex:1">Berikutnya</button>`}</div>`}

function slideNav(a,p){const c=a.cur||0;return `<div class="chips" aria-label="Daftar latihan">${p.ex.map((e,i)=>{const dn=a.sets[i].length&&a.sets[i].every(s=>s.done);return `<button class="chip" ${i===c?'aria-current="true"':''} data-sl="${i}" aria-label="Latihan ${i+1}: ${e[0]}">${dn?'✓':i+1}${a.pair&&a.pair[i]!=null?'⇄':''}</button>`}).join('')}</div><div class="snr"><span>Latihan ${c+1} dari ${p.ex.length}</span><span class="snb"><button class="chip" data-xl="1">Daftar</button><button class="chip" data-finish="1">Selesai</button></span></div>`}

function ssRow(a,p,i){const pj=a.pair?a.pair[i]:null,o=p.ex.map((e,k)=>k===i?'':`<option value="${k}" ${pj===k?'selected':''}>${esc(e[0])}</option>`).join('');return `<div class="ssr"><label for="ss${i}">Superset</label><select id="ss${i}" data-ss="${i}" aria-label="Superset dengan gerakan lain"><option value="">Tidak ada</option>${o}</select></div>${pj!=null&&p.ex[pj]?`<p class="prev">Selesai satu set di sini, lanjut ke ${esc(p.ex[pj][0])} tanpa istirahat. Timer jalan setelah keduanya.</p>`:''}`}

function swRow(i,n){return `<div class="f" style="margin-top:8px"><button class="btn ghost sm" data-swap="${i}" style="margin:0;flex:1">Ganti gerakan</button>${i<n-1?`<button class="btn ghost sm" data-later="${i}" style="margin:0;flex:1">Tunda ke akhir</button>`:''}</div>`}

function themeCard(){const t=ls.get('ap_theme','biru');return `<section class="card"><h2>Warna aksen</h2><div class="thm">${[['biru','Biru','#3B82F6,#22D3EE'],['hijau','Hijau','#16A34A,#A3E635'],['oranye','Oranye','#EA580C,#FBBF24'],['ungu','Ungu','#8B5CF6,#E879F9'],['merah','Merah','#E11D48,#FB7185']].map(x=>`<button class="th" data-th="${x[0]}" aria-pressed="${t===x[0]}"><i style="background:linear-gradient(135deg,${x[2]})"></i>${x[1]}</button>`).join('')}</div></section>`}

function tipHtml(n){const t=TIPS.find(x=>x[0].test(n));return t?`<div class="tips"><div class="prev">Tips teknik</div><ul>${t[1].map(c=>`<li>${c}</li>`).join('')}</ul></div>`:''}

function weekCmp(ss,mon){const pm=new Date(mon+'T00:00:00');pm.setDate(pm.getDate()-7);const pmi=iso(pm),a=ss.filter(s=>s.date>=mon),b=ss.filter(s=>s.date>=pmi&&s.date<mon);if(!b.length)return '';const va=a.reduce((x,s)=>x+(s.volume||0),0),vb=b.reduce((x,s)=>x+(s.volume||0),0),d=vb?Math.round((va-vb)/vb*100):0;return `<section class="card"><h2>Dibanding minggu lalu</h2><div class="row"><span>Sesi</span><span>${a.length} <span class="mute">(minggu lalu ${b.length})</span></span></div><div class="row"><span>Volume</span><span>${Math.round(va).toLocaleString('id-ID')} kg <span class="mute">(${d>0?'+':''}${d}%)</span></span></div><p class="prev">Minggu ini masih berjalan, jadi angkanya terus bertambah.</p></section>`}

function wtText(sec){return Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');}