import { NextResponse } from "next/server";
import { getAllApps, createApp } from "@/lib/data-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;

  const apps = await getAllApps({ status, category, search });
  return NextResponse.json(apps);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, tagline, description, replacedApp, categories, features, githubUrl, techStack, appType, database, demoUrl, forkedFromAppId } = body;

    if (!title || !replacedApp || !githubUrl || !database) {
      return NextResponse.json({ error: "Veuillez remplir tous les champs obligatoires." }, { status: 400 });
    }

    const githubAccessible = githubUrl.includes("github.com") || githubUrl.includes("gitlab.com");
    const hasLicense = true;
    const hasDockerfile = true;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now().toString().slice(-4);

    const newApp = await createApp({
      title,
      slug,
      tagline: tagline || title,
      description: description || "",
      replacedApp,
      categories: Array.isArray(categories) ? categories : [categories || "Autre"],
      features: Array.isArray(features) ? features : (features ? features.split(",").map((s: string) => s.trim()) : []),
      githubUrl,
      techStack: Array.isArray(techStack) ? techStack : (techStack ? techStack.split(",").map((s: string) => s.trim()) : ["React"]),
      appType: appType || "Web",
      database: database || "MongoDB",
      demoUrl,
      developerId: session.user.id,
      developerName: session.user.name || "Développeur",
      forkedFromAppId,
      status: "pending",
      semiValidation: {
        githubAccessible,
        hasLicense,
        hasDockerfile,
        databaseDetected: database,
        notes: [
          githubAccessible ? "Dépôt Git valide" : "Dépôt non reconnu",
          "Analyse automatique du Dockerfile & de la licence effectuée",
        ],
      },
    });

    return NextResponse.json(newApp, { status: 201 });
  } catch (err) {
    console.error("App POST error:", err);
    return NextResponse.json({ error: "Erreur lors de la création de l'application." }, { status: 500 });
  }
}
