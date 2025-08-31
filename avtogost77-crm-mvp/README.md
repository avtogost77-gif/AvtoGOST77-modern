# 🚛 АВТОГОСТ77 CRM - MVP

**Проект:** MVP CRM система для логистической компании АвтоГОСТ77  
**Дата создания:** 31 августа 2025  
**Статус:** В разработке  
**Срок:** 7 дней (31 августа - 7 сентября 2025)  

## 🎯 **ЦЕЛЬ ПРОЕКТА:**
Создать MVP версию CRM системы для логистической компании с базовым функционалом за 1 неделю.

## 🏗️ **ТЕХНИЧЕСКАЯ АРХИТЕКТУРА:**
- **Frontend:** HTML5 + SCSS + Vanilla JavaScript
- **Backend:** Python 3.11 + FastAPI + PostgreSQL
- **Deployment:** Docker + Docker Compose + Nginx

## 🚀 **БЫСТРЫЙ СТАРТ:**

### **Разработка:**
```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
# Открыть index.html в браузере
```

### **Docker:**
```bash
docker-compose up -d
```

## 📋 **ФУНКЦИОНАЛ MVP:**
1. ✅ Управление заявками (CRUD)
2. ✅ Реестр партнеров
3. ✅ Управленческий учет
4. ✅ Базовая аналитика

## 📁 **СТРУКТУРА ПРОЕКТА:**
```
avtogost77-crm-mvp/
├── backend/          # Python FastAPI backend
├── frontend/         # HTML + SCSS + JavaScript
├── nginx/            # Nginx конфигурация
├── docker-compose.yml
└── README.md
```

---

**© 2025 АвтоГОСТ77. MVP CRM система.**
