import { NextResponse } from "next/server";
import { incrementAppClicks } from "@/lib/data-service";

export async function POST(req: Request) {
  try {
    const { appId } = await req.json();
    if (!appId) {
      return NextResponse.json({ error: "appId est requis" }, { status: 400 });
    }
    await incrementAppClicks(appId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Click increment error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
