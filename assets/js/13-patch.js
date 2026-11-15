setInterval(()=>{const e=document.getElementById('elp'),a=getA();if(e&&a){const t=Math.floor((Date.now()-a.start)/1000);e.textContent=Math.floor(t/60)+':'+String(t%60).padStart(2,'0')}},1000);
