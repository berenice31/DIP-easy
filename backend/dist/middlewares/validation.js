"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate2FA = exports.validateLogin = void 0;
const validateLogin = (req, res, next) => {
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
exports.validateLogin = validateLogin;
const validate2FA = (req, res, next) => {
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
exports.validate2FA = validate2FA;
