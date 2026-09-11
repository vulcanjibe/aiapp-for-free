import { NextResponse } from "next/server";
import { trackPageView } from "@/lib/data-service";

export async function POST(req: Request) {
  try {
    const { path } = await req.json();
    if (!path) {
      return NextResponse.json({ error: "Path requis" }, { status: 400 });
    }
    const analytics = await trackPageView(path);
    return NextResponse.json({ success: true, analytics });
  } catch (err) {
    console.error("Analytics track error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
