-- ============================================
-- AVTOGOST77 CRM MVP - РАСШИРЕННАЯ СХЕМА БАЗЫ ДАННЫХ
-- Дата создания: 31 августа 2025
-- Автор: AI Assistant
-- Описание: Полная схема базы данных для максимальной версии CRM
-- ============================================

-- Создание таблиц для документов
CREATE TABLE IF NOT EXISTS document_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    document_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    variables JSONB,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    category VARCHAR(100),
    tags JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS document_blocks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    variables JSONB,
    block_type VARCHAR(100) NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    category VARCHAR(100),
    tags JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    lead_id INTEGER REFERENCES leads(id),
    partner_id INTEGER REFERENCES partners(id),
    client_name VARCHAR(200),
    template_id INTEGER REFERENCES document_templates(id),
    content TEXT,
    variables JSONB,
    route_from VARCHAR(100),
    route_to VARCHAR(100),
    loading_date TIMESTAMP WITH TIME ZONE,
    unloading_date TIMESTAMP WITH TIME ZONE,
    total_amount INTEGER,
    partner_cost INTEGER,
    volume_weight FLOAT,
    volume_units VARCHAR(20),
    payment_terms VARCHAR(500),
    notes TEXT,
    tags JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS document_history (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id),
    action VARCHAR(100) NOT NULL,
    field_name VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

-- Создание таблиц для договоров
CREATE TABLE IF NOT EXISTS contract_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    contract_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    variables JSONB,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    category VARCHAR(100),
    tags JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    contract_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    lead_id INTEGER REFERENCES leads(id),
    client_id INTEGER REFERENCES partners(id),
    partner_id INTEGER REFERENCES partners(id),
    mirror_contract_id INTEGER REFERENCES contracts(id),
    route_from VARCHAR(100),
    route_to VARCHAR(100),
    loading_date TIMESTAMP WITH TIME ZONE,
    unloading_date TIMESTAMP WITH TIME ZONE,
    total_amount FLOAT,
    partner_cost FLOAT,
    payment_terms VARCHAR(500),
    payment_deadline INTEGER,
    special_conditions TEXT,
    liability_terms TEXT,
    force_majeure TEXT,
    notes TEXT,
    tags JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS contract_conditions (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER NOT NULL REFERENCES contracts(id),
    condition_type VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    is_required BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contract_history (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER NOT NULL REFERENCES contracts(id),
    action VARCHAR(100) NOT NULL,
    field_name VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

-- Создание таблиц для правовой базы
CREATE TABLE IF NOT EXISTS legal_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INTEGER REFERENCES legal_categories(id),
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS legal_documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    document_number VARCHAR(100),
    content TEXT NOT NULL,
    summary TEXT,
    publication_date TIMESTAMP WITH TIME ZONE,
    effective_date TIMESTAMP WITH TIME ZONE,
    authority VARCHAR(200),
    category VARCHAR(100),
    tags JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS legal_articles (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES legal_documents(id),
    article_number VARCHAR(50),
    title VARCHAR(300),
    content TEXT NOT NULL,
    page_number INTEGER,
    section VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS legal_search_index (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES legal_documents(id),
    search_text TEXT NOT NULL,
    word_count INTEGER DEFAULT 0,
    title_weight FLOAT DEFAULT 1.0,
    content_weight FLOAT DEFAULT 0.5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_favorites (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    document_id INTEGER NOT NULL REFERENCES legal_documents(id),
    notes TEXT,
    tags JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для оптимизации
CREATE INDEX IF NOT EXISTS idx_documents_lead_id ON documents(lead_id);
CREATE INDEX IF NOT EXISTS idx_documents_partner_id ON documents(partner_id);
CREATE INDEX IF NOT EXISTS idx_documents_type_status ON documents(document_type, status);
CREATE INDEX IF NOT EXISTS idx_documents_route ON documents(route_from, route_to);

CREATE INDEX IF NOT EXISTS idx_contracts_lead_id ON contracts(lead_id);
CREATE INDEX IF NOT EXISTS idx_contracts_client_id ON contracts(client_id);
CREATE INDEX IF NOT EXISTS idx_contracts_partner_id ON contracts(partner_id);
CREATE INDEX IF NOT EXISTS idx_contracts_mirror ON contracts(mirror_contract_id);
CREATE INDEX IF NOT EXISTS idx_contracts_type_status ON contracts(contract_type, status);
CREATE INDEX IF NOT EXISTS idx_contracts_number ON contracts(contract_number);

CREATE INDEX IF NOT EXISTS idx_legal_documents_type ON legal_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_legal_documents_category ON legal_documents(category);
CREATE INDEX IF NOT EXISTS idx_legal_documents_active ON legal_documents(is_active);
CREATE INDEX IF NOT EXISTS idx_legal_documents_priority ON legal_documents(priority);

CREATE INDEX IF NOT EXISTS idx_legal_search_text ON legal_search_index USING gin(to_tsvector('russian', search_text));
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);

-- Создание триггеров для автоматических расчетов
CREATE OR REPLACE FUNCTION calculate_management_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Расчет EBITDA
    IF NEW.incoming_amount IS NOT NULL AND NEW.partner_cost IS NOT NULL THEN
        NEW.ebitda = NEW.incoming_amount - NEW.partner_cost;
    END IF;
    
    -- Расчет налогов (7% от входящей суммы)
    IF NEW.incoming_amount IS NOT NULL THEN
        NEW.tax_amount = NEW.incoming_amount * 0.07;
    END IF;
    
    -- Расчет чистой прибыли
    IF NEW.ebitda IS NOT NULL AND NEW.tax_amount IS NOT NULL THEN
        NEW.net_profit = NEW.ebitda - NEW.tax_amount;
    END IF;
    
    -- Расчет маржинальности
    IF NEW.incoming_amount IS NOT NULL AND NEW.ebitda IS NOT NULL AND NEW.incoming_amount > 0 THEN
        NEW.margin_percent = (NEW.ebitda / NEW.incoming_amount) * 100;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Привязка триггера к таблице management_records
DROP TRIGGER IF EXISTS trigger_calculate_management_metrics ON management_records;
CREATE TRIGGER trigger_calculate_management_metrics
    BEFORE INSERT OR UPDATE ON management_records
    FOR EACH ROW
    EXECUTE FUNCTION calculate_management_metrics();

-- Создание триггера для обновления рейтинга партнера
CREATE OR REPLACE FUNCTION update_partner_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Обновляем рейтинг партнера при изменении оценок
    UPDATE partners 
    SET rating = (
        SELECT AVG(overall_rating) 
        FROM partner_ratings 
        WHERE partner_id = NEW.partner_id AND overall_rating IS NOT NULL
    )
    WHERE id = NEW.partner_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Привязка триггера к таблице partner_ratings
DROP TRIGGER IF EXISTS trigger_update_partner_rating ON partner_ratings;
CREATE TRIGGER trigger_update_partner_rating
    AFTER INSERT OR UPDATE OR DELETE ON partner_ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_partner_rating();

-- Создание триггера для истории документов
CREATE OR REPLACE FUNCTION log_document_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO document_history (document_id, action, field_name, new_value, created_by)
        VALUES (NEW.id, 'create', NULL, NULL, NEW.created_by);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.title != NEW.title THEN
            INSERT INTO document_history (document_id, action, field_name, old_value, new_value, created_by)
            VALUES (NEW.id, 'update', 'title', OLD.title, NEW.title, NEW.created_by);
        END IF;
        IF OLD.status != NEW.status THEN
            INSERT INTO document_history (document_id, action, field_name, old_value, new_value, created_by)
            VALUES (NEW.id, 'update', 'status', OLD.status, NEW.status, NEW.created_by);
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO document_history (document_id, action, field_name, old_value, created_by)
        VALUES (OLD.id, 'delete', NULL, OLD.title, OLD.created_by);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Привязка триггера к таблице documents
DROP TRIGGER IF EXISTS trigger_log_document_changes ON documents;
CREATE TRIGGER trigger_log_document_changes
    AFTER INSERT OR UPDATE OR DELETE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION log_document_changes();

-- Вставка тестовых данных для документов
INSERT INTO document_templates (name, description, document_type, content, variables, is_default, category) VALUES
('Договор с клиентом - стандартный', 'Стандартный шаблон договора с клиентом', 'contract_client', 
'<h1>Договор №{{contract_number}}</h1><p>Клиент: {{client_name}}</p><p>Маршрут: {{route_from}} → {{route_to}}</p><p>Сумма: {{total_amount}} ₽</p>', 
'{"contract_number": "Номер договора", "client_name": "Имя клиента", "route_from": "Город отправления", "route_to": "Город назначения", "total_amount": "Общая сумма"}', 
true, 'Договоры'),

('Договор с партнером - стандартный', 'Стандартный шаблон договора с партнером', 'contract_partner',
'<h1>Договор №{{contract_number}}</h1><p>Партнер: {{partner_name}}</p><p>Маршрут: {{route_from}} → {{route_to}}</p><p>Стоимость: {{partner_cost}} ₽</p>',
'{"contract_number": "Номер договора", "partner_name": "Имя партнера", "route_from": "Город отправления", "route_to": "Город назначения", "partner_cost": "Стоимость партнера"}',
true, 'Договоры'),

('Акт выполненных работ', 'Стандартный акт выполненных работ', 'act',
'<h1>Акт №{{act_number}}</h1><p>Дата: {{act_date}}</p><p>Маршрут: {{route_from}} → {{route_to}}</p><p>Сумма: {{total_amount}} ₽</p>',
'{"act_number": "Номер акта", "act_date": "Дата акта", "route_from": "Город отправления", "route_to": "Город назначения", "total_amount": "Общая сумма"}',
true, 'Акты');

-- Вставка тестовых данных для правовой базы
INSERT INTO legal_categories (name, description, order_index) VALUES
('Гражданское право', 'Основы гражданского законодательства', 1),
('Транспортное право', 'Правила перевозок и транспорта', 2),
('Налоговое право', 'Налоговое законодательство', 3),
('Трудовое право', 'Трудовое законодательство', 4);

INSERT INTO legal_documents (title, document_type, document_number, content, summary, category, priority) VALUES
('Гражданский кодекс РФ', 'code', 'ГК РФ', 'Полный текст Гражданского кодекса Российской Федерации...', 'Основной закон гражданского права', 'Гражданское право', 10),
('Устав автомобильного транспорта', 'regulation', 'УАТ', 'Правила перевозок автомобильным транспортом...', 'Правила автомобильных перевозок', 'Транспортное право', 8),
('Налоговый кодекс РФ', 'code', 'НК РФ', 'Полный текст Налогового кодекса Российской Федерации...', 'Основной закон налогового права', 'Налоговое право', 9),
('Классификатор ООН по ADR', 'standard', 'ADR', 'Международные правила перевозки опасных грузов...', 'Правила перевозки опасных грузов', 'Транспортное право', 7);

-- Создание полнотекстового поиска для правовых документов
CREATE INDEX IF NOT EXISTS idx_legal_documents_search ON legal_documents USING gin(to_tsvector('russian', title || ' ' || COALESCE(summary, '') || ' ' || content));

-- Вставка тестовых данных для договоров
INSERT INTO contract_templates (name, description, contract_type, content, variables, is_default, category) VALUES
('Договор перевозки - клиент', 'Стандартный договор перевозки с клиентом', 'client_contract',
'<h1>Договор перевозки №{{contract_number}}</h1><p>Клиент: {{client_name}}</p><p>Маршрут: {{route_from}} → {{route_to}}</p><p>Сумма: {{total_amount}} ₽</p><p>Условия оплаты: {{payment_terms}}</p>',
'{"contract_number": "Номер договора", "client_name": "Имя клиента", "route_from": "Город отправления", "route_to": "Город назначения", "total_amount": "Общая сумма", "payment_terms": "Условия оплаты"}',
true, 'Договоры перевозки'),

('Договор перевозки - партнер', 'Стандартный договор перевозки с партнером', 'partner_contract',
'<h1>Договор перевозки №{{contract_number}}</h1><p>Партнер: {{partner_name}}</p><p>Маршрут: {{route_from}} → {{route_to}}</p><p>Стоимость: {{partner_cost}} ₽</p><p>Срок оплаты: {{payment_deadline}} дней</p>',
'{"contract_number": "Номер договора", "partner_name": "Имя партнера", "route_from": "Город отправления", "route_to": "Город назначения", "partner_cost": "Стоимость партнера", "payment_deadline": "Срок оплаты в днях"}',
true, 'Договоры перевозки');

-- ============================================
-- СООБЩЕНИЕ ОБ УСПЕШНОЙ ИНИЦИАЛИЗАЦИИ
-- ============================================
SELECT 'Расширенная база данных AVTOGOST77 CRM MVP успешно инициализирована!' as status;
SELECT 'Создано таблиц: ' || (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as tables_count;
SELECT 'Создано индексов: ' || (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public') as indexes_count;
SELECT 'Создано триггеров: ' || (SELECT COUNT(*) FROM pg_trigger) as triggers_count;
