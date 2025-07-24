/**
 * АвтоГОСТ Future 2030 - Backend Server
 * Modern Express + tRPC + Prisma
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from './routes/index.js';
import { createContext } from './context.js';
import { prisma } from './lib/prisma.js';
import { redis } from './lib/redis.js';
import { setupErrorHandling } from './middleware/errorHandler.js';
import { setupRateLimiting } from './middleware/rateLimiter.js';
import { setupLogging } from './middleware/logger.js';
import { setupAnalytics } from './middleware/analytics.js';
import { PricingEngine } from './services/PricingEngine.js';
import { LeadProcessor } from './services/LeadProcessor.js';
import { NotificationService } from './services/NotificationService.js';

const app = express();
const PORT = process.env.PORT || 8000;

// ===== MIDDLEWARE =====

// Безопасность
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "https://api.openai.com"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://avtogost77.ru', 'https://www.avtogost77.ru']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Сжатие
app.use(compression());

// Парсинг JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Кастомные middleware
setupLogging(app);
setupRateLimiting(app);
setupAnalytics(app);

// ===== СТАТИЧЕСКИЕ ФАЙЛЫ =====
app.use('/assets', express.static('dist/assets', {
  maxAge: '1y',
  etag: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.js') || path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    if (path.endsWith('.webp') || path.endsWith('.jpg') || path.endsWith('.png')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// ===== СЕРВИСЫ =====
const pricingEngine = new PricingEngine(prisma);
const leadProcessor = new LeadProcessor(prisma, redis);
const notificationService = new NotificationService();

// ===== API ROUTES =====

// tRPC маршруты
app.use('/api/trpc', createExpressMiddleware({
  router: appRouter,
  createContext,
}));

// REST API для обратной совместимости
app.use('/api/v1', (await import('./routes/rest.js')).restRouter);

// ===== СПЕЦИАЛЬНЫЕ МАРШРУТЫ =====

// Калькулятор стоимости (кэшированный)
app.post('/api/calculate', async (req, res) => {
  try {
    const { fromCity, toCity, cargoType, weight, volume } = req.body;
    
    // Валидация входных данных
    if (!fromCity || !toCity || !cargoType || !weight || !volume) {
      return res.status(400).json({
        error: 'Не все обязательные поля заполнены'
      });
    }

    // Генерация ключа кэша
    const cacheKey = `calculation:${fromCity}:${toCity}:${cargoType}:${weight}:${volume}`;
    
    // Проверяем кэш
    const cachedResult = await redis.get(cacheKey);
    if (cachedResult) {
      return res.json(JSON.parse(cachedResult));
    }

    // Расчет стоимости
    const calculation = await pricingEngine.calculatePrice({
      fromCity,
      toCity,
      cargoType,
      weight: parseFloat(weight),
      volume: parseFloat(volume)
    });

    // Кэшируем на 1 час
    await redis.setex(cacheKey, 3600, JSON.stringify(calculation));

    res.json(calculation);
  } catch (error) {
    console.error('Ошибка расчета:', error);
    res.status(500).json({
      error: 'Ошибка при расчете стоимости'
    });
  }
});

// Обработка лидов
app.post('/api/leads', async (req, res) => {
  try {
    const { name, phone, email, calculationData, consent, utmData } = req.body;
    
    // Валидация согласия на обработку данных (152-ФЗ)
    if (!consent) {
      return res.status(400).json({
        error: 'Необходимо согласие на обработку персональных данных'
      });
    }

    // Валидация номера телефона
    const phoneRegex = /^\+7\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        error: 'Неверный формат номера телефона'
      });
    }

    // Обработка лида
    const lead = await leadProcessor.processLead({
      name,
      phone,
      email,
      calculationData,
      consent,
      utmData,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Отправка уведомлений
    await notificationService.notifyNewLead(lead);

    res.json({
      success: true,
      leadId: lead.id,
      message: 'Заявка принята! Перезвоним в течение 15 минут.'
    });
  } catch (error) {
    console.error('Ошибка обработки лида:', error);
    res.status(500).json({
      error: 'Ошибка при обработке заявки'
    });
  }
});

// Автокомплит городов
app.get('/api/cities/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json([]);
    }

    const cacheKey = `cities:${q.toLowerCase()}`;
    const cached = await redis.get(cacheKey);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Поиск в базе городов (заглушка - в реальности подключить к API или базе)
    const cities = await searchCities(q);
    
    // Кэш на 24 часа
    await redis.setex(cacheKey, 86400, JSON.stringify(cities));
    
    res.json(cities);
  } catch (error) {
    console.error('Ошибка поиска городов:', error);
    res.status(500).json({ error: 'Ошибка поиска' });
  }
});

// Статистика для дашборда
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await prisma.$transaction([
      prisma.lead.count(),
      prisma.order.count(),
      prisma.carrier.count({ where: { status: 'ACTIVE' } }),
      prisma.review.aggregate({ _avg: { rating: true } })
    ]);

    res.json({
      totalLeads: stats[0],
      totalOrders: stats[1],
      activeCarriers: stats[2],
      averageRating: stats[3]._avg.rating || 0
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ error: 'Ошибка получения данных' });
  }
});

// ===== WEBHOOK ENDPOINTS =====

// Webhook для уведомлений о платежах
app.post('/api/webhooks/payment', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Обработка webhook от платежной системы
    const paymentData = JSON.parse(req.body);
    
    // Верификация подписи (пример)
    // const isValid = verifyWebhookSignature(req.headers, req.body);
    // if (!isValid) return res.status(401).end();

    await leadProcessor.handlePaymentWebhook(paymentData);
    
    res.status(200).end();
  } catch (error) {
    console.error('Ошибка webhook платежа:', error);
    res.status(500).end();
  }
});

// ===== SSR ДЛЯ SEO =====
app.get('*', (req, res) => {
  // В продакшене здесь будет SSR или статические файлы
  if (process.env.NODE_ENV === 'production') {
    res.sendFile('index.html', { root: 'dist' });
  } else {
    res.json({
      message: 'АвтоГОСТ API работает',
      version: '2.0.0',
      timestamp: new Date().toISOString()
    });
  }
});

// ===== ОБРАБОТКА ОШИБОК =====
setupErrorHandling(app);

// ===== GRACEFUL SHUTDOWN =====
process.on('SIGTERM', async () => {
  console.log('🔄 Graceful shutdown...');
  
  await prisma.$disconnect();
  await redis.disconnect();
  
  process.exit(0);
});

// ===== ЗАПУСК СЕРВЕРА =====
app.listen(PORT, () => {
  console.log(`🚀 АвтоГОСТ Future 2030 API запущен на порту ${PORT}`);
  console.log(`📡 tRPC: http://localhost:${PORT}/api/trpc`);
  console.log(`🌐 REST API: http://localhost:${PORT}/api/v1`);
  
  // Проверка подключений
  prisma.$connect()
    .then(() => console.log('✅ База данных подключена'))
    .catch(err => console.error('❌ Ошибка БД:', err));
    
  redis.ping()
    .then(() => console.log('✅ Redis подключен'))
    .catch(err => console.error('❌ Ошибка Redis:', err));
});

// Заглушка для поиска городов
async function searchCities(query) {
  const cities = [
    'Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань', 'Нижний Новгород',
    'Челябинск', 'Омск', 'Самара', 'Ростов-на-Дону', 'Уфа', 'Красноярск',
    'Воронеж', 'Пермь', 'Волгоград', 'Краснодар', 'Саратов', 'Тюмень',
    'Тольятти', 'Ижевск', 'Барнаул', 'Ульяновск', 'Иркутск', 'Хабаровск'
  ];
  
  return cities
    .filter(city => city.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10)
    .map(city => ({ id: city, name: city, region: 'Россия' }));
}

export default app;