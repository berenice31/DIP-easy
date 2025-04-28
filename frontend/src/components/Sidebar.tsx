import {
  Box,
  Flex,
  Text,
  VStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiHome,
  FiPackage,
  FiClipboard,
  FiFileText,
  FiZap,
  FiSettings,
  FiActivity,
  FiUsers,
  FiHelpCircle,
} from "react-icons/fi";

interface MenuItem {
  label: string;
  icon: any;
  path: string;
}

const menuItems: MenuItem[] = [
  { label: "Tableau de bord", icon: FiHome, path: "/dashboard" },
  { label: "Produits", icon: FiPackage, path: "/products" },
  { label: "Collecte", icon: FiClipboard, path: "/collection" },
  { label: "Templates", icon: FiFileText, path: "/templates" },
  { label: "Génération", icon: FiZap, path: "/generation" },
  { label: "Automatisation", icon: FiSettings, path: "/automation" },
  { label: "Logs", icon: FiActivity, path: "/logs" },
  { label: "Administration", icon: FiUsers, path: "/admin" },
  { label: "Aide", icon: FiHelpCircle, path: "/help" },
];

interface SidebarProps {
  activePath: string;
  onNavigate: (path: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePath, onNavigate }) => {
  const activeBg = "#4490E2";
  const activeColor = "#FFFFFF";
  const inactiveColor = "#F5F7FA";

  return (
    <Box
      w="250px"
      h="100vh"
      bg="#2A3E50"
      position="fixed"
      left={0}
      top={0}
      overflowY="auto"
    >
      <Flex
        h="56px"
        align="center"
        justify="center"
        borderBottom="1px solid"
        borderColor="whiteAlpha.200"
      >
        <Text color="white" fontSize="xl" fontWeight="bold">
          DIP-easy
        </Text>
      </Flex>

      <VStack spacing={1} align="stretch" p={4}>
        {menuItems.map((item) => {
          const isActive = activePath === item.path;
          return (
            <Flex
              key={item.path}
              align="center"
              p={3}
              borderRadius="md"
              cursor="pointer"
              bg={isActive ? activeBg : "transparent"}
              color={isActive ? activeColor : inactiveColor}
              _hover={{
                bg: isActive ? activeBg : "whiteAlpha.100",
              }}
              onClick={() => onNavigate(item.path)}
            >
              <Icon as={item.icon} mr={3} fontSize="16px" />
              <Text fontSize="16px">{item.label}</Text>
            </Flex>
          );
        })}
      </VStack>
    </Box>
  );
};
