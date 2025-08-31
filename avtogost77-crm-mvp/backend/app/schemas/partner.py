"""
AVTOGOST77 CRM MVP - Pydantic схемы для партнеров
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Схемы валидации данных для API партнеров
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class PartnerBase(BaseModel):
    """Базовая схема партнера"""
    
    company_name: str = Field(..., min_length=2, max_length=200, description="Название компании")
    inn: Optional[str] = Field(None, min_length=10, max_length=12, description="ИНН")
    kpp: Optional[str] = Field(None, min_length=9, max_length=9, description="КПП")
    legal_address: Optional[str] = Field(None, description="Юридический адрес")
    actual_address: Optional[str] = Field(None, description="Фактический адрес")
    bank_details: Optional[str] = Field(None, description="Банковские реквизиты")
    
    contact_person: Optional[str] = Field(None, max_length=100, description="Контактное лицо")
    phone: Optional[str] = Field(None, min_length=10, max_length=20, description="Телефон")
    email: Optional[str] = Field(None, max_length=100, description="Email")
    
    notes: Optional[str] = Field(None, description="Дополнительные заметки")

class PartnerCreate(PartnerBase):
    """Схема для создания партнера"""
    
    status: str = Field(default="active", description="Статус партнера")

class PartnerUpdate(BaseModel):
    """Схема для обновления партнера"""
    
    company_name: Optional[str] = Field(None, min_length=2, max_length=200)
    inn: Optional[str] = Field(None, min_length=10, max_length=12)
    kpp: Optional[str] = Field(None, min_length=9, max_length=9)
    legal_address: Optional[str] = None
    actual_address: Optional[str] = None
    bank_details: Optional[str] = None
    
    contact_person: Optional[str] = Field(None, max_length=100)
    phone: Optional[str] = Field(None, min_length=10, max_length=20)
    email: Optional[str] = Field(None, max_length=100)
    
    status: Optional[str] = None
    notes: Optional[str] = None

class PartnerResponse(PartnerBase):
    """Схема для ответа с партнером"""
    
    id: int
    rating: Optional[float]
    status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class PartnerLocationBase(BaseModel):
    """Базовая схема локации партнера"""
    
    city: str = Field(..., min_length=2, max_length=100, description="Город")
    region: Optional[str] = Field(None, max_length=100, description="Регион")
    is_main: bool = Field(default=False, description="Основной город")

class PartnerLocationCreate(PartnerLocationBase):
    """Схема для создания локации партнера"""
    pass

class PartnerLocationResponse(PartnerLocationBase):
    """Схема для ответа с локацией партнера"""
    
    id: int
    partner_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class PartnerWithLocations(PartnerResponse):
    """Схема партнера с локациями"""
    
    locations: List[PartnerLocationResponse] = []
    
    class Config:
        from_attributes = True
