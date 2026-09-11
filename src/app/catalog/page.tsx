"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Layers, ArrowRight, ShieldCheck, Sparkles, Filter, GitFork } from "lucide-react";
import { IAppStore } from "@/lib/store";

const CATEGORIES = [
  "Toutes",
  "Productivité",
  "Gestion de projet",
  "Design",
  "Bureautique",
  "Sport",
  "Alimentation",
  "Communication",
  "Business / Ventes",
];

export default function CatalogPage() {
  const [apps, setApps] = useState<IAppStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      let url = "/api/apps?status=validated";
      if (selectedCategory !== "Toutes") {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setApps(data);
      }
    } catch (err) {
      console.error("Error loading apps:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const filteredApps = apps.filter((app) => {
    const query = search.toLowerCase();
    return (
      app.title.toLowerCase().includes(query) ||
      app.replacedApp.toLowerCase().includes(query) ||
      app.tagline.toLowerCase().includes(query) ||
      app.description.toLowerCase().includes(query) ||
      app.features.some((feat) => feat.toLowerCase().includes(query))
    );
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Layers className="w-4 h-4" />
          <span>Catalogue Officiel des Alternatives Gratuites</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Trouvez une alternative gratuite à vos logiciels payants
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl">
          Saisissez le nom du logiciel payant que vous utilisez (ex: Notion, Trello, Figma, Slack, Strava...) ou explorez par catégorie pour découvrir son équivalent 100% gratuit et sans abonnement.
        </p>
      </div>

      {/* Controls & Filters Bar */}
      <div className="space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom de logiciel payant (Notion, Trello, Figma...) ou fonctionnalité..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 text-xs">
          <Filter className="w-4 h-4 text-slate-500 shrink-0 mr-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mb-3" />
          <p className="text-sm">Chargement des applications du Hub...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="py-16 text-center bg-slate-900/50 rounded-2xl border border-slate-800 p-8 space-y-3">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Aucune application trouvée</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Aucune application gratuite ne correspond à votre recherche pour le moment. Vous pouvez proposer cette idée à la communauté !
          </p>
          <Link
            href="/ideas"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-500 transition-colors mt-2"
          >
            Proposer cette idée à la communauté
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <div
              key={app._id}
              className="group bg-slate-900/90 rounded-2xl border border-slate-800 p-6 hover:border-indigo-500/50 transition-all flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20 mb-2">
                      Alternative gratuite à : {app.replacedApp}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {app.title}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono font-semibold">
                      {app.appType}
                    </span>
                    {app.forkedFromAppId && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1">
                        <GitFork className="w-3 h-3" /> Fork
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {app.tagline}
                </p>

                {/* Features Badges */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">
                    Fonctionnalités incluses
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {app.features.slice(0, 3).map((f) => (
                      <span
                        key={f}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        ✓ {f}
                      </span>
                    ))}
                    {app.features.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-950 text-slate-500 border border-slate-800">
                        +{app.features.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {app.developerName}
                </span>
                <Link
                  href={`/app/${app.slug}`}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                  Accéder gratuitement
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
