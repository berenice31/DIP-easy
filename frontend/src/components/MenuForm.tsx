import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { MenuCreate, MenuItemCreate } from "../types/menu";

interface MenuFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (menu: MenuCreate) => void;
  initialData?: MenuCreate;
}

export const MenuForm: React.FC<MenuFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [items, setItems] = useState<MenuItemCreate[]>(
    initialData?.items || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      items,
    });
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        name: "",
        price: 0,
        category: "",
        description: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof MenuItemCreate,
    value: any
  ) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setItems(newItems);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {initialData ? "Modifier le menu" : "Nouveau menu"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Nom du menu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              margin="normal"
            />
          </Box>

          <Typography variant="h6" gutterBottom>
            Éléments du menu
          </Typography>

          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 2,
                mb: 2,
                alignItems: "flex-start",
              }}
            >
              <TextField
                label="Nom"
                value={item.name}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Prix"
                type="number"
                value={item.price}
                onChange={(e) =>
                  updateItem(index, "price", parseFloat(e.target.value))
                }
                required
                fullWidth
              />
              <TextField
                label="Catégorie"
                value={item.category}
                onChange={(e) => updateItem(index, "category", e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Description"
                value={item.description}
                onChange={(e) =>
                  updateItem(index, "description", e.target.value)
                }
                fullWidth
                multiline
                rows={2}
              />
              <IconButton
                color="error"
                onClick={() => removeItem(index)}
                sx={{ mt: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={addItem}
            variant="outlined"
            sx={{ mt: 2 }}
          >
            Ajouter un élément
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            {initialData ? "Modifier" : "Créer"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
