"""
AVTOGOST77 CRM MVP - Модель зеркальных договоров
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: SQLAlchemy модель для системы зеркальных договоров
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from ..database import Base

class ContractType(str, enum.Enum):
    """Типы договоров"""
    CLIENT_CONTRACT = "client_contract"  # Договор с клиентом
    PARTNER_CONTRACT = "partner_contract"  # Договор с партнером
    MIRROR_PAIR = "mirror_pair"  # Зеркальная пара

class ContractStatus(str, enum.Enum):
    """Статусы договоров"""
    DRAFT = "draft"  # Черновик
    ACTIVE = "active"  # Активный
    EXPIRED = "expired"  # Истекший
    TERMINATED = "terminated"  # Расторгнутый
    ARCHIVED = "archived"  # Архивированный

class Contract(Base):
    """Модель договора"""
    __tablename__ = "contracts"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Основная информация
    contract_number = Column(String(100), unique=True, nullable=False, comment="Номер договора")
    title = Column(String(500), nullable=False, comment="Название договора")
    contract_type = Column(Enum(ContractType), nullable=False, comment="Тип договора")
    status = Column(Enum(ContractStatus), default=ContractStatus.DRAFT, comment="Статус договора")
    
    # Связи с другими сущностями
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=True, comment="ID заявки")
    client_id = Column(Integer, ForeignKey("partners.id"), nullable=True, comment="ID клиента")
    partner_id = Column(Integer, ForeignKey("partners.id"), nullable=True, comment="ID партнера")
    
    # Зеркальная связь
    mirror_contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=True, comment="ID зеркального договора")
    
    # Маршрут и даты
    route_from = Column(String(100), nullable=True, comment="Город отправления")
    route_to = Column(String(100), comment="Город назначения")
    loading_date = Column(DateTime, nullable=True, comment="Дата погрузки")
    unloading_date = Column(DateTime, nullable=True, comment="Дата выгрузки")
    
    # Финансовые условия
    total_amount = Column(Float, nullable=True, comment="Общая сумма")
    partner_cost = Column(Float, nullable=True, comment="Стоимость партнера")
    payment_terms = Column(String(500), nullable=True, comment="Условия оплаты")
    payment_deadline = Column(Integer, nullable=True, comment="Срок оплаты в днях")
    
    # Условия договора
    special_conditions = Column(Text, nullable=True, comment="Особые условия")
    liability_terms = Column(Text, nullable=True, comment="Условия ответственности")
    force_majeure = Column(Text, nullable=True, comment="Форс-мажор")
    
    # Дополнительная информация
    notes = Column(Text, nullable=True, comment="Заметки")
    tags = Column(JSON, nullable=True, comment="Теги для поиска")
    
    # Системные поля
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String(100), nullable=True, comment="Кто создал")
    
    # Связи
    lead = relationship("Lead", back_populates="contracts")
    client = relationship("Partner", foreign_keys=[client_id], back_populates="client_contracts")
    partner = relationship("Partner", foreign_keys=[partner_id], back_populates="partner_contracts")
    mirror_contract = relationship("Contract", remote_side=[id], back_populates="mirror_contracts")
    mirror_contracts = relationship("Contract", back_populates="mirror_contract")
    
    def __repr__(self):
        return f"<Contract(id={self.id}, number='{self.contract_number}', type='{self.contract_type}')>"
    
    @property
    def is_mirror(self):
        """Проверка, является ли договор зеркальным"""
        return self.mirror_contract_id is not None
    
    @property
    def has_mirror(self):
        """Проверка, есть ли зеркальный договор"""
        return len(self.mirror_contracts) > 0
    
    @property
    def display_title(self):
        """Отображаемое название договора"""
        return f"{self.contract_number} - {self.title}"
    
    @property
    def route_display(self):
        """Отображение маршрута"""
        if self.route_from and self.route_to:
            return f"{self.route_from} → {self.route_to}"
        return "Маршрут не указан"
    
    @property
    def is_active(self):
        """Проверка активности договора"""
        return self.status == ContractStatus.ACTIVE

class ContractTemplate(Base):
    """Модель шаблона договора"""
    __tablename__ = "contract_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Основная информация
    name = Column(String(200), nullable=False, comment="Название шаблона")
    description = Column(Text, nullable=True, comment="Описание шаблона")
    contract_type = Column(Enum(ContractType), nullable=False, comment="Тип договора")
    
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
    
    def __repr__(self):
        return f"<ContractTemplate(id={self.id}, name='{self.name}', type='{self.contract_type}')>"
    
    @property
    def available_variables_list(self):
        """Список доступных переменных"""
        if self.variables:
            return list(self.variables.keys())
        return []

class ContractCondition(Base):
    """Модель условия договора"""
    __tablename__ = "contract_conditions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Связь с договором
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    
    # Информация об условии
    condition_type = Column(String(100), nullable=False, comment="Тип условия")
    title = Column(String(200), nullable=False, comment="Название условия")
    content = Column(Text, nullable=False, comment="Содержимое условия")
    
    # Настройки
    is_required = Column(Boolean, default=False, comment="Обязательное ли условие")
    order_index = Column(Integer, default=0, comment="Порядок в договоре")
    
    # Системные поля
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связи
    contract = relationship("Contract")
    
    def __repr__(self):
        return f"<ContractCondition(id={self.id}, contract_id={self.contract_id}, type='{self.condition_type}')>"

class ContractHistory(Base):
    """Модель истории изменений договора"""
    __tablename__ = "contract_history"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Связь с договором
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    
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
    contract = relationship("Contract")
    
    def __repr__(self):
        return f"<ContractHistory(id={self.id}, contract_id={self.contract_id}, action='{self.action}')>"
