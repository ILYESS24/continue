# Déploiement Backend sur Cloudflare

## Architecture

Le projet Continue utilise:

1. **Frontend (GUI)**: Application React déployée sur Cloudflare Pages ✅
2. **Backend API**: Workers Functions pour gérer les requêtes du GUI

## Backend Workers

Le backend est implémenté dans `gui/dist/functions/api/[...path].ts` et expose les endpoints suivants:

- `GET /api/state` - Obtenir l'état actuel du serveur
- `POST /api/message` - Envoyer un message (queue)
- `POST /api/permission` - Approuver/rejeter une permission d'outil
- `POST /api/pause` - Mettre en pause l'exécution actuelle
- `GET /api/diff` - Obtenir le diff git
- `POST /api/exit` - Arrêter le serveur (non applicable en serverless)

## Limitations

⚠️ **Note importante**: Le backend actuel est une version simplifiée. Le serveur Express complet du CLI (`extensions/cli/src/commands/serve.ts`) ne peut pas être déployé directement sur Cloudflare Workers car:

1. Workers utilise le runtime V8, pas Node.js complet
2. Beaucoup de dépendances Node.js ne sont pas disponibles
3. L'état doit être géré différemment (Durable Objects ou KV)

## Solutions pour un backend complet

Pour déployer le backend complet, vous avez plusieurs options:

### Option 1: Cloudflare Workers avec Durable Objects

Adapter le serveur Express pour utiliser Durable Objects pour la persistance d'état.

### Option 2: Service Node.js externe

Déployer le serveur Express sur:

- Railway
- Render
- Fly.io
- AWS Lambda (avec adapter)
- Google Cloud Run

### Option 3: Hybrid

- Frontend sur Cloudflare Pages ✅
- Backend API sur un service Node.js externe
- Configurer CORS approprié

## Configuration CORS

Le Workers backend autorise toutes les origines (`Access-Control-Allow-Origin: *`). Pour la production, configurez des origines spécifiques.

## Prochaines étapes

1. ✅ Frontend déployé sur Cloudflare Pages
2. ✅ Workers Functions backend basique créé
3. ⚠️ Adapter le backend complet pour Workers (nécessite refactoring)
4. ⚠️ Ou déployer le backend Express sur un service Node.js externe
