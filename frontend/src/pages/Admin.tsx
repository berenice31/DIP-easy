import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  LinearProgress,
} from "@mui/material";
import { adminDriveService } from "../services/adminDriveService";
import { driveService } from "../services/driveService";
import { useAuth } from "../hooks/useAuth";
import { Layout } from "../components/layout/Layout";

const AdminPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [folderInput, setFolderInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const { user } = useAuth();
  const [unauthorized, setUnauthorized] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const isAdmin = user?.role === "admin";
    const svc = isAdmin ? adminDriveService : driveService;
    try {
      const cfg = await svc.getConfig();
      setConfig(cfg);
      setFolderInput(cfg.root_folder_id || "");
      setUnauthorized(false);
    } catch (e: any) {
      if (e.response?.status === 403) {
        setUnauthorized(true);
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleUploadCreds = async () => {
    if (!file) return;
    setLoading(true);
    const isAdmin = user?.role === "admin";
    const svc = isAdmin ? adminDriveService : driveService;
    try {
      await svc.uploadCredentials(file);
      await refresh();
      alert("Credentials enregistrés");
      setFile(null);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'upload");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFolder = async () => {
    if (!folderInput) return;
    setLoading(true);
    const isAdmin = user?.role === "admin";
    const svc = isAdmin ? adminDriveService : driveService;
    try {
      await svc.setFolder(folderInput);
      await refresh();
      alert("Folder ID enregistré");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  if (unauthorized) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
            <Typography variant="h4" gutterBottom>
              Accès réservé aux administrateurs
            </Typography>
            <Typography>
              Vous n'avez pas les droits pour consulter cette page.
            </Typography>
          </Paper>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
          <Typography variant="h4" gutterBottom>
            Mon Drive – Google Drive
          </Typography>
          {loading && <LinearProgress />}
          {config && (
            <Box sx={{ mt: 2 }}>
              <Typography>
                Statut des crédentials :{" "}
                {config.configured ? "✅ Présents" : "❌ Manquants"}
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Dossier racine : {config.root_folder_id || "Non défini"}
              </Typography>
            </Box>
          )}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">
              Téléverser le JSON du service account
            </Typography>
            <input
              type="file"
              accept="application/json"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
            <Button
              variant="contained"
              sx={{ ml: 2, mt: 1 }}
              disabled={!file}
              onClick={handleUploadCreds}
            >
              Enregistrer
            </Button>
          </Box>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">ID du dossier Drive racine</Typography>
            <TextField
              fullWidth
              value={folderInput}
              onChange={(e) => setFolderInput(e.target.value)}
              placeholder="Ex: 1AbcDEFghiJKlmnO"
            />
            <Button
              variant="contained"
              sx={{ mt: 1 }}
              disabled={!folderInput}
              onClick={handleSaveFolder}
            >
              Sauvegarder
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default AdminPage;
