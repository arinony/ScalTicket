import { Router } from 'express';
import { 
  getAllEvents, 
  getEventById, 
  createEvent, 
  updateEvent,   // <--- AJOUTÉ
  deleteEvent    // <--- AJOUTÉ
} from '../controllers/eventController';
import { protect, adminOnly } from '../middlewares/authMiddlewares.js'; 
import { upload } from '../services/uploadServices.js';

const router = Router();

// --- ROUTES PUBLIQUES ---
router.get('/', getAllEvents);      // URL: GET /api/events
router.get('/:id', getEventById);   // URL: GET /api/events/:id

// --- ROUTES ADMIN (PROTEGÉES) ---

// Création d'un événement
router.post('/', protect, adminOnly, createEvent); 

// Modification d'un événement (L'erreur 404 venait de l'absence de cette ligne)
router.put('/:id', protect, adminOnly, updateEvent); 

// Suppression d'un événement (C'est cette ligne qui manquait pour supprimer)
router.delete('/:id', protect, adminOnly, deleteEvent); 

// Route pour l'upload d'image
router.post('/upload-image', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Aucun fichier uploadé." });
  }
  const image = `/uploads/events/${req.file.filename}`;
  res.json({ image });
});

export default router;