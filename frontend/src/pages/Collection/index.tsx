import {
  Box,
  Heading,
  Flex,
  Button,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Progress,
  Card,
  CardBody,
  Text,
  Icon,
  VStack,
  HStack,
  CircularProgress,
  CircularProgressLabel,
  List,
  ListItem,
  ListIcon,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Stack,
  InputGroup,
  InputLeftElement,
  useToast,
} from "@chakra-ui/react";
import {
  FiUpload,
  FiCheck,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
import { useState } from "react";
import axios from "axios";

interface ProductInfo {
  nom_commercial: string;
  ref_formule: string;
  ref_produit: string;
  date_mise_marche: string;
  resp_mise_marche: string;
  faconnerie: string;
}

const Collection = () => {
  const toast = useToast();
  const [productInfo, setProductInfo] = useState<ProductInfo>({
    nom_commercial: "",
    ref_formule: "",
    ref_produit: "",
    date_mise_marche: "",
    resp_mise_marche: "",
    faconnerie: "",
  });

  const tabs = [
    "Informations produit",
    "Formule",
    "Physico-chimie",
    "Microbiologie",
    "Annexes",
  ];

  const checklistItems = [
    { label: "Fiche technique", completed: true },
    { label: "Composition", completed: false },
    { label: "Données physico-chimiques", completed: false },
    { label: "Tests microbiologiques", completed: false },
    { label: "Certifications", completed: false },
  ];

  const completionPercentage = Math.round(
    (checklistItems.filter((item) => item.completed).length /
      checklistItems.length) *
      100
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = async () => {
    try {
      // Validation des champs requis
      if (!productInfo.nom_commercial || !productInfo.ref_produit) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir les champs obligatoires",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Envoi des données à l'API
      const response = await axios.post(
        "/api/collection/product-info",
        productInfo
      );

      toast({
        title: "Succès",
        description: "Les informations ont été sauvegardées",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // TODO: Navigation vers l'onglet suivant
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  return (
    <Box maxW="1200px" mx="auto" p={6}>
      {/* Header */}
      <Box mb={8}>
        <Heading as="h1" size="xl" mb={2}>
          Collecte de données
        </Heading>
        <Divider />
      </Box>

      {/* Wizard Tabs */}
      <Tabs variant="unstyled" mb={8}>
        <TabList justifyContent="space-between">
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              flex={1}
              py={4}
              color={index === 0 ? "white" : "gray.500"}
              bg={
                index === 0 ? "blue.500" : index < 0 ? "green.500" : "gray.100"
              }
              _selected={{ color: "white", bg: "blue.500" }}
              _hover={{ bg: "blue.400" }}
            >
              {tab}
            </Tab>
          ))}
        </TabList>
        <Progress value={20} size="xs" colorScheme="blue" />
      </Tabs>

      {/* Main Content */}
      <Flex gap={6} mb={8}>
        {/* Form Zone */}
        <Card flex="3" variant="outline">
          <CardBody>
            <Tabs>
              <TabPanels>
                <TabPanel>
                  <Stack spacing={6}>
                    {/* Formulaire Informations Produit */}
                    <Stack spacing={4}>
                      <FormControl isRequired>
                        <FormLabel>Nom commercial</FormLabel>
                        <Input
                          name="nom_commercial"
                          value={productInfo.nom_commercial}
                          onChange={handleInputChange}
                          placeholder="Entrez le nom commercial du produit"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Référence formule</FormLabel>
                        <Input
                          name="ref_formule"
                          value={productInfo.ref_formule}
                          onChange={handleInputChange}
                          placeholder="Entrez la référence de la formule"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Référence produit</FormLabel>
                        <Input
                          name="ref_produit"
                          value={productInfo.ref_produit}
                          onChange={handleInputChange}
                          placeholder="Entrez la référence du produit"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Date de mise sur le marché</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={FiCalendar} color="gray.300" />
                          </InputLeftElement>
                          <Input
                            type="date"
                            name="date_mise_marche"
                            value={productInfo.date_mise_marche}
                            onChange={handleInputChange}
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <FormLabel>
                          Responsable de la mise sur le marché
                        </FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={FiUser} color="gray.300" />
                          </InputLeftElement>
                          <Input
                            name="resp_mise_marche"
                            value={productInfo.resp_mise_marche}
                            onChange={handleInputChange}
                            placeholder="Entrez le nom du responsable"
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Façonnier</FormLabel>
                        <Input
                          name="faconnerie"
                          value={productInfo.faconnerie}
                          onChange={handleInputChange}
                          placeholder="Entrez le nom du façonnier"
                        />
                      </FormControl>
                    </Stack>

                    {/* Mini Uploader */}
                    <Box
                      mt={8}
                      p={4}
                      border="2px dashed"
                      borderColor="gray.200"
                      borderRadius="md"
                      textAlign="center"
                    >
                      <VStack spacing={2}>
                        <Icon as={FiUpload} w={6} h={6} color="gray.400" />
                        <Text fontSize="sm" color="gray.600">
                          Glisser-déposer ou cliquer pour ajouter des fichiers
                        </Text>
                        <Button
                          size="sm"
                          leftIcon={<FiPlus />}
                          colorScheme="blue"
                          variant="outline"
                        >
                          Ajouter un fichier
                        </Button>
                      </VStack>
                    </Box>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>

        {/* Checklist Sidebar */}
        <Card flex="1" variant="outline">
          <CardBody>
            <VStack spacing={6} align="stretch">
              <Heading size="md">Checklist de complétude</Heading>
              <Box textAlign="center">
                <CircularProgress
                  value={completionPercentage}
                  color="blue.500"
                  size="120px"
                >
                  <CircularProgressLabel>
                    {completionPercentage}%
                  </CircularProgressLabel>
                </CircularProgress>
              </Box>
              <List spacing={3}>
                {checklistItems.map((item, index) => (
                  <ListItem key={index}>
                    <HStack>
                      <ListIcon
                        as={item.completed ? FiCheck : FiX}
                        color={item.completed ? "green.500" : "red.500"}
                      />
                      <Text
                        color={item.completed ? "gray.500" : "gray.800"}
                        textDecoration={
                          item.completed ? "line-through" : "none"
                        }
                      >
                        {item.label}
                      </Text>
                    </HStack>
                  </ListItem>
                ))}
              </List>
            </VStack>
          </CardBody>
        </Card>
      </Flex>

      {/* Navigation Footer */}
      <Flex justify="space-between" mt={8}>
        <Button leftIcon={<FiChevronLeft />} variant="outline">
          Précédent
        </Button>
        <Button
          rightIcon={<FiChevronRight />}
          colorScheme="blue"
          onClick={handleNext}
        >
          Suivant
        </Button>
      </Flex>
    </Box>
  );
};

export default Collection;
