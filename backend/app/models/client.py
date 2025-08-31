"""
Модель клиента
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, Enum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime

from app.core.database import Base
from app.core.config import CLIENT_TYPES


class Client(Base):
    """
    Модель клиента
    """
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    
    # Основная информация
    name = Column(String(200), nullable=False, index=True)
    phone = Column(String(20), nullable=False, unique=True, index=True)
    email = Column(String(100), nullable=True, index=True)
    type = Column(Enum(*CLIENT_TYPES), default="individual", nullable=False, index=True)
    
    # Информация о компании (для ИП/ООО)
    company_name = Column(String(200), nullable=True)
    inn = Column(String(12), nullable=True, index=True)
    address = Column(Text, nullable=True)
    
    # Дополнительная информация
    notes = Column(Text, nullable=True)
    
    # Временные метки
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Связи
    leads = relationship("Lead", back_populates="client")
    contracts = relationship("Contract", back_populates="client")

    def __repr__(self):
        return f"<Client(id={self.id}, name='{self.name}', phone='{self.phone}')>"

    @property
    def display_name(self):
        """
        Отображаемое имя клиента
        """
        if self.type == "individual":
            return self.name
        elif self.type == "entrepreneur":
            return f"ИП {self.name}"
        else:
            return self.company_name or self.name

    @property
    def is_legal_entity(self):
        """
        Является ли юридическим лицом
        """
        return self.type in ["entrepreneur", "company"]

    def to_dict(self):
        """
        Преобразование в словарь
        """
        return {
            "id": self.id,
            "name": self.name,
            "phone": self.phone,
            "email": self.email,
            "type": self.type,
            "company_name": self.company_name,
            "inn": self.inn,
            "address": self.address,
            "notes": self.notes,
            "display_name": self.display_name,
            "is_legal_entity": self.is_legal_entity,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
