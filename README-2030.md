# 🚀 АвтоГОСТ Future 2030

> **Пока вы создаете — мы доставляем**

Революционная логистическая платформа с тактильным дизайном, идеальной воронкой продаж и технологиями будущего.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-indigo.svg)](https://www.prisma.io/)

## ✨ Особенности

### 🎨 **Дизайн 2030**
- **Тактильные эффекты** - каждое касание доставляет удовольствие
- **Glassmorphism Evolution** - стеклянные эффекты нового поколения  
- **Физические анимации** - spring, elastic, anticipation easing
- **Адаптивная типографика** - fluid typography с clamp()
- **Темная тема** и **высокий контраст** для доступности

### 🧠 **AI-Powered UX**
- **Голосовой ввод** с Web Speech API
- **Предиктивная автозаполнение** городов
- **AI-консультант** на основе OpenAI GPT
- **Умная обработка** естественного языка
- **Персонализация** на основе поведения

### 💰 **Идеальная воронка продаж**
1. **AWARENESS** - Эмоциональное hero-изображение
2. **INTEREST** - Социальные доказательства (60K+ перевозчиков)
3. **CONSIDERATION** - Интерактивный калькулятор
4. **DECISION** - Уничтожение возражений
5. **ACTION** - Простая форма лида с валидацией 152-ФЗ

### ⚡ **Производительность**
- **Core Web Vitals** оптимизация (LCP < 1.2s)
- **Critical CSS** инлайн для мгновенной загрузки
- **Service Worker** для кэширования
- **Image optimization** (WebP, lazy loading)
- **Code splitting** и tree shaking

### 🔒 **Безопасность & Compliance**
- **152-ФЗ РФ** - полное соответствие законодательству
- **CSP**, **HSTS**, **XSS protection**
- **Rate limiting** и **DDOS protection**
- **JWT authentication** с refresh tokens
- **Data encryption** в transit и at rest

## 🛠 Технологический стек

### Frontend
```typescript
// Modern Frontend Stack
{
  "build": "Vite 5.0 + TypeScript 5.3",
  "styling": "SCSS + CSS Custom Properties",
  "ui": "Vanilla TypeScript + Web Components",
  "state": "Zustand + React Query",
  "forms": "React Hook Form + Zod validation",
  "animations": "Framer Motion + GSAP",
  "icons": "Lucide + Emoji (native)",
  "fonts": "Inter Variable + JetBrains Mono"
}
```

### Backend
```typescript
// Fullstack Backend
{
  "runtime": "Node.js 18+ + Express.js",
  "api": "tRPC + REST endpoints", 
  "database": "PostgreSQL + Prisma ORM",
  "cache": "Redis + node-cache",
  "auth": "JWT + bcrypt + Passport.js",
  "email": "Nodemailer + templates",
  "files": "Sharp + Multer",
  "monitoring": "Winston + Prometheus"
}
```

### Infrastructure
```yaml
# Deployment & DevOps
deployment:
  hosting: "Vercel Frontend + Railway Backend"
  database: "PostgreSQL on Railway"
  cache: "Redis Cloud"
  cdn: "Cloudflare"
  monitoring: "Sentry + LogRocket"
  analytics: "Google Analytics 4 + Mixpanel"
```

## 🚀 Быстрый старт

### Предварительные требования
```bash
node --version  # v18.0.0+
npm --version   # v9.0.0+
git --version   # v2.0.0+
```

### Установка
```bash
# Клонирование репозитория
git clone https://github.com/avtogost77/future-platform.git
cd future-platform

# Переключение на ветку future-2030
git checkout future-2030

# Установка зависимостей
npm install

# Копирование переменных окружения
cp .env.example .env.local

# Настройка базы данных
npm run db:generate
npm run db:migrate

# Заполнение тестовыми данными
npm run db:seed
```

### Переменные окружения
```bash
# .env.local
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/avtogost_2030"

# Redis
REDIS_URL="redis://localhost:6379"

# OpenAI
OPENAI_API_KEY="sk-..."

# Analytics
GOOGLE_ANALYTICS_ID="G-..."
MIXPANEL_TOKEN="..."

# Security
JWT_SECRET="your-super-secret-key-here"
ENCRYPTION_KEY="32-char-encryption-key-here"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_USER="avtogost77@gmail.com"
SMTP_PASS="your-app-password"

# External APIs
YANDEX_MAPS_KEY="..."
DADATA_TOKEN="..."
```

### Запуск в development
```bash
# Frontend (Vite dev server)
npm run dev

# Backend (Node.js с hot reload)
npm run server:dev

# База данных (Prisma Studio)
npm run db:studio

# Параллельный запуск всего
npm run dev:all
```

Откройте [http://localhost:3000](http://localhost:3000) для просмотра.

## 📁 Структура проекта

```
avtogost-future-2030/
├── 📁 src/                          # Frontend исходники
│   ├── 📁 components/               # UI компоненты
│   │   ├── buttons/                 # Тактильные кнопки
│   │   ├── forms/                   # Формы и валидация
│   │   ├── calculator/              # Умный калькулятор
│   │   └── modals/                  # Модальные окна
│   ├── 📁 lib/                      # Утилиты и сервисы
│   │   ├── analytics.ts             # Система аналитики
│   │   ├── calculator.ts            # Логика калькулятора
│   │   ├── ai-assistant.ts          # AI помощник
│   │   └── sales-playbook.ts        # Воронка продаж
│   ├── 📁 styles/                   # SCSS стили
│   │   ├── _variables.scss          # Design tokens
│   │   ├── components/              # Компонентные стили
│   │   └── themes/                  # Темы оформления
│   ├── 📁 data/                     # Контент и константы
│   │   ├── content.ts               # Тексты и SEO
│   │   └── pricing.ts               # Логика ценообразования
│   └── main.ts                      # Точка входа
├── 📁 server/                       # Backend
│   ├── 📁 routes/                   # API маршруты
│   ├── 📁 services/                 # Бизнес-логика
│   ├── 📁 middleware/               # Middleware
│   ├── 📁 lib/                      # Утилиты
│   └── index.js                     # Сервер
├── 📁 prisma/                       # База данных
│   ├── schema.prisma                # Схема БД
│   ├── migrations/                  # Миграции
│   └── seed.ts                      # Начальные данные
├── 📁 public/                       # Статические файлы
│   ├── 📁 assets/                   # Изображения, шрифты
│   ├── manifest.json                # PWA манифест
│   └── robots.txt                   # SEO
├── 📁 docs/                         # Документация
│   ├── api.md                       # API документация
│   ├── deployment.md                # Инструкции по деплою
│   └── contributing.md              # Гайд для разработчиков
├── package.json                     # Зависимости
├── vite.config.ts                   # Vite конфигурация
├── tsconfig.json                    # TypeScript config
└── README-2030.md                   # Этот файл
```

## 🎯 Ключевые компоненты

### Калькулятор стоимости
```typescript
// Интеллектуальный расчет с кэшированием
const calculator = new Calculator({
  pricingRules: await getPricingRules(),
  cache: redis,
  ai: openai
});

const price = await calculator.calculate({
  from: "Москва",
  to: "Санкт-Петербург", 
  cargo: "FURNITURE",
  weight: 200,
  volume: 5
});
```

### AI-ассистент
```typescript
// Обработка естественного языка
const assistant = new AIAssistant({
  model: "gpt-4-turbo",
  context: "логистический консультант"
});

const response = await assistant.process(
  "Нужно перевезти пианино из Москвы в Питер"
);
// → Автоматически извлекает: груз, маршрут, требования
```

### Воронка продаж
```typescript
// Отслеживание конверсий по этапам
const funnel = new SalesPlaybook();

funnel.trackEvent('hero_view');           // 100%
funnel.trackEvent('calculator_open');     // ~40%  
funnel.trackEvent('price_calculated');    // ~25%
funnel.trackEvent('lead_form_filled');    // ~8%
funnel.trackEvent('lead_submitted');      // ~5%
```

## 📊 SEO & Производительность

### Core Web Vitals
```typescript
// Метрики производительности
const vitals = {
  LCP: "< 1.2s",    // Largest Contentful Paint
  FID: "< 100ms",   // First Input Delay  
  CLS: "< 0.1",     // Cumulative Layout Shift
  FCP: "< 0.9s",    // First Contentful Paint
  TTI: "< 2.5s"     // Time to Interactive
};
```

### SEO оптимизация
- ✅ **Structured Data** (JSON-LD)
- ✅ **Meta tags** (Open Graph, Twitter Cards)  
- ✅ **Sitemap.xml** генерация
- ✅ **Robots.txt** конфигурация
- ✅ **Canonical URLs**
- ✅ **Schema markup** для логистических услуг

## 🔧 API документация

### Калькулятор
```http
POST /api/calculate
Content-Type: application/json

{
  "fromCity": "Москва",
  "toCity": "Санкт-Петербург",
  "cargoType": "GENERAL",
  "weight": 100,
  "volume": 2
}
```

### Создание лида
```http
POST /api/leads  
Content-Type: application/json

{
  "name": "Иван Иванов",
  "phone": "+79162720932", 
  "email": "avtogost77@gmail.com",
  "calculationData": {...},
  "consent": true,
  "utmData": {...}
}
```

### tRPC endpoints
```typescript
// Type-safe API calls
const lead = await trpc.leads.create.mutate({
  name: "string",
  phone: "string", 
  consent: true
});

const calculation = await trpc.calculator.estimate.query({
  fromCity: "string",
  toCity: "string"
});
```

## 🚀 Деплой

### Production сборка
```bash
# Сборка frontend
npm run build

# Проверка production build
npm run preview

# Сборка backend
npm run build:server

# Запуск production сервера  
npm run start
```

### Vercel (Frontend)
```bash
# Установка Vercel CLI
npm i -g vercel

# Деплой на Vercel
vercel --prod

# Конфигурация в vercel.json
{
  "builds": [
    { "src": "dist/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/assets/(.*)", "dest": "/assets/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Railway (Backend)
```bash
# Подключение к Railway
railway login
railway link

# Деплой backend
railway up

# Переменные окружения
railway variables set DATABASE_URL=...
railway variables set REDIS_URL=...
```

## 🧪 Тестирование

### Unit тесты
```bash
# Запуск всех тестов
npm test

# Тесты с покрытием
npm run test:coverage

# Тесты в watch режиме
npm run test:watch
```

### E2E тесты
```bash
# Playwright тесты
npm run test:e2e

# Конкретный браузер
npm run test:e2e -- --project=chromium
```

### Lighthouse CI
```bash
# Анализ производительности
npm run lighthouse

# Генерация отчета
npm run lighthouse:report
```

## 📈 Мониторинг

### Аналитика
- **Google Analytics 4** - поведение пользователей
- **Mixpanel** - воронка продаж и конверсии  
- **Hotjar** - тепловые карты и записи сессий
- **LogRocket** - debug пользовательских проблем

### Мониторинг ошибок
- **Sentry** - отслеживание ошибок frontend/backend
- **Winston** - структурированное логирование
- **Prometheus** - метрики производительности

### Uptime мониторинг
- **UptimeRobot** - проверка доступности
- **Pingdom** - мониторинг скорости
- **StatusPage** - страница статуса сервиса

## 🔒 Безопасность

### Соответствие 152-ФЗ
```typescript
// Обязательные поля для согласия
interface ConsentData {
  dataProcessingConsent: boolean;     // Обработка ПДн
  consentDate: Date;                  // Дата согласия  
  consentIP: string;                  // IP адрес
  consentUserAgent: string;           // User Agent
  withdrawalRight: boolean;           // Право отзыва
}
```

### Защита данных
- **Шифрование** всех персональных данных
- **Автоудаление** данных через 3 года
- **Право на забвение** по запросу пользователя
- **Аудит доступа** ко всем операциям с ПДн

## 📞 Контакты

### Разработка и поддержка
- **Телефон**: [+7 (916) 272-09-32](tel:+79162720932)
- **WhatsApp**: [wa.me/79162720932](https://wa.me/79162720932)  
- **Telegram**: [@avtogost77](https://t.me/avtogost77)
- **Email**: [avtogost77@gmail.com](mailto:avtogost77@gmail.com)

### Техническая поддержка
- **GitHub Issues**: [Создать тикет](https://github.com/avtogost77/future-platform/issues)
- **Документация**: [Техническая документация](./docs/)
- **FAQ**: [Часто задаваемые вопросы](./docs/faq.md)

---

## 📄 Лицензия

MIT License - подробности в [LICENSE](LICENSE) файле.

---

**🚛 АвтоГОСТ Future 2030** - *Пока вы создаете, мы доставляем*

Создано с ❤️ для будущего логистики