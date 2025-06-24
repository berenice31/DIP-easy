import React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  AddCircle as NewDipIcon,
  Description as TemplatesIcon,
  AutoFixHigh as GenerationIcon,
  SmartToy as AutomationIcon,
  History as LogsIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/logo-dipeasy.jpg";

const drawerWidth = 240;

export const Navigation: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  const menuItems = [
    {
      text: "Tableau de bord",
      icon: <DashboardIcon />,
      path: "/dashboard",
      requiresAuth: true,
    },
    {
      text: "Produits",
      icon: <ProductsIcon />,
      path: "/products",
      requiresAuth: true,
    },
    {
      text: "Nouveau DIP",
      icon: <NewDipIcon />,
      path: "/new-dip",
      requiresAuth: true,
    },
    {
      text: "Templates",
      icon: <TemplatesIcon />,
      path: "/templates",
      requiresAuth: true,
    },
    {
      text: "Génération",
      icon: <GenerationIcon />,
      path: "/generation",
      requiresAuth: true,
    },
    {
      text: "Tous les DIP",
      icon: <LogsIcon />,
      path: "/dips",
      requiresAuth: true,
    },
    {
      text: "Automatisation",
      icon: <AutomationIcon />,
      path: "/automation",
      requiresAuth: true,
    },
    {
      text: "Logs",
      icon: <LogsIcon />,
      path: "/logs",
      requiresAuth: true,
    },
    {
      text: "Administration",
      icon: <AdminIcon />,
      path: "/admin",
      requiresAuth: true,
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#0d47a1",
          color: "white",
        },
      }}
    >
      <Box sx={{ p: 0, display: "flex", justifyContent: "center" }}>
        <img
          src={logo}
          alt="DIP-easy Logo"
          style={{ width: "100%", height: "auto" }}
        />
      </Box>
      <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }} />
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
          <CircularProgress sx={{ color: "white" }} />
        </Box>
      ) : (
        <>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#1976d2",
                      "&:hover": {
                        backgroundColor: "#1976d2",
                      },
                    },
                    "&:hover": {
                      backgroundColor: "#1565c0",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "white" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.12)" }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white" }}>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Déconnexion" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Drawer>
  );
};
