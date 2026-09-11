# 🚀 Guide de Déploiement Gratuit sur Vercel (CI/CD) & MongoDB - FreeHub

Ce guide vous explique étape par étape comment déployer l'application **FreeHub** sur votre compte Vercel avec votre propre base de données **MongoDB Atlas**, le script de seed initial et le déploiement continu automatique (CI/CD).

---

## 🛠️ Prérequis

1. Un compte [GitHub](https://github.com)
2. Un compte [Vercel](https://vercel.com)
3. Un cluster MongoDB gratuit [MongoDB Atlas Free Tier - M0](https://www.mongodb.com/cloud/atlas).

---

## 🍃 Étape 1 : Initialiser la Base de Données MongoDB (Seeding)

Pour injecter les données initiales du Hub (applications de démonstration, utilisateurs, demandes entreprises, idées d'applications à voter) dans votre base MongoDB Atlas :

1. Récupérez la chaîne de connexion de votre cluster MongoDB Atlas (ex: `mongodb+srv://mon_user:mon_password@cluster0.mongodb.net/freehub`).
2. Lancez le script de seeding intégré depuis votre terminal :
   ```bash
   MONGODB_URI="mongodb+srv://mon_user:mon_password@cluster0.mongodb.net/freehub" npm run seed
   ```
3. Le script va créer automatiquement les collections `users`, `apps`, `appideas` et `companyquoterequests` avec toutes les données de démonstration.

---

## 📋 Étape 2 : Pousser le projet sur votre dépôt GitHub

1. Créez un nouveau dépôt sur GitHub nommé `freehub`.
2. Poussez le code sur la branche principale (`main`) :
   ```bash
   git remote add origin https://github.com/VOTRE_USER_GITHUB/freehub.git
   git branch -M main
   git push -u origin main
   ```

---

## 🚀 Étape 3 : Importer le projet dans Vercel

1. Connectez-vous sur [Vercel Dashboard](https://vercel.com/dashboard).
2. Cliquez sur **"Add New..."** > **"Project"**.
3. Sélectionnez votre dépôt GitHub `freehub` et cliquez sur **"Import"**.
4. Vercel va automatiquement détecter le framework **Next.js**.

---

## ⚙️ Étape 4 : Configurer les Variables d'Environnement dans Vercel

Dans la section **Environment Variables** de Vercel, ajoutez :

| Clé | Exemple de Valeur | Description |
| :--- | :--- | :--- |
| `NEXTAUTH_SECRET` | `un_secret_tres_securise_chiffre_12345` | Clé secrète JWT NextAuth (générez avec `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://votre-projet.vercel.app` | URL finale attribuée par Vercel |
| `MONGODB_URI` | `mongodb+srv://mon_user:mon_password@cluster0.mongodb.net/freehub` | URL MongoDB Atlas de votre cluster |

---

## 🎉 Étape 5 : Déploiement & CI/CD Automatique

1. Cliquez sur **"Deploy"**.
2. Vercel va installer les dépendances, exécuter le build Next.js et publier votre site en ligne.
3. **Déploiement Continu (CI/CD)** :
   - À chaque `git push` sur `main`, Vercel déploiera automatiquement la mise à jour.
   - La GitHub Action `.github/workflows/vercel-ci.yml` vérifiera automatiquement le linter et la validité du build.

---

## 🔑 Comptes de Démonstration Préconfigurés

Une fois les données initialisées (`npm run seed`), vous pourrez vous connecter immédiatement avec :

- **Administrateur** : `admin@freehub.fr` / Mot de passe : `Password123!`
- **Développeur** : `dev@freehub.fr` / Mot de passe : `Password123!`
- **Entreprise** : `contact@entreprise.fr` / Mot de passe : `Password123!`
- **Utilisateur** : `user@freehub.fr` / Mot de passe : `Password123!`
