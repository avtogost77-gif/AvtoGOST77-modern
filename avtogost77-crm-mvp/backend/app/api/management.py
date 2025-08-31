"""
AVTOGOST77 CRM MVP - API для управленческого учета
Дата создания: 31 августа 2025
Автор: AI Assistant
Описание: API endpoints для управления управленческим учетом
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Optional
from datetime import date, datetime, timedelta
from decimal import Decimal
from loguru import logger

from ..database import get_db
from ..models.management_record import ManagementRecord
from ..schemas.management import ManagementCreate, ManagementResponse

router = APIRouter()

@router.get("/", response_model=List[ManagementResponse])
async def get_management_records(
    date_from: Optional[date] = Query(None, description="Дата начала периода"),
    date_to: Optional[date] = Query(None, description="Дата окончания периода"),
    client_name: Optional[str] = Query(None, description="Фильтр по клиенту"),
    partner_name: Optional[str] = Query(None, description="Фильтр по партнеру"),
    route_from: Optional[str] = Query(None, description="Фильтр по городу отправления"),
    route_to: Optional[str] = Query(None, description="Фильтр по городу назначения"),
    min_margin: Optional[float] = Query(None, description="Минимальная маржинальность"),
    max_margin: Optional[float] = Query(None, description="Максимальная маржинальность"),
    skip: int = Query(0, ge=0, description="Количество записей для пропуска"),
    limit: int = Query(100, ge=1, le=1000, description="Максимальное количество записей"),
    db: Session = Depends(get_db)
):
    """
    Получить список записей управленческого учета с фильтрацией
    """
    try:
        query = db.query(ManagementRecord)
        
        # Применяем фильтры
        if date_from:
            query = query.filter(ManagementRecord.date >= date_from)
        
        if date_to:
            query = query.filter(ManagementRecord.date <= date_to)
        
        if client_name:
            query = query.filter(ManagementRecord.client_name.ilike(f"%{client_name}%"))
        
        if partner_name:
            query = query.filter(ManagementRecord.partner_name.ilike(f"%{partner_name}%"))
        
        if route_from:
            query = query.filter(ManagementRecord.route_from.ilike(f"%{route_from}%"))
        
        if route_to:
            query = query.filter(ManagementRecord.route_to.ilike(f"%{route_to}%"))
        
        if min_margin is not None:
            query = query.filter(ManagementRecord.margin_percent >= min_margin)
        
        if max_margin is not None:
            query = query.filter(ManagementRecord.margin_percent <= max_margin)
        
        # Сортировка по дате (новые сначала)
        query = query.order_by(ManagementRecord.date.desc())
        
        # Пагинация
        total = query.count()
        records = query.offset(skip).limit(limit).all()
        
        logger.info(f"Получено {len(records)} записей управленческого учета из {total}")
        
        return records
        
    except Exception as e:
        logger.error(f"Ошибка при получении записей управленческого учета: {e}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")

@router.get("/{record_id}", response_model=ManagementResponse)
async def get_management_record(record_id: int, db: Session = Depends(get_db)):
    """
    Получить запись управленческого учета по ID
    """
    try:
        record = db.query(ManagementRecord).filter(ManagementRecord.id == record_id).first()
        
        if not record:
            raise HTTPException(status_code=404, detail="Запись не найдена")
        
        logger.info(f"Получена запись управленческого учета ID: {record_id}")
        return record
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Ошибка при получении записи {record_id}: {e}")
        raise HTTPException(status_code=500, detail="Внутренняя ошибка сервера")

@router.post("/", response_model=ManagementResponse)
async def create_management_record(record_data: ManagementCreate, db: Session = Depends(get_db)):
    """
    Создать новую запись управленческого учета
    """
    try:
        # Создаем новую запись
        record = ManagementRecord(**record_data.dict())
        
        # Автоматически рассчитываем все метрики
        record.calculate_all_metrics()
        
        db.add(record)
        db.commit()
        db.refresh(record)
        
        logger.info(f"Создана новая запись управленческого учета ID: {record.id}")
        
        return record
        
    except Exception as e:
        db.rollback()
        logger.error(f"Ошибка при создании записи управленческого учета: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при создании записи")

@router.get("/stats/summary")
async def get_management_summary(
    date_from: Optional[date] = Query(None, description="Дата начала периода"),
    date_to: Optional[date] = Query(None, description="Дата окончания периода"),
    db: Session = Depends(get_db)
):
    """
    Получить сводную статистику по управленческому учету
    """
    try:
        query = db.query(ManagementRecord)
        
        # Применяем фильтры по датам
        if date_from:
            query = query.filter(ManagementRecord.date >= date_from)
        
        if date_to:
            query = query.filter(ManagementRecord.date <= date_to)
        
        # Получаем все записи для расчета
        records = query.all()
        
        if not records:
            return {
                "period": f"{date_from} - {date_to}" if date_from and date_to else "Все время",
                "total_records": 0,
                "total_revenue": 0,
                "total_profit": 0,
                "average_margin": 0,
                "profitability_levels": {}
            }
        
        # Основные метрики
        total_records = len(records)
        total_revenue = sum(r.incoming_amount for r in records if r.incoming_amount)
        total_partner_costs = sum(r.partner_cost for r in records if r.partner_cost)
        total_ebitda = sum(r.ebitda for r in records if r.ebitda)
        total_tax = sum(r.tax_amount for r in records if r.tax_amount)
        total_net_profit = sum(r.net_profit for r in records if r.net_profit)
        
        # Средние показатели
        average_margin = total_net_profit / total_revenue * 100 if total_revenue > 0 else 0
        average_ebitda = total_ebitda / total_records if total_records > 0 else 0
        
        # Распределение по уровням прибыльности
        profitability_levels = {
            "Высокая": len([r for r in records if r.profitability_level == "Высокая"]),
            "Средняя": len([r for r in records if r.profitability_level == "Средняя"]),
            "Низкая": len([r for r in records if r.profitability_level == "Низкая"]),
            "Критическая": len([r for r in records if r.profitability_level == "Критическая"])
        }
        
        # Топ клиентов по прибыли
        client_profits = {}
        for record in records:
            if record.client_name:
                if record.client_name not in client_profits:
                    client_profits[record.client_name] = 0
                client_profits[record.client_name] += record.net_profit or 0
        
        top_clients = sorted(client_profits.items(), key=lambda x: x[1], reverse=True)[:5]
        
        # Топ маршрутов по прибыли
        route_profits = {}
        for record in records:
            route = f"{record.route_from} → {record.route_to}"
            if route not in route_profits:
                route_profits[route] = 0
            route_profits[route] += record.net_profit or 0
        
        top_routes = sorted(route_profits.items(), key=lambda x: x[1], reverse=True)[:5]
        
        summary = {
            "period": f"{date_from} - {date_to}" if date_from and date_to else "Все время",
            "total_records": total_records,
            "total_revenue": float(total_revenue),
            "total_partner_costs": float(total_partner_costs),
            "total_ebitda": float(total_ebitda),
            "total_tax": float(total_tax),
            "total_net_profit": float(total_net_profit),
            "average_margin": round(float(average_margin), 2),
            "average_ebitda": round(float(average_ebitda), 2),
            "profitability_levels": profitability_levels,
            "top_clients": [{"client": client, "profit": float(profit)} for client, profit in top_clients],
            "top_routes": [{"route": route, "profit": float(profit)} for route, profit in top_routes]
        }
        
        logger.info(f"Получена сводная статистика по управленческому учету")
        
        return summary
        
    except Exception as e:
        logger.error(f"Ошибка при получении статистики управленческого учета: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при получении статистики")

@router.get("/stats/monthly")
async def get_monthly_stats(
    year: int = Query(..., description="Год для статистики"),
    db: Session = Depends(get_db)
):
    """
    Получить месячную статистику по управленческому учету
    """
    try:
        # Получаем данные за указанный год
        records = db.query(ManagementRecord).filter(
            func.extract('year', ManagementRecord.date) == year
        ).all()
        
        monthly_stats = {}
        
        for month in range(1, 13):
            month_records = [r for r in records if r.date.month == month]
            
            if month_records:
                month_revenue = sum(r.incoming_amount for r in month_records if r.incoming_amount)
                month_profit = sum(r.net_profit for r in month_records if r.net_profit)
                month_count = len(month_records)
                month_margin = month_profit / month_revenue * 100 if month_revenue > 0 else 0
                
                monthly_stats[month] = {
                    "month": month,
                    "records_count": month_count,
                    "revenue": float(month_revenue),
                    "profit": float(month_profit),
                    "margin": round(float(month_margin), 2)
                }
            else:
                monthly_stats[month] = {
                    "month": month,
                    "records_count": 0,
                    "revenue": 0,
                    "profit": 0,
                    "margin": 0
                }
        
        # Преобразуем в список для удобства
        monthly_list = list(monthly_stats.values())
        
        # Сортируем по месяцам
        monthly_list.sort(key=lambda x: x["month"])
        
        result = {
            "year": year,
            "monthly_stats": monthly_list,
            "total_records": sum(m["records_count"] for m in monthly_list),
            "total_revenue": sum(m["revenue"] for m in monthly_list),
            "total_profit": sum(m["profit"] for m in monthly_list),
            "average_margin": sum(m["margin"] for m in monthly_list) / 12 if monthly_list else 0
        }
        
        logger.info(f"Получена месячная статистика за {year} год")
        
        return result
        
    except Exception as e:
        logger.error(f"Ошибка при получении месячной статистики: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при получении месячной статистики")

@router.post("/quick-calculate")
async def quick_calculate(
    incoming_amount: float = Query(..., ge=0, description="Входящая сумма"),
    partner_cost: float = Query(..., ge=0, description="Стоимость партнера"),
    tax_rate: float = Query(7.0, ge=0, le=100, description="Налоговая ставка в процентах")
):
    """
    Быстрый расчет метрик управленческого учета
    """
    try:
        # Расчет метрик
        ebitda = incoming_amount - partner_cost
        tax_amount = incoming_amount * (tax_rate / 100)
        net_profit = ebitda - tax_amount
        margin_percent = (net_profit / incoming_amount) * 100 if incoming_amount > 0 else 0
        
        # Определение уровня прибыльности
        if margin_percent >= 30:
            profitability_level = "Высокая"
        elif margin_percent >= 20:
            profitability_level = "Средняя"
        elif margin_percent >= 10:
            profitability_level = "Низкая"
        else:
            profitability_level = "Критическая"
        
        result = {
            "incoming_amount": incoming_amount,
            "partner_cost": partner_cost,
            "ebitda": round(ebitda, 2),
            "tax_rate": tax_rate,
            "tax_amount": round(tax_amount, 2),
            "net_profit": round(net_profit, 2),
            "margin_percent": round(margin_percent, 2),
            "profitability_level": profitability_level,
            "partner_share_percent": round((partner_cost / incoming_amount) * 100, 2) if incoming_amount > 0 else 0,
            "profit_share_percent": round((ebitda / incoming_amount) * 100, 2) if incoming_amount > 0 else 0
        }
        
        logger.info(f"Выполнен быстрый расчет для суммы {incoming_amount}")
        
        return result
        
    except Exception as e:
        logger.error(f"Ошибка при быстром расчете: {e}")
        raise HTTPException(status_code=500, detail="Ошибка при расчете")
