import { NextResponse } from "next/server";
import { cookieName, createSessionValue, sessionDuration, verifyAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.password || !(await verifyAdminPassword(body.password))) return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookieName, createSessionValue(), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: sessionDuration, path: "/" });
  return response;
}