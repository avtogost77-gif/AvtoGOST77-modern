// Simple freight cost estimator v1.0
// Uses flat rates just for lead generation; not a public offer.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#freight-calc-form");
  const resultEl = document.querySelector("#freight-calc-result");

  if (!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();

    const type = form.elements["type"].value; // FTL or LTL
    const distance = parseFloat(form.elements["distance"].value) || 0;
    const weight = parseFloat(form.elements["weight"].value) || 0;

    let price = 0;
    if (type === "FTL") {
      // Тарифы за км для разных типов ТС
      const transportRates = {
        gazelle: 30,   // 30₽/км для газели
        threeTon: 40,  // 40₽/км для 3-тонника
        fiveTon: 50,   // 50₽/км для 5-тонника  
        tenTon: 62,    // 62₽/км для 10-тонника
        truck: 70      // 70₽/км для фуры
      };
      
      // Определяем тип ТС по весу (упрощенно)
      let transportType = 'gazelle';
      if (weight > 1500) transportType = 'threeTon';
      if (weight > 3000) transportType = 'fiveTon';
      if (weight > 5000) transportType = 'tenTon';
      if (weight > 10000) transportType = 'truck';
      
      let baseRate = transportRates[transportType] || 30;
      
      // Зональные коэффициенты (чем меньше расстояние, тем дороже)
      let zoneCoeff = 1.0;
      if (distance < 70) {
        zoneCoeff = 1.6;  // Городские - самый высокий
      } else if (distance < 200) {
        zoneCoeff = 1.4;  // Областные - высокий
      } else if (distance < 400) {
        zoneCoeff = 1.3;  // Межрегиональные - повышенный
      } else if (distance < 800) {
        zoneCoeff = 1.1;  // Среднее плечо - небольшая надбавка
      } else {
        zoneCoeff = 1.0;  // Длинное плечо - базовый
      }
      
      price = distance * baseRate * zoneCoeff;
    } else {
      // LTL — тариф за кг*км
      const RATE_PER_KG_KM = 6.5; // ₽
      price = distance * weight * RATE_PER_KG_KM;
    }

    if (isNaN(price) || price <= 0) {
      resultEl.textContent = "Пожалуйста, заполните данные корректно.";
      return;
    }

    const formatted = price.toLocaleString("ru-RU", {
      style: "currency",
      currency: "RUB",
      maximumFractionDigits: 0
    });

    resultEl.innerHTML = `Ориентировочная стоимость: <strong>${formatted}</strong><br/><small>* Цена не является публичной офертой</small>`;

    // send lead to Telegram
    const message = `📦 Новая заявка с сайта\nТип: ${type}\nДистанция: ${distance} км${type === "LTL" ? `\nВес: ${weight} кг` : ""}\nЦена (черновая): ${formatted}`;

    fetch(`https://api.telegram.org/bot79162720932:AAHAnyTyvfteW1WNKpns8w35jl14f0wn5es/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: 399711406, text: message })
    }).catch(() => {/* ignore errors */});

    // open modal and prefill details
    const modal = document.getElementById('lead-modal');
    document.getElementById('lead-details').value = `${type}, ${distance} км, ${type === 'LTL' ? weight + ' кг, ' : ''}ориент. ${formatted}`;

    modal.classList.add('open');
  });
});

// lead form submission
document.addEventListener('DOMContentLoaded', () => {
  const leadForm = document.getElementById('lead-form');
  if (!leadForm) return;
  leadForm.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(leadForm);
    const name = fd.get('name');
    const phone = fd.get('phone');
    const email = fd.get('email');
    const details = fd.get('details');
    const text = `📞 Лид с калькулятора\nИмя: ${name}\nТел: ${phone}\nEmail: ${email}\n${details}`;

    fetch(`https://api.telegram.org/bot79162720932:AAHAnyTyvfteW1WNKpns8w35jl14f0wn5es/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: 399711406, text })
    });
    leadForm.innerHTML = '<p>Спасибо! Мы свяжемся в ближайшее время.</p>';
  });

  // close modal on overlay click
  document.getElementById('lead-modal').addEventListener('click', e => {
    if (e.target.classList.contains('modal-overlay')) {
      e.currentTarget.classList.remove('open');
    }
  });
});
