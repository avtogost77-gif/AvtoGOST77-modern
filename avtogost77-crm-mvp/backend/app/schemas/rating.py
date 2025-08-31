"""
AVTOGOST77 CRM MVP - Pydantic схемы для рейтингов
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Схемы валидации данных для API рейтингов
"""

from pydantic import BaseModel, Field, validator
from typing import Optional
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
    
    @validator('comment_type')
    def validate_comment_type(cls, v):
        """Валидация типа комментария"""
        if v:
            valid_types = [
                'good', 'average', 'conflict', 'fast', 'slow', 
                'expensive', 'cheap', 'large_volumes', 'small_cargo', 
                'intercity', 'local'
            ]
            if v not in valid_types:
                raise ValueError(f'Неверный тип комментария. Допустимые: {", ".join(valid_types)}')
        return v
    
    @validator('overall_rating')
    def validate_overall_rating(cls, v, values):
        """Валидация общего рейтинга"""
        if v is None:
            # Автоматически рассчитываем общий рейтинг
            detailed_ratings = [
                values.get('punctuality'),
                values.get('quality'),
                values.get('price'),
                values.get('communication')
            ]
            valid_ratings = [r for r in detailed_ratings if r is not None]
            
            if valid_ratings:
                return round(sum(valid_ratings) / len(valid_ratings))
        
        return v

class RatingCreate(RatingBase):
    """Схема для создания рейтинга"""
    pass

class RatingResponse(RatingBase):
    """Схема для ответа с рейтингом"""
    
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class RatingSummary(BaseModel):
    """Схема для сводки по рейтингам"""
    
    partner_id: int
    partner_name: str
    total_ratings: int
    average_rating: float
    rating_distribution: dict
    comment_types: dict
    detailed_stats: dict
    
    class Config:
        from_attributes = True
