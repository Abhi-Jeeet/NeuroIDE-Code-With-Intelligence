import { type NextRequest, NextResponse } from "next/server"
import { AIService, ChatMessage as AIChatMessage } from "@/lib/ai-providers"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface EnhancePromptRequest {
  prompt: string
  context?: {
    fileName?: string
    language?: string
    codeContent?: string
  }
}

// Get AI provider configuration from environment variables
function getAIProvider(): AIService {
  const provider = process.env.AI_PROVIDER || "gemini";
  const apiKey = process.env.AI_API_KEY;
  
  if (!apiKey) {
    throw new Error(`API key required for ${provider} provider`);
  }
  
  return new AIService(provider, apiKey);
}

async function generateAIResponse(messages: ChatMessage[], retryCount = 0): Promise<string> {
  const systemPrompt = `You are an expert AI coding assistant. You help developers with:
- Code explanations and debugging
- Best practices and architecture advice
- Writing clean, efficient code
- Troubleshooting errors
- Code reviews and optimizations

Always provide clear, practical answers. When showing code, use proper formatting with language-specific syntax.
Keep responses concise but comprehensive. Use code blocks with language specification when providing code examples.`

  const fullMessages: AIChatMessage[] = [{ role: "system", content: systemPrompt }, ...messages];
  
  try {
    console.log(`Attempting AI request with ${process.env.AI_PROVIDER || "gemini"} (attempt ${retryCount + 1}/3)...`)
    
    const aiService = getAIProvider();
    const response = await aiService.generateResponse(fullMessages, {
      temperature: 0.7,
      maxTokens: 1000,
    });
    
    console.log("AI request completed successfully")
    return response.trim();
  } catch (error) {
    console.error("AI generation error:", error);
    
    // Retry for network errors if we haven't exceeded max retries
    if (retryCount < 2 && (error as Error).message.includes('fetch')) {
      console.log(`Retrying request in ${(retryCount + 1) * 2} seconds...`)
      await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000))
      return generateAIResponse(messages, retryCount + 1)
    }
    
    throw error;
  }
}

async function enhancePrompt(request: EnhancePromptRequest, retryCount = 0): Promise<string> {
  const enhancementPrompt = `You are a prompt enhancement assistant. Take the user's basic prompt and enhance it to be more specific, detailed, and effective for a coding AI assistant.

Original prompt: "${request.prompt}"

Context: ${request.context ? JSON.stringify(request.context, null, 2) : "No additional context"}

Enhanced prompt should:
- Be more specific and detailed
- Include relevant technical context
- Ask for specific examples or explanations
- Be clear about expected output format
- Maintain the original intent

Return only the enhanced prompt, nothing else.`

  try {
    console.log(`Attempting prompt enhancement (attempt ${retryCount + 1}/2)...`)
    
    const aiService = getAIProvider();
    const response = await aiService.generateResponse([
      { role: "user", content: enhancementPrompt }
    ], {
      temperature: 0.3,
      maxTokens: 500,
    });
    
    console.log("Prompt enhancement completed successfully")
    return response.trim() || request.prompt;
  } catch (error) {
    console.error("Prompt enhancement error:", error);
    
    // Retry once for timeout
    if (retryCount < 1) {
      console.log("Retrying prompt enhancement...")
      await new Promise(resolve => setTimeout(resolve, 2000))
      return enhancePrompt(request, retryCount + 1)
    }
    
    return request.prompt; // Return original if enhancement fails
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Handle prompt enhancement
    if (body.action === "enhance") {
      const enhancedPrompt = await enhancePrompt(body as EnhancePromptRequest)
      return NextResponse.json({ enhancedPrompt })
    }

    // Handle regular chat
    const { message, history } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
    }

    const validHistory = Array.isArray(history)
      ? history.filter(
          (msg: any) =>
            msg &&
            typeof msg === "object" &&
            typeof msg.role === "string" &&
            typeof msg.content === "string" &&
            ["user", "assistant"].includes(msg.role),
        )
      : []

    const recentHistory = validHistory.slice(-10)
    const messages: ChatMessage[] = [...recentHistory, { role: "user", content: message }]

    const aiResponse = await generateAIResponse(messages)

    if (!aiResponse) {
      throw new Error("Empty response from AI model")
    }

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
      provider: process.env.AI_PROVIDER || "gemini",
    })
  } catch (error) {
    console.error("Error in AI chat route:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    
    // Provide more specific error messages for common issues
    let userFriendlyMessage = "Failed to generate AI response"
    let statusCode = 500
    
    if (errorMessage.includes("timeout")) {
      userFriendlyMessage = "The AI model is taking longer than expected to respond. Please try again with a simpler request."
      statusCode = 408 // Request Timeout
    } else if (errorMessage.includes("fetch") || errorMessage.includes("ECONNREFUSED")) {
      userFriendlyMessage = "Unable to connect to the AI service. Please check your API key and internet connection."
      statusCode = 503 // Service Unavailable
    } else if (errorMessage.includes("API error")) {
      userFriendlyMessage = "The AI service returned an error. Please check your API key and try again."
      statusCode = 502 // Bad Gateway
    } else if (errorMessage.includes("API key")) {
      userFriendlyMessage = "AI service configuration error. Please check your API key."
      statusCode = 401 // Unauthorized
    }
    
    return NextResponse.json(
      {
        error: userFriendlyMessage,
        details: errorMessage,
        timestamp: new Date().toISOString(),
        suggestions: [
          "Try rephrasing your question to be more specific",
          "Check your AI provider configuration",
          "Verify your API key is correct",
          "Try a shorter, simpler request"
        ]
      },
      { status: statusCode },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: "AI Chat API is running",
    timestamp: new Date().toISOString(),
    provider: process.env.AI_PROVIDER || "gemini",
    info: "Use POST method to send chat messages or enhance prompts",
  })
}