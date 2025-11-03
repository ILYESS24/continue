# Script PowerShell pour déployer sur Cloudflare Pages
# Usage: .\deploy-cloudflare.ps1

Write-Host "🚀 Déploiement Cloudflare Pages" -ForegroundColor Cyan
Write-Host ""

# Vérifier Wrangler
if (-not (Get-Command wrangler -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Wrangler n'est pas installé!" -ForegroundColor Red
    Write-Host "Installez avec: npm install -g wrangler" -ForegroundColor Yellow
    exit 1
}

# Vérifier l'authentification
Write-Host "🔐 Vérification de l'authentification..." -ForegroundColor Yellow
$whoami = wrangler whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Non authentifié. Lancement de wrangler login..." -ForegroundColor Yellow
    wrangler login
}

# Build
Write-Host "`n📦 Build du projet..." -ForegroundColor Yellow
bash cloudflare-build.sh
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build échoué!" -ForegroundColor Red
    exit 1
}

# Demander le nom du projet
Write-Host "`n📝 Nom du projet Cloudflare Pages:" -ForegroundColor Cyan
$projectName = Read-Host "Entrez le nom (ou appuyez sur Entrée pour 'continue-app')"
if ([string]::IsNullOrWhiteSpace($projectName)) {
    $projectName = "continue-app"
}

# Déployer
Write-Host "`n🚀 Déploiement sur Cloudflare Pages..." -ForegroundColor Yellow
wrangler pages deploy gui/dist --project-name=$projectName

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Déploiement réussi!" -ForegroundColor Green
    Write-Host "`n📋 Prochaines étapes:" -ForegroundColor Cyan
    Write-Host "1. Configurez les variables d'environnement dans le Dashboard Cloudflare" -ForegroundColor White
    Write-Host "2. Vérifiez que les Functions sont actives" -ForegroundColor White
    Write-Host "3. Testez l'application sur l'URL fournie" -ForegroundColor White
} else {
    Write-Host "`n❌ Déploiement échoué!" -ForegroundColor Red
    exit 1
}

