"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import createSupabaseBrowserClient from "@/lib/supabase/createSupabaseBrowserClient";
import { Database, Tables, TablesInsert } from "@/types/supabase/database.types";

type UserRow = Database["public"]["Tables"]["users"]["Row"];
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];

type CreateUserProfileData = {
  authUserId: string;
  email: string;
  username?: string;
};

type CreateUserProfileResponse = {
  data?: UserRow;
  error?: string;
};

async function createUserProfile(data: CreateUserProfileData): Promise<CreateUserProfileResponse> {
  const supabase = createSupabaseBrowserClient();

  // Check if username is already taken (if provided)
  if (data.username) {
    const { data: existingUser } = await supabase
      .from("users")
      .select("username")
      .eq("username", data.username)
      .single();

    if (existingUser) {
      return {
        error: "Username is already taken"
      };
    }
  }

  // Create user profile
  const userInsert: UserInsert = {
    auth_user_id: data.authUserId,
    email: data.email,
    username: data.username || null,

  };

  const { data: user, error } = await supabase
    .from("users")
    .insert(userInsert)
    .select()
    .single();

  if (error) {
    return {
      error: error.message
    };
  }

  return { data: user };
}

export function useCreateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUserProfile,
    onSuccess: () => {
      // Invalidate user queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["users", "id -> authenticated"] });
    },
  });
}
