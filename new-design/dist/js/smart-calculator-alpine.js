// Умный калькулятор v2 для Alpine.js
window.smartCalculator = function() {
    return {
        currentStep: 1,
        loading: false,
        result: null,
        formData: {
            from: '',
            to: '',
            weight: '',
            volume: '',
            consolidated: false
        },
        
        init() {
            // Инициализация калькулятора
        },
        
        async calculate() {
            this.loading = true;
            
            // Имитация расчета (заменить на реальную логику)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Простая логика расчета
            const distance = this.calculateDistance(this.formData.from, this.formData.to);
            const basePrice = distance * 45; // 45 руб за км
            const weightMultiplier = this.formData.weight > 1000 ? 1.2 : 1;
            const consolidatedDiscount = this.formData.consolidated ? 0.65 : 1;
            
            const finalPrice = Math.round(basePrice * weightMultiplier * consolidatedDiscount);
            
            this.result = {
                price: finalPrice,
                transport: this.getTransportType(this.formData.weight, this.formData.volume),
                distance: distance,
                time: Math.ceil(distance / 500), // примерно 500 км в день
                type: this.formData.consolidated ? 'Сборный' : 'Отдельная машина'
            };
            
            this.currentStep = 2;
            this.loading = false;
        },
        
        calculateDistance(from, to) {
            // Упрощенная логика расчета расстояния
            const distances = {
                'санкт-петербург': 700,
                'спб': 700,
                'казань': 820,
                'екатеринбург': 1400,
                'новосибирск': 3300,
                'краснодар': 1350,
                'ростов': 1050,
                'самара': 860,
                'нижний новгород': 420
            };
            
            const city = to.toLowerCase();
            return distances[city] || 800; // дефолт 800 км
        },
        
        getTransportType(weight, volume) {
            if (weight <= 1500) return 'Газель';
            if (weight <= 3000) return 'Трехтонник';
            if (weight <= 5000) return 'Пятитонник';
            if (weight <= 10000) return 'Десятитонник';
            return 'Фура 20 тонн';
        },
        
        reset() {
            this.currentStep = 1;
            this.result = null;
            this.formData = {
                from: '',
                to: '',
                weight: '',
                volume: '',
                consolidated: false
            };
        }
    }
};