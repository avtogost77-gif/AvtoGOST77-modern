/**
 * Анимации для блоков преимуществ
 * v1.0.0 - 2025-08
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация анимаций для блоков преимуществ
    initBenefitAnimations();
    
    // Инициализация анимаций для компактных преимуществ
    initCompactBenefitAnimations();
    
    // Инициализация анимаций для технологических преимуществ
    initTechFeatureAnimations();
});

/**
 * Инициализация анимаций для основных блоков преимуществ
 */
function initBenefitAnimations() {
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    if (!benefitCards.length) return;
    
    benefitCards.forEach(card => {
        // Анимация при наведении
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.benefit-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.benefit-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
        });
        
        // Анимация при прокрутке (если поддерживается IntersectionObserver)
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(card);
        } else {
            // Fallback для старых браузеров
            card.classList.add('animated');
        }
    });
}

/**
 * Инициализация анимаций для компактных блоков преимуществ
 */
function initCompactBenefitAnimations() {
    const compactBenefits = document.querySelectorAll('.compact-benefit');
    
    if (!compactBenefits.length) return;
    
    compactBenefits.forEach(benefit => {
        benefit.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.compact-benefit-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.2s ease';
            }
        });
        
        benefit.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.compact-benefit-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

/**
 * Инициализация анимаций для технологических преимуществ
 */
function initTechFeatureAnimations() {
    const techFeatures = document.querySelectorAll('.tech-feature');
    
    if (!techFeatures.length) return;
    
    techFeatures.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.tech-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) translateY(-5px)';
                icon.style.transition = 'transform 0.3s ease';
                
                // Добавляем тень для эффекта "парения"
                icon.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.1)';
            }
        });
        
        feature.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.tech-icon');
            if (icon) {
                icon.style.transform = 'scale(1) translateY(0)';
                icon.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
            }
        });
        
        // Анимация при прокрутке
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(feature);
        } else {
            feature.classList.add('fade-in');
        }
    });
}

/**
 * Обновление анимаций при изменении DOM
 * Вызывать эту функцию, если блоки преимуществ добавляются динамически
 */
function refreshBenefitAnimations() {
    initBenefitAnimations();
    initCompactBenefitAnimations();
    initTechFeatureAnimations();
}

// Экспортируем функцию для возможного использования в других скриптах
window.refreshBenefitAnimations = refreshBenefitAnimations;
