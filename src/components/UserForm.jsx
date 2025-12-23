import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  useToast,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { createUser, updateUser } from "../utils/userService";

export default function UserForm({ editing, onSaved, onCancel }) {
  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (editing) {
      setValue("name", editing.name || "");
      setValue("email", editing.email || "");
      setValue("age", editing.age || "");
      setValue("number", editing.number || "");
      setValue("role", editing.role || "user");
    } else {
      reset({ name: "", email: "", age: "", number: "", role: "user", password: "" });
      // Ensure NumberInput's internal value is cleared as well
      setValue("age", "");
    }
  }, [editing, reset, setValue]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) {
        await updateUser(editing.id, values);
        toast({ status: "success", title: "User updated" });
      } else {
        await createUser(values);
        toast({ status: "success", title: "User added" });
      }
      // Reset form fields explicitly so number inputs clear reliably
      reset({ name: "", email: "", age: "", number: "", role: "user", password: "" });
      setValue("age", "");
      onSaved && onSaved();
    } catch (e) {
      console.error(e);
      toast({ status: "error", title: "Operation failed", description: e?.message || String(e) });
    } finally {
      setSubmitting(false);
    }
  };

  const cardBg = useColorModeValue("white", "gray.600");

  return (
    <Box borderWidth={1} p={4} borderRadius="md" boxShadow="sm" bg={cardBg}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} alignItems="end">
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters" },
              })}
              placeholder="Full name"
            />
            {errors.name && <Text color="red.300" fontSize="sm">{errors.name.message}</Text>}
          </FormControl>

          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
              })}
              type="email"
              placeholder="email@example.com"
            />
            {errors.email && <Text color="red.300" fontSize="sm">{errors.email.message}</Text>}
          </FormControl>

          {!editing && (
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input {...register("password", { required: "Password is required" })} type="password" placeholder="Password" />
              {errors.password && <Text color="red.300" fontSize="sm">{errors.password.message}</Text>}
            </FormControl>
          )}

          <FormControl>
            <FormLabel>Age</FormLabel>
            <Controller
              name="age"
              control={control}
              defaultValue={""}
              rules={{
                validate: (v) => {
                  if (v === undefined || v === null || v === "") return true;
                  const n = Number(v);
                  if (Number.isNaN(n)) return "Age must be a number";
                  if (n < 0) return "Age cannot be less than 0";
                  if (n > 110) return "Age cannot be greater than 110";
                  return true;
                },
              }}
              render={({ field }) => (
                <NumberInput min={0} value={field.value ?? ""} onChange={(val) => field.onChange(val)}>
                  <NumberInputField placeholder="Age" />
                </NumberInput>
              )}
            />
            {errors.age && <Text color="red.300" fontSize="sm">{errors.age.message}</Text>}
          </FormControl>

          <FormControl>
            <FormLabel>Number</FormLabel>
            <Input
              {...register("number", {
                validate: (v) => {
                  if (v === undefined || v === null || v === "") return true;
                  const cleaned = String(v).replace(/[^0-9]/g, "");
                  if (!/^[0-9]{10}$/.test(cleaned)) return "Phone number must be 10 digits";
                  return true;
                },
              })}
              placeholder="Phone"
            />
            {errors.number && <Text color="red.300" fontSize="sm">{errors.number.message}</Text>}
          </FormControl>

          {/* Role removed: defaulted to 'user' server-side */}

          <Box gridColumn={{ base: "1 / -1", md: "2 / 3" }} textAlign={{ base: "left", md: "right" }}>
            <Button type="submit" colorScheme="green" isLoading={submitting} loadingText={editing ? "Updating" : "Adding"} mr={2}>
              {editing ? "Update" : "Add"}
            </Button>
            {editing && (
              <Button variant="ghost" onClick={() => onCancel && onCancel()}>
                Cancel
              </Button>
            )}
          </Box>
        </SimpleGrid>
      </form>
    </Box>
  );
}
