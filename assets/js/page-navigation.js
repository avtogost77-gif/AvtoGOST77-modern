/**
 * Улучшенная навигация по странице
 * v1.0.0 - 2025-08
 */

document.addEventListener('DOMContentLoaded', function() {
    // Добавление якорных ссылок к заголовкам секций
    addSectionAnchors();
    
    // Создание навигации по странице
    createPageNavigation();
    
    // Инициализация индикатора прогресса чтения
    initReadingProgress();
    
    // Инициализация кнопки "Наверх"
    initBackToTop();
});

/**
 * Добавление якорных ссылок к заголовкам секций
 */
function addSectionAnchors() {
    // Находим все заголовки секций
    const sectionHeaders = document.querySelectorAll('section h2, section h3');
    
    sectionHeaders.forEach(header => {
        // Создаем ID для заголовка, если его нет
        if (!header.id) {
            // Генерируем ID из текста заголовка
            let id = header.textContent
                .toLowerCase()
                .replace(/[^\wа-яё]+/g, '-') // Заменяем все не буквенно-цифровые символы на дефис
                .replace(/^-+|-+$/g, ''); // Удаляем дефисы в начале и конце
            
            // Добавляем префикс 'section-' для уникальности
            header.id = 'section-' + id;
        }
        
        // Создаем якорную ссылку
        const anchor = document.createElement('a');
        anchor.href = '#' + header.id;
        anchor.className = 'anchor-link';
        anchor.innerHTML = '#';
        anchor.title = 'Ссылка на этот раздел';
        
        // Оборачиваем заголовок в div для позиционирования якорной ссылки
        if (!header.parentElement.classList.contains('section-header')) {
            const headerWrapper = document.createElement('div');
            headerWrapper.className = 'section-header';
            header.parentNode.insertBefore(headerWrapper, header);
            headerWrapper.appendChild(header);
            headerWrapper.appendChild(anchor);
        }
        
        // Добавляем невидимый якорь перед заголовком для правильной прокрутки
        const anchorTarget = document.createElement('span');
        anchorTarget.className = 'section-anchor';
        anchorTarget.id = header.id + '-anchor';
        header.parentNode.insertBefore(anchorTarget, header.parentNode.firstChild);
        
        // Обновляем ID заголовка, чтобы он указывал на якорь
        header.id = '';
    });
}

/**
 * Создание навигации по странице
 */
function createPageNavigation() {
    // Находим все заголовки секций
    const sectionHeaders = document.querySelectorAll('section h2');
    
    // Если на странице меньше 3 заголовков, не создаем навигацию
    if (sectionHeaders.length < 3) return;
    
    // Создаем контейнер для навигации
    const navigation = document.createElement('div');
    navigation.className = 'page-navigation';
    navigation.innerHTML = `
        <div class="page-navigation-title">
            Содержание страницы
            <button class="page-navigation-toggle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
        </div>
        <ul class="page-navigation-list"></ul>
    `;
    
    // Создаем список навигации
    const navigationList = navigation.querySelector('.page-navigation-list');
    
    sectionHeaders.forEach(header => {
        // Получаем ID якоря
        const anchorId = header.parentElement.previousSibling.id;
        
        // Создаем элемент списка
        const listItem = document.createElement('li');
        listItem.className = 'page-navigation-item';
        
        // Создаем ссылку
        const link = document.createElement('a');
        link.href = '#' + anchorId;
        link.className = 'page-navigation-link';
        link.textContent = header.textContent;
        link.dataset.target = anchorId;
        
        // Добавляем обработчик клика для плавной прокрутки
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
                
                // Обновляем URL без перезагрузки страницы
                history.pushState(null, null, '#' + targetId);
                
                // Активируем ссылку
                document.querySelectorAll('.page-navigation-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
        
        // Добавляем ссылку в элемент списка
        listItem.appendChild(link);
        
        // Добавляем элемент списка в список навигации
        navigationList.appendChild(listItem);
    });
    
    // Добавляем навигацию в начало первой секции
    const firstSection = document.querySelector('section');
    if (firstSection) {
        firstSection.parentNode.insertBefore(navigation, firstSection);
    }
    
    // Обработчик для переключения видимости списка на мобильных устройствах
    const toggleButton = navigation.querySelector('.page-navigation-toggle');
    toggleButton.addEventListener('click', function() {
        navigationList.classList.toggle('expanded');
        
        // Изменяем иконку кнопки
        if (navigationList.classList.contains('expanded')) {
            this.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
            `;
        } else {
            this.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            `;
        }
    });
    
    // Отслеживаем прокрутку для активации текущего раздела
    window.addEventListener('scroll', function() {
        // Добавляем тень при прокрутке
        if (window.scrollY > 100) {
            navigation.classList.add('shadow-active');
        } else {
            navigation.classList.remove('shadow-active');
        }
        
        // Находим текущий видимый раздел
        const current = findCurrentSection();
        if (current) {
            // Обновляем активную ссылку
            document.querySelectorAll('.page-navigation-link').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.target === current) {
                    link.classList.add('active');
                }
            });
        }
    });
}

/**
 * Находит текущий видимый раздел
 * @returns {string|null} - ID текущего раздела или null
 */
function findCurrentSection() {
    const anchors = document.querySelectorAll('.section-anchor');
    let current = null;
    
    // Находим первый якорь, который находится ниже верхней границы окна
    // с небольшим отступом для лучшего UX
    const scrollPosition = window.scrollY + 100;
    
    for (let i = 0; i < anchors.length; i++) {
        const anchor = anchors[i];
        const nextAnchor = anchors[i + 1];
        
        // Проверяем, находится ли прокрутка между текущим и следующим якорем
        if (anchor.offsetTop <= scrollPosition && 
            (!nextAnchor || nextAnchor.offsetTop > scrollPosition)) {
            current = anchor.id;
            break;
        }
    }
    
    // Если мы в самом низу страницы, выбираем последний якорь
    if (!current && anchors.length > 0 && 
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        current = anchors[anchors.length - 1].id;
    }
    
    return current;
}

/**
 * Инициализация индикатора прогресса чтения
 */
function initReadingProgress() {
    // Создаем контейнер для индикатора прогресса
    const progressContainer = document.createElement('div');
    progressContainer.className = 'reading-progress-container';
    
    // Создаем индикатор прогресса
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    
    // Добавляем индикатор в контейнер
    progressContainer.appendChild(progressBar);
    
    // Добавляем контейнер в начало body
    document.body.insertBefore(progressContainer, document.body.firstChild);
    
    // Обновляем прогресс при прокрутке
    window.addEventListener('scroll', function() {
        updateReadingProgress(progressBar);
    });
    
    // Обновляем прогресс при изменении размера окна
    window.addEventListener('resize', function() {
        updateReadingProgress(progressBar);
    });
    
    // Инициализируем прогресс
    updateReadingProgress(progressBar);
}

/**
 * Обновляет индикатор прогресса чтения
 * @param {HTMLElement} progressBar - Элемент индикатора прогресса
 */
function updateReadingProgress(progressBar) {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    // Вычисляем процент прокрутки
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
    
    // Обновляем ширину индикатора
    progressBar.style.width = scrollPercentage + '%';
}

/**
 * Инициализация кнопки "Наверх"
 */
function initBackToTop() {
    // Создаем кнопку
    const backToTopButton = document.createElement('div');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;
    backToTopButton.title = 'Наверх';
    
    // Добавляем кнопку в конец body
    document.body.appendChild(backToTopButton);
    
    // Обработчик клика для прокрутки наверх
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Показываем/скрываем кнопку при прокрутке
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });
}

/**
 * Обновление навигации при изменении DOM
 * Вызывать эту функцию, если содержимое страницы изменяется динамически
 */
function refreshPageNavigation() {
    // Удаляем существующую навигацию
    const existingNavigation = document.querySelector('.page-navigation');
    if (existingNavigation) {
        existingNavigation.remove();
    }
    
    // Удаляем существующие якоря
    document.querySelectorAll('.section-anchor').forEach(anchor => {
        anchor.remove();
    });
    
    document.querySelectorAll('.section-header').forEach(header => {
        // Извлекаем заголовок из обертки
        const h2 = header.querySelector('h2, h3');
        if (h2) {
            header.parentNode.insertBefore(h2, header);
            header.remove();
        }
    });
    
    // Создаем новую навигацию
    addSectionAnchors();
    createPageNavigation();
}

// Экспортируем функцию для возможного использования в других скриптах
window.refreshPageNavigation = refreshPageNavigation;
