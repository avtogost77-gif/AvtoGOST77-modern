# 🤖 ПРОМПТ ДЛЯ AI: СОЗДАНИЕ ЛОГИСТИЧЕСКОГО САЙТА НА БАЗЕ АВТОГОСТ

## 🎯 ЗАДАЧА ДЛЯ AI

Создать современный, высокопроизводительный веб-сайт для логистической компании, основываясь на успешной модели АвтоГОСТ, но с улучшенной архитектурой, современными технологиями и senior-level подходами к разработке.

---

## 📋 БИЗНЕС-КОНТЕКСТ И ДОМЕН

### Сфера деятельности:
**B2B логистика и грузоперевозки** с фокусом на:
- Удаленный отдел логистики для малого/среднего бизнеса
- Спот-заявки (срочные перевозки день-в-день)
- Доставка на маркетплейсы (Wildberries, Ozon)
- Прямые перевозки без складов экспедиторов
- Решение форс-мажорных ситуаций

### Уникальная ценность:
- **Подача транспорта за 2 часа** в Москве
- **Экономия 115,000₽/месяц** против штатного отдела логистики
- **Команда экспертов** вместо одного логиста
- **Обширная сеть** проверенных перевозчиков
- **Специализация на маркетплейсах** и их требованиях

---

## 🎨 ДИЗАЙН И UX ТРЕБОВАНИЯ (SENIOR LEVEL)

### Дизайн-система:
```css
/* Современная цветовая палитра */
:root {
  --primary-500: #2563eb;       /* Синий (профессиональность) */
  --primary-600: #1d4ed8;
  --success-500: #059669;       /* Зеленый (успех) */
  --warning-500: #d97706;       /* Оранжевый (срочность) */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-900: #111827;
  
  /* Typography Scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  
  /* Spacing Scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
}
```

### UX принципы:
1. **Jobs-to-be-Done подход**: Пользователь приходит с конкретной проблемой
2. **Progressive disclosure**: Не перегружать информацией
3. **Trust signals**: Социальные доказательства, сертификаты, отзывы
4. **Friction reduction**: Минимум шагов до результата
5. **Mobile-first**: 60%+ трафика с мобильных устройств

### Современный дизайн:
- **Brutalist elements** с мягкими краями
- **Neumorphism** для интерактивных элементов
- **Gradients и shadows** для глубины
- **Micro-interactions** для обратной связи
- **Dark/Light mode** переключение

---

## 🛠️ ТЕХНОЛОГИЧЕСКИЙ СТЕК (SENIOR LEVEL)

### Frontend Framework:
```typescript
// Рекомендуемый стек:
// - Next.js 14+ (App Router, Server Components)
// - TypeScript (строгая типизация)
// - TailwindCSS + HeadlessUI (utility-first CSS)
// - Framer Motion (анимации)
// - React Hook Form + Zod (формы + валидация)

interface CalculatorFormData {
  fromCity: string;
  toCity: string;
  weight: number;
  volume?: number;
  cargoType: 'general' | 'fragile' | 'valuable' | 'dangerous';
  urgency: 'standard' | 'urgent' | 'emergency';
}

// Умный калькулятор с TypeScript
class SmartLogisticsCalculator {
  private readonly priceMatrix: PriceMatrix;
  private readonly routeOptimizer: RouteOptimizer;
  
  calculatePrice(data: CalculatorFormData): CalculationResult {
    // Современная логика с ML-предсказаниями
  }
}
```

### Backend API:
```typescript
// Рекомендуемая архитектура:
// - Node.js + Express или Fastify
// - PostgreSQL + Prisma ORM
// - Redis для кеширования
// - JWT аутентификация
// - Rate limiting и валидация

interface LeadData {
  name: string;
  phone: string;
  email?: string;
  calculationResult: CalculationResult;
  source: 'calculator' | 'form' | 'exit-intent';
  timestamp: Date;
}

// API эндпоинты
POST /api/calculate-price
POST /api/leads
GET /api/cities/autocomplete
POST /api/telegram/webhook
```

### Performance оптимизации:
- **Critical CSS inlining**
- **Image optimization** (WebP, AVIF)
- **Lazy loading** для below-the-fold контента
- **Service Worker** для caching
- **Bundle splitting** и tree shaking
- **Core Web Vitals** score 90+

---

## 💰 БИЗНЕС-ЛОГИКА КАЛЬКУЛЯТОРА

### Логика ценообразования:
```typescript
interface TransportType {
  name: string;
  maxWeight: number;
  maxVolume: number;
  basePriceKm: number;
  minPrice: {
    moscow: number;
    regions: number;
  };
  coefficient: number;
}

const TRANSPORT_TYPES: TransportType[] = [
  {
    name: 'Газель',
    maxWeight: 1500,
    maxVolume: 16,
    basePriceKm: 45,
    minPrice: { moscow: 12000, regions: 8500 },
    coefficient: 0.36
  },
  // ... другие типы
];

// Умная логика расчета с ML
function calculateDynamicPrice(
  route: Route,
  cargo: CargoDetails,
  marketConditions: MarketData
): PriceCalculation {
  // 1. Базовая цена по километражу
  // 2. Коэффициенты загрузки
  // 3. Сезонность и спрос
  // 4. Популярность маршрута
  // 5. Тип груза и срочность
  // 6. ML-корректировки на основе истории
}
```

### Географическая логика:
```typescript
interface CityData {
  name: string;
  region: string;
  coordinates: [number, number];
  isMarketplaceHub: boolean;
  deliveryZone: 'moscow' | 'spb' | 'federal';
}

// Ограничения для сборных грузов
function validateConsolidatedDelivery(from: CityData, to: CityData): boolean {
  // Сборные грузы только МЕЖДУ регионами!
  return from.region !== to.region;
}
```

---

## 🎯 КОНВЕРСИОННАЯ ОПТИМИЗАЦИЯ

### Landing page структура:
1. **Hero section** с главной ценностью и калькулятором
2. **Social proof** (цифры, клиенты, отзывы)
3. **Problem-Solution fit** (боли клиентов → наши решения)
4. **Услуги** с фокусом на результат
5. **Кейсы и экономия** (конкретные цифры)
6. **FAQ** для снятия возражений
7. **CTA section** с несколькими вариантами действий

### Микроконверсии:
```typescript
// Отслеживание пользовательского пути
interface UserJourney {
  landingPage: string;
  calculatorUsed: boolean;
  calculationResult?: CalculationResult;
  exitIntent: boolean;
  promoCodeShown: boolean;
  leadSubmitted: boolean;
  conversionSource: string;
}

// A/B тесты
const AB_TESTS = {
  heroHeadline: ['variant_a', 'variant_b'],
  calculatorPosition: ['top', 'middle'],
  ctaColor: ['blue', 'green', 'orange'],
  promoTimer: [900, 1800], // 15 или 30 минут
};
```

### Промокоды и срочность:
- **WELCOME10** для exit-intent popup
- **GOST15** с таймером для создания срочности
- **FIRSTORDER** для новых клиентов
- **Динамические скидки** в зависимости от суммы заказа

---

## 📊 SEO И ТЕХНИЧЕСКОЕ SEO

### Контент-стратегия:
```typescript
interface BlogPost {
  title: string;
  slug: string;
  keywords: string[];
  searchIntent: 'informational' | 'transactional' | 'commercial';
  funnel_stage: 'awareness' | 'consideration' | 'decision';
}

const CONTENT_CLUSTERS = [
  {
    pillar: 'Грузоперевозки',
    keywords: ['грузоперевозки москва', 'доставка грузов', 'логистика'],
    pages: [
      'gruzoperevozki-moskva',
      'dostavka-gruzov-po-rossii',
      'srochnie-gruzoperevozki'
    ]
  },
  {
    pillar: 'Маркетплейсы',
    keywords: ['доставка wildberries', 'коледино склад', 'ozon доставка'],
    pages: [
      'dostavka-wildberries-koledino',
      'ozon-tver-sklad',
      'marketplace-logistics'
    ]
  }
];
```

### Технические требования:
- **Schema.org разметка** для логистических услуг
- **JSON-LD** для богатых сниппетов
- **hreflang** для региональных версий
- **Canonical URLs** для дублирующего контента
- **XML sitemap** с приоритетами страниц
- **Core Web Vitals** optimization

---

## 🔗 ИНТЕГРАЦИИ И API

### Telegram Bot интеграция:
```typescript
interface TelegramIntegration {
  botToken: string;
  webhook: string;
  commands: {
    '/start': 'Приветствие и меню';
    '/calculate': 'Запуск калькулятора';
    '/status': 'Статус заказа';
    '/support': 'Связь с менеджером';
  };
}

// Автоматизация лидов
async function sendLeadToTelegram(lead: LeadData): Promise<void> {
  const message = formatLeadMessage(lead);
  await telegram.sendMessage(MANAGER_CHAT_ID, message, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📞 Позвонить', callback_data: `call_${lead.id}` }],
        [{ text: '✅ Принять', callback_data: `accept_${lead.id}` }],
        [{ text: '❌ Отклонить', callback_data: `reject_${lead.id}` }]
      ]
    }
  });
}
```

### CRM интеграция:
- **amoCRM** или **Bitrix24** для управления лидами
- **Календарное планирование** доставок
- **SMS-уведомления** через SMS.ru или SMSC
- **Email-маркетинг** через SendGrid или Mailchimp

---

## 🚀 ROADMAP РАЗВИТИЯ

### MVP (1-2 месяца):
- [x] Лендинг с калькулятором
- [x] Система сбора лидов
- [x] Telegram интеграция
- [x] Мобильная адаптация
- [x] Базовое SEO

### v2.0 (3-4 месяца):
- [ ] **Личный кабинет** клиента
- [ ] **API для расчета расстояний** (Google Maps/Yandex)
- [ ] **Система трекинга** заказов
- [ ] **Интеграция с CRM**
- [ ] **A/B тестирование** платформа

### v3.0 (6+ месяцев):
- [ ] **Мобильное приложение**
- [ ] **AI-чатбот** для консультаций
- [ ] **Система рейтингов** перевозчиков
- [ ] **Интеграция с маркетплейсами** через API
- [ ] **Франшизная модель** для регионов

---

## 🔒 БЕЗОПАСНОСТЬ И GDPR

### Требования безопасности:
```typescript
// Валидация и санитизация данных
import { z } from 'zod';

const LeadSchema = z.object({
  name: z.string().min(2).max(50).regex(/^[а-яА-Яa-zA-Z\s]+$/),
  phone: z.string().regex(/^\+7\d{10}$/),
  email: z.string().email().optional(),
  message: z.string().max(500).optional(),
  privacyConsent: z.boolean().refine(val => val === true),
});

// Rate limiting
const RATE_LIMITS = {
  calculator: { requests: 10, window: '1m' },
  leads: { requests: 3, window: '1h' },
  global: { requests: 100, window: '1h' }
};
```

### GDPR соответствие:
- **Explicit consent** для обработки ПД
- **Right to be forgotten** functionality
- **Data portability** экспорт данных
- **Audit logs** всех операций с данными
- **Encryption at rest** для sensitive data

---

## 📈 АНАЛИТИКА И МЕТРИКИ

### Key Performance Indicators:
```typescript
interface KPIs {
  // Конверсия
  calculatorUsage: number;        // % посетителей использующих калькулятор
  leadConversion: number;         // % калькуляторов → лиды
  salesConversion: number;        // % лидов → продажи
  
  // Вовлеченность
  avgSessionDuration: number;     // Среднее время на сайте
  pagesPerSession: number;        // Страниц за сессию
  bounceRate: number;            // Показатель отказов
  
  // Бизнес
  avgOrderValue: number;         // Средний чек
  customerLifetimeValue: number; // LTV клиента
  costPerLead: number;          // Стоимость лида
  
  // Техническое
  pageLoadSpeed: number;         // Core Web Vitals
  uptime: number;               // Доступность сайта
  errorRate: number;            // Частота ошибок
}
```

### Tracking события:
- **Calculator interactions** (поля заполнены, расчет выполнен)
- **Lead submissions** (форма отправлена, источник лида)
- **Exit intent** (popup показан, конверсия)
- **Phone calls** (клики по телефону, время звонка)
- **Scroll depth** (вовлеченность в контент)

---

## 💡 ИННОВАЦИОННЫЕ ФИЧИ

### AI и ML возможности:
```typescript
// Предиктивная аналитика
interface MLFeatures {
  priceOptimization: {
    // ML-модель для оптимизации цен в реальном времени
    model: 'dynamic_pricing_v2';
    factors: ['demand', 'competition', 'season', 'route_popularity'];
  };
  
  demandForecasting: {
    // Прогнозирование спроса на маршруты
    algorithm: 'time_series_forecasting';
    period: '7_days_ahead';
  };
  
  customerSegmentation: {
    // Сегментация клиентов для персонализации
    clusters: ['sme_regular', 'enterprise', 'spot_clients', 'marketplace'];
  };
  
  chatbot: {
    // AI-ассистент для клиентов
    provider: 'openai_gpt4';
    knowledge_base: 'logistics_faq';
  };
}
```

### Продвинутые UX фичи:
- **Voice input** для калькулятора
- **AR визуализация** размеров груза
- **Real-time chat** с менеджерами
- **Progressive Web App** с offline возможностями
- **Push уведомления** о статусе заказа

---

## 🎯 КОНКРЕТНЫЕ ЗАДАЧИ ДЛЯ AI

### Приоритет 1 - Основа:
1. Создать современный responsive лендинг с умным калькулятором
2. Реализовать систему сбора и обработки лидов
3. Интегрировать с Telegram Bot API
4. Настроить аналитику (GA4, Yandex Metrika)
5. Оптимизировать для Core Web Vitals

### Приоритет 2 - Конверсия:
1. Добавить A/B тестирование элементов
2. Реализовать exit-intent popup с промокодами
3. Создать систему trust signals и social proof
4. Настроить email follow-up для лидов
5. Добавить live chat интеграцию

### Приоритет 3 - Масштабирование:
1. Создать CMS для управления контентом
2. Добавить личный кабинет клиента
3. Интегрировать с внешними API (карты, платежи)
4. Реализовать систему трекинга заказов
5. Создать мобильное приложение

---

## 🔥 ОСОБЫЕ ТРЕБОВАНИЯ ОТ SENIOR РАЗРАБОТЧИКА

### Code Quality:
- **TypeScript strict mode** - полная типизация
- **ESLint + Prettier** - единый code style
- **Jest/Vitest testing** - покрытие тестами 80%+
- **Storybook** для компонентов UI
- **Git hooks** для pre-commit проверок

### Architecture Patterns:
- **Clean Architecture** - разделение бизнес-логики и UI
- **SOLID принципы** в проектировании
- **Design Patterns** где применимо
- **Error Boundaries** для graceful degradation
- **Dependency Injection** для тестируемости

### Performance:
- **Lighthouse score 90+** по всем метрикам
- **Bundle size optimization** - код-сплиттинг
- **Caching strategies** - CDN, browser cache, API cache
- **Database optimization** - индексы, query optimization
- **Monitoring** - APM, error tracking, performance metrics

---

## 📞 ТЕХНИЧЕСКАЯ ПОДДЕРЖКА

### Контакты для уточнений:
- **Telegram:** @avtogost77
- **Phone:** +7 916 272-09-32
- **Existing Site:** avtogost77.ru

### Референсы для вдохновения:
- **Uber Freight** - UX/UI patterns
- **Convoy** - логистическая платформа
- **Freightos** - ценообразование
- **Shippo** - API дизайн
- **Flexport** - dashboard для клиентов

---

**ВАЖНО:** Этот промпт основан на глубоком анализе реального успешного проекта АвтоГОСТ. Используй все найденные insights, но создай решение на новом технологическом уровне с senior подходом к архитектуре, производительности и UX.

**Режим: SENIOR FULLSTACK + SEO EXPERT + UX/UI DESIGNER + GROWTH HACKER**

🚀 **LET'S BUILD SOMETHING AMAZING!**