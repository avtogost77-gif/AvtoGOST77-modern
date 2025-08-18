// 🎨 ИНТЕРАКТИВНАЯ ИНФОГРАФИКА АВТОГОСТ77
// Система выбора типа доставки с анимациями

class InteractiveInfographic {
    constructor() {
        this.currentStep = 'start';
        this.selectedService = null;
        this.counters = {};
        this.initInfographic();
        this.startCounters();
    }

    initInfographic() {
        // Создаем контейнер для инфографики
        const container = document.getElementById('interactive-infographic');
        if (!container) return;

        container.innerHTML = this.getInfographicHTML();
        this.attachEventListeners();
        this.animateEntrance();
    }

    getInfographicHTML() {
        return `
            <div class="infographic-container">
                <div class="infographic-header">
                    <h2>🚛 Как мы доставим ваш груз?</h2>
                    <p>Выберите подходящий вариант и узнайте детали</p>
                </div>
                
                <div class="cargo-flowchart">
                    <div class="flow-start" id="flow-start">
                        <div class="cargo-box">
                            <div class="cargo-icon">📦</div>
                            <div class="cargo-title">ВАШ ГРУЗ</div>
                            <div class="cargo-subtitle">Какой объем?</div>
                        </div>
                    </div>
                    
                    <div class="flow-arrows">
                        <div class="arrow arrow-1"></div>
                        <div class="arrow arrow-2"></div>
                        <div class="arrow arrow-3"></div>
                        <div class="arrow arrow-4"></div>
                    </div>
                    
                    <div class="service-options">
                        <div class="service-card gazelle" data-service="gazelle">
                            <div class="service-icon">🚐</div>
                            <div class="service-title">ГАЗЕЛЬ</div>
                            <div class="service-subtitle">До 1.5 тонн</div>
                            <div class="service-price">от 3,000₽</div>
                            <div class="service-badge">Быстро</div>
                        </div>
                        
                        <div class="service-card truck" data-service="truck">
                            <div class="service-icon">🚛</div>
                            <div class="service-title">ОТДЕЛЬНАЯ МАШИНА</div>
                            <div class="service-subtitle">1.5-20 тонн</div>
                            <div class="service-price">от 25₽/км</div>
                            <div class="service-badge">Надежно</div>
                        </div>
                        
                        <div class="service-card consolidated" data-service="consolidated">
                            <div class="service-icon">🏭</div>
                            <div class="service-title">СБОРНЫЙ ГРУЗ</div>
                            <div class="service-subtitle">Экономия 70%</div>
                            <div class="service-price">от 15₽/кг</div>
                            <div class="service-badge">Выгодно</div>
                        </div>
                        
                        <div class="service-card calculator" data-service="calculator">
                            <div class="service-icon">⚡</div>
                            <div class="service-title">НЕ ЗНАЮ</div>
                            <div class="service-subtitle">Расчет за 30 сек</div>
                            <div class="service-price">Бесплатно</div>
                            <div class="service-badge">Точно</div>
                        </div>
                    </div>
                    
                    <div class="benefits-section" id="benefits-section" style="display: none;">
                        <div class="benefits-arrow"></div>
                        <div class="benefits-title">✅ ВАШИ ВЫГОДЫ</div>
                        <div class="benefits-grid">
                            <div class="benefit-item">
                                <div class="benefit-icon">⏰</div>
                                <div class="benefit-text">Подача за 2 часа</div>
                            </div>
                            <div class="benefit-item">
                                <div class="benefit-icon">💰</div>
                                <div class="benefit-text">Прозрачная цена</div>
                            </div>
                            <div class="benefit-item">
                                <div class="benefit-icon">📞</div>
                                <div class="benefit-text">Менеджер 24/7</div>
                            </div>
                            <div class="benefit-item">
                                <div class="benefit-icon">🛡️</div>
                                <div class="benefit-text">Полная ответственность</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="live-stats">
                    <div class="stat-item">
                        <div class="stat-number" id="today-orders">47</div>
                        <div class="stat-label">заявок сегодня</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number" id="total-clients">12,247</div>
                        <div class="stat-label">довольных клиентов</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">99.2%</div>
                        <div class="stat-label">доставок в срок</div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Клики по типам доставки
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('click', (e) => {
                this.selectService(e.currentTarget.dataset.service);
            });
            
            // Эффект наведения
            card.addEventListener('mouseenter', (e) => {
                this.highlightService(e.currentTarget);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.unhighlightService(e.currentTarget);
            });
        });

        // Клики по преимуществам
        document.querySelectorAll('.benefit-item').forEach(benefit => {
            benefit.addEventListener('click', (e) => {
                this.showBenefitDetails(e.currentTarget);
            });
        });
    }

    selectService(serviceType) {
        this.selectedService = serviceType;
        
        // Анимация выбора
        document.querySelectorAll('.service-card').forEach(card => {
            card.classList.remove('selected', 'dimmed');
            if (card.dataset.service === serviceType) {
                card.classList.add('selected');
            } else {
                card.classList.add('dimmed');
            }
        });

        // Показываем преимущества с анимацией
        setTimeout(() => {
            const benefitsSection = document.getElementById('benefits-section');
            benefitsSection.style.display = 'block';
            setTimeout(() => benefitsSection.classList.add('visible'), 50);
        }, 300);

        // Аналитика
        if (typeof ym !== 'undefined') {
            ym(103413788, 'reachGoal', `infographic_${serviceType}_selected`);
        }

        // Редирект на соответствующую воронку через 2 секунды
        setTimeout(() => {
            this.redirectToFunnel(serviceType);
        }, 2000);
    }

    redirectToFunnel(serviceType) {
        const funnels = {
            'gazelle': '#calculator',
            'truck': '#calculator', 
            'consolidated': '#calculator',
            'calculator': '#calculator'
        };

        const targetElement = document.querySelector(funnels[serviceType]);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Подсвечиваем калькулятор
            setTimeout(() => {
                targetElement.classList.add('highlighted');
                setTimeout(() => targetElement.classList.remove('highlighted'), 2000);
            }, 500);
        }
    }

    highlightService(card) {
        if (!card.classList.contains('selected')) {
            card.style.transform = 'translateY(-5px) scale(1.02)';
            card.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
        }
    }

    unhighlightService(card) {
        if (!card.classList.contains('selected')) {
            card.style.transform = '';
            card.style.boxShadow = '';
        }
    }

    showBenefitDetails(benefit) {
        // Подсвечиваем преимущество
        benefit.classList.add('pulsing');
        setTimeout(() => benefit.classList.remove('pulsing'), 1000);
    }

    startCounters() {
        // Анимируем счетчики
        this.animateCounter('today-orders', 47, 52, 5000);
        this.animateCounter('total-clients', 12247, 12253, 10000);
    }

    animateCounter(elementId, startValue, endValue, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startTime = Date.now();
        const updateCounter = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(startValue + (endValue - startValue) * progress);
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Запускаем следующий цикл
                setTimeout(() => {
                    this.animateCounter(elementId, endValue, startValue, duration);
                }, 2000);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }

    animateEntrance() {
        // Последовательное появление элементов
        const elements = [
            '.infographic-header',
            '.flow-start',
            '.service-card',
            '.live-stats'
        ];

        elements.forEach((selector, index) => {
            setTimeout(() => {
                document.querySelectorAll(selector).forEach(el => {
                    el.classList.add('animate-in');
                });
            }, index * 200);
        });
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    window.interactiveInfographic = new InteractiveInfographic();
});
