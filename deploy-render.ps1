# Script PowerShell pour guider le déploiement Render
# L'API Render nécessite que le repo soit connecté via OAuth d'abord

Write-Host "🚀 Déploiement Render - Guide Automatique" -ForegroundColor Cyan
Write-Host ""

Write-Host "📋 Vérification des fichiers..." -ForegroundColor Yellow
$files = @("render.yaml", "render-build.sh", "server.js", "package.json")
$allPresent = $true

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file manquant" -ForegroundColor Red
        $allPresent = $false
    }
}

if (-not $allPresent) {
    Write-Host "`n❌ Certains fichiers sont manquants!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Tous les fichiers sont présents!" -ForegroundColor Green

Write-Host "`n📝 Instructions de déploiement:" -ForegroundColor Cyan
Write-Host ""
Write-Host "L'API Render nécessite que le repository GitHub soit connecté via OAuth." -ForegroundColor Yellow
Write-Host "La méthode la plus simple est d'utiliser le Dashboard Render:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Ouvrir: https://dashboard.render.com/new/web-service" -ForegroundColor White
Write-Host "2. Cliquer sur 'Connect GitHub' (si pas déjà connecté)" -ForegroundColor White
Write-Host "3. Autoriser Render à accéder à votre compte GitHub" -ForegroundColor White
Write-Host "4. Sélectionner le repository: ILYESS24/continue" -ForegroundColor White
Write-Host "5. Configurer le service:" -ForegroundColor White
Write-Host "   • Name: continue-app" -ForegroundColor Gray
Write-Host "   • Environment: Node" -ForegroundColor Gray
Write-Host "   • Build Command: bash render-build.sh" -ForegroundColor Gray
Write-Host "   • Start Command: node server.js" -ForegroundColor Gray
Write-Host "   • Plan: Free (ou Starter)" -ForegroundColor Gray
Write-Host "6. Ajouter les variables d'environnement:" -ForegroundColor White
Write-Host "   • ANTHROPIC_API_KEY = (votre clé)" -ForegroundColor Gray
Write-Host "   • NODE_ENV = production" -ForegroundColor Gray
Write-Host "7. Cliquer sur 'Create Web Service'" -ForegroundColor White
Write-Host ""
Write-Host "✨ Render va automatiquement:" -ForegroundColor Green
Write-Host "   • Cloner le repository" -ForegroundColor Gray
Write-Host "   • Exécuter le build" -ForegroundColor Gray
Write-Host "   • Démarrer le serveur" -ForegroundColor Gray
Write-Host "   • Fournir une URL" -ForegroundColor Gray
Write-Host ""
Write-Host "🌐 Votre application sera disponible sur: https://continue-app.onrender.com" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Tous les fichiers nécessaires sont déjà dans le repository GitHub!" -ForegroundColor Yellow

