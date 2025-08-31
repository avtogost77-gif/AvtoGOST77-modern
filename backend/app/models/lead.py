"""
Модель заявки
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, Numeric, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

from app.core.database import Base
from app.core.config import LEAD_STATUSES


class Lead(Base):
    """
    Модель заявки
    """
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    
    # Связь с клиентом
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=True, index=True)
    
    # Статус заявки
    status = Column(Enum(*LEAD_STATUSES), default="new", nullable=False, index=True)
    
    # Маршрут
    route_from = Column(String(100), nullable=False, index=True)
    route_to = Column(String(100), nullable=False, index=True)
    
    # Характеристики груза
    cargo_weight = Column(Numeric(10, 2), nullable=True)  # кг
    cargo_volume = Column(Numeric(10, 2), nullable=True)  # м³
    cargo_type = Column(String(100), nullable=True)
    cargo_description = Column(Text, nullable=True)
    
    # Цена
    price = Column(Numeric(10, 2), nullable=True)
    price_currency = Column(String(3), default="RUB", nullable=False)
    
    # Дополнительные параметры
    is_consolidated = Column(Boolean, default=False, nullable=False)  # Сборный груз
    is_urgent = Column(Boolean, default=False, nullable=False)  # Срочная доставка
    
    # Время доставки
    delivery_time = Column(String(50), nullable=True)  # "1-2 дня"
    distance = Column(Numeric(10, 2), nullable=True)  # км
    
    # Комментарии
    comments = Column(Text, nullable=True)
    
    # Источник заявки
    source = Column(String(50), default="website", nullable=False, index=True)
    
    # Временные метки
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Время изменения статуса
    status_changed_at = Column(DateTime(timezone=True), nullable=True)

    # Связи
    client = relationship("Client", back_populates="leads")
    contracts = relationship("Contract", back_populates="lead")

    def __repr__(self):
        return f"<Lead(id={self.id}, status='{self.status}', route='{self.route_from} → {self.route_to}')>"

    @property
    def display_route(self):
        """
        Отображаемый маршрут
        """
        return f"{self.route_from} → {self.route_to}"

    @property
    def display_cargo(self):
        """
        Отображаемые характеристики груза
        """
        parts = []
        if self.cargo_weight:
            parts.append(f"{self.cargo_weight} кг")
        if self.cargo_volume:
            parts.append(f"{self.cargo_volume} м³")
        if self.cargo_type:
            parts.append(self.cargo_type)
        
        return ", ".join(parts) if parts else "Не указано"

    @property
    def display_price(self):
        """
        Отображаемая цена
        """
        if self.price:
            return f"{self.price:,.0f} ₽"
        return "Не рассчитана"

    @property
    def is_new(self):
        """
        Является ли заявка новой
        """
        return self.status == "new"

    @property
    def is_completed(self):
        """
        Завершена ли заявка
        """
        return self.status in ["completed", "cancelled"]

    def to_dict(self):
        """
        Преобразование в словарь
        """
        return {
            "id": self.id,
            "client_id": self.client_id,
            "status": self.status,
            "route_from": self.route_from,
            "route_to": self.route_to,
            "display_route": self.display_route,
            "cargo_weight": float(self.cargo_weight) if self.cargo_weight else None,
            "cargo_volume": float(self.cargo_volume) if self.cargo_volume else None,
            "cargo_type": self.cargo_type,
            "cargo_description": self.cargo_description,
            "display_cargo": self.display_cargo,
            "price": float(self.price) if self.price else None,
            "price_currency": self.price_currency,
            "display_price": self.display_price,
            "is_consolidated": self.is_consolidated,
            "is_urgent": self.is_urgent,
            "delivery_time": self.delivery_time,
            "distance": float(self.distance) if self.distance else None,
            "comments": self.comments,
            "source": self.source,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "status_changed_at": self.status_changed_at.isoformat() if self.status_changed_at else None,
            "is_new": self.is_new,
            "is_completed": self.is_completed,
            "client": self.client.to_dict() if self.client else None
        }
