# Guide de Déploiement sur Render

## 🚀 Déploiement sur Render

Ce guide vous permet de déployer l'application Continue sur Render.

## 📋 Prérequis

1. **Compte Render** : Créez un compte sur [render.com](https://render.com)
2. **Repository GitHub** : Votre projet doit être sur GitHub

## 🛠️ Étape 1: Préparer le Projet

Les fichiers suivants sont déjà créés :

- `render.yaml` - Configuration Render
- `render-build.sh` - Script de build
- `server.js` - Serveur Express pour Render
- `package.json` - Avec Express comme dépendance

## 📦 Étape 2: Créer le Service sur Render

### Via Dashboard (Recommandé)

1. **Connecter le Repository** :

   - Allez sur https://dashboard.render.com
   - Cliquez sur **"New"** → **"Web Service"**
   - Connectez votre repository GitHub : `https://github.com/ILYESS24/continue`

2. **Configurer le Service** :

   - **Name** : `continue-app`
   - **Environment** : `Node`
   - **Build Command** : `bash render-build.sh`
   - **Start Command** : `node server.js`
   - **Plan** : Free (ou Starter pour plus de ressources)

3. **Variables d'Environnement** :

   - Allez dans **Environment** → **Environment Variables**
   - Ajoutez :
     - `ANTHROPIC_API_KEY` (votre clé Anthropic)
     - `OPENAI_API_KEY` (optionnel)
     - `GROQ_API_KEY` (optionnel)
     - `MISTRAL_API_KEY` (optionnel)
     - `NODE_ENV` = `production`

4. **Déployer** :
   - Cliquez sur **"Create Web Service"**
   - Render va automatiquement builder et déployer

### Via render.yaml (Alternative)

Si vous utilisez `render.yaml`, Render détectera automatiquement la configuration :

- Le service sera créé avec les paramètres du fichier
- Vous devrez toujours ajouter les variables d'environnement via le Dashboard

## ✅ Vérification

Une fois déployé, votre application sera accessible sur :

- `https://continue-app.onrender.com` (ou votre domaine personnalisé)

## 🔍 Dépannage

### Build échoue

- Vérifiez les logs dans Render Dashboard → Logs
- Vérifiez que `render-build.sh` est exécutable
- Vérifiez que toutes les dépendances sont installées

### Erreurs 404

- Vérifiez que `server.js` est bien à la racine
- Vérifiez que `gui/dist` contient les fichiers buildés

### Erreurs API

- Vérifiez que les variables d'environnement sont bien configurées
- Vérifiez les logs pour les erreurs de connexion

## 💰 Coûts Render

- **Free Plan** : Gratuit
  - 750 heures/mois (suffisant pour un service)
  - Sleep après 15 min d'inactivité
  - Bandwidth limité
- **Starter Plan** : $7/mois
  - Pas de sleep
  - Plus de ressources
  - Bandwidth illimité

## 🎯 Avantages Render

✅ Déploiement automatique depuis Git  
✅ HTTPS automatique  
✅ Variables d'environnement sécurisées  
✅ Logs en temps réel  
✅ Support Express/Node.js natif

## 📝 Notes

- Le serveur Express (`server.js`) gère le routing SPA et les API routes
- Les fichiers statiques sont servis depuis `gui/dist`
- Les routes `/api/*` sont gérées par les handlers dans `api/`
