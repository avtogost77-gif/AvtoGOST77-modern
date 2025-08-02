// =======================================================
// 🚛 MAIN.JS - ОСНОВНОЙ СКРИПТ АВТОГОСТ
// =======================================================

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  
    
    // Инициализация мобильного меню
    initMobileMenu();
    
    // Инициализация плавающих кнопок
    initFloatingButtons();
});

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