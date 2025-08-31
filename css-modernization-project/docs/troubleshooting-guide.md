# Troubleshooting Guide - AvtoGOST77 CSS
**Версия:** 1.0.0  
**Дата:** 31 августа 2025  
**Автор:** AI Assistant

## 🚨 КРИТИЧЕСКИЕ ПРОБЛЕМЫ

### 1. Калькулятор не работает

**Симптомы:**
- Калькулятор не отображается
- Ошибки в консоли браузера
- Стили не применяются

**Диагностика:**
```bash
# Проверить компиляцию SCSS
sass styles/main.scss --check

# Проверить ошибки в консоли
# Откройте DevTools → Console
```

**Решение:**
```scss
// Убедитесь, что калькулятор подключен в main.scss
@import '_components/calculator';

// Проверьте, что нет конфликтов с z-index
.calculator {
  z-index: 100; // Не выше 999
}
```

### 2. Стили не компилируются

**Симптомы:**
- Ошибки компиляции SCSS
- Файлы CSS не создаются
- SASS не найден

**Диагностика:**
```bash
# Проверить установку SASS
sass --version

# Проверить зависимости
npm list sass
```

**Решение:**
```bash
# Переустановить SASS
npm uninstall sass
npm install sass

# Или глобально
npm install -g sass
```

### 3. Производительность упала

**Симптомы:**
- Медленная загрузка страницы
- PageSpeed < 90
- Большие CSS файлы

**Диагностика:**
```bash
# Анализ размера CSS
npm run analyze

# Проверка PageSpeed
# https://pagespeed.web.dev/
```

**Решение:**
```scss
// Используйте критический CSS
.critical-first-screen {
  // Только стили для первого экрана
}

// Ленивая загрузка остальных стилей
.lazy-load {
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}
```

---

## 🔧 ОБЫЧНЫЕ ПРОБЛЕМЫ

### 1. Стили не применяются

**Причина:** Кэширование браузера или неправильная компиляция.

**Решение:**
```bash
# Принудительная перекомпиляция
npm run clean
npm run sass

# Очистка кэша браузера
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)
```

### 2. Конфликты с существующими стилями

**Причина:** Новые стили перезаписываются старыми.

**Решение:**
```scss
// Используйте более специфичные селекторы
.calculator__step--active {
  background: var(--color-primary) !important;
}

// Или используйте CSS переменные
:root {
  --calculator-active-bg: var(--color-primary);
}
```

### 3. Проблемы с адаптивностью

**Причина:** Неправильные breakpoints или mobile-first подход.

**Решение:**
```scss
// Всегда начинайте с мобильных
.calculator {
  padding: var(--spacing-sm); // Мобильные
  
  @include responsive('md') {
    padding: var(--spacing-md); // Планшеты
  }
  
  @include responsive('lg') {
    padding: var(--spacing-lg); // Десктопы
  }
}
```

### 4. Ошибки в консоли

**Причина:** JavaScript ошибки или проблемы с CSS.

**Решение:**
```javascript
// Добавьте обработку ошибок
window.addEventListener('error', function(e) {
  console.error('CSS Error:', e.error);
});

// Проверьте загрузку CSS
document.addEventListener('DOMContentLoaded', function() {
  const styles = document.styleSheets;
  console.log('Loaded stylesheets:', styles.length);
});
```

---

## 📊 ПРОБЛЕМЫ ПРОИЗВОДИТЕЛЬНОСТИ

### 1. Медленная загрузка CSS

**Диагностика:**
```bash
# Проверить размер CSS файлов
ls -lh dist/*.css

# Анализ с помощью cssnano
npx cssnano-cli dist/main.css --report
```

**Решение:**
```scss
// Минификация CSS
// В postcss.config.js
require('cssnano')({
  preset: ['default', {
    discardComments: { removeAll: true },
    discardUnused: true
  }]
})

// Gzip сжатие
gzip -c dist/main.min.css > dist/main.min.css.gz
```

### 2. CLS (Cumulative Layout Shift)

**Причина:** Изменение размеров элементов после загрузки.

**Решение:**
```scss
// Фиксированные размеры для изображений
.calculator__image {
  aspect-ratio: 16/9;
  min-height: 200px;
}

// Резервирование места
.calculator__step::before {
  content: '';
  display: block;
  padding-top: 56.25%; // 16:9 ratio
}
```

### 3. LCP (Largest Contentful Paint)

**Причина:** Медленная загрузка критичного контента.

**Решение:**
```scss
// Приоритетная загрузка критичных элементов
.hero__content {
  contain: layout style paint;
  will-change: transform;
}

// Оптимизация изображений
.hero__image {
  loading: eager;
  decoding: sync;
}
```

---

## 🎨 ПРОБЛЕМЫ ДИЗАЙНА

### 1. Цвета не соответствуют дизайну

**Причина:** Неправильные CSS переменные.

**Решение:**
```scss
// Проверьте переменные в _settings/_colors.scss
:root {
  --color-primary: #2D67F8;
  --color-secondary: #5A85FA;
  --color-accent: #764BA2;
}

// Используйте переменные везде
.calculator {
  background: var(--color-primary);
  color: var(--color-white);
}
```

### 2. Шрифты не загружаются

**Причина:** Проблемы с загрузкой шрифтов.

**Решение:**
```scss
// Оптимизация загрузки шрифтов
.font-optimized {
  font-display: swap;
  font-loading: swap;
}

// Fallback шрифты
body {
  font-family: 'Custom Font', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### 3. Анимации не работают

**Причина:** Браузер не поддерживает или отключены анимации.

**Решение:**
```scss
// Проверка поддержки анимаций
@supports (animation: name) {
  .calculator__step {
    animation: slideIn 0.3s ease;
  }
}

// Уважение пользовательских настроек
@media (prefers-reduced-motion: reduce) {
  .calculator__step {
    animation: none;
    transition: none;
  }
}
```

---

## 🔍 ОТЛАДКА

### 1. Инструменты разработчика

**Chrome DevTools:**
```
1. Откройте DevTools (F12)
2. Перейдите на вкладку Elements
3. Выберите элемент
4. Проверьте Styles панель
5. Ищите перечеркнутые стили
```

**Firefox Developer Tools:**
```
1. Откройте Developer Tools (F12)
2. Перейдите на вкладку Inspector
3. Выберите элемент
4. Проверьте Rules панель
```

### 2. Проверка специфичности

**Проблема:** Стили не применяются из-за низкой специфичности.

**Решение:**
```scss
// Увеличьте специфичность
.calculator .calculator__step--active {
  background: var(--color-primary);
}

// Или используйте !important (осторожно)
.calculator__step--active {
  background: var(--color-primary) !important;
}
```

### 3. Проверка загрузки файлов

**Проблема:** CSS файлы не загружаются.

**Решение:**
```javascript
// Проверка загрузки CSS
function checkCSSLoading() {
  const links = document.querySelectorAll('link[rel="stylesheet"]');
  links.forEach(link => {
    if (link.sheet) {
      console.log('CSS loaded:', link.href);
    } else {
      console.error('CSS failed to load:', link.href);
    }
  });
}

// Запустить после загрузки страницы
window.addEventListener('load', checkCSSLoading);
```

---

## 🚀 ОПТИМИЗАЦИЯ

### 1. Удаление неиспользуемых стилей

**Инструменты:**
```bash
# PurgeCSS для удаления неиспользуемых стилей
npm install purgecss

# Анализ с помощью cssnano
npx cssnano-cli dist/main.css --report
```

### 2. Оптимизация селекторов

**Проблема:** Слишком сложные селекторы.

**Решение:**
```scss
// ❌ Плохо - сложный селектор
.calculator .calculator__form .calculator__form__field input[type="text"] {
  border: 1px solid red;
}

// ✅ Хорошо - простой селектор
.calculator__form__field__input {
  border: 1px solid var(--color-error);
}
```

### 3. Кэширование

**Настройка кэширования:**
```apache
# .htaccess
<FilesMatch "\.(css|css\.gz)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, immutable"
</FilesMatch>
```

---

## 📞 ПОДДЕРЖКА

### Контакты для экстренных случаев:

1. **Критичные проблемы с калькулятором** - немедленно
2. **Проблемы производительности** - в течение часа
3. **Проблемы дизайна** - в течение дня

### Логи и отчеты:

```bash
# Создать отчет о проблеме
./create-bug-report.sh

# Собрать логи
npm run collect-logs
```

### Полезные команды:

```bash
# Полная диагностика
npm run diagnose

# Восстановление из бэкапа
./restore-backup.sh

# Тестирование всех компонентов
npm run test-all
```

---

**🎯 Помните:** Калькулятор критичен для бизнеса! Всегда тестируйте изменения перед деплоем!
