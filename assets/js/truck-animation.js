// 🚚 СКРИПТ АНИМАЦИИ ФУРЫ
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем стили
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'assets/css/truck-animation.css';
    document.head.appendChild(style);
    
    // Создаем HTML структуру фуры
    const truckHTML = '<div class="truck-animation-container" id="truckAnimation"><div class="truck-tracks"></div><a href="tel:+79162720932" class="truck-wrapper"><div class="truck-message">🚀 Едем к вам с первого гудка!</div><div class="truck"><div class="truck-cabin"><div class="exhaust"><div class="smoke"></div><div class="smoke"></div><div class="smoke"></div></div></div><div class="truck-trailer"><span class="truck-phone">�� +7 916 272-09-32</span><div class="wheel wheel-1"></div><div class="wheel wheel-2"></div><div class="wheel wheel-3"></div><div class="wheel wheel-4"></div></div></div></a></div><button class="truck-toggle" onclick="toggleTruck()">🚚 Скрыть фуру</button>';
    
    // Добавляем фуру в конец body
    document.body.insertAdjacentHTML('beforeend', truckHTML);
    
    // Функция toggle
    window.toggleTruck = function() {
        const container = document.getElementById('truckAnimation');
        const button = document.querySelector('.truck-toggle');
        const visible = container.style.display !== 'none';
        
        if (visible) {
            container.style.display = 'none';
            button.textContent = '🚚 Показать фуру';
            localStorage.setItem('truck_hidden', 'true');
        } else {
            container.style.display = 'block';
            button.textContent = '🚚 Скрыть фуру';
            localStorage.removeItem('truck_hidden');
        }
    };
    
    // Проверяем настройки
    if (localStorage.getItem('truck_hidden') === 'true') {
        toggleTruck();
    }
    
    // Отслеживание кликов
    setTimeout(() => {
        const truckLink = document.querySelector('.truck-wrapper');
        if (truckLink) {
            truckLink.addEventListener('click', function() {
                if (typeof ym !== 'undefined') {
                    ym(103413788, 'reachGoal', 'truck_phone_click');
                }
            });
        }
    }, 1000);
});
