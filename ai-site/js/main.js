// ========================================
// АвтоГОСТ AI-Powered Site 2025
// Main JavaScript
// ========================================

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hide');
        }
    }, 1000);
    
    // Initialize components
    initHeader();
    initMobileMenu();
    initTruckCounter();
    initQuickActions();
    initSmoothScroll();
    
    // Check for Web Speech API support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('Speech Recognition API not supported');
        // Hide voice buttons
        document.querySelectorAll('.voice-button, .chat-voice-btn').forEach(btn => {
            btn.style.display = 'none';
        });
    }
}

// Header scroll effect
function initHeader() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Mobile menu
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const nav = document.getElementById('mobileNav');
    
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu on link click
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// Animated truck counter
function initTruckCounter() {
    const counter = document.getElementById('trucksCount');
    if (counter) {
        // Simulate real-time updates
        setInterval(() => {
            const current = parseInt(counter.textContent);
            const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
            const newCount = Math.max(200, Math.min(300, current + change));
            counter.textContent = newCount;
        }, 5000);
    }
}

// Quick action buttons
function initQuickActions() {
    const buttons = document.querySelectorAll('.quick-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            
            switch(action) {
                case 'calculate':
                    scrollToElement('#calculator');
                    break;
                case 'urgent':
                    openUrgentModal();
                    break;
                case 'marketplace':
                    openServiceModal('marketplace');
                    break;
                case 'remote':
                    openServiceModal('remote');
                    break;
            }
        });
    });
}

// Smooth scroll
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                scrollToElement(this.getAttribute('href'));
            }
        });
    });
}

// Scroll to element helper
function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        const offset = 80; // Header height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Voice input for hero
function startVoiceInput() {
    const button = document.getElementById('voiceButton');
    const indicator = document.getElementById('listeningIndicator');
    const input = document.getElementById('aiInput');
    
    if (!button || !input) return;
    
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = true;
    
    // Start recognition
    button.classList.add('active');
    indicator.querySelector('.listening-text').textContent = 'Слушаю...';
    
    recognition.start();
    
    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        
        input.value = transcript;
    };
    
    recognition.onend = () => {
        button.classList.remove('active');
        indicator.querySelector('.listening-text').textContent = 'Скажите, что нужно перевезти...';
        
        if (input.value) {
            processAIInput();
        }
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        button.classList.remove('active');
        showNotification('Ошибка распознавания голоса. Попробуйте еще раз.', 'error');
    };
}

// Process AI input
function processAIInput() {
    const input = document.getElementById('aiInput');
    if (!input || !input.value.trim()) return;
    
    const query = input.value.trim();
    
    // Simple keyword detection for demo
    if (query.toLowerCase().includes('срочно') || query.toLowerCase().includes('быстро')) {
        openUrgentModal();
    } else if (query.toLowerCase().includes('wildberries') || query.toLowerCase().includes('озон')) {
        openServiceModal('marketplace');
    } else {
        // Default to calculator
        scrollToElement('#calculator');
        
        // Parse the query and fill calculator
        setTimeout(() => {
            const aiMessage = document.getElementById('aiMessage');
            if (aiMessage) {
                aiMessage.innerHTML = `<p>Понял! "${query}". Сейчас рассчитаю оптимальный вариант...</p>`;
            }
            
            // Simulate AI processing
            parseAndFillCalculator(query);
        }, 500);
    }
    
    input.value = '';
}

// Parse natural language and fill calculator
function parseAndFillCalculator(query) {
    // Extract cities
    const cities = extractCities(query);
    const weight = extractWeight(query);
    const cargo = extractCargoType(query);
    
    // Fill form if in form mode
    if (document.getElementById('fromCity')) {
        if (cities.from) document.getElementById('fromCity').value = cities.from;
        if (cities.to) document.getElementById('toCity').value = cities.to;
        if (weight) document.getElementById('weight').value = weight;
    }
    
    // Show results
    setTimeout(() => {
        showCalculatorResults({
            from: cities.from || 'Москва',
            to: cities.to || 'Санкт-Петербург',
            weight: weight || 100,
            cargo: cargo || 'general'
        });
    }, 1500);
}

// Extract cities from query
function extractCities(query) {
    const cities = {
        'москв': 'Москва',
        'питер': 'Санкт-Петербург',
        'спб': 'Санкт-Петербург',
        'екатеринбург': 'Екатеринбург',
        'новосибирск': 'Новосибирск',
        'казан': 'Казань',
        'нижн': 'Нижний Новгород'
    };
    
    let from = null;
    let to = null;
    
    const words = query.toLowerCase().split(' ');
    
    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        
        // Check for city names
        for (const [key, city] of Object.entries(cities)) {
            if (word.includes(key)) {
                if (!from) {
                    from = city;
                } else if (!to) {
                    to = city;
                }
            }
        }
        
        // Check for "из" and "в" prepositions
        if (word === 'из' && i + 1 < words.length) {
            const nextWord = words[i + 1];
            for (const [key, city] of Object.entries(cities)) {
                if (nextWord.includes(key)) {
                    from = city;
                    break;
                }
            }
        }
        
        if ((word === 'в' || word === 'до') && i + 1 < words.length) {
            const nextWord = words[i + 1];
            for (const [key, city] of Object.entries(cities)) {
                if (nextWord.includes(key)) {
                    to = city;
                    break;
                }
            }
        }
    }
    
    return { from, to };
}

// Extract weight from query
function extractWeight(query) {
    const weightMatch = query.match(/(\d+)\s*(кг|килограмм|тонн)/i);
    if (weightMatch) {
        let weight = parseInt(weightMatch[1]);
        if (weightMatch[2].toLowerCase().includes('тонн')) {
            weight *= 1000;
        }
        return weight;
    }
    return null;
}

// Extract cargo type from query
function extractCargoType(query) {
    const cargoTypes = {
        'мебель': 'furniture',
        'холодильник': 'appliance',
        'стиральн': 'appliance',
        'диван': 'furniture',
        'кровать': 'furniture',
        'шкаф': 'furniture',
        'коробк': 'boxes',
        'документ': 'documents',
        'хрупк': 'fragile',
        'стекл': 'fragile'
    };
    
    const lowerQuery = query.toLowerCase();
    
    for (const [key, type] of Object.entries(cargoTypes)) {
        if (lowerQuery.includes(key)) {
            return type;
        }
    }
    
    return 'general';
}

// Show calculator results
function showCalculatorResults(params) {
    const resultsDiv = document.getElementById('calcResults');
    if (resultsDiv) {
        resultsDiv.style.display = 'block';
        
        // Update route info
        document.getElementById('routeValue').textContent = `${params.from} → ${params.to}`;
        
        // Scroll to results
        scrollToElement('#calcResults');
    }
}

// Switch input mode in calculator
function switchInputMode(mode) {
    // Hide all modes
    document.querySelectorAll('.input-mode').forEach(m => {
        m.style.display = 'none';
    });
    
    // Show selected mode
    const modeDiv = document.getElementById(mode + 'Mode');
    if (modeDiv) {
        modeDiv.style.display = 'block';
    }
    
    // Update buttons
    document.querySelectorAll('.switch-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`.switch-btn[data-mode="${mode}"]`).classList.add('active');
}

// Open urgent modal
function openUrgentModal() {
    showNotification('🚨 Срочная доставка! Звоните прямо сейчас: +7 916 272-09-32', 'urgent');
    
    // Auto-dial on mobile
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        setTimeout(() => {
            window.location.href = 'tel:+79162720932';
        }, 2000);
    }
}

// Open service modal
function openServiceModal(service) {
    const messages = {
        marketplace: 'Доставка на маркетплейсы - наша специализация! Оставьте заявку, и мы свяжемся в течение 15 минут.',
        remote: 'Удаленный отдел логистики - экономия до 4 млн ₽/год! Получите персонального менеджера уже сегодня.'
    };
    
    showNotification(messages[service] || 'Оставьте заявку, мы свяжемся с вами!', 'info');
    
    // Scroll to contact form or open chat
    setTimeout(() => {
        openAIChat();
    }, 1500);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Create notification styles
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    max-width: 400px;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.notification-info {
    background: var(--primary);
    color: white;
}

.notification-urgent {
    background: var(--accent-warm);
    color: white;
}

.notification-error {
    background: var(--danger);
    color: white;
}

.notification-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (max-width: 768px) {
    .notification {
        left: 20px;
        right: 20px;
        max-width: none;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);