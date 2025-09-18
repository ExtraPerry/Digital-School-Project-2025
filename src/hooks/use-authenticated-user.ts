"use client"

import createSupabaseBrowserClient from "@/lib/supabase/createSupabaseBrowserClient";
import fetchAuthenticatedUser from "@/queries/fetchAuthenticatedUser";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function useAuthenticatedUser() {
  const queryResult = useQuery({ queryKey: ["users", "id -> authenticated"], queryFn: fetchAuthenticatedUser});

  const supabase = createSupabaseBrowserClient();
  const queryClient = useQueryClient();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: ["users", "id -> authenticated"] });
    });

    return () => {
      authListener?.subscription.unsubscribe();
    }
  }, [supabase, queryClient]);

  return queryResult;
}