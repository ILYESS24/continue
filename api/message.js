// Vercel Serverless Function for /api/message
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // POST /api/message
  if (req.method === "POST") {
    const { messageType, message } = req.body || {};

    if (messageType === "llm/streamChat") {
      // Set headers for SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Send streaming response
      const response = {
        role: "assistant",
        content:
          "Backend API fonctionne mais nécessite une implémentation complète des appels LLM.",
      };

      res.write(`data: ${JSON.stringify(response)}\n\n`);
      res.end();
      return;
    }

    return res.status(200).json({
      status: "success",
      content: {},
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
