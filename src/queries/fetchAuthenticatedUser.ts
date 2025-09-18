"use client"

import createSupabaseBrowserClient from "@/lib/supabase/createSupabaseBrowserClient";
import { Database } from "@/types/supabase/database.types";

type UserRow = Database["public"]["Tables"]["users"]["Row"];

export default async function fetchAuthenticatedUser(): Promise<UserRow> {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user: authUser },
    error: authUserError
  } = await supabase.auth.getUser();

  const authUserId = authUser?.id;

  if (!authUserId || authUserError) {
    throw new Error(`Failed to fetch auth user and as such cannot fetch user data. [${authUserError?.message}]`);
  }

  const { data: users, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user_id", authUserId)
    .limit(1);
    
  if (userError) {
    throw new Error(`Failed to fetch user: ${userError.message}. Auth User ID: ${authUserId}`);
  }
  
  if (!users || users.length === 0) {
    throw new Error(`No user found with auth_user_id: ${authUserId}. The user may not have completed registration.`);
  }
  
  const user = users[0];

  return user;
}