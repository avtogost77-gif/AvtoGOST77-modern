// ========================================
// Smart Calculator V3 with AI
// Based on original business logic
// ========================================

class SmartCalculator {
    constructor() {
        // Transport types with real parameters
        this.transportTypes = {
            gazelle: {
                name: 'Газель',
                maxWeight: 1500,
                maxVolume: 16,
                density: 94,
                minPrice: 10000,
                minPriceRegion: 7500,
                coefficient: 0.36,
                icon: '🚐'
            },
            threeTon: {
                name: '3-тонник',
                maxWeight: 3000,
                maxVolume: 18,
                density: 167,
                minPrice: 13000,
                minPriceRegion: 9750,
                coefficient: 0.46,
                icon: '🚛'
            },
            fiveTon: {
                name: '5-тонник',
                maxWeight: 5000,
                maxVolume: 36,
                density: 139,
                minPrice: 20000,
                minPriceRegion: 15000,
                coefficient: 0.71,
                icon: '🚛'
            },
            tenTon: {
                name: '10-тонник',
                maxWeight: 10000,
                maxVolume: 50,
                density: 200,
                minPrice: 24000,
                minPriceRegion: 18000,
                coefficient: 0.86,
                icon: '🚚'
            },
            truck: {
                name: 'Фура 20т',
                maxWeight: 20000,
                maxVolume: 82,
                density: 244,
                minPrice: 28000,
                minPriceRegion: 21000,
                coefficient: 1.0,
                icon: '🚚'
            }
        };
        
        // Real price examples
        this.realPrices = {
            'Москва-Санкт-Петербург': { distance: 700, price: 70000, pricePerKm: 100 },
            'Москва-Нижний Новгород': { distance: 400, price: 60000, pricePerKm: 150 },
            'Москва-Казань': { distance: 800, price: 80000, pricePerKm: 100 },
            'Москва-Екатеринбург': { distance: 1400, price: 140000, pricePerKm: 100 }
        };
        
        // Regions for internal delivery check
        this.regions = {
            'Московская область': [
                'Москва', 'Подольск', 'Химки', 'Балашиха', 'Мытищи', 'Королёв',
                'Люберцы', 'Красногорск', 'Одинцово', 'Голицыно', 'Коломна'
            ],
            'Санкт-Петербург и область': [
                'Санкт-Петербург', 'Гатчина', 'Выборг', 'Всеволожск', 'Колпино'
            ]
        };
        
        this.init();
    }
    
    init() {
        // Initialize calculator form
        const form = document.getElementById('calculatorForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormCalculation();
            });
        }
        
        // Initialize cities datalist
        this.setupCitiesDatalist();
    }
    
    calculatePrice(fromCity, toCity, weight, volume = 0, cargoType = 'general') {
        // Check same region
        if (this.isSameRegion(fromCity, toCity)) {
            return {
                error: true,
                message: 'Внимание! Сборные грузы только между регионами. Внутри региона - только отдельная машина!',
                alternativePrice: this.calculateFullTruckPrice(fromCity, toCity)
            };
        }
        
        // Select optimal transport
        const transport = this.selectOptimalTransport(weight, volume);
        if (!transport) {
            return {
                error: true,
                message: 'Груз не помещается даже в фуру! Требуется спецтранспорт.'
            };
        }
        
        // Get distance
        const distance = this.getDistance(fromCity, toCity);
        
        // Calculate base price
        let pricePerKm;
        if (distance < 50) {
            pricePerKm = 700;
        } else if (distance < 100) {
            pricePerKm = 280;
        } else if (distance < 200) {
            pricePerKm = 200;
        } else if (distance < 500) {
            pricePerKm = 150;
        } else {
            pricePerKm = 100;
        }
        
        let basePrice = distance * pricePerKm;
        
        // Apply transport coefficient
        if (transport.name !== 'Фура 20т') {
            basePrice = basePrice * transport.coefficient;
        }
        
        // Apply minimum price
        const isMoscow = fromCity.includes('Москв') || toCity.includes('Москв');
        const minPrice = isMoscow ? transport.minPrice : transport.minPriceRegion;
        basePrice = Math.max(basePrice, minPrice);
        
        // Load factor
        const loadFactor = this.calculateLoadFactor(weight, volume, transport);
        basePrice *= loadFactor;
        
        // Route factor
        const routeFactor = this.getRouteFactor(fromCity, toCity);
        basePrice *= routeFactor;
        
        // Cargo type factor
        const cargoFactor = this.getCargoFactor(cargoType);
        basePrice *= cargoFactor;
        
        // Round to nice number
        const finalPrice = Math.round(basePrice / 500) * 500;
        
        return {
            success: true,
            price: finalPrice,
            transport: transport.name,
            icon: transport.icon,
            distance: distance,
            pricePerKm: Math.round(finalPrice / distance),
            deliveryTime: this.calculateDeliveryTime(distance),
            details: {
                weight,
                volume,
                density: volume > 0 ? Math.round(weight / volume) : 0,
                loadPercent: Math.round((weight / transport.maxWeight) * 100),
                volumePercent: volume > 0 ? Math.round((volume / transport.maxVolume) * 100) : 0
            }
        };
    }
    
    isSameRegion(city1, city2) {
        for (const [region, cities] of Object.entries(this.regions)) {
            if (cities.includes(city1) && cities.includes(city2)) {
                return true;
            }
        }
        return false;
    }
    
    selectOptimalTransport(weight, volume) {
        const transports = Object.values(this.transportTypes).sort((a, b) => a.maxWeight - b.maxWeight);
        
        for (const transport of transports) {
            if (weight <= transport.maxWeight) {
                if (volume && volume > 0) {
                    if (volume <= transport.maxVolume) {
                        return transport;
                    }
                } else {
                    return transport;
                }
            }
        }
        return null;
    }
    
    calculateLoadFactor(weight, volume, transport) {
        const weightUsage = weight / transport.maxWeight;
        const volumeUsage = volume > 0 ? volume / transport.maxVolume : 0;
        const maxUsage = Math.max(weightUsage, volumeUsage);
        
        if (maxUsage < 0.3) return 1.5;
        if (maxUsage < 0.5) return 1.3;
        if (maxUsage < 0.7) return 1.1;
        return 1.0;
    }
    
    getRouteFactor(from, to) {
        const popularRoutes = [
            ['Москва', 'Санкт-Петербург'],
            ['Москва', 'Нижний Новгород'],
            ['Москва', 'Екатеринбург'],
            ['Москва', 'Казань']
        ];
        
        for (const route of popularRoutes) {
            if ((route.includes(from) && route.includes(to))) {
                return 0.9;
            }
        }
        
        if (to === 'Москва' || to === 'Санкт-Петербург') {
            return 0.95;
        }
        
        return 1.0;
    }
    
    getCargoFactor(cargoType) {
        const factors = {
            'general': 1.0,
            'fragile': 1.3,
            'valuable': 1.5,
            'dangerous': 1.8,
            'perishable': 1.4,
            'furniture': 1.2,
            'appliance': 1.2,
            'documents': 0.8
        };
        return factors[cargoType] || 1.0;
    }
    
    calculateDeliveryTime(distance) {
        if (distance < 500) return '1-2 дня';
        if (distance < 1000) return '2-3 дня';
        if (distance < 2000) return '3-4 дня';
        if (distance < 3000) return '4-5 дней';
        return '5-7 дней';
    }
    
    calculateFullTruckPrice(from, to) {
        const distance = this.getDistance(from, to) || 50;
        const basePrice = 20000;
        const kmPrice = distance < 50 ? 500 : 200;
        return Math.max(basePrice, distance * kmPrice);
    }
    
    getDistance(from, to) {
        const routes = {
            'Москва-Санкт-Петербург': 700,
            'Москва-Нижний Новгород': 400,
            'Москва-Екатеринбург': 1400,
            'Москва-Казань': 800,
            'Москва-Ростов-на-Дону': 1100,
            'Москва-Новосибирск': 3300
        };
        
        const routeKey = `${from}-${to}`;
        const reverseKey = `${to}-${from}`;
        
        return routes[routeKey] || routes[reverseKey] || 500;
    }
    
    handleFormCalculation() {
        const fromCity = document.getElementById('fromCity')?.value || '';
        const toCity = document.getElementById('toCity')?.value || '';
        const weight = parseFloat(document.getElementById('weight')?.value || 0);
        const volume = parseFloat(document.getElementById('volume')?.value || 0);
        
        if (!fromCity || !toCity || !weight) {
            showNotification('Заполните обязательные поля: откуда, куда и вес груза', 'error');
            return;
        }
        
        const result = this.calculatePrice(fromCity, toCity, weight, volume);
        
        if (result.error) {
            showNotification(result.message, 'error');
            if (result.alternativePrice) {
                this.showAlternativePrice(result.alternativePrice);
            }
        } else {
            this.showCalculationResults(result);
        }
    }
    
    showCalculationResults(result) {
        const resultsDiv = document.getElementById('calcResults');
        if (!resultsDiv) return;
        
        // Update main price card
        const priceCards = resultsDiv.querySelectorAll('.price-card');
        if (priceCards[0]) {
            priceCards[0].querySelector('.transport-icon').textContent = result.icon;
            priceCards[0].querySelector('.transport-name').textContent = result.transport;
            priceCards[0].querySelector('.price-value').textContent = result.price.toLocaleString() + '₽';
            
            // Update details
            const details = priceCards[0].querySelector('.price-details');
            if (details) {
                details.innerHTML = `
                    <span>🚛 до ${result.details.weight} кг</span>
                    <span>📏 ${result.details.loadPercent}% загрузки</span>
                    <span>⏱️ ${result.deliveryTime}</span>
                `;
            }
        }
        
        // Update route info
        document.getElementById('routeValue').textContent = 
            `${document.getElementById('fromCity').value} → ${document.getElementById('toCity').value}`;
        document.getElementById('distanceValue').textContent = `${result.distance} км`;
        document.getElementById('timeValue').textContent = result.deliveryTime;
        
        // Show results
        resultsDiv.style.display = 'block';
        scrollToElement('#calcResults');
    }
    
    setupCitiesDatalist() {
        const cities = [
            'Москва', 'Санкт-Петербург', 'Нижний Новгород', 'Екатеринбург',
            'Новосибирск', 'Казань', 'Челябинск', 'Самара', 'Омск',
            'Ростов-на-Дону', 'Уфа', 'Красноярск', 'Воронеж', 'Пермь',
            'Волгоград', 'Краснодар', 'Саратов', 'Тюмень', 'Тольятти',
            'Ижевск', 'Барнаул', 'Ульяновск', 'Иркутск', 'Хабаровск',
            'Владивосток', 'Ярославль', 'Махачкала', 'Томск', 'Оренбург',
            'Кемерово', 'Рязань', 'Астрахань', 'Пенза', 'Липецк',
            'Тула', 'Киров', 'Чебоксары', 'Калининград', 'Брянск',
            'Курск', 'Иваново', 'Ставрополь', 'Белгород', 'Сочи'
        ];
        
        const datalist = document.createElement('datalist');
        datalist.id = 'cities-list';
        
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            datalist.appendChild(option);
        });
        
        document.body.appendChild(datalist);
    }
}

// Voice input for calculator
function startCalculatorVoice() {
    const voiceBtn = document.querySelector('.big-voice-btn');
    const voiceText = voiceBtn?.querySelector('.voice-text');
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showNotification('Голосовой ввод не поддерживается в вашем браузере', 'error');
        return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = true;
    
    if (voiceBtn) {
        voiceBtn.classList.add('listening');
        if (voiceText) voiceText.textContent = 'Слушаю...';
    }
    
    recognition.start();
    
    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
        
        if (voiceText) voiceText.textContent = transcript || 'Слушаю...';
    };
    
    recognition.onend = () => {
        if (voiceBtn) voiceBtn.classList.remove('listening');
        if (voiceText) {
            const finalText = voiceText.textContent;
            voiceText.textContent = 'Нажмите и говорите';
            
            if (finalText && finalText !== 'Слушаю...' && finalText !== 'Нажмите и говорите') {
                processCalculatorText(finalText);
            }
        }
    };
    
    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (voiceBtn) voiceBtn.classList.remove('listening');
        if (voiceText) voiceText.textContent = 'Нажмите и говорите';
        showNotification('Ошибка распознавания. Попробуйте еще раз.', 'error');
    };
}

// Process calculator text input
function processCalculatorText(text) {
    const textarea = document.getElementById('calcTextInput');
    if (!textarea) {
        // If not in text mode, switch to it
        switchInputMode('type');
        setTimeout(() => {
            const textarea = document.getElementById('calcTextInput');
            if (textarea) {
                textarea.value = text || '';
                processCalculatorTextSubmit();
            }
        }, 100);
    } else {
        textarea.value = text || textarea.value;
        processCalculatorTextSubmit();
    }
}

// Submit calculator text
function processCalculatorTextSubmit() {
    const text = document.getElementById('calcTextInput')?.value || '';
    if (!text.trim()) return;
    
    // Update AI message
    const aiMessage = document.getElementById('aiMessage');
    if (aiMessage) {
        aiMessage.innerHTML = `<p>Анализирую: "${text}"...</p>`;
    }
    
    // Parse and calculate
    setTimeout(() => {
        parseAndFillCalculator(text);
    }, 1000);
}

// Handle photo upload
document.addEventListener('DOMContentLoaded', () => {
    const photoInput = document.getElementById('cargo-photo');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoUpload);
    }
});

function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const preview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const uploadZone = document.getElementById('photoUploadZone');
    
    if (preview && previewImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            preview.style.display = 'block';
            uploadZone.querySelector('.upload-label').style.display = 'none';
            
            // Simulate AI analysis
            analyzeCargoPhoto();
        };
        reader.readAsDataURL(file);
    }
}

function analyzeCargoPhoto() {
    const analysis = document.getElementById('aiAnalysis');
    if (!analysis) return;
    
    // Show analyzing
    analysis.style.display = 'block';
    
    // Simulate analysis
    setTimeout(() => {
        analysis.innerHTML = `
            <div class="analysis-result">
                <h4>AI анализ завершен!</h4>
                <p>Тип груза: <strong>Бытовая техника</strong></p>
                <p>Размеры: <strong>~180x60x60 см</strong></p>
                <p>Вес: <strong>~60-80 кг</strong></p>
                <p>Рекомендация: <strong>Газель с грузчиками</strong></p>
            </div>
        `;
        
        // Update AI message
        const aiMessage = document.getElementById('aiMessage');
        if (aiMessage) {
            aiMessage.innerHTML = `<p>Отлично! Я определил параметры груза по фото. Это холодильник, нужна газель с грузчиками. Укажите маршрут для расчета.</p>`;
        }
    }, 2000);
}

// Order transport
function orderTransport(type) {
    showNotification('📞 Звоните для оформления заказа: +7 916 272-09-32', 'info');
    
    // Open chat with pre-filled message
    setTimeout(() => {
        openAIChat();
        const input = document.getElementById('chatInput');
        if (input) {
            input.value = `Хочу заказать ${type === 'gazelle' ? 'газель' : type} по рассчитанному маршруту`;
            sendChatMessage();
        }
    }, 2000);
}

// Initialize calculator
const calculator = new SmartCalculator();

// Add listening state styles
const calculatorStyles = `
<style>
.big-voice-btn.listening {
    background: var(--accent);
    animation: pulse 1.5s infinite;
}

.big-voice-btn.listening .voice-waves span {
    background: white;
    animation-duration: 0.5s;
}

.analysis-result {
    background: rgba(0, 212, 170, 0.1);
    padding: 1rem;
    border-radius: 8px;
    margin-top: 1rem;
}

.analysis-result h4 {
    color: var(--accent);
    margin: 0 0 0.5rem;
}

.analysis-result p {
    margin: 0.25rem 0;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', calculatorStyles);