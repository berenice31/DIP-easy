import { Box, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Box bg="white" px={4} py={2} borderBottom="1px" borderColor="gray.200">
      <Flex justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold">
          DIP'Easy
        </Text>
        <Flex gap={4}>
          <Link to="/">Dashboard</Link>
          <Link to="/products">Produits</Link>
          <Link to="/templates">Templates</Link>
          <Link to="/settings">Paramètres</Link>
        </Flex>
        <Link to="/login">
          <Box
            as="button"
            px={4}
            py={2}
            bg="brand.500"
            color="white"
            borderRadius="md"
            _hover={{ bg: "brand.600" }}
          >
            Se connecter
          </Box>
        </Link>
      </Flex>
    </Box>
  );
};

export default Navbar;
