# 🤖 AI-АССИСТЕНТ ДЛЯ AVTOGOST77 - ПЛАН ВНЕДРЕНИЯ

## 📋 ОГЛАВЛЕНИЕ
1. [Концепция](#концепция)
2. [Технический стек](#технический-стек)
3. [Этап 1: Локальная разработка](#этап-1-локальная-разработка)
4. [Этап 2: Обучение модели](#этап-2-обучение-модели)
5. [Этап 3: Frontend интеграция](#этап-3-frontend-интеграция)
6. [Этап 4: Backend API](#этап-4-backend-api)
7. [Этап 5: Deployment](#этап-5-deployment)
8. [Этап 6: Мониторинг и улучшение](#этап-6-мониторинг-и-улучшение)

---

## 🎯 КОНЦЕПЦИЯ

### Что делаем:
Создаём НАСТОЯЩЕГО AI-ассистента для сайта (не фейковый чат с заготовленными ответами), который:
- ✅ Отвечает на вопросы о тарифах и услугах
- ✅ Рассчитывает стоимость доставки
- ✅ Помогает выбрать тип транспорта
- ✅ Консультирует по срокам и маршрутам
- ✅ Обрабатывает сложные запросы
- ✅ Запоминает контекст разговора

### Почему это круто:
- 🚀 Первый честный AI в логистике
- 💰 Бесплатно (open source модели)
- 🔒 Данные остаются у нас (self-hosted)
- ⚡ Быстрые ответы (локальная модель)
- 🎯 Точные ответы (обучен на наших данных)

---

## 🛠️ ТЕХНИЧЕСКИЙ СТЕК

### Backend:
- **Ollama** - запуск LLM моделей
- **Llama 2/3** или **Mistral** - языковые модели
- **Node.js/Express** или **Python/FastAPI** - API сервер
- **Redis** - кеширование ответов
- **PostgreSQL** - история чатов

### Frontend:
- **Vanilla JS** - виджет чата (без зависимостей)
- **WebSocket** - real-time общение
- **CSS** - адаптивный дизайн

### DevOps:
- **Docker** - контейнеризация
- **Nginx** - reverse proxy
- **PM2** - process manager
- **Grafana** - мониторинг

---

## 📝 ЭТАП 1: ЛОКАЛЬНАЯ РАЗРАБОТКА

### 1.1 Установка Ollama (если ещё не установлен)

```bash
# Linux/Mac
curl -fsSL https://ollama.ai/install.sh | sh

# Проверка установки
ollama --version

# Запуск сервиса
ollama serve
```

### 1.2 Загрузка моделей

```bash
# Базовая модель (7B параметров, ~4GB)
ollama pull llama2:7b-chat

# Или Mistral (быстрее, меньше)
ollama pull mistral

# Русскоязычная модель (если найдём)
ollama pull saiga-mistral:7b

# Проверка загруженных моделей
ollama list
```

### 1.3 Тестирование модели

```bash
# Интерактивный режим
ollama run llama2

# API тест
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2",
    "prompt": "Сколько стоит доставка газелью из Москвы в Санкт-Петербург?",
    "stream": false
  }'
```

### 1.4 Создание тестового окружения

```bash
# Структура проекта
mkdir avtogost-ai-assistant
cd avtogost-ai-assistant

# Директории
mkdir -p {backend,frontend,data,scripts,docs}

# Инициализация
npm init -y
git init
```

---

## 🧠 ЭТАП 2: ОБУЧЕНИЕ МОДЕЛИ

### 2.1 Подготовка данных о компании

Создаём файл `data/company-knowledge.json`:

```json
{
  "company": {
    "name": "АвтоГОСТ77",
    "description": "Транспортная компания, специализирующаяся на грузоперевозках",
    "philosophy": "Пока вы отдыхаете - мы доставляем",
    "contacts": {
      "phone": "+7 (916) 123-45-67",
      "whatsapp": "+7 (916) 123-45-67",
      "email": "avtogost77@gmail.com"
    }
  },
  "services": [
    {
      "name": "Грузоперевозки по Москве",
      "description": "Доставка грузов по Москве и области",
      "vehicles": ["Газель", "5-тонник", "10-тонник", "20-тонник"],
      "base_price": 1200,
      "price_per_km": 40
    },
    {
      "name": "Межгород",
      "routes": [
        {
          "from": "Москва",
          "to": "Санкт-Петербург",
          "distance": 700,
          "duration": "8-10 часов",
          "prices": {
            "gazelle": 15000,
            "5t": 25000,
            "20t": 45000
          }
        },
        {
          "from": "Москва",
          "to": "Нижний Новгород",
          "distance": 420,
          "duration": "5-6 часов",
          "prices": {
            "gazelle": 9000,
            "5t": 15000,
            "20t": 28000
          }
        }
      ]
    }
  ],
  "faq": [
    {
      "question": "Как быстро подаётся машина?",
      "answer": "В пределах Москвы - от 2 часов. Для межгорода - обычно на следующий день."
    },
    {
      "question": "Есть ли грузчики?",
      "answer": "Да, услуги грузчиков оплачиваются отдельно - 500₽/час за человека."
    }
  ]
}
```

### 2.2 Создание промпт-инженеринга

Файл `data/system-prompt.txt`:

```text
Ты - AI-консультант транспортной компании АвтоГОСТ77. 

ВАЖНЫЕ ПРАВИЛА:
1. Отвечай только на вопросы, связанные с грузоперевозками и услугами компании
2. Используй только проверенную информацию из базы знаний
3. Если не знаешь точного ответа - предложи связаться с менеджером
4. Будь вежлив и профессионален
5. Отвечай кратко и по существу
6. НЕ придумывай цены и условия
7. НЕ обещай того, чего нет в базе знаний

СТИЛЬ ОБЩЕНИЯ:
- Дружелюбный, но профессиональный
- Используй "вы" при обращении
- Избегай сложных терминов
- Давай практические советы

БАЗА ЗНАНИЙ:
[Здесь будет вставлена информация из company-knowledge.json]

Отвечай на русском языке.
```

### 2.3 Fine-tuning модели (опционально)

```python
# scripts/prepare_training_data.py
import json

def prepare_training_data():
    """Подготовка данных для fine-tuning"""
    
    training_examples = [
        {
            "instruction": "Сколько стоит доставка из Москвы в СПБ?",
            "input": "",
            "output": "Стоимость доставки из Москвы в Санкт-Петербург:\n- Газель: от 15,000₽\n- 5-тонник: от 25,000₽\n- 20-тонник: от 45,000₽\nВремя в пути: 8-10 часов."
        },
        {
            "instruction": "Как быстро можете подать машину?",
            "input": "Нужна газель в пределах МКАД",
            "output": "В пределах Москвы газель подаём от 2 часов. Точное время зависит от загруженности и вашего района. Могу помочь оформить заявку прямо сейчас!"
        }
    ]
    
    with open('data/training_data.jsonl', 'w', encoding='utf-8') as f:
        for example in training_examples:
            f.write(json.dumps(example, ensure_ascii=False) + '\n')

if __name__ == "__main__":
    prepare_training_data()
```

---

## 🎨 ЭТАП 3: FRONTEND ИНТЕГРАЦИЯ

### 3.1 Виджет чата

Файл `frontend/chat-widget.js`:

```javascript
// AI Chat Widget для АвтоГОСТ77
class AvtoGostAIChat {
    constructor(config = {}) {
        this.config = {
            apiUrl: config.apiUrl || 'http://localhost:3000/api/chat',
            position: config.position || 'bottom-right',
            primaryColor: config.primaryColor || '#FF6B00',
            ...config
        };
        
        this.messages = [];
        this.isOpen = false;
        this.init();
    }
    
    init() {
        this.createStyles();
        this.createHTML();
        this.attachEvents();
        this.addWelcomeMessage();
    }
    
    createStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .ai-chat-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                z-index: 9999;
            }
            
            .ai-chat-button {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: ${this.config.primaryColor};
                color: white;
                border: none;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.3s;
            }
            
            .ai-chat-button:hover {
                transform: scale(1.1);
            }
            
            .ai-chat-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 380px;
                height: 600px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 5px 40px rgba(0,0,0,0.16);
                display: none;
                flex-direction: column;
                overflow: hidden;
            }
            
            .ai-chat-window.open {
                display: flex;
                animation: slideUp 0.3s ease-out;
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .ai-chat-header {
                background: ${this.config.primaryColor};
                color: white;
                padding: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            
            .ai-chat-messages {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                background: #f5f5f5;
            }
            
            .ai-message {
                margin-bottom: 16px;
                display: flex;
                gap: 12px;
                animation: fadeIn 0.3s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .ai-message.user {
                flex-direction: row-reverse;
            }
            
            .ai-message-content {
                max-width: 70%;
                padding: 12px 16px;
                border-radius: 16px;
                background: white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            }
            
            .ai-message.user .ai-message-content {
                background: ${this.config.primaryColor};
                color: white;
            }
            
            .ai-message-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: #e0e0e0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 18px;
            }
            
            .ai-chat-input-wrapper {
                padding: 20px;
                background: white;
                border-top: 1px solid #e0e0e0;
            }
            
            .ai-chat-input {
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #e0e0e0;
                border-radius: 24px;
                outline: none;
                font-size: 14px;
                transition: border-color 0.3s;
            }
            
            .ai-chat-input:focus {
                border-color: ${this.config.primaryColor};
            }
            
            .ai-typing-indicator {
                display: none;
                padding: 12px 16px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                width: fit-content;
            }
            
            .ai-typing-indicator.show {
                display: block;
            }
            
            .ai-typing-indicator span {
                display: inline-block;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #999;
                margin: 0 2px;
                animation: typing 1.4s infinite;
            }
            
            .ai-typing-indicator span:nth-child(2) {
                animation-delay: 0.2s;
            }
            
            .ai-typing-indicator span:nth-child(3) {
                animation-delay: 0.4s;
            }
            
            @keyframes typing {
                0%, 80%, 100% {
                    transform: scale(1);
                    opacity: 0.5;
                }
                40% {
                    transform: scale(1.3);
                    opacity: 1;
                }
            }
            
            @media (max-width: 480px) {
                .ai-chat-window {
                    width: 100vw;
                    height: 100vh;
                    bottom: 0;
                    right: 0;
                    border-radius: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    createHTML() {
        const widget = document.createElement('div');
        widget.className = 'ai-chat-widget';
        widget.innerHTML = `
            <button class="ai-chat-button" aria-label="Открыть чат">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            </button>
            
            <div class="ai-chat-window">
                <div class="ai-chat-header">
                    <div>
                        <h3 style="margin: 0; font-size: 18px;">AI Консультант</h3>
                        <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.9;">АвтоГОСТ77</p>
                    </div>
                    <button class="ai-chat-close" style="background: none; border: none; color: white; cursor: pointer; padding: 8px;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                
                <div class="ai-chat-messages" id="ai-chat-messages">
                    <div class="ai-typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                
                <div class="ai-chat-input-wrapper">
                    <input 
                        type="text" 
                        class="ai-chat-input" 
                        placeholder="Введите ваш вопрос..."
                        aria-label="Введите сообщение"
                    >
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        
        // Сохраняем ссылки на элементы
        this.widget = widget;
        this.button = widget.querySelector('.ai-chat-button');
        this.window = widget.querySelector('.ai-chat-window');
        this.closeBtn = widget.querySelector('.ai-chat-close');
        this.messagesContainer = widget.querySelector('.ai-chat-messages');
        this.input = widget.querySelector('.ai-chat-input');
        this.typingIndicator = widget.querySelector('.ai-typing-indicator');
    }
    
    attachEvents() {
        // Открытие/закрытие чата
        this.button.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Отправка сообщения
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Закрытие по клику вне окна
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.widget.contains(e.target)) {
                this.close();
            }
        });
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        this.isOpen = true;
        this.window.classList.add('open');
        this.input.focus();
        
        // Аналитика
        if (window.gtag) {
            gtag('event', 'chat_opened', {
                event_category: 'AI Chat',
                event_label: 'Widget Opened'
            });
        }
    }
    
    close() {
        this.isOpen = false;
        this.window.classList.remove('open');
    }
    
    addWelcomeMessage() {
        this.addMessage({
            text: 'Здравствуйте! Я AI-консультант АвтоГОСТ77. Могу помочь с расчётом стоимости доставки, выбором транспорта и ответить на вопросы о наших услугах. Чем могу помочь?',
            isUser: false
        });
    }
    
    addMessage({ text, isUser = false }) {
        const message = document.createElement('div');
        message.className = `ai-message ${isUser ? 'user' : 'ai'}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'ai-message-avatar';
        avatar.textContent = isUser ? '👤' : '🤖';
        
        const content = document.createElement('div');
        content.className = 'ai-message-content';
        content.textContent = text;
        
        message.appendChild(avatar);
        message.appendChild(content);
        
        // Вставляем перед индикатором печати
        this.messagesContainer.insertBefore(message, this.typingIndicator);
        
        // Скроллим вниз
        this.scrollToBottom();
        
        // Сохраняем в историю
        this.messages.push({ text, isUser, timestamp: new Date() });
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    showTyping() {
        this.typingIndicator.classList.add('show');
        this.scrollToBottom();
    }
    
    hideTyping() {
        this.typingIndicator.classList.remove('show');
    }
    
    async sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;
        
        // Добавляем сообщение пользователя
        this.addMessage({ text, isUser: true });
        
        // Очищаем input
        this.input.value = '';
        
        // Показываем индикатор печати
        this.showTyping();
        
        try {
            // Отправляем запрос к API
            const response = await fetch(this.config.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: text,
                    context: this.messages.slice(-5) // последние 5 сообщений для контекста
                })
            });
            
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            
            const data = await response.json();
            
            // Скрываем индикатор печати
            this.hideTyping();
            
            // Добавляем ответ AI
            this.addMessage({ text: data.response });
            
            // Аналитика
            if (window.gtag) {
                gtag('event', 'chat_message_sent', {
                    event_category: 'AI Chat',
                    event_label: 'User Message'
                });
            }
            
        } catch (error) {
            this.hideTyping();
            this.addMessage({ 
                text: 'Извините, произошла ошибка. Пожалуйста, позвоните нам: +7 (916) 123-45-67' 
            });
            console.error('Chat error:', error);
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    window.avtoGostChat = new AvtoGostAIChat({
        apiUrl: '/api/chat',
        primaryColor: '#FF6B00'
    });
});
```

### 3.2 Интеграция на сайт

Добавляем в `index.html` перед `</body>`:

```html
<!-- AI Chat Widget -->
<script src="/assets/js/ai-chat-widget.js" defer></script>
```

---

## 🔧 ЭТАП 4: BACKEND API

### 4.1 Node.js API сервер

Файл `backend/server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const Redis = require('redis');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Redis для кеширования
const redis = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100 // максимум 100 запросов
});
app.use('/api/chat', limiter);

// Загрузка базы знаний
const companyKnowledge = require('../data/company-knowledge.json');
const systemPrompt = require('fs').readFileSync('../data/system-prompt.txt', 'utf-8');

// Утилита для создания промпта
function createPrompt(userMessage, context = []) {
    let prompt = systemPrompt.replace('[KNOWLEDGE_BASE]', JSON.stringify(companyKnowledge));
    
    // Добавляем контекст предыдущих сообщений
    if (context.length > 0) {
        prompt += '\n\nПРЕДЫДУЩИЙ ДИАЛОГ:\n';
        context.forEach(msg => {
            prompt += `${msg.isUser ? 'Клиент' : 'Консультант'}: ${msg.text}\n`;
        });
    }
    
    prompt += `\nКлиент: ${userMessage}\nКонсультант:`;
    
    return prompt;
}

// Основной эндпоинт чата
app.post('/api/chat', async (req, res) => {
    try {
        const { message, context = [] } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: 'Сообщение не может быть пустым' });
        }
        
        // Проверяем кеш
        const cacheKey = `chat:${message}`;
        const cached = await redis.get(cacheKey);
        if (cached) {
            return res.json({ response: cached });
        }
        
        // Создаём промпт
        const prompt = createPrompt(message, context);
        
        // Запрос к Ollama
        const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
            model: 'llama2',
            prompt: prompt,
            stream: false,
            options: {
                temperature: 0.7,
                top_p: 0.9,
                max_tokens: 500
            }
        });
        
        const aiResponse = ollamaResponse.data.response;
        
        // Кешируем ответ на 1 час
        await redis.setex(cacheKey, 3600, aiResponse);
        
        // Логирование для аналитики
        console.log({
            timestamp: new Date(),
            userMessage: message,
            aiResponse: aiResponse.substring(0, 100) + '...'
        });
        
        res.json({ response: aiResponse });
        
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ 
            error: 'Произошла ошибка. Пожалуйста, попробуйте позже или позвоните нам.' 
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`AI Chat API running on port ${PORT}`);
});
```

### 4.2 Docker конфигурация

Файл `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем код
COPY . .

# Запускаем приложение
CMD ["node", "server.js"]

EXPOSE 3000
```

### 4.3 Docker Compose для всего стека

Файл `docker-compose.yml`:

```yaml
version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama_data:/root/.ollama
    ports:
      - "11434:11434"
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
  
  api:
    build: ./backend
    depends_on:
      - ollama
      - redis
    environment:
      - REDIS_URL=redis://redis:6379
      - OLLAMA_URL=http://ollama:11434
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./frontend:/usr/share/nginx/html
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api

volumes:
  ollama_data:
  redis_data:
```

---

## 🚀 ЭТАП 5: DEPLOYMENT

### 5.1 Подготовка сервера

```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Docker
curl -fsSL https://get.docker.com | sh

# Устанавливаем Docker Compose
sudo apt install docker-compose -y

# Добавляем пользователя в группу docker
sudo usermod -aG docker $USER

# Устанавливаем Nginx (если не используем Docker)
sudo apt install nginx -y
```

### 5.2 Настройка Nginx

Файл `nginx.conf`:

```nginx
server {
    listen 80;
    server_name avtogost77.ru;
    
    # Статика
    location / {
        root /var/www/avtogost77.ru;
        try_files $uri $uri/ /index.html;
    }
    
    # API прокси
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # CORS
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Content-Type';
    }
    
    # WebSocket для real-time чата
    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 5.3 Systemd сервис

Файл `/etc/systemd/system/avtogost-ai.service`:

```ini
[Unit]
Description=AvtoGOST AI Assistant
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/avtogost-ai
ExecStart=/usr/bin/docker-compose up
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 5.4 Деплой скрипт

Файл `scripts/deploy.sh`:

```bash
#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Начинаем деплой AI Assistant...${NC}"

# Останавливаем текущие контейнеры
echo "Останавливаем старые контейнеры..."
docker-compose down

# Обновляем код
echo "Обновляем код из Git..."
git pull origin main

# Собираем новые образы
echo "Собираем Docker образы..."
docker-compose build

# Запускаем контейнеры
echo "Запускаем контейнеры..."
docker-compose up -d

# Проверяем статус
sleep 5
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ AI Assistant успешно запущен!${NC}"
else
    echo -e "${RED}❌ Ошибка запуска! Проверьте логи.${NC}"
    docker-compose logs
    exit 1
fi

echo -e "${GREEN}🎉 Деплой завершён!${NC}"
```

---

## 📊 ЭТАП 6: МОНИТОРИНГ И УЛУЧШЕНИЕ

### 6.1 Логирование и аналитика

Файл `backend/analytics.js`:

```javascript
const fs = require('fs');
const path = require('path');

class ChatAnalytics {
    constructor() {
        this.logFile = path.join(__dirname, '../logs/chat-analytics.log');
    }
    
    logInteraction(data) {
        const entry = {
            timestamp: new Date().toISOString(),
            ...data
        };
        
        fs.appendFileSync(this.logFile, JSON.stringify(entry) + '\n');
    }
    
    async generateReport() {
        // Читаем логи
        const logs = fs.readFileSync(this.logFile, 'utf-8')
            .split('\n')
            .filter(line => line)
            .map(line => JSON.parse(line));
        
        // Анализируем
        const report = {
            totalInteractions: logs.length,
            uniqueUsers: new Set(logs.map(l => l.userId)).size,
            popularQuestions: this.getPopularQuestions(logs),
            averageResponseTime: this.getAverageResponseTime(logs),
            satisfactionRate: this.getSatisfactionRate(logs)
        };
        
        return report;
    }
    
    getPopularQuestions(logs) {
        const questions = {};
        logs.forEach(log => {
            const q = log.userMessage.toLowerCase();
            questions[q] = (questions[q] || 0) + 1;
        });
        
        return Object.entries(questions)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
    }
    
    getAverageResponseTime(logs) {
        const times = logs.map(l => l.responseTime).filter(t => t);
        return times.reduce((a, b) => a + b, 0) / times.length;
    }
    
    getSatisfactionRate(logs) {
        const satisfied = logs.filter(l => l.feedback === 'positive').length;
        return (satisfied / logs.length) * 100;
    }
}

module.exports = ChatAnalytics;
```

### 6.2 A/B тестирование

```javascript
// Тестируем разные модели и промпты
const experiments = {
    'model-test': {
        variants: ['llama2', 'mistral', 'vicuna'],
        allocation: [0.33, 0.33, 0.34]
    },
    'prompt-style': {
        variants: ['formal', 'friendly', 'casual'],
        allocation: [0.25, 0.50, 0.25]
    }
};

function selectVariant(experimentName, userId) {
    const experiment = experiments[experimentName];
    const hash = simpleHash(userId + experimentName);
    const random = hash / 0xFFFFFFFF;
    
    let cumulative = 0;
    for (let i = 0; i < experiment.variants.length; i++) {
        cumulative += experiment.allocation[i];
        if (random < cumulative) {
            return experiment.variants[i];
        }
    }
    
    return experiment.variants[0];
}
```

### 6.3 Continuous Learning

```python
# scripts/improve_model.py
import json
from datetime import datetime, timedelta

def analyze_failed_interactions():
    """Анализируем неудачные взаимодействия для улучшения модели"""
    
    with open('../logs/chat-analytics.log', 'r') as f:
        logs = [json.loads(line) for line in f if line.strip()]
    
    # Находим вопросы без ответа
    failed = []
    for log in logs:
        if 'не могу ответить' in log.get('aiResponse', '').lower() or \
           'свяжитесь с менеджером' in log.get('aiResponse', '').lower():
            failed.append({
                'question': log['userMessage'],
                'timestamp': log['timestamp']
            })
    
    # Группируем похожие вопросы
    grouped = group_similar_questions(failed)
    
    # Генерируем рекомендации
    recommendations = []
    for group in grouped:
        if len(group) > 3:  # Если вопрос встречается часто
            recommendations.append({
                'question_pattern': group[0]['question'],
                'frequency': len(group),
                'recommendation': 'Добавить в базу знаний'
            })
    
    return recommendations

def update_knowledge_base(new_entries):
    """Обновляем базу знаний новыми записями"""
    
    with open('../data/company-knowledge.json', 'r') as f:
        knowledge = json.load(f)
    
    # Добавляем новые FAQ
    for entry in new_entries:
        knowledge['faq'].append({
            'question': entry['question'],
            'answer': entry['answer'],
            'added_date': datetime.now().isoformat(),
            'added_by': 'auto-improvement'
        })
    
    # Сохраняем
    with open('../data/company-knowledge.json', 'w') as f:
        json.dump(knowledge, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Добавлено {len(new_entries)} новых записей в базу знаний")

if __name__ == "__main__":
    # Анализируем каждую неделю
    recommendations = analyze_failed_interactions()
    print(f"Найдено {len(recommendations)} рекомендаций для улучшения")
    
    # Автоматически добавляем очевидные случаи
    # Остальные отправляем на ревью
```

---

## 🎯 МЕТРИКИ УСПЕХА

### KPI для AI-ассистента:

1. **Технические метрики:**
   - Время ответа < 2 секунды
   - Доступность > 99.9%
   - Точность ответов > 85%

2. **Бизнес-метрики:**
   - Конверсия из чата в заявку > 15%
   - Снижение нагрузки на менеджеров на 40%
   - Удовлетворённость клиентов > 4.5/5

3. **Юзабилити метрики:**
   - Среднее время сессии > 3 минут
   - Количество сообщений за сессию > 5
   - Процент возвратов < 20%

---

## 🔒 БЕЗОПАСНОСТЬ

### Важные моменты:

1. **Ограничение доступа:**
   ```nginx
   location /api/ {
       # Только с нашего домена
       valid_referers none blocked avtogost77.ru *.avtogost77.ru;
       if ($invalid_referer) {
           return 403;
       }
   }
   ```

2. **Валидация входных данных:**
   ```javascript
   // Очистка пользовательского ввода
   function sanitizeInput(input) {
       return input
           .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
           .replace(/[<>]/g, '')
           .trim()
           .substring(0, 500); // максимум 500 символов
   }
   ```

3. **Защита от prompt injection:**
   ```javascript
   // Проверяем на попытки взлома
   const blacklist = [
       'ignore previous instructions',
       'system prompt',
       'reveal instructions',
       'act as',
       'pretend you are'
   ];
   
   if (blacklist.some(phrase => message.toLowerCase().includes(phrase))) {
       return res.status(400).json({ error: 'Недопустимый запрос' });
   }
   ```

---

## 📝 ЧЕКЛИСТ ЗАПУСКА

### Перед запуском проверить:

- [ ] Ollama установлен и работает
- [ ] Модель загружена и отвечает
- [ ] Redis запущен
- [ ] API сервер стартует без ошибок
- [ ] Виджет появляется на сайте
- [ ] Сообщения отправляются и получают ответы
- [ ] Логирование работает
- [ ] SSL сертификат настроен
- [ ] Backup стратегия готова
- [ ] Мониторинг настроен

---

## 🎉 РЕЗУЛЬТАТ

Поздравляю! У тебя теперь есть:
- ✅ Настоящий AI-консультант (не фейк!)
- ✅ Работает 24/7 без выходных
- ✅ Отвечает на русском языке
- ✅ Знает всё о твоей компании
- ✅ Постоянно обучается
- ✅ Полностью под твоим контролем
- ✅ Бесплатно (кроме хостинга)

**Первый в рунете честный AI-ассистент для логистики!** 🚀

---

## 📞 ПОДДЕРЖКА

Если что-то пошло не так:
1. Проверь логи: `docker-compose logs -f`
2. Проверь статус Ollama: `curl http://localhost:11434/api/tags`
3. Проверь API: `curl http://localhost:3000/api/health`
4. Пиши в наш чат - поможем! 😊

---

*Документ создан с любовью к AI и логистике. Пока конкуренты платят за ChatGPT API, ты запускаешь своего AI бесплатно!* 💪