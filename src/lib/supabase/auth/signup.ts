"use server";

import createSupabaseServerAdmin from "@/lib/supabase/createSupabaseServerAdmin";
import { Database } from "@/types/supabase/database.types";

// type UserRow = Database["public"]["Tables"]["users"]["Row"];
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];

export type SignupProps = Pick<
  UserInsert,
  "username" | "first_name" | "last_name" | "phone" | "address"
> & {
  email: string;
  password: string;
};

export type SignupResult =
  | {
      data: true;
      error: undefined;
    }
  | {
      data: undefined;
      error: string;
    };

export async function signup({
  username,
  first_name,
  last_name,
  email,
  phone,
  address,
  password,
}: SignupProps): Promise<SignupResult> {
  const supabaseAdmin = await createSupabaseServerAdmin();

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: false,
  });

  if (!user || userError) {
    return {
      data: undefined,
      error: `Error failed to create Auth user account, please try again later. [${userError?.message}]`,
    };
  }

  if (!(username || first_name || last_name || phone || address)) {
    await supabaseAdmin.auth.admin.inviteUserByEmail(email);

    return {
      data: true,
      error: undefined,
    };
  }

  const userInsert: UserInsert = {
    auth_user_id: user.id,
    email: email,
    username: username,
    first_name: first_name,
    last_name: last_name,
    phone: phone,
    address: address,
  };

  const { error: userRowError } = await supabaseAdmin
    .from("users")
    .insert(userInsert);

  if (userRowError) {
    await supabaseAdmin.from("users").delete().eq("auth_user_id", user.id);
    await supabaseAdmin.from("users_role").delete().eq("auth_user_id", user.id);
    await supabaseAdmin.auth.admin.deleteUser(user.id);

    return {
      data: undefined,
      error: `Error failed to add user info as such could not create Auth user account, please try again later. [${userRowError.message}]`,
    };
  }

  await supabaseAdmin.auth.admin.inviteUserByEmail(email);

  return {
    data: true,
    error: undefined,
  };
}
