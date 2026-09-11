import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { SplashScreen } from "@/components/SplashScreen";

const inter = Inter({ subsets: ["latin"] });

const baseUrl = process.env.NEXTAUTH_URL || "https://freehub-community.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "FreeHub - Alternatives Gratuites & Open Source aux Logiciels Payants",
    template: "%s | FreeHub",
  },
  description:
    "Hub communautaire proposant des alternatives 100% gratuites, open source et conteneurisées (Docker, Web/PWA) à vos logiciels payants (Notion, Trello, Figma, Slack...).",
  keywords: [
    "alternative gratuite",
    "logiciel open source",
    "remplacer notion gratuit",
    "remplacer trello gratuit",
    "remplacer figma gratuit",
    "logiciel libre",
    "PWA gratuite",
    "vibe coding",
    "agents IA",
    "alternatives SaaS",
  ],
  authors: [{ name: "FreeHub Community" }],
  creator: "FreeHub Open Source",
  publisher: "FreeHub",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: baseUrl,
    siteName: "FreeHub",
    title: "FreeHub - Hub d'Alternatives Gratuites & Open Source",
    description:
      "Trouvez et déployez des alternatives gratuites open-source développées avec des agents IA pour remplacer vos abonnements payants.",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "FreeHub - Alternatives Gratuites Open Source",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeHub - Alternatives Gratuites aux Logiciels Payants",
    description:
      "Trouvez une alternative 100% gratuite et open source à Notion, Trello, Figma, Slack et autres SaaS payants.",
    creator: "@freehub_community",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "google_verification_code_placeholder",
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FreeHub",
    url: baseUrl,
    description:
      "Hub communautaire proposant des alternatives gratuites, open-source et conteneurisées aux applications payantes.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/catalog?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="fr" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased`}>
        <AuthProvider>
          <SplashScreen />
          <AnalyticsTracker />
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {children}
          </main>
          <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
            <p>FreeHub © {new Date().getFullYear()} - Alternatives gratuites développées par des agents IA pour la communauté.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
