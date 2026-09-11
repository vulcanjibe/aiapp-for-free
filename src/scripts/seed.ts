import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { App } from "../models/App";
import { AppIdea } from "../models/AppIdea";
import { CompanyQuoteRequest } from "../models/CompanyQuoteRequest";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/freehub";

async function seed() {
  console.log(`Connecting to MongoDB at ${MONGODB_URI} for seeding...`);
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }

  console.log("Cleaning up existing collection data...");
  await User.deleteMany({});
  await App.deleteMany({});
  await AppIdea.deleteMany({});
  await CompanyQuoteRequest.deleteMany({});

  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Create Users
  await User.create({
    name: "Administrateur FreeHub",
    email: "admin@freehub.fr",
    password: passwordHash,
    role: "admin",
  });

  const devUser = await User.create({
    name: "Thomas Dev",
    email: "dev@freehub.fr",
    password: passwordHash,
    role: "developer",
    isApprovedDeveloper: true,
  });

  const devUser2 = await User.create({
    name: "Sophie OpenSource",
    email: "sophie@freehub.fr",
    password: passwordHash,
    role: "developer",
    isApprovedDeveloper: true,
  });

  const normalUser = await User.create({
    name: "Jean Utilisateur",
    email: "user@freehub.fr",
    password: passwordHash,
    role: "user",
  });

  await User.create({
    name: "Entreprise Innov",
    email: "contact@entreprise.fr",
    password: passwordHash,
    role: "company",
  });

  console.log("Users created successfully.");

  // 2. Create Sample Free Applications
  const app1 = await App.create({
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
    developerId: devUser._id,
    developerName: devUser.name,
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
  });

  await App.create({
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
    developerId: devUser2._id,
    developerName: devUser2.name,
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
  });

  await App.create({
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
    developerId: devUser._id,
    developerName: devUser.name,
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
  });

  // Fork application example
  await App.create({
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
    developerId: devUser2._id,
    developerName: devUser2.name,
    forkedFromAppId: app1._id,
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
  });

  // Pending application for Admin testing
  await App.create({
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
    developerId: devUser._id,
    developerName: devUser.name,
    status: "pending",
    semiValidation: {
      githubAccessible: true,
      hasLicense: true,
      hasDockerfile: true,
      databaseDetected: "PostgreSQL",
      notes: ["En attente d'examen par l'administrateur"],
    },
    viewsCount: 50,
    clicksCount: 12,
  });

  console.log("Apps created successfully.");

  // 3. Create App Ideas & Votes
  await AppIdea.create({
    title: "Alternative à Salesforce / Hubspot CRM",
    paidAppName: "Salesforce / Hubspot",
    description:
      "Un CRM simple pour gérer les contacts, les opportunités commerciales et le suivi client sans payer des centaines d'euros par mois.",
    category: "Business / Ventes",
    suggestedByUserId: normalUser._id,
    suggestedByName: normalUser.name,
    votesCount: 14,
    votedUserIds: [normalUser._id],
    status: "open",
  });

  await AppIdea.create({
    title: "Alternative à Slack / Discord Pro",
    paidAppName: "Slack Pro",
    description:
      "Messagerie d'équipe temps réel avec recherche illimitée dans l'historique et canaux thématiques.",
    category: "Communication",
    suggestedByUserId: normalUser._id,
    suggestedByName: normalUser.name,
    votesCount: 22,
    votedUserIds: [normalUser._id],
    status: "in_development",
  });

  console.log("App ideas created.");

  // 4. Create Company Quote Requests
  await CompanyQuoteRequest.create({
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
  });

  console.log("Company quote requests created.");

  console.log("Database successfully seeded!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
