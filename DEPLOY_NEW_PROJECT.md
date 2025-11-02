# Déployer sur un Nouveau Projet Cloudflare Pages

## Option 1 : Via le Dashboard Cloudflare (RECOMMANDÉ)

### Étapes :

1. **Allez sur** : https://dash.cloudflare.com/
2. **Cliquez sur** : Workers & Pages → "Create a project"
3. **Sélectionnez** : "Connect to Git"
4. **Choisissez** : Votre repository GitHub (ILYESS24/continue)
5. **Configurez** :
   ```
   Framework preset: None
   Build command: bash cloudflare-build.sh
   Build output directory: gui/dist
   Root directory: .
   ```
6. **Nom du projet** : `continue-new` (ou autre nom)
7. **Cliquez sur** : "Save and Deploy"

## Option 2 : Via Wrangler CLI (nécessite connexion Git manuelle)

### Commandes :

```bash
# Créer un nouveau projet
wrangler pages project create continue-new --production-branch=main

# Déployer
wrangler pages deploy gui/dist --project-name=continue-new
```

**Mais** : Les Functions ne seront pas activées automatiquement sans connexion Git.

## Option 3 : Nouveau Repository GitHub

Si vous voulez créer un nouveau repository GitHub :

1. Créez un nouveau repo sur GitHub
2. Poussez le code :
   ```bash
   git remote add new-origin https://github.com/VOTRE_USERNAME/continue-new.git
   git push new-origin main
   ```
3. Connectez-le à Cloudflare Pages via le Dashboard

## ✅ Après la création du projet

1. Ajoutez les variables d'environnement :
   - `ANTHROPIC_API_KEY` = votre clé
2. Les Functions seront détectées automatiquement depuis `functions/api/[...path].ts`
