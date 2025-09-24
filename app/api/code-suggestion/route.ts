import { type NextRequest, NextResponse } from "next/server"
import { AIService } from "@/lib/ai-providers"

interface CodeSuggestionRequest {
  fileContent: string
  cursorLine: number
  cursorColumn: number
  suggestionType: string
  fileName?: string
}

interface CodeContext {
  language: string
  framework: string
  beforeContext: string
  currentLine: string
  afterContext: string
  cursorPosition: { line: number; column: number }
  isInFunction: boolean
  isInClass: boolean
  isAfterComment: boolean
  incompletePatterns: string[]
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

export async function POST(request: NextRequest) {
  try {
    console.log("Code suggestion API called");
    console.log("Environment variables:", {
      AI_PROVIDER: process.env.AI_PROVIDER,
      AI_API_KEY: process.env.AI_API_KEY ? "***SET***" : "NOT SET"
    });

    const body: CodeSuggestionRequest = await request.json()
    const { fileContent, cursorLine, cursorColumn, suggestionType, fileName } = body

    console.log("Request body:", { fileContent: fileContent.substring(0, 100) + "...", cursorLine, cursorColumn, suggestionType, fileName });

    // Validate input
    if (!fileContent || cursorLine < 0 || cursorColumn < 0 || !suggestionType) {
      return NextResponse.json({ error: "Invalid input parameters" }, { status: 400 })
    }

    // Analyze code context
    const context = analyzeCodeContext(fileContent, cursorLine, cursorColumn, fileName)

    // Build AI prompt
    const prompt = buildPrompt(context, suggestionType)

    // Call AI service
    const suggestion = await generateSuggestion(prompt)

    console.log("Generated suggestion:", suggestion.substring(0, 100) + "...");

    return NextResponse.json({
      suggestion,
      context,
      metadata: {
        language: context.language,
        framework: context.framework,
        position: context.cursorPosition,
        generatedAt: new Date().toISOString(),
        provider: process.env.AI_PROVIDER || "gemini",
      },
    })
  } catch (error: any) {
    console.error("Context analysis error:", error)
    return NextResponse.json({ 
      error: "Internal server error", 
      message: error.message,
      details: error.stack,
      env: {
        AI_PROVIDER: process.env.AI_PROVIDER,
        AI_API_KEY: process.env.AI_API_KEY ? "***SET***" : "NOT SET"
      }
    }, { status: 500 })
  }
}

/**
 * Analyze the code context around the cursor position
 */
function analyzeCodeContext(content: string, line: number, column: number, fileName?: string): CodeContext {
  const lines = content.split("\n")
  const currentLine = lines[line] || ""

  // Get surrounding context (10 lines before and after)
  const contextRadius = 10
  const startLine = Math.max(0, line - contextRadius)
  const endLine = Math.min(lines.length, line + contextRadius)

  const beforeContext = lines.slice(startLine, line).join("\n")
  const afterContext = lines.slice(line + 1, endLine).join("\n")

  // Detect language and framework
  const language = detectLanguage(content, fileName)
  const framework = detectFramework(content)

  // Analyze code patterns
  const isInFunction = detectInFunction(lines, line)
  const isInClass = detectInClass(lines, line)
  const isAfterComment = detectAfterComment(currentLine, column)
  const incompletePatterns = detectIncompletePatterns(currentLine, column)

  return {
    language,
    framework,
    beforeContext,
    currentLine,
    afterContext,
    cursorPosition: { line, column },
    isInFunction,
    isInClass,
    isAfterComment,
    incompletePatterns,
  }
}

/**
 * Build AI prompt based on context
 */
function buildPrompt(context: CodeContext, suggestionType: string): string {
  return `You are an expert code completion assistant. Generate a ${suggestionType} suggestion.

Language: ${context.language}
Framework: ${context.framework}

Context:
${context.beforeContext}
${context.currentLine.substring(0, context.cursorPosition.column)}|CURSOR|${context.currentLine.substring(context.cursorPosition.column)}
${context.afterContext}

Analysis:
- In Function: ${context.isInFunction}
- In Class: ${context.isInClass}
- After Comment: ${context.isAfterComment}
- Incomplete Patterns: ${context.incompletePatterns.join(", ") || "None"}

Instructions:
1. Provide only the code that should be inserted at the cursor
2. Maintain proper indentation and style
3. Follow ${context.language} best practices
4. Make the suggestion contextually appropriate

Generate suggestion:`
}

/**
 * Generate suggestion using AI service
 */
async function generateSuggestion(prompt: string): Promise<string> {
  try {
    const aiService = getAIProvider();
    const suggestion = await aiService.generateCodeSuggestion(prompt, {
      temperature: 0.3,
      maxTokens: 300,
    });

    // Clean up the suggestion
    let cleanedSuggestion = suggestion;
    if (cleanedSuggestion.includes("```")) {
      const codeMatch = cleanedSuggestion.match(/```[\w]*\n?([\s\S]*?)```/)
      cleanedSuggestion = codeMatch ? codeMatch[1].trim() : cleanedSuggestion
    }

    // Remove cursor markers if present
    cleanedSuggestion = cleanedSuggestion.replace(/\|CURSOR\|/g, "").trim()

    return cleanedSuggestion || generateMockSuggestion(prompt);
  } catch (error) {
    console.error("AI generation error:", error)
    
    // Fallback: Generate a simple mock suggestion based on context
    return generateMockSuggestion(prompt)
  }
}

/**
 * Generate a mock suggestion when AI service is unavailable
 */
function generateMockSuggestion(prompt: string): string {
  // Extract context from prompt
  const lines = prompt.split('\n')
  const contextLine = lines.find(line => line.includes('|CURSOR|'))
  
  if (!contextLine) {
    return "// AI suggestion unavailable - check your AI provider configuration"
  }

  const beforeCursor = contextLine.split('|CURSOR|')[0]
  const afterCursor = contextLine.split('|CURSOR|')[1] || ""
  
  // Simple pattern-based suggestions
  if (beforeCursor.trim().endsWith('if (')) {
    return "condition) {\n  // TODO: Add condition logic\n}"
  }
  
  if (beforeCursor.trim().endsWith('function ')) {
    return "functionName() {\n  // TODO: Add function logic\n}"
  }
  
  if (beforeCursor.trim().endsWith('const ')) {
    return "variableName = "
  }
  
  if (beforeCursor.trim().endsWith('let ')) {
    return "variableName = "
  }
  
  if (beforeCursor.trim().endsWith('=')) {
    return "value"
  }
  
  if (beforeCursor.trim().endsWith('.')) {
    return "method()"
  }
  
  if (beforeCursor.trim().endsWith('{')) {
    return "\n  // TODO: Add implementation\n}"
  }
  
  if (beforeCursor.trim().endsWith('[')) {
    return "item]"
  }
  
  // Default fallback
  return "// TODO: Add code here"
}

// Helper functions for code analysis
function detectLanguage(content: string, fileName?: string): string {
  if (fileName) {
    const ext = fileName.split(".").pop()?.toLowerCase()
    const extMap: Record<string, string> = {
      ts: "TypeScript",
      tsx: "TypeScript",
      js: "JavaScript",
      jsx: "JavaScript",
      py: "Python",
      java: "Java",
      go: "Go",
      rs: "Rust",
      php: "PHP",
    }
    if (ext && extMap[ext]) return extMap[ext]
  }

  // Content-based detection
  if (content.includes("interface ") || content.includes(": string")) return "TypeScript"
  if (content.includes("def ") || content.includes("import ")) return "Python"
  if (content.includes("func ") || content.includes("package ")) return "Go"

  return "JavaScript"
}

function detectFramework(content: string): string {
  if (content.includes("import React") || content.includes("useState")) return "React"
  if (content.includes("import Vue") || content.includes("<template>")) return "Vue"
  if (content.includes("@angular/") || content.includes("@Component")) return "Angular"
  if (content.includes("next/") || content.includes("getServerSideProps")) return "Next.js"

  return "None"
}

function detectInFunction(lines: string[], currentLine: number): boolean {
  for (let i = currentLine - 1; i >= 0; i--) {
    const line = lines[i]
    if (line?.match(/^\s*(function|def|const\s+\w+\s*=|let\s+\w+\s*=)/)) return true
    if (line?.match(/^\s*}/)) break
  }
  return false
}

function detectInClass(lines: string[], currentLine: number): boolean {
  for (let i = currentLine - 1; i >= 0; i--) {
    const line = lines[i]
    if (line?.match(/^\s*(class|interface)\s+/)) return true
  }
  return false
}

function detectAfterComment(line: string, column: number): boolean {
  const beforeCursor = line.substring(0, column)
  return /\/\/.*$/.test(beforeCursor) || /#.*$/.test(beforeCursor)
}

function detectIncompletePatterns(line: string, column: number): string[] {
  const beforeCursor = line.substring(0, column)
  const patterns: string[] = []

  if (/^\s*(if|while|for)\s*\($/.test(beforeCursor.trim())) patterns.push("conditional")
  if (/^\s*(function|def)\s*$/.test(beforeCursor.trim())) patterns.push("function")
  if (/\{\s*$/.test(beforeCursor)) patterns.push("object")
  if (/\[\s*$/.test(beforeCursor)) patterns.push("array")
  if (/=\s*$/.test(beforeCursor)) patterns.push("assignment")
  if (/\.\s*$/.test(beforeCursor)) patterns.push("method-call")

  return patterns
}

function getLastNonEmptyLine(lines: string[], currentLine: number): string {
  for (let i = currentLine - 1; i >= 0; i--) {
    const line = lines[i]
    if (line.trim() !== "") return line
  }
  return ""
}