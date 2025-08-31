"""
AVTOGOST77 CRM MVP - Модель заявки
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: SQLAlchemy модель для таблицы заявок
"""

from sqlalchemy import Column, Integer, String, Text, Date, Time, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

from ..database import Base

class Lead(Base):
    """Модель заявки"""
    
    __tablename__ = "leads"
    
    # Основные поля
    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String(200), nullable=False, index=True)
    client_phone = Column(String(20), nullable=False)
    client_email = Column(String(100))
    
    # Маршрут
    route_from = Column(String(100), nullable=False, index=True)
    route_to = Column(String(100), nullable=False, index=True)
    
    # Груз
    cargo_name = Column(String(200))
    cargo_weight = Column(Numeric(10, 2))
    cargo_volume = Column(Numeric(10, 2))
    cargo_packaging = Column(String(100))
    
    # Время погрузки
    loading_date = Column(Date)
    loading_time_from = Column(Time)
    loading_time_to = Column(Time)
    
    # Время выгрузки
    unloading_date = Column(Date)
    unloading_time = Column(Time)
    
    # Адреса
    loading_address = Column(Text)
    unloading_address = Column(Text)
    
    # Статус и источник
    status = Column(String(50), default="new", index=True)
    source = Column(String(50), default="website")
    
    # Финансы
    total_amount = Column(Numeric(10, 2))
    partner_cost = Column(Numeric(10, 2))
    
    # Дополнительно
    notes = Column(Text)
    
    # Временные метки
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Связи
    ratings = relationship("PartnerRating", back_populates="lead")
    
    def __repr__(self):
        return f"<Lead(id={self.id}, client='{self.client_name}', route='{self.route_from}-{self.route_to}', status='{self.status}')>"
    
    @property
    def route_display(self):
        """Отображение маршрута"""
        return f"{self.route_from} → {self.route_to}"
    
    @property
    def loading_datetime(self):
        """Полная дата и время погрузки"""
        if self.loading_date and self.loading_time_from:
            return datetime.combine(self.loading_date, self.loading_time_from)
        return None
    
    @property
    def unloading_datetime(self):
        """Полная дата и время выгрузки"""
        if self.unloading_date and self.unloading_time:
            return datetime.combine(self.unloading_date, self.unloading_time)
        return None
    
    @property
    def is_completed(self):
        """Проверка завершения заявки"""
        return self.status in ["completed", "cancelled"]
    
    @property
    def is_active(self):
        """Проверка активности заявки"""
        return self.status not in ["completed", "cancelled"]
