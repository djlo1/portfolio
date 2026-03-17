// Portfolio data - consolidated from all CVs
// You can edit this file to update your portfolio content,
// or use the Supabase admin panel for dynamic updates.

export const personalInfo = {
  firstName: "Djlo",
  lastName: "ALOHOU",
  title: "FMS Technical Manager & Web Developer",
  tagline: "Expert en Gestion de Flotte, IoT & Développement Web",
  description:
    "Plus de 8 ans d'expérience dans la gestion de projets technologiques, le développement de systèmes FMS, le tracking GPS, l'administration système et le développement web. Passionné par l'innovation technologique et l'automatisation des processus métier en Afrique de l'Ouest.",
  email: "djloalo@gmail.com",
  phone: "+229 01 999 989 29",
  location: "Abomey-Calavi, Bénin",
  linkedin: "https://www.linkedin.com/in/alo-djlo-b44a38119/",
  youtube: "https://youtube.com/@djlotechsociety",
  photo: "/photo.jpg",
};

export const experiences = [
  {
    id: 1,
    company: "REEXOM SARL",
    location: "Lomé, Togo",
    period: "2024",
    role: "Responsable Projet Senior",
    missions: [
      "Innovation d'un dispositif de jauge automatique des tanks de stations-services avec synchronisation API temps réel",
      "Développement d'un système de gestion de la péréquation des hydrocarbures avec contrôle QR code pour les chargements, transports et livraisons avec contrôle douanier via FMS API pour le gouvernement Togolais",
      "Développement d'un site web e-commerce avec module CMS personnalisé pour le groupe REEXOM",
    ],
  },
  {
    id: 2,
    company: "3D Techlogis SARL",
    location: "Cotonou, Bénin",
    period: "2020 — 2024",
    role: "Directeur Général & Responsable Technique",
    missions: [
      "Développement du Système de Gestion de péréquation des Hydrocarbures du Bénin (SyGeQ) pour le ministère de l'Industrie et du Commerce via API SECURYSAT et TELTONIKA FMS",
      "Développement du Système de Gestion des camions privés (SyCaP) avec pointeuse mobile connectée via API FMS à l'usine NOCIBE — automatisation des chargements, gestion des bordereaux et du parking",
      "Direction Générale de 3D TECHLOGIS SARL (2022-2023)",
      "Développement et déploiement du système de gestion de flotte AFTRAX personnalisé",
      "Responsable du service tracking GPS — département informatique et support technique",
      "Configuration de balises GPS multi-marques (Ruptela, Securysat, Teltonika) et conception des schémas d'installation",
      "Gestion du support SAV via Zoho Desk, gestion SLA et gestion d'équipe avec JIRA",
      "Formation clients et configuration FMS sur mesure",
    ],
  },
  {
    id: 3,
    company: "Bourjon Investment (Holding)",
    location: "Cotonou, Bénin",
    period: "2021 — 2024",
    role: "Administrateur Système & IT",
    missions: [
      "Administration Google Workspace (G Suite) : Gmail, Drive, Docs, Sheets, Slides, Forms, Calendar, Meet, Chat",
      "Administration Microsoft 365 Business : Exchange Online, SharePoint, Teams, OneDrive, Power Automate",
      "Azure Active Directory (Entra ID) : gestion des identités, MFA, SSO, Intune, rôles et permissions",
      "Automatisation avec Power Automate et Google Apps Script",
      "Sécurité et conformité : politiques d'accès conditionnel, protection des données",
      "Déploiement et gestion des appareils via Intune",
    ],
  },
  {
    id: 4,
    company: "DJLOTECH Society",
    location: "Malanville, Bénin",
    period: "2019 — 2020",
    role: "Fondateur & Formateur",
    missions: [
      "Formation des agents de la mairie et des forces de l'ordre douanières (frontière Bénin-Niger) en initiation informatique, bureautique, sécurité réseaux et maintenance",
    ],
  },
  {
    id: 5,
    company: "ABP Technologie",
    location: "Abomey-Calavi, Bénin",
    period: "2018 — 2019",
    role: "Directeur Commercial",
    missions: [
      "Direction commerciale de la société",
      "Formateur en développement web et web marketing",
    ],
  },
  {
    id: 6,
    company: "CREDEL Bénin (ONG)",
    location: "Cotonou, Bénin",
    period: "2017 — 2019",
    role: "Responsable Informatique",
    missions: [
      "Conception et développement du site web de CREDEL Bénin (organisme lié au ministère de l'Environnement)",
      "Gestion de l'infrastructure informatique de l'ONG",
    ],
  },
];

export const skills = [
  {
    category: "Gestion de Flotte (FMS)",
    level: 95,
    items: [
      "SECURYSAT",
      "TELTONIKA FMS",
      "AFTRAX",
      "Ruptela",
      "Configuration balises GPS",
      "Analyse de données FMS",
      "Schémas d'installation technique",
    ],
  },
  {
    category: "Développement Web & CMS",
    level: 79,
    items: [
      "WordPress (thèmes & plugins)",
      "HTML / CSS / JavaScript",
      "Sites e-commerce",
      "CMS personnalisés",
      "Progressive Web Apps",
      "Figma",
    ],
  },
  {
    category: "Gestion de Projet",
    level: 80,
    items: [
      "Méthodologie Scrum / Agile",
      "JIRA",
      "Zoho Desk",
      "Gestion SLA",
      "Coordination d'équipes techniques",
      "Relation client",
    ],
  },
  {
    category: "Administration Système",
    level: 75,
    items: [
      "Microsoft 365 Business",
      "Azure AD / Entra ID",
      "Google Workspace (G Suite)",
      "Power Automate",
      "PowerShell",
      "Intune (MDM)",
    ],
  },
  {
    category: "Data & Analytics",
    level: 60,
    items: [
      "Power BI",
      "Microsoft Data Analyst",
      "Analyse de données FMS",
      "Cartographie OSM",
    ],
  },
  {
    category: "IoT & Systèmes Embarqués",
    level: 70,
    items: [
      "Capteurs IoT",
      "Intégration API",
      "Synchronisation temps réel",
      "TensorFlow (initiation)",
      "Android Things",
    ],
  },
];

export const education = [
  {
    id: 1,
    institution: "Goldsmith University of London",
    degree: "Certificat de Licence en Développement Web",
    period: "2016 — 2019",
    type: "degree",
  },
  {
    id: 2,
    institution: "University of Illinois",
    degree: "Professional Scrum Master (PSM1) — En cours",
    period: "2024 — 2025",
    type: "certification",
  },
  {
    id: 3,
    institution: "Microsoft Learn",
    degree: "Power BI Data Analyst PL-300 — En cours",
    period: "2023 — 2024",
    type: "certification",
  },
  {
    id: 4,
    institution: "Google Developers Group (GDG)",
    degree: "Android Things, PWA, Dialogflow, Robotics, TensorFlow",
    period: "2017 — 2018",
    type: "certification",
  },
  {
    id: 5,
    institution: "SoloLearn",
    degree: "Certification HTML",
    period: "2017 — 2018",
    type: "certification",
  },
  {
    id: 6,
    institution: "Collège d'Enseignement Général (CEG)",
    degree: "Diplôme du Baccalauréat",
    period: "2015 — 2016",
    type: "degree",
  },
];

export const projects = [
  {
    id: 1,
    title: "SyGeQ — Péréquation des Hydrocarbures",
    description:
      "Système de gestion de la péréquation des hydrocarbures du Bénin pour le ministère de l'Industrie et du Commerce. Intégration API SECURYSAT et TELTONIKA FMS pour le suivi en temps réel des chargements et livraisons.",
    tags: ["FMS", "API", "Gouvernement", "IoT"],
    highlight: true,
  },
  {
    id: 2,
    title: "SyCaP — Gestion Camions Privés NOCIBE",
    description:
      "Plateforme de gestion des camions privés à l'usine de production de ciment NOCIBE. Pointeuse mobile connectée via API FMS pour l'automatisation des chargements et la gestion du parking à distance.",
    tags: ["FMS", "Automatisation", "Industrie", "Mobile"],
    highlight: true,
  },
  {
    id: 3,
    title: "Péréquation Hydrocarbures — Togo",
    description:
      "Système de gestion avec contrôle QR code pour les chargements, transports et livraisons avec contrôle douanier, développé via FMS API pour le gouvernement Togolais.",
    tags: ["FMS", "QR Code", "Douane", "Gouvernement"],
    highlight: true,
  },
  {
    id: 4,
    title: "Jauge Automatique Stations-Services",
    description:
      "Dispositif innovant de jauge automatique des tanks de stations-services avec système de synchronisation API en temps réel pour le groupe REEXOM.",
    tags: ["IoT", "Innovation", "API", "Temps Réel"],
    highlight: false,
  },
  {
    id: 5,
    title: "AFTRAX — Gestion de Flotte",
    description:
      "Système de gestion de flotte personnalisé pour 3D Techlogis SARL. Développement, déploiement et maintenance de la plateforme propriétaire.",
    tags: ["FMS", "GPS", "Tracking", "SaaS"],
    highlight: false,
  },
  {
    id: 6,
    title: "E-commerce REEXOM",
    description:
      "Site web e-commerce avec module CMS personnalisé pour le groupe REEXOM, intégrant un système de gestion de contenu sur mesure.",
    tags: ["E-commerce", "CMS", "WordPress", "Web"],
    highlight: false,
  },
];

export const languages = [
  { name: "Français", level: "Courant", percentage: 95 },
  { name: "Anglais", level: "Intermédiaire", percentage: 45 },
  { name: "Espagnol", level: "Notions", percentage: 25 },
  { name: "Fon", level: "Conversationnel", percentage: 50 },
  { name: "Nago", level: "Conversationnel", percentage: 40 },
];
