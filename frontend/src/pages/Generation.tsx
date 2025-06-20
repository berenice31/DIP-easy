import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  TextField,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Autocomplete,
  Snackbar,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
} from "@mui/material";
import { Navigation } from "../components/layout/Navigation";
import { templateService } from "../services/templateService";
import { productService } from "../services/api";
import { generationService } from "../services/generationService";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

interface TemplateOption {
  id: string;
  name: string;
  version: string;
  thumbnail_url?: string;
}

interface ProductOption {
  id: string;
  nom_produit?: string;
  progression?: number;
  status?: string;
}

const steps = ["Modèle", "Produit", "Génération"];

const GenerationPage: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [templateId, setTemplateId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [driveId, setDriveId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loadingGenerate, setLoadingGenerate] = useState(false);
  const [loadingFinalize, setLoadingFinalize] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [generations, setGenerations] = useState<any[]>([]);

  const mergeGenerations = (list: any[]) =>
    list.map((g: any) => ({
      ...g,
      product: products.find((p) => p.id === g.product_id) ?? g.product ?? {},
      template:
        templates.find((t) => t.id === g.template_id) ?? g.template ?? {},
    }));

  useEffect(() => {
    const load = async () => {
      try {
        const tplResp = await templateService.getTemplates();
        const tplItems = (tplResp.items ?? tplResp) as any[];
        const mappedTpl: TemplateOption[] = tplItems.map((t) => ({
          id: t.id,
          name: t.name || t.nom || "Template",
          version: t.version || "1",
          thumbnail_url: t.thumbnail_url || undefined,
        }));

        const prodResp = await productService.getAllProducts();
        setTemplates(mappedTpl);
        setProducts(prodResp);
        const genResp = await generationService.list();

        // update state first then merge
        const merged = genResp.map((g: any) => ({
          ...g,
          product: prodResp.find((p: any) => p.id === g.product_id) ?? {},
          template: mappedTpl.find((t) => t.id === g.template_id) ?? {},
        }));
        setGenerations(merged);
      } catch (e) {
        console.error(e);
        setSnackbar({
          type: "error",
          message: "Erreur de chargement des données",
        });
      }
    };
    load();
  }, []);

  const handleNext = () => {
    if ((activeStep === 0 && !templateId) || (activeStep === 1 && !productId))
      return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleGenerate = async () => {
    if (!templateId || !productId) return;
    setLoadingGenerate(true);
    try {
      const gen = await generationService.generate(templateId, productId);
      setGenerationId(gen.id);
      setDriveId(gen.drive_file_id);
      setSnackbar({
        type: "success",
        message: "Document généré : cliquez pour l'ouvrir.",
      });
    } catch (e) {
      console.error(e);
      setSnackbar({ type: "error", message: "Erreur lors de la génération." });
    } finally {
      setLoadingGenerate(false);
    }
  };

  const handleFinalize = async () => {
    if (!generationId || !file) return;
    setLoadingFinalize(true);
    try {
      await generationService.finalize(generationId, file);
      setSnackbar({
        type: "success",
        message: "Document finalisé et produit validé.",
      });
      setFile(null);
    } catch (e) {
      console.error(e);
      setSnackbar({
        type: "error",
        message: "Erreur lors de la finalisation.",
      });
    } finally {
      setLoadingFinalize(false);
    }
  };

  const handleFinalizeFromTable = async (genId: string) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".docx";
    fileInput.onchange = async () => {
      if (fileInput.files?.length) {
        const f = fileInput.files[0];
        try {
          await generationService.finalize(genId, f);
          setSnackbar({ type: "success", message: "Document finalisé" });
          const genResp = await generationService.list();
          setGenerations(mergeGenerations(genResp));
        } catch {
          setSnackbar({
            type: "error",
            message: "Erreur lors de la finalisation",
          });
        }
      }
    };
    fileInput.click();
  };

  const handleDeleteGeneration = async (id: string) => {
    try {
      await generationService.delete(id);
      setSnackbar({ type: "success", message: "Génération supprimée" });
      setGenerations(generations.filter((g) => g.id !== id));
    } catch {
      setSnackbar({ type: "error", message: "Erreur suppression" });
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <>
            <TextField
              label="Rechercher un modèle"
              fullWidth
              sx={{ mb: 2 }}
              onChange={(e) => {
                const query = e.target.value.toLowerCase();
                setTemplates(
                  (prev) =>
                    prev.map((t) => ({
                      ...t,
                      hidden: !t.name.toLowerCase().includes(query),
                    })) as any
                );
              }}
            />
            <Grid container spacing={2}>
              {templates
                .filter((t: any) => !t.hidden)
                .map((t) => (
                  <Grid item xs={12} sm={6} md={4} key={t.id}>
                    <Card
                      variant={templateId === t.id ? "outlined" : undefined}
                      sx={{
                        borderColor:
                          templateId === t.id ? "primary.main" : "divider",
                      }}
                    >
                      <CardActionArea onClick={() => setTemplateId(t.id)}>
                        {t.thumbnail_url ? (
                          <CardMedia
                            component="img"
                            height="120"
                            image={t.thumbnail_url}
                          />
                        ) : (
                          <Box
                            height={120}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            bgcolor="#f5f5f5"
                          >
                            <Typography variant="subtitle1">Aperçu</Typography>
                          </Box>
                        )}
                        <CardContent>
                          <Typography variant="subtitle1" noWrap>
                            {t.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            v{t.version}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </>
        );
      case 1:
        return (
          <>
            <Autocomplete
              options={products}
              getOptionLabel={(option) => option.nom_produit || option.id}
              onChange={(_, value) => setProductId(value?.id || "")}
              renderInput={(params) => (
                <TextField {...params} label="Produit" fullWidth />
              )}
            />
            {productId && (
              <Paper sx={{ p: 2, mt: 2 }}>
                {products
                  .filter((p) => p.id === productId)
                  .map((p) => (
                    <Grid container spacing={2} key={p.id} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h6">
                          {p.nom_produit || p.id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Statut: {p.status || "-"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" gutterBottom>
                          Progression
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={p.progression || 0}
                        />
                      </Grid>
                    </Grid>
                  ))}
              </Paper>
            )}
          </>
        );
      case 2:
        return (
          <Box>
            {loadingGenerate && <LinearProgress sx={{ mb: 2 }} />}
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={loadingGenerate || !!generationId}
              sx={{ mb: 3 }}
            >
              Générer
            </Button>
            {generationId && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Téléversement du fichier final (.docx)
                </Typography>
                <input
                  type="file"
                  accept=".docx"
                  onChange={(e) => {
                    if (e.target.files?.length) setFile(e.target.files[0]);
                  }}
                />
                <Button
                  variant="contained"
                  sx={{ ml: 2 }}
                  disabled={!file || loadingFinalize}
                  onClick={handleFinalize}
                >
                  Valider
                </Button>
                {loadingFinalize && <LinearProgress sx={{ mt: 2 }} />}
              </>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Génération de document DIP
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Grid>
            <Grid item xs={12} md={9}>
              {renderStepContent()}
              <Box sx={{ mt: 2 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Précédent
                </Button>
                {activeStep < steps.length - 1 && (
                  <Button variant="contained" onClick={handleNext}>
                    Suivant
                  </Button>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
        <Snackbar
          open={!!snackbar}
          autoHideDuration={6000}
          onClose={() => setSnackbar(null)}
        >
          {snackbar && (
            <Alert
              severity={snackbar.type}
              onClose={() => setSnackbar(null)}
              sx={{ width: "100%" }}
              action={
                snackbar.type === "success" && driveId ? (
                  <Button
                    color="inherit"
                    size="small"
                    href={`https://drive.google.com/file/d/${driveId}/view`}
                    target="_blank"
                  >
                    Ouvrir
                  </Button>
                ) : undefined
              }
            >
              {snackbar.message}
            </Alert>
          )}
        </Snackbar>
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Historique des générations
        </Typography>
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Marque</TableCell>
                <TableCell>Produit</TableCell>
                <TableCell>Modèle</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {generations.map((g) => (
                <TableRow key={g.id}>
                  <TableCell>
                    {new Date(g.initiated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{g.product?.nom_client}</TableCell>
                  <TableCell>{g.product?.marque}</TableCell>
                  <TableCell>{g.product?.nom_produit}</TableCell>
                  <TableCell>{g.template?.name || g.template_id}</TableCell>
                  <TableCell>
                    {g.status === "success" ? (
                      <Chip label="VALIDÉ" color="success" size="small" />
                    ) : (
                      <Chip label="BROUILLON" color="warning" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {g.status === "success" && g.drive_file_id ? (
                      <IconButton
                        href={`https://drive.google.com/file/d/${g.drive_file_id}/view`}
                        target="_blank"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => handleFinalizeFromTable(g.id)}>
                        <CloudUploadIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleDeleteGeneration(g.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
};

export default GenerationPage;
