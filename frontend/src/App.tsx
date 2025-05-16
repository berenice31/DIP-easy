import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { MenusPage } from "./pages/Menus";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/menus" element={<MenusPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
