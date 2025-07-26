// ===============================================
// 🔑 НАСТРОЙКА DADATA API
// Конфигурация для автозаполнения адресов
// ===============================================

/**
 * ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:
 * 
 * 1. Зарегистрируйтесь на https://dadata.ru
 * 2. Получите API ключ в личном кабинете
 * 3. Замените "YOUR_DADATA_TOKEN_HERE" на ваш токен
 * 4. При необходимости настройте дополнительные параметры
 */

// 🔧 ОСНОВНАЯ НАСТРОЙКА
window.DADATA_TOKEN = "YOUR_DADATA_TOKEN_HERE";

// 📊 ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ (опционально)
window.DADATA_CONFIG_CUSTOM = {
    // Максимальное количество подсказок (1-20)
    maxSuggestions: 10,
    
    // Задержка перед запросом (мс) - для экономии запросов
    requestDelay: 300,
    
    // Минимальная длина запроса для поиска
    minQueryLength: 2,
    
    // Фильтры по регионам (если нужна привязка к области)
    regions: [
        // Примеры регионов (раскомментируйте нужные):
        // { kladr_id: "77" },        // Москва
        // { kladr_id: "78" },        // Санкт-Петербург  
        // { kladr_id: "50" },        // Московская область
    ],
    
    // Фильтры по типам адресов
    addressTypes: {
        // Искать только до уровня дома
        from_bound: { value: "city" },
        to_bound: { value: "house" }
    }
};

// 🎯 АВТОМАТИЧЕСКАЯ АКТИВАЦИЯ
document.addEventListener('DOMContentLoaded', function() {
    if (window.DADATA_TOKEN && window.DADATA_TOKEN !== "YOUR_DADATA_TOKEN_HERE") {
        console.log('✅ DaData API активирован!');
        console.log('🌍 Доступно 40+ млн адресов России');
        
        // Показываем уведомление пользователю
        if (window.showNotification) {
            showNotification('🌍 Активирован точный поиск адресов по всей России!', 'success');
        }
    } else {
        console.log('🔧 DaData работает в демо-режиме');
        console.log('💡 Для активации полной базы добавьте API ключ в dadata-config.js');
    }
});

// 📚 ПОЛЕЗНЫЕ ССЫЛКИ:
console.log(`
🔗 ПОЛЕЗНЫЕ ССЫЛКИ:
📝 Регистрация: https://dadata.ru
📖 Документация: https://dadata.ru/api/suggest/address/
💰 Цены: https://dadata.ru/pricing/
🆓 Бесплатно: 10,000 запросов/месяц
💎 Платно: от 990₽/мес за 100,000 запросов
`);