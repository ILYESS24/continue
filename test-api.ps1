# Script de test pour vérifier l'API
$url = "https://0a8f3daa.continue-6p4.pages.dev/api/config"

Write-Host "Test de l'endpoint /api/config..." -ForegroundColor Cyan

try {
    $response = Invoke-WebRequest -Uri $url -Method GET -UseBasicParsing
    $json = $response.Content | ConvertFrom-Json
    
    Write-Host "`n✅ Réponse reçue!" -ForegroundColor Green
    Write-Host "Status: $($json.status)" -ForegroundColor Yellow
    
    if ($json.content) {
        Write-Host "`nContent trouvé:" -ForegroundColor Green
        if ($json.content.result) {
            Write-Host "  - result: ✅" -ForegroundColor Green
            if ($json.content.result.config) {
                Write-Host "    - config: ✅" -ForegroundColor Green
                if ($json.content.result.config.models) {
                    $modelCount = $json.content.result.config.models.Count
                    Write-Host "    - models: $modelCount modèles" -ForegroundColor Cyan
                } else {
                    Write-Host "    - models: ❌ MANQUANT" -ForegroundColor Red
                }
            } else {
                Write-Host "    - config: ❌ MANQUANT" -ForegroundColor Red
            }
        } else {
            Write-Host "  - result: ❌ MANQUANT" -ForegroundColor Red
        }
        if ($json.content.profileId) {
            Write-Host "  - profileId: ✅" -ForegroundColor Green
        }
    } else {
        Write-Host "`n❌ Pas de content dans la réponse!" -ForegroundColor Red
    }
    
    Write-Host "`nRéponse complète:" -ForegroundColor Yellow
    $json | ConvertTo-Json -Depth 5 | Write-Host
    
} catch {
    Write-Host "`n❌ Erreur: $_" -ForegroundColor Red
}

