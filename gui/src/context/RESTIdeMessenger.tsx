/**
 * RESTIdeMessenger - Adaptateur REST pour remplacer IdeMessenger en mode standalone
 * Utilise l'API REST au lieu de vscode.postMessage
 */

import { ChatMessage, IDE, PromptLog } from "core";
import type {
  FromWebviewProtocol,
  ToCoreProtocol,
  ToWebviewProtocol,
} from "core/protocol";
import { MessageIde } from "core/protocol/messenger/messageIde";
import {
  GeneratorReturnType,
  GeneratorYieldType,
  WebviewSingleMessage,
  WebviewSingleProtocolMessage,
} from "core/protocol/util";
import { v4 as uuidv4 } from "uuid";
import type { IIdeMessenger } from "./IdeMessenger";

// Configuration de l'API
const API_BASE = "/api";

// Mapping des messages vers les endpoints API
const MESSAGE_TO_ENDPOINT: Record<string, string> = {
  "llm/streamChat": "message",
  getState: "state",
  // Ajoutez d'autres mappings selon vos besoins
};

export class RESTIdeMessenger implements IIdeMessenger {
  ide: IDE;

  constructor() {
    this.ide = new MessageIde(
      async (messageType, data) => {
        const result = await this.request(messageType as any, data);
        if (result.status === "error") {
          throw new Error(result.error);
        }
        return result.content;
      },
      () => {},
    );
  }

  private async fetchAPI(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<Response> {
    const url = `${API_BASE}/${endpoint}`;
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  }

  post<T extends keyof FromWebviewProtocol>(
    messageType: T,
    data: FromWebviewProtocol[T][0],
    messageId?: string,
    attempt?: number,
  ): void {
    // Pour les messages POST, on peut les envoyer directement
    const endpoint = MESSAGE_TO_ENDPOINT[messageType] || "message";

    if (endpoint === "message") {
      // Envoyer le message à l'API
      this.fetchAPI("message", {
        method: "POST",
        body: JSON.stringify({ message: data }),
      }).catch((error) => {
        console.error(`Failed to send message ${messageType}:`, error);
      });
    } else {
      console.warn(`No API endpoint mapped for message type: ${messageType}`);
    }
  }

  respond<T extends keyof ToWebviewProtocol>(
    messageType: T,
    data: ToWebviewProtocol[T][1],
    messageId: string,
  ): void {
    // Les réponses ne sont généralement pas envoyées via REST
    // car elles sont des réponses aux messages entrants
    console.log(`Respond to ${messageType}:`, data);
  }

  async request<T extends keyof FromWebviewProtocol>(
    messageType: T,
    data: FromWebviewProtocol[T][0],
  ): Promise<WebviewSingleProtocolMessage<T>> {
    try {
      const endpoint = MESSAGE_TO_ENDPOINT[messageType] || "state";

      if (messageType === "getState" || endpoint === "state") {
        const response = await this.fetchAPI("state");
        const state = await response.json();

        return {
          status: "success",
          content: state as any,
        } as WebviewSingleProtocolMessage<T>;
      }

      // Pour les autres types de messages, utiliser POST /message
      const response = await this.fetchAPI("message", {
        method: "POST",
        body: JSON.stringify({ message: data }),
      });

      if (!response.ok) {
        return {
          status: "error",
          error: `HTTP ${response.status}: ${response.statusText}`,
        } as WebviewSingleProtocolMessage<T>;
      }

      const result = await response.json();
      return {
        status: "success",
        content: result as any,
      } as WebviewSingleProtocolMessage<T>;
    } catch (error) {
      return {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      } as WebviewSingleProtocolMessage<T>;
    }
  }

  async *streamRequest<T extends keyof FromWebviewProtocol>(
    messageType: T,
    data: FromWebviewProtocol[T][0],
    cancelToken?: AbortSignal,
  ): AsyncGenerator<
    GeneratorYieldType<FromWebviewProtocol[T][1]>[],
    GeneratorReturnType<FromWebviewProtocol[T][1]> | undefined
  > {
    // Pour le streaming, on peut utiliser Server-Sent Events ou polling
    // Pour simplifier, on utilise polling avec /state
    const messageId = uuidv4();

    // Envoyer le message initial
    if (messageType === "llm/streamChat") {
      await this.fetchAPI("message", {
        method: "POST",
        body: JSON.stringify({ message: data }),
      });
    }

    // Polling pour obtenir les mises à jour
    let lastState: any = null;
    const chunks: GeneratorYieldType<FromWebviewProtocol[T][1]>[] = [];

    while (!cancelToken?.aborted) {
      try {
        const response = await this.fetchAPI("state");
        const state = await response.json();

        // Simuler le streaming en envoyant les changements d'état
        // Note: C'est une implémentation simplifiée
        if (state.isProcessing) {
          // Continuer à poller
          await new Promise((resolve) => setTimeout(resolve, 100));
          continue;
        }

        // Si le traitement est terminé, envoyer le résultat final
        if (state.session?.history) {
          const lastMessage =
            state.session.history[state.session.history.length - 1];
          if (lastMessage) {
            chunks.push([lastMessage] as any);
          }
        }

        break;
      } catch (error) {
        console.error("Error polling state:", error);
        break;
      }
    }

    // Yielder les chunks
    if (chunks.length > 0) {
      yield chunks as GeneratorYieldType<FromWebviewProtocol[T][1]>[];
    }

    return undefined;
  }

  async *llmStreamChat(
    msg: ToCoreProtocol["llm/streamChat"][0],
    cancelToken: AbortSignal,
  ): AsyncGenerator<ChatMessage[], PromptLog | undefined> {
    const gen = this.streamRequest("llm/streamChat", msg, cancelToken);

    let next = await gen.next();
    while (!next.done) {
      yield next.value as ChatMessage[];
      next = await gen.next();
    }
    return next.value as PromptLog | undefined;
  }
}
