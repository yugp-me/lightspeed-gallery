import { NextResponse } from "next/server";
import { cookieName } from "@/lib/auth";
import { isSameOrigin } from "@/lib/auth";

export async function POST(request: Request) { if (!isSameOrigin(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); const response = NextResponse.json({ ok: true }); response.cookies.delete(cookieName); return response; }