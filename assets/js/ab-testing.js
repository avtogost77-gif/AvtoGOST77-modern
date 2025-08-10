// A/B Testing System for Avtogost77
class ABTesting {
    constructor() {
        this.tests = {
            'cta-button-text': {
                variants: [
                    'Рассчитать 30 сек',
                    'Узнать цену сейчас',
                    'Быстрый расчет'
                ],
                element: '.btn-primary'
            },
            'hero-subtitle': {
                variants: [
                    'Логистика без стресса: подача от 2 часов, контроль 24/7, всё под ключ. Просто нажмите кнопку — остальное сделаем мы',
                    'Надежные грузоперевозки по России. Подача за 2 часа, точный расчет стоимости онлайн.',
                    'Профессиональная логистика для вашего бизнеса. Быстрая подача, выгодные цены.'
                ],
                element: '.hero-subtitle'
            },
            'calculator-cta': {
                variants: [
                    'Рассчитать стоимость',
                    'Узнать цену',
                    'Быстрый расчет'
                ],
                element: '#calculateButton'
            }
        };
        
        this.init();
    }
    
    init() {
        // Проверяем, есть ли сохраненный вариант
        this.loadVariants();
        
        // Применяем варианты
        this.applyVariants();
        
        // Отслеживаем клики
        this.trackClicks();
    }
    
    loadVariants() {
        this.currentVariants = {};
        
        Object.keys(this.tests).forEach(testName => {
            const saved = localStorage.getItem(`ab_test_${testName}`);
            if (saved) {
                this.currentVariants[testName] = parseInt(saved);
            } else {
                // Случайный выбор варианта
                const variant = Math.floor(Math.random() * this.tests[testName].variants.length);
                this.currentVariants[testName] = variant;
                localStorage.setItem(`ab_test_${testName}`, variant.toString());
            }
        });
    }
    
    applyVariants() {
        Object.keys(this.tests).forEach(testName => {
            const test = this.tests[testName];
            const variant = this.currentVariants[testName];
            const newText = test.variants[variant];
            
            const elements = document.querySelectorAll(test.element);
            elements.forEach(element => {
                if (element.tagName === 'BUTTON' || element.tagName === 'A') {
                    element.textContent = newText;
                } else if (element.tagName === 'P') {
                    element.textContent = newText;
                }
            });
            
            // Отслеживаем показ варианта
            this.trackImpression(testName, variant);
        });
    }
    
    trackClicks() {
        // Отслеживаем клики по кнопкам
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-primary, #calculateButton')) {
                Object.keys(this.tests).forEach(testName => {
                    const test = this.tests[testName];
                    if (e.target.matches(test.element)) {
                        const variant = this.currentVariants[testName];
                        this.trackClick(testName, variant, e.target.textContent);
                    }
                });
            }
        });
    }
    
    trackImpression(testName, variant) {
        if (typeof ym !== 'undefined') {
            ym(103413788, 'reachGoal', 'ab_test_impression', {
                test: testName,
                variant: variant,
                page: window.location.pathname
            });
        }
        
        console.log(`📊 A/B Test Impression: ${testName} - variant ${variant}`);
    }
    
    trackClick(testName, variant, buttonText) {
        if (typeof ym !== 'undefined') {
            ym(103413788, 'reachGoal', 'ab_test_click', {
                test: testName,
                variant: variant,
                button_text: buttonText,
                page: window.location.pathname
            });
        }
        
        console.log(`📊 A/B Test Click: ${testName} - variant ${variant} - "${buttonText}"`);
    }
    
    // Метод для получения статистики
    getStats() {
        const stats = {};
        Object.keys(this.tests).forEach(testName => {
            const variant = this.currentVariants[testName];
            stats[testName] = {
                current_variant: variant,
                text: this.tests[testName].variants[variant]
            };
        });
        return stats;
    }
}

// Инициализация A/B тестирования
document.addEventListener('DOMContentLoaded', () => {
    window.abTesting = new ABTesting();
    
    // Выводим статистику в консоль для отладки
    console.log('🎯 A/B Testing Stats:', window.abTesting.getStats());
});
