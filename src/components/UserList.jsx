import React from "react";
import { Table, Thead, Tbody, Tr, Th, Td, Button, Box } from "@chakra-ui/react";
import { deleteUser } from "../utils/userService";

export default function UserList({ users = [], onEdit, onDelete, currentUserId, onSelfDelete }) {
  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      onDelete && onDelete();
      // If the deleted user is the currently signed-in user, trigger sign-out
      if (id === currentUserId) {
        onSelfDelete && onSelfDelete();
      }
    } catch (e) {
      console.error(e);
    }
  };
  if (!users || users.length === 0) {
    return (
      <Box borderWidth={1} p={6} borderRadius="md" textAlign="center">
        No users to display.
      </Box>
    );
  }

  return (
    <Box borderWidth={1} borderRadius="md" overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Age</Th>
            <Th>Number</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((u) => (
            <Tr key={u.id}>
              <Td>{u.name}</Td>
              <Td>{u.email}</Td>
              <Td>{u.age}</Td>
              <Td>{u.number}</Td>
              <Td>
                <Button size="sm" mr={2} onClick={() => onEdit(u)}>
                  Edit
                </Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDelete(u.id)}>
                  Delete
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
