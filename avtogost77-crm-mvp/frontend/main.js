/**
 * AVTOGOST77 CRM MVP - Основной JavaScript файл
 * Дата создания: 31 августа 2025
 * Автор: AI Assistant
 * Описание: Основные функции для работы с API и управления интерфейсом
 */

// Конфигурация
const API_BASE = 'http://localhost:8000/api/v1';
const APP_VERSION = '2.0.0';

// ============================================
// УТИЛИТЫ
// ============================================

// Форматирование валюты
function formatCurrency(amount) {
    return new Intl.NumberFormat('ru-RU', { 
        style: 'currency', 
        currency: 'RUB' 
    }).format(amount || 0);
}

// Форматирование даты
function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ru-RU');
}

// Форматирование даты и времени
function formatDateTime(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('ru-RU');
}

// Показ уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Показ ошибки
function showError(message) {
    showNotification(message, 'error');
}

// Показ успеха
function showSuccess(message) {
    showNotification(message, 'success');
}

// ============================================
// API ФУНКЦИИ
// ============================================

// Базовый запрос к API
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error (${endpoint}):`, error);
        throw error;
    }
}

// GET запрос
async function apiGet(endpoint) {
    return apiRequest(endpoint, { method: 'GET' });
}

// POST запрос
async function apiPost(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

// PUT запрос
async function apiPut(endpoint, data) {
    return apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

// DELETE запрос
async function apiDelete(endpoint) {
    return apiRequest(endpoint, { method: 'DELETE' });
}

// ============================================
// УПРАВЛЕНИЕ ВКЛАДКАМИ
// ============================================

// Показать вкладку
function showTab(tabName) {
    // Скрываем все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убираем активный класс со всех кнопок
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показываем нужную вкладку
    document.getElementById(tabName).classList.add('active');
    
    // Добавляем активный класс к кнопке
    event.target.classList.add('active');
    
    // Загружаем данные для вкладки
    loadTabData(tabName);
}

// Загрузка данных для вкладки
function loadTabData(tabName) {
    switch(tabName) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'leads':
            loadLeads();
            break;
        case 'partners':
            loadPartners();
            break;
        case 'management':
            loadManagementStats();
            break;
        case 'documents':
            loadDocuments();
            break;
        case 'contracts':
            loadContracts();
            break;
        case 'legal':
            loadLegalDocuments();
            break;
    }
}

// ============================================
// ДАШБОРД
// ============================================

// Загрузка статистики дашборда
async function loadDashboardStats() {
    try {
        showLoading('dashboard');
        
        const [leadsRes, partnersRes, contractsRes, managementRes] = await Promise.all([
            apiGet('/leads/'),
            apiGet('/partners/'),
            apiGet('/contracts/'),
            apiGet('/management/stats/overview')
        ]);

        // Обновляем статистику
        document.getElementById('total-leads').textContent = leadsRes.total || 0;
        document.getElementById('total-partners').textContent = partnersRes.total || 0;
        document.getElementById('total-contracts').textContent = contractsRes.total || 0;
        document.getElementById('total-revenue').textContent = formatCurrency(managementRes.total_income || 0);

        hideLoading('dashboard');
    } catch (error) {
        hideLoading('dashboard');
        showError('Ошибка загрузки статистики: ' + error.message);
    }
}

// ============================================
// ЗАЯВКИ
// ============================================

// Загрузка заявок
async function loadLeads() {
    try {
        showLoading('leads');
        const data = await apiGet('/leads/');
        displayLeads(data.leads || []);
        hideLoading('leads');
    } catch (error) {
        hideLoading('leads');
        showError('Ошибка загрузки заявок: ' + error.message);
    }
}

// Отображение заявок
function displayLeads(leads) {
    const tbody = document.getElementById('leads-tbody');
    tbody.innerHTML = '';

    leads.forEach(lead => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${lead.id}</td>
            <td>${lead.client_name || '-'}</td>
            <td>${lead.route_from || '-'} → ${lead.route_to || '-'}</td>
            <td>${lead.cargo_weight || 0} кг / ${lead.cargo_volume || 0} м³</td>
            <td>${formatCurrency(lead.total_amount)}</td>
            <td>${lead.status || 'new'}</td>
            <td>
                <button class="btn btn-secondary" onclick="editLead(${lead.id})">✏️</button>
                <button class="btn btn-secondary" onclick="deleteLead(${lead.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Создание заявки
async function createLead() {
    try {
        const formData = {
            client_name: document.getElementById('client-name').value,
            route_from: document.getElementById('route-from').value,
            route_to: document.getElementById('route-to').value,
            cargo_weight: parseFloat(document.getElementById('cargo-weight').value),
            cargo_volume: parseFloat(document.getElementById('cargo-volume').value),
            total_amount: parseFloat(document.getElementById('total-amount').value),
            partner_cost: parseFloat(document.getElementById('partner-cost').value),
            loading_date: document.getElementById('loading-date').value,
            unloading_date: document.getElementById('unloading-date').value,
            status: 'new'
        };

        await apiPost('/leads/', formData);
        
        showSuccess('Заявка создана успешно!');
        document.getElementById('lead-form').reset();
        loadLeads();
    } catch (error) {
        showError('Ошибка создания заявки: ' + error.message);
    }
}

// ============================================
// ПАРТНЕРЫ
// ============================================

// Загрузка партнеров
async function loadPartners() {
    try {
        showLoading('partners');
        const data = await apiGet('/partners/');
        displayPartners(data.partners || []);
        hideLoading('partners');
    } catch (error) {
        hideLoading('partners');
        showError('Ошибка загрузки партнеров: ' + error.message);
    }
}

// Отображение партнеров
function displayPartners(partners) {
    const tbody = document.getElementById('partners-tbody');
    tbody.innerHTML = '';

    partners.forEach(partner => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${partner.id}</td>
            <td>${partner.company_name}</td>
            <td>${partner.inn}</td>
            <td>${partner.contact_person || '-'}</td>
            <td>${partner.rating || 0} ⭐</td>
            <td>
                <button class="btn btn-secondary" onclick="editPartner(${partner.id})">✏️</button>
                <button class="btn btn-secondary" onclick="deletePartner(${partner.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Создание партнера
async function createPartner() {
    try {
        const formData = {
            company_name: document.getElementById('company-name').value,
            inn: document.getElementById('inn').value,
            kpp: document.getElementById('kpp').value,
            legal_address: document.getElementById('legal-address').value,
            bank_details: document.getElementById('bank-details').value,
            contact_person: document.getElementById('contact-person').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value
        };

        await apiPost('/partners/', formData);
        
        showSuccess('Партнер создан успешно!');
        document.getElementById('partner-form').reset();
        loadPartners();
    } catch (error) {
        showError('Ошибка создания партнера: ' + error.message);
    }
}

// ============================================
// УПРАВЛЕНЧЕСКИЙ УЧЕТ
// ============================================

// Загрузка управленческой статистики
async function loadManagementStats() {
    try {
        showLoading('management');
        const data = await apiGet('/management/stats/overview');
        
        // Обновляем статистику
        document.getElementById('total-income').textContent = formatCurrency(data.total_income);
        document.getElementById('total-expenses').textContent = formatCurrency(data.total_expenses);
        document.getElementById('ebitda').textContent = formatCurrency(data.total_ebitda);
        document.getElementById('net-profit').textContent = formatCurrency(data.total_net_profit);
        
        hideLoading('management');
    } catch (error) {
        hideLoading('management');
        showError('Ошибка загрузки статистики: ' + error.message);
    }
}

// ============================================
// ДОКУМЕНТЫ
// ============================================

// Загрузка документов
async function loadDocuments() {
    try {
        showLoading('documents');
        const data = await apiGet('/documents/');
        displayDocuments(data.documents || []);
        hideLoading('documents');
    } catch (error) {
        hideLoading('documents');
        showError('Ошибка загрузки документов: ' + error.message);
    }
}

// Отображение документов
function displayDocuments(documents) {
    const tbody = document.getElementById('documents-tbody');
    tbody.innerHTML = '';

    documents.forEach(doc => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${doc.id}</td>
            <td>${doc.title}</td>
            <td>${doc.document_type}</td>
            <td>${doc.status}</td>
            <td>${formatDate(doc.created_at)}</td>
            <td>
                <button class="btn btn-secondary" onclick="viewDocument(${doc.id})">👁️</button>
                <button class="btn btn-secondary" onclick="editDocument(${doc.id})">✏️</button>
                <button class="btn btn-secondary" onclick="deleteDocument(${doc.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Создание документа
async function createDocument() {
    try {
        const formData = {
            title: document.getElementById('doc-title').value,
            document_type: document.getElementById('doc-type').value,
            content: document.getElementById('doc-content').value,
            status: 'draft'
        };

        await apiPost('/documents/', formData);
        
        showSuccess('Документ создан успешно!');
        document.getElementById('document-form').reset();
        loadDocuments();
    } catch (error) {
        showError('Ошибка создания документа: ' + error.message);
    }
}

// ============================================
// КОНТРАКТЫ
// ============================================

// Загрузка контрактов
async function loadContracts() {
    try {
        showLoading('contracts');
        const data = await apiGet('/contracts/');
        displayContracts(data.contracts || []);
        hideLoading('contracts');
    } catch (error) {
        hideLoading('contracts');
        showError('Ошибка загрузки контрактов: ' + error.message);
    }
}

// Отображение контрактов
function displayContracts(contracts) {
    const tbody = document.getElementById('contracts-tbody');
    tbody.innerHTML = '';

    contracts.forEach(contract => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${contract.id}</td>
            <td>${contract.title}</td>
            <td>${contract.contract_type}</td>
            <td>${formatCurrency(contract.total_amount)}</td>
            <td>${contract.status}</td>
            <td>
                <button class="btn btn-secondary" onclick="viewContract(${contract.id})">👁️</button>
                <button class="btn btn-secondary" onclick="editContract(${contract.id})">✏️</button>
                <button class="btn btn-secondary" onclick="deleteContract(${contract.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Создание контракта
async function createContract() {
    try {
        const formData = {
            title: document.getElementById('contract-title').value,
            contract_type: document.getElementById('contract-type').value,
            lead_id: document.getElementById('contract-lead').value || null,
            partner_id: document.getElementById('contract-partner').value || null,
            total_amount: parseFloat(document.getElementById('contract-amount').value) || null,
            partner_cost: parseFloat(document.getElementById('contract-partner-cost').value) || null,
            payment_terms: document.getElementById('contract-payment-terms').value,
            status: 'draft'
        };

        await apiPost('/contracts/', formData);
        
        showSuccess('Контракт создан успешно!');
        document.getElementById('contract-form').reset();
        loadContracts();
    } catch (error) {
        showError('Ошибка создания контракта: ' + error.message);
    }
}

// ============================================
// ПРАВОВАЯ БАЗА
// ============================================

// Загрузка правовых документов
async function loadLegalDocuments() {
    try {
        showLoading('legal');
        const data = await apiGet('/legal/documents/');
        displayLegalDocuments(data.documents || []);
        hideLoading('legal');
    } catch (error) {
        hideLoading('legal');
        showError('Ошибка загрузки правовых документов: ' + error.message);
    }
}

// Отображение правовых документов
function displayLegalDocuments(documents) {
    const tbody = document.getElementById('legal-documents-tbody');
    tbody.innerHTML = '';

    documents.forEach(doc => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${doc.id}</td>
            <td>${doc.title}</td>
            <td>${doc.document_type}</td>
            <td>${doc.category_id || '-'}</td>
            <td>${doc.is_active ? 'Активен' : 'Неактивен'}</td>
            <td>
                <button class="btn btn-secondary" onclick="viewLegalDocument(${doc.id})">👁️</button>
                <button class="btn btn-secondary" onclick="editLegalDocument(${doc.id})">✏️</button>
                <button class="btn btn-secondary" onclick="deleteLegalDocument(${doc.id})">🗑️</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Поиск по правовой базе
async function searchLegal() {
    const query = document.getElementById('legal-search').value;
    if (!query.trim()) return;

    try {
        const data = await apiGet(`/legal/search/?q=${encodeURIComponent(query)}`);
        displaySearchResults(data);
    } catch (error) {
        showError('Ошибка поиска: ' + error.message);
    }
}

// Отображение результатов поиска
function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    container.innerHTML = `<h3>Результаты поиска: "${results.query}" (${results.total_results})</h3>`;

    if (results.documents.length > 0) {
        container.innerHTML += '<h4>📄 Документы:</h4>';
        results.documents.forEach(doc => {
            container.innerHTML += `
                <div class="result-item">
                    <h4>${doc.title}</h4>
                    <p>Тип: ${doc.document_type}</p>
                    <p>${doc.summary || 'Описание отсутствует'}</p>
                </div>
            `;
        });
    }

    if (results.articles.length > 0) {
        container.innerHTML += '<h4>📖 Статьи:</h4>';
        results.articles.forEach(article => {
            container.innerHTML.innerHTML += `
                <div class="result-item">
                    <h4>${article.title}</h4>
                    <p>${article.content.substring(0, 200)}...</p>
                </div>
            `;
        });
    }

    if (results.categories.length > 0) {
        container.innerHTML += '<h4>📁 Категории:</h4>';
        results.categories.forEach(category => {
            container.innerHTML += `
                <div class="result-item">
                    <h4>${category.name}</h4>
                    <p>${category.description || 'Описание отсутствует'}</p>
                </div>
            `;
        });
    }
}

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

// Показать индикатор загрузки
function showLoading(tabName) {
    const tab = document.getElementById(tabName);
    if (tab) {
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.id = `${tabName}-loading`;
        loading.textContent = 'Загрузка...';
        tab.appendChild(loading);
    }
}

// Скрыть индикатор загрузки
function hideLoading(tabName) {
    const loading = document.getElementById(`${tabName}-loading`);
    if (loading) {
        loading.remove();
    }
}

// Заглушки для функций редактирования и удаления
function editLead(id) { showNotification(`Редактирование заявки ${id} - функция в разработке`); }
function deleteLead(id) { showNotification(`Удаление заявки ${id} - функция в разработке`); }
function editPartner(id) { showNotification(`Редактирование партнера ${id} - функция в разработке`); }
function deletePartner(id) { showNotification(`Удаление партнера ${id} - функция в разработке`); }
function viewDocument(id) { showNotification(`Просмотр документа ${id} - функция в разработке`); }
function editDocument(id) { showNotification(`Редактирование документа ${id} - функция в разработке`); }
function deleteDocument(id) { showNotification(`Удаление документа ${id} - функция в разработке`); }
function viewContract(id) { showNotification(`Просмотр контракта ${id} - функция в разработке`); }
function editContract(id) { showNotification(`Редактирование контракта ${id} - функция в разработке`); }
function deleteContract(id) { showNotification(`Удаление контракта ${id} - функция в разработке`); }
function viewLegalDocument(id) { showNotification(`Просмотр правового документа ${id} - функция в разработке`); }
function editLegalDocument(id) { showNotification(`Редактирование правового документа ${id} - функция в разработке`); }
function deleteLegalDocument(id) { showNotification(`Удаление правового документа ${id} - функция в разработке`); }

// ============================================
// ИНИЦИАЛИЗАЦИЯ
// ============================================

// Инициализация приложения
function initApp() {
    console.log(`🚛 AVTOGOST77 CRM v${APP_VERSION} инициализирован`);
    
    // Загружаем начальные данные
    loadDashboardStats();
    
    // Добавляем обработчики событий
    document.addEventListener('DOMContentLoaded', function() {
        // Обработчик поиска по Enter
        document.getElementById('legal-search').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchLegal();
            }
        });
    });
}

// Запуск приложения
initApp();
