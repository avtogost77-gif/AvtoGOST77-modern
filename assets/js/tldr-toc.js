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
