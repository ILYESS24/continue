# Instructions : Redéployer avec connexion Git Cloudflare

## 🎯 Objectif

Redéployer le projet en connectant Cloudflare Pages directement au Git, ce qui permettra aux Functions de fonctionner automatiquement.

## 📝 Étapes détaillées

### ÉTAPE 1 : Accéder au Dashboard Cloudflare

1. Ouvrez votre navigateur
2. Allez sur : **https://dash.cloudflare.com/**
3. Connectez-vous à votre compte

### ÉTAPE 2 : Supprimer l'ancien projet (si nécessaire)

**Option A : Si vous voulez garder l'ancien projet**

- Laissez-le tel quel
- Créez un nouveau projet avec un nom différent (ex: `continue-git`)

**Option B : Si vous voulez remplacer l'ancien projet**

1. Allez dans **Workers & Pages** (menu gauche)
2. Cliquez sur votre projet **continue**
3. Allez dans **Settings**
4. Scrollez jusqu'à **"Delete project"**
5. Confirmez la suppression

### ÉTAPE 3 : Créer un nouveau projet connecté au Git

1. Dans **Workers & Pages**, cliquez sur **"Create a project"** (bouton bleu en haut)
2. Sélectionnez **"Connect to Git"**
3. Autorisez Cloudflare à accéder à votre GitHub si demandé
4. Dans la liste des repositories, sélectionnez : **ILYESS24/continue** (ou votre repo)

### ÉTAPE 4 : Configuration du Build

**Sur la page de configuration qui apparaît, remplissez :**

```
┌─────────────────────────────────────────┐
│ Framework preset:                       │
│ [None ▼]                                 │
├─────────────────────────────────────────┤
│ Build command:                          │
│ [bash cloudflare-build.sh]              │
├─────────────────────────────────────────┤
│ Build output directory:                 │
│ [gui/dist]                              │
├─────────────────────────────────────────┤
│ Root directory:                         │
│ [.]                                     │
└─────────────────────────────────────────┘
```

**Valeurs exactes à entrer :**

- **Framework preset** : Sélectionnez **"None"** dans le menu déroulant
- **Build command** : Tapez exactement : `bash cloudflare-build.sh`
- **Build output directory** : Tapez exactement : `gui/dist`
- **Root directory** : Laissez vide ou tapez : `.`

### ÉTAPE 5 : Déployer

1. Cliquez sur **"Save and Deploy"** en bas de la page
2. Attendez le premier déploiement (2-5 minutes)
3. Une fois terminé, notez l'URL de déploiement (ex: `continue.pages.dev`)

### ÉTAPE 6 : Configurer les Variables d'Environnement

1. Dans la page de votre projet, allez dans **Settings**
2. Cliquez sur **Environment variables**
3. Cliquez sur **"Add variable"**
4. Entrez :
   - **Variable name** : `ANTHROPIC_API_KEY`
   - **Value** : Votre clé API Anthropic
5. Cliquez sur **Save**

### ÉTAPE 7 : Vérifier que les Functions sont activées

1. Dans la page de votre projet, allez dans l'onglet **Functions**
2. Vous devriez voir : `api/[...path]` listé
3. Si c'est le cas, les Functions sont actives ! ✅

## ✅ Résultat attendu

Après ces étapes :

- ✅ Le projet se déploie automatiquement à chaque push sur `main`
- ✅ Les Functions sont détectées automatiquement depuis `functions/api/[...path].ts`
- ✅ Les Functions TypeScript sont compilées automatiquement
- ✅ Les endpoints `/api/config` et `/api/message` fonctionnent

## 🔍 Vérification

Testez après le déploiement :

```bash
# Test GET /api/config
curl https://continue.pages.dev/api/config

# Devrait retourner du JSON avec les modèles
```

## ❓ Si ça ne marche toujours pas

1. Vérifiez dans **Settings > Builds & deployments** que la configuration est correcte
2. Vérifiez dans **Functions** que les Functions sont listées
3. Vérifiez dans les **Deployments** les logs de build pour voir les erreurs

## 📸 Capture d'écran attendue

Après la connexion Git, vous devriez voir une page avec :

- Un formulaire avec les champs de configuration
- Un bouton "Save and Deploy" en bas
- Une section "Preview" à droite

---

**Une fois que c'est fait, dites-moi et je testerai l'application !**
