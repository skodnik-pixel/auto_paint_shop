# Скрипт для открытия браузера с указанным URL
param(
    [string]$Url = "http://127.0.0.1:8000/"
)

Write-Host "Открываю браузер: $Url" -ForegroundColor Green
Start-Process $Url

