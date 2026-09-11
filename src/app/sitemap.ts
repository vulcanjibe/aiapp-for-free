import { MetadataRoute } from "next";
import { getAllApps } from "@/lib/data-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://freehub-community.vercel.app";

  const apps = await getAllApps({ status: "validated" });

  const appUrls: MetadataRoute.Sitemap = apps.map((app) => ({
    url: `${baseUrl}/app/${app.slug}`,
    lastModified: new Date(app.updatedAt || app.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ideas`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/entreprise`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/developer`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  return [...staticUrls, ...appUrls];
}
