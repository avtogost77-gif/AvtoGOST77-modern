# 🛠️ РУКОВОДСТВО РАЗРАБОТЧИКА

**Проект:** АвтоГОСТ77 CRM  
**Версия:** 1.0.0  
**Дата:** 26 августа 2025  

## 📋 ОБЗОР ПРОЕКТА

CRM система для логистической компании АвтоГОСТ77. Система предназначена для управления заявками, клиентами, генерации договоров и аналитики.

### 🎯 Основные цели:
- Автоматизация обработки заявок с сайта
- Управление клиентской базой
- Генерация договоров
- Аналитика и отчеты
- Мобильный интерфейс

---

## 🏗️ АРХИТЕКТУРА

### Технологический стек:
```
Backend:     Python 3.11 + FastAPI + PostgreSQL
Frontend:    React 18 + TypeScript + Tailwind CSS
Mobile:      PWA (Progressive Web App)
Deployment:  Docker + Docker Compose
Database:    PostgreSQL 15
Cache:       Redis 7
```

### Структура проекта:
```
avtogost77-crm/
├── backend/                 # Python FastAPI сервер
│   ├── app/
│   │   ├── core/           # Основные настройки
│   │   ├── models/         # Модели данных
│   │   ├── api/            # API endpoints
│   │   ├── services/       # Бизнес-логика
│   │   └── utils/          # Утилиты
│   ├── requirements.txt    # Python зависимости
│   └── Dockerfile          # Docker образ
├── frontend/               # React веб-приложение
├── mobile/                 # PWA мобильная версия
├── docker/                 # Docker конфигурация
├── docs/                   # Документация
└── scripts/               # Скрипты автоматизации
```

---

## 🚀 НАЧАЛО РАБОТЫ

### Предварительные требования:
- Docker и Docker Compose
- Python 3.11+
- Node.js 18+
- Git

### Установка и запуск:

#### 1. Клонирование репозитория:
```bash
git clone <repository-url>
cd avtogost77-crm
```

#### 2. Настройка переменных окружения:
```bash
cp docker/env.example docker/.env
# Отредактируйте .env файл с вашими настройками
```

#### 3. Запуск через Docker:
```bash
cd docker
docker-compose up -d
```

#### 4. Инициализация базы данных:
```bash
docker-compose exec backend python -c "from app.core.database import init_db; init_db()"
```

#### 5. Проверка работоспособности:
- Backend API: http://localhost:8000/docs
- Frontend: http://localhost:3000
- Health check: http://localhost:8000/health

---

## 📁 СТРУКТУРА КОДА

### Backend (Python/FastAPI):

#### Основные модули:
- **`app/core/`** - Основные настройки и конфигурация
- **`app/models/`** - Модели базы данных (SQLAlchemy)
- **`app/api/`** - API endpoints (FastAPI роутеры)
- **`app/services/`** - Бизнес-логика
- **`app/utils/`** - Утилиты и вспомогательные функции

#### Модели данных:
```python
# Основные модели
Client      # Клиенты
Lead        # Заявки
Contract    # Договоры
User        # Пользователи системы
```

#### API Endpoints:
```python
# Основные роуты
/api/auth/      # Аутентификация
/api/leads/     # Управление заявками
/api/clients/   # Управление клиентами
/api/contracts/ # Управление договорами
/api/analytics/ # Аналитика и отчеты
```

### Frontend (React/TypeScript):

#### Структура:
```
src/
├── components/     # React компоненты
├── pages/          # Страницы приложения
├── services/       # API клиент
├── utils/          # Утилиты
├── hooks/          # React hooks
└── types/          # TypeScript типы
```

#### Основные компоненты:
```jsx
<Dashboard />      # Главная панель
<LeadsList />      # Список заявок
<LeadForm />       # Форма заявки
<ClientList />     # Список клиентов
<Navigation />     # Навигация
```

---

## 🗄️ БАЗА ДАННЫХ

### Основные таблицы:

#### 1. clients (Клиенты)
```sql
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    type VARCHAR(20) DEFAULT 'individual',
    company_name VARCHAR(200),
    inn VARCHAR(12),
    address TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. leads (Заявки)
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
    is_consolidated BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    comments TEXT,
    source VARCHAR(50) DEFAULT 'website',
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

### Миграции:
```bash
# Создание миграции
alembic revision --autogenerate -m "Описание изменений"

# Применение миграций
alembic upgrade head

# Откат миграции
alembic downgrade -1
```

---

## 🔌 API ДОКУМЕНТАЦИЯ

### Аутентификация:
```python
# Получение токена
POST /api/auth/login
{
    "username": "admin",
    "password": "password"
}

# Использование токена
Authorization: Bearer <token>
```

### Основные endpoints:

#### Заявки:
```python
GET    /api/leads          # Список заявок
POST   /api/leads          # Создание заявки
GET    /api/leads/{id}     # Получение заявки
PUT    /api/leads/{id}     # Обновление заявки
DELETE /api/leads/{id}     # Удаление заявки
```

#### Клиенты:
```python
GET    /api/clients        # Список клиентов
POST   /api/clients        # Создание клиента
GET    /api/clients/{id}   # Получение клиента
PUT    /api/clients/{id}   # Обновление клиента
```

#### Договоры:
```python
GET    /api/contracts              # Список договоров
POST   /api/contracts              # Создание договора
GET    /api/contracts/{id}/pdf     # Генерация PDF
```

### Примеры запросов:

#### Создание заявки:
```python
import requests

url = "http://localhost:8000/api/leads"
data = {
    "route_from": "Москва",
    "route_to": "Санкт-Петербург",
    "cargo_weight": 1000,
    "cargo_volume": 2.5,
    "client_name": "Иван Иванов",
    "client_phone": "+79162720932"
}

response = requests.post(url, json=data)
print(response.json())
```

#### Получение списка заявок:
```python
url = "http://localhost:8000/api/leads"
params = {
    "status": "new",
    "limit": 10,
    "offset": 0
}

response = requests.get(url, params=params)
print(response.json())
```

---

## 🧪 ТЕСТИРОВАНИЕ

### Запуск тестов:
```bash
# Backend тесты
cd backend
pytest

# Frontend тесты
cd frontend
npm test

# E2E тесты
npm run test:e2e
```

### Покрытие кода:
```bash
# Backend
pytest --cov=app

# Frontend
npm run test:coverage
```

### Типы тестов:
- **Unit тесты** - тестирование отдельных функций
- **Integration тесты** - тестирование взаимодействия компонентов
- **API тесты** - тестирование endpoints
- **E2E тесты** - тестирование полного пользовательского сценария

---

## 🔧 РАЗРАБОТКА

### Стиль кода:

#### Python (Backend):
```python
# Используем Black для форматирования
black app/

# Сортировка импортов
isort app/

# Проверка стиля
flake8 app/
```

#### TypeScript (Frontend):
```typescript
// Используем Prettier для форматирования
npm run format

// Проверка типов
npm run type-check

// Линтинг
npm run lint
```

### Git workflow:
```bash
# Создание ветки для новой функции
git checkout -b feature/new-feature

# Коммиты
git add .
git commit -m "feat: добавлена новая функция"

# Пуш в репозиторий
git push origin feature/new-feature

# Создание Pull Request
```

### Коммиты:
- `feat:` - новая функция
- `fix:` - исправление бага
- `docs:` - документация
- `style:` - форматирование
- `refactor:` - рефакторинг
- `test:` - тесты
- `chore:` - обновления зависимостей

---

## 🚀 ДЕПЛОЙ

### Подготовка к продакшену:
```bash
# Сборка образов
docker-compose build

# Запуск в продакшене
docker-compose -f docker-compose.prod.yml up -d

# Проверка статуса
docker-compose ps
```

### Мониторинг:
```bash
# Логи приложения
docker-compose logs -f backend

# Логи базы данных
docker-compose logs -f postgres

# Статус сервисов
docker-compose ps
```

### Резервное копирование:
```bash
# Создание бэкапа
./scripts/backup.sh

# Восстановление
./scripts/restore.sh backup_file.sql
```

---

## 🐛 ОТЛАДКА

### Логирование:
```python
from loguru import logger

# Разные уровни логирования
logger.debug("Отладочная информация")
logger.info("Информационное сообщение")
logger.warning("Предупреждение")
logger.error("Ошибка")
logger.critical("Критическая ошибка")
```

### Отладка в IDE:
```python
# Точки останова
import pdb; pdb.set_trace()

# Или используйте breakpoint() в Python 3.7+
breakpoint()
```

### Проверка здоровья системы:
```bash
# Проверка API
curl http://localhost:8000/health

# Проверка базы данных
docker-compose exec postgres psql -U avtogost77 -d avtogost77_crm -c "SELECT 1;"

# Проверка Redis
docker-compose exec redis redis-cli ping
```

---

## 📚 РЕСУРСЫ

### Документация:
- [FastAPI документация](https://fastapi.tiangolo.com/)
- [SQLAlchemy документация](https://docs.sqlalchemy.org/)
- [React документация](https://reactjs.org/docs/)
- [TypeScript документация](https://www.typescriptlang.org/docs/)

### Полезные инструменты:
- [Postman](https://www.postman.com/) - тестирование API
- [pgAdmin](https://www.pgadmin.org/) - управление PostgreSQL
- [Redis Commander](https://github.com/joeferner/redis-commander) - управление Redis

### Сообщество:
- [FastAPI Discord](https://discord.gg/VQjKvHp)
- [React Discord](https://discord.gg/reactiflux)
- [Stack Overflow](https://stackoverflow.com/)

---

## 📞 ПОДДЕРЖКА

### Контакты:
- **Email:** avtogost77@gmail.com
- **Telegram:** @avtogost77
- **Телефон:** +7 916 272-09-32

### Полезные команды:
```bash
# Перезапуск сервисов
docker-compose restart

# Очистка кэша
docker-compose exec redis redis-cli FLUSHALL

# Проверка использования диска
docker system df

# Очистка неиспользуемых образов
docker system prune
```

---

**© 2025 АвтоГОСТ77. Руководство разработчика.**
