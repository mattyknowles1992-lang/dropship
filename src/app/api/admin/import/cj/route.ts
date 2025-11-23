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
    // Legacy CJ bulk import endpoint has been superseded by /api/admin/cj-sync,
    // which pulls directly from CJ's listV2 into RawCjProduct + Product.
    return NextResponse.json(
      {
        error: "This endpoint is deprecated. Use POST /api/admin/cj-sync instead.",
      },
      { status: 410 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : typeof error === "string" ? error : "CJ import failed";
    console.error("CJ import endpoint (deprecated) hit with error", message);
    return NextResponse.json({ error: "CJ import endpoint is deprecated" }, { status: 410 });
  }
}
