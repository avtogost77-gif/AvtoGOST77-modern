// ========================================================
// 📄 PDF ЛИД-МАГНИТ АВТОГОСТ77 - КОМПАКТНАЯ ВЕРСИЯ
// Цвета сайта + 2 страницы + умная оптимизация
// ========================================================

class PDFLeadMagnet {
  constructor() {
    // Цвета сайта
    this.colors = {
      primary: '#2563eb',
      primaryLight: '#3b82f6', 
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      gradient: 'linear-gradient(135deg, #667eea 0, #764ba2 100%)',
      neutral: {
        50: '#f8fafc',
        100: '#f1f5f9', 
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a'
      }
    };

    // Размеры страницы
    this.pageWidth = 210; // A4
    this.pageHeight = 297;
    this.margin = 20;
    this.lineHeight = 12;
  }

  // Главная функция генерации
  async generatePDF(calcResult) {
    // Инициализируем jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Страница 1: Обложка + сводка
    this.addCoverAndSummary(doc, calcResult);
    
    // Страница 2: Детализация + контакты
    this.addDetailsAndContacts(doc, calcResult);
    
    // Опционально: оптимизация
    if (this.shouldShowOptimization(calcResult)) {
      this.addOptimizationSuggestion(doc, calcResult);
    }
    
    return doc;
  }

  // Страница 1: Обложка + сводка
  addCoverAndSummary(doc, result) {
    // Градиентный фон (симуляция)
    doc.setFillColor(102, 126, 234); // #667eea
    doc.rect(0, 0, this.pageWidth, 80, 'F');
    
    // Логотип и заголовок
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('🚛 АВТОГОСТ77', this.pageWidth/2, 30, { align: 'center' });
    
    doc.setFontSize(18);
    doc.text('📊 ПЕРСОНАЛЬНЫЙ РАСЧЕТ', this.pageWidth/2, 50, { align: 'center' });
    
    // Основные данные на белом фоне
    doc.setTextColor(this.colors.neutral[800]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    
    const startY = 120;
    doc.text(`📍 ${result.from} → ${result.to}`, this.pageWidth/2, startY, { align: 'center' });
    
    doc.setFontSize(24);
    doc.setTextColor(this.colors.success);
    doc.text(`💰 ${result.price}`, this.pageWidth/2, startY + 25, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(this.colors.neutral[600]);
    doc.text(`⏱️ ${result.deliveryTime}`, this.pageWidth/2, startY + 45, { align: 'center' });
    doc.text(`📦 ${result.weight} кг`, this.pageWidth/2, startY + 60, { align: 'center' });
    
    // Дополнительная информация
    doc.setFontSize(10);
    doc.setTextColor(this.colors.neutral[500]);
    doc.text('⚡ Подача транспорта за 2 часа', this.pageWidth/2, startY + 80, { align: 'center' });
    doc.text('✅ 99.3% доставок в срок', this.pageWidth/2, startY + 90, { align: 'center' });
    doc.text('🛡️ Страхование по желанию', this.pageWidth/2, startY + 100, { align: 'center' });
  }

  // Страница 2: Контакты + призыв (без детализации)
  addDetailsAndContacts(doc, result) {
    doc.addPage();
    
    // Заголовок контактов
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(this.colors.primary);
    doc.text('📞 БЫСТРЫЕ КОНТАКТЫ', this.margin, 30);
    
    // Контакты
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(this.colors.neutral[700]);
    
    doc.text('WhatsApp: +7 (999) 458-90-77', this.margin, 50);
    doc.text('Телефон: +7 (999) 458-90-77', this.margin, 65);
    doc.text('Email: avtogost77@yandex.ru', this.margin, 80);
    
    // Опционально: оптимизация (если нужно)
    if (this.shouldShowOptimization(result)) {
      this.addOptimizationSuggestion(doc, result, 110);
    }
    
    // Призыв к действию
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(this.colors.warning);
    doc.text('💡 НЕ ОТКЛАДЫВАЙТЕ НА ЗАВТРА ТО,', this.margin, 150);
    doc.text('   ЧТО МОЖНО ОТПРАВИТЬ СЕГОДНЯ! :)', this.margin, 165);
    
    // Дополнительная информация
    doc.setFontSize(10);
    doc.setTextColor(this.colors.neutral[500]);
    doc.text('⚡ Подача транспорта за 2 часа', this.margin, 185);
    doc.text('✅ 99.3% доставок в срок', this.margin, 195);
    doc.text('🛡️ Страхование по желанию', this.margin, 205);
    
    // QR-код (заглушка)
    doc.setFontSize(10);
    doc.setTextColor(this.colors.neutral[500]);
    doc.text('[QR-код для WhatsApp]', this.pageWidth - 60, 50);
  }

  // Оптимизация (если не сборный груз)
  addOptimizationSuggestion(doc, result, y = 200) {
    if (!result.isConsolidated && result.weight < 2000) {
      const savings = this.calculateConsolidatedSavings(result);
      
      // Фон для блока оптимизации
      doc.setFillColor(245, 158, 11, 0.1); // #f59e0b с прозрачностью
      doc.rect(this.margin - 5, y - 5, this.pageWidth - 2 * this.margin + 10, 40, 'F');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(this.colors.warning);
      doc.text('💡 Можете сэкономить!', this.margin, y + 10);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(this.colors.neutral[700]);
      doc.text(`Сборный груз сэкономит вам ${savings} ₽`, this.margin, y + 25);
    }
  }

  // Вспомогательные методы
  calculateConsolidatedSavings(result) {
    const basePrice = parseFloat(result.price.replace(/[^\d]/g, ''));
    return Math.round(basePrice * 0.20); // 20% экономия
  }

  shouldShowOptimization(result) {
    return !result.isConsolidated && result.weight < 2000;
  }

  // Модал для запроса контактов
  showContactModal() {
    const modal = document.createElement('div');
    modal.className = 'pdf-modal-overlay';
    modal.innerHTML = `
      <div class="pdf-modal">
        <div class="pdf-modal-header">
          <h3>📄 Скачать PDF расчет</h3>
          <button class="pdf-modal-close" onclick="this.closest('.pdf-modal-overlay').remove()">×</button>
        </div>
        
        <form id="pdfContactForm" class="pdf-modal-form">
          <div class="form-group">
            <label>📱 Телефон *</label>
            <input type="tel" name="phone" required 
                   placeholder="+7 (___) ___-__-__"
                   pattern="\\+7 \\([0-9]{3}\\) [0-9]{3}-[0-9]{2}-[0-9]{2}">
          </div>
          
          <div class="form-group">
            <label>👤 Имя (необязательно)</label>
            <input type="text" name="name" 
                   placeholder="Ваше имя">
          </div>
          
          <div class="form-group">
            <label>🏢 Компания (необязательно)</label>
            <input type="text" name="company" 
                   placeholder="Название компании">
          </div>
          
          <button type="submit" class="btn btn-primary">
            📄 Скачать PDF
          </button>
        </form>
      </div>
    `;

    // Стили для модала
    const styles = `
      <style>
        .pdf-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        
        .pdf-modal {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          max-width: 400px;
          width: 90%;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        
        .pdf-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .pdf-modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }
        
        .pdf-modal-form .form-group {
          margin-bottom: 1rem;
        }
        
        .pdf-modal-form label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }
        
        .pdf-modal-form input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
        }
        
        .pdf-modal-form input:focus {
          outline: none;
          border-color: #2563eb;
        }
        
        .pdf-modal-form .btn {
          width: 100%;
          padding: 1rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .pdf-modal-form .btn:hover {
          background: #1d4ed8;
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.appendChild(modal);

    // Обработчик формы
    const form = modal.querySelector('#pdfContactForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const contactData = {
        phone: formData.get('phone'),
        name: formData.get('name') || '',
        company: formData.get('company') || ''
      };

      // Сохраняем лид
      await this.saveLead(contactData, window.calculatorV2.lastResult);
      
      // Генерируем и скачиваем PDF
      const pdf = await this.generatePDF(window.calculatorV2.lastResult);
      pdf.save(`расчет-доставки-${Date.now()}.pdf`);
      
      // Закрываем модал
      modal.remove();
      
      // Показываем успех
      this.showSuccessMessage();
    });

    return modal;
  }

  // Сохранение лида
  async saveLead(contactData, calcResult) {
    const message = `📄 НОВЫЙ PDF ЛИД

👤 Имя: ${contactData.name || 'Не указано'}
📱 Телефон: ${contactData.phone}
🏢 Компания: ${contactData.company || 'Не указано'}

📊 РАСЧЕТ:
📍 Маршрут: ${calcResult.from} → ${calcResult.to}
📦 Вес: ${calcResult.weight} кг
💰 Цена: ${calcResult.price}
⏱️ Срок: ${calcResult.deliveryTime}

📄 PDF скачан: ${new Date().toLocaleString()}`;

    // Отправляем в Telegram
    try {
      await fetch(`https://api.telegram.org/bot7999458907:AAHAnyTyvfteW1WNKpns8w35jl14f0wn5es/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: 399711406, 
          text: message 
        })
      });
    } catch (error) {
      console.error('Ошибка отправки в Telegram:', error);
    }

    // Отслеживаем в аналитике
    if (typeof ym !== 'undefined') {
      ym(103413788, 'reachGoal', 'pdf_download', {
        phone: contactData.phone,
        price: calcResult.price
      });
    }
  }

  // Сообщение об успехе
  showSuccessMessage() {
    const success = document.createElement('div');
    success.className = 'pdf-success';
    success.innerHTML = `
      <div class="pdf-success-content">
        <div class="success-icon">✅</div>
        <h4>PDF успешно скачан!</h4>
        <p>Мы свяжемся с вами в ближайшее время</p>
        <div class="success-actions">
          <a href="https://wa.me/7999458907" class="btn btn-success" target="_blank">
            📱 Написать в WhatsApp
          </a>
          <a href="tel:+7999458907" class="btn btn-primary">
            📞 Позвонить
          </a>
        </div>
      </div>
    `;

    // Стили для успеха
    const styles = `
      <style>
        .pdf-success {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          z-index: 10001;
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .pdf-success-content {
          text-align: center;
        }
        
        .success-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .pdf-success h4 {
          color: #10b981;
          margin-bottom: 0.5rem;
        }
        
        .pdf-success p {
          color: #666;
          margin-bottom: 1rem;
        }
        
        .success-actions {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
        }
        
        .success-actions .btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .btn-success {
          background: #10b981;
          color: white;
        }
        
        .btn-primary {
          background: #2563eb;
          color: white;
        }
      </style>
    `;

    document.head.insertAdjacentHTML('beforeend', styles);
    document.body.appendChild(success);

    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
      success.remove();
    }, 5000);
  }
}

// Глобальный экземпляр
window.pdfLeadMagnet = new PDFLeadMagnet();

// Интеграция с калькулятором
if (window.calculatorV2) {
  // Добавляем метод в калькулятор
  window.calculatorV2.downloadPDF = async function() {
    if (!this.lastResult) {
      alert('Сначала рассчитайте стоимость доставки');
      return;
    }
    
    // Показываем модал для контактов
    window.pdfLeadMagnet.showContactModal();
  };
}
