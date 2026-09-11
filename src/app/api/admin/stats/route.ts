import { NextResponse } from "next/server";
import { getSiteAnalytics, getAllApps, getAllUsers, getAllCompanyRequests, getAllIdeas } from "@/lib/data-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { IAppStore } from "@/lib/store";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Accès refusé. Rôle administrateur requis." }, { status: 403 });
  }

  const [analytics, apps, users, companyRequests, ideas] = await Promise.all([
    getSiteAnalytics(),
    getAllApps(),
    getAllUsers(),
    getAllCompanyRequests(),
    getAllIdeas(),
  ]);

  const totalAppClicks = apps.reduce((acc: number, app: IAppStore) => acc + (app.clicksCount || 0), 0);
  const totalAppViews = apps.reduce((acc: number, app: IAppStore) => acc + (app.viewsCount || 0), 0);

  return NextResponse.json({
    analytics,
    totals: {
      appsCount: apps.length,
      usersCount: users.length,
      companyRequestsCount: companyRequests.length,
      ideasCount: ideas.length,
      totalAppClicks,
      totalAppViews,
    },
  });
}
