#!/usr/bin/env python
"""
Скрипт для запуска Django сервера с автоматическим открытием браузера
"""
import os
import sys
import time
import threading
import webbrowser
from pathlib import Path

# Добавляем путь к Django проекту
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

def open_browser():
    """Открывает браузер через 2 секунды после запуска сервера"""
    time.sleep(2)
    url = 'http://127.0.0.1:8000/'
    print(f'\nОткрываю браузер: {url}')
    webbrowser.open(url)

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'shop.settings')
    
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    
    # Запускаем открытие браузера в отдельном потоке
    browser_thread = threading.Thread(target=open_browser, daemon=True)
    browser_thread.start()
    
    # Запускаем Django сервер
    execute_from_command_line(['manage.py', 'runserver'])

