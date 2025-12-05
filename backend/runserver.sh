#!/bin/bash

echo "Запуск Django сервера..."
echo ""

cd "$(dirname "$0")"

# Запускаем сервер в фоне и открываем браузер через 2 секунды
python manage.py runserver &
SERVER_PID=$!

sleep 2

# Открываем браузер (работает на Linux и Mac)
if command -v xdg-open > /dev/null; then
    # Linux
    xdg-open http://127.0.0.1:8000/
elif command -v open > /dev/null; then
    # Mac
    open http://127.0.0.1:8000/
fi

echo ""
echo "Сервер запущен на http://127.0.0.1:8000/"
echo "Браузер должен открыться автоматически."
echo ""
echo "Для остановки сервера нажмите Ctrl+C"
echo ""

# Ждем завершения сервера
wait $SERVER_PID

