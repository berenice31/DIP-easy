import { Navigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Flex,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import {
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();
  const primaryColor = "blue.600";

  // Données en dur pour le tableau des derniers produits
  const derniersProduits = [
    {
      nom: "Produit Alpha",
      reference: "PRD-001",
      statut: "En cours",
      date: "2024-02-25",
    },
    {
      nom: "Produit Beta",
      reference: "PRD-002",
      statut: "Validé",
      date: "2024-02-24",
    },
    {
      nom: "Produit Gamma",
      reference: "PRD-003",
      statut: "En attente",
      date: "2024-02-23",
    },
    {
      nom: "Produit Delta",
      reference: "PRD-004",
      statut: "En cours",
      date: "2024-02-22",
    },
    {
      nom: "Produit Epsilon",
      reference: "PRD-005",
      statut: "Validé",
      date: "2024-02-21",
    },
  ];

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Box p={6}>
        <Heading size="lg" mb={6} color="gray.700">
          Tableau de bord
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card>
            <CardHeader>
              <Flex align="center">
                <Icon as={FiFileText} w={6} h={6} color="brand.500" mr={2} />
                <Text color="gray.600" fontWeight="medium">
                  DIPs en cours
                </Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <Stat>
                <StatNumber fontSize="3xl" color="gray.800">
                  12
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  23%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Flex align="center">
                <Icon as={FiCheckCircle} w={6} h={6} color="green.500" mr={2} />
                <Text color="gray.600" fontWeight="medium">
                  DIPs validés
                </Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <Stat>
                <StatNumber fontSize="3xl" color="gray.800">
                  45
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="increase" />
                  12%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Flex align="center">
                <Icon as={FiAlertCircle} w={6} h={6} color="red.500" mr={2} />
                <Text color="gray.600" fontWeight="medium">
                  DIPs en attente
                </Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <Stat>
                <StatNumber fontSize="3xl" color="gray.800">
                  8
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  5%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Flex align="center">
                <Icon as={FiClock} w={6} h={6} color="orange.500" mr={2} />
                <Text color="gray.600" fontWeight="medium">
                  Temps moyen
                </Text>
              </Flex>
            </CardHeader>
            <CardBody>
              <Stat>
                <StatNumber fontSize="3xl" color="gray.800">
                  3.5j
                </StatNumber>
                <StatHelpText>
                  <StatArrow type="decrease" />
                  15%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Derniers produits et activité récente */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6} mt={6}>
          <GridItem>
            <Box>
              <Heading size="md" color={primaryColor} mb={4}>
                Derniers produits
              </Heading>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Nom du produit</Th>
                    <Th>Référence</Th>
                    <Th>Statut</Th>
                    <Th>Date</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {derniersProduits.map((produit, index) => (
                    <Tr key={index}>
                      <Td>{produit.nom}</Td>
                      <Td>{produit.reference}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            produit.statut === "Validé"
                              ? "green"
                              : produit.statut === "En cours"
                              ? "blue"
                              : "yellow"
                          }
                        >
                          {produit.statut}
                        </Badge>
                      </Td>
                      <Td>{produit.date}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </GridItem>

          <GridItem>
            <Card>
              <CardHeader>
                <Heading size="md" color={primaryColor}>
                  Activité récente
                </Heading>
              </CardHeader>
              <CardBody>
                <Text>Journal d'activité à venir...</Text>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard;
