// Cloudflare Pages Function for /api/message
export async function onRequest(context) {
  const request = context.request;
  const env = context.env;

  // CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  // Handle preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // POST /api/message
  if (request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    const { messageType } = body || {};

    if (messageType === "llm/streamChat") {
      // Streaming response using Server-Sent Events
      const stream = new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();

          try {
            // Basic streaming response
            const response = {
              role: "assistant",
              content:
                "Backend API fonctionne mais nécessite une implémentation complète des appels LLM.",
            };

            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(response)}\n\n`),
            );
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    return new Response(JSON.stringify({ status: "success", content: {} }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }

  return new Response(JSON.stringify({ error: "Not Found" }), {
    status: 404,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
