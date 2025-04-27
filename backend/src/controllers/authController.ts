import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import * as bcrypt from "bcrypt";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });
    if (existingUser) {
      res.status(400).json({ message: "Cet email est déjà utilisé" });
      return;
    }

    // Créer un nouvel utilisateur
    const user = new User();
    user.email = email;
    user.password = await bcrypt.hash(password, 10);
    user.twoFactorEnabled = false;

    // Sauvegarder l'utilisateur
    await AppDataSource.getRepository(User).save(user);

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Vérification des identifiants
    const user = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: "Identifiants incorrects" });
      return;
    }

    // Vérification si 2FA est activé
    if (user.twoFactorEnabled) {
      res.status(200).json({ requires2FA: true });
      return;
    }

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export const verify2FA = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, email } = req.body;

    const user = await AppDataSource.getRepository(User).findOne({
      where: { email },
    });
    if (!user) {
      res.status(401).json({ message: "Utilisateur non trouvé" });
      return;
    }

    // Vérification du code 2FA
    const isValid = await user.verify2FACode(code);
    if (!isValid) {
      res.status(401).json({ message: "Code 2FA invalide" });
      return;
    }

    // Génération du token JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};
