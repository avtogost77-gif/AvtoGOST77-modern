# 🔧 ТЕХНИЧЕСКОЕ ЗАДАНИЕ ДЛЯ DEFAULT

## 📋 ЗАДАЧА: Реализовать форму лидов с промокодом и таймером

### 1️⃣ ПОЛЕ ОБЪЕМА В КАЛЬКУЛЯТОРЕ

**Добавить в index.html после поля веса:**
```html
<div class="form-group">
    <label for="volume">Объем груза, м³ (необязательно)</label>
    <input type="number" 
           id="volume" 
           name="volume" 
           placeholder="Укажите если знаете объем"
           min="0" 
           step="0.1">
    <small class="form-text text-muted">
        Оставьте пустым для автоматического расчета
    </small>
</div>
```

### 2️⃣ ФОРМА ЛИДОВ ПОСЛЕ РАСЧЕТА

**Структура:**
```html
<div id="leadFormModal" class="modal" style="display: none;">
    <div class="modal-content">
        <h2>📊 ВАШ РАСЧЕТ ГОТОВ!</h2>
        
        <div class="price-block">
            <p class="original-price">Стоимость перевозки: <span id="originalPrice"></span> ₽</p>
            
            <div class="promo-block">
                <h3>🎁 ПЕРСОНАЛЬНАЯ СКИДКА 10%</h3>
                <p>Промокод: <strong>GOST10</strong></p>
                <p class="new-price">Ваша цена: <span id="discountPrice"></span> ₽</p>
                <p class="savings">Экономия: <span id="savings"></span> ₽</p>
            </div>
            
            <div class="timer-block">
                <p>⏰ ПРОМОКОД СГОРАЕТ ЧЕРЕЗ:</p>
                <div id="countdown" class="countdown">14:59</div>
            </div>
        </div>
        
        <form id="leadForm">
            <h3>Куда отправить детали расчета и промокод?</h3>
            
            <input type="text" name="name" placeholder="Ваше имя*" required>
            <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" required>
            <input type="email" name="email" placeholder="Email (необязательно)">
            
            <button type="submit" class="cta-button pulse">
                🔥 ЗАФИКСИРОВАТЬ СКИДКУ
            </button>
            
            <div class="form-notes">
                <p>✓ Менеджер перезвонит в течение 5 минут</p>
                <p>✓ Промокод будет продлен еще на 24 часа</p>
            </div>
        </form>
    </div>
</div>
```

### 3️⃣ JAVASCRIPT ФУНКЦИОНАЛ

**В smart-calculator-v2.js добавить:**
```javascript
// После расчета показываем форму
function showLeadForm(price) {
    const originalPrice = price;
    const discountPrice = Math.round(price * 0.9);
    const savings = originalPrice - discountPrice;
    
    // Заполняем данные
    document.getElementById('originalPrice').textContent = originalPrice.toLocaleString();
    document.getElementById('discountPrice').textContent = discountPrice.toLocaleString();
    document.getElementById('savings').textContent = savings.toLocaleString();
    
    // Показываем модалку
    document.getElementById('leadFormModal').style.display = 'block';
    
    // Запускаем таймер
    startCountdown();
    
    // Сохраняем данные расчета
    window.calculationData = {
        from: document.getElementById('fromCity').value,
        to: document.getElementById('toCity').value,
        weight: document.getElementById('weight').value,
        volume: document.getElementById('volume').value || 'Не указан',
        originalPrice: originalPrice,
        discountPrice: discountPrice,
        promoCode: 'GOST10'
    };
}

// Таймер обратного отсчета
function startCountdown() {
    let timeLeft = 15 * 60; // 15 минут в секундах
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        document.getElementById('countdown').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Мигание при < 5 минут
        if (timeLeft < 300) {
            document.getElementById('countdown').classList.add('urgent');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('countdown').textContent = 'Время истекло!';
            // Можно добавить логику деактивации промокода
        }
        
        timeLeft--;
    }, 1000);
}
```

### 4️⃣ ОБРАБОТКА ФОРМЫ

**В form-handler.js:**
```javascript
document.getElementById('leadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        ...Object.fromEntries(formData),
        ...window.calculationData,
        timestamp: new Date().toISOString()
    };
    
    // Отправка в Telegram
    await sendToTelegram(data);
    
    // Показываем успех
    alert('Спасибо! Менеджер свяжется с вами в течение 5 минут.');
    
    // Закрываем модалку
    document.getElementById('leadFormModal').style.display = 'none';
});
```

### 5️⃣ CSS СТИЛИ

**Добавить в main.css:**
```css
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}

.countdown {
    font-size: 48px;
    font-weight: bold;
    color: #e74c3c;
    text-align: center;
    margin: 20px 0;
}

.countdown.urgent {
    animation: blink 1s infinite;
}

@keyframes blink {
    50% { opacity: 0.5; }
}

.cta-button.pulse {
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
}

.original-price {
    text-decoration: line-through;
    color: #999;
}

.new-price {
    font-size: 24px;
    color: #27ae60;
    font-weight: bold;
}
```

### 6️⃣ ДОПОЛНИТЕЛЬНЫЕ ТРИГГЕРЫ

**Exit-intent popup (при попытке уйти):**
```javascript
document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && !window.exitIntentShown) {
        window.exitIntentShown = true;
        // Показать упрощенную форму
    }
});
```

### ✅ ЧЕКЛИСТ ДЛЯ ПРОВЕРКИ

- [ ] Поле объема добавлено и работает
- [ ] Форма появляется после расчета
- [ ] Таймер отсчитывает 15 минут
- [ ] Данные отправляются в Telegram
- [ ] Мобильная версия адаптивна
- [ ] Exit-intent работает

**ВАЖНО:** Все тексты взять из файла `LEAD-FORM-TEXTS.md`