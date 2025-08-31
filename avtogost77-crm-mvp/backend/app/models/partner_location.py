"""
AVTOGOST77 CRM MVP - Модель города базирования партнера
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: SQLAlchemy модель для таблицы городов базирования партнеров
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base

class PartnerLocation(Base):
    """Модель города базирования партнера"""
    
    __tablename__ = "partner_locations"
    
    # Основные поля
    id = Column(Integer, primary_key=True, index=True)
    
    # Связи
    partner_id = Column(Integer, ForeignKey("partners.id"), nullable=False, index=True)
    
    # География
    city = Column(String(100), nullable=False, index=True)
    region = Column(String(100))
    
    # Флаги
    is_main = Column(Boolean, default=False)
    
    # Временные метки
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Связи
    partner = relationship("Partner", back_populates="locations")
    
    def __repr__(self):
        return f"<PartnerLocation(id={self.id}, city='{self.city}', partner_id={self.partner_id}, is_main={self.is_main})>"
    
    @property
    def display_name(self):
        """Отображаемое имя локации"""
        if self.region and self.region != self.city:
            return f"{self.city}, {self.region}"
        return self.city
    
    @property
    def is_primary(self):
        """Проверка, является ли основным городом"""
        return self.is_main
    
    def set_as_main(self):
        """Установить как основной город"""
        # Сначала сбрасываем все остальные города этого партнера
        for location in self.partner.locations:
            location.is_main = False
        
        # Устанавливаем текущий как основной
        self.is_main = True
