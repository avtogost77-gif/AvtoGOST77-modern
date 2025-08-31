FROM python:3.11-slim

WORKDIR /app

# Копируем requirements.txt
COPY requirements.txt .

# Устанавливаем только основные зависимости без compilation
RUN pip install --no-cache-dir --no-compile uvicorn fastapi pydantic python-dotenv loguru

# Копируем приложение
COPY . .

# Создаем директории для логов и загрузок
RUN mkdir -p /app/logs /app/uploads

# Экспонируем порт
EXPOSE 8000

# Команда запуска
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]