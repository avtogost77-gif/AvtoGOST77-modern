// ===============================================
// 🌍 ФИАС ИНТЕГРАЦИЯ - ТОЧНЫЕ АДРЕСА РОССИИ
// DaData API для автозаполнения адресов
// ===============================================

console.log('🌍 ФИАС Integration Loading...');

// Конфигурация DaData API
const DADATA_CONFIG = {
    // Тестовый токен (замени на рабочий)
    token: "your_dadata_token_here",
    baseUrl: "https://suggestions.dadata.ru/suggestions/api/4_1/rs",
    // Для тестирования используем демо без токена
    demo: true
};

class FiasAddressManager {
    constructor() {
        this.suggestions = new Map();
        this.selectedAddresses = new Map();
        this.init();
    }

    init() {
        console.log('🚀 Initializing FIAS Address Manager...');
        this.setupAddressInputs();
        this.setupEventListeners();
    }

    // Настройка полей ввода адресов
    setupAddressInputs() {
        // Заменяем простые поля городов на поля адресов
        const fromCityInput = document.getElementById('fromCity');
        const toCityInput = document.getElementById('toCity');

        if (fromCityInput) {
            this.enhanceAddressInput(fromCityInput, 'from');
        }
        
        if (toCityInput) {
            this.enhanceAddressInput(toCityInput, 'to');
        }
    }

    // Улучшаем поле ввода
    enhanceAddressInput(input, type) {
        // Обновляем placeholder
        input.placeholder = 'Введите точный адрес...';
        input.setAttribute('data-address-type', type);

        // Создаем контейнер для подсказок
        const wrapper = document.createElement('div');
        wrapper.className = 'address-input-wrapper';
        wrapper.style.position = 'relative';

        const dropdown = document.createElement('div');
        dropdown.className = 'address-suggestions';
        dropdown.id = `${type}AddressSuggestions`;
        dropdown.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            max-height: 300px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
        `;

        // Оборачиваем input
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        wrapper.appendChild(dropdown);

        console.log(`✅ Enhanced ${type} address input`);
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        document.addEventListener('input', (e) => {
            if (e.target.hasAttribute('data-address-type')) {
                this.handleAddressInput(e);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('address-suggestion-item')) {
                this.selectAddress(e);
            } else if (!e.target.closest('.address-input-wrapper')) {
                this.hideAllSuggestions();
            }
        });
    }

    // Обработка ввода адреса
    async handleAddressInput(event) {
        const input = event.target;
        const query = input.value.trim();
        const type = input.getAttribute('data-address-type');

        if (query.length < 3) {
            this.hideSuggestions(type);
            return;
        }

        try {
            const suggestions = await this.searchAddresses(query);
            this.showSuggestions(type, suggestions);
        } catch (error) {
            console.error('❌ Address search error:', error);
            this.showDemoSuggestions(type, query);
        }
    }

    // Поиск адресов через DaData API
    async searchAddresses(query) {
        if (DADATA_CONFIG.demo) {
            // Демо-режим без API
            return this.getDemoSuggestions(query);
        }

        const response = await fetch(`${DADATA_CONFIG.baseUrl}/suggest/address`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${DADATA_CONFIG.token}`
            },
            body: JSON.stringify({
                query: query,
                count: 10,
                locations: [{
                    country: "*"
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`DaData API error: ${response.status}`);
        }

        const data = await response.json();
        return data.suggestions || [];
    }

    // Демо-подсказки для тестирования
    getDemoSuggestions(query) {
        const demoAddresses = [
            {
                value: "г Москва, ул Тверская, д 1",
                unrestricted_value: "г Москва, ул Тверская, д 1",
                data: {
                    city: "Москва",
                    street: "Тверская",
                    house: "1",
                    geo_lat: "55.755826",
                    geo_lon: "37.6173",
                    region: "Москва"
                }
            },
            {
                value: "г Санкт-Петербург, Невский пр-кт, д 28",
                unrestricted_value: "г Санкт-Петербург, Невский пр-кт, д 28",
                data: {
                    city: "Санкт-Петербург",
                    street: "Невский проспект",
                    house: "28",
                    geo_lat: "59.935493",
                    geo_lon: "30.322513",
                    region: "Санкт-Петербург"
                }
            },
            {
                value: "г Екатеринбург, ул Ленина, д 50",
                unrestricted_value: "г Екатеринбург, ул Ленина, д 50",
                data: {
                    city: "Екатеринбург",
                    street: "Ленина",
                    house: "50",
                    geo_lat: "56.838011",
                    geo_lon: "60.597474",
                    region: "Свердловская область"
                }
            }
        ];

        return demoAddresses.filter(addr => 
            addr.value.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Показ подсказок
    showSuggestions(type, suggestions) {
        const dropdown = document.getElementById(`${type}AddressSuggestions`);
        if (!dropdown) return;

        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }

        dropdown.innerHTML = suggestions.map((suggestion, index) => `
            <div class="address-suggestion-item" data-type="${type}" data-index="${index}" style="
                padding: 12px 16px;
                cursor: pointer;
                border-bottom: 1px solid #f3f4f6;
                transition: background-color 0.2s;
            ">
                <div style="font-weight: 500; color: #111827;">
                    ${this.highlightMatch(suggestion.value, this.getQuery(type))}
                </div>
                <div style="font-size: 12px; color: #6b7280; margin-top: 2px;">
                    ${suggestion.data.region || ''}
                </div>
            </div>
        `).join('');

        // Добавляем hover эффекты
        dropdown.querySelectorAll('.address-suggestion-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#f9fafb';
            });
            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = '';
            });
        });

        dropdown.style.display = 'block';
        this.suggestions.set(type, suggestions);
    }

    // Подсветка совпадений
    highlightMatch(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong style="background: #fef3c7;">$1</strong>');
    }

    // Получение текущего запроса
    getQuery(type) {
        const input = document.querySelector(`[data-address-type="${type}"]`);
        return input ? input.value : '';
    }

    // Выбор адреса
    selectAddress(event) {
        const item = event.target.closest('.address-suggestion-item');
        const type = item.getAttribute('data-type');
        const index = parseInt(item.getAttribute('data-index'));
        
        const suggestions = this.suggestions.get(type);
        if (!suggestions || !suggestions[index]) return;

        const selectedAddress = suggestions[index];
        
        // Заполняем поле
        const input = document.querySelector(`[data-address-type="${type}"]`);
        if (input) {
            input.value = selectedAddress.value;
        }

        // Сохраняем выбранный адрес
        this.selectedAddresses.set(type, selectedAddress);

        // Скрываем подсказки
        this.hideSuggestions(type);

        // Уведомляем об изменении
        this.onAddressSelected(type, selectedAddress);

        console.log(`📍 Selected ${type} address:`, selectedAddress);
    }

    // Обработка выбора адреса
    onAddressSelected(type, address) {
        // Показываем уведомление
        if (window.showNotification) {
            showNotification(`📍 Адрес ${type === 'from' ? 'отправления' : 'доставки'} выбран!`, 'success');
        }

        // Если выбраны оба адреса, рассчитываем точное расстояние
        if (this.selectedAddresses.has('from') && this.selectedAddresses.has('to')) {
            this.calculatePreciseDistance();
        }
    }

    // Расчет точного расстояния по координатам
    calculatePreciseDistance() {
        const fromAddress = this.selectedAddresses.get('from');
        const toAddress = this.selectedAddresses.get('to');

        if (!fromAddress?.data?.geo_lat || !toAddress?.data?.geo_lat) {
            console.warn('⚠️ No coordinates available for distance calculation');
            return null;
        }

        const distance = this.getDistanceFromLatLonInKm(
            parseFloat(fromAddress.data.geo_lat),
            parseFloat(fromAddress.data.geo_lon),
            parseFloat(toAddress.data.geo_lat),
            parseFloat(toAddress.data.geo_lon)
        );

        console.log(`📏 Precise distance: ${distance.toFixed(1)} km`);
        
        // Обновляем глобальную переменную для калькулятора
        window.lastCalculatedDistance = distance;

        return distance;
    }

    // Формула расчета расстояния по координатам (Haversine)
    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Радиус Земли в км
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    deg2rad(deg) {
        return deg * (Math.PI/180);
    }

    // Скрытие подсказок
    hideSuggestions(type) {
        const dropdown = document.getElementById(`${type}AddressSuggestions`);
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    hideAllSuggestions() {
        this.hideSuggestions('from');
        this.hideSuggestions('to');
    }

    // Получение выбранного адреса
    getSelectedAddress(type) {
        return this.selectedAddresses.get(type);
    }

    // Получение всех выбранных адресов
    getAllSelectedAddresses() {
        return {
            from: this.selectedAddresses.get('from'),
            to: this.selectedAddresses.get('to')
        };
    }
}

// Глобальные функции для интеграции с калькулятором
window.getFiasDistance = function() {
    return window.lastCalculatedDistance || null;
};

window.getFiasAddresses = function() {
    if (window.fiasManager) {
        return window.fiasManager.getAllSelectedAddresses();
    }
    return { from: null, to: null };
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌍 Initializing FIAS Address Manager...');
    window.fiasManager = new FiasAddressManager();
    
    // Показываем уведомление о новой функции
    setTimeout(() => {
        if (window.showNotification) {
            showNotification('🌍 Новая функция: точные адреса России! Попробуйте ввести адрес.', 'info');
        }
    }, 2000);
});

console.log('✅ FIAS Integration Ready!');