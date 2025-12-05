@echo off
echo ========================================
echo Настройка виртуального окружения
echo ========================================
echo.

cd backend

echo [1/4] Создание виртуального окружения...
python -m venv venv
if errorlevel 1 (
    echo ОШИБКА: Не удалось создать виртуальное окружение
    echo Убедитесь, что Python установлен и доступен в PATH
    pause
    exit /b 1
)

echo [2/4] Активация виртуального окружения...
call venv\Scripts\activate.bat

echo [3/4] Установка зависимостей...
pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo ОШИБКА: Не удалось установить зависимости
    pause
    exit /b 1
)

echo [4/4] Создание файла .env...
if not exist .env (
    copy .env.example .env
    echo Файл .env создан из .env.example
    echo ВАЖНО: Отредактируйте .env и установите SECRET_KEY!
) else (
    echo Файл .env уже существует
)

echo.
echo ========================================
echo Настройка завершена!
echo ========================================
echo.
echo Следующие шаги:
echo 1. Активируйте виртуальное окружение: venv\Scripts\activate
echo 2. Выполните миграции: python manage.py migrate
echo 3. Создайте суперпользователя: python manage.py createsuperuser
echo 4. Запустите сервер: python manage.py runserver
echo.
pause

