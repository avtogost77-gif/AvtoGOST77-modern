"""
AVTOGOST77 CRM MVP - API для партнеров
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: API endpoints для управления партнерами
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from datetime import datetime
from loguru import logger

from ..database import get_db
from ..models.partner import Partner
from ..models.partner_location import PartnerLocation
from ..schemas.partner import PartnerCreate, PartnerUpdate, PartnerResponse

router = APIRouter()

@router.get("/", response_model=List[PartnerResponse])
async def get_partners(
    status: Optional[str] = Query(None, description="Фильтр по статусу"),
    company_name: Optional[str] = Query(None, description="Поиск по названию компании"),
    city: Optional[str] = Query(None, description="Фильтр по городу базирования"),
    rating_min: Optional[float] = Query(None, ge=0, le=5, description="Минимальный рейтинг"),
    skip: int = Query(0, ge=0, description="Количество записей для пропуска"),
    limit: int = Query(100, ge=1, le=1000, description="Максимальное количество записей"),
    db: Session = Depends(get_db)
):
    """
    Получить список партнеров с фильтрацией и пагинацией
    """
    try:
        query = db.query(Partner)
        
        # Применяем фильтры
        if status:
            query = query.filter(Partner.status == status)
        
        if company_name:
            query = query.filter(
                or_(
                    Partner.company_name.ilike(f"%{company_name}%"),
                    Partner.inn.ilike(f"%{company_name}%")
                )
            )
        
        if city:
            query = query.join(PartnerLocation).filter(PartnerLocation.city.ilike(f"%{city}%"))
        
        if rating_min is not None:
            query = query.filter(Partner.rating >= rating_min)
        
        # Сортировка по рейтингу (высокий сначала)
        query = query.order_by(Partner.rating.desc(), Partner.company_name)
        
        # Пагинация
        total = query.count()
        partners = query.offset(skip).limit(limit).all()
        
        logger.info(f"Получено {len(partners)} партнеров из {total}")
        
        return partners
        
    except Exception as e:
        logger.error(f"Ошибка при получении партнеров: {e}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")

@router.get("/{partner_id}", response_model=PartnerResponse)
async def get_partner(partner_id: int, db: Session = Depends(get_db)):
    """
    Получить партнера по ID
    """
    try:
        partner = db.query(Partner).filter(Partner.id == partner_id).first()
        
        if not partner:
            raise HTTPException(status_code=404, detail="Партнер не найден")
        
        logger.info(f"Получен партнер ID: {partner_id}")
        return partner
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ошибка при получении партнера {partner_id}: {e}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")

@router.post("/", response_model=PartnerResponse)
async def create_partner(partner_data: PartnerCreate, db: Session = Depends(get_db)):
    """
    Создать нового партнера
    """
    try:
        # Создаем нового партнера
        partner = Partner(**partner_data.dict())
        db.add(partner)
        db.commit()
        db.refresh(partner)
        
        logger.info(f"Создан новый партнер ID: {partner.id} - {partner.company_name}")
        
        return partner
        
    except Exception as e:
        db.rollback()
        logger.error(f"Ошибка при создании партнера: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при создании партнера")

@router.put("/{partner_id}", response_model=PartnerResponse)
async def update_partner(partner_id: int, partner_data: PartnerUpdate, db: Session = Depends(get_db)):
    """
    Обновить партнера
    """
    try:
        partner = db.query(Partner).filter(Partner.id == partner_id).first()
        
        if not partner:
            raise HTTPException(status_code=404, detail="Партнер не найден")
        
        # Обновляем поля
        for field, value in partner_data.dict(exclude_unset=True).items():
            setattr(partner, field, value)
        
        partner.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(partner)
        
        logger.info(f"Обновлен партнер ID: {partner_id}")
        
        return partner
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Ошибка при обновлении партнера {partner_id}: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при обновлении партнера")

@router.delete("/{partner_id}")
async def delete_partner(partner_id: int, db: Session = Depends(get_db)):
    """
    Удалить партнера
    """
    try:
        partner = db.query(Partner).filter(Partner.id == partner_id).first()
        
        if not partner:
            raise HTTPException(status_code=404, detail="Партнер не найден")
        
        # Удаляем партнера
        db.delete(partner)
        db.commit()
        
        logger.info(f"Удален партнер ID: {partner_id}")
        
        return {"message": "Партнер успешно удален", "partner_id": partner_id}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Ошибка при удалении партнера {partner_id}: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при удалении партнера")

@router.get("/{partner_id}/locations")
async def get_partner_locations(partner_id: int, db: Session = Depends(get_db)):
    """
    Получить города базирования партнера
    """
    try:
        partner = db.query(Partner).filter(Partner.id == partner_id).first()
        
        if not partner:
            raise HTTPException(status_code=404, detail="Партнер не найден")
        
        locations = db.query(PartnerLocation).filter(PartnerLocation.partner_id == partner_id).all()
        
        return {
            "partner_id": partner_id,
            "partner_name": partner.company_name,
            "locations": [
                {
                    "id": loc.id,
                    "city": loc.city,
                    "region": loc.region,
                    "is_main": loc.is_main
                } for loc in locations
            ]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ошибка при получении локаций партнера {partner_id}: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при получении локаций")

@router.post("/{partner_id}/locations")
async def add_partner_location(
    partner_id: int,
    city: str,
    region: Optional[str] = None,
    is_main: bool = False,
    db: Session = Depends(get_db)
):
    """
    Добавить город базирования партнеру
    """
    try:
        partner = db.query(Partner).filter(Partner.id == partner_id).first()
        
        if not partner:
            raise HTTPException(status_code=404, detail="Партнер не найден")
        
        # Если устанавливаем как основной, сбрасываем остальные
        if is_main:
            db.query(PartnerLocation).filter(PartnerLocation.partner_id == partner_id).update({"is_main": False})
        
        # Создаем новую локацию
        location = PartnerLocation(
            partner_id=partner_id,
            city=city,
            region=region,
            is_main=is_main
        )
        
        db.add(location)
        db.commit()
        db.refresh(location)
        
        logger.info(f"Добавлена локация для партнера {partner_id}: {city}")
        
        return {
            "message": "Локация добавлена",
            "location": {
                "id": location.id,
                "city": location.city,
                "region": location.region,
                "is_main": location.is_main
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Ошибка при добавлении локации партнеру {partner_id}: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при добавлении локации")

@router.get("/stats/summary")
async def get_partners_summary(db: Session = Depends(get_db)):
    """
    Получить сводную статистику по партнерам
    """
    try:
        total_partners = db.query(Partner).count()
        active_partners = db.query(Partner).filter(Partner.status == "active").count()
        
        # Статистика по рейтингам
        high_rating = db.query(Partner).filter(Partner.rating >= 4.5).count()
        medium_rating = db.query(Partner).filter(Partner.rating.between(3.5, 4.4)).count()
        low_rating = db.query(Partner).filter(Partner.rating < 3.5).count()
        
        # Статистика по статусам
        status_stats = db.query(Partner.status, db.func.count(Partner.id)).group_by(Partner.status).all()
        
        summary = {
            "total_partners": total_partners,
            "active_partners": active_partners,
            "rating_distribution": {
                "high": high_rating,
                "medium": medium_rating,
                "low": low_rating
            },
            "status_distribution": dict(status_stats)
        }
        
        logger.info(f"Получена сводная статистика по партнерам")
        
        return summary
        
    except Exception as e:
        logger.error(f"Ошибка при получении статистики партнеров: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при получении статистики")
