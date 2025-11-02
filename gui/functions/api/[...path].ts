/**
 * Cloudflare Pages Function pour gérer toutes les requêtes API
 * Pattern [...path] capture tous les chemins sous /api/
 */

interface Env {
  SESSIONS?: KVNamespace;
  ANTHROPIC_API_KEY?: string;
  OPENAI_API_KEY?: string;
  GROQ_API_KEY?: string;
  MISTRAL_API_KEY?: string;
}

// Helper pour CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Helper pour GET /api/config
async function handleGetConfig(env: Env) {
  const models = [];

  // Check for API keys and add available models
  if (env.ANTHROPIC_API_KEY) {
    models.push({
      title: "Claude 3.5 Sonnet",
      provider: "anthropic",
      model: "claude-3-5-sonnet-20241022",
      apiKey: env.ANTHROPIC_API_KEY,
    });
    models.push({
      title: "Claude 3 Opus",
      provider: "anthropic",
      model: "claude-3-opus-20240229",
      apiKey: env.ANTHROPIC_API_KEY,
    });
  }

  if (env.OPENAI_API_KEY) {
    models.push({
      title: "GPT-4",
      provider: "openai",
      model: "gpt-4",
      apiKey: env.OPENAI_API_KEY,
    });
    models.push({
      title: "GPT-3.5 Turbo",
      provider: "openai",
      model: "gpt-3.5-turbo",
      apiKey: env.OPENAI_API_KEY,
    });
  }

  if (env.GROQ_API_KEY) {
    models.push({
      title: "Llama 3.1 70B",
      provider: "groq",
      model: "llama-3.1-70b-versatile",
      apiKey: env.GROQ_API_KEY,
    });
  }

  if (env.MISTRAL_API_KEY) {
    models.push({
      title: "Mistral Large",
      provider: "mistral",
      model: "mistral-large-latest",
      apiKey: env.MISTRAL_API_KEY,
    });
  }

  const response = {
    status: "success",
    content: {
      config: {
        models: models,
        selectedModelByRole: {
          chat: models[0] || null,
        },
      },
      profileId: "default",
      organizations: [
        {
          id: "personal",
          name: "Personal",
          slug: "personal",
          iconUrl: null,
          selectedProfileId: "default",
          profiles: [
            {
              id: "default",
              title: "Default Profile",
              iconUrl: null,
              profileType: "local",
            },
          ],
        },
      ],
      selectedOrgId: "personal",
    },
  };

  return new Response(JSON.stringify(response), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Helper pour POST /api/config
async function handlePostConfig(request: Request, env: Env) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is ok
  }

  const { messageType, message } = body;

  // Handle different message types
  if (messageType === "history/list") {
    return new Response(
      JSON.stringify({
        status: "success",
        content: [],
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (messageType === "config/addModel") {
    return new Response(
      JSON.stringify({
        status: "success",
        content: { added: true },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (messageType === "config/deleteModel") {
    return new Response(
      JSON.stringify({
        status: "success",
        content: { deleted: true },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Handle other config messages
  if (
    messageType?.startsWith("config/") ||
    messageType?.startsWith("context/") ||
    messageType?.startsWith("docs/")
  ) {
    return new Response(JSON.stringify({ status: "success", content: {} }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Generic success response
  return new Response(
    JSON.stringify({
      status: "success",
      content: {},
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}

// Helper pour POST /api/message
async function handlePostMessage(request: Request, env: Env) {
  let body: any = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is ok
  }

  const { messageType, message } = body;

  if (messageType === "llm/streamChat") {
    // Return streaming response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          // Simple echo response for now - real implementation would call LLM APIs
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
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  return new Response(
    JSON.stringify({
      status: "success",
      content: {},
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
}

// Export handlers for Cloudflare Pages Functions
// Cloudflare automatically routes based on HTTP method and file location

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // Extract path after /api/
  const pathParts = (context.params?.path as string[]) || [];
  const path = pathParts.join("/");

  // Handle preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // GET /api/config
    if (request.method === "GET" && path === "config") {
      return await handleGetConfig(env);
    }

    // POST /api/config
    if (request.method === "POST" && path === "config") {
      return await handlePostConfig(request, env);
    }

    // POST /api/message
    if (request.method === "POST" && path === "message") {
      return await handlePostMessage(request, env);
    }

    // 404 for unknown routes
    return new Response(JSON.stringify({ error: "Not Found", path }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
};

// Also export specific handlers for better compatibility
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const pathParts = (context.params?.path as string[]) || [];
  const path = pathParts.join("/");

  if (path === "config") {
    return await handleGetConfig(context.env);
  }

  return new Response(JSON.stringify({ error: "Not Found", path }), {
    status: 404,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const pathParts = (context.params?.path as string[]) || [];
  const path = pathParts.join("/");

  if (path === "config") {
    return await handlePostConfig(context.request, context.env);
  }

  if (path === "message") {
    return await handlePostMessage(context.request, context.env);
  }

  return new Response(JSON.stringify({ error: "Not Found", path }), {
    status: 404,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, { headers: corsHeaders });
};
