# One-click Windows local development server for LionStone Floors
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host " Starting LionStone Floors Local Development Server  " -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Server running at: http://localhost:8000" -ForegroundColor Yellow
Write-Host "Press Ctrl+C in this window to stop the server.`n" -ForegroundColor Gray

Start-Process "http://localhost:8000"
python -m http.server 8000

