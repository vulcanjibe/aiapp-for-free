import { NextResponse } from "next/server";
import { updateAppStatus } from "@/lib/data-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé. Rôle administrateur requis." }, { status: 403 });
  }

  try {
    const { status, rejectionReason } = await req.json();

    if (!["validated", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const updatedApp = await updateAppStatus(params.id, status, rejectionReason);
    if (!updatedApp) {
      return NextResponse.json({ error: "Application introuvable" }, { status: 404 });
    }

    return NextResponse.json(updatedApp);
  } catch (err) {
    console.error("Admin status update error:", err);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
