// 🚀 МОБИЛЬНАЯ ОПТИМИЗАЦИЯ JAVASCRIPT
// Загружается только на мобильных устройствах

(function() {
    'use strict';
    
    // Проверяем, что это мобильное устройство
    const isMobile = window.innerWidth < 768;
    
    if (!isMobile) {
        return; // Выходим на десктопе
    }
    
    console.log('🚀 Мобильная оптимизация активирована');
    
    // 🎯 ОТКЛЮЧАЕМ ТЯЖЕЛЫЕ СКРИПТЫ НА МОБИЛКЕ
    const disableHeavyScripts = () => {
        // Отключаем AOS анимации
        if (typeof AOS !== 'undefined') {
            AOS.init({
                disable: true, // Полностью отключаем
                once: true,
                duration: 0
            });
        }
        
        // Отключаем сложные анимации
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.animation = 'none';
        });
        
        // Упрощаем счетчики
        if (typeof AnimatedCounter !== 'undefined') {
            // Показываем финальные значения сразу
            const counters = document.querySelectorAll('.counter, .stat-number');
            counters.forEach(counter => {
                const finalValue = counter.getAttribute('data-target') || counter.textContent;
                counter.textContent = finalValue;
            });
        }
    };
    
    // 🎯 ОПТИМИЗИРУЕМ ЗАГРУЗКУ ИЗОБРАЖЕНИЙ
    const optimizeImages = () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Убираем lazy loading для критических изображений
            if (img.classList.contains('hero-img') || img.classList.contains('logo-img')) {
                img.loading = 'eager';
                img.fetchpriority = 'high';
            } else {
                img.loading = 'lazy';
            }
            
            // Убираем will-change для экономии памяти
            img.style.willChange = 'auto';
        });
    };
    
    // 🎯 УПРОЩАЕМ ФОРМЫ
    const simplifyForms = () => {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Убираем сложную валидацию
            form.addEventListener('submit', function(e) {
                // Простая валидация
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.style.borderColor = '#ff0000';
                    } else {
                        field.style.borderColor = '';
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    alert('Заполните все обязательные поля');
                }
            });
        });
    };
    
    // 🎯 ОТКЛЮЧАЕМ СЛОЖНЫЕ ЭФФЕКТЫ
    const disableEffects = () => {
        // Убираем hover эффекты
        const hoverElements = document.querySelectorAll('.btn, .nav-link, .card');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', function(e) {
                e.preventDefault();
                return false;
            });
        });
        
        // Убираем пульсацию
        const pulseElements = document.querySelectorAll('.pulse, .floating-whatsapp');
        pulseElements.forEach(el => {
            el.style.animation = 'none';
        });
    };
    
    // 🎯 ОПТИМИЗИРУЕМ КАЛЬКУЛЯТОР
    const optimizeCalculator = () => {
        const calculatorForm = document.getElementById('calculatorForm');
        if (calculatorForm) {
            // Упрощаем расчет
            calculatorForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const fromCity = document.getElementById('fromCity')?.value || '';
                const toCity = document.getElementById('toCity')?.value || '';
                const weight = parseFloat(document.getElementById('weight')?.value) || 0;
                const volume = parseFloat(document.getElementById('volume')?.value) || 0;
                
                if (!fromCity || !toCity || !weight || !volume) {
                    alert('Заполните все поля');
                    return;
                }
                
                // Простой расчет без сложной логики
                const basePrice = 5000;
                const totalPrice = basePrice + (weight * 50) + (volume * 3000);
                
                const result = document.getElementById('result');
                if (result) {
                    result.innerHTML = `
                        <h4>Расчет стоимости</h4>
                        <p><strong>Маршрут:</strong> ${fromCity} → ${toCity}</p>
                        <p><strong>Стоимость:</strong> ${totalPrice.toLocaleString()} ₽</p>
                        <button class="btn btn-primary" onclick="openContactForm()">Заказать</button>
                    `;
                    result.style.display = 'block';
                }
            });
        }
    };
    
    // 🎯 ИНИЦИАЛИЗАЦИЯ
    const initMobileOptimization = () => {
        // Ждем загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                disableHeavyScripts();
                optimizeImages();
                simplifyForms();
                disableEffects();
                optimizeCalculator();
            });
        } else {
            disableHeavyScripts();
            optimizeImages();
            simplifyForms();
            disableEffects();
            optimizeCalculator();
        }
        
        // Дополнительная оптимизация после полной загрузки
        window.addEventListener('load', function() {
            console.log('🚀 Мобильная оптимизация завершена');
        });
    };
    
    // Запускаем оптимизацию
    initMobileOptimization();
    
})();
