// Calculator.js - совместимость с SmartCalculatorV2
// Версия: 2.0.1 (совместимость с GitHub)
// Основной функционал: smart-calculator-v2.min.js


// Проверяем наличие основной системы калькулятора
document.addEventListener('DOMContentLoaded', function() {
    // Если SmartCalculatorV2 уже загружен, используем его
    if (window.smartCalculatorV2) {
        return;
    }
    
    // Если SmartCalculatorV2 не загружен, загружаем его
    if (!document.querySelector('script[src*="smart-calculator-v2"]')) {
        const script = document.createElement('script');
        script.src = 'assets/js/smart-calculator-v2.min.js';
        script.async = true;
        document.head.appendChild(script);
    }
    
    // Обработка ссылок на калькулятор
    const calculatorLinks = document.querySelectorAll('a[href*="calculator"]');
    calculatorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Если на главной странице, прокручиваем к калькулятору
            if (window.location.pathname === '/index.html' || window.location.pathname === '/') {
                const calculator = document.querySelector('#calculator, .calculator-section');
                if (calculator) {
                    calculator.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Переходим на главную с якорем калькулятора
                window.location.href = '/index.html#calculator';
            }
        });
    });
    
    // Инициализация форм калькулятора если они есть
    setTimeout(() => {
        if (window.smartCalculatorV2) {
        } else {
            initFallbackCalculator();
        }
    }, 1000);
});

// Fallback калькулятор для совместимости
function initFallbackCalculator() {
    const calculatorForm = document.getElementById('calculatorForm');
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fromCity = document.getElementById('fromCity')?.value;
            const toCity = document.getElementById('toCity')?.value;
            const weight = parseFloat(document.getElementById('weight')?.value || 0);
            
            if (!fromCity || !toCity || !weight) {
                alert('Заполните города и вес груза!');
                return;
            }
            
            // Простой расчет для совместимости
            const basePrice = weight <= 1500 ? 10000 : 
                             weight <= 3000 ? 13000 : 
                             weight <= 5000 ? 20000 : 
                             weight <= 10000 ? 24000 : 28000;
            
            const result = {
                price: basePrice,
                transport: weight <= 1500 ? 'Газель' : 
                          weight <= 3000 ? '3-тонник' : 
                          weight <= 5000 ? '5-тонник' : 
                          weight <= 10000 ? '10-тонник' : 'Фура 20т',
                deliveryTime: '1-2 дня'
            };
            
            showFallbackResult(result);
        });
    }
}

function showFallbackResult(result) {
    const resultDiv = document.getElementById('calculatorResult') || createResultDiv();
    
    resultDiv.innerHTML = `
        <div class="calc-success">
            <h3>🎯 Расчет готов!</h3>
            
            <div class="price-block">
                <div class="price-main">
                    <span class="price-label">Стоимость перевозки:</span>
                    <span class="price-value">${result.price.toLocaleString()} ₽</span>
                </div>
                <div class="price-info">
                    <p>🚛 ${result.transport}</p>
                    <p>📅 ${result.deliveryTime}</p>
                </div>
            </div>

            <div class="cta-buttons">
                <button class="btn btn-primary btn-lg" onclick="window.location.href='contact.html'">
                    📝 Оставить заявку
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='tel:+79162720932'">
                    📞 +7 (916) 272-09-32
                </button>
            </div>

            <div class="disclaimer">
                <p><small>* Окончательная стоимость подтверждается менеджером</small></p>
            </div>
        </div>
    `;
    
    resultDiv.style.display = 'block';
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function createResultDiv() {
    const div = document.createElement('div');
    div.id = 'calculatorResult';
    div.className = 'calculator-result';
    
    const form = document.getElementById('calculatorForm');
    if (form) {
        form.parentNode.insertBefore(div, form.nextSibling);
    } else {
        const calculator = document.querySelector('.calculator-section, #calculator');
        if (calculator) {
            calculator.appendChild(div);
        }
    }
    
    return div;
}

// Экспорт для совместимости с модульной системой
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        init: function() {
        },
        version: '2.0.1',
        compatible: true
    };
}
