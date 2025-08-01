# 🏗️ ТЕХНИЧЕСКАЯ АРХИТЕКТУРА НОВОГО САЙТА АВТОГОСТ
## Детальные технические решения и архитектурные паттерны

---

## 🎯 АРХИТЕКТУРНЫЕ ПРИНЦИПЫ

### 🏛️ Основные принципы:
1. **Performance First**: Скорость превыше всего
2. **SEO-Optimized**: Поисковая оптимизация с рождения
3. **Mobile-First**: Мобильная версия как приоритет
4. **Scalable**: Масштабируемость архитектуры
5. **Secure**: Безопасность на всех уровнях
6. **Accessible**: Доступность для всех пользователей

---

## 🛠️ ТЕХНОЛОГИЧЕСКИЙ СТЕК

### 📱 Frontend Stack:
```typescript
// Основные технологии
- Next.js 14 (App Router)
- TypeScript 5.0+
- Tailwind CSS 3.4+
- Framer Motion (анимации)
- React Hook Form (формы)
- Zod (валидация)

// UI компоненты
- Radix UI (примитивы)
- Lucide Icons (иконки)
- React Hot Toast (уведомления)
- React Query (кэширование)

// Утилиты
- date-fns (работа с датами)
- clsx (условные классы)
- recharts (графики)
```

### 🔧 Backend Stack:
```typescript
// API и сервер
- Node.js 18+
- Express.js 4.18+
- TypeScript 5.0+
- Prisma ORM 5.0+
- PostgreSQL 15+

// Аутентификация
- NextAuth.js 4.24+
- JWT tokens
- Session management

// Валидация и безопасность
- Zod (схемы валидации)
- Helmet (security headers)
- Rate limiting
- CORS configuration
```

### 🗄️ Database Schema:
```sql
-- Основные таблицы
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  name VARCHAR(255),
  company VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  from_city VARCHAR(255) NOT NULL,
  to_city VARCHAR(255) NOT NULL,
  weight DECIMAL(10,2),
  volume DECIMAL(10,2),
  transport_type VARCHAR(50),
  calculated_price DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'new',
  source VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  user_id UUID REFERENCES users(id),
  total_price DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  tracking_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  is_popular BOOLEAN DEFAULT false
);
```

---

## 🏗️ ПРОЕКТНАЯ СТРУКТУРА

### 📁 Frontend Structure:
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   ├── blog/              # Blog pages
│   ├── calculator/        # Calculator page
│   ├── services/          # Services pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   ├── calculator/       # Calculator components
│   └── blog/             # Blog components
├── lib/                  # Utilities and configs
│   ├── utils.ts          # Utility functions
│   ├── validations.ts    # Zod schemas
│   ├── constants.ts      # App constants
│   └── api.ts            # API client
├── hooks/                # Custom React hooks
├── types/                # TypeScript types
└── styles/               # Additional styles
```

### 📁 Backend Structure:
```
server/
├── src/
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── types/            # TypeScript types
├── prisma/               # Database schema
├── tests/                # Test files
└── package.json
```

---

## 🧮 КАЛЬКУЛЯТОР: ТЕХНИЧЕСКАЯ РЕАЛИЗАЦИЯ

### 🎯 Компонентная архитектура:
```typescript
// Основные компоненты калькулятора
<CalculatorContainer>
  <CalculatorForm>
    <CitySelector />      // Выбор городов с автокомплитом
    <CargoDetails />      // Вес, объем, тип груза
    <TransportSelector /> // Выбор транспорта
  </CalculatorForm>
  
  <CalculatorResult>
    <PriceBreakdown />    // Детализация цены
    <LeadForm />          // Форма заявки
    <CTASection />        // Призывы к действию
  </CalculatorResult>
</CalculatorContainer>
```

### 💰 Логика расчета (TypeScript):
```typescript
interface CalculationParams {
  fromCity: string;
  toCity: string;
  weight: number;
  volume?: number;
  transportType: TransportType;
  cargoType?: CargoType;
}

interface CalculationResult {
  price: number;
  breakdown: {
    basePrice: number;
    distancePrice: number;
    transportCoefficient: number;
    loadFactor: number;
    routeFactor: number;
  };
  details: {
    distance: number;
    deliveryTime: string;
    transport: string;
    loadPercent: number;
  };
}

class PriceCalculator {
  private transportTypes = {
    gazelle: { maxWeight: 1500, maxVolume: 16, coefficient: 0.36 },
    threeTon: { maxWeight: 3000, maxVolume: 18, coefficient: 0.46 },
    fiveTon: { maxWeight: 5000, maxVolume: 36, coefficient: 0.71 },
    tenTon: { maxWeight: 10000, maxVolume: 50, coefficient: 0.86 },
    truck: { maxWeight: 20000, maxVolume: 82, coefficient: 1.0 }
  };

  calculatePrice(params: CalculationParams): CalculationResult {
    const distance = this.getDistance(params.fromCity, params.toCity);
    const pricePerKm = this.getPricePerKm(distance);
    const transport = this.transportTypes[params.transportType];
    
    let basePrice = distance * pricePerKm;
    basePrice *= transport.coefficient;
    basePrice *= this.getLoadFactor(params.weight, params.volume, transport);
    basePrice *= this.getRouteFactor(params.fromCity, params.toCity);
    
    return {
      price: Math.round(basePrice / 500) * 500,
      breakdown: { /* детализация */ },
      details: { /* дополнительная информация */ }
    };
  }
}
```

### 🗺️ Интеграция с картами:
```typescript
// Yandex Maps API интеграция
class MapsService {
  private apiKey: string;
  
  async getDistance(from: string, to: string): Promise<number> {
    const response = await fetch(
      `https://api-maps.yandex.ru/2.1/?apikey=${this.apiKey}&format=json&geocode=${from}~${to}`
    );
    // Обработка ответа и расчет расстояния
  }
  
  async autocompleteCity(query: string): Promise<City[]> {
    // Автокомплит городов
  }
}
```

---

## 🔒 БЕЗОПАСНОСТЬ И ВАЛИДАЦИЯ

### 🛡️ Security Headers:
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

### ✅ Валидация форм:
```typescript
// Zod схемы валидации
const leadFormSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  phone: z.string().regex(/^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/, 'Неверный формат телефона'),
  email: z.string().email('Неверный формат email'),
  fromCity: z.string().min(2, 'Выберите город отправления'),
  toCity: z.string().min(2, 'Выберите город назначения'),
  weight: z.number().min(1, 'Вес должен быть больше 0'),
  volume: z.number().optional(),
  transportType: z.enum(['gazelle', 'threeTon', 'fiveTon', 'tenTon', 'truck']),
  comment: z.string().optional()
});
```

### 🚫 Rate Limiting:
```typescript
// API rate limiting
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов с одного IP
  message: 'Слишком много запросов, попробуйте позже',
  standardHeaders: true,
  legacyHeaders: false,
});
```

---

## 📱 PWA И МОБИЛЬНАЯ ОПТИМИЗАЦИЯ

### 📱 PWA Configuration:
```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
});

// manifest.json
{
  "name": "АвтоГОСТ - Грузоперевозки по России",
  "short_name": "АвтоГОСТ",
  "description": "Надежные грузоперевозки по России 24/7",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2c5aa0",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 📱 Service Worker:
```typescript
// public/sw.js
const CACHE_NAME = 'avtogost-v1';
const urlsToCache = [
  '/',
  '/calculator',
  '/services',
  '/static/css/main.css',
  '/static/js/main.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

---

## 🔧 API И ИНТЕГРАЦИИ

### 📡 API Routes (Next.js):
```typescript
// app/api/calculate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PriceCalculator } from '@/lib/calculator';
import { leadFormSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = leadFormSchema.parse(body);
    
    const calculator = new PriceCalculator();
    const result = calculator.calculatePrice(validatedData);
    
    // Сохранение лида в базу данных
    await saveLead(validatedData, result);
    
    // Отправка в Telegram
    await sendToTelegram(validatedData, result);
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: 'Ошибка расчета' },
      { status: 400 }
    );
  }
}
```

### 💬 Telegram Integration:
```typescript
// lib/telegram.ts
export class TelegramService {
  private botToken: string;
  private chatId: string;
  
  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN!;
    this.chatId = process.env.TELEGRAM_CHAT_ID!;
  }
  
  async sendLead(data: LeadData, calculation: CalculationResult) {
    const message = this.formatLeadMessage(data, calculation);
    
    const response = await fetch(
      `https://api.telegram.org/bot${this.botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: this.chatId,
          text: message,
          parse_mode: 'HTML'
        })
      }
    );
    
    return response.ok;
  }
  
  private formatLeadMessage(data: LeadData, calculation: CalculationResult): string {
    return `
🚛 НОВАЯ ЗАЯВКА С САЙТА!

👤 Имя: ${data.name}
📱 Телефон: ${data.phone}
📧 Email: ${data.email}

📍 Маршрут: ${data.fromCity} → ${data.toCity}
📦 Груз: ${data.weight} кг${data.volume ? `, ${data.volume} м³` : ''}
🚛 Транспорт: ${data.transportType}

💰 Стоимость: ${calculation.price.toLocaleString()} ₽
⏱️ Срок доставки: ${calculation.details.deliveryTime}

🕐 Время: ${new Date().toLocaleString('ru-RU')}
    `.trim();
  }
}
```

---

## 📊 АНАЛИТИКА И ОТСЛЕЖИВАНИЕ

### 📈 Google Analytics 4:
```typescript
// lib/analytics.ts
export const GA_TRACKING_ID = 'G-EMQ3D0X8K7';

export const pageview = (url: string) => {
  window.gtag('config', GA_TRACKING_ID, {
    page_location: url,
  });
};

export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Отслеживание конверсий
export const trackLead = (source: string, value: number) => {
  event({
    action: 'generate_lead',
    category: 'engagement',
    label: source,
    value: value
  });
};
```

### 📊 Yandex.Metrika:
```typescript
// lib/metrika.ts
export const YM_ID = '103413788';

export const reachGoal = (target: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(YM_ID, 'reachGoal', target, params);
  }
};

// Отслеживание целей
export const trackCalculatorUsage = (fromCity: string, toCity: string) => {
  reachGoal('calculator_used', { fromCity, toCity });
};

export const trackLeadSubmission = (source: string) => {
  reachGoal('lead_submitted', { source });
};
```

---

## 🚀 PERFORMANCE ОПТИМИЗАЦИЯ

### ⚡ Image Optimization:
```typescript
// next.config.js
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};
```

### 📦 Code Splitting:
```typescript
// Динамические импорты для тяжелых компонентов
const Calculator = dynamic(() => import('@/components/Calculator'), {
  loading: () => <CalculatorSkeleton />,
  ssr: false
});

const BlogPost = dynamic(() => import('@/components/BlogPost'), {
  loading: () => <BlogSkeleton />
});
```

### 🗄️ Caching Strategy:
```typescript
// lib/cache.ts
export class CacheService {
  private cache = new Map();
  
  async get<T>(key: string): Promise<T | null> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }
    return null;
  }
  
  set<T>(key: string, data: T, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }
}

// Кэширование расчетов
const calculatorCache = new CacheService();
const cachedResult = await calculatorCache.get(cacheKey);
if (cachedResult) return cachedResult;
```

---

## 🧪 ТЕСТИРОВАНИЕ

### 🧪 Unit Tests:
```typescript
// __tests__/calculator.test.ts
import { PriceCalculator } from '@/lib/calculator';

describe('PriceCalculator', () => {
  const calculator = new PriceCalculator();
  
  test('calculates price correctly for gazelle', () => {
    const result = calculator.calculatePrice({
      fromCity: 'Москва',
      toCity: 'Санкт-Петербург',
      weight: 1000,
      transportType: 'gazelle'
    });
    
    expect(result.price).toBeGreaterThan(0);
    expect(result.details.distance).toBeGreaterThan(0);
  });
  
  test('applies load factor correctly', () => {
    // Тесты коэффициентов загрузки
  });
});
```

### 🧪 Integration Tests:
```typescript
// __tests__/api/calculate.test.ts
import { createMocks } from 'node-mocks-http';
import calculateHandler from '@/app/api/calculate/route';

describe('/api/calculate', () => {
  test('returns calculation result for valid data', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Тест',
        phone: '+7 (999) 123-45-67',
        fromCity: 'Москва',
        toCity: 'Санкт-Петербург',
        weight: 1000,
        transportType: 'gazelle'
      }
    });
    
    await calculateHandler(req, res);
    
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toHaveProperty('result');
  });
});
```

---

## 🔧 ДЕПЛОЙ И CI/CD

### 🚀 Vercel Configuration:
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "DATABASE_URL": "@database-url",
    "TELEGRAM_BOT_TOKEN": "@telegram-bot-token",
    "TELEGRAM_CHAT_ID": "@telegram-chat-id",
    "GA_TRACKING_ID": "@ga-tracking-id",
    "YM_ID": "@ym-id"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 🔄 GitHub Actions:
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📊 МОНИТОРИНГ И ЛОГИРОВАНИЕ

### 📊 Application Monitoring:
```typescript
// lib/monitoring.ts
export class MonitoringService {
  static trackError(error: Error, context?: Record<string, any>) {
    console.error('Application Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
    
    // Отправка в внешний сервис мониторинга
    if (process.env.NODE_ENV === 'production') {
      // Sentry, LogRocket, etc.
    }
  }
  
  static trackPerformance(metric: string, value: number) {
    // Отслеживание производительности
  }
}
```

### 📈 Health Checks:
```typescript
// app/api/health/route.ts
export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  };
  
  return NextResponse.json(health);
}
```

---

## 🎯 КРИТЕРИИ КАЧЕСТВА

### 📊 Performance Metrics:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 600ms

### 🔍 SEO Requirements:
- **PageSpeed Insights**: 95+ баллов
- **Mobile-Friendly Test**: 100% совместимость
- **Core Web Vitals**: Все метрики в зеленой зоне
- **Accessibility**: WCAG 2.1 AA compliance

### 🧪 Testing Coverage:
- **Unit Tests**: >80% покрытие
- **Integration Tests**: Все API endpoints
- **E2E Tests**: Критические пользовательские сценарии
- **Performance Tests**: Нагрузочное тестирование

---

*Этот документ содержит детальные технические решения для создания высокопроизводительного, масштабируемого и безопасного сайта АвтоГОСТ.*