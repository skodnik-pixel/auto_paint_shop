# PowerShell скрипт для запуска всего проекта (Backend + Frontend)
# Использование: .\start-dev.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Запуск проекта Auto Paint Shop" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Проверяем, что мы в корневой директории проекта
if (-not (Test-Path "backend\manage.py") -or -not (Test-Path "frontend\package.json")) {
    Write-Host "ОШИБКА: Скрипт должен запускаться из корневой директории проекта!" -ForegroundColor Red
    exit 1
}

# Функция для остановки всех процессов при выходе
function Cleanup {
    Write-Host ""
    Write-Host "Остановка серверов..." -ForegroundColor Yellow
    if ($backendJob) { 
        Stop-Job -Job $backendJob -ErrorAction SilentlyContinue
        Remove-Job -Job $backendJob -ErrorAction SilentlyContinue
    }
    if ($frontendJob) { 
        Stop-Job -Job $frontendJob -ErrorAction SilentlyContinue
        Remove-Job -Job $frontendJob -ErrorAction SilentlyContinue
    }
    # Останавливаем процессы Python и Node
    Get-Process python -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*manage.py runserver*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*react-scripts*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "Серверы остановлены." -ForegroundColor Green
}

# Обработка Ctrl+C
$null = Register-EngineEvent PowerShell.Exiting -Action { Cleanup }

Write-Host "[1/2] Запуск Django сервера (Backend)..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location backend
    python manage.py runserver
}

# Ждем запуска backend
Start-Sleep -Seconds 3

Write-Host "[2/2] Запуск React сервера (Frontend)..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location frontend
    npm start
}

# Ждем запуска frontend
Start-Sleep -Seconds 5

# Открываем браузеры
Write-Host ""
Write-Host "Открываю браузеры..." -ForegroundColor Green
Start-Process "http://127.0.0.1:8000/"  # Backend API
Start-Sleep -Seconds 1
Start-Process "http://localhost:3000"  # Frontend

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Серверы запущены!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API:  http://127.0.0.1:8000/" -ForegroundColor Cyan
Write-Host "Frontend:     http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Для остановки нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Показываем логи
try {
    while ($true) {
        $backendOutput = Receive-Job -Job $backendJob -ErrorAction SilentlyContinue
        $frontendOutput = Receive-Job -Job $frontendJob -ErrorAction SilentlyContinue
        
        if ($backendOutput) {
            foreach ($line in $backendOutput) {
                if ($line) {
                    Write-Host "[Backend] $line" -ForegroundColor Blue
                }
            }
        }
        if ($frontendOutput) {
            foreach ($line in $frontendOutput) {
                if ($line) {
                    Write-Host "[Frontend] $line" -ForegroundColor Magenta
                }
            }
        }
        
        # Проверяем, не завершились ли задачи
        if ($backendJob.State -eq "Completed" -or $backendJob.State -eq "Failed") {
            Write-Host "[Backend] Сервер остановлен" -ForegroundColor Red
            break
        }
        if ($frontendJob.State -eq "Completed" -or $frontendJob.State -eq "Failed") {
            Write-Host "[Frontend] Сервер остановлен" -ForegroundColor Red
            break
        }
        
        Start-Sleep -Milliseconds 500
    }
} catch {
    Write-Host "Ошибка: $_" -ForegroundColor Red
} finally {
    Cleanup
}

