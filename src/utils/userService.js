import axios from "axios";
import { supabase } from "../config/supabaseClient";

const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

export const getUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
};

export const getUserById = async (id) => {
  // `id` is expected to be a UUID string (Supabase Auth user id)
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createUser = async (user) => {
  // If password present, sign up user in Supabase Auth first to get an id
  let userId = user.id;
  try {
    if (user.password) {
      const { data: signData, error: signError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password
      });
      if (signError) throw signError;
      userId = signData.user?.id;
    }

    const payload = { ...user, role: user.role || "user" };
    // The project uses UUIDs for user IDs (Supabase Auth). Set the
    // `id` field to the returned auth user id so the users table row id
    // matches the auth id.
    if (userId) {
      payload.id = String(userId);
    }

    // Remove password before inserting into users table
    delete payload.password;

    const { data, error } = await supabase
      .from("users")
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    throw err;
  }
};

export const updateUser = async (id, updates) => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteUser = async (id) => {
  // const { data, error } = await supabase
  //   .from("users")
  //   .delete()
  //   .eq("id", id)
  //   .select()
  //   .single();
  // if (error) throw error;
  // return data;

  try {
    console.log("coming hereere");

    const data = await axios.post(
      `${supabaseUrl}/functions/v1/smooth-function`,
      {
        user_id: id
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${supabaseKey}`
        }
      }
    );

    console.log("data", data);

    return data;
  } catch (error) {
    console.error("Error sending invitation SMS:", error);
    throw error;
  }
};
