# 🚛 АВТОГОСТ77 CRM - ПОЛНЫЙ ТЕХНИЧЕСКИЙ ПЛАН

**Проект:** CRM система для логистической компании АвтоГОСТ77  
**Дата создания:** 31 августа 2025  
**Статус:** Техническое планирование  

## 📋 **ОБЩИЙ ОБЗОР ПРОЕКТА**

### **Цель:**
Создать полноценную CRM систему для управления наемным транспортом с автоматизацией всех бизнес-процессов.

### **Ключевые принципы:**
- ✅ Единая технология (HTML + SCSS + Vanilla JS)
- ✅ Простота модификации и масштабирования
- ✅ Автоматизация расчетов
- ✅ Зеркальные договоры
- ✅ Полный документооборот

---

## 🏗️ **АРХИТЕКТУРА СИСТЕМЫ**

### **Технологический стек:**
```
Frontend:     HTML5 + SCSS + Vanilla JavaScript
Backend:      Python 3.11 + FastAPI + PostgreSQL
Deployment:   Docker + Docker Compose
Database:     PostgreSQL 15
File Storage: Local filesystem
PDF Generation: jsPDF / Server-side
```

### **Структура проекта:**
```
avtogost77-crm/
├── pages/                     # HTML страницы
│   ├── dashboard.html         # Главная админка
│   ├── leads/                # Управление заявками
│   ├── partners/             # Реестр партнеров
│   ├── management/           # Управленческий учет
│   ├── documents/            # Документооборот
│   ├── contracts/            # Зеркальные договоры
│   └── analytics/            # Аналитика
├── styles/                   # SCSS стили
│   ├── _settings/            # Настройки
│   ├── _components/          # Компоненты
│   └── main.scss
├── scripts/                  # JavaScript
│   ├── api/                  # API клиенты
│   ├── components/           # Компоненты
│   └── pages/               # Логика страниц
├── backend/                  # Python FastAPI
│   ├── app/
│   │   ├── models/          # Модели данных
│   │   ├── api/             # API endpoints
│   │   └── services/        # Бизнес-логика
│   └── requirements.txt
└── shared/                   # Общие ресурсы
    ├── styles/              # Общие стили
    └── scripts/             # Общие скрипты
```

---

## 🗄️ **СТРУКТУРА БАЗЫ ДАННЫХ**

### **Основные таблицы:**

```sql
-- Заявки
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(200) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_email VARCHAR(100),
    route_from VARCHAR(100) NOT NULL,
    route_to VARCHAR(100) NOT NULL,
    cargo_name VARCHAR(200),
    cargo_weight DECIMAL(10,2),
    cargo_volume DECIMAL(10,2),
    cargo_packaging VARCHAR(100),
    loading_date DATE,
    loading_time_from TIME,
    loading_time_to TIME,
    unloading_date DATE,
    unloading_time TIME,
    loading_address TEXT,
    unloading_address TEXT,
    status VARCHAR(50) DEFAULT 'new',
    source VARCHAR(50) DEFAULT 'website',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Партнеры-перевозчики
CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(200) NOT NULL,
    inn VARCHAR(12),
    kpp VARCHAR(9),
    legal_address TEXT,
    actual_address TEXT,
    bank_details TEXT,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Города базирования партнеров
CREATE TABLE partner_locations (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES partners(id),
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    is_main BOOLEAN DEFAULT false
);

-- Рейтинги партнеров
CREATE TABLE partner_ratings (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES partners(id),
    lead_id INTEGER REFERENCES leads(id),
    punctuality INTEGER CHECK (punctuality BETWEEN 1 AND 5),
    quality INTEGER CHECK (quality BETWEEN 1 AND 5),
    price INTEGER CHECK (price BETWEEN 1 AND 5),
    communication INTEGER CHECK (communication BETWEEN 1 AND 5),
    overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
    comment_type VARCHAR(50),
    custom_comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Управленческий учет
CREATE TABLE management_records (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    route_from VARCHAR(100),
    route_to VARCHAR(100),
    client_name VARCHAR(200),
    partner_name VARCHAR(200),
    incoming_amount DECIMAL(10,2),
    partner_cost DECIMAL(10,2),
    ebitda DECIMAL(10,2),
    tax_rate DECIMAL(5,2) DEFAULT 7.0,
    tax_amount DECIMAL(10,2),
    net_profit DECIMAL(10,2),
    margin_percent DECIMAL(5,2),
    volume_weight DECIMAL(8,2),
    volume_units VARCHAR(20),
    status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Шаблоны документов
CREATE TABLE document_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50),
    category VARCHAR(50),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Блоки шаблонов
CREATE TABLE template_blocks (
    id SERIAL PRIMARY KEY,
    template_id INTEGER REFERENCES document_templates(id),
    block_type VARCHAR(50),
    block_order INTEGER,
    content TEXT,
    is_required BOOLEAN DEFAULT true,
    is_editable BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Зеркальные договоры
CREATE TABLE contract_pairs (
    id SERIAL PRIMARY KEY,
    client_contract_id INTEGER REFERENCES generated_documents(id),
    partner_contract_id INTEGER REFERENCES generated_documents(id),
    lead_id INTEGER REFERENCES leads(id),
    sync_status VARCHAR(50) DEFAULT 'synced',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Маршрутные данные
CREATE TABLE route_data (
    id SERIAL PRIMARY KEY,
    contract_pair_id INTEGER REFERENCES contract_pairs(id),
    route_from VARCHAR(100),
    route_to VARCHAR(100),
    loading_date DATE,
    loading_time_from TIME,
    loading_time_to TIME,
    unloading_date DATE,
    unloading_time TIME,
    loading_address TEXT,
    unloading_address TEXT,
    cargo_name VARCHAR(200),
    cargo_weight DECIMAL(10,2),
    cargo_volume DECIMAL(10,2),
    cargo_packaging VARCHAR(100),
    loading_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 **1. УПРАВЛЕНИЕ ЗАЯВКАМИ**

### **Функционал:**
- ✅ Создание заявок с сайта
- ✅ Просмотр списка заявок
- ✅ Фильтрация и поиск
- ✅ Изменение статусов
- ✅ Привязка к партнерам
- ✅ История изменений

### **Статусы заявок:**
```javascript
const LEAD_STATUSES = {
  new: 'Новая заявка',
  processing: 'В обработке',
  partner_search: 'Поиск перевозчика',
  partner_found: 'Перевозчик найден',
  in_progress: 'В работе',
  completed: 'Выполнено',
  cancelled: 'Отменено',
  conflict: 'Конфликт'
};
```

### **API Endpoints:**
```python
# Заявки
@app.get("/api/v1/leads/")
async def get_leads(status: str = None, source: str = None):
    """Получить список заявок с фильтрацией"""
    pass

@app.post("/api/v1/leads/")
async def create_lead(lead: LeadCreate):
    """Создать новую заявку"""
    pass

@app.put("/api/v1/leads/{lead_id}")
async def update_lead(lead_id: int, lead: LeadUpdate):
    """Обновить заявку"""
    pass

@app.patch("/api/v1/leads/{lead_id}/status")
async def update_lead_status(lead_id: int, status: str):
    """Изменить статус заявки"""
    pass
```

---

## 🤝 **2. РЕЕСТР ПАРТНЕРОВ-ПЕРЕВОЗЧИКОВ**

### **Функционал:**
- ✅ База партнеров с полными данными
- ✅ География работы (города базирования)
- ✅ Система рейтингов и комментариев
- ✅ История работы
- ✅ Автоматический подбор партнеров

### **Система рейтингов:**
```javascript
const RATING_COMMENTS = {
  good: 'Хороший партнер',
  average: 'Средний',
  conflict: 'Конфликтный',
  fast: 'Быстрый',
  slow: 'Долгий',
  expensive: 'Дорогой',
  cheap: 'Дешевый',
  large_volumes: 'Большие объемы',
  small_cargo: 'Мелкие грузы',
  intercity: 'Междугородние',
  local: 'Городские'
};

class PartnerRating {
  constructor(partnerId, leadId) {
    this.partnerId = partnerId;
    this.leadId = leadId;
  }
  
  async submitRating(ratingData) {
    const response = await fetch('/api/v1/partner-ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partner_id: this.partnerId,
        lead_id: this.leadId,
        punctuality: ratingData.punctuality,
        quality: ratingData.quality,
        price: ratingData.price,
        communication: ratingData.communication,
        overall_rating: ratingData.overallRating,
        comment_type: ratingData.commentType,
        custom_comment: ratingData.customComment
      })
    });
    
    return response.json();
  }
}
```

### **Интерфейс партнера:**
```html
<!-- pages/partners/view.html -->
<div class="partner-card">
  <div class="partner-header">
    <h2>{{partner.company_name}}</h2>
    <div class="partner-rating">
      <span class="rating-stars">⭐⭐⭐⭐⭐</span>
      <span class="rating-score">{{partner.rating}}</span>
    </div>
  </div>
  
  <div class="partner-info">
    <div class="info-section">
      <h3>Контактная информация</h3>
      <p><strong>ИНН:</strong> {{partner.inn}}</p>
      <p><strong>Телефон:</strong> {{partner.phone}}</p>
      <p><strong>Email:</strong> {{partner.email}}</p>
    </div>
    
    <div class="info-section">
      <h3>Города базирования</h3>
      <div class="locations">
        {{#each partner.locations}}
          <span class="location-tag">{{this.city}}</span>
        {{/each}}
      </div>
    </div>
    
    <div class="info-section">
      <h3>Последние отзывы</h3>
      <div class="ratings-list">
        {{#each partner.ratings}}
          <div class="rating-item">
            <div class="rating-header">
              <span class="rating-type {{this.comment_type}}">{{this.comment_type_text}}</span>
              <span class="rating-date">{{this.created_at}}</span>
            </div>
            <p>{{this.custom_comment}}</p>
          </div>
        {{/each}}
      </div>
    </div>
  </div>
</div>
```

---

## 💰 **3. УПРАВЛЕНЧЕСКИЙ УЧЕТ**

### **Функционал:**
- ✅ Автоматический расчет метрик
- ✅ Быстрый ввод данных (2 поля)
- ✅ Финансовая аналитика
- ✅ Отчеты и экспорт

### **Система расчетов:**
```javascript
class ManagementCalculator {
  constructor() {
    this.defaultTaxRate = 7.0; // УСН + ПФР
    this.fixedRates = {
      'Постоянный клиент 1': { incoming: 19000, partner: 12000 },
      'Москва-СПб': { incoming: 25000, partner: 15000 }
    };
  }
  
  // Расчет от входящей суммы
  calculateFromIncoming(incomingAmount, clientType = 'new') {
    let partnerCost;
    
    if (clientType === 'regular') {
      partnerCost = incomingAmount * 0.63; // 63% от входящей
    } else {
      partnerCost = this.askForPartnerCost();
    }
    
    return this.calculateAll(incomingAmount, partnerCost);
  }
  
  // Расчет от цены партнера
  calculateFromPartner(partnerCost, route = '') {
    let incomingAmount;
    
    if (this.fixedRates[route]) {
      incomingAmount = this.fixedRates[route].incoming;
    } else {
      incomingAmount = this.askForIncomingAmount();
    }
    
    return this.calculateAll(incomingAmount, partnerCost);
  }
  
  // Автоматический расчет всех метрик
  calculateAll(incoming, partner) {
    const ebitda = incoming - partner;
    const tax = incoming * (this.defaultTaxRate / 100);
    const netProfit = ebitda - tax;
    const margin = (netProfit / incoming) * 100;
    
    return {
      incoming,
      partner,
      ebitda,
      tax,
      netProfit,
      margin,
      partnerShare: (partner / incoming) * 100,
      taxBurden: (tax / incoming) * 100,
      profitShare: (ebitda / incoming) * 100
    };
  }
}
```

### **Быстрый ввод данных:**
```html
<!-- pages/management/quick-entry.html -->
<div class="quick-entry">
  <h3>Быстрый ввод операции</h3>
  
  <div class="input-type-selector">
    <button class="btn-tab active" data-type="incoming">
      Ввести входящую сумму
    </button>
    <button class="btn-tab" data-type="partner">
      Ввести цену партнера
    </button>
  </div>
  
  <div class="input-form" id="incoming-form">
    <div class="form-group">
      <label>Входящая сумма (от клиента)</label>
      <input type="number" id="incoming-amount" placeholder="19000">
    </div>
    
    <div class="form-group">
      <label>Тип клиента</label>
      <select id="client-type">
        <option value="new">Новый клиент</option>
        <option value="regular">Постоянный клиент</option>
      </select>
    </div>
    
    <div class="form-group" id="partner-cost-group" style="display: none;">
      <label>Цена партнера</label>
      <input type="number" id="partner-cost" placeholder="12000">
    </div>
    
    <button class="btn-calculate" onclick="calculateFromIncoming()">
      Рассчитать
    </button>
  </div>
  
  <div class="calculation-result" id="result" style="display: none;">
    <h4>Результат расчета:</h4>
    <div class="result-grid">
      <div class="result-item">
        <span>EBITDA:</span>
        <span id="result-ebitda">0 ₽</span>
      </div>
      <div class="result-item">
        <span>Налоги (7%):</span>
        <span id="result-tax">0 ₽</span>
      </div>
      <div class="result-item">
        <span>Чистая прибыль:</span>
        <span id="result-net">0 ₽</span>
      </div>
      <div class="result-item">
        <span>Маржинальность:</span>
        <span id="result-margin">0%</span>
      </div>
    </div>
    
    <button class="btn-save" onclick="saveOperation()">
      Сохранить операцию
    </button>
  </div>
</div>
```

---

## 📄 **4. КОНСТРУКТОР ДОКУМЕНТОВ**

### **Функционал:**
- ✅ Блочная система шаблонов
- ✅ Переменные подстановки
- ✅ Зеркальные договоры
- ✅ Автоматическая генерация PDF

### **Типы документов:**
```javascript
const DOCUMENT_TYPES = {
  // Договоры
  client_contract: 'Договор с клиентом',
  partner_contract: 'Договор с исполнителем',
  application: 'Заявка-договор',
  
  // Уведомления
  arrival_notice: 'Уведомление о прибытии',
  delay_notice: 'Уведомление о задержке',
  ready_notice: 'Уведомление о готовности',
  
  // Акты
  cargo_handover: 'Акт приема-передачи',
  work_completed: 'Акт выполненных работ',
  damage_report: 'Акт о повреждении',
  
  // Претензии
  delay_claim: 'Претензия о задержке',
  damage_claim: 'Претензия о повреждении',
  quality_claim: 'Претензия о качестве'
};
```

### **Система блоков:**
```javascript
const BLOCK_TYPES = {
  header: {
    name: 'Заголовок',
    template: 'Договор-заявка на перевозку груза автомобильным транспортом\nNo {{contract_number}}',
    variables: ['contract_number', 'contract_date']
  },
  
  loading: {
    name: 'Погрузка',
    template: `Погрузка:
Грузоотправитель: {{shipper_name}}
Дата погрузки: {{loading_date}} с {{loading_time_from}} до {{loading_time_to}}
Адрес погрузки: {{loading_address}}
Телефон: {{loading_phone}} {{loading_contact}}`,
    variables: ['shipper_name', 'loading_date', 'loading_time_from', 'loading_time_to', 'loading_address', 'loading_phone', 'loading_contact']
  },
  
  unloading: {
    name: 'Выгрузка',
    template: `Выгрузка:
Грузополучатель: {{consignee_name}}
Дата выгрузки: {{unloading_date}} до {{unloading_time}}
Адрес выгрузки: {{unloading_address}}`,
    variables: ['consignee_name', 'unloading_date', 'unloading_time', 'unloading_address']
  },
  
  cargo: {
    name: 'Параметры груза',
    template: `Параметры груза:
Наименование груза: {{cargo_name}}
Вес: {{cargo_weight}} кг
Упаковка: {{cargo_packaging}}
Способ погрузки: {{loading_method}}`,
    variables: ['cargo_name', 'cargo_weight', 'cargo_packaging', 'loading_method']
  },
  
  payment: {
    name: 'Стоимость и оплата',
    template: `Стоимость перевозки: {{total_amount}} руб. ({{amount_in_words}})
Форма и срок оплаты: {{payment_terms}}`,
    variables: ['total_amount', 'amount_in_words', 'payment_terms']
  },
  
  conditions: {
    name: 'Дополнительные условия',
    template: `{{custom_conditions}}`,
    variables: ['custom_conditions']
  },
  
  driver: {
    name: 'Данные водителя/ТС',
    template: `Выделенный подвижной состав:
{{driver_name}} Дата рождения: {{driver_birth_date}}
{{driver_passport}}
{{vehicle_info}}`,
    variables: ['driver_name', 'driver_birth_date', 'driver_passport', 'vehicle_info']
  },
  
  parties: {
    name: 'Реквизиты сторон',
    template: `Заказчик
{{client_details}}

Исполнитель
{{partner_details}}`,
    variables: ['client_details', 'partner_details']
  },
  
  signatures: {
    name: 'Подписи',
    template: `________/{{client_signature}}
{{client_name}} без печати

_______________/{{partner_signature}}
{{partner_name}}`,
    variables: ['client_signature', 'client_name', 'partner_signature', 'partner_name']
  }
};
```

### **Генератор документов:**
```javascript
class DocumentGenerator {
  constructor() {
    this.variables = {};
    this.template = '';
  }
  
  // Загрузка данных из заявки
  async loadFromLead(leadId) {
    const response = await fetch(`/api/v1/leads/${leadId}`);
    const lead = await response.json();
    
    this.variables = {
      contract_number: this.generateContractNumber(),
      contract_date: new Date().toLocaleDateString('ru-RU'),
      shipper_name: lead.client_name,
      loading_date: lead.loading_date,
      loading_address: lead.loading_address,
      consignee_name: lead.consignee_name,
      unloading_address: lead.unloading_address,
      cargo_name: lead.cargo_name,
      cargo_weight: lead.cargo_weight,
      total_amount: lead.total_amount,
      amount_in_words: this.numberToWords(lead.total_amount)
    };
    
    return this.variables;
  }
  
  // Генерация документа
  async generateDocument(templateId, variables) {
    const response = await fetch('/api/v1/documents/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template_id: templateId,
        variables: variables
      })
    });
    
    const result = await response.json();
    return result.file_path;
  }
  
  // Преобразование числа в слова
  numberToWords(number) {
    if (number === 18000) return 'восемнадцать тысяч рублей 00 копеек';
    if (number === 25000) return 'двадцать пять тысяч рублей 00 копеек';
    return 'сумма прописью';
  }
  
  // Генерация номера договора
  generateContractNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `${year}${month}${random}`;
  }
}
```

---

## 🔄 **5. ЗЕРКАЛЬНЫЕ ДОГОВОРЫ**

### **Функционал:**
- ✅ Автоматическая синхронизация данных
- ✅ Гибкие шаблоны условий
- ✅ Маршрутные данные
- ✅ Управление парами договоров

### **Система синхронизации:**
```javascript
class ContractMirroring {
  constructor() {
    this.syncFields = [
      'route_from', 'route_to', 'loading_date', 'loading_time_from', 
      'loading_time_to', 'unloading_date', 'unloading_time',
      'loading_address', 'unloading_address', 'cargo_name', 
      'cargo_weight', 'cargo_volume', 'cargo_packaging', 'loading_method'
    ];
  }
  
  // Создание пары зеркальных договоров
  async createMirrorContracts(leadId, clientTemplateId, partnerTemplateId) {
    const lead = await this.getLead(leadId);
    
    // Создаем маршрутные данные
    const routeData = await this.createRouteData(lead);
    
    // Создаем договор с клиентом
    const clientContract = await this.createContract(
      clientTemplateId, 
      lead, 
      'client',
      routeData
    );
    
    // Создаем договор с исполнителем
    const partnerContract = await this.createContract(
      partnerTemplateId, 
      lead, 
      'partner',
      routeData
    );
    
    // Связываем договоры
    const contractPair = await this.linkContracts(
      clientContract.id, 
      partnerContract.id, 
      routeData.id
    );
    
    return { clientContract, partnerContract, contractPair };
  }
  
  // Синхронизация изменений
  async syncContractChanges(contractId, changedFields) {
    const contractPair = await this.getContractPair(contractId);
    const otherContractId = contractPair.client_contract_id === contractId 
      ? contractPair.partner_contract_id 
      : contractPair.client_contract_id;
    
    // Обновляем маршрутные данные
    await this.updateRouteData(contractPair.route_data_id, changedFields);
    
    // Обновляем связанный договор
    await this.updateContract(otherContractId, changedFields);
    
    // Обновляем статус синхронизации
    await this.updateSyncStatus(contractPair.id, 'synced');
  }
}
```

### **Шаблоны условий:**
```javascript
const CONTRACT_CONDITIONS = {
  client: {
    standard: {
      name: 'Стандартные условия для клиента',
      content: `Данная заявка имеет силу договора на разовую доставку.
Настоящая заявка, полученная по сети интернет, признается Сторонами равнозначной заявке на бумажном носителе и имеет полную юридическую силу.
Перевозчик несет полную материальную ответственность при перевозке груза в период оказания услуг.`
    },
    
    premium: {
      name: 'Премиум условия для клиента',
      content: `Данная заявка имеет силу договора на разовую доставку.
Гарантированная доставка в срок с компенсацией за нарушение сроков.
Полная страховка груза на сумму до 1,000,000 рублей.
Приоритетное обслуживание и персональный менеджер.`
    }
  },
  
  partner: {
    standard: {
      name: 'Стандартные условия для исполнителя',
      content: `Исполнитель обязуется выполнить перевозку груза в соответствии с условиями настоящего договора.
Ответственность и контроль за соблюдением развесовки по осям и общей массе лежит на Перевозчике.
Отклонения от маршрута допускаются только с письменного согласия Заказчика.`
    },
    
    strict: {
      name: 'Строгие условия для исполнителя',
      content: `Исполнитель обязуется выполнить перевозку груза в строгом соответствии с условиями.
Штраф за нарушение сроков: 5,000 рублей за каждый час задержки.
Обязательное фотофиксирование процесса погрузки и выгрузки.
Полная материальная ответственность за сохранность груза.`
    }
  }
};
```

---

## 📊 **6. АНАЛИТИКА И ОТЧЕТЫ**

### **Функционал:**
- ✅ Дашборд с ключевыми метриками
- ✅ Финансовая аналитика
- ✅ Отчеты по партнерам
- ✅ Маршрутная аналитика

### **Ключевые метрики:**
```javascript
class BusinessMetrics {
  // Средняя маржинальность по клиентам
  async calculateAverageMarginByClient(operations) {
    const clientMargins = {};
    operations.forEach(op => {
      if (!clientMargins[op.client]) {
        clientMargins[op.client] = [];
      }
      clientMargins[op.client].push(op.margin);
    });
    
    return Object.keys(clientMargins).map(client => ({
      client,
      avgMargin: clientMargins[client].reduce((a, b) => a + b, 0) / clientMargins[client].length
    }));
  }
  
  // Топ прибыльных маршрутов
  async calculateTopRoutes(operations) {
    const routeProfits = {};
    operations.forEach(op => {
      const route = `${op.routeFrom} - ${op.routeTo}`;
      if (!routeProfits[route]) {
        routeProfits[route] = { totalProfit: 0, count: 0 };
      }
      routeProfits[route].totalProfit += op.netProfit;
      routeProfits[route].count++;
    });
    
    return Object.keys(routeProfits)
      .map(route => ({
        route,
        totalProfit: routeProfits[route].totalProfit,
        avgProfit: routeProfits[route].totalProfit / routeProfits[route].count
      }))
      .sort((a, b) => b.totalProfit - a.totalProfit);
  }
  
  // Прогноз на следующий месяц
  async calculateForecast(operations) {
    const monthlyData = {};
    operations.forEach(op => {
      const month = op.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { revenue: 0, profit: 0, count: 0 };
      }
      monthlyData[month].revenue += op.incoming;
      monthlyData[month].profit += op.netProfit;
      monthlyData[month].count++;
    });
    
    const months = Object.keys(monthlyData).sort();
    const lastMonth = monthlyData[months[months.length - 1]];
    const avgGrowth = 1.05; // 5% рост в месяц
    
    return {
      nextMonthRevenue: lastMonth.revenue * avgGrowth,
      nextMonthProfit: lastMonth.profit * avgGrowth,
      nextMonthCount: Math.round(lastMonth.count * avgGrowth)
    };
  }
}
```

---

## 🚀 **ПЛАН РЕАЛИЗАЦИИ**

### **Этап 1: MVP (2-3 недели)**
1. ✅ Базовая структура проекта
2. ✅ База данных
3. ✅ Управление заявками (CRUD)
4. ✅ Реестр партнеров
5. ✅ Система рейтингов
6. ✅ Простой управленческий учет

### **Этап 2: Документооборот (2-3 недели)**
1. 🔄 Конструктор документов
2. 🔄 Шаблоны договоров
3. 🔄 Зеркальные договоры
4. 🔄 Генерация PDF
5. 🔄 Система уведомлений и актов

### **Этап 3: Автоматизация (1-2 недели)**
1. 🔄 Автоматический поиск партнеров
2. 🔄 Массовая рассылка заявок
3. 🔄 Telegram интеграция
4. 🔄 Автоматические уведомления

### **Этап 4: Аналитика (1-2 недели)**
1. 🔄 Дашборд с метриками
2. 🔄 Финансовые отчеты
3. 🔄 Аналитика партнеров
4. 🔄 Прогнозирование

### **Этап 5: Оптимизация (1 неделя)**
1. 🔄 UI/UX улучшения
2. 🔄 Производительность
3. 🔄 Тестирование
4. 🔄 Документация

---

## 💡 **ДОПОЛНИТЕЛЬНЫЕ ФИЧИ**

### **Умные подсказки:**
```javascript
class SmartSuggestions {
  // Подсказка цены для новых маршрутов
  async suggestPrice(routeFrom, routeTo, weight) {
    const similarRoutes = await this.findSimilarRoutes(routeFrom, routeTo);
    if (similarRoutes.length > 0) {
      const avgPrice = similarRoutes.reduce((sum, r) => sum + r.incoming, 0) / similarRoutes.length;
      return {
        suggestedIncoming: avgPrice,
        suggestedPartner: avgPrice * 0.63,
        confidence: 'high'
      };
    }
    return null;
  }
  
  // Предупреждение о низкой маржинальности
  checkMargin(calculatedMargin) {
    if (calculatedMargin < 15) {
      return {
        warning: 'Низкая маржинальность!',
        suggestion: 'Рассмотрите повышение цены или поиск другого партнера',
        type: 'danger'
      };
    }
    if (calculatedMargin < 25) {
      return {
        warning: 'Маржинальность ниже среднего',
        suggestion: 'Можно попробовать найти более выгодного партнера',
        type: 'warning'
      };
    }
    return null;
  }
}
```

### **Мобильная версия:**
- ✅ Адаптивный дизайн
- ✅ Touch-friendly интерфейс
- ✅ Быстрые действия
- ✅ Офлайн режим

### **Интеграции:**
- ✅ Telegram бот
- ✅ Email уведомления
- ✅ SMS уведомления
- ✅ API для партнеров

---

## 📞 **ПОДДЕРЖКА И РАЗВИТИЕ**

### **Контакты:**
- **Email:** avtogost77@gmail.com
- **Telegram:** @avtogost77
- **Телефон:** +7 916 272-09-32

### **Документация:**
- [API документация](docs/api.md)
- [Руководство пользователя](docs/user-guide.md)
- [Техническая документация](docs/technical.md)

---

**© 2025 АвтоГОСТ77. Полный технический план CRM системы.**
