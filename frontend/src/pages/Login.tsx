import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Link,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { Link as RouterLink } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const { login, verify2FA, is2FARequired } = useAuth();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Identifiants incorrects",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handle2FAVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verify2FA(twoFactorCode);
    } catch (error) {
      toast({
        title: "Erreur de vérification",
        description: "Code 2FA incorrect",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <Box
        p={8}
        maxWidth="500px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={4} align="stretch">
          <Heading textAlign="center">Connexion</Heading>

          {!is2FARequired ? (
            <form onSubmit={handleLogin}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Mot de passe</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>
                <Button type="submit" colorScheme="blue" width="full">
                  Se connecter
                </Button>
                <Text textAlign="center">
                  Pas encore de compte ?{" "}
                  <Link as={RouterLink} to="/register" color="blue.500">
                    S'inscrire
                  </Link>
                </Text>
              </VStack>
            </form>
          ) : (
            <form onSubmit={handle2FAVerification}>
              <VStack spacing={4}>
                <Text>Veuillez entrer votre code 2FA</Text>
                <FormControl isRequired>
                  <FormLabel>Code 2FA</FormLabel>
                  <Input
                    type="text"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                  />
                </FormControl>
                <Button type="submit" colorScheme="blue" width="full">
                  Vérifier
                </Button>
              </VStack>
            </form>
          )}
        </VStack>
      </Box>
    </Box>
  );
};

export default Login;
