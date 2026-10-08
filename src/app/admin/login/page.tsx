"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(""); const password = new FormData(event.currentTarget).get("password"); const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) }); if (!response.ok) { setError("That password was not accepted."); return; } router.push("/admin"); router.refresh(); }
  return <main className="admin-page"><form className="admin-login" onSubmit={submit}><p className="eyebrow">Lightspeed / private area</p><h1>Enter the archive.</h1><label>Password<input name="password" type="password" autoComplete="current-password" required /></label>{error && <p className="form-error">{error}</p>}<button className="primary-button" type="submit">Unlock dashboard</button><Link href="/">Back to gallery</Link></form></main>;
}