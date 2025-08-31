"""
AVTOGOST77 CRM MVP - Pydantic схемы для рейтингов
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Схемы валидации данных для API рейтингов
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, List
from datetime import datetime

class RatingBase(BaseModel):
    """Базовая схема рейтинга"""
    
    partner_id: int = Field(..., description="ID партнера")
    lead_id: Optional[int] = Field(None, description="ID заявки")
    
    punctuality: Optional[int] = Field(None, ge=1, le=5, description="Пунктуальность (1-5)")
    quality: Optional[int] = Field(None, ge=1, le=5, description="Качество услуг (1-5)")
    price: Optional[int] = Field(None, ge=1, le=5, description="Цена (1-5)")
    communication: Optional[int] = Field(None, ge=1, le=5, description="Коммуникация (1-5)")
    overall_rating: Optional[int] = Field(None, ge=1, le=5, description="Общий рейтинг (1-5)")
    
    comment_type: Optional[str] = Field(None, description="Тип комментария")
    custom_comment: Optional[str] = Field(None, description="Кастомный комментарий")

class RatingCreate(RatingBase):
    """Схема для создания рейтинга"""
    pass

class PartnerRatingCreate(RatingBase):
    """Схема для создания рейтинга партнера"""
    pass

class PartnerRatingUpdate(BaseModel):
    """Схема для обновления рейтинга партнера"""
    
    punctuality: Optional[int] = Field(None, ge=1, le=5)
    quality: Optional[int] = Field(None, ge=1, le=5)
    price: Optional[int] = Field(None, ge=1, le=5)
    communication: Optional[int] = Field(None, ge=1, le=5)
    overall_rating: Optional[int] = Field(None, ge=1, le=5)
    comment_type: Optional[str] = None
    custom_comment: Optional[str] = None

class PartnerRatingResponse(RatingBase):
    """Схема для ответа с рейтингом партнера"""
    
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class RatingResponse(RatingBase):
    """Схема для ответа с рейтингом"""
    
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class RatingSummary(BaseModel):
    """Схема для сводки по рейтингам"""
    
    partner_id: int
    partner_name: str
    total_ratings: int
    average_rating: float
    rating_distribution: Dict[str, int]
    comment_types: Dict[str, int]
    detailed_stats: Dict[str, float]
    
    class Config:
        from_attributes = True

class PartnerRatingList(BaseModel):
    """Схема для списка рейтингов"""
    
    ratings: List[PartnerRatingResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
