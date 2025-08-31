# Style Guide - AvtoGOST77 CSS Архитектура
**Версия:** 1.0.0  
**Дата:** 31 августа 2025  
**Автор:** AI Assistant

## 📋 СОДЕРЖАНИЕ

1. [Обзор архитектуры](#обзор-архитектуры)
2. [Принципы именования](#принципы-именования)
3. [Компоненты](#компоненты)
4. [Утилиты](#утилиты)
5. [Лучшие практики](#лучшие-практики)
6. [Troubleshooting](#troubleshooting)

---

## 🏗️ ОБЗОР АРХИТЕКТУРЫ

### ITCSS + BEM Методология

Мы используем **ITCSS (Inverted Triangle CSS)** архитектуру с **BEM (Block Element Modifier)** методологией.

```
styles/
├── _settings/     # Переменные и настройки
├── _tools/        # Миксины и функции
├── _generic/      # Базовые стили
├── _objects/      # Layout объекты
├── _components/   # UI компоненты
├── _utilities/    # Утилитарные классы
├── _pages/        # Специфичные стили страниц
└── main.scss      # Главный файл
```

### Принципы

- **Mobile-first** подход
- **Компонентная архитектура**
- **Производительность превыше всего**
- **Простота поддержки**

---

## 🏷️ ПРИНЦИПЫ ИМЕНОВАНИЯ

### BEM Методология

```scss
// Блок
.calculator { }

// Элемент
.calculator__step { }
.calculator__form { }
.calculator__button { }

// Модификатор
.calculator__step--active { }
.calculator__button--primary { }
.calculator__form--error { }
```

### CSS Переменные

```scss
// Цвета
--color-primary: #2D67F8;
--color-success: #28A745;
--color-warning: #FFC107;
--color-error: #DC3545;

// Отступы
--spacing-xs: 0.25rem;   // 4px
--spacing-sm: 0.5rem;    // 8px
--spacing-md: 1rem;      // 16px
--spacing-lg: 1.5rem;    // 24px
--spacing-xl: 2rem;      // 32px
```

---

## 🧩 КОМПОНЕНТЫ

### Калькулятор (Критичный компонент)

```scss
.calculator {
  // Основной блок
  &__step {
    // Шаг калькулятора
    &--active {
      // Активный шаг
    }
    &--completed {
      // Завершенный шаг
    }
  }
  
  &__form {
    // Форма калькулятора
    &__field {
      // Поле формы
      &--error {
        // Состояние ошибки
      }
    }
  }
  
  &__button {
    // Кнопка калькулятора
    &--primary {
      // Основная кнопка
    }
    &--secondary {
      // Вторичная кнопка
    }
  }
}
```

### Кнопки

```scss
.btn {
  // Базовая кнопка
  &--primary {
    background: var(--color-primary);
    color: var(--color-white);
  }
  
  &--secondary {
    background: var(--color-gray-200);
    color: var(--color-gray-800);
  }
  
  &--outline {
    border: 2px solid var(--color-primary);
    color: var(--color-primary);
  }
  
  &--ghost {
    background: transparent;
    color: var(--color-primary);
  }
}
```

### Формы

```scss
.form {
  // Базовая форма
  &__field {
    // Поле формы
    &__input {
      // Input элемент
    }
    
    &__label {
      // Label элемент
    }
    
    &--error {
      // Состояние ошибки
    }
    
    &--success {
      // Состояние успеха
    }
  }
}
```

### Карточки

```scss
.card {
  // Базовая карточка
  &__header {
    // Заголовок карточки
  }
  
  &__body {
    // Тело карточки
  }
  
  &__footer {
    // Подвал карточки
  }
  
  &--hover {
    // Hover эффект
  }
}
```

---

## 🛠️ УТИЛИТЫ

### Отступы

```scss
// Margin
.m-0 { margin: 0; }
.m-1 { margin: var(--spacing-xs); }
.m-2 { margin: var(--spacing-sm); }
.m-3 { margin: var(--spacing-md); }
.m-4 { margin: var(--spacing-lg); }
.m-5 { margin: var(--spacing-xl); }

// Padding
.p-0 { padding: 0; }
.p-1 { padding: var(--spacing-xs); }
.p-2 { padding: var(--spacing-sm); }
.p-3 { padding: var(--spacing-md); }
.p-4 { padding: var(--spacing-lg); }
.p-5 { padding: var(--spacing-xl); }
```

### Выравнивание

```scss
.text-left { text-align: left; }
.text-center { text-align: center; }
.text-right { text-align: right; }

.flex-center { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
}

.grid-center { 
  display: grid; 
  place-items: center; 
}
```

### Размеры

```scss
.w-full { width: 100%; }
.w-half { width: 50%; }
.w-auto { width: auto; }

.h-full { height: 100%; }
.h-auto { height: auto; }
```

### Цвета

```scss
.text-primary { color: var(--color-primary); }
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-error { color: var(--color-error); }

.bg-primary { background-color: var(--color-primary); }
.bg-success { background-color: var(--color-success); }
.bg-warning { background-color: var(--color-warning); }
.bg-error { background-color: var(--color-error); }
```

---

## ✅ ЛУЧШИЕ ПРАКТИКИ

### 1. Производительность

```scss
// ✅ Хорошо - используем CSS переменные
.calculator {
  background: var(--color-primary);
  padding: var(--spacing-md);
}

// ❌ Плохо - хардкод значений
.calculator {
  background: #2D67F8;
  padding: 16px;
}
```

### 2. Адаптивность

```scss
// ✅ Хорошо - mobile-first
.calculator {
  padding: var(--spacing-sm);
  
  @include responsive('md') {
    padding: var(--spacing-md);
  }
  
  @include responsive('lg') {
    padding: var(--spacing-lg);
  }
}

// ❌ Плохо - desktop-first
.calculator {
  padding: var(--spacing-lg);
  
  @media (max-width: 768px) {
    padding: var(--spacing-sm);
  }
}
```

### 3. Доступность

```scss
// ✅ Хорошо - focus states
.btn:focus-visible {
  outline: 3px solid var(--color-primary);
  outline-offset: 2px;
}

// ✅ Хорошо - reduced motion
@media (prefers-reduced-motion: reduce) {
  .calculator__step {
    transition: none;
    animation: none;
  }
}
```

### 4. Безопасность

```scss
// ✅ Хорошо - ограничение z-index
.modal {
  z-index: 999; // Максимальный z-index
}

// ❌ Плохо - высокий z-index
.modal {
  z-index: 9999; // Слишком высоко
}
```

---

## 🔧 TROUBLESHOOTING

### Частые проблемы

#### 1. Стили не применяются

**Проблема:** Стили не работают после изменения SCSS.

**Решение:**
```bash
# Перекомпилировать SCSS
npm run sass

# Или в watch режиме
npm run sass:watch
```

#### 2. Конфликты стилей

**Проблема:** Новые стили конфликтуют со старыми.

**Решение:**
```scss
// Используйте более специфичные селекторы
.calculator__step--active {
  // Стили для активного шага
}

// Или используйте !important (только в крайнем случае)
.calculator__step--active {
  background: var(--color-primary) !important;
}
```

#### 3. Проблемы с производительностью

**Проблема:** Медленная загрузка страницы.

**Решение:**
```scss
// Используйте will-change для анимаций
.calculator__step {
  will-change: transform;
}

// Используйте contain для изоляции
.calculator {
  contain: layout style paint;
}
```

#### 4. Проблемы с адаптивностью

**Проблема:** Стили не работают на мобильных.

**Решение:**
```scss
// Проверьте breakpoints
@include responsive('sm') { // 576px
  // Стили для планшетов
}

@include responsive('md') { // 768px
  // Стили для десктопов
}
```

### Отладка

#### 1. Проверка компиляции

```bash
# Проверить ошибки компиляции
sass styles/main.scss --check

# Показать подробные ошибки
sass styles/main.scss --trace
```

#### 2. Проверка размера файлов

```bash
# Анализ размера CSS
npm run analyze

# Создать отчет оптимизации
./optimize-css.sh
```

#### 3. Проверка производительности

```bash
# Тест PageSpeed
# Откройте https://pagespeed.web.dev/
# Введите URL сайта
```

---

## 📚 ДОПОЛНИТЕЛЬНЫЕ РЕСУРСЫ

### Документация

- [ITCSS Architecture](https://www.xfive.co/blog/itcss-scalable-maintainable-css-architecture/)
- [BEM Methodology](https://en.bem.info/methodology/)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

### Инструменты

- [Sass Documentation](https://sass-lang.com/documentation)
- [PostCSS](https://postcss.org/)
- [Autoprefixer](https://autoprefixer.github.io/)

### Тестирование

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [CSS Validator](https://jigsaw.w3.org/css-validator/)

---

## 🚀 КОМАНДЫ ДЛЯ РАЗРАБОТКИ

```bash
# Разработка
npm run sass:watch

# Продакшн сборка
npm run build

# Оптимизация
./optimize-css.sh

# Тестирование
npm run test

# Очистка
npm run clean
```

---

**🎯 Цель:** Создать масштабируемую CSS архитектуру для 73-страничного логистического сайта с производительностью 95+ по PageSpeed!
