/*
 * ATHLETIC PHYSIQUE — PHASE 2B CANDIDATE MODULE
 *
 * Copied from 00-app-core.js for dependency review.
 * NOT loaded by index.html yet.
 */

function prev(n){const s=sessions();for(let i=s.length-1;i>=0;i--){if(s[i].log&&s[i].log[n])return s[i].log[n]}return null}

function wtTargetSeconds(i,j){
 const a=getA();if(!a||!a.sets[i]||!a.sets[i][j])return 0;
 const e=SX(a).ex[i],unit=modeUnit(e),st=a.sets[i][j];
 const saved=parseInt(st.timerSec,10);if(saved>0)return saved;
 const target=String(e&&e[1]||'').match(/(\d+(?:[.,]\d+)?)\s*(?:–|-|to)?\s*(\d+(?:[.,]\d+)?)?\s*(detik|menit)/i);
 let value=0;
 if(target){const n=parseFloat(String(target[2]||target[1]).replace(',','.'));value=unit==='detik'?n:n*60;}
 if(value<=0){const entered=parseFloat(String(st.value??st.time??'').replace(',','.'));if(entered>0)value=unit==='detik'?entered:entered*60;}
 return Math.max(1,Math.round(value));
}

function prHtml(){const best={},all={};sessions().forEach(s=>{for(const n in (s.log||{}))s.log[n].forEach(x=>{(all[n]=all[n]||[]).push(x);if(!best[n]||x.kg>best[n])best[n]=x.kg})});
 const l=Object.entries(best).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,3);
 return l.length?l.map(x=>`<div class="row"><span>${x[0]}<small class="prev" style="display:block">est. 1RM ${est1(all[x[0]])} kg</small></span><span class="num" style="font-size:22px">${x[1]} kg</span></div>`).join(''):'<p class="empty">PR muncul setelah Anda menyelesaikan satu workout.</p>'}

function prCount(k){const ss=sessions(),s=ss[k];let n=0;for(const nm in (s.log||{})){const m=Math.max(...s.log[nm].map(x=>x.kg));let o=0;for(let i=0;i<k;i++){const l=ss[i].log&&ss[i].log[nm];if(l)l.forEach(x=>{if(x.kg>o)o=x.kg})}if(o>0&&m>o)n++}return n}

function weekRows(){return [1,2,3,4,5,6,0].map(k=>`<div class="row"><span>${HARI[k]}${PROG[k]?' · '+esc(PROG[k].n):''}</span><span class="mute">${PROG[k]?PROG[k].ex.length+' latihan':(k===0?'Istirahat penuh':'Pemulihan')}</span></div>`).join('')}

function profileCard(){const p=prof();
 if(!editP)return `<section class="card"><h2>Profil</h2><div class="row"><span>Nama</span><span>${esc(p.name)||'Belum diisi'}</span></div><div class="row"><span>Tinggi</span><span>${p.height?p.height+' cm':'Belum diisi'}</span></div><div class="row"><span>Berat awal</span><span>${p.startKg?p.startKg+' kg':'Belum diisi'}</span></div><div class="row"><span>Frekuensi</span><span>${p.freq?p.freq+' kali seminggu':'Belum diisi'}</span></div><div class="row"><span>Tujuan</span><span>${esc(p.goal)||'Belum diisi'}</span></div><button class="btn ghost sm" data-ep="1">Edit profil</button></section>`;
 return `<section class="card"><h2>Edit profil</h2><label for="pr_n">Nama</label><input id="pr_n" value="${esc(p.name)}" maxlength="30"><label for="pr_h">Tinggi (cm)</label><input id="pr_h" inputmode="decimal" value="${p.height}"><label for="pr_s">Berat awal (kg)</label><input id="pr_s" inputmode="decimal" value="${p.startKg}"><label for="pr_f">Latihan per minggu</label><input id="pr_f" inputmode="numeric" value="${p.freq}"><label for="pr_g">Tujuan</label><input id="pr_g" value="${esc(p.goal)}" maxlength="60"><div class="f" style="margin-top:14px"><button class="btn ghost" data-pc="1" style="flex:1;margin:0">Batal</button><button class="btn" data-ps="1" style="flex:1;margin:0">Simpan</button></div></section>`}

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

function exTarget(n){for(const k of Object.keys(PROG)){const e=(PROG[k].ex||[]).find(x=>x[0]===n);if(e){const m=String(e[1]||'').match(/×\s*(\d+)–(\d+)/);if(m)return {min:+m[1],max:+m[2],sets:P(e[1]).sets}}}return null}

function prPanel(){
 const d=prData().slice(0,6);
 if(!d.length)return '<section class="card"><h2>Rekor pribadi</h2><p class="empty">Rekor muncul setelah Anda menyelesaikan satu set dengan beban dan repetisi.</p></section>';
 return `<section class="card"><h2>Rekor pribadi</h2><p class="sub">Beban terbaik yang pernah tercatat untuk setiap gerakan.</p><div class="pr-panel">${d.map(x=>`<div class="pr-item"><div class="pr-item-head"><div class="pr-item-name">${esc(x.name)}</div><span class="pr-tag">PR</span></div><div class="pr-item-main"><span class="pr-item-weight">${kf(x.best)} kg</span><span class="pr-item-1rm">est. 1RM ${kf(x.est)} kg</span></div><div class="pr-item-note">${x.reps} reps · ${fmt(x.date)}</div></div>`).join('')}</div><div class="pr-current"><b>Catatan:</b> PR dihitung dari beban kerja yang selesai. Warm-up tidak masuk perhitungan.</div></section>`;
}

function weeklyCoach(ss,mon){
 const cur=ss.filter(x=>x.date>=mon),pm=new Date(mon+'T00:00:00');pm.setDate(pm.getDate()-7);
 const pmi=iso(pm),prev=ss.filter(x=>x.date>=pmi&&x.date<mon);
 if(!cur.length&&!prev.length)return '';
 const vol=a=>a.reduce((t,x)=>t+(+x.volume||0),0),mins=a=>Math.round(a.reduce((t,x)=>t+(+x.minutes||0),0));
 const cv=vol(cur),pv=vol(prev),cd=cv&&pv?Math.round((cv-pv)/pv*100):null;
 const prBest={};prev.forEach(x=>Object.entries(x.log||{}).forEach(([n,v])=>v.forEach(r=>{const k=+r.kg||0;if(k>0)prBest[n]=Math.max(prBest[n]||0,k)})));
 const improvements=[];cur.forEach(x=>Object.entries(x.log||{}).forEach(([n,v])=>v.forEach(r=>{const k=+r.kg||0;if(k>0&&prBest[n]>0&&k>prBest[n])improvements.push({n,k,delta:k-prBest[n]})})));
 const unique={};improvements.forEach(x=>{if(!unique[x.n]||x.delta>unique[x.n].delta)unique[x.n]=x});
 const prs=Object.values(unique).sort((a,b)=>b.delta-a.delta);
 const muscle={};cur.forEach(x=>Object.entries(x.log||{}).forEach(([n,v])=>{const info=exInfo(n),sets=v.filter(r=>(+r.reps||0)>0).length;if(!info)return;info.p.forEach(g=>muscle[g]=(muscle[g]||0)+sets);info.s.forEach(g=>muscle[g]=(muscle[g]||0)+sets*.5)}));
 const focus=Object.keys(MG).filter(g=>(muscle[g]||0)>0).sort((a,b)=>(muscle[a]||0)-(muscle[b]||0)).slice(0,2);
 const freq=+prof().freq||0,consistency=freq?Math.min(100,Math.round(cur.length/freq*100)):null;
 let headline='Pertahankan ritme latihan';
 if(!cur.length)headline='Belum ada latihan minggu ini';
 else if(consistency!==null&&consistency>=100)headline='Target frekuensi tercapai';
 else if(cd!==null&&cd>8)headline='Volume latihan meningkat';
 else if(prs.length)headline='Ada progres kekuatan';
 else if(cd!==null&&cd<-12)headline='Volume latihan menurun';
 const advice=!cur.length?'Mulai dengan sesi berikutnya sesuai program yang sudah dibuat.'
  :consistency!==null&&consistency<75?'Prioritaskan konsistensi sesi sebelum menambah volume atau beban.'
  :focus.length?'Jaga beban utama, lalu beri perhatian pada '+focus.map(g=>MG[g]).join(' dan ')+'.'
  :prs.length?'Pertahankan teknik dan progres bertahap pada gerakan yang mencatat PR.':'Pertahankan pola latihan dan catat beban serta repetisi setiap sesi.';
 const change=cd===null?'Belum cukup data':`${cd>0?'+':''}${cd}% vs minggu lalu`;
 const prLine=prs.length?prs.slice(0,3).map(x=>`<div><span>${esc(x.n)}</span><span>+${kf(x.delta)} kg</span></div>`).join(''):'<div><span>PR baru</span><span>Belum ada</span></div>';
 const focusLine=focus.length?focus.map(g=>`<div><span>${MG[g]}</span><span>${Math.round((muscle[g]||0)*10)/10} set</span></div>`).join(''):'<div><span>Distribusi otot</span><span>Belum cukup data</span></div>';
 return `<section class="card weekly-coach-card" aria-label="Weekly Coach"><div class="weekly-coach-head"><div><h2>Weekly Coach</h2><p class="sub">Evaluasi otomatis berdasarkan data 7 hari terakhir.</p></div><span class="weekly-coach-badge">${headline}</span></div><div class="weekly-coach-grid"><div class="weekly-coach-stat"><small>Sesi</small><strong>${cur.length}</strong><span>${freq?`target ${freq}`:'minggu berjalan'}</span></div><div class="weekly-coach-stat"><small>Volume</small><strong>${cv>=10000?(Math.round(cv/100)/10)+' ton':Math.round(cv).toLocaleString('id-ID')+' kg'}</strong><span>${change}</span></div><div class="weekly-coach-stat"><small>Durasi</small><strong>${mins(cur)} mnt</strong><span>${cur.length?'total minggu ini':'belum ada sesi'}</span></div><div class="weekly-coach-stat"><small>PR</small><strong>${prs.length}</strong><span>${prs.length?'gerakan meningkat':'belum ada peningkatan'}</span></div></div><div class="weekly-coach-body"><div class="weekly-coach-panel"><h3>Insight utama</h3><p>${advice}</p>${cd!==null?`<p class="muted" style="margin-top:7px">Perubahan volume: ${cd>0?'+':''}${cd}% dibanding minggu sebelumnya.</p>`:''}</div><div class="weekly-coach-panel"><h3>Yang perlu diperhatikan</h3><div class="weekly-coach-list">${prLine}${focusLine}</div></div></div></section>`;
}

function weeklyReview(ss,mon){
 const lm=new Date(mon+'T00:00:00');lm.setDate(lm.getDate()-7);const lmi=iso(lm),pm=new Date(lm);pm.setDate(pm.getDate()-7);const pmi=iso(pm),sn=new Date(lm);sn.setDate(sn.getDate()+6);
 if(ls.get('ap_wr',null)===lmi)return '';
 const w=ss.filter(x=>x.date>=lmi&&x.date<mon);if(!w.length)return '';
 const bf=ss.filter(x=>x.date<lmi),pw=ss.filter(x=>x.date>=pmi&&x.date<lmi);
 const vol=w.reduce((t,x)=>t+(x.volume||0),0),pvl=pw.reduce((t,x)=>t+(x.volume||0),0),dv=pvl?Math.round((vol-pvl)/pvl*100):null;
 const mins=Math.round(w.reduce((t,x)=>t+(x.minutes||0),0)),fr=+prof().freq||0;
 const best={};bf.forEach(x=>Object.entries(x.log||{}).forEach(([n,v])=>v.forEach(r=>{if((+r.kg||0)>(best[n]||0))best[n]=+r.kg})));
 const prs={};w.forEach(x=>Object.entries(x.log||{}).forEach(([n,v])=>v.forEach(r=>{if(best[n]>0&&(+r.kg||0)>best[n]&&(+r.kg||0)>(prs[n]||0))prs[n]=+r.kg})));
 const t={};w.forEach(x=>Object.entries(x.log||{}).forEach(([n,v])=>{const f=exInfo(n);if(!f)return;const c=v.filter(r=>(+r.reps)>0).length;f.p.forEach(g=>t[g]=(t[g]||0)+c);f.s.forEach(g=>t[g]=(t[g]||0)+c/2)}));
 const low=Object.keys(t).length?Object.keys(MG).filter(g=>(t[g]||0)<10).sort((a,b)=>(t[a]||0)-(t[b]||0)).slice(0,3):[];
 const f1=x=>String(Math.round(x*2)/2).replace('.',','),vs=vol>=10000?String(Math.round(vol/100)/10).replace('.',',')+'<span class="mute" style="font-size:16px"> ton</span>':Math.round(vol).toLocaleString('id-ID')+'<span class="mute" style="font-size:16px"> kg</span>';
 const pk=Object.entries(prs).sort((a,b)=>b[1]-a[1]),
  prH=pk.length?`<div class="row"><span>PR baru</span><span style="text-align:right">${pk.slice(0,3).map(([n,k])=>esc(n)+' <b>'+kf(k)+' kg</b>').join('<br>')}${pk.length>3?'<br><span class="mute">+'+(pk.length-3)+' lagi</span>':''}</span></div>`:'',
  lowH=low.length?`<div class="row"><span>Kurang dilatih</span><span style="text-align:right">${low.map(g=>MG[g]+' <span class="mute">('+f1(t[g]||0)+' set)</span>').join('<br>')}</span></div>`:'',
  dvH=dv===null?'':` <span class="mute" style="font-size:14px">(${dv>0?'+':''}${dv}%)</span>`;
 return `<section class="card" aria-label="Ringkasan minggu lalu"><h2>Ringkasan minggu lalu</h2><p class="sub">${fmt(lmi)} – ${fmt(iso(sn))}</p><div class="grid"><div class="stat"><div class="num">${w.length}${fr?'<span class="mute" style="font-size:18px">/'+fr+'</span>':''}</div><small>sesi${fr?' dari target':''}</small></div><div class="stat"><div class="num">${vs}</div><small>total volume</small></div><div class="stat"><div class="num">${mins}<span class="mute" style="font-size:16px"> mnt</span></div><small>durasi latihan</small></div></div>${dv!==null?`<div class="row"><span>Volume vs minggu sebelumnya</span><span>${dv>0?'+':''}${dv}%</span></div>`:''}${prH}${lowH}${low.length?'<p class="prev">Fokus minggu ini: tambah 1–2 set untuk otot yang kurang. Target umum 10–20 set per otot.</p>':''}<div class="f"><button class="btn ghost" data-go="progress" style="flex:1">Lihat progres</button><button class="btn ghost" data-wrdis="${lmi}" style="flex:1">Tutup</button></div></section>`}

function weekCmp(ss,mon){const pm=new Date(mon+'T00:00:00');pm.setDate(pm.getDate()-7);const pmi=iso(pm),a=ss.filter(s=>s.date>=mon),b=ss.filter(s=>s.date>=pmi&&s.date<mon);if(!b.length)return '';const va=a.reduce((x,s)=>x+(s.volume||0),0),vb=b.reduce((x,s)=>x+(s.volume||0),0),d=vb?Math.round((va-vb)/vb*100):0;return `<section class="card"><h2>Dibanding minggu lalu</h2><div class="row"><span>Sesi</span><span>${a.length} <span class="mute">(minggu lalu ${b.length})</span></span></div><div class="row"><span>Volume</span><span>${Math.round(va).toLocaleString('id-ID')} kg <span class="mute">(${d>0?'+':''}${d}%)</span></span></div><p class="prev">Minggu ini masih berjalan, jadi angkanya terus bertambah.</p></section>`}

function weekStrip(ss,mon){const N=['Sen','Sel','Rab','Kam','Jum','Sab','Min'],O=[1,2,3,4,5,6,0];
 return `<div class="week" role="group" aria-label="Jadwal minggu ini">${O.map((dw,k)=>{const d=new Date(mon+'T00:00:00');d.setDate(d.getDate()+k);const id=iso(d),dn=ss.some(s=>s.date===id);
  return `<div class="wd ${PROG[dw]?'plan':''} ${dn?'done':''} ${id===todayIso?'now':''}"><i>${dn?'✓':d.getDate()}</i>${N[k]}</div>`}).join('')}</div>`}

function lineChart(pts,u,tv){const w=pts.filter(p=>p.d>=cut()).sort((a,b)=>a.d.localeCompare(b.d));
 if(w.length<2)return '<p class="empty">Belum cukup data pada rentang ini.</p>';
 const W=320,H=150,p=16,vs=w.map(x=>x.v),va=tv?vs.concat(tv):vs,mn=Math.min(...va),r=(Math.max(...va)-mn)||1;
 const pt=w.map((x,i)=>[p+i*(W-2*p)/(w.length-1),H-p-(x.v-mn)/r*(H-2*p)]);
 const id='lg'+(window.__gc=(window.__gc||0)+1),yy=v=>H-p-(v-mn)/r*(H-2*p),ln=pt.map(q=>q.join(',')).join(' '),ar='M'+pt[0][0]+','+(H-p)+' L'+pt.map(q=>q.join(',')).join(' L')+' L'+pt[pt.length-1][0]+','+(H-p)+' Z',dd=Math.round((w[w.length-1].v-w[0].v)*10)/10,dt=(dd>0?'▲ ':dd<0?'▼ ':'• ')+String(Math.abs(dd)).replace('.',',')+' '+u;
 return `<div><span class="dlt">${dt}</span></div><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik garis"><defs><linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F7BFF" stop-opacity=".38"/><stop offset="1" stop-color="#2F7BFF" stop-opacity="0"/></linearGradient><linearGradient id="${id}s" gradientUnits="userSpaceOnUse" x1="${p}" y1="0" x2="${W-p}" y2="0"><stop offset="0" stop-color="#2F7BFF"/><stop offset="1" stop-color="#5eead4"/></linearGradient></defs>${[0,1,2].map(k=>`<line x1="${p}" x2="${W-p}" y1="${p+k*(H-2*p)/2}" y2="${p+k*(H-2*p)/2}" stroke="#26304a" stroke-width="1" stroke-dasharray="2 5"/>`).join('')}${tv?`<line x1="${p}" x2="${W-p}" y1="${yy(tv)}" y2="${yy(tv)}" stroke="#FFB454" stroke-width="1.5" stroke-dasharray="5 4"/>`:''}<path d="${ar}" fill="url(#${id}a)"/><polyline pathLength="1" class="ln" fill="none" stroke="url(#${id}s)" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" points="${ln}"/>${pt.map((q,i)=>`<circle cx="${q[0]}" cy="${q[1]}" r="12" fill="transparent" class="hit" data-tip="${fmt(w[i].d)}: ${w[i].v} ${u}"/>${i===pt.length-1?`<circle cx="${q[0]}" cy="${q[1]}" r="8" fill="#5eead4" fill-opacity=".25" pointer-events="none"/><circle cx="${q[0]}" cy="${q[1]}" r="4.5" fill="#fff" stroke="#5eead4" stroke-width="2" pointer-events="none"/>`:`<circle cx="${q[0]}" cy="${q[1]}" r="3" fill="#6aa2ff" pointer-events="none"/>`}`).join('')}</svg><div class="row mute"><span>${fmt(w[0].d)}: ${w[0].v} ${u}</span><span>${fmt(w[w.length-1].d)}: ${w[w.length-1].v} ${u}</span></div>`}

function barChart(items,u){if(!items.length)return '<p class="empty">Belum ada sesi pada rentang ini.</p>';
 const it=items.slice(-12),W=320,H=150,p=16,mx=Math.max(...it.map(x=>x.v))||1,bw=(W-2*p)/it.length;
 const id='bg'+(window.__gc=(window.__gc||0)+1),bars=it.map((x,i)=>{const h=Math.max(2,x.v/mx*(H-2*p-14));return `<rect x="${p+i*bw+bw*.2}" y="${H-p-h}" width="${bw*.6}" height="${h}" rx="4" fill="url(#${id})" opacity="${i===it.length-1?1:.72}" class="bcol"/><text x="${p+i*bw+bw/2}" y="${H-p-h-4}" font-size="11" text-anchor="middle" fill="#8C97B2">${Math.round(x.v)}</text>`}).join('');
 return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik batang"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5eead4"/><stop offset="1" stop-color="#2F7BFF"/></linearGradient></defs><line x1="${p}" x2="${W-p}" y1="${H-p}" y2="${H-p}" stroke="#26304a"/>${bars}</svg><div class="row mute"><span>Minggu ${fmt(it[0].l)}</span><span>${u}</span></div>`}

function physiqueProgressCard(){
 const B=ls.get('ap_body',[]).slice().sort((a,b)=>a.d.localeCompare(b.d));
 const P=PHOTOS.slice().sort((a,b)=>a.d.localeCompare(b.d));
 const latest=k=>[...B].reverse().find(x=>x[k]!=null), prevVal=k=>{const arr=B.filter(x=>x[k]!=null);return arr.length>1?arr[arr.length-2][k]:null};
 const metric=(k,label,unit,dec=1)=>{const a=latest(k),b=prevVal(k);if(a==null)return `<div class="physique-metric"><small>${label}</small><div class="num">—</div><div class="physique-change">Belum ada data</div></div>`;const d=b!=null?Math.round((a[k]-b)*10)/10:null;const ds=d==null?'Belum ada pembanding':`${d>0?'+':''}${d.toFixed(dec)} ${unit}`;return `<div class="physique-metric"><small>${label}</small><div class="num">${a[k]} ${unit}</div><div class="physique-change ${d>0?'up':d<0?'down':''}">${ds}</div></div>`};
 const snaps=`<div class="physique-snapshot">${metric('kg','Berat badan','kg')}${metric('waist','Pinggang','cm')}${metric('chest','Dada','cm')}${metric('arm','Lengan','cm')}</div>`;
 const photos=P.length?`<div class="photo-timeline">${P.slice(-3).reverse().map(x=>`<figure><img src="${x.img}" alt="Foto progres ${fmt(x.d)}${x.pose?' '+x.pose:''}"><figcaption>${fmt(x.d)}${x.pose?' · '+x.pose:''}</figcaption></figure>`).join('')}</div>`:'<p class="empty">Belum ada foto progres.</p>';
 const photoMeta=P.length?`${P.length} foto tersimpan`:'Belum ada foto';
 return `<section class="card"><div class="hd"><div><h2>Progress physique</h2><p class="sub">Ringkasan perubahan ukuran tubuh dan dokumentasi visual.</p></div><span class="chip">${photoMeta}</span></div>${snaps}<div class="measurement-grid"><div class="card-mini"><h3>Pengukuran terakhir</h3><p class="sub">${B.length?fmt(B[B.length-1].d):'Belum ada pengukuran'}</p><button class="btn ghost sm" data-go="profile">Kelola pengukuran</button></div><div class="card-mini"><h3>Foto progres</h3><p class="sub">Bandingkan perubahan dari waktu ke waktu.</p><button class="btn ghost sm" data-go="profile">Kelola foto</button></div></div>${photos}</section>`;
}

function progressCards(){
 const cnt={};sessions().forEach(x=>Object.keys(x.log||{}).forEach(n=>cnt[n]=(cnt[n]||0)+1));const ex=Object.keys(cnt).sort((p,q)=>cnt[q]-cnt[p]).filter(n=>exPts({test:q=>q===n}).filter(p=>p.d>=cut()).length>=2).slice(0,4).map(n=>`<section class="card"><h2>Beban ${esc(n)}</h2>${lineChart(exPts({test:q=>q===n}),'kg')}</section>`).join('');
 const wk={},cn={};sessions().filter(s=>s.date>=cut()).forEach(s=>{const k=monOf(s.date);wk[k]=(wk[k]||0)+(s.volume||0);cn[k]=(cn[k]||0)+1});
 const ks=Object.keys(wk).sort();
 const nm=[...new Set(sessions().flatMap(s=>Object.keys(s.log||{})))].sort(),xs=nm.includes(xsel)?xsel:nm[0],more=nm.length?`<section class="card"><h2>Gerakan lain</h2><select data-xs="1" aria-label="Pilih gerakan">${nm.map(n=>`<option ${n===xs?'selected':''}>${esc(n)}</option>`).join('')}</select>${lineChart(exPts({test:n=>n===xs}),'kg')}${e1(xs)}</section>`:'';return muscleCard()+(ex+more||'<section class="card"><h2>Beban per gerakan</h2><p class="empty">Grafik muncul setelah Anda mencatat latihan.</p></section>')+`<section class="card"><h2>Volume mingguan</h2>${barChart(ks.map(k=>({l:k,v:wk[k]})),'kg per minggu')}</section><section class="card"><h2>Jumlah sesi gym</h2>${barChart(ks.map(k=>({l:k,v:cn[k]})),'sesi per minggu')}</section>`}

function prevN(n,k){const o=[],q=sessions();for(let i=q.length-1;i>=0&&o.length<k;i--){const l=q[i].log&&q[i].log[n];if(l&&l.length)o.push(l)}return o}

function chart(h){const w=[...weights].sort((a,b)=>a.d.localeCompare(b.d)).slice(-30);
 if(w.length<2)return '<p class="empty">Catat berat badan di dua hari berbeda untuk melihat grafik.</p>';
 const W=320,H=h,p=14,vs=w.map(x=>x.kg),mn=Math.min(...vs)-1,mx=Math.max(...vs)+1;
 const pt=w.map((x,i)=>[p+i*(W-2*p)/(w.length-1),H-p-(x.kg-mn)/(mx-mn)*(H-2*p)]);
 return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik berat badan"><polyline fill="none" stroke="#2F7BFF" stroke-width="3" stroke-linejoin="round" points="${pt.map(q=>q.join(',')).join(' ')}"/>${pt.map((q,i)=>`<circle cx="${q[0]}" cy="${q[1]}" r="12" fill="transparent" class="hit" data-tip="${fmt(w[i].d)}: ${w[i].kg} kg"/><circle cx="${q[0]}" cy="${q[1]}" r="3.5" fill="#6aa2ff" pointer-events="none"/>`).join('')}</svg><div class="row mute"><span>${w[0].kg} kg</span><span>${w[w.length-1].kg} kg</span></div>`}
