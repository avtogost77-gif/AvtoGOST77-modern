/**
 * Анимированный счетчик для hero-статистики
 * Плавно увеличивает числа от 0 до целевого значения
 */
class AnimatedCounter {
  constructor() {
    this.counters = [];
    this.init();
  }

  init() {
    // Находим все счетчики
    const counterElements = document.querySelectorAll('.stat-number[data-target]');
    
    counterElements.forEach(element => {
      const target = parseFloat(element.getAttribute('data-target'));
      const duration = 2000; // 2 секунды
      const step = target / (duration / 16); // 60 FPS
      
      this.counters.push({
        element,
        target,
        current: 0,
        step,
        isAnimating: false
      });
    });

    // Запускаем анимацию при скролле
    this.setupScrollAnimation();
  }

  setupScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = this.counters.find(c => c.element === entry.target);
          if (counter && !counter.isAnimating) {
            this.animateCounter(counter);
          }
        }
      });
    }, {
      threshold: 0.5
    });

    this.counters.forEach(counter => {
      observer.observe(counter.element);
    });
  }

  animateCounter(counter) {
    counter.isAnimating = true;
    counter.element.classList.add('animated');

    const animate = () => {
      counter.current += counter.step;
      
      if (counter.current >= counter.target) {
        counter.current = counter.target;
        counter.element.textContent = this.formatNumber(counter.target);
        counter.isAnimating = false;
        return;
      }

      counter.element.textContent = this.formatNumber(counter.current);
      requestAnimationFrame(animate);
    };

    animate();
  }

  formatNumber(num) {
    if (num % 1 === 0) {
      return Math.floor(num).toString();
    } else {
      return num.toFixed(1);
    }
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  new AnimatedCounter();
});
