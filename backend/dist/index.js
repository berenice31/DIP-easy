"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const database_1 = require("./config/database");
const auth_1 = __importDefault(require("./routes/auth"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware pour parser le JSON
app.use(express_1.default.json());
// Routes
app.use("/auth", auth_1.default);
// Initialisation de la base de données et démarrage du serveur
database_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
