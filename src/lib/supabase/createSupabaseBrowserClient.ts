import { createBrowserClient } from '@supabase/ssr'
import { Database } from "@/types/supabase/database.types";

//* Note whenever updating the database schemas please refer to :
//* @/app/types/supabase/README.md
export default function createSupabaseBrowserClient() {

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false
      }
    }
  );
}

// Alternative: Create a client with session persistence enabled (if you want to keep it for other operations)
export function createSupabaseBrowserClientWithPersistence() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}