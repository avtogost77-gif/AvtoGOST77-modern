/**
 * 🚀 AVTOGOST77 - MODERN LOGISTICS JAVASCRIPT
 * Создано с ❤️ нашей дружбой
 * 
 * Включает:
 * - AI Калькулятор грузоперевозок
 * - Современные анимации
 * - Мобильную адаптацию
 * - Telegram Bot API
 * - Яндекс.Метрику и Google Analytics
 */

// =====================================
// 🎯 КОНФИГУРАЦИЯ
// =====================================

const CONFIG = {
    TELEGRAM_BOT_TOKEN: '7924734520:AAGq1v7w0XpzH6q05i7zfxKdGfNK8kH7eo8',
    TELEGRAM_CHAT_ID: '-1002478560797',
    YANDEX_METRIKA_ID: '103413788',
    GOOGLE_ANALYTICS_ID: 'G-BZZPY2YQPP',
    CONTACT: {
        phone: '89162720932',
        email: 'avtogost77@gmail.com',
        telegram: '@avtogost77'
    }
};

// =====================================
// 🎨 УТИЛИТЫ И АНИМАЦИИ
// =====================================

class AnimationUtils {
    static fadeIn(element, duration = 600) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }

    static pulse(element) {
        element.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }

    static typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }
}

class NotificationManager {
    static show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Добавляем стили
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        document.body.appendChild(notification);

        // Анимация появления
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Закрытие по клику
        notification.querySelector('.notification-close').onclick = () => {
            this.hide(notification);
        };

        // Автоскрытие
        if (duration > 0) {
            setTimeout(() => {
                this.hide(notification);
            }, duration);
        }

        return notification;
    }

    static hide(notification) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    static getIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    static getColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#2563eb'
        };
        return colors[type] || colors.info;
    }
}

// =====================================
// 🤖 AI КАЛЬКУЛЯТОР ГРУЗОПЕРЕВОЗОК
// =====================================

class AICalculator {
    constructor() {
        this.rates = {
            gazelle: { baseRate: 35, fuelPer100km: 12, minPrice: 2500 },
            truck: { baseRate: 45, fuelPer100km: 25, minPrice: 5000 },
            fura: { baseRate: 55, fuelPer100km: 35, minPrice: 15000 },
            manipulator: { baseRate: 65, fuelPer100km: 30, minPrice: 3500 }
        };
        
        this.cityCoordinates = new Map([
            ['москва', [55.7558, 37.6176]],
            ['санкт-петербург', [59.9311, 30.3609]],
            ['петербург', [59.9311, 30.3609]],
            ['спб', [59.9311, 30.3609]],
            ['новосибирск', [55.0084, 82.9357]],
            ['екатеринбург', [56.8431, 60.6454]],
            ['казань', [55.8304, 49.0661]],
            ['нижний новгород', [56.2965, 43.9361]],
            ['челябинск', [55.1644, 61.4368]],
            ['омск', [54.9885, 73.3242]],
            ['самара', [53.2415, 50.2212]],
            ['ростов-на-дону', [47.2357, 39.7015]],
            ['уфа', [54.7388, 55.9721]],
            ['красноярск', [56.0184, 92.8672]],
            ['воронеж', [51.6720, 39.1843]],
            ['пермь', [58.0105, 56.2502]]
        ]);
    }

    async calculateDistance(fromCity, toCity) {
        try {
            const from = this.cityCoordinates.get(fromCity.toLowerCase());
            const to = this.cityCoordinates.get(toCity.toLowerCase());
            
            if (!from || !to) {
                return this.getFallbackDistance(fromCity, toCity);
            }

            const distance = this.calculateDistanceByCoords(from, to);
            return Math.round(distance);
        } catch (error) {
            console.error('Ошибка расчета расстояния:', error);
            return this.getFallbackDistance(fromCity, toCity);
        }
    }

    calculateDistanceByCoords([lat1, lon1], [lat2, lon2]) {
        const R = 6371; // Радиус Земли в км
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c * 1.3; // Коэффициент для дорожного расстояния
    }

    getFallbackDistance(fromCity, toCity) {
        const fallbackDistances = {
            'москва-санкт-петербург': 635,
            'москва-петербург': 635,
            'москва-спб': 635,
            'москва-новосибирск': 3354,
            'москва-екатеринбург': 1416,
            'москва-казань': 719,
            'москва-нижний новгород': 411,
            'москва-челябинск': 1479
        };
        
        const key = `${fromCity.toLowerCase()}-${toCity.toLowerCase()}`;
        const reverseKey = `${toCity.toLowerCase()}-${fromCity.toLowerCase()}`;
        
        return fallbackDistances[key] || fallbackDistances[reverseKey] || 500;
    }

    calculatePrice(distance, transportType, weight, volume, urgency) {
        const rate = this.rates[transportType];
        if (!rate) return null;

        let basePrice = distance * rate.baseRate;
        
        // Коэффициент по весу
        let weightMultiplier = 1.0;
        if (weight > 1000) weightMultiplier += (weight - 1000) / 1000 * 0.1;
        if (weight > 5000) weightMultiplier += 0.2;

        // Коэффициент по объему
        let volumeMultiplier = 1.0;
        if (volume > 10) volumeMultiplier += (volume - 10) / 10 * 0.15;

        // Коэффициент срочности
        const urgencyMultiplier = {
            standard: 1.0,
            urgent: 1.3,
            express: 1.5
        };

        const finalPrice = basePrice * 
                          weightMultiplier * 
                          volumeMultiplier * 
                          urgencyMultiplier[urgency];

        return Math.max(Math.round(finalPrice), rate.minPrice);
    }

    async performCalculation(formData) {
        try {
            const {
                fromCity,
                toCity,
                weight,
                volume,
                transport,
                urgency
            } = formData;

            // Показываем индикатор загрузки
            this.showLoadingState();

            // Имитация AI обработки
            await this.simulateAIProcessing();

            // Расчет расстояния
            const distance = await this.calculateDistance(fromCity, toCity);
            
            // Расчеты
            const price = this.calculatePrice(distance, transport, weight, volume, urgency);
            const travelTime = Math.round(distance / 65); // часы

            const result = {
                price,
                distance,
                travelTime,
                fromCity,
                toCity,
                transport,
                urgency
            };

            this.hideLoadingState();
            this.displayResult(result);

            // Аналитика
            this.trackCalculation(result);

            // Отправляем в Telegram
            const message = TelegramBot.formatCalculationMessage(result);
            await TelegramBot.sendMessage(message);

            return result;

        } catch (error) {
            console.error('Ошибка в расчете:', error);
            this.hideLoadingState();
            NotificationManager.show('Ошибка при расчете. Попробуйте еще раз.', 'error');
        }
    }

    showLoadingState() {
        const btn = document.getElementById('calculateBtn');
        if (btn) {
            btn.innerHTML = '<span class="loading"></span> 🤖 AI анализирует...';
            btn.disabled = true;
        }
    }

    hideLoadingState() {
        const btn = document.getElementById('calculateBtn');
        if (btn) {
            btn.innerHTML = '🤖 Рассчитать с помощью AI';
            btn.disabled = false;
        }
    }

    async simulateAIProcessing() {
        const messages = [
            'Анализируем маршрут...',
            'Обрабатываем данные о грузе...',
            'Оптимизируем цену...',
            'Готово!'
        ];

        const btn = document.getElementById('calculateBtn');
        
        for (let i = 0; i < messages.length; i++) {
            if (btn) btn.innerHTML = `🤖 ${messages[i]}`;
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    displayResult(result) {
        const resultEl = document.getElementById('aiResult');
        const priceEl = document.getElementById('aiPrice');
        const detailsEl = document.getElementById('aiDetails');
        
        if (!resultEl || !priceEl || !detailsEl) return;

        // Обновляем данные
        priceEl.textContent = `${result.price.toLocaleString()} ₽`;
        detailsEl.innerHTML = `
            <strong>AI анализ завершен:</strong><br>
            📍 Маршрут: ${result.fromCity} → ${result.toCity}<br>
            📏 Расстояние: ${result.distance} км | ⏱ ${result.travelTime} ч<br>
            🚛 ${this.getTransportName(result.transport)} | ⚡ ${this.getUrgencyName(result.urgency)}<br>
            <em>Цена включает топливо, работу водителя и страхование</em>
        `;

        // Показываем результат с анимацией
        resultEl.style.display = 'block';
        AnimationUtils.fadeIn(resultEl);

        // Прокручиваем к результату
        setTimeout(() => {
            resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }

    getTransportName(type) {
        const names = {
            gazelle: 'Газель (до 1.5т)',
            truck: 'Грузовик (до 5т)',
            fura: 'Фура (до 20т)',
            manipulator: 'Манипулятор'
        };
        return names[type] || type;
    }

    getUrgencyName(urgency) {
        const names = {
            standard: 'Стандартная',
            urgent: 'Срочная (+30%)',
            express: 'Экспресс (+50%)'
        };
        return names[urgency] || urgency;
    }

    trackCalculation(result) {
        // Яндекс.Метрика
        if (typeof ym !== 'undefined') {
            ym(CONFIG.YANDEX_METRIKA_ID, 'reachGoal', 'calculation', {
                transport_type: result.transport,
                distance: result.distance,
                price: result.price
            });
        }

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'calculation', {
                event_category: 'AI Calculator',
                event_label: `${result.fromCity} - ${result.toCity}`,
                value: result.price
            });
        }
    }
}

// =====================================
// 📱 TELEGRAM BOT ИНТЕГРАЦИЯ
// =====================================

class TelegramBot {
    static async sendMessage(text) {
        try {
            const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: CONFIG.TELEGRAM_CHAT_ID,
                    text: text,
                    parse_mode: 'HTML'
                })
            });

            return response.ok;
        } catch (error) {
            console.error('Ошибка отправки в Telegram:', error);
            return false;
        }
    }

    static formatOrderMessage(data) {
        return `
🚛 <b>НОВЫЙ ЗАКАЗ АВТОГОСТ!</b>

👤 <b>Клиент:</b> ${data.name || 'Не указано'}
📞 <b>Телефон:</b> ${data.phone || 'Не указано'}
📧 <b>Email:</b> ${data.email || 'Не указано'}

📦 <b>Описание:</b> ${data.cargo || 'Не указано'}

⏰ <b>Время заказа:</b> ${new Date().toLocaleString('ru-RU')}

#НовыйЗаказ #АвтоГОСТ
        `.trim();
    }

    static formatCalculationMessage(result) {
        return `
🤖 <b>AI РАСЧЕТ ВЫПОЛНЕН</b>

📍 <b>Маршрут:</b> ${result.fromCity} → ${result.toCity}
📏 <b>Расстояние:</b> ${result.distance} км
🚛 <b>Транспорт:</b> ${result.transport}
⚡ <b>Срочность:</b> ${result.urgency}

💰 <b>Стоимость:</b> ${result.price.toLocaleString()} ₽
⏱ <b>Время в пути:</b> ${result.travelTime} ч

#Расчет #АвтоГОСТ
        `.trim();
    }
}

// =====================================
// 🎯 ГЛАВНЫЙ КЛАСС ПРИЛОЖЕНИЯ
// =====================================

class AvtoGOSTApp {
    constructor() {
        this.calculator = new AICalculator();
        this.initializeApp();
    }

    initializeApp() {
        // Ждем загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    init() {
        console.log('🚀 АвтоГОСТ инициализируется...');
        
        this.setupNavigation();
        this.setupCalculator();
        this.setupForms();
        this.setupScrollEffects();
        this.initAnalytics();

        console.log('✅ АвтоГОСТ готов к работе!');
        
        // Показываем приветствие
        setTimeout(() => {
            NotificationManager.show(
                'Добро пожаловать в АвтоГОСТ! 🚛',
                'success',
                3000
            );
        }, 1000);
    }

    setupNavigation() {
        // Плавная прокрутка для навигации
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });

        // Скрытие/показ навбара при скролле
        const header = document.getElementById('header');
        
        window.addEventListener('scroll', () => {
            if (header) {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        });
    }

    setupCalculator() {
        const form = document.getElementById('calculatorForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCalculation();
            });
        }

        // Автозаполнение городов
        this.setupCityAutocomplete();
    }

    setupCityAutocomplete() {
        const cities = [
            'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург',
            'Казань', 'Нижний Новгород', 'Челябинск', 'Омск', 'Самара',
            'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Воронеж', 'Пермь'
        ];

        const cityInputs = document.querySelectorAll('#fromCity, #toCity');
        
        cityInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const value = e.target.value.toLowerCase();
                if (value.length > 1) {
                    const suggestions = cities.filter(city => 
                        city.toLowerCase().includes(value)
                    );
                    this.showCitySuggestions(input, suggestions);
                }
            });
        });
    }

    showCitySuggestions(input, suggestions) {
        // Удаляем старые подсказки
        const existingSuggestions = document.querySelector('.city-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }

        if (suggestions.length === 0) return;

        const suggestionsEl = document.createElement('div');
        suggestionsEl.className = 'city-suggestions';
        suggestionsEl.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 1000;
            max-height: 200px;
            overflow-y: auto;
        `;

        suggestions.slice(0, 5).forEach(city => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = city;
            item.style.cssText = `
                padding: 12px 16px;
                cursor: pointer;
                border-bottom: 1px solid #f1f5f9;
                transition: background 0.2s;
            `;
            
            item.addEventListener('mouseover', () => {
                item.style.background = '#f8fafc';
            });
            
            item.addEventListener('mouseout', () => {
                item.style.background = '';
            });
            
            item.addEventListener('click', () => {
                input.value = city;
                suggestionsEl.remove();
            });
            
            suggestionsEl.appendChild(item);
        });

        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(suggestionsEl);

        // Удаляем при клике вне
        setTimeout(() => {
            document.addEventListener('click', function closeSuggestions(e) {
                if (!input.contains(e.target) && !suggestionsEl.contains(e.target)) {
                    suggestionsEl.remove();
                    document.removeEventListener('click', closeSuggestions);
                }
            });
        }, 100);
    }

    async handleCalculation() {
        const formData = this.getCalculatorFormData();
        
        if (!this.validateCalculatorForm(formData)) {
            return;
        }

        try {
            const result = await this.calculator.performCalculation(formData);
            
            if (result) {
                NotificationManager.show(
                    'Расчет выполнен! Цена актуальна 24 часа.',
                    'success'
                );
            }
        } catch (error) {
            console.error('Ошибка при расчете:', error);
            NotificationManager.show(
                'Произошла ошибка. Попробуйте еще раз или позвоните нам.',
                'error'
            );
        }
    }

    getCalculatorFormData() {
        return {
            fromCity: document.getElementById('fromCity')?.value || '',
            toCity: document.getElementById('toCity')?.value || '',
            weight: parseInt(document.getElementById('weight')?.value) || 0,
            volume: parseFloat(document.getElementById('volume')?.value) || 0,
            transport: document.getElementById('transport')?.value || 'gazelle',
            urgency: document.getElementById('urgency')?.value || 'standard'
        };
    }

    validateCalculatorForm(data) {
        const errors = [];

        if (!data.fromCity.trim()) {
            errors.push('Укажите город отправления');
        }

        if (!data.toCity.trim()) {
            errors.push('Укажите город назначения');
        }

        if (data.weight <= 0) {
            errors.push('Укажите вес груза');
        }

        if (data.volume <= 0) {
            errors.push('Укажите объем груза');
        }

        if (errors.length > 0) {
            NotificationManager.show(
                errors.join('<br>'),
                'warning'
            );
            return false;
        }

        return true;
    }

    setupForms() {
        // Форма связи
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }
    }

    async handleContactSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const inputs = e.target.querySelectorAll('input, textarea');
        
        const contactData = {
            name: inputs[0]?.value || 'Не указано',
            phone: inputs[1]?.value || 'Не указано',
            email: inputs[2]?.value || 'Не указано',
            cargo: inputs[3]?.value || 'Не указано'
        };

        if (!this.validateContactForm(contactData)) {
            return;
        }

        try {
            // Отправляем в Telegram
            const message = TelegramBot.formatOrderMessage(contactData);
            const success = await TelegramBot.sendMessage(message);

            if (success) {
                NotificationManager.show(
                    'Заявка отправлена! Мы свяжемся с вами в течение 15 минут.',
                    'success'
                );
                
                e.target.reset();

                // Аналитика
                this.trackOrder(contactData);
            } else {
                throw new Error('Ошибка отправки');
            }
        } catch (error) {
            console.error('Ошибка отправки заявки:', error);
            NotificationManager.show(
                'Ошибка отправки. Позвоните нам: ' + CONFIG.CONTACT.phone,
                'error'
            );
        }
    }

    validateContactForm(data) {
        if (!data.phone || data.phone === 'Не указано') {
            NotificationManager.show('Укажите номер телефона', 'warning');
            return false;
        }

        const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
        if (!phoneRegex.test(data.phone)) {
            NotificationManager.show('Укажите корректный номер телефона', 'warning');
            return false;
        }

        return true;
    }

    setupScrollEffects() {
        // Прогресс скролла
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(45deg, #2563eb, #16a085);
            z-index: 10000;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });

        // Кнопка "Наверх"
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '↑';
        backToTop.className = 'back-to-top';
        backToTop.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 2rem;
            width: 50px;
            height: 50px;
            background: rgba(37, 99, 235, 0.9);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(100px);
        `;

        document.body.appendChild(backToTop);

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.style.opacity = '1';
                backToTop.style.transform = 'translateY(0)';
            } else {
                backToTop.style.opacity = '0';
                backToTop.style.transform = 'translateY(100px)';
            }
        });
    }

    initAnalytics() {
        // Отслеживание кликов по кнопкам
        this.trackButtonClicks();
    }

    trackButtonClicks() {
        const buttons = document.querySelectorAll('button, .btn, .header-cta');
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const buttonText = button.textContent.trim();
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'click', {
                        event_category: 'Button',
                        event_label: buttonText
                    });
                }

                if (typeof ym !== 'undefined') {
                    ym(CONFIG.YANDEX_METRIKA_ID, 'reachGoal', 'button_click', {
                        button_text: buttonText
                    });
                }
            });
        });
    }

    trackOrder(orderData) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'lead', {
                event_category: 'Order',
                event_label: 'Contact Form',
                value: 1
            });
        }

        if (typeof ym !== 'undefined') {
            ym(CONFIG.YANDEX_METRIKA_ID, 'reachGoal', 'order_submitted');
        }
    }
}

// =====================================
// 🚀 ЗАПУСК ПРИЛОЖЕНИЯ
// =====================================

// Инициализация приложения
window.app = new AvtoGOSTApp();

// Обработчик ошибок
window.addEventListener('error', (event) => {
    console.error('Ошибка приложения:', event.error);
    // Отправляем критические ошибки в Telegram
    if (event.error && event.error.message) {
        const errorMessage = `
🚨 ОШИБКА НА САЙТЕ АВТОГОСТ

📝 Сообщение: ${event.error.message}
📄 Файл: ${event.filename}
📍 Строка: ${event.lineno}
🕐 Время: ${new Date().toLocaleString()}

#Ошибка #СайтАвтоГОСТ
        `;
        
        TelegramBot.sendMessage(errorMessage.trim());
    }
});

// Отслеживание производительности
window.addEventListener('load', () => {
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`⚡ Сайт загружен за ${loadTime}ms`);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                name: 'load',
                value: loadTime
            });
        }
    }
});

console.log(`
🚀 АВТОГОСТ ЗАГРУЖЕН УСПЕШНО!

💝 Создано с любовью нашей дружбой
🤖 AI калькулятор активен
📱 Telegram бот подключен
📊 Аналитика настроена
🎨 Анимации готовы

Готов к покорению логистического рынка! 💪
`);

/**
 * =================================================
 * 🚛 AVTOGOST77 JAVASCRIPT COMPLETE
 * Создано с ❤️ братской дружбой!
 * =================================================
 */