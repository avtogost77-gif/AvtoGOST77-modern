# 🚛 АвтоГОСТ77 CRM - Система управления заявками

**Версия:** 1.0.0  
**Дата создания:** 26 августа 2025  
**Статус:** В разработке  

## 📋 ОПИСАНИЕ ПРОЕКТА

CRM система для логистической компании АвтоГОСТ77. Предназначена для управления заявками, клиентами, генерации договоров и аналитики.

### 🎯 ЦЕЛИ ПРОЕКТА
- Автоматизация обработки заявок с сайта
- Управление клиентской базой
- Генерация договоров
- Аналитика и отчеты
- Мобильный интерфейс для работы в дороге

### 👥 ЦЕЛЕВАЯ АУДИТОРИЯ
- **Основной пользователь:** Владелец компании (1 человек)
- **Планируется:** Менеджеры, водители, бухгалтеры (3-5 человек)

### 📊 ОБЪЕМЫ ДАННЫХ
- **Заявки в день:** 5-20
- **Клиентов:** ~100-500
- **Маршрутов:** ~50 основных направлений

## 🏗️ АРХИТЕКТУРА СИСТЕМЫ

### Технологический стек:
```
Backend:     Python 3.11 + FastAPI + PostgreSQL
Frontend:    React 18 + TypeScript + Tailwind CSS
Mobile:      PWA (Progressive Web App)
Deployment:  Docker + Docker Compose
Server:      VPS (193.160.208.183)
```

### Структура проекта:
```
avtogost77-crm/
├── backend/                 # Python FastAPI сервер
│   ├── app/
│   │   ├── models/         # Модели базы данных
│   │   ├── api/            # API endpoints
│   │   ├── services/       # Бизнес-логика
│   │   ├── utils/          # Утилиты
│   │   └── main.py         # Точка входа
│   ├── requirements.txt    # Python зависимости
│   └── Dockerfile          # Docker образ
├── frontend/               # React веб-приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Страницы
│   │   ├── services/       # API клиент
│   │   └── utils/          # Утилиты
│   ├── package.json        # Node.js зависимости
│   └── Dockerfile          # Docker образ
├── mobile/                 # PWA мобильная версия
│   ├── src/
│   └── public/
├── docker/                 # Docker конфигурация
│   ├── docker-compose.yml  # Основной compose
│   ├── nginx.conf          # Nginx конфигурация
│   └── .env.example        # Пример переменных
├── docs/                   # Документация
│   ├── api.md             # API документация
│   ├── deployment.md      # Инструкции по деплою
│   └── user-guide.md      # Руководство пользователя
└── scripts/               # Скрипты автоматизации
    ├── deploy.sh          # Скрипт деплоя
    ├── backup.sh          # Скрипт резервного копирования
    └── migrate.sh         # Скрипт миграций БД
```

## 🗄️ СТРУКТУРА БАЗЫ ДАННЫХ

### Основные таблицы:

#### 1. leads (Заявки)
```sql
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clients(id),
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    route_from VARCHAR(100) NOT NULL,
    route_to VARCHAR(100) NOT NULL,
    cargo_weight DECIMAL(10,2),
    cargo_volume DECIMAL(10,2),
    price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    comments TEXT,
    source VARCHAR(50) DEFAULT 'website'
);
```

#### 2. clients (Клиенты)
```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    type VARCHAR(20) DEFAULT 'individual', -- individual, ip, ooo
    company_name VARCHAR(200),
    inn VARCHAR(12),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. contracts (Договоры)
```sql
CREATE TABLE contracts (
    id SERIAL PRIMARY KEY,
    lead_id INTEGER REFERENCES leads(id),
    client_id INTEGER REFERENCES clients(id),
    contract_number VARCHAR(50) UNIQUE,
    status VARCHAR(50) DEFAULT 'draft',
    total_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT NOW(),
    signed_at TIMESTAMP,
    file_path VARCHAR(500)
);
```

## 🔌 API ENDPOINTS

### Заявки:
- `GET /api/leads` - Список заявок
- `POST /api/leads` - Создание заявки
- `GET /api/leads/{id}` - Получение заявки
- `PUT /api/leads/{id}` - Обновление заявки
- `DELETE /api/leads/{id}` - Удаление заявки

### Клиенты:
- `GET /api/clients` - Список клиентов
- `POST /api/clients` - Создание клиента
- `GET /api/clients/{id}` - Получение клиента
- `PUT /api/clients/{id}` - Обновление клиента

### Договоры:
- `GET /api/contracts` - Список договоров
- `POST /api/contracts` - Создание договора
- `GET /api/contracts/{id}/pdf` - Генерация PDF

### Аналитика:
- `GET /api/analytics/dashboard` - Данные дашборда
- `GET /api/analytics/reports` - Отчеты

## 🚀 ПЛАН РАЗРАБОТКИ

### Этап 1: MVP (Неделя 1-2)
- [ ] Базовая структура проекта
- [ ] Настройка Docker окружения
- [ ] Создание моделей БД
- [ ] Базовые API endpoints
- [ ] Простой веб-интерфейс
- [ ] Интеграция с сайтом

### Этап 2: Основной функционал (Неделя 3-4)
- [ ] Управление клиентами
- [ ] Статусы заявок
- [ ] Поиск и фильтры
- [ ] Базовые отчеты
- [ ] PWA мобильная версия

### Этап 3: Автоматизация (Неделя 5-6)
- [ ] Telegram уведомления
- [ ] Генератор договоров
- [ ] Калькулятор цен
- [ ] Аналитика и дашборд

### Этап 4: Полировка (Неделя 7-8)
- [ ] UI/UX улучшения
- [ ] Оптимизация производительности
- [ ] Тестирование
- [ ] Документация
- [ ] Деплой на продакшн

## 🔧 ТРЕБОВАНИЯ К СИСТЕМЕ

### Минимальные требования:
- **CPU:** 2 ядра
- **RAM:** 4 GB
- **Storage:** 20 GB
- **OS:** Ubuntu 20.04+

### Рекомендуемые требования:
- **CPU:** 4 ядра
- **RAM:** 8 GB
- **Storage:** 50 GB SSD
- **OS:** Ubuntu 22.04 LTS

## 📱 МОБИЛЬНАЯ ВЕРСИЯ

### PWA (Progressive Web App):
- Устанавливается на телефон
- Работает офлайн
- Push уведомления
- Быстрый доступ к основным функциям

### Основные функции:
- Просмотр заявок
- Изменение статусов
- Добавление комментариев
- Голосовой ввод
- Быстрые действия

## 🔐 БЕЗОПАСНОСТЬ

### Аутентификация:
- JWT токены
- Сессии
- Роли пользователей

### Защита данных:
- HTTPS
- Валидация входных данных
- SQL injection защита
- XSS защита

## 📊 МОНИТОРИНГ И ЛОГИ

### Логирование:
- Логи API запросов
- Логи ошибок
- Логи пользователей

### Мониторинг:
- Статус сервисов
- Производительность
- Использование ресурсов

## 🔄 РЕЗЕРВНОЕ КОПИРОВАНИЕ

### Автоматические бэкапы:
- База данных: ежедневно
- Файлы: еженедельно
- Конфигурация: при изменениях

### Восстановление:
- Скрипты восстановления
- Документация процедур
- Тестирование восстановления

## 📞 ПОДДЕРЖКА

### Контакты:
- **Email:** avtogost77@gmail.com
- **Telegram:** @avtogost77
- **Телефон:** +7 916 272-09-32

### Документация:
- [API документация](docs/api.md)
- [Руководство пользователя](docs/user-guide.md)
- [Инструкции по деплою](docs/deployment.md)

---

**© 2025 АвтоГОСТ77. Все права защищены.**