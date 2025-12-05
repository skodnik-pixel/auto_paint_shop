#!/bin/bash

echo "========================================"
echo "Настройка виртуального окружения"
echo "========================================"
echo ""

cd backend

echo "[1/4] Создание виртуального окружения..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "ОШИБКА: Не удалось создать виртуальное окружение"
    echo "Убедитесь, что Python установлен"
    exit 1
fi

echo "[2/4] Активация виртуального окружения..."
source venv/bin/activate

echo "[3/4] Установка зависимостей..."
pip install --upgrade pip
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ОШИБКА: Не удалось установить зависимости"
    exit 1
fi

echo "[4/4] Создание файла .env..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Файл .env создан из .env.example"
    echo "ВАЖНО: Отредактируйте .env и установите SECRET_KEY!"
else
    echo "Файл .env уже существует"
fi

echo ""
echo "========================================"
echo "Настройка завершена!"
echo "========================================"
echo ""
echo "Следующие шаги:"
echo "1. Активируйте виртуальное окружение: source venv/bin/activate"
echo "2. Выполните миграции: python manage.py migrate"
echo "3. Создайте суперпользователя: python manage.py createsuperuser"
echo "4. Запустите сервер: python manage.py runserver"
echo ""

