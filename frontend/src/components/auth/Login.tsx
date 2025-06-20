import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/api";
import { storage } from "../../utils/storage";
import logo from "../../assets/logo-dipeasy.jpg";

const TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await authService.login(email, password);
      if (response && response.access_token) {
        storage.set(TOKEN_KEY, response.access_token);
        if (response.refresh_token) {
          storage.set(REFRESH_TOKEN_KEY, response.refresh_token);
        }
        navigate("/dashboard");
      } else {
        setError("Identifiants invalides");
      }
    } catch (err: any) {
      let detail = err.response?.data?.detail;
      if (Array.isArray(detail)) {
        // Si c'est un tableau d'erreurs (ex: Pydantic), on affiche le premier message
        detail = detail.map((d: any) => d.msg).join(" | ");
      } else if (typeof detail === "object") {
        detail = JSON.stringify(detail);
      }
      setError(detail || "Identifiants invalides");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            borderRadius: 2,
          }}
        >
          <img
            src={logo}
            alt="Logo DIP-easy"
            style={{
              width: 220,
              height: "auto",
              objectFit: "contain",
              marginBottom: 16,
            }}
          />
          <Typography
            component="h2"
            variant="h6"
            sx={{
              color: "text.secondary",
              mb: 4,
              textAlign: "center",
            }}
          >
            Simplifiez la création de vos Dossiers d'Information Produit
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: "1.1rem",
                textTransform: "none",
              }}
            >
              Se connecter
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate("/register")}
              sx={{
                textTransform: "none",
                color: "text.secondary",
              }}
            >
              Pas encore de compte ? S'inscrire
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
