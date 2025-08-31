"""
AVTOGOST77 CRM MVP - Pydantic схемы для управленческого учета
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Схемы валидации данных для API управленческого учета
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, datetime

class ManagementCreate(BaseModel):
    """Схема для создания записи управленческого учета"""
    
    date: date
    route_from: Optional[str] = None
    route_to: Optional[str] = None
    client_name: Optional[str] = None
    partner_name: Optional[str] = None
    incoming_amount: float
    partner_cost: float
    volume_weight: Optional[float] = None
    volume_units: Optional[str] = None
    status: str = "completed"
    notes: Optional[str] = None
    tax_rate: float = 7.0

class ManagementResponse(BaseModel):
    """Схема для ответа с записью управленческого учета"""
    
    id: int
    date: date
    route_from: Optional[str] = None
    route_to: Optional[str] = None
    client_name: Optional[str] = None
    partner_name: Optional[str] = None
    incoming_amount: float
    partner_cost: float
    volume_weight: Optional[float] = None
    volume_units: Optional[str] = None
    status: str
    notes: Optional[str] = None
    ebitda: Optional[float] = None
    tax_rate: Optional[float] = None
    tax_amount: Optional[float] = None
    net_profit: Optional[float] = None
    margin_percent: Optional[float] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

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
    profitability_levels: Dict[str, int]
    top_clients: List[Dict[str, Any]]
    top_routes: List[Dict[str, Any]]
    
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
    monthly_stats: List[MonthlyStats]
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
