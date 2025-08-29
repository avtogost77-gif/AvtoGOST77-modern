## ТЗ: правки сайта avtogost77.ru с учетом позиционирования и нулевого бюджета

### Рамки и позиционирование
- **Позиция бренда**: выступаем как перевозчик (есть свой парк: ≥1 ТС) и организатор перевозок без лишней бюрократии. Акцент не на статусе, а на сроках/качестве/цене.
- **Страховки/лицензии**: не продаем и не пушим; не упоминаем лицензии (в РФ упразднены). Коммуникация: «аккуратность и контроль → не доводим до страхового случая».
- **Бюджет**: только free-инструменты. Уже используемые OSRM/OpenRouteService + статическая база и haversine оставляем.

---

## Глобальные технические правки (везде)
1) Стили
- Удалить дубли `<style id="critical-css">`; оставить один блок.
- Свести head к 1 критическому CSS + 1 объединенному стилю (остальные preload → `rel='stylesheet'` без дублей).

2) JSON-LD (максимум 3 сущности на страницу)
- `Organization` (или `LocalBusiness` на контактах) — единый `@id: https://avtogost77.ru/#org`, одинаковый на всех страницах.
- `Service` — 1 на услугу/гео-страницу; `provider` → `{"@id":"https://avtogost77.ru/#org"}`. Не вкладывать `Service` внутрь `provider`.
- `BreadcrumbList` — 1 на страницу.
- Не указывать строковые «цены» в `price` (только числа). Если нет точных — используйте `AggregateOffer` с `lowPrice/highPrice` или пропускайте цены.

3) Изображения
- Заполнить осмысленный `alt` у всех `<img>`.
- У hero-картинок добавить `width/height` для снижения CLS.
- Исправить битый тег `img` на `sbornye-gruzy.html` (см. ниже).

4) Формы/защита
- Внедрить хонипот (скрытое поле) + базовая валидация `required/min/max`.
- Капчи платные не используем. При желании — Cloudflare Turnstile (free), но не обязательно.
- Дисклеймер: «Расчет предварительный. Точная цена после уточнения параметров».

5) FAQ
- Добавить блок FAQ + JSON‑LD FAQ на ключевых сервисных/гео/статейных страницах (примеры ниже).

6) Аналитика (безопасные цели)
- Навешивать цели только при наличии счетчиков, с проверками `typeof ym === 'function'` и `typeof gtag === 'function'`.

---

## Калькулятор: интеграция и поведение (сохранить текущую «сложную» логику)

Основа в репо:
- Движок: `assets/js/smart-calculator-v2.js` (использовать его, не упрощать).
- Дистанции: `assets/js/distance-api.js` (OSRM + ORS + статик + haversine).
- UI-обвязки: `assets/js/calculator-ui*.js` и/или `calc-v2-enhanced.js`.

Ключевые правила из SmartCalculatorV2 (подтверждено в коде):
- Межрегиональные доплаты по типам ТС (руб/км): `gazelle 30`, `threeTon 40`, `fiveTon 50`, `tenTon 62`, `truck 70`.
- Базовые ставки по плечам: `35/28/22/18/15 ₽/км` для диапазонов 0–200/200–300/300–500/500–800/800+.
- Переходная зона после 70 км локальных: kmRates `20/25/35/45/60` по ТС.
- Жесткие минималки по ТС для коротких плеч.
- Коэффициенты: загрузки (вес/объем), маршрута (популярные −10%, обратка −5%), зоны (1.6/1.4/1.3/1.1/1.0/1.05).
- Сборные: только межрегионально, −25%, для фуры запрещено.
- Внутри одного региона — только FTL (с возвращением `alternativePrice`).

Требования к инициализации (унификация, чтобы не падать в fallback):
- Гарантированная загрузка `distance-api.js` → затем `smart-calculator-v2.min.js`.
- Создать `window.distanceAPI = new DistanceAPI()` и `window.smartCalculatorV2 = new SmartCalculatorV2()` если они не созданы ранее.
- Поддержать разные ID форм на страницах: `from|fromCity`, `to|toCity`, `weight|cargoWeight`, `volume|cargoVolume`, `cargoType`.

Заменить содержимое `assets/js/calculator.js` на улучшенную совместимую версию:

```javascript
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
```

Примечания:
- Этот слой гарантирует загрузку OSRM/ORS через `DistanceAPI` и запуск вашего сложного движка; fallback остается запасным вариантом.
- Поддерживает разные ID полей на страницах.
- Добавляет дисклеймер и безопасные аналитические вызовы можно навесить на submit.

---

## Постраничные правки

### 1) Главная `/index.html`
- Удалить дубли `<style id="critical-css">`, сократить head-подключения.
- Внизу добавить FAQ + JSON‑LD FAQ (пример ниже).
- Проверить: единый `Organization` и один `BreadcrumbList`.

### 2) `services.html`
- Удалить дубль `BreadcrumbList` (оставить один).
- JSON‑LD: `Service` (или `AggregateOffer`), `provider` → `{"@id":"https://avtogost77.ru/#org"}`.
- Цены в JSON‑LD — только числовые; при «от …» указывать в описании или `lowPrice/highPrice`.

### 3) `contact.html`
- Оставить один `LocalBusiness` (или `Organization`); второй удалить.
- Проверить закрывающие скобки/запятые в JSON‑LD.
- В форму добавить хонипот.

### 4) `sbornye-gruzy.html`
- Исправить битый `img` в hero (пример):

```html
<picture>
  <source media="(max-width: 768px)" srcset="assets/img/hero-logistics-mobile.webp">
  <source media="(max-width: 1024px)" srcset="assets/img/hero-logistics-tablet.webp">
  <img src="assets/img/hero-logistics.webp" alt="Сборные грузы по России" loading="eager" width="1200" height="600">
</picture>
```

- JSON‑LD: убрать висящие запятые/фрагменты, не использовать строковые `price` типа «по запросу» — либо удалить `price`, либо `AggregateOffer` без чисел.
- Добавить mini‑FAQ снизу.

### 5) `gruzoperevozki-spb.html`
- Проверить единичность критического CSS/подключений.
- Калькулятор работает через SmartCalculatorV2/DistanceAPI; добавить FAQ.

### 6) `gruzoperevozki-ekaterinburg.html`
- JSON‑LD: исправить фрагментацию (отдельный `BreadcrumbList`, отдельный `Service`).
- Добавить FAQ; проверить alt у изображений.

### 7) `gruzoperevozki-moskva-omsk.html`
- Исправить расстояние (подставлять из `DistanceAPI.getDistance('Москва','Омск')` при загрузке — отобразить в `#distanceDisplay`).
- Исправить опечатку «Омскю» → «Омск».
- Убедиться, что расчет идет через SmartCalculatorV2 (а не простой fallback).

Пример вставки для расстояния на загрузке страницы:

```html
<script>
document.addEventListener('DOMContentLoaded', async function(){
  try{
    if (!window.distanceAPI && typeof DistanceAPI==='function') window.distanceAPI=new DistanceAPI();
    const km = await (window.distanceAPI?.getDistance('Москва','Омск'));
    if (km && document.getElementById('distanceDisplay')) document.getElementById('distanceDisplay').textContent = `${km} км`;
  }catch(e){}
});
</script>
```

### 8) `moscow-spb-delivery.html`
- Заменить meta‑refresh на серверный 301.

Nginx:

```nginx
location = /moscow-spb-delivery.html { return 301 https://avtogost77.ru/gruzoperevozki-spb.html; }
```

Apache (.htaccess):

```apache
Redirect 301 /moscow-spb-delivery.html https://avtogost77.ru/gruzoperevozki-spb.html
```

### 9) `blog-3-spot-orders.html` и `blog/`
- CTA кнопки привязать к реальной форме/попапу (якорь `#calculator` или inline форма).
- Добавить FAQ JSON‑LD в конец статьи.
- На списке блога — уникальные превью и `alt`, больше внутренних ссылок на сервисы/гео.

---

## Готовые блоки для вставки

### Единый Organization (head, на всех страницах)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://avtogost77.ru/#org",
  "name": "АвтоГОСТ",
  "url": "https://avtogost77.ru/",
  "logo": "https://avtogost77.ru/assets/img/logo.svg",
  "telephone": "+7 916 272-09-32",
  "email": "avtogost77@gmail.com",
  "address": { "@type": "PostalAddress", "addressLocality": "Москва", "addressCountry": "RU" }
}
</script>
```

### Service (пример для СПб)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://avtogost77.ru/gruzoperevozki-spb.html#service",
  "serviceType": "Грузоперевозки Санкт-Петербург",
  "provider": { "@id": "https://avtogost77.ru/#org" },
  "description": "Грузоперевозки СПб. Доставка 1–2 дня. Подача от 2 часов.",
  "areaServed": [ {"@type":"City","name":"Санкт-Петербург"}, {"@type":"City","name":"Москва"}, {"@type":"Country","name":"Россия"} ],
  "offers": { "@type": "AggregateOffer", "priceCurrency": "RUB", "lowPrice": "8000", "highPrice": "30000" }
}
</script>
```

### BreadcrumbList (пример)
```html
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"BreadcrumbList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"name":"Главная","item":"https://avtogost77.ru/"},
    {"@type":"ListItem","position":2,"name":"Санкт-Петербург","item":"https://avtogost77.ru/gruzoperevozki-spb.html"}
  ]
}
</script>
```

### FAQ JSON‑LD (минимум 3 Q/A)
```html
<script type="application/ld+json">
{
  "@context":"https://schema.org",
  "@type":"FAQPage",
  "mainEntity":[
    {"@type":"Question","name":"Сколько стоит доставка Москва—СПб?","acceptedAnswer":{"@type":"Answer","text":"Ориентир от 8 000 ₽. Точная цена зависит от типа ТС, веса и сроков."}},
    {"@type":"Question","name":"Сколько идет груз?","acceptedAnswer":{"@type":"Answer","text":"Обычно 1–2 дня. Срочно — отдельной машиной."}},
    {"@type":"Question","name":"Можно без складов по пути?","acceptedAnswer":{"@type":"Answer","text":"Да, отправляем напрямую в уходящем транспорте."}}
  ]
}
</script>
```

### Хонипот для форм
```html
<form id="leadForm" onsubmit="return guardSpam()">
  <div style="position:absolute;left:-9999px;">
    <label>Ваш сайт</label>
    <input type="text" name="website" tabindex="-1" autocomplete="off">
  </div>
  <!-- остальные поля -->
</form>
<script>
function guardSpam(){const hp=document.querySelector('input[name="website"]');return !(hp&&hp.value.trim()!=='');}
</script>
```

### Аналитика: безопасные цели (опционально)
```html
<script>
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('a[href^="tel:"]').forEach(function(el){
    el.addEventListener('click', function(){
      if (typeof ym==='function') ym(103413788,'reachGoal','phone_click');
      if (typeof gtag==='function') gtag('event','phone_click');
    });
  });
  document.querySelectorAll('a[href*="wa.me"]').forEach(function(el){
    el.addEventListener('click', function(){
      if (typeof ym==='function') ym(103413788,'reachGoal','whatsapp_click');
      if (typeof gtag==='function') gtag('event','whatsapp_click');
    });
  });
});
</script>
```

---

## Редиректы
- `moscow-spb-delivery.html` → `gruzoperevozki-spb.html` только серверным 301 (см. конфиги выше). Если временно нет доступа к серверу — оставить `noindex,follow` + canonical на новый URL (но цель — 301).

---

## Копирайтинг (точечные правки)
- «Организуем перевозки без бюрократии: один менеджер, быстрый подбор ТС, контроль 24/7».
- Без продаж страхования; без упоминаний лицензий.
- Блок «Лично на связи»: имя/телефон/мессенджеры, SLA ответа 5 минут.
- Дисклеймер цены: «Расчет предварительный. Точная цена — после уточнения параметров».

---

## Чек‑лист внедрения
- [ ] Удалить дубли `critical-css` и сократить head-подключения на всех страницах.
- [ ] Привести JSON‑LD к трем сущностям; проверить валидаторами (Rich Results, Schema).
- [ ] Исправить `gruzoperevozki-moskva-omsk.html` (расстояние динамически, опечатка «Омск»).
- [ ] Добавить FAQ JSON‑LD на `services`, `sbornye-gruzy`, `gruzoperevozki-spb`, `gruzoperevozki-ekaterinburg`, `blog-3-spot-orders`.
- [ ] Исправить битый `<img>` на `sbornye-gruzy.html`; проверить `alt` везде.
- [ ] Обновить `assets/js/calculator.js` на версию 2.1.0 (выше).
- [ ] Настроить 301 редирект `moscow-spb-delivery.html`.

---

## Тест‑план (короткий)
- Калькулятор: проверить 5 маршрутов (Москва–СПб, Москва–Екатеринбург, Москва–Омск, локальный ≤70 км, переходная зона 70–200 км). Сверить, что:
  - расстояние подставляется корректно (OSRM/ORS/статик/haversine),
  - 10т → доплата 62 ₽/км, фура → 70 ₽/км учитываются на межрегиональных,
  - сборные недоступны внутри региона; фура не рассчитывается как сборная,
  - минималки/зональные коэффициенты применяются.
- SEO: валидаторы JSON‑LD зелёные; на страницах нет дублей `critical-css`.
- Редирект: 301 работает, `moscow-spb-delivery.html` не индексируется.

