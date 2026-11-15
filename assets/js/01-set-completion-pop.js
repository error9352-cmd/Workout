/* Athletic Physique — extracted from original index.html script block 2 (line 3302) */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-done]');if(!b)return;const id=b.dataset.done;setTimeout(()=>{const n=document.querySelector('[data-done="'+id+'"]');if(n&&n.closest('.set.done'))n.classList.add('pop')},0)});
