// Vercel Serverless Function for /api/config
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

  // GET /api/config
  if (req.method === "GET") {
    const models = [];

    // Check for API keys from environment variables
    if (process.env.ANTHROPIC_API_KEY) {
      models.push({
        title: "Claude 3.5 Sonnet",
        provider: "anthropic",
        model: "claude-3-5-sonnet-20241022",
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      models.push({
        title: "Claude 3 Opus",
        provider: "anthropic",
        model: "claude-3-opus-20240229",
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }

    if (process.env.OPENAI_API_KEY) {
      models.push({
        title: "GPT-4",
        provider: "openai",
        model: "gpt-4",
        apiKey: process.env.OPENAI_API_KEY,
      });
      models.push({
        title: "GPT-3.5 Turbo",
        provider: "openai",
        model: "gpt-3.5-turbo",
        apiKey: process.env.OPENAI_API_KEY,
      });
    }

    if (process.env.GROQ_API_KEY) {
      models.push({
        title: "Llama 3.1 70B",
        provider: "groq",
        model: "llama-3.1-70b-versatile",
        apiKey: process.env.GROQ_API_KEY,
      });
    }

    if (process.env.MISTRAL_API_KEY) {
      models.push({
        title: "Mistral Large",
        provider: "mistral",
        model: "mistral-large-latest",
        apiKey: process.env.MISTRAL_API_KEY,
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
    // Expected format: { result: ConfigResult, profileId, organizations, selectedOrgId }
    const response = {
      status: "success",
      content: {
        result: {
          config: config,
          errors: [], // No errors for now
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

    return res.status(200).json(response);
  }

  // POST /api/config
  if (req.method === "POST") {
    const { messageType, message } = req.body || {};

    if (messageType === "history/list") {
      return res.status(200).json({
        status: "success",
        content: [],
      });
    }

    if (messageType === "config/addModel") {
      return res.status(200).json({
        status: "success",
        content: { added: true },
      });
    }

    if (messageType === "config/deleteModel") {
      return res.status(200).json({
        status: "success",
        content: { deleted: true },
      });
    }

    // Handle specific config message types
    if (messageType === "config/getRules") {
      return res.status(200).json({
        status: "success",
        content: [],
      });
    }

    if (messageType === "config/getTools") {
      return res.status(200).json({
        status: "success",
        content: [],
      });
    }

    if (messageType === "mcp/getStatus") {
      return res.status(200).json({
        status: "success",
        content: [],
      });
    }

    if (messageType === "config/getSlashCommands") {
      return res.status(200).json({
        status: "success",
        content: [],
      });
    }

    if (
      messageType?.startsWith("config/") ||
      messageType?.startsWith("context/") ||
      messageType?.startsWith("docs/") ||
      messageType?.startsWith("mcp/")
    ) {
      return res.status(200).json({
        status: "success",
        content: {},
      });
    }

    return res.status(200).json({
      status: "success",
      content: {},
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
