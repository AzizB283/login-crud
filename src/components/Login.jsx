import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { signIn } from "../utils/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = React.useState(null);

  const onSubmit = async (values) => {
    setErrorMessage(null);
    try {
      await signIn(values.email, values.password);
      navigate("/");
    } catch (err) {
      setErrorMessage(err.message || "Login failed");
    }
  };

    const cardBg = useColorModeValue("white", "gray.600");
  

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box maxW="md" w="full" p={6} borderWidth={1} borderRadius="md" boxShadow="md" bg={cardBg}>
        <VStack spacing={4} align="stretch">
        <Heading size="md">Admin Login</Heading>
        {errorMessage && (
          <Alert status="error">
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={3} isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              placeholder="admin@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <Text color="red.500">{errors.email.message}</Text>}
          </FormControl>

          <FormControl mb={3} isInvalid={!!errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter password"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <Text color="red.500">{errors.password.message}</Text>
            )}
          </FormControl>

          <Button mt={4} colorScheme="blue" type="submit" isLoading={isSubmitting} w="full">
            Sign in
          </Button>
        </form>
      </VStack>
      </Box>
    </Box>
  );
}
