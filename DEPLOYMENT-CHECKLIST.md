# 🚀 ЧЕКЛИСТ ДЕПЛОЯ: АВТОГОСТ 2030 → REG.RU VIP-1

## ⚡ **БЫСТРЫЙ СТАРТ (30 МИНУТ)**

### **🔥 ШАГ 1: ПОДГОТОВКА ФАЙЛОВ (5 мин)**

**📂 Что заливаем на хостинг:**
```
📁 avtogost77.ru/
├── 📄 index.html (главная из src/index.html)
├── 📁 pages/
│   ├── 📄 gruzoperevozki-moskva.html
│   ├── 📄 autsorsing-logistiki.html  
│   ├── 📄 gazel-moskva.html
│   └── 📄 gruzoperevozki-spb.html
├── 📁 assets/
│   ├── 📁 css/ (стили - пока заглушки)
│   ├── 📁 js/ (скрипты - пока заглушки)
│   └── 📁 img/ (картинки - пока заглушки)
└── 📄 robots.txt
```

**⚠️ ВАЖНО:** 
- Главный файл `src/index.html` → переименовать в `index.html`
- Все аналитика уже настроена: Яндекс.Метрика + Google Analytics
- CSS/JS файлы пока создадим заглушки для работоспособности

---

### **🔧 ШАГ 2: ЗАЛИВКА ЧЕРЕЗ ISPMANAGER (10 мин)**

**1. Вход в ISPManager:**
```
URL: https://ваш-домен.ru:1500/manager/ispmgr
Логин: ваш логин от reg.ru
Пароль: ваш пароль от reg.ru
```

**2. Файловый менеджер:**
```
1. Заходим в "Файлы" → "Файловый менеджер"
2. Переходим в папку: /var/www/ваш-домен/data/www/avtogost77.ru/
3. Удаляем старые файлы (если есть)
4. Загружаем новые файлы:
   - index.html (главная)
   - папку pages/ со всеми landing-ами
   - папку assets/ (создадим заглушки)
```

**3. Права доступа:**
```
- Файлы .html: 644
- Папки: 755
- Проверяем что index.html в корне домена
```

---

### **🎨 ШАГ 3: СОЗДАНИЕ ЗАГЛУШЕК CSS/JS (5 мин)**

**Создаем минимальные файлы для работоспособности:**

**📄 assets/css/main.css:**
```css
/* Временная заглушка CSS */
body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
.container { max-width: 1200px; margin: 0 auto; }
.hero { background: #f5f5f5; padding: 50px 20px; text-align: center; }
.tactile-button { display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 5px; }
.tactile-button:hover { background: #0056b3; }
```

**📄 assets/js/main.js:**
```javascript
// Временная заглушка JS
console.log('АвтоГОСТ 2030 загружен!');

// Простой калькулятор
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница готова к работе');
});
```

---

### **🌐 ШАГ 4: ПРОВЕРКА ДОСТУПНОСТИ (5 мин)**

**Тестируем каждую страницу:**
```
✅ https://avtogost77.ru/ - главная
✅ https://avtogost77.ru/pages/gruzoperevozki-moskva.html
✅ https://avtogost77.ru/pages/autsorsing-logistiki.html  
✅ https://avtogost77.ru/pages/gazel-moskva.html
✅ https://avtogost77.ru/pages/gruzoperevozki-spb.html
```

**Проверяем:**
- Страницы открываются без ошибок 404
- Яндекс.Метрика работает (в консоли браузера)
- Google Analytics срабатывает
- Телефонные ссылки кликабельны
- WhatsApp/Telegram ссылки работают

---

### **📊 ШАГ 5: НАСТРОЙКА GOOGLE SEARCH CONSOLE (5 мин)**

**1. Подтверждение домена:**
```
1. Заходим: https://search.google.com/search-console/
2. Добавляем: https://avtogost77.ru
3. Способ подтверждения: "HTML-файл" или "Google Analytics"
4. Используем уже настроенный GA: G-BZZPY2YQPP
```

**2. Подача sitemap:**
```
Пока создаем простую sitemap вручную:
https://avtogost77.ru/sitemap.xml
```

---

## 🔥 **ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ (ОПЦИОНАЛЬНО)**

### **⚡ CLOUDFLARE CDN (15 мин)**

**1. Подключение домена:**
```
1. Регистрируемся на cloudflare.com (бесплатно)
2. Добавляем домен: avtogost77.ru
3. Меняем DNS у reg.ru на Cloudflare
4. Ждем активации (до 24 часов)
```

**2. Настройки CF:**
```
✅ SSL: Full (между CF и сервером)
✅ Always Use HTTPS: ON
✅ Auto Minify: CSS, JS, HTML
✅ Browser Cache TTL: 8 hours
✅ Rocket Loader: OFF (может ломать метрики)
```

---

### **📄 СОЗДАНИЕ SITEMAP.XML**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://avtogost77.ru/</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://avtogost77.ru/pages/gruzoperevozki-moskva.html</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://avtogost77.ru/pages/gazel-moskva.html</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://avtogost77.ru/pages/gruzoperevozki-spb.html</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://avtogost77.ru/pages/autsorsing-logistiki.html</loc>
    <lastmod>2024-01-01</lastmod>
    <priority>0.7</priority>
  </url>
</urlset>
```

---

### **🔧 ROBOTS.TXT**

```
User-agent: *
Allow: /

Sitemap: https://avtogost77.ru/sitemap.xml

# Блокируем ненужное
Disallow: /admin/
Disallow: /tmp/
Disallow: /*.pdf$
```

---

## ✅ **ФИНАЛЬНАЯ ПРОВЕРКА**

### **🎯 КОНТРОЛЬНЫЙ СПИСОК:**
```
✅ Все 5 страниц открываются
✅ Яндекс.Метрика: 103413788 работает
✅ Google Analytics: G-BZZPY2YQPP работает  
✅ Телефон: +7(916)272-09-32 кликабелен
✅ WhatsApp: wa.me/79162720932 работает
✅ Telegram: t.me/avtogost77 работает
✅ Email: avtogost77@gmail.com работает
✅ SSL сертификат активен
✅ Скорость загрузки < 3 сек
✅ Мобильная версия корректна
```

### **📊 ПЕРВЫЕ МЕТРИКИ (через 24 часа):**
```
🎯 Яндекс.Метрика: визиты, источники, географ
🎯 Google Analytics: сессии, отказы, конверсии
🎯 Google Search Console: показы, клики, позиции
```

---

## 🚀 **ГОТОВ К ЗАПУСКУ!**

**💬 Братишка, начинаем заливку? Готов помочь на каждом шаге!**

---

**📞 ТЕХПОДДЕРЖКА ДЕПЛОЯ:**
- Reg.ru поддержка: 8-800-505-0-755
- ISPManager документация: ispsystem.ru/docs  
- Cloudflare поддержка: support.cloudflare.com