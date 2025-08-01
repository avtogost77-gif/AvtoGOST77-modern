# 🛠️ ТЕХНИЧЕСКИЕ СПЕЦИФИКАЦИИ АВТОГОСТ 2025

## 📋 СОДЕРЖАНИЕ
1. [Архитектура системы](#архитектура-системы)
2. [Бизнес-логика калькулятора](#бизнес-логика-калькулятора)
3. [База данных и структуры](#база-данных-и-структуры)
4. [API и интеграции](#api-и-интеграции)
5. [Frontend компоненты](#frontend-компоненты)
6. [SEO и производительность](#seo-и-производительность)

## 🏗️ АРХИТЕКТУРА СИСТЕМЫ

### Текущая структура проекта:
```
avtogost77.ru/
├── index.html              # Главная страница с калькулятором
├── services.html           # Услуги (3 основных направления)
├── contact.html            # Контакты и форма связи
├── about.html              # О компании
├── faq.html                # Частые вопросы
├── privacy.html            # Политика конфиденциальности
├── terms.html              # Условия использования
├── help.html               # Помощь
├── track.html              # Трекинг (заглушка)
├── blog-*.html             # 6 статей блога
├── assets/
│   ├── css/
│   │   ├── styles.css      # Основные стили (3242 строки)
│   │   ├── main.css        # Дополнительные стили
│   │   ├── mobile.css      # Мобильная адаптация
│   │   └── critical.css    # Критические стили
│   ├── js/
│   │   ├── smart-calculator-v2.js  # Умный калькулятор (911 строк)
│   │   ├── form-handler.js         # Обработчик форм
│   │   ├── cities-simple.js        # База городов (146+)
│   │   └── main.js                 # Общие скрипты
│   └── img/                # Изображения и иконки
├── manifest.json           # PWA манифест
├── sw.js                   # Service Worker
├── robots.txt              # SEO директивы
└── sitemap.xml            # Карта сайта
```

## 💰 БИЗНЕС-ЛОГИКА КАЛЬКУЛЯТОРА

### Основной класс SmartCalculatorV2:

```javascript
class SmartCalculatorV2 {
  constructor() {
    // ТИПЫ ТРАНСПОРТА
    this.transportTypes = {
      gazelle: {
        name: 'Газель',
        maxWeight: 1500,      // кг
        maxVolume: 16,        // м³
        density: 94,          // кг/м³
        minPrice: 10000,      // Москва
        minPriceRegion: 7500, // Регионы
        coefficient: 0.36,    // от цены фуры
        icon: '🚐'
      },
      // ... другие типы транспорта
    };
    
    // РЕАЛЬНЫЕ ПРИМЕРЫ ЦЕН
    this.realPrices = {
      'Голицыно-Поварово': { distance: 40, price: 28000, pricePerKm: 700 },
      'Москва-СПб': { distance: 700, price: 70000, pricePerKm: 100 },
      // ... другие маршруты
    };
  }
}
```

### Алгоритм расчета цены:

1. **Проверка региона:**
   - Внутри региона - только отдельная машина
   - Между регионами - возможны сборные грузы

2. **Выбор транспорта:**
   - По весу (обязательно)
   - По объему (если указан)
   - По плотности груза

3. **Базовая цена:**
   ```javascript
   if (distance < 50) pricePerKm = 700;
   else if (distance < 100) pricePerKm = 280;
   else if (distance < 200) pricePerKm = 200;
   else if (distance < 500) pricePerKm = 150;
   else pricePerKm = 100;
   ```

4. **Коэффициенты:**
   - Загрузка транспорта (< 30% = +50%)
   - Популярность маршрута (-10% на топовые)
   - Тип груза (хрупкий +30%, опасный +80%)
   - Сборный груз (-35%)

## 🗃️ БАЗА ДАННЫХ И СТРУКТУРЫ

### База городов (cities-simple.js):
```javascript
const POPULAR_CITIES = [
  // Топ-10
  'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург',
  
  // Московская область (74 города)
  'Апрелевка', 'Балашиха', 'Бронницы', 'Верея', 'Видное',
  
  // Ленинградская область (34 города)
  'Бокситогорск', 'Волосово', 'Волхов', 'Всеволожск',
  
  // Другие крупные города
  'Уфа', 'Красноярск', 'Пермь', 'Воронеж'
];
```

### Регионы для расчета:
```javascript
this.regions = {
  'Московская область': ['Москва', 'Подольск', 'Химки', ...],
  'Санкт-Петербург и область': ['Санкт-Петербург', 'Гатчина', ...],
  'Нижегородская область': ['Нижний Новгород', 'Дзержинск', ...]
};
```

## 🔌 API И ИНТЕГРАЦИИ

### Telegram Bot API:
```javascript
const botToken = '7999458907:AAGOAjQLmEZuT4SFx4Upl1GjuXO0yFuWok8';
const chatId = '399711407'; // ID менеджера

async function sendToTelegram(message, source) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    }
  );
}
```

### Аналитика:
- **Google Analytics:** G-EMQ3D0X8K7
- **Яндекс.Метрика:** 103413788
- **Tawk.to:** Встроенный чат поддержки

## 🎨 FRONTEND КОМПОНЕНТЫ

### Exit-Intent Popup:
```javascript
function initExitIntentPopup() {
  document.addEventListener('mouseleave', (e) => {
    if (e.clientY <= 0 && !hasShownPopup) {
      showExitPopup(); // Скидка 10%
    }
  });
}
```

### Sticky Header:
```javascript
function initStickyHeader() {
  window.addEventListener('scroll', () => {
    if (scrollTop > headerHeight) {
      stickyHeader.classList.add('visible');
    }
  });
}
```

### Промокод с таймером:
```javascript
function initPromoTimer() {
  let timeLeft = 15 * 60; // 15 минут
  // Обратный отсчет с сохранением в localStorage
}
```

## 🚀 SEO И ПРОИЗВОДИТЕЛЬНОСТЬ

### Критические метрики:
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Оптимизации:
1. **Critical CSS** в `<head>`
2. **Preload** для hero изображения
3. **Async/defer** для скриптов
4. **Service Worker** для кеширования
5. **WebP** изображения с fallback

### PWA функционал:
```json
{
  "name": "АвтоГОСТ - Грузоперевозки",
  "short_name": "АвтоГОСТ",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#2c5aa0",
  "background_color": "#ffffff",
  "icons": [...]
}
```

## 🔧 РЕКОМЕНДАЦИИ ПО УЛУЧШЕНИЮ

### Backend (для будущей реализации):
```typescript
// Предлагаемый стек
- Node.js + Express/Fastify
- PostgreSQL + Redis
- TypeScript
- Docker + Kubernetes

// API структура
/api/v1/
  /calculator/calculate
  /cities/search
  /orders/create
  /tracking/:id
  /analytics/event
```

### AI интеграции:
```javascript
// OpenAI для чата
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

// Голосовой ввод
const recognition = new webkitSpeechRecognition();
recognition.lang = 'ru-RU';

// Анализ изображений
const analyzeCargoPhoto = async (file) => {
  // Computer Vision API для определения размеров
};
```

### Масштабирование:
1. **CDN:** Cloudflare для статики
2. **База данных:** Миграция на PostgreSQL
3. **Кеширование:** Redis для частых запросов
4. **Очереди:** RabbitMQ для обработки заказов
5. **Мониторинг:** Grafana + Prometheus

## 📊 МЕТРИКИ ДЛЯ ОТСЛЕЖИВАНИЯ

### Технические:
- Время загрузки страницы
- Конверсия калькулятора
- Ошибки JavaScript
- Доступность API

### Бизнес:
- Количество расчетов в калькуляторе
- Конверсия в заявки
- Средний чек
- География заказов

---

*Эти спецификации основаны на анализе текущего кода проекта АвтоГОСТ. Используйте их как основу для разработки улучшенной версии с AI-функционалом и современной архитектурой.*