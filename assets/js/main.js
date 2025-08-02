// =======================================================
// 🚛 MAIN.JS - ОСНОВНОЙ СКРИПТ АВТОГОСТ
// =======================================================

// Глобальная переменная для калькулятора
let smartCalculatorV2;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Main.js loaded');
    
    // Инициализация калькулятора
    initCalculator();
    
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация плавающих кнопок
    initFloatingButtons();
    
    // Инициализация форм
    initForms();
});

// Инициализация калькулятора
function initCalculator() {
    try {
        if (typeof SmartCalculatorV2 !== 'undefined') {
            smartCalculatorV2 = new SmartCalculatorV2();
            window.smartCalculatorV2 = smartCalculatorV2; // Глобальный доступ
            console.log('✅ SmartCalculatorV2 initialized');
        } else {
            console.error('❌ SmartCalculatorV2 class not found');
            // Повторяем попытку через 1 секунду
            setTimeout(initCalculator, 1000);
        }
    } catch (error) {
        console.error('❌ Calculator initialization error:', error);
    }
}

// Инициализация форм
function initForms() {
    // Форма калькулятора
    const calcForm = document.getElementById('calculatorForm');
    if (calcForm) {
        calcForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('📝 Form submitted');
            handleCalculation();
        });
    }
    
    // Кнопка расчёта по ID
    const calcButton = document.getElementById('calculateButton');
    if (calcButton) {
        calcButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔘 Calculate button clicked');
            handleCalculation();
        });
        console.log('✅ Calculate button listener added');
    } else {
        console.error('❌ Calculate button not found');
    }
    
    // Резервный обработчик для старых onclick
    const oldButton = document.querySelector('button[onclick*="handleCalculation"]');
    if (oldButton) {
        oldButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🔘 Old button clicked');
            handleCalculation();
        });
    }
}

// Универсальная функция расчёта
function handleCalculation() {
    console.log('🧮 Starting calculation...');
    
    if (smartCalculatorV2 && typeof smartCalculatorV2.handleCalculation === 'function') {
        try {
            smartCalculatorV2.handleCalculation();
            console.log('✅ Calculator method called');
        } catch (error) {
            console.error('❌ Calculator error:', error);
            alert('Ошибка расчёта: ' + error.message);
        }
    } else {
        console.error('❌ Calculator not ready');
        alert('Калькулятор загружается, попробуйте через секунду');
        
        // Попытка повторной инициализации
        setTimeout(() => {
            initCalculator();
            setTimeout(handleCalculation, 500);
        }, 1000);
    }
}

// Мобильное меню
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileNav = document.getElementById('mobileNav');
    
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
}

// Плавающие кнопки
function initFloatingButtons() {
    // Кнопки уже инициализированы в HTML
}

// Плавная прокрутка к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Глобальный доступ к функциям
window.smartCalculatorV2 = smartCalculatorV2;
window.handleCalculation = handleCalculation;