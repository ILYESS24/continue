# Configuration Cloudflare Pages - SOLUTION FINALE

## ⚠️ IMPORTANT : GitHub Actions ne supporte PAS les Pages Functions

Le plugin `cloudflare/pages-action@v1` ne peut pas activer les Pages Functions.

## ✅ SOLUTION : Dashboard Cloudflare avec Intégration Git

### Étape 1 : Configurer le Projet dans Cloudflare Dashboard

1. Allez sur https://dash.cloudflare.com/ > **Pages**
2. Cliquez sur votre projet `continue` ou créez-en un nouveau
3. Allez dans **Settings** > **Builds & deployments**

### Étape 2 : Configuration Build

- **Framework preset**: None
- **Build command**: `bash cloudflare-build.sh`
- **Build output directory**: `gui/dist`
- **Root directory**: `.` (racine du repo)
- **Node version**: `20.19.0`

### Étape 3 : Configuration Functions

Cloudflare détectera **automatiquement** le répertoire `functions/` à la racine et compilera les fichiers `.ts`.

✅ **Le répertoire `functions/api/[...path].ts` est déjà créé !**

### Étape 4 : Variables d'Environnement

Dans **Settings** > **Environment variables**, ajoutez :

- `ANTHROPIC_API_KEY` (votre clé)
- `OPENAI_API_KEY` (optionnel)
- `GROQ_API_KEY` (optionnel)
- `MISTRAL_API_KEY` (optionnel)

### Étape 5 : Déployer

1. Cloudflare détectera automatiquement les changements Git
2. Il compilera les Functions TypeScript en JavaScript
3. Les Functions seront activées automatiquement

## 📋 Résultat Attendu

Après configuration :

- ✅ GET `/api/config` → 200 OK avec la liste des modèles
- ✅ POST `/api/config` → 200 OK
- ✅ POST `/api/message` → 200 OK avec streaming SSE

## 🔍 Vérification

Testez après déploiement :

```bash
curl https://continue-6p4.pages.dev/api/config
# Devrait retourner du JSON avec les modèles
```
