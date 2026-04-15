// src/routes/orderRoutes.ts
import { Router } from 'express';
import { createOrder, getAllOrders, cancelOrder } from '../controllers/orderController.js';
import { protect, adminOnly } from '../middlewares/authMiddlewares.js';

const router = Router();

// 1. Acheter un ticket (Tous les utilisateurs connectés)
router.post('/buy', protect, createOrder);

/** * 2. Récupérer les commandes
 * ADAPTATION : On enlève 'adminOnly' car le filtrage est maintenant 
 * géré à l'intérieur du contrôleur getAllOrders (Logiciel RBAC).
 */
router.get('/all', protect, getAllOrders);

/**
 * 3. Annuler une commande
 * ADAPTATION : On enlève aussi 'adminOnly' ici car nous avons ajouté 
 * une sécurité dans le contrôleur qui vérifie si l'utilisateur est 
 * soit l'Admin, soit le propriétaire du billet.
 */
router.patch('/:id/cancel', protect, cancelOrder);

export default router;