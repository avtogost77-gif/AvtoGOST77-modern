// ===============================================
// ГЕНЕРАТОР КОНТЕНТА И ВИЗУАЛЬНЫХ ЭЛЕМЕНТОВ
// Динамические иконки, графика, интерактивные элементы
// ===============================================

class ContentGenerator {
  constructor() {
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initContent());
    } else {
      this.initContent();
    }
  }

  initContent() {
    this.generateDynamicIcons();
    this.createInteractiveElements();
    this.addVisualEnhancements();
    this.generatePlaceholderImages();
    this.createLoadingAnimations();
    this.addMicroInteractions();
  }

  // ===============================================
  // ДИНАМИЧЕСКИЕ SVG ИКОНКИ
  // ===============================================

  generateDynamicIcons() {
    const iconPlaceholders = document.querySelectorAll('[data-icon]');
    
    iconPlaceholders.forEach(element => {
      const iconType = element.dataset.icon;
      const iconSize = element.dataset.iconSize || '24';
      const iconColor = element.dataset.iconColor || 'currentColor';
      
      const svgIcon = this.createSVGIcon(iconType, iconSize, iconColor);
      if (svgIcon) {
        element.innerHTML = svgIcon;
        element.classList.add('dynamic-icon');
      }
    });
  }

  createSVGIcon(type, size, color) {
    const icons = {
      'truck': `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 3h15v13H1V3zm16 5h4l2 3v5h-2v-2H4v2H2V8h15z" stroke="${color}" stroke-width="2" fill="none"/>
          <circle cx="6" cy="19" r="2" stroke="${color}" stroke-width="2" fill="none"/>
          <circle cx="18" cy="19" r="2" stroke="${color}" stroke-width="2" fill="none"/>
        </svg>
      `,
      'calculator': `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="2" width="16" height="20" rx="2" stroke="${color}" stroke-width="2" fill="none"/>
          <rect x="6" y="6" width="12" height="4" fill="${color}" opacity="0.3"/>
          <circle cx="8" cy="14" r="1" fill="${color}"/>
          <circle cx="12" cy="14" r="1" fill="${color}"/>
          <circle cx="16" cy="14" r="1" fill="${color}"/>
          <circle cx="8" cy="18" r="1" fill="${color}"/>
          <circle cx="12" cy="18" r="1" fill="${color}"/>
          <circle cx="16" cy="18" r="1" fill="${color}"/>
        </svg>
      `,
      'speed': `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="${color}"/>
          <path d="M12 6l4 6h-3v4h-2v-4H8l4-6z" fill="white"/>
        </svg>
      `,
      'shield': `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L4 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-8-3z" stroke="${color}" stroke-width="2" fill="none"/>
          <path d="M9 12l2 2 4-4" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `,
      'clock': `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="${color}" stroke-width="2"/>
          <polyline points="12,6 12,12 16,14" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `,
      'phone': `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="${color}" stroke-width="2" fill="none"/>
        </svg>
      `,
      'map': `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2 1,6" stroke="${color}" stroke-width="2" fill="none"/>
          <line x1="8" y1="2" x2="8" y2="18" stroke="${color}" stroke-width="2"/>
          <line x1="16" y1="6" x2="16" y2="22" stroke="${color}" stroke-width="2"/>
        </svg>
      `,
      'star': `
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2" stroke="${color}" stroke-width="2" fill="${color}" opacity="0.3"/>
        </svg>
      `
    };

    return icons[type] || null;
  }

  // ===============================================
  // ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ
  // ===============================================

  createInteractiveElements() {
    this.addHoverEffects();
    this.createTooltips();
    this.addProgressBars();
    this.createCounters();
  }

  addHoverEffects() {
    const cards = document.querySelectorAll('.card, .benefit-card, .service-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
        card.style.transition = 'all 0.3s ease';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      });
    });
  }

  createTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
      const tooltipText = element.dataset.tooltip;
      const tooltip = document.createElement('div');
      tooltip.className = 'custom-tooltip';
      tooltip.textContent = tooltipText;
      tooltip.style.cssText = `
        position: absolute;
        background: #1f2937;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        white-space: nowrap;
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        transform: translateX(-50%);
      `;
      
      element.style.position = 'relative';
      
      element.addEventListener('mouseenter', () => {
        document.body.appendChild(tooltip);
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        tooltip.style.opacity = '1';
      });
      
      element.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        setTimeout(() => {
          if (tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
          }
        }, 300);
      });
    });
  }

  addProgressBars() {
    const progressElements = document.querySelectorAll('[data-progress]');
    
    progressElements.forEach(element => {
      const progress = parseInt(element.dataset.progress);
      const progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      progressBar.innerHTML = `
        <div class="progress-track">
          <div class="progress-fill" style="width: 0%; background: linear-gradient(90deg, #2563eb, #10b981); height: 8px; border-radius: 4px; transition: width 2s ease;"></div>
        </div>
        <span class="progress-text">${progress}%</span>
      `;
      
      element.appendChild(progressBar);
      
      // Анимация заполнения
      setTimeout(() => {
        const fill = progressBar.querySelector('.progress-fill');
        fill.style.width = progress + '%';
      }, 500);
    });
  }

  createCounters() {
    const counterElements = document.querySelectorAll('[data-counter]');
    
    counterElements.forEach(element => {
      const target = parseInt(element.dataset.counter);
      const duration = parseInt(element.dataset.duration) || 2000;
      const suffix = element.dataset.suffix || '';
      
      let current = 0;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
      }, 16);
    });
  }

  // ===============================================
  // ВИЗУАЛЬНЫЕ УЛУЧШЕНИЯ
  // ===============================================

  addVisualEnhancements() {
    this.addGradientBackgrounds();
    this.createParticleEffects();
    this.addGeometricShapes();
    this.enhanceButtons();
  }

  addGradientBackgrounds() {
    const gradientElements = document.querySelectorAll('[data-gradient]');
    
    gradientElements.forEach(element => {
      const gradientType = element.dataset.gradient;
      
      const gradients = {
        'primary': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        'success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        'warning': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        'hero': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #10b981 100%)',
        'card': 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)'
      };
      
      if (gradients[gradientType]) {
        element.style.background = gradients[gradientType];
      }
    });
  }

  createParticleEffects() {
    const particleContainers = document.querySelectorAll('[data-particles]');
    
    particleContainers.forEach(container => {
      const particleCount = parseInt(container.dataset.particles) || 20;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(37, 99, 235, 0.3);
          border-radius: 50%;
          pointer-events: none;
          animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
          animation-delay: ${Math.random() * 2}s;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
        `;
        
        container.appendChild(particle);
      }
    });
    
    // Добавляем CSS анимацию
    if (!document.querySelector('#particle-styles')) {
      const style = document.createElement('style');
      style.id = 'particle-styles';
      style.textContent = `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  addGeometricShapes() {
    const shapeContainers = document.querySelectorAll('[data-shapes]');
    
    shapeContainers.forEach(container => {
      const shapeType = container.dataset.shapes;
      
      const shapes = {
        'circles': this.createCircles(),
        'triangles': this.createTriangles(),
        'squares': this.createSquares()
      };
      
      if (shapes[shapeType]) {
        container.innerHTML += shapes[shapeType];
      }
    });
  }

  createCircles() {
    return `
      <div class="geometric-shapes">
        <div class="shape circle" style="
          position: absolute;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(37, 99, 235, 0.1), rgba(16, 185, 129, 0.1));
          top: 10%;
          right: 10%;
          animation: rotate 20s linear infinite;
        "></div>
        <div class="shape circle" style="
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(245, 158, 11, 0.1), rgba(239, 68, 68, 0.1));
          bottom: 20%;
          left: 15%;
          animation: rotate 15s linear infinite reverse;
        "></div>
      </div>
    `;
  }

  createTriangles() {
    return `
      <div class="geometric-shapes">
        <div class="shape triangle" style="
          position: absolute;
          width: 0;
          height: 0;
          border-left: 25px solid transparent;
          border-right: 25px solid transparent;
          border-bottom: 50px solid rgba(37, 99, 235, 0.1);
          top: 15%;
          left: 20%;
          animation: pulse 4s ease-in-out infinite;
        "></div>
      </div>
    `;
  }

  createSquares() {
    return `
      <div class="geometric-shapes">
        <div class="shape square" style="
          position: absolute;
          width: 40px;
          height: 40px;
          background: linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(37, 99, 235, 0.1));
          transform: rotate(45deg);
          top: 25%;
          right: 25%;
          animation: bounce 3s ease-in-out infinite;
        "></div>
      </div>
    `;
  }

  enhanceButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      // Добавляем ripple эффект
      button.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
    
    // Добавляем CSS для ripple анимации
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to { transform: scale(2); opacity: 0; }
        }
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
        @keyframes bounce {
          0%, 100% { transform: rotate(45deg) translateY(0); }
          50% { transform: rotate(45deg) translateY(-10px); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ===============================================
  // PLACEHOLDER ИЗОБРАЖЕНИЯ
  // ===============================================

  generatePlaceholderImages() {
    const placeholders = document.querySelectorAll('[data-placeholder]');
    
    placeholders.forEach(placeholder => {
      const width = placeholder.dataset.width || '300';
      const height = placeholder.dataset.height || '200';
      const text = placeholder.dataset.text || 'АвтоГОСТ';
      const color = placeholder.dataset.color || '#2563eb';
      
      const svg = this.createPlaceholderSVG(width, height, text, color);
      placeholder.innerHTML = svg;
    });
  }

  createPlaceholderSVG(width, height, text, color) {
    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:${color};stop-opacity:0.4" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" rx="8"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" 
              fill="white" font-family="Arial, sans-serif" 
              font-size="${Math.min(width, height) / 8}" font-weight="bold">
          ${text}
        </text>
        <g stroke="white" stroke-width="2" fill="none" opacity="0.6">
          <rect x="20" y="20" width="${width-40}" height="${height-60}" rx="4"/>
          <circle cx="${width/2}" cy="${height/2 + 10}" r="8"/>
        </g>
      </svg>
    `;
  }

  // ===============================================
  // АНИМАЦИИ ЗАГРУЗКИ
  // ===============================================

  createLoadingAnimations() {
    this.addSkeletonLoaders();
    this.createSpinners();
    this.addProgressIndicators();
  }

  addSkeletonLoaders() {
    const skeletonElements = document.querySelectorAll('[data-skeleton]');
    
    skeletonElements.forEach(element => {
      const skeletonType = element.dataset.skeleton;
      element.innerHTML = this.createSkeleton(skeletonType);
      element.classList.add('skeleton-container');
    });
  }

  createSkeleton(type) {
    const skeletons = {
      'card': `
        <div class="skeleton-item" style="height: 200px; border-radius: 8px; margin-bottom: 16px;"></div>
        <div class="skeleton-item" style="height: 20px; width: 70%; margin-bottom: 8px;"></div>
        <div class="skeleton-item" style="height: 16px; width: 90%; margin-bottom: 8px;"></div>
        <div class="skeleton-item" style="height: 16px; width: 60%;"></div>
      `,
      'text': `
        <div class="skeleton-item" style="height: 16px; width: 100%; margin-bottom: 8px;"></div>
        <div class="skeleton-item" style="height: 16px; width: 80%; margin-bottom: 8px;"></div>
        <div class="skeleton-item" style="height: 16px; width: 60%;"></div>
      `,
      'button': `
        <div class="skeleton-item" style="height: 40px; width: 120px; border-radius: 6px;"></div>
      `
    };
    
    return skeletons[type] || skeletons['text'];
  }

  createSpinners() {
    const spinnerElements = document.querySelectorAll('[data-spinner]');
    
    spinnerElements.forEach(element => {
      const spinnerType = element.dataset.spinner || 'default';
      const size = element.dataset.size || '40';
      
      element.innerHTML = this.createSpinnerSVG(spinnerType, size);
    });
  }

  createSpinnerSVG(type, size) {
    const spinners = {
      'default': `
        <svg width="${size}" height="${size}" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#2563eb" stroke-width="4" 
                  stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
            <animate attributeName="stroke-array" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
          </circle>
        </svg>
      `,
      'dots': `
        <svg width="${size}" height="${size}" viewBox="0 0 50 50">
          <circle cx="10" cy="25" r="4" fill="#2563eb">
            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0s"/>
          </circle>
          <circle cx="25" cy="25" r="4" fill="#2563eb">
            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2s"/>
          </circle>
          <circle cx="40" cy="25" r="4" fill="#2563eb">
            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.4s"/>
          </circle>
        </svg>
      `
    };
    
    return spinners[type] || spinners['default'];
  }

  addProgressIndicators() {
    // Добавляем CSS для скелетонов и спиннеров
    if (!document.querySelector('#loading-styles')) {
      const style = document.createElement('style');
      style.id = 'loading-styles';
      style.textContent = `
        .skeleton-container {
          animation: pulse 2s ease-in-out infinite;
        }
        
        .skeleton-item {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }
        
        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // ===============================================
  // МИКРОИНТЕРАКЦИИ
  // ===============================================

  addMicroInteractions() {
    this.addButtonHoverEffects();
    this.addInputFocusEffects();
    this.addScrollAnimations();
  }

  addButtonHoverEffects() {
    const buttons = document.querySelectorAll('.btn:not(.btn-processed)');
    
    buttons.forEach(button => {
      button.classList.add('btn-processed');
      
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      });
      
      button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
      });
    });
  }

  addInputFocusEffects() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        input.style.transform = 'scale(1.02)';
        input.style.transition = 'all 0.2s ease';
      });
      
      input.addEventListener('blur', () => {
        input.style.transform = 'scale(1)';
      });
    });
  }

  addScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animation = entry.target.dataset.animate;
          entry.target.classList.add(`animate-${animation}`);
        }
      });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
}

// ===============================================
// ИНИЦИАЛИЗАЦИЯ
// ===============================================

// Запускаем генератор контента
const contentGenerator = new ContentGenerator();

// Экспортируем для использования в других скриптах
window.ContentGenerator = ContentGenerator;