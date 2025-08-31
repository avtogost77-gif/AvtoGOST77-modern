import React, { useState, useEffect } from 'react';
import './App.css';

// Типы данных
interface Lead {
  id: number;
  client_name: string;
  client_phone: string;
  client_email: string | null;
  from_city: string;
  to_city: string;
  weight: number;
  volume: number | null;
  cargo_type: string | null;
  urgency: string;
  status: string;
  comments: string | null;
  source: string;
  calculated_price: number | null;
  distance: number | null;
  created_at: string;
  updated_at: string;
}

interface CalculatorResult {
  from_city: string;
  to_city: string;
  weight: number;
  volume: number | null;
  urgency: string;
  distance: number;
  base_price: number;
  weight_coefficient: number;
  urgency_coefficient: number;
  total_price: number;
  currency: string;
}

interface Contract {
  id: number;
  contract_number: string;
  contract_date: string;
  lead_id: number;
  client_id: number;
  from_city: string;
  to_city: string;
  delivery_date: string;
  cargo_description: string;
  cargo_weight: number;
  total_price: number;
  prepayment_percent: number;
  prepayment_amount: number;
  final_payment_amount: number;
  additional_conditions: string | null;
  file_path: string | null;
  created_at: string;
  updated_at: string;
}

function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'contracts' | 'calculator'>('dashboard');
  
  // Состояние для новой заявки
  const [newLead, setNewLead] = useState({
    client_name: '',
    client_phone: '',
    client_email: '',
    from_city: '',
    to_city: '',
    weight: '',
    volume: '',
    cargo_type: '',
    urgency: 'standard',
    comments: '',
    source: 'website'
  });

  // Состояние для калькулятора
  const [calculator, setCalculator] = useState({
    from_city: '',
    to_city: '',
    weight: '',
    volume: '',
    urgency: 'standard'
  });
  const [calculatorResult, setCalculatorResult] = useState<CalculatorResult | null>(null);

  // Загрузка заявок и договоров
  useEffect(() => {
    fetchLeads();
    fetchContracts();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/leads/');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Ошибка загрузки заявок:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContracts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/contracts/');
      const data = await response.json();
      setContracts(data);
    } catch (error) {
      console.error('Ошибка загрузки договоров:', error);
    }
  };

  // Создание новой заявки
  const createLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/v1/leads/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newLead,
          weight: parseFloat(newLead.weight),
          volume: newLead.volume ? parseFloat(newLead.volume) : null,
        }),
      });
      
      if (response.ok) {
        const createdLead = await response.json();
        setLeads([...leads, createdLead]);
        // Сброс формы
        setNewLead({
          client_name: '',
          client_phone: '',
          client_email: '',
          from_city: '',
          to_city: '',
          weight: '',
          volume: '',
          cargo_type: '',
          urgency: 'standard',
          comments: '',
          source: 'website'
        });
        alert('Заявка создана успешно!');
      }
    } catch (error) {
      console.error('Ошибка создания заявки:', error);
      alert('Ошибка создания заявки');
    }
  };

  // Расчет стоимости
  const calculatePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const params = new URLSearchParams({
        from_city: calculator.from_city,
        to_city: calculator.to_city,
        weight: calculator.weight,
        urgency: calculator.urgency,
        ...(calculator.volume && { volume: calculator.volume })
      });

      const response = await fetch(`http://localhost:8000/api/v1/calculator/calculate?${params}`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const result = await response.json();
        setCalculatorResult(result);
      } else {
        alert('Ошибка расчета стоимости');
      }
    } catch (error) {
      console.error('Ошибка расчета:', error);
      alert('Ошибка расчета стоимости');
    }
  };

    // Изменение статуса заявки
  const updateLeadStatus = async (leadId: number, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/leads/${leadId}/status?status=${newStatus}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setLeads(leads.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        ));
        alert('Статус обновлен!');
      }
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
      alert('Ошибка обновления статуса');
    }
  };

  // Генерация договора
  const generateContract = async (leadId: number) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    try {
      const contractData = {
        contract_number: `АГ-${new Date().getFullYear()}/${leadId}`,
        contract_date: new Date().toLocaleDateString('ru-RU'),
        client_name: lead.client_name,
        client_representative: lead.client_name,
        client_authority: 'Устава',
        from_city: lead.from_city,
        to_city: lead.to_city,
        delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU'),
        cargo_description: lead.cargo_type || 'Груз',
        cargo_weight: lead.weight,
        total_price: lead.calculated_price || 15000,
        prepayment_percent: 50,
        prepayment_amount: (lead.calculated_price || 15000) * 0.5,
        final_payment_amount: (lead.calculated_price || 15000) * 0.5,
        additional_conditions: 'Погрузка и разгрузка осуществляется силами Заказчика',
        client_company_name: 'ООО "Клиент"',
        client_address: 'г. Москва',
        client_inn: '7712345678',
        client_ogrn: '1234567890123',
        client_bank: 'АО "БАНК"',
        client_account: '40702810123456789012',
        client_corr_account: '30101810123456789012',
        client_bik: '044525123',
        client_signatory: lead.client_name
      };

      const response = await fetch('http://localhost:8000/api/v1/contracts/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead_id: leadId,
          client_id: 1, // Временно
          contract_data: contractData
        }),
      });

      if (response.ok) {
        alert('Договор успешно сгенерирован!');
        fetchContracts(); // Обновляем список договоров
      } else {
        alert('Ошибка генерации договора');
      }
    } catch (error) {
      console.error('Ошибка генерации договора:', error);
      alert('Ошибка генерации договора');
    }
  };

  // Скачивание договора
  const downloadContract = async (contractId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/contracts/${contractId}/download`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `contract_${contractId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Файл договора не найден');
      }
    } catch (error) {
      console.error('Ошибка скачивания договора:', error);
      alert('Ошибка скачивания договора');
    }
  };

  // Статистика
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    processing: leads.filter(l => l.status === 'processing').length,
    confirmed: leads.filter(l => l.status === 'confirmed').length,
    completed: leads.filter(l => l.status === 'completed').length,
    contracts: contracts.length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#3b82f6';
      case 'processing': return '#f59e0b';
      case 'confirmed': return '#10b981';
      case 'completed': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Новая';
      case 'processing': return 'В обработке';
      case 'confirmed': return 'Подтверждена';
      case 'completed': return 'Завершена';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };

  if (loading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚛 АвтоГОСТ77 CRM</h1>
                        <nav className="nav-tabs">
                  <button
                    className={activeTab === 'dashboard' ? 'active' : ''}
                    onClick={() => setActiveTab('dashboard')}
                  >
                    📊 Дашборд
                  </button>
                  <button
                    className={activeTab === 'leads' ? 'active' : ''}
                    onClick={() => setActiveTab('leads')}
                  >
                    📋 Заявки
                  </button>
                  <button
                    className={activeTab === 'contracts' ? 'active' : ''}
                    onClick={() => setActiveTab('contracts')}
                  >
                    📄 Договоры
                  </button>
                  <button
                    className={activeTab === 'calculator' ? 'active' : ''}
                    onClick={() => setActiveTab('calculator')}
                  >
                    🧮 Калькулятор
                  </button>
                </nav>
      </header>

      <main className="App-main">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <h2>📊 Статистика</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Всего заявок</h3>
                <p className="stat-number">{stats.total}</p>
              </div>
              <div className="stat-card">
                <h3>Новые</h3>
                <p className="stat-number" style={{color: '#3b82f6'}}>{stats.new}</p>
              </div>
              <div className="stat-card">
                <h3>В обработке</h3>
                <p className="stat-number" style={{color: '#f59e0b'}}>{stats.processing}</p>
              </div>
              <div className="stat-card">
                <h3>Подтверждены</h3>
                <p className="stat-number" style={{color: '#10b981'}}>{stats.confirmed}</p>
              </div>
              <div className="stat-card">
                <h3>Завершены</h3>
                <p className="stat-number" style={{color: '#059669'}}>{stats.completed}</p>
              </div>
            </div>

            <h2>📋 Последние заявки</h2>
            <div className="leads-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Клиент</th>
                    <th>Маршрут</th>
                    <th>Вес</th>
                    <th>Статус</th>
                    <th>Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.slice(0, 5).map(lead => (
                    <tr key={lead.id}>
                      <td>#{lead.id}</td>
                      <td>{lead.client_name}</td>
                      <td>{lead.from_city} → {lead.to_city}</td>
                      <td>{lead.weight} кг</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{backgroundColor: getStatusColor(lead.status)}}
                        >
                          {getStatusText(lead.status)}
                        </span>
                      </td>
                      <td>{new Date(lead.created_at).toLocaleDateString('ru-RU')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="leads-section">
            <h2>📋 Управление заявками</h2>
            
            <div className="leads-container">
              <div className="leads-list">
                <h3>Список заявок ({leads.length})</h3>
                <div className="leads-grid">
                  {leads.map(lead => (
                    <div key={lead.id} className="lead-card">
                      <div className="lead-header">
                        <h4>#{lead.id} - {lead.client_name}</h4>
                        <span 
                          className="status-badge"
                          style={{backgroundColor: getStatusColor(lead.status)}}
                        >
                          {getStatusText(lead.status)}
                        </span>
                      </div>
                      <div className="lead-details">
                        <p><strong>Телефон:</strong> {lead.client_phone}</p>
                        <p><strong>Маршрут:</strong> {lead.from_city} → {lead.to_city}</p>
                        <p><strong>Вес:</strong> {lead.weight} кг</p>
                        <p><strong>Срочность:</strong> {lead.urgency === 'urgent' ? 'Срочно' : 'Обычно'}</p>
                        <p><strong>Источник:</strong> {lead.source}</p>
                        <p><strong>Дата:</strong> {new Date(lead.created_at).toLocaleString('ru-RU')}</p>
                      </div>
                      <div className="lead-actions">
                        <select 
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                        >
                          <option value="new">Новая</option>
                          <option value="processing">В обработке</option>
                          <option value="confirmed">Подтверждена</option>
                          <option value="completed">Завершена</option>
                          <option value="cancelled">Отменена</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="new-lead-form">
                <h3>➕ Создать заявку</h3>
                <form onSubmit={createLead}>
                  <div className="form-group">
                    <label>Имя клиента *</label>
                    <input
                      type="text"
                      value={newLead.client_name}
                      onChange={(e) => setNewLead({...newLead, client_name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Телефон *</label>
                    <input
                      type="tel"
                      value={newLead.client_phone}
                      onChange={(e) => setNewLead({...newLead, client_phone: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={newLead.client_email}
                      onChange={(e) => setNewLead({...newLead, client_email: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Откуда *</label>
                      <input
                        type="text"
                        value={newLead.from_city}
                        onChange={(e) => setNewLead({...newLead, from_city: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Куда *</label>
                      <input
                        type="text"
                        value={newLead.to_city}
                        onChange={(e) => setNewLead({...newLead, to_city: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Вес (кг) *</label>
                      <input
                        type="number"
                        value={newLead.weight}
                        onChange={(e) => setNewLead({...newLead, weight: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Объем (м³)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newLead.volume}
                        onChange={(e) => setNewLead({...newLead, volume: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Тип груза</label>
                    <input
                      type="text"
                      value={newLead.cargo_type}
                      onChange={(e) => setNewLead({...newLead, cargo_type: e.target.value})}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Срочность</label>
                    <select
                      value={newLead.urgency}
                      onChange={(e) => setNewLead({...newLead, urgency: e.target.value})}
                    >
                      <option value="standard">Обычно</option>
                      <option value="urgent">Срочно</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Комментарии</label>
                    <textarea
                      value={newLead.comments}
                      onChange={(e) => setNewLead({...newLead, comments: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <button type="submit" className="btn-primary">
                    ➕ Создать заявку
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'calculator' && (
          <div className="calculator-section">
            <h2>🧮 Калькулятор стоимости</h2>
            
            <div className="calculator-container">
              <div className="calculator-form">
                <form onSubmit={calculatePrice}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Откуда *</label>
                      <input
                        type="text"
                        value={calculator.from_city}
                        onChange={(e) => setCalculator({...calculator, from_city: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Куда *</label>
                      <input
                        type="text"
                        value={calculator.to_city}
                        onChange={(e) => setCalculator({...calculator, to_city: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Вес (кг) *</label>
                      <input
                        type="number"
                        value={calculator.weight}
                        onChange={(e) => setCalculator({...calculator, weight: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Объем (м³)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={calculator.volume}
                        onChange={(e) => setCalculator({...calculator, volume: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Срочность</label>
                    <select
                      value={calculator.urgency}
                      onChange={(e) => setCalculator({...calculator, urgency: e.target.value})}
                    >
                      <option value="standard">Обычно</option>
                      <option value="urgent">Срочно</option>
                    </select>
                  </div>
                  
                  <button type="submit" className="btn-primary">
                    🧮 Рассчитать стоимость
                  </button>
                </form>
              </div>

              {calculatorResult && (
                <div className="calculator-result">
                  <h3>📊 Результат расчета</h3>
                  <div className="result-card">
                    <div className="result-row">
                      <span>Маршрут:</span>
                      <span>{calculatorResult.from_city} → {calculatorResult.to_city}</span>
                    </div>
                    <div className="result-row">
                      <span>Расстояние:</span>
                      <span>{calculatorResult.distance} км</span>
                    </div>
                    <div className="result-row">
                      <span>Вес:</span>
                      <span>{calculatorResult.weight} кг</span>
                    </div>
                    <div className="result-row">
                      <span>Базовая стоимость:</span>
                      <span>{calculatorResult.base_price.toLocaleString()} ₽</span>
                    </div>
                    <div className="result-row">
                      <span>Коэффициент веса:</span>
                      <span>{calculatorResult.weight_coefficient}x</span>
                    </div>
                    <div className="result-row">
                      <span>Коэффициент срочности:</span>
                      <span>{calculatorResult.urgency_coefficient}x</span>
                    </div>
                    <div className="result-row total">
                      <span>Итоговая стоимость:</span>
                      <span>{calculatorResult.total_price.toLocaleString()} ₽</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
