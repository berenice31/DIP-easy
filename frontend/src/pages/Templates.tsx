import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileUpload as FileUploadIcon,
} from "@mui/icons-material";

import { templateService } from "../services/templateService";
import { Layout } from "../components/layout/Layout";

interface Template {
  id: string;
  name: string;
  version: string;
  description?: string;
  updated_at?: string;
  created_at?: string;
  thumbnail_url?: string;
}

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [file, setFile] = useState<File | null>(null);

  const handleAddTemplate = () => {
    setSelectedTemplate(null);
    setOpenDialog(true);
  };

  const handleEditTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setOpenDialog(true);
  };

  const handleDeleteTemplate = (id: string) => {
    if (!window.confirm("Confirmer la suppression de ce template ?")) return;
    (async () => {
      try {
        await templateService.deleteTemplate(id);
        const refreshed = await templateService.getTemplates();
        setTemplates((refreshed.items ?? refreshed) as unknown as Template[]);
      } catch (e) {
        console.error(e);
        alert("Erreur lors de la suppression");
      }
    })();
  };

  const handleSaveTemplate = async () => {
    if (!file) {
      alert("Veuillez sélectionner un fichier .docx");
      return;
    }
    try {
      await templateService.uploadTemplate(
        (document.getElementById("template-name") as HTMLInputElement).value,
        file
      );
      // Rafraîchir la liste
      const refreshed = await templateService.getTemplates();
      setTemplates((refreshed.items ?? refreshed) as unknown as Template[]);
      setOpenDialog(false);
      setFile(null);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'enregistrement");
    }
  };

  // Charger les templates au premier rendu
  useEffect(() => {
    (async () => {
      try {
        const resp = await templateService.getTemplates();
        setTemplates((resp.items ?? resp) as unknown as Template[]);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <Layout>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h1" gutterBottom>
                Templates
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddTemplate}
              >
                Nouveau Template
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {templates.map((template) => (
              <Grid item xs={12} md={4} key={template.id}>
                <Card>
                  {template.thumbnail_url && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={template.thumbnail_url}
                      alt={template.name}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Version: {template.version}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {template.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Dernière mise à jour:{" "}
                      {template.updated_at || template.created_at
                        ? new Date(
                            template.updated_at ?? template.created_at!
                          ).toLocaleDateString()
                        : "-"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Tooltip title="Modifier">
                      <IconButton
                        size="small"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>
              {selectedTemplate ? "Modifier le template" : "Nouveau template"}
            </DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  label="Nom"
                  margin="normal"
                  id="template-name"
                  defaultValue={selectedTemplate?.name}
                />
                <TextField
                  fullWidth
                  label="Version"
                  margin="normal"
                  defaultValue={selectedTemplate?.version}
                />
                <TextField
                  fullWidth
                  label="Description"
                  margin="normal"
                  multiline
                  rows={4}
                  defaultValue={selectedTemplate?.description}
                />
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<FileUploadIcon />}
                  sx={{ mt: 2 }}
                >
                  {file ? file.name : "Importer un fichier"}
                  <input
                    type="file"
                    hidden
                    accept=".docx"
                    onChange={(e) =>
                      setFile(e.target.files ? e.target.files[0] : null)
                    }
                  />
                </Button>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
              <Button variant="contained" onClick={handleSaveTemplate}>
                Enregistrer
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>
    </Layout>
  );
};

export default Templates;
