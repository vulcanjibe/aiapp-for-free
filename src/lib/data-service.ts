import { connectToDatabase } from "./db";
import { User } from "../models/User";
import { App } from "../models/App";
import { AppIdea } from "../models/AppIdea";
import { CompanyQuoteRequest } from "../models/CompanyQuoteRequest";
import { getStore, saveStore, IAppStore, IUserStore, IAppIdeaStore, ICompanyQuoteRequestStore, ISiteAnalyticsStore } from "./store";

async function checkMongoConnection(): Promise<boolean> {
  try {
    await connectToDatabase();
    return true;
  } catch {
    return false;
  }
}

// ANALYTICS SERVICES
export async function trackPageView(path: string) {
  const store = getStore();
  if (!store.analytics) {
    store.analytics = {
      totalVisits: 0,
      pageViews: {},
      lastVisitedAt: new Date().toISOString(),
    };
  }
  store.analytics.totalVisits = (store.analytics.totalVisits || 0) + 1;
  store.analytics.pageViews[path] = (store.analytics.pageViews[path] || 0) + 1;
  store.analytics.lastVisitedAt = new Date().toISOString();
  saveStore(store);
  return store.analytics;
}

export async function getSiteAnalytics(): Promise<ISiteAnalyticsStore> {
  const store = getStore();
  return (
    store.analytics || {
      totalVisits: 0,
      pageViews: {},
      lastVisitedAt: new Date().toISOString(),
    }
  );
}

// APP SERVICES
export async function getAllApps(filter?: { status?: string; category?: string; search?: string }) {
  const mongo = await checkMongoConnection();
  if (mongo) {
    const query: Record<string, unknown> = {};
    if (filter?.status) query.status = filter.status;
    if (filter?.category && filter.category !== "Toutes") {
      query.categories = filter.category;
    }
    if (filter?.search) {
      const regex = new RegExp(filter.search, "i");
      query.$or = [
        { title: regex },
        { tagline: regex },
        { description: regex },
        { replacedApp: regex },
        { techStack: regex },
      ];
    }
    const docs = await App.find(query).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs)) as IAppStore[];
  }

  const store = getStore();
  let list = [...store.apps];
  if (filter?.status) {
    list = list.filter((a) => a.status === filter.status);
  }
  if (filter?.category && filter.category !== "Toutes") {
    list = list.filter((a) => a.categories.includes(filter.category!));
  }
  if (filter?.search) {
    const term = filter.search.toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(term) ||
        a.tagline.toLowerCase().includes(term) ||
        a.description.toLowerCase().includes(term) ||
        a.replacedApp.toLowerCase().includes(term) ||
        a.techStack.some((ts) => ts.toLowerCase().includes(term))
    );
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAppBySlug(slug: string) {
  const mongo = await checkMongoConnection();
  if (mongo) {
    const doc = await App.findOne({ slug }).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as IAppStore) : null;
  }
  const store = getStore();
  return store.apps.find((a) => a.slug === slug) || null;
}

export async function getAppById(id: string) {
  const mongo = await checkMongoConnection();
  if (mongo) {
    const doc = await App.findById(id).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as IAppStore) : null;
  }
  const store = getStore();
  return store.apps.find((a) => a._id === id) || null;
}

export async function createApp(appData: Partial<IAppStore>) {
  const mongo = await checkMongoConnection();
  if (mongo) {
    const doc = await App.create(appData);
    return JSON.parse(JSON.stringify(doc)) as IAppStore;
  }
  const store = getStore();
  const newApp: IAppStore = {
    _id: `app_${Date.now()}`,
    title: appData.title || "Titre",
    slug: appData.slug || `app-${Date.now()}`,
    tagline: appData.tagline || "",
    description: appData.description || "",
    replacedApp: appData.replacedApp || "",
    categories: appData.categories || [],
    features: appData.features || [],
    githubUrl: appData.githubUrl || "",
    techStack: appData.techStack || [],
    appType: appData.appType || "Web",
    database: appData.database || "MongoDB",
    demoUrl: appData.demoUrl || "",
    developerId: appData.developerId || "usr_dev1",
    developerName: appData.developerName || "Développeur",
    forkedFromAppId: appData.forkedFromAppId,
    status: appData.status || "pending",
    semiValidation: appData.semiValidation || {
      githubAccessible: true,
      hasLicense: true,
      hasDockerfile: true,
      notes: [],
    },
    viewsCount: 0,
    clicksCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.apps.unshift(newApp);
  saveStore(store);
  return newApp;
}

export async function updateAppStatus(id: string, status: "validated" | "rejected", rejectionReason?: string) {
  const mongo = await checkMongoConnection();
  if (mongo) {
    const doc = await App.findByIdAndUpdate(
      id,
      { status, rejectionReason, updatedAt: new Date() },
      { new: true }
    ).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as IAppStore) : null;
  }
  const store = getStore();
  const index = store.apps.findIndex((a) => a._id === id);
  if (index !== -1) {
    store.apps[index].status = status;
    if (rejectionReason) store.apps[index].rejectionReason = rejectionReason;
    store.apps[index].updatedAt = new Date().toISOString();
    saveStore(store);
    return store.apps[index];
  }
  return null;
}

export async function incrementAppClicks(id: string) {
  const mongo = await checkMongoConnection();
  if (mongo) {
    await App.findByIdAndUpdate(id, { $inc: { clicksCount: 1 } });
    return;
  }
  const store = getStore();
  const app = store.apps.find((a) => a._id === id);
  if (app) {
    app.clicksCount = (app.clicksCount || 0) + 1;
    saveStore(store);
  }
}

// USER SERVICES
export async function getUserByEmail(email: string) {
  const mongo = await checkMongoConnection();
  if (mongo) {
    const doc = await User.findOne({ email: email.toLowerCase() }).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as IUserStore) : null;
  }
  const store = getStore();
  return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser(userData: Partial<IUserStore>) {
  const mongo = await checkMongoConnection();
  if (mongo) {
    const doc = await User.create(userData);
    return JSON.parse(JSON.stringify(doc)) as IUserStore;
  }
  const store = getStore();
  const newUser: IUserStore = {
    _id: `usr_${Date.now()}`,
    name: userData.name || "Utilisateur",
    email: userData.email?.toLowerCase() || "",
    password: userData.password,
    role: userData.role || "user",
    isApprovedDeveloper: userData.role === "developer" ? true : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.users.push(newUser);
  saveStore(store);
  return newUser;
}

export async function getAllUsers() {
  const mongo = await checkMongoConnection();
  if (mongo) {
    const docs = await User.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs)) as IUserStore[];
  }
  const store = getStore();
  return store.users;
}

// APP IDEAS SERVICES
export async function getAllIdeas() {
  const mongo = await checkMongoConnection();
  if (mongo) {
    const docs = await AppIdea.find({}).sort({ votesCount: -1 }).lean();
    return JSON.parse(JSON.stringify(docs)) as IAppIdeaStore[];
  }
  const store = getStore();
  return [...store.ideas].sort((a, b) => b.votesCount - a.votesCount);
}

export async function createIdea(data: Partial<IAppIdeaStore>) {
  const mongo = await checkMongoConnection();
  if (mongo) {
    const doc = await AppIdea.create(data);
    return JSON.parse(JSON.stringify(doc)) as IAppIdeaStore;
  }
  const store = getStore();
  const newIdea: IAppIdeaStore = {
    _id: `idea_${Date.now()}`,
    title: data.title || "",
    paidAppName: data.paidAppName || "",
    description: data.description || "",
    category: data.category || "Autre",
    suggestedByUserId: data.suggestedByUserId,
    suggestedByName: data.suggestedByName || "Anonyme",
    votesCount: 1,
    votedUserIds: data.suggestedByUserId ? [data.suggestedByUserId] : [],
    status: "open",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.ideas.unshift(newIdea);
  saveStore(store);
  return newIdea;
}

export async function toggleVoteIdea(ideaId: string, userId: string) {
  const mongo = await checkMongoConnection();
  if (mongo) {
    const idea = await AppIdea.findById(ideaId);
    if (!idea) return null;
    const index = idea.votedUserIds.findIndex((id) => id.toString() === userId);
    if (index > -1) {
      idea.votedUserIds.splice(index, 1);
      idea.votesCount = Math.max(0, idea.votesCount - 1);
    } else {
      idea.votedUserIds.push(userId as unknown as import("mongoose").Types.ObjectId);
      idea.votesCount += 1;
    }
    await idea.save();
    return JSON.parse(JSON.stringify(idea)) as IAppIdeaStore;
  }

  const store = getStore();
  const idea = store.ideas.find((i) => i._id === ideaId);
  if (!idea) return null;

  if (!idea.votedUserIds) idea.votedUserIds = [];
  const hasVoted = idea.votedUserIds.includes(userId);
  if (hasVoted) {
    idea.votedUserIds = idea.votedUserIds.filter((id) => id !== userId);
    idea.votesCount = Math.max(0, idea.votesCount - 1);
  } else {
    idea.votedUserIds.push(userId);
    idea.votesCount += 1;
  }
  idea.updatedAt = new Date().toISOString();
  saveStore(store);
  return idea;
}

// COMPANY REQUESTS SERVICES
export async function getAllCompanyRequests() {
  const mongo = await checkMongoConnection();
  if (mongo) {
    const docs = await CompanyQuoteRequest.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(docs)) as ICompanyQuoteRequestStore[];
  }
  const store = getStore();
  return store.companyRequests;
}

export async function createCompanyRequest(data: Partial<ICompanyQuoteRequestStore>) {
  const mongo = await checkMongoConnection();
  if (mongo) {
    const doc = await CompanyQuoteRequest.create(data);
    return JSON.parse(JSON.stringify(doc)) as ICompanyQuoteRequestStore;
  }
  const store = getStore();
  const newReq: ICompanyQuoteRequestStore = {
    _id: `req_${Date.now()}`,
    companyName: data.companyName || "",
    contactName: data.contactName || "",
    contactEmail: data.contactEmail || "",
    contactPhone: data.contactPhone || "",
    companySize: data.companySize || "TPE (<10)",
    currentPaidApp: data.currentPaidApp || "",
    approximateAnnualCost: data.approximateAnnualCost || "",
    projectDescription: data.projectDescription || "",
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.companyRequests.unshift(newReq);
  saveStore(store);
  return newReq;
}

export async function updateCompanyRequestStatus(id: string, status: "new" | "in_review" | "contacted" | "closed", adminNotes?: string) {
  const mongo = await checkMongoConnection();
  if (mongo) {
    const doc = await CompanyQuoteRequest.findByIdAndUpdate(
      id,
      { status, adminNotes, updatedAt: new Date() },
      { new: true }
    ).lean();
    return doc ? (JSON.parse(JSON.stringify(doc)) as ICompanyQuoteRequestStore) : null;
  }
  const store = getStore();
  const req = store.companyRequests.find((r) => r._id === id);
  if (req) {
    req.status = status;
    if (adminNotes !== undefined) req.adminNotes = adminNotes;
    req.updatedAt = new Date().toISOString();
    saveStore(store);
    return req;
  }
  return null;
}
