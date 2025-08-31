"""
AVTOGOST77 CRM MVP - Модель правовой базы
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: SQLAlchemy модель для правовой базы и поиска
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON, Enum, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

from ..database import Base

class LegalDocumentType(str, enum.Enum):
    """Типы правовых документов"""
    LAW = "law"  # Закон
    CODE = "code"  # Кодекс
    REGULATION = "regulation"  # Постановление
    ORDER = "order"  # Приказ
    INSTRUCTION = "instruction"  # Инструкция
    STANDARD = "standard"  # Стандарт
    CONVENTION = "convention"  # Конвенция
    OTHER = "other"  # Прочее

class LegalDocument(Base):
    """Модель правового документа"""
    __tablename__ = "legal_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Основная информация
    title = Column(String(500), nullable=False, comment="Название документа")
    document_type = Column(Enum(LegalDocumentType), nullable=False, comment="Тип документа")
    document_number = Column(String(100), nullable=True, comment="Номер документа")
    
    # Содержимое
    content = Column(Text, nullable=False, comment="Полный текст документа")
    summary = Column(Text, nullable=True, comment="Краткое содержание")
    
    # Метаданные
    publication_date = Column(DateTime, nullable=True, comment="Дата публикации")
    effective_date = Column(DateTime, nullable=True, comment="Дата вступления в силу")
    authority = Column(String(200), nullable=True, comment="Орган, издавший документ")
    
    # Категории и теги
    category = Column(String(100), nullable=True, comment="Категория документа")
    tags = Column(JSON, nullable=True, comment="Теги для поиска")
    
    # Настройки
    is_active = Column(Boolean, default=True, comment="Активен ли документ")
    priority = Column(Integer, default=0, comment="Приоритет для поиска")
    
    # Системные поля
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String(100), nullable=True, comment="Кто добавил")
    
    # Связи
    articles = relationship("LegalArticle", back_populates="document")
    search_index = relationship("LegalSearchIndex", back_populates="document")
    
    def __repr__(self):
        return f"<LegalDocument(id={self.id}, title='{self.title}', type='{self.document_type}')>"
    
    @property
    def display_title(self):
        """Отображаемое название документа"""
        if self.document_number:
            return f"{self.document_number} - {self.title}"
        return self.title
    
    @property
    def is_recent(self):
        """Проверка, является ли документ недавним"""
        if self.publication_date:
            days_ago = (datetime.now() - self.publication_date).days
            return days_ago <= 30
        return False

class LegalArticle(Base):
    """Модель статьи правового документа"""
    __tablename__ = "legal_articles"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Связь с документом
    document_id = Column(Integer, ForeignKey("legal_documents.id"), nullable=False)
    
    # Информация о статье
    article_number = Column(String(50), nullable=True, comment="Номер статьи")
    title = Column(String(300), nullable=True, comment="Название статьи")
    content = Column(Text, nullable=False, comment="Содержимое статьи")
    
    # Метаданные
    page_number = Column(Integer, nullable=True, comment="Номер страницы")
    section = Column(String(100), nullable=True, comment="Раздел")
    
    # Системные поля
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связи
    document = relationship("LegalDocument", back_populates="articles")
    
    def __repr__(self):
        return f"<LegalArticle(id={self.id}, document_id={self.document_id}, article='{self.article_number}')>"
    
    @property
    def display_title(self):
        """Отображаемое название статьи"""
        if self.article_number and self.title:
            return f"Статья {self.article_number}. {self.title}"
        elif self.article_number:
            return f"Статья {self.article_number}"
        elif self.title:
            return self.title
        return f"Статья {self.id}"

class LegalSearchIndex(Base):
    """Модель поискового индекса для правовых документов"""
    __tablename__ = "legal_search_index"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Связь с документом
    document_id = Column(Integer, ForeignKey("legal_documents.id"), nullable=False)
    
    # Поисковые данные
    search_text = Column(Text, nullable=False, comment="Текст для поиска")
    word_count = Column(Integer, default=0, comment="Количество слов")
    
    # Веса для поиска
    title_weight = Column(Float, default=1.0, comment="Вес заголовка")
    content_weight = Column(Float, default=0.5, comment="Вес содержимого")
    
    # Системные поля
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связи
    document = relationship("LegalDocument", back_populates="search_index")
    
    def __repr__(self):
        return f"<LegalSearchIndex(id={self.id}, document_id={self.document_id})>"

class UserFavorite(Base):
    """Модель избранных документов пользователя"""
    __tablename__ = "user_favorites"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Связи
    user_id = Column(String(100), nullable=False, comment="ID пользователя")
    document_id = Column(Integer, ForeignKey("legal_documents.id"), nullable=False)
    
    # Настройки
    notes = Column(Text, nullable=True, comment="Заметки пользователя")
    tags = Column(JSON, nullable=True, comment="Пользовательские теги")
    
    # Системные поля
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<UserFavorite(id={self.id}, user_id='{self.user_id}', document_id={self.document_id})>"

class LegalCategory(Base):
    """Модель категорий правовых документов"""
    __tablename__ = "legal_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Основная информация
    name = Column(String(100), nullable=False, unique=True, comment="Название категории")
    description = Column(Text, nullable=True, comment="Описание категории")
    
    # Иерархия
    parent_id = Column(Integer, ForeignKey("legal_categories.id"), nullable=True, comment="ID родительской категории")
    
    # Настройки
    is_active = Column(Boolean, default=True, comment="Активна ли категория")
    order_index = Column(Integer, default=0, comment="Порядок отображения")
    
    # Системные поля
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Связи
    parent = relationship("LegalCategory", remote_side=[id], back_populates="children")
    children = relationship("LegalCategory", back_populates="parent")
    
    def __repr__(self):
        return f"<LegalCategory(id={self.id}, name='{self.name}')>"
    
    @property
    def full_path(self):
        """Полный путь категории"""
        if self.parent:
            return f"{self.parent.full_path} > {self.name}"
        return self.name
