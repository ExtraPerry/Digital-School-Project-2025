"use server";

import createSupabaseServerClient from "@/lib/supabase/createSupabaseServerClient";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function logout() {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signOut();

  const locale = await getLocale();

  if (error) {
    redirect(`/${locale}/error`);
  }

  revalidatePath(`/${locale}`, "layout");
  redirect(`/${locale}`);
}
