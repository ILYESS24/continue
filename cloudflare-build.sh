#!/bin/bash
set -e

echo "🚀 Building for Cloudflare Pages..."

# Installer les dépendances racine
echo "📦 Installing root dependencies..."
npm ci

# Build des packages locaux
echo "📦 Building local packages..."
node ./scripts/build-packages.js

# Build du core
echo "📦 Building core..."
cd core
npm ci
npm run build
cd ..

# Build du GUI
echo "📦 Building GUI..."
cd gui
npm ci
npm run build
cd ..

# Créer le fichier _redirects pour le routing SPA
echo "📝 Creating _redirects file..."
mkdir -p gui/dist
echo "/*    /index.html   200" > gui/dist/_redirects

# Compiler les Functions TypeScript en JavaScript
if [ -d "gui/functions" ]; then
  echo "🔨 Compiling Functions TypeScript to JavaScript..."
  node compile-functions.js
  echo "✅ Functions compiled"
else
  echo "📝 Creating functions directory..."
  mkdir -p gui/dist/functions/api
  echo "⚠️  Functions directory created but handler needs to be added"
fi

echo "✅ Build completed successfully!"

