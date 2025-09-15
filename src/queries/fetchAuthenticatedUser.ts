"use client"

import createSupabaseBrowserClient from "@/lib/supabase/createSupabaseBrowserClient";

export default async function fetchAuthenticatedUser() {
  const supabase = createSupabaseBrowserClient();

  const {
    data: { user: authUser },
    error: authUserError
  } = await supabase.auth.getUser();

  const authUserId = authUser?.id;

  if (!authUserId || authUserError) {
    throw new Error(`Failed to fetch auth user and as such cannot fetch user data. [${authUserError?.message}]`);
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("auth_user", authUserId)
    .limit(1);
    
  if (!user || userError) {
    throw new Error(`Failed to fetch user as such no user was returned. [${userError.message}]`);
  }

  return user[0];
}