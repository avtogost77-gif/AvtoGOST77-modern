"""
AVTOGOST77 CRM MVP - API для рейтингов партнеров
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: API endpoints для управления рейтингами партнеров
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from loguru import logger

from ..database import get_db
from ..models.partner_rating import PartnerRating
from ..models.partner import Partner
from ..models.lead import Lead
from ..schemas.rating import RatingCreate, RatingResponse

router = APIRouter()

@router.get("/", response_model=List[RatingResponse])
async def get_ratings(
    partner_id: Optional[int] = Query(None, description="Фильтр по ID партнера"),
    lead_id: Optional[int] = Query(None, description="Фильтр по ID заявки"),
    rating_min: Optional[int] = Query(None, ge=1, le=5, description="Минимальный рейтинг"),
    comment_type: Optional[str] = Query(None, description="Фильтр по типу комментария"),
    skip: int = Query(0, ge=0, description="Количество записей для пропуска"),
    limit: int = Query(100, ge=1, le=1000, description="Максимальное количество записей"),
    db: Session = Depends(get_db)
):
    """
    Получить список рейтингов с фильтрацией и пагинацией
    """
    try:
        query = db.query(PartnerRating)
        
        # Применяем фильтры
        if partner_id:
            query = query.filter(PartnerRating.partner_id == partner_id)
        
        if lead_id:
            query = query.filter(PartnerRating.lead_id == lead_id)
        
        if rating_min:
            query = query.filter(PartnerRating.overall_rating >= rating_min)
        
        if comment_type:
            query = query.filter(PartnerRating.comment_type == comment_type)
        
        # Сортировка по дате создания (новые сначала)
        query = query.order_by(PartnerRating.created_at.desc())
        
        # Пагинация
        total = query.count()
        ratings = query.offset(skip).limit(limit).all()
        
        logger.info(f"Получено {len(ratings)} рейтингов из {total}")
        
        return ratings
        
    except Exception as e:
        logger.error(f"Ошибка при получении рейтингов: {e}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")

@router.get("/{rating_id}", response_model=RatingResponse)
async def get_rating(rating_id: int, db: Session = Depends(get_db)):
    """
    Получить рейтинг по ID
    """
    try:
        rating = db.query(PartnerRating).filter(PartnerRating.id == rating_id).first()
        
        if not rating:
            raise HTTPException(status_code=404, detail="Рейтинг не найден")
        
        logger.info(f"Получен рейтинг ID: {rating_id}")
        return rating
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ошибка при получении рейтинга {rating_id}: {e}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")

@router.post("/", response_model=RatingResponse)
async def create_rating(rating_data: RatingCreate, db: Session = Depends(get_db)):
    """
    Создать новый рейтинг партнера
    """
    try:
        # Проверяем существование партнера
        partner = db.query(Partner).filter(Partner.id == rating_data.partner_id).first()
        if not partner:
            raise HTTPException(status_code=404, detail="Партнер не найден")
        
        # Проверяем существование заявки (если указана)
        if rating_data.lead_id:
            lead = db.query(Lead).filter(Lead.id == rating_data.lead_id).first()
            if not lead:
                raise HTTPException(status_code=404, detail="Заявка не найдена")
        
        # Создаем новый рейтинг
        rating = PartnerRating(**rating_data.dict())
        
        # Автоматически рассчитываем общий рейтинг
        rating.calculate_overall_rating()
        
        db.add(rating)
        db.commit()
        db.refresh(rating)
        
        # Обновляем средний рейтинг партнера
        partner.update_rating()
        db.commit()
        
        logger.info(f"Создан новый рейтинг ID: {rating.id} для партнера {rating.partner_id}")
        
        return rating
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Ошибка при создании рейтинга: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при создании рейтинга")

@router.get("/partner/{partner_id}/summary")
async def get_partner_rating_summary(partner_id: int, db: Session = Depends(get_db)):
    """
    Получить сводку по рейтингам партнера
    """
    try:
        partner = db.query(Partner).filter(Partner.id == partner_id).first()
        if not partner:
            raise HTTPException(status_code=404, detail="Партнер не найден")
        
        ratings = db.query(PartnerRating).filter(PartnerRating.partner_id == partner_id).all()
        
        if not ratings:
            return {
                "partner_id": partner_id,
                "partner_name": partner.company_name,
                "total_ratings": 0,
                "average_rating": 0,
                "rating_distribution": {},
                "comment_types": {}
            }
        
        # Статистика по рейтингам
        total_ratings = len(ratings)
        average_rating = sum(r.overall_rating for r in ratings if r.overall_rating) / total_ratings
        
        # Распределение по звездам
        rating_distribution = {}
        for i in range(1, 6):
            count = len([r for r in ratings if r.overall_rating == i])
            rating_distribution[f"{i}_star"] = count
        
        # Распределение по типам комментариев
        comment_types = {}
        for rating in ratings:
            if rating.comment_type:
                comment_types[rating.comment_type] = comment_types.get(rating.comment_type, 0) + 1
        
        # Детальная статистика
        detailed_stats = {
            "punctuality": sum(r.punctuality for r in ratings if r.punctuality) / len([r for r in ratings if r.punctuality]),
            "quality": sum(r.quality for r in ratings if r.quality) / len([r for r in ratings if r.quality]),
            "price": sum(r.price for r in ratings if r.price) / len([r for r in ratings if r.price]),
            "communication": sum(r.communication for r in ratings if r.communication) / len([r for r in ratings if r.communication])
        }
        
        summary = {
            "partner_id": partner_id,
            "partner_name": partner.company_name,
            "total_ratings": total_ratings,
            "average_rating": round(average_rating, 2),
            "rating_distribution": rating_distribution,
            "comment_types": comment_types,
            "detailed_stats": detailed_stats
        }
        
        logger.info(f"Получена сводка по рейтингам партнера {partner_id}")
        
        return summary
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ошибка при получении сводки рейтингов партнера {partner_id}: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при получении сводки")

@router.get("/stats/comment-types")
async def get_comment_types_stats(db: Session = Depends(get_db)):
    """
    Получить статистику по типам комментариев
    """
    try:
        # Получаем все типы комментариев и их количество
        comment_stats = db.query(
            PartnerRating.comment_type,
            db.func.count(PartnerRating.id)
        ).filter(PartnerRating.comment_type.isnot(None)).group_by(PartnerRating.comment_type).all()
        
        # Преобразуем в словарь
        stats = dict(comment_stats)
        
        # Добавляем общее количество рейтингов
        total_ratings = db.query(PartnerRating).count()
        
        result = {
            "total_ratings": total_ratings,
            "comment_types": stats,
            "comment_types_with_percentages": {
                comment_type: {
                    "count": count,
                    "percentage": round((count / total_ratings) * 100, 2) if total_ratings > 0 else 0
                }
                for comment_type, count in stats.items()
            }
        }
        
        logger.info("Получена статистика по типам комментариев")
        
        return result
        
    except Exception as e:
        logger.error(f"Ошибка при получении статистики комментариев: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при получении статистики")
