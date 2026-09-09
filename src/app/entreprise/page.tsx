"use client";

import { useState } from "react";
import { Building2, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle, DollarSign, Cpu } from "lucide-react";

export default function EnterprisePage() {
  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [companySize, setCompanySize] = useState("PME (10-250)");
  const [currentPaidApp, setCurrentPaidApp] = useState("");
  const [approximateAnnualCost, setApproximateAnnualCost] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSubmitting(true);

    try {
      const res = await fetch("/api/company-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          contactName,
          contactEmail,
          contactPhone,
          companySize,
          currentPaidApp,
          approximateAnnualCost,
          projectDescription,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Une erreur est survenue lors de la soumission.");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      // Reset
      setCompanyName("");
      setContactName("");
      setContactEmail("");
      setContactPhone("");
      setCurrentPaidApp("");
      setApproximateAnnualCost("");
      setProjectDescription("");
    } catch {
      setError("Une erreur s'est produite lors de la soumission de votre demande.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
          <Building2 className="w-4 h-4 text-blue-400" />
          <span>Espace Offre Sur-Mesure TPE / PME</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Passez de vos abonnements logiciels coûteux à une{" "}
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            version sur-mesure à moindre coût
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          Vous payez des milliers d&apos;euros par an pour un SaaS propriétaire dont vous n&apos;utilisez que 20% des fonctionnalités ? Demandez une étude pour migrer votre outil interne vers une application Web/PWA open-source développée via Vibe Coding avec des agents IA.
        </p>
      </div>

      {/* Value Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Économies Drastiques</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Éliminez les frais de licence récurrents par utilisateur. Devenez propriétaire de votre code et hébergez-le sur votre propre infrastructure Docker.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Vibe Coding & IA</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Développement accéléré par des agents IA autonomes pour un coût de réalisation divisé par 5 par rapport aux méthodes de développement traditionnelles.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Souveraineté des Données</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gardez le contrôle total sur vos données sensibles hébergées sur vos bases MongoDB ou PostgreSQL sécurisées.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-slate-900/90 rounded-3xl border border-blue-500/30 p-8 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            <Sparkles className="w-5 h-5" />
            Demande d&apos;Étude & d&apos;Estimation
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            Décrivez votre besoin de portage d&apos;application
          </h2>
          <p className="text-xs text-slate-400">
            Un administrateur et des développeurs certifiés du Hub étudieront votre demande et vous recontacteront avec une proposition chiffrée sous 48h.
          </p>
        </div>

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
            <div>
              <span className="font-bold block text-sm">Votre demande a été enregistrée avec succès !</span>
              Notre équipe d&apos;experts Vibe Coding va analyser votre besoin et vous contacter par email dans les plus brefs délais.
            </div>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Raison Sociale / Nom de l&apos;entreprise *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="ex: LogiTrans SARL"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Taille de l&apos;entreprise *
              </label>
              <select
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TPE (<10)">TPE (&lt;10 salariés)</option>
                <option value="PME (10-250)">PME (10 à 250 salariés)</option>
                <option value="ETI / Autre">ETI / Autre structure</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nom du contact référent *
              </label>
              <input
                type="text"
                required
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Marc Dupont"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email professionnel *
              </label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="m.dupont@entreprise.fr"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Logiciel payant actuellement utilisé *
              </label>
              <input
                type="text"
                required
                value={currentPaidApp}
                onChange={(e) => setCurrentPaidApp(e.target.value)}
                placeholder="ex: Salesforce CRM, ERP Propriétaire, Jira Pro..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Coût annuel estimé de cet abonnement
              </label>
              <input
                type="text"
                value={approximateAnnualCost}
                onChange={(e) => setApproximateAnnualCost(e.target.value)}
                placeholder="ex: 8 000 € / an"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Description de vos besoins & périmètre fonctionnel *
            </label>
            <textarea
              required
              rows={4}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Expliquez brièvement comment votre équipe utilise ce logiciel et quelles sont les fonctionnalités cruciales à réimplémenter..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {submitting ? "Envoi de votre demande..." : "Envoyer ma demande d'étude gratuite"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
