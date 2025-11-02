#!/bin/bash
# Script de build spécifique pour Vercel
set -e

echo "🚀 Building for Vercel..."

# Installer les dépendances racine
echo "📦 Installing root dependencies..."
npm install

# Build des packages locaux
echo "📦 Building local packages..."
node ./scripts/build-packages.js || echo "⚠️  build-packages.js failed, continuing..."

# Build du core
echo "📦 Building core..."
cd core
npm install
npm run build
cd ..

# Build du GUI
echo "📦 Building GUI..."
cd gui
npm install
npm run build
cd ..

# Créer le fichier _redirects pour le routing SPA
echo "📝 Creating _redirects file..."
mkdir -p gui/dist
echo "/*    /index.html   200" > gui/dist/_redirects

# Compiler les Functions TypeScript en JavaScript (pour compatibilité)
if [ -d "gui/functions" ]; then
  echo "🔨 Compiling Functions TypeScript to JavaScript..."
  node compile-functions.js || echo "⚠️  Functions compilation failed, continuing..."
fi

echo "✅ Build completed successfully!"

