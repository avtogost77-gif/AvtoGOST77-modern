"""
Схемы для договоров
"""

from typing import Optional
from pydantic import BaseModel, validator
from datetime import datetime
from decimal import Decimal

from app.core.config import CONTRACT_STATUSES


class ContractBase(BaseModel):
    """Базовая схема договора"""
    client_id: int
    lead_id: Optional[int] = None
    status: str = "draft"
    total_amount: Decimal
    currency: str = "RUB"
    route_from: str
    route_to: str
    cargo_weight: Optional[Decimal] = None
    cargo_volume: Optional[Decimal] = None
    cargo_type: Optional[str] = None
    cargo_description: Optional[str] = None
    delivery_time: Optional[str] = None
    is_urgent: bool = False
    is_consolidated: bool = False
    special_conditions: Optional[str] = None
    notes: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        if v not in CONTRACT_STATUSES:
            raise ValueError(f'Статус должен быть одним из: {", ".join(CONTRACT_STATUSES)}')
        return v

    @validator('currency')
    def validate_currency(cls, v):
        if len(v) != 3:
            raise ValueError('Код валюты должен содержать 3 символа')
        return v.upper()

    @validator('total_amount')
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError('Сумма должна быть больше нуля')
        return v


class ContractCreate(ContractBase):
    """Схема для создания договора"""
    pass


class ContractUpdate(BaseModel):
    """Схема для обновления договора"""
    client_id: Optional[int] = None
    lead_id: Optional[int] = None
    status: Optional[str] = None
    total_amount: Optional[Decimal] = None
    currency: Optional[str] = None
    route_from: Optional[str] = None
    route_to: Optional[str] = None
    cargo_weight: Optional[Decimal] = None
    cargo_volume: Optional[Decimal] = None
    cargo_type: Optional[str] = None
    cargo_description: Optional[str] = None
    delivery_time: Optional[str] = None
    is_urgent: Optional[bool] = None
    is_consolidated: Optional[bool] = None
    special_conditions: Optional[str] = None
    notes: Optional[str] = None

    @validator('status')
    def validate_status(cls, v):
        if v is not None and v not in CONTRACT_STATUSES:
            raise ValueError(f'Статус должен быть одним из: {", ".join(CONTRACT_STATUSES)}')
        return v

    @validator('currency')
    def validate_currency(cls, v):
        if v is not None and len(v) != 3:
            raise ValueError('Код валюты должен содержать 3 символа')
        return v.upper() if v else v

    @validator('total_amount')
    def validate_amount(cls, v):
        if v is not None and v <= 0:
            raise ValueError('Сумма должна быть больше нуля')
        return v


class ContractResponse(ContractBase):
    """Схема для ответа с данными договора"""
    id: int
    contract_number: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    signed_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    display_route: str
    display_amount: str
    display_cargo: str
    is_signed: bool
    is_completed: bool

    class Config:
        from_attributes = True
