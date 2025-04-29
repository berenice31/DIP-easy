import { Box, useColorModeValue } from "@chakra-ui/react";
import { Sidebar } from "./Sidebar";
import { useNavigate, useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const bg = useColorModeValue("gray.50", "gray.900");

  return (
    <Box minH="100vh" bg={bg}>
      <Sidebar
        activePath={location.pathname}
        onNavigate={(path) => navigate(path)}
      />
      <Box ml="250px" p={8}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
