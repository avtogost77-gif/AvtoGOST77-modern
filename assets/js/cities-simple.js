// Простой справочник городов вместо DaData
const POPULAR_CITIES = [
  // Топ-10 городов
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
  'Челябинск',
  'Самара',
  'Омск',
  'Ростов-на-Дону',
  
  // Другие крупные города
  'Уфа',
  'Красноярск',
  'Пермь',
  'Воронеж',
  'Волгоград',
  'Краснодар',
  'Саратов',
  'Тюмень',
  'Тольятти',
  'Ижевск',
  'Барнаул',
  'Ульяновск',
  'Иркутск',
  'Хабаровск',
  'Владивосток',
  'Ярославль',
  'Махачкала',
  'Томск',
  'Оренбург',
  'Кемерово',
  'Рязань',
  'Астрахань',
  'Пенза',
  'Липецк',
  'Тула',
  'Киров',
  'Чебоксары',
  'Калининград',
  'Брянск',
  'Курск',
  'Иваново',
  'Ставрополь',
  'Белгород',
  'Сочи',
  'Нижний Тагил',
  'Архангельск',
  'Владимир',
  'Калуга',
  'Смоленск',
  'Вологда',
  'Орел',
  'Череповец',
  'Мурманск',
  'Саранск'
];

// Простой автокомплит
function setupCityAutocomplete() {
  const fromInput = document.getElementById('fromCity');
  const toInput = document.getElementById('toCity');
  
  [fromInput, toInput].forEach(input => {
    if (!input) return;
    
    const suggestionsDiv = document.querySelector(`.address-suggestions[data-for="${input.name}"]`);
    if (!suggestionsDiv) return;
    
    input.addEventListener('input', function() {
      const value = this.value.toLowerCase();
      if (value.length < 2) {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.style.display = 'none';
        return;
      }
      
      const matches = POPULAR_CITIES.filter(city => 
        city.toLowerCase().includes(value)
      ).slice(0, 5);
      
      if (matches.length > 0) {
        suggestionsDiv.innerHTML = matches.map(city => 
          `<div class="suggestion-item" data-city="${city}">${city}</div>`
        ).join('');
        suggestionsDiv.style.display = 'block';
      } else {
        suggestionsDiv.innerHTML = '';
        suggestionsDiv.style.display = 'none';
      }
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

// Запускаем при загрузке
document.addEventListener('DOMContentLoaded', setupCityAutocomplete);