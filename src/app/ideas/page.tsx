"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lightbulb, ThumbsUp, PlusCircle, AlertCircle, Sparkles, CheckCircle, Lock } from "lucide-react";
import { IAppIdeaStore } from "@/lib/store";

export default function IdeasPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [ideas, setIdeas] = useState<IAppIdeaStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [paidAppName, setPaidAppName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Productivité");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ideas");
      if (res.ok) {
        const data = await res.json();
        setIdeas(data);
      }
    } catch (err) {
      console.error("Error fetching ideas:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (ideaId: string) => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=/ideas`);
      return;
    }

    try {
      const res = await fetch(`/api/ideas/${ideaId}/vote`, {
        method: "POST",
      });
      if (res.ok) {
        const updated = await res.json();
        setIdeas((prev) =>
          prev.map((item) => (item._id === ideaId ? updated : item)).sort((a, b) => b.votesCount - a.votesCount)
        );
      }
    } catch (err) {
      console.error("Error voting:", err);
    }
  };

  const handleSubmitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, paidAppName, description, category }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Erreur lors de la soumission");
        setSubmitting(false);
        return;
      }

      const created = await res.json();
      setIdeas((prev) => [created, ...prev]);
      setSuccess("Votre proposition d'application payante à remplacer a été publiée !");
      setTitle("");
      setPaidAppName("");
      setDescription("");
      setShowForm(false);
    } catch {
      setError("Une erreur s'est produite.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Lightbulb className="w-4 h-4" />
            <span>Boîte aux Idées & Propositions de la Communauté</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">
            Proposer & Voter pour les prochaines applications gratuites
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Proposez une application payante que vous souhaitez voir développée en version gratuite open-source. Les développeurs IA priorisent les projets ayant le plus de votes !
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          Proposer une application
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Submission Form Modal / Collapsible */}
      {showForm && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-amber-500/30 shadow-2xl space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Nouvelle Proposition d&apos;Application Payante à Remplacer
          </h2>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmitIdea} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nom de l&apos;application payante actuelle *
                </label>
                <input
                  type="text"
                  required
                  value={paidAppName}
                  onChange={(e) => setPaidAppName(e.target.value)}
                  placeholder="ex: Salesforce, Slack Pro, Figma..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Titre du projet d&apos;alternative *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: OpenCRM - Alternative gratuite à Salesforce"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="Productivité">Productivité</option>
                  <option value="Gestion de projet">Gestion de projet</option>
                  <option value="Business / Ventes">Business / Ventes</option>
                  <option value="Communication">Communication</option>
                  <option value="Design">Design</option>
                  <option value="Sport">Sport</option>
                  <option value="Alimentation">Alimentation</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Description des fonctionnalités souhaitées *
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez les fonctionnalités essentielles que cette alternative gratuite devra posséder..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 disabled:opacity-50"
              >
                {submitting ? "Publication..." : "Publier l'idée"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ideas List with Vote Counters */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">
          Chargement des propositions de la communauté...
        </div>
      ) : ideas.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs bg-slate-900/50 rounded-2xl border border-slate-800">
          Aucune proposition pour l&apos;instant. Soyez le premier à proposer une idée !
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => {
            const hasVoted = session && idea.votedUserIds?.includes(session.user.id);

            return (
              <div
                key={idea._id}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 flex items-start gap-4 hover:border-slate-700 transition-all"
              >
                {/* Vote Counter Column */}
                <button
                  onClick={() => handleVote(idea._id)}
                  className={`flex flex-col items-center justify-center min-w-[60px] p-3 rounded-2xl border font-bold transition-all ${
                    hasVoted
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:border-amber-500/30 hover:text-amber-400"
                  }`}
                  title={session ? "Voter pour cette idée" : "Connectez-vous pour voter"}
                >
                  <ThumbsUp className={`w-5 h-5 ${hasVoted ? "fill-amber-400 text-amber-400" : ""}`} />
                  <span className="text-sm mt-1">{idea.votesCount || 0}</span>
                  {!session && <Lock className="w-3 h-3 mt-1 text-slate-500" />}
                </button>

                {/* Idea Details */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-300 text-[10px] font-bold border border-red-500/20">
                        Abonnement Payant : {idea.paidAppName}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">
                        {idea.category}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        idea.status === "in_development"
                          ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          : idea.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                      }`}
                    >
                      {idea.status === "in_development"
                        ? "En cours de dev IA"
                        : idea.status === "completed"
                        ? "Développé & Dispo"
                        : "En vote"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{idea.title}</h3>

                  <p className="text-xs text-slate-300 leading-relaxed">{idea.description}</p>

                  <div className="text-[10px] text-slate-500 pt-1">
                    Proposé par <span className="text-slate-400 font-semibold">{idea.suggestedByName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
