@echo off
echo Запуск Django сервера с автоматическим открытием браузера...
echo.

cd /d %~dp0

REM Используем Python скрипт для кроссплатформенной работы
python runserver.py

pause

