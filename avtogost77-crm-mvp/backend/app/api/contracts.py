"""
AVTOGOST77 CRM MVP - API роутер для контрактов
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: API эндпоинты для управления контрактами, шаблонами и условиями
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models.contract import Contract, ContractTemplate, ContractCondition, ContractHistory
from ..models.lead import Lead
from ..models.partner import Partner
from ..schemas.contract import (
    ContractCreate, ContractUpdate, ContractResponse, ContractList,
    ContractTemplateCreate, ContractTemplateUpdate, ContractTemplateResponse,
    ContractConditionCreate, ContractConditionUpdate, ContractConditionResponse,
    ContractHistoryResponse, ContractStats, MirrorContractResponse
)

router = APIRouter(prefix="/contracts", tags=["contracts"])

# ============================================
# КОНТРАКТЫ
# ============================================

@router.post("/", response_model=ContractResponse, status_code=status.HTTP_201_CREATED)
def create_contract(
    contract: ContractCreate,
    db: Session = Depends(get_db)
):
    """Создание нового контракта"""
    
    # Проверяем существование связанных сущностей
    if contract.lead_id:
        lead = db.query(Lead).filter(Lead.id == contract.lead_id).first()
        if not lead:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Заявка не найдена"
            )
    
    if contract.partner_id:
        partner = db.query(Partner).filter(Partner.id == contract.partner_id).first()
        if not partner:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Партнер не найден"
            )
    
    # Создаем контракт
    db_contract = Contract(
        **contract.dict(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    
    return db_contract

@router.get("/", response_model=ContractList)
def get_contracts(
    skip: int = Query(0, ge=0, description="Количество записей для пропуска"),
    limit: int = Query(100, ge=1, le=1000, description="Максимальное количество записей"),
    contract_type: Optional[str] = Query(None, description="Фильтр по типу контракта"),
    status: Optional[str] = Query(None, description="Фильтр по статусу"),
    lead_id: Optional[int] = Query(None, description="Фильтр по ID заявки"),
    partner_id: Optional[int] = Query(None, description="Фильтр по ID партнера"),
    db: Session = Depends(get_db)
):
    """Получение списка контрактов с фильтрацией и пагинацией"""
    
    query = db.query(Contract)
    
    # Применяем фильтры
    if contract_type:
        query = query.filter(Contract.contract_type == contract_type)
    if status:
        query = query.filter(Contract.status == status)
    if lead_id:
        query = query.filter(Contract.lead_id == lead_id)
    if partner_id:
        query = query.filter(Contract.partner_id == partner_id)
    
    # Получаем общее количество
    total = query.count()
    
    # Применяем пагинацию
    contracts = query.offset(skip).limit(limit).all()
    
    return ContractList(
        contracts=contracts,
        total=total,
        skip=skip,
        limit=limit
    )

@router.get("/{contract_id}", response_model=ContractResponse)
def get_contract(contract_id: int, db: Session = Depends(get_db)):
    """Получение контракта по ID"""
    
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Контракт не найден"
        )
    
    return contract

@router.put("/{contract_id}", response_model=ContractResponse)
def update_contract(
    contract_id: int,
    contract_update: ContractUpdate,
    db: Session = Depends(get_db)
):
    """Обновление контракта"""
    
    db_contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not db_contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Контракт не найден"
        )
    
    # Обновляем поля
    update_data = contract_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_contract, field, value)
    
    db_contract.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_contract)
    
    return db_contract

@router.delete("/{contract_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contract(contract_id: int, db: Session = Depends(get_db)):
    """Удаление контракта"""
    
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Контракт не найден"
        )
    
    db.delete(contract)
    db.commit()
    
    return None

# ============================================
# ШАБЛОНЫ КОНТРАКТОВ
# ============================================

@router.post("/templates/", response_model=ContractTemplateResponse, status_code=status.HTTP_201_CREATED)
def create_contract_template(
    template: ContractTemplateCreate,
    db: Session = Depends(get_db)
):
    """Создание нового шаблона контракта"""
    
    db_template = ContractTemplate(
        **template.dict(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    
    return db_template

@router.get("/templates/", response_model=List[ContractTemplateResponse])
def get_contract_templates(
    contract_type: Optional[str] = Query(None, description="Фильтр по типу контракта"),
    is_active: Optional[bool] = Query(None, description="Фильтр по активности"),
    is_mirror_template: Optional[bool] = Query(None, description="Фильтр по зеркальности"),
    db: Session = Depends(get_db)
):
    """Получение списка шаблонов контрактов"""
    
    query = db.query(ContractTemplate)
    
    if contract_type:
        query = query.filter(ContractTemplate.contract_type == contract_type)
    if is_active is not None:
        query = query.filter(ContractTemplate.is_active == is_active)
    if is_mirror_template is not None:
        query = query.filter(ContractTemplate.is_mirror_template == is_mirror_template)
    
    return query.all()

@router.get("/templates/{template_id}", response_model=ContractTemplateResponse)
def get_contract_template(template_id: int, db: Session = Depends(get_db)):
    """Получение шаблона контракта по ID"""
    
    template = db.query(ContractTemplate).filter(ContractTemplate.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Шаблон не найден"
        )
    
    return template

@router.put("/templates/{template_id}", response_model=ContractTemplateResponse)
def update_contract_template(
    template_id: int,
    template_update: ContractTemplateUpdate,
    db: Session = Depends(get_db)
):
    """Обновление шаблона контракта"""
    
    db_template = db.query(ContractTemplate).filter(ContractTemplate.id == template_id).first()
    if not db_template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Шаблон не найден"
        )
    
    update_data = template_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_template, field, value)
    
    db_template.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_template)
    
    return db_template

@router.delete("/templates/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contract_template(template_id: int, db: Session = Depends(get_db)):
    """Удаление шаблона контракта"""
    
    template = db.query(ContractTemplate).filter(ContractTemplate.id == template_id).first()
    if not template:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Шаблон не найден"
        )
    
    db.delete(template)
    db.commit()
    
    return None

# ============================================
# УСЛОВИЯ КОНТРАКТОВ
# ============================================

@router.post("/conditions/", response_model=ContractConditionResponse, status_code=status.HTTP_201_CREATED)
def create_contract_condition(
    condition: ContractConditionCreate,
    db: Session = Depends(get_db)
):
    """Создание нового условия контракта"""
    
    db_condition = ContractCondition(
        **condition.dict(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.add(db_condition)
    db.commit()
    db.refresh(db_condition)
    
    return db_condition

@router.get("/conditions/", response_model=List[ContractConditionResponse])
def get_contract_conditions(
    condition_type: Optional[str] = Query(None, description="Фильтр по типу условия"),
    category: Optional[str] = Query(None, description="Фильтр по категории"),
    is_required: Optional[bool] = Query(None, description="Фильтр по обязательности"),
    db: Session = Depends(get_db)
):
    """Получение списка условий контрактов"""
    
    query = db.query(ContractCondition)
    
    if condition_type:
        query = query.filter(ContractCondition.condition_type == condition_type)
    if category:
        query = query.filter(ContractCondition.category == category)
    if is_required is not None:
        query = query.filter(ContractCondition.is_required == is_required)
    
    return query.order_by(ContractCondition.order_index).all()

@router.get("/conditions/{condition_id}", response_model=ContractConditionResponse)
def get_contract_condition(condition_id: int, db: Session = Depends(get_db)):
    """Получение условия контракта по ID"""
    
    condition = db.query(ContractCondition).filter(ContractCondition.id == condition_id).first()
    if not condition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Условие не найдено"
        )
    
    return condition

@router.put("/conditions/{condition_id}", response_model=ContractConditionResponse)
def update_contract_condition(
    condition_id: int,
    condition_update: ContractConditionUpdate,
    db: Session = Depends(get_db)
):
    """Обновление условия контракта"""
    
    db_condition = db.query(ContractCondition).filter(ContractCondition.id == condition_id).first()
    if not db_condition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Условие не найдено"
        )
    
    update_data = condition_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_condition, field, value)
    
    db_condition.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_condition)
    
    return db_condition

@router.delete("/conditions/{condition_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contract_condition(condition_id: int, db: Session = Depends(get_db)):
    """Удаление условия контракта"""
    
    condition = db.query(ContractCondition).filter(ContractCondition.id == condition_id).first()
    if not condition:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Условие не найдено"
        )
    
    db.delete(condition)
    db.commit()
    
    return None

# ============================================
# ИСТОРИЯ КОНТРАКТОВ
# ============================================

@router.get("/{contract_id}/history", response_model=List[ContractHistoryResponse])
def get_contract_history(contract_id: int, db: Session = Depends(get_db)):
    """Получение истории изменений контракта"""
    
    # Проверяем существование контракта
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Контракт не найден"
        )
    
    history = db.query(ContractHistory).filter(
        ContractHistory.contract_id == contract_id
    ).order_by(ContractHistory.created_at.desc()).all()
    
    return history

# ============================================
# ЗЕРКАЛЬНЫЕ КОНТРАКТЫ
# ============================================

@router.get("/{contract_id}/mirror", response_model=MirrorContractResponse)
def get_mirror_contract(contract_id: int, db: Session = Depends(get_db)):
    """Получение зеркального контракта"""
    
    contract = db.query(Contract).filter(Contract.id == contract_id).first()
    if not contract:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Контракт не найден"
        )
    
    # Ищем зеркальный контракт
    mirror_contract = None
    if contract.mirror_contract_id:
        mirror_contract = db.query(Contract).filter(Contract.id == contract.mirror_contract_id).first()
    
    # Проверяем синхронизацию
    is_synchronized = True
    sync_errors = []
    
    if mirror_contract:
        # Проверяем основные поля на синхронизацию
        if contract.route_from != mirror_contract.route_from:
            is_synchronized = False
            sync_errors.append("Город отправления не синхронизирован")
        
        if contract.route_to != mirror_contract.route_to:
            is_synchronized = False
            sync_errors.append("Город назначения не синхронизирован")
        
        if contract.loading_date != mirror_contract.loading_date:
            is_synchronized = False
            sync_errors.append("Дата погрузки не синхронизирована")
        
        if contract.unloading_date != mirror_contract.unloading_date:
            is_synchronized = False
            sync_errors.append("Дата выгрузки не синхронизирована")
    
    return MirrorContractResponse(
        client_contract=contract,
        partner_contract=mirror_contract,
        is_synchronized=is_synchronized,
        sync_errors=sync_errors
    )

# ============================================
# СТАТИСТИКА
# ============================================

@router.get("/stats/overview", response_model=ContractStats)
def get_contract_stats(db: Session = Depends(get_db)):
    """Получение общей статистики по контрактам"""
    
    # Общее количество контрактов
    total_contracts = db.query(Contract).count()
    
    # Контракты по типу
    contracts_by_type = {}
    type_counts = db.query(Contract.contract_type, db.func.count(Contract.id)).group_by(Contract.contract_type).all()
    for contract_type, count in type_counts:
        contracts_by_type[contract_type] = count
    
    # Контракты по статусу
    contracts_by_status = {}
    status_counts = db.query(Contract.status, db.func.count(Contract.id)).group_by(Contract.status).all()
    for status, count in status_counts:
        contracts_by_status[status] = count
    
    # Финансовые показатели
    financial_data = db.query(
        db.func.sum(Contract.total_amount).label("total_amount"),
        db.func.sum(Contract.partner_cost).label("total_partner_cost")
    ).filter(Contract.total_amount.isnot(None)).first()
    
    total_amount = float(financial_data.total_amount or 0)
    total_partner_cost = float(financial_data.total_partner_cost or 0)
    total_profit = total_amount - total_partner_cost
    
    # Недавние контракты
    recent_contracts = db.query(Contract).order_by(
        Contract.created_at.desc()
    ).limit(5).all()
    
    recent_data = []
    for contract in recent_contracts:
        recent_data.append({
            "id": contract.id,
            "title": contract.title,
            "contract_type": contract.contract_type,
            "status": contract.status,
            "created_at": contract.created_at.isoformat() if contract.created_at else None
        })
    
    return ContractStats(
        total_contracts=total_contracts,
        contracts_by_type=contracts_by_type,
        contracts_by_status=contracts_by_status,
        total_amount=total_amount,
        total_partner_cost=total_partner_cost,
        total_profit=total_profit,
        recent_contracts=recent_data
    )
