/**
 * UX УЛУЧШЕНИЯ - TL;DR, АККОРДЕОНЫ, STICKY TOC
 * Современные компоненты для улучшения пользовательского опыта
 */

class UXImprovements {
  constructor() {
    this.init();
  }

  init() {
    this.setupAccordions();
    this.setupStickyTOC();
    this.setupTLDR();
    this.setupLazyLoading();
    this.setupScrollAnimations();
    this.setupCalculatorEnhancements();
    this.setupMobileStickyActions();
  }

  // АККОРДЕОНЫ
  setupAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
      const trigger = accordion.querySelector('.accordion-trigger');
      const content = accordion.querySelector('.accordion-content');
      
      if (trigger && content) {
        trigger.addEventListener('click', () => {
          const isOpen = accordion.classList.contains('open');
          
          // Закрываем все остальные
          accordions.forEach(acc => {
            if (acc !== accordion) {
              acc.classList.remove('open');
              const accContent = acc.querySelector('.accordion-content');
              if (accContent) {
                accContent.style.maxHeight = '0px';
              }
            }
          });
          
          // Переключаем текущий
          if (isOpen) {
            accordion.classList.remove('open');
            content.style.maxHeight = '0px';
          } else {
            accordion.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        });
      }
    });
  }

  // ДОП. CTA ДЛЯ КАЛЬКУЛЯТОРА
  setupCalculatorEnhancements() {
    const btn = document.getElementById('downloadPdf');
    if (btn) {
      btn.addEventListener('click', () => {
        if (window.calculatorV2 && typeof window.calculatorV2.downloadPDF === 'function') {
          window.calculatorV2.downloadPDF();
        } else if (window.pdfLeadMagnet) {
          window.pdfLeadMagnet.showContactModal();
        }
      });
    }
  }

  // ЛИПКИЕ КНОПКИ ДЛЯ МОБИЛЬНЫХ
  setupMobileStickyActions() {
    if (window.matchMedia('(max-width: 768px)').matches) {
      const exists = document.querySelector('.mobile-sticky-actions');
      if (exists) return;
      const bar = document.createElement('div');
      bar.className = 'mobile-sticky-actions';
      bar.innerHTML = `
        <a href="tel:+79162720932" class="msa-item">📞 Звонок</a>
        <a href="https://wa.me/79162720932" target="_blank" class="msa-item">💬 WhatsApp</a>
        <a href="#calculator" class="msa-item">🧮 Расчет</a>
      `;
      document.body.appendChild(bar);
    }
  }

  // STICKY TOC (ОГЛАВЛЕНИЕ)
  setupStickyTOC() {
    const toc = document.querySelector('.sticky-toc');
    if (!toc) return;

    const headings = document.querySelectorAll('h2, h3');
    const tocList = toc.querySelector('.toc-list');
    
    if (!tocList) return;

    // Создаем пункты TOC
    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      heading.id = id;
      
      const tocItem = document.createElement('li');
      tocItem.className = `toc-item toc-${heading.tagName.toLowerCase()}`;
      
      const tocLink = document.createElement('a');
      tocLink.href = `#${id}`;
      tocLink.textContent = heading.textContent;
      tocLink.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth' });
      });
      
      tocItem.appendChild(tocLink);
      tocList.appendChild(tocItem);
    });

    // Sticky поведение
    let isSticky = false;
    const tocOffset = toc.offsetTop;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > tocOffset && !isSticky) {
        toc.classList.add('sticky');
        isSticky = true;
      } else if (window.pageYOffset <= tocOffset && isSticky) {
        toc.classList.remove('sticky');
        isSticky = false;
      }
    });
  }

  // TL;DR (КРАТКОЕ СОДЕРЖАНИЕ)
  setupTLDR() {
    const tldr = document.querySelector('.tldr');
    if (!tldr) return;

    const content = tldr.querySelector('.tldr-content');
    const toggle = tldr.querySelector('.tldr-toggle');
    
    if (!content || !toggle) return;

    toggle.addEventListener('click', () => {
      const isExpanded = tldr.classList.contains('expanded');
      
      if (isExpanded) {
        tldr.classList.remove('expanded');
        toggle.textContent = 'Показать подробности';
      } else {
        tldr.classList.add('expanded');
        toggle.textContent = 'Скрыть подробности';
      }
    });
  }

  // LAZY LOADING ДЛЯ ИЗОБРАЖЕНИЙ
  setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      img.classList.add('lazy');
      imageObserver.observe(img);
    });
  }

  // АНИМАЦИИ ПРИ СКРОЛЛЕ
  setupScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
      observer.observe(el);
    });
  }

  // СОЗДАНИЕ АККОРДЕОНА
  createAccordion(title, content, isOpen = false) {
    const accordion = document.createElement('div');
    accordion.className = `accordion ${isOpen ? 'open' : ''}`;
    
    accordion.innerHTML = `
      <div class="accordion-trigger">
        <span class="accordion-title">${title}</span>
        <span class="accordion-icon">${isOpen ? '−' : '+'}</span>
      </div>
      <div class="accordion-content" style="max-height: ${isOpen ? 'none' : '0px'}">
        <div class="accordion-body">
          ${content}
        </div>
      </div>
    `;
    
    return accordion;
  }

  // СОЗДАНИЕ TL;DR
  createTLDR(summary, details) {
    const tldr = document.createElement('div');
    tldr.className = 'tldr';
    
    tldr.innerHTML = `
      <div class="tldr-header">
        <h3>📋 Краткое содержание</h3>
        <button class="tldr-toggle">Показать подробности</button>
      </div>
      <div class="tldr-content">
        <div class="tldr-summary">
          ${summary}
        </div>
        <div class="tldr-details">
          ${details}
        </div>
      </div>
    `;
    
    return tldr;
  }

  // СОЗДАНИЕ STICKY TOC
  createStickyTOC() {
    const toc = document.createElement('div');
    toc.className = 'sticky-toc';
    
    toc.innerHTML = `
      <div class="toc-header">
        <h3>📑 Содержание</h3>
      </div>
      <ul class="toc-list"></ul>
    `;
    
    return toc;
  }

  // КАРТОЧКИ ПРЕИМУЩЕСТВ
  createBenefitCard(icon, title, description) {
    const card = document.createElement('div');
    card.className = 'benefit-card animate-on-scroll';
    
    card.innerHTML = `
      <div class="benefit-icon">${icon}</div>
      <h4 class="benefit-title">${title}</h4>
      <p class="benefit-description">${description}</p>
    `;
    
    return card;
  }

  // МИНИ-КЕЙС
  createMiniCase(title, stats, description) {
    const caseCard = document.createElement('div');
    caseCard.className = 'mini-case animate-on-scroll';
    
    caseCard.innerHTML = `
      <div class="case-header">
        <h4>${title}</h4>
      </div>
      <div class="case-stats">
        ${stats.map(stat => `<div class="case-stat"><span class="stat-value">${stat.value}</span><span class="stat-label">${stat.label}</span></div>`).join('')}
      </div>
      <p class="case-description">${description}</p>
    `;
    
    return caseCard;
  }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  window.uxImprovements = new UXImprovements();
});
// ========================================
// TL;DR И STICKY TOC КОМПОНЕНТЫ
// ========================================

class TLDRComponent {
  constructor() {
    this.init();
  }

  init() {
    // Добавляем функцию переключения в глобальную область
    window.toggleDetails = (button) => {
      const tldrBlock = button.closest('.tldr-block');
      const content = tldrBlock.nextElementSibling;
      
      if (!content || !content.classList.contains('tldr-content')) {
        console.error('Контент для TL;DR не найден');
        return;
      }
      
      if (content.style.display === 'none' || !content.style.display) {
        content.style.display = 'block';
        button.textContent = 'Скрыть подробности';
      } else {
        content.style.display = 'none';
        button.textContent = 'Показать подробности';
      }
    };
  }
}

class StickyTOC {
  constructor() {
    this.toc = null;
    this.init();
  }

  init() {
    // Находим TOC контейнер
    this.toc = document.querySelector('.sticky-toc');
    if (!this.toc) return;
    
    // Генерируем оглавление
    this.generateTOC();
    
    // Добавляем sticky поведение
    this.setupSticky();
    
    // Отслеживаем активную секцию
    this.trackActiveSection();
  }

  generateTOC() {
    const tocList = this.toc.querySelector('.toc-list');
    if (!tocList) return;
    
    const headings = document.querySelectorAll('h2:not(.no-toc), h3:not(.no-toc)');
    
    headings.forEach((heading, index) => {
      // Добавляем ID если его нет
      if (!heading.id) {
        heading.id = `section-${index}`;
      }
      
      const li = document.createElement('li');
      const a = document.createElement('a');
      
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent;
      a.className = heading.tagName === 'H2' ? 'toc-h2' : 'toc-h3';
      
      // Плавный скролл
      a.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      
      li.appendChild(a);
      tocList.appendChild(li);
    });
  }

  setupSticky() {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 200) {
        this.toc.classList.add('sticky');
      } else {
        this.toc.classList.remove('sticky');
      }
      
      lastScrollTop = scrollTop;
    });
  }

  trackActiveSection() {
    const observerOptions = {
      rootMargin: '-20% 0px -70% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Убираем активный класс у всех
          document.querySelectorAll('.toc-list a').forEach(link => {
            link.classList.remove('active');
          });
          
          // Добавляем активный класс текущему
          const activeLink = document.querySelector(`.toc-list a[href="#${entry.target.id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, observerOptions);
    
    // Наблюдаем за всеми заголовками
    document.querySelectorAll('h2[id], h3[id]').forEach(heading => {
      observer.observe(heading);
    });
  }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
  new TLDRComponent();
  new StickyTOC();
});
// Улучшенный интерфейс калькулятора

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация улучшенного интерфейса
    initCalculatorUI();
    
    // Обработчики событий для полей ввода
    setupInputHandlers();
    
    // Предварительный расчет при изменении данных
    setupLiveCalculation();
});

// Инициализация улучшенного интерфейса калькулятора
function initCalculatorUI() {
    // Получаем элементы калькулятора
    const calculatorForm = document.getElementById('calculatorForm');
    const calculatorResult = document.getElementById('calculatorResult');
    const calculateButton = document.getElementById('calculateButton');
    const newCalculationButton = document.getElementById('newCalculation');
    
    if (!calculatorForm || !calculatorResult || !calculateButton) return;
    
    // Обработчик кнопки расчета
    calculateButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Проверка валидности формы
        const fromCity = document.getElementById('fromCity');
        const toCity = document.getElementById('toCity');
        const weight = document.getElementById('weight');
        
        if (!fromCity.value || !toCity.value || !weight.value) {
            // Подсветка незаполненных полей
            if (!fromCity.value) fromCity.classList.add('invalid');
            if (!toCity.value) toCity.classList.add('invalid');
            if (!weight.value) weight.classList.add('invalid');
            
            return;
        }
        
        // Показываем загрузку
        calculateButton.disabled = true;
        calculateButton.innerHTML = '<span class="loading-spinner"></span> Рассчитываем...';
        
        // Имитация задержки для демонстрации загрузки
        setTimeout(function() {
            // Вызываем расчет из основного скрипта калькулятора
            if (typeof calculateDelivery === 'function') {
                calculateDelivery();
            } else {
                // Фолбэк, если основная функция недоступна
                showDummyResult();
            }
            
            // Восстанавливаем кнопку
            calculateButton.disabled = false;
            calculateButton.textContent = 'Рассчитать стоимость';
            
            // Обновляем прогресс-бар
            updateProgressBar(2);
            
            // Показываем результат
            calculatorResult.style.display = 'block';
            
            // Скрываем форму
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step3').style.display = 'none';
        }, 800);
    });
    
    // Обработчик кнопки "Новый расчет"
    if (newCalculationButton) {
        newCalculationButton.addEventListener('click', function() {
            // Сбрасываем форму
            calculatorForm.reset();
            
            // Скрываем результат
            calculatorResult.style.display = 'none';
            
            // Показываем форму
            document.getElementById('step1').style.display = 'block';
            
            // Обновляем прогресс-бар
            updateProgressBar(1);
        });
    }
}

// Обработчики событий для полей ввода
function setupInputHandlers() {
    // Обработчик для удаления класса invalid при фокусе
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(function(control) {
        control.addEventListener('focus', function() {
            this.classList.remove('invalid');
        });
    });
    
    // Автофокус на первое поле при загрузке
    const fromCity = document.getElementById('fromCity');
    if (fromCity) {
        setTimeout(function() {
            fromCity.focus();
        }, 500);
    }
    
    // Добавление иконок к полям ввода
    addInputIcons();
}

// Добавление иконок к полям ввода
function addInputIcons() {
    // Иконка для поля "Откуда"
    const fromCityInput = document.getElementById('fromCity');
    if (fromCityInput && fromCityInput.parentNode.classList.contains('input-with-icon')) {
        const fromIcon = document.createElement('span');
        fromIcon.className = 'input-icon';
        fromIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/></svg>';
        fromCityInput.parentNode.appendChild(fromIcon);
    }
    
    // Иконка для поля "Куда"
    const toCityInput = document.getElementById('toCity');
    if (toCityInput && toCityInput.parentNode.classList.contains('input-with-icon')) {
        const toIcon = document.createElement('span');
        toIcon.className = 'input-icon';
        toIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/></svg>';
        toCityInput.parentNode.appendChild(toIcon);
    }
}

// Обновление прогресс-бара
function updateProgressBar(step) {
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressFill = document.getElementById('progressFill');
    
    if (!progressSteps.length || !progressFill) return;
    
    // Обновляем активный шаг
    progressSteps.forEach(function(stepEl) {
        const stepNumber = parseInt(stepEl.getAttribute('data-step'));
        
        if (stepNumber === step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
        
        if (stepNumber < step) {
            stepEl.classList.add('completed');
        } else {
            stepEl.classList.remove('completed');
        }
    });
    
    // Обновляем заполнение прогресс-бара
    const fillPercentage = ((step - 1) / (progressSteps.length - 1)) * 100;
    progressFill.style.width = fillPercentage + '%';
}

// Настройка предварительного расчета при изменении данных
function setupLiveCalculation() {
    const fromCity = document.getElementById('fromCity');
    const toCity = document.getElementById('toCity');
    const weight = document.getElementById('weight');
    const volume = document.getElementById('volume');
    const isConsolidated = document.getElementById('isConsolidated');
    
    if (!fromCity || !toCity || !weight || !volume || !isConsolidated) return;
    
    // Таймер для отложенного расчета
    let calculationTimer;
    
    // Функция для предварительного расчета
    const calculatePreview = function() {
        // Проверяем, заполнены ли основные поля
        if (!fromCity.value || !toCity.value || !weight.value) return;
        
        // Показываем индикатор предварительного расчета
        const calculateButton = document.getElementById('calculateButton');
        if (calculateButton) {
            calculateButton.innerHTML = 'Предварительный расчет...';
        }
        
        // Здесь можно добавить логику для предварительного расчета
        // Например, вызвать упрощенную версию основной функции расчета
        // или показать приблизительную стоимость на основе базовых тарифов
        
        // Для демонстрации просто обновляем текст кнопки через некоторое время
        setTimeout(function() {
            if (calculateButton) {
                calculateButton.innerHTML = 'Рассчитать стоимость (~5000-8000 ₽)';
            }
        }, 500);
    };
    
    // Обработчики изменения полей
    const inputChangeHandler = function() {
        // Отменяем предыдущий таймер
        clearTimeout(calculationTimer);
        
        // Устанавливаем новый таймер для отложенного расчета
        calculationTimer = setTimeout(calculatePreview, 1000);
    };
    
    // Добавляем обработчики событий
    fromCity.addEventListener('input', inputChangeHandler);
    toCity.addEventListener('input', inputChangeHandler);
    weight.addEventListener('input', inputChangeHandler);
    volume.addEventListener('input', inputChangeHandler);
    isConsolidated.addEventListener('change', inputChangeHandler);
}

// Функция для показа демо-результата (если основной скрипт недоступен)
function showDummyResult() {
    const resultPrice = document.getElementById('resultPrice');
    const resultDetails = document.getElementById('resultDetails');
    
    if (!resultPrice || !resultDetails) return;
    
    // Устанавливаем цену
    resultPrice.textContent = '7,500 ₽';
    
    // Заполняем детали
    resultDetails.innerHTML = `
        <div class="result-detail-item">
            <div class="result-detail-label">Маршрут</div>
            <div class="result-detail-value">${document.getElementById('fromCity').value} → ${document.getElementById('toCity').value}</div>
        </div>
        <div class="result-detail-item">
            <div class="result-detail-label">Вес груза</div>
            <div class="result-detail-value">${document.getElementById('weight').value} кг</div>
        </div>
        <div class="result-detail-item">
            <div class="result-detail-label">Объем</div>
            <div class="result-detail-value">${document.getElementById('volume').value || '0'} м³</div>
        </div>
        <div class="result-detail-item">
            <div class="result-detail-label">Тип доставки</div>
            <div class="result-detail-value">${document.getElementById('isConsolidated').checked ? 'Сборный груз' : 'Отдельная машина'}</div>
        </div>
        <div class="result-detail-item">
            <div class="result-detail-label">Время доставки</div>
            <div class="result-detail-value">1-2 дня</div>
        </div>
    `;
}
