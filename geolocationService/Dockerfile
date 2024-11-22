# Используем официальный образ Python
FROM python:3.12.4-slim

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Устанавливаем Poetry через pip
RUN pip install --no-cache-dir poetry

# Копируем файлы pyproject.toml и poetry.lock
COPY pyproject.toml poetry.lock* ./

# Устанавливаем зависимости через Poetry
RUN poetry install --no-interaction

# Копируем всё приложение
COPY . .

# Открываем порт, на котором будет работать FastAPI
EXPOSE 8001

# Команда запуска FastAPI через Uvicorn
CMD ["python", "-m", "main"]