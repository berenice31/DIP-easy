import { Request, Response, NextFunction } from "express";

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email et mot de passe requis" });
    return;
  }

  if (!email.includes("@")) {
    res.status(400).json({ message: "Email invalide" });
    return;
  }

  next();
};

export const validate2FA = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { code, email } = req.body;

  if (!code || !email) {
    res.status(400).json({ message: "Code 2FA et email requis" });
    return;
  }

  if (code.length !== 6 || !/^\d+$/.test(code)) {
    res.status(400).json({ message: "Code 2FA invalide" });
    return;
  }

  next();
};
