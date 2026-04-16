import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
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
  console.log("👤 Admin créé/vérifié");

  // 2. Création de l'événement de test
  const concert = await prisma.event.upsert({
    where: { id: "test-event-id" },
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
  console.log("🎸 Événement créé/vérifié");

  // 3. Création de l'utilisateur classique (sans ticket imbriqué pour éviter P2003)
  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.upsert({
    where: { email: "client@test.com" },
    update: {},
    create: {
      email: "client@test.com",
      name: "Jean Client",
      password: userPassword,
      role: "user",
    },
  });
  console.log("👤 Utilisateur client créé/vérifié");

  // 4. Création de la commande (Order) séparée pour sécuriser la clé étrangère
  const existingOrder = await prisma.order.findFirst({
    where: {
      userId: user.id,
      eventId: concert.id
    }
  });

  if (!existingOrder) {
    await prisma.order.create({
      data: {
        userId: user.id,
        eventId: concert.id,
        status: "confirmed"
      }
    });
    console.log("🎟️ Ticket créé pour Jean Client");
  } else {
    console.log("ℹ️ Le ticket existe déjà, skip.");
  }

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