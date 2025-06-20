import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  TextField,
  MenuItem,
  LinearProgress,
} from "@mui/material";
import { templateService } from "../services/templateService";
import { productService } from "../services/productService";
import { generationService } from "../services/generationService";

interface TemplateOption {
  id: string;
  name: string;
  version: string;
}

interface ProductOption {
  id: string;
  nom_produit?: string;
}

const GeneratePage: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateOption[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [templateId, setTemplateId] = useState<string>("");
  const [productId, setProductId] = useState<string>("");
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const tplResp = await templateService.getTemplates();
        setTemplates(tplResp.items ?? tplResp); // adapt to response shape
        const prodResp = await productService.getAllProducts();
        setProducts(prodResp);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const handleGenerate = async () => {
    if (!templateId || !productId) return;
    setLoading(true);
    try {
      const gen = await generationService.generate(templateId, productId);
      setGenerationId(gen.id);
      alert("Document généré. Téléchargez-le depuis Google Drive.");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la génération");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    if (!generationId || !file) return;
    setLoading(true);
    try {
      await generationService.finalize(generationId, file);
      alert("Document finalisé et produit marqué comme VALIDATED");
      setFile(null);
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la finalisation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Génération de document DIP
        </Typography>
        {loading && <LinearProgress />}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Modèle"
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              helperText="Sélectionnez un modèle Word"
            >
              {templates.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name} v{t.version}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Produit"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              helperText="Choisissez le produit à injecter"
            >
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.nom_produit || p.id}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          sx={{ mt: 3 }}
          disabled={!templateId || !productId}
          onClick={handleGenerate}
        >
          Générer
        </Button>

        {generationId && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Téléversement du fichier final</Typography>
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
              disabled={!file}
              onClick={handleFinalize}
            >
              Valider
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default GeneratePage;
