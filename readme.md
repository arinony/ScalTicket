🎫 ScalTicket - Plateforme de Billetterie Haute Performance
ScalTicket est une application MERN (MongoDB, Express, React, Node) conçue pour la gestion de billetterie en temps réel. Le projet met l'accent sur la scalabilité, la sécurité RBAC et le monitoring business.

🚀 Fonctionnalités Clés
        Gestion des Événements : CRUD complet pour les administrateurs avec upload d'images.

        Système de Réservation : Achat de billets en temps réel avec gestion automatique des stocks.

        Dashboard Pilotage : Visualisation du Chiffre d'Affaires par événement et calendrier annuel.

        Sécurité Senior : Authentification JWT, hachage BCrypt (12 rounds) et protection des routes par rôles (Admin/User).



🏗️ Architecture du Projet
L'application suit une architecture découplée (Client/Serveur) facilitant le futur déploiement sur Kubernetes.

📂 Structure Détaillée du Projet
ScalTicket/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Définition des modèles User, Event, Order
│   │   └── seed.ts                # Script pour créer l'admin initial
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts              # Instance Prisma Client
│   │   ├── controllers/
│   │   │   ├── authController.ts   # Inscription (Role: user forced), Login
│   │   │   ├── eventController.ts  # CRUD Événements
│   │   │   └── orderController.ts  # Logique de commande & filtrage CA
│   │   ├── middlewares/
│   │   │   └── authMiddlewares.ts  # Protect (JWT) & AdminOnly
│   │   ├── routes/
│   │   │   ├── authRoutes.ts       # /api/auth/*
│   │   │   ├── eventRoutes.ts      # /api/events/*
│   │   │   └── orderRoutes.ts      # /api/orders/* (Route /all sécurisée)
│   │   └── server.ts              # Configuration Express & Middlewares
│   ├── .env                       # Variables : DATABASE_URL, JWT_SECRET
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosConfig.ts     # Intercepteur pour le Token Bearer
│   │   ├── components/
│   │   │   ├── Sidebar.tsx        # Menu dynamique (Admin/User)
│   │   │   └── ProtectedRoute.tsx # Gardien de navigation React
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx      # Formulaire de connexion
│   │   │   ├── RegisterPage.tsx   # Formulaire d'inscription
│   │   │   ├── EventsPage.tsx     # Liste des concerts (Client)
│   │   │   ├── PilotagePage.tsx   # Le nouveau Dashboard (CA + Calendrier)
│   │   │   └── OrderPage.tsx      # Gestion des billets personnels
│   │   ├── store/
│   │   │   ├── authStore.ts       # État global utilisateur (Zustand)
│   │   │   └── useTicketStore.ts  # État global Billetterie & Stats
│   │   └── App.tsx                # Définition des Routes React
│   ├── tailwind.config.js         # Thème Sombre & Customisation Indigo
│   └── package.json
└── README.md                      # Documentation du projet


🔧 Installation Rapide
1. Backend

        cd backend
        npm install
        # Configurez votre .env (DATABASE_URL, JWT_SECRET)
        npx prisma migrate dev
        npm run dev

2. Frontend

        cd frontend
        npm install
        npm run dev