# 🔧 Guide de Configuration — Admin + Supabase

Ce guide te permet de connecter ton portfolio à Supabase et d'utiliser le
panneau d'administration web pour gérer ton contenu sans toucher au code.

---

## Étape 1 — Créer un projet Supabase (gratuit)

1. Va sur **https://supabase.com** et crée un compte (gratuit)
2. Clique **"New Project"**
3. Choisis un nom (ex: `djlo-portfolio`)
4. Choisis un **mot de passe** pour la base de données (note-le quelque part)
5. Région : choisis la plus proche (ex: `West EU - Ireland`)
6. Clique **"Create new project"** et attends ~2 minutes

---

## Étape 2 — Créer les tables

1. Dans ton projet Supabase, va dans **SQL Editor** (icône dans la barre de gauche)
2. Clique **"New query"**
3. Copie-colle le contenu ENTIER du fichier `supabase/schema.sql`
4. Clique **"Run"** (bouton vert) → tu devrais voir "Success"
5. Crée une nouvelle requête, copie-colle `supabase/seed.sql`
6. Clique **"Run"** → tes données sont maintenant en base

**Vérification :** Va dans **Table Editor** → tu devrais voir tes 6 tables avec des données.

---

## Étape 3 — Créer un utilisateur admin

1. Dans Supabase, va dans **Authentication** (icône barre gauche)
2. Clique **"Add user"** → **"Create new user"**
3. Entre :
   - Email : **ton email** (ex: djloalo@gmail.com)
   - Password : **un mot de passe fort**
   - Coche **"Auto Confirm User"**
4. Clique **"Create user"**

C'est cet email/mot de passe que tu utiliseras pour te connecter à `/admin`

---

## Étape 4 — Récupérer les clés API

1. Dans Supabase, va dans **Settings** → **API** (dans la barre gauche)
2. Note ces 2 valeurs :
   - **Project URL** : `https://xxxxx.supabase.co`
   - **anon public key** : `eyJhbGciOi...` (la clé longue sous "Project API keys")

---

## Étape 5 — Configurer Vercel

1. Va sur **https://vercel.com** → ton projet portfolio
2. Clique **Settings** → **Environment Variables**
3. Ajoute ces 2 variables :

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` |

4. Clique **"Save"** pour chaque variable
5. Va dans **Deployments** → clique les **3 points** sur le dernier déploiement → **"Redeploy"**
6. Attends ~1 minute que le déploiement se termine

---

## Étape 6 — Accéder à l'admin

1. Ouvre **https://ton-site.vercel.app/admin**
2. Entre ton email et mot de passe (créés à l'étape 3)
3. Tu accèdes au dashboard ! 🎉

---

## Comment utiliser le panneau admin

### Navigation
- **Profil** : Modifie tes infos personnelles (nom, titre, email, etc.)
- **Expériences** : Ajoute/modifie/supprime tes expériences professionnelles
- **Compétences** : Gère tes catégories de compétences et les technologies
- **Projets** : Gère tes projets (marque-les comme "phare" pour les mettre en avant)
- **Formation** : Ajoute diplômes et certifications
- **Langues** : Gère tes langues parlées

### Ajouter un élément
1. Clique le bouton bleu **"+ Ajouter"** en haut à droite
2. Remplis le formulaire
3. Clique **"Sauvegarder"**

### Modifier un élément
1. Survole l'élément dans la liste
2. Clique l'icône de crayon ✏️
3. Modifie les champs
4. Clique **"Sauvegarder"**

### Supprimer un élément
1. Survole l'élément
2. Clique l'icône de corbeille 🗑️
3. Confirme la suppression

### Missions / Tags / Items (listes)
- Clique **"+ Ajouter un élément"** pour ajouter une ligne
- Clique le **×** rouge pour supprimer une ligne

### Ordre d'affichage
Le champ "Ordre d'affichage" détermine l'ordre dans lequel les éléments
apparaissent sur le site (1 = premier, 2 = second, etc.)

---

## Notes importantes

- Les modifications sont **instantanées** — le site se met à jour automatiquement
  (rafraîchissement toutes les 60 secondes via ISR)
- Si Supabase est indisponible, le site utilise automatiquement les données locales
  du fichier `src/data/portfolio.js` en secours
- L'URL `/admin` n'est pas indexée par les moteurs de recherche (`noindex`)
- Seuls les utilisateurs authentifiés peuvent modifier les données

---

## Dépannage

**"Supabase non configuré"** → Vérifie que les variables d'environnement sont bien
ajoutées dans Vercel ET que tu as redéployé.

**"Email ou mot de passe incorrect"** → Vérifie dans Supabase → Authentication que
ton utilisateur existe et que "Auto Confirm" est coché.

**Les données ne s'affichent pas** → Vérifie dans Supabase → Table Editor que les
tables ont des données. Si vide, re-exécute `seed.sql`.

**Erreur RLS** → Vérifie que les politiques de sécurité ont été créées (dans
schema.sql). Va dans Supabase → Authentication → Policies pour vérifier.
