// AI Provider Configuration and Implementation
export interface AIProvider {
  name: string;
  generateResponse: (messages: ChatMessage[], options?: AIOptions) => Promise<string>;
  generateCodeSuggestion: (prompt: string, options?: AIOptions) => Promise<string>;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  stream?: boolean;
}

// Gemini AI Provider
export class GeminiProvider implements AIProvider {
  name = "gemini";
  private apiKey: string;
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(messages: ChatMessage[], options: AIOptions = {}): Promise<string> {
    const { temperature = 0.7, maxTokens = 1000, model = "gemini-1.5-flash" } = options;
    
    // Convert messages to Gemini format
    const contents = messages
      .filter(msg => msg.role !== "system")
      .map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      }));

    // Add system message as the first user message if present
    const systemMessage = messages.find(msg => msg.role === "system");
    if (systemMessage) {
      contents.unshift({
        role: "user",
        parts: [{ text: `System: ${systemMessage.content}` }]
      });
    }

    const response = await fetch(
      `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
            topP: 0.9,
            topK: 40,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
  }

  async generateCodeSuggestion(prompt: string, options: AIOptions = {}): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: "You are an expert code completion assistant. Provide only the code that should be inserted at the cursor position. Do not include explanations or markdown formatting."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    return this.generateResponse(messages, { ...options, temperature: 0.3 });
  }
}

// AI Provider Factory
export class AIProviderFactory {
  static createProvider(providerName: string, apiKey?: string): AIProvider {
    switch (providerName.toLowerCase()) {
      case "gemini":
        if (!apiKey) throw new Error("Gemini API key is required");
        return new GeminiProvider(apiKey);
      
      default:
        throw new Error(`Unknown AI provider: ${providerName}`);
    }
  }

  static getAvailableProviders(): string[] {
    return ["gemini"];
  }
}

// Default AI Service
export class AIService {
  private provider: AIProvider;

  constructor(providerName: string = "gemini", apiKey?: string) {
    this.provider = AIProviderFactory.createProvider(providerName, apiKey);
  }

  async generateResponse(messages: ChatMessage[], options?: AIOptions): Promise<string> {
    return this.provider.generateResponse(messages, options);
  }

  async generateCodeSuggestion(prompt: string, options?: AIOptions): Promise<string> {
    return this.provider.generateCodeSuggestion(prompt, options);
  }

  getProviderName(): string {
    return this.provider.name;
  }
}
