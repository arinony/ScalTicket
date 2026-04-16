import "dotenv/config";
import { defineConfig } from "prisma/config";

// On utilise process.env au lieu de env() pour éviter l'erreur de résolution stricte au build
const dbUrl = process.env.DATABASE_URL || "postgresql://unused:unused@localhost:5432/unused";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node prisma/seed.ts",
  },
  datasource: {
    url: dbUrl,
  },
});