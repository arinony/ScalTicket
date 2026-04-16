import { Request, Response } from 'express';
import prisma from '../config/db.js'; 
import { createEventSchema } from '../schemas/eventSchema.js';

// Helper pour sécuriser l'ID
const getSafeId = (id: any): string | undefined => {
  if (Array.isArray(id)) return id[0];
  return id;
};

// 1. Récupérer tous les événements (Non supprimés)
export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({
      where: { isDeleted: false }, // CORRIGÉ : On enlève "id" qui n'a rien à faire ici
      orderBy: { date: 'asc' }
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération" });
  }
};

// 2. Récupérer par ID
export const getEventById = async (req: Request, res: Response) => {
  const id = getSafeId(req.params.id);
  
  try {
    const event = await prisma.event.findFirst({
      where: { 
        id: id,
        isDeleted: false // On ne veut pas qu'on puisse voir un event "supprimé" via son ID
      }
    });
    
    if (!event) return res.status(404).json({ message: "Événement non trouvé" });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// 3. Créer
export const createEvent = async (req: Request, res: Response) => {
  try {
    const validatedData = createEventSchema.parse(req.body);
    const newEvent = await prisma.event.create({
      data: {
        ...validatedData,
        isDeleted: false // Par défaut à la création
      },
    });
    res.status(201).json(newEvent);
  } catch (error: any) {
    if (error.name === "ZodError") return res.status(400).json({ errors: error.errors });
    res.status(500).json({ message: "Erreur lors de la création" });
  }
};

// 4. Modifier
export const updateEvent = async (req: Request, res: Response) => {
  const id = getSafeId(req.params.id);

  if (!id) return res.status(400).json({ message: "ID invalide" });

  try {
    const updateData = {
      title: req.body.title,
      artist: req.body.artist,
      price: req.body.price !== undefined ? Number(req.body.price) : undefined,
      available: req.body.available !== undefined ? Number(req.body.available) : undefined,
      totalSlots: req.body.totalSlots !== undefined ? Number(req.body.totalSlots) : undefined,
      location: req.body.location,
      date: req.body.date ? new Date(req.body.date) : undefined,
      image: req.body.image,
      category: req.body.category
    };

    const updated = await prisma.event.update({
      where: { id: id },
      data: updateData
    });

    res.json(updated);
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ message: "Event introuvable" });
    res.status(500).json({ message: "Erreur modification" });
  }
};

// 5. Supprimer (SOFT DELETE)
export const deleteEvent = async (req: Request, res: Response) => {
  const id = getSafeId(req.params.id); // CORRIGÉ : Utilisation de getSafeId ici aussi

  if (!id) return res.status(400).json({ message: "ID invalide" });

  try {
    await prisma.event.update({
      where: { id: id },
      data: { isDeleted: true } // Marquer comme supprimé
    });

    res.status(204).send(); 
  } catch (error: any) {
    if (error.code === 'P2025') return res.status(404).json({ message: "Event introuvable" });
    res.status(500).json({ message: "Erreur suppression" });
  }
};