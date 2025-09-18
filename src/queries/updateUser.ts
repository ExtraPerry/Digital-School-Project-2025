"use server";

import createSupabaseServerAdmin from "@/lib/supabase/createSupabaseServerAdmin";
import { Database } from "@/types/supabase/database.types";

type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

export type UpdateUserProps = {
  userId: string;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  address?: string | null;
};

export type UpdateUserResult = {
  success: boolean;
  error?: string;
};

export default async function updateUser(
  updateData: UpdateUserProps
): Promise<UpdateUserResult> {
  const supabase = await createSupabaseServerAdmin();

  const { userId, ...userData } = updateData;

  if (!userId) {
    return {
      success: false,
      error: 'User ID is required',
    };
  }

  const userUpdate: UserUpdate = {
    username: userData.username,
    first_name: userData.first_name,
    last_name: userData.last_name,
    phone: userData.phone,
    address: userData.address,
  };

  const { error: userError } = await supabase
    .from("users")
    .update(userUpdate)
    .eq("id", userId);

  if (userError) {
    return {
      success: false,
      error: `Failed to update user data: ${userError.message}`,
    };
  }

  return {
    success: true,
  };
}
