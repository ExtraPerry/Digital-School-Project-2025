"use client"

import createSupabaseBrowserClient from "@/lib/supabase/createSupabaseBrowserClient";
import fetchAuthenticatedUserRole from "@/queries/fetchAuthenticatedUserRole";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAuthenticatedUserRole() {
  const queryResult = useQuery({ queryKey: ["users_role", "id -> authenticated"], queryFn: fetchAuthenticatedUserRole});

  const supabase = createSupabaseBrowserClient();
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ["users_role", "id => authenticated"] });
    });

    return () => {
      authListener?.subscription.unsubscribe();
    }
  }, [supabase, queryClient]);

  return queryResult;
}