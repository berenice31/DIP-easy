import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth";

const app = express();
const port = process.env.PORT || 3000;

// Configuration CORS
app.use(
  cors({
    origin: "http://localhost:5173", // URL de votre frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware pour parser le JSON
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Middleware de débogage
app.use((req, res, next) => {
  console.log("Request Body:", req.body);
  console.log("Request Headers:", req.headers);
  next();
});

// Routes
app.use("/auth", authRoutes);

// Initialisation de la base de données et démarrage du serveur
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
