// src/schemas/eventSchema.ts
import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3),
  artist: z.string().min(2),
  price: z.number(),
  available: z.number().int(),
  totalSlots: z.number().int(), // Ajout
  location: z.string().min(2),  // Ajout
  date: z.string().transform((val) => new Date(val)),             // Ajout (ISO String ou Date)
  image: z.string().url("Format de l'image invalide"), 
  category: z.string().optional(),
});