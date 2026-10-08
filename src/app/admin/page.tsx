import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return <AdminPanel />;
}