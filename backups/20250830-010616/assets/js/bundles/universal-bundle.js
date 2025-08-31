/* ===== УНИВЕРСАЛЬНЫЙ BUNDLE ДЛЯ AVTOGOST77 ===== */
/* Используется на большинстве страниц сайта */
/* Включает: unified-main + lazy-loading + base functionality */

// === LAZY LOADING ===
// Lazy Loading для изображений document.addEventListener('DOMContentLoaded', function() { // Native lazy loading для современных браузеров if ('loading' in HTMLImageElement.prototype) { const images = document.querySelectorAll('img[loading="lazy"]'); images.forEach(img => { img.src = img.dataset.src || img.src; }); } else { // Fallback для старых браузеров const script = document.createElement('script'); script.src = '/assets/js/lazysizes.min.js'; document.body.appendChild(script); } // Intersection Observer для плавной загрузки const imageObserver = new IntersectionObserver((entries, observer) => { entries.forEach(entry => { if (entry.isIntersecting) { const img = entry.target; img.src = img.dataset.src || img.src; img.classList.add('loaded'); observer.unobserve(img); } }); }, { rootMargin: '50px 0px', threshold: 0.01 }); // Наблюдаем за всеми изображениями с data-src document.querySelectorAll('img[data-src]').forEach(img => { imageObserver.observe(img); }); });
// === UX IMPROVEMENTS ===
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

