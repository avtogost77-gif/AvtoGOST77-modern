document.addEventListener('DOMContentLoaded',()=>{
 const bar=document.querySelector('.sticky-bar');
 if(!bar) return;
 let lastY=window.scrollY;
 window.addEventListener('scroll',()=>{
  const y=window.scrollY;
  if(y>100 && y>lastY){bar.classList.add('hide');}
  else{bar.classList.remove('hide');}
  lastY=y;
 });
});