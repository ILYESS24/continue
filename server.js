// Serveur Express pour Render
// Gère le routing SPA et les API routes

const express = require("express");
const path = require("path");
const configHandler = require("./api/config.js");
const messageHandler = require("./api/message.js");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "gui/dist")));

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

// API Routes
app.use("/api/config", (req, res) => {
  const handler = configHandler.default || configHandler;
  return handler(req, res);
});

app.use("/api/message", (req, res) => {
  const handler = messageHandler.default || messageHandler;
  return handler(req, res);
});

// SPA Routing - toutes les autres routes vers index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "gui/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
