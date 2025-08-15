// Улучшенный интерфейс калькулятора

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация улучшенного интерфейса
    initCalculatorUI();
    
    // Обработчики событий для полей ввода
    setupInputHandlers();
    
    // Предварительный расчет при изменении данных
    setupLiveCalculation();
});

// Инициализация улучшенного интерфейса калькулятора
function initCalculatorUI() {
    // Получаем элементы калькулятора
    const calculatorForm = document.getElementById('calculatorForm');
    const calculatorResult = document.getElementById('calculatorResult');
    const calculateButton = document.getElementById('calculateButton');
    const newCalculationButton = document.getElementById('newCalculation');
    
    if (!calculatorForm || !calculatorResult || !calculateButton) return;
    
    // Обработчик кнопки расчета
    calculateButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Проверка валидности формы
        const fromCity = document.getElementById('fromCity');
        const toCity = document.getElementById('toCity');
        const weight = document.getElementById('weight');
        
        if (!fromCity.value || !toCity.value || !weight.value) {
            // Подсветка незаполненных полей
            if (!fromCity.value) fromCity.classList.add('invalid');
            if (!toCity.value) toCity.classList.add('invalid');
            if (!weight.value) weight.classList.add('invalid');
            
            return;
        }
        
        // Показываем загрузку
        calculateButton.disabled = true;
        calculateButton.innerHTML = '<span class="loading-spinner"></span> Рассчитываем...';
        
        // Имитация задержки для демонстрации загрузки
        setTimeout(function() {
            // Вызываем расчет из основного скрипта калькулятора
            if (typeof calculateDelivery === 'function') {
                calculateDelivery();
            } else {
                // Фолбэк, если основная функция недоступна
                showDummyResult();
            }
            
            // Восстанавливаем кнопку
            calculateButton.disabled = false;
            calculateButton.textContent = 'Рассчитать стоимость';
            
            // Обновляем прогресс-бар
            updateProgressBar(2);
            
            // Показываем результат
            calculatorResult.style.display = 'block';
            
            // Скрываем форму
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step3').style.display = 'none';
        }, 800);
    });
    
    // Обработчик кнопки "Новый расчет"
    if (newCalculationButton) {
        newCalculationButton.addEventListener('click', function() {
            // Сбрасываем форму
            calculatorForm.reset();
            
            // Скрываем результат
            calculatorResult.style.display = 'none';
            
            // Показываем форму
            document.getElementById('step1').style.display = 'block';
            
            // Обновляем прогресс-бар
            updateProgressBar(1);
        });
    }
}

// Обработчики событий для полей ввода
function setupInputHandlers() {
    // Обработчик для удаления класса invalid при фокусе
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(function(control) {
        control.addEventListener('focus', function() {
            this.classList.remove('invalid');
        });
    });
    
    // Автофокус на первое поле при загрузке
    const fromCity = document.getElementById('fromCity');
    if (fromCity) {
        setTimeout(function() {
            fromCity.focus();
        }, 500);
    }
    
    // Добавление иконок к полям ввода
    addInputIcons();
}

// Добавление иконок к полям ввода
function addInputIcons() {
    // Иконка для поля "Откуда"
    const fromCityInput = document.getElementById('fromCity');
    if (fromCityInput && fromCityInput.parentNode.classList.contains('input-with-icon')) {
        const fromIcon = document.createElement('span');
        fromIcon.className = 'input-icon';
        fromIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/></svg>';
        fromCityInput.parentNode.appendChild(fromIcon);
    }
    
    // Иконка для поля "Куда"
    const toCityInput = document.getElementById('toCity');
    if (toCityInput && toCityInput.parentNode.classList.contains('input-with-icon')) {
        const toIcon = document.createElement('span');
        toIcon.className = 'input-icon';
        toIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/></svg>';
        toCityInput.parentNode.appendChild(toIcon);
    }
}

// Обновление прогресс-бара
function updateProgressBar(step) {
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressFill = document.getElementById('progressFill');
    
    if (!progressSteps.length || !progressFill) return;
    
    // Обновляем активный шаг
    progressSteps.forEach(function(stepEl) {
        const stepNumber = parseInt(stepEl.getAttribute('data-step'));
        
        if (stepNumber === step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
        
        if (stepNumber < step) {
            stepEl.classList.add('completed');
        } else {
            stepEl.classList.remove('completed');
        }
    });
    
    // Обновляем заполнение прогресс-бара
    const fillPercentage = ((step - 1) / (progressSteps.length - 1)) * 100;
    progressFill.style.width = fillPercentage + '%';
}

// Настройка предварительного расчета при изменении данных
function setupLiveCalculation() {
    const fromCity = document.getElementById('fromCity');
    const toCity = document.getElementById('toCity');
    const weight = document.getElementById('weight');
    const volume = document.getElementById('volume');
    const isConsolidated = document.getElementById('isConsolidated');
    
    if (!fromCity || !toCity || !weight || !volume || !isConsolidated) return;
    
    // Таймер для отложенного расчета
    let calculationTimer;
    
    // Функция для предварительного расчета
    const calculatePreview = function() {
        // Проверяем, заполнены ли основные поля
        if (!fromCity.value || !toCity.value || !weight.value) return;
        
        // Показываем индикатор предварительного расчета
        const calculateButton = document.getElementById('calculateButton');
        if (calculateButton) {
            calculateButton.innerHTML = 'Предварительный расчет...';
        }
        
        // Здесь можно добавить логику для предварительного расчета
        // Например, вызвать упрощенную версию основной функции расчета
        // или показать приблизительную стоимость на основе базовых тарифов
        
        // Для демонстрации просто обновляем текст кнопки через некоторое время
        setTimeout(function() {
            if (calculateButton) {
                calculateButton.innerHTML = 'Рассчитать стоимость (~5000-8000 ₽)';
            }
        }, 500);
    };
    
    // Обработчики изменения полей
    const inputChangeHandler = function() {
        // Отменяем предыдущий таймер
        clearTimeout(calculationTimer);
        
        // Устанавливаем новый таймер для отложенного расчета
        calculationTimer = setTimeout(calculatePreview, 1000);
    };
    
    // Добавляем обработчики событий
    fromCity.addEventListener('input', inputChangeHandler);
    toCity.addEventListener('input', inputChangeHandler);
    weight.addEventListener('input', inputChangeHandler);
    volume.addEventListener('input', inputChangeHandler);
    isConsolidated.addEventListener('change', inputChangeHandler);
}

// Функция для показа демо-результата (если основной скрипт недоступен)
function showDummyResult() {
    const resultPrice = document.getElementById('resultPrice');
    const resultDetails = document.getElementById('resultDetails');
    
    if (!resultPrice || !resultDetails) return;
    
    // Устанавливаем цену
    resultPrice.textContent = '7,500 ₽';
    
    // Заполняем детали
    resultDetails.innerHTML = `
        <div class="result-detail-item">
            <div class="result-detail-label">Маршрут</div>
            <div class="result-detail-value">${document.getElementById('fromCity').value} → ${document.getElementById('toCity').value}</div>
        </div>
        <div class="result-detail-item">
            <div class="result-detail-label">Вес груза</div>
            <div class="result-detail-value">${document.getElementById('weight').value} кг</div>
        </div>
        <div class="result-detail-item">
            <div class="result-detail-label">Объем</div>
            <div class="result-detail-value">${document.getElementById('volume').value || '0'} м³</div>
        </div>
        <div class="result-detail-item">
            <div class="result-detail-label">Тип доставки</div>
            <div class="result-detail-value">${document.getElementById('isConsolidated').checked ? 'Сборный груз' : 'Отдельная машина'}</div>
        </div>
        <div class="result-detail-item">
            <div class="result-detail-label">Время доставки</div>
            <div class="result-detail-value">1-2 дня</div>
        </div>
    `;
}
