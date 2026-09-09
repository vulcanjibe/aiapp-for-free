"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  PlusCircle,
  GitFork,
  CheckCircle2,
  Clock,
  XCircle,
  Code,
  Database,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Container,
} from "lucide-react";
import { IAppStore } from "@/lib/store";

function DeveloperDashboardContent() {
  const { data: session, status: authStatus } = useSession();
  const searchParams = useSearchParams();
  const forkFromId = searchParams.get("forkFrom");

  const [myApps, setMyApps] = useState<IAppStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [replacedApp, setReplacedApp] = useState("");
  const [categories, setCategories] = useState("Productivité");
  const [features, setFeatures] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [techStack, setTechStack] = useState("Next.js, TypeScript, TailwindCSS");
  const [appType, setAppType] = useState<"Web" | "PWA">("PWA");
  const [database, setDatabase] = useState<"MongoDB" | "PostgreSQL">("MongoDB");
  const [demoUrl, setDemoUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchMyApps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/apps");
      if (res.ok) {
        const data: IAppStore[] = await res.json();
        const userApps = data.filter((a) => a.developerId === session?.user?.id || a.developerName === session?.user?.name);
        setMyApps(userApps);
      }
    } catch (err) {
      console.error("Error fetching apps:", err);
    } finally {
      setLoading(false);
    }
  }, [session]);

  const loadForkParent = useCallback(async (parentId: string) => {
    try {
      const res = await fetch("/api/apps");
      if (res.ok) {
        const data: IAppStore[] = await res.json();
        const parent = data.find((a) => a._id === parentId);
        if (parent) {
          setTitle(`${parent.title} (Fork)`);
          setTagline(`Version améliorée de ${parent.title}`);
          setDescription(`Fork basé sur ${parent.title}. Modifications apportées...`);
          setReplacedApp(parent.replacedApp);
          setCategories(parent.categories.join(", "));
          setFeatures(parent.features.join(", "));
          setTechStack(parent.techStack.join(", "));
          setAppType(parent.appType);
          setDatabase(parent.database);
          setShowSubmitModal(true);
        }
      }
    } catch (err) {
      console.error("Fork parent error:", err);
    }
  }, []);

  useEffect(() => {
    if (session) {
      fetchMyApps();
    }
    if (forkFromId) {
      loadForkParent(forkFromId);
    }
  }, [session, forkFromId, fetchMyApps, loadForkParent]);

  const handleSubmitApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    if (!githubUrl.includes("github.com") && !githubUrl.includes("gitlab.com")) {
      setError("Le lien du dépôt Git doit pointer vers un dépôt GitHub ou GitLab public.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tagline,
          description,
          replacedApp,
          categories: categories.split(",").map((c) => c.trim()),
          features: features.split(",").map((f) => f.trim()),
          githubUrl,
          techStack: techStack.split(",").map((t) => t.trim()),
          appType,
          database,
          demoUrl,
          forkedFromAppId: forkFromId || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Erreur lors de la soumission");
        setSubmitting(false);
        return;
      }

      const created = await res.json();
      setMyApps((prev) => [created, ...prev]);
      setSuccess("Votre application a été soumise avec succès et est en attente de validation par l'administrateur !");
      setShowSubmitModal(false);
      // Reset
      setTitle("");
      setTagline("");
      setDescription("");
      setGithubUrl("");
      setDemoUrl("");
    } catch {
      setError("Une erreur s'est produite lors de la soumission.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authStatus === "loading") {
    return <div className="text-center py-20 text-slate-400 text-xs">Chargement du profil développeur...</div>;
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-purple-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Espace Développeur Réservé</h2>
        <p className="text-xs text-slate-400">
          Veuillez vous connecter avec votre compte Développeur pour soumettre ou gérer vos applications gratuites.
        </p>
        <Link
          href="/auth/login?callbackUrl=/developer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-colors"
        >
          Se connecter en tant que Développeur
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Developer Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-8 rounded-3xl border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
            <Code className="w-4 h-4" />
            <span>Tableau de Bord Développeur IA</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Proposer une Application Web / PWA Gratuite
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Proposez vos applications développées avec vos agents IA. Contraintes respectées : Applications Web/PWA, conteneurisées sous Docker, BDD MongoDB ou PostgreSQL, et sous dépôt Git public open-source.
          </p>
        </div>

        <button
          onClick={() => setShowSubmitModal(!showSubmitModal)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-purple-600/25 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Soumettre une nouvelle App
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Mandatory Technical Constraints Box */}
      <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="flex items-start gap-3">
          <Container className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">1. Docker obligatoire</span>
            <span className="text-slate-400">Toutes les applications doivent inclure un Dockerfile ou docker-compose valide.</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Database className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">2. BDD Imposées</span>
            <span className="text-slate-400">Uniquement MongoDB ou PostgreSQL pour l&apos;interopérabilité et la sécurité.</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Code className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block">3. Web / PWA Open Source</span>
            <span className="text-slate-400">Applications Web ou PWA sans dépendance aux stores Android / iOS proprietary.</span>
          </div>
        </div>
      </div>

      {/* Application Submission Form */}
      {showSubmitModal && (
        <div className="bg-slate-900 p-8 rounded-3xl border border-purple-500/40 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Formulaire de Soumission d&apos;Application Gratuite
            </h2>
            {forkFromId && (
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5" /> Création d&apos;un Fork
              </span>
            )}
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmitApp} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nom de votre application gratuite *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: OpenNotion"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Application payante remplacée *
                </label>
                <input
                  type="text"
                  required
                  value={replacedApp}
                  onChange={(e) => setReplacedApp(e.target.value)}
                  placeholder="ex: Notion, Trello, Figma, Jira..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Slogan / Description courte *
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="ex: Alternative 100% gratuite et open-source pour vos notes & wikis d'équipe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Type d&apos;application *</label>
                <select
                  value={appType}
                  onChange={(e) => setAppType(e.target.value as "Web" | "PWA")}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="PWA">PWA (Progressive Web App)</option>
                  <option value="Web">Web Application Standard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Base de données *</label>
                <select
                  value={database}
                  onChange={(e) => setDatabase(e.target.value as "MongoDB" | "PostgreSQL")}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="MongoDB">MongoDB</option>
                  <option value="PostgreSQL">PostgreSQL</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie principale</label>
                <input
                  type="text"
                  value={categories}
                  onChange={(e) => setCategories(e.target.value)}
                  placeholder="Productivité, Design..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Dépôt Git Public (GitHub / GitLab) *
                </label>
                <input
                  type="url"
                  required
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/votre-user/votre-projet"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Lien de démonstration en ligne (optionnel)
                </label>
                <input
                  type="url"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  placeholder="https://votre-demo.example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Stack technique (séparée par des virgules) *
                </label>
                <input
                  type="text"
                  required
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="Next.js, TypeScript, TailwindCSS, Fastify..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fonctionnalités principales (séparées par des virgules) *
                </label>
                <input
                  type="text"
                  required
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Éditeur WYSIWYG, Export PDF, Collaboration live..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description détaillée & Instructions d&apos;hébergement *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Expliquez en détail ce que fait votre application et comment la lancer dans Docker..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-500 disabled:opacity-50 shadow-lg shadow-purple-600/30"
              >
                {submitting ? "Vérification semi-automatique..." : "Soumettre pour validation"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Developer Submitted Apps List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Mes Applications Proposées</h2>

        {loading ? (
          <div className="py-12 text-center text-slate-400 text-xs">Chargement de vos soumissions...</div>
        ) : myApps.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
            <Code className="w-8 h-8 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">Aucune application soumise pour le moment</h3>
            <p className="text-xs text-slate-400">
              Cliquez sur le bouton &quot;Soumettre une nouvelle App&quot; ci-dessus pour ajouter votre premier projet open-source.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myApps.map((app) => (
              <div
                key={app._id}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      Remplace : {app.replacedApp}
                    </span>

                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1 ${
                        app.status === "validated"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : app.status === "rejected"
                          ? "bg-red-500/20 text-red-300 border border-red-500/30"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {app.status === "validated" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Publiée
                        </>
                      ) : app.status === "rejected" ? (
                        <>
                          <XCircle className="w-3 h-3" /> Rejetée
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> En examen Admin
                        </>
                      )}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{app.title}</h3>
                  <p className="text-xs text-slate-300">{app.tagline}</p>

                  <div className="text-[11px] text-slate-400 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-300">Dépôt Git :</span>{" "}
                      <a
                        href={app.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:text-purple-300 font-mono"
                      >
                        {app.githubUrl}
                      </a>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-300">BDD / Conteneur :</span> {app.database} ({app.appType})
                    </div>
                  </div>

                  {app.rejectionReason && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                      <span className="font-bold">Motif de rejet :</span> {app.rejectionReason}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Clics / Vues : {app.clicksCount || 0} / {app.viewsCount || 0}
                  </span>
                  {app.status === "validated" && (
                    <Link
                      href={`/app/${app.slug}`}
                      className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                    >
                      Voir sur le Hub
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DeveloperDashboardPage() {
  return (
    <Suspense fallback={<div className="text-white text-center py-20">Chargement de l&apos;espace...</div>}>
      <DeveloperDashboardContent />
    </Suspense>
  );
}
