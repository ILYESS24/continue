// Serveur Express pour Render
// Gère le routing SPA et les API routes

const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Gestion d'erreur pour les handlers
let configHandler, messageHandler;
try {
  configHandler = require("./api/config.js");
  messageHandler = require("./api/message.js");
} catch (error) {
  console.error("Erreur lors du chargement des handlers:", error);
  // Handlers de secours
  configHandler = {
    default: (req, res) =>
      res.status(500).json({ error: "Config handler not loaded" }),
  };
  messageHandler = {
    default: (req, res) =>
      res.status(500).json({ error: "Message handler not loaded" }),
  };
}

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Servir les fichiers statiques
const staticPath = path.join(__dirname, "gui/dist");
console.log("Static path:", staticPath);
app.use(express.static(staticPath));

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// API Routes avec gestion d'erreur
app.use("/api/config", (req, res) => {
  try {
    const handler = configHandler.default || configHandler;
    return handler(req, res);
  } catch (error) {
    console.error("Erreur dans /api/config:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

app.use("/api/message", (req, res) => {
  try {
    const handler = messageHandler.default || messageHandler;
    return handler(req, res);
  } catch (error) {
    console.error("Erreur dans /api/message:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
});

// SPA Routing - toutes les autres routes vers index.html
app.get("*", (req, res) => {
  const indexPath = path.join(__dirname, "gui/dist/index.html");
  console.log("Serving index.html from:", indexPath);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Erreur lors de l'envoi de index.html:", err);
      res.status(404).json({ error: "index.html not found" });
    }
  });
});

// Gestion d'erreur globale
app.use((err, req, res, next) => {
  console.error("Erreur non gérée:", err);
  res
    .status(500)
    .json({ error: "Internal server error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Static files from: ${path.join(__dirname, "gui/dist")}`);
  console.log(`🌐 Server ready at http://localhost:${PORT}`);
});
