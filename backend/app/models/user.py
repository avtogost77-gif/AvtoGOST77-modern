"""
Модель пользователя
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from datetime import datetime

from app.core.database import Base


class User(Base):
    """
    Модель пользователя системы
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    
    # Основная информация
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    full_name = Column(String(200), nullable=False)
    
    # Безопасность
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_superuser = Column(Boolean, default=False, nullable=False)
    
    # Дополнительная информация
    phone = Column(String(20), nullable=True)
    position = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    
    # Временные метки
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True), nullable=True)

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"

    @property
    def display_name(self):
        """
        Отображаемое имя пользователя
        """
        return self.full_name or self.username

    @property
    def is_admin(self):
        """
        Является ли администратором
        """
        return self.is_superuser

    def to_dict(self):
        """
        Преобразование в словарь (без пароля)
        """
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "full_name": self.full_name,
            "display_name": self.display_name,
            "is_active": self.is_active,
            "is_superuser": self.is_superuser,
            "is_admin": self.is_admin,
            "phone": self.phone,
            "position": self.position,
            "department": self.department,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "last_login": self.last_login.isoformat() if self.last_login else None
        }
