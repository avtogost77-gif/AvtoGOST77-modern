"""
AVTOGOST77 CRM MVP - Pydantic схемы для управленческого учета
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Схемы валидации данных для API управленческого учета
"""

from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import date, datetime
from decimal import Decimal

class ManagementBase(BaseModel):
    """Базовая схема управленческого учета"""
    
    date: date = Field(..., description="Дата операции")
    route_from: Optional[str] = Field(None, max_length=100, description="Город отправления")
    route_to: Optional[str] = Field(None, max_length=100, description="Город назначения")
    
    client_name: Optional[str] = Field(None, max_length=200, description="Имя клиента")
    partner_name: Optional[str] = Field(None, max_length=200, description="Имя партнера")
    
    incoming_amount: Decimal = Field(..., ge=0, description="Входящая сумма")
    partner_cost: Decimal = Field(..., ge=0, description="Стоимость партнера")
    
    volume_weight: Optional[Decimal] = Field(None, ge=0, description="Вес груза")
    volume_units: Optional[str] = Field(None, max_length=20, description="Единицы измерения объема")
    
    status: str = Field(default="completed", description="Статус операции")
    notes: Optional[str] = Field(None, description="Дополнительные заметки")
    
    @validator('partner_cost')
    def validate_partner_cost(cls, v, values):
        """Валидация стоимости партнера"""
        if 'incoming_amount' in values and v >= values['incoming_amount']:
            raise ValueError('Стоимость партнера не может быть больше или равна входящей сумме')
        return v
    
    @validator('route_to')
    def validate_route(cls, v, values):
        """Валидация маршрута"""
        if v and 'route_from' in values and values['route_from']:
            if v == values['route_from']:
                raise ValueError('Город отправления и назначения не могут быть одинаковыми')
        return v

class ManagementCreate(ManagementBase):
    """Схема для создания записи управленческого учета"""
    
    tax_rate: Optional[Decimal] = Field(7.0, ge=0, le=100, description="Налоговая ставка в процентах")

class ManagementUpdate(BaseModel):
    """Схема для обновления записи управленческого учета"""
    
    date: Optional[date] = None
    route_from: Optional[str] = Field(None, max_length=100)
    route_to: Optional[str] = Field(None, max_length=100)
    
    client_name: Optional[str] = Field(None, max_length=200)
    partner_name: Optional[str] = Field(None, max_length=200)
    
    incoming_amount: Optional[Decimal] = Field(None, ge=0)
    partner_cost: Optional[Decimal] = Field(None, ge=0)
    
    volume_weight: Optional[Decimal] = Field(None, ge=0)
    volume_units: Optional[str] = Field(None, max_length=20)
    
    status: Optional[str] = None
    notes: Optional[str] = None
    tax_rate: Optional[Decimal] = Field(None, ge=0, le=100)

class ManagementResponse(ManagementBase):
    """Схема для ответа с записью управленческого учета"""
    
    id: int
    ebitda: Optional[Decimal]
    tax_rate: Optional[Decimal]
    tax_amount: Optional[Decimal]
    net_profit: Optional[Decimal]
    margin_percent: Optional[Decimal]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            date: lambda v: v.isoformat(),
            Decimal: lambda v: float(v) if v else 0
        }

class ManagementSummary(BaseModel):
    """Схема для сводки по управленческому учету"""
    
    period: str
    total_records: int
    total_revenue: float
    total_partner_costs: float
    total_ebitda: float
    total_tax: float
    total_net_profit: float
    average_margin: float
    average_ebitda: float
    profitability_levels: dict
    top_clients: list
    top_routes: list
    
    class Config:
        from_attributes = True

class MonthlyStats(BaseModel):
    """Схема для месячной статистики"""
    
    month: int
    records_count: int
    revenue: float
    profit: float
    margin: float
    
    class Config:
        from_attributes = True

class ManagementMonthlyResponse(BaseModel):
    """Схема для ответа с месячной статистикой"""
    
    year: int
    monthly_stats: list[MonthlyStats]
    total_records: int
    total_revenue: float
    total_profit: float
    average_margin: float
    
    class Config:
        from_attributes = True

class QuickCalculateResponse(BaseModel):
    """Схема для ответа быстрого расчета"""
    
    incoming_amount: float
    partner_cost: float
    ebitda: float
    tax_rate: float
    tax_amount: float
    net_profit: float
    margin_percent: float
    profitability_level: str
    partner_share_percent: float
    profit_share_percent: float
    
    class Config:
        from_attributes = True
