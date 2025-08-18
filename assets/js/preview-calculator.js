// Логика предварительного расчета (без формы)
class PreviewCalculator {
    constructor() {
        this.initEventListeners();
    }

    initEventListeners() {
        // Кнопка предварительного расчета
        const previewButton = document.getElementById('previewButton');
        if (previewButton) {
            previewButton.addEventListener('click', () => this.showPreview());
        }

        // Кнопка точного расчета после предварительного
        const getExactQuoteButton = document.getElementById('getExactQuote');
        if (getExactQuoteButton) {
            getExactQuoteButton.addEventListener('click', () => this.showExactCalculation());
        }

        // Кнопка нового расчета для предварительного результата
        const newPreviewButton = document.getElementById('newPreviewCalculation');
        if (newPreviewButton) {
            newPreviewButton.addEventListener('click', () => this.resetCalculator());
        }
    }

    showPreview() {
        // Валидация базовых полей
        const fromCity = document.getElementById('fromCity').value.trim();
        const toCity = document.getElementById('toCity').value.trim();
        const weight = parseFloat(document.getElementById('weight').value) || 0;
        const volume = parseFloat(document.getElementById('volume').value) || 0;

        if (!fromCity || !toCity) {
            alert('Пожалуйста, укажите города отправления и назначения');
            return;
        }

        if (weight <= 0 && volume <= 0) {
            alert('Пожалуйста, укажите вес или объем груза');
            return;
        }

        // Получаем экземпляр калькулятора
        const calculator = window.smartCalculator;
        if (!calculator) {
            console.error('Калькулятор не найден');
            return;
        }

        // Выполняем расчет
        const isConsolidated = document.getElementById('isConsolidated').checked;
        
        try {
            const result = calculator.calculateShipping(fromCity, toCity, weight, volume, isConsolidated);
            this.displayPreview(result);
            
            // Скрываем форму и показываем предварительный результат
            document.querySelector('.calculator-form').style.display = 'none';
            document.getElementById('previewResult').style.display = 'block';
            
            // Скролл к результату
            document.getElementById('previewResult').scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });

            // Трекинг события
            if (typeof ym !== 'undefined') {
                ym(98418467, 'reachGoal', 'preview_calculation');
            }
        } catch (error) {
            console.error('Ошибка расчета:', error);
            alert('Произошла ошибка при расчете. Попробуйте еще раз или свяжитесь с нами по телефону.');
        }
    }

    displayPreview(result) {
        const priceElement = document.getElementById('previewPrice');
        const detailsElement = document.getElementById('previewDetails');
        
        if (priceElement) {
            priceElement.textContent = `от ${result.totalPrice.toLocaleString()} ₽`;
        }

        if (detailsElement) {
            detailsElement.innerHTML = `
                <div class="result-detail-item">
                    <span class="result-detail-label">Тип транспорта</span>
                    <span class="result-detail-value">${result.transportType.name} ${result.transportType.icon}</span>
                </div>
                <div class="result-detail-item">
                    <span class="result-detail-label">Тип груза</span>
                    <span class="result-detail-value">${result.isConsolidated ? 'Сборный' : 'Отдельная машина'}</span>
                </div>
                <div class="result-detail-item">
                    <span class="result-detail-label">Примерное время</span>
                    <span class="result-detail-value">${this.getDeliveryTime(result)}</span>
                </div>
                <div class="result-detail-item">
                    <span class="result-detail-label">Расстояние</span>
                    <span class="result-detail-value">~${result.distance} км</span>
                </div>
            `;
        }
    }

    getDeliveryTime(result) {
        if (result.isConsolidated) {
            return result.distance < 500 ? '1-3 дня' : '3-7 дней';
        } else {
            return result.distance < 500 ? 'В день подачи' : '1-2 дня';
        }
    }

    showExactCalculation() {
        // Скрываем предварительный результат
        document.getElementById('previewResult').style.display = 'none';
        
        // Показываем основную кнопку расчета
        document.getElementById('calculateButton').style.display = 'inline-flex';
        document.getElementById('previewButton').style.display = 'none';
        
        // Показываем форму обратно
        document.querySelector('.calculator-form').style.display = 'block';
        
        // Эмулируем клик по основной кнопке расчета
        document.getElementById('calculateButton').click();
        
        // Трекинг события
        if (typeof ym !== 'undefined') {
            ym(98418467, 'reachGoal', 'exact_quote_request');
        }
    }

    resetCalculator() {
        // Скрываем предварительный результат
        document.getElementById('previewResult').style.display = 'none';
        
        // Возвращаем исходное состояние кнопок
        document.getElementById('previewButton').style.display = 'inline-flex';
        document.getElementById('calculateButton').style.display = 'none';
        
        // Показываем форму
        document.querySelector('.calculator-form').style.display = 'block';
        
        // Очищаем поля
        document.getElementById('fromCity').value = '';
        document.getElementById('toCity').value = '';
        document.getElementById('weight').value = '';
        document.getElementById('volume').value = '';
        document.getElementById('isConsolidated').checked = false;
        
        // Скролл к форме
        document.querySelector('.calculator-form').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.previewCalculator = new PreviewCalculator();
});
