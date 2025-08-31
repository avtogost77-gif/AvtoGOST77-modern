"""
API роутер для клиентов
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.core.database import get_db
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientUpdate, ClientResponse

router = APIRouter()


@router.get("/", response_model=List[ClientResponse])
async def get_clients(
    skip: int = Query(0, ge=0, description="Количество записей для пропуска"),
    limit: int = Query(100, ge=1, le=1000, description="Максимальное количество записей"),
    search: Optional[str] = Query(None, description="Поиск по имени, телефону или email"),
    db: Session = Depends(get_db)
):
    """
    Получить список клиентов с пагинацией и поиском
    """
    query = db.query(Client)
    
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Client.name.ilike(search_term),
                Client.phone.ilike(search_term),
                Client.email.ilike(search_term),
                Client.company_name.ilike(search_term)
            )
        )
    
    clients = query.offset(skip).limit(limit).all()
    return clients


@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(client_id: int, db: Session = Depends(get_db)):
    """
    Получить клиента по ID
    """
    client = db.query(Client).filter(Client.id == client_id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")
    return client


@router.post("/", response_model=ClientResponse)
async def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    """
    Создать нового клиента
    """
    # Проверяем, не существует ли уже клиент с таким телефоном
    existing_client = db.query(Client).filter(Client.phone == client.phone).first()
    if existing_client:
        raise HTTPException(status_code=400, detail="Клиент с таким телефоном уже существует")
    
    db_client = Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client


@router.put("/{client_id}", response_model=ClientResponse)
async def update_client(
    client_id: int, 
    client_update: ClientUpdate, 
    db: Session = Depends(get_db)
):
    """
    Обновить клиента
    """
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Клиент не найден")
    
    # Проверяем, не занят ли новый телефон другим клиентом
    if client_update.phone:
        existing_client = db.query(Client).filter(
            Client.phone == client_update.phone,
            Client.id != client_id
        ).first()
        if existing_client:
            raise HTTPException(status_code=400, detail="Клиент с таким телефоном уже существует")
    
    # Обновляем только переданные поля
    update_data = client_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_client, field, value)
    
    db.commit()
    db.refresh(db_client)
    return db_client


@router.delete("/{client_id}")
async def delete_client(client_id: int, db: Session = Depends(get_db)):
    """
    Удалить клиента
    """
    db_client = db.query(Client).filter(Client.id == client_id).first()
    if not db_client:
        raise HTTPException(status_code=404, detail="Клиент не найден")
    
    db.delete(db_client)
    db.commit()
    return {"message": "Клиент успешно удален"}
