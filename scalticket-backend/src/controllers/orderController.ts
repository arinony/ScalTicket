import { Response, Request } from 'express';
import { AuthRequest } from '../middlewares/authMiddlewares.js';
import prisma from '../config/db.js';

// Utilitaire pour sécuriser la récupération de l'ID dans les paramètres
const getSafeId = (id: any): string | undefined => {
  if (Array.isArray(id)) return id[0];
  return id;
};

/**
 * CRÉER UNE COMMANDE
 * Accessible par : Admin et Client
 */
export const createOrder = async (req: AuthRequest, res: Response) => {
  const { eventId } = req.body;
  const userId = req.user?.userId;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({ where: { id: eventId } });

      if (!event || event.available <= 0) {
        throw new Error("Plus de places disponibles ou événement inexistant");
      }

      const order = await tx.order.create({
        data: {
          userId: userId as string,
          eventId: eventId,
          status: 'confirmed'
        }
      });

      await tx.event.update({
        where: { id: eventId },
        data: { available: event.available - 1 }
      });

      return order;
    });

    res.status(201).json({ message: "Ticket acheté avec succès !", order: result });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * RÉCUPÉRER TOUTES LES COMMANDES (FILTRÉES PAR RÔLE)
 * Admin : Voit tout
 * Client : Voit uniquement ses commandes
 */
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;

  try {
    const orders = await prisma.order.findMany({
      // --- SÉCURITÉ GÉRÉE AU NIVEAU DE LA BASE DE DONNÉES ---
      where: role === 'admin' 
        ? {} 
        : { userId: userId }, 
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            // On exclut le password ici par sécurité
          }
        },
        event: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(orders);
  } catch (error) {
    console.error("Erreur getAllOrders:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
  }
};

/**
 * ANNULER UNE COMMANDE
 * Sécurité : Un client ne peut annuler que sa propre commande
 */
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  const id = getSafeId(req.params.id);
  const userId = req.user?.userId;
  const role = req.user?.role;

  if (!id) {
    return res.status(400).json({ message: "ID de commande invalide" });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) return res.status(404).json({ message: "Commande introuvable" });

    // --- VÉRIFICATION DE PROPRIÉTÉ ---
    // Si l'utilisateur n'est pas admin et qu'il n'est pas le créateur de la commande
    if (role !== 'admin' && order.userId !== userId) {
      return res.status(403).json({ 
        message: "Action interdite : Vous ne pouvez pas annuler la commande d'un autre utilisateur" 
      });
    }

    if (order.status === 'CANCELLED') {
      return res.status(400).json({ message: "Commande déjà annulée" });
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id },
        data: { status: 'CANCELLED' }
      }),
      prisma.event.update({
        where: { id: order.eventId },
        data: { available: { increment: 1 } } 
      })
    ]);

    res.json({ message: "Commande annulée avec succès" });
  } catch (error: any) {
    console.error("Erreur annulation:", error);
    res.status(500).json({ message: "Erreur lors de l'annulation" });
  }
};