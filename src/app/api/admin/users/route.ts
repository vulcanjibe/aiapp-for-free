import { NextResponse } from "next/server";
import { getAllUsers } from "@/lib/data-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé. Rôle administrateur requis." }, { status: 403 });
  }

  const users = await getAllUsers();
  return NextResponse.json(users);
}
