#!/bin/bash
# Script pour configurer Cloudflare Pages avec connexion Git
# Ce script configure le projet pour utiliser l'intégration Git directe

set -e

echo "🚀 Configuration Cloudflare Pages avec connexion Git"
echo ""
echo "⚠️  IMPORTANT : Ce script nécessite que vous soyez connecté avec Wrangler"
echo "    Exécutez d'abord : wrangler login"
echo ""

# Vérifier que wrangler est installé
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler n'est pas installé"
    echo "   Installez-le avec : npm install -g wrangler"
    exit 1
fi

echo "📋 Étapes à suivre dans le Dashboard Cloudflare :"
echo ""
echo "1. Allez sur https://dash.cloudflare.com/"
echo "2. Cliquez sur 'Workers & Pages' dans le menu de gauche"
echo "3. Cliquez sur 'Create a project'"
echo "4. Sélectionnez 'Connect to Git'"
echo "5. Choisissez votre repository GitHub : ILYESS24/continue"
echo ""
echo "6. Dans la page de configuration qui apparaît, entrez :"
echo ""
echo "   Framework preset: None"
echo "   Build command: bash cloudflare-build.sh"
echo "   Build output directory: gui/dist"
echo "   Root directory: . (point)"
echo ""
echo "7. Cliquez sur 'Save and Deploy'"
echo ""
echo "8. Après le premier déploiement, allez dans :"
echo "   Settings > Environment variables"
echo "   Ajoutez : ANTHROPIC_API_KEY = votre clé API"
echo ""
echo "✅ Les Functions seront automatiquement détectées et compilées !"
echo ""

# Option : Utiliser Wrangler pour créer le projet
read -p "Voulez-vous que je vérifie la configuration actuelle avec Wrangler ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔍 Vérification de la configuration actuelle..."
    wrangler pages project list
    echo ""
    echo "Pour voir les détails du projet 'continue' :"
    echo "wrangler pages project view continue"
fi

