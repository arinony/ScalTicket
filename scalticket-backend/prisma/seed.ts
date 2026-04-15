import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client"; // Ajuste le chemin si ton client est généré ailleurs
import bcrypt from 'bcryptjs';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Début du seeding avec l'adapter PG...");

  // 1. Création de l'Admin
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@scalticket.com" },
    update: {},
    create: {
      email: "admin@scalticket.com",
      name: "Admin Victorio",
      password: adminPassword,
      role: "admin",
    },
  });

  // 2. Création d'un événement de test
  const concert = await prisma.event.upsert({
    where: { id: "test-event-id" }, // Optionnel si tu veux un ID fixe pour tes tests
    update: {},
    create: {
      id: "test-event-id",
      title: "Daft Punk Heritage",
      artist: "Daft Punk Tribute",
      description: "Un concert exceptionnel pour revivre l'ère de la French Touch.",
      date: new Date("2026-12-25T21:00:00Z"),
      location: "Stade de France, Paris",
      price: 85.0,
      totalSlots: 1000,
      available: 1000,
    },
  });

  // 3. Création d'un utilisateur classique avec une commande (Order)
  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "client@test.com" },
    update: {},
    create: {
      email: "client@test.com",
      name: "Jean Client",
      password: userPassword,
      role: "user",
      tickets: {
        create: {
          eventId: "test-event-id",
          status: "confirmed"
        }
      }
    },
  });

  console.log("✅ Seeding terminé avec succès !");
  console.log({ admin: admin.email, event: concert.title, client: user.email });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error("❌ Erreur pendant le seeding :", e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });