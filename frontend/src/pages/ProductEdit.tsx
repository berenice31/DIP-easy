import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, CircularProgress, Box } from "@mui/material";
import { productService, Product } from "../services/api";
import NewDip from "./NewDip";

const ProductEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await productService.getProductById(id);
        const raw: any = data;
        const initial: any = { ...raw };
        if (raw.date_mise_marche)
          initial.date_mise_marche = new Date(raw.date_mise_marche);
        if (raw.date_validation)
          initial.date_validation = new Date(raw.date_validation);
        setProduct(initial);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du produit");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Typography color="error">{error || "Produit introuvable"}</Typography>
    );
  }

  return <NewDip initialData={product as any} productId={id} />;
};

export default ProductEdit;
