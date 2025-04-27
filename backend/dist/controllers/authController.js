"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify2FA = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const bcrypt = __importStar(require("bcrypt"));
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Vérifier si l'utilisateur existe déjà
        const existingUser = await database_1.AppDataSource.getRepository(User_1.User).findOne({
            where: { email },
        });
        if (existingUser) {
            res.status(400).json({ message: "Cet email est déjà utilisé" });
            return;
        }
        // Créer un nouvel utilisateur
        const user = new User_1.User();
        user.email = email;
        user.password = await bcrypt.hash(password, 10);
        user.twoFactorEnabled = false;
        // Sauvegarder l'utilisateur
        await database_1.AppDataSource.getRepository(User_1.User).save(user);
        res.status(201).json({ message: "Utilisateur créé avec succès" });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Vérification des identifiants
        const user = await database_1.AppDataSource.getRepository(User_1.User).findOne({
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
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.login = login;
const verify2FA = async (req, res) => {
    try {
        const { code, email } = req.body;
        const user = await database_1.AppDataSource.getRepository(User_1.User).findOne({
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
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" });
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.verify2FA = verify2FA;
