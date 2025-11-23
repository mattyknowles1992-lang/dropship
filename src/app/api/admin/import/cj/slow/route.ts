import { NextResponse } from "next/server";

function isAuthorized(request: Request) {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) return true; // No token configured = allow for now.
  const header = request.headers.get("x-admin-token");
  return header === token;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Legacy "slow" CJ import endpoint is deprecated in favor of /api/admin/cj-sync.
    return NextResponse.json(
      {
        error: "This endpoint is deprecated. Use POST /api/admin/cj-sync instead.",
      },
      { status: 410 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : typeof error === "string" ? error : "CJ slow import failed";
    console.error("CJ slow import endpoint (deprecated) hit with error", message);
    return NextResponse.json({ error: "CJ slow import endpoint is deprecated" }, { status: 410 });
  }
}
