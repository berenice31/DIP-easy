import { Router } from "express";
import { login, verify2FA, register } from "../controllers/authController";
import { validateLogin, validate2FA } from "../middlewares/validation";
import { Request, Response, NextFunction } from "express";

const router = Router();

// Définition des types pour les middlewares et contrôleurs
type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;
type ControllerHandler = (req: Request, res: Response) => Promise<void>;

// Application des routes avec les types corrects
router.post("/register", register as ControllerHandler);
router.post(
  "/login",
  validateLogin as RequestHandler,
  login as ControllerHandler
);
router.post(
  "/verify-2fa",
  validate2FA as RequestHandler,
  verify2FA as ControllerHandler
);

export default router;
