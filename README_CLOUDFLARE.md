# Déploiement Cloudflare Pages + Workers

Ce projet est configuré pour être déployé sur Cloudflare Pages avec support Workers.

## 🚀 Déploiement rapide

### Option 1: Via GitHub Actions (Recommandé)

1. **Configurer les secrets GitHub** :

   - Allez dans Settings > Secrets and variables > Actions
   - Ajoutez :
     - `CLOUDFLARE_API_TOKEN` : Créez un token avec permissions Pages dans [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
     - `CLOUDFLARE_ACCOUNT_ID` : Trouvez-le dans l'URL de votre dashboard Cloudflare

2. **Le déploiement se fait automatiquement** lors des push sur `main` ou `master`

### Option 2: Via Cloudflare Dashboard

1. Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com/) > Pages
2. Cliquez sur **Create a project** > **Connect to Git**
3. Sélectionnez votre repository
4. Configurez :
   - **Framework preset**: None
   - **Build command**: `bash cloudflare-build.sh`
   - **Build output directory**: `gui/dist`
   - **Root directory**: `.`
   - **Node version**: `20.19.0`

## 📁 Structure des fichiers

- `wrangler.toml` : Configuration Workers et Pages
- `cloudflare-build.sh` : Script de build pour Cloudflare
- `cloudflare.json` : Configuration alternative pour Cloudflare Dashboard
- `.github/workflows/cloudflare-pages.yml` : Workflow GitHub Actions
- `gui/dist/_redirects` : Routing SPA pour React Router
- `gui/dist/functions/` : Workers Functions (optionnel)

## 🔧 Configuration Workers Functions

Si vous avez besoin d'API endpoints, créez des fichiers dans `gui/dist/functions/` :

```
gui/dist/functions/
  ├── _middleware.js          # Middleware global
  └── api/
      └── hello.js            # Exemple: /api/hello
```

Exemple de Workers Function :

```javascript
// gui/dist/functions/api/hello.js
export async function onRequestGet(request) {
  return new Response(JSON.stringify({ message: "Hello from Workers!" }), {
    headers: { "Content-Type": "application/json" },
  });
}
```

## 🌐 Routing

Le fichier `_redirects` configure le routing SPA :

- Toutes les routes sont redirigées vers `/index.html` avec un status 200
- React Router gère ensuite le routing côté client

## 🔐 Variables d'environnement

Configurez dans Cloudflare Dashboard > Pages > Settings > Environment variables :

Variables communes :

- `NODE_VERSION`: `20.19.0`
- Variables d'API keys si nécessaire
- Variables de configuration de l'application

## 📊 Monitoring

- **Analytics** : Disponible dans Cloudflare Dashboard > Pages > Analytics
- **Logs** : Cloudflare Dashboard > Pages > Deployments > View build logs
- **Real-time Logs** : Utilisez Wrangler CLI : `wrangler pages tail`

## 🛠️ Commandes locales

Tester le build localement :

```bash
bash cloudflare-build.sh
```

Déployer manuellement avec Wrangler :

```bash
npm install -g wrangler
wrangler pages deploy gui/dist --project-name=continue
```

## 🔄 Custom Domains

Pour ajouter un domaine personnalisé :

1. Cloudflare Dashboard > Pages > votre-projet > Custom domains
2. Ajoutez votre domaine
3. Suivez les instructions DNS

## 📝 Notes

- Le build nécessite Node.js 20.19.0 minimum
- Les packages locaux doivent être buildés avant le GUI
- Le dossier `gui/dist/` est généré lors du build
