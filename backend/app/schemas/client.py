"""
Схемы для клиентов
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, validator
from datetime import datetime

from app.core.config import CLIENT_TYPES


class ClientBase(BaseModel):
    """Базовая схема клиента"""
    name: str
    phone: str
    email: Optional[EmailStr] = None
    type: str = "individual"
    company_name: Optional[str] = None
    inn: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None

    @validator('type')
    def validate_type(cls, v):
        if v not in CLIENT_TYPES:
            raise ValueError(f'Тип должен быть одним из: {", ".join(CLIENT_TYPES)}')
        return v

    @validator('phone')
    def validate_phone(cls, v):
        # Простая валидация телефона
        phone = ''.join(filter(str.isdigit, v))
        if len(phone) < 10:
            raise ValueError('Неверный формат телефона')
        return v


class ClientCreate(ClientBase):
    """Схема для создания клиента"""
    pass


class ClientUpdate(BaseModel):
    """Схема для обновления клиента"""
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    type: Optional[str] = None
    company_name: Optional[str] = None
    inn: Optional[str] = None
    address: Optional[str] = None
    notes: Optional[str] = None

    @validator('type')
    def validate_type(cls, v):
        if v is not None and v not in CLIENT_TYPES:
            raise ValueError(f'Тип должен быть одним из: {", ".join(CLIENT_TYPES)}')
        return v


class ClientResponse(ClientBase):
    """Схема для ответа с данными клиента"""
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    display_name: str
    is_legal_entity: bool

    class Config:
        from_attributes = True
