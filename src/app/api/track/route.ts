import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      path,
      region,
      sessionId,
      referrer,
      userAgent,
      userId,
    }: {
      path: string;
      region?: string;
      sessionId?: string;
      referrer?: string;
      userAgent?: string;
      userId?: string;
    } = body;

    if (!path) {
      return NextResponse.json({ error: "path is required" }, { status: 400 });
    }

    await prisma.pageView.create({
      data: {
        path,
        region,
        sessionId,
        referrer,
        userAgent,
        userId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error creating page view", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
