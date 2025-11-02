/**
 * Script pour créer un projet Cloudflare Pages connecté au Git via l'API
 * NOTE: Cela nécessite un GitHub Personal Access Token avec permissions repo
 */

import https from "https";
import { readFileSync } from "fs";

// Configuration
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Personal Access Token GitHub
const GITHUB_REPO = "ILYESS24/continue";
const PROJECT_NAME = "continue-git";

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
  console.error("❌ CLOUDFLARE_ACCOUNT_ID et CLOUDFLARE_API_TOKEN sont requis");
  console.error("   Configurez-les dans les variables d'environnement");
  process.exit(1);
}

async function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(
              new Error(`HTTP ${res.statusCode}: ${JSON.stringify(parsed)}`),
            );
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function createProjectWithGit() {
  console.log("🚀 Création d'un projet Cloudflare Pages avec connexion Git...");

  // D'abord, vérifier si Cloudflare API supporte la connexion Git
  // Malheureusement, l'API Cloudflare ne supporte pas directement la connexion Git
  // Il faut passer par OAuth GitHub via le Dashboard

  console.log(
    "⚠️  LIMITATION : L'API Cloudflare Pages ne permet pas de connecter",
  );
  console.log(
    "   un projet à Git directement. Cela nécessite une autorisation OAuth",
  );
  console.log(
    "   avec GitHub qui ne peut être faite que via le Dashboard web.",
  );
  console.log("");
  console.log(
    "✅ SOLUTION : Créer le projet depuis le Dashboard avec 'Connect to Git'",
  );
  console.log("");
  console.log("📋 Instructions :");
  console.log("1. Allez sur https://dash.cloudflare.com/");
  console.log("2. Workers & Pages → Create a project");
  console.log("3. Connect to Git");
  console.log("4. Sélectionnez : ILYESS24/continue");
  console.log("5. Configurez :");
  console.log("   - Build command: bash cloudflare-build.sh");
  console.log("   - Build output directory: gui/dist");
  console.log("   - Root directory: .");
}

createProjectWithGit().catch(console.error);
