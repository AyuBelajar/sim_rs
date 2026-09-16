$ErrorActionPreference = "Stop"

$PHP84 = "$env:USERPROFILE\.config\herd\bin\php84\php.exe"

Write-Host ""
Write-Host "=== SIMRS QA ==="
Write-Host ""

Write-Host "[1/5] PHP Version"
& $PHP84 -v

Write-Host ""
Write-Host "[2/5] Laravel Environment"
& $PHP84 artisan about

Write-Host ""
Write-Host "[3/5] Migration Status"
& $PHP84 artisan migrate:status

Write-Host ""
Write-Host "[4/5] Backend Tests"
& $PHP84 artisan test

if ($LASTEXITCODE -ne 0) {
    throw "Backend tests failed."
}

Write-Host ""
Write-Host "[5/5] Frontend Production Build"
npm run build

if ($LASTEXITCODE -ne 0) {
    throw "Frontend build failed."
}

Write-Host ""
Write-Host "=============================="
Write-Host " SIMRS QA PASSED"
Write-Host "=============================="