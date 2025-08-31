"""
AVTOGOST77 CRM MVP - API для документов
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: FastAPI роутер для управления документами и шаблонами
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
import json

from ..database import get_db
from ..models.document import Document, DocumentTemplate, DocumentBlock, DocumentHistory, DocumentType, DocumentStatus
from ..schemas.document import (
    DocumentCreate, DocumentUpdate, DocumentResponse, DocumentList,
    DocumentTemplateCreate, DocumentTemplateUpdate, DocumentTemplateResponse,
    DocumentBlockCreate, DocumentBlockUpdate, DocumentBlockResponse
)

router = APIRouter()

# ============================================
# ДОКУМЕНТЫ
# ============================================

@router.get("/", response_model=DocumentList)
async def get_documents(
    skip: int = Query(0, ge=0, description="Количество записей для пропуска"),
    limit: int = Query(100, ge=1, le=1000, description="Максимальное количество записей"),
    document_type: Optional[DocumentType] = Query(None, description="Фильтр по типу документа"),
    status: Optional[DocumentStatus] = Query(None, description="Фильтр по статусу"),
    lead_id: Optional[int] = Query(None, description="Фильтр по ID заявки"),
    partner_id: Optional[int] = Query(None, description="Фильтр по ID партнера"),
    search: Optional[str] = Query(None, description="Поиск по названию"),
    db: Session = Depends(get_db)
):
    """Получение списка документов с фильтрацией"""
    try:
        query = db.query(Document)
        
        # Применяем фильтры
        if document_type:
            query = query.filter(Document.document_type == document_type)
        if status:
            query = query.filter(Document.status == status)
        if lead_id:
            query = query.filter(Document.lead_id == lead_id)
        if partner_id:
            query = query.filter(Document.partner_id == partner_id)
        if search:
            query = query.filter(
                or_(
                    Document.title.ilike(f"%{search}%"),
                    Document.client_name.ilike(f"%{search}%"),
                    Document.notes.ilike(f"%{search}%")
                )
            )
        
        # Подсчитываем общее количество
        total = query.count()
        
        # Применяем пагинацию и сортировку
        documents = query.order_by(Document.created_at.desc()).offset(skip).limit(limit).all()
        
        return DocumentList(
            documents=[DocumentResponse.from_orm(doc) for doc in documents],
            total=total,
            skip=skip,
            limit=limit
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении документов: {str(e)}")

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: int, db: Session = Depends(get_db)):
    """Получение документа по ID"""
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="Документ не найден")
        
        return DocumentResponse.from_orm(document)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении документа: {str(e)}")

@router.post("/", response_model=DocumentResponse)
async def create_document(document_data: DocumentCreate, db: Session = Depends(get_db)):
    """Создание нового документа"""
    try:
        # Создаем документ
        document = Document(**document_data.dict())
        
        # Если указан шаблон, применяем его
        if document.template_id:
            template = db.query(DocumentTemplate).filter(DocumentTemplate.id == document.template_id).first()
            if template:
                document.content = template.content
                # Подставляем переменные из шаблона
                if template.variables and document.variables:
                    content = template.content
                    for key, value in document.variables.items():
                        content = content.replace(f"{{{{{key}}}}}", str(value))
                    document.content = content
        
        db.add(document)
        db.commit()
        db.refresh(document)
        
        return DocumentResponse.from_orm(document)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при создании документа: {str(e)}")

@router.put("/{document_id}", response_model=DocumentResponse)
async def update_document(
    document_id: int, 
    document_data: DocumentUpdate, 
    db: Session = Depends(get_db)
):
    """Обновление документа"""
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="Документ не найден")
        
        # Обновляем только переданные поля
        update_data = document_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(document, field, value)
        
        db.commit()
        db.refresh(document)
        
        return DocumentResponse.from_orm(document)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при обновлении документа: {str(e)}")

@router.delete("/{document_id}")
async def delete_document(document_id: int, db: Session = Depends(get_db)):
    """Удаление документа"""
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="Документ не найден")
        
        db.delete(document)
        db.commit()
        
        return {"message": "Документ успешно удален"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при удалении документа: {str(e)}")

@router.patch("/{document_id}/status")
async def update_document_status(
    document_id: int, 
    status: DocumentStatus, 
    db: Session = Depends(get_db)
):
    """Обновление статуса документа"""
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(status_code=404, detail="Документ не найден")
        
        document.status = status
        db.commit()
        
        return {"message": f"Статус документа изменен на {status.value}"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при обновлении статуса: {str(e)}")

# ============================================
# ШАБЛОНЫ ДОКУМЕНТОВ
# ============================================

@router.get("/templates/", response_model=List[DocumentTemplateResponse])
async def get_document_templates(
    document_type: Optional[DocumentType] = Query(None, description="Фильтр по типу документа"),
    category: Optional[str] = Query(None, description="Фильтр по категории"),
    is_active: Optional[bool] = Query(None, description="Фильтр по активности"),
    db: Session = Depends(get_db)
):
    """Получение списка шаблонов документов"""
    try:
        query = db.query(DocumentTemplate)
        
        if document_type:
            query = query.filter(DocumentTemplate.document_type == document_type)
        if category:
            query = query.filter(DocumentTemplate.category == category)
        if is_active is not None:
            query = query.filter(DocumentTemplate.is_active == is_active)
        
        templates = query.order_by(DocumentTemplate.name).all()
        return [DocumentTemplateResponse.from_orm(template) for template in templates]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении шаблонов: {str(e)}")

@router.get("/templates/{template_id}", response_model=DocumentTemplateResponse)
async def get_document_template(template_id: int, db: Session = Depends(get_db)):
    """Получение шаблона документа по ID"""
    try:
        template = db.query(DocumentTemplate).filter(DocumentTemplate.id == template_id).first()
        if not template:
            raise HTTPException(status_code=404, detail="Шаблон не найден")
        
        return DocumentTemplateResponse.from_orm(template)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении шаблона: {str(e)}")

@router.post("/templates/", response_model=DocumentTemplateResponse)
async def create_document_template(
    template_data: DocumentTemplateCreate, 
    db: Session = Depends(get_db)
):
    """Создание нового шаблона документа"""
    try:
        template = DocumentTemplate(**template_data.dict())
        db.add(template)
        db.commit()
        db.refresh(template)
        
        return DocumentTemplateResponse.from_orm(template)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при создании шаблона: {str(e)}")

@router.put("/templates/{template_id}", response_model=DocumentTemplateResponse)
async def update_document_template(
    template_id: int, 
    template_data: DocumentTemplateUpdate, 
    db: Session = Depends(get_db)
):
    """Обновление шаблона документа"""
    try:
        template = db.query(DocumentTemplate).filter(DocumentTemplate.id == template_id).first()
        if not template:
            raise HTTPException(status_code=404, detail="Шаблон не найден")
        
        update_data = template_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(template, field, value)
        
        db.commit()
        db.refresh(template)
        
        return DocumentTemplateResponse.from_orm(template)
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при обновлении шаблона: {str(e)}")

# ============================================
# БЛОКИ ДОКУМЕНТОВ
# ============================================

@router.get("/blocks/", response_model=List[DocumentBlockResponse])
async def get_document_blocks(
    block_type: Optional[str] = Query(None, description="Фильтр по типу блока"),
    category: Optional[str] = Query(None, description="Фильтр по категории"),
    is_required: Optional[bool] = Query(None, description="Фильтр по обязательности"),
    db: Session = Depends(get_db)
):
    """Получение списка блоков документов"""
    try:
        query = db.query(DocumentBlock)
        
        if block_type:
            query = query.filter(DocumentBlock.block_type == block_type)
        if category:
            query = query.filter(DocumentBlock.category == category)
        if is_required is not None:
            query = query.filter(DocumentBlock.is_required == is_required)
        
        blocks = query.order_by(DocumentBlock.order_index, DocumentBlock.name).all()
        return [DocumentBlockResponse.from_orm(block) for block in blocks]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении блоков: {str(e)}")

@router.post("/blocks/", response_model=DocumentBlockResponse)
async def create_document_block(
    block_data: DocumentBlockCreate, 
    db: Session = Depends(get_db)
):
    """Создание нового блока документа"""
    try:
        block = DocumentBlock(**block_data.dict())
        db.add(block)
        db.commit()
        db.refresh(block)
        
        return DocumentBlockResponse.from_orm(block)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Ошибка при создании блока: {str(e)}")

# ============================================
# СТАТИСТИКА
# ============================================

@router.get("/stats/summary")
async def get_documents_summary(db: Session = Depends(get_db)):
    """Получение сводной статистики по документам"""
    try:
        total_documents = db.query(Document).count()
        documents_by_type = db.query(
            Document.document_type, 
            db.func.count(Document.id)
        ).group_by(Document.document_type).all()
        
        documents_by_status = db.query(
            Document.status, 
            db.func.count(Document.id)
        ).group_by(Document.status).all()
        
        recent_documents = db.query(Document).order_by(
            Document.created_at.desc()
        ).limit(5).all()
        
        return {
            "total_documents": total_documents,
            "documents_by_type": dict(documents_by_type),
            "documents_by_status": dict(documents_by_status),
            "recent_documents": [
                {
                    "id": doc.id,
                    "title": doc.title,
                    "type": doc.document_type.value,
                    "status": doc.status.value,
                    "created_at": doc.created_at.isoformat()
                }
                for doc in recent_documents
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении статистики: {str(e)}")
