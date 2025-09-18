"use client"

import createSupabaseBrowserClient from "@/lib/supabase/createSupabaseBrowserClient";
import { Database } from "@/types/supabase/database.types";

type UserRoleRow = Database["public"]["Tables"]["users_role"]["Row"];

export default async function fetchAuthenticatedUserRole(): Promise<UserRoleRow> {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user: authUser },
    error: authUserError
  } = await supabase.auth.getUser();

  const authUserId = authUser?.id;

  if (!authUserId || authUserError) {
    throw new Error(`Failed to fetch auth user and as such cannot fetch user role data. [${authUserError?.message}]`);
  }

  const { data: userRoles, error: userRoleError } = await supabase
    .from("users_role")
    .select("*")
    .eq("auth_user_id", authUserId)
    .limit(1);
    
  if (userRoleError) {
    throw new Error(`Failed to fetch user role: ${userRoleError.message}. Auth User ID: ${authUserId}`);
  }
  
  if (!userRoles || userRoles.length === 0) {
    throw new Error(`No user role found with auth_user_id: ${authUserId}. The user may not have a role assigned.`);
  }
  
  const userRole = userRoles[0];

  return userRole;
}