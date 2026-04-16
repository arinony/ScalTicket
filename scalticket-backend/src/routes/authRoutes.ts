import { Router } from 'express';
import { login, register, updateProfile} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddlewares.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.put('/profile', protect, updateProfile);

export default router;