"""
AVTOGOST77 CRM MVP - Модель управленческого учета
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: SQLAlchemy модель для таблицы управленческого учета
"""

from sqlalchemy import Column, Integer, String, Text, Date, Numeric, DateTime
from sqlalchemy.sql import func
from decimal import Decimal

from ..database import Base

class ManagementRecord(Base):
    """Модель записи управленческого учета"""
    
    __tablename__ = "management_records"
    
    # Основные поля
    id = Column(Integer, primary_key=True, index=True)
    
    # Дата операции
    date = Column(Date, nullable=False, index=True)
    
    # Маршрут
    route_from = Column(String(100))
    route_to = Column(String(100))
    
    # Участники
    client_name = Column(String(200))
    partner_name = Column(String(200))
    
    # Финансы
    incoming_amount = Column(Numeric(10, 2), nullable=False)
    partner_cost = Column(Numeric(10, 2), nullable=False)
    ebitda = Column(Numeric(10, 2))
    tax_rate = Column(Numeric(5, 2), default=7.0)
    tax_amount = Column(Numeric(10, 2))
    net_profit = Column(Numeric(10, 2))
    margin_percent = Column(Numeric(5, 2))
    
    # Объемы
    volume_weight = Column(Numeric(8, 2))
    volume_units = Column(String(20))
    
    # Статус и заметки
    status = Column(String(50), default="completed")
    notes = Column(Text)
    
    # Временные метки
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<ManagementRecord(id={self.id}, date='{self.date}', client='{self.client_name}', profit={self.net_profit})>"
    
    @property
    def route_display(self):
        """Отображение маршрута"""
        if self.route_from and self.route_to:
            return f"{self.route_from} → {self.route_to}"
        return "Маршрут не указан"
    
    @property
    def gross_profit(self):
        """Валовая прибыль (EBITDA)"""
        if self.incoming_amount and self.partner_cost:
            return self.incoming_amount - self.partner_cost
        return Decimal('0')
    
    @property
    def tax_amount_calculated(self):
        """Рассчитанная сумма налогов"""
        if self.incoming_amount and self.tax_rate:
            return self.incoming_amount * (self.tax_rate / 100)
        return Decimal('0')
    
    @property
    def net_profit_calculated(self):
        """Рассчитанная чистая прибыль"""
        gross = self.gross_profit
        tax = self.tax_amount_calculated
        return gross - tax
    
    @property
    def margin_percent_calculated(self):
        """Рассчитанная маржинальность"""
        if self.incoming_amount and self.incoming_amount > 0:
            net_profit = self.net_profit_calculated
            return (net_profit / self.incoming_amount) * 100
        return Decimal('0')
    
    @property
    def partner_share_percent(self):
        """Доля партнера в процентах"""
        if self.incoming_amount and self.incoming_amount > 0:
            return (self.partner_cost / self.incoming_amount) * 100
        return Decimal('0')
    
    @property
    def profit_share_percent(self):
        """Доля прибыли в процентах"""
        if self.incoming_amount and self.incoming_amount > 0:
            gross = self.gross_profit
            return (gross / self.incoming_amount) * 100
        return Decimal('0')
    
    @property
    def is_profitable(self):
        """Проверка прибыльности операции"""
        return self.net_profit_calculated > 0
    
    @property
    def profitability_level(self):
        """Уровень прибыльности"""
        margin = self.margin_percent_calculated
        if margin >= 30:
            return "Высокая"
        elif margin >= 20:
            return "Средняя"
        elif margin >= 10:
            return "Низкая"
        else:
            return "Критическая"
    
    def calculate_all_metrics(self):
        """Расчет всех метрик"""
        # EBITDA
        self.ebitda = self.gross_profit
        
        # Налоги
        self.tax_amount = self.tax_amount_calculated
        
        # Чистая прибыль
        self.net_profit = self.net_profit_calculated
        
        # Маржинальность
        self.margin_percent = self.margin_percent_calculated
        
        return {
            'ebitda': self.ebitda,
            'tax_amount': self.tax_amount,
            'net_profit': self.net_profit,
            'margin_percent': self.margin_percent
        }
