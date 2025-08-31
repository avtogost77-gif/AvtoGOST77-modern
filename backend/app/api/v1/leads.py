"""
API роутер для заявок (заглушка)
"""

from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_leads():
    """Получить список заявок"""
    return {"message": "API заявок в разработке"}
