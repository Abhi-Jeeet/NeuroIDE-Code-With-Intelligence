import { NextResponse } from "next/server";

export async function GET() {
  try {
    const provider = process.env.AI_PROVIDER || "gemini";
    const hasApiKey = !!process.env.AI_API_KEY;
    
    return NextResponse.json({
      status: "AI Configuration Test",
      provider,
      hasApiKey,
      configured: hasApiKey,
      message: hasApiKey 
        ? "AI is properly configured and ready to use"
        : "AI API key is missing. Please set AI_API_KEY in your .env.local file",
      instructions: hasApiKey 
        ? "AI suggestions should work now. Try typing in the editor and press Ctrl+Space"
        : "1. Get API key from https://makersuite.google.com/app/apikey\n2. Add AI_API_KEY to .env.local\n3. Restart dev server"
    });
  } catch (error) {
    return NextResponse.json({
      status: "Error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
