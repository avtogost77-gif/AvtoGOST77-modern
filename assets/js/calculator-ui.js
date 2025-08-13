// ===============================================
// СОВРЕМЕННЫЙ ИНТЕРФЕЙС КАЛЬКУЛЯТОРА
// ===============================================

class CalculatorUI {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
    }

    bindEvents() {
        // Навигация по шагам
        document.getElementById('nextStep1')?.addEventListener('click', () => this.nextStep());
        document.getElementById('nextStep2')?.addEventListener('click', () => this.nextStep());
        document.getElementById('prevStep2')?.addEventListener('click', () => this.prevStep());
        document.getElementById('prevStep3')?.addEventListener('click', () => this.prevStep());
        
        // Кнопка расчета
        document.getElementById('calculateButton')?.addEventListener('click', () => this.calculate());
        
        // Новый расчет
        document.getElementById('newCalculation')?.addEventListener('click', () => this.resetCalculator());
        
        // Валидация полей
        this.setupFieldValidation();
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.currentStep = Math.min(this.currentStep + 1, this.totalSteps);
            this.updateUI();
        }
    }

    prevStep() {
        this.currentStep = Math.max(this.currentStep - 1, 1);
        this.updateUI();
    }

    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.validateRoute();
            case 2:
                return this.validateCargo();
            default:
                return true;
        }
    }

    validateRoute() {
        const fromCity = document.getElementById('fromCity').value.trim();
        const toCity = document.getElementById('toCity').value.trim();
        
        if (!fromCity) {
            this.showError('fromCity', 'Укажите город отправления');
            return false;
        }
        
        if (!toCity) {
            this.showError('toCity', 'Укажите город назначения');
            return false;
        }
        
        if (fromCity.toLowerCase() === toCity.toLowerCase()) {
            this.showError('toCity', 'Города отправления и назначения не могут совпадать');
            return false;
        }
        
        this.clearErrors();
        return true;
    }

    validateCargo() {
        const weight = document.getElementById('weight').value;
        
        if (!weight || weight <= 0) {
            this.showError('weight', 'Укажите вес груза');
            return false;
        }
        
        if (weight > 20000) {
            this.showError('weight', 'Максимальный вес: 20 тонн. Для больших грузов свяжитесь с менеджером');
            return false;
        }
        
        this.clearErrors();
        return true;
    }

    showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #dc2626; font-size: 0.875rem; margin-top: 0.25rem;';
        
        // Удаляем предыдущую ошибку
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#dc2626';
        
        // Анимация ошибки
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }

    clearErrors() {
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.form-control').forEach(field => {
            field.style.borderColor = '#e5e7eb';
        });
    }

    updateUI() {
        // Обновляем шаги
        document.querySelectorAll('.calc-step').forEach((step, index) => {
            step.classList.toggle('active', index + 1 === this.currentStep);
        });
        
        // Обновляем прогресс
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentStep) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentStep) {
                step.classList.add('active');
            }
        });
        
        this.updateProgress();
        
        // Обновляем кнопки
        this.updateButtons();
    }

    updateProgress() {
        const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    updateButtons() {
        // Обновляем текст кнопки расчета
        const calculateBtn = document.getElementById('calculateButton');
        if (calculateBtn) {
            const btnText = calculateBtn.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = 'Рассчитать стоимость';
            }
        }
    }

    async calculate() {
        const calculateBtn = document.getElementById('calculateButton');
        const btnText = calculateBtn.querySelector('.btn-text');
        const btnLoading = calculateBtn.querySelector('.btn-loading');
        
        // Показываем загрузку
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        calculateBtn.disabled = true;
        
        try {
            // Получаем данные формы
            const formData = this.getFormData();
            
            // Вызываем существующий калькулятор
            if (window.calculator) {
                const result = await window.calculator.calculatePrice(formData);
                this.showResult(result);
            } else {
                throw new Error('Калькулятор не инициализирован');
            }
        } catch (error) {
            this.showError('calculateButton', 'Ошибка расчета. Попробуйте еще раз.');
        } finally {
            // Скрываем загрузку
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            calculateBtn.disabled = false;
        }
    }

    getFormData() {
        return {
            from: document.getElementById('fromCity').value.trim(),
            to: document.getElementById('toCity').value.trim(),
            weight: parseFloat(document.getElementById('weight').value) || 0,
            volume: parseFloat(document.getElementById('volume').value) || 0,
            isConsolidated: document.getElementById('isConsolidated').checked
        };
    }

    showResult(result) {
        const resultContainer = document.getElementById('calculatorResult');
        const resultPrice = document.getElementById('resultPrice');
        const resultSubtitle = document.getElementById('resultSubtitle');
        const resultDetails = document.getElementById('resultDetails');
        
        // Обновляем цену
        resultPrice.textContent = this.formatPrice(result.price);
        
        // Обновляем подзаголовок
        const route = `${result.from} → ${result.to}`;
        resultSubtitle.textContent = `${route} • ${result.weight} кг`;
        
        // Обновляем детали
        resultDetails.innerHTML = this.generateResultDetails(result);
        
        // Показываем результат
        resultContainer.classList.add('show');
        
        // Прокручиваем к результату
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Анимация появления
        resultContainer.style.animation = 'fadeInScale 0.4s ease-out';
    }

    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    generateResultDetails(result) {
        const details = [];
        
        if (result.transport) {
            details.push(`
                <div class="detail-item">
                    <div class="detail-label">Транспорт</div>
                    <div class="detail-value">${result.transport}</div>
                </div>
            `);
        }
        
        if (result.distance) {
            details.push(`
                <div class="detail-item">
                    <div class="detail-label">Расстояние</div>
                    <div class="detail-value">${result.distance} км</div>
                </div>
            `);
        }
        
        if (result.deliveryTime) {
            details.push(`
                <div class="detail-item">
                    <div class="detail-label">Срок доставки</div>
                    <div class="detail-value">${result.deliveryTime}</div>
                </div>
            `);
        }
        
        if (result.pricePerKm) {
            details.push(`
                <div class="detail-item">
                    <div class="detail-label">Тариф за км</div>
                    <div class="detail-value">${result.pricePerKm} ₽/км</div>
                </div>
            `);
        }
        
        return details.join('');
    }

    resetCalculator() {
        // Сбрасываем форму
        document.getElementById('calculatorForm').reset();
        
        // Скрываем результат
        document.getElementById('calculatorResult').classList.remove('show');
        
        // Возвращаемся к первому шагу
        this.currentStep = 1;
        this.updateUI();
        
        // Очищаем ошибки
        this.clearErrors();
        
        // Прокручиваем к началу калькулятора
        document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
    }

    setupFieldValidation() {
        // Автоматическая валидация при вводе
        const fields = ['fromCity', 'toCity', 'weight'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', () => {
                    const error = field.parentNode.querySelector('.field-error');
                    if (error) {
                        error.remove();
                        field.style.borderColor = '#e5e7eb';
                    }
                });
            }
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Ждем инициализации основного калькулятора
    setTimeout(() => {
        window.calculatorUI = new CalculatorUI();
    }, 100);
});

// CSS анимация для ошибок
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
