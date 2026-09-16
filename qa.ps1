$ErrorActionPreference = "Stop"

$PHP84 = "$env:USERPROFILE\.config\herd\bin\php84\php.exe"

Write-Host ""
Write-Host "=================================="
Write-Host " SIMRS Integration QA"
Write-Host "=================================="
Write-Host ""

if (-not (Test-Path $PHP84)) {
    throw "PHP 8.4 Herd tidak ditemukan: $PHP84"
}

if (-not (Test-Path ".env.testing")) {
    throw ".env.testing tidak ditemukan. Automated test dibatalkan."
}

$testingEnv = Get-Content ".env.testing" -Raw

if (
    $testingEnv -match "supabase\.com" -and
    $testingEnv -match "DB_DATABASE=postgres"
) {
    throw "BAHAYA: .env.testing menunjuk ke database Supabase bersama. Test dibatalkan."
}

Write-Host "[1/5] PHP"
& $PHP84 -v

if ($LASTEXITCODE -ne 0) {
    throw "PHP check gagal."
}

Write-Host ""
Write-Host "[2/5] Laravel"
& $PHP84 artisan about

if ($LASTEXITCODE -ne 0) {
    throw "Laravel check gagal."
}

Write-Host ""
Write-Host "[3/5] Development migration status"
& $PHP84 artisan migrate:status

if ($LASTEXITCODE -ne 0) {
    throw "Migration status gagal."
}

Write-Host ""
Write-Host "[4/5] Automated backend tests"
& $PHP84 artisan test

if ($LASTEXITCODE -ne 0) {
    throw "Backend tests gagal."
}

Write-Host ""
Write-Host "[5/5] Frontend production build"
npm run build

if ($LASTEXITCODE -ne 0) {
    throw "Frontend build gagal."
}

Write-Host ""
Write-Host "=================================="
Write-Host " SIMRS QA PASSED"
Write-Host "=================================="