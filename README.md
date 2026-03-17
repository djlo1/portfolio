# 🚀 Portfolio — Djlo ALOHOU

Portfolio professionnel moderne avec design hi-tech, hébergé sur Vercel.

## ✨ Fonctionnalités

- **Design hi-tech** : Thème sombre, animations particules, effets glassmorphism
- **Responsive** : Mobile-first, adapté à tous les écrans
- **Rapide** : Next.js 14 avec optimisations automatiques
- **Contenu modifiable** : Modifie `src/data/portfolio.js` OU utilise Supabase
- **SEO optimisé** : Métadonnées, Open Graph, structure sémantique

## 📁 Structure du projet

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.js       ← Layout racine (SEO, fonts)
│   │   ├── page.js         ← Page principale
│   │   └── globals.css     ← Styles globaux
│   ├── components/
│   │   ├── Navbar.jsx      ← Navigation
│   │   ├── Hero.jsx        ← Section d'accueil + particules
│   │   ├── About.jsx       ← À propos + services
│   │   ├── Experience.jsx  ← Timeline expérience
│   │   ├── Skills.jsx      ← Compétences + langues
│   │   ├── Projects.jsx    ← Projets réalisés
│   │   ├── Education.jsx   ← Formation + certifications
│   │   ├── Contact.jsx     ← Contact + CTA
│   │   └── Footer.jsx      ← Pied de page
│   ├── data/
│   │   └── portfolio.js    ← 🎯 TOUTES LES DONNÉES ICI
│   └── lib/
│       └── supabase.js     ← Client Supabase (optionnel)
├── supabase/
│   └── schema.sql          ← Schéma SQL pour Supabase
├── public/
│   └── photo.jpg           ← Ta photo (à ajouter)
└── package.json
```

## 🛠️ Déploiement Étape par Étape

### Étape 1 — Prérequis

Installe ces outils si tu ne les as pas :
- **Node.js** (v18+) : https://nodejs.org
- **Git** : https://git-scm.com
- **Compte GitHub** : https://github.com
- **Compte Vercel** : https://vercel.com (connexion avec GitHub)

### Étape 2 — Créer le dépôt GitHub

```bash
# 1. Va sur https://github.com/new
# 2. Nom du dépôt : "portfolio" (ou ce que tu veux)
# 3. Laisse "Public" coché
# 4. Ne coche PAS "Add a README" (on en a déjà un)
# 5. Clique "Create repository"
```

### Étape 3 — Préparer et pousser le code

```bash
# Ouvre un terminal dans le dossier du portfolio

# Initialise Git
cd portfolio
git init

# Ajoute ta photo dans public/photo.jpg (optionnel)

# Ajoute tous les fichiers
git add .
git commit -m "Initial portfolio"

# Connecte à GitHub (remplace TonUsername)
git remote add origin https://github.com/TonUsername/portfolio.git
git branch -M main
git push -u origin main
```

### Étape 4 — Déployer sur Vercel

1. Va sur https://vercel.com/new
2. Clique **"Import Git Repository"**
3. Sélectionne ton dépôt `portfolio`
4. Vercel détecte automatiquement Next.js
5. Clique **"Deploy"**
6. En 1-2 minutes, ton site est en ligne ! 🎉

Ton URL sera : `https://portfolio-xxx.vercel.app`

### Étape 5 (Optionnel) — Domaine personnalisé

1. Dans Vercel → Settings → Domains
2. Ajoute ton domaine (ex: `djloalohou.com`)
3. Configure les DNS chez ton registrar

## ✏️ Modifier le contenu

### Méthode simple — Éditer le fichier de données

Ouvre `src/data/portfolio.js` et modifie directement. Exemples :

**Ajouter un projet :**
```js
// Dans le tableau "projects"
{
  id: 7,
  title: "Mon Nouveau Projet",
  description: "Description du projet...",
  tags: ["FMS", "Web"],
  highlight: true,
},
```

**Ajouter une expérience :**
```js
// Dans le tableau "experiences"
{
  id: 7,
  company: "Nouvelle Entreprise",
  location: "Cotonou, Bénin",
  period: "2025",
  role: "Mon Rôle",
  missions: [
    "Mission 1",
    "Mission 2",
  ],
},
```

Après modification :
```bash
git add .
git commit -m "Ajout nouveau projet"
git push
```
Vercel redéploie automatiquement en quelques secondes !

### Méthode avancée — Supabase (interface web)

Si tu veux modifier le contenu sans toucher au code :

1. Crée un projet sur https://supabase.com
2. Va dans SQL Editor → colle le contenu de `supabase/schema.sql`
3. Copie l'URL et la clé anon depuis Settings → API
4. Dans Vercel → Settings → Environment Variables :
   - `NEXT_PUBLIC_SUPABASE_URL` = ton URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = ta clé anon
5. Redéploie (Deployments → Redeploy)
6. Utilise l'interface Supabase Table Editor pour gérer ton contenu

## 🎨 Personnaliser le design

**Couleurs :** Modifie les variables CSS dans `src/app/globals.css` :
```css
:root {
  --color-accent: #00f0ff;     /* Couleur principale */
  --color-accent-2: #7b61ff;   /* Couleur secondaire */
}
```

**Polices :** Change les imports Google Fonts dans `globals.css`

**Contenu SEO :** Modifie `src/app/layout.js` pour le titre et la description

## 📱 Technologies

- **Next.js 14** — Framework React
- **Tailwind CSS** — Styling utilitaire
- **Framer Motion** — Animations (optionnel)
- **Supabase** — Base de données (optionnel)
- **Vercel** — Hébergement & déploiement

---

Fait avec ❤️ par Djlo ALOHOU
