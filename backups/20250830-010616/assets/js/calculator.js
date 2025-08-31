// Calculator.js - совместимость с SmartCalculatorV2 (улучшено)
// Версия: 2.1.0
(function () {
  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src*="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src; s.async = true; s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  function getByIds(ids) { for (const id of ids) { const el = document.getElementById(id); if (el) return el; } return null; }
  function getFormData() {
    const fromEl = getByIds(['from','fromCity']);
    const toEl = getByIds(['to','toCity']);
    const wEl = getByIds(['weight','cargoWeight']);
    const vEl = getByIds(['volume','cargoVolume']);
    const typeEl = getByIds(['cargoType']);
    return {
      from: (fromEl?.value||'').trim(),
      to: (toEl?.value||'').trim(),
      weight: parseFloat(wEl?.value||'0'),
      volume: parseFloat(vEl?.value||'0'),
      cargoType: (typeEl?.value||'general').trim()
    };
  }
  function createResultDiv(){const d=document.createElement('div');d.id='calculatorResult';d.className='calculator-result';const f=document.getElementById('calculatorForm'); if(f&&f.parentNode){f.parentNode.insertBefore(d,f.nextSibling)}else{document.querySelector('.calculator-section,#calculator')?.appendChild(d)};return d}
  function showSmartResult(result){const wrap=document.getElementById('calculatorResult')||createResultDiv();const priceStr=(result?.price||0).toLocaleString('ru-RU');const transport=result?.transport||'-';const time=result?.deliveryTime||'-';const distance=result?.distance?`${result.distance} км`:'—';wrap.innerHTML=`<div class="calc-success"><h3>🎯 Расчет готов!</h3><div class="price-block"><div class="price-main"><span class="price-label">Стоимость перевозки:</span><span class="price-value">${priceStr} ₽</span></div><div class="price-info"><p>🚚 ${transport}</p><p>📏 ${distance}</p><p>📅 ${time}</p></div></div><div class="cta-buttons"><button class="btn btn-primary btn-lg" onclick="window.location.href='contact.html'">📝 Оставить заявку</button><button class="btn btn-secondary" onclick="window.location.href='tel:+79162720932'">📞 +7 (916) 272-09-32</button></div><div class="disclaimer"><p><small>* Окончательная стоимость подтверждается менеджером</small></p></div></div>`;wrap.style.display='block';wrap.scrollIntoView({behavior:'smooth',block:'center'})}
  function attachAnchorLinks(){document.querySelectorAll('a[href*="calculator"]').forEach(l=>{l.addEventListener('click',e=>{e.preventDefault();if(location.pathname==='/'||location.pathname==='/index.html'){document.querySelector('#calculator,.calculator-section')?.scrollIntoView({behavior:'smooth'})}else{location.href='/index.html#calculator'}})})}
  function initFallback(){const f=document.getElementById('calculatorForm'); if(!f) return; f.addEventListener('submit',e=>{e.preventDefault();const {from,to,weight}=getFormData(); if(!from||!to||!weight){alert('Заполните города и вес груза!');return;}const base= weight<=1500?10000: weight<=3000?13000: weight<=5000?20000: weight<=10000?24000:28000; showSmartResult({price:base,transport: weight<=1500?'Газель': weight<=3000?'3-тонник': weight<=5000?'5-тонник': weight<=10000?'10-тонник':'Фура 20т',deliveryTime:'1-2 дня',distance:null});})}
  async function init(){attachAnchorLinks();try{await loadScriptOnce('assets/js/distance-api.js');await loadScriptOnce('assets/js/smart-calculator-v2.min.js'); if(!window.distanceAPI&&typeof DistanceAPI==='function'){window.distanceAPI=new DistanceAPI();} if(!window.smartCalculatorV2&&typeof SmartCalculatorV2==='function'){window.smartCalculatorV2=new SmartCalculatorV2();}}catch(e){initFallback();return;} const form=document.getElementById('calculatorForm'); if(form&&window.smartCalculatorV2){form.addEventListener('submit',async e=>{e.preventDefault();const btn=form.querySelector('button[type="submit"],.btn.btn-primary');const t=btn?btn.innerHTML:null; if(btn){btn.disabled=true;btn.innerHTML='<span class="btn-loading">Рассчитываем...</span>'} try{const {from,to,weight,volume,cargoType}=getFormData(); if(!from||!to||!weight){alert('Заполните города и вес груза!');return;} const result=await window.smartCalculatorV2.calculatePrice(from,to,weight,volume,cargoType); showSmartResult(result);}catch(err){initFallback();}finally{if(btn){btn.disabled=false;btn.innerHTML=t||'Рассчитать'}}})}else{initFallback()}}
  document.addEventListener('DOMContentLoaded',init);
})();
