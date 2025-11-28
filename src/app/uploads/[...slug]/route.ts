// Legacy uploads route removed: images now served from Cloudinary.
// This file is kept empty so that any stray route imports do nothing
// and no extra dependencies (like `mime`) are required at build time.

export async function GET() {
  return new Response("Not found", { status: 404 });
}
