-- =============================================================
-- SEED DATA — Run this AFTER schema.sql
-- =============================================================

INSERT INTO personal_info (first_name, last_name, title, tagline, description, email, phone, location, linkedin, youtube) VALUES (
  'Djlo', 'ALOHOU',
  'FMS Technical Manager & Web Developer',
  'Expert en Gestion de Flotte, IoT & Développement Web',
  'Plus de 8 ans d''expérience dans la gestion de projets technologiques, le développement de systèmes FMS, le tracking GPS, l''administration système et le développement web. Passionné par l''innovation technologique et l''automatisation des processus métier en Afrique de l''Ouest.',
  'djloalo@gmail.com', '+229 01 999 989 29', 'Abomey-Calavi, Bénin',
  'https://www.linkedin.com/in/alo-djlo-b44a38119/',
  'https://youtube.com/@djlotechsociety'
);

INSERT INTO experiences (company, location, period, role, missions, sort_order) VALUES
('REEXOM SARL', 'Lomé, Togo', '2024', 'Responsable Projet Senior',
 '["Innovation d''un dispositif de jauge automatique des tanks de stations-services avec synchronisation API temps réel","Développement d''un système de gestion de la péréquation des hydrocarbures avec contrôle QR code pour le gouvernement Togolais","Développement d''un site web e-commerce avec module CMS personnalisé pour le groupe REEXOM"]', 1),
('3D Techlogis SARL', 'Cotonou, Bénin', '2020 — 2024', 'Directeur Général & Responsable Technique',
 '["Développement du SyGeQ pour le ministère de l''Industrie et du Commerce via API SECURYSAT et TELTONIKA FMS","Développement du SyCaP avec pointeuse mobile connectée via API FMS à l''usine NOCIBE","Direction Générale de 3D TECHLOGIS SARL (2022-2023)","Développement et déploiement du système AFTRAX personnalisé","Responsable du service tracking GPS","Configuration balises GPS multi-marques","Gestion du support SAV via Zoho Desk et JIRA","Formation clients et configuration FMS sur mesure"]', 2),
('Bourjon Investment (Holding)', 'Cotonou, Bénin', '2021 — 2024', 'Administrateur Système & IT',
 '["Administration Google Workspace (G Suite)","Administration Microsoft 365 Business","Azure Active Directory (Entra ID) : gestion identités, MFA, SSO, Intune","Automatisation avec Power Automate et Google Apps Script","Sécurité et conformité : accès conditionnel, protection des données","Déploiement et gestion des appareils via Intune"]', 3),
('DJLOTECH Society', 'Malanville, Bénin', '2019 — 2020', 'Fondateur & Formateur',
 '["Formation des agents de la mairie et des forces de l''ordre douanières en initiation informatique, bureautique, sécurité réseaux et maintenance"]', 4),
('ABP Technologie', 'Abomey-Calavi, Bénin', '2018 — 2019', 'Directeur Commercial',
 '["Direction commerciale de la société","Formateur en développement web et web marketing"]', 5),
('CREDEL Bénin (ONG)', 'Cotonou, Bénin', '2017 — 2019', 'Responsable Informatique',
 '["Conception et développement du site web de CREDEL Bénin","Gestion de l''infrastructure informatique de l''ONG"]', 6);

INSERT INTO skills (category, level, items, sort_order) VALUES
('Gestion de Flotte (FMS)', 95, '["SECURYSAT","TELTONIKA FMS","AFTRAX","Ruptela","Configuration balises GPS","Analyse de données FMS","Schémas d''installation"]', 1),
('Développement Web & CMS', 79, '["WordPress","HTML / CSS / JavaScript","Sites e-commerce","CMS personnalisés","Progressive Web Apps","Figma"]', 2),
('Gestion de Projet', 80, '["Scrum / Agile","JIRA","Zoho Desk","Gestion SLA","Coordination équipes","Relation client"]', 3),
('Administration Système', 75, '["Microsoft 365","Azure AD / Entra ID","Google Workspace","Power Automate","PowerShell","Intune"]', 4),
('Data & Analytics', 60, '["Power BI","Microsoft Data Analyst","Analyse FMS","Cartographie OSM"]', 5),
('IoT & Systèmes Embarqués', 70, '["Capteurs IoT","Intégration API","Synchronisation temps réel","TensorFlow","Android Things"]', 6);

INSERT INTO education (institution, degree, period, type, sort_order) VALUES
('Goldsmith University of London', 'Certificat de Licence en Développement Web', '2016 — 2019', 'degree', 1),
('University of Illinois', 'Professional Scrum Master (PSM1) — En cours', '2024 — 2025', 'certification', 2),
('Microsoft Learn', 'Power BI Data Analyst PL-300 — En cours', '2023 — 2024', 'certification', 3),
('Google Developers Group (GDG)', 'Android Things, PWA, Dialogflow, Robotics, TensorFlow', '2017 — 2018', 'certification', 4),
('SoloLearn', 'Certification HTML', '2017 — 2018', 'certification', 5),
('Collège d''Enseignement Général (CEG)', 'Diplôme du Baccalauréat', '2015 — 2016', 'degree', 6);

INSERT INTO projects (title, description, tags, highlight, sort_order) VALUES
('SyGeQ — Péréquation des Hydrocarbures', 'Système de gestion pour le ministère de l''Industrie du Bénin. Intégration API SECURYSAT et TELTONIKA FMS.', '["FMS","API","Gouvernement","IoT"]', true, 1),
('SyCaP — Gestion Camions NOCIBE', 'Plateforme de gestion des camions privés avec pointeuse mobile connectée via API FMS.', '["FMS","Automatisation","Industrie","Mobile"]', true, 2),
('Péréquation Hydrocarbures — Togo', 'Système avec contrôle QR code pour chargements et livraisons via FMS API.', '["FMS","QR Code","Douane","Gouvernement"]', true, 3),
('Jauge Automatique Stations-Services', 'Dispositif innovant avec synchronisation API temps réel pour REEXOM.', '["IoT","Innovation","API","Temps Réel"]', false, 4),
('AFTRAX — Gestion de Flotte', 'Système de gestion de flotte personnalisé pour 3D Techlogis SARL.', '["FMS","GPS","Tracking","SaaS"]', false, 5),
('E-commerce REEXOM', 'Site e-commerce avec module CMS personnalisé.', '["E-commerce","CMS","WordPress","Web"]', false, 6);

INSERT INTO languages (name, level, percentage, sort_order) VALUES
('Français', 'Courant', 95, 1),
('Anglais', 'Intermédiaire', 45, 2),
('Espagnol', 'Notions', 25, 3),
('Fon', 'Conversationnel', 50, 4),
('Nago', 'Conversationnel', 40, 5);
