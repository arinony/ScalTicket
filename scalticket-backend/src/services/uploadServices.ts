// src/services/uploadService.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configuration du stockage (on stocke en local pour le moment)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/events/';
    
    // Vérifie si le dossier existe, sinon le crée
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtrage pour n'accepter que les images
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error("Le fichier n'est pas une image !"), false);
  }
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // Limite à 2Mo
});