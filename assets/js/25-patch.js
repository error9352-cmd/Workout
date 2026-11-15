(function(){
  let locked=false, y=0;
  const sync=()=>{
    const open=!!document.querySelector('.schedule-recommendation-modal');
    if(open && !locked){
      y=window.scrollY||window.pageYOffset||0;
      document.documentElement.style.setProperty('--modal-lock-y',(-y)+'px');
      document.body.classList.add('modal-lock');
      locked=true;
    }else if(!open && locked){
      document.body.classList.remove('modal-lock');
      document.documentElement.style.removeProperty('--modal-lock-y');
      locked=false;
      window.scrollTo(0,y);
    }
  };
  const mo=new MutationObserver(sync);
  mo.observe(document.body,{childList:true});
  sync();
})();
