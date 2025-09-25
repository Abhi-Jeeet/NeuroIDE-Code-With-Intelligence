import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/features/auth/actions";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const playgrounds = await db.playground.findMany({
      where: {
        userId: user.id
      },
      include: {
        user: true,
        Starmark: {
          where: {
            userId: user.id
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      playgrounds: playgrounds.map(playground => ({
        id: playground.id,
        title: playground.title,
        description: playground.description,
        template: playground.template,
        userId: playground.userId,
        createdAt: playground.createdAt,
        updatedAt: playground.updatedAt,
        starred: playground.Starmark?.[0]?.isMarked || false
      }))
    });
  } catch (error) {
    console.error("Error fetching playgrounds:", error);
    return NextResponse.json(
      { error: "Failed to fetch playgrounds" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, template } = body;

    if (!title || !template) {
      return NextResponse.json(
        { error: "Title and template are required" },
        { status: 400 }
      );
    }

    const playground = await db.playground.create({
      data: {
        title,
        description,
        template,
        userId: user.id
      }
    });

    return NextResponse.json({
      success: true,
      playground
    });
  } catch (error) {
    console.error("Error creating playground:", error);
    return NextResponse.json(
      { error: "Failed to create playground" },
      { status: 500 }
    );
  }
}
