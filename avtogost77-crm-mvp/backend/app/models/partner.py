"""
AVTOGOST77 CRM MVP - Модель партнера
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: SQLAlchemy модель для таблицы партнеров
"""

from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base

class Partner(Base):
    """Модель партнера-перевозчика"""
    
    __tablename__ = "partners"
    
    # Основные поля
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(200), nullable=False, index=True)
    
    # Реквизиты
    inn = Column(String(12))
    kpp = Column(String(9))
    legal_address = Column(Text)
    actual_address = Column(Text)
    bank_details = Column(Text)
    
    # Контакты
    contact_person = Column(String(100))
    phone = Column(String(20))
    email = Column(String(100))
    
    # Рейтинг и статус
    rating = Column(Numeric(3, 2), default=0, index=True)
    status = Column(String(20), default="active", index=True)
    
    # Дополнительно
    notes = Column(Text)
    
    # Временные метки
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Связи
    locations = relationship("PartnerLocation", back_populates="partner", cascade="all, delete-orphan")
    ratings = relationship("PartnerRating", back_populates="partner", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Partner(id={self.id}, company='{self.company_name}', rating={self.rating}, status='{self.status}')>"
    
    @property
    def display_name(self):
        """Отображаемое имя"""
        return self.company_name or f"Партнер #{self.id}"
    
    @property
    def is_active(self):
        """Проверка активности партнера"""
        return self.status == "active"
    
    @property
    def rating_stars(self):
        """Рейтинг в звездах"""
        if not self.rating:
            return "☆☆☆☆☆"
        
        rating_int = int(self.rating)
        stars = "★" * rating_int + "☆" * (5 - rating_int)
        return stars
    
    @property
    def main_location(self):
        """Основной город базирования"""
        main_loc = next((loc for loc in self.locations if loc.is_main), None)
        return main_loc.city if main_loc else "Не указан"
    
    @property
    def all_locations(self):
        """Все города базирования"""
        return [loc.city for loc in self.locations]
    
    def update_rating(self):
        """Обновление среднего рейтинга"""
        if self.ratings:
            total_rating = sum(r.overall_rating for r in self.ratings if r.overall_rating)
            count = len([r for r in self.ratings if r.overall_rating])
            if count > 0:
                self.rating = total_rating / count
            else:
                self.rating = 0
        else:
            self.rating = 0
