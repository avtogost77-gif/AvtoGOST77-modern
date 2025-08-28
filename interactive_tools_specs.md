# Технические спецификации интерактивных инструментов для avtogost77.ru

## 1. Калькулятор стоимости грузоперевозки

### 1.1 Функциональные требования

#### Входные параметры:
- **Тип перевозки:** FTL / LTL / Мультимодальная
- **Маршрут:**
  - Точка отправления (с автокомплитом)
  - Точка назначения (с автокомплитом)
  - Промежуточные точки (опционально)
- **Параметры груза:**
  - Вес (кг)
  - Объем (м³)
  - Тип груза (выпадающий список)
  - Класс опасности (если применимо)
  - Температурный режим
- **Дополнительные услуги:**
  - Страхование груза
  - Экспедирование
  - Погрузка/разгрузка
  - Паллетирование
  - Таможенное оформление
- **Сроки:**
  - Стандартная доставка
  - Экспресс-доставка
  - Точно в срок (JIT)

#### Выходные данные:
- Расчетная стоимость (диапазон)
- Ориентировочные сроки доставки
- Рекомендуемый тип транспорта
- Альтернативные варианты доставки
- График изменения цены по дням недели

### 1.2 Техническая архитектура

```javascript
// Структура frontend-компонента
const FreightCalculator = {
  components: {
    RouteSelector: {
      // Яндекс.Карты API для визуализации
      // Автокомплит городов
      // Расчет расстояния
    },
    CargoParameters: {
      // Валидация ввода
      // Расчет объемного веса
      // Подсказки по типам груза
    },
    ServiceOptions: {
      // Чекбоксы дополнительных услуг
      // Динамический пересчет стоимости
    },
    ResultsDisplay: {
      // Визуализация результатов
      // Сравнительная таблица
      // Кнопка "Оформить заявку"
    }
  }
}
```

### 1.3 Backend API

```python
# Endpoints структура
POST /api/calculate
{
  "route": {
    "from": "Moscow",
    "to": "Saint Petersburg",
    "distance": 634
  },
  "cargo": {
    "weight": 5000,
    "volume": 20,
    "type": "general"
  },
  "services": ["insurance", "loading"],
  "delivery_type": "standard"
}

# Response
{
  "calculations": [
    {
      "type": "FTL",
      "price_range": {
        "min": 45000,
        "max": 52000
      },
      "delivery_days": "1-2",
      "vehicle_type": "20t truck"
    }
  ],
  "request_id": "uuid",
  "valid_until": "2024-01-20T10:00:00Z"
}
```

### 1.4 Интеграции
- **Яндекс.Карты API:** Маршрутизация и расчет расстояний
- **DaData API:** Автокомплит адресов и городов
- **1C/CRM:** Передача лидов и сохранение расчетов
- **SMS/Email сервисы:** Отправка результатов клиенту

## 2. Онлайн-чат с AI-ассистентом

### 2.1 Сценарии диалогов

#### Приветствие:
```
Бот: Здравствуйте! Я помощник АВТОГОСТ77. 
Чем могу помочь?
- 📦 Рассчитать стоимость перевозки
- 🚚 Узнать о типах перевозок
- 📞 Связаться с менеджером
- ❓ Другой вопрос
```

#### Квалификация лида:
1. Определение типа груза
2. Уточнение маршрута
3. Выявление срочности
4. Сбор контактов

### 2.2 Технический стек

```yaml
Платформа: Carrot quest / Botpress / Custom
Интеграции:
  - CRM: Битрикс24/amoCRM
  - Мессенджеры: WhatsApp, Telegram
  - Analytics: Яндекс.Метрика события
  
NLP-функции:
  - Распознавание намерений
  - Извлечение сущностей (города, вес, тип груза)
  - Контекстная память диалога
  
Триггеры:
  - Время на странице > 30 сек
  - Просмотр страницы с ценами
  - Попытка закрыть вкладку
  - Возврат на сайт
```

### 2.3 База знаний

```json
{
  "intents": {
    "price_request": {
      "patterns": ["сколько стоит", "цена", "стоимость"],
      "response": "calculator_redirect"
    },
    "service_info": {
      "patterns": ["ftl", "ltl", "что такое"],
      "response": "knowledge_base_article"
    },
    "urgent_delivery": {
      "patterns": ["срочно", "сегодня", "завтра"],
      "response": "manager_escalation"
    }
  }
}
```

## 3. Интерактивная карта доставок

### 3.1 Функционал

#### Слои карты:
1. **Выполненные маршруты** (за последние 6 месяцев)
2. **Популярные направления** (тепловая карта)
3. **Партнерские склады и хабы**
4. **Зоны доставки по срокам**

#### Фильтры:
- Тип перевозки (FTL/LTL)
- Тип груза
- Период времени
- Стоимостной диапазон

#### Интерактивные элементы:
- Клик на маршрут → мини-кейс
- Hover → основные параметры
- Кластеризация при отдалении

### 3.2 Техническая реализация

```javascript
// Mapbox GL JS implementation
const DeliveryMap = {
  data: {
    routes: [], // GeoJSON LineString
    hubs: [],   // GeoJSON Points
    stats: {}   // Aggregated statistics
  },
  
  layers: [
    {
      id: 'completed-routes',
      type: 'line',
      paint: {
        'line-color': ['interpolate', ['linear'], ['get', 'frequency'],
          0, '#3498db',
          100, '#e74c3c'
        ],
        'line-width': ['interpolate', ['linear'], ['zoom'],
          5, 2,
          10, 4
        ]
      }
    }
  ],
  
  interactions: {
    onClick: (feature) => showCaseStudyPopup(feature),
    onHover: (feature) => showQuickStats(feature)
  }
}
```

### 3.3 Оптимизация производительности

```javascript
// Стратегии оптимизации
const OptimizationStrategies = {
  // 1. Прогрессивная загрузка данных
  dataLoading: 'viewport-based',
  
  // 2. Кластеризация маршрутов
  clustering: {
    enabled: true,
    maxZoom: 12
  },
  
  // 3. Кеширование тайлов
  caching: {
    strategy: 'localStorage',
    maxAge: 86400 // 24 hours
  },
  
  // 4. WebGL рендеринг
  renderer: 'webgl'
}
```

## 4. Личный кабинет клиента

### 4.1 Функциональные модули

#### Dashboard:
- Активные перевозки (real-time tracking)
- История заказов
- Финансовая сводка
- Быстрые действия

#### Управление заказами:
- Создание новой заявки
- Клонирование предыдущих заказов
- Шаблоны частых маршрутов
- Массовая загрузка заявок (Excel/CSV)

#### Документооборот:
- Электронные накладные
- Акты выполненных работ
- Счета и счета-фактуры
- ЭДО интеграция

#### Аналитика:
- Статистика по маршрутам
- Динамика затрат
- Сравнение периодов
- Экспорт отчетов

### 4.2 Архитектура

```typescript
// Frontend: React + TypeScript
interface DashboardState {
  user: User;
  orders: Order[];
  statistics: Statistics;
  notifications: Notification[];
}

// Backend: Node.js + Express
const routes = {
  '/api/dashboard': getDashboardData,
  '/api/orders': ordersController,
  '/api/documents': documentsController,
  '/api/analytics': analyticsController
}

// Real-time updates: WebSocket
const wsHandlers = {
  'order:status': updateOrderStatus,
  'tracking:update': updateVehiclePosition,
  'document:ready': notifyDocumentReady
}
```

## 5. Автоматизированная система лид-магнитов

### 5.1 Типы лид-магнитов

1. **"Гайд по оптимизации логистики 2024"** (PDF, 25 страниц)
2. **Excel-калькулятор сравнения FTL vs LTL**
3. **Чек-лист выбора перевозчика**
4. **Шаблоны документов для логистики**
5. **Видео-курс "Логистика для начинающих"**

### 5.2 Система дистрибуции

```javascript
// Popup logic
const LeadMagnetPopup = {
  triggers: {
    exitIntent: true,
    scrollDepth: 70,
    timeOnPage: 45,
    pageviews: 3
  },
  
  targeting: {
    excludePages: ['/calculator', '/contacts'],
    showOnce: true,
    cookieDuration: 30
  },
  
  tracking: {
    events: ['show', 'submit', 'close', 'download'],
    integration: 'GTM'
  }
}
```

### 5.3 Email-автоматизация

```yaml
Воронка после скачивания:
  День 0: 
    - Отправка лид-магнита
    - Welcome-письмо
  День 2:
    - Полезный контент по теме
    - Soft CTA на консультацию
  День 5:
    - Кейс клиента
    - Спецпредложение
  День 7:
    - Опрос удовлетворенности
    - Предложение демо
  День 14:
    - Переход в регулярную рассылку
```

## 6. A/B тестирование и оптимизация

### 6.1 Элементы для тестирования

```javascript
const ABTests = {
  calculator: {
    variants: {
      A: 'step-by-step-form',
      B: 'single-page-form'
    },
    metrics: ['completion_rate', 'time_to_complete']
  },
  
  cta_buttons: {
    variants: {
      A: 'Рассчитать стоимость',
      B: 'Получить расчет за 30 секунд'
    },
    metrics: ['click_rate', 'conversion_rate']
  },
  
  chat_triggers: {
    variants: {
      A: { delay: 30, message: 'Нужна помощь?' },
      B: { delay: 45, message: 'Ответим на любые вопросы!' }
    },
    metrics: ['engagement_rate', 'lead_quality']
  }
}
```

### 6.2 Инфраструктура тестирования

```typescript
// Google Optimize / VWO integration
interface ABTestFramework {
  experiment: {
    id: string;
    variants: Variant[];
    traffic_allocation: number;
    targeting: TargetingRules;
  };
  
  tracking: {
    goals: Goal[];
    custom_dimensions: CustomDimension[];
  };
  
  reporting: {
    confidence_level: number;
    minimum_sample_size: number;
    test_duration: number;
  };
}
```

## 7. Мониторинг и аналитика

### 7.1 Ключевые дашборды

```sql
-- Пример SQL для BI-дашборда
CREATE VIEW lead_funnel AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT session_id) as visitors,
  COUNT(DISTINCT CASE WHEN used_calculator THEN session_id END) as calculator_users,
  COUNT(DISTINCT CASE WHEN submitted_form THEN session_id END) as leads,
  COUNT(DISTINCT CASE WHEN became_client THEN session_id END) as clients
FROM user_sessions
GROUP BY DATE(created_at);
```

### 7.2 Real-time мониторинг

```javascript
// Monitoring setup
const Monitoring = {
  metrics: {
    'page_load_time': { threshold: 3000, alert: 'slack' },
    'calculator_error_rate': { threshold: 0.05, alert: 'email' },
    'chat_response_time': { threshold: 5000, alert: 'sms' },
    'api_availability': { threshold: 0.99, alert: 'pagerduty' }
  },
  
  tools: ['Sentry', 'DataDog', 'Google Analytics 4'],
  
  customEvents: {
    'calculator_completed': ['utm_source', 'cargo_type', 'route'],
    'lead_qualified': ['source', 'service_type', 'urgency'],
    'chat_escalated': ['topic', 'time_to_escalation']
  }
}
```

---

*Все технические решения должны быть адаптированы под текущую инфраструктуру сайта и интегрированы с существующими системами компании.*