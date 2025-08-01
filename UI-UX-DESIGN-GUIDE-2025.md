# 🎨 UI/UX DESIGN GUIDE АВТОГОСТ 2025

## 🎯 ДИЗАЙН-ФИЛОСОФИЯ

### Основной принцип:
> **"Невидимая эффективность"** - интерфейс должен работать так же незаметно, как и сама логистика

### Ключевые концепции:
1. **Zero Friction** - минимум кликов до результата
2. **Trust by Design** - доверие через дизайн
3. **Mobile First** - мобильные приоритетнее десктопа
4. **AI Native** - интерфейс под голосовое управление
5. **Emotional Connection** - эмоциональная связь с брендом

## 🎨 ВИЗУАЛЬНЫЙ СТИЛЬ

### Цветовая палитра:
```css
:root {
  /* Основные цвета */
  --primary: #2c5aa0;        /* Синий АвтоГОСТ */
  --primary-dark: #1e3d6f;   /* Темный синий */
  --primary-light: #4a7cc2;  /* Светлый синий */
  
  /* Акцентные цвета */
  --accent: #00d4aa;         /* Бирюзовый (успех) */
  --accent-warm: #ff6b35;    /* Оранжевый (CTA) */
  --danger: #dc3545;         /* Красный (ошибки) */
  --warning: #ffc107;        /* Желтый (предупреждения) */
  
  /* Градиенты */
  --gradient-primary: linear-gradient(135deg, #2c5aa0 0%, #00d4aa 100%);
  --gradient-hero: linear-gradient(180deg, rgba(44,90,160,0.9) 0%, rgba(0,212,170,0.7) 100%);
  --gradient-glass: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  
  /* Нейтральные */
  --white: #ffffff;
  --gray-100: #f8f9fa;
  --gray-200: #e9ecef;
  --gray-300: #dee2e6;
  --gray-400: #ced4da;
  --gray-500: #adb5bd;
  --gray-600: #6c757d;
  --gray-700: #495057;
  --gray-800: #343a40;
  --gray-900: #212529;
  --black: #000000;
}
```

### Типографика:
```css
/* Шрифты */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-display: 'Montserrat', 'Inter', sans-serif;
--font-mono: 'JetBrains Mono', 'Consolas', monospace;

/* Размеры */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */

/* Высота строки */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Эффекты и анимации:
```css
/* Glassmorphism */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

/* Neumorphism (для калькулятора) */
.neumorphic {
  background: linear-gradient(145deg, #e6e6e6, #ffffff);
  box-shadow: 20px 20px 60px #d1d1d1, -20px -20px 60px #ffffff;
  border-radius: 20px;
}

/* Микроанимации */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

## 📱 КОМПОНЕНТЫ UI

### 1. Hero Section с AI:
```html
<section class="hero-ai">
  <div class="hero-content">
    <h1 class="hero-title gradient-text">
      Пока вы создаете — мы доставляем
    </h1>
    
    <!-- AI Voice Input -->
    <div class="ai-input-container glass">
      <div class="ai-listening-indicator">
        <span class="pulse-dot"></span>
        <span class="listening-text">Скажите, что нужно перевезти...</span>
      </div>
      <button class="voice-button">
        <svg class="microphone-icon">...</svg>
      </button>
    </div>
    
    <!-- Quick Actions -->
    <div class="quick-actions">
      <button class="quick-btn" data-action="calculate">
        <span class="icon">🧮</span>
        <span>Калькулятор</span>
      </button>
      <button class="quick-btn" data-action="urgent">
        <span class="icon">🚨</span>
        <span>Срочно</span>
      </button>
      <button class="quick-btn" data-action="marketplace">
        <span class="icon">📦</span>
        <span>На маркетплейс</span>
      </button>
    </div>
  </div>
  
  <!-- Animated Background -->
  <div class="hero-bg">
    <div class="floating-truck">🚛</div>
    <div class="road-lines"></div>
    <div class="particles"></div>
  </div>
</section>
```

### 2. Smart Calculator 3.0:
```html
<div class="calculator-ai glass">
  <!-- AI Assistant -->
  <div class="ai-assistant">
    <div class="ai-avatar">
      <img src="ai-avatar.svg" alt="AI помощник">
    </div>
    <div class="ai-message">
      <p>Привет! Я помогу рассчитать стоимость. Расскажите о грузе или загрузите фото 📸</p>
    </div>
  </div>
  
  <!-- Photo Upload -->
  <div class="photo-upload-zone">
    <input type="file" id="cargo-photo" accept="image/*" hidden>
    <label for="cargo-photo" class="upload-label">
      <div class="upload-icon">📷</div>
      <p>Сфотографируйте груз</p>
      <small>AI определит размеры и тип</small>
    </label>
  </div>
  
  <!-- Voice or Type -->
  <div class="input-switch">
    <button class="switch-voice active">🎤 Голосом</button>
    <button class="switch-type">⌨️ Текстом</button>
  </div>
  
  <!-- Traditional Form (hidden by default) -->
  <form class="calc-form" style="display: none;">
    <!-- Форма как fallback -->
  </form>
  
  <!-- Results -->
  <div class="calc-results">
    <div class="price-card neumorphic">
      <div class="price-value">15,000₽</div>
      <div class="price-details">
        <span>Газель</span>
        <span>•</span>
        <span>Завтра</span>
      </div>
    </div>
  </div>
</div>
```

### 3. Trust Indicators:
```html
<div class="trust-bar glass">
  <div class="trust-item">
    <div class="trust-icon">🛡️</div>
    <div class="trust-text">
      <strong>Застрахованы</strong>
      <small>на 10 млн ₽</small>
    </div>
  </div>
  
  <div class="trust-item">
    <div class="trust-icon">⏱️</div>
    <div class="trust-text">
      <strong>99.3%</strong>
      <small>вовремя</small>
    </div>
  </div>
  
  <div class="trust-item">
    <div class="trust-icon">🏆</div>
    <div class="trust-text">
      <strong>12 лет</strong>
      <small>на рынке</small>
    </div>
  </div>
  
  <div class="trust-item live">
    <div class="trust-icon">🚛</div>
    <div class="trust-text">
      <strong class="live-counter">247</strong>
      <small>машин в пути</small>
    </div>
  </div>
</div>
```

### 4. Service Cards (Glassmorphism):
```html
<div class="services-grid">
  <article class="service-card glass">
    <div class="service-icon floating">🏢</div>
    <h3>Удаленный отдел логистики</h3>
    <p>Полная замена штатных логистов</p>
    <ul class="service-benefits">
      <li>💰 Экономия до 4 млн ₽/год</li>
      <li>👤 Персональный менеджер</li>
      <li>📊 Отчеты и аналитика</li>
    </ul>
    <button class="cta-button gradient">
      <span>от 15,000₽/мес</span>
      <svg class="arrow-icon">→</svg>
    </button>
  </article>
  
  <!-- Другие карточки услуг -->
</div>
```

### 5. Mobile Navigation (Bottom Sheet):
```html
<nav class="mobile-nav bottom-sheet">
  <div class="nav-handle"></div>
  
  <div class="nav-items">
    <a href="#" class="nav-item active">
      <svg class="nav-icon">🏠</svg>
      <span>Главная</span>
    </a>
    
    <a href="#calculator" class="nav-item">
      <svg class="nav-icon">🧮</svg>
      <span>Расчет</span>
    </a>
    
    <button class="nav-item nav-ai">
      <div class="ai-bubble">
        <svg class="nav-icon">🤖</svg>
        <span class="pulse-ring"></span>
      </div>
      <span>AI</span>
    </button>
    
    <a href="#services" class="nav-item">
      <svg class="nav-icon">📦</svg>
      <span>Услуги</span>
    </a>
    
    <a href="tel:+79162720932" class="nav-item">
      <svg class="nav-icon">📞</svg>
      <span>Звонок</span>
    </a>
  </div>
</nav>
```

## 🎭 МИКРОВЗАИМОДЕЙСТВИЯ

### Hover эффекты:
```css
.interactive-element {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-element:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(44, 90, 160, 0.2);
}

.button:hover {
  background: var(--gradient-primary);
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}
```

### Loading состояния:
```html
<!-- Skeleton Loading -->
<div class="skeleton-card">
  <div class="skeleton-line skeleton-title"></div>
  <div class="skeleton-line skeleton-text"></div>
  <div class="skeleton-line skeleton-text short"></div>
</div>

<!-- Progress Steps -->
<div class="progress-steps">
  <div class="step completed">
    <div class="step-icon">✓</div>
    <span>Данные получены</span>
  </div>
  <div class="step active">
    <div class="step-icon">
      <div class="spinner"></div>
    </div>
    <span>Рассчитываем...</span>
  </div>
  <div class="step">
    <div class="step-icon">3</div>
    <span>Готово!</span>
  </div>
</div>
```

### Feedback анимации:
```javascript
// Success Animation
const showSuccess = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#2c5aa0', '#00d4aa']
  });
};

// Error Shake
const shakeElement = (element) => {
  element.classList.add('shake');
  setTimeout(() => element.classList.remove('shake'), 500);
};
```

## 📊 АДАПТИВНОСТЬ

### Breakpoints:
```css
/* Mobile First */
--screen-sm: 640px;   /* Смартфоны landscape */
--screen-md: 768px;   /* Планшеты */
--screen-lg: 1024px;  /* Ноутбуки */
--screen-xl: 1280px;  /* Десктопы */
--screen-2xl: 1536px; /* Большие мониторы */
```

### Touch-friendly:
- Минимальный размер кнопок: 48x48px
- Отступы между элементами: минимум 8px
- Свайпы для навигации
- Haptic feedback на действия

## 🚀 ИННОВАЦИОННЫЕ ФИЧИ

### 1. AI Chat Overlay:
```html
<div class="ai-chat-overlay">
  <div class="chat-bubble glass">
    <div class="typing-indicator">
      <span></span><span></span><span></span>
    </div>
    <p class="chat-message">
      Понял! Холодильник 180x60x60 см из Москвы в Питер. 
      Рекомендую газель с грузчиками. Стоимость: 12,000₽
    </p>
    <div class="chat-actions">
      <button class="chat-btn primary">Оформить</button>
      <button class="chat-btn">Изменить</button>
    </div>
  </div>
</div>
```

### 2. Real-time Tracking Map:
```html
<div class="tracking-map">
  <div id="map-container"></div>
  <div class="map-overlay glass">
    <div class="truck-info">
      <div class="truck-icon">🚛</div>
      <div class="truck-details">
        <strong>Газель А777АА77</strong>
        <p>До прибытия: 2ч 15мин</p>
      </div>
    </div>
    <div class="driver-contact">
      <button class="contact-btn">
        <svg>📞</svg>
        <span>Позвонить водителю</span>
      </button>
    </div>
  </div>
</div>
```

### 3. Gamification Elements:
```html
<div class="loyalty-progress">
  <div class="level-badge">
    <span class="level">5</span>
    <span class="label">уровень</span>
  </div>
  <div class="progress-bar">
    <div class="progress-fill" style="width: 65%"></div>
  </div>
  <p class="progress-text">
    До скидки 10%: еще 3 заказа
  </p>
</div>
```

## 🎯 КОНВЕРСИОННЫЕ ЭЛЕМЕНТЫ

### Urgency Indicators:
```html
<div class="urgency-banner gradient">
  <div class="urgency-icon">⚡</div>
  <p>Только сегодня: <strong>-20% на первый заказ</strong></p>
  <div class="countdown">
    <span class="time-block">02</span>:
    <span class="time-block">47</span>:
    <span class="time-block">31</span>
  </div>
</div>
```

### Social Proof:
```html
<div class="social-proof-ticker">
  <div class="ticker-item">
    <img src="avatar1.jpg" alt="" class="avatar">
    <p><strong>ООО "Ромашка"</strong> заказала доставку в Казань</p>
    <time>2 мин назад</time>
  </div>
  <!-- Бегущая строка с заказами -->
</div>
```

## 🌟 ФИНАЛЬНЫЕ РЕКОМЕНДАЦИИ

### DO:
- ✅ Использовать плавные градиенты
- ✅ Добавлять микроанимации
- ✅ Делать большие touch-зоны
- ✅ Показывать прогресс действий
- ✅ Использовать эмодзи для эмоций

### DON'T:
- ❌ Перегружать анимациями
- ❌ Делать мелкий текст (< 14px)
- ❌ Прятать важные элементы
- ❌ Использовать агрессивные цвета
- ❌ Забывать про dark mode

---

*Этот дизайн-гайд создан для разработки АвтоГОСТ 2025 - сайта, который изменит представление о логистических сервисах через невидимую эффективность и AI-first подход.*