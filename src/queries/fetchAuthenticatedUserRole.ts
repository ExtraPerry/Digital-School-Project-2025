"use client"

import createSupabaseBrowserClient from "@/lib/supabase/createSupabaseBrowserClient";

export default async function fetchAuthenticatedUserRole() {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user: authUser },
    error: authUserError
  } = await supabase.auth.getUser();

  const authUserId = authUser?.id;

  if (!authUserId || authUserError) {
    throw new Error(`Failed to fetch auth user and as such cannot fetch user role data. [${authUserError?.message}]`);
  }

  const { data: userRole, error: userRoleError } = await supabase
    .from("users_role")
    .select("*")
    .eq("auth_user", authUserId)
    .limit(1);
    
  if (!userRole || userRoleError) {
    throw new Error(`Failed to fetch user role as such no user role was returned. [${userRoleError.message}]`);
  }

  return userRole[0];
}