# 🚀 Guide de Déploiement Gratuit sur Vercel (CI/CD) - FreeHub

Ce guide vous explique étape par étape comment déployer l'application **FreeHub** sur votre compte Vercel avec déploiement continu automatique (CI/CD) connecté à GitHub.

---

## 🛠️ Prérequis

1. Un compte [GitHub](https://github.com)
2. Un compte [Vercel](https://vercel.com)
3. Un cluster MongoDB gratuit [MongoDB Atlas Free Tier - M0](https://www.mongodb.com/cloud/atlas) *(fortement recommandé pour la persistance globale)*.

---

## 📋 Étape 1 : Pousser le projet sur votre dépôt GitHub

1. Créez un nouveau dépôt sur GitHub nommé `freehub`.
2. Poussez le code sur la branche principale (`main`) :
   ```bash
   git remote add origin https://github.com/VOTRE_USER_GITHUB/freehub.git
   git branch -M main
   git push -u origin main
   ```

---

## 🚀 Étape 2 : Importer le projet dans Vercel

1. Connectez-vous sur [Vercel Dashboard](https://vercel.com/dashboard).
2. Cliquez sur **"Add New..."** > **"Project"**.
3. Sélectionnez votre dépôt GitHub `freehub` et cliquez sur **"Import"**.
4. Vercel va automatiquement détecter le framework **Next.js**.

---

## ⚙️ Étape 3 : Configurer les Variables d'Environnement dans Vercel

Avant de cliquer sur **Deploy**, développez la section **Environment Variables** et ajoutez :

| Clé | Valeur Exemple / Recommandée | Description |
| :--- | :--- | :--- |
| `NEXTAUTH_SECRET` | `un_secret_tres_securise_chiffre_12345` | Clé secrète JWT NextAuth (générez avec `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://votre-projet.vercel.app` | URL finale attribuée par Vercel |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/freehub` | URL MongoDB Atlas recommandée pour la persistance complète des données |

---

## 🎉 Étape 4 : Déploiement & CI/CD Automatique

1. Cliquez sur **"Deploy"**.
2. Vercel va compiler le projet et générer votre URL publique (ex: `https://freehub-community.vercel.app`).
3. **Déploiement Continu (CI/CD)** :
   - À chaque nouveau `git push` sur la branche `main`, Vercel redéploiera automatiquement la nouvelle version.
   - Les Pull Requests généreront automatiquement des **Preview Deployments** avec URL de test.
   - La GitHub Action `.github/workflows/vercel-ci.yml` exécutera le linter et vérifiera la validité du build à chaque commit.

---

## 🔑 Comptes de Démonstration Préconfigurés

Sur votre déploiement Vercel, vous pourrez vous connecter immédiatement avec :

- **Administrateur** : `admin@freehub.fr` / Mot de passe : `Password123!`
- **Développeur** : `dev@freehub.fr` / Mot de passe : `Password123!`
- **Entreprise** : `contact@entreprise.fr` / Mot de passe : `Password123!`
- **Utilisateur** : `user@freehub.fr` / Mot de passe : `Password123!`
