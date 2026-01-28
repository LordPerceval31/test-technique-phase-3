🚀 TechCorp Dashboard - Jour 6 (Foundation)
Bienvenue dans le cockpit de gestion des outils internes de TechCorp. Cette application permet de monitorer les dépenses SaaS, l'utilisation des outils par département et l'optimisation des coûts.

🏗️ Architecture du Projet
L'application est construite avec une approche modulaire et typée :

Vite + React + TS : Pour un environnement de développement ultra-rapide et sécurisé.

Tailwind CSS v4 : Utilisation des nouvelles capacités de styling pour un design "Pixel Perfect".

Vitest & React Testing Library : Suite de tests unitaires garantissant la robustesse des composants critiques.

🎨 Design System Evolution
Pendant ce Jour 6, nous avons établi les bases visuelles :

Mode Sombre/Clair : Un système de thémisation complet utilisant les classes dark de Tailwind et le localStorage.

Composants KPI : Des cartes dynamiques avec des dégradés subtils et des barres de progression calculées selon l'utilisation du budget.

Tableau de Données : Une interface interactive gérant le tri par colonnes et la pagination.

🔗 Navigation & User Journey
Dashboard (/) : Vue d'ensemble des KPIs et des derniers outils ajoutés.

Pagination : Navigation fluide à travers les listes d'outils (limite de 10 par page).

Toggle Theme : Passage instantané d'une ambiance de travail sombre à claire via le Header.

🧪 Stratégie de Test
Nous avons implémenté des tests unitaires pour chaque brique majeure :

KPICard.test.tsx : Validation du rendu des metrics et de la logique conditionnelle de la barre de progression.

RecentTools.test.tsx : Test des fonctionnalités de tri (logiciel) et de la pagination via data-testid.

Header.test.tsx : Vérification du bon fonctionnement du bouton de changement de thème.

🚀 Quick Start
Installation :

Bash

npm install
Lancer le développement :

Bash

npm run dev
Lancer la suite de tests :

Bash

npm test
📊 État d'avancement
[x] Jour 6 : Dashboard Foundation (Terminé)

[ ] Jour 7 : Tools Catalog & Filtres Avancés (À venir)

[ ] Jour 8 : Analytics & Data Viz (À venir)