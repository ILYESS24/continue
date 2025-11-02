# Guide de déploiement sur Cloudflare Pages + Workers

Ce guide explique comment déployer le projet Continue sur Cloudflare Pages avec Workers.

## Prérequis

1. Un compte Cloudflare avec accès à Pages et Workers
2. Un projet GitHub avec le code source
3. Les secrets suivants configurés dans GitHub Actions :
   - `CLOUDFLARE_API_TOKEN` : Token API Cloudflare avec permissions Pages
   - `CLOUDFLARE_ACCOUNT_ID` : ID du compte Cloudflare

## Configuration automatique via GitHub Actions

Le workflow `.github/workflows/cloudflare-pages.yml` est configuré pour :

- Builder automatiquement le projet lors des push sur `main` ou `master`
- Déployer sur Cloudflare Pages
- Créer des previews pour les pull requests

## Configuration manuelle via Cloudflare Dashboard

1. Allez sur [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Sélectionnez **Pages** dans le menu
3. Cliquez sur **Create a project**
4. Connectez votre repository GitHub
5. Configurez les paramètres de build :
   - **Framework preset**: None (ou Vite si disponible)
   - **Build command**: `bash cloudflare-build.sh`
   - **Build output directory**: `gui/dist`
   - **Root directory**: `.`
   - **Node version**: `20.19.0`

## Variables d'environnement

Si nécessaire, configurez ces variables dans Cloudflare Pages :

- `NODE_VERSION`: `20.19.0`
- Toute autre variable d'environnement requise par l'application

## Configuration Workers (optionnel)

Si vous avez besoin de Workers Functions, ajoutez un dossier `functions` dans `gui/dist/` ou configurez dans `wrangler.toml`.

Exemple de Workers Function :

```javascript
// gui/dist/functions/api/hello.js
export async function onRequest(request) {
  return new Response("Hello from Cloudflare Workers!");
}
```

## Routing SPA

Le fichier `_redirects` dans `gui/dist/` redirige toutes les routes vers `index.html` pour que React Router fonctionne correctement.

## Domaine personnalisé

Pour ajouter un domaine personnalisé :

1. Allez dans les paramètres du projet Pages
2. Cliquez sur **Custom domains**
3. Ajoutez votre domaine
4. Configurez les DNS selon les instructions

## Script de build local

Pour tester le build localement :

```bash
bash cloudflare-build.sh
```

Cela créera les fichiers nécessaires dans `gui/dist/`.

## Dépannage

- Si le build échoue, vérifiez les logs dans Cloudflare Dashboard
- Assurez-vous que Node.js version 20.19.0 est utilisé
- Vérifiez que tous les packages locaux sont bien buildés avant le build du GUI
