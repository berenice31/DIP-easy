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
import { Layout } from "../components/layout/Layout";

const AdminPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [folderInput, setFolderInput] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const cfg = await adminDriveService.getConfig();
      setConfig(cfg);
      setFolderInput(cfg.root_folder_id || "");
    } catch (e) {
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
    try {
      await adminDriveService.uploadCredentials(file);
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
    try {
      await adminDriveService.setFolder(folderInput);
      await refresh();
      alert("Folder ID enregistré");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
          <Typography variant="h4" gutterBottom>
            Administration – Google Drive
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
