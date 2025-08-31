"""
AVTOGOST77 CRM MVP - Модель рейтинга партнера
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: SQLAlchemy модель для таблицы рейтингов партнеров
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base

class PartnerRating(Base):
    """Модель рейтинга партнера"""
    
    __tablename__ = "partner_ratings"
    
    # Основные поля
    id = Column(Integer, primary_key=True, index=True)
    
    # Связи
    partner_id = Column(Integer, ForeignKey("partners.id"), nullable=False, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"), nullable=True, index=True)
    
    # Детальные оценки
    punctuality = Column(Integer, CheckConstraint("punctuality BETWEEN 1 AND 5"))
    quality = Column(Integer, CheckConstraint("quality BETWEEN 1 AND 5"))
    price = Column(Integer, CheckConstraint("price BETWEEN 1 AND 5"))
    communication = Column(Integer, CheckConstraint("communication BETWEEN 1 AND 5"))
    overall_rating = Column(Integer, CheckConstraint("overall_rating BETWEEN 1 AND 5"), index=True)
    
    # Комментарии
    comment_type = Column(String(50))  # good, average, conflict, fast, slow, etc.
    custom_comment = Column(Text)
    
    # Временные метки
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Связи
    partner = relationship("Partner", back_populates="ratings")
    lead = relationship("Lead", back_populates="ratings")
    
    def __repr__(self):
        return f"<PartnerRating(id={self.id}, partner_id={self.partner_id}, rating={self.overall_rating})>"
    
    @property
    def comment_type_display(self):
        """Отображаемый тип комментария"""
        comment_types = {
            'good': 'Хороший партнер',
            'average': 'Средний',
            'conflict': 'Конфликтный',
            'fast': 'Быстрый',
            'slow': 'Долгий',
            'expensive': 'Дорогой',
            'cheap': 'Дешевый',
            'large_volumes': 'Большие объемы',
            'small_cargo': 'Мелкие грузы',
            'intercity': 'Междугородние',
            'local': 'Городские'
        }
        return comment_types.get(self.comment_type, self.comment_type or 'Без комментария')
    
    @property
    def average_detailed_rating(self):
        """Средний детальный рейтинг"""
        ratings = [r for r in [self.punctuality, self.quality, self.price, self.communication] if r]
        if ratings:
            return sum(ratings) / len(ratings)
        return 0
    
    @property
    def rating_summary(self):
        """Сводка по рейтингу"""
        return {
            'punctuality': self.punctuality or 0,
            'quality': self.quality or 0,
            'price': self.price or 0,
            'communication': self.communication or 0,
            'overall': self.overall_rating or 0,
            'average': self.average_detailed_rating
        }
    
    def calculate_overall_rating(self):
        """Автоматический расчет общего рейтинга"""
        detailed_ratings = [r for r in [self.punctuality, self.quality, self.price, self.communication] if r]
        if detailed_ratings:
            self.overall_rating = round(sum(detailed_ratings) / len(detailed_ratings))
        else:
            self.overall_rating = 0
