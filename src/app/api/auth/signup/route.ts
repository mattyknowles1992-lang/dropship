import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { pool } from "@/lib/db-pg";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const passwordPattern = /^(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordPattern.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters and include at least one number and one special character.",
        },
        { status: 400 },
      );
    }

    const client = await pool.connect();
    try {
      const existingResult = await client.query(
        "SELECT id FROM \"User\" WHERE email = $1 LIMIT 1",
        [email],
      );

      if (existingResult.rows.length > 0) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 400 },
        );
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const id = uuidv4();
      const now = new Date();

      await client.query(
        'INSERT INTO "User" (id, email, name, "passwordHash", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6)',
        [id, email, name ?? null, passwordHash, now, now],
      );
    } finally {
      client.release();
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
