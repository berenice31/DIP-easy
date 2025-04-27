import {
  Box,
  VStack,
  Icon,
  Text,
  HStack,
  Image,
  useTheme,
} from "@chakra-ui/react";
import {
  FiHome,
  FiFileText,
  FiSettings,
  FiUsers,
  FiClock,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const theme = useTheme();

  const menuItems = [
    { icon: FiHome, label: "Dashboard", path: "/dashboard" },
    { icon: FiFileText, label: "Produits", path: "/products" },
    { icon: FiClock, label: "Tâches", path: "/tasks" },
    { icon: FiUsers, label: "Utilisateurs", path: "/users" },
    { icon: FiSettings, label: "Paramètres", path: "/settings" },
  ];

  return (
    <Box
      w="250px"
      h="100vh"
      bg={theme.colors.custom.sidebar}
      position="fixed"
      left={0}
      top={0}
      p={4}
    >
      <VStack spacing={4} align="stretch">
        <Box mb={8} display="flex" flexDirection="column" alignItems="center">
          <Image
            src="/logo-drop.svg"
            alt="Logo DIP'Easy"
            w="60px"
            h="60px"
            mb={2}
          />
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="white"
            textAlign="center"
          >
            DIP'Easy
          </Text>
        </Box>

        {menuItems.map((item) => (
          <HStack
            key={item.path}
            p={3}
            borderRadius="md"
            cursor="pointer"
            bg={
              location.pathname === item.path
                ? theme.colors.custom.active
                : "transparent"
            }
            color="white"
            _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
            onClick={() => navigate(item.path)}
          >
            <Icon as={item.icon} boxSize={5} />
            <Text>{item.label}</Text>
          </HStack>
        ))}

        <Box mt="auto">
          <HStack
            p={3}
            borderRadius="md"
            cursor="pointer"
            color="white"
            _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
            onClick={logout}
          >
            <Icon as={FiLogOut} boxSize={5} />
            <Text>Déconnexion</Text>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sidebar;
