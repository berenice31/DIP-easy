import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route, Navigate } from "react-router-dom";
import theme from "./theme";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Layout from "./components/Layout";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
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
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* TODO: Ajouter d'autres routes */}
        </Routes>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
