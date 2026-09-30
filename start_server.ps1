# One-click Windows local development server for LionStone Floors
$ScriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Definition }
if (-not $ScriptDir) { $ScriptDir = (Get-Location).Path }

Set-Location $ScriptDir

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host " Starting LionStone Floors Lead Capture Server       " -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "Serving Folder:  $ScriptDir" -ForegroundColor White
Write-Host "Server URL:      http://localhost:3000" -ForegroundColor Yellow
Write-Host "Lead Destination: estimating@lionstonefloors.com" -ForegroundColor Cyan
Write-Host "Lead Logs:       leads.json & leads.csv" -ForegroundColor Gray
Write-Host "Press Ctrl+C in this window to stop the server.`n" -ForegroundColor Gray

Start-Process "http://localhost:3000"
python server.py 3000
