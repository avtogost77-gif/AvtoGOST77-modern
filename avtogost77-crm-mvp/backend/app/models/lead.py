"""
AVTOGOST77 CRM MVP - Модель заявки
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: SQLAlchemy модель для заявок клиентов
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

from ..database import Base

class Lead(Base):
    """Модель заявки клиента"""
    __tablename__ = "leads"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Информация о клиенте
    client_name = Column(String(200), nullable=False, comment="Имя клиента")
    client_phone = Column(String(20), nullable=False, comment="Телефон клиента")
    client_email = Column(String(100), nullable=True, comment="Email клиента")
    
    # Маршрут
    route_from = Column(String(100), nullable=False, comment="Город отправления")
    route_to = Column(String(100), nullable=False, comment="Город назначения")
    
    # Информация о грузе
    cargo_name = Column(String(200), nullable=True, comment="Наименование груза")
    cargo_weight = Column(Float, nullable=True, comment="Вес груза в кг")
    cargo_volume = Column(Float, nullable=True, comment="Объем груза")
    cargo_packaging = Column(String(100), nullable=True, comment="Упаковка груза")
    
    # Даты и время
    loading_date = Column(DateTime, nullable=True, comment="Дата погрузки")
    loading_time_from = Column(DateTime, nullable=True, comment="Время начала погрузки")
    loading_time_to = Column(DateTime, nullable=True, comment="Время окончания погрузки")
    
    unloading_date = Column(DateTime, nullable=True, comment="Дата выгрузки")
    unloading_time = Column(DateTime, nullable=True, comment="Время выгрузки")
    
    # Адреса
    loading_address = Column(Text, nullable=True, comment="Адрес погрузки")
    unloading_address = Column(Text, nullable=True, comment="Адрес выгрузки")
    
    # Финансы
    total_amount = Column(Float, nullable=True, comment="Общая стоимость")
    partner_cost = Column(Float, nullable=True, comment="Стоимость партнера")
    
    # Статус и источник
    status = Column(String(50), default="new", comment="Статус заявки")
    source = Column(String(50), default="website", comment="Источник заявки")
    
    # Дополнительная информация
    notes = Column(Text, nullable=True, comment="Дополнительные заметки")
    tags = Column(JSON, nullable=True, comment="Теги для поиска")
    
    # Системные поля
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связи
    documents = relationship("Document", back_populates="lead")
    contracts = relationship("Contract", back_populates="lead")
    ratings = relationship("PartnerRating", back_populates="lead")
    
    def __repr__(self):
        return f"<Lead(id={self.id}, client='{self.client_name}', route='{self.route_from}→{self.route_to}')>"
    
    @property
    def is_active(self):
        """Проверка активности заявки"""
        return self.status not in ["completed", "cancelled"]
    
    @property
    def route_display(self):
        """Отображение маршрута"""
        return f"{self.route_from} → {self.route_to}"
    
    @property
    def cargo_info(self):
        """Информация о грузе"""
        info = []
        if self.cargo_name:
            info.append(self.cargo_name)
        if self.cargo_weight:
            info.append(f"{self.cargo_weight} кг")
        if self.cargo_volume:
            info.append(f"{self.cargo_volume} м³")
        return " | ".join(info) if info else "Груз не указан"
    
    @property
    def loading_info(self):
        """Информация о погрузке"""
        if self.loading_date:
            date_str = self.loading_date.strftime("%d.%m.%Y")
            if self.loading_time_from and self.loading_time_to:
                time_from = self.loading_time_from.strftime("%H:%M")
                time_to = self.loading_time_to.strftime("%H:%M")
                return f"{date_str} {time_from}-{time_to}"
            return date_str
        return "Дата не указана"
    
    @property
    def unloading_info(self):
        """Информация о выгрузке"""
        if self.unloading_date:
            date_str = self.unloading_date.strftime("%d.%m.%Y")
            if self.unloading_time:
                time_str = self.unloading_time.strftime("%H:%M")
                return f"{date_str} {time_str}"
            return date_str
        return "Дата не указана"
    
    @property
    def financial_info(self):
        """Финансовая информация"""
        info = []
        if self.total_amount:
            info.append(f"Сумма: {self.total_amount} ₽")
        if self.partner_cost:
            info.append(f"Партнер: {self.partner_cost} ₽")
        return " | ".join(info) if info else "Финансы не указаны"
