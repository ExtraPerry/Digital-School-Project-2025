"use server";

import createSupabaseServerAdmin from "@/lib/supabase/createSupabaseServerAdmin";
import { Database } from "@/types/supabase/database.types";
import {
  SignupFormData,
  SignupFormSchema,
} from "@/types/supabase/zod-schema/signup-form-schema";

type User = Database["public"]["Tables"]["users"]["Row"];
type UserId = Pick<User, "id" | "email">;
type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
type UserRoleInsert = Database["public"]["Tables"]["users_role"]["Insert"];

export default async function signup(
  data: SignupFormData
): Promise<{ data?: UserId; error?: string }> {
  const result = SignupFormSchema.safeParse(data);
  if (!result.success) {
    return {
      error: `Les informations envoyé au server ne sont pas conformes [${result.error.message}]`,
    };
  }

  const supabaseAdmin = await createSupabaseServerAdmin();

  const { count: emailCheckCount } = await supabaseAdmin
    .from("users")
    .select("email")
    .eq("email", result.data.email)
    .maybeSingle();

  if (emailCheckCount != null && emailCheckCount > 0) {
    return {
      error: "L'email est déjà utilisé."
    }
  }

  const { data: authUser, error: authError } = await supabaseAdmin.auth.signUp({
    email: result.data.email,
    password: result.data.password,
  });

  if (authError || authUser.user === null || authUser.user.id === null) {
    return {
      error:
        "Il y a eu une erreur pendant la création du compte, ressayé dans quelques minutes ou contacter le service informatique.",
    };
  }

  const userDataInsert: UserInsert = {
    auth_user: authUser.user.id,
    first_name: result.data.firstName,
    last_name: result.data.lastName,
    email: result.data.email,
    phone: result.data.phone,
    address: result.data.address,
  };
  const { data: userData, error: userError } = await supabaseAdmin
    .from("users")
    .insert(userDataInsert)
    .select("id,email")
    .single();

  if (!userData || userError) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    return {
      error:
        "Le compte n'a pas pu être créer, car l'information complémentaire n'a pas pu être enregistrer.",
    };
  }
  
  const userId = userData.id;

  if (!userId) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    return {
      error:
        "Le compte n'a pas pu être créer, car le serveur n'a pas pu récupérer l'id du compte créé par le base de donnée.",
    };
  }

  const userRoleInsert: UserRoleInsert = {
    user: userId,
    auth_user: authUser.user.id,
    role: "BROKER",
  };

  const { error: roleError } = await supabaseAdmin
    .from("users_role")
    .insert(userRoleInsert);

  if (roleError) {
    await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
    return {
      error:
        "Le compte n'a pas pu être créer, car le role utilisateur n'a pas pu être enregistrer.",
    };
  }

  return { data: userData };
}
