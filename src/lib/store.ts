import fs from "fs";
import path from "path";

export type UserRole = "user" | "developer" | "company" | "admin";

export interface IUserStore {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isApprovedDeveloper?: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export type AppStatus = "pending" | "validated" | "rejected";

export interface ISemiValidationResult {
  githubAccessible: boolean;
  hasLicense: boolean;
  hasDockerfile: boolean;
  databaseDetected?: string;
  notes: string[];
}

export interface IAppStore {
  _id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  replacedApp: string;
  categories: string[];
  features: string[];
  githubUrl: string;
  techStack: string[];
  appType: "Web" | "PWA";
  database: "MongoDB" | "PostgreSQL";
  demoUrl?: string;
  developerId: string;
  developerName: string;
  forkedFromAppId?: string;
  status: AppStatus;
  rejectionReason?: string;
  semiValidation?: ISemiValidationResult;
  viewsCount: number;
  clicksCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAppIdeaStore {
  _id: string;
  title: string;
  paidAppName: string;
  description: string;
  category: string;
  suggestedByUserId?: string;
  suggestedByName: string;
  votesCount: number;
  votedUserIds: string[];
  status: "open" | "in_development" | "completed";
  createdAt: string;
  updatedAt: string;
}

export interface ICompanyQuoteRequestStore {
  _id: string;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  companySize: string;
  currentPaidApp: string;
  approximateAnnualCost?: string;
  projectDescription: string;
  status: "new" | "in_review" | "contacted" | "closed";
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDataStore {
  users: IUserStore[];
  apps: IAppStore[];
  ideas: IAppIdeaStore[];
  companyRequests: ICompanyQuoteRequestStore[];
}

const DATA_FILE = path.join(process.cwd(), "data-store.json");

const initialSeedData: IDataStore = {
  users: [
    {
      _id: "usr_admin",
      name: "Administrateur FreeHub",
      email: "admin@freehub.fr",
      password: "$2a$10$wTInaG8N4y3l3tA3YwG9/e8w6Q0d9H0A9W8Z8Y7X6W5V4U3T2S1R0",
      role: "admin",
      isApprovedDeveloper: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "usr_dev1",
      name: "Thomas Dev",
      email: "dev@freehub.fr",
      password: "$2a$10$wTInaG8N4y3l3tA3YwG9/e8w6Q0d9H0A9W8Z8Y7X6W5V4U3T2S1R0",
      role: "developer",
      isApprovedDeveloper: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "usr_dev2",
      name: "Sophie OpenSource",
      email: "sophie@freehub.fr",
      password: "$2a$10$wTInaG8N4y3l3tA3YwG9/e8w6Q0d9H0A9W8Z8Y7X6W5V4U3T2S1R0",
      role: "developer",
      isApprovedDeveloper: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "usr_user1",
      name: "Jean Utilisateur",
      email: "user@freehub.fr",
      password: "$2a$10$wTInaG8N4y3l3tA3YwG9/e8w6Q0d9H0A9W8Z8Y7X6W5V4U3T2S1R0",
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "usr_company1",
      name: "Entreprise Innov",
      email: "contact@entreprise.fr",
      password: "$2a$10$wTInaG8N4y3l3tA3YwG9/e8w6Q0d9H0A9W8Z8Y7X6W5V4U3T2S1R0",
      role: "company",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  apps: [
    {
      _id: "app_1",
      title: "AppFlow Notes",
      slug: "appflow-notes",
      tagline: "L'alternative 100% gratuite et open-source à Notion pour vos notes & wikis",
      description:
        "AppFlow Notes offre un éditeur de bloc riche avec prise en charge du Markdown, des bases de données de cartes, des tableaux Kanban et de la collaboration en temps réel.",
      replacedApp: "Notion",
      categories: ["Productivité", "Bureautique", "Gestion de projet"],
      features: ["Éditeur de bloc Markdown", "Vues Kanban & Table", "Export PDF/JSON", "Mode Sombre/Clair", "PWA hors-ligne"],
      githubUrl: "https://github.com/freehub-community/appflow-notes",
      techStack: ["Next.js", "TypeScript", "TailwindCSS", "Node.js", "MongoDB"],
      appType: "PWA",
      database: "MongoDB",
      demoUrl: "https://appflow-demo.example.com",
      developerId: "usr_dev1",
      developerName: "Thomas Dev",
      status: "validated",
      semiValidation: {
        githubAccessible: true,
        hasLicense: true,
        hasDockerfile: true,
        databaseDetected: "MongoDB",
        notes: ["Dépôt public GitHub vérifié MIT License", "Dockerfile présent", "Stack conforme Web/PWA"],
      },
      viewsCount: 1420,
      clicksCount: 380,
      createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "app_2",
      title: "KanbanFree",
      slug: "kanbanfree",
      tagline: "Alternative légère et ultra rapide à Trello pour gérer vos projets",
      description:
        "Gérez vos projets facilement avec des tableaux Kanban personnalisables, des étiquettes et des pièces jointes sans aucune limite.",
      replacedApp: "Trello",
      categories: ["Gestion de projet", "Productivité"],
      features: ["Tableaux illimités", "Drag & Drop instantané", "Sous-tâches & Checklists", "Notifications Push PWA"],
      githubUrl: "https://github.com/freehub-community/kanban-free",
      techStack: ["React", "TypeScript", "Fastify", "PostgreSQL"],
      appType: "PWA",
      database: "PostgreSQL",
      demoUrl: "https://kanbanfree-demo.example.com",
      developerId: "usr_dev2",
      developerName: "Sophie OpenSource",
      status: "validated",
      semiValidation: {
        githubAccessible: true,
        hasLicense: true,
        hasDockerfile: true,
        databaseDetected: "PostgreSQL",
        notes: ["Licence Apache-2.0 validée", "Conteneur Docker opérationnel"],
      },
      viewsCount: 980,
      clicksCount: 240,
      createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "app_3",
      title: "DesignCraft Studio",
      slug: "designcraft-studio",
      tagline: "Créez vos visuels et prototypes gratuitement à la place de Canva & Figma",
      description:
        "Outil de création graphique vectorielle et de maquettage UI directement dans votre navigateur web.",
      replacedApp: "Canva / Figma",
      categories: ["Design", "Créativité", "Marketing"],
      features: ["Éditeur vectoriel", "Export SVG/PNG/PDF", "Banque de modèles gratuits", "PWA Installable"],
      githubUrl: "https://github.com/freehub-community/designcraft",
      techStack: ["Next.js", "Canvas API", "TailwindCSS", "MongoDB"],
      appType: "PWA",
      database: "MongoDB",
      demoUrl: "https://designcraft.example.com",
      developerId: "usr_dev1",
      developerName: "Thomas Dev",
      status: "validated",
      semiValidation: {
        githubAccessible: true,
        hasLicense: true,
        hasDockerfile: true,
        databaseDetected: "MongoDB",
        notes: ["Conforme aux critères du Hub"],
      },
      viewsCount: 2100,
      clicksCount: 610,
      createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "app_4",
      title: "AppFlow Notes Extended",
      slug: "appflow-notes-extended",
      tagline: "Fork d'AppFlow Notes avec assistant IA d'auto-synthèse intégré",
      description:
        "Version améliorée d'AppFlow Notes incorporant un assistant IA local pour la rédaction et le résumé automatique de réunions.",
      replacedApp: "Notion AI",
      categories: ["Productivité", "IA / Automation"],
      features: ["Toutes les fonctionnalités d'AppFlow", "Auto-synthèse IA", "Prise de note vocale"],
      githubUrl: "https://github.com/freehub-community/appflow-notes-ai-fork",
      techStack: ["Next.js", "Python", "MongoDB"],
      appType: "Web",
      database: "MongoDB",
      demoUrl: "https://appflow-ai.example.com",
      developerId: "usr_dev2",
      developerName: "Sophie OpenSource",
      forkedFromAppId: "app_1",
      status: "validated",
      semiValidation: {
        githubAccessible: true,
        hasLicense: true,
        hasDockerfile: true,
        databaseDetected: "MongoDB",
        notes: ["Dépôt de fork validé"],
      },
      viewsCount: 450,
      clicksCount: 120,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "app_5",
      title: "FitTracker Free",
      slug: "fittracker-free",
      tagline: "Suivi de nutrition et séances de sport sans aucun abonnement payant",
      description: "Alternative gratuite à MyFitnessPal et Strava pour enregistrer ses repas et entraînements.",
      replacedApp: "MyFitnessPal / Strava",
      categories: ["Sport", "Alimentation", "Santé"],
      features: ["Calculateur de calories", "Journal d'entraînement", "Suivi du poids"],
      githubUrl: "https://github.com/freehub-community/fittracker",
      techStack: ["React Native Web", "TypeScript", "PostgreSQL"],
      appType: "PWA",
      database: "PostgreSQL",
      demoUrl: "https://fittracker.example.com",
      developerId: "usr_dev1",
      developerName: "Thomas Dev",
      status: "pending",
      semiValidation: {
        githubAccessible: true,
        hasLicense: true,
        hasDockerfile: true,
        databaseDetected: "PostgreSQL",
        notes: ["En attente d'examen par l'administrateur du Hub"],
      },
      viewsCount: 50,
      clicksCount: 12,
      createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  ideas: [
    {
      _id: "idea_1",
      title: "Alternative à Salesforce / Hubspot CRM",
      paidAppName: "Salesforce / Hubspot",
      description:
        "Un CRM simple pour gérer les contacts, les opportunités commerciales et le suivi client sans payer des centaines d'euros par mois.",
      category: "Business / Ventes",
      suggestedByUserId: "usr_user1",
      suggestedByName: "Jean Utilisateur",
      votesCount: 14,
      votedUserIds: ["usr_user1"],
      status: "open",
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: "idea_2",
      title: "Alternative à Slack / Discord Pro",
      paidAppName: "Slack Pro",
      description:
        "Messagerie d'équipe temps réel avec recherche illimitée dans l'historique et canaux thématiques.",
      category: "Communication",
      suggestedByUserId: "usr_user1",
      suggestedByName: "Jean Utilisateur",
      votesCount: 22,
      votedUserIds: ["usr_user1"],
      status: "in_development",
      createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  companyRequests: [
    {
      _id: "req_1",
      companyName: "LogiTrans SARL",
      contactName: "Marc Dupont",
      contactEmail: "marc.dupont@logitrans.fr",
      contactPhone: "+33 6 12 34 56 78",
      companySize: "PME (10-250)",
      currentPaidApp: "ERP Payant Propriétaire & Tableau Jira",
      approximateAnnualCost: "12 000 € / an",
      projectDescription:
        "Nous cherchons à porter notre outil interne de gestion des tournées de livraison sur une alternative web/PWA développée via Vibe Coding pour réduire nos frais récurrents.",
      status: "new",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

export function getStore(): IDataStore {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialSeedData, null, 2), "utf8");
    return initialSeedData;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading store:", err);
    return initialSeedData;
  }
}

export function saveStore(data: IDataStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing store:", err);
  }
}

export function resetStoreToSeed() {
  saveStore(initialSeedData);
  return initialSeedData;
}
