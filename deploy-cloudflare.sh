#!/bin/bash
set -e

echo "🚀 Déploiement sur Cloudflare Pages..."

# Vérifier si Wrangler est installé
if ! command -v wrangler &> /dev/null; then
    echo "⚠️  Wrangler CLI n'est pas installé. Installation..."
    npm install -g wrangler
fi

# Vérifier si on est authentifié
echo "🔐 Vérification de l'authentification Cloudflare..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ Vous devez vous authentifier avec Cloudflare."
    echo "Exécutez: wrangler login"
    exit 1
fi

# Build du projet
echo ""
echo "📦 Build du projet..."
bash cloudflare-build.sh

if [ $? -ne 0 ]; then
    echo "❌ Le build a échoué!"
    exit 1
fi

# Déployer sur Cloudflare Pages
echo ""
echo "🌐 Déploiement sur Cloudflare Pages..."
wrangler pages deploy gui/dist --project-name=continue

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Déploiement réussi!"
else
    echo ""
    echo "❌ Le déploiement a échoué!"
    exit 1
fi

