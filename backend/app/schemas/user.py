"""
Схемы для пользователей (заглушка)
"""

from pydantic import BaseModel

class UserCreate(BaseModel):
    pass

class UserUpdate(BaseModel):
    pass

class UserResponse(BaseModel):
    pass
