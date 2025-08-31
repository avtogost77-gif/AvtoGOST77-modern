"""
AVTOGOST77 CRM MVP - Pydantic схемы для контрактов
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Схемы валидации данных для API контрактов
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, datetime

# ============================================
# БАЗОВЫЕ СХЕМЫ
# ============================================

class ContractBase(BaseModel):
    """Базовая схема контракта"""
    
    title: str = Field(..., min_length=1, max_length=500, description="Название контракта")
    contract_type: str = Field(..., description="Тип контракта")
    status: str = Field(default="draft", description="Статус контракта")
    
    # Связи
    lead_id: Optional[int] = Field(None, description="ID заявки")
    partner_id: Optional[int] = Field(None, description="ID партнера")
    client_name: Optional[str] = Field(None, max_length=200, description="Имя клиента")
    
    # Шаблон и содержимое
    template_id: Optional[int] = Field(None, description="ID шаблона контракта")
    content: Optional[str] = Field(None, description="Содержимое контракта")
    variables: Optional[Dict[str, Any]] = Field(None, description="Переменные для подстановки")
    
    # Маршрут и даты
    route_from: Optional[str] = Field(None, max_length=100, description="Город отправления")
    route_to: Optional[str] = Field(None, max_length=100, description="Город назначения")
    loading_date: Optional[datetime] = Field(None, description="Дата погрузки")
    unloading_date: Optional[datetime] = Field(None, description="Дата выгрузки")
    
    # Финансовые условия
    total_amount: Optional[float] = Field(None, ge=0, description="Общая сумма")
    partner_cost: Optional[float] = Field(None, ge=0, description="Стоимость партнера")
    volume_weight: Optional[float] = Field(None, ge=0, description="Вес груза")
    volume_units: Optional[str] = Field(None, max_length=20, description="Единицы измерения объема")
    payment_terms: Optional[str] = Field(None, max_length=500, description="Условия оплаты")
    payment_deadline: Optional[int] = Field(None, ge=1, description="Срок оплаты в днях")
    
    # Условия контракта
    delivery_terms: Optional[str] = Field(None, max_length=500, description="Условия доставки")
    liability_terms: Optional[str] = Field(None, max_length=500, description="Условия ответственности")
    force_majeure: Optional[str] = Field(None, max_length=500, description="Форс-мажор")
    
    # Зеркальный контракт
    mirror_contract_id: Optional[int] = Field(None, description="ID зеркального контракта")
    
    # Дополнительная информация
    notes: Optional[str] = Field(None, description="Заметки")
    tags: Optional[Dict[str, Any]] = Field(None, description="Теги для поиска")

class ContractTemplateBase(BaseModel):
    """Базовая схема шаблона контракта"""
    
    name: str = Field(..., min_length=1, max_length=200, description="Название шаблона")
    description: Optional[str] = Field(None, description="Описание шаблона")
    contract_type: str = Field(..., description="Тип контракта")
    
    # Содержимое шаблона
    content: str = Field(..., description="HTML содержимое шаблона")
    variables: Optional[Dict[str, Any]] = Field(None, description="Доступные переменные")
    
    # Настройки
    is_default: bool = Field(default=False, description="Шаблон по умолчанию")
    is_active: bool = Field(default=True, description="Активен ли шаблон")
    is_mirror_template: bool = Field(default=False, description="Шаблон для зеркальных контрактов")
    
    # Категории и теги
    category: Optional[str] = Field(None, max_length=100, description="Категория шаблона")
    tags: Optional[Dict[str, Any]] = Field(None, description="Теги для поиска")

class ContractConditionBase(BaseModel):
    """Базовая схема условия контракта"""
    
    name: str = Field(..., min_length=1, max_length=200, description="Название условия")
    description: Optional[str] = Field(None, description="Описание условия")
    
    # Содержимое условия
    content: str = Field(..., description="HTML содержимое условия")
    variables: Optional[Dict[str, Any]] = Field(None, description="Переменные условия")
    
    # Тип и настройки
    condition_type: str = Field(..., max_length=100, description="Тип условия")
    is_required: bool = Field(default=False, description="Обязательное ли условие")
    order_index: int = Field(default=0, ge=0, description="Порядок в контракте")
    
    # Категории
    category: Optional[str] = Field(None, max_length=100, description="Категория условия")
    tags: Optional[Dict[str, Any]] = Field(None, description="Теги для поиска")

# ============================================
# СХЕМЫ СОЗДАНИЯ
# ============================================

class ContractCreate(ContractBase):
    """Схема для создания контракта"""
    pass

class ContractTemplateCreate(ContractTemplateBase):
    """Схема для создания шаблона контракта"""
    pass

class ContractConditionCreate(ContractConditionBase):
    """Схема для создания условия контракта"""
    pass

# ============================================
# СХЕМЫ ОБНОВЛЕНИЯ
# ============================================

class ContractUpdate(BaseModel):
    """Схема для обновления контракта"""
    
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    contract_type: Optional[str] = None
    status: Optional[str] = None
    
    # Связи
    lead_id: Optional[int] = None
    partner_id: Optional[int] = None
    client_name: Optional[str] = Field(None, max_length=200)
    
    # Шаблон и содержимое
    template_id: Optional[int] = None
    content: Optional[str] = None
    variables: Optional[Dict[str, Any]] = None
    
    # Маршрут и даты
    route_from: Optional[str] = Field(None, max_length=100)
    route_to: Optional[str] = Field(None, max_length=100)
    loading_date: Optional[datetime] = None
    unloading_date: Optional[datetime] = None
    
    # Финансовые условия
    total_amount: Optional[float] = Field(None, ge=0)
    partner_cost: Optional[float] = Field(None, ge=0)
    volume_weight: Optional[float] = Field(None, ge=0)
    volume_units: Optional[str] = Field(None, max_length=20)
    payment_terms: Optional[str] = Field(None, max_length=500)
    payment_deadline: Optional[int] = Field(None, ge=1)
    
    # Условия контракта
    delivery_terms: Optional[str] = Field(None, max_length=500)
    liability_terms: Optional[str] = Field(None, max_length=500)
    force_majeure: Optional[str] = Field(None, max_length=500)
    
    # Зеркальный контракт
    mirror_contract_id: Optional[int] = None
    
    # Дополнительная информация
    notes: Optional[str] = None
    tags: Optional[Dict[str, Any]] = None

class ContractTemplateUpdate(BaseModel):
    """Схема для обновления шаблона контракта"""
    
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    contract_type: Optional[str] = None
    content: Optional[str] = None
    variables: Optional[Dict[str, Any]] = None
    is_default: Optional[bool] = None
    is_active: Optional[bool] = None
    is_mirror_template: Optional[bool] = None
    category: Optional[str] = Field(None, max_length=100)
    tags: Optional[Dict[str, Any]] = None

class ContractConditionUpdate(BaseModel):
    """Схема для обновления условия контракта"""
    
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    content: Optional[str] = None
    variables: Optional[Dict[str, Any]] = None
    condition_type: Optional[str] = Field(None, max_length=100)
    is_required: Optional[bool] = None
    order_index: Optional[int] = Field(None, ge=0)
    category: Optional[str] = Field(None, max_length=100)
    tags: Optional[Dict[str, Any]] = None

# ============================================
# СХЕМЫ ОТВЕТОВ
# ============================================

class ContractResponse(ContractBase):
    """Схема для ответа с контрактом"""
    
    id: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    
    class Config:
        from_attributes = True

class ContractTemplateResponse(ContractTemplateBase):
    """Схема для ответа с шаблоном контракта"""
    
    id: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    
    class Config:
        from_attributes = True

class ContractConditionResponse(ContractConditionBase):
    """Схема для ответа с условием контракта"""
    
    id: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    
    class Config:
        from_attributes = True

# ============================================
# СПИСКИ И СВОДКИ
# ============================================

class ContractList(BaseModel):
    """Схема для списка контрактов с пагинацией"""
    
    contracts: List[ContractResponse]
    total: int
    skip: int
    limit: int
    
    class Config:
        from_attributes = True

class ContractHistoryResponse(BaseModel):
    """Схема для истории изменений контракта"""
    
    id: int
    contract_id: int
    action: str
    field_name: Optional[str] = None
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    created_by: Optional[str] = None
    
    class Config:
        from_attributes = True

class ContractStats(BaseModel):
    """Схема для статистики контрактов"""
    
    total_contracts: int
    contracts_by_type: Dict[str, int]
    contracts_by_status: Dict[str, int]
    total_amount: float
    total_partner_cost: float
    total_profit: float
    recent_contracts: List[Dict[str, Any]]
    
    class Config:
        from_attributes = True

class MirrorContractResponse(BaseModel):
    """Схема для зеркального контракта"""
    
    client_contract: ContractResponse
    partner_contract: Optional[ContractResponse] = None
    is_synchronized: bool
    sync_errors: List[str] = []
    
    class Config:
        from_attributes = True
