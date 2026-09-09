import { NextResponse } from "next/server";
import { toggleVoteIdea } from "@/lib/data-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Connectez-vous pour voter pour cette idée." }, { status: 401 });
  }

  try {
    const updatedIdea = await toggleVoteIdea(params.id, session.user.id);
    if (!updatedIdea) {
      return NextResponse.json({ error: "Idée non trouvée" }, { status: 404 });
    }
    return NextResponse.json(updatedIdea);
  } catch (err) {
    console.error("Vote API error:", err);
    return NextResponse.json({ error: "Erreur lors du vote" }, { status: 500 });
  }
}
