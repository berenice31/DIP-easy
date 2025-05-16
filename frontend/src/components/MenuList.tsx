import React, { useEffect } from "react";
import { useMenus } from "../hooks/useMenus";
import { Menu } from "../types/menu";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  GridProps,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

interface MenuListProps {
  onMenuSelect: (menu: Menu) => void;
  onAddMenu: () => void;
}

export const MenuList: React.FC<MenuListProps> = ({
  onMenuSelect,
  onAddMenu,
}) => {
  const { menus, loading, error, fetchMenus } = useMenus();

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h5" component="h2">
          Mes Menus
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onAddMenu}
        >
          Nouveau Menu
        </Button>
      </Box>

      <Grid container spacing={3}>
        {menus.map((menu) => (
          <Grid
            key={menu.id}
            item
            xs={12}
            sm={6}
            md={4}
            sx={{ display: "flex" }}
          >
            <Card
              sx={{
                cursor: "pointer",
                width: "100%",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
              onClick={() => onMenuSelect(menu)}
            >
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom>
                  {menu.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {menu.items.length} éléments
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Dernière modification:{" "}
                  {new Date(menu.updated_at).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {menus.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography color="textSecondary">
            Aucun menu trouvé. Créez votre premier menu !
          </Typography>
        </Box>
      )}
    </Box>
  );
};
