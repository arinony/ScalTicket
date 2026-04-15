import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js'; // Assure-toi de l'extension .js si tu es en ESM

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body; // On ne récupère PLUS 'role' du body

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Cet email est déjà utilisé.' });

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // SÉCURITÉ : On force le rôle à 'user'. 
    // Personne ne peut devenir admin via le formulaire d'inscription.
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword, 
        name, 
        role: 'user' // Toujours 'user' par défaut
      }
    });

    res.status(201).json({ message: 'Utilisateur créé avec succès !' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.json({
      message: "Connexion réussie",
      token,
      user: { id: user.id, name: user.name, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.userId;
    const { name, email, newPassword } = req.body;
    
    // SÉCURITÉ : On prépare les données sans autoriser la modification du rôle ici
    const updateData: any = { name, email };
    
    if (newPassword && newPassword.trim() !== "") {
      const salt = await bcrypt.genSalt(12);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true, 
        name: true, 
        email: true,
        role: true,
        avatar: true
      }
    });
    
    res.json({
      message: 'Profil mis à jour avec succès',
      user: updateUser
    });

  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Cet email est déjà utilisé par un autre compte.' });
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil.' });
  }
};