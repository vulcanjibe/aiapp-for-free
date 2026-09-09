import { NextResponse } from "next/server";
import { updateCompanyRequestStatus } from "@/lib/data-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé. Rôle administrateur requis." }, { status: 403 });
  }

  try {
    const { status, adminNotes } = await req.json();

    const validStatuses = ["new", "in_review", "contacted", "closed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const updated = await updateCompanyRequestStatus(params.id, status, adminNotes);
    if (!updated) {
      return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Admin company request update error:", err);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}
