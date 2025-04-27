"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middlewares/validation");
const router = (0, express_1.Router)();
// Application des routes avec les types corrects
router.post("/register", authController_1.register);
router.post("/login", validation_1.validateLogin, authController_1.login);
router.post("/verify-2fa", validation_1.validate2FA, authController_1.verify2FA);
exports.default = router;
