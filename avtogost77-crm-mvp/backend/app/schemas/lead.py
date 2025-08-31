"""
AVTOGOST77 CRM MVP - Pydantic схемы для заявок
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Схемы валидации данных для API заявок
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, time, datetime

class LeadBase(BaseModel):
    """Базовая схема заявки"""
    
    client_name: str = Field(..., min_length=2, max_length=200, description="Имя клиента")
    client_phone: str = Field(..., min_length=10, max_length=20, description="Телефон клиента")
    client_email: Optional[str] = Field(None, max_length=100, description="Email клиента")
    
    route_from: str = Field(..., min_length=2, max_length=100, description="Город отправления")
    route_to: str = Field(..., min_length=2, max_length=100, description="Город назначения")
    
    cargo_name: Optional[str] = Field(None, max_length=200, description="Наименование груза")
    cargo_weight: Optional[float] = Field(None, ge=0, description="Вес груза в кг")
    cargo_volume: Optional[float] = Field(None, ge=0, description="Объем груза")
    cargo_packaging: Optional[str] = Field(None, max_length=100, description="Упаковка груза")
    
    loading_date: Optional[date] = Field(None, description="Дата погрузки")
    loading_time_from: Optional[time] = Field(None, description="Время начала погрузки")
    loading_time_to: Optional[time] = Field(None, description="Время окончания погрузки")
    
    unloading_date: Optional[date] = Field(None, description="Дата выгрузки")
    unloading_time: Optional[time] = Field(None, description="Время выгрузки")
    
    loading_address: Optional[str] = Field(None, description="Адрес погрузки")
    unloading_address: Optional[str] = Field(None, description="Адрес выгрузки")
    
    total_amount: Optional[float] = Field(None, ge=0, description="Общая стоимость")
    partner_cost: Optional[float] = Field(None, ge=0, description="Стоимость партнера")
    
    notes: Optional[str] = Field(None, description="Дополнительные заметки")

class LeadCreate(LeadBase):
    """Схема для создания заявки"""
    
    status: str = Field(default="new", description="Статус заявки")
    source: str = Field(default="website", description="Источник заявки")

class LeadUpdate(BaseModel):
    """Схема для обновления заявки"""
    
    client_name: Optional[str] = Field(None, min_length=2, max_length=200)
    client_phone: Optional[str] = Field(None, min_length=10, max_length=20)
    client_email: Optional[str] = Field(None, max_length=100)
    
    route_from: Optional[str] = Field(None, min_length=2, max_length=100)
    route_to: Optional[str] = Field(None, min_length=2, max_length=100)
    
    cargo_name: Optional[str] = Field(None, max_length=200)
    cargo_weight: Optional[float] = Field(None, ge=0)
    cargo_volume: Optional[float] = Field(None, ge=0)
    cargo_packaging: Optional[str] = Field(None, max_length=100)
    
    loading_date: Optional[date] = None
    loading_time_from: Optional[time] = None
    loading_time_to: Optional[time] = None
    
    unloading_date: Optional[date] = None
    unloading_time: Optional[time] = None
    
    loading_address: Optional[str] = None
    unloading_address: Optional[str] = None
    
    total_amount: Optional[float] = Field(None, ge=0)
    partner_cost: Optional[float] = Field(None, ge=0)
    
    status: Optional[str] = None
    notes: Optional[str] = None

class LeadResponse(LeadBase):
    """Схема для ответа с заявкой"""
    
    id: int
    status: str
    source: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class LeadList(BaseModel):
    """Схема для списка заявок с пагинацией"""
    
    leads: List[LeadResponse]
    total: int
    skip: int
    limit: int
    
    class Config:
        from_attributes = True
