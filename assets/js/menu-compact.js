// Распашное меню с горизонтальными разделами и спойлерами
document.addEventListener('DOMContentLoaded', function() {
    const moreBtn = document.querySelector('.nav-more-btn');
    const dropdown = document.querySelector('.nav-dropdown');
    const sectionTitles = document.querySelectorAll('.nav-section-title');
    
    if (moreBtn && dropdown) {
        // Переключение дропдауна
        moreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            moreBtn.classList.toggle('active');
            dropdown.classList.toggle('active');
        });
        
        // Закрытие при клике вне меню
        document.addEventListener('click', function(e) {
            if (!moreBtn.contains(e.target) && !dropdown.contains(e.target)) {
                moreBtn.classList.remove('active');
                dropdown.classList.remove('active');
                // Закрываем все спойлеры
                sectionTitles.forEach(title => {
                    title.classList.remove('active');
                    const submenu = document.getElementById(title.dataset.section + '-submenu');
                    if (submenu) submenu.classList.remove('active');
                });
            }
        });
        
        // Работа со спойлерами
        sectionTitles.forEach(title => {
            title.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.dataset.section;
                const submenu = document.getElementById(section + '-submenu');
                
                // Закрываем все остальные спойлеры
                sectionTitles.forEach(otherTitle => {
                    if (otherTitle !== this) {
                        otherTitle.classList.remove('active');
                        const otherSubmenu = document.getElementById(otherTitle.dataset.section + '-submenu');
                        if (otherSubmenu) otherSubmenu.classList.remove('active');
                    }
                });
                
                // Переключаем текущий спойлер
                this.classList.toggle('active');
                if (submenu) {
                    submenu.classList.toggle('active');
                }
            });
            
            // Hover эффект для десктопа
            title.addEventListener('mouseenter', function() {
                if (window.innerWidth > 768) {
                    const section = this.dataset.section;
                    const submenu = document.getElementById(section + '-submenu');
                    
                    // Закрываем все остальные спойлеры
                    sectionTitles.forEach(otherTitle => {
                        if (otherTitle !== this) {
                            otherTitle.classList.remove('active');
                            const otherSubmenu = document.getElementById(otherTitle.dataset.section + '-submenu');
                            if (otherSubmenu) otherSubmenu.classList.remove('active');
                        }
                    });
                    
                    // Открываем текущий спойлер
                    this.classList.add('active');
                    if (submenu) {
                        submenu.classList.add('active');
                    }
                }
            });
        });
        
        // Закрытие спойлеров при уходе мыши с дропдауна
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                sectionTitles.forEach(title => {
                    title.classList.remove('active');
                    const submenu = document.getElementById(title.dataset.section + '-submenu');
                    if (submenu) submenu.classList.remove('active');
                });
            }
        });
    }
});
