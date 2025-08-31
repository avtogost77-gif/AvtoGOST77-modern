"""
AVTOGOST77 CRM MVP - API роутер для правовой базы
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: API эндпоинты для управления правовыми документами, поиска и избранного
"""

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from typing import List, Optional
from datetime import datetime
import json

from ..database import get_db
from ..models.legal import (
    LegalDocument, LegalArticle, LegalCategory, 
    LegalSearchIndex, UserFavorite
)
from ..schemas.legal import (
    LegalDocumentCreate, LegalDocumentUpdate, LegalDocumentResponse, LegalDocumentList,
    LegalArticleCreate, LegalArticleUpdate, LegalArticleResponse, LegalArticleList,
    LegalCategoryCreate, LegalCategoryUpdate, LegalCategoryResponse, LegalCategoryList,
    LegalSearchIndexCreate, LegalSearchIndexResponse,
    UserFavoriteCreate, UserFavoriteUpdate, UserFavoriteResponse,
    LegalSearchResult, LegalStats, LegalDocumentWithArticles, 
    LegalCategoryWithDocuments, LegalSearchSuggestion
)

router = APIRouter(prefix="/legal", tags=["legal"])

# ============================================
# ПРАВОВЫЕ ДОКУМЕНТЫ
# ============================================

@router.post("/documents/", response_model=LegalDocumentResponse, status_code=status.HTTP_201_CREATED)
def create_legal_document(
    document: LegalDocumentCreate,
    db: Session = Depends(get_db)
):
    """Создание нового правового документа"""
    
    # Проверяем существование категории
    if document.category_id:
        category = db.query(LegalCategory).filter(LegalCategory.id == document.category_id).first()
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Категория не найдена"
            )
    
    # Создаем документ
    db_document = LegalDocument(
        **document.dict(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    # Создаем поисковый индекс
    create_search_index(db_document, db)
    
    return db_document

@router.get("/documents/", response_model=LegalDocumentList)
def get_legal_documents(
    skip: int = Query(0, ge=0, description="Количество записей для пропуска"),
    limit: int = Query(100, ge=1, le=1000, description="Максимальное количество записей"),
    document_type: Optional[str] = Query(None, description="Фильтр по типу документа"),
    category_id: Optional[int] = Query(None, description="Фильтр по ID категории"),
    is_active: Optional[bool] = Query(None, description="Фильтр по активности"),
    db: Session = Depends(get_db)
):
    """Получение списка правовых документов с фильтрацией и пагинацией"""
    
    query = db.query(LegalDocument)
    
    # Применяем фильтры
    if document_type:
        query = query.filter(LegalDocument.document_type == document_type)
    if category_id:
        query = query.filter(LegalDocument.category_id == category_id)
    if is_active is not None:
        query = query.filter(LegalDocument.is_active == is_active)
    
    # Получаем общее количество
    total = query.count()
    
    # Применяем пагинацию
    documents = query.offset(skip).limit(limit).all()
    
    return LegalDocumentList(
        documents=documents,
        total=total,
        skip=skip,
        limit=limit
    )

@router.get("/documents/{document_id}", response_model=LegalDocumentResponse)
def get_legal_document(document_id: int, db: Session = Depends(get_db)):
    """Получение правового документа по ID"""
    
    document = db.query(LegalDocument).filter(LegalDocument.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Документ не найден"
        )
    
    return document

@router.put("/documents/{document_id}", response_model=LegalDocumentResponse)
def update_legal_document(
    document_id: int,
    document_update: LegalDocumentUpdate,
    db: Session = Depends(get_db)
):
    """Обновление правового документа"""
    
    db_document = db.query(LegalDocument).filter(LegalDocument.id == document_id).first()
    if not db_document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Документ не найден"
        )
    
    # Обновляем поля
    update_data = document_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_document, field, value)
    
    db_document.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_document)
    
    # Обновляем поисковый индекс
    update_search_index(db_document, db)
    
    return db_document

@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_legal_document(document_id: int, db: Session = Depends(get_db)):
    """Удаление правового документа"""
    
    document = db.query(LegalDocument).filter(LegalDocument.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Документ не найден"
        )
    
    # Удаляем связанные записи
    db.query(LegalSearchIndex).filter(LegalSearchIndex.document_id == document_id).delete()
    db.query(UserFavorite).filter(UserFavorite.document_id == document_id).delete()
    
    db.delete(document)
    db.commit()
    
    return None

# ============================================
# СТАТЬИ
# ============================================

@router.post("/articles/", response_model=LegalArticleResponse, status_code=status.HTTP_201_CREATED)
def create_legal_article(
    article: LegalArticleCreate,
    db: Session = Depends(get_db)
):
    """Создание новой статьи"""
    
    # Проверяем существование документа
    document = db.query(LegalDocument).filter(LegalDocument.id == article.document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Документ не найден"
        )
    
    # Создаем статью
    db_article = LegalArticle(
        **article.dict(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    
    # Создаем поисковый индекс для статьи
    create_search_index_for_article(db_article, db)
    
    return db_article

@router.get("/articles/", response_model=LegalArticleList)
def get_legal_articles(
    skip: int = Query(0, ge=0, description="Количество записей для пропуска"),
    limit: int = Query(100, ge=1, le=1000, description="Максимальное количество записей"),
    document_id: Optional[int] = Query(None, description="Фильтр по ID документа"),
    db: Session = Depends(get_db)
):
    """Получение списка статей с фильтрацией и пагинацией"""
    
    query = db.query(LegalArticle)
    
    if document_id:
        query = query.filter(LegalArticle.document_id == document_id)
    
    total = query.count()
    articles = query.offset(skip).limit(limit).all()
    
    return LegalArticleList(
        articles=articles,
        total=total,
        skip=skip,
        limit=limit
    )

@router.get("/articles/{article_id}", response_model=LegalArticleResponse)
def get_legal_article(article_id: int, db: Session = Depends(get_db)):
    """Получение статьи по ID"""
    
    article = db.query(LegalArticle).filter(LegalArticle.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Статья не найдена"
        )
    
    return article

@router.put("/articles/{article_id}", response_model=LegalArticleResponse)
def update_legal_article(
    article_id: int,
    article_update: LegalArticleUpdate,
    db: Session = Depends(get_db)
):
    """Обновление статьи"""
    
    db_article = db.query(LegalArticle).filter(LegalArticle.id == article_id).first()
    if not db_article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Статья не найдена"
        )
    
    update_data = article_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_article, field, value)
    
    db_article.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_article)
    
    # Обновляем поисковый индекс
    update_search_index_for_article(db_article, db)
    
    return db_article

@router.delete("/articles/{article_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_legal_article(article_id: int, db: Session = Depends(get_db)):
    """Удаление статьи"""
    
    article = db.query(LegalArticle).filter(LegalArticle.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Статья не найдена"
        )
    
    # Удаляем связанные записи
    db.query(LegalSearchIndex).filter(LegalSearchIndex.article_id == article_id).delete()
    db.query(UserFavorite).filter(UserFavorite.article_id == article_id).delete()
    
    db.delete(article)
    db.commit()
    
    return None

# ============================================
# КАТЕГОРИИ
# ============================================

@router.post("/categories/", response_model=LegalCategoryResponse, status_code=status.HTTP_201_CREATED)
def create_legal_category(
    category: LegalCategoryCreate,
    db: Session = Depends(get_db)
):
    """Создание новой категории"""
    
    # Проверяем существование родительской категории
    if category.parent_id:
        parent = db.query(LegalCategory).filter(LegalCategory.id == category.parent_id).first()
        if not parent:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Родительская категория не найдена"
            )
        category.level = parent.level + 1
    
    db_category = LegalCategory(
        **category.dict(),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    
    return db_category

@router.get("/categories/", response_model=LegalCategoryList)
def get_legal_categories(
    skip: int = Query(0, ge=0, description="Количество записей для пропуска"),
    limit: int = Query(100, ge=1, le=1000, description="Максимальное количество записей"),
    parent_id: Optional[int] = Query(None, description="Фильтр по ID родительской категории"),
    level: Optional[int] = Query(None, description="Фильтр по уровню"),
    is_active: Optional[bool] = Query(None, description="Фильтр по активности"),
    db: Session = Depends(get_db)
):
    """Получение списка категорий с фильтрацией и пагинацией"""
    
    query = db.query(LegalCategory)
    
    if parent_id is not None:
        query = query.filter(LegalCategory.parent_id == parent_id)
    if level is not None:
        query = query.filter(LegalCategory.level == level)
    if is_active is not None:
        query = query.filter(LegalCategory.is_active == is_active)
    
    total = query.count()
    categories = query.order_by(LegalCategory.order_index).offset(skip).limit(limit).all()
    
    return LegalCategoryList(
        categories=categories,
        total=total,
        skip=skip,
        limit=limit
    )

@router.get("/categories/{category_id}", response_model=LegalCategoryResponse)
def get_legal_category(category_id: int, db: Session = Depends(get_db)):
    """Получение категории по ID"""
    
    category = db.query(LegalCategory).filter(LegalCategory.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Категория не найдена"
        )
    
    return category

@router.put("/categories/{category_id}", response_model=LegalCategoryResponse)
def update_legal_category(
    category_id: int,
    category_update: LegalCategoryUpdate,
    db: Session = Depends(get_db)
):
    """Обновление категории"""
    
    db_category = db.query(LegalCategory).filter(LegalCategory.id == category_id).first()
    if not db_category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Категория не найдена"
        )
    
    update_data = category_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_category, field, value)
    
    db_category.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_category)
    
    return db_category

@router.delete("/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_legal_category(category_id: int, db: Session = Depends(get_db)):
    """Удаление категории"""
    
    category = db.query(LegalCategory).filter(LegalCategory.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Категория не найдена"
        )
    
    # Проверяем, есть ли дочерние категории
    children = db.query(LegalCategory).filter(LegalCategory.parent_id == category_id).count()
    if children > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Нельзя удалить категорию с дочерними элементами"
        )
    
    # Проверяем, есть ли документы в этой категории
    documents = db.query(LegalDocument).filter(LegalDocument.category_id == category_id).count()
    if documents > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Нельзя удалить категорию с документами"
        )
    
    db.delete(category)
    db.commit()
    
    return None

# ============================================
# ПОИСК
# ============================================

@router.get("/search/", response_model=LegalSearchResult)
def search_legal_documents(
    q: str = Query(..., min_length=2, description="Поисковый запрос"),
    document_type: Optional[str] = Query(None, description="Фильтр по типу документа"),
    category_id: Optional[int] = Query(None, description="Фильтр по ID категории"),
    limit: int = Query(50, ge=1, le=200, description="Максимальное количество результатов"),
    db: Session = Depends(get_db)
):
    """Полнотекстовый поиск по правовой базе"""
    
    start_time = datetime.utcnow()
    
    # Поиск по документам
    doc_query = db.query(LegalDocument).filter(
        and_(
            LegalDocument.is_active == True,
            or_(
                LegalDocument.title.ilike(f"%{q}%"),
                LegalDocument.content.ilike(f"%{q}%"),
                LegalDocument.summary.ilike(f"%{q}%")
            )
        )
    )
    
    if document_type:
        doc_query = doc_query.filter(LegalDocument.document_type == document_type)
    if category_id:
        doc_query = doc_query.filter(LegalDocument.category_id == category_id)
    
    documents = doc_query.limit(limit).all()
    
    # Поиск по статьям
    article_query = db.query(LegalArticle).filter(
        or_(
            LegalArticle.title.ilike(f"%{q}%"),
            LegalArticle.content.ilike(f"%{q}%")
        )
    )
    
    articles = article_query.limit(limit).all()
    
    # Поиск по категориям
    category_query = db.query(LegalCategory).filter(
        and_(
            LegalCategory.is_active == True,
            or_(
                LegalCategory.name.ilike(f"%{q}%"),
                LegalCategory.description.ilike(f"%{q}%")
            )
        )
    )
    
    categories = category_query.limit(limit).all()
    
    # Подсчитываем общее количество результатов
    total_results = len(documents) + len(articles) + len(categories)
    
    # Вычисляем время поиска
    search_time = (datetime.utcnow() - start_time).total_seconds()
    
    return LegalSearchResult(
        query=q,
        total_results=total_results,
        documents=documents,
        articles=articles,
        categories=categories,
        search_time=search_time
    )

@router.get("/search/suggestions", response_model=List[LegalSearchSuggestion])
def get_search_suggestions(
    q: str = Query(..., min_length=2, description="Поисковый запрос"),
    limit: int = Query(10, ge=1, le=50, description="Максимальное количество предложений"),
    db: Session = Depends(get_db)
):
    """Получение предложений для поиска"""
    
    suggestions = []
    
    # Поиск по названиям документов
    doc_suggestions = db.query(LegalDocument).filter(
        and_(
            LegalDocument.is_active == True,
            LegalDocument.title.ilike(f"%{q}%")
        )
    ).limit(limit).all()
    
    for doc in doc_suggestions:
        suggestions.append(LegalSearchSuggestion(
            text=doc.title,
            type="document",
            relevance=0.8,
            preview=doc.summary[:100] + "..." if doc.summary else doc.title
        ))
    
    # Поиск по названиям статей
    article_suggestions = db.query(LegalArticle).filter(
        LegalArticle.title.ilike(f"%{q}%")
    ).limit(limit).all()
    
    for article in article_suggestions:
        suggestions.append(LegalSearchSuggestion(
            text=article.title,
            type="article",
            relevance=0.7,
            preview=article.content[:100] + "..." if article.content else article.title
        ))
    
    # Поиск по названиям категорий
    category_suggestions = db.query(LegalCategory).filter(
        and_(
            LegalCategory.is_active == True,
            LegalCategory.name.ilike(f"%{q}%")
        )
    ).limit(limit).all()
    
    for category in category_suggestions:
        suggestions.append(LegalSearchSuggestion(
            text=category.name,
            type="category",
            relevance=0.6,
            preview=category.description[:100] + "..." if category.description else category.name
        ))
    
    # Сортируем по релевантности и ограничиваем количество
    suggestions.sort(key=lambda x: x.relevance, reverse=True)
    return suggestions[:limit]

# ============================================
# ИЗБРАННОЕ
# ============================================

@router.post("/favorites/", response_model=UserFavoriteResponse, status_code=status.HTTP_201_CREATED)
def add_to_favorites(
    favorite: UserFavoriteCreate,
    db: Session = Depends(get_db)
):
    """Добавление в избранное"""
    
    # Проверяем существование документа или статьи
    if favorite.document_id:
        document = db.query(LegalDocument).filter(LegalDocument.id == favorite.document_id).first()
        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Документ не найден"
            )
    
    if favorite.article_id:
        article = db.query(LegalArticle).filter(LegalArticle.id == favorite.article_id).first()
        if not article:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Статья не найдена"
            )
    
    # Проверяем, не добавлено ли уже в избранное
    existing = db.query(UserFavorite).filter(
        and_(
            UserFavorite.user_id == favorite.user_id,
            or_(
                UserFavorite.document_id == favorite.document_id,
                UserFavorite.article_id == favorite.article_id
            )
        )
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Уже добавлено в избранное"
        )
    
    db_favorite = UserFavorite(
        **favorite.dict(),
        created_at=datetime.utcnow()
    )
    
    db.add(db_favorite)
    db.commit()
    db.refresh(db_favorite)
    
    return db_favorite

@router.get("/favorites/{user_id}", response_model=List[UserFavoriteResponse])
def get_user_favorites(user_id: str, db: Session = Depends(get_db)):
    """Получение избранного пользователя"""
    
    favorites = db.query(UserFavorite).filter(
        UserFavorite.user_id == user_id
    ).all()
    
    return favorites

@router.put("/favorites/{favorite_id}", response_model=UserFavoriteResponse)
def update_favorite(
    favorite_id: int,
    favorite_update: UserFavoriteUpdate,
    db: Session = Depends(get_db)
):
    """Обновление избранного"""
    
    db_favorite = db.query(UserFavorite).filter(UserFavorite.id == favorite_id).first()
    if not db_favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Запись в избранном не найдена"
        )
    
    update_data = favorite_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_favorite, field, value)
    
    db.commit()
    db.refresh(db_favorite)
    
    return db_favorite

@router.delete("/favorites/{favorite_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_favorites(favorite_id: int, db: Session = Depends(get_db)):
    """Удаление из избранного"""
    
    favorite = db.query(UserFavorite).filter(UserFavorite.id == favorite_id).first()
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Запись в избранном не найдена"
        )
    
    db.delete(favorite)
    db.commit()
    
    return None

# ============================================
# СТАТИСТИКА
# ============================================

@router.get("/stats/overview", response_model=LegalStats)
def get_legal_stats(db: Session = Depends(get_db)):
    """Получение общей статистики правовой базы"""
    
    # Общие показатели
    total_documents = db.query(LegalDocument).filter(LegalDocument.is_active == True).count()
    total_articles = db.query(LegalArticle).count()
    total_categories = db.query(LegalCategory).filter(LegalCategory.is_active == True).count()
    
    # Документы по типу
    documents_by_type = {}
    type_counts = db.query(
        LegalDocument.document_type, 
        func.count(LegalDocument.id)
    ).filter(LegalDocument.is_active == True).group_by(LegalDocument.document_type).all()
    
    for doc_type, count in type_counts:
        documents_by_type[doc_type] = count
    
    # Документы по категории
    documents_by_category = {}
    category_counts = db.query(
        LegalCategory.name,
        func.count(LegalDocument.id)
    ).join(LegalDocument, LegalDocument.category_id == LegalCategory.id).filter(
        LegalDocument.is_active == True
    ).group_by(LegalCategory.name).all()
    
    for category_name, count in category_counts:
        documents_by_category[category_name] = count
    
    # Недавние документы
    recent_documents = db.query(LegalDocument).filter(
        LegalDocument.is_active == True
    ).order_by(LegalDocument.created_at.desc()).limit(5).all()
    
    recent_data = []
    for doc in recent_documents:
        recent_data.append({
            "id": doc.id,
            "title": doc.title,
            "document_type": doc.document_type,
            "created_at": doc.created_at.isoformat() if doc.created_at else None
        })
    
    # Популярные документы (по количеству в избранном)
    popular_docs = db.query(
        LegalDocument,
        func.count(UserFavorite.id).label("favorite_count")
    ).outerjoin(UserFavorite, UserFavorite.document_id == LegalDocument.id).filter(
        LegalDocument.is_active == True
    ).group_by(LegalDocument.id).order_by(
        func.count(UserFavorite.id).desc()
    ).limit(5).all()
    
    popular_data = []
    for doc, favorite_count in popular_docs:
        popular_data.append({
            "id": doc.id,
            "title": doc.title,
            "document_type": doc.document_type,
            "favorite_count": favorite_count
        })
    
    return LegalStats(
        total_documents=total_documents,
        total_articles=total_articles,
        total_categories=total_categories,
        documents_by_type=documents_by_type,
        documents_by_category=documents_by_category,
        recent_documents=recent_data,
        popular_documents=popular_data
    )

# ============================================
# ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
# ============================================

def create_search_index(document: LegalDocument, db: Session):
    """Создание поискового индекса для документа"""
    
    # Создаем индекс для заголовка
    title_index = LegalSearchIndex(
        document_id=document.id,
        search_text=document.title,
        word_count=len(document.title.split()),
        relevance_score=1.0,
        last_indexed=datetime.utcnow()
    )
    db.add(title_index)
    
    # Создаем индекс для содержимого
    if document.content:
        content_index = LegalSearchIndex(
            document_id=document.id,
            search_text=document.content,
            word_count=len(document.content.split()),
            relevance_score=0.8,
            last_indexed=datetime.utcnow()
        )
        db.add(content_index)
    
    # Создаем индекс для ключевых слов
    if document.keywords:
        for keyword in document.keywords:
            keyword_index = LegalSearchIndex(
                document_id=document.id,
                search_text=keyword,
                word_count=1,
                relevance_score=0.9,
                last_indexed=datetime.utcnow()
            )
            db.add(keyword_index)
    
    db.commit()

def update_search_index(document: LegalDocument, db: Session):
    """Обновление поискового индекса для документа"""
    
    # Удаляем старые индексы
    db.query(LegalSearchIndex).filter(LegalSearchIndex.document_id == document.id).delete()
    
    # Создаем новые
    create_search_index(document, db)

def create_search_index_for_article(article: LegalArticle, db: Session):
    """Создание поискового индекса для статьи"""
    
    # Создаем индекс для заголовка
    title_index = LegalSearchIndex(
        document_id=article.document_id,
        article_id=article.id,
        search_text=article.title,
        word_count=len(article.title.split()),
        relevance_score=0.9,
        last_indexed=datetime.utcnow()
    )
    db.add(title_index)
    
    # Создаем индекс для содержимого
    if article.content:
        content_index = LegalSearchIndex(
            document_id=article.document_id,
            article_id=article.id,
            search_text=article.content,
            word_count=len(article.content.split()),
            relevance_score=0.7,
            last_indexed=datetime.utcnow()
        )
        db.add(content_index)
    
    db.commit()

def update_search_index_for_article(article: LegalArticle, db: Session):
    """Обновление поискового индекса для статьи"""
    
    # Удаляем старые индексы
    db.query(LegalSearchIndex).filter(LegalSearchIndex.article_id == article.id).delete()
    
    # Создаем новые
    create_search_index_for_article(article, db)
