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
    API_ENDPOINTS: {
        DISTANCE: 'https://api.openrouteservice.org/v2/directions/driving-car',
        GEOCODING: 'https://nominatim.openstreetmap.org/search'
    },
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

    static bounce(element) {
        element.style.animation = 'bounce 0.8s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 800);
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
            gazelle: { baseRate: 35, fuelPer100km: 12 },
            truck: { baseRate: 45, fuelPer100km: 25 },
            semi: { baseRate: 55, fuelPer100km: 35 },
            manipulator: { baseRate: 65, fuelPer100km: 30 }
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
                // Fallback к геокодингу
                return await this.geocodeAndCalculate(fromCity, toCity);
            }

            // Простой расчет по координатам (приблизительный)
            const distance = this.calculateDistanceByCoords(from, to);
            return Math.round(distance);
        } catch (error) {
            console.error('Ошибка расчета расстояния:', error);
            // Fallback значения для популярных маршрутов
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

    calculatePrice(distance, transportType, weight, volume, cargoType) {
        const rate = this.rates[transportType];
        if (!rate) return null;

        let basePrice = distance * rate.baseRate;
        
        // Коэффициенты по типу груза
        const cargoMultipliers = {
            general: 1.0,
            fragile: 1.3,
            oversized: 1.5,
            dangerous: 1.8
        };

        // Коэффициент по весу
        let weightMultiplier = 1.0;
        if (weight > 1000) weightMultiplier += (weight - 1000) / 1000 * 0.1;
        if (weight > 5000) weightMultiplier += 0.2;

        // Коэффициент по объему
        let volumeMultiplier = 1.0;
        if (volume > 10) volumeMultiplier += (volume - 10) / 10 * 0.15;

        const finalPrice = basePrice * 
                          cargoMultipliers[cargoType] * 
                          weightMultiplier * 
                          volumeMultiplier;

        // Минимальная стоимость
        const minPrices = {
            gazelle: 2500,
            truck: 5000,
            semi: 15000,
            manipulator: 3500
        };

        return Math.max(Math.round(finalPrice), minPrices[transportType]);
    }

    calculateTravelTime(distance) {
        // Примерная скорость с учетом остановок
        const avgSpeed = 65; // км/ч
        return Math.round(distance / avgSpeed);
    }

    calculateFuelCost(distance, transportType) {
        const rate = this.rates[transportType];
        const fuelPrice = 55; // рублей за литр
        const fuelConsumption = (distance / 100) * rate.fuelPer100km;
        return Math.round(fuelConsumption * fuelPrice);
    }

    async performCalculation(formData) {
        try {
            const {
                fromCity,
                toCity,
                cargoType,
                weight,
                volume,
                transportType
            } = formData;

            // Показываем индикатор загрузки
            this.showLoadingState();

            // Расчет расстояния с AI эффектом
            const distance = await this.calculateDistance(fromCity, toCity);
            
            // Имитация AI обработки
            await this.simulateAIProcessing();

            // Расчеты
            const price = this.calculatePrice(distance, transportType, weight, volume, cargoType);
            const travelTime = this.calculateTravelTime(distance);
            const fuelCost = this.calculateFuelCost(distance, transportType);

            const result = {
                price,
                distance,
                travelTime,
                fuelCost,
                fromCity,
                toCity,
                transportType,
                cargoType
            };

            this.hideLoadingState();
            this.displayResult(result);

            // Аналитика
            this.trackCalculation(result);

            return result;

        } catch (error) {
            console.error('Ошибка в расчете:', error);
            this.hideLoadingState();
            NotificationManager.show('Ошибка при расчете. Попробуйте еще раз.', 'error');
        }
    }

    showLoadingState() {
        const btn = document.querySelector('.calculate-btn');
        if (btn) {
            btn.innerHTML = '🤖 AI анализирует маршрут...';
            btn.disabled = true;
            btn.style.background = '#6b7280';
        }
    }

    hideLoadingState() {
        const btn = document.querySelector('.calculate-btn');
        if (btn) {
            btn.innerHTML = '🤖 Рассчитать с AI';
            btn.disabled = false;
            btn.style.background = '';
        }
    }

    async simulateAIProcessing() {
        const messages = [
            'Анализируем маршрут...',
            'Обрабатываем данные о грузе...',
            'Оптимизируем цену...',
            'Готово!'
        ];

        const btn = document.querySelector('.calculate-btn');
        
        for (let i = 0; i < messages.length; i++) {
            if (btn) btn.innerHTML = `🤖 ${messages[i]}`;
            await new Promise(resolve => setTimeout(resolve, 400));
        }
    }

    displayResult(result) {
        const resultContainer = document.getElementById('calculationResult');
        if (!resultContainer) return;

        // Обновляем данные
        const priceEl = document.getElementById('calculatedPrice');
        const distanceEl = document.getElementById('distance');
        const timeEl = document.getElementById('travelTime');
        const fuelEl = document.getElementById('fuelCost');

        if (priceEl) priceEl.textContent = `${result.price.toLocaleString()} ₽`;
        if (distanceEl) distanceEl.textContent = `${result.distance} км`;
        if (timeEl) timeEl.textContent = `${result.travelTime} ч`;
        if (fuelEl) fuelEl.textContent = `${result.fuelCost.toLocaleString()} ₽`;

        // Показываем результат с анимацией
        resultContainer.classList.add('show');
        AnimationUtils.fadeIn(resultContainer);

        // Эффект печатной машинки для цены
        if (priceEl) {
            AnimationUtils.typeWriter(priceEl, `${result.price.toLocaleString()} ₽`, 100);
        }
    }

    trackCalculation(result) {
        // Яндекс.Метрика
        if (typeof ym !== 'undefined') {
            ym(CONFIG.YANDEX_METRIKA_ID, 'reachGoal', 'calculation', {
                transport_type: result.transportType,
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

📍 <b>Маршрут:</b>
   Откуда: ${data.from || 'Не указано'}
   Куда: ${data.to || 'Не указано'}

📦 <b>Груз:</b> ${data.cargo || 'Не указано'}

💰 <b>Расчетная стоимость:</b> ${data.price || 'Не рассчитано'}

⏰ <b>Время заказа:</b> ${new Date().toLocaleString('ru-RU')}

#НовыйЗаказ #АвтоГОСТ
        `.trim();
    }

    static formatCalculationMessage(result) {
        return `
🤖 <b>AI РАСЧЕТ ВЫПОЛНЕН</b>

📍 <b>Маршрут:</b> ${result.fromCity} → ${result.toCity}
📏 <b>Расстояние:</b> ${result.distance} км
🚛 <b>Транспорт:</b> ${this.getTransportName(result.transportType)}
📦 <b>Тип груза:</b> ${this.getCargoName(result.cargoType)}

💰 <b>Стоимость:</b> ${result.price.toLocaleString()} ₽
⏱ <b>Время в пути:</b> ${result.travelTime} ч
⛽ <b>Топливо:</b> ${result.fuelCost.toLocaleString()} ₽

#Расчет #АвтоГОСТ
        `.trim();
    }

    static getTransportName(type) {
        const names = {
            gazelle: 'Газель (до 1.5т)',
            truck: 'Грузовик (до 5т)',
            semi: 'Полуприцеп (до 20т)',
            manipulator: 'Манипулятор'
        };
        return names[type] || type;
    }

    static getCargoName(type) {
        const names = {
            general: 'Обычный груз',
            fragile: 'Хрупкий груз',
            oversized: 'Негабаритный',
            dangerous: 'Опасный груз'
        };
        return names[type] || type;
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
        this.setupAnimations();
        this.setupModal();
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
        // Мобильное меню
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });
        }

        // Плавная прокрутка для навигации
        const navLinks = document.querySelectorAll('.nav-link');
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
        let lastScrollTop = 0;
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (navbar) {
                if (scrollTop > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            
            lastScrollTop = scrollTop;
        });
    }

    setupCalculator() {
        const calculateBtn = document.querySelector('.calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => this.handleCalculation());
        }

        // Автозаполнение городов
        this.setupCityAutocomplete();
    }

    setupCityAutocomplete() {
        const cities = [
            'Москва', 'Санкт-Петербург', 'Новосибирск', 'Екатеринбург',
            'Казань', 'Нижний Новгород', 'Челябинск', 'Омск', 'Самара',
            'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Воронеж', 'Пермь',
            'Волгоград', 'Краснодар', 'Саратов', 'Тюмень', 'Тольятти'
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
                // Отправляем данные в Telegram
                const message = TelegramBot.formatCalculationMessage(result);
                await TelegramBot.sendMessage(message);

                // Показываем уведомление об успехе
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
            cargoType: document.getElementById('cargoType')?.value || 'general',
            weight: parseInt(document.getElementById('weight')?.value) || 0,
            volume: parseFloat(document.getElementById('volume')?.value) || 0,
            transportType: document.getElementById('transportType')?.value || 'gazelle'
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
        // Форма быстрого заказа
        const orderForm = document.getElementById('orderForm');
        if (orderForm) {
            orderForm.addEventListener('submit', (e) => this.handleOrderSubmit(e));
        }

        // Модальная форма
        const quickOrderForm = document.getElementById('quickOrderForm');
        if (quickOrderForm) {
            quickOrderForm.addEventListener('submit', (e) => this.handleQuickOrderSubmit(e));
        }
    }

    async handleOrderSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const orderData = {
            name: formData.get('name') || e.target.querySelector('[placeholder="Ваше имя"]')?.value,
            phone: formData.get('phone') || e.target.querySelector('[placeholder="Телефон"]')?.value,
            from: formData.get('from') || e.target.querySelector('[placeholder="Откуда"]')?.value,
            to: formData.get('to') || e.target.querySelector('[placeholder="Куда"]')?.value,
            cargo: formData.get('cargo') || e.target.querySelector('[placeholder*="груз"]')?.value
        };

        if (!this.validateOrderForm(orderData)) {
            return;
        }

        try {
            // Отправляем в Telegram
            const message = TelegramBot.formatOrderMessage(orderData);
            const success = await TelegramBot.sendMessage(message);

            if (success) {
                NotificationManager.show(
                    'Заявка отправлена! Мы свяжемся с вами в течение 15 минут.',
                    'success'
                );
                
                e.target.reset();

                // Аналитика
                this.trackOrder(orderData);
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

    async handleQuickOrderSubmit(e) {
        e.preventDefault();
        
        const inputs = e.target.querySelectorAll('input');
        const orderData = {
            from: inputs[0]?.value,
            to: inputs[1]?.value,
            phone: inputs[2]?.value
        };

        if (!orderData.phone) {
            NotificationManager.show('Укажите телефон для связи', 'warning');
            return;
        }

        try {
            const message = TelegramBot.formatOrderMessage(orderData);
            const success = await TelegramBot.sendMessage(message);

            if (success) {
                NotificationManager.show(
                    'Заявка отправлена! Перезвоним через 15 минут.',
                    'success'
                );
                
                this.closeQuickOrder();
                e.target.reset();
            } else {
                throw new Error('Ошибка отправки');
            }
        } catch (error) {
            console.error('Ошибка отправки:', error);
            NotificationManager.show(
                'Ошибка. Позвоните: ' + CONFIG.CONTACT.phone,
                'error'
            );
        }
    }

    validateOrderForm(data) {
        if (!data.phone) {
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

    setupModal() {
        const modal = document.getElementById('quickOrderModal');
        const fabButton = document.querySelector('.fab-button');
        const closeBtn = document.querySelector('.close');

        if (fabButton) {
            fabButton.addEventListener('click', () => this.openQuickOrder());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeQuickOrder());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeQuickOrder();
                }
            });
        }
    }

    openQuickOrder() {
        const modal = document.getElementById('quickOrderModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Фокус на первое поле
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 300);
        }
    }

    closeQuickOrder() {
        const modal = document.getElementById('quickOrderModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    setupAnimations() {
        // Intersection Observer для анимаций при скролле
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Наблюдаем за элементами
        const elementsToAnimate = document.querySelectorAll(
            '.service-card, .feature-item, .stat-item, .contact-item'
        );
        
        elementsToAnimate.forEach(el => {
            observer.observe(el);
        });

        // Анимация счетчиков
        this.setupCounterAnimation();
    }

    setupCounterAnimation() {
        const counters = document.querySelectorAll('.counter');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target >= 1000000) {
                element.textContent = (current / 1000000).toFixed(1) + 'M+';
            } else if (target >= 1000) {
                element.textContent = Math.floor(current / 1000) + 'K+';
            } else {
                element.textContent = Math.floor(current) + (target < 100 ? '%' : '+');
            }
        }, 16);
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
        // Инициализация Яндекс.Метрики
        if (typeof ym === 'undefined') {
            console.log('Яндекс.Метрика не загружена');
        }

        // Инициализация Google Analytics
        if (typeof gtag === 'undefined') {
            console.log('Google Analytics не загружен');
        }

        // Отслеживание кликов по кнопкам
        this.trackButtonClicks();
    }

    trackButtonClicks() {
        const buttons = document.querySelectorAll('button, .cta-button, .nav-cta');
        
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
            gtag('event', 'purchase', {
                event_category: 'Order',
                event_label: 'Quick Order',
                value: 1
            });
        }

        if (typeof ym !== 'undefined') {
            ym(CONFIG.YANDEX_METRIKA_ID, 'reachGoal', 'order_submitted');
        }
    }
}

// =====================================
// 🎯 ГЛОБАЛЬНЫЕ ФУНКЦИИ
// =====================================

// Функции для использования в HTML
window.calculateWithAI = async function() {
    if (window.app) {
        await window.app.handleCalculation();
    }
};

window.orderTransport = function() {
    const phone = CONFIG.CONTACT.phone;
    const message = 'Здравствуйте! Хочу заказать перевозку.';
    window.open(`tel:${phone}`, '_self');
    
    // Дублируем в WhatsApp
    setTimeout(() => {
        const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }, 1000);
};

window.submitOrder = async function(event) {
    if (window.app) {
        await window.app.handleOrderSubmit(event);
    }
};

window.openQuickOrder = function() {
    if (window.app) {
        window.app.openQuickOrder();
    }
};

window.closeQuickOrder = function() {
    if (window.app) {
        window.app.closeQuickOrder();
    }
};

// =====================================
// 🚀 ЗАПУСК ПРИЛОЖЕНИЯ
// =====================================

// Инициализация приложения
window.app = new AvtoGOSTApp();

// Дополнительные глобальные обработчики
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

// Отслеживание времени на странице
let timeOnPage = 0;
setInterval(() => {
    timeOnPage += 30;
    
    // Отправляем событие каждые 5 минут
    if (timeOnPage % 300 === 0 && typeof gtag !== 'undefined') {
        gtag('event', 'engagement', {
            event_category: 'Time on Page',
            value: timeOnPage
        });
    }
}, 30000);

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