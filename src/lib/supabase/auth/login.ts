"use server";

import { LoginFormData } from "@/types/supabase/zod-schema/login-form-schema";
import createSupabaseServerClient from "@/lib/supabase/createSupabaseServerClient";

export default async function login(data: LoginFormData): Promise<{error: string | undefined}> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError ,
  } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (!user || userError) {
    return { error: userError?.message };
  }

  return { error: undefined };
}