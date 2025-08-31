-- ============================================
-- ИНИЦИАЛИЗАЦИЯ БАЗЫ ДАННЫХ AVTOGOST77 CRM MVP
-- ============================================
-- Дата создания: 31 августа 2025
-- Автор: AI Assistant
-- Описание: Создание таблиц для MVP CRM системы

-- Создание базы данных (если не существует)
-- CREATE DATABASE avtogost77_crm;

-- Подключение к базе данных
-- \c avtogost77_crm;

-- ============================================
-- ТАБЛИЦА: ЗАЯВКИ (LEADS)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
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
    total_amount DECIMAL(10,2),
    partner_cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_client_name ON leads(client_name);
CREATE INDEX IF NOT EXISTS idx_leads_route ON leads(route_from, route_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

-- ============================================
-- ТАБЛИЦА: ПАРТНЕРЫ (PARTNERS)
-- ============================================
CREATE TABLE IF NOT EXISTS partners (
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
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для партнеров
CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);
CREATE INDEX IF NOT EXISTS idx_partners_rating ON partners(rating);
CREATE INDEX IF NOT EXISTS idx_partners_company_name ON partners(company_name);

-- ============================================
-- ТАБЛИЦА: ГОРОДА БАЗИРОВАНИЯ ПАРТНЕРОВ
-- ============================================
CREATE TABLE IF NOT EXISTS partner_locations (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    is_main BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для локаций
CREATE INDEX IF NOT EXISTS idx_partner_locations_partner_id ON partner_locations(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_locations_city ON partner_locations(city);

-- ============================================
-- ТАБЛИЦА: РЕЙТИНГИ ПАРТНЕРОВ
-- ============================================
CREATE TABLE IF NOT EXISTS partner_ratings (
    id SERIAL PRIMARY KEY,
    partner_id INTEGER REFERENCES partners(id) ON DELETE CASCADE,
    lead_id INTEGER REFERENCES leads(id) ON DELETE SET NULL,
    punctuality INTEGER CHECK (punctuality BETWEEN 1 AND 5),
    quality INTEGER CHECK (quality BETWEEN 1 AND 5),
    price INTEGER CHECK (price BETWEEN 1 AND 5),
    communication INTEGER CHECK (communication BETWEEN 1 AND 5),
    overall_rating INTEGER CHECK (overall_rating BETWEEN 1 AND 5),
    comment_type VARCHAR(50),
    custom_comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для рейтингов
CREATE INDEX IF NOT EXISTS idx_partner_ratings_partner_id ON partner_ratings(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_ratings_lead_id ON partner_ratings(lead_id);
CREATE INDEX IF NOT EXISTS idx_partner_ratings_overall_rating ON partner_ratings(overall_rating);

-- ============================================
-- ТАБЛИЦА: УПРАВЛЕНЧЕСКИЙ УЧЕТ
-- ============================================
CREATE TABLE IF NOT EXISTS management_records (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    route_from VARCHAR(100),
    route_to VARCHAR(100),
    client_name VARCHAR(200),
    partner_name VARCHAR(200),
    incoming_amount DECIMAL(10,2) NOT NULL,
    partner_cost DECIMAL(10,2) NOT NULL,
    ebitda DECIMAL(10,2),
    tax_rate DECIMAL(5,2) DEFAULT 7.0,
    tax_amount DECIMAL(10,2),
    net_profit DECIMAL(10,2),
    margin_percent DECIMAL(5,2),
    volume_weight DECIMAL(8,2),
    volume_units VARCHAR(20),
    status VARCHAR(50) DEFAULT 'completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для управленческого учета
CREATE INDEX IF NOT EXISTS idx_management_records_date ON management_records(date);
CREATE INDEX IF NOT EXISTS idx_management_records_client_name ON management_records(client_name);
CREATE INDEX IF NOT EXISTS idx_management_records_partner_name ON management_records(partner_name);

-- ============================================
-- ТРИГГЕРЫ ДЛЯ АВТОМАТИЧЕСКИХ РАСЧЕТОВ
-- ============================================

-- Функция для автоматического расчета EBITDA, налогов и прибыли
CREATE OR REPLACE FUNCTION calculate_management_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Расчет EBITDA
    NEW.ebitda = NEW.incoming_amount - NEW.partner_cost;
    
    -- Расчет налогов (7%)
    NEW.tax_amount = NEW.incoming_amount * (NEW.tax_rate / 100);
    
    -- Расчет чистой прибыли
    NEW.net_profit = NEW.ebitda - NEW.tax_amount;
    
    -- Расчет маржинальности
    IF NEW.incoming_amount > 0 THEN
        NEW.margin_percent = (NEW.net_profit / NEW.incoming_amount) * 100;
    ELSE
        NEW.margin_percent = 0;
    END IF;
    
    -- Обновление времени изменения
    NEW.updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического расчета метрик
CREATE TRIGGER trigger_calculate_management_metrics
    BEFORE INSERT OR UPDATE ON management_records
    FOR EACH ROW
    EXECUTE FUNCTION calculate_management_metrics();

-- ============================================
-- ТЕСТОВЫЕ ДАННЫЕ ДЛЯ MVP
-- ============================================

-- Вставка тестовых партнеров
INSERT INTO partners (company_name, inn, phone, email, rating, status) VALUES
('ООО "ТрансЛогист"', '7701234567', '+7(495)123-45-67', 'info@translogist.ru', 4.5, 'active'),
('ИП Иванов А.А.', '770123456789', '+7(495)987-65-43', 'ivanov@mail.ru', 4.2, 'active'),
('ООО "Быстрая Доставка"', '7701234568', '+7(495)555-55-55', 'fast@delivery.ru', 3.8, 'active')
ON CONFLICT DO NOTHING;

-- Вставка тестовых заявок
INSERT INTO leads (client_name, client_phone, route_from, route_to, cargo_name, cargo_weight, status, total_amount) VALUES
('ООО "СтройМаркет"', '+7(495)111-11-11', 'Москва', 'Санкт-Петербург', 'Строительные материалы', 5000.00, 'new', 25000.00),
('ИП Петров', '+7(495)222-22-22', 'Москва', 'Казань', 'Мебель', 2000.00, 'processing', 18000.00),
('ООО "Продукты"', '+7(495)333-33-33', 'Москва', 'Нижний Новгород', 'Продукты питания', 3000.00, 'completed', 22000.00)
ON CONFLICT DO NOTHING;

-- Вставка тестовых записей управленческого учета
INSERT INTO management_records (date, route_from, route_to, client_name, partner_name, incoming_amount, partner_cost) VALUES
('2025-08-30', 'Москва', 'Санкт-Петербург', 'ООО "СтройМаркет"', 'ООО "ТрансЛогист"', 25000.00, 15000.00),
('2025-08-29', 'Москва', 'Казань', 'ИП Петров', 'ИП Иванов А.А.', 18000.00, 12000.00),
('2025-08-28', 'Москва', 'Нижний Новгород', 'ООО "Продукты"', 'ООО "Быстрая Доставка"', 22000.00, 14000.00)
ON CONFLICT DO NOTHING;

-- ============================================
-- СООБЩЕНИЕ ОБ УСПЕШНОЙ ИНИЦИАЛИЗАЦИИ
-- ============================================
SELECT 'База данных AVTOGOST77 CRM MVP успешно инициализирована!' as status;
