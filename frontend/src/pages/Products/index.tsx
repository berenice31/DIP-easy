import {
  Box,
  Heading,
  Flex,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { useState } from "react";

const Products = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Données de test
  const products = [
    {
      id: 1,
      nom: "Produit Alpha",
      dateCreation: "2024-02-25",
      statut: "En cours",
      nbVariantes: 3,
    },
    {
      id: 2,
      nom: "Produit Beta",
      dateCreation: "2024-02-20",
      statut: "Validé",
      nbVariantes: 2,
    },
    {
      id: 3,
      nom: "Produit Gamma",
      dateCreation: "2024-02-15",
      statut: "En attente",
      nbVariantes: 1,
    },
  ];

  const handleView = (product: any) => {
    setSelectedProduct(product);
    onOpen();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En cours":
        return "blue";
      case "Validé":
        return "green";
      case "En attente":
        return "yellow";
      default:
        return "gray";
    }
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Produits</Heading>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={() => console.log("Nouveau produit")}
        >
          Nouveau produit
        </Button>
      </Flex>

      <Flex gap={4} mb={6}>
        <InputGroup maxW="300px">
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input placeholder="Rechercher un produit..." />
        </InputGroup>
        <Select placeholder="Filtrer par statut" maxW="200px">
          <option value="en_cours">En cours</option>
          <option value="valide">Validé</option>
          <option value="en_attente">En attente</option>
        </Select>
      </Flex>

      <Box bg="white" borderRadius="lg" boxShadow="sm" p={4}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nom</Th>
              <Th>Date de création</Th>
              <Th>Statut</Th>
              <Th>Nombre de variantes</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td>{product.nom}</Td>
                <Td>{product.dateCreation}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(product.statut)}>
                    {product.statut}
                  </Badge>
                </Td>
                <Td>{product.nbVariantes}</Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Voir"
                      icon={<FiEye />}
                      size="sm"
                      onClick={() => handleView(product)}
                    />
                    <IconButton
                      aria-label="Modifier"
                      icon={<FiEdit2 />}
                      size="sm"
                      colorScheme="blue"
                    />
                    <IconButton
                      aria-label="Supprimer"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Détails du produit</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedProduct && (
              <Stack spacing={4}>
                <Box>
                  <Text fontWeight="bold">Nom</Text>
                  <Text>{selectedProduct.nom}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Date de création</Text>
                  <Text>{selectedProduct.dateCreation}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Statut</Text>
                  <Badge colorScheme={getStatusColor(selectedProduct.statut)}>
                    {selectedProduct.statut}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold">Nombre de variantes</Text>
                  <Text>{selectedProduct.nbVariantes}</Text>
                </Box>
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Fermer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Products;
