# Déploiement rapide Cloudflare - Version minimale
param([switch]$SkipBuild)

$accountId = "8bd76b0efde1b2dbe3964b76d43960ff"

if (-not $SkipBuild) {
    Write-Host "⚠️ Pour un déploiement complet, exécutez d'abord:" -ForegroundColor Yellow
    Write-Host "   bash cloudflare-build.sh" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Ou utilisez: .\quick-deploy.ps1 -SkipBuild si le build existe déjà" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "gui\dist\index.html")) {
    Write-Host "❌ Le dossier gui\dist n'existe pas ou n'est pas buildé!" -ForegroundColor Red
    exit 1
}

# Créer _redirects si nécessaire
if (-not (Test-Path "gui\dist\_redirects")) {
    "/*    /index.html   200" | Out-File -FilePath "gui\dist\_redirects" -Encoding utf8
    Write-Host "✅ Fichier _redirects créé" -ForegroundColor Green
}

Write-Host "🚀 Déploiement sur Cloudflare Pages..." -ForegroundColor Cyan
wrangler pages deploy gui/dist --project-name=continue --account-id=$accountId

