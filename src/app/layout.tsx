import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreeHub - Hub d'Alternatives Gratuites & Open Source",
  description:
    "Plateforme communautaire proposant des alternatives gratuites, open source et conteneurisées à vos applications payantes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased`}>
        <AuthProvider>
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
