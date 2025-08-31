"""
AVTOGOST77 CRM MVP - Pydantic схемы для правовой базы
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: Схемы валидации данных для API правовой базы
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import date, datetime

# ============================================
# БАЗОВЫЕ СХЕМЫ
# ============================================

class LegalDocumentBase(BaseModel):
    """Базовая схема правового документа"""
    
    title: str = Field(..., min_length=1, max_length=500, description="Название документа")
    document_type: str = Field(..., description="Тип правового документа")
    category_id: Optional[int] = Field(None, description="ID категории")
    
    # Содержимое документа
    content: str = Field(..., description="Полный текст документа")
    summary: Optional[str] = Field(None, description="Краткое содержание")
    
    # Метаданные
    document_number: Optional[str] = Field(None, max_length=100, description="Номер документа")
    issue_date: Optional[date] = Field(None, description="Дата издания")
    effective_date: Optional[date] = Field(None, description="Дата вступления в силу")
    publisher: Optional[str] = Field(None, max_length=200, description="Издатель")
    
    # Поиск и индексация
    keywords: Optional[List[str]] = Field(None, description="Ключевые слова для поиска")
    tags: Optional[Dict[str, Any]] = Field(None, description="Теги для категоризации")
    
    # Статус
    is_active: bool = Field(default=True, description="Активен ли документ")
    version: str = Field(default="1.0", max_length=20, description="Версия документа")

class LegalArticleBase(BaseModel):
    """Базовая схема статьи правового документа"""
    
    title: str = Field(..., min_length=1, max_length=500, description="Название статьи")
    document_id: int = Field(..., description="ID правового документа")
    
    # Содержимое статьи
    content: str = Field(..., description="Текст статьи")
    article_number: Optional[str] = Field(None, max_length=50, description="Номер статьи")
    
    # Метаданные
    page_number: Optional[int] = Field(None, ge=1, description="Номер страницы")
    section: Optional[str] = Field(None, max_length=100, description="Раздел")
    subsection: Optional[str] = Field(None, max_length=100, description="Подраздел")
    
    # Поиск
    keywords: Optional[List[str]] = Field(None, description="Ключевые слова")
    tags: Optional[Dict[str, Any]] = Field(None, description="Теги")

class LegalCategoryBase(BaseModel):
    """Базовая схема категории правовых документов"""
    
    name: str = Field(..., min_length=1, max_length=200, description="Название категории")
    description: Optional[str] = Field(None, description="Описание категории")
    
    # Иерархия
    parent_id: Optional[int] = Field(None, description="ID родительской категории")
    level: int = Field(default=1, ge=1, description="Уровень в иерархии")
    order_index: int = Field(default=0, ge=0, description="Порядок отображения")
    
    # Настройки
    is_active: bool = Field(default=True, description="Активна ли категория")
    icon: Optional[str] = Field(None, max_length=100, description="Иконка категории")
    color: Optional[str] = Field(None, max_length=7, description="Цвет категории")

class LegalSearchIndexBase(BaseModel):
    """Базовая схема поискового индекса"""
    
    document_id: int = Field(..., description="ID документа")
    article_id: Optional[int] = Field(None, description="ID статьи")
    
    # Поисковые данные
    search_text: str = Field(..., description="Текст для поиска")
    search_vector: Optional[str] = Field(None, description="Вектор для полнотекстового поиска")
    
    # Метаданные поиска
    word_count: int = Field(default=0, ge=0, description="Количество слов")
    relevance_score: float = Field(default=0.0, ge=0.0, le=1.0, description="Релевантность")
    
    # Индексация
    last_indexed: datetime = Field(default_factory=datetime.utcnow, description="Время последней индексации")

class UserFavoriteBase(BaseModel):
    """Базовая схема избранного пользователя"""
    
    user_id: str = Field(..., description="ID пользователя")
    document_id: Optional[int] = Field(None, description="ID документа")
    article_id: Optional[int] = Field(None, description="ID статьи")
    
    # Настройки
    notes: Optional[str] = Field(None, description="Заметки пользователя")
    tags: Optional[List[str]] = Field(None, description="Пользовательские теги")
    
    # Время
    added_at: datetime = Field(default_factory=datetime.utcnow, description="Время добавления в избранное")

# ============================================
# СХЕМЫ СОЗДАНИЯ
# ============================================

class LegalDocumentCreate(LegalDocumentBase):
    """Схема для создания правового документа"""
    pass

class LegalArticleCreate(LegalArticleBase):
    """Схема для создания статьи"""
    pass

class LegalCategoryCreate(LegalCategoryBase):
    """Схема для создания категории"""
    pass

class LegalSearchIndexCreate(LegalSearchIndexBase):
    """Схема для создания поискового индекса"""
    pass

class UserFavoriteCreate(UserFavoriteBase):
    """Схема для создания избранного"""
    pass

# ============================================
# СХЕМЫ ОБНОВЛЕНИЯ
# ============================================

class LegalDocumentUpdate(BaseModel):
    """Схема для обновления правового документа"""
    
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    document_type: Optional[str] = None
    category_id: Optional[int] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    document_number: Optional[str] = Field(None, max_length=100)
    issue_date: Optional[date] = None
    effective_date: Optional[date] = None
    publisher: Optional[str] = Field(None, max_length=200)
    keywords: Optional[List[str]] = None
    tags: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    version: Optional[str] = Field(None, max_length=20)

class LegalArticleUpdate(BaseModel):
    """Схема для обновления статьи"""
    
    title: Optional[str] = Field(None, min_length=1, max_length=500)
    content: Optional[str] = None
    article_number: Optional[str] = Field(None, max_length=50)
    page_number: Optional[int] = Field(None, ge=1)
    section: Optional[str] = Field(None, max_length=100)
    subsection: Optional[str] = Field(None, max_length=100)
    keywords: Optional[List[str]] = None
    tags: Optional[Dict[str, Any]] = None

class LegalCategoryUpdate(BaseModel):
    """Схема для обновления категории"""
    
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    parent_id: Optional[int] = None
    level: Optional[int] = Field(None, ge=1)
    order_index: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None
    icon: Optional[str] = Field(None, max_length=100)
    color: Optional[str] = Field(None, max_length=7)

class UserFavoriteUpdate(BaseModel):
    """Схема для обновления избранного"""
    
    notes: Optional[str] = None
    tags: Optional[List[str]] = None

# ============================================
# СХЕМЫ ОТВЕТОВ
# ============================================

class LegalDocumentResponse(LegalDocumentBase):
    """Схема для ответа с правовым документом"""
    
    id: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    
    class Config:
        from_attributes = True

class LegalArticleResponse(LegalArticleBase):
    """Схема для ответа со статьей"""
    
    id: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    
    class Config:
        from_attributes = True

class LegalCategoryResponse(LegalCategoryBase):
    """Схема для ответа с категорией"""
    
    id: int
    created_at: datetime
    updated_at: datetime
    created_by: Optional[str] = None
    
    class Config:
        from_attributes = True

class LegalSearchIndexResponse(LegalSearchIndexBase):
    """Схема для ответа с поисковым индексом"""
    
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserFavoriteResponse(UserFavoriteBase):
    """Схема для ответа с избранным"""
    
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# ============================================
# СПИСКИ И СВОДКИ
# ============================================

class LegalDocumentList(BaseModel):
    """Схема для списка правовых документов с пагинацией"""
    
    documents: List[LegalDocumentResponse]
    total: int
    skip: int
    limit: int
    
    class Config:
        from_attributes = True

class LegalArticleList(BaseModel):
    """Схема для списка статей с пагинацией"""
    
    articles: List[LegalArticleResponse]
    total: int
    skip: int
    limit: int
    
    class Config:
        from_attributes = True

class LegalCategoryList(BaseModel):
    """Схема для списка категорий с пагинацией"""
    
    categories: List[LegalCategoryResponse]
    total: int
    skip: int
    limit: int
    
    class Config:
        from_attributes = True

class LegalSearchResult(BaseModel):
    """Схема для результата поиска"""
    
    query: str
    total_results: int
    documents: List[LegalDocumentResponse]
    articles: List[LegalArticleResponse]
    categories: List[LegalCategoryResponse]
    search_time: float
    
    class Config:
        from_attributes = True

class LegalStats(BaseModel):
    """Схема для статистики правовой базы"""
    
    total_documents: int
    total_articles: int
    total_categories: int
    documents_by_type: Dict[str, int]
    documents_by_category: Dict[str, int]
    recent_documents: List[Dict[str, Any]]
    popular_documents: List[Dict[str, Any]]
    
    class Config:
        from_attributes = True

# ============================================
# СПЕЦИАЛЬНЫЕ СХЕМЫ
# ============================================

class LegalDocumentWithArticles(LegalDocumentResponse):
    """Схема для документа со статьями"""
    
    articles: List[LegalArticleResponse] = []
    
    class Config:
        from_attributes = True

class LegalCategoryWithDocuments(LegalCategoryResponse):
    """Схема для категории с документами"""
    
    documents: List[LegalDocumentResponse] = []
    subcategories: List['LegalCategoryWithDocuments'] = []
    
    class Config:
        from_attributes = True

class LegalSearchSuggestion(BaseModel):
    """Схема для предложений поиска"""
    
    text: str
    type: str  # 'document', 'article', 'category'
    relevance: float
    preview: str
    
    class Config:
        from_attributes = True
