"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Building2,
  Users,
  Cpu,
} from "lucide-react";
import { IAppStore, ICompanyQuoteRequestStore, IUserStore } from "@/lib/store";

export default function AdminDashboardPage() {
  const { data: session, status: authStatus } = useSession();

  const [activeTab, setActiveTab] = useState<"apps" | "requests" | "users">("apps");

  const [apps, setApps] = useState<IAppStore[]>([]);
  const [companyRequests, setCompanyRequests] = useState<ICompanyQuoteRequestStore[]>([]);
  const [users, setUsers] = useState<IUserStore[]>([]);
  const [loading, setLoading] = useState(true);

  // App rejection modal state
  const [rejectingAppId, setRejectingAppId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [appsRes, reqsRes, usersRes] = await Promise.all([
        fetch("/api/apps"),
        fetch("/api/company-requests"),
        fetch("/api/admin/users"),
      ]);

      if (appsRes.ok) setApps(await appsRes.json());
      if (reqsRes.ok) setCompanyRequests(await reqsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetchData();
    }
  }, [session, fetchData]);

  const handleAppStatusChange = async (appId: string, status: "validated" | "rejected", reason?: string) => {
    try {
      const res = await fetch(`/api/admin/apps/${appId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, rejectionReason: reason }),
      });

      if (res.ok) {
        const updated = await res.json();
        setApps((prev) => prev.map((a) => (a._id === appId ? updated : a)));
        setRejectingAppId(null);
        setRejectionReason("");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleCompanyRequestStatusChange = async (
    reqId: string,
    status: "new" | "in_review" | "contacted" | "closed",
    notes?: string
  ) => {
    try {
      const res = await fetch(`/api/admin/company-requests/${reqId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes: notes }),
      });

      if (res.ok) {
        const updated = await res.json();
        setCompanyRequests((prev) => prev.map((r) => (r._id === reqId ? updated : r)));
      }
    } catch (err) {
      console.error("Error updating company request status:", err);
    }
  };

  if (authStatus === "loading") {
    return <div className="text-center py-20 text-slate-400 text-xs">Vérification des droits administrateur...</div>;
  }

  if (!session || session.user?.role !== "admin") {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Accès Administrateur Restreint</h2>
        <p className="text-xs text-slate-400">
          Vous devez être connecté avec le compte Administrateur pour accéder à cet espace.
        </p>
        <Link
          href="/auth/login?callbackUrl=/admin"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-500 transition-colors"
        >
          Se connecter avec le compte Admin (admin@freehub.fr)
        </Link>
      </div>
    );
  }

  const pendingApps = apps.filter((a) => a.status === "pending");

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 p-8 rounded-3xl border border-red-500/30">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Panneau de Contrôle & Sécurité Hub</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Administration du Hub</h1>
          <p className="text-xs text-slate-400">
            Validation de la conformité et sécurité des applications, gestion des demandes d&apos;étude TPE/PME et suivi des utilisateurs.
          </p>
        </div>

        {/* Pending Counter Badge */}
        {pendingApps.length > 0 && (
          <div className="px-4 py-2.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 animate-pulse" />
            <span>{pendingApps.length} application(s) en attente de validation</span>
          </div>
        )}
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("apps")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === "apps"
              ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" />
          Validation des Applications ({apps.length})
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === "requests"
              ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Demandes Entreprises ({companyRequests.length})
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
            activeTab === "users"
              ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          Utilisateurs & Développeurs ({users.length})
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Chargement des données d&apos;administration...</div>
      ) : (
        <>
          {/* TAB 1: APPLICATIONS VALIDATION */}
          {activeTab === "apps" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Soumissions des Développeurs</h2>
              </div>

              {apps.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs bg-slate-900/50 rounded-2xl border border-slate-800">
                  Aucune application soumise pour le moment.
                </div>
              ) : (
                <div className="space-y-4">
                  {apps.map((app) => (
                    <div
                      key={app._id}
                      className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2 max-w-2xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-bold border border-indigo-500/20">
                              Remplace : {app.replacedApp}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px] font-semibold">
                              {app.appType}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 font-mono text-[10px] font-semibold border border-emerald-500/20">
                              BDD: {app.database}
                            </span>
                            <span
                              className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                                app.status === "validated"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : app.status === "rejected"
                                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              }`}
                            >
                              {app.status === "validated"
                                ? "✓ Validée & Publiée"
                                : app.status === "rejected"
                                ? "✕ Rejetée"
                                : "⏳ En attente"}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-white">{app.title}</h3>
                          <p className="text-xs text-slate-300">{app.tagline}</p>

                          <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                            <div>
                              <span className="font-semibold text-slate-300">Dépôt Git :</span>{" "}
                              <a
                                href={app.githubUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline hover:text-indigo-300 font-mono"
                              >
                                {app.githubUrl}
                              </a>
                            </div>
                            <div>
                              <span className="font-semibold text-slate-300">Développeur :</span> {app.developerName}
                            </div>
                          </div>
                        </div>

                        {/* Admin Decision Actions */}
                        <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                          {app.status !== "validated" && (
                            <button
                              onClick={() => handleAppStatusChange(app._id, "validated")}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              Valider & Publier
                            </button>
                          )}

                          {app.status !== "rejected" && (
                            <button
                              onClick={() => {
                                setRejectingAppId(app._id);
                                setRejectionReason("Application non conforme aux règles de sécurité ou conteneur manquant.");
                              }}
                              className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                              Rejeter
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Semi-Validation Summary Box */}
                      {app.semiValidation && (
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                          <div className="font-bold text-slate-300 flex items-center gap-1.5">
                            <Cpu className="w-4 h-4 text-indigo-400" />
                            Résultat de l&apos;Analyse Semi-Automatique :
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                            <div className="p-2 rounded bg-slate-900 border border-slate-800">
                              Dépôt Public :{" "}
                              <span className={app.semiValidation.githubAccessible ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                                {app.semiValidation.githubAccessible ? "✓ GitHub/GitLab Accessible" : "✕ Erreur d'accès"}
                              </span>
                            </div>
                            <div className="p-2 rounded bg-slate-900 border border-slate-800">
                              Dockerfile :{" "}
                              <span className={app.semiValidation.hasDockerfile ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                                {app.semiValidation.hasDockerfile ? "✓ Présent" : "A vérifier"}
                              </span>
                            </div>
                            <div className="p-2 rounded bg-slate-900 border border-slate-800">
                              BDD Imposée :{" "}
                              <span className="text-emerald-400 font-bold">{app.database}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Rejection Form Modal */}
                      {rejectingAppId === app._id && (
                        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 space-y-3">
                          <label className="block text-xs font-bold text-red-300">
                            Motif du rejet (visible par le développeur) :
                          </label>
                          <textarea
                            rows={2}
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:ring-2 focus:ring-red-500"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => setRejectingAppId(null)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                            >
                              Annuler
                            </button>
                            <button
                              onClick={() => handleAppStatusChange(app._id, "rejected", rejectionReason)}
                              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-500"
                            >
                              Confirmer le Rejet
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPANY STUDY REQUESTS */}
          {activeTab === "requests" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Demandes d&apos;Étude TPE / PME</h2>

              {companyRequests.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs bg-slate-900/50 rounded-2xl border border-slate-800">
                  Aucune demande d&apos;étude d&apos;entreprise enregistrée.
                </div>
              ) : (
                <div className="space-y-4">
                  {companyRequests.map((req) => (
                    <div
                      key={req._id}
                      className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 space-y-4 hover:border-slate-700 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 text-[10px] font-bold border border-blue-500/20">
                              {req.companySize}
                            </span>
                            <span
                              className={`text-[10px] px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                                req.status === "new"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : req.status === "in_review"
                                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                  : req.status === "contacted"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              Statut : {req.status}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-white">{req.companyName}</h3>
                          <p className="text-xs text-slate-300">
                            <span className="font-semibold text-slate-200">Contact :</span> {req.contactName} ({req.contactEmail} / {req.contactPhone || "Non renseigné"})
                          </p>
                          <p className="text-xs text-slate-300">
                            <span className="font-semibold text-slate-200">Logiciel actuel :</span> {req.currentPaidApp} ({req.approximateAnnualCost || "Coût non précisé"})
                          </p>
                        </div>

                        {/* Status update controls */}
                        <div className="flex flex-wrap gap-2 shrink-0">
                          <button
                            onClick={() => handleCompanyRequestStatusChange(req._id, "in_review")}
                            className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold"
                          >
                            En examen
                          </button>
                          <button
                            onClick={() => handleCompanyRequestStatusChange(req._id, "contacted")}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold"
                          >
                            Contacté
                          </button>
                          <button
                            onClick={() => handleCompanyRequestStatusChange(req._id, "closed")}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                          >
                            Clôturer
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <span className="font-bold text-slate-200 block">Description du projet :</span>
                        <p className="leading-relaxed">{req.projectDescription}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: USERS & DEVELOPERS */}
          {activeTab === "users" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Utilisateurs & Développeurs Inscrits</h2>

              <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Nom / Identifiant</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Rôle</th>
                      <th className="p-4">Date d&apos;inscription</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-bold text-white">{u.name}</td>
                        <td className="p-4 font-mono">{u.email}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${
                              u.role === "admin"
                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                : u.role === "developer"
                                ? "bg-purple-500/20 text-purple-300 border-purple-500/30"
                                : u.role === "company"
                                ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
