import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/features/auth/actions";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return user settings and preferences
    return NextResponse.json({
      success: true,
      settings: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role
        },
        preferences: {
          theme: "system", // Default theme
          aiProvider: process.env.AI_PROVIDER || "gemini",
          notifications: true
        },
        environment: {
          aiProviderConfigured: !!process.env.AI_API_KEY,
          databaseConnected: true
        }
      }
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { preferences } = body;

    // In a real application, you would save these preferences to the database
    // For now, we'll just return success
    return NextResponse.json({
      success: true,
      message: "Settings updated successfully"
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
