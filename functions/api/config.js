// Cloudflare Pages Function for /api/config
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

  // GET /api/config
  if (request.method === "GET") {
    const models = [];

    // Check for API keys from environment variables
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

    // Build complete config with all required fields matching BrowserSerializedContinueConfig
    const config = {
      // Required arrays
      slashCommands: [],
      contextProviders: [],
      tools: [],
      mcpServerStatuses: [],
      rules: [],

      // Models configuration
      models: models,
      selectedModelByRole: {
        chat: models[0] || null,
        apply: models[0] || null,
        edit: models[0] || null,
        summarize: models[0] || null,
        autocomplete: null,
        rerank: null,
        embed: null,
      },
      modelsByRole: {
        chat: models,
        apply: models,
        edit: models,
        summarize: models,
        autocomplete: [],
        rerank: [],
        embed: [],
      },

      // Required boolean
      usePlatform: true,

      // Optional but should be included
      allowAnonymousTelemetry: false,
      disableIndexing: false,
      disableSessionTitles: false,

      // Optional objects
      ui: {
        fontSize: 14,
        showSessionTabs: true,
        codeBlockToolbarPosition: "bottom",
        codeWrap: false,
        displayRawMarkdown: false,
        showChatScrollbar: true,
        continueAfterToolRejection: false,
      },
      experimental: {
        enableExperimentalTools: false,
        onlyUseSystemMessageTools: false,
        codebaseToolCallingOnly: false,
        enableStaticContextualization: false,
        useChromiumForDocsCrawling: false,
        readResponseTTS: false,
        useCurrentFileAsContext: false,
      },
      tabAutocompleteOptions: {
        useCache: true,
        multilineCompletions: "auto",
        disableInFiles: [],
      },
    };

    // Format response to match FromCoreProtocol["configUpdate"][0]
    const response = {
      status: "success",
      content: {
        result: {
          config: config,
          errors: [],
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
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }

  // POST /api/config
  if (request.method === "POST") {
    const body = await request.json().catch(() => ({}));
    const { messageType, message } = body || {};

    if (messageType === "history/list") {
      return new Response(JSON.stringify({ status: "success", content: [] }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (messageType === "config/addModel") {
      return new Response(
        JSON.stringify({ status: "success", content: { added: true } }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (messageType === "config/deleteModel") {
      return new Response(
        JSON.stringify({ status: "success", content: { deleted: true } }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    // Handle specific config message types
    if (messageType === "config/getRules") {
      return new Response(JSON.stringify({ status: "success", content: [] }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (messageType === "config/getTools") {
      return new Response(JSON.stringify({ status: "success", content: [] }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (messageType === "mcp/getStatus") {
      return new Response(JSON.stringify({ status: "success", content: [] }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (messageType === "config/getSlashCommands") {
      return new Response(JSON.stringify({ status: "success", content: [] }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (
      messageType?.startsWith("config/") ||
      messageType?.startsWith("context/") ||
      messageType?.startsWith("docs/") ||
      messageType?.startsWith("mcp/")
    ) {
      return new Response(JSON.stringify({ status: "success", content: {} }), {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
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

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
