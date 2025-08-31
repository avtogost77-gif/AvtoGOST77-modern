"""
Модель договора
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, Numeric, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

from app.core.database import Base
from app.core.config import CONTRACT_STATUSES


class Contract(Base):
    """
    Модель договора
    """
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    
    # Связи
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=True, index=True)
    
    # Основная информация
    contract_number = Column(String(50), nullable=False, unique=True, index=True)
    status = Column(Enum(*CONTRACT_STATUSES), default="draft", nullable=False, index=True)
    
    # Условия договора
    total_amount = Column(Numeric(10, 2), nullable=False)
    currency = Column(String(3), default="RUB", nullable=False)
    
    # Маршрут
    route_from = Column(String(100), nullable=False)
    route_to = Column(String(100), nullable=False)
    
    # Характеристики груза
    cargo_weight = Column(Numeric(10, 2), nullable=True)  # кг
    cargo_volume = Column(Numeric(10, 2), nullable=True)  # м³
    cargo_type = Column(String(100), nullable=True)
    cargo_description = Column(Text, nullable=True)
    
    # Условия доставки
    delivery_time = Column(String(50), nullable=True)  # "1-2 дня"
    is_urgent = Column(Boolean, default=False, nullable=False)
    is_consolidated = Column(Boolean, default=False, nullable=False)
    
    # Дополнительная информация
    special_conditions = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Временные метки
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    signed_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Связи
    client = relationship("Client", back_populates="contracts")
    lead = relationship("Lead", back_populates="contracts")

    def __repr__(self):
        return f"<Contract(id={self.id}, number='{self.contract_number}', status='{self.status}')>"

    @property
    def display_route(self):
        """
        Отображаемый маршрут
        """
        return f"{self.route_from} → {self.route_to}"

    @property
    def display_amount(self):
        """
        Отображаемая сумма
        """
        return f"{self.total_amount:,.0f} {self.currency}"

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
    def is_signed(self):
        """
        Подписан ли договор
        """
        return self.status == "signed"

    @property
    def is_completed(self):
        """
        Завершен ли договор
        """
        return self.status == "completed"

    def to_dict(self):
        """
        Преобразование в словарь
        """
        return {
            "id": self.id,
            "client_id": self.client_id,
            "lead_id": self.lead_id,
            "contract_number": self.contract_number,
            "status": self.status,
            "total_amount": float(self.total_amount) if self.total_amount else None,
            "currency": self.currency,
            "display_amount": self.display_amount,
            "route_from": self.route_from,
            "route_to": self.route_to,
            "display_route": self.display_route,
            "cargo_weight": float(self.cargo_weight) if self.cargo_weight else None,
            "cargo_volume": float(self.cargo_volume) if self.cargo_volume else None,
            "cargo_type": self.cargo_type,
            "cargo_description": self.cargo_description,
            "display_cargo": self.display_cargo,
            "delivery_time": self.delivery_time,
            "is_urgent": self.is_urgent,
            "is_consolidated": self.is_consolidated,
            "special_conditions": self.special_conditions,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "signed_at": self.signed_at.isoformat() if self.signed_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "is_signed": self.is_signed,
            "is_completed": self.is_completed,
            "client": self.client.to_dict() if self.client else None,
            "lead": self.lead.to_dict() if self.lead else None
        }
