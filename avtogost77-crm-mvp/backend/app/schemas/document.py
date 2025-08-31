"""
AVTOGOST77 CRM MVP - Pydantic схемы для документов
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Схемы валидации данных для API документов
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, datetime

# ============================================
# БАЗОВЫЕ СХЕМЫ
# ============================================

class DocumentBase(BaseModel):
    """Базовая схема документа"""
    
    title: str = Field(..., min_length=1, max_length=500, description="Название документа")
    document_type: str = Field(..., description="Тип документа")
    status: str = Field(default="draft", description="Статус документа")
    
    # Связи
    lead_id: Optional[int] = Field(None, description="ID заявки")
    partner_id: Optional[int] = Field(None, description="ID партнера")
    client_name: Optional[str] = Field(None, max_length=200, description="Имя клиента")
    
    # Шаблон и содержимое
    template_id: Optional[int] = Field(None, description="ID шаблона")
    content: Optional[str] = Field(None, description="Содержимое документа")
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
    
    # Дополнительная информация
    notes: Optional[str] = Field(None, description="Заметки")
    tags: Optional[Dict[str, Any]] = Field(None, description="Теги для поиска")

class DocumentTemplateBase(BaseModel):
    """Базовая схема шаблона документа"""
    
    name: str = Field(..., min_length=1, max_length=200, description="Название шаблона")
    description: Optional[str] = Field(None, description="Описание шаблона")
    document_type: str = Field(..., description="Тип документа")
    
    # Содержимое шаблона
    content: str = Field(..., description="HTML содержимое шаблона")
    variables: Optional[Dict[str, Any]] = Field(None, description="Доступные переменные")
    
    # Настройки
    is_default: bool = Field(default=False, description="Шаблон по умолчанию")
    is_active: bool = Field(default=True, description="Активен ли шаблон")
    
    # Категории и теги
    category: Optional[str] = Field(None, max_length=100, description="Категория шаблона")
    tags: Optional[Dict[str, Any]] = Field(None, description="Теги для поиска")

class DocumentBlockBase(BaseModel):
    """Базовая схема блока документа"""
    
    name: str = Field(..., min_length=1, max_length=200, description="Название блока")
    description: Optional[str] = Field(None, description="Описание блока")
    
    # Содержимое блока
    content: str = Field(..., description="HTML содержимое блока")
    variables: Optional[Dict[str, Any]] = Field(None, description="Переменные блока")
    
    # Тип и настройки
    block_type: str = Field(..., max_length=100, description="Тип блока")
    is_required: bool = Field(default=False, description="Обязательный ли блок")
    order_index: int = Field(default=0, ge=0, description="Порядок в документе")
    
    # Категории
    category: Optional[str] = Field(None, max_length=100, description="Категория блока")
    tags: Optional[Dict[str, Any]] = Field(None, description="Теги для поиска")

# ============================================
# СХЕМЫ СОЗДАНИЯ
# ============================================

class DocumentCreate(DocumentBase):
    """Схема для создания документа"""
    pass

class DocumentTemplateCreate(DocumentTemplateBase):
    """Схема для создания шаблона документа"""
    pass

class DocumentBlockCreate(DocumentBlockBase):
    """Схема для создания блока документа"""
    pass

# ============================================
# СХЕМЫ ОБНОВЛЕНИЯ
# ============================================

class DocumentUpdate(BaseModel):
    """Схема для обновления документа"""
    
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    document_type: Optional[str] = None
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
    
    # Дополнительная информация
    notes: Optional[str] = None
    tags: Optional[Dict[str, Any]] = None

class DocumentTemplateUpdate(BaseModel):
    """Схема для обновления шаблона документа"""
    
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    document_type: Optional[str] = None
    content: Optional[str] = None
    variables: Optional[Dict[str, Any]] = None
    is_default: Optional[bool] = None
    is_active: Optional[bool] = None
    category: Optional[str] = Field(None, max_length=100)
    tags: Optional[Dict[str, Any]] = None

class DocumentBlockUpdate(BaseModel):
    """Схема для обновления блока документа"""
    
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    content: Optional[str] = None
    variables: Optional[Dict[str, Any]] = None
    block_type: Optional[str] = Field(None, max_length=100)
    is_required: Optional[bool] = None
    order_index: Optional[int] = Field(None, ge=0)
    category: Optional[str] = Field(None, max_length=100)
    tags: Optional[Dict[str, Any]] = None

# ============================================
# СХЕМЫ ОТВЕТОВ
# ============================================

class DocumentResponse(DocumentBase):
    """Схема для ответа с документом"""
    
    id: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    
    class Config:
        from_attributes = True

class DocumentTemplateResponse(DocumentTemplateBase):
    """Схема для ответа с шаблоном документа"""
    
    id: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    
    class Config:
        from_attributes = True

class DocumentBlockResponse(DocumentBlockBase):
    """Схема для ответа с блоком документа"""
    
    id: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    
    class Config:
        from_attributes = True

# ============================================
# СПИСКИ И СВОДКИ
# ============================================

class DocumentList(BaseModel):
    """Схема для списка документов с пагинацией"""
    
    documents: List[DocumentResponse]
    total: int
    skip: int
    limit: int
    
    class Config:
        from_attributes = True

class DocumentHistoryResponse(BaseModel):
    """Схема для истории изменений документа"""
    
    id: int
    document_id: int
    action: str
    field_name: Optional[str] = None
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    created_by: Optional[str] = None
    
    class Config:
        from_attributes = True

class DocumentStats(BaseModel):
    """Схема для статистики документов"""
    
    total_documents: int
    documents_by_type: Dict[str, int]
    documents_by_status: Dict[str, int]
    recent_documents: List[Dict[str, Any]]
    
    class Config:
        from_attributes = True
