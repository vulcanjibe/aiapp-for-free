import { getAppBySlug, getAppById } from "@/lib/data-service";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Sparkles, ShieldCheck, GitFork, ArrowLeft, CheckCircle, Code, Cpu } from "lucide-react";
import { AppLinkButton } from "@/components/AppLinkButton";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const app = await getAppBySlug(params.slug);
  if (!app) return { title: "Application introuvable - FreeHub" };
  return {
    title: `${app.title} - Alternative gratuite à ${app.replacedApp} | FreeHub`,
    description: app.tagline,
  };
}

export default async function AppDetailPage({ params }: { params: { slug: string } }) {
  const app = await getAppBySlug(params.slug);

  if (!app) {
    notFound();
  }

  let parentApp = null;
  if (app.forkedFromAppId) {
    parentApp = await getAppById(app.forkedFromAppId);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Back Button */}
      <Link
        href="/catalog"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au catalogue
      </Link>

      {/* App Header Banner */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-8 space-y-6 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                Alternative gratuite à : {app.replacedApp}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono text-xs font-semibold">
                {app.appType}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 font-mono text-xs font-semibold border border-indigo-500/20">
                BDD: {app.database}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {app.title}
            </h1>

            <p className="text-base text-slate-300 leading-relaxed font-normal">
              {app.tagline}
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1 font-semibold text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Proposé par {app.developerName}
              </span>
              <span>•</span>
              <span>
                Statut :{" "}
                <span className="text-emerald-400 font-semibold uppercase tracking-wider">
                  {app.status === "validated" ? "Validé & Sécurisé" : app.status}
                </span>
              </span>
            </div>
          </div>

          {/* Action Buttons with Gate Check */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            {app.demoUrl && (
              <AppLinkButton
                appId={app._id}
                url={app.demoUrl}
                label="Ouvrir l'application"
                icon="demo"
              />
            )}
            <AppLinkButton
              appId={app._id}
              url={app.githubUrl}
              label="Dépôt GitHub / GitLab"
              icon="github"
            />
            {/* Fork CTA */}
            <Link
              href={`/developer?forkFrom=${app._id}`}
              className="px-4 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-2"
            >
              <GitFork className="w-4 h-4" />
              Forker cette application
            </Link>
          </div>
        </div>

        {/* Fork Origin Notification */}
        {parentApp && (
          <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs flex items-center gap-3">
            <GitFork className="w-5 h-5 text-purple-400 shrink-0" />
            <div>
              <span className="font-bold">Application Dérivée (Fork) :</span> Cette application est issue d&apos;un fork de{" "}
              <Link href={`/app/${parentApp.slug}`} className="underline font-bold text-white hover:text-purple-300">
                {parentApp.title}
              </Link>
              .
            </div>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Features */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Description & Présentation
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {app.description}
            </p>
          </div>

          <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              Fonctionnalités Clés
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {app.features.map((feat, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  {feat}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Tech Stack & Security Validation Specs */}
        <div className="space-y-6">
          <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-purple-400" />
              Stack Technique & BDD
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">Base de données imposée :</span>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold inline-block">
                  {app.database}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">Technologies utilisées :</span>
                <div className="flex flex-wrap gap-1.5">
                  {app.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Semi-Validation Results */}
          {app.semiValidation && (
            <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-3 text-xs">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                Rapport de Validation Admin
              </h3>
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Accès GitHub Public :</span>
                  <span className={app.semiValidation.githubAccessible ? "text-emerald-400 font-bold" : "text-red-400"}>
                    {app.semiValidation.githubAccessible ? "✓ Public" : "✕ Privé"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Conteneur Docker :</span>
                  <span className={app.semiValidation.hasDockerfile ? "text-emerald-400 font-bold" : "text-amber-400"}>
                    {app.semiValidation.hasDockerfile ? "✓ Dockerfile Présent" : "Proposer Docker"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Licence Open Source :</span>
                  <span className={app.semiValidation.hasLicense ? "text-emerald-400 font-bold" : "text-red-400"}>
                    {app.semiValidation.hasLicense ? "✓ Conforme (MIT/Apache)" : "Inconnue"}
                  </span>
                </div>
              </div>

              {app.semiValidation.notes && app.semiValidation.notes.length > 0 && (
                <div className="pt-2 text-slate-400 space-y-1">
                  <span className="font-semibold text-slate-300">Notes d&apos;analyse :</span>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    {app.semiValidation.notes.map((note, i) => (
                      <li key={i}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
