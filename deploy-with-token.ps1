# Script de déploiement avec API Token
# Usage: $env:CLOUDFLARE_API_TOKEN="votre-token"; $env:CLOUDFLARE_ACCOUNT_ID="votre-account-id"; .\deploy-with-token.ps1

param(
    [string]$ApiToken = $env:CLOUDFLARE_API_TOKEN,
    [string]$AccountId = $env:CLOUDFLARE_ACCOUNT_ID
)

if (-not $ApiToken) {
    Write-Host "❌ CLOUDFLARE_API_TOKEN n'est pas défini" -ForegroundColor Red
    Write-Host "Définissez-le avec: `$env:CLOUDFLARE_API_TOKEN='votre-token'" -ForegroundColor Yellow
    exit 1
}

if (-not $AccountId) {
    Write-Host "❌ CLOUDFLARE_ACCOUNT_ID n'est pas défini" -ForegroundColor Red
    Write-Host "Définissez-le avec: `$env:CLOUDFLARE_ACCOUNT_ID='votre-id'" -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Déploiement sur Cloudflare Pages avec API Token..." -ForegroundColor Cyan

# Build du projet
Write-Host "`n📦 Build du projet..." -ForegroundColor Cyan
bash cloudflare-build.sh

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Le build a échoué!" -ForegroundColor Red
    exit 1
}

# Déployer avec wrangler
Write-Host "`n🌐 Déploiement sur Cloudflare Pages..." -ForegroundColor Cyan
$env:CLOUDFLARE_API_TOKEN = $ApiToken
wrangler pages deploy gui/dist --project-name=continue --account-id=$AccountId

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Déploiement réussi!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Le déploiement a échoué!" -ForegroundColor Red
    exit 1
}

