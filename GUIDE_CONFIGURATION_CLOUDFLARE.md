# Guide : Configuration Cloudflare Pages - Où trouver les paramètres

## ⚠️ Problème : Les options ne sont pas visibles

Si vous ne voyez pas les options de build dans Settings, c'est probablement parce que :

1. Le projet a été créé via GitHub Actions (déploiement automatique)
2. Cloudflare Pages en mode "automatique" cache certaines options

## ✅ SOLUTION 1 : Vérifier via l'interface Cloudflare

### Étapes détaillées :

1. **Allez sur** : https://dash.cloudflare.com/
2. **Cliquez sur** : **Pages** (menu gauche)
3. **Sélectionnez** : Votre projet `continue`
4. **Dans la page du projet**, vous devriez voir plusieurs onglets :

   - **Deployments** (par défaut)
   - **Custom domains**
   - **Settings** ← **CLIQUEZ ICI**
   - **Analytics**
   - **Functions**

5. **Dans Settings**, cherchez les sections suivantes :
   - **Builds & deployments** ← Section principale
   - **Environment variables**
   - **Functions**

## ✅ SOLUTION 2 : Si "Settings" n'existe pas

Si vous ne voyez pas l'onglet Settings :

### Option A : Recréer le projet depuis le Dashboard

1. **Supprimez** le projet actuel (Settings → General → Delete project)
2. **Créez un nouveau projet** :
   - Cliquez sur **"Create a project"**
   - Sélectionnez **"Connect to Git"**
   - Choisissez votre repository GitHub
   - **Là, vous verrez les options de build** :
     - Framework preset
     - Build command
     - Build output directory

### Option B : Utiliser Wrangler CLI pour configurer

```bash
# Installer Wrangler si pas déjà fait
npm install -g wrangler

# Se connecter
wrangler login

# Voir la configuration actuelle
wrangler pages project list

# Voir les settings du projet
wrangler pages project view continue
```

## ✅ SOLUTION 3 : Configuration via fichier `_functions.json` (Alternative)

Si vous ne pouvez pas accéder aux Settings, créez un fichier de configuration :

### Créer `_functions.json` à la racine :

```json
{
  "version": 1,
  "routes": [
    {
      "pattern": "/api/*",
      "script": "functions/api/[...path].js"
    }
  ]
}
```

Mais Cloudflare Pages détecte automatiquement `functions/` sans ce fichier.

## ✅ SOLUTION 4 : Vérifier via l'API Cloudflare

Vous pouvez aussi vérifier/modifier les settings via l'API :

1. Obtenez votre **API Token** : https://dash.cloudflare.com/profile/api-tokens
2. Utilisez cette commande :

```bash
curl -X GET "https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/pages/projects/continue" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## 📍 LOCALISATION EXACTE dans le Dashboard

```
Cloudflare Dashboard
└── Pages (menu gauche)
    └── continue (votre projet)
        ├── Deployments (onglet)
        ├── Custom domains (onglet)
        ├── Settings (onglet) ← ICI !
        │   ├── General
        │   ├── Builds & deployments ← ICI les paramètres !
        │   ├── Environment variables
        │   └── Functions
        ├── Analytics (onglet)
        └── Functions (onglet)
```

## 🔍 Si vous êtes sur mobile ou vue simplifiée

Le Dashboard Cloudflare peut avoir une vue différente selon l'appareil :

- Essayez sur **desktop/ordinateur** pour voir toutes les options
- Vérifiez que vous avez les **permissions admin** sur le compte

## 🆘 Dernière solution : Contactez-moi avec un screenshot

Si rien ne fonctionne, envoyez-moi :

1. Une capture d'écran de la page de votre projet Cloudflare Pages
2. Une capture d'écran de ce que vous voyez dans "Settings"

Je pourrai vous guider plus précisément !
