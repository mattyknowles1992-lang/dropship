import { NextResponse } from "next/server";

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

    // Tracking is currently a no-op in production until the PageView model exists.
    console.log("Page view", {
      path,
      region,
      sessionId,
      referrer,
      userAgent,
      userId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error creating page view", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
