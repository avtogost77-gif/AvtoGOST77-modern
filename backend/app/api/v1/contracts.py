"""
API роутер для договоров (заглушка)
"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_contracts():
    """Получить список договоров"""
    return {"message": "API договоров в разработке"}
