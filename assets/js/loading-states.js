/* ===== LOADING STATES GOD MODE ===== */
/* Добавляет современные loading состояния во все формы */

document.addEventListener('DOMContentLoaded', function() {
    
    // 🎯 УЛУЧШЕНИЕ UX: Loading States для всех форм
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        
        if (submitButton) {
            // Сохраняем оригинальный текст
            const originalText = submitButton.textContent || submitButton.value;
            
            form.addEventListener('submit', function(e) {
                // Показываем loading состояние
                if (submitButton.tagName === 'BUTTON') {
                    submitButton.innerHTML = '<span class="loading-spinner"></span> Отправляем...';
                } else {
                    submitButton.value = 'Отправляем...';
                }
                
                submitButton.disabled = true;
                submitButton.classList.add('loading-state');
                
                // Возвращаем исходное состояние через 3 секунды (если форма не ушла на другую страницу)
                setTimeout(() => {
                    if (submitButton.tagName === 'BUTTON') {
                        submitButton.innerHTML = originalText;
                    } else {
                        submitButton.value = originalText;
                    }
                    submitButton.disabled = false;
                    submitButton.classList.remove('loading-state');
                }, 3000);
            });
        }
    });
    
    // 🎯 КАЛЬКУЛЯТОР: Loading State для расчетов
    const calcButtons = document.querySelectorAll('.btn-calculate, .btn-calc, [onclick*="calculate"]');
    
    calcButtons.forEach(button => {
        const originalText = button.textContent;
        
        button.addEventListener('click', function() {
            if (!button.disabled) {
                button.innerHTML = '<span class="loading-spinner"></span> Рассчитываем...';
                button.disabled = true;
                button.classList.add('loading-state');
                
                // Возвращаем исходное состояние после расчета
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    button.classList.remove('loading-state');
                }, 2000);
            }
        });
    });
    
    // 🎯 ФАЙЛОВЫЕ ЗАГРУЗКИ: Progress Bar
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.files.length > 0) {
                const fileName = this.files[0].name;
                const statusDiv = document.createElement('div');
                statusDiv.className = 'file-upload-status';
                statusDiv.innerHTML = `
                    <div class="upload-progress">
                        <div class="progress-bar" style="width: 0%"></div>
                    </div>
                    <span class="file-name">📎 ${fileName}</span>
                `;
                
                this.parentNode.appendChild(statusDiv);
                
                // Симулируем прогресс загрузки
                let progress = 0;
                const progressBar = statusDiv.querySelector('.progress-bar');
                const interval = setInterval(() => {
                    progress += Math.random() * 30;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(interval);
                        statusDiv.innerHTML = `<span class="file-success">✅ ${fileName} загружен</span>`;
                    }
                    progressBar.style.width = progress + '%';
                }, 200);
            }
        });
    });
    
    console.log('🚀 Loading States активированы для всех форм и элементов!');
});

/* ===== CSS ДЛЯ LOADING STATES ===== */
const loadingCSS = `
.loading-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid #ffffff;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
    margin-right: 8px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-state {
    opacity: 0.7;
    cursor: not-allowed !important;
    position: relative;
}

.file-upload-status {
    margin-top: 10px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 6px;
    font-size: 14px;
}

.upload-progress {
    width: 100%;
    height: 6px;
    background: #e9ecef;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;
}

.progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #2563eb, #3b82f6);
    transition: width 0.3s ease;
}

.file-success {
    color: #059669;
    font-weight: 600;
}

.file-name {
    color: #64748b;
}
`;

// Добавляем CSS в head
const style = document.createElement('style');
style.textContent = loadingCSS;
document.head.appendChild(style);


