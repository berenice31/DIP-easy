import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  IconButton,
  Tooltip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { productService, Product } from "../services/api";
import { Navigation } from "../components/layout/Navigation";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState<Product[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Charger les produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await productService.getAllProducts();
        console.table(
          products.map((p: any) => ({ id: p.id, progression: p.progression }))
        );
        setRows(products);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        setError("Erreur lors du chargement des produits");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const columns: GridColDef[] = [
    { field: "nom_client", headerName: "Client", flex: 1 },
    { field: "marque", headerName: "Marque", flex: 1 },
    { field: "gamme", headerName: "Gamme", flex: 1 },
    { field: "nom_commercial", headerName: "Nom commercial", flex: 1 },
    { field: "fournisseur", headerName: "Fournisseur", flex: 1 },
    { field: "ref_formule", headerName: "Référence formule", flex: 1 },
    { field: "ref_produit", headerName: "Référence produit", flex: 1 },
    { field: "date_mise_marche", headerName: "Date mise en marché", flex: 1 },
    {
      field: "progression",
      headerName: "Progression",
      flex: 0.5,
      renderCell: (params: any) => {
        const value = params.row?.progression;
        return value !== undefined && value !== null ? `${value}%` : "-";
      },
      sortComparator: (v1: number, v2: number) => (v1 || 0) - (v2 || 0),
    },
    {
      field: "resp_mise_marche",
      headerName: "Responsable mise en marché",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title="Modifier">
            <IconButton
              size="small"
              onClick={() => handleEdit(params?.row?.id)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Supprimer">
            <IconButton
              size="small"
              onClick={() => handleDeleteClick(params?.row)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleEdit = (id: string) => {
    navigate(`/products/${id}/edit`);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      try {
        await productService.deleteProduct(selectedProduct.id);
        setRows(rows.filter((row) => row.id !== selectedProduct.id));
        setDeleteDialogOpen(false);
        setSelectedProduct(null);
        setSuccess("Produit supprimé avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        setError("Erreur lors de la suppression du produit");
      }
    }
  };

  const handleAdd = () => {
    navigate("/new-dip");
  };

  // Filtre sécurisé : ignore les valeurs null / undefined
  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      (value ?? "").toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" component="h1" gutterBottom>
                Produits
              </Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                fullWidth
              >
                Nouveau Produit
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={filteredRows}
              columns={columns}
              loading={loading}
              getRowId={(row) => row.id}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              checkboxSelection
              disableRowSelectionOnClick
              slots={{
                toolbar: GridToolbar,
              }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
            />
          </Box>
        </Paper>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir supprimer le produit "
              {selectedProduct?.nom_commercial}" ? Cette action est
              irréversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
        >
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
        >
          <Alert severity="success" onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Products;
