"""
AVTOGOST77 CRM MVP - API для заявок
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: API endpoints для управления заявками (CRUD)
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from datetime import date, datetime
from loguru import logger

from ..database import get_db
from ..models.lead import Lead
from ..schemas.lead import LeadCreate, LeadUpdate, LeadResponse, LeadList

router = APIRouter()

@router.get("/", response_model=List[LeadResponse])
async def get_leads(
    status: Optional[str] = Query(None, description="Фильтр по статусу"),
    client_name: Optional[str] = Query(None, description="Поиск по имени клиента"),
    route_from: Optional[str] = Query(None, description="Фильтр по городу отправления"),
    route_to: Optional[str] = Query(None, description="Фильтр по городу назначения"),
    skip: int = Query(0, ge=0, description="Количество записей для пропуска"),
    limit: int = Query(100, ge=1, le=1000, description="Максимальное количество записей"),
    db: Session = Depends(get_db)
):
    """
    Получить список заявок с фильтрацией и пагинацией
    """
    try:
        query = db.query(Lead)
        
        # Применяем фильтры
        if status:
            query = query.filter(Lead.status == status)
        
        if client_name:
            query = query.filter(
                or_(
                    Lead.client_name.ilike(f"%{client_name}%"),
                    Lead.client_phone.ilike(f"%{client_name}%")
                )
            )
        
        if route_from:
            query = query.filter(Lead.route_from.ilike(f"%{route_from}%"))
        
        if route_to:
            query = query.filter(Lead.route_to.ilike(f"%{route_to}%"))
        
        # Сортировка по дате создания (новые сначала)
        query = query.order_by(Lead.created_at.desc())
        
        # Пагинация
        total = query.count()
        leads = query.offset(skip).limit(limit).all()
        
        logger.info(f"Получено {len(leads)} заявок из {total}")
        
        return leads
        
    except Exception as e:
        logger.error(f"Ошибка при получении заявок: {e}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")

@router.get("/{lead_id}", response_model=LeadResponse)
async def get_lead(lead_id: int, db: Session = Depends(get_db)):
    """
    Получить заявку по ID
    """
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        
        if not lead:
            raise HTTPException(status_code=404, detail="Заявка не найдена")
        
        logger.info(f"Получена заявка ID: {lead_id}")
        return lead
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ошибка при получении заявки {lead_id}: {e}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")

@router.post("/", response_model=LeadResponse)
async def create_lead(lead_data: LeadCreate, db: Session = Depends(get_db)):
    """
    Создать новую заявку
    """
    try:
        # Создаем новую заявку
        lead = Lead(**lead_data.dict())
        db.add(lead)
        db.commit()
        db.refresh(lead)
        
        logger.info(f"Создана новая заявка ID: {lead.id} для клиента: {lead.client_name}")
        
        return lead
        
    except Exception as e:
        db.rollback()
        logger.error(f"Ошибка при создании заявки: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при создании заявки")

@router.put("/{lead_id}", response_model=LeadResponse)
async def update_lead(lead_id: int, lead_data: LeadUpdate, db: Session = Depends(get_db)):
    """
    Обновить заявку
    """
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        
        if not lead:
            raise HTTPException(status_code=404, detail="Заявка не найдена")
        
        # Обновляем поля
        for field, value in lead_data.dict(exclude_unset=True).items():
            setattr(lead, field, value)
        
        lead.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(lead)
        
        logger.info(f"Обновлена заявка ID: {lead_id}")
        
        return lead
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Ошибка при обновлении заявки {lead_id}: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при обновлении заявки")

@router.patch("/{lead_id}/status")
async def update_lead_status(
    lead_id: int, 
    status: str, 
    db: Session = Depends(get_db)
):
    """
    Изменить статус заявки
    """
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        
        if not lead:
            raise HTTPException(status_code=404, detail="Заявка не найдена")
        
        # Проверяем валидность статуса
        valid_statuses = ["new", "processing", "partner_search", "partner_found", "in_progress", "completed", "cancelled", "conflict"]
        if status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Неверный статус. Допустимые: {', '.join(valid_statuses)}")
        
        # Обновляем статус
        old_status = lead.status
        lead.status = status
        lead.updated_at = datetime.utcnow()
        
        db.commit()
        
        logger.info(f"Изменен статус заявки {lead_id}: {old_status} → {status}")
        
        return {"message": f"Статус заявки изменен на: {status}", "lead_id": lead_id, "new_status": status}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Ошибка при изменении статуса заявки {lead_id}: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при изменении статуса")

@router.delete("/{lead_id}")
async def delete_lead(lead_id: int, db: Session = Depends(get_db)):
    """
    Удалить заявку
    """
    try:
        lead = db.query(Lead).filter(Lead.id == lead_id).first()
        
        if not lead:
            raise HTTPException(status_code=404, detail="Заявка не найдена")
        
        # Удаляем заявку
        db.delete(lead)
        db.commit()
        
        logger.info(f"Удалена заявка ID: {lead_id}")
        
        return {"message": "Заявка успешно удалена", "lead_id": lead_id}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(f"Ошибка при удалении заявки {lead_id}: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при удалении заявки")

@router.get("/stats/summary")
async def get_leads_summary(db: Session = Depends(get_db)):
    """
    Получить сводную статистику по заявкам
    """
    try:
        total_leads = db.query(Lead).count()
        new_leads = db.query(Lead).filter(Lead.status == "new").count()
        processing_leads = db.query(Lead).filter(Lead.status == "processing").count()
        completed_leads = db.query(Lead).filter(Lead.status == "completed").count()
        
        # Статистика по статусам
        status_stats = db.query(Lead.status, db.func.count(Lead.id)).group_by(Lead.status).all()
        
        summary = {
            "total_leads": total_leads,
            "new_leads": new_leads,
            "processing_leads": processing_leads,
            "completed_leads": completed_leads,
            "status_distribution": dict(status_stats)
        }
        
        logger.info(f"Получена сводная статистика по заявкам")
        
        return summary
        
    except Exception as e:
        logger.error(f"Ошибка при получении статистики заявок: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при получении статистики")
