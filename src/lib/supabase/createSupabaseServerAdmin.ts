"use server"

import { Database } from "@/types/supabase/database.types";
import { createClient } from "@supabase/supabase-js";

//* Note whenever updating the database schemas please refer to :
//* @/app/types/supabase/README.md
export default async function createSupabaseServerAdmin() {

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PRIVATE_SUPABASE_ADMIN_KEY!,
  );
}