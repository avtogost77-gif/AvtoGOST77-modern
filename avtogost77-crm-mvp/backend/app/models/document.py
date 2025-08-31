"""
AVTOGOST77 CRM MVP - Модель документов
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: SQLAlchemy модель для системы документов и шаблонов
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from ..database import Base

class DocumentType(str, enum.Enum):
    """Типы документов"""
    CONTRACT_CLIENT = "contract_client"  # Договор с клиентом
    CONTRACT_PARTNER = "contract_partner"  # Договор с партнером
    NOTIFICATION = "notification"  # Уведомление
    ACT = "act"  # Акт
    CLAIM = "claim"  # Претензия
    REPORT = "report"  # Отчет
    INVOICE = "invoice"  # Счет
    OTHER = "other"  # Прочее

class DocumentStatus(str, enum.Enum):
    """Статусы документов"""
    DRAFT = "draft"  # Черновик
    ACTIVE = "active"  # Активный
    EXPIRED = "expired"  # Истекший
    CANCELLED = "cancelled"  # Отмененный
    ARCHIVED = "archived"  # Архивированный

class Document(Base):
    """Модель документа"""
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Основная информация
    title = Column(String(500), nullable=False, comment="Название документа")
    document_type = Column(Enum(DocumentType), nullable=False, comment="Тип документа")
    status = Column(Enum(DocumentStatus), default=DocumentStatus.DRAFT, comment="Статус документа")
    
    # Связи с другими сущностями
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=True, comment="ID заявки")
    partner_id = Column(Integer, ForeignKey("partners.id"), nullable=True, comment="ID партнера")
    client_name = Column(String(200), nullable=True, comment="Имя клиента")
    
    # Шаблон и содержимое
    template_id = Column(Integer, ForeignKey("document_templates.id"), nullable=True, comment="ID шаблона")
    content = Column(Text, nullable=True, comment="Содержимое документа (HTML)")
    variables = Column(JSON, nullable=True, comment="Переменные для подстановки")
    
    # Маршрут и даты
    route_from = Column(String(100), nullable=True, comment="Город отправления")
    route_to = Column(String(100), comment="Город назначения")
    loading_date = Column(DateTime, nullable=True, comment="Дата погрузки")
    unloading_date = Column(DateTime, nullable=True, comment="Дата выгрузки")
    
    # Финансовые условия
    total_amount = Column(Integer, nullable=True, comment="Общая сумма")
    partner_cost = Column(Integer, nullable=True, comment="Стоимость партнера")
    payment_terms = Column(String(500), nullable=True, comment="Условия оплаты")
    
    # Дополнительная информация
    notes = Column(Text, nullable=True, comment="Заметки")
    tags = Column(JSON, nullable=True, comment="Теги для поиска")
    
    # Системные поля
    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="Дата создания")
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), comment="Дата обновления")
    created_by = Column(String(100), nullable=True, comment="Кто создал")
    
    # Связи
    template = relationship("DocumentTemplate", back_populates="documents")
    lead = relationship("Lead", back_populates="documents")
    partner = relationship("Partner", back_populates="documents")
    
    def __repr__(self):
        return f"<Document(id={self.id}, title='{self.title}', type='{self.document_type}')>"
    
    @property
    def is_active(self):
        """Проверка активности документа"""
        return self.status == DocumentStatus.ACTIVE
    
    @property
    def display_title(self):
        """Отображаемое название документа"""
        return f"{self.title} ({self.document_type.value})"
    
    @property
    def route_display(self):
        """Отображение маршрута"""
        if self.route_from and self.route_to:
            return f"{self.route_from} → {self.route_to}"
        return "Маршрут не указан"

class DocumentTemplate(Base):
    """Модель шаблона документа"""
    __tablename__ = "document_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Основная информация
    name = Column(String(200), nullable=False, comment="Название шаблона")
    description = Column(Text, nullable=True, comment="Описание шаблона")
    document_type = Column(Enum(DocumentType), nullable=False, comment="Тип документа")
    
    # Содержимое шаблона
    content = Column(Text, nullable=False, comment="HTML содержимое шаблона")
    variables = Column(JSON, nullable=True, comment="Доступные переменные")
    
    # Настройки
    is_default = Column(Boolean, default=False, comment="Шаблон по умолчанию")
    is_active = Column(Boolean, default=True, comment="Активен ли шаблон")
    
    # Категории и теги
    category = Column(String(100), nullable=True, comment="Категория шаблона")
    tags = Column(JSON, nullable=True, comment="Теги для поиска")
    
    # Системные поля
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String(100), nullable=True)
    
    # Связи
    documents = relationship("Document", back_populates="template")
    
    def __repr__(self):
        return f"<DocumentTemplate(id={self.id}, name='{self.name}', type='{self.document_type}')>"
    
    @property
    def available_variables_list(self):
        """Список доступных переменных"""
        if self.variables:
            return list(self.variables.keys())
        return []

class DocumentBlock(Base):
    """Модель блока документа"""
    __tablename__ = "document_blocks"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Основная информация
    name = Column(String(200), nullable=False, comment="Название блока")
    description = Column(Text, nullable=True, comment="Описание блока")
    
    # Содержимое блока
    content = Column(Text, nullable=False, comment="HTML содержимое блока")
    variables = Column(JSON, nullable=True, comment="Переменные блока")
    
    # Тип и настройки
    block_type = Column(String(100), nullable=False, comment="Тип блока")
    is_required = Column(Boolean, default=False, comment="Обязательный ли блок")
    order_index = Column(Integer, default=0, comment="Порядок в документе")
    
    # Категории
    category = Column(String(100), nullable=True, comment="Категория блока")
    tags = Column(JSON, nullable=True, comment="Теги для поиска")
    
    # Системные поля
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String(100), nullable=True)
    
    def __repr__(self):
        return f"<DocumentBlock(id={self.id}, name='{self.name}', type='{self.block_type}')>"

class DocumentHistory(Base):
    """Модель истории изменений документа"""
    __tablename__ = "document_history"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Связь с документом
    document_id = Column(Integer, ForeignKey("documents.id"), nullable=False)
    
    # Информация об изменении
    action = Column(String(100), nullable=False, comment="Действие (create, update, delete)")
    field_name = Column(String(100), nullable=True, comment="Название измененного поля")
    old_value = Column(Text, nullable=True, comment="Старое значение")
    new_value = Column(Text, nullable=True, comment="Новое значение")
    
    # Дополнительная информация
    notes = Column(Text, nullable=True, comment="Заметки об изменении")
    
    # Системные поля
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    created_by = Column(String(100), nullable=True, comment="Кто внес изменения")
    
    # Связи
    document = relationship("Document")
    
    def __repr__(self):
        return f"<DocumentHistory(id={self.id}, document_id={self.document_id}, action='{self.action}')>"
