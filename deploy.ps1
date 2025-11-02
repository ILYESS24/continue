# Script de déploiement Cloudflare direct
$ErrorActionPreference = "Stop"

Write-Host "🚀 Déploiement Cloudflare Pages..." -ForegroundColor Cyan

# Account ID depuis l'auth précédente
$accountId = "8bd76b0efde1b2dbe3964b76d43960ff"

# Vérifier si le build existe
if (-not (Test-Path "gui\dist\index.html")) {
    Write-Host "📦 Build nécessaire..." -ForegroundColor Yellow
    Write-Host "Construction en cours (cela peut prendre quelques minutes)..." -ForegroundColor Yellow
    
    # Install root deps
    npm ci
    
    # Build packages
    node ./scripts/build-packages.js
    
    # Build core
    cd core
    npm ci
    npm run build
    cd ..
    
    # Build GUI
    cd gui
    npm ci
    npm run build
    cd ..
    
    # Créer _redirects
    New-Item -ItemType Directory -Path "gui\dist" -Force | Out-Null
    "/*    /index.html   200" | Out-File -FilePath "gui\dist\_redirects" -Encoding utf8
}

# Déployer
Write-Host "`n🌐 Déploiement sur Cloudflare Pages..." -ForegroundColor Cyan
wrangler pages deploy gui/dist --project-name=continue --account-id=$accountId

Write-Host "`n✅ Déploiement terminé!" -ForegroundColor Green

