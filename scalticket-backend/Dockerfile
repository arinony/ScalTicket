# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Optimisation du cache : on installe les dépendances avant de copier le code
COPY package*.json ./
# Si tu as un fichier prisma/schema.prisma, il le faut pour le generate
COPY prisma ./prisma/ 

RUN npm install

# Copie du reste du code
COPY . .

# Pour Prisma 7, pas besoin de DATABASE_URL au moment du generate
RUN npx prisma generate

# Compilation TypeScript -> JavaScript
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app

# On définit l'environnement
ENV NODE_ENV=production

# On ne récupère que le nécessaire
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Installation de curl pour les healthchecks (optionnel mais recommandé)
RUN apk add --no-cache curl

EXPOSE 5000

# Commande de démarrage
CMD ["npm", "run", "start"]