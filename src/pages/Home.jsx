import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  HStack,
  Spacer,
  Container,
  Text,
  Alert,
  AlertIcon,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { getUsers } from "../utils/userService";
import UserForm from "../components/UserForm";
import UserList from "../components/UserList";

export default function Home({ session, onSignOut }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (e) {
      console.error(e);
      setUsers([]);
      setError(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <Box minH="100vh" py={6}>
      <Container maxW="container.lg">
      <HStack mb={6}>
        <Heading size="lg">Users Management</Heading>
        <Spacer />
        <Text>{session ? "Signed in" : "Not signed"}</Text>
        <Button onClick={onSignOut}>Sign out</Button>
      </HStack>
      <Box mb={6}>
        <UserForm
          key={editingUser?.id || "new"}
          editing={editingUser}
          onSaved={() => {
            setEditingUser(null);
            loadUsers();
          }}
          onCancel={() => setEditingUser(null)}
        />
      </Box>

      {loading ? (
        <Center py={10}>
          <Spinner />
        </Center>
      ) : error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      ) : users.length === 0 ? (
        <Box borderWidth={1} p={6} borderRadius="md" textAlign="center">
          <Text>No users available.</Text>
          <Text fontSize="sm" color="gray.500">Use the form above to add the first user.</Text>
        </Box>
      ) : (
        <UserList
          users={users}
          onEdit={(u) => setEditingUser(u)}
          onDelete={() => loadUsers()}
          currentUserId={session?.user?.id}
          onSelfDelete={onSignOut}
        />
      )}
      </Container>
    </Box>
  );
}
