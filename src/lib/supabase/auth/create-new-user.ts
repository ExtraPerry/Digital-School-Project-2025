"use server";

import createSupabaseServerAdmin from "@/lib/supabase/createSupabaseServerAdmin";
import createSupabaseServerClient from "@/lib/supabase/createSupabaseServerClient";
import { Database } from "@/types/supabase/database.types";

type UserRow = Database["public"]["Tables"]["users"]["Row"];
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];

export type CreateNewUserProps = Pick<
  UserInsert,
  "username" | "first_name" | "last_name" | "email" | "phone" | "address"
> & {
  email: string;
  password: string;
};

export async function createNewUser({
  username,
  first_name,
  last_name,
  email,
  phone,
  address,
  password,
}: CreateNewUserProps) {
  const supabase = await createSupabaseServerClient();
  const supabaseAdmin = await createSupabaseServerAdmin();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.signUp({ email: email, password: password });

  if (!user || userError) {
    return {
      data: undefined,
      error:
        "Error failed to create Auth user account, please try again later.",
    };
  }

  const userInsert: UserInsert = {
    auth_user_id: user.id,
    username: username,
    first_name: first_name,
    last_name: last_name,
    email: email,
    phone: phone,
    address: address,
  };

  const { data: userRow, error: userRowError } = await supabase
    .from("users")
    .insert([userInsert])
    .select()
    .limit(1);

  if (!userRow || userRowError) {
    supabaseAdmin.auth.admin.deleteUser(user.id);
  }
}
