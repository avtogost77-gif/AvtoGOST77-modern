document.addEventListener('DOMContentLoaded',()=>{
 const range=document.getElementById('benefit-range');
 const out=document.getElementById('benefit-output');
 if(!range||!out) return;
 function calc(){
  const v=parseInt(range.value||0,10);
  const saving=Math.min(10+0.8*v,30);
  out.innerHTML=`Ваш объём: <strong>${v} рейсов/мес</strong> &nbsp;→ экономия до <strong>${saving.toFixed(0)} %</strong>`;
 }
 range.addEventListener('input',calc);
 calc();
});