# 🛠 ПЛАН ТЕХНИЧЕСКИХ ИСПРАВЛЕНИЙ

## 📅 Дата: 13 августа 2025

## 🎯 ЦЕЛЬ
Привести все технические аспекты сайта к единому стандарту, исправить ошибки и оптимизировать производительность.

---

## 1️⃣ ФАЗА 1: СТИЛИ

### 1.1 Унификация критических стилей
```bash
# Объединить critical-inline.min.css и critical-optimized.min.css
cat assets/css/critical-inline.min.css assets/css/critical-optimized.min.css > assets/css/critical-unified.css
npx cleancss -o assets/css/critical-unified.min.css assets/css/critical-unified.css
```

### 1.2 Оптимизация подключения
```html
<!-- Заменить во всех файлах -->
<link rel="preload" href="assets/css/critical-unified.min.css" as="style">
<link rel="stylesheet" href="assets/css/critical-unified.min.css">
<link rel="stylesheet" href="assets/css/styles-optimized.min.css" media="print" onload="this.media='all'">
```

### 1.3 Удаление устаревших файлов
- critical-inline.min.css
- critical-optimized.min.css
- critical.css
- styles.css
- unified-styles.css

---

## 2️⃣ ФАЗА 2: JAVASCRIPT

### 2.1 Унификация версий
- Использовать единую версию smart-calculator-v2.min.js
- Удалить дублирующие версии и бэкапы

### 2.2 Стандартизация подключения
```html
<!-- Критические скрипты -->
<script src="assets/js/main.min.js" defer></script>

<!-- Калькулятор -->
<script src="assets/js/smart-calculator-v2.min.js" defer></script>
<script src="assets/js/calculator-ui.min.js" defer></script>

<!-- Дополнительные функции -->
<script src="assets/js/lazy-loading.min.js" defer></script>
```

### 2.3 Оптимизация скриптов
- Объединить distance-api.js и cities-simple.js
- Минифицировать все .js файлы
- Удалить неиспользуемые скрипты

---

## 3️⃣ ФАЗА 3: МИКРОРАЗМЕТКА

### 3.1 Базовая Organization
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "АвтоГОСТ",
  "description": "Инфраструктура вашего бизнеса",
  "url": "https://avtogost77.ru",
  "logo": "https://avtogost77.ru/assets/img/logo.png",
  "image": "https://avtogost77.ru/assets/img/hero-logistics.webp",
  "foundingDate": "2015",
  "priceRange": "₽₽₽",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Москва",
    "addressCountry": "RU"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "350"
  }
}
```

### 3.2 Сервисные страницы
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "НАЗВАНИЕ_УСЛУГИ",
  "provider": {
    "@type": "Organization",
    // ... базовая Organization ...
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 55.7558,
      "longitude": 37.6173
    },
    "geoRadius": "1000"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Тарифы",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "НАЗВАНИЕ_ТАРИФА"
        },
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": "ЦЕНА",
          "priceCurrency": "RUB"
        }
      }
    ]
  }
}
```

### 3.3 Хлебные крошки
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Главная",
      "item": "https://avtogost77.ru"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "НАЗВАНИЕ_РАЗДЕЛА",
      "item": "https://avtogost77.ru/РАЗДЕЛ/"
    }
  ]
}
```

---

## 4️⃣ ФАЗА 4: HTML-СТРУКТУРА

### 4.1 Мета-теги
```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="format-detection" content="telephone=no">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://avtogost77.ru/ТЕКУЩАЯ-СТРАНИЦА/">
```

### 4.2 Open Graph
```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="АвтоГОСТ">
<meta property="og:title" content="ЗАГОЛОВОК">
<meta property="og:description" content="ОПИСАНИЕ">
<meta property="og:image" content="https://avtogost77.ru/assets/img/og-image.jpg">
<meta property="og:url" content="https://avtogost77.ru/ТЕКУЩАЯ-СТРАНИЦА/">
```

### 4.3 Доступность
```html
<!-- Пропуск навигации -->
<a href="#main" class="skip-link">Перейти к содержанию</a>

<!-- ARIA-атрибуты -->
<button aria-label="Открыть меню">
<nav aria-label="Основная навигация">
<main id="main" role="main">
```

---

## 5️⃣ ФАЗА 5: ПРОИЗВОДИТЕЛЬНОСТЬ

### 5.1 Предзагрузка ресурсов
```html
<link rel="preload" href="assets/css/critical-unified.min.css" as="style">
<link rel="preload" href="assets/js/main.min.js" as="script">
<link rel="preload" href="assets/fonts/inter-var.woff2" as="font" crossorigin>
```

### 5.2 Оптимизация изображений
```bash
# Создать WebP версии
find assets/img -type f \( -name "*.jpg" -o -name "*.png" \) -exec cwebp -q 85 {} -o {}.webp \;

# Оптимизировать SVG
find assets/img -name "*.svg" -exec svgo {} \;
```

### 5.3 Service Worker
```javascript
// sw.js
const CACHE_VERSION = 'v1';
const CACHE_NAME = `avtogost-${CACHE_VERSION}`;

const CACHED_ASSETS = [
  '/assets/css/critical-unified.min.css',
  '/assets/js/main.min.js',
  '/assets/img/logo.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHED_ASSETS))
  );
});
```

---

## 📊 МЕТРИКИ УСПЕХА

### До оптимизации:
- Lighthouse Performance: 75
- First Contentful Paint: 2.1s
- Largest Contentful Paint: 3.5s
- Time to Interactive: 4.2s
- JavaScript размер: 850KB
- CSS размер: 380KB

### Цели после оптимизации:
- Lighthouse Performance: 95+
- First Contentful Paint: < 1s
- Largest Contentful Paint: < 2s
- Time to Interactive: < 2.5s
- JavaScript размер: < 500KB
- CSS размер: < 200KB

---

## ⏱ TIMELINE

1. **ФАЗА 1: Стили** - 1 день
   - Унификация критических стилей
   - Оптимизация подключения
   - Удаление устаревших файлов

2. **ФАЗА 2: JavaScript** - 1 день
   - Унификация версий
   - Стандартизация подключения
   - Оптимизация скриптов

3. **ФАЗА 3: Микроразметка** - 2 дня
   - Базовая Organization
   - Сервисные страницы
   - Хлебные крошки

4. **ФАЗА 4: HTML-структура** - 1 день
   - Мета-теги
   - Open Graph
   - Доступность

5. **ФАЗА 5: Производительность** - 1 день
   - Предзагрузка ресурсов
   - Оптимизация изображений
   - Service Worker

**Общее время: 6 рабочих дней**
