# Guide de Déploiement Cloudflare Pages + Workers

## 🚀 Déploiement Complet sur Cloudflare

Ce guide vous permet de déployer l'application Continue entièrement sur Cloudflare Pages + Workers.

## 📋 Prérequis

1. **Compte Cloudflare** avec un plan Workers Paid (~$5/mois)
2. **Wrangler CLI** installé : `npm install -g wrangler`
3. **Authentification** : `wrangler login`

## 🛠️ Installation

```bash
# Installer Wrangler CLI
npm install -g wrangler

# S'authentifier
wrangler login
```

## 📦 Étape 1: Créer le Projet Cloudflare Pages

### Option A: Via Dashboard (Recommandé)

1. Aller sur https://dash.cloudflare.com
2. Pages → Create a project
3. Connecter votre repository GitHub
4. Configurer :
   - **Build command** : `bash cloudflare-build.sh`
   - **Build output directory** : `gui/dist`
   - **Root directory** : `/`

### Option B: Via Wrangler CLI

```bash
wrangler pages project create continue-app
```

## 🔧 Étape 2: Créer KV Namespaces (Optionnel - pour sessions)

```bash
# Créer un namespace KV pour les sessions
wrangler kv:namespace create "SESSIONS"
wrangler kv:namespace create "SESSIONS" --preview

# Copier les IDs retournés dans wrangler.toml
# [[kv_namespaces]]
# binding = "SESSIONS"
# id = "votre-id-production"
# preview_id = "votre-id-preview"
```

## 🔐 Étape 3: Configurer les Variables d'Environnement

Dans le Dashboard Cloudflare Pages :

1. Allez dans votre projet → Settings → Environment Variables
2. Ajoutez :
   - `ANTHROPIC_API_KEY` (votre clé Anthropic)
   - `OPENAI_API_KEY` (optionnel)
   - `GROQ_API_KEY` (optionnel)
   - `MISTRAL_API_KEY` (optionnel)

Ou via Wrangler CLI :

```bash
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put OPENAI_API_KEY
wrangler secret put GROQ_API_KEY
wrangler secret put MISTRAL_API_KEY
```

## 🚀 Étape 4: Déployer

### Via Git (Automatique - Recommandé)

1. Connectez votre repo GitHub à Cloudflare Pages
2. Chaque push sur `main` déclenchera un déploiement automatique

### Via Wrangler CLI (Manuel)

```bash
# Build
bash cloudflare-build.sh

# Déployer
wrangler pages deploy gui/dist --project-name=continue-app
```

## 📁 Structure des Fichiers

```
.
├── wrangler.toml              # Configuration Cloudflare
├── cloudflare-build.sh         # Script de build
├── functions/
│   └── api/
│       ├── config.js           # Function GET/POST /api/config
│       └── message.js          # Function POST /api/message
└── gui/
    └── dist/                   # Output du build (Pages)
```

## ✅ Vérification

Une fois déployé, votre application sera accessible sur :

- `https://continue-app.pages.dev` (ou votre domaine personnalisé)

## 🔍 Dépannage

### Build échoue

- Vérifiez que `cloudflare-build.sh` est exécutable : `chmod +x cloudflare-build.sh`
- Vérifiez les logs dans Cloudflare Dashboard → Pages → Deployments

### Functions ne fonctionnent pas

- Vérifiez que les fichiers sont dans `functions/api/`
- Vérifiez les variables d'environnement dans le Dashboard

### Erreurs CORS

- Les headers CORS sont déjà configurés dans les functions
- Vérifiez que les routes `/api/*` sont bien mappées

## 💰 Coûts Cloudflare

- **Pages** : Gratuit
- **Workers Paid Plan** : ~$5/mois
  - 10 millions de requêtes/mois gratuits
  - Puis $0.50 par million
- **KV** : Gratuit (avec limites)
- **Bandwidth** : Illimité sur plans payants

## 🎯 Avantages vs Vercel

✅ CDN global ultra-rapide  
✅ Bandwidth illimité (plans payants)  
✅ Workers serverless intégrés  
✅ KV storage pour sessions  
✅ Durable Objects (optionnel)

## 📝 Notes

- Les functions Cloudflare Pages sont automatiquement détectées dans `functions/`
- Le format est différent de Vercel (pas besoin de `export default`)
- Les variables d'environnement sont accessibles via `context.env`
