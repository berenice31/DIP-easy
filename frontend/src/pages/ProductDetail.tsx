import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { productService, Product } from "../services/api";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const data = await productService.getProduct(id);
          setProduct(data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (!product) return <Typography>Aucun produit trouvé</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
        Retour
      </Button>
      <Typography variant="h4" gutterBottom>
        {product.nom_commercial}
      </Typography>
      <Typography>Fournisseur : {product.fournisseur}</Typography>
      {/* ... autres champs ... */}
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        startIcon={<EditIcon />}
        onClick={() => navigate(`/products/${product.id}/edit`)}
      >
        Éditer
      </Button>
    </Paper>
  );
};

export default ProductDetail;
