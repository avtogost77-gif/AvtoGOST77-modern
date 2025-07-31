// 🏙️ РАСШИРЕННАЯ БАЗА ГОРОДОВ РОССИИ (1102 города)
// Загружаем полную базу из JSON при инициализации

let CITIES_DATABASE = [];
let CITIES_BY_REGION = {};

// Загрузка базы городов
async function loadCitiesDatabase() {
    try {
        const response = await fetch('/russia-cities.json');
        const data = await response.json();
        
        // Преобразуем в простой массив городов для быстрого поиска
        CITIES_DATABASE = data.map(city => ({
            name: city.name,
            nameAlt: city.name_alt,
            region: city.region.name,
            population: city.population,
            label: city.label,
            zip: city.zip
        }));
        
        // Группируем по регионам для быстрого доступа
        data.forEach(city => {
            const region = city.region.name;
            if (!CITIES_BY_REGION[region]) {
                CITIES_BY_REGION[region] = [];
            }
            CITIES_BY_REGION[region].push(city.name);
        });
        
        console.log(`✅ Загружено ${CITIES_DATABASE.length} городов России`);
        return true;
        
    } catch (error) {
        console.error('❌ Ошибка загрузки базы городов:', error);
        // Fallback на минимальный список
        loadFallbackCities();
        return false;
    }
}

// Запасной вариант - топ городов
function loadFallbackCities() {
    const FALLBACK_CITIES = [
        // Московская область
        'Москва', 'Подольск', 'Химки', 'Мытищи', 'Балашиха', 'Королёв', 
        'Люберцы', 'Электросталь', 'Коломна', 'Одинцово', 'Щёлково',
        'Сергиев Посад', 'Орехово-Зуево', 'Долгопрудный', 'Жуковский',
        'Пушкино', 'Ногинск', 'Клин', 'Дмитров', 'Раменское', 'Воскресенск',
        'Домодедово', 'Реутов', 'Видное', 'Ступино', 'Павловский Посад',
        'Наро-Фоминск', 'Лобня', 'Ивантеевка', 'Дубна', 'Егорьевск',
        'Чехов', 'Красногорск', 'Фрязино', 'Солнечногорск', 'Лыткарино',
        'Голицыно', 'Поваровка', 'Кубинка', 'Истра', 'Можайск',
        
        // Ленинградская область  
        'Санкт-Петербург', 'Гатчина', 'Выборг', 'Всеволожск', 'Сосновый Бор',
        'Тихвин', 'Кириши', 'Кингисепп', 'Волхов', 'Сертолово', 'Луга',
        'Тосно', 'Отрадное', 'Колпино', 'Пушкин', 'Петергоф',
        
        // Другие регионы
        'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород',
        'Челябинск', 'Самара', 'Омск', 'Ростов-на-Дону', 'Уфа',
        'Красноярск', 'Пермь', 'Воронеж', 'Волгоград', 'Краснодар'
    ];
    
    CITIES_DATABASE = FALLBACK_CITIES.map(name => ({
        name: name,
        nameAlt: name.replace(/ё/g, 'е'),
        region: 'Россия',
        population: 0,
        label: name.toLowerCase().replace(/\s/g, '-'),
        zip: 0
    }));
}

// Поиск городов с учетом региона
function searchCities(query, limit = 10) {
    const searchTerm = query.toLowerCase().trim();
    
    if (searchTerm.length < 2) return [];
    
    // Ищем точные совпадения в начале
    const exactMatches = CITIES_DATABASE.filter(city => 
        city.name.toLowerCase().startsWith(searchTerm) ||
        city.nameAlt.toLowerCase().startsWith(searchTerm)
    );
    
    // Ищем частичные совпадения
    const partialMatches = CITIES_DATABASE.filter(city => 
        !city.name.toLowerCase().startsWith(searchTerm) &&
        !city.nameAlt.toLowerCase().startsWith(searchTerm) &&
        (city.name.toLowerCase().includes(searchTerm) ||
         city.nameAlt.toLowerCase().includes(searchTerm))
    );
    
    // Объединяем и сортируем по населению
    const allMatches = [...exactMatches, ...partialMatches]
        .sort((a, b) => b.population - a.population)
        .slice(0, limit);
    
    return allMatches;
}

// Автокомплит для полей ввода
function setupEnhancedCityAutocomplete() {
    const fromInput = document.getElementById('fromCity');
    const toInput = document.getElementById('toCity');
    
    [fromInput, toInput].forEach(input => {
        if (!input) return;
        
        const suggestionsDiv = document.querySelector(`.address-suggestions[data-for="${input.name}"]`);
        if (!suggestionsDiv) return;
        
        let debounceTimer;
        
        input.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            const value = this.value;
            
            // Задержка для оптимизации
            debounceTimer = setTimeout(() => {
                const matches = searchCities(value);
                
                if (matches.length > 0) {
                    suggestionsDiv.innerHTML = matches.map(city => {
                        const regionInfo = city.region !== 'Россия' ? 
                            `<span class="city-region">${city.region}</span>` : '';
                        
                        return `<div class="suggestion-item" data-city="${city.name}">
                            ${city.name} ${regionInfo}
                        </div>`;
                    }).join('');
                    suggestionsDiv.style.display = 'block';
                } else if (value.length >= 2) {
                    suggestionsDiv.innerHTML = '<div class="no-results">Город не найден</div>';
                    suggestionsDiv.style.display = 'block';
                } else {
                    suggestionsDiv.style.display = 'none';
                }
            }, 300);
        });
        
        // Клик по подсказке
        suggestionsDiv.addEventListener('click', function(e) {
            if (e.target.classList.contains('suggestion-item')) {
                input.value = e.target.dataset.city;
                suggestionsDiv.innerHTML = '';
                suggestionsDiv.style.display = 'none';
            }
        });
        
        // Скрыть подсказки при клике вне
        document.addEventListener('click', function(e) {
            if (!input.contains(e.target) && !suggestionsDiv.contains(e.target)) {
                suggestionsDiv.style.display = 'none';
            }
        });
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    // Загружаем базу городов
    await loadCitiesDatabase();
    
    // Инициализируем автокомплит
    setupEnhancedCityAutocomplete();
});

// Экспорт функций для использования в других скриптах
window.CitiesEnhanced = {
    search: searchCities,
    getByRegion: (region) => CITIES_BY_REGION[region] || [],
    getAll: () => CITIES_DATABASE,
    isLoaded: () => CITIES_DATABASE.length > 0
};