import React, { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import { MenuList } from "../components/MenuList";
import { MenuForm } from "../components/MenuForm";
import { useMenus } from "../hooks/useMenus";
import { Menu, MenuCreate } from "../types/menu";

export const MenusPage: React.FC = () => {
  const { createMenu, updateMenu, deleteMenu } = useMenus();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const handleCreateMenu = async (menu: MenuCreate) => {
    try {
      await createMenu(menu);
      setIsFormOpen(false);
    } catch (error) {
      console.error("Erreur lors de la création du menu:", error);
    }
  };

  const handleUpdateMenu = async (menu: MenuCreate) => {
    if (!selectedMenu) return;
    try {
      await updateMenu(selectedMenu.id, menu);
      setIsFormOpen(false);
      setSelectedMenu(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du menu:", error);
    }
  };

  const handleDeleteMenu = async (menu: Menu) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce menu ?")) {
      try {
        await deleteMenu(menu.id);
      } catch (error) {
        console.error("Erreur lors de la suppression du menu:", error);
      }
    }
  };

  const handleMenuSelect = (menu: Menu) => {
    setSelectedMenu(menu);
    setIsFormOpen(true);
  };

  const handleAddMenu = () => {
    setSelectedMenu(null);
    setIsFormOpen(true);
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gestion des Menus
        </Typography>

        <MenuList onMenuSelect={handleMenuSelect} onAddMenu={handleAddMenu} />

        <MenuForm
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedMenu(null);
          }}
          onSubmit={selectedMenu ? handleUpdateMenu : handleCreateMenu}
          initialData={
            selectedMenu
              ? {
                  name: selectedMenu.name,
                  items: selectedMenu.items.map((item) => ({
                    name: item.name,
                    price: item.price,
                    category: item.category,
                    description: item.description || "",
                  })),
                }
              : undefined
          }
        />
      </Box>
    </Container>
  );
};
