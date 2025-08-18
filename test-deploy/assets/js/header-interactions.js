// Обработка взаимодействий с хедером

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация выпадающего меню
    initDropdownMenu();
    
    // Инициализация поиска
    initSearch();
    
    // Обработка мобильного меню
    initMobileMenu();
});

// Инициализация выпадающего меню
function initDropdownMenu() {
    const navSecondary = document.querySelector('.nav-secondary');
    const navDropdown = document.querySelector('.nav-dropdown');
    
    if (!navSecondary || !navDropdown) return;
    
    // Открытие/закрытие по клику
    const moreBtn = navSecondary.querySelector('.nav-more-btn');
    if (moreBtn) {
        moreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navDropdown.style.display = navDropdown.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Закрытие по клику вне меню
    document.addEventListener('click', function(e) {
        if (!navSecondary.contains(e.target)) {
            navDropdown.style.display = 'none';
        }
    });
}

// Инициализация поиска
function initSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchDropdown = document.querySelector('.search-dropdown');
    const searchForm = document.querySelector('.search-form');
    
    if (!searchToggle || !searchDropdown || !searchForm) return;
    
    // Открытие/закрытие по клику
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isVisible = searchDropdown.style.display === 'block';
        searchDropdown.style.display = isVisible ? 'none' : 'block';
        
        // Фокус на поле ввода при открытии
        if (!isVisible) {
            setTimeout(() => {
                const searchInput = searchDropdown.querySelector('.search-input');
                if (searchInput) searchInput.focus();
            }, 100);
        }
    });
    
    // Закрытие по клику вне поиска
    document.addEventListener('click', function(e) {
        const headerSearch = document.querySelector('.header-search');
        if (headerSearch && !headerSearch.contains(e.target)) {
            searchDropdown.style.display = 'none';
        }
    });
    
    // Обработка отправки формы поиска
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchInput = searchForm.querySelector('.search-input');
        if (searchInput && searchInput.value.trim()) {
            // Редирект на страницу поиска (можно заменить на реальную страницу поиска)
            window.location.href = 'services.html?search=' + encodeURIComponent(searchInput.value.trim());
        }
    });
}

// Обработка мобильного меню
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    
    if (!mobileToggle) return;
    
    // Добавляем обработчик, если его еще нет
    if (typeof window.toggleMobileMenu !== 'function') {
        window.toggleMobileMenu = function() {
            const header = document.querySelector('.header');
            header.classList.toggle('mobile-menu-open');
            
            // Добавляем временное мобильное меню, если его нет
            let mobileMenu = document.querySelector('.mobile-menu');
            if (!mobileMenu) {
                mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-menu';
                
                // Копируем ссылки из основной навигации
                const navLinks = document.querySelectorAll('.nav-link');
                const navLinksHtml = Array.from(navLinks).map(link => {
                    return `<a href="${link.getAttribute('href')}" class="mobile-menu-link">${link.textContent}</a>`;
                }).join('');
                
                mobileMenu.innerHTML = navLinksHtml;
                document.body.appendChild(mobileMenu);
                
                // Добавляем стили для мобильного меню
                const style = document.createElement('style');
                style.textContent = `
                    .mobile-menu {
                        position: fixed;
                        top: 46px;
                        left: 0;
                        right: 0;
                        background: white;
                        padding: 20px;
                        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                        display: none;
                        flex-direction: column;
                        z-index: 99;
                    }
                    
                    .header.mobile-menu-open .mobile-menu {
                        display: flex;
                    }
                    
                    .mobile-menu-link {
                        padding: 12px;
                        border-bottom: 1px solid #f3f4f6;
                        color: #1f2937;
                        text-decoration: none;
                        font-size: 1rem;
                    }
                    
                    .mobile-menu-link:last-child {
                        border-bottom: none;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Показываем/скрываем мобильное меню
            mobileMenu.style.display = header.classList.contains('mobile-menu-open') ? 'flex' : 'none';
        };
    }
}
