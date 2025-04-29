import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import theme from "./theme";

// Import des pages
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Collection from "./pages/Collection/index";
import Templates from "./pages/Templates";
import Generation from "./pages/Generation";
import Automation from "./pages/Automation";
import Logs from "./pages/Logs";
import Admin from "./pages/Admin";
import Help from "./pages/Help";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./contexts/AuthContext";

const ProtectedLayout = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="collection" element={<Collection />} />
          <Route path="templates" element={<Templates />} />
          <Route path="generation" element={<Generation />} />
          <Route path="automation" element={<Automation />} />
          <Route path="logs" element={<Logs />} />
          <Route path="admin" element={<Admin />} />
          <Route path="help" element={<Help />} />
        </Route>
      </Routes>
    </ChakraProvider>
  );
}

export default App;
