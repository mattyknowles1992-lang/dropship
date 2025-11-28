import { NextResponse } from "next/server";

function isAuthorized(request: Request) {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) return true; // No token configured = allow for now.
  const header = request.headers.get("x-admin-token");
  return header === token;
}

/**
 * Deprecated: use POST /api/admin/sync/cj instead.
 */
export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { error: "This endpoint is deprecated. Use POST /api/admin/sync/cj instead." },
    { status: 410 },
  );
}
