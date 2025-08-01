// ========================================
// AI Chat Assistant
// ========================================

let chatHistory = [];
let isTyping = false;

// Open AI Chat
function openAIChat() {
    const overlay = document.getElementById('aiChatOverlay');
    if (overlay) {
        overlay.classList.add('active');
        
        // Focus input
        setTimeout(() => {
            document.getElementById('chatInput')?.focus();
        }, 300);
        
        // Initialize chat if first time
        if (chatHistory.length === 0) {
            addAIMessage('Привет! Я ваш персональный AI-логист. Чем могу помочь?', true);
        }
    }
}

// Close AI Chat
function closeAIChat() {
    const overlay = document.getElementById('aiChatOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Handle chat enter key
function handleChatEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }
}

// Send chat message
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (!input || !input.value.trim() || isTyping) return;
    
    const message = input.value.trim();
    input.value = '';
    
    // Add user message
    addUserMessage(message);
    
    // Process message
    processUserMessage(message);
}

// Add user message to chat
function addUserMessage(message) {
    const messagesDiv = document.getElementById('chatMessages');
    if (!messagesDiv) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';
    messageDiv.innerHTML = `<p>${escapeHtml(message)}</p>`;
    
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    
    chatHistory.push({ role: 'user', content: message });
}

// Add AI message to chat
function addAIMessage(message, withQuickReplies = false) {
    const messagesDiv = document.getElementById('chatMessages');
    if (!messagesDiv) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message ai';
    
    let html = `<p>${message}</p>`;
    
    if (withQuickReplies) {
        html += `
            <div class="quick-replies">
                <button onclick="sendQuickReply('Рассчитать стоимость')">💰 Рассчитать стоимость</button>
                <button onclick="sendQuickReply('Срочная доставка')">🚨 Срочная доставка</button>
                <button onclick="sendQuickReply('Консультация')">💬 Консультация</button>
            </div>
        `;
    }
    
    messageDiv.innerHTML = html;
    
    // Add typing animation
    messageDiv.style.opacity = '0';
    messagesDiv.appendChild(messageDiv);
    
    // Show typing indicator
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        messageDiv.style.opacity = '1';
        messageDiv.style.transition = 'opacity 0.3s ease';
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 1000);
    
    chatHistory.push({ role: 'assistant', content: message });
}

// Process user message
function processUserMessage(message) {
    isTyping = true;
    
    // Simulate AI processing delay
    setTimeout(() => {
        const response = generateAIResponse(message);
        addAIMessage(response);
        isTyping = false;
    }, 1500);
}

// Generate AI response based on message
function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Price/calculator keywords
    if (lowerMessage.includes('цен') || lowerMessage.includes('стоимост') || 
        lowerMessage.includes('сколько') || lowerMessage.includes('тариф') ||
        lowerMessage.includes('рассчит')) {
        return 'Для расчета стоимости мне нужно знать:\n' +
               '📍 Откуда и куда везем\n' +
               '📦 Вес и объем груза\n' +
               '🚛 Тип груза\n\n' +
               'Вы можете воспользоваться нашим AI-калькулятором или просто напишите эти данные здесь.';
    }
    
    // Urgent delivery
    if (lowerMessage.includes('срочн') || lowerMessage.includes('быстр') || 
        lowerMessage.includes('сегодня') || lowerMessage.includes('2 часа')) {
        return '🚨 Срочная доставка - наша специализация!\n\n' +
               '⚡ Подача транспорта за 2 часа в Москве\n' +
               '💯 Гарантия подачи\n' +
               '📞 Прямая связь с водителем\n\n' +
               'Наценка всего +30% к базовому тарифу.\n' +
               'Звоните прямо сейчас: +7 916 272-09-32';
    }
    
    // Marketplace delivery
    if (lowerMessage.includes('wildberries') || lowerMessage.includes('вайлдберриз') ||
        lowerMessage.includes('озон') || lowerMessage.includes('ozon') ||
        lowerMessage.includes('маркетплейс')) {
        return '📦 Доставка на маркетплейсы:\n\n' +
               '✅ Wildberries (Коледино, Электросталь)\n' +
               '✅ Ozon (Тверь, Хоругвино)\n' +
               '✅ Яндекс.Маркет\n\n' +
               'Тарифы из Москвы:\n' +
               '🚐 Газель: от 8,000₽\n' +
               '🚛 3-тонник: от 15,000₽\n' +
               '🚚 5-тонник: от 22,000₽\n\n' +
               'Знаем все тонкости и требования складов!';
    }
    
    // Remote logistics department
    if (lowerMessage.includes('удаленн') || lowerMessage.includes('отдел') ||
        lowerMessage.includes('аутсорс') || lowerMessage.includes('логист')) {
        return '🏢 Удаленный отдел логистики - это:\n\n' +
               '💰 Экономия до 4 млн ₽/год\n' +
               '👤 Персональный менеджер\n' +
               '📊 Отчеты и аналитика\n' +
               '🔄 Масштабируемость под ваши задачи\n\n' +
               'Тарифы:\n' +
               '• Базовый: 15,000₽/мес\n' +
               '• Стандарт: 35,000₽/мес\n' +
               '• Премиум: 60,000₽/мес\n\n' +
               'Хотите узнать, сколько вы сэкономите?';
    }
    
    // Cities
    if (lowerMessage.includes('город') || lowerMessage.includes('куда') ||
        lowerMessage.includes('маршрут')) {
        return 'Мы работаем по всей России! 🇷🇺\n\n' +
               'Популярные направления:\n' +
               '• Москва ↔ Санкт-Петербург\n' +
               '• Москва ↔ Екатеринбург\n' +
               '• Москва ↔ Нижний Новгород\n' +
               '• Москва ↔ Казань\n\n' +
               'База включает 146+ городов. Назовите ваш маршрут!';
    }
    
    // Transport types
    if (lowerMessage.includes('транспорт') || lowerMessage.includes('машин') ||
        lowerMessage.includes('газель') || lowerMessage.includes('фур')) {
        return 'Наш автопарк:\n\n' +
               '🚐 Газель (до 1.5т / 16м³)\n' +
               '🚛 3-тонник (до 3т / 18м³)\n' +
               '🚛 5-тонник (до 5т / 36м³)\n' +
               '🚚 10-тонник (до 10т / 50м³)\n' +
               '🚚 Фура 20т (до 20т / 82м³)\n\n' +
               'Подберем оптимальный транспорт под ваш груз!';
    }
    
    // Contact/order
    if (lowerMessage.includes('заказ') || lowerMessage.includes('оформ') ||
        lowerMessage.includes('связ') || lowerMessage.includes('звон')) {
        return 'Оформить заказ можно:\n\n' +
               '📞 По телефону: +7 916 272-09-32\n' +
               '💬 WhatsApp: wa.me/79162720932\n' +
               '✈️ Telegram: @avtogost77_bot\n\n' +
               'Или оставьте заявку прямо здесь - менеджер свяжется за 5 минут!';
    }
    
    // Default response
    return 'Я помогу с любым вопросом по грузоперевозкам!\n\n' +
           'Могу рассчитать стоимость, подобрать транспорт, организовать срочную доставку.\n\n' +
           'Что вас интересует?';
}

// Send quick reply
function sendQuickReply(text) {
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = text;
        sendChatMessage();
    }
}

// Start chat voice input
function startChatVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showNotification('Голосовой ввод не поддерживается в вашем браузере', 'error');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    const voiceBtn = document.querySelector('.chat-voice-btn');
    if (voiceBtn) {
        voiceBtn.style.background = 'var(--accent)';
        voiceBtn.style.color = 'white';
    }
    
    recognition.start();
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById('chatInput');
        if (input) {
            input.value = transcript;
            sendChatMessage();
        }
    };
    
    recognition.onend = () => {
        if (voiceBtn) {
            voiceBtn.style.background = '';
            voiceBtn.style.color = '';
        }
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (voiceBtn) {
            voiceBtn.style.background = '';
            voiceBtn.style.color = '';
        }
    };
}

// Show typing indicator
function showTypingIndicator() {
    const messagesDiv = document.getElementById('chatMessages');
    if (!messagesDiv) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message ai typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// Escape HTML
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Add typing indicator styles
const typingStyles = `
<style>
.typing-indicator {
    opacity: 0.7;
}

.typing-dots {
    display: inline-flex;
    gap: 4px;
    padding: 12px 16px;
}

.typing-dots span {
    width: 8px;
    height: 8px;
    background: var(--gray-600);
    border-radius: 50%;
    animation: typing 1.4s infinite;
}

.typing-dots span:nth-child(1) { animation-delay: 0s; }
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing {
    0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.7;
    }
    30% {
        transform: translateY(-10px);
        opacity: 1;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', typingStyles);