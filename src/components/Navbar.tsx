"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Sparkles, Layers, ShieldCheck, Building2, Lightbulb, LogOut, LogIn, UserPlus } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  const roleLabels: Record<string, { label: string; color: string }> = {
    admin: { label: "Admin", color: "bg-red-500/20 text-red-400 border-red-500/30" },
    developer: { label: "Développeur", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
    company: { label: "Entreprise", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    user: { label: "Membre", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              FreeHub
            </span>
            <span className="hidden sm:inline-block text-xs font-semibold ml-2 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Open Source
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
          <Link
            href="/catalog"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            Catalogue
          </Link>
          <Link
            href="/ideas"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            Proposer / Voter
          </Link>
          <Link
            href="/entreprise"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Building2 className="w-4 h-4 text-sky-400" />
            Espace Entreprises
          </Link>

          {(role === "developer" || role === "admin") && (
            <Link
              href="/developer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-purple-300 hover:text-white hover:bg-purple-900/30 transition-colors border border-purple-500/20"
            >
              Proposer une App
            </Link>
          )}

          {role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-red-300 hover:text-white hover:bg-red-900/30 transition-colors border border-red-500/20"
            >
              <ShieldCheck className="w-4 h-4 text-red-400" />
              Admin
            </Link>
          )}
        </nav>

        {/* Auth status & Actions */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-semibold text-slate-200">{session.user?.name}</span>
                {role && roleLabels[role] && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${roleLabels[role].color}`}>
                    {roleLabels[role].label}
                  </span>
                )}
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-200 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/20 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
