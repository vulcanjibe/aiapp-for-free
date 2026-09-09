import Link from "next/link";
import { Sparkles, Layers, ArrowRight, Lightbulb } from "lucide-react";
import { getAllApps } from "@/lib/data-service";

export default async function HomePage() {
  const validatedApps = await getAllApps({ status: "validated" });

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Alternatives 100% Gratuites & Open Source développées avec IA</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Remplacez vos applications payantes par des{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              alternatives gratuites
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal">
            Le Hub communautaire référençant les meilleures applications Web & PWA gratuites, autonomes et conteneurisées. Plus aucun abonnement coûteux.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/catalog"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all"
            >
              <Layers className="w-5 h-5" />
              Explorer le Catalogue
            </Link>
            <Link
              href="/ideas"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold text-sm flex items-center gap-2 transition-colors"
            >
              <Lightbulb className="w-5 h-5 text-amber-400" />
              Proposer une Application
            </Link>
          </div>

          {/* Key Value Badges */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl font-black text-indigo-400">100% Gratuit</div>
              <div className="text-xs text-slate-400 mt-0.5">Aucun frais ni abonnement caché</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl font-black text-purple-400">Open Source</div>
              <div className="text-xs text-slate-400 mt-0.5">Dépôts GitHub/GitLab vérifiés</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl font-black text-emerald-400">PWA & Docker</div>
              <div className="text-xs text-slate-400 mt-0.5">Facile à installer & héberger</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-2xl font-black text-amber-400">Sécurisé</div>
              <div className="text-xs text-slate-400 mt-0.5">Validé par nos administrateurs</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Free Applications Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              Applications Populaires sur le Hub
            </h2>
            <p className="text-sm text-slate-400">
              Découvrez les dernières pépites open-source validées par la communauté.
            </p>
          </div>
          <Link
            href="/catalog"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Voir tout le catalogue ({validatedApps.length})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validatedApps.slice(0, 6).map((app) => (
            <div
              key={app._id}
              className="group relative bg-slate-900/90 rounded-2xl border border-slate-800 p-6 hover:border-indigo-500/50 transition-all flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-bold border border-indigo-500/20 mb-2">
                      Remplace : {app.replacedApp}
                    </span>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {app.title}
                    </h3>
                  </div>
                  <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono font-semibold">
                    {app.appType}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {app.tagline}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {app.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                    {app.database}
                  </span>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Par {app.developerName}</span>
                <Link
                  href={`/app/${app.slug}`}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-semibold transition-all flex items-center gap-1"
                >
                  Détails
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise Study Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-purple-950/80 border border-indigo-500/30 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
              Espace Entreprises (TPE / PME)
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Réduisez vos coûts d&apos;abonnements logiciels internes
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Vous utilisez un logiciel métier payant ? Demandez une étude pour faire développer ou porter une version équivalente gratuite/économique sur mesure grâce au Vibe Coding avec des agents IA.
            </p>
            <div className="pt-2">
              <Link
                href="/entreprise"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30"
              >
                Demander une étude personnalisée
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Role Explanation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">Un écosystème ouvert à 4 acteurs</h2>
          <p className="text-sm text-slate-400">Comment fonctionne le Hub pour chacun des utilisateurs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-base font-bold text-white">Utilisateurs finaux</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recherchez des alternatives gratuites, accédez aux liens et votez pour les prochaines applications à développer.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-base font-bold text-white">Développeurs IA</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Proposez vos applications Web/PWA open-source créées avec des agents IA et tirez parti des fusions & forks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-base font-bold text-white">TPE & PME</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Demandez un devis d&apos;étude pour convertir vos outils métiers internes coûteux vers des solutions open-source.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="text-base font-bold text-white">Administrateurs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Validez la qualité, la sécurité et la conformité technique (Docker, DBs, licence public) avant publication.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
