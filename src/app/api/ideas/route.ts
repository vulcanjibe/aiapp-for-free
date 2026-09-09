import { NextResponse } from "next/server";
import { getAllIdeas, createIdea } from "@/lib/data-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const ideas = await getAllIdeas();
  return NextResponse.json(ideas);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  try {
    const { title, paidAppName, description, category } = await req.json();

    if (!title || !paidAppName || !description) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    const newIdea = await createIdea({
      title,
      paidAppName,
      description,
      category: category || "Productivité",
      suggestedByUserId: session?.user?.id,
      suggestedByName: session?.user?.name || "Anonyme",
    });

    return NextResponse.json(newIdea, { status: 201 });
  } catch (err) {
    console.error("Idea POST error:", err);
    return NextResponse.json({ error: "Erreur serveur lors de la soumission de l'idée." }, { status: 500 });
  }
}
