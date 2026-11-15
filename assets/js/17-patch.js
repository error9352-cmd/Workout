document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-img]');if(!b)return;const s=sessions()[+b.dataset.img];if(!s)return;
const cs=getComputedStyle(document.documentElement),a1=cs.getPropertyValue('--a1').trim()||'#20c8ff',a2=cs.getPropertyValue('--a2').trim()||'#2478ff',BF='Barlow,Arial,sans-serif',HF='700 112px "Barlow Condensed","Arial Narrow",sans-serif';
const c=document.createElement('canvas');c.width=1080;c.height=1350;const g=c.getContext('2d');
/* premium dark workout poster */
const bg=g.createLinearGradient(0,0,1080,1350);bg.addColorStop(0,'#050914');bg.addColorStop(.52,'#091225');bg.addColorStop(1,'#111c35');g.fillStyle=bg;g.fillRect(0,0,c.width,c.height);
/* subtle contour lines */
g.save();g.globalAlpha=.16;g.strokeStyle='#4b6eaa';g.lineWidth=2;for(let i=0;i<12;i++){g.beginPath();g.moveTo(-80,110+i*105);g.bezierCurveTo(250,30+i*100,520,250+i*70,1160,80+i*95);g.stroke()}g.restore();
/* corner accents */
g.fillStyle=a1;g.beginPath();g.moveTo(0,0);g.lineTo(155,0);g.lineTo(0,155);g.closePath();g.fill();g.fillStyle='#0b1730';g.beginPath();g.moveTo(0,38);g.lineTo(115,0);g.lineTo(0,115);g.closePath();g.fill();
g.fillStyle=a2;g.globalAlpha=.9;g.fillRect(0,0,1080,8);g.globalAlpha=1;
/* top brand mark */
g.fillStyle=a1;g.font='800 42px '+BF;g.fillText('ATHLETIC',70,86);g.fillStyle='#eef4ff';g.font='800 42px '+BF;g.fillText('PHYSIQUE',70,128);
/* title */
g.fillStyle='#f7f9ff';g.font=HF;let title=s.name||'Workout';if(title.length>18) title=title.slice(0,18)+'…';g.fillText(title,70,265);
g.fillStyle='#91a5c9';g.font='500 38px '+BF;g.fillText(fmt(s.date),70,320);
/* three stats */
const stats=[[s.minutes||0,'menit'],[Math.round(s.volume||0).toLocaleString('id-ID'),'kg volume'],[Object.values(s.log||{}).reduce((x,v)=>x+v.length,0),'set']];
const sx=[70,395,730];stats.forEach((x,i)=>{g.fillStyle='#f5f8ff';g.font='800 86px "Barlow Condensed","Arial Narrow",sans-serif';g.fillText(String(x[0]),sx[i],470);g.fillStyle='#91a5c9';g.font='500 32px '+BF;g.fillText(x[1],sx[i],510)});
/* separator */
g.strokeStyle='rgba(115,151,207,.34)';g.lineWidth=2;g.beginPath();g.moveTo(70,560);g.lineTo(1010,560);g.stroke();g.fillStyle=a1;g.beginPath();g.moveTo(500,552);g.lineTo(540,552);g.lineTo(520,575);g.lineTo(480,575);g.closePath();g.fill();
/* exercises */
const entries=Object.entries(s.log||{}).slice(0,6);entries.forEach(([n,v],i)=>{const y=650+i*92;const best=v.reduce((m,x)=>{const val=(parseFloat(String(x.kg).replace(',','.'))||0);return val>(m.val||0)?{x,val}:m},{val:0}).x||v[0]||{};g.fillStyle='#0d1930';g.strokeStyle='rgba(95,137,202,.32)';g.lineWidth=2;g.beginPath();g.roundRect(54,y-45,972,70,18);g.fill();g.stroke();g.fillStyle='#f2f6ff';g.font='600 34px '+BF;g.textAlign='left';g.fillText(n.length>25?n.slice(0,24)+'…':n,82,y);let val=best.mode==='time'?(best.value??best.time??'')+' '+(best.unit||'menit'):best.mode==='bodyweight'?(best.reps||0)+' reps':(best.kg||0)+' kg × '+(best.reps||0);g.fillStyle=a1;g.font='800 32px '+BF;g.textAlign='right';g.fillText(val,990,y)});
/* footer */
g.textAlign='left';g.fillStyle='#8fa2c4';g.font='500 30px '+BF;g.fillText('WORKOUT SUMMARY',70,1245);g.fillStyle='#eef4ff';g.font='700 34px '+BF;g.fillText('Athletic Physique',70,1290);
/* corner badge */
g.fillStyle='rgba(21,37,68,.88)';g.strokeStyle='rgba(79,163,255,.45)';g.lineWidth=2;g.beginPath();g.roundRect(805,1195,205,72,18);g.fill();g.stroke();g.fillStyle=a1;g.font='800 28px '+BF;g.textAlign='center';g.fillText('TRAINING LOG',907,1240);g.textAlign='left';
c.toBlob(async bl=>{const f=new File([bl],'workout-card.png',{type:'image/png'});try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f]});return}}catch(err){if(err&&err.name==='AbortError')return}
const o=document.createElement('div');o.className='sheetbg';o.innerHTML='<div class="sheet history-card-sheet"><div class="grab"></div><h2>Kartu workout</h2><p class="sub">Tekan lama gambar, lalu pilih Simpan ke Foto.</p><img alt="Kartu hasil workout"><button class="btn" id="imx">Tutup</button></div>';const im=o.querySelector('img');im.src=c.toDataURL('image/png');const x=()=>o.remove();o.onclick=ev=>{if(ev.target===o)x()};o.querySelector('#imx').onclick=x;document.body.appendChild(o)},'image/png')});
