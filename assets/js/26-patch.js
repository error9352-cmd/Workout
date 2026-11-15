(function(){
  let locked=false, y=0;
  const sync=()=>{
    const open=!!document.querySelector('.sheetbg');
    if(open && !locked){
      y=window.scrollY||window.pageYOffset||0;
      document.documentElement.style.setProperty('--modal-lock-y',(-y)+'px');
      document.documentElement.classList.add('modal-open');
      document.body.classList.add('modal-open');
      locked=true;
    }else if(!open && locked){
      document.documentElement.classList.remove('modal-open');
      document.body.classList.remove('modal-open');
      document.documentElement.style.removeProperty('--modal-lock-y');
      locked=false;
      requestAnimationFrame(()=>window.scrollTo(0,y));
    }
  };
  const mo=new MutationObserver(sync);
  mo.observe(document.body,{childList:true,subtree:true});
  sync();
})();
