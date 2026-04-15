import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// On définit une interface pour étendre le type Request d'Express
// Cela nous permet d'attacher l'utilisateur à la requête
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // 1. On vérifie si le token est dans le header "Authorization"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // 2. On décode le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };

      // 3. On ajoute les infos de l'utilisateur à la requête
      req.user = decoded;
      
      next(); // On passe au contrôleur suivant
    } catch (error) {
      return res.status(401).json({ message: "Non autorisé, token invalide" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Non autorisé, aucun token fourni" });
  }
};

// Middleware pour restreindre l'accès aux Admins uniquement
export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: "Accès refusé : réservé aux administrateurs" });
  }
};