# PowerShell скрипт для запуска Django сервера с автоматическим открытием браузера
Write-Host "Запуск Django сервера..." -ForegroundColor Green
Write-Host ""

# Переходим в директорию скрипта
Set-Location $PSScriptRoot

# Запускаем сервер в фоновом процессе
$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:PSScriptRoot
    python manage.py runserver
}

# Ждем 2 секунды для запуска сервера
Start-Sleep -Seconds 2

# Открываем браузер
Write-Host "Открываю браузер: http://127.0.0.1:8000/" -ForegroundColor Yellow
Start-Process "http://127.0.0.1:8000/"

Write-Host ""
Write-Host "Сервер запущен на http://127.0.0.1:8000/" -ForegroundColor Green
Write-Host "Браузер должен открыться автоматически." -ForegroundColor Green
Write-Host ""
Write-Host "Для остановки сервера нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Ждем завершения сервера и показываем вывод
try {
    Receive-Job -Job $serverJob -Wait
} finally {
    Stop-Job -Job $serverJob
    Remove-Job -Job $serverJob
}

