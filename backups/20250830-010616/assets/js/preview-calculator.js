// Логика предварительного расчета (без формы)
class PreviewCalculator {
    constructor() {
        this.initEventListeners();
    }

    initEventListeners() {
        // Кнопка расчета
        const calculateButton = document.getElementById('calculateButton');
        if (calculateButton) {
            calculateButton.addEventListener('click', () => this.showPreview());
        }

        // Кнопка нового расчета
        const newCalculationButton = document.getElementById('newCalculation');
        if (newCalculationButton) {
            newCalculationButton.addEventListener('click', () => this.resetCalculator());
        }
    }

    async showPreview() {
        // Валидация базовых полей
        const fromCityElement = document.getElementById('fromCity');
        const toCityElement = document.getElementById('toCity');
        const weightElement = document.getElementById('cargoWeight');
        const volumeElement = document.getElementById('cargoVolume');
        const consolidatedElement = document.getElementById('consolidated');

        if (!fromCityElement || !toCityElement) {
            console.error('Элементы формы не найдены:', {
                fromCity: !!fromCityElement,
                toCity: !!toCityElement
            });
            alert('Произошла ошибка. Обновите страницу и попробуйте еще раз.');
            return;
        }

        const fromCity = fromCityElement.value.trim();
        const toCity = toCityElement.value.trim();
        const weight = weightElement ? (parseFloat(weightElement.value) || 0) : 0;
        const volume = volumeElement ? (parseFloat(volumeElement.value) || 0) : 0;

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
            console.error('Калькулятор не найден. Доступные объекты:', {
                smartCalculator: !!window.smartCalculator,
                smartCalculatorV2: !!window.smartCalculatorV2,
                calculator: !!window.calculator
            });
            alert('Калькулятор не загружен. Обновите страницу и попробуйте еще раз.');
            return;
        }

        // Выполняем расчет
        const isConsolidated = consolidatedElement ? consolidatedElement.checked : false;
        
        console.log('Выполняем расчет с параметрами:', {
            fromCity, toCity, weight, volume, isConsolidated
        });
        
        try {
            console.log('Вызываем calculatePrice с параметрами:', {
                fromCity, toCity, weight, volume, 
                cargoType: isConsolidated ? 'consolidated' : 'general',
                isConsolidated
            });
            
            const result = await calculator.calculatePrice(fromCity, toCity, weight, volume, isConsolidated ? 'сборный' : 'general');
            console.log('Результат расчета:', result);
            
            this.displayPreview(result);
            
            // Трекинг события
            if (typeof ym !== 'undefined') {
                ym(98418467, 'reachGoal', 'preview_calculation');
            }
        } catch (error) {
            console.error('Ошибка расчета:', error);
            console.error('Стек ошибки:', error.stack);
            alert('Произошла ошибка при расчете. Попробуйте еще раз или свяжитесь с нами по телефону.');
        }
    }

    displayPreview(result) {
        console.log('Отображаем результат:', result);
        
        // Показываем блок результата
        const resultElement = document.getElementById('calculatorResult');
        if (resultElement) {
            resultElement.style.display = 'block';
            resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        const priceElement = document.getElementById('priceDisplay');
        const transportElement = document.getElementById('transportDisplay');
        const deliveryTimeElement = document.getElementById('deliveryTimeDisplay');
        const distanceElement = document.getElementById('distanceDisplay');
        
        if (priceElement) {
            try {
                // Используем result.price вместо result.totalPrice
                const price = result.price || result.totalPrice || 0;
                priceElement.textContent = `от ${price.toLocaleString()} ₽`;
                console.log('Цена отображена:', price);
            } catch (error) {
                console.error('Ошибка отображения цены:', error);
                priceElement.textContent = 'от 0 ₽';
            }
        } else {
            console.warn('Элемент priceDisplay не найден');
        }

        // Отображаем транспорт
        if (transportElement) {
            try {
                const transportName = result.transport || 'Транспорт';
                const transportIcon = '🚛';
                transportElement.textContent = `${transportName} ${transportIcon}`;
            } catch (error) {
                console.error('Ошибка отображения транспорта:', error);
                transportElement.textContent = '🚛 Транспорт';
            }
        }

        // Отображаем время доставки
        if (deliveryTimeElement) {
            try {
                deliveryTimeElement.textContent = this.getDeliveryTime(result);
            } catch (error) {
                console.error('Ошибка отображения времени доставки:', error);
                deliveryTimeElement.textContent = '~';
            }
        }

        // Отображаем расстояние
        if (distanceElement) {
            try {
                const distance = result.distance || '~';
                distanceElement.textContent = `~${distance} км`;
            } catch (error) {
                console.error('Ошибка отображения расстояния:', error);
                distanceElement.textContent = '~';
            }
        }
    }

    getDeliveryTime(result) {
        // Используем result.deliveryTime если есть, иначе вычисляем
        if (result.deliveryTime) {
            return result.deliveryTime;
        }
        
        const isConsolidated = result.isConsolidated || (result.details && result.details.isConsolidated) || false;
        const distance = result.distance || 0;
        
        console.log('Вычисляем время доставки:', { isConsolidated, distance });
        
        if (isConsolidated) {
            return distance < 500 ? '1-3 дня' : '3-7 дней';
        } else {
            return distance < 500 ? 'В день подачи' : '1-2 дня';
        }
    }



    resetCalculator() {
        // Скрываем результат
        const resultElement = document.getElementById('calculatorResult');
        if (resultElement) {
            resultElement.style.display = 'none';
        }
        
        // Показываем форму
        const formElement = document.querySelector('.calculator-form');
        if (formElement) {
            formElement.style.display = 'block';
        }
        
        // Очищаем поля
        if (document.getElementById('fromCity')) document.getElementById('fromCity').value = '';
        if (document.getElementById('toCity')) document.getElementById('toCity').value = '';
        if (document.getElementById('cargoWeight')) document.getElementById('cargoWeight').value = '';
        if (document.getElementById('cargoVolume')) document.getElementById('cargoVolume').value = '';
        if (document.getElementById('consolidated')) document.getElementById('consolidated').checked = false;
        
        // Скролл к форме
        if (formElement) {
            formElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.previewCalculator = new PreviewCalculator();
});
