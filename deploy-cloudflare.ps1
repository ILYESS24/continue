# Script PowerShell pour déployer sur Cloudflare Pages
# Prérequis: Wrangler CLI installé globalement

Write-Host "🚀 Déploiement sur Cloudflare Pages..." -ForegroundColor Cyan

# Vérifier si Wrangler est installé
$wranglerInstalled = Get-Command wrangler -ErrorAction SilentlyContinue
if (-not $wranglerInstalled) {
    Write-Host "⚠️  Wrangler CLI n'est pas installé. Installation..." -ForegroundColor Yellow
    npm install -g wrangler
}

# Vérifier si on est authentifié
Write-Host "🔐 Vérification de l'authentification Cloudflare..." -ForegroundColor Cyan
wrangler whoami

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Vous devez vous authentifier avec Cloudflare." -ForegroundColor Red
    Write-Host "Exécutez: wrangler login" -ForegroundColor Yellow
    exit 1
}

# Build du projet
Write-Host "`n📦 Build du projet..." -ForegroundColor Cyan
bash cloudflare-build.sh

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Le build a échoué!" -ForegroundColor Red
    exit 1
}

# Déployer sur Cloudflare Pages
Write-Host "`n🌐 Déploiement sur Cloudflare Pages..." -ForegroundColor Cyan
wrangler pages deploy gui/dist --project-name=continue

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Déploiement réussi!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Le déploiement a échoué!" -ForegroundColor Red
    exit 1
}

