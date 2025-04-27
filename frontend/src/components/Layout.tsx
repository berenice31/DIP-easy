import { Box, useTheme } from "@chakra-ui/react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const theme = useTheme();

  return (
    <Box display="flex" minH="100vh" bg={theme.colors.custom.background}>
      <Sidebar />
      <Box
        flex="1"
        ml="250px"
        p={8}
        minH="100vh"
        bg={theme.colors.custom.background}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
